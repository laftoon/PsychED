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
