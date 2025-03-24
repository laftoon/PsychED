class CalendarHandler {
  constructor() {
    this.selectedDate = this.getNextWorkingDay(new Date());
    this.workingDays = [];
    this.currentDateSpan = document.querySelector(".current-date");
    this.prevDayBtn = document.getElementById("prev-day");
    this.nextDayBtn = document.getElementById("next-day");
    this.timeSlots = document.getElementById("time-slots");
    this.currentLanguage = document.documentElement.lang || 'ro';
  }

  getNextWorkingDay(date) {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay;
  }

  initializeWorkingDays() {
  this.workingDays = [];
  let currentDate = new Date();

  // If current day is after work hours (after 7 PM Madrid time), start from next day
  const madridTime = new Date(currentDate.toLocaleString('en-US', { timeZone: 'Europe/Madrid' }));
  const currentHour = madridTime.getHours();
  if (currentHour >= 19) {
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Get next 7 working days (excluding weekends)
  let daysAdded = 0;
  let i = 1;
  while (daysAdded < 7) {
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + i);
    
    // Skip weekends
    const dayOfWeek = nextDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      this.workingDays.push(new Date(nextDate));
      daysAdded++;
    }
    i++;
  }

  // Set selected date to first available day
  this.selectedDate = this.workingDays[0];
  this.updateDateDisplay();
  this.updateNavigationButtons();
}


  navigateDay(increment) {
    const currentIndex = this.workingDays.findIndex((date) => 
      date.toDateString() === this.selectedDate.toDateString()
    );

    const newIndex = currentIndex + increment;

    if (newIndex >= 0 && newIndex < this.workingDays.length) {
      if (this.currentDateSpan) {
        const direction = increment > 0 ? "left" : "right";
        this.currentDateSpan.classList.add(`slide-${direction}`);

        setTimeout(() => {
          this.selectedDate = this.workingDays[newIndex];
          this.updateDateDisplay();
          this.currentDateSpan.classList.remove(`slide-${direction}`);
          this.updateNavigationButtons();

          // Only fetch time slots for weekdays
          if (this.selectedDate.getDay() !== 0 && this.selectedDate.getDay() !== 6) {
            this.fetchAndDisplayTimeSlots();
          } else {
            // Show translated weekend message
            if (this.timeSlots) {
              this.timeSlots.innerHTML = `<div class="no-slots-message">${window.translations.get('no_weekend_appointments', 'calendar')}</div>`;
            }
          }
        }, 300);
      }
    }
  }

  updateNavigationButtons() {
    if (this.prevDayBtn) {
      this.prevDayBtn.disabled = this.selectedDate.toDateString() === this.workingDays[0].toDateString();
    }
    if (this.nextDayBtn) {
      this.nextDayBtn.disabled = this.selectedDate.toDateString() === this.workingDays[6].toDateString();
    }
  }

  updateDateDisplay() {
    if (this.currentDateSpan) {
      this.currentDateSpan.textContent = this.selectedDate.toLocaleDateString(this.currentLanguage, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  }

async fetchAndDisplayTimeSlots() {
  try {
    // Use the non-prefixed API URL
    const url = `/get_time_slots/`;
    
    const response = await fetch(url, {
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
      throw new Error(data.error || window.translations.get('fetch_slots_error', 'calendar'));
    }
  } catch (error) {
    console.error("Error fetching time slots:", error);
    if (this.timeSlots) {
      this.timeSlots.innerHTML = `<div class="no-slots-message">${window.translations.get('load_slots_error', 'calendar')}</div>`;
    }
  }
}



  displayTimeSlots(slots) {
    if (!this.timeSlots) return;

    this.timeSlots.innerHTML = "";

    if (!slots || slots.length === 0) {
      this.timeSlots.innerHTML = `<div class="no-slots-message">${window.translations.get('no_available_slots', 'calendar')}</div>`;
      return;
    }

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
      this.timeSlots.appendChild(button);
    });
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

// Initialize calendar handler when document is ready
document.addEventListener("DOMContentLoaded", () => {
  window.calendarHandler = new CalendarHandler();
});