/* Jacob Zhu portfolio — shared behavior: scroll reveal + theme toggle */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Scroll reveal ---------------- */
  function initReveal() {
    var targets = document.querySelectorAll(
      ".card, .project-card, .hero-content, .contact-item, .process-step"
    );
    if (!targets.length) return;

    targets.forEach(function (el) {
      el.classList.add("reveal");
    });

    if (prefersReduced || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, index) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var delay = Math.min(index * 40, 200);
            setTimeout(function () {
              el.classList.add("is-visible");
            }, delay);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------------- Dark mode toggle ---------------- */
  function initTheme() {
    var root = document.documentElement;
    var toggle = document.getElementById("theme-toggle");
    var stored = null;
    try {
      stored = localStorage.getItem("jz-theme");
    } catch (e) {
      /* localStorage unavailable — fall back to system preference only */
    }

    var systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var initial = stored || (systemDark ? "dark" : "light");
    applyTheme(initial);

    if (toggle) {
      toggle.addEventListener("click", function () {
        var current = root.getAttribute("data-theme") || "light";
        var next = current === "dark" ? "light" : "dark";
        applyTheme(next);
        try {
          localStorage.setItem("jz-theme", next);
        } catch (e) {
          /* ignore */
        }
      });
    }

    function applyTheme(mode) {
      root.setAttribute("data-theme", mode);
      if (toggle) {
        toggle.textContent = mode === "dark" ? "☀" : "☾";
        toggle.setAttribute(
          "aria-label",
          mode === "dark" ? "Switch to light mode" : "Switch to dark mode"
        );
      }
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    initReveal();
    initTheme();
  });
})();
