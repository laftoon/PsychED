class MobileMenu {
    constructor() {
      this.toggle = document.querySelector(".mobile-menu-toggle");
      this.menu = document.querySelector(".nav-menu");
      this.navLinks = document.querySelectorAll(".nav-menu a");
      this.isOpen = false;
      this.init();
    }
  
    init() {
      if (!this.toggle || !this.menu) return;
      this.bindEvents();
      this.setupTouchEvents();
    }
  
    bindEvents() {
      this.toggle.addEventListener("click", (e) => this.handleToggleClick(e));
      document.addEventListener("click", (e) => this.handleOutsideClick(e));
      this.navLinks.forEach((link) => {
        link.addEventListener("click", () => this.closeMenu());
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.closeMenu();
        }
      });
    }
  
    setupTouchEvents() {
      if (!('ontouchstart' in window) && !(navigator.maxTouchPoints > 0)) return;
      let touchStartX = 0;
      let touchEndX = 0;
      this.menu.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
      });
      this.menu.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const swipeDistance = touchStartX - touchEndX;
        if (Math.abs(swipeDistance) > 50 && swipeDistance > 0) this.closeMenu();
      });
    }
  
    handleToggleClick(e) {
      e.stopPropagation();
      this.toggleMenu();
    }
  
    handleOutsideClick(e) {
      if (!this.menu.contains(e.target) && !this.toggle.contains(e.target)) {
        this.closeMenu();
      }
    }
  
    toggleMenu() {
      this.isOpen = !this.isOpen;
      this.menu.classList.toggle("active");
      this.toggle.classList.toggle("active");
      this.toggle.setAttribute('aria-expanded', this.isOpen);
      document.body.style.overflow = this.isOpen ? 'hidden' : '';
    }
  
    closeMenu() {
      if (this.isOpen) {
        this.isOpen = false;
        this.menu.classList.remove("active");
        this.toggle.classList.remove("active");
        this.toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    }
  }