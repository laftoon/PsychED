document.addEventListener("DOMContentLoaded", function() {
    // Constants
    const SCROLL_THRESHOLD = 50;
    const NORMAL_SPEED = 0.6;
    const SPEED_INCREMENT = 0.01;
    const SPEED_DECREMENT = 0.02;

    // DOM Elements
    const track = document.querySelector('.carousel-track');
    const items = document.querySelectorAll('.carousel-item');
    const topbar = document.querySelector('.topbar');

    // Clone items for infinite loop
    const itemsArray = Array.from(items);
    itemsArray.forEach(item => {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
        addHoverListeners(clone);
    });

    // Calculate dimensions
    const itemWidth = items[0].offsetWidth;
    const totalWidth = itemWidth * items.length;

    // State Variables
    let position = 0;
    let currentSpeed = NORMAL_SPEED;
    let animationId = null;
    let isHovered = false;
    let hoveredItem = null;

    // Set initial position
    track.style.transform = `translateX(${position}px)`;

    // Navbar Scroll Effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > SCROLL_THRESHOLD) {
            topbar.classList.add('scrolled');
        } else {
            topbar.classList.remove('scrolled');
        }
    });

    // Carousel Animation Function
    function animate() {
        if (!isHovered) {
            // Normal animation
            currentSpeed = Math.min(NORMAL_SPEED, currentSpeed + SPEED_INCREMENT);
        } else {
            // Slowing down when hovered
            currentSpeed = Math.max(0, currentSpeed - SPEED_DECREMENT);
        }

        // Update position
        position -= currentSpeed;

        // Check if we need to reset
        if (position <= -totalWidth) {
            position = 0;
        }

        // Apply transform
        track.style.transform = `translateX(${position}px)`;
        animationId = requestAnimationFrame(animate);
    }

    // Helper function to add hover listeners to carousel items
    function addHoverListeners(item) {
        item.addEventListener('mouseenter', () => {
            isHovered = true;
            hoveredItem = item;
            item.classList.add('carousel-item-hovered');
        });

        item.addEventListener('mouseleave', () => {
            isHovered = false;
            hoveredItem = null;
            item.classList.remove('carousel-item-hovered');
        });
    }

    // Initial hover listeners setup
    items.forEach(item => addHoverListeners(item));

    // Page Visibility Handler
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animationId = requestAnimationFrame(animate);
        }
    });

    // Start Animation
    animationId = requestAnimationFrame(animate);
});
