/**
 * Markets section — 3D-ish orbiting symbol chips (SVGs), depth blur + cursor repulsion.
 * Mount into an empty positioned container; React should leave children to this module.
 */
(function (global) {
  'use strict';

  var ICONS = [
    'eur', 'usd', 'gbp', 'jpy', 'chf', 'aud', 'cad', 'nzd',
    'xau', 'xag', 'btc', 'eth', 'sol', 'xrp',
    'us500', 'ger40', 'fra40', 'jpn225', 'ukoil', 'natgas',
  ];

  function fibonacciSphere(n, radius) {
    var pts = [];
    for (var i = 0; i < n; i++) {
      var y = 1 - (2 * (i + 0.5)) / Math.max(1, n);
      var r = Math.sqrt(Math.max(0, 1 - y * y));
      var theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
      pts.push({
        bx: Math.cos(theta) * r * radius,
        by: y * radius,
        bz: Math.sin(theta) * r * radius,
      });
    }
    return pts;
  }

  function rotY(p, a) {
    var c = Math.cos(a);
    var s = Math.sin(a);
    return { x: c * p.x + s * p.z, y: p.y, z: -s * p.x + c * p.z };
  }

  function rotX(p, a) {
    var c = Math.cos(a);
    var s = Math.sin(a);
    return { x: p.x, y: c * p.y - s * p.z, z: s * p.y + c * p.z };
  }

  function mount(container) {
    if (!container) {
      return { destroy: function () {} };
    }

    var reduced = false;
    try {
      reduced = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {}

    var mq = global.matchMedia && global.matchMedia('(max-width: 719px)');
    var hidden = mq && mq.matches;

    var stage = document.createElement('div');
    stage.className = 'jafx-markets-sphere-stage';
    stage.style.cssText =
      'position:absolute;inset:0;overflow:visible;pointer-events:auto;' +
      'touch-action:none;';
    container.appendChild(stage);

    var chipPx = 50;
    var chipHalf = chipPx / 2;
    var rw = Math.max(320, container.clientWidth || container.getBoundingClientRect().width || 400);
    var sphereR = Math.min(290, rw * 0.34);
    var base = fibonacciSphere(ICONS.length, sphereR);
    var chips = [];
    for (var i = 0; i < ICONS.length; i++) {
      var wrap = document.createElement('div');
      wrap.style.cssText =
        'position:absolute;width:' + chipPx + 'px;height:' + chipPx + 'px;margin:-' + chipHalf + 'px 0 0 -' + chipHalf + 'px;' +
        'pointer-events:none;will-change:transform,filter,opacity,left,top;';
      var src = 'assets/symbols/' + ICONS[i] + '.svg';
      var face = document.createElement('div');
      face.setAttribute('aria-hidden', 'true');
      face.style.cssText =
        'display:block;width:' + chipPx + 'px;height:' + chipPx + 'px;border-radius:50%;' +
        'background-color:var(--action);' +
        '-webkit-mask-image:url("' + src + '");' +
        'mask-image:url("' + src + '");' +
        '-webkit-mask-size:contain;mask-size:contain;' +
        '-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;' +
        '-webkit-mask-position:center;mask-position:center;' +
        'box-shadow:0 0 0 1px var(--line, rgba(255,255,255,0.08));';
      wrap.appendChild(face);
      stage.appendChild(wrap);
      chips.push({
        wrap: wrap,
        bx: base[i].bx,
        by: base[i].by,
        bz: base[i].bz,
        dispX: 0,
        dispY: 0,
      });
    }

    var angleY = 0;
    var angleX = 0.35;
    var mx = -9999;
    var my = -9999;
    var raf = 0;
    var alive = true;

    function onMove(e) {
      var rect = container.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    }

    function onLeave() {
      mx = -9999;
      my = -9999;
    }

    function onMqChange() {
      hidden = mq && mq.matches;
      container.style.visibility = hidden ? 'hidden' : 'visible';
      container.style.pointerEvents = hidden ? 'none' : 'auto';
    }

    container.addEventListener('mousemove', onMove, { passive: true });
    container.addEventListener('mouseleave', onLeave, { passive: true });
    if (mq) {
      if (mq.addEventListener) mq.addEventListener('change', onMqChange);
      else mq.addListener(onMqChange);
    }
    onMqChange();

    var focal = 440;
    var repelR = 132;
    var repelS = 0.5;
    var repelSmooth = 0.14;

    function tick() {
      if (!alive) return;
      if (!hidden) {
        if (reduced) {
          angleY += 0.0028;
          angleX += 0.0011;
        } else {
          angleY += 0.011;
          angleX += 0.0042;
        }

        var rect = container.getBoundingClientRect();
        if (rect.width < 48 || rect.height < 48) {
          raf = global.requestAnimationFrame(tick);
          return;
        }
        var cx = rect.width * 0.52;
        var cy = rect.height * 0.48;

        var zList = [];
        for (var j = 0; j < chips.length; j++) {
          var c = chips[j];
          var p = { x: c.bx, y: c.by, z: c.bz };
          p = rotY(p, angleY);
          p = rotX(p, angleX);
          var denom = focal + p.z;
          if (denom < 80) denom = 80;
          var sc = focal / denom;
          var sx = cx + p.x * sc;
          var sy = cy + p.y * sc;

          var dx = sx - mx;
          var dy = sy - my;
          var dist = Math.sqrt(dx * dx + dy * dy);
          var tx = 0;
          var ty = 0;
          if (dist < repelR && dist > 0.5) {
            var push = (repelR - dist) * repelS;
            tx = (dx / dist) * push;
            ty = (dy / dist) * push;
          }
          c.dispX += (tx - c.dispX) * repelSmooth;
          c.dispY += (ty - c.dispY) * repelSmooth;
          sx += c.dispX;
          sy += c.dispY;

          zList.push({ i: j, pz: p.z, sx: sx, sy: sy, sc: sc });
        }

        var minZ = Infinity;
        var maxZ = -Infinity;
        for (var k = 0; k < zList.length; k++) {
          if (zList[k].pz < minZ) minZ = zList[k].pz;
          if (zList[k].pz > maxZ) maxZ = zList[k].pz;
        }
        var zSpan = maxZ - minZ || 1;

        for (var m = 0; m < zList.length; m++) {
          var it = zList[m];
          var chip = chips[it.i];
          var t = (it.pz - minZ) / zSpan;
          var blurPx = (1 - t) * 7.5;
          var op = 0.42 + t * 0.55;
          var zIndex = 10 + Math.round(t * 80);
          var depthScale = 0.3 + t * 1.22;
          var perspBoost = 0.76 + it.sc * 0.36;
          var scale = Math.min(1.55, depthScale * perspBoost);

          chip.wrap.style.left = it.sx + 'px';
          chip.wrap.style.top = it.sy + 'px';
          chip.wrap.style.zIndex = String(zIndex);
          chip.wrap.style.opacity = String(op);
          chip.wrap.style.filter = 'blur(' + blurPx.toFixed(2) + 'px)';
          chip.wrap.style.transform = 'translateZ(0) scale(' + scale.toFixed(3) + ')';
        }
      }

      raf = global.requestAnimationFrame(tick);
    }

    raf = global.requestAnimationFrame(tick);

    return {
      destroy: function () {
        alive = false;
        global.cancelAnimationFrame(raf);
        container.removeEventListener('mousemove', onMove);
        container.removeEventListener('mouseleave', onLeave);
        if (mq) {
          if (mq.removeEventListener) mq.removeEventListener('change', onMqChange);
          else mq.removeListener(onMqChange);
        }
        stage.remove();
      },
    };
  }

  global.JAFXMarketsSphere = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
