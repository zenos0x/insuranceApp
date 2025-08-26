$(document).ready(function () {
  $("#loginForm").on("submit", async function (e) {
    e.preventDefault(); // Prevent form submission
    
    const submitBtn = $("#loginSubmitBtn");
    const originalText = submitBtn.html();
    
    try {
      showLoading("loginSubmitBtn");
      
      const formArray = $(this).serializeArray();
      const loginData = {
        email: formArray.find(field => field.name === 'email').value,
        password: formArray.find(field => field.name === 'password').value
      };

      console.log("Attempting login with:", loginData.email);

      // Call backend login API
      const response = await ApiClient.post(API_CONFIG.ENDPOINTS.LOGIN, loginData);
      
      if (response.success) {
        // Store user data and login state
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("userMode", JSON.stringify(response.user.role));
        localStorage.setItem("isLoggedIn", JSON.stringify(true));

        // If the user is an agent, store their agentId
        if (response.agentId) {
          localStorage.setItem("agentId", response.agentId);
        }
        
        // Update global variables
        isLoggedIn = true;
        user_mode = response.user.role;
        
        showSuccess("Login successful! Redirecting...");
        
        // Reset the form
        this.reset();
        
        // Close the modal
        const modalElement = $("#customModal")[0];
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();
        
        // Reload page after short delay
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        
      } else {
        showError(response.message || "Login failed");
      }
      
    } catch (error) {
      console.error("Login error:", error);
      showError("Login failed: " + error.message);
    } finally {
      hideLoading("loginSubmitBtn", originalText);
    }
  });
});
