document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Prevent navigation if the card is clicked
            e.preventDefault();
            
            // Remove expanded class from all cards
            cards.forEach(c => {
                if (c !== card) {
                    c.classList.remove('expanded');
                }
            });
            
            // Toggle expanded class on clicked card
            card.classList.toggle('expanded');
        });
    });
});
