/* main.js — interacción mínima (menú móvil, año dinámico) */
(function () {
  "use strict";
  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") links.classList.remove("open");
    });
  }
  var y = document.querySelectorAll("[data-year]");
  var year = new Date().getFullYear();
  y.forEach(function (n) {
    n.textContent = year;
  });
})();
