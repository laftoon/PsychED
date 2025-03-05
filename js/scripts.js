document.addEventListener("DOMContentLoaded", function() {
    console.log("Landing page loaded!");

    // Add scroll effect for navbar
    window.addEventListener('scroll', function() {
        const topbar = document.querySelector('.topbar');
        if (window.scrollY > 50) {
            topbar.classList.add('scrolled');
        } else {
            topbar.classList.remove('scrolled');
        }
    });
});
