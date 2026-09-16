(function () {
  "use strict";
  var S = window.SITE;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var esc = function (t) { return String(t).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); };

  /* ---------- simple bindings ---------- */
  $$("[data-bind]").forEach(function (el) { el.textContent = S[el.getAttribute("data-bind")] || ""; });
  $("#year").textContent = new Date().getFullYear();
  var resume = $("#resumeLink");
  if (S.resume) resume.href = S.resume; else resume.hidden = true;

  /* ---------- theme toggle ---------- */
  var root = document.documentElement;
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  var saved = store("rm-theme");
  if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);
  $("#themeBtn").addEventListener("click", function () {
    var cur = root.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    var next = cur === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    store("rm-theme", next);
    toast(next === "dark" ? "Dark appearance" : "Light appearance");
  });

  /* ---------- mobile menu ---------- */
  var menuBtn = $("#menuBtn"), links = $("#navLinks");
  menuBtn.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  });
  $$("a", links).forEach(function (a) { a.addEventListener("click", function () { links.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); }); });

  /* ---------- statement words ---------- */
  var scrub = $("#scrub");
  scrub.innerHTML = S.statement.split(" ").map(function (w) { return "<span>" + esc(w) + "</span>"; }).join(" ");
  var words = $$("span", scrub);

  /* ---------- research bento ---------- */
  $("#bento").innerHTML = S.research.map(function (r) {
    return '<article class="tile' + (r.size === "wide" ? " wide" : "") + '"><div class="glow"></div><span class="tag">' + esc(r.tag) +
      "</span><h3>" + esc(r.title) + "</h3><p>" + esc(r.text) + "</p></article>";
  }).join("");
  if (!reduce && matchMedia("(hover:hover)").matches) {
    $$(".tile").forEach(function (t) {
      t.addEventListener("pointermove", function (e) {
        var b = t.getBoundingClientRect(), x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height;
        t.style.setProperty("--mx", x * 100 + "%"); t.style.setProperty("--my", y * 100 + "%");
        t.style.transform = "perspective(900px) rotateX(" + ((0.5 - y) * 5) + "deg) rotateY(" + ((x - 0.5) * 6) + "deg)";
      });
      t.addEventListener("pointerleave", function () { t.style.transform = ""; });
    });
  }

  /* ---------- segmented control helper ---------- */
  function segmented(el, items, onPick, start) {
    el.innerHTML = items.map(function (it, i) {
      return '<button type="button" role="tab" aria-selected="' + (it[0] === start) + '" data-k="' + esc(it[0]) + '">' + esc(it[1]) + "</button>";
    }).join("");
    el.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      $$("button", el).forEach(function (x) { x.setAttribute("aria-selected", x === b); });
      onPick(b.getAttribute("data-k"));
    });
    onPick(start);
  }

  /* ---------- publications ---------- */
  var statusClass = { "Published": "s-published", "Presented": "s-presented", "Accepted": "s-accepted", "Under review": "s-review" };
  $("#pubs").innerHTML = S.publications.slice().sort(function (a, b) { return b.year - a.year; }).map(function (p) {
    var t = p.link ? '<a href="' + esc(p.link) + '" target="_blank" rel="noopener">' + esc(p.title) + "</a>" : esc(p.title);
    return '<li class="pub"><span class="pub-year">' + p.year + "</span><div><h3>" + t +
      '</h3><p class="authors">' + esc(p.authors) + '</p><p class="venue">' + esc(p.venue) + '</p></div><div class="chips"><span class="chip type">' +
      esc(p.type) + '</span><span class="chip ' + (statusClass[p.status] || "") + '">' + esc(p.status) + "</span></div></li>";
  }).join("");
  var wr = $("#writing");
  if (S.writing) {
    wr.innerHTML = '<span class="pulse" aria-hidden="true"></span><div><span class="lbl">Currently writing</span><h3>' + esc(S.writing.title) + "</h3></div><p>" + esc(S.writing.text) + "</p>";
  } else wr.hidden = true;

  /* ---------- projects ---------- */
  var catName = { ml: "Machine learning", analytics: "Data analytics", software: "Software" };
  var rail = $("#rail");
  rail.innerHTML = S.projects.map(function (p, i) {
    var metric = p.metric ? '<div class="metric"><b>' + esc(p.metric) + "</b><span>" + esc(p.metricLabel) + "</span></div>" : "";
    return '<button type="button" class="pcard" data-cat="' + p.category + '" data-i="' + i + '" aria-label="' + esc(p.title) + ', open details">' +
      '<span class="cat ' + p.category + '">' + catName[p.category] + "</span><h3>" + esc(p.title) + '</h3><span class="when">' + esc(p.when) + "</span>" +
      metric + '<span class="stack">' + p.stack.map(function (s) { return "<i>" + esc(s) + "</i>"; }).join("") + '</span><span class="plus" aria-hidden="true">+</span></button>';
  }).join("");
  segmented($("#projFilter"), [["all", "All"], ["ml", "ML"], ["analytics", "Analytics"], ["software", "Software"]], function (k) {
    $$(".pcard", rail).forEach(function (c) { c.hidden = k !== "all" && c.getAttribute("data-cat") !== k; });
    rail.scrollTo({ left: 0 }); setTimeout(railButtons, 50);
  }, "all");
  var prev = $("#railPrev"), next = $("#railNext");
  function step() { var c = $(".pcard:not([hidden])", rail); return c ? c.getBoundingClientRect().width + 20 : 300; }
  prev.addEventListener("click", function () { rail.scrollBy({ left: -step() * 2 }); });
  next.addEventListener("click", function () { rail.scrollBy({ left: step() * 2 }); });
  function railButtons() {
    prev.disabled = rail.scrollLeft < 4;
    next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4;
  }
  rail.addEventListener("scroll", railButtons, { passive: true });
  window.addEventListener("resize", railButtons);
  railButtons();

  /* ---------- modal ---------- */
  var modal = $("#modal");
  rail.addEventListener("click", function (e) {
    var c = e.target.closest(".pcard"); if (!c) return;
    var p = S.projects[+c.getAttribute("data-i")];
    $("#modalBody").innerHTML = '<span class="cat">' + catName[p.category] + '</span><h3 id="modalTitle">' + esc(p.title) + '</h3><p class="when">' + esc(p.when) +
      '</p><p class="body">' + esc(p.text) + "</p>" + (p.metric ? '<div class="big grad">' + esc(p.metric) + "<small>" + esc(p.metricLabel) + "</small></div>" : "") +
      '<div class="stack">' + p.stack.map(function (s) { return "<i>" + esc(s) + "</i>"; }).join("") + "</div>";
    if (modal.showModal) modal.showModal(); else modal.setAttribute("open", "");
  });
  $("#modalClose").addEventListener("click", function () { modal.close(); });
  modal.addEventListener("click", function (e) { if (e.target === modal) modal.close(); });

  /* ---------- journey ---------- */
  function tl(list, edu) {
    return list.map(function (x) {
      return '<li><span class="when">' + esc(x.when) + "</span><h4>" + esc(x.title) + '</h4><div class="org">' + esc(x.org) + "</div>" +
        (x.text ? "<p>" + esc(x.text) + "</p>" : "") + (x.score ? '<span class="score">' + esc(x.score) + "</span>" : "") + "</li>";
    }).join("");
  }
  $("#expList").innerHTML = tl(S.experience);
  $("#eduList").innerHTML = tl(S.education);

  /* ---------- certifications ---------- */
  $("#certList").innerHTML = (S.certifications || []).map(function (c) { return "<li><b>" + esc(c[0]) + "</b><span>" + esc(c[1]) + "</span></li>"; }).join("");

  /* ---------- skills ---------- */
  var groups = Object.keys(S.skills);
  segmented($("#skillTabs"), groups.map(function (g) { return [g, g]; }), function (g) {
    $("#skillGrid").innerHTML = S.skills[g].map(function (s, i) {
      return '<div class="skill" style="animation-delay:' + i * 40 + 'ms"><b>' + esc(s) + "</b></div>";
    }).join("");
  }, groups[0]);

  /* ---------- latest blog posts ---------- */
  var posts = (window.POSTS || []).slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; }).slice(0, 3);
  $("#postList").innerHTML = posts.length ? posts.map(function (p) {
    return '<a class="note" href="post.html?p=' + encodeURIComponent(p.slug) + '"><div class="meta"><span>' + fmtDate(p.date) + '</span></div><h3>' + esc(p.title) +
      "</h3><p>" + esc(p.summary) + '</p><div class="tags">' + (p.tags || []).map(function (t) { return "<i>" + esc(t) + "</i>"; }).join("") + '</div><span class="soon">Read post ›</span></a>';
  }).join("") : '<p class="empty">First post coming up.</p>';
  function fmtDate(d) { var x = new Date(d + "T00:00:00"); return isNaN(x) ? esc(d) : x.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); }

  /* ---------- contact ---------- */
  $("#mailBtn").href = "mailto:" + S.email;
  $("#phone").textContent = S.email;
  $("#copyBtn").addEventListener("click", function () {
    var done = function () { toast("Email address copied"); };
    if (navigator.clipboard) navigator.clipboard.writeText(S.email).then(done, function () { toast(S.email); });
    else toast(S.email);
  });
  var icons = {
    linkedin: '<path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4v11H3zM9.5 9.75h3.8v1.5h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1v5.45h-4v-4.83c0-1.15-.02-2.63-1.6-2.63-1.61 0-1.85 1.25-1.85 2.55v4.91h-4z"/>',
    github: '<path fill="currentColor" d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z"/>',
    x: '<path fill="currentColor" d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.77zm-1.08 16.2h1.7L7.4 4.73H5.58z"/>',
    instagram: '<path fill="currentColor" d="M12 2.2c3.2 0 3.58 0 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58 0-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12s0-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zm0 4.9a4.9 4.9 0 1 0 0 9.8 4.9 4.9 0 0 0 0-9.8zm0 8.08a3.18 3.18 0 1 1 0-6.36 3.18 3.18 0 0 1 0 6.36zm5.1-9.44a1.15 1.15 0 1 0 0 2.3 1.15 1.15 0 0 0 0-2.3z"/>',
    scholar: '<path fill="currentColor" d="M12 2 1 9l4 2.5V17c0 2.2 3.1 4 7 4s7-1.8 7-4v-5.5L23 9zm0 16c-2.8 0-5-1.3-5-2.5v-2.8l5 3.1 5-3.1v2.8c0 1.2-2.2 2.5-5 2.5z"/>'
  };
  var names = { linkedin: "LinkedIn", github: "GitHub", x: "X", instagram: "Instagram", scholar: "Google Scholar" };
  $("#socials").innerHTML = Object.keys(S.social).filter(function (k) { return S.social[k]; }).map(function (k) {
    return '<li><a href="' + esc(S.social[k]) + '" target="_blank" rel="noopener" aria-label="' + names[k] + '"><svg viewBox="0 0 24 24" aria-hidden="true">' + icons[k] + "</svg></a></li>";
  }).join("");

  /* ---------- toast ---------- */
  var tEl = $("#toast"), tTimer;
  function toast(msg) {
    tEl.textContent = msg; tEl.classList.add("show");
    clearTimeout(tTimer); tTimer = setTimeout(function () { tEl.classList.remove("show"); }, 1800);
  }

  /* ---------- reveal on scroll (only for things that start below the fold) ---------- */
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("shown");
        io.unobserve(en.target);
      });
    }, { threshold: 0.15 });
    $$(".sec-head, .tile, .pub, .writing, .timeline li, .cert-list, .note, .contact-inner").forEach(function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add("will-reveal"); io.observe(el); }
    });
  }

  /* ---------- scroll: nav state, progress, scrub, scroll-spy ---------- */
  var nav = $("#nav"), bar = $("#progress");
  var spy = $$("a", links).map(function (a) { return { a: a, sec: $(a.getAttribute("href")) }; });
  var ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
    nav.classList.toggle("scrolled", y > 8);
    bar.style.transform = "scaleX(" + (h > 0 ? y / h : 0) + ")";
    // light up words as the statement passes through the viewport
    var r = scrub.getBoundingClientRect();
    var p = reduce ? 1 : Math.min(Math.max((innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35), 0), 1);
    var n = Math.round(p * words.length);
    for (var i = 0; i < words.length; i++) words[i].classList.toggle("lit", i < n);
    var current = null;
    spy.forEach(function (s) { if (s.sec && s.sec.getBoundingClientRect().top < innerHeight * 0.4) current = s; });
    spy.forEach(function (s) { s.a.classList.toggle("active", s === current); });
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- hero neural mesh ---------- */
  var cv = $("#mesh"), ctx = cv.getContext && cv.getContext("2d");
  if (ctx) {
    var pts = [], W, H, dpr = Math.min(window.devicePixelRatio || 1, 2), mouse = { x: -999, y: -999 };
    function size() {
      W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(70, W * H / 16000)); pts = [];
      for (var i = 0; i < n; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25 });
    }
    function colors() {
      var cs = getComputedStyle(root);
      return [cs.getPropertyValue("--grad-a").trim(), cs.getPropertyValue("--grad-b").trim()];
    }
    var col = colors();
    new MutationObserver(function () { col = colors(); }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () { col = colors(); });
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < pts.length; i++) {
        var a = pts[i];
        if (!reduce) { a.x += a.vx; a.y += a.vy; if (a.x < 0 || a.x > W) a.vx *= -1; if (a.y < 0 || a.y > H) a.vy *= -1; }
        for (var j = i + 1; j < pts.length; j++) {
          var b = pts[j], dx = a.x - b.x, dy = a.y - b.y, d = dx * dx + dy * dy;
          if (d < 16000) { ctx.globalAlpha = (1 - d / 16000) * .35; ctx.strokeStyle = col[0]; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        }
        var md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        ctx.globalAlpha = md < 140 ? .9 : .5; ctx.fillStyle = md < 140 ? col[1] : col[0];
        ctx.beginPath(); ctx.arc(a.x, a.y, md < 140 ? 2.6 : 1.6, 0, 7); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!reduce && visible) requestAnimationFrame(draw);
    }
    var visible = true;
    new IntersectionObserver(function (e) { var was = visible; visible = e[0].isIntersecting; if (visible && !was) requestAnimationFrame(draw); }).observe(cv);
    cv.parentElement.addEventListener("pointermove", function (e) { var b = cv.getBoundingClientRect(); mouse.x = e.clientX - b.left; mouse.y = e.clientY - b.top; });
    cv.parentElement.addEventListener("pointerleave", function () { mouse.x = mouse.y = -999; });
    window.addEventListener("resize", size);
    size(); draw();
  }
})();
