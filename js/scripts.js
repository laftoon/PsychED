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
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');

    // State Variables
    let isManualControl = false;
    let manualControlTimeout;
    let isTransitioning = false;
    let position = 0;
    let currentSpeed = NORMAL_SPEED;
    let animationId = null;
    let isHovered = false;
    let hoveredItem = null;

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

    // Set initial position
    track.style.transform = `translateX(${position}px)`;

    // Button event listeners
    prevButton.addEventListener('click', () => {
        if (isTransitioning) return;
        isTransitioning = true;
        
        isManualControl = true;
        clearTimeout(manualControlTimeout);
        
        track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        
        position += itemWidth;
        
        if (position > 0) {
            track.style.transform = `translateX(${position}px)`;
            
            setTimeout(() => {
                track.style.transition = 'none';
                position = -totalWidth + itemWidth;
                track.style.transform = `translateX(${position}px)`;
                
                setTimeout(() => {
                    track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    isTransitioning = false;
                }, 50);
            }, 500);
        } else {
            track.style.transform = `translateX(${position}px)`;
            setTimeout(() => {
                isTransitioning = false;
            }, 500);
        }
        
        startManualControlTimeout();
    });

    nextButton.addEventListener('click', () => {
        if (isTransitioning) return;
        isTransitioning = true;
        
        isManualControl = true;
        clearTimeout(manualControlTimeout);
        
        track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        
        position -= itemWidth;
        
        if (position < -totalWidth) {
            track.style.transform = `translateX(${position}px)`;
            
            setTimeout(() => {
                track.style.transition = 'none';
                position = 0;
                track.style.transform = `translateX(${position}px)`;
                
                setTimeout(() => {
                    track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    isTransitioning = false;
                }, 50);
            }, 500);
        } else {
            track.style.transform = `translateX(${position}px)`;
            setTimeout(() => {
                isTransitioning = false;
            }, 500);
        }
        
        startManualControlTimeout();
    });

    function startManualControlTimeout() {
        clearTimeout(manualControlTimeout);
        manualControlTimeout = setTimeout(() => {
            isManualControl = false;
        }, 1300);
    }

    function animate() {
        if (!isHovered && !isManualControl) {
            track.style.transition = 'none';
            currentSpeed = Math.min(NORMAL_SPEED, currentSpeed + SPEED_INCREMENT);
            position -= currentSpeed;

            if (position <= -totalWidth) {
                position = 0;
            }
        } else {
            currentSpeed = Math.max(0, currentSpeed - SPEED_DECREMENT);
        }

        track.style.transform = `translateX(${position}px)`;
        animationId = requestAnimationFrame(animate);
    }

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

    // Navbar Scroll Effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > SCROLL_THRESHOLD) {
            topbar.classList.add('scrolled');
        } else {
            topbar.classList.remove('scrolled');
        }
    });

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
