// Navbar scroll glass effect and mobile menu toggle
document.addEventListener('DOMContentLoaded', function () {
  var navbar = document.getElementById('navbar');
  var menuToggle = document.querySelector('.navbar-toggler');
  var menuContent = document.querySelector('#navbarNav');
  var desktopMin = 992;

  function closeMenu() {
    if (!menuToggle || !menuContent) return;
    menuContent.classList.remove('show');
    menuToggle.classList.add('collapsed');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  function openMenu() {
    menuContent.classList.add('show');
    menuToggle.classList.remove('collapsed');
    menuToggle.setAttribute('aria-expanded', 'true');
  }

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
      e.stopPropagation();
      if (menuContent.classList.contains('show')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    document.addEventListener('click', function (e) {
      if (
        !menuContent.contains(e.target) &&
        !menuToggle.contains(e.target) &&
        menuContent.classList.contains('show')
      ) {
        closeMenu();
      }
    });

    menuContent.querySelectorAll('a.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth < desktopMin) {
          closeMenu();
        }
      });
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= desktopMin) {
        closeMenu();
      }
    });
  }
});
