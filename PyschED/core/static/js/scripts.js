// Configuration for various UI behaviors
const CONFIG = {
  SCROLL: {
    THRESHOLD: 50,
    BEHAVIOR: "smooth",
  },
  FORM: {
    TRANSITION_DURATION: 300,
    SUCCESS_MESSAGE_DURATION: 3000,
    WORKING_HOURS: {
      START: 10,
      END: 20,
      SLOT_DURATION: 60,
    },
  },
  TOUCH: {
    SWIPE_THRESHOLD: 50,
    TAP_THRESHOLD: 10,
    DOUBLE_TAP_DELAY: 300,
  },
};

class DOMService {
  static getElement(selector) {
    return document.querySelector(selector);
  }

  static getElements(selector) {
    return document.querySelectorAll(selector);
  }

  // Add touch detection
  static isTouchDevice() {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  }
}

// Class to handle the mobile menu functionality
class MobileMenu {
  constructor() {
    this.toggle = DOMService.getElement(".mobile-menu-toggle");
    this.menu = DOMService.getElement(".nav-menu");
    this.navLinks = DOMService.getElements(".nav-menu a");
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

    // Add escape key handler
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeMenu();
      }
    });
  }

  setupTouchEvents() {
    if (!DOMService.isTouchDevice()) return;

    let touchStartX = 0;
    let touchEndX = 0;

    this.menu.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    });

    this.menu.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].clientX;
      const swipeDistance = touchStartX - touchEndX;

      if (Math.abs(swipeDistance) > CONFIG.TOUCH.SWIPE_THRESHOLD) {
        if (swipeDistance > 0) {
          this.closeMenu(); // Swipe left to close
        }
      }
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
    
    // Prevent body scroll when menu is open
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

class HeroHandler {
  constructor() {
    this.scrollButtons = document.querySelectorAll(".scroll-to-contact");
    this.contactSection = document.getElementById("contact-section");
    this.init();
  }

  init() {
    if (this.scrollButtons.length) {
      this.scrollButtons.forEach(button => {
        button.addEventListener("click", (e) => {
          // Check if we're on the home page
          const isHomePage = window.location.pathname === "/" || 
                           window.location.pathname === "/home/";

          if (isHomePage) {
            // If on home page, prevent default and scroll
            e.preventDefault();
            if (this.contactSection) {
              this.contactSection.scrollIntoView({ behavior: "smooth" });
            }
          }
          // If not on home page, let the default link behavior work
          // It will redirect to home page with #contact-section hash
        });
      });
    }

    // Check for hash in URL when page loads
    window.addEventListener('load', () => {
      if (window.location.hash === '#contact-section' && this.contactSection) {
        this.contactSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
}


class CarouselHandler {
  constructor() {
    // Core elements
    this.track = DOMService.getElement(".carousel__track");
    this.prevButton = DOMService.getElement(".carousel__nav--prev");
    this.nextButton = DOMService.getElement(".carousel__nav--next");
    this.cards = Array.from(DOMService.getElements(".flip-card"));

    // State management
    this.currentIndex = 0;
    this.isDragging = false;
    this.startPos = 0;
    this.currentTranslate = 0;
    this.prevTranslate = 0;
    this.animationID = 0;
    this.isMobile = window.innerWidth <= 768;

    // Initialize
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
    
    if (DOMService.isTouchDevice()) {
      this.setupTouchEvents();
    }

    this.updateButtons();
  }

  calculateCardsPerView() {
    if (!this.track || !this.cards.length) return 1;
    const trackWidth = this.track.parentElement.offsetWidth;
    const cardWidth = this.cards[0].offsetWidth + 16; // 16px for gap
    return Math.max(1, Math.floor(trackWidth / cardWidth));
  }

  bindEvents() {
    // Navigation buttons
    if (this.prevButton) {
      this.prevButton.addEventListener("click", () => this.navigate(-1));
    }
    if (this.nextButton) {
      this.nextButton.addEventListener("click", () => this.navigate(1));
    }

    // Resize handling
    window.addEventListener("resize", this.debounce(() => {
      this.isMobile = window.innerWidth <= 768;
      this.cardsPerView = this.calculateCardsPerView();
      this.maxIndex = Math.max(0, this.cards.length - this.cardsPerView);
      this.updateLayout();
    }, 250));

    // Keyboard navigation
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
    
    // Prevent vertical scrolling when swiping horizontally
    if (Math.abs(diff) > 10) {
      event.preventDefault();
    }
    
    this.currentTranslate = this.prevTranslate + diff;
  }

  touchEnd() {
    this.isDragging = false;
    cancelAnimationFrame(this.animationID);
    
    const movedBy = this.currentTranslate - this.prevTranslate;
    const threshold = this.track.offsetWidth * 0.2; // 20% of track width
    
    this.track.style.transition = 'transform 0.3s ease';
    
    if (Math.abs(movedBy) > threshold) {
      if (movedBy > 0) {
        this.navigate(-1);
      } else {
        this.navigate(1);
      }
    } else {
      this.updateTrack(); // Snap back to current position
    }
  }

  animation() {
    if (this.isDragging) {
      this.setTrackPosition(this.currentTranslate);
      requestAnimationFrame(() => this.animation());
    }
  }

  setTrackPosition(position) {
    // Limit the position to prevent over-dragging
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
      }, 300); // Match transition duration
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


// Update your DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", () => {
  const app = {
    mobileMenu: new MobileMenu(),
    heroHandler: new HeroHandler(),
    carouselHandler: new CarouselHandler(),
  };
});

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
      // Handle swipe left/right
      if (swipeDistance > 0) {
        // Swipe right
      } else {
        // Swipe left
      }
    }
  }
}


new TouchHandler();

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
          if (diff > 0) {
            // Swipe up - expand
            card.classList.add('expanded');
          } else {
            // Swipe down - collapse
            card.classList.remove('expanded');
          }
        }
      });
    });
  }
}

// Initialize in DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  const app = {
    mobileMenu: new MobileMenu(),
    heroHandler: new HeroHandler(),
    carouselHandler: new CarouselHandler(),
    touchHandler: new TouchHandler(),
    expandableCardHandler: new ExpandableCardHandler(),
  };
});
// In scripts.js
document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  
  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener("click", () => {
      mobileMenuToggle.classList.toggle("active");
      navMenu.classList.toggle("active");
      mobileMenuToggle.setAttribute(
        "aria-expanded",
        mobileMenuToggle.classList.contains("active")
      );
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        mobileMenuToggle.classList.remove("active");
        navMenu.classList.remove("active");
        mobileMenuToggle.setAttribute("aria-expanded", "false");
      }
    });

    // Close menu when pressing Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        mobileMenuToggle.classList.remove("active");
        navMenu.classList.remove("active");
        mobileMenuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }
});
document.addEventListener('DOMContentLoaded', function() {
  const consent = localStorage.getItem('cookieConsent');
  const consentContainer = document.getElementById('cookieConsentContainer');

  if (consent === null || consent === 'refused') {
    showConsentPopup();
    if (consent === 'refused') {
      blockWebsite();
    }
  }

  document.getElementById('acceptCookies').addEventListener('click', function() {
    localStorage.setItem('cookieConsent', 'accepted');
    hideConsentPopup();
    document.body.style.overflow = '';
  });

  document.getElementById('refuseCookies').addEventListener('click', function() {
    localStorage.setItem('cookieConsent', 'refused');
    blockWebsite();
  });

  function showConsentPopup() {
    consentContainer.style.visibility = 'visible';
    consentContainer.style.opacity = '1';
  }

  function hideConsentPopup() {
    consentContainer.style.opacity = '0';
    setTimeout(() => consentContainer.style.visibility = 'hidden', 500);
  }

  function blockWebsite() {
    const message = window.translations.get('cookie_refused', 'errors');
    consentContainer.innerHTML = `
      <div class="cookie-content">
        <p>${message}</p>
      </div>
    `;
    consentContainer.style.visibility = 'visible';
    consentContainer.style.opacity = '1';
    document.body.style.overflow = 'hidden';

    // Automatically clear refusal after page reload
    localStorage.removeItem('cookieConsent');
  }
});

