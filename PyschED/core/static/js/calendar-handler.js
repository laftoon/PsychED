// calendar-handler.js
class CalendarHandler {
  constructor() {
    this.selectedDate = this.getNextWorkingDay(new Date());
    this.workingDays = [];
    this.currentDateSpan = document.querySelector(".current-date");
    this.prevDayBtn = document.getElementById("prev-day");
    this.nextDayBtn = document.getElementById("next-day");
    this.timeSlots = document.getElementById("time-slots");
  }

  getNextWorkingDay(date) {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay;
  }

  initializeWorkingDays() {
    this.workingDays = [];
    let currentDate = new Date();

    // If current day is after work hours (after 8 PM), start from next day
    const currentHour = currentDate.getHours();
    if (currentHour >= 20) {
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Get next 7 days
    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + i + 1);
      this.workingDays.push(new Date(nextDate));
    }

    // Set selected date to first available day
    this.selectedDate = this.workingDays[0];
    this.updateDateDisplay();
    this.updateNavigationButtons();
  }

  navigateDay(increment) {
    const currentIndex = this.workingDays.findIndex(
      (date) => date.toDateString() === this.selectedDate.toDateString()
    );

    const newIndex = currentIndex + increment;

    if (newIndex >= 0 && newIndex < this.workingDays.length) {
      // Add slide animation
      if (this.currentDateSpan) {
        const direction = increment > 0 ? "left" : "right";
        this.currentDateSpan.classList.add(`slide-${direction}`);

        setTimeout(() => {
          this.selectedDate = this.workingDays[newIndex];
          this.updateDateDisplay();
          this.currentDateSpan.classList.remove(`slide-${direction}`);
          this.updateNavigationButtons();

          // Only fetch time slots for weekdays
          if (
            this.selectedDate.getDay() !== 0 &&
            this.selectedDate.getDay() !== 6
          ) {
            this.fetchAndDisplayTimeSlots();
          } else {
            // Show message for weekends
            if (this.timeSlots) {
              this.timeSlots.innerHTML =
                '<div class="no-slots-message">Nu se fac programări în weekend</div>';
            }
          }
        }, 300);
      }
    }
  }

  updateNavigationButtons() {
    if (this.prevDayBtn) {
      this.prevDayBtn.disabled =
        this.selectedDate.toDateString() === this.workingDays[0].toDateString();
    }
    if (this.nextDayBtn) {
      this.nextDayBtn.disabled =
        this.selectedDate.toDateString() === this.workingDays[6].toDateString();
    }
  }

  updateDateDisplay() {
    if (this.currentDateSpan) {
      this.currentDateSpan.textContent = this.selectedDate.toLocaleDateString(
        "ro-RO",
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );
    }
  }

  // Fetch and display time slots
  async fetchAndDisplayTimeSlots() {
    try {
      const response = await fetch("/get_time_slots/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": this.getCookie("csrftoken"),
        },
        body: JSON.stringify({
          date: this.selectedDate.toISOString().split("T")[0],
        }),
      });

      const data = await response.json();

      if (data.success) {
        this.displayTimeSlots(data.free_slots);
      } else {
        throw new Error(data.error || "Failed to fetch time slots");
      }
    } catch (error) {
      console.error("Error fetching time slots:", error);
      if (this.timeSlots) {
        this.timeSlots.innerHTML =
          '<div class="no-slots-message">Nu s-au putut încărca intervalele orare</div>';
      }
    }
  }

  // Display time slots
  displayTimeSlots(slots) {
    if (!this.timeSlots) return;

    this.timeSlots.innerHTML = "";

    if (!slots || slots.length === 0) {
      this.timeSlots.innerHTML =
        '<div class="no-slots-message">Nu există intervale disponibile pentru această zi</div>';
      return;
    }

    slots.forEach((slot) => {
      const time = new Date(slot);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "time-slot";
      button.dataset.time = time.toTimeString().slice(0, 8);
      button.textContent = time.toLocaleTimeString("ro-RO", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      this.timeSlots.appendChild(button);
    });
  }

  // Helper function to get cookies
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

// Initialize calendar handler when document is ready
document.addEventListener("DOMContentLoaded", () => {
  window.calendarHandler = new CalendarHandler();
});
