/* Ask and Find Out – animation engine, soft sounds and Ollie the owl.
   Everything moves through here, so the game file only says WHAT happens.
   Calm on purpose: one thing moves at a time, smooth easing, nothing flashes hard.
   AskFX.setSpeed(0.02) makes everything near-instant (used by the automatic tests). */
(function () {
  'use strict';

  let SPEED = 1;
  let soundCheck = () => true;
  const REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const D = (ms) => Math.max(1, Math.round(ms * SPEED * (REDUCED ? 0.6 : 1)));
  const wait = (ms) => new Promise((r) => setTimeout(r, D(ms)));
  const rnd = (a, b) => a + Math.random() * (b - a);

  /* ===================================================================
     SOUNDS – all made here with the Web Audio API (no files), all soft
     =================================================================== */
  let ctx = null, master = null, noiseBuf = null;
  function ac() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function osc(type, f0, f1, t, dur, vol) {
    const c = ac(), now = c.currentTime + t;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, now);
    if (f1) o.frequency.exponentialRampToValueAtTime(f1, now + dur);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(vol, now + Math.min(0.03, dur / 3));
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    o.connect(g); g.connect(master);
    o.start(now); o.stop(now + dur + 0.05);
  }
  function noise(t, dur, vol, ftype, f0, f1, q) {
    const c = ac(), now = c.currentTime + t;
    if (!noiseBuf) {
      noiseBuf = c.createBuffer(1, c.sampleRate, c.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const s = c.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
    const f = c.createBiquadFilter(); f.type = ftype || 'lowpass'; f.Q.value = q || 1;
    f.frequency.setValueAtTime(f0 || 1000, now);
    if (f1) f.frequency.exponentialRampToValueAtTime(f1, now + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(vol, now + Math.min(0.05, dur / 3));
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    s.connect(f); f.connect(g); g.connect(master);
    s.start(now); s.stop(now + dur + 0.05);
  }
  const SND = {
    pop() { osc('sine', 520, 880, 0, 0.13, 0.11); },
    sparkle() { [1047, 1319, 1568, 2093].forEach((f, i) => osc('sine', f, 0, i * 0.07, 0.28, 0.045)); },
    boing() { osc('sine', 200, 640, 0, 0.22, 0.11); osc('sine', 640, 420, 0.22, 0.12, 0.05); },
    whoosh() { noise(0, 0.8, 0.12, 'bandpass', 300, 2600, 1.4); },
    thud() { osc('sine', 150, 55, 0, 0.25, 0.25); },
    hiss() { noise(0, 1, 0.05, 'highpass', 3500, 0, 0.7); },
    munch() { [0, 0.2, 0.4].forEach((t) => noise(t, 0.11, 0.13, 'lowpass', 900, 0, 1)); },
    rumble() { noise(0, 1.3, 0.22, 'lowpass', 110, 0, 1); osc('sine', 58, 44, 0, 1.2, 0.08); },
    hoot() { osc('sine', 430, 390, 0, 0.22, 0.08); osc('sine', 410, 360, 0.3, 0.32, 0.08); },
    giggle() { [0, 0.11, 0.22, 0.33].forEach((t, i) => osc('sine', 560 - i * 25, 500 - i * 25, t, 0.09, 0.06)); },
    buzz() { osc('sawtooth', 190, 210, 0, 0.7, 0.018); osc('sawtooth', 196, 186, 0.05, 0.6, 0.012); },
    splash() { noise(0, 0.45, 0.13, 'bandpass', 900, 280, 0.8); },
    crack() { noise(0, 0.07, 0.16, 'highpass', 1600, 0, 1); noise(0.12, 0.06, 0.12, 'highpass', 1900, 0, 1); },
    chirp() { [0, 0.15, 0.3].forEach((t) => osc('sine', 1900, 2700, t, 0.08, 0.045)); },
    drip() { osc('sine', 1300, 520, 0, 0.13, 0.08); },
    wind() { noise(0, 1.5, 0.07, 'bandpass', 450, 950, 0.6); },
    twinkle() { [1568, 2093, 1760, 2349].forEach((f, i) => osc('triangle', f, 0, i * 0.1, 0.3, 0.03)); },
    rustle() { [0, 0.16, 0.3, 0.5, 0.66].forEach((t) => noise(t, 0.12, 0.05, 'highpass', 2200, 0, 0.5)); },
    tick() { osc('square', 1300, 0, 0, 0.03, 0.015); },
    magic() { [523, 659, 784, 1047, 1319].forEach((f, i) => osc('sine', f, 0, i * 0.08, 0.36, 0.045)); },
    meow() { osc('sine', 620, 900, 0, 0.16, 0.06); osc('sine', 900, 520, 0.16, 0.32, 0.06); },
    squeak() { osc('sine', 1400, 2100, 0, 0.12, 0.05); },
    steps() { [0, 0.28, 0.56, 0.84].forEach((t) => osc('sine', 190, 120, t, 0.09, 0.13)); },
    boom() { noise(0, 1.8, 0.24, 'lowpass', 220, 55, 0.8); },
    lala() { [523, 587, 659, 587, 784].forEach((f, i) => osc('triangle', f, 0, i * 0.22, 0.2, 0.05)); },
    clink() { osc('triangle', 2400, 0, 0, 0.18, 0.05); osc('triangle', 3100, 0, 0.04, 0.14, 0.03); },
    woof() { osc('sawtooth', 320, 170, 0, 0.13, 0.045); osc('sawtooth', 300, 160, 0.2, 0.13, 0.04); },
    yay() { [523, 659, 784, 1047].forEach((f, i) => osc('sine', f, 0, i * 0.09, 0.32, 0.055)); },
    soft() { osc('sine', 392, 349, 0, 0.25, 0.05); osc('sine', 349, 330, 0.18, 0.3, 0.04); },
    flap() { [0, 0.14, 0.28].forEach((t) => noise(t, 0.08, 0.05, 'bandpass', 700, 0, 0.6)); },
    blip() { osc('sine', 880, 0, 0, 0.08, 0.05); },
    ribbit() { osc('square', 210, 160, 0, 0.12, 0.025); osc('square', 230, 170, 0.16, 0.14, 0.025); },
    scribble() { [0, 0.12, 0.24, 0.36, 0.48].forEach((t) => noise(t, 0.09, 0.05, 'bandpass', 3000, 0, 2)); }
  };
  function sound(name) {
    if (SPEED < 0.2 || !soundCheck() || !SND[name]) return;
    try { SND[name](); } catch (e) {}
  }

  /* ===================================================================
     STAGE – a scene with actors placed in % of its size (sizes in cqmin)
     =================================================================== */
  function makeStage(el) {
    el.classList.add('stage');
    el.innerHTML = '<div class="bg-a"></div><div class="bg-b"></div><div class="layer"></div><div class="shade"></div><div class="flashl"></div>';
    const S = { el, layer: el.querySelector('.layer'), actors: {}, bgName: '' };
    S.setBg = (name) => {
      const a = el.querySelector('.bg-a'), b = el.querySelector('.bg-b');
      a.className = 'bg-a bg-' + name; b.className = 'bg-b'; b.style.opacity = 0;
      S.bgName = name;
    };
    S.clear = () => {
      S.layer.querySelectorAll('*').forEach((n) => n.getAnimations && n.getAnimations().forEach((x) => x.cancel()));
      S.layer.innerHTML = '';
      S.actors = {};
      el.querySelector('.shade').style.opacity = 0;
    };
    S.add = (id, spec) => {
      const tag = spec.button ? 'button' : 'div';
      const w = document.createElement(tag);
      if (spec.button) w.type = 'button';
      w.className = 'actor' + (spec.button ? ' tap' : '') + (spec.cls ? ' ' + spec.cls : '');
      w.style.left = spec.x + '%';
      w.style.top = spec.y + '%';
      w.style.fontSize = (spec.s || 20) + 'cqmin';
      if (spec.z) w.style.zIndex = spec.z;
      if (spec.label) w.setAttribute('aria-label', spec.label);
      if (spec.data) Object.keys(spec.data).forEach((k) => { w.dataset[k] = spec.data[k]; });
      const inner = document.createElement('div');
      inner.className = 'a-in' + (spec.shape ? ' shape shape-' + spec.shape : '');
      if (spec.shape) { inner.style.width = (spec.w || 20) + 'cqmin'; inner.style.height = (spec.h || 10) + 'cqmin'; }
      if (spec.html) inner.innerHTML = spec.html; else if (spec.e) inner.textContent = spec.e;
      if (spec.flip) inner.style.setProperty('--flip', '-1');
      w.appendChild(inner);
      if (spec.tag) { const t = document.createElement('span'); t.className = 'a-tag'; t.textContent = spec.tag; w.appendChild(t); }
      S.layer.appendChild(w);
      const a = { id, el: w, inner, x: spec.x, y: spec.y, e: spec.e, st: { tx: 0, ty: 0, r: 0, sx: 1, sy: 1, o: 1, f: 'none' }, flip: spec.flip ? -1 : 1 };
      S.actors[id] = a;
      apply(a);
      if (spec.hidden) { a.st.o = 0; a.st.sx = a.st.sy = 0.3; apply(a); a.hidden = true; }
      return a;
    };
    S.get = (id) => (typeof id === 'string' ? S.actors[id] : id);
    return S;
  }

  function T(st, flip) {
    return `translate(${st.tx}cqmin, ${st.ty}cqmin) rotate(${st.r}deg) scale(${st.sx * (flip || 1)}, ${st.sy})`;
  }
  function apply(a) {
    a.inner.style.transform = T(a.st, a.flip);
    a.inner.style.opacity = a.st.o;
    a.inner.style.filter = a.st.f;
  }
  function frame(st, flip, extra) {
    const s = Object.assign({}, st, extra || {});
    return { transform: T(s, flip), opacity: s.o, filter: s.f };
  }
  /* Animate an actor from its state to a new state. */
  function to(a, changes, dur, easing) {
    if (!a) return Promise.resolve();
    const from = frame(a.st, a.flip);
    Object.assign(a.st, changes);
    const dest = frame(a.st, a.flip);
    return run(a.inner, [from, dest], dur, easing).then(() => apply(a));
  }
  /* A short movement that comes back to where it was (wiggle, hop, pulse…). */
  function bump(a, extras, dur, easing) {
    if (!a) return Promise.resolve();
    const frames = [frame(a.st, a.flip)].concat(extras.map((x) => {
      const f = frame(a.st, a.flip, x);
      if (x.offset != null) f.offset = x.offset;
      return f;
    })).concat([frame(a.st, a.flip)]);
    return run(a.inner, frames, dur, easing).then(() => apply(a));
  }
  function run(el, frames, dur, easing) {
    try {
      const an = el.animate(frames, { duration: D(dur || 500), easing: easing || 'ease-in-out', fill: 'forwards' });
      return an.finished.then(() => { try { an.cancel(); } catch (e) {} }, () => {});
    } catch (e) { return Promise.resolve(); }
  }
  function moveTo(a, x, y, dur, easing) {
    if (!a) return Promise.resolve();
    const from = { left: a.x + '%', top: a.y + '%' };
    a.x = x; a.y = y;
    const dest = { left: x + '%', top: y + '%' };
    try {
      const an = a.el.animate([from, dest], { duration: D(dur || 800), easing: easing || 'ease-in-out', fill: 'forwards' });
      return an.finished.then(() => { a.el.style.left = x + '%'; a.el.style.top = y + '%'; try { an.cancel(); } catch (e) {} }, () => {});
    } catch (e) { a.el.style.left = x + '%'; a.el.style.top = y + '%'; return Promise.resolve(); }
  }

  /* Little things that appear, move and vanish (drops, leaves, sparkles…). */
  function particle(S, html, x, y, size, frames, dur, easing, cls) {
    const p = document.createElement('div');
    p.className = 'particle' + (cls ? ' ' + cls : '');
    p.style.left = x + '%'; p.style.top = y + '%';
    p.style.fontSize = size + 'cqmin';
    p.innerHTML = html;
    S.layer.appendChild(p);
    const keep = /\bkeep\b/.test(cls || '');
    let an;
    try { an = p.animate(frames, { duration: D(dur), easing: easing || 'ease-out', fill: 'forwards' }); }
    catch (e) { if (!keep) p.remove(); return Promise.resolve(); }
    // Particles marked "keep" stay where they land (crumbs); the rest vanish.
    return an.finished.then(() => { if (!keep) p.remove(); }, () => { if (!keep) p.remove(); });
  }
  const tr = (x, y, s, r, o) => ({ transform: `translate(-50%, -50%) translate(${x || 0}cqmin, ${y || 0}cqmin) rotate(${r || 0}deg) scale(${s == null ? 1 : s})`, opacity: o == null ? 1 : o });

  /* ===================================================================
     EFFECTS – every scene is made from these
     =================================================================== */
  const A = (S, id) => S.get(id);
  const FX = {
    appear(S, id, snd) {
      const a = A(S, id); if (!a) return;
      a.hidden = false;
      if (snd !== false) sound(snd || 'pop');
      return to(a, { o: 1, sx: 1, sy: 1 }, 480, 'cubic-bezier(.3,1.5,.6,1)');
    },
    grow(S, id, snd) {
      const a = A(S, id); if (!a) return;
      a.hidden = false;
      a.st.sx = a.st.sy = 0.05; a.st.o = 1; apply(a);
      if (snd !== false) sound(snd || 'magic');
      return to(a, { sx: 1, sy: 1 }, 1100, 'cubic-bezier(.25,1.2,.5,1)');
    },
    hide(S, id) { const a = A(S, id); if (!a) return; a.hidden = true; return to(a, { o: 0, sx: 0.5, sy: 0.5 }, 380, 'ease-in'); },
    fadeOut(S, id, dur) { const a = A(S, id); if (!a) return; a.hidden = true; return to(a, { o: 0 }, dur || 900); },
    async swap(S, id, e, snd) {
      const a = A(S, id); if (!a) return;
      await to(a, { sx: 0.2 * Math.sign(a.st.sx || 1), sy: 0.2 }, 220, 'ease-in');
      a.inner.textContent = e; a.e = e;
      if (snd !== false) sound(snd || 'pop');
      return to(a, { sx: 1, sy: 1, o: 1, f: 'none' }, 420, 'cubic-bezier(.3,1.6,.6,1)');
    },
    pulse(S, id, n, k) {
      const a = A(S, id); if (!a) return;
      k = k || 1.15; n = n || 2;
      const ex = []; for (let i = 0; i < n; i++) { ex.push({ sx: a.st.sx * k, sy: a.st.sy * k }); ex.push({ sx: a.st.sx, sy: a.st.sy }); }
      return bump(a, ex, 650 * n);
    },
    wiggle(S, id, n, deg) {
      const a = A(S, id); if (!a) return;
      n = n || 3; deg = deg || 8;
      const ex = []; for (let i = 0; i < n; i++) { ex.push({ r: a.st.r - deg }); ex.push({ r: a.st.r + deg }); }
      return bump(a, ex, 160 * n * 2);
    },
    shake(S, id, n) {
      const target = id === 'stage' ? S.layer : (A(S, id) || {}).inner;
      if (!target) return;
      n = n || 4;
      const frames = [{ transform: 'translateX(0)' }];
      for (let i = 0; i < n; i++) frames.push({ transform: `translateX(${i % 2 ? -1 : 1}cqmin)` });
      frames.push({ transform: 'translateX(0)' });
      if (id === 'stage') return run(target, frames, 90 * n);
      const a = A(S, id);
      return bump(a, Array.from({ length: n }, (_, i) => ({ tx: a.st.tx + (i % 2 ? -1.2 : 1.2) })), 90 * n);
    },
    hop(S, id, n, h, snd) {
      const a = A(S, id); if (!a) return;
      n = n || 2; h = h || 8;
      if (snd !== false) sound(snd || 'boing');
      const ex = [];
      for (let i = 0; i < n; i++) {
        ex.push({ sy: a.st.sy * 0.85, sx: a.st.sx * 1.1 });
        ex.push({ ty: a.st.ty - h, sy: a.st.sy * 1.08, sx: a.st.sx * 0.95 });
        ex.push({ ty: a.st.ty, sy: a.st.sy, sx: a.st.sx });
      }
      return bump(a, ex, 520 * n, 'ease-in-out');
    },
    tilt(S, id, deg, dur) { const a = A(S, id); if (!a) return; return to(a, { r: deg }, dur || 900); },
    tint(S, id, kind, dur) {
      const a = A(S, id); if (!a) return;
      const F = { droop: 'sepia(0.85) saturate(0.6) brightness(0.9)', autumn: 'sepia(0.6) saturate(2.4) hue-rotate(-25deg)', icy: 'saturate(0.3) brightness(1.25) hue-rotate(160deg)', sunset: 'sepia(0.5) saturate(2) hue-rotate(-20deg)', dim: 'brightness(0.6)', none: 'none', grey: 'grayscale(1) opacity(0.6)', hot: 'saturate(1.6) brightness(1.05) drop-shadow(0 0 1.2cqmin #ff7a3d)' };
      return to(a, { f: F[kind] || kind }, dur || 1200);
    },
    scaleTo(S, id, s, dur) { const a = A(S, id); if (!a) return; return to(a, { sx: s * Math.sign(a.st.sx || 1), sy: s }, dur || 900); },
    squash(S, id, k, dur) { const a = A(S, id); if (!a) return; return to(a, { sy: k, sx: 1 + (1 - k) * 0.6 }, dur || 700, 'ease-out'); },
    stretch(S, id, sx, sy, dur) { const a = A(S, id); if (!a) return; return to(a, { sx, sy }, dur || 900); },
    unstretch(S, id, dur) { const a = A(S, id); if (!a) return; return to(a, { sx: 1, sy: 1, r: 0, f: 'none' }, dur || 600, 'cubic-bezier(.3,1.5,.6,1)'); },
    move(S, id, x, y, dur, easing) { return moveTo(A(S, id), x, y, dur, easing); },
    drip(S, id, n, e, toY) {
      const a = A(S, id); if (!a) return;
      n = n || 4; e = e || '💧';
      const ps = [];
      for (let i = 0; i < n; i++) {
        ps.push(wait(i * 320).then(() => { sound('drip'); return particle(S, e, a.x + rnd(-3, 3), a.y + 6, 5, [tr(0, 0, 0.6, 0, 0), tr(0, 2, 1), tr(0, (toY || 88) - a.y - 6, 1, 0, 0.2)], 900, 'ease-in'); }));
      }
      return Promise.all(ps);
    },
    rise(S, id, kind, n) {
      const a = A(S, id); if (!a) return;
      n = n || 5;
      const cls = { steam: 'wisp', evap: 'wisp evap', stink: 'wisp stink', heat: 'wisp heat' }[kind] || 'wisp';
      const ps = [];
      for (let i = 0; i < n; i++) {
        const dx = rnd(-5, 5);
        ps.push(wait(i * 260).then(() => particle(S, '', a.x + dx, a.y - 8, 3, [tr(0, 0, 0.6, 0, 0), tr(rnd(-1, 1), -6, 1, 0, 0.9), tr(rnd(-2, 2), -16, 1.3, 0, 0)], 1500, 'ease-out', cls)));
      }
      return Promise.all(ps);
    },
    fall(S, e, n, x0, x1, y0, y1, snd) {
      n = n || 5;
      if (snd) sound(snd);
      const ps = [];
      for (let i = 0; i < n; i++) {
        const x = rnd(x0, x1);
        ps.push(wait(i * 280).then(() => particle(S, e, x, y0, 6, [tr(0, 0, 0.8, -20), tr(3, (y1 - y0) * 0.35, 1, 30), tr(-3, (y1 - y0) * 0.7, 1, -20), tr(2, y1 - y0, 1, 10, 0.9)], 1700, 'ease-in-out')));
      }
      return Promise.all(ps);
    },
    rain(S, n, x0, x1) {
      n = n || 18; x0 = x0 == null ? 10 : x0; x1 = x1 == null ? 90 : x1;
      sound('rustle');
      const ps = [];
      for (let i = 0; i < n; i++) ps.push(wait(i * 70).then(() => particle(S, '', rnd(x0, x1), 22, 3, [tr(0, 0, 1, 0, 0), tr(0, 10, 1, 0, 0.8), tr(0, 55, 1, 0, 0)], 650, 'linear', 'raindrop')));
      return Promise.all(ps);
    },
    snow(S, n) {
      n = n || 14;
      const ps = [];
      for (let i = 0; i < n; i++) ps.push(wait(i * 150).then(() => particle(S, '❄', rnd(5, 95), 5, rnd(2.5, 4.5), [tr(0, 0, 1, 0, 0), tr(2, 20, 1, 60, 0.9), tr(-2, 45, 1, 140, 0.9), tr(1, 75, 1, 220, 0)], 2600, 'linear', 'snowflake')));
      return Promise.all(ps);
    },
    flash(S) {
      sound('crack');
      const f = S.el.querySelector('.flashl');
      return run(f, [{ opacity: 0 }, { opacity: 0.85, offset: 0.15 }, { opacity: 0.1, offset: 0.4 }, { opacity: 0.6, offset: 0.55 }, { opacity: 0 }], 700, 'linear');
    },
    async bg(S, name, dur) {
      const b = S.el.querySelector('.bg-b'), a = S.el.querySelector('.bg-a');
      b.className = 'bg-b bg-' + name;
      await run(b, [{ opacity: 0 }, { opacity: 1 }], dur || 1600, 'ease-in-out');
      a.className = 'bg-a bg-' + name; b.style.opacity = 0; b.className = 'bg-b';
      S.bgName = name;
    },
    dark(S, on, dur) {
      const sh = S.el.querySelector('.shade');
      const from = Number(getComputedStyle(sh).opacity) || 0;
      const toO = on ? 0.88 : 0;
      return run(sh, [{ opacity: from }, { opacity: toO }], dur || 600).then(() => { sh.style.opacity = toO; });
    },
    say(S, id, text, ms) {
      const a = A(S, id); if (!a) return;
      const b = document.createElement('div');
      b.className = 'say-bubble' + (a.x > 60 ? ' left' : '');
      b.textContent = text;
      b.style.left = a.x + '%'; b.style.top = Math.max(4, a.y - 16) + '%';
      S.layer.appendChild(b);
      sound('blip');
      return run(b, [{ opacity: 0, transform: 'translate(-50%, -100%) scale(0.6)' }, { opacity: 1, transform: 'translate(-50%, -100%) scale(1)' }], 300, 'cubic-bezier(.3,1.5,.6,1)')
        .then(() => { b.style.opacity = 1; b.style.transform = 'translate(-50%, -100%)'; if (ms !== 0) wait(ms || 2600).then(() => run(b, [{ opacity: 1 }, { opacity: 0 }], 400).then(() => b.remove())); });
    },
    echo(S, id, text) {
      const a = A(S, id); if (!a) return;
      const ps = [];
      [0, 1, 2].forEach((i) => {
        ps.push(wait(700 + i * 650).then(() => {
          sound('blip');
          return particle(S, '<span class="echo-word">' + text + '</span>', a.x + 22 + i * 18, a.y - 10 - i * 3, 6 - i * 1.4, [tr(0, 0, 0.6, 0, 0), tr(0, 0, 1, 0, 1 - i * 0.25), tr(0, 0, 1, 0, 1 - i * 0.25), tr(0, -1, 1, 0, 0)], 1500);
        }));
      });
      return Promise.all(ps);
    },
    glow(S, id, n) { const a = A(S, id); if (!a) return; n = n || 3; const base = a.st.f; const ex = []; for (let i = 0; i < n; i++) { ex.push({ f: 'drop-shadow(0 0 2.5cqmin #ff5a1f) saturate(1.4)' }); ex.push({ f: base }); } return bump(a, ex, 700 * n); },
    async frost(S, id) {
      const a = A(S, id); if (!a) return;
      sound('twinkle');
      FX.sparkle(S, a.x, a.y, 6, '❄');
      return to(a, { f: 'saturate(0.3) brightness(1.3) hue-rotate(170deg)' }, 1200);
    },
    fog(S, id) {
      const a = A(S, id); if (!a) return;
      const f = document.createElement('div');
      f.className = 'fog'; f.style.left = a.x + '%'; f.style.top = a.y + '%';
      S.layer.appendChild(f);
      return run(f, [{ opacity: 0 }, { opacity: 0.85 }], 1400);
    },
    wind(S, n) {
      n = n || 6; sound('wind');
      const ps = [];
      for (let i = 0; i < n; i++) ps.push(wait(i * 200).then(() => particle(S, '', -5, rnd(25, 70), 3, [tr(0, 0, 1, 0, 0), tr(20, 0, 1, 0, 0.8), tr(110, -2, 1, 0, 0)], 1300, 'ease-in', 'windline')));
      return Promise.all(ps);
    },
    async bounce(S, id, n) {
      const a = A(S, id); if (!a) return;
      n = n || 3;
      for (let i = 0; i < n; i++) {
        const h = 14 / (i + 1);
        sound('boing');
        await bump(a, [{ ty: a.st.ty - h, offset: 0.45 }, { sy: a.st.sy * 0.85, sx: a.st.sx * 1.1, offset: 0.95 }], 520 - i * 80, 'ease-in-out');
      }
    },
    async thud(S, id, h) {
      const a = A(S, id); if (!a) return;
      h = h || 30;
      a.st.ty = -h; a.st.o = 1; a.st.sx = a.st.sy = 1; apply(a); a.hidden = false;
      await to(a, { ty: 0 }, 650, 'cubic-bezier(.55,0,1,.45)');
      sound('thud');
      FX.shake(S, 'stage', 3);
      return to(a, { sy: 0.75, sx: 1.2 }, 160, 'ease-out');
    },
    async launch(S, id) {
      const a = A(S, id); if (!a) return;
      sound('whoosh');
      for (let i = 0; i < 6; i++) wait(i * 120).then(() => particle(S, '💨', a.x + rnd(-3, 3), a.y + 8, 5, [tr(0, 0, 0.5, 0, 0.9), tr(rnd(-4, 4), 8, 1.4, 0, 0)], 900));
      await bump(a, [{ tx: a.st.tx - 0.6 }, { tx: a.st.tx + 0.6 }, { tx: a.st.tx - 0.6 }], 300);
      await to(a, { ty: -90 }, 900, 'cubic-bezier(.6,0,.9,.5)');
      await wait(400);
      a.st.ty = -90; apply(a);
      return to(a, { ty: 0 }, 1200, 'cubic-bezier(.2,.8,.3,1)');
    },
    spin(S, id, turns, dur) {
      const a = A(S, id); if (!a) return;
      turns = turns || 1;
      const r0 = a.st.r;
      return run(a.inner, [frame(a.st, a.flip), frame(a.st, a.flip, { r: r0 + 360 * turns })], dur || 1400, 'cubic-bezier(.4,0,.2,1)').then(() => apply(a));
    },
    async roll(S, id) {
      const a = A(S, id); if (!a) return;
      sound('squeak');
      await run(a.inner, [frame(a.st, a.flip), frame(a.st, a.flip, { r: 360, sx: 0.75, sy: 0.75 })], 900, 'ease-in-out');
      return run(a.inner, [frame(a.st, a.flip, { sx: 0.75, sy: 0.75 }), frame(a.st, a.flip)], 500, 'cubic-bezier(.3,1.5,.6,1)').then(() => apply(a));
    },
    sparkle(S, x, y, n, e) {
      n = n || 7;
      const ps = [];
      for (let i = 0; i < n; i++) {
        const ang = (Math.PI * 2 * i) / n + rnd(-0.3, 0.3), dist = rnd(10, 17);
        ps.push(particle(S, e || '✦', x, y, rnd(3, 4.5), [tr(0, 0, 0.3, 0, 1), tr(Math.cos(ang) * dist, Math.sin(ang) * dist, 1, 90, 1), tr(Math.cos(ang) * dist * 1.2, Math.sin(ang) * dist * 1.2, 0.5, 160, 0)], 900, 'ease-out', 'spark'));
      }
      return Promise.all(ps);
    },
    hearts(S, id, n, e) {
      const a = A(S, id); if (!a) return;
      n = n || 3;
      const ps = [];
      for (let i = 0; i < n; i++) ps.push(wait(i * 200).then(() => particle(S, e || '💛', a.x + rnd(-6, 6), a.y - 8, 4.5, [tr(0, 0, 0.4, 0, 0), tr(rnd(-2, 2), -8, 1, 0, 1), tr(rnd(-3, 3), -18, 0.9, 0, 0)], 1400)));
      return Promise.all(ps);
    },
    notes(S, id, n) {
      const a = A(S, id); if (!a) return;
      n = n || 5; sound('lala');
      const ps = [];
      for (let i = 0; i < n; i++) ps.push(wait(i * 230).then(() => particle(S, i % 2 ? '🎶' : '🎵', a.x + rnd(-4, 8), a.y - 6, 5, [tr(0, 0, 0.5, 0, 0), tr(4, -10, 1, 10, 1), tr(10, -22, 1, -10, 0)], 1600)));
      return Promise.all(ps);
    },
    async steps(S, e, pts, gap) {
      for (let i = 0; i < pts.length; i++) {
        const [x, y, r] = pts[i];
        const id = 'step' + i;
        S.add(id, { e, x, y, s: 7, hidden: true });
        S.actors[id].st.r = r || 0;
        sound('tick');
        FX.appear(S, id, false);
        await wait(gap || 260);
      }
    },
    zoom(S, id, x1, dur) { sound('whoosh'); return FX.move(S, id, x1, A(S, id).y, dur || 900, 'ease-in'); },
    async dropbob(S, id, y) {
      const a = A(S, id); if (!a) return;
      a.hidden = false; a.st.o = 1; a.st.sx = a.st.sy = 1; apply(a);
      await moveTo(a, a.x, y + 12, 600, 'ease-in');
      sound('splash');
      await moveTo(a, a.x, y, 700, 'cubic-bezier(.3,1.6,.5,1)');
      return bump(a, [{ ty: 0.8 }, { ty: -0.6 }, { ty: 0.4 }], 1400);
    },
    flyout(S, e, id, n) {
      const a = A(S, id); if (!a) return;
      n = n || 4;
      const ps = [];
      for (let i = 0; i < n; i++) {
        const dx = rnd(-40, 40);
        ps.push(wait(i * 350).then(() => { sound('flap'); return particle(S, e, a.x, a.y - 4, 7, [tr(0, 0, 0.4, 0, 0), tr(dx * 0.3, -10, 1, -10, 1), tr(dx * 0.7, -24, 1, 10, 1), tr(dx, -48, 0.8, 0, 0)], 2200, 'ease-in-out'); }));
      }
      return Promise.all(ps);
    },
    twinkle(S, n) {
      n = n || 8;
      const ps = [];
      for (let i = 0; i < n; i++) ps.push(wait(i * 140).then(() => particle(S, '✦', rnd(5, 95), rnd(5, 40), rnd(2, 3.5), [tr(0, 0, 0.2, 0, 0), tr(0, 0, 1, 45, 1), tr(0, 0, 0.6, 90, 0.7), tr(0, 0, 1, 135, 1), tr(0, 0, 0.3, 180, 0)], 2200, 'ease-in-out', 'star')));
      return Promise.all(ps);
    },
    shimmer(S, id) { return FX.rise(S, id, 'heat', 5); },
    sweat(S, id) {
      const a = A(S, id); if (!a) return;
      return Promise.all([-1, 1, -1].map((s, i) => wait(i * 300).then(() => particle(S, '💦', a.x + s * 7, a.y - 6, 4, [tr(0, 0, 0.5, 0, 0), tr(s * 2, -2, 1, 0, 1), tr(s * 4, 6, 0.8, 0, 0)], 900))));
    },
    crumbs(S, id) {
      const a = A(S, id); if (!a) return;
      const ps = [];
      for (let i = 0; i < 8; i++) ps.push(particle(S, '', a.x + rnd(-4, 4), a.y, 1.6, [tr(0, 0, 1, 0, 1), tr(rnd(-10, 10), rnd(2, 8), 1, 0, 1)], 700, 'ease-out', 'crumb keep'));
      return Promise.all(ps);
    },
    async waddle(S, id, n, dx) {
      const a = A(S, id); if (!a) return;
      n = n || 4; dx = dx || 0;
      const step = dx / n;
      for (let i = 0; i < n; i++) {
        sound('tick');
        await Promise.all([bump(a, [{ r: a.st.r + (i % 2 ? 9 : -9), ty: a.st.ty - 1 }], 360), dx ? moveTo(a, a.x + step, a.y, 360) : null]);
      }
    },
    async crab(S, id) {
      const a = A(S, id); if (!a) return;
      const x0 = a.x;
      for (const d of [14, -28, 14]) {
        sound('tick');
        await Promise.all([moveTo(a, a.x + d, a.y, 700), bump(a, [{ r: 6 }, { r: -6 }, { r: 6 }], 700)]);
      }
      a.x = x0;
    },
    async slide(S, id, dx, trail, dur) {
      const a = A(S, id); if (!a) return;
      const x0 = a.x;
      if (trail) {
        const t = document.createElement('div');
        t.className = 'trail'; t.style.left = (x0 - 3) + '%'; t.style.top = (a.y + 6) + '%'; t.style.width = '0%';
        S.layer.insertBefore(t, S.layer.firstChild);
        run(t, [{ width: '0%' }, { width: Math.abs(dx) + '%' }], dur || 2600, 'linear').then(() => { t.style.width = Math.abs(dx) + '%'; });
      }
      await moveTo(a, x0 + dx, a.y, dur || 2600, 'linear');
    },
    pant(S, id) {
      const a = A(S, id); if (!a) return;
      return bump(a, Array.from({ length: 10 }, (_, i) => ({ sy: a.st.sy * (i % 2 ? 0.94 : 1.03) })), 1600, 'linear');
    },
    async sprout(S, id, seq) {
      const a = A(S, id); if (!a) return;
      for (const e of seq) {
        await wait(250);
        await FX.swap(S, id, e, 'magic');
      }
    },
    async hatch(S, id) {
      const a = A(S, id); if (!a) return;
      await FX.wiggle(S, id, 3, 10);
      sound('crack');
      await FX.swap(S, id, '🐣', false);
      sound('chirp');
      await FX.hop(S, id, 1, 5, false);
      await FX.swap(S, id, '🐥', false);
      return FX.hop(S, id, 2, 6, false);
    },
    async pull(S, id, e) {
      const a = A(S, id); if (!a) return;
      await particle(S, e || '📎', a.x + 30, a.y, 6, [tr(0, 0, 1, 0, 0), tr(0, 0, 1, 0, 1), tr(-24, 0, 1, -40, 1)], 900, 'cubic-bezier(.7,0,1,.5)');
      sound('clink');
      return FX.wiggle(S, id, 2, 6);
    },
    lift(S, id) { const a = A(S, id); if (!a) return; sound('rustle'); return to(a, { ty: -5, r: -10 }, 450, 'cubic-bezier(.3,1.4,.6,1)'); },
    drop(S, id) { const a = A(S, id); if (!a) return; return to(a, { ty: 0, r: 0 }, 400, 'ease-in'); },
    async flyLoop(S, id, snd) {
      const a = A(S, id); if (!a) return;
      sound(snd || 'buzz');
      const st = a.st;
      return run(a.inner, [frame(st, a.flip), frame(st, a.flip, { tx: 14, ty: -10, r: 15 }), frame(st, a.flip, { tx: 22, ty: 4, r: -5 }), frame(st, a.flip, { tx: 6, ty: 12, r: -15 }), frame(st, a.flip, { tx: -14, ty: 2, r: 10 }), frame(st, a.flip, { tx: -8, ty: -10, r: -10 }), frame(st, a.flip)], 2600, 'ease-in-out').then(() => apply(a));
    },
    async stomp(S, id) {
      for (let i = 0; i < 2; i++) { await FX.hop(S, id, 1, 4, false); sound('thud'); FX.shake(S, 'stage', 3); await wait(150); }
    },
    async swim(S, id, dx) {
      const a = A(S, id); if (!a) return;
      sound('splash');
      await Promise.all([moveTo(a, a.x + (dx || 30), a.y, 1800), bump(a, [{ r: 6 }, { r: -6 }, { r: 6 }, { r: -6 }], 1800)]);
      a.flip = -a.flip;
      apply(a);
      return Promise.all([moveTo(a, a.x - (dx || 30), a.y, 1800), bump(a, [{ r: 6 }, { r: -6 }, { r: 6 }, { r: -6 }], 1800)]);
    },
    async turnTo(S, id, deg) { sound('twinkle'); return FX.tilt(S, id, deg, 1400); },
    async sorry(S, id) { await FX.hop(S, id, 1, 4, false); return FX.say(S, id, 'Oops – sorry!', 2200); }
  };

  /* Runs a list of steps: [delay ms, effect name, ...arguments]. Resolves when all have finished. */
  function timeline(S, steps, isAlive) {
    const all = (steps || []).map((step) => wait(step[0]).then(() => {
      if (isAlive && !isAlive()) return;
      const f = FX[step[1]];
      if (!f) { sound(step[1]); return; }   // a step can also just be a sound
      try { return f.apply(null, [S].concat(step.slice(2))); } catch (e) { return null; }
    }));
    return Promise.all(all);
  }

  /* A picture that flies from one place to another on the page (into the Discovery Book). */
  function flyCard(fromEl, toEl, html, cls) {
    if (!fromEl || !toEl) return Promise.resolve();
    const a = fromEl.getBoundingClientRect(), b = toEl.getBoundingClientRect();
    const c = document.createElement('div');
    c.className = 'flycard' + (cls ? ' ' + cls : '');
    c.innerHTML = html;
    document.body.appendChild(c);
    const x0 = a.left + a.width / 2, y0 = a.top + a.height / 2, x1 = b.left + b.width / 2, y1 = b.top + b.height / 2;
    const mx = (x0 + x1) / 2, my = Math.min(y0, y1) - 80;
    let an;
    try {
      an = c.animate([
        { transform: `translate(${x0}px, ${y0}px) translate(-50%, -50%) scale(1.4)`, opacity: 1 },
        { transform: `translate(${mx}px, ${my}px) translate(-50%, -50%) scale(1.1)`, opacity: 1, offset: 0.5 },
        { transform: `translate(${x1}px, ${y1}px) translate(-50%, -50%) scale(0.4)`, opacity: 0.6 }
      ], { duration: D(1000), easing: 'ease-in-out', fill: 'forwards' });
    } catch (e) { c.remove(); return Promise.resolve(); }
    return an.finished.then(() => c.remove(), () => c.remove());
  }

  /* ===================================================================
     OLLIE THE OWL – blinks, listens, talks, flaps, giggles, flies
     =================================================================== */
  function owlSvg() {
    const body = '#A0704F', d = '#7A5038', belly = '#F6E1BF', b = '#F0A33A';
    return '<svg class="owl-svg" viewBox="-66 -70 132 132" aria-hidden="true" focusable="false"><g class="o-all">' +
      `<g class="o-feet"><ellipse cx="-13" cy="51" rx="9" ry="5" fill="${b}"/><ellipse cx="13" cy="51" rx="9" ry="5" fill="${b}"/></g>` +
      `<g class="o-wing o-wl"><ellipse cx="-37" cy="12" rx="13" ry="27" fill="${d}" transform="rotate(18 -37 12)"/></g>` +
      `<g class="o-wing o-wr"><ellipse cx="37" cy="12" rx="13" ry="27" fill="${d}" transform="rotate(-18 37 12)"/></g>` +
      `<ellipse cx="0" cy="4" rx="40" ry="47" fill="${body}"/>` +
      `<ellipse cx="0" cy="21" rx="26" ry="27" fill="${belly}"/>` +
      '<path d="M-11 14l4.5 4.5 4.5-4.5M2 14l4.5 4.5 4.5-4.5M-4.5 26l4.5 4.5 4.5-4.5" fill="none" stroke="#D2AE84" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<g class="o-head">' +
      `<path d="M-33 -26L-29 -55L-11 -39Z" fill="${d}" stroke="${d}" stroke-width="4" stroke-linejoin="round"/>` +
      `<path d="M33 -26L29 -55L11 -39Z" fill="${d}" stroke="${d}" stroke-width="4" stroke-linejoin="round"/>` +
      `<ellipse cx="0" cy="-16" rx="38" ry="26" fill="${body}"/>` +
      `<circle cx="-15" cy="-13" r="17.5" fill="${belly}"/><circle cx="15" cy="-13" r="17.5" fill="${belly}"/>` +
      '<circle cx="-15" cy="-13" r="11.5" fill="#FFFFFF"/><circle cx="15" cy="-13" r="11.5" fill="#FFFFFF"/>' +
      '<g class="o-pupils"><circle cx="-12.5" cy="-12" r="6.5" fill="#2A2440"/><circle cx="17.5" cy="-12" r="6.5" fill="#2A2440"/>' +
      '<circle cx="-10" cy="-14.5" r="2.3" fill="#FFFFFF"/><circle cx="20" cy="-14.5" r="2.3" fill="#FFFFFF"/></g>' +
      `<g class="o-lids"><ellipse class="o-lid" cx="-15" cy="-13" rx="12.6" ry="12.6" fill="${belly}"/><ellipse class="o-lid" cx="15" cy="-13" rx="12.6" ry="12.6" fill="${belly}"/></g>` +
      `<path d="M-6 -2L6 -2L0 5Z" fill="${b}" stroke="${b}" stroke-width="2.5" stroke-linejoin="round"/>` +
      `<path class="o-beak" d="M-4.5 3.5L4.5 3.5L0 9Z" fill="#D9892A" stroke="#D9892A" stroke-width="2" stroke-linejoin="round"/>` +
      '<ellipse cx="-27" cy="1" rx="5.5" ry="3.2" fill="#F4A6A0" opacity=".7"/><ellipse cx="27" cy="1" rx="5.5" ry="3.2" fill="#F4A6A0" opacity=".7"/>' +
      '</g></g></svg>';
  }

  function makeOwl(wrap) {
    wrap.innerHTML = owlSvg();
    const q = (s) => wrap.querySelector(s);
    const lids = q('.o-lids'), head = q('.o-head'), all = q('.o-all'), wl = q('.o-wl'), wr = q('.o-wr'), pupils = q('.o-pupils');
    lids.style.transform = 'scaleY(0)';
    let blinkTimer = 0, flying = false, home = true;
    const O = { el: wrap };
    function blink() {
      run(lids, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)', offset: 0.45 }, { transform: 'scaleY(1)', offset: 0.55 }, { transform: 'scaleY(0)' }], 220, 'ease-in-out');
    }
    function loop() {
      clearTimeout(blinkTimer);
      blinkTimer = setTimeout(() => { if (!document.hidden) { blink(); if (Math.random() < 0.25) setTimeout(blink, 260); } loop(); }, 2400 + Math.random() * 3600);
    }
    loop();
    O.blink = blink;
    O.talk = (on) => wrap.classList.toggle('talk', !!on);
    O.listen = (on) => {
      if (on) { sound('blip'); run(head, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(-12deg)' }], 300, 'ease-out').then(() => { head.style.transform = 'rotate(-12deg)'; }); }
      else run(head, [{ transform: head.style.transform || 'rotate(0deg)' }, { transform: 'rotate(0deg)' }], 300).then(() => { head.style.transform = ''; });
    };
    O.look = (dx, dy) => { pupils.style.transform = `translate(${dx || 0}px, ${dy || 0}px)`; };
    O.happy = () => {
      sound('hoot');
      const flap = [{ transform: 'rotate(0deg)' }, { transform: 'rotate(28deg)' }, { transform: 'rotate(0deg)' }, { transform: 'rotate(28deg)' }, { transform: 'rotate(0deg)' }];
      run(wl, flap, 700); run(wr, flap.map((f) => ({ transform: f.transform.replace('28', '-28') })), 700);
      return run(all, [{ transform: 'translateY(0)' }, { transform: 'translateY(-10px)' }, { transform: 'translateY(0)' }, { transform: 'translateY(-6px)' }, { transform: 'translateY(0)' }], 800, 'ease-in-out');
    };
    O.giggle = () => {
      sound('giggle');
      run(lids, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(0.55)', offset: 0.2 }, { transform: 'scaleY(0.55)', offset: 0.85 }, { transform: 'scaleY(0)' }], 1100);
      return run(head, [{ transform: 'rotate(0)' }, { transform: 'rotate(-9deg)' }, { transform: 'rotate(9deg)' }, { transform: 'rotate(-7deg)' }, { transform: 'rotate(5deg)' }, { transform: 'rotate(0)' }], 1000);
    };
    O.think = () => { O.look(-3, -4); return wait(700).then(() => O.look(0, 0)); };
    O.flapLoop = (on) => wrap.classList.toggle('flying', !!on);
    /* Fly over to an element (to help), then back home with O.flyHome(). */
    O.flyTo = async (target) => {
      if (!target || flying) return;
      flying = true;
      const a = wrap.getBoundingClientRect(), b = target.getBoundingClientRect();
      const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top - a.height * 0.35 - (a.top + a.height / 2);
      sound('flap');
      O.flapLoop(true);
      await run(wrap, [{ transform: 'translate(0, 0) scale(1)' }, { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 60}px) scale(0.85)`, offset: 0.5 }, { transform: `translate(${dx}px, ${dy}px) scale(0.7)` }], 1100, 'ease-in-out');
      wrap.style.transform = `translate(${dx}px, ${dy}px) scale(0.7)`;
      O.flapLoop(false);
      home = false; flying = false;
    };
    O.flyHome = async () => {
      if (home || flying) return;
      flying = true;
      const from = wrap.style.transform;
      O.flapLoop(true);
      sound('flap');
      await run(wrap, [{ transform: from }, { transform: 'translate(0, 0) scale(1)' }], 900, 'ease-in-out');
      wrap.style.transform = '';
      O.flapLoop(false);
      home = true; flying = false;
    };
    O.reset = () => { wrap.style.transform = ''; home = true; flying = false; O.flapLoop(false); O.talk(false); head.style.transform = ''; };
    return O;
  }

  window.AskFX = {
    setSpeed(s) { SPEED = s; },
    get speed() { return SPEED; },
    setSoundCheck(fn) { soundCheck = fn; },
    sound, wait, makeStage, FX, timeline, flyCard, makeOwl, owlSvg, run, D,
    soundNames: Object.keys(SND)
  };
})();
