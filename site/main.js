(function () {
  var root = document.documentElement;

  // Thème clair / sombre, mémorisé dans le navigateur
  var themeBtn = document.getElementById("theme");
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  function applyThemeColor() {
    if (themeMeta) themeMeta.setAttribute("content", root.dataset.theme === "light" ? "#F6F5F1" : "#0A0D12");
  }
  applyThemeColor();
  themeBtn.addEventListener("click", function () {
    root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
    applyThemeColor();
  });

  // Menu mobile
  var menu = document.getElementById("menu");
  var menuBtn = document.getElementById("menu-btn");
  function closeMenu() {
    menu.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  }
  menuBtn.addEventListener("click", function () {
    var open = menu.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeMenu); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });

  // Bordure de la barre de navigation après défilement
  var nav = document.querySelector(".nav");
  function onScroll() { nav.classList.toggle("scrolled", window.scrollY > 8); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Apparition des blocs et lien actif dans le menu
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
    reveals.forEach(function (el) { io.observe(el); });

    var links = menu.querySelectorAll("a");
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.setAttribute("aria-current", a.getAttribute("href") === "#" + entry.target.id ? "true" : "false");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    links.forEach(function (a) {
      var target = document.querySelector(a.getAttribute("href"));
      if (target) spy.observe(target);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // Copie de l'adresse e-mail
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(btn.dataset.copy).then(function () {
        btn.classList.add("done");
        btn.setAttribute("aria-label", "Adresse copiée");
        setTimeout(function () {
          btn.classList.remove("done");
          btn.setAttribute("aria-label", "Copier l'adresse e-mail");
        }, 1800);
      }).catch(function () {});
    });
  });

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
