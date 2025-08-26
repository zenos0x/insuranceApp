$(document).ready(function() {
  let userPolicies = []; // Cache for user policies

  // --- Data Loading and Display ---

  async function loadUserPolicies() {
    const policyTableBody = $("#policy-table-body");
    try {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (!currentUser || !currentUser.customerId) {
        policyTableBody.html('<tr><td colspan="3" class="text-center">Please log in to view your policies.</td></tr>');
        return;
      }
      policyTableBody.html('<tr><td colspan="3" class="text-center">Loading policies...</td></tr>');
      const policies = await ApiClient.get(API_CONFIG.ENDPOINTS.POLICIES_BY_CUSTOMER, { customerId: currentUser.customerId });
      userPolicies = policies;
      displayPolicies(userPolicies);
      populatePolicyDropdown(userPolicies);
    } catch (error) {
      console.error("Error loading policies:", error);
      policyTableBody.html('<tr><td colspan="3" class="text-center text-danger">Could not load policies.</td></tr>');
    }
  }

  function displayPolicies(policies) {
    const policyTableBody = $("#policy-table-body");
    policyTableBody.empty();
    if (policies && policies.length > 0) {
      policies.forEach(policy => {
        const policyRow = `
          <tr>
            <td><a href="#" class="view-policy-details-btn text-info text-decoration-none" data-id="${policy.id}">${policy.policyId || 'N/A'}</a></td>
            <td>${policy.vehicleNumber || 'N/A'}</td>
            <td>${policy.coverageType || 'N/A'}</td>
          </tr>
        `;
        policyTableBody.append(policyRow);
      });
    } else {
      policyTableBody.html('<tr><td colspan="3" class="text-center">No policies found.</td></tr>');
    }
  }

  function populatePolicyDropdown(policies) {
    const policySelect = $("#policyNumberSelect");
    policySelect.html('<option value="" selected disabled>Choose a policy...</option>');
    if (policies && policies.length > 0) {
      policies.forEach(policy => {
        const option = $(`<option value="${policy.id}">${policy.policyId} (${policy.vehicleNumber})</option>`);
        option.data('policy', policy);
        policySelect.append(option);
      });
    }
  }

  // --- Event Handlers ---

  $('#policy-table-body').on('click', '.view-policy-details-btn', function(e) {
    e.preventDefault();
    const policyId = $(this).data('id');
    const policy = userPolicies.find(p => p.id == policyId);

    if (policy) {
      const modalBody = $('#modalContent');
      const modalTitle = $('#customModalLabel');

      modalTitle.text(`Details for Policy #${policy.policyId}`);
      modalBody.html(`
        <table class="table table-bordered">
          <tbody>
            <tr><th>Owner Name</th><td>${policy.name}</td></tr>
            <tr><th>Email</th><td>${policy.email}</td></tr>
            <tr><th>Mobile</th><td>${policy.mobileNumber}</td></tr>
            <tr><th>Aadhar</th><td>${policy.aadharNumber}</td></tr>
            <tr><th>Vehicle Number</th><td>${policy.vehicleNumber}</td></tr>
            <tr><th>Vehicle Type</th><td>${policy.vehicleType}</td></tr>
            <tr><th>Coverage Type</th><td>${policy.coverageType}</td></tr>
            <tr><th>Premium</th><td>₹${policy.premiumAmount}</td></tr>
            <tr><th>Coverage Amount</th><td>₹${policy.coverageAmount}</td></tr>
            <tr><th>Start Date</th><td>${new Date(policy.startDate).toLocaleDateString()}</td></tr>
            <tr><th>End Date</th><td>${new Date(policy.endDate).toLocaleDateString()}</td></tr>
            <tr><th>Status</th><td><span class="badge bg-success">${policy.status}</span></td></tr>
          </tbody>
        </table>
        `);

      $('#customModal').modal('show');
    }
  });

  $('#policyNumberSelect').on('change', function() {
    const selectedOption = $(this).find('option:selected');
    const policy = selectedOption.data('policy');
    const preferredSelect = $('#preferredPolicy');
    
    $('#premiumDifference').hide();
    preferredSelect.html('<option value="" selected disabled>Select new plan...</option>');

    if (policy) {
      $('#currentPolicy').val(policy.coverageType || '');
      const currentPlanIndex = PLAN_HIERARCHY.indexOf(policy.coverageType);
      if (currentPlanIndex > -1) {
        const higherPlans = PLAN_HIERARCHY.slice(currentPlanIndex + 1);
        higherPlans.forEach(planName => {
          preferredSelect.append($(`<option value="${planName}">${planName}</option>`));
        });
      }
    }
  });

  $('#preferredPolicy').on('change', function() {
    const newPlanName = $(this).val();
    const policyId = $('#policyNumberSelect').val();
    const policy = userPolicies.find(p => p.id == policyId);

    if (newPlanName && policy) {
      const newPremium = PLAN_PREMIUMS[newPlanName];
      const oldPremium = policy.premiumAmount;
      const difference = newPremium - oldPremium;

      if (difference > 0) {
        $('#premiumDifference').html(`<strong>Additional Amount to Pay:</strong> ₹${difference.toFixed(2)}`).show();
      } else {
        $('#premiumDifference').hide();
      }
    }
  });

  $('#updatePolicySection form').on('submit', async function(e) {
    e.preventDefault();
    const policyId = $('#policyNumberSelect').val();
    const newCoverageType = $('#preferredPolicy').val();

    if (!policyId || !newCoverageType) {
      showError("Please select a policy and a new plan.");
      return;
    }

    const policyToUpdate = userPolicies.find(p => p.id == policyId);
    if (!policyToUpdate) {
      showError("Could not find policy details.");
      return;
    }

    policyToUpdate.coverageType = newCoverageType;
    policyToUpdate.premiumAmount = PLAN_PREMIUMS[newCoverageType];
    policyToUpdate.coverageAmount = PLAN_COVERAGES[newCoverageType];

    try {
      showSuccess("Updating policy...");
      const response = await ApiClient.put(API_CONFIG.ENDPOINTS.UPDATE_POLICY, policyToUpdate, { id: policyId });
      if (response) {
        showSuccess("Policy updated successfully!");
        loadUserPolicies();
        $('#updatePolicySection form')[0].reset();
        $('#premiumDifference').hide();
      } else {
        showError("Failed to update policy.");
      }
    } catch (error) {
      console.error("Policy update error:", error);
      showError("Policy update failed: " + error.message);
    }
  });

  // Initial Load
  $('.nav-link[data-tab="policy"]').on('click', () => loadUserPolicies());
  if ($('.nav-link[data-tab="policy"]').hasClass('active')) {
    loadUserPolicies();
  }
});

function scrollToSection(sectionId) {
  document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}