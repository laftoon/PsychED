class CalendarHandler {
  constructor() {
    this.initializeElements();
    this.initializeState();
    this.setupEventListeners();
  }

  initializeElements() {
    this.selectedDate = this.getNextWorkingDay(new Date());
    this.workingDays = [];
    this.currentDateSpan = document.querySelector(".current-date");
    this.prevDayBtn = document.getElementById("prev-day");
    this.nextDayBtn = document.getElementById("next-day");
    this.timeSlots = document.getElementById("time-slots");
    this.currentLanguage = document.documentElement.lang || 'ro';
    this.isMobile = window.innerWidth <= 768;
  }

  initializeState() {
    this.isAnimating = false;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.swipeThreshold = 50;
    this.isScrolling = false;
  }

  setupEventListeners() {
    // Resize handler
    window.addEventListener('resize', this.debounce(() => {
      this.isMobile = window.innerWidth <= 768;
      this.updateLayout();
    }, 250));

    // Touch events for mobile
    if ('ontouchstart' in window) {
      this.setupTouchEvents();
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.navigateDay(-1);
      if (e.key === 'ArrowRight') this.navigateDay(1);
    });
  }

  setupTouchEvents() {
    if (!this.timeSlots) return;

    this.timeSlots.addEventListener('touchstart', (e) => {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
    }, { passive: true });

    this.timeSlots.addEventListener('touchmove', (e) => {
      if (this.isAnimating) return;

      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      const diffX = this.touchStartX - touchX;
      const diffY = this.touchStartY - touchY;

      // Determine if scrolling vertically
      if (Math.abs(diffY) > Math.abs(diffX)) {
        this.isScrolling = true;
        return;
      }

      // Prevent default only for horizontal swipes
      if (Math.abs(diffX) > 10) {
        e.preventDefault();
      }
    }, { passive: false });

    this.timeSlots.addEventListener('touchend', (e) => {
      if (this.isAnimating || this.isScrolling) {
        this.isScrolling = false;
        return;
      }

      const touchEndX = e.changedTouches[0].clientX;
      const diffX = this.touchStartX - touchEndX;

      if (Math.abs(diffX) > this.swipeThreshold) {
        if (diffX > 0) {
          this.navigateDay(1); // Swipe left
        } else {
          this.navigateDay(-1); // Swipe right
        }
      }
    });
  }

  updateLayout() {
    if (this.timeSlots) {
      this.timeSlots.classList.toggle('mobile-view', this.isMobile);
    }
    this.updateNavigationButtons();
  }

  // ... rest of the existing methods ...

  displayTimeSlots(slots) {
    if (!this.timeSlots) return;

    this.timeSlots.innerHTML = "";

    if (!slots || slots.length === 0) {
      this.timeSlots.innerHTML = `<div class="no-slots-message">${window.translations.get('no_available_slots', 'calendar')}</div>`;
      return;
    }

    const container = document.createElement('div');
    container.className = 'time-slots-grid';

    slots.forEach((slot) => {
      const time = new Date(slot);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "time-slot";
      
      // Convert UTC to Madrid time
      const madridTime = new Date(time.toLocaleString('en-US', { timeZone: 'Europe/Madrid' }));
      
      // Store the Madrid time
      button.dataset.time = madridTime.toTimeString().slice(0, 8);

      // Display time in current language format
      const localTime = madridTime.toLocaleTimeString(this.currentLanguage, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: 'Europe/Madrid'
      });

      button.textContent = localTime;
      
      // Add touch feedback
      if (this.isMobile) {
        button.addEventListener('touchstart', () => {
          button.style.transform = 'scale(0.98)';
        });
        
        button.addEventListener('touchend', () => {
          button.style.transform = '';
        });
      }

      container.appendChild(button);
    });

    this.timeSlots.appendChild(container);
  }

  debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
}

// Initialize calendar handler when document is ready
document.addEventListener("DOMContentLoaded", () => {
  window.calendarHandler = new CalendarHandler();
});
