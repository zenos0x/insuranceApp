$(document).ready(function () {
  // --- Initial Setup ---
  $('#years').val(1); // Default year

  // --- Dynamic Plan Rendering ---
  function renderPlans() {
    const plansRow = $('#plans-row');
    plansRow.empty(); // Clear any existing content

    PLAN_HIERARCHY.forEach(planName => {
      const coverageAmount = PLAN_COVERAGES[planName];
      const premiumAmount = PLAN_PREMIUMS[planName];
      const color = PLAN_COLORS[planName];

      const planCardHtml = `
        <div class="col-md-6">
          <div class="mb-2 p-2 border rounded bg-white text-dark text-start d-flex justify-content-between align-items-center">
            <h4 class="fw-bold px-2 py-1 border rounded-pill" style="background-color: ${color}; display: inline-block;">${planName}</h4>
            <div class="mt-2 text-center">
              <small class="text-muted">IDV</small>
              <h4 class="fw-bold">₹${coverageAmount.toLocaleString()}</h4>
            </div>
            <button class="btn plan-select-btn" style="background-color: #003366; color: white;" data-premium="${premiumAmount}">₹${premiumAmount.toLocaleString()}</button>
          </div>
        </div>
      `;
      plansRow.append(planCardHtml);
    });
  }

  // --- Event Handlers ---

  // Show plans when the first form is submitted
  $('#premiumForm').on('submit', function (e) {
    e.preventDefault();
    $('#plansSection').slideDown('slow');
  });

  // Handle plan selection using event delegation
  $('#plans-row').on('click', '.plan-select-btn', function () {
    const planName = $(this).closest('.col-md-6').find('h4').first().text();
    const premiumAmount = $(this).data('premium');
    const coverageAmount = PLAN_COVERAGES[planName];
    const years = parseInt($('#years').val());

    const totalAmount = premiumAmount * years;
    const gst = Math.round(totalAmount * 0.18);
    const totalPayable = totalAmount + gst;

    // Fill modal with info
    $('#vehicleNameDisplay').text($('#model').val());
    $('#vehicleNoDisplay').text($('#vehicleNo').val());
    $('#yearDisplay').text($('#year').val());
    $('#selectedPlanDisplay').text(planName);
    $('#planYearsDisplay').text(`${years} Year(s)`);
    $('#planAmountDisplay').text(`IDV: ₹${coverageAmount.toLocaleString()}`);
    $('#premiumAmountDisplay').text(totalAmount.toLocaleString());
    $('#gstDisplay').text(gst.toLocaleString());
    $('#totalPayableDisplay').text(totalPayable.toLocaleString());

    $('#ownerModal').data('planName', planName);
    $('#ownerModal').modal('show');
  });

  // Handle modal display effects
  $('#ownerModal').on('show.bs.modal', () => $('.container').css('filter', 'blur(4px)'));
  $('#ownerModal').on('hidden.bs.modal', () => $('.container').css('filter', 'none'));

  // Handle final policy creation
  $('#paymentmethod').on('submit', async function (e) {
    e.preventDefault();
    const submitBtn = $('#payButton');
    const originalText = submitBtn.html();
    showLoading('payButton');

    try {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (!currentUser || !currentUser.customerId) {
        showError("Please log in to create a policy.");
        return;
      }

      const readFileAsBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });

      const rcFile = $('#rcUpload')[0].files[0];
      let registrationCertificateBase64 = rcFile ? await readFileAsBase64(rcFile) : null;
      const coverageType = $('#ownerModal').data('planName');

      const policyData = {
        customerId: currentUser.customerId,
        name: $('#ownerNameModal').val(),
        aadharNumber: $('#aadhar').val(),
        mobileNumber: $('#mobile').val(),
        email: $('#email').val(),
        coverageType: coverageType,
        registrationCertificate: registrationCertificateBase64,
        vehicleType: $('#vehicleType').val(),
        vehicleNumber: $('#vehicleNo').val(),
        premiumAmount: PLAN_PREMIUMS[coverageType],
        coverageAmount: PLAN_COVERAGES[coverageType],
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + parseInt($('#years').val()))).toISOString().split('T')[0]
      };

      const response = await ApiClient.post(API_CONFIG.ENDPOINTS.POLICIES, policyData);

      if (response.success) {
        showSuccess("Policy created successfully!");
        $('#ownerModal').modal('hide');
        $('#plansSection').hide();
        $('#premiumForm')[0].reset();
      } else {
        showError(response.message || "Failed to create policy.");
      }
    } catch (error) {
      console.error("Policy creation error:", error);
      showError("Policy creation failed: " + error.message);
    } finally {
      hideLoading('payButton', originalText);
    }
  });

  // --- Initial Render ---
  renderPlans();
});