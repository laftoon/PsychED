class HeroHandler {
    constructor() {
      this.scrollButtons = document.querySelectorAll(".scroll-to-contact");
      this.contactSection = document.getElementById("contact-section");
      this.init();
    }
  
    init() {
      this.scrollButtons.forEach(button => {
        button.addEventListener("click", (e) => {
          e.preventDefault();
          const path = window.location.pathname;
          const isHome = path === "/" || path.endsWith("/home/") || path === "/home" ||
                         /^\/(en|ro|es)\/?$/.test(path) || /^\/(en|ro|es)\/home\/?$/.test(path);
          if (isHome && this.contactSection) {
            this.contactSection.scrollIntoView({ behavior: "smooth" });
          } else {
            window.location.href = '/#contact-section';
          }
        });
      });
  
      window.addEventListener('load', () => {
        if (window.location.hash === '#contact-section' && this.contactSection) {
          setTimeout(() => {
            this.contactSection.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      });
    }
  }