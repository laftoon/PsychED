class ExpandableCardHandler {
    constructor() {
      this.cards = document.querySelectorAll('.expandable-item');
      this.bindTouchEvents();
    }
  
    bindTouchEvents() {
      this.cards.forEach(card => {
        let touchStartY = 0;
        let touchEndY = 0;
  
        card.addEventListener('touchstart', (e) => {
          touchStartY = e.touches[0].clientY;
        });
  
        card.addEventListener('touchend', (e) => {
          touchEndY = e.changedTouches[0].clientY;
          const diff = touchStartY - touchEndY;
          if (Math.abs(diff) > 50) {
            diff > 0 ? card.classList.add('expanded') : card.classList.remove('expanded');
          }
        });
      });
    }
  }