class CarouselHandler {
    constructor() {
      this.track = document.querySelector(".carousel__track");
      this.prevButton = document.querySelector(".carousel__nav--prev");
      this.nextButton = document.querySelector(".carousel__nav--next");
      this.cards = Array.from(document.querySelectorAll(".flip-card"));
      this.currentIndex = 0;
      this.isDragging = false;
      this.startPos = 0;
      this.currentTranslate = 0;
      this.prevTranslate = 0;
      this.animationID = 0;
      this.isMobile = window.innerWidth <= 768;
      if (this.track && this.cards.length) {
        this.init();
      }
    }
  
    init() {
      this.setupCarousel();
      this.bindEvents();
      this.updateLayout();
    }
  
    setupCarousel() {
      this.cardsPerView = this.calculateCardsPerView();
      this.maxIndex = Math.max(0, this.cards.length - this.cardsPerView);
      if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        this.setupTouchEvents();
      }
      this.updateButtons();
    }
  
    calculateCardsPerView() {
      if (!this.track || !this.cards.length) return 1;
      const trackWidth = this.track.parentElement.offsetWidth;
      const cardWidth = this.cards[0].offsetWidth + 16;
      return Math.max(1, Math.floor(trackWidth / cardWidth));
    }
  
    bindEvents() {
      if (this.prevButton) {
        this.prevButton.addEventListener("click", () => this.navigate(-1));
      }
      if (this.nextButton) {
        this.nextButton.addEventListener("click", () => this.navigate(1));
      }
  
      window.addEventListener("resize", this.debounce(() => {
        this.isMobile = window.innerWidth <= 768;
        this.cardsPerView = this.calculateCardsPerView();
        this.maxIndex = Math.max(0, this.cards.length - this.cardsPerView);
        this.updateLayout();
      }, 250));
  
      document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") this.navigate(-1);
        if (e.key === "ArrowRight") this.navigate(1);
      });
    }
  
    setupTouchEvents() {
      this.track.addEventListener("touchstart", (e) => this.touchStart(e), { passive: true });
      this.track.addEventListener("touchmove", (e) => this.touchMove(e), { passive: false });
      this.track.addEventListener("touchend", () => this.touchEnd());
      this.track.addEventListener("touchcancel", () => this.touchEnd());
    }
  
    touchStart(event) {
      this.isDragging = true;
      this.startPos = event.touches[0].clientX;
      this.animationID = requestAnimationFrame(() => this.animation());
      this.track.style.transition = 'none';
    }
  
    touchMove(event) {
      if (!this.isDragging) return;
      const currentPosition = event.touches[0].clientX;
      const diff = currentPosition - this.startPos;
      if (Math.abs(diff) > 10) event.preventDefault();
      this.currentTranslate = this.prevTranslate + diff;
    }
  
    touchEnd() {
      this.isDragging = false;
      cancelAnimationFrame(this.animationID);
      const movedBy = this.currentTranslate - this.prevTranslate;
      const threshold = this.track.offsetWidth * 0.2;
      this.track.style.transition = 'transform 0.3s ease';
      if (Math.abs(movedBy) > threshold) {
        this.navigate(movedBy > 0 ? -1 : 1);
      } else {
        this.updateTrack();
      }
    }
  
    animation() {
      if (this.isDragging) {
        this.setTrackPosition(this.currentTranslate);
        requestAnimationFrame(() => this.animation());
      }
    }
  
    setTrackPosition(position) {
      const minPosition = -this.maxIndex * (this.cards[0].offsetWidth + 16);
      const maxPosition = 0;
      const limitedPosition = Math.max(minPosition, Math.min(maxPosition, position));
      this.track.style.transform = `translateX(${limitedPosition}px)`;
    }
  
    navigate(direction) {
      if (this.isAnimating) return;
      const newIndex = this.currentIndex + direction;
      if (newIndex >= 0 && newIndex <= this.maxIndex) {
        this.isAnimating = true;
        this.currentIndex = newIndex;
        this.updateTrack();
        this.updateButtons();
        setTimeout(() => {
          this.isAnimating = false;
        }, 300);
      }
    }
  
    updateTrack() {
      const offset = -this.currentIndex * (this.cards[0].offsetWidth + 16);
      this.prevTranslate = offset;
      this.currentTranslate = offset;
      this.track.style.transform = `translateX(${offset}px)`;
    }
  
    updateButtons() {
      if (!this.isMobile) {
        if (this.prevButton) {
          this.prevButton.style.display = this.currentIndex === 0 ? "none" : "flex";
        }
        if (this.nextButton) {
          this.nextButton.style.display = this.currentIndex >= this.maxIndex ? "none" : "flex";
        }
      }
    }
  
    updateLayout() {
      this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
      this.updateTrack();
      this.updateButtons();
    }
  
    debounce(func, wait) {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    }
  }