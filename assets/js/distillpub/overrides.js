$(document).ready(function () {
  // Function to get the color based on theme
  function getCitationColor() {
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    return isDarkMode ? '#87CEEB' : 'var(--global-theme-color)';
  }
  
  // Override styles of the footnotes.
  document.querySelectorAll("d-footnote").forEach(function (footnote) {
    footnote.shadowRoot.querySelector("sup > span").setAttribute("style", `color: ${getCitationColor()};`);
    footnote.shadowRoot
      .querySelector("d-hover-box")
      .shadowRoot.querySelector("style")
      .sheet.insertRule(".panel {background-color: var(--global-bg-color) !important;}");
    footnote.shadowRoot
      .querySelector("d-hover-box")
      .shadowRoot.querySelector("style")
      .sheet.insertRule(".panel {border-color: var(--global-divider-color) !important;}");
  });
  // Override styles of the citations.
  document.querySelectorAll("d-cite").forEach(function (cite) {
    cite.shadowRoot.querySelector("div > span").setAttribute("style", `color: ${getCitationColor()};`);
    cite.shadowRoot.querySelector("style").sheet.insertRule("ul li a {color: var(--global-text-color) !important; text-decoration: none;}");
    cite.shadowRoot.querySelector("style").sheet.insertRule(`ul li a:hover {color: ${getCitationColor()} !important;}`);
    cite.shadowRoot
      .querySelector("d-hover-box")
      .shadowRoot.querySelector("style")
      .sheet.insertRule(".panel {background-color: var(--global-bg-color) !important;}");
    cite.shadowRoot
      .querySelector("d-hover-box")
      .shadowRoot.querySelector("style")
      .sheet.insertRule(".panel {border-color: var(--global-divider-color) !important;}");
  });
  
  // Listen for theme changes and update citation colors
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
        // Re-apply colors when theme changes
        document.querySelectorAll("d-footnote").forEach(function (footnote) {
          footnote.shadowRoot.querySelector("sup > span").setAttribute("style", `color: ${getCitationColor()};`);
        });
        document.querySelectorAll("d-cite").forEach(function (cite) {
          cite.shadowRoot.querySelector("div > span").setAttribute("style", `color: ${getCitationColor()};`);
          // Update the hover rule
          const styleSheet = cite.shadowRoot.querySelector("style").sheet;
          // Remove the old rule and add new one (simple approach)
          for (let i = styleSheet.cssRules.length - 1; i >= 0; i--) {
            const rule = styleSheet.cssRules[i];
            if (rule.selectorText === 'ul li a:hover') {
              styleSheet.deleteRule(i);
              break;
            }
          }
          styleSheet.insertRule(`ul li a:hover {color: ${getCitationColor()} !important;}`);
        });
      }
    });
  });
  
  // Observe changes to the html element's data-theme attribute
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
});
