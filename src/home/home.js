$(document).ready(function (){

  $('#home_calculator_btn').on('click', ()=>{
    activateTab('calculator');
  })

  $('#home_admin_btn').on('click', ()=>{
    activateTab('admin');
  })

  if(!isLoggedIn || (isLoggedIn && user_mode==='USER')){
    $('#home_admin_btn').hide();
  }

  // Scroll to top button
  var scrollToTopBtn = $("#scrollToTopBtn");

  $(window).scroll(function() {
    if ($(window).scrollTop() > $(document).height() / 4) {
      scrollToTopBtn.show();
    } else {
      scrollToTopBtn.hide();
    }
  });

  scrollToTopBtn.on("click", function() {
    $("html, body").animate({ scrollTop: 0 });
  });

})