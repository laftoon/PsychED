// Config
const CONFIG = {
    SCROLL: {
        THRESHOLD: 50,
        BEHAVIOR: 'smooth'
    },
    CAROUSEL: {
        TRANSITION_TIME: 500,
        GAP: 16,
        RESIZE_DEBOUNCE: 100
    }
};

// DOM Selectors using a dedicated service
class DOMService {
    static getElement(selector) {
        return document.querySelector(selector);
    }
    
    static getElements(selector) {
        return document.querySelectorAll(selector);
    }
}

// Mobile Menu Module
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
        this.toggle.addEventListener('click', (e) => this.handleToggleClick(e));
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
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

// Carousel Module using Observer Pattern
class Carousel {
    constructor() {
        this.track = DOMService.getElement('.carousel__track');
        this.prevButton = DOMService.getElement('.carousel__nav--prev');
        this.nextButton = DOMService.getElement('.carousel__nav--next');
        this.cards = DOMService.getElements('.flip-card');
        
        this.state = {
            currentIndex: 0,
            isTransitioning: false
        };

        this.observers = [];
        this.init();
    }

    init() {
        if (!this.track || !this.cards.length) return;
        
        this.bindEvents();
        this.updateNavigation(0);
    }

    bindEvents() {
        this.prevButton?.addEventListener('click', () => this.move('prev'));
        this.nextButton?.addEventListener('click', () => this.move('next'));
        
        // Debounced resize handler using utility function
        window.addEventListener('resize', debounce(() => {
            this.updateDimensions();
        }, CONFIG.CAROUSEL.RESIZE_DEBOUNCE));
    }

    move(direction) {
        if (this.state.isTransitioning) return;

        const increment = direction === 'prev' ? -1 : 1;
        const newIndex = this.state.currentIndex + increment;
        
        this.updatePosition(newIndex);
    }

    updatePosition(index) {
        const dimensions = this.calculateDimensions();
        const boundedIndex = this.getBoundedIndex(index, dimensions.maxScroll);
        
        this.state.isTransitioning = true;
        this.track.style.transform = `translateX(-${(dimensions.cardWidth + CONFIG.CAROUSEL.GAP) * boundedIndex}px)`;
        this.state.currentIndex = boundedIndex;
        
        this.updateNavigation(boundedIndex);
        this.notifyObservers();

        setTimeout(() => {
            this.state.isTransitioning = false;
        }, CONFIG.CAROUSEL.TRANSITION_TIME);
    }

    calculateDimensions() {
        const cardWidth = this.cards[0].offsetWidth;
        const containerWidth = this.track.parentElement.offsetWidth;
        const visibleCards = Math.floor(containerWidth / (cardWidth + CONFIG.CAROUSEL.GAP));
        const maxScroll = Math.max(0, this.cards.length - visibleCards);
        
        return { cardWidth, maxScroll };
    }

    getBoundedIndex(index, maxScroll) {
        return Math.max(0, Math.min(index, maxScroll));
    }

    updateNavigation(index) {
        const dimensions = this.calculateDimensions();
        if (this.prevButton) this.prevButton.style.display = index === 0 ? 'none' : 'flex';
        if (this.nextButton) this.nextButton.style.display = index >= dimensions.maxScroll ? 'none' : 'flex';
    }

    // Observer Pattern methods
    addObserver(observer) {
        this.observers.push(observer);
    }

    notifyObservers() {
        this.observers.forEach(observer => observer.update(this.state));
    }
}

// Scroll Handler Module
class ScrollHandler {
    constructor() {
        this.topbar = DOMService.getElement('.topbar');
        this.init();
    }

    init() {
        if (!this.topbar) return;
        
        window.addEventListener('scroll', () => this.handleScroll());
    }

    handleScroll() {
        if (window.innerWidth <= 768) {
            this.topbar.classList.toggle('scrolled', window.scrollY > CONFIG.SCROLL.THRESHOLD);
        }
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    const app = {
        mobileMenu: new MobileMenu(),
        carousel: new Carousel(),
        scrollHandler: new ScrollHandler()
    };

    // Handle scroll to contact
    const scrollButton = DOMService.getElement('.scroll-to-contact');
    const contactSection = DOMService.getElement('#contact-section');
    
    if (scrollButton && contactSection) {
        scrollButton.addEventListener('click', () => {
            contactSection.scrollIntoView({ 
                behavior: CONFIG.SCROLL.BEHAVIOR,
                block: 'start'
            });
        });
    }
});
