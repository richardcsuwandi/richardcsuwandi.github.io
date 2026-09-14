// A restrained In View adaptation. Only section headings fade once.
// Reading content and the initial viewport never wait for an entrance.
(function () {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const running = new Set()

  function init() {
    if (reducedMotion.matches || !window.IntersectionObserver || !Element.prototype.animate) return
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return
        observer.unobserve(entry.target)
        if (reducedMotion.matches || entry.target.contains(document.activeElement)) return
        const animation = entry.target.animate(
          [{ opacity: 0.6 }, { opacity: 1 }],
          { duration: 220, easing: 'ease-out' }
        )
        running.add(animation)
        animation.onfinish = animation.oncancel = function () { running.delete(animation) }
      })
    })
    document.querySelectorAll('.post article > h2').forEach(function (heading) {
      if (heading.getBoundingClientRect().top >= window.innerHeight) observer.observe(heading)
    })
    document.addEventListener('focusin', function (event) {
      running.forEach(function (animation) {
        if (animation.effect.target.contains(event.target)) animation.cancel()
      })
    })
  }

  reducedMotion.addEventListener('change', function () {
    if (reducedMotion.matches) running.forEach(function (animation) { animation.cancel() })
  })
  // The content is already parsed when this script loads.
  init()
})()
