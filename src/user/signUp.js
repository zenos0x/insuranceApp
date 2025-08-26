function checkValidity(i, status){
  if (status) {
    $(i).removeClass("is-invalid").addClass("is-valid");
    $("#passwordStrengthFeedback").hide();
    $("#passwordStrengthIcon").show();
  } else {
    $(i).removeClass("is-valid").addClass("is-invalid");
    $("#passwordStrengthFeedback").show();
    $("#passwordStrengthIcon").hide();
  }
}

function checkPasswordRequirements(password) {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  // Update individual requirement indicators
  $("#length-req").toggleClass("text-success", requirements.length).toggleClass("text-danger", !requirements.length);
  $("#uppercase-req").toggleClass("text-success", requirements.uppercase).toggleClass("text-danger", !requirements.uppercase);
  $("#number-req").toggleClass("text-success", requirements.number).toggleClass("text-danger", !requirements.number);
  $("#special-req").toggleClass("text-success", requirements.special).toggleClass("text-danger", !requirements.special);

  // Add check icons for met requirements
  $("#length-req").find("i").remove();
  $("#uppercase-req").find("i").remove();
  $("#number-req").find("i").remove();
  $("#special-req").find("i").remove();

  if (requirements.length) $("#length-req").prepend('<i class="fa fa-check me-1"></i>');
  if (requirements.uppercase) $("#uppercase-req").prepend('<i class="fa fa-check me-1"></i>');
  if (requirements.number) $("#number-req").prepend('<i class="fa fa-check me-1"></i>');
  if (requirements.special) $("#special-req").prepend('<i class="fa fa-check me-1"></i>');

  return requirements.length && requirements.uppercase && requirements.number && requirements.special;
}

$(document).ready(function () {


  $("#password").on("input", function () {
    const password = $(this).val();
    const isStrong = checkPasswordRequirements(password);
    checkValidity(this, isStrong);
  });

  // Real-time password match validation
  $("#confirmPassword").on("input", function () {
    const password = $("#password").val();
    const confirmPassword = $(this).val();
    const passwordsMatch = confirmPassword === password && confirmPassword !== "";

    if (passwordsMatch) {
      $(this).removeClass("is-invalid").addClass("is-valid");
      $("#passwordMatchFeedback").hide();
      $("#passwordMatchIcon").show();
    } else {
      $(this).removeClass("is-valid").addClass("is-invalid");
      $("#passwordMatchFeedback").show();
      $("#passwordMatchIcon").hide();
    }
  });

  // Form submission
  $("#signUpForm").on("submit", async function (e) {
    e.preventDefault(); // Prevent form submission

    const submitBtn = $("#signUpSubmitBtn");
    const originalText = submitBtn.html();
    
    try {
      showLoading("signUpSubmitBtn");
      
      const formArray = $(this).serializeArray();
      const signupData = {};

      $.each(formArray, function (_, field) {
        signupData[field.name] = field.value;
      });

      // Set default role as USER
      signupData.role = "USER";
      
      console.log("Attempting signup with:", signupData);

      // Call backend signup API
      const response = await ApiClient.post(API_CONFIG.ENDPOINTS.SIGNUP, signupData);
      
      if (response.success) {
        // Store user data and login state
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("userMode", JSON.stringify(response.user.role));
        localStorage.setItem("isLoggedIn", JSON.stringify(true));
        
        // Update global variables
        isLoggedIn = true;
        user_mode = response.user.role;
        
        showSuccess("Account created successfully! Redirecting...");
        
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
        showError(response.message || "Signup failed");
      }
      
    } catch (error) {
      console.error("Signup error:", error);
      showError("Signup failed: " + error.message);
    } finally {
      hideLoading("signUpSubmitBtn", originalText);
    }
  });
});
