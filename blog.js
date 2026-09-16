(function () {
  "use strict";
  var S = window.SITE || {}, P = (window.POSTS || []).slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (t) { return String(t).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); };
  var root = document.documentElement;

  $$("[data-bind]").forEach(function (el) { el.textContent = S[el.getAttribute("data-bind")] || ""; });
  var yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();

  /* theme + menu (same behaviour as the home page) */
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  var saved = store("rm-theme");
  if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);
  $("#themeBtn").addEventListener("click", function () {
    var cur = root.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    var next = cur === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next); store("rm-theme", next);
  });
  var menuBtn = $("#menuBtn"), links = $("#navLinks");
  menuBtn.addEventListener("click", function () { menuBtn.setAttribute("aria-expanded", links.classList.toggle("open")); });
  var nav = $("#nav"), bar = $("#progress");
  window.addEventListener("scroll", function () {
    var y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    nav.classList.toggle("scrolled", y > 8);
    bar.style.transform = "scaleX(" + (h > 0 ? y / h : 0) + ")";
  }, { passive: true });

  function fmtDate(d) { var x = new Date(d + "T00:00:00"); return isNaN(x) ? esc(d) : x.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }); }
  function readTime(p) { return Math.max(1, Math.round(p.body.split(/\s+/).length / 220)) + " min read"; }

  /* tiny Markdown renderer: headings, lists, quotes, code, bold, italic, links, images */
  function inline(t) {
    return esc(t)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img src="$2" alt="$1">')
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>");
  }
  function md(src) {
    var out = [], blocks = src.replace(/\r/g, "").trim().split(/\n{2,}/);
    blocks.forEach(function (b) {
      if (/^```/.test(b)) { out.push("<pre><code>" + esc(b.replace(/^```\w*\n?|```$/g, "")) + "</code></pre>"); return; }
      var m = b.match(/^(#{2,4})\s+(.*)$/);
      if (m) { var n = m[1].length; out.push("<h" + n + ">" + inline(m[2]) + "</h" + n + ">"); return; }
      var lines = b.split("\n");
      if (lines.every(function (l) { return /^\s*[-*]\s+/.test(l); })) { out.push("<ul>" + lines.map(function (l) { return "<li>" + inline(l.replace(/^\s*[-*]\s+/, "")) + "</li>"; }).join("") + "</ul>"); return; }
      if (lines.every(function (l) { return /^\s*\d+\.\s+/.test(l); })) { out.push("<ol>" + lines.map(function (l) { return "<li>" + inline(l.replace(/^\s*\d+\.\s+/, "")) + "</li>"; }).join("") + "</ol>"); return; }
      if (lines.every(function (l) { return /^>\s?/.test(l); })) { out.push("<blockquote>" + inline(lines.map(function (l) { return l.replace(/^>\s?/, ""); }).join(" ")) + "</blockquote>"); return; }
      out.push("<p>" + inline(lines.join(" ")) + "</p>");
    });
    return out.join("\n");
  }

  function card(p) {
    return '<a class="note" href="post.html?p=' + encodeURIComponent(p.slug) + '"><div class="meta"><span>' + fmtDate(p.date) + "</span><span>·</span><span>" + readTime(p) +
      "</span></div><h3>" + esc(p.title) + "</h3><p>" + esc(p.summary) + '</p><div class="tags">' + (p.tags || []).map(function (t) { return "<i>" + esc(t) + "</i>"; }).join("") +
      '</div><span class="soon">Read post ›</span></a>';
  }

  var page = $("main").getAttribute("data-page");
  if (page === "list") {
    var tags = [];
    P.forEach(function (p) { (p.tags || []).forEach(function (t) { if (tags.indexOf(t) < 0) tags.push(t); }); });
    var barEl = $("#tagBar"), list = $("#allPosts");
    function render(tag) {
      var shown = P.filter(function (p) { return tag === "all" || (p.tags || []).indexOf(tag) >= 0; });
      list.innerHTML = shown.length ? shown.map(card).join("") : '<p class="empty">No posts yet.</p>';
    }
    if (tags.length > 1) {
      barEl.innerHTML = [["all", "All"]].concat(tags.map(function (t) { return [t, t]; })).map(function (t, i) {
        return '<button type="button" role="tab" aria-selected="' + (i === 0) + '" data-k="' + esc(t[0]) + '">' + esc(t[1]) + "</button>";
      }).join("");
      barEl.addEventListener("click", function (e) {
        var b = e.target.closest("button"); if (!b) return;
        $$("button", barEl).forEach(function (x) { x.setAttribute("aria-selected", x === b); });
        render(b.getAttribute("data-k"));
      });
    } else barEl.hidden = true;
    render("all");
  } else {
    var slug = new URLSearchParams(location.search).get("p");
    var i = -1; P.forEach(function (p, k) { if (p.slug === slug) i = k; });
    var el = $("#post");
    if (i < 0) {
      el.innerHTML = '<a class="back" href="blog.html">‹ All posts</a><h1>Post not found.</h1><p class="meta">The link may be old. Try the list of posts instead.</p>';
      return;
    }
    var p = P[i], newer = P[i - 1], older = P[i + 1];
    document.title = p.title + " · " + (S.name || "Blog");
    el.innerHTML = '<a class="back" href="blog.html">‹ All posts</a><h1>' + esc(p.title) + '</h1><div class="meta"><span>' + fmtDate(p.date) + "</span><span>·</span><span>" + readTime(p) +
      "</span>" + (p.tags || []).map(function (t) { return "<span>#" + esc(t) + "</span>"; }).join("") + '</div><div class="prose">' + md(p.body) + "</div>" +
      '<nav class="post-nav">' + (older ? '<a href="post.html?p=' + encodeURIComponent(older.slug) + '">‹ ' + esc(older.title) + "</a>" : "<span></span>") +
      (newer ? '<a href="post.html?p=' + encodeURIComponent(newer.slug) + '">' + esc(newer.title) + " ›</a>" : "") + "</nav>";
  }
})();
