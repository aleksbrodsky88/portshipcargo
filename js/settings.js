/*
 * PSCS — preview settings: palette, water and editable hero text.
 * The 4 base colours below are the original palette. Every other colour on
 * the page (lighter/darker surfaces, light blue details, text) is derived
 * from them in derivePalette(), and written into CSS variables on :root.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "pscs-preview-settings-v1";
  var C = window.PSCS_CONTENT;

  var DEFAULTS = {
    version: 1,
    colors: {
      background: "#071b2c", // deep marine blue
      surface: "#0e3a4a", // dark turquoise surface
      turquoise: "#2cc5b6", // bright turquoise accent
      yellow: "#f2c14e" // small yellow accent
    },
    water: {
      enabled: true,
      intensity: 50 // 0..100
    },
    text: {
      headline: C.hero.headline,
      subheadline: C.hero.subheadline
    },
    ui: {
      hideToggle: false
    }
  };

  var HEX = /^#[0-9a-fA-F]{6}$/;
  var MAX_TEXT = 220;

  function clone(o) {
    return JSON.parse(JSON.stringify(o));
  }

  /* ---------- colour helpers ---------- */
  function hexToRgb(hex) {
    var n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgbToHex(rgb) {
    return (
      "#" +
      rgb
        .map(function (v) {
          var s = Math.round(Math.max(0, Math.min(255, v))).toString(16);
          return s.length === 1 ? "0" + s : s;
        })
        .join("")
    );
  }
  function mix(a, b, t) {
    var x = hexToRgb(a),
      y = hexToRgb(b);
    return rgbToHex([x[0] + (y[0] - x[0]) * t, x[1] + (y[1] - x[1]) * t, x[2] + (y[2] - x[2]) * t]);
  }
  function luminance(hex) {
    var c = hexToRgb(hex).map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }

  /* Build the full token set from the 4 base colours. */
  function derivePalette(colors) {
    var bg = colors.background,
      sf = colors.surface,
      tq = colors.turquoise,
      ye = colors.yellow;
    var light = luminance(bg) > 0.35; // a light background flips text to dark
    var text = light ? mix(bg, "#03121d", 0.9) : "#eaf3f6";
    var muted = light ? mix(bg, "#03121d", 0.68) : mix("#eaf3f6", bg, 0.3);
    var sky = mix(tq, "#9ed6ff", 0.55);

    return {
      "bg": bg,
      "bg-deep": mix(bg, "#000000", 0.35),
      "bg-raise": mix(bg, sf, 0.45),
      "surface": sf,
      "surface-hi": mix(sf, "#ffffff", 0.13),
      "surface-top": mix(sf, "#ffffff", 0.24),
      "surface-lo": mix(sf, bg, 0.55),
      "teal": tq,
      "teal-soft": mix(tq, sf, 0.5),
      "teal-dim": mix(tq, bg, 0.62),
      "sky": sky,
      "sky-soft": mix(sky, sf, 0.45),
      "sky-dim": mix(sky, bg, 0.5),
      "crane": mix(sky, sf, 0.35),
      "crane-lo": mix(sky, sf, 0.62),
      "yellow": ye,
      "yellow-soft": mix(ye, sf, 0.35),
      "text": text,
      "muted": muted,
      "line": light ? mix(bg, "#03121d", 0.16) : mix(bg, "#eaf3f6", 0.12),
      "line-strong": light ? mix(bg, "#03121d", 0.3) : mix(bg, "#eaf3f6", 0.22),
      "on-accent": mix(bg, "#000000", 0.4)
    };
  }

  function applyPalette(colors) {
    var tokens = derivePalette(colors);
    var root = document.documentElement;
    Object.keys(tokens).forEach(function (k) {
      root.style.setProperty("--" + k, tokens[k]);
    });
    window.PSCS_TOKENS = tokens;
    return tokens;
  }

  /* ---------- validation: anything unexpected falls back to defaults ---------- */
  function cleanText(v, fallback) {
    if (typeof v !== "string") return fallback;
    var s = v.replace(/[\u0000-\u001f\u007f]/g, " ").trim();
    if (!s) return fallback;
    return s.slice(0, MAX_TEXT);
  }

  /* Returns { settings, errors }. Never throws. */
  function sanitize(input) {
    var out = clone(DEFAULTS);
    var errors = [];
    if (!input || typeof input !== "object" || Array.isArray(input)) {
      return { settings: out, errors: ["The file does not contain a settings object."] };
    }
    var c = input.colors;
    if (c && typeof c === "object") {
      ["background", "surface", "turquoise", "yellow"].forEach(function (k) {
        if (c[k] === undefined) return;
        if (typeof c[k] === "string" && HEX.test(c[k])) out.colors[k] = c[k].toLowerCase();
        else errors.push("colors." + k + " must look like #12abef.");
      });
    }
    var w = input.water;
    if (w && typeof w === "object") {
      if (w.enabled !== undefined) {
        if (typeof w.enabled === "boolean") out.water.enabled = w.enabled;
        else errors.push("water.enabled must be true or false.");
      }
      if (w.intensity !== undefined) {
        var n = Number(w.intensity);
        if (typeof w.intensity === "number" && isFinite(n)) out.water.intensity = Math.max(0, Math.min(100, Math.round(n)));
        else errors.push("water.intensity must be a number 0–100.");
      }
    }
    var t = input.text;
    if (t && typeof t === "object") {
      out.text.headline = cleanText(t.headline, out.text.headline);
      out.text.subheadline = cleanText(t.subheadline, out.text.subheadline);
      if (t.headline !== undefined && typeof t.headline !== "string") errors.push("text.headline must be text.");
      if (t.subheadline !== undefined && typeof t.subheadline !== "string") errors.push("text.subheadline must be text.");
    }
    var u = input.ui;
    if (u && typeof u === "object" && typeof u.hideToggle === "boolean") out.ui.hideToggle = u.hideToggle;
    return { settings: out, errors: errors };
  }

  /* ---------- local storage (wrapped: private mode etc. must not break the page) ---------- */
  /* Saved text that is still an earlier default (never edited by the owner)
     moves to the current default; anything the owner wrote is kept. */
  function upgradeLegacyText(s) {
    var legacyH = C.hero.legacyHeadlines || [];
    var legacyS = C.hero.legacySubheadlines || [];
    if (legacyH.indexOf(s.text.headline) !== -1) s.text.headline = DEFAULTS.text.headline;
    if (legacyS.indexOf(s.text.subheadline) !== -1) s.text.subheadline = DEFAULTS.text.subheadline;
    return s;
  }
  function load() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return clone(DEFAULTS);
      return upgradeLegacyText(sanitize(JSON.parse(raw)).settings);
    } catch (e) {
      return clone(DEFAULTS);
    }
  }
  function save(s) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
      return true;
    } catch (e) {
      return false;
    }
  }
  function clear() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }

  window.PSCS_SETTINGS = {
    DEFAULTS: DEFAULTS,
    clone: clone,
    sanitize: sanitize,
    load: load,
    save: save,
    clear: clear,
    applyPalette: applyPalette,
    derivePalette: derivePalette
  };

  // Apply the palette as early as possible to avoid a flash of default colours.
  window.PSCS_STATE = load();
  applyPalette(window.PSCS_STATE.colors);
})();
