document.addEventListener('DOMContentLoaded', () => {
    const languageSelector = document.querySelector('.language-selector');
    const languageButton = document.querySelector('.language-selector__button');
    const dropdown = document.querySelector('.language-selector__dropdown');
    let isDropdownOpen = false;

    if (languageButton && dropdown) {
        // Add ARIA attributes for accessibility
        languageButton.setAttribute('aria-haspopup', 'true');
        languageButton.setAttribute('aria-expanded', 'false');
        
        // Toggle dropdown on button click
        languageButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleDropdown();
        });

        // Handle keyboard navigation
        languageButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleDropdown();
            } else if (e.key === 'Escape' && isDropdownOpen) {
                closeDropdown();
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!languageSelector.contains(e.target)) {
                closeDropdown();
            }
        });

        // Touch events for mobile
        if ('ontouchstart' in window) {
            let touchStartY = 0;
            let touchEndY = 0;

            dropdown.addEventListener('touchstart', (e) => {
                touchStartY = e.touches[0].clientY;
            }, { passive: true });

            dropdown.addEventListener('touchmove', (e) => {
                touchEndY = e.touches[0].clientY;
                const diff = touchStartY - touchEndY;

                // Prevent body scroll when scrolling dropdown
                if (Math.abs(diff) > 5) {
                    e.preventDefault();
                }
            }, { passive: false });
        }

        // Handle language option clicks
        dropdown.addEventListener('click', async (e) => {
            const option = e.target.closest('.language-selector__option');
            if (option) {
                e.preventDefault();
                closeDropdown();

                // Show loading state
                option.style.opacity = '0.7';
                
                try {
                    // Get the language code from the URL
                    const url = new URL(option.href);
                    const lang = url.searchParams.get('lang');

                    // Make the request to change the language
                    const response = await fetch(option.href);
                    if (response.ok) {
                        // Reload the page to show the new language
                        window.location.reload();
                    } else {
                        console.error('Failed to change language');
                        showError();
                    }
                } catch (error) {
                    console.error('Error changing language:', error);
                    showError();
                } finally {
                    option.style.opacity = '1';
                }
            }
        });

        // Update active state based on current language
        updateActiveLanguage();
    }

    function toggleDropdown() {
        isDropdownOpen = !isDropdownOpen;
        dropdown.classList.toggle('active');
        languageButton.setAttribute('aria-expanded', isDropdownOpen);

        if (isDropdownOpen) {
            // Focus first option when opening
            const firstOption = dropdown.querySelector('.language-selector__option');
            if (firstOption) firstOption.focus();
        }
    }

    function closeDropdown() {
        isDropdownOpen = false;
        dropdown.classList.remove('active');
        languageButton.setAttribute('aria-expanded', 'false');
    }

    function updateActiveLanguage() {
        const currentLang = document.documentElement.lang;
        const options = dropdown.querySelectorAll('.language-selector__option');
        
        options.forEach(option => {
            const url = new URL(option.href);
            const lang = url.searchParams.get('lang');
            
            option.classList.toggle('active', lang === currentLang);
            if (lang === currentLang) {
                option.setAttribute('aria-current', 'true');
            }
        });
    }

    function showError() {
        // Simple error feedback
        languageButton.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            languageButton.style.animation = '';
        }, 500);
    }

    // Add error animation keyframes
    if (!document.querySelector('#language-selector-styles')) {
        const style = document.createElement('style');
        style.id = 'language-selector-styles';
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);
    }
});
