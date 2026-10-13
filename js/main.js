/*
 * PSCS — renders the copy from content.js into the page and wires up the
 * header menu and the PORT / SHIP / CARGO disclosures.
 * Everything is inserted with textContent (never as HTML).
 */
(function () {
  "use strict";
  var C = window.PSCS_CONTENT;

  function h(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        if (k === "text") n.textContent = attrs[k];
        else if (k === "class") n.className = attrs[k];
        else n.setAttribute(k, attrs[k]);
      }
    }
    (children || []).forEach(function (c) {
      if (c) n.appendChild(c);
    });
    return n;
  }
  function $(id) {
    return document.getElementById(id);
  }

  /* Responsive <img> from a content.js image descriptor. If the file is
     missing the figure is marked is-missing instead of showing a broken image. */
  function pic(d, opts) {
    opts = opts || {};
    var attrs = {
      src: d.src,
      srcset: d.srcset,
      sizes: opts.sizes || d.sizes,
      width: String(d.width),
      height: String(d.height),
      alt: opts.decorative ? "" : d.alt,
      decoding: "async"
    };
    if (opts.priority) attrs.fetchpriority = "high";
    else attrs.loading = "lazy";
    var img = h("img", attrs);
    if (opts.decorative) img.setAttribute("role", "presentation");
    img.addEventListener("error", function () {
      img.remove();
      if (opts.onMissing) opts.onMissing();
    });
    return img;
  }
  function figure(d, cls, opts) {
    opts = opts || {};
    var fig = h("figure", { class: "media " + cls });
    var onMissing = function () { fig.classList.add("is-missing"); };
    fig.appendChild(pic(d, { priority: opts.priority, decorative: opts.decorative, sizes: opts.sizes, onMissing: onMissing }));
    if (opts.caption) fig.appendChild(h("figcaption", { text: opts.caption }));
    return fig;
  }

  /* Static decorative icons (no user text inside) */
  var ICONS = {
    port:
      '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M10 40V14h4v26M22 40V14h4v26M6 14h34M24 14 18 6M24 6h18v8M38 14v8M34 22h8v6h-8z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    ship:
      '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M5 30h38l-4 10H9zM10 30V22h8v8M18 30v-6h6v6M24 30v-6h6v6M30 30v-6h6v6M12 22v-6h4v6M4 44c4 0 4-2 8-2s4 2 8 2 4-2 8-2 4 2 8 2 4-2 8-2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    cargo:
      '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M6 24h18v14H6zM24 24h18v14H24zM15 10h18v14H15zM11 27v8M16 27v8M29 27v8M34 27v8M20 13v8M25 13v8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  /* ---------- brand / header ---------- */
  function renderBrand(target) {
    target.textContent = "";
    if (C.brand.logoSrc) {
      target.appendChild(h("img", { src: C.brand.logoSrc, alt: C.brand.logoAlt, class: "brand-logo" }));
      return;
    }
    target.appendChild(h("span", { class: "brand-short", text: C.brand.short }));
    target.appendChild(h("span", { class: "brand-full", text: C.brand.full }));
  }

  renderBrand($("brand"));
  renderBrand($("footer-brand"));

  var nav = $("nav-list");
  C.nav.forEach(function (item) {
    nav.appendChild(h("li", null, [h("a", { href: item.href, text: item.label })]));
  });

  var menuBtn = $("menu-toggle");
  var header = $("site-header");
  function setMenu(open) {
    header.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  menuBtn.addEventListener("click", function () {
    setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });
  header.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && header.classList.contains("menu-open")) {
      setMenu(false);
      menuBtn.focus();
    }
  });
  window.matchMedia("(min-width: 821px)").addEventListener("change", function (m) {
    if (m.matches) setMenu(false);
  });

  var onScroll = function () {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- hero ---------- */
  $("hero-eyebrow").textContent = C.hero.eyebrow;
  $("hero-line").textContent = C.hero.supportingLine;
  var primary = $("cta-primary"), secondary = $("cta-secondary");
  primary.textContent = C.hero.primaryCta.label;
  primary.setAttribute("href", C.hero.primaryCta.href);
  secondary.textContent = C.hero.secondaryCta.label;
  secondary.setAttribute("href", C.hero.secondaryCta.href);

  // Headline: the first sentence stays bright, the rest is set in the accent tone.
  window.PSCS_SET_HERO_TEXT = function (headline, sub) {
    var el = $("hero-title");
    el.textContent = "";
    var m = /^(.+?[.!?])\s+(.+)$/.exec(headline);
    if (m) {
      el.appendChild(document.createTextNode(m[1] + " "));
      el.appendChild(h("span", { class: "accent", text: m[2] }));
    } else {
      el.textContent = headline;
    }
    $("hero-sub").textContent = sub;
  };
  window.PSCS_SET_HERO_TEXT(window.PSCS_STATE.text.headline, window.PSCS_STATE.text.subheadline);

  // Photographic hero. The illustrated SVG scene stays in the page as a fallback.
  (function () {
    var stage = $("hero-stage"), holder = $("hero-photo");
    var svg = $("hero-scene"), canvas = $("hero-water");
    if (!C.hero.image || !holder) return;
    function toPhoto() {
      stage.classList.add("is-photo");
      holder.hidden = false;
      svg.setAttribute("hidden", "");
      canvas.hidden = true;
    }
    function toScene() {
      stage.classList.remove("is-photo");
      holder.hidden = true;
      svg.removeAttribute("hidden");
      canvas.hidden = false;
      document.dispatchEvent(new CustomEvent("pscs:hero-mode"));
    }
    var img = pic(C.hero.image, { priority: true, onMissing: toScene });
    holder.appendChild(img);
    toPhoto();
  })();

  /* ---------- expertise ---------- */
  var E = C.expertise;
  $("exp-eyebrow").textContent = E.eyebrow;
  $("exp-title").textContent = E.title;
  $("exp-intro").textContent = E.intro;
  $("exp-note").textContent = E.note;
  [["exp-digital", E.digital], ["exp-clients", E.clients]].forEach(function (x) {
    $(x[0]).appendChild(h("h3", { class: "exp-block-title", text: x[1].title }));
    $(x[0]).appendChild(h("p", { class: "exp-block-text", text: x[1].text }));
  });

  var list = $("domain-list");
  E.domains.forEach(function (d, idx) {
    var panelId = "domain-panel-" + d.key;
    var btnId = "domain-btn-" + d.key;
    var label = h("span", { class: "domain-toggle-label", text: E.toggleOpen });

    var btn = h("button", { type: "button", class: "domain-head", id: btnId, "aria-expanded": "false", "aria-controls": panelId }, [
      h("span", { class: "domain-index", text: "0" + (idx + 1) }),
      h("span", { class: "domain-name" }, [
        h("span", { class: "domain-word", text: d.name }),
        h("span", { class: "domain-full", text: d.full })
      ]),
      h("span", { class: "domain-desc", text: d.description }),
      h("span", { class: "domain-toggle" }, [label, h("span", { class: "domain-plus", "aria-hidden": "true" })])
    ]);
    var icon = h("span", { class: "domain-icon", "aria-hidden": "true" });
    icon.innerHTML = ICONS[d.key] || ""; // static, trusted SVG only
    btn.insertBefore(icon, btn.children[1]);

    function bullets(items) {
      var ul = h("ul", { class: "service-list" });
      items.forEach(function (t) { ul.appendChild(h("li", null, [h("span", { text: t })])); });
      return ul;
    }
    var systems = h("section", { class: "service-group service-systems" }, [h("h4", { class: "service-heading", text: E.systemsTitle })]);
    if (d.systems.groups) {
      d.systems.groups.forEach(function (g) {
        systems.appendChild(h("div", { class: "system-card" }, [
          h("h5", { class: "system-title", text: g.title }),
          h("p", { class: "system-text", text: g.text }),
          g.items ? h("p", { class: "system-list-title", text: g.listTitle }) : null,
          g.items ? bullets(g.items) : null,
          g.note ? h("p", { class: "system-note", text: g.note }) : null
        ]));
      });
    } else {
      systems.appendChild(bullets(d.systems.items));
    }
    var advisory = h("section", { class: "service-group service-advisory" }, [
      h("h4", { class: "service-heading", text: E.advisoryTitle }),
      bullets(d.advisory)
    ]);
    var columns = h("div", { class: "service-columns" + (d.systems.groups ? " has-groups" : "") }, [advisory, systems]);
    var body = h("div", { class: "domain-panel-body" }, [d.image ? figure(d.image, "domain-media") : null, columns]);
    var panel = h("div", { class: "domain-panel", id: panelId, role: "region", "aria-labelledby": btnId }, [
      h("div", { class: "domain-panel-inner" }, [body])
    ]);
    panel.inert = true;

    var item = h("article", { class: "domain domain-" + d.key }, [btn, panel]);
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      item.classList.toggle("is-open", open);
      panel.inert = !open;
      label.textContent = open ? E.toggleClose : E.toggleOpen;
    });
    list.appendChild(item);
  });

  /* ---------- approach ---------- */
  var A = C.approach;
  $("app-eyebrow").textContent = A.eyebrow;
  $("app-title").textContent = A.title;
  $("app-intro").textContent = A.intro;
  $("app-problems-label").textContent = A.problemsLabel;
  $("app-options-label").textContent = A.optionsLabel;
  $("app-steps-label").textContent = A.stepsLabel;
  $("app-note").textContent = A.note;

  var problems = $("problems");
  A.problems.forEach(function (p) {
    var card = h("article", { class: "problem problem-" + p.key }, [
      p.image ? figure(p.image, "problem-media") : null,
      h("div", { class: "problem-copy" }, [
        h("p", { class: "tag", text: p.tag }),
        h("h4", { class: "card-title", text: p.title }),
        h("p", { class: "card-text", text: p.text })
      ])
    ]);
    problems.appendChild(card);
  });

  var options = $("options");
  A.options.forEach(function (o) {
    var frame;
    if (o.image) {
      frame = figure(o.image, "option-media");
    } else {
      // no photograph for this path: a matching typographic frame
      frame = h("div", { class: "media option-media is-typographic", "aria-hidden": "true" });
    }
    frame.setAttribute("data-label", o.tag);
    var card = h("article", { class: "option option-" + o.key }, [
      frame,
      h("div", { class: "option-copy" }, [
        h("p", { class: "tag", text: o.tag + " \u2014 " + o.subtitle }),
        h("h4", { class: "card-title", text: o.title }),
        h("p", { class: "card-text", text: o.text }),
        o.cta ? h("a", { class: "text-link", href: o.cta.href, text: o.cta.label }) : null
      ])
    ]);
    options.appendChild(card);
  });

  var steps = $("steps");
  A.steps.forEach(function (s, i) {
    steps.appendChild(
      h("li", { class: "step step-" + (i + 1) }, [
        h("span", { class: "step-node", "aria-hidden": "true", text: String(i + 1) }),
        h("h4", { class: "step-title", text: s.title }),
        h("p", { class: "step-text", text: s.text })
      ])
    );
  });

  /* ---------- team ---------- */
  var T = C.team;
  $("team-eyebrow").textContent = T.eyebrow;
  $("team-title").textContent = T.title;
  $("team-intro").textContent = T.intro;
  var tf = $("team-figure"), ph = T.photos;
  if (tf && ph) {
    tf.appendChild(h("div", { class: "team-photos" }, [
      ph.maritime ? figure(ph.maritime.image, "team-shot team-shot-maritime", { caption: ph.maritime.caption }) : null,
      ph.software ? figure(ph.software.image, "team-shot team-shot-software", { caption: ph.software.caption }) : null
    ]));
    // our e-mail address, shown only once it is set in content.js (contactDetails.email)
    if (C.contactDetails.email) {
      tf.appendChild(h("a", { class: "team-mail", href: "mailto:" + C.contactDetails.email }, [
        h("span", { class: "team-mail-label", text: C.contact.emailLabel }),
        h("span", { class: "team-mail-address", text: C.contactDetails.email })
      ]));
    }
  }
  var comp = $("competences");
  T.competences.forEach(function (c, i) {
    comp.appendChild(
      h("li", { class: "competence competence-" + (i + 1) }, [
        h("span", { class: "competence-dot", "aria-hidden": "true" }),
        h("div", null, [h("h3", { text: c.title }), h("p", { text: c.text })])
      ])
    );
  });

  /* ---------- contact ---------- */
  var K = C.contact;
  $("contact-eyebrow").textContent = K.eyebrow;
  $("contact-title").textContent = K.title;
  $("contact-text").textContent = K.text;
  var action = $("contact-action");
  if (C.contactDetails.email) {
    renderEmailCopy(action, C.contactDetails.email, K);
  } else {
    action.appendChild(
      h("p", { class: "pending" }, [h("span", { class: "pending-dot", "aria-hidden": "true" }), h("span", { text: K.pending })])
    );
  }

  /* Visible, selectable address + "Copy email" button. Success is only reported
     after the copy really happened; otherwise the address is selected for the
     visitor to copy by hand. */
  function renderEmailCopy(target, email, T) {
    var addr = h("span", { class: "mail-address", id: "contact-email", text: email });
    var label = h("span", { class: "mail-copy-label", text: T.copyLabel });
    var icon = h("span", { class: "mail-copy-icon", "aria-hidden": "true" });
    icon.innerHTML =
      '<svg viewBox="0 0 24 24" focusable="false"><rect x="9" y="9" width="11" height="11" rx="2.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M5 15V6.2C5 5.5 5.5 5 6.2 5H15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'; // static, trusted
    var btn = h("button", { class: "btn btn-primary mail-copy", type: "button", "aria-describedby": "contact-email" }, [icon, label]);
    var status = h("p", { class: "mail-status", role: "status", "aria-live": "polite" });
    target.appendChild(h("div", { class: "mail-box" }, [addr, btn]));
    target.appendChild(status);

    var timer = 0;
    function selectAddress() {
      try {
        var range = document.createRange();
        range.selectNodeContents(addr);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      } catch (e) {}
    }
    function legacyCopy() {
      // older browsers / contexts without the async clipboard API
      try {
        var ta = document.createElement("textarea");
        ta.value = email;
        ta.setAttribute("readonly", "");
        ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
        document.body.appendChild(ta);
        ta.select();
        var ok = document.execCommand("copy");
        ta.remove();
        return ok === true;
      } catch (e) {
        return false;
      }
    }
    function copy() {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        return navigator.clipboard.writeText(email).then(
          function () { return true; },
          function () { return legacyCopy(); }
        );
      }
      return Promise.resolve(legacyCopy());
    }
    function showSuccess() {
      clearTimeout(timer);
      status.classList.remove("is-error");
      status.textContent = T.copiedStatus; // announced by the live region, visually hidden
      label.textContent = T.copiedLabel;
      btn.classList.add("is-copied");
      timer = setTimeout(function () {
        label.textContent = T.copyLabel;
        btn.classList.remove("is-copied");
        status.textContent = "";
      }, 2000);
    }
    function showFailure() {
      clearTimeout(timer);
      label.textContent = T.copyLabel;
      btn.classList.remove("is-copied");
      status.classList.add("is-error");
      status.textContent = T.copyFailed;
      selectAddress();
    }
    function onCopy() {
      copy().then(function (ok) { ok ? showSuccess() : showFailure(); });
    }
    btn.addEventListener("click", onCopy);
    addr.addEventListener("click", onCopy);
  }

  /* ---------- footer ---------- */
  var fa = $("footer-areas");
  C.footer.areas.forEach(function (a) {
    fa.appendChild(h("li", { text: a }));
  });
})();
