document.addEventListener("DOMContentLoaded", function() {
    console.log("Landing page loaded!");

    const button = document.querySelector(".btn-hover");
    button.addEventListener("click", function() {
        alert("You clicked the button!");
    });
});
