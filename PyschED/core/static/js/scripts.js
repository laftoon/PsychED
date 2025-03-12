// Configuration for various UI behaviors
const CONFIG = {
    SCROLL: {
        THRESHOLD: 50,
        BEHAVIOR: 'smooth'
    },
    FORM: {
        TRANSITION_DURATION: 300,
        SUCCESS_MESSAGE_DURATION: 3000,
        WORKING_HOURS: {
            START: 10, // 10 AM
            END: 20,   // 8 PM
            SLOT_DURATION: 60 // 60 minutes
        }
    }
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
        this.toggle = DOMService.getElement('.mobile-menu-toggle');
        this.menu = DOMService.getElement('.nav-menu');
        this.navLinks = DOMService.getElements('.nav-menu a');
        this.init();
    }

    init() {
        if (!this.toggle || !this.menu) return;
        this.bindEvents();
    }

    bindEvents() {
        this.toggle.addEventListener('click', e => this.handleToggleClick(e));
        document.addEventListener('click', e => this.handleOutsideClick(e));
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
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
        this.menu.classList.toggle('active');
        this.toggle.classList.toggle('active');
    }

    closeMenu() {
        this.menu.classList.remove('active');
        this.toggle.classList.remove('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = {
        mobileMenu: new MobileMenu(),
        formHandler: new FormHandler()
    };
});
// Add these to your scripts.js
class HeroHandler {
    constructor() {
        this.scrollButton = document.querySelector('.scroll-to-contact');
        this.contactSection = document.getElementById('contact-section');
        this.init();
    }

    init() {
        if (this.scrollButton && this.contactSection) {
            this.scrollButton.addEventListener('click', () => {
                this.contactSection.scrollIntoView({ behavior: 'smooth' });
            });
        }
    }
}

class CarouselHandler {
    constructor() {
        this.track = document.querySelector('.carousel__track');
        this.prevButton = document.querySelector('.carousel__nav--prev');
        this.nextButton = document.querySelector('.carousel__nav--next');
        this.cards = Array.from(document.querySelectorAll('.flip-card'));
        this.currentIndex = 0;
        this.init();
    }

    init() {
        if (this.track && this.prevButton && this.nextButton) {
            this.updateButtons();
            this.bindEvents();
        }
    }

    bindEvents() {
        this.prevButton.addEventListener('click', () => this.navigate(-1));
        this.nextButton.addEventListener('click', () => this.navigate(1));
    }

    navigate(direction) {
        this.currentIndex = Math.max(0, Math.min(this.currentIndex + direction, this.cards.length - 1));
        this.updateTrack();
        this.updateButtons();
    }

    updateTrack() {
        const offset = -this.currentIndex * (this.cards[0].offsetWidth + 16); // 16px for gap
        this.track.style.transform = `translateX(${offset}px)`;
    }

    updateButtons() {
        this.prevButton.disabled = this.currentIndex === 0;
        this.nextButton.disabled = this.currentIndex === this.cards.length - 1;
    }
}

// Update your DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    const app = {
        mobileMenu: new MobileMenu(),
        formHandler: new FormHandler(),
        heroHandler: new HeroHandler(),
        carouselHandler: new CarouselHandler()
    };
});

