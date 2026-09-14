// Native navigation feedback, independent of optional third-party scripts.
(function () {
  const navbar = document.getElementById('navbar')
  const menuToggle = document.querySelector('.navbar-toggler')
  const menuContent = document.getElementById('navbarNav')
  const desktopMin = 992

  function closeMenu() {
    if (!menuToggle || !menuContent) return
    menuContent.classList.remove('show')
    menuToggle.classList.add('collapsed')
    menuToggle.setAttribute('aria-expanded', 'false')
  }

  function syncScroll() {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50)
  }
  window.addEventListener('scroll', syncScroll, { passive: true })
  syncScroll()

  if (!menuToggle || !menuContent) return
  menuToggle.addEventListener('click', function (event) {
    event.preventDefault()
    if (menuContent.classList.contains('show')) closeMenu()
    else {
      menuContent.classList.add('show')
      menuToggle.classList.remove('collapsed')
      menuToggle.setAttribute('aria-expanded', 'true')
    }
  })

  document.addEventListener('click', function (event) {
    if (!navbar.contains(event.target)) closeMenu()
  })

  navbar.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape' || !menuContent.classList.contains('show')) return
    event.preventDefault()
    closeMenu()
    menuToggle.focus()
  })

  navbar.addEventListener('focusout', function (event) {
    if (event.relatedTarget && !navbar.contains(event.relatedTarget)) closeMenu()
  })

  menuContent.querySelectorAll('a.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth < desktopMin) closeMenu()
    })
  })

  window.addEventListener('resize', function () {
    if (window.innerWidth >= desktopMin) closeMenu()
  })
})()
