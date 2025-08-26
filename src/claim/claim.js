$(document).ready(function () {
  let userPolicies = []; // To cache the user’s policies

  // --- Data Loading ---
  async function loadPageData() {
    await loadUserPolicies();
    await loadUserClaims();
  }

  async function loadUserPolicies() {
    const policySelect = $("#claim_policyId");
    try {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (!currentUser || !currentUser.customerId) {
        policySelect.html('<option>Please log in first</option>');
        return;
      }
      const policies = await ApiClient.get(API_CONFIG.ENDPOINTS.POLICIES_BY_CUSTOMER, { customerId: currentUser.customerId });
      userPolicies = policies;
      populatePolicyDropdown(policies);
    } catch (error) {
      console.error("Error loading policies:", error);
      showError("Could not load your policies.");
    }
  }

  async function loadUserClaims() {
    const claimTableBody = $("#claimTable tbody");
    try {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (!currentUser || !currentUser.customerId) {
        claimTableBody.html('<tr><td colspan="5" class="text-center">Please log in to view claims.</td></tr>');
        return;
      }
      claimTableBody.html('<tr><td colspan="5" class="text-center">Loading claims...</td></tr>');
      const claims = await ApiClient.get(API_CONFIG.ENDPOINTS.CLAIMS_BY_CUSTOMER, { customerId: currentUser.customerId });
      displayClaims(claims);
    } catch (error) {
      console.error("Error loading claims:", error);
      claimTableBody.html('<tr><td colspan="5" class="text-center text-danger">Could not load claims.</td></tr>');
    }
  }

  function populatePolicyDropdown(policies) {
    const policySelect = $("#claim_policyId");
    policySelect.html('<option value="">Select Policy</option>');
    if (policies && policies.length > 0) {
      policies.forEach(policy => {
        const option = $(`<option value="${policy.policyId}">${policy.policyId} (${policy.vehicleNumber})</option>`);
        option.data('policy', policy);
        policySelect.append(option);
      });
    } else {
      policySelect.html('<option>No policies found</option>');
    }
  }

  function displayClaims(claims) {
    const claimTableBody = $("#claimTable tbody");
    claimTableBody.empty();
    if (claims && claims.length > 0) {
      claims.forEach(claim => {
        const claimRow = `
          <tr>
            <td>${claim.claimId}</td>
            <td>${claim.policy.policyId}</td>
            <td>₹${claim.claimAmount}</td>
            <td>${new Date(claim.claimDate).toLocaleDateString()}</td>
            <td><span class="badge bg-warning text-dark">${claim.status}</span></td>
          </tr>
        `;
        claimTableBody.append(claimRow);
      });
    } else {
      claimTableBody.html('<tr><td colspan="5" class="text-center">No claims found.</td></tr>');
    }
  }

  // --- Event Handlers ---

  $("#claim_policyId").on("change", function () {
    const selectedOption = $(this).find('option:selected');
    const policy = selectedOption.data('policy');
    if (policy) {
      $("#claimAmount").val(policy.coverageAmount || "");
    }
  });

  $("#claim_browseBtn").click(() => $("#proofFile").click());
  $("#proofFile").change(function () {
    const fileName = $(this).val().split("\\").pop();
    $("#proofFile_name").val(fileName || "No file chosen");
  });

  $("#claimForm").on("submit", async function (e) {
    e.preventDefault();
    try {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (!currentUser || !currentUser.customerId) {
        showError("You must be logged in to file a claim.");
        return;
      }
      const policyId = $("#claim_policyId").val();
      if (!policyId) {
        showError("Please select a policy.");
        return;
      }

      // --- Helper function to read file as Base64 ---
      const readFileAsBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
        });
      };

      const proofFile = $('#proofFile')[0].files[0];
      let proofDocumentBase64 = null;
      if (proofFile) {
        proofDocumentBase64 = await readFileAsBase64(proofFile);
      }

      const claimData = {
        policyId: policyId,
        customerId: currentUser.customerId,
        claimAmount: $("#claimAmount").val(),
        reason: $("#reason").val(),
        proofDocument: proofDocumentBase64,
      };

      showSuccess("Submitting claim...");
      const response = await ApiClient.post(API_CONFIG.ENDPOINTS.CLAIMS, claimData);

      if (response.success) {
        showSuccess("Claim submitted successfully!");
        this.reset();
        $("#proofFile_name").val("No file chosen");
        loadUserClaims(); // Refresh the claim status table
      } else {
        showError(response.message || "Failed to submit claim.");
      }
    } catch (error) {
      console.error("Claim submission error:", error);
      showError("Claim submission failed: " + error.message);
    }
  });

  // --- Initial Load ---
  $('.nav-link[data-tab="claim"]').on('click', () => loadPageData());
  if ($('.nav-link[data-tab="claim"]').hasClass('active')) {
    loadPageData();
  }
});