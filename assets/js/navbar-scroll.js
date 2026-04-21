// Navbar scroll glass effect and mobile menu toggle
document.addEventListener('DOMContentLoaded', function () {
  var navbar = document.getElementById('navbar');
  var menuToggle = document.querySelector('.navbar-toggler');
  var menuContent = document.querySelector('#navbarNav');

  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  if (menuToggle && menuContent) {
    menuToggle.addEventListener('click', function (e) {
      e.preventDefault();
      if (menuContent.classList.contains('show')) {
        menuContent.classList.remove('show');
        menuToggle.classList.add('collapsed');
        menuToggle.setAttribute('aria-expanded', 'false');
      } else {
        menuContent.classList.add('show');
        menuToggle.classList.remove('collapsed');
        menuToggle.setAttribute('aria-expanded', 'true');
      }
    });

    document.addEventListener('click', function (e) {
      if (
        !menuContent.contains(e.target) &&
        !menuToggle.contains(e.target) &&
        menuContent.classList.contains('show')
      ) {
        menuContent.classList.remove('show');
        menuToggle.classList.add('collapsed');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
});
