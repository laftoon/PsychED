// form-handler.js

class FormHandler {
  constructor() {
    // Initialize form elements
    this.form = document.getElementById("contactForm");
    this.formContent = document.querySelector(".form-content");
    this.timeSlotSelection = document.querySelector(".time-slot-selection");
    this.timeSlots = document.getElementById("time-slots");
    this.confirmTimeSlotBtn = document.querySelector(".confirm-time-slot");
    this.loaderContainer = document.querySelector(".loader-container");
    this.successMessage = document.querySelector(".success-message");
    this.errorMessage = document.querySelector(".error-message");

    // Initialize state
    this.selectedTimeSlot = null;
    this.isSubmitting = false;
    this.formData = null;
    this.hasSubmitted = false;

    if (this.form) {
      this.initialize();
    }
  }

  initialize() {
    this.form.addEventListener("submit", (e) => this.handleFormSubmit(e));

    if (this.timeSlots) {
      this.timeSlots.addEventListener("click", (e) => {
        if (e.target.classList.contains("time-slot")) {
          this.handleTimeSlotClick(e.target);
        }
      });
    }

    const prevDayBtn = document.getElementById("prev-day");
    const nextDayBtn = document.getElementById("next-day");

    if (prevDayBtn) {
      prevDayBtn.addEventListener("click", () =>
        window.calendarHandler.navigateDay(-1)
      );
    }
    if (nextDayBtn) {
      nextDayBtn.addEventListener("click", () =>
        window.calendarHandler.navigateDay(1)
      );
    }
  }

  async handleFormSubmit(e) {
    e.preventDefault();

    if (this.isSubmitting || this.hasSubmitted) {
      return;
    }

    this.isSubmitting = true;

    try {
      if (!this.timeSlotSelection.classList.contains("hidden")) {
        await this.handleTimeSlotSubmission();
      } else {
        await this.handleInitialFormSubmission();
      }
    } catch (error) {
      console.error("Form submission error:", error);
      this.showError("A apărut o eroare la procesarea formularului");
    } finally {
      this.isSubmitting = false;
    }
  }

  async handleInitialFormSubmission() {
    this.formData = new FormData();

    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "interest",
      "message",
    ];
    for (const field of requiredFields) {
      const value = this.form.elements[field].value.trim();
      if (!value) {
        this.showError(`Vă rugăm să completați câmpul ${field}`);
        this.isSubmitting = false;
        return;
      }
      this.formData.append(field, value);
    }

    // Show loader before calendar initialization
    this.showLoader();

    try {
      if (window.calendarHandler) {
        window.calendarHandler.initializeWorkingDays();
        await window.calendarHandler.fetchAndDisplayTimeSlots();
      }

      this.formContent.style.opacity = "0";
      setTimeout(() => {
        this.formContent.classList.add("hidden");
        this.timeSlotSelection.classList.remove("hidden");
        setTimeout(() => {
          this.timeSlotSelection.style.opacity = "1";
          this.hideLoader(); // Hide loader after transition
        }, 50);
      }, 300);
    } catch (error) {
      this.hideLoader();
      this.showError("A apărut o eroare la încărcarea calendarului");
      console.error("Calendar initialization error:", error);
    }
  }

  handleTimeSlotClick(slot) {
    if (this.isSubmitting) return;

    const slots = this.timeSlots.querySelectorAll(".time-slot");
    slots.forEach((s) => s.classList.remove("selected"));

    slot.classList.add("selected");
    this.selectedTimeSlot = slot.dataset.time;

    if (this.confirmTimeSlotBtn) {
      this.confirmTimeSlotBtn.disabled = false;
    }
  }

// In form-handler.js
async handleTimeSlotSubmission() {
    if (!this.selectedTimeSlot) {
        this.showError("Vă rugăm să selectați o oră");
        this.isSubmitting = false;
        return;
    }

    this.showLoader();
    this.confirmTimeSlotBtn.disabled = true;

    try {
        if (!this.formData) {
            throw new Error("Form data is missing");
        }

        const selectedDate = window.calendarHandler.selectedDate;
        const [hours, minutes, seconds] = this.selectedTimeSlot.split(':');
        
        // Create date in Madrid timezone
        const madridDate = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            parseInt(hours),
            parseInt(minutes),
            parseInt(seconds)
        );

        this.formData.append("date", madridDate.toISOString().split("T")[0]);
        this.formData.append("time", this.selectedTimeSlot);

      const response = await fetch("/submit_time_slot/", {
        method: "POST",
        headers: {
          "X-CSRFToken": this.getCookie("csrftoken"),
        },
        body: this.formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Nu s-a putut finaliza programarea");
      }

      if (data.success) {
        this.hasSubmitted = true;
        this.hideLoader();
        this.showSuccess();
        setTimeout(() => {
          this.resetForm();
        }, 3000);
      } else {
        throw new Error(data.error || "Nu s-a putut finaliza programarea");
      }
    } catch (error) {
      this.hideLoader();
      console.error("Submission error:", error);
      this.showError(error.message);
      this.confirmTimeSlotBtn.disabled = false;
      return;
    } finally {
      this.isSubmitting = false;
    }
  }

  resetForm() {
    this.form.reset();
    this.timeSlotSelection.style.opacity = "0";
    setTimeout(() => {
      this.timeSlotSelection.classList.add("hidden");
      this.formContent.classList.remove("hidden");
      setTimeout(() => {
        this.formContent.style.opacity = "1";
      }, 50);
    }, 300);

    this.successMessage.classList.remove("active");
    this.errorMessage.classList.remove("active");
    this.confirmTimeSlotBtn.disabled = true;
    this.selectedTimeSlot = null;
    this.formData = null;
    this.hasSubmitted = false;
    this.isSubmitting = false;
  }

  showLoader() {
    if (this.loaderContainer) {
      this.loaderContainer.classList.add("active");
      this.form.classList.add("loading");
    }
  }

  hideLoader() {
    if (this.loaderContainer) {
      this.loaderContainer.classList.remove("active");
      this.form.classList.remove("loading");
    }
  }

  showSuccess() {
    // Clear any error message first
    this.errorMessage.classList.remove("active");
    if (this.successMessage) {
      this.successMessage.classList.add("active");
    }
  }

  showError(message) {
    // Clear any success message first
    this.successMessage.classList.remove("active");
    const errorContent = this.errorMessage.querySelector("p");
    if (errorContent) {
      errorContent.textContent = message;
    }
    this.errorMessage.classList.add("active");
    setTimeout(() => {
      this.errorMessage.classList.remove("active");
    }, 3000);
  }

  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
}

// Initialize form handler when document is ready
document.addEventListener("DOMContentLoaded", () => {
  window.formHandler = new FormHandler();
});
