class FormHandler {
  constructor() {
    this.initializeElements();
    this.initializeState();
    
    if (this.form) {
      this.initialize();
      this.setupMobileHandlers();
    }
  }

  initializeElements() {
    // Form elements
    this.form = document.getElementById("contactForm");
    this.formContent = document.querySelector(".form-content");
    this.timeSlotSelection = document.querySelector(".time-slot-selection");
    this.timeSlots = document.getElementById("time-slots");
    this.confirmTimeSlotBtn = document.querySelector(".confirm-time-slot");
    this.loaderContainer = document.querySelector(".loader-container");
    this.successMessage = document.querySelector(".success-message");
    this.errorMessage = document.querySelector(".error-message");
    
    // Mobile-specific elements
    this.inputs = this.form?.querySelectorAll('input, select, textarea');
    this.isMobile = window.innerWidth <= 768;
  }

  initializeState() {
    this.selectedTimeSlot = null;
    this.isSubmitting = false;
    this.formData = null;
    this.hasSubmitted = false;
    this.touchStartY = 0;
    this.isScrolling = false;
  }

  initialize() {
    this.form.addEventListener("submit", (e) => this.handleFormSubmit(e));
    this.setupTimeSlotHandlers();
    this.setupNavigationButtons();
    this.setupResizeHandler();
  }

  setupMobileHandlers() {
    if ('ontouchstart' in window) {
      // Prevent zoom on focus for iOS
      this.inputs?.forEach(input => {
        input.style.fontSize = '16px';
        
        // Add touch feedback
        input.addEventListener('touchstart', () => {
          input.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
        });
        
        input.addEventListener('touchend', () => {
          input.style.backgroundColor = '';
        });
      });

      // Handle time slot touch events
      if (this.timeSlots) {
        this.timeSlots.addEventListener('touchstart', (e) => {
          this.touchStartY = e.touches[0].clientY;
        }, { passive: true });

        this.timeSlots.addEventListener('touchmove', (e) => {
          const touchY = e.touches[0].clientY;
          const diff = this.touchStartY - touchY;

          if (Math.abs(diff) > 5) {
            this.isScrolling = true;
          }
        }, { passive: true });

        this.timeSlots.addEventListener('touchend', () => {
          setTimeout(() => {
            this.isScrolling = false;
          }, 100);
        });
      }
    }
  }

  setupTimeSlotHandlers() {
    if (this.timeSlots) {
      this.timeSlots.addEventListener("click", (e) => {
        if (e.target.classList.contains("time-slot") && !this.isScrolling) {
          this.handleTimeSlotClick(e.target);
        }
      });
    }
  }

  setupNavigationButtons() {
    const prevDayBtn = document.getElementById("prev-day");
    const nextDayBtn = document.getElementById("next-day");

    if (prevDayBtn) {
      prevDayBtn.addEventListener("click", () => window.calendarHandler.navigateDay(-1));
    }
    if (nextDayBtn) {
      nextDayBtn.addEventListener("click", () => window.calendarHandler.navigateDay(1));
    }
  }

  setupResizeHandler() {
    window.addEventListener('resize', this.debounce(() => {
      this.isMobile = window.innerWidth <= 768;
      this.updateLayout();
    }, 250));
  }

  updateLayout() {
    if (this.isMobile) {
      this.timeSlots?.classList.add('mobile-view');
      this.form?.classList.add('mobile-view');
    } else {
      this.timeSlots?.classList.remove('mobile-view');
      this.form?.classList.remove('mobile-view');
    }
  }

  handleTimeSlotClick(slot) {
    if (this.isSubmitting) return;

    // Add haptic feedback for supported devices
    if (window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }

    const slots = this.timeSlots.querySelectorAll(".time-slot");
    slots.forEach((s) => s.classList.remove("selected"));

    slot.classList.add("selected");
    this.selectedTimeSlot = slot.dataset.time;

    if (this.confirmTimeSlotBtn) {
      this.confirmTimeSlotBtn.disabled = false;
      
      // Scroll to button on mobile
      if (this.isMobile) {
        this.confirmTimeSlotBtn.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  // ... rest of the existing methods (handleFormSubmit, handleInitialFormSubmission, 
  // handleTimeSlotSubmission, etc.) remain the same ...

  showError(message) {
    this.successMessage.classList.remove("active");
    const errorContent = this.errorMessage.querySelector("p");
    if (errorContent) {
      errorContent.textContent = message;
    }
    this.errorMessage.classList.add("active");

    // Vibrate on error for mobile devices
    if (window.navigator.vibrate) {
      window.navigator.vibrate([100, 50, 100]);
    }

    // Ensure error is visible on mobile
    if (this.isMobile) {
      this.errorMessage.scrollIntoView({ behavior: 'smooth' });
    }

    setTimeout(() => {
      this.errorMessage.classList.remove("active");
    }, 3000);
  }

  debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
}

// Initialize form handler when document is ready
document.addEventListener("DOMContentLoaded", () => {
  window.formHandler = new FormHandler();
});
