// Arrière-plan animé : un réseau de nœuds reliés dans lequel circulent des paquets de données
(function () {
  var canvas = document.getElementById("tech-bg");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");
  var root = document.documentElement;
  var reduce = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };

  var BUCKETS = 6;
  var MAX_HOPS = 3;
  var w = 0, h = 0, linkDist = 150, maxPackets = 10;
  var nodes = [], packets = [];
  var pal = { line: "140,160,186", accent: "255,138,61", lineAlpha: 0.17, dotAlpha: 0.5 };
  var pointer = { x: 0, y: 0, on: false };
  var running = false, raf = 0, last = 0, spawnIn = 0;

  function readPalette() {
    var s = getComputedStyle(root);
    pal.line = s.getPropertyValue("--net-line").trim() || pal.line;
    pal.accent = s.getPropertyValue("--net-accent").trim() || pal.accent;
    pal.lineAlpha = parseFloat(s.getPropertyValue("--net-line-alpha")) || pal.lineAlpha;
    pal.dotAlpha = parseFloat(s.getPropertyValue("--net-dot-alpha")) || pal.dotAlpha;
  }

  function rgba(rgb, a) { return "rgba(" + rgb + "," + a.toFixed(3) + ")"; }

  function makeNode() {
    var angle = Math.random() * Math.PI * 2;
    var speed = 5 + Math.random() * 12; // pixels par seconde
    var hub = Math.random() < 0.1;
    return {
      x: Math.random() * w, y: Math.random() * h,
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      r: hub ? 2.2 : 0.9 + Math.random() * 0.9, hub: hub, phase: Math.random() * Math.PI * 2
    };
  }

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    linkDist = w < 640 ? 115 : 150;
    var target = Math.max(26, Math.min(110, Math.round((w * h) / 14000)));
    while (nodes.length < target) nodes.push(makeNode());
    nodes.length = target;
    maxPackets = Math.max(4, Math.round(target / 7));
    nodes.forEach(function (n) {
      if (n.x > w) n.x = Math.random() * w;
      if (n.y > h) n.y = Math.random() * h;
    });
    packets = packets.filter(function (p) { return nodes.indexOf(p.a) > -1 && nodes.indexOf(p.b) > -1; });
  }

  // Premier voisin trouvé à partir d'un point de départ aléatoire, pour varier les trajets
  function neighbourOf(a, avoid) {
    var max = linkDist * linkDist * 0.7;
    var start = (Math.random() * nodes.length) | 0;
    for (var i = 0; i < nodes.length; i++) {
      var b = nodes[(start + i) % nodes.length];
      if (b === a || b === avoid) continue;
      var dx = a.x - b.x, dy = a.y - b.y;
      if (dx * dx + dy * dy < max) return b;
    }
    return null;
  }

  function sendPacket(from, hops, avoid) {
    var a = from || nodes[(Math.random() * nodes.length) | 0];
    var b = neighbourOf(a, avoid);
    if (b) packets.push({ a: a, b: b, t: 0, dur: 0.9 + Math.random() * 0.8, hops: hops });
  }

  function update(dt) {
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      n.x += n.vx * dt;
      n.y += n.vy * dt;
      if (n.x < 0) { n.x = 0; n.vx = -n.vx; } else if (n.x > w) { n.x = w; n.vx = -n.vx; }
      if (n.y < 0) { n.y = 0; n.vy = -n.vy; } else if (n.y > h) { n.y = h; n.vy = -n.vy; }
    }

    var keep = [], arrived = [];
    for (var k = 0; k < packets.length; k++) {
      var p = packets[k];
      var dx = p.a.x - p.b.x, dy = p.a.y - p.b.y;
      if (dx * dx + dy * dy > linkDist * linkDist) continue; // lien rompu, le paquet disparaît
      p.t += dt / p.dur;
      if (p.t >= 1) arrived.push(p); else keep.push(p);
    }
    packets = keep;
    // Un paquet arrivé repart parfois vers un voisin : on voit des données traverser le réseau
    arrived.forEach(function (p) {
      if (p.hops < MAX_HOPS && Math.random() < 0.65) sendPacket(p.b, p.hops + 1, p.a);
    });

    spawnIn -= dt;
    if (spawnIn <= 0) {
      spawnIn = 0.45;
      if (packets.length < maxPackets) sendPacket(null, 0, null);
    }
  }

  function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  function draw(time) {
    ctx.clearRect(0, 0, w, h);
    var D = linkDist, D2 = D * D, i, j, a, b, dx, dy, d2, seg;

    // Liens regroupés par intensité pour limiter les changements de style
    var buckets = [];
    for (i = 0; i < BUCKETS; i++) buckets.push([]);
    for (i = 0; i < nodes.length; i++) {
      a = nodes[i];
      for (j = i + 1; j < nodes.length; j++) {
        b = nodes[j];
        dx = a.x - b.x; dy = a.y - b.y; d2 = dx * dx + dy * dy;
        if (d2 < D2) {
          var idx = Math.min(BUCKETS - 1, ((1 - Math.sqrt(d2) / D) * BUCKETS) | 0);
          buckets[idx].push(a.x, a.y, b.x, b.y);
        }
      }
    }
    ctx.lineWidth = 1;
    for (i = 0; i < BUCKETS; i++) {
      seg = buckets[i];
      if (!seg.length) continue;
      ctx.strokeStyle = rgba(pal.line, pal.lineAlpha * (i + 1) / BUCKETS);
      ctx.beginPath();
      for (j = 0; j < seg.length; j += 4) { ctx.moveTo(seg[j], seg[j + 1]); ctx.lineTo(seg[j + 2], seg[j + 3]); }
      ctx.stroke();
    }

    // Liens vers le curseur de la souris
    if (pointer.on) {
      var R = 190;
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        dx = a.x - pointer.x; dy = a.y - pointer.y; d2 = dx * dx + dy * dy;
        if (d2 < R * R) {
          ctx.strokeStyle = rgba(pal.accent, 0.32 * (1 - Math.sqrt(d2) / R));
          ctx.beginPath(); ctx.moveTo(pointer.x, pointer.y); ctx.lineTo(a.x, a.y); ctx.stroke();
        }
      }
    }

    // Nœuds simples
    ctx.fillStyle = rgba(pal.line, pal.dotAlpha);
    ctx.beginPath();
    for (i = 0; i < nodes.length; i++) {
      a = nodes[i];
      if (a.hub) continue;
      ctx.moveTo(a.x + a.r, a.y);
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
    }
    ctx.fill();

    // Nœuds principaux avec un halo qui respire
    for (i = 0; i < nodes.length; i++) {
      a = nodes[i];
      if (!a.hub) continue;
      var pulse = 1 + 0.35 * Math.sin(time * 1.6 + a.phase);
      ctx.fillStyle = rgba(pal.accent, 0.1);
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r * 4.5 * pulse, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = rgba(pal.accent, 0.9);
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
    }

    // Paquets de données avec une courte traînée
    for (i = 0; i < packets.length; i++) {
      var p = packets[i];
      var e = ease(p.t), e0 = ease(Math.max(0, p.t - 0.18));
      var x = p.a.x + (p.b.x - p.a.x) * e, y = p.a.y + (p.b.y - p.a.y) * e;
      var x0 = p.a.x + (p.b.x - p.a.x) * e0, y0 = p.a.y + (p.b.y - p.a.y) * e0;
      ctx.strokeStyle = rgba(pal.accent, 0.55);
      ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x, y); ctx.stroke();
      ctx.fillStyle = rgba(pal.accent, 0.16);
      ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = rgba(pal.accent, 1);
      ctx.beginPath(); ctx.arc(x, y, 1.9, 0, Math.PI * 2); ctx.fill();
    }
  }

  function frame(now) {
    if (!running) return;
    var dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    update(dt);
    draw(now / 1000);
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running || reduce.matches || document.hidden) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  readPalette();
  resize();
  draw(0);
  start();

  var resizeTimer = 0;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      resize();
      if (!running) draw(0);
    }, 150);
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop(); else start();
  });

  if (reduce.addEventListener) {
    reduce.addEventListener("change", function () {
      if (reduce.matches) { stop(); packets = []; draw(0); } else start();
    });
  }

  // Le thème change : on relit les couleurs
  new MutationObserver(function () {
    readPalette();
    if (!running) draw(0);
  }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });

  window.addEventListener("pointermove", function (e) {
    if (e.pointerType !== "mouse") return;
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.on = true;
  }, { passive: true });
  root.addEventListener("mouseleave", function () { pointer.on = false; });
  window.addEventListener("blur", function () { pointer.on = false; });
})();
