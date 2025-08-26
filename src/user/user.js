$(document).ready(function () {
  function renderUserMenu() {
    const menu = $("#userMenu");
    menu.empty();
    if (isLoggedIn) {
      menu.append(
        '<li><p class="dropdown-item text-center m-0" style="cursor: pointer" data-bs-toggle="modal" data-bs-target="#customModal" id="profileBtn">Profile</p></li>'
      );
      menu.append('<li><p class="dropdown-item text-center m-0" style="cursor: pointer" id="logoutBtn">Logout</p></li>');
    } else {
      menu.append(
        '<li><p class="dropdown-item text-center m-0" style="cursor: pointer" data-bs-toggle="modal" data-bs-target="#customModal" id="loginBtn">Login</p></li>'
      );
    }
  }

  function renderLoginForm() {
    $("#customModalLabel").text("Welcome Back!");
    $("#modalContent").load("../user/login.html");
    // $("#modalContent").load("../user/signUp.html");
  }

  $("#userMenu").on("click", "#loginBtn", renderLoginForm);
  $("#modalContent").on("click", "#loginBtn", renderLoginForm);

  $("#userMenu").on("click", "#profileBtn", function () {
    $("#customModalLabel").text("Profile");
    $("#modalContent").load("../user/profile.html");
  });

  $("#modalContent").on("click", "#signUpBtn", function () {
    $("#customModalLabel").text("Sign-Up");
    $("#modalContent").load("../user/signUp.html");
  });

  $("#userIcon").on("click", function () {
    console.log("userIcon");
    renderUserMenu();
  });

  // Simulated login/logout actions
  $("#userMenu").on("click", "#logoutBtn", function () {
    localStorage.setItem("userMode", JSON.stringify(""));
    localStorage.setItem("isLoggedIn", JSON.stringify(false));
    localStorage.removeItem("avatar");
    window.location.reload();
    renderUserMenu();
  });
});
