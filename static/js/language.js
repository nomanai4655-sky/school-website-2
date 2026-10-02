// ---------- Simple English / Urdu text toggle ----------
// Swaps text for any element with data-en / data-ur attributes.
// This covers navigation and page headings as a starting point —
// you can extend it by adding data-en="..." data-ur="..." to more
// elements across the templates.

function setLanguage(lang) {
    document.querySelectorAll("[data-en]").forEach(function (el) {
        const text = lang === "ur" ? el.getAttribute("data-ur") : el.getAttribute("data-en");
        if (text) {
            el.textContent = text;
        }
    });
    localStorage.setItem("site_lang", lang);

    const enBtn = document.getElementById("lang-en-btn");
    const urBtn = document.getElementById("lang-ur-btn");
    if (enBtn) enBtn.classList.toggle("active", lang === "en");
    if (urBtn) urBtn.classList.toggle("active", lang === "ur");
}

document.addEventListener("DOMContentLoaded", function () {
    const saved = localStorage.getItem("site_lang") || "en";
    setLanguage(saved);
});
