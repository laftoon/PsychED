document.addEventListener('DOMContentLoaded', () => {
  const languageButton = document.querySelector('.language-button');
  const languageDropdown = document.querySelector('.language-dropdown');

  if (languageButton && languageDropdown) {
    languageButton.addEventListener('click', (e) => {
      e.stopPropagation();
      languageDropdown.classList.toggle('active');
      languageButton.setAttribute('aria-expanded', 
        languageDropdown.classList.contains('active'));
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!languageDropdown.contains(e.target) && !languageButton.contains(e.target)) {
        languageDropdown.classList.remove('active');
        languageButton.setAttribute('aria-expanded', 'false');
      }
    });

    // Close dropdown when pressing Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && languageDropdown.classList.contains('active')) {
        languageDropdown.classList.remove('active');
        languageButton.setAttribute('aria-expanded', 'false');
      }
    });
  }
});
