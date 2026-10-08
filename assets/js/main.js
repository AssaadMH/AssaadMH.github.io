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

  // Body/title fields are authored as HTML; alt and aria need plain text.
  function plain(field) {
    return t(field).replace(/<[^>]+>/g, "")
                   .replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").trim();
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* -- render ------------------------------------------------------------- */

  function renderHeaderAndHero() {
    el("brand-mark").textContent = PROFILE.initials;
    el("brand-name").textContent = PROFILE.name;

    el("nav-about").innerHTML    = t(UI.navAbout);
    el("nav-projects").innerHTML = t(UI.navProjects);
    el("nav-skills").innerHTML   = t(UI.navSkills);
    el("nav-exp").innerHTML      = t(UI.navExp);
    el("nav-contact").innerHTML  = t(UI.navContact);

    el("hero-eyebrow").innerHTML = t(PROFILE.location) + " · " + t(UI.openTo);
    el("hero-name").textContent  = PROFILE.name;
    // Full role stays in the DOM for screen readers; the visible copy is typed.
    el("hero-role").innerHTML = '<span class="sr">' + t(PROFILE.role) + '</span>' +
      '<span class="typed" aria-hidden="true"></span><span class="caret" aria-hidden="true"></span>';
    el("hero-school").innerHTML  = t(PROFILE.school);
    el("hero-tagline").innerHTML = t(PROFILE.tagline);

    var acts = [];
    acts.push('<a class="btn primary" href="mailto:' + esc(PROFILE.email) + '">' + t(UI.emailMe) + '</a>');
    acts.push('<a class="btn" href="cv.html">' + t(UI.viewCv) + '</a>');
    if (PROFILE.github)   acts.push('<a class="btn" href="' + esc(PROFILE.github) + '" target="_blank" rel="noopener">GitHub</a>');
    if (PROFILE.linkedin) acts.push('<a class="btn" href="' + esc(PROFILE.linkedin) + '" target="_blank" rel="noopener">LinkedIn</a>');
    if (PROFILE.phone)    acts.push('<a class="btn" href="tel:' + esc(PROFILE.phone.replace(/\s/g, "")) + '">' + esc(PROFILE.phone) + '</a>');
    el("hero-actions").innerHTML = acts.join("");

    // The portrait is optional: with no PROFILE.photo the slot renders nothing
    // and the hero falls back to the full-width text column it was before.
    el("hero-portrait").innerHTML = PROFILE.photo
      ? '<img src="assets/img/' + esc(PROFILE.photo) + '" alt="' + esc(PROFILE.name) +
        '" width="200" height="200" decoding="async">'
      : "";

    el("hero-stats").innerHTML = PROFILE.stats.map(function (s) {
      return '<div class="stat"><div class="v">' + esc(s.value) + '</div><div class="l">' + t(s.label) + "</div></div>";
    }).join("");
  }

  function shotMarkup(p, wide) {
    if (p.images && p.images.length) {
      var fit = p.fit === "cover" ? " class=\"cover\"" : "";
      return '<div class="shot"><img' + fit + ' src="assets/img/' + esc(p.images[0]) +
             '" alt="' + esc(plain(p.title)) + '" loading="lazy" decoding="async"></div>';
    }
    var initial = t(p.title).replace(/<[^>]+>/g, "").trim().charAt(0).toUpperCase();
    return '<div class="shot plain"><span>' + esc(initial) + "</span></div>";
  }

  function cardMarkup(p) {
    var wide = !!p.featured;
    var paras = (p.body && p.body[lang] ? p.body[lang] : (p.body ? p.body.en : [])) || [];

    var extra = "";
    if (p.images && p.images.length > 1) {
      extra = '<div class="extra-shots">' + p.images.slice(1).map(function (im, i) {
        return '<img src="assets/img/' + esc(im) + '" alt="' +
               esc(plain(p.title)) + ' — figure ' + (i + 2) +
               '" loading="lazy" decoding="async">';
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
          '<button class="toggle" type="button" data-target="' + esc(p.id) +
            '" aria-expanded="false" aria-controls="detail-' + esc(p.id) + '">' +
            t(UI.readMore) + "</button>" +
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
      var count = c.id === "all" ? PROJECTS.length : PROJECTS.filter(function (p) {
        return p.cats.indexOf(c.id) !== -1;
      }).length;
      return '<button type="button" data-cat="' + esc(c.id) + '" aria-pressed="' +
             (c.id === filter) + '">' + t(c.label) +
             '<span class="n">' + count + "</span></button>";
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

  function renderAbout() {
    el("sec-about-title").innerHTML = t(UI.aboutTitle);
    el("about-text").innerHTML = t(ABOUT.text).map(function (p) {
      return "<p>" + p + "</p>";
    }).join("");
    el("about-interests").innerHTML = ABOUT.interests.map(function (i) {
      return '<li><span aria-hidden="true">' + i.icon + "</span>" + t(i.label) + "</li>";
    }).join("");
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
    renderAbout();
    renderProjects();
    renderSkills();
    renderExperience();
    renderContact();
    syncLangButtons();
    fxAfterRender();
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
    if (b.id === "theme-btn") {
      setTheme(theme === "dark" ? "light" : "dark");
      if (heroCircuit.redraw) heroCircuit.redraw();
      return;
    }
    if (b.id === "print-btn") { window.print(); return; }

    if (b.hasAttribute("data-cat")) {
      filter = b.getAttribute("data-cat");
      var all = el("filters").querySelectorAll("button");
      for (var i = 0; i < all.length; i++) {
        all[i].setAttribute("aria-pressed", String(all[i].getAttribute("data-cat") === filter));
      }
      applyFilter();
      var shown = document.querySelectorAll("#grid .card:not(.hidden)");
      for (var j = 0; j < shown.length; j++) {
        shown[j].classList.remove("pop"); void shown[j].offsetWidth;
        shown[j].style.animationDelay = (j * 40) + "ms";
        shown[j].classList.add("pop", "in");
      }
      return;
    }

    if (b.classList.contains("toggle")) {
      var d = el("detail-" + b.getAttribute("data-target"));
      var open = d.classList.toggle("open");
      b.setAttribute("aria-expanded", String(open));
      b.innerHTML = open ? t(UI.readLess) : t(UI.readMore);
      return;
    }
  });

  /* -- motion ------------------------------------------------------------- */

  var reduced = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      if (e.target.classList.contains("stat")) runStat(e.target);
      io.unobserve(e.target);
    });
  }, { rootMargin: "0px 0px -40px 0px", threshold: 0.05 }) : null;

  var typeTimer = null;
  function typeRole() {
    var box = document.querySelector("#hero-role .typed");
    var full = plain(PROFILE.role);
    clearTimeout(typeTimer);
    if (reduced) { box.textContent = full; return; }
    var i = 0;
    (function step() {
      box.textContent = full.slice(0, ++i);
      if (i < full.length) typeTimer = setTimeout(step, 28 + Math.random() * 40);
    })();
  }

  // Numbers count up; words "decode" from random glyphs into place.
  function runStat(node) {
    var v = node.querySelector(".v"), target = v.getAttribute("data-v");
    if (reduced) { v.textContent = target; return; }
    var t0 = performance.now(), dur = 1100, glyphs = "01ABCDEF#%$@<>/*";
    var num = /^\d+$/.test(target) ? parseInt(target, 10) : null;
    (function frame(now) {
      var k = Math.max(0, Math.min(1, (now - t0) / dur));
      if (num !== null) {
        v.textContent = String(Math.round(num * (1 - Math.pow(1 - k, 3))));
      } else {
        var shown = Math.floor(target.length * k), out = target.slice(0, shown);
        for (var j = shown; j < target.length; j++) {
          out += target.charAt(j) === " " ? " " : glyphs.charAt(Math.floor(Math.random() * glyphs.length));
        }
        v.textContent = out;
      }
      if (k < 1) requestAnimationFrame(frame); else v.textContent = target;
    })(t0);
  }

  function fxAfterRender() {
    typeRole();
    var stats = document.querySelectorAll("#hero-stats .stat");
    for (var i = 0; i < stats.length; i++) {
      var v = stats[i].querySelector(".v");
      v.setAttribute("data-v", v.textContent);
    }
    var groups = ["#hero-stats .stat", ".sec-head", "#grid .card", ".skillcard", ".langrow > div", ".tl-item", ".contact-box"];
    groups.forEach(function (sel) {
      var nodes = document.querySelectorAll(sel);
      for (var j = 0; j < nodes.length; j++) {
        var n = nodes[j];
        n.classList.add("reveal");
        n.style.setProperty("--d", ((j % (sel === "#grid .card" ? 2 : 4)) * 90) + "ms");
        if (io && !reduced) io.observe(n);
        else { n.classList.add("in"); if (n.classList.contains("stat")) runStat(n); }
      }
    });
  }

  // Cursor-following glow on project cards.
  document.addEventListener("pointermove", function (ev) {
    var c = ev.target.closest ? ev.target.closest(".card") : null;
    if (!c) return;
    var r = c.getBoundingClientRect();
    c.style.setProperty("--mx", (ev.clientX - r.left) + "px");
    c.style.setProperty("--my", (ev.clientY - r.top) + "px");
  }, { passive: true });

  // Scroll progress bar + active nav link.
  var ticking = false;
  function onScroll() {
    ticking = false;
    var h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    el("progress").style.transform = "scaleX(" + (max > 0 ? h.scrollTop / max : 0) + ")";
    var ids = ["projects", "skills", "exp", "contact"], current = null;
    for (var i = 0; i < ids.length; i++) {
      if (el(ids[i]).getBoundingClientRect().top < 140) current = ids[i];
    }
    if (max > 0 && max - h.scrollTop < 4) current = "contact";
    var links = document.querySelectorAll("nav.main a");
    for (var k = 0; k < links.length; k++) {
      links[k].classList.toggle("active", links[k].getAttribute("href") === "#" + current);
    }
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });

  /* Hero background: circuit traces routed on a grid (straight runs with
     45-degree jogs, like PCB tracks) with signal pulses travelling along them. */
  function heroCircuit() {
    var cv = el("hero-fx");
    if (!cv || !cv.getContext) return;
    var ctx = cv.getContext("2d"), dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, traces = [], pulses = [], running = false, raf = 0, last = 0;
    var STEP = 22;

    function css(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }

    function build() {
      var r = cv.getBoundingClientRect();
      W = r.width; H = r.height;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      traces = []; pulses = [];
      var n = Math.max(6, Math.round(W / 70));
      for (var i = 0; i < n; i++) {
        var x = Math.round(Math.random() * W / STEP) * STEP;
        var y = Math.round(Math.random() * H / STEP) * STEP;
        var pts = [[x, y]], dir = Math.random() < 0.5 ? 1 : -1;
        var segs = 2 + Math.floor(Math.random() * 4);
        for (var sg = 0; sg < segs; sg++) {
          if (sg % 2 === 0) x += dir * STEP * (2 + Math.floor(Math.random() * 7));
          else {
            var d = STEP * (1 + Math.floor(Math.random() * 3)) * (Math.random() < 0.5 ? 1 : -1);
            x += dir * Math.abs(d); y += d;
          }
          pts.push([x, y]);
        }
        var L = 0;
        for (var k = 1; k < pts.length; k++) L += Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]);
        traces.push({ pts: pts, len: L });
      }
      for (var q = 0; q < Math.round(n * 0.6); q++) pulses.push(newPulse());
      draw(0);
    }

    function newPulse() {
      return { tr: traces[Math.floor(Math.random() * traces.length)], s: 0,
               v: 40 + Math.random() * 70, wait: Math.random() * 3 };
    }

    function pointAt(tr, d) {
      for (var k = 1; k < tr.pts.length; k++) {
        var a = tr.pts[k - 1], b = tr.pts[k], seg = Math.hypot(b[0] - a[0], b[1] - a[1]);
        if (d <= seg) return [a[0] + (b[0] - a[0]) * d / seg, a[1] + (b[1] - a[1]) * d / seg];
        d -= seg;
      }
      return tr.pts[tr.pts.length - 1];
    }

    function draw(dt) {
      var accent = css("--accent") || "#2bd4ff", line = css("--line-2") || "#24344a";
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1.2; ctx.strokeStyle = line; ctx.globalAlpha = 0.6;
      traces.forEach(function (tr) {
        ctx.beginPath();
        tr.pts.forEach(function (pt, i) { if (i) ctx.lineTo(pt[0], pt[1]); else ctx.moveTo(pt[0], pt[1]); });
        ctx.stroke();
        [tr.pts[0], tr.pts[tr.pts.length - 1]].forEach(function (pt) {
          ctx.beginPath(); ctx.arc(pt[0], pt[1], 3, 0, Math.PI * 2); ctx.stroke();
        });
      });
      ctx.fillStyle = accent;
      pulses.forEach(function (pl, i) {
        if (pl.wait > 0) { pl.wait -= dt; return; }
        pl.s += pl.v * dt;
        if (pl.s > pl.tr.len) { pulses[i] = newPulse(); return; }
        for (var tail = 0; tail < 6; tail++) {
          var pt = pointAt(pl.tr, Math.max(0, pl.s - tail * 5));
          ctx.globalAlpha = 1 - tail / 6;
          ctx.beginPath(); ctx.arc(pt[0], pt[1], tail ? 1.6 : 2.4, 0, Math.PI * 2); ctx.fill();
        }
      });
      ctx.globalAlpha = 1;
    }

    function loop(now) {
      var dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now; draw(dt);
      if (running) raf = requestAnimationFrame(loop);
    }
    function start() { if (running || reduced) return; running = true; last = 0; raf = requestAnimationFrame(loop); }
    function stop() { running = false; cancelAnimationFrame(raf); }

    build();
    var rt = 0;
    window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(build, 150); });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) { if (e[0].isIntersecting) start(); else stop(); }).observe(cv);
    } else start();
    document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); else start(); });
    heroCircuit.redraw = function () { if (!running) draw(0); };
  }


  /* -- go ----------------------------------------------------------------- */

  document.documentElement.classList.add("fx");
  setTheme(theme);
  renderAll();
  heroCircuit();
  onScroll();
})();
