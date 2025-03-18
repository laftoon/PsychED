document.addEventListener('DOMContentLoaded', () => {
    const languageSelector = document.querySelector('.language-selector');
    const languageButton = document.querySelector('.language-selector__button');
    const dropdown = document.querySelector('.language-selector__dropdown');
    
    if (languageButton && dropdown) {
        // Toggle dropdown on button click
        languageButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!languageSelector.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });

        // Handle language option clicks
        dropdown.addEventListener('click', async (e) => {
            const option = e.target.closest('.language-selector__option');
            if (option) {
                e.preventDefault();
                dropdown.classList.remove('active');

                // Get the language code from the URL
                const url = new URL(option.href);
                const lang = url.searchParams.get('lang');

                try {
                    // Make the request to change the language
                    const response = await fetch(option.href);
                    if (response.ok) {
                        // Reload the page to show the new language
                        window.location.reload();
                    } else {
                        console.error('Failed to change language');
                    }
                } catch (error) {
                    console.error('Error changing language:', error);
                }
            }
        });

        // Update active state based on current language
        const currentLang = document.documentElement.lang;
        const options = dropdown.querySelectorAll('.language-selector__option');
        options.forEach(option => {
            const url = new URL(option.href);
            const lang = url.searchParams.get('lang');
            if (lang === currentLang) {
                option.classList.add('active');
            }
        });
    }
});
