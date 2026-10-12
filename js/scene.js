/*
 * PSCS — hero composition: port + ship + cargo.
 * Built as one SVG (viewBox 1200 × 400, waterline at y = 400).
 * All colours reference palette CSS variables through inline styles, so the
 * Customize panel recolours the scene and the water reflection.
 */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";

  function el(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function fill(v, op) {
    return "fill:var(--" + v + ")" + (op !== undefined ? ";fill-opacity:" + op : "");
  }

  /* One cargo container seen from the side, with a hint of top + side faces. */
  function container(g, x, yBottom, color, isTop) {
    var w = 52,
      h = 24,
      y = yBottom - h;
    el("polygon", { points: [x + w, y, x + w + 5, y - 4, x + w + 5, y + h - 4, x + w, y + h].join(" "), style: fill(color), opacity: "1" }, g);
    el("polygon", { points: [x + w, y, x + w + 5, y - 4, x + w + 5, y + h - 4, x + w, y + h].join(" "), fill: "#00080f", opacity: "0.28" }, g);
    el("rect", { x: x, y: y, width: w, height: h, style: fill(color) }, g);
    if (isTop) {
      el("polygon", { points: [x, y, x + 5, y - 4, x + w + 5, y - 4, x + w, y].join(" "), style: fill(color) }, g);
      el("polygon", { points: [x, y, x + 5, y - 4, x + w + 5, y - 4, x + w, y].join(" "), fill: "#ffffff", opacity: "0.16" }, g);
    }
    for (var i = 1; i < 5; i++) {
      el("rect", { x: x + (w / 5) * i, y: y + 3, width: 1, height: h - 6, fill: "#00080f", opacity: "0.13" }, g);
    }
    el("rect", { x: x, y: y + h - 1.5, width: w, height: 1.5, fill: "#00080f", opacity: "0.3" }, g);
    el("rect", { x: x, y: y, width: w, height: 1.5, fill: "#ffffff", opacity: "0.07" }, g);
  }

  function stack(g, x0, step, yBase, tiers, palette, overrides) {
    tiers.forEach(function (n, c) {
      for (var t = 0; t < n; t++) {
        var key = c + ":" + t;
        var color = (overrides && overrides[key]) || palette[(c * 3 + t * 2) % palette.length];
        container(g, x0 + c * step, yBase - t * 24, color, t === n - 1);
      }
    });
  }

  function build(svg) {
    var defs = el("defs", {}, svg);

    var hull = el("linearGradient", { id: "pscsHull", x1: "0", y1: "0", x2: "0", y2: "1" }, defs);
    el("stop", { offset: "0", style: "stop-color:var(--surface-hi)" }, hull);
    el("stop", { offset: "1", style: "stop-color:var(--surface-lo)" }, hull);

    var quay = el("linearGradient", { id: "pscsQuay", x1: "0", y1: "0", x2: "0", y2: "1" }, defs);
    el("stop", { offset: "0", style: "stop-color:var(--surface)" }, quay);
    el("stop", { offset: "1", style: "stop-color:var(--bg-raise)" }, quay);

    var glow = el("radialGradient", { id: "pscsGlow", cx: "0.6", cy: "0.72", r: "0.42" }, defs);
    el("stop", { offset: "0", style: "stop-color:var(--sky);stop-opacity:0.13" }, glow);
    el("stop", { offset: "1", style: "stop-color:var(--sky);stop-opacity:0" }, glow);

    var sh = el("filter", { id: "pscsShadow", x: "-10%", y: "-10%", width: "130%", height: "140%" }, defs);
    el("feDropShadow", { dx: "5", dy: "8", stdDeviation: "9", "flood-color": "#00070d", "flood-opacity": "0.38" }, sh);

    // soft light behind the composition
    el("rect", { x: "0", y: "0", width: "1200", height: "400", fill: "url(#pscsGlow)" }, svg);

    // distant shore
    var far = el("g", { opacity: "0.75" }, svg);
    el("rect", { x: "0", y: "376", width: "720", height: "24", style: fill("bg-raise") }, far);
    [[18, 360, 46], [74, 366, 30], [300, 368, 60], [380, 362, 26], [430, 370, 70]].forEach(function (b) {
      el("rect", { x: b[0], y: b[1], width: b[2], height: 400 - b[1], style: fill("bg-raise") }, far);
    });
    // small light tower with a yellow lamp
    el("rect", { x: "44", y: "316", width: "7", height: "60", style: fill("surface-lo") }, svg);
    el("rect", { x: "41", y: "310", width: "13", height: "7", rx: "1.5", style: fill("surface") }, svg);
    el("circle", { cx: "47.5", cy: "306", r: "3.2", style: fill("yellow") }, svg);

    // quay (behind the ship)
    var q = el("g", { filter: "url(#pscsShadow)" }, svg);
    el("rect", { x: "690", y: "330", width: "530", height: "70", fill: "url(#pscsQuay)" }, q);
    el("rect", { x: "690", y: "330", width: "530", height: "4", style: fill("surface-top") }, q);
    for (var f = 0; f < 8; f++) el("rect", { x: 760 + f * 58, y: "340", width: "10", height: "26", rx: "2", style: fill("bg-deep"), opacity: "0.55" }, q);

    var qs = el("g", { filter: "url(#pscsShadow)" }, svg);
    stack(qs, 1042, 56, 330, [2, 3, 1], ["crane-lo", "teal-dim", "surface-hi", "sky-dim"], { "2:0": "yellow-soft" });

    // ship-to-shore crane
    var cr = el("g", { filter: "url(#pscsShadow)" }, svg);
    el("rect", { x: "820", y: "146", width: "12", height: "184", style: fill("crane") }, cr);
    el("rect", { x: "940", y: "146", width: "12", height: "184", style: fill("crane-lo") }, cr);
    el("rect", { x: "820", y: "246", width: "132", height: "9", style: fill("crane") }, cr);
    el("line", { x1: "832", y1: "255", x2: "940", y2: "322", style: "stroke:var(--crane-lo)", "stroke-width": "4" }, cr);
    el("line", { x1: "940", y1: "255", x2: "832", y2: "322", style: "stroke:var(--crane-lo)", "stroke-width": "4" }, cr);
    el("rect", { x: "812", y: "324", width: "28", height: "8", rx: "2", style: fill("surface-lo") }, cr);
    el("rect", { x: "932", y: "324", width: "28", height: "8", rx: "2", style: fill("surface-lo") }, cr);
    // A-frame and stays
    el("polyline", { points: "856,140 892,62 928,140", fill: "none", style: "stroke:var(--crane)", "stroke-width": "6", "stroke-linejoin": "round" }, cr);
    el("line", { x1: "892", y1: "64", x2: "556", y2: "141", style: "stroke:var(--crane-lo)", "stroke-width": "2.5" }, cr);
    el("line", { x1: "892", y1: "64", x2: "1022", y2: "141", style: "stroke:var(--crane-lo)", "stroke-width": "2.5" }, cr);
    // boom
    el("rect", { x: "540", y: "138", width: "496", height: "13", rx: "2", style: fill("crane") }, cr);
    el("rect", { x: "540", y: "138", width: "496", height: "3", style: "fill:#ffffff", opacity: "0.18" }, cr);
    // machinery house
    el("rect", { x: "966", y: "112", width: "62", height: "26", rx: "2", style: fill("surface-hi") }, cr);
    el("rect", { x: "966", y: "112", width: "62", height: "4", style: fill("surface-top") }, cr);
    // trolley + cab
    el("rect", { x: "594", y: "151", width: "36", height: "12", rx: "2", style: fill("surface-hi") }, cr);
    el("rect", { x: "604", y: "163", width: "18", height: "10", rx: "1.5", style: fill("surface") }, cr);
    el("rect", { x: "607", y: "165", width: "12", height: "4", style: fill("yellow"), opacity: "0.9" }, cr);
    // hoist ropes + spreader + container
    el("line", { x1: "600", y1: "163", x2: "596", y2: "196", style: "stroke:var(--crane-lo)", "stroke-width": "1.5" }, cr);
    el("line", { x1: "624", y1: "163", x2: "628", y2: "196", style: "stroke:var(--crane-lo)", "stroke-width": "1.5" }, cr);
    el("rect", { x: "584", y: "196", width: "56", height: "5", rx: "1", style: fill("surface-hi") }, cr);
    container(cr, 586, 226, "yellow", true);

    // ship
    var sp = el("g", { filter: "url(#pscsShadow)" }, svg);
    stack(sp, 250, 56, 290, [3, 4, 4, 3, 4, 3, 2, 3], ["teal-soft", "sky-soft", "surface-hi", "teal-dim", "crane-lo"]);
    // superstructure
    el("rect", { x: "112", y: "196", width: "98", height: "96", style: fill("surface-hi") }, sp);
    el("rect", { x: "104", y: "188", width: "114", height: "9", rx: "1.5", style: fill("surface-top") }, sp);
    el("rect", { x: "120", y: "205", width: "82", height: "8", rx: "2", style: fill("sky"), opacity: "0.6" }, sp);
    el("rect", { x: "120", y: "230", width: "82", height: "4", rx: "2", style: fill("sky"), opacity: "0.25" }, sp);
    el("rect", { x: "120", y: "250", width: "82", height: "4", rx: "2", style: fill("sky"), opacity: "0.2" }, sp);
    el("rect", { x: "112", y: "196", width: "8", height: "96", fill: "#ffffff", opacity: "0.06" }, sp);
    el("rect", { x: "150", y: "156", width: "32", height: "32", rx: "2", style: fill("surface-hi") }, sp);
    el("rect", { x: "150", y: "164", width: "32", height: "6", style: fill("yellow") }, sp);
    el("rect", { x: "198", y: "150", width: "3", height: "38", style: fill("crane-lo") }, sp);
    // hull
    el("path", { d: "M96 292 L742 292 C752 322 750 362 730 400 L112 400 C104 360 98 328 96 292 Z", fill: "url(#pscsHull)" }, sp);
    el("path", { d: "M96 292 L742 292 L744 298 L97 298 Z", style: fill("surface-top") }, sp);
    el("rect", { x: "104", y: "306", width: "640", height: "14", fill: "#ffffff", opacity: "0.035" }, sp);
    el("path", { d: "M108 381 L738 381 L736 385 L109 385 Z", style: fill("teal"), opacity: "0.75" }, sp);
  }

  var svg = document.getElementById("hero-scene");
  if (svg) build(svg);
})();
