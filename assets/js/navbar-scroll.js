// handle navbar scrolling effects and mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.querySelector('.navbar-toggler');
  const menuContent = document.querySelector('#navbarNav');
  
  // debug logging
  console.log('Navbar element:', navbar);
  console.log('Menu toggle element:', menuToggle);
  console.log('Menu content element:', menuContent);
  
  // handle scroll effects
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // handle mobile menu toggle
  if (menuToggle && menuContent) {
    console.log('Adding click event listener to menu toggle');
    menuToggle.addEventListener('click', function(e) {
      console.log('Menu toggle clicked');
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

    // close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!menuContent.contains(e.target) && !menuToggle.contains(e.target) && menuContent.classList.contains('show')) {
        menuContent.classList.remove('show');
        menuToggle.classList.add('collapsed');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  } else {
    console.log('Menu toggle or content elements not found');
  }
}); 