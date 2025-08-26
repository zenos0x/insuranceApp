
$(document).ready(function () {
    let expiredPolicies = [];

    // --- Data Loading ---
    async function loadPageData() {
        await loadExpiredPolicies();
        await loadUserRenewals();
    }

    async function loadExpiredPolicies() {
        const policySelect = $("#renewal_policyId");
        try {
            const policies = await ApiClient.get(API_CONFIG.ENDPOINTS.EXPIRED_POLICIES);
            expiredPolicies = policies;
            populatePolicyDropdown(policies);
        } catch (error) {
            console.error("Error loading expired policies:", error);
            showError("Could not load your expired policies.");
        }
    }

    async function loadUserRenewals() {
        const renewalTableBody = $("#renewalTable tbody");
        try {
            const currentUser = JSON.parse(localStorage.getItem("user"));
            if (!currentUser || !currentUser.customerId) {
                renewalTableBody.html('<tr><td colspan="6" class="text-center">Please log in to view renewals.</td></tr>');
                return;
            }
            renewalTableBody.html('<tr><td colspan="6" class="text-center">Loading renewals...</td></tr>');
            const renewals = await ApiClient.get(API_CONFIG.ENDPOINTS.RENEWALS_BY_CUSTOMER, { customerId: currentUser.customerId });
            displayRenewals(renewals);
        } catch (error) {
            console.error("Error loading renewals:", error);
            renewalTableBody.html('<tr><td colspan="6" class="text-center text-danger">Could not load renewals.</td></tr>');
        }
    }

    // --- UI Population ---
    function populatePolicyDropdown(policies) {
        const policySelect = $("#renewal_policyId");
        policySelect.html('<option value="">Select Policy</option>');
        if (policies && policies.length > 0) {
            policies.forEach(policy => {
                const option = $(`<option value="${policy.policyId}">${policy.policyId} (${policy.vehicleNumber})</option>`);
                option.data('policy', policy);
                policySelect.append(option);
            });
        } else {
            policySelect.html('<option>No expired policies found</option>');
        }
    }

    function populatePackageDropdown() {
        const packageSelect = $("#package");
        packageSelect.html('<option value="">Select Package</option>');
        PLAN_HIERARCHY.forEach(plan => {
            const premium = PLAN_PREMIUMS[plan];
            const option = $(`<option value="${premium}" data-coverage-type="${plan}">${plan} – ₹${premium}/year</option>`);
            packageSelect.append(option);
        });
    }

    function displayRenewals(renewals) {
        const renewalTableBody = $("#renewalTable tbody");
        renewalTableBody.empty();
        if (renewals && renewals.length > 0) {
            renewals.forEach((renewal, index) => {
                const renewalRow = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${renewal.renewalId}</td>
                        <td>${renewal.policy.policyId}</td>
                        <td>${new Date(renewal.renewalDate).toLocaleDateString()}</td>
                        <td>₹${renewal.newPremium}</td>
                        <td>${renewal.expiryYear}</td>
                    </tr>
                `;
                renewalTableBody.append(renewalRow);
            });
        } else {
            renewalTableBody.html('<tr><td colspan="6" class="text-center">No renewals found.</td></tr>');
        }
    }

    // --- Event Handlers ---
    $("#renewal_policyId").on("change", function () {
        const selectedOption = $(this).find('option:selected');
        const policy = selectedOption.data('policy');
        if (policy) {
            $("#expiryDate").val(policy.endDate);
        } else {
            $("#expiryDate").val("");
        }
    });

    $("#extendPeriod, #package").on("input change", function () {
        const years = parseInt($("#extendPeriod").val());
        const packageRate = parseFloat($("#package").val());

        if (years > 0 && packageRate > 0) {
            const planAmount = years * packageRate;
            const gstAmount = planAmount * 0.18;
            const totalPremium = planAmount + gstAmount;

            $("#planAmount").text(planAmount.toFixed(2));
            $("#gstAmount").text(gstAmount.toFixed(2));
            $("#totalPremium").text(totalPremium.toFixed(2));
            $("#paymentDetails").removeClass("d-none");
        } else {
            $("#paymentDetails").addClass("d-none");
        }
    });

    $("#renewForm").on("submit", async function (e) {
        e.preventDefault();
        try {
            const policyId = $("#renewal_policyId").val();
            if (!policyId) {
                showError("Please select a policy.");
                return;
            }

            const selectedPackage = $("#package").find('option:selected');
            const coverageType = selectedPackage.data("coverage-type");
            const coverageAmount = PLAN_COVERAGES[coverageType];

            const renewalData = {
                policyId: policyId,
                extendPeriod: parseInt($("#extendPeriod").val()),
                totalPremium: parseFloat($("#totalPremium").text()),
                expiryYear: new Date($("#expiryDate").val()).getFullYear() + parseInt($("#extendPeriod").val()),
                coverageType: coverageType,
                coverageAmount: coverageAmount
            };

            showSuccess("Processing renewal...");
            const response = await ApiClient.post(API_CONFIG.ENDPOINTS.RENEWALS, renewalData);

            if (response.success) {
                showSuccess("Renewal successful!");
                this.reset();
                $("#expiryDate").val("");
                $("#paymentDetails").addClass("d-none");
                loadPageData(); // Refresh both policies and renewals
            } else {
                showError(response.message || "Failed to process renewal.");
            }
        } catch (error) {
            console.error("Renewal submission error:", error);
            showError("Renewal submission failed: " + error.message);
        }
    });

    // --- Initial Load ---
    populatePackageDropdown();
    $('.nav-link[data-tab="renewal"]').on('click', () => loadPageData());
    if ($('.nav-link[data-tab="renewal"]').hasClass('active')) {
        loadPageData();
    }
});
