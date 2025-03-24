// translations.js
const TRANSLATIONS = {
  ro: {
    weekDays: ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"],
    months: [
      "Ianuarie",
      "Februarie",
      "Martie",
      "Aprilie",
      "Mai",
      "Iunie",
      "Iulie",
      "August",
      "Septembrie",
      "Octombrie",
      "Noiembrie",
      "Decembrie",
    ],
    errors: {
      generic: "A apărut o eroare. Vă rugăm să încercați din nou.",
      menuToggle: "Eroare la deschiderea meniului",
      formSubmission: "A apărut o eroare la procesarea formularului",
      calendarLoad: "A apărut o eroare la încărcarea calendarului",
      missingFormData: "Datele formularului lipsesc",
      invalidRequest: "Cerere invalidă",
      calendarService: "Nu s-a putut conecta la serviciul de calendar",
      workingHours: "Programările se pot face doar între orele 11:00-19:00 (GMT+1)",
      slotUnavailable: "Acest interval orar nu mai este disponibil",
      cookie_refused: "Ați refuzat cookie-urile, iar site-ul nu poate fi utilizat fără acestea. Reîmprospătați pagina și acceptați cookie-urile pentru a continua.",
    },
    form: {
      required_field: "Vă rugăm să completați toate câmpurile obligatorii",
      select_time: "Vă rugăm să selectați o oră",
      submission_error: "Nu s-a putut finaliza programarea",
      success: "Programare realizată cu succes!",
      calendar_load_error: "Eroare la încărcarea calendarului",
      missing_form_data: "Datele formularului lipsesc",
      duplicate_submission: "Această programare a fost deja trimisă",
    },
    calendar: {
      no_weekend_appointments: "Nu se fac programări în weekend",
      fetch_slots_error: "Nu s-au putut încărca intervalele orare",
      load_slots_error: "Nu s-au putut încărca intervalele orare",
      no_available_slots: "Nu există intervale disponibile pentru această zi",
      working_hours: "Program de lucru: 11:00 - 20:00",
      select_date: "Selectați o dată",
    },
    navigation: {
      home: "Acasă",
      services: "Servicii",
      about: "Despre mine",
      contact: "Contact",
      blog: "Blog",
    },
    blog: {
      back_to_blog: "Înapoi la Blog",
      published_on: "Publicat pe",
      written_by: "Scris de",
      read_more: "Citește mai mult",
    },
    mobile: {
      swipe_left: "Glisați la stânga",
      swipe_right: "Glisați la dreapta",
      tap_to_select: "Atingeți pentru a selecta",
      pull_to_refresh: "Trageți pentru a reîmprospăta",
      loading: "Se încarcă...",
      tap_to_close: "Atingeți pentru a închide",
      tap_to_expand: "Atingeți pentru a extinde",
      tap_to_collapse: "Atingeți pentru a restrânge",
      scroll_to_top: "Derulați în sus",
      connection_error: "Verificați conexiunea la internet",
      retry: "Încercați din nou",
      hold_to_delete: "Țineți apăsat pentru a șterge"
    },
    touch: {
      feedback_success: "Acțiune reușită",
      feedback_error: "Acțiune eșuată",
      feedback_warning: "Atenție",
      feedback_info: "Informație"
    }
  },
  en: {
    // English translations with same structure
    weekDays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    errors: {
      generic: "An error occurred. Please try again.",
      menuToggle: "Error opening menu",
      formSubmission: "An error occurred while processing the form",
      calendarLoad: "Error loading calendar",
      missingFormData: "Form data is missing",
      invalidRequest: "Invalid request",
      calendarService: "Could not connect to calendar service",
      workingHours: "Appointments can only be made between 11:00-19:00 (GMT+1)",
      slotUnavailable: "This time slot is no longer available",
      cookie_refused: "You refused cookies, and the website cannot function without them. Refresh the page and accept cookies to continue.",
    },
    form: {
      required_field: "Please fill in all required fields",
      select_time: "Please select a time",
      submission_error: "Could not complete the appointment",
      success: "Appointment successfully scheduled!",
      calendar_load_error: "Error loading calendar",
      missing_form_data: "Form data is missing",
      duplicate_submission: "This appointment has already been submitted",
    },
    calendar: {
      no_weekend_appointments: "No appointments on weekends",
      fetch_slots_error: "Could not fetch time slots",
      load_slots_error: "Could not load time slots",
      no_available_slots: "No available slots for this day",
      working_hours: "Working hours: 11:00 AM - 8:00 PM",
      select_date: "Select a date",
    },
    navigation: {
      home: "Home",
      services: "Services",
      about: "About",
      contact: "Contact",
      blog: "Blog",
    },
blog: {
  published_on: "Published on",
  written_by: "Written by", 
  read_more: "Read more",
  back_to_blog: "Back to Blog"
},
mobile: {
  swipe_left: "Swipe left",
  swipe_right: "Swipe right", 
  tap_to_select: "Tap to select",
  pull_to_refresh: "Pull to refresh",
  loading: "Loading...",
  tap_to_close: "Tap to close",
  tap_to_expand: "Tap to expand",
  tap_to_collapse: "Tap to collapse",
  scroll_to_top: "Scroll to top",
  connection_error: "Check internet connection",
  retry: "Try again",
  hold_to_delete: "Hold to delete"
},

touch: {
  feedback_success: "Action successful",
  feedback_error: "Action failed",
  feedback_warning: "Warning",
  feedback_info: "Information"
}

  },
  es: {
    weekDays: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    months: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
    errors: {
      generic: "Se produjo un error. Por favor, inténtelo de nuevo.",
      menuToggle: "Error al abrir el menú",
      formSubmission: "Se produjo un error al procesar el formulario",
      calendarLoad: "Error al cargar el calendario",
      missingFormData: "Faltan datos del formulario",
      invalidRequest: "Solicitud inválida",
      calendarService: "No se pudo conectar al servicio de calendario",
      workingHours: "Las citas solo se pueden hacer entre las 11:00-19:00 (GMT+1)",
      slotUnavailable: "Este horario ya no está disponible",
      cookie_refused: "Ha rechazado las cookies y el sitio web no puede funcionar sin ellas. Actualice la página y acepte las cookies para continuar.",
    },
    form: {
      required_field: "Por favor complete todos los campos requeridos",
      select_time: "Por favor seleccione una hora",
      submission_error: "No se pudo completar la cita",
      success: "¡Cita programada con éxito!",
      calendar_load_error: "Error al cargar el calendario",
      missing_form_data: "Faltan datos del formulario",
      duplicate_submission: "Esta cita ya ha sido enviada",
    },
    calendar: {
      no_weekend_appointments: "No hay citas los fines de semana",
      fetch_slots_error: "No se pudieron obtener los horarios",
      load_slots_error: "No se pudieron cargar los horarios",
      no_available_slots: "No hay horarios disponibles para este día",
      working_hours: "Horario: 11:00 - 20:00",
      select_date: "Seleccione una fecha",
    },
    navigation: {
      home: "Inicio",
      services: "Servicios",
      about: "Sobre mí",
      contact: "Contacto",
      blog: "Blog",
    },
    blog: {
      back_to_blog: "Volver al Blog",
      published_on: "Publicado el",
      written_by: "Escrito por",
      read_more: "Leer más",
    },
    mobile: {
      swipe_left: "Desliza a la izquierda",
      swipe_right: "Desliza a la derecha",
      tap_to_select: "Toca para seleccionar",
      pull_to_refresh: "Tira para actualizar",
      loading: "Cargando...",
      tap_to_close: "Toca para cerrar",
      tap_to_expand: "Toca para expandir",
      tap_to_collapse: "Toca para contraer",
      scroll_to_top: "Desplázate hacia arriba",
      connection_error: "Verifica la conexión a internet",
      retry: "Intentar de nuevo",
      hold_to_delete: "Mantén presionado para eliminar"
    },

    touch: {
      feedback_success: "Acción exitosa",
      feedback_error: "Acción fallida",
      feedback_warning: "Advertencia",
      feedback_info: "Información"
    }
  },
};

const getCurrentLanguage = () => {
  return document.documentElement.lang || "ro";
};

const getTranslation = (key, section = "errors") => {
  const lang = getCurrentLanguage();
  return TRANSLATIONS[lang]?.[section]?.[key] || TRANSLATIONS["ro"][section][key];
};

// Export for use in other files
window.translations = {
  get: getTranslation,
  getCurrentLanguage,
};
