document.addEventListener("DOMContentLoaded", function() {
    // Constants
    const SCROLL_THRESHOLD = 50;

    // DOM Elements
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const topbar = document.querySelector('.topbar');
    const track = document.querySelector('.flip-cards-track');
    const prevButton = document.querySelector('.carousel-nav-left');
    const nextButton = document.querySelector('.carousel-nav-right');
    const cards = document.querySelectorAll('.flip-card');
    const scrollButton = document.querySelector('.scroll-to-contact');
    const contactSection = document.querySelector('#contact-section');

    // Mobile Menu Handler
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });

        // Close menu when clicking nav links
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });
    }

    // Scroll to contact functionality
    if (scrollButton && contactSection) {
        scrollButton.addEventListener('click', () => {
            contactSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        });
    }

    // Carousel functionality
    let currentIndex = 0;
    let isTransitioning = false;

    function updateCarouselDimensions() {
        const cardWidth = cards[0].offsetWidth;
        const gap = 16;
        const containerWidth = track.parentElement.offsetWidth;
        const totalWidth = cards.length * (cardWidth + gap) - gap;
        const visibleCards = Math.floor(containerWidth / (cardWidth + gap));
        const maxScroll = Math.max(0, cards.length - visibleCards);
        return { cardWidth, gap, maxScroll };
    }

    function moveToCard(index) {
        if (isTransitioning) return;
        
        const { cardWidth, gap, maxScroll } = updateCarouselDimensions();
        
        // Boundary checks
        index = Math.max(0, Math.min(index, maxScroll));

        const offset = (cardWidth + gap) * index;
        
        isTransitioning = true;
        track.style.transform = `translateX(-${offset}px)`;
        currentIndex = index;

        // Update button visibility
        prevButton.style.display = index === 0 ? 'none' : 'flex';
        nextButton.style.display = index >= maxScroll ? 'none' : 'flex';

        setTimeout(() => {
            isTransitioning = false;
        }, 500);
    }

    // Event Listeners
    prevButton?.addEventListener('click', () => moveToCard(currentIndex - 1));
    nextButton?.addEventListener('click', () => moveToCard(currentIndex + 1));

    // Debounced resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => moveToCard(currentIndex), 100);
    });

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    if (window.innerWidth <= 768) { // Only apply on mobile
        if (window.scrollY > SCROLL_THRESHOLD) {
            topbar.classList.add('scrolled');
        } else {
            topbar.classList.remove('scrolled');
        }
    }
});


    // Initialize carousel
    prevButton.style.display = 'none';
    moveToCard(0);
});
