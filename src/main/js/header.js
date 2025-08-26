function activateTab(tabName) {
  // Remove active class from all tabs and sections
  $(".nav-link").removeClass("active");
  $(".tab-section").removeClass("active");

  // Add active class to selected tab and section
  $(`.nav-link[data-tab="${tabName}"]`).addClass("active");
  $(`.tab-section[data-content="${tabName}"]`).addClass("active");
}

$(document).ready(function () {
  // Check login state and update UI
  const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn'));
  const userString = localStorage.getItem('user');
  const userMenu = $('#userMenu');
  const userIcon = $('#userIcon');

  if (isLoggedIn && userString) {
    const user = JSON.parse(userString);
    
    // Set avatar
    if (user.displayPicture) {
      $('#header_avatar').attr('src', user.displayPicture);
    } else {
      $('#header_avatar').attr('src', '../assets/logo.png'); // Default avatar
    }
    
    // Populate user dropdown menu
    userMenu.html(`
      <li><a class="dropdown-item" href="#" id="viewProfileBtn">View Profile</a></li>
      <li><hr class="dropdown-divider"></li>
      <li><a class="dropdown-item" href="#" id="logoutBtn">Logout</a></li>
    `);
    
    userIcon.show();

  } else {
    // User is not logged in
    userMenu.html(`
      <li><a class="dropdown-item" href="#" id="loginBtnHeader">Login</a></li>
      <li><a class="dropdown-item" href="#" id="signupBtnHeader">Sign Up</a></li>
    `);
    $('#header_avatar').attr('src', '../assets/logo.png'); // Default icon
    userIcon.show();
  }

  // Initial tab
  activateTab("home");

  // Tab click handler
  $(".nav-link").on("click", function () {
    const tabName = $(this).data("tab");
    activateTab(tabName);
  });

  // --- Dynamic event handlers for dropdown items ---
  
  // Use event delegation for dynamically added items
  $(document).on('click', '#logoutBtn', function() {
    localStorage.clear();
    window.location.reload();
  });

  $(document).on('click', '#viewProfileBtn', function() {
    activateTab('profile'); 
  });

  $(document).on('click', '#loginBtnHeader', function() {
    $('#customModalLabel').text('Login');
    $('#modalContent').load('../user/login.html', function() {
      $('#customModal').modal('show');
    });
  });

  $(document).on('click', '#signupBtnHeader', function() {
    $('#customModalLabel').text('Sign Up');
    $('#modalContent').load('../user/signUp.html', function() {
      $('#customModal').modal('show');
    });
  });
});