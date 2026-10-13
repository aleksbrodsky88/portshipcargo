/*
 * PSCS — "Customize preview" panel (owner tool, not part of the client site).
 * Changes apply instantly and are saved in this browser (localStorage).
 * To remove the panel from a future production build, delete the
 * <!-- CUSTOMIZER --> block in index.html and this script tag.
 */
(function () {
  "use strict";
  var S = window.PSCS_SETTINGS;
  var state = window.PSCS_STATE;

  var toggle = document.getElementById("cz-toggle");
  var panel = document.getElementById("cz-panel");
  var closeBtn = document.getElementById("cz-close");
  var form = document.getElementById("cz-form");
  var status = document.getElementById("cz-status");
  var fileInput = document.getElementById("cz-file");
  if (!toggle || !panel) return;

  var f = {
    background: document.getElementById("cz-bg"),
    surface: document.getElementById("cz-surface"),
    turquoise: document.getElementById("cz-turquoise"),
    yellow: document.getElementById("cz-yellow"),
    intensity: document.getElementById("cz-intensity"),
    intensityOut: document.getElementById("cz-intensity-out"),
    enabled: document.getElementById("cz-water"),
    headline: document.getElementById("cz-headline"),
    subheadline: document.getElementById("cz-sub"),
    hideToggle: document.getElementById("cz-hide")
  };

  var statusTimer = 0;
  function say(msg, kind) {
    status.textContent = msg;
    status.className = "cz-status" + (kind ? " is-" + kind : "");
    clearTimeout(statusTimer);
    if (kind !== "error") statusTimer = setTimeout(function () { status.textContent = ""; }, 3500);
  }

  /* ---------- apply state to the page ---------- */
  function apply(opts) {
    S.applyPalette(state.colors);
    window.PSCS_SET_HERO_TEXT(state.text.headline, state.text.subheadline);
    if (window.PSCS_WATER) {
      window.PSCS_WATER.update(state.water);
      if (!opts || opts.palette !== false) window.PSCS_WATER.rebuild();
    }
    document.documentElement.classList.toggle("cz-toggle-hidden", !!state.ui.hideToggle);
    S.save(state);
  }

  function fillForm() {
    ["background", "surface", "turquoise", "yellow"].forEach(function (k) {
      f[k].value = state.colors[k];
      var out = document.getElementById(f[k].id + "-hex");
      if (out) out.textContent = state.colors[k];
    });
    f.intensity.value = state.water.intensity;
    f.intensityOut.textContent = state.water.intensity;
    f.enabled.checked = state.water.enabled;
    f.headline.value = state.text.headline;
    f.subheadline.value = state.text.subheadline;
    f.hideToggle.checked = state.ui.hideToggle;
  }

  /* The water effect belongs to the illustrated scene: with a photographic hero
     the controls are disabled (values stay saved, nothing is erased). */
  function syncWaterAvailability() {
    var on = !window.PSCS_WATER || window.PSCS_WATER.available !== false;
    f.enabled.disabled = !on;
    f.intensity.disabled = !on;
    var note = document.getElementById("cz-water-note");
    if (note) note.hidden = on;
  }
  document.addEventListener("pscs:hero-mode", syncWaterAvailability);

  /* ---------- inputs ---------- */
  ["background", "surface", "turquoise", "yellow"].forEach(function (k) {
    f[k].addEventListener("input", function () {
      if (!/^#[0-9a-fA-F]{6}$/.test(f[k].value)) return;
      state.colors[k] = f[k].value.toLowerCase();
      var out = document.getElementById(f[k].id + "-hex");
      if (out) out.textContent = state.colors[k];
      apply();
    });
  });
  f.intensity.addEventListener("input", function () {
    state.water.intensity = Math.max(0, Math.min(100, parseInt(f.intensity.value, 10) || 0));
    f.intensityOut.textContent = state.water.intensity;
    apply({ palette: false });
  });
  f.enabled.addEventListener("change", function () {
    state.water.enabled = f.enabled.checked;
    apply({ palette: false });
  });
  function textInput(el, key) {
    el.addEventListener("input", function () {
      var v = el.value.replace(/[\u0000-\u001f\u007f]/g, " ");
      state.text[key] = v.trim() ? v.slice(0, 220) : S.DEFAULTS.text[key];
      apply({ palette: false });
    });
  }
  textInput(f.headline, "headline");
  textInput(f.subheadline, "subheadline");
  f.hideToggle.addEventListener("change", function () {
    state.ui.hideToggle = f.hideToggle.checked;
    apply({ palette: false });
    if (state.ui.hideToggle) say("Button hidden. Press Alt + Shift + C or open the page with #customize to show it again.");
  });

  /* ---------- reset / export / import ---------- */
  document.getElementById("cz-reset").addEventListener("click", function () {
    state = S.clone(S.DEFAULTS);
    window.PSCS_STATE = state;
    S.clear();
    fillForm();
    apply();
    say("Original settings restored.", "ok");
  });

  document.getElementById("cz-export").addEventListener("click", function () {
    try {
      var blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "pscs-preview-settings.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      say("Settings exported.", "ok");
    } catch (e) {
      say("Export is not available in this browser.", "error");
    }
  });

  document.getElementById("cz-import").addEventListener("click", function () {
    fileInput.value = "";
    fileInput.click();
  });
  fileInput.addEventListener("change", function () {
    var file = fileInput.files && fileInput.files[0];
    if (!file) return;
    if (file.size > 50000) {
      say("That file is too large to be a settings file.", "error");
      return;
    }
    var reader = new FileReader();
    reader.onerror = function () { say("The file could not be read.", "error"); };
    reader.onload = function () {
      var data;
      try {
        data = JSON.parse(String(reader.result));
      } catch (e) {
        say("Not a valid JSON file. Nothing was changed.", "error");
        return;
      }
      var res = S.sanitize(data);
      if (res.errors.length && res.errors[0].indexOf("does not contain") !== -1) {
        say(res.errors[0] + " Nothing was changed.", "error");
        return;
      }
      state = res.settings;
      window.PSCS_STATE = state;
      fillForm();
      apply();
      if (res.errors.length) say("Imported. Some values were invalid and kept their defaults: " + res.errors.join(" "), "error");
      else say("Settings imported.", "ok");
    };
    reader.readAsText(file);
  });

  /* ---------- open / close ---------- */
  function open() {
    panel.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    requestAnimationFrame(function () {
      panel.classList.add("is-open");
      closeBtn.focus();
    });
  }
  function close() {
    panel.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    setTimeout(function () {
      if (!panel.classList.contains("is-open")) panel.hidden = true;
    }, 220);
    if (!state.ui.hideToggle) toggle.focus();
  }
  function isOpen() {
    return panel.classList.contains("is-open");
  }
  toggle.addEventListener("click", function () {
    if (!isOpen()) open();
    else close();
  });
  closeBtn.addEventListener("click", close);
  panel.addEventListener("keydown", function (e) {
    if (e.key === "Escape") close();
  });
  form.addEventListener("submit", function (e) { e.preventDefault(); });

  // Bring the hidden button back: Alt + Shift + C, or the #customize URL hash.
  function reveal() {
    state.ui.hideToggle = false;
    f.hideToggle.checked = false;
    apply({ palette: false });
  }
  document.addEventListener("keydown", function (e) {
    if (e.altKey && e.shiftKey && (e.code === "KeyC" || e.key === "C" || e.key === "c")) {
      e.preventDefault();
      reveal();
      if (!isOpen()) open();
    }
  });
  function checkHash() {
    if (location.hash === "#customize") {
      reveal();
      if (!isOpen()) open();
    }
  }
  window.addEventListener("hashchange", checkHash);

  fillForm();
  syncWaterAvailability();
  apply({ palette: false });
  checkHash();
})();
