class TouchHandler {
    constructor() {
      this.touchStartX = 0;
      this.touchEndX = 0;
      this.minSwipeDistance = 50;
      this.init();
    }
  
    init() {
      document.addEventListener('touchstart', (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
      });
  
      document.addEventListener('touchend', (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
      });
    }
  
    handleSwipe() {
      const swipeDistance = this.touchEndX - this.touchStartX;
      if (Math.abs(swipeDistance) > this.minSwipeDistance) {
        // handle swipe
      }
    }
  }