/* main.js — interacción mínima (menú móvil, año dinámico, analítica) */
(function () {
  "use strict";
  var CLARITY_PROJECT_ID = "xhiggh278w";

  function initClarity(projectId) {
    if (!projectId || window.clarity) return;

    window.clarity = function () {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };

    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.clarity.ms/tag/" + encodeURIComponent(projectId) + "?ref=npm";
    script.setAttribute("data-clarity-project", projectId);

    var firstScript = document.getElementsByTagName("script")[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }
  }

  initClarity(CLARITY_PROJECT_ID);

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
