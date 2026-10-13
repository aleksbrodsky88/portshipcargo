/*
 * PSCS — water under the hero: a mirrored, rippling reflection of the scene.
 * The SVG scene is serialised with the current palette, drawn once into an
 * offscreen image, then redrawn row by row with a wave offset. The pointer
 * (or touch) adds local ripples. Exposes window.PSCS_WATER.{update, rebuild}.
 */
(function () {
  "use strict";
  var canvas = document.getElementById("hero-water");
  var svg = document.getElementById("hero-scene");
  if (!canvas || !svg) return;
  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  var VB_W = 1200, VB_H = 400;
  var settings = { enabled: true, intensity: 50 };
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  var img = null; // rendered scene
  var ready = false;
  var W = 0, H = 0, dpr = 1, scale = 1, offX = 0, sceneH = 0;
  var ripples = []; // {x, t0}
  var raf = 0, visible = true, last = -1;

  /* ---------- scene -> image ---------- */
  function rebuild() {
    var tokens = window.PSCS_TOKENS || {};
    var src = new XMLSerializer().serializeToString(svg);
    src = src.replace(/var\(--([a-z-]+)\)/g, function (m, k) {
      return tokens[k] || "#000000";
    });
    if (src.indexOf('width="') === -1 || !/<svg[^>]*\swidth=/.test(src)) {
      src = src.replace("<svg", '<svg width="' + VB_W + '" height="' + VB_H + '"');
    } else {
      src = src.replace(/(<svg[^>]*?)\swidth="[^"]*"/, '$1 width="' + VB_W + '"').replace(/(<svg[^>]*?)\sheight="[^"]*"/, '$1 height="' + VB_H + '"');
    }
    var im = new Image();
    im.onload = function () {
      img = im;
      ready = true;
      schedule(true);
    };
    im.onerror = function () { ready = false; };
    im.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(src);
  }

  /* ---------- sizing ---------- */
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    var r = canvas.getBoundingClientRect();
    W = Math.max(1, Math.round(r.width));
    H = Math.max(1, Math.round(r.height));
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    var sr = svg.getBoundingClientRect();
    sceneH = sr.height || 1;
    // same fit as preserveAspectRatio="xMidYMax slice"
    scale = Math.max(W / VB_W, sceneH / VB_H);
    offX = (W - VB_W * scale) / 2;
    schedule(true);
  }

  /* ---------- drawing ---------- */
  function draw(now) {
    if (!ready || !img) return;
    var t = now / 1000;
    var k = settings.intensity / 100;
    var motion = settings.enabled && !reducedMotion.matches;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    for (var y = 0; y < H; y++) {
      var depth = y / H; // 0 at the waterline, 1 at the bottom
      // source row in scene pixels (mirror around the waterline)
      var sy = VB_H - (y / scale) - 0.5;
      if (sy < 0) break;
      var amp = motion ? (1.2 + depth * 7) * (0.35 + k * 1.3) : 0;
      var dx = amp * (Math.sin(y * 0.11 + t * 1.6) + 0.5 * Math.sin(y * 0.23 - t * 2.3));
      for (var i = 0; i < ripples.length; i++) {
        var rp = ripples[i];
        var age = t - rp.t0;
        var ry = rp.y;
        var dist = Math.abs(y - ry);
        var ring = age * 90;
        var env = Math.exp(-age * 1.4) * Math.exp(-Math.pow((dist - ring * 0.35) / 24, 2));
        dx += env * 10 * (0.35 + k * 1.3) * Math.sin(dist * 0.5 - age * 9) * (rp.x < W / 2 ? 1 : -1);
      }
      ctx.globalAlpha = Math.max(0, 0.75 * (1 - depth) * (1 - depth) + 0.04);
      ctx.drawImage(img, 0, sy, VB_W, 1, offX + dx, y, VB_W * scale, 1);
    }
    ctx.globalAlpha = 1;

    // soft light streaks on the surface
    if (motion) {
      var tk = window.PSCS_TOKENS || {};
      ctx.fillStyle = tk["sky"] || "#9ed6ff";
      for (var s = 0; s < 14; s++) {
        var yy = ((s * 37 + t * (4 + (s % 3))) % H);
        var xx = ((s * 211 + Math.sin(t * 0.4 + s) * 30) % W + W) % W;
        ctx.globalAlpha = 0.05 * (1 - yy / H) * (0.4 + k);
        ctx.fillRect(xx, yy, 30 + (s % 4) * 18, 1);
      }
      ctx.globalAlpha = 1;
    }
    ripples = ripples.filter(function (r) { return t - r.t0 < 3; });
  }

  function frame(now) {
    raf = 0;
    if (!visible) return;
    draw(now);
    var animating = settings.enabled && !reducedMotion.matches;
    if (animating || ripples.length) raf = requestAnimationFrame(frame);
  }
  function schedule() {
    if (!raf && visible) raf = requestAnimationFrame(frame);
  }

  /* ---------- pointer ripples ---------- */
  function addRipple(e) {
    if (!started || !settings.enabled || settings.intensity === 0 || reducedMotion.matches) return;
    var r = canvas.getBoundingClientRect();
    var x = e.clientX - r.left, y = e.clientY - r.top;
    if (y < -40 || y > r.height + 40) return;
    var now = performance.now() / 1000;
    if (last > 0 && now - last < 0.08) return;
    last = now;
    ripples.push({ x: x, y: Math.max(0, Math.min(H, y)), t0: now });
    if (ripples.length > 12) ripples.shift();
    schedule();
  }
  window.addEventListener("pointermove", addRipple, { passive: true });
  window.addEventListener("pointerdown", addRipple, { passive: true });

  /* ---------- lifecycle ---------- */
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) schedule();
    }).observe(canvas);
  }
  window.addEventListener("resize", function () { if (started) resize(); });
  if (reducedMotion.addEventListener) reducedMotion.addEventListener("change", function () { schedule(); });

  /* The effect belongs to the illustrated scene. While the hero shows a
     photograph (stage.is-photo) it stays off; saved water settings are kept. */
  var stage = document.getElementById("hero-stage");
  var started = false;
  function start() {
    if (started) return;
    started = true;
    resize();
    rebuild();
  }

  window.PSCS_WATER = {
    get available() { return !stage || !stage.classList.contains("is-photo"); },
    update: function (w) {
      if (!w) return;
      settings.enabled = !!w.enabled;
      settings.intensity = Math.max(0, Math.min(100, Number(w.intensity) || 0));
      schedule();
    },
    rebuild: function () { if (started) rebuild(); },
    start: start
  };

  var s = window.PSCS_STATE && window.PSCS_STATE.water;
  if (s) window.PSCS_WATER.update(s);
  if (window.PSCS_WATER.available) start();
  // photo failed to load -> the illustration returns and the water with it
  document.addEventListener("pscs:hero-mode", function () {
    if (window.PSCS_WATER.available) start();
  });
})();
