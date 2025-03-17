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
      START: 10, // 10 AM
      END: 20, // 8 PM
      SLOT_DURATION: 60, // 60 minutes
    },
  },
};

class DOMService {
  static getElement(selector) {
    return document.querySelector(selector);
  }

  static getElements(selector) {
    return document.querySelectorAll(selector);
  }
}

// Class to handle the mobile menu functionality
class MobileMenu {
  constructor() {
    this.toggle = DOMService.getElement(".mobile-menu-toggle");
    this.menu = DOMService.getElement(".nav-menu");
    this.navLinks = DOMService.getElements(".nav-menu a");
    this.init();
  }

  init() {
    if (!this.toggle || !this.menu) return;
    this.bindEvents();
  }

  bindEvents() {
    this.toggle.addEventListener("click", (e) => this.handleToggleClick(e));
    document.addEventListener("click", (e) => this.handleOutsideClick(e));
    this.navLinks.forEach((link) => {
      link.addEventListener("click", () => this.closeMenu());
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
    this.menu.classList.toggle("active");
    this.toggle.classList.toggle("active");
  }

  closeMenu() {
    this.menu.classList.remove("active");
    this.toggle.classList.remove("active");
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
    this.track = document.querySelector(".carousel__track");
    this.prevButton = document.querySelector(".carousel__nav--prev");
    this.nextButton = document.querySelector(".carousel__nav--next");
    this.cards = Array.from(document.querySelectorAll(".flip-card"));
    this.currentIndex = 0;
    this.cardsPerView = this.calculateCardsPerView();
    this.maxIndex = Math.max(0, this.cards.length - this.cardsPerView);
    this.init();

    window.addEventListener("resize", () => {
      this.cardsPerView = this.calculateCardsPerView();
      this.maxIndex = Math.max(0, this.cards.length - this.cardsPerView);
      this.updateTrack();
      this.updateButtons();
    });
  }

  calculateCardsPerView() {
    const trackWidth = this.track.parentElement.offsetWidth;
    const cardWidth = this.cards[0].offsetWidth + 16;
    return Math.floor(trackWidth / cardWidth);
  }

  init() {
    if (this.track && this.prevButton && this.nextButton) {
      this.updateButtons();
      this.bindEvents();
    }
  }

  bindEvents() {
    this.prevButton.addEventListener("click", () => this.navigate(-1));
    this.nextButton.addEventListener("click", () => this.navigate(1));
  }

  navigate(direction) {
    const newIndex = this.currentIndex + direction;
    if (newIndex >= 0 && newIndex <= this.maxIndex) {
      this.currentIndex = newIndex;
      this.updateTrack();
      this.updateButtons();
    }
  }

  updateTrack() {
    const offset = -this.currentIndex * (this.cards[0].offsetWidth + 16);
    this.track.style.transform = `translateX(${offset}px)`;
  }

  updateButtons() {
    if (this.prevButton) {
      this.prevButton.style.display = this.currentIndex === 0 ? "none" : "flex";
    }
    if (this.nextButton) {
      this.nextButton.style.display =
        this.currentIndex >= this.maxIndex ? "none" : "flex";
    }
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
