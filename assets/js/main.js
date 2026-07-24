/* =============================================================================
   main.js — renders the page from data.js and handles language / theme / filter
   ========================================================================== */

(function () {
  "use strict";

  var lang  = localStorage.getItem("pf-lang")  || "en";
  var theme = localStorage.getItem("pf-theme") || "dark";
  var filter = "all";

  /* -- helpers ------------------------------------------------------------ */

  // Content in data.js is authored as trusted HTML (it contains <b>, <code>…).
  function t(field) {
    if (field == null) return "";
    if (typeof field === "string") return field;
    return field[lang] != null ? field[lang] : (field.en || "");
  }

  function el(id) { return document.getElementById(id); }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* -- render ------------------------------------------------------------- */

  function renderHeaderAndHero() {
    el("brand-mark").textContent = PROFILE.initials;
    el("brand-name").textContent = PROFILE.name;

    el("nav-projects").innerHTML = t(UI.navProjects);
    el("nav-skills").innerHTML   = t(UI.navSkills);
    el("nav-exp").innerHTML      = t(UI.navExp);
    el("nav-contact").innerHTML  = t(UI.navContact);

    el("hero-eyebrow").innerHTML = t(PROFILE.location) + " · " + t(UI.openTo);
    el("hero-name").textContent  = PROFILE.name;
    el("hero-role").innerHTML    = t(PROFILE.role);
    el("hero-school").innerHTML  = t(PROFILE.school);
    el("hero-tagline").innerHTML = t(PROFILE.tagline);

    var acts = [];
    acts.push('<a class="btn primary" href="mailto:' + esc(PROFILE.email) + '">' + t(UI.emailMe) + '</a>');
    if (PROFILE.github)   acts.push('<a class="btn" href="' + esc(PROFILE.github) + '" target="_blank" rel="noopener">GitHub</a>');
    if (PROFILE.linkedin) acts.push('<a class="btn" href="' + esc(PROFILE.linkedin) + '" target="_blank" rel="noopener">LinkedIn</a>');
    if (PROFILE.phone)    acts.push('<a class="btn" href="tel:' + esc(PROFILE.phone.replace(/\s/g, "")) + '">' + esc(PROFILE.phone) + '</a>');
    el("hero-actions").innerHTML = acts.join("");

    el("hero-stats").innerHTML = PROFILE.stats.map(function (s) {
      return '<div class="stat"><div class="v">' + esc(s.value) + '</div><div class="l">' + t(s.label) + "</div></div>";
    }).join("");
  }

  function shotMarkup(p, wide) {
    if (p.images && p.images.length) {
      return '<div class="shot"><img src="assets/img/' + esc(p.images[0]) +
             '" alt="" loading="lazy"></div>';
    }
    var initial = t(p.title).replace(/<[^>]+>/g, "").trim().charAt(0).toUpperCase();
    return '<div class="shot plain"><span>' + esc(initial) + "</span></div>";
  }

  function cardMarkup(p) {
    var wide = !!p.featured;
    var paras = (p.body && p.body[lang] ? p.body[lang] : (p.body ? p.body.en : [])) || [];

    var extra = "";
    if (p.images && p.images.length > 1) {
      extra = '<div class="extra-shots">' + p.images.slice(1).map(function (im) {
        return '<img src="assets/img/' + esc(im) + '" alt="" loading="lazy">';
      }).join("") + "</div>";
    }

    return '' +
      '<article class="card' + (wide ? " wide" : "") + '" data-cats="' + esc(p.cats.join(" ")) + '" data-id="' + esc(p.id) + '">' +
        shotMarkup(p, wide) +
        '<div class="meta">' +
          '<div class="yr">' + esc(p.year) + "</div>" +
          "<h3>" + t(p.title) + "</h3>" +
          '<p class="sub">' + t(p.subtitle) + "</p>" +
          '<div class="tags">' + p.tags.map(function (g) { return "<span>" + esc(g) + "</span>"; }).join("") + "</div>" +
          '<button class="toggle" type="button" data-target="' + esc(p.id) + '">' + t(UI.readMore) + "</button>" +
          '<div class="detail" id="detail-' + esc(p.id) + '">' +
            paras.map(function (x) { return "<p>" + x + "</p>"; }).join("") +
            extra +
          "</div>" +
        "</div>" +
      "</article>";
  }

  function renderProjects() {
    el("sec-projects-title").innerHTML = t(UI.featured);
    el("filters").innerHTML = CATEGORIES.map(function (c) {
      return '<button type="button" data-cat="' + esc(c.id) + '" aria-pressed="' +
             (c.id === filter) + '">' + t(c.label) + "</button>";
    }).join("");
    el("grid").innerHTML = PROJECTS.map(cardMarkup).join("");
    applyFilter();
  }

  function applyFilter() {
    var cards = document.querySelectorAll("#grid .card");
    for (var i = 0; i < cards.length; i++) {
      var cats = cards[i].getAttribute("data-cats").split(" ");
      var show = filter === "all" || cats.indexOf(filter) !== -1;
      cards[i].classList.toggle("hidden", !show);
    }
  }

  function renderSkills() {
    el("sec-skills-title").innerHTML = t(UI.skillsTitle);
    el("skillgrid").innerHTML = SKILLS.map(function (s) {
      return '<div class="skillcard"><h3>' + t(s.group) + "</h3><ul>" +
             s.items.map(function (i) { return "<li>" + i + "</li>"; }).join("") +
             "</ul></div>";
    }).join("");
    el("langrow").innerHTML = LANGUAGES.map(function (l) {
      return "<div><strong>" + t(l.name) + "</strong> — <em>" + t(l.level) + "</em></div>";
    }).join("");
  }

  function renderExperience() {
    el("sec-exp-title").innerHTML = t(UI.expTitle);
    el("timeline").innerHTML = EXPERIENCE.map(function (e) {
      return '<div class="tl-item">' +
        '<div class="period">' + t(e.period) + "</div>" +
        "<h3>" + t(e.role) + "</h3>" +
        '<p class="org">' + t(e.org) + "</p>" +
        '<p class="det">' + t(e.detail) + "</p>" +
      "</div>";
    }).join("");
  }

  function renderContact() {
    el("sec-contact-title").innerHTML = t(UI.contactTitle);
    el("contact-text").innerHTML = t(UI.contactText);

    var links = ['<a class="btn primary" href="mailto:' + esc(PROFILE.email) + '">' + esc(PROFILE.email) + "</a>"];
    if (PROFILE.phone)    links.push('<a class="btn" href="tel:' + esc(PROFILE.phone.replace(/\s/g, "")) + '">' + esc(PROFILE.phone) + "</a>");
    if (PROFILE.github)   links.push('<a class="btn" href="' + esc(PROFILE.github) + '" target="_blank" rel="noopener">GitHub</a>');
    if (PROFILE.linkedin) links.push('<a class="btn" href="' + esc(PROFILE.linkedin) + '" target="_blank" rel="noopener">LinkedIn</a>');
    el("contact-links").innerHTML = links.join("");

    el("footer-note").innerHTML = t(UI.footer);
    el("footer-name").textContent = "© " + new Date().getFullYear() + " " + PROFILE.name;
  }

  function renderAll() {
    document.documentElement.lang = lang;
    document.title = PROFILE.name + " — " + t(PROFILE.role).replace(/&amp;/g, "&");
    renderHeaderAndHero();
    renderProjects();
    renderSkills();
    renderExperience();
    renderContact();
    syncLangButtons();
  }

  /* -- controls ----------------------------------------------------------- */

  function syncLangButtons() {
    ["en", "fr"].forEach(function (l) {
      el("lang-" + l).setAttribute("aria-pressed", String(l === lang));
    });
  }

  function setTheme(next) {
    theme = next;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("pf-theme", theme);
    el("theme-btn").textContent = theme === "dark" ? "☀" : "☾";
  }

  document.addEventListener("click", function (ev) {
    var b = ev.target.closest ? ev.target.closest("button") : null;
    if (!b) return;

    if (b.id === "lang-en" || b.id === "lang-fr") {
      lang = b.id.slice(5);
      localStorage.setItem("pf-lang", lang);
      renderAll();
      return;
    }
    if (b.id === "theme-btn") { setTheme(theme === "dark" ? "light" : "dark"); return; }
    if (b.id === "print-btn") { window.print(); return; }

    if (b.hasAttribute("data-cat")) {
      filter = b.getAttribute("data-cat");
      var all = el("filters").querySelectorAll("button");
      for (var i = 0; i < all.length; i++) {
        all[i].setAttribute("aria-pressed", String(all[i].getAttribute("data-cat") === filter));
      }
      applyFilter();
      return;
    }

    if (b.classList.contains("toggle")) {
      var d = el("detail-" + b.getAttribute("data-target"));
      var open = d.classList.toggle("open");
      b.innerHTML = open ? t(UI.readLess) : t(UI.readMore);
      return;
    }
  });

  /* -- go ----------------------------------------------------------------- */

  setTheme(theme);
  renderAll();
})();
