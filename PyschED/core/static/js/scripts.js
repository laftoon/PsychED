// Configuration
const CONFIG = {
    SCROLL: {
        THRESHOLD: 50,
        BEHAVIOR: 'smooth'
    },
    CAROUSEL: {
        TRANSITION_TIME: 300,
        GAP: 16,
        RESIZE_DEBOUNCE: 100
    },
    FORM: {
        TRANSITION_DURATION: 300,
        SUCCESS_MESSAGE_DURATION: 3000
    }
};

// DOM Service
class DOMService {
    static getElement(selector) {
        return document.querySelector(selector);
    }
    
    static getElements(selector) {
        return document.querySelectorAll(selector);
    }
}

// Mobile Menu Handler
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

// Carousel Handler
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

        this.init();
    }

    init() {
        if (!this.track || !this.cards.length) return;
        
        this.bindEvents();
        this.updateNavigation();
        
        // Handle resize
        window.addEventListener('resize', debounce(() => {
            this.updateDimensions();
        }, CONFIG.CAROUSEL.RESIZE_DEBOUNCE));
    }

    bindEvents() {
        this.prevButton?.addEventListener('click', () => this.navigate('prev'));
        this.nextButton?.addEventListener('click', () => this.navigate('next'));
    }

    navigate(direction) {
        if (this.state.isTransitioning) return;
        
        const increment = direction === 'prev' ? -1 : 1;
        const newIndex = this.state.currentIndex + increment;
        
        this.moveToIndex(newIndex);
    }

    moveToIndex(index) {
        const maxIndex = this.getMaxIndex();
        const boundedIndex = Math.max(0, Math.min(index, maxIndex));
        
        this.state.isTransitioning = true;
        const translateX = -(this.cards[0].offsetWidth + CONFIG.CAROUSEL.GAP) * boundedIndex;
        
        this.track.style.transform = `translate3d(${translateX}px, 0, 0)`;
        this.state.currentIndex = boundedIndex;
        
        this.updateNavigation();

        setTimeout(() => {
            this.state.isTransitioning = false;
        }, CONFIG.CAROUSEL.TRANSITION_TIME);
    }

    getMaxIndex() {
        const containerWidth = this.track.parentElement.offsetWidth;
        const cardWidth = this.cards[0].offsetWidth;
        const visibleCards = Math.floor(containerWidth / (cardWidth + CONFIG.CAROUSEL.GAP));
        return Math.max(0, this.cards.length - visibleCards);
    }

    updateNavigation() {
        const maxIndex = this.getMaxIndex();
        if (this.prevButton) {
            this.prevButton.style.display = this.state.currentIndex === 0 ? 'none' : 'flex';
        }
        if (this.nextButton) {
            this.nextButton.style.display = this.state.currentIndex >= maxIndex ? 'none' : 'flex';
        }
    }

    updateDimensions() {
        this.moveToIndex(this.state.currentIndex);
    }
}

// Form Handler
class FormHandler {
    constructor() {
        this.form = DOMService.getElement('.contact-form');
        this.contact = DOMService.getElement('.contact');
        this.successMessage = this.contact?.querySelector('.success-message');
        this.loaderContainer = this.contact?.querySelector('.loader-container');
        
        this.init();
    }

    init() {
        if (!this.form || !this.successMessage || !this.loaderContainer) return;
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        this.showLoader();
        
        try {
            const formData = new FormData(this.form);
            const response = await fetch('', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': formData.get('csrfmiddlewaretoken')
                }
            });

            const data = await response.json();
            
            if (data.success) {
                this.showSuccessMessage();
                this.form.reset();
            } else {
                this.showErrorMessage(data.errors);
            }
        } catch (error) {
            console.error('Error:', error);
            this.showErrorMessage('An error occurred. Please try again.');
        } finally {
            this.hideLoader();
        }
    }

    showLoader() {
        this.loaderContainer.style.display = 'flex';
        requestAnimationFrame(() => {
            this.loaderContainer.style.opacity = '1';
        });
    }

    hideLoader() {
        this.loaderContainer.style.opacity = '0';
        setTimeout(() => {
            this.loaderContainer.style.display = 'none';
        }, CONFIG.FORM.TRANSITION_DURATION);
    }

    showSuccessMessage() {
        this.successMessage.style.display = 'block';
        requestAnimationFrame(() => {
            this.successMessage.style.opacity = '1';
        });

        setTimeout(() => {
            this.hideSuccessMessage();
        }, CONFIG.FORM.SUCCESS_MESSAGE_DURATION);
    }

    hideSuccessMessage() {
        this.successMessage.style.opacity = '0';
        setTimeout(() => {
            this.successMessage.style.display = 'none';
        }, CONFIG.FORM.TRANSITION_DURATION);
    }

    showErrorMessage(errors) {
        // Implement error message display
        console.error('Form errors:', errors);
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
        formHandler: new FormHandler()
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
