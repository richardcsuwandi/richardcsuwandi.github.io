// Awards expand/collapse functionality
// Handles clickable award cards that expand to show descriptions

document.addEventListener('DOMContentLoaded', function() {
  var cards = document.querySelectorAll('.awards-scrollable .service-card');

  cards.forEach(function(card) {
    var btn = card.querySelector('.award-expand-btn');

    if (btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();

        // Close all other cards
        cards.forEach(function(c) {
          if (c !== card) {
            c.classList.remove('expanded');
          }
        });

        // Toggle the clicked card
        card.classList.toggle('expanded');
      });
    }
  });
});
