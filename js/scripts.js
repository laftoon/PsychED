document.addEventListener("DOMContentLoaded", function() {
    // Constants
    const SCROLL_THRESHOLD = 50;

    // DOM Elements
    const topbar = document.querySelector('.topbar');
    const track = document.querySelector('.flip-cards-track');
    const prevButton = document.querySelector('.carousel-nav-left');
    const nextButton = document.querySelector('.carousel-nav-right');
    const cards = document.querySelectorAll('.flip-card');

    // State Variables
    let currentIndex = 0;
    let isTransitioning = false;

    // Calculate dimensions
    function updateCarouselDimensions() {
        const cardWidth = cards[0].offsetWidth;
        const gap = 16; // Match your CSS gap
        return { cardWidth, gap };
    }

    function moveToCard(index) {
        if (isTransitioning) return;
        
        // Boundary checks
        if (index < 0) index = 0;
        if (index > cards.length - 1) index = cards.length - 1;

        const { cardWidth, gap } = updateCarouselDimensions();
        const offset = (cardWidth + gap) * index;
        
        track.style.transform = `translateX(-${offset}px)`;
        currentIndex = index;

        // Update button visibility
        prevButton.style.display = index === 0 ? 'none' : 'flex';
        nextButton.style.display = index === cards.length - 1 ? 'none' : 'flex';
    }

    // Event Listeners
    prevButton?.addEventListener('click', () => {
        moveToCard(currentIndex - 1);
    });

    nextButton?.addEventListener('click', () => {
        moveToCard(currentIndex + 1);
    });

    // Window resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            moveToCard(currentIndex);
        }, 100);
    });

    // Navbar Scroll Effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > SCROLL_THRESHOLD) {
            topbar.classList.add('scrolled');
        } else {
            topbar.classList.remove('scrolled');
        }
    });

    // Initialize carousel
    moveToCard(0);
});
