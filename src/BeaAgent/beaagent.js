const cities = ["Hyderabad", "Mumbai", "Delhi", "Chennai", "Bangalore"];

// Populate city dropdown
$(document).ready(function () {
  $('#be_a_agent_city').append(`<option value="" disabled selected>Select a city</option>`);
  cities.forEach(function (city) {
    $("#be_a_agent_city").append(`<option value="${city}">${city}</option>`);
  });

  // Handle form submission
  $("#BecomeAnAgentForm").on("submit", async function (e) {
    e.preventDefault();

    const submitBtn = $("#agentSubmitBtn");
    const originalText = submitBtn.html();

    try {
      showLoading("agentSubmitBtn");

      // Validate email format
      const email = $("#be_a_agent_email").val();
      const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
      if (!emailPattern.test(email)) {
        showError("Please enter a valid email address.");
        return;
      }

      // Collect form data
      const formData = {
        name: $("#be_a_agent_name").val(),
        dateOfBirth: $("#be_a_agent_dob").val(),
        city: $("#be_a_agent_city").val(),
        mobile: $("#be_a_agent_mobile").val(),
        email: email,
      };

      // 1. Save data to the backend
      const response = await ApiClient.post(API_CONFIG.ENDPOINTS.AGENT_APPLY, formData);
      
      if (response.success) {
        showSuccess("Application saved! Now opening your email client.");
        
        // 2. Also open mailto link
        const recipient = "nivashnandha2002@gmail.com";
        const subject = `New Agent Application from ${formData.name}`;
        const body = `A new agent application has been submitted with the following details:\n\nName: ${formData.name}\nDate of Birth: ${formData.dateOfBirth}\nCity: ${formData.city}\nMobile: ${formData.mobile}\nEmail: ${formData.email}`;
        const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;

        // Reset the form
        this.reset();
        
      } else {
        showError(response.message || "Application submission failed");
      }
      
    } catch (error) {
      console.error("Agent application error:", error);
      showError("Application failed: " + error.message);
    } finally {
      hideLoading("agentSubmitBtn", originalText);
    }
  });
});
