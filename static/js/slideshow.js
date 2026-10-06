// ---------- Home page gallery slideshow ----------
// Cycles through the images every 5 seconds with a fade transition.

document.addEventListener("DOMContentLoaded", function () {
    const slides = document.querySelectorAll(".slideshow-img");
    if (slides.length === 0) return;

    let current = 0;
    setInterval(function () {
        slides[current].classList.remove("active");
        current = (current + 1) % slides.length;
        slides[current].classList.add("active");
    }, 5000);
});
