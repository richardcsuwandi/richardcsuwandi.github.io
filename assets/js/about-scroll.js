// Progressive disclosure replaces nested scroll areas and wheel interception.
// Without JavaScript every item remains visible in the normal page flow.
(function () {
  const mobile = window.matchMedia('(max-width: 600px)')

  function init() {
    document.querySelectorAll('[data-compact-list]').forEach(function (list) {
      const items = Array.from(list.querySelectorAll(list.dataset.itemSelector))
      const label = list.dataset.itemLabel
      const footer = document.createElement('div')
      footer.className = 'collection-footer'
      const count = document.createElement('span')
      count.className = 'collection-count'
      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'collection-toggle'
      button.setAttribute('aria-controls', list.id)
      footer.append(count, button)
      list.after(footer)
      let expanded = false

      function render() {
        const limit = Number(mobile.matches && list.dataset.mobileCount ? list.dataset.mobileCount : list.dataset.visibleCount)
        items.forEach(function (item, index) {
          item.classList.add('collection-item')
          item.hidden = !expanded && index >= limit
        })
        footer.hidden = items.length <= limit
        count.textContent = 'Showing ' + (expanded ? items.length : Math.min(limit, items.length)) + ' of ' + items.length
        button.textContent = expanded ? 'Show fewer ' + label : 'Show all ' + label
        button.setAttribute('aria-expanded', String(expanded))
      }

      button.addEventListener('click', function () {
        const scrollY = window.scrollY
        const firstRevealed = items.find(function (item) { return item.hidden })
        expanded = !expanded
        render()
        if (expanded && firstRevealed) {
          const selector = 'a[href], button:not([disabled]):not([hidden]), [tabindex="0"]'
          const target = firstRevealed.matches(selector) ? firstRevealed :
            Array.from(firstRevealed.querySelectorAll(selector)).find(function (element) {
              return element.getClientRects().length > 0
            }) || firstRevealed
          if (target === firstRevealed && !target.matches(selector)) target.setAttribute('tabindex', '-1')
          // Resume keyboard browsing at the new content, not after the collection.
          window.scrollTo({ top: scrollY, behavior: 'instant' })
          target.focus({ preventScroll: true })
          target.scrollIntoView({ block: 'nearest', behavior: 'instant' })
        } else {
          button.focus({ preventScroll: true })
          button.scrollIntoView({ block: 'nearest', behavior: 'instant' })
        }
      })
      mobile.addEventListener('change', render)
      render()
    })
  }

  // This script is included after the lists, before third-party libraries.
  init()
})()
