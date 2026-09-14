// Quiet disclosures inspired by Motion Primitives and Watermelon UI.
// Content is visible without JavaScript. Native buttons supply keyboard behavior.
;(function () {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const running = new Map()

  function settle(panel, expanded) {
    panel.hidden = !expanded
    panel.style.overflow = ''
    running.delete(panel)
  }

  function init() {
    document.querySelectorAll('[data-disclosure]').forEach(function (trigger) {
      const panel = document.getElementById(trigger.getAttribute('aria-controls'))
      if (!panel) return
      panel.hidden = true
      trigger.hidden = false
      trigger.setAttribute('aria-expanded', 'false')
      const collapsedLabel = trigger.textContent.trim()
      trigger.addEventListener('click', function () {
        const expanded = trigger.getAttribute('aria-expanded') !== 'true'
        if (trigger.dataset.expandedLabel) {
          trigger.textContent = expanded ? trigger.dataset.expandedLabel : collapsedLabel
        }
        const old = running.get(panel)
        const start = panel.hidden ? 0 : panel.getBoundingClientRect().height
        if (old) old.cancel()
        trigger.setAttribute('aria-expanded', String(expanded))
        panel.hidden = false
        if (reducedMotion.matches || !panel.animate) {
          settle(panel, expanded)
          return
        }
        const end = expanded ? panel.getBoundingClientRect().height : 0
        panel.style.overflow = 'hidden'
        const animation = panel.animate(
          [{ height: start + 'px', opacity: expanded ? 0 : 1 }, { height: end + 'px', opacity: expanded ? 1 : 0 }],
          { duration: 220, easing: 'cubic-bezier(0.2, 0, 0, 1)' }
        )
        running.set(panel, animation)
        animation.onfinish = function () { settle(panel, expanded) }
      })
    })
  }

  reducedMotion.addEventListener('change', function () {
    if (!reducedMotion.matches) return
    running.forEach(function (animation, panel) {
      const trigger = document.querySelector('[aria-controls="' + panel.id + '"]')
      animation.cancel()
      settle(panel, trigger.getAttribute('aria-expanded') === 'true')
    })
  })

  // This script is included after the page content, before third-party libraries.
  init()
})()
