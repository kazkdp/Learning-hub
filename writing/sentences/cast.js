/* Sentence Studio – the cast and the scene engine (17 Nov 2026).
   One small cast is drawn once and reused in every scene: Leo, Maya and Milo the cat.
   Each is a jointed SVG puppet; an "action" is a few lines that move the joints over time
   (jump, wave, eat, read…), so a new scene is just: a background + who + what they are doing + a prop.
   One animation loop drives everything; calm on purpose (one main thing moves, few particles).
   things.js adds the props, creatures and backgrounds. SBArt.setSpeed(0.02) is for the automatic tests. */
(function () {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  let SPEED = 1;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, k) => a + (b - a) * k;
  const ease = (k) => k * k * (3 - 2 * k);
  const S01 = (x) => 0.5 + 0.5 * Math.sin(x);               // 0..1 wave
  const cyc = (t, T) => ((t % T) + T) % T / T;               // 0..1 position in a cycle of T seconds
  const bump = (p, a, b) => (p < a || p > b ? 0 : Math.sin(Math.PI * (p - a) / (b - a)));   // 0→1→0 between a and b

  /* ===================================================================
     SOUNDS – soft, made with Web Audio (no files)
     =================================================================== */
  let actx = null, master = null, noiseBuf = null, soundCheck = () => true;
  function ac() {
    if (!actx) { actx = new (window.AudioContext || window.webkitAudioContext)(); master = actx.createGain(); master.gain.value = 0.85; master.connect(actx.destination); }
    if (actx.state === 'suspended') actx.resume();
    return actx;
  }
  function osc(type, f0, f1, t, dur, vol) {
    const c = ac(), now = c.currentTime + t, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, now);
    if (f1) o.frequency.exponentialRampToValueAtTime(f1, now + dur);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(vol, now + Math.min(0.03, dur / 3));
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    o.connect(g); g.connect(master); o.start(now); o.stop(now + dur + 0.05);
  }
  function noise(t, dur, vol, ftype, f0, f1, q) {
    const c = ac(), now = c.currentTime + t;
    if (!noiseBuf) { noiseBuf = c.createBuffer(1, c.sampleRate, c.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
    const s = c.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
    const f = c.createBiquadFilter(); f.type = ftype || 'lowpass'; f.Q.value = q || 1;
    f.frequency.setValueAtTime(f0 || 1000, now); if (f1) f.frequency.exponentialRampToValueAtTime(f1, now + dur);
    const g = c.createGain(); g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(vol, now + Math.min(0.05, dur / 3)); g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    s.connect(f); f.connect(g); g.connect(master); s.start(now); s.stop(now + dur + 0.05);
  }
  const SND = {
    pop() { osc('sine', 520, 880, 0, 0.12, 0.1); },
    place(n) { const f = [523, 587, 659, 698, 784, 880, 988, 1047, 1175, 1319][Math.min(9, n || 0)]; osc('triangle', f, 0, 0, 0.18, 0.07); osc('sine', f * 2, 0, 0.02, 0.12, 0.02); },
    dot() { osc('sine', 880, 1320, 0, 0.1, 0.08); osc('sine', 1320, 0, 0.1, 0.22, 0.05); },
    soft() { osc('sine', 300, 250, 0, 0.16, 0.06); },
    magic() { [523, 659, 784, 1047, 1319].forEach((f, i) => osc('sine', f, 0, i * 0.08, 0.36, 0.045)); },
    sparkle() { [1047, 1319, 1568, 2093].forEach((f, i) => osc('sine', f, 0, i * 0.07, 0.28, 0.04)); },
    whoosh() { noise(0, 0.6, 0.08, 'bandpass', 300, 2400, 1.4); },
    boing() { osc('sine', 200, 560, 0, 0.2, 0.08); },
    splash() { noise(0, 0.4, 0.1, 'bandpass', 900, 280, 0.8); },
    fix() { osc('triangle', 660, 990, 0, 0.16, 0.07); osc('sine', 1320, 0, 0.14, 0.25, 0.04); },
    yay() { [523, 659, 784].forEach((f, i) => osc('triangle', f, 0, i * 0.09, 0.3, 0.05)); osc('triangle', 1047, 0, 0.3, 0.5, 0.05); }
  };
  function sound(name, arg) { if (!soundCheck()) return; try { if (SND[name]) SND[name](arg); } catch (e) {} }

  /* ===================================================================
     LOOKS – the three characters (change colours here)
     =================================================================== */
  const LOOKS = {
    leo: { skin: '#f4c9a6', skinD: '#e2ae88', cheek: '#f29a8a', hair: '#6b4226', hairL: '#8a5a37', shirt: '#e0795f', shirtD: '#c8634a', pants: '#3d5a80', pantsD: '#304a6b', lower: 'skin', shoe: '#2f3e52', sole: '#e9eef3', brow: '#5a361e' },
    maya: { skin: '#b97f58', skinD: '#a36c47', cheek: '#d9705a', hair: '#2a1b17', hairL: '#3d2a24', shirt: '#2a9d8f', shirtD: '#23867a', pants: '#6d597a', pantsD: '#5a4866', lower: 'pants', shoe: '#e0795f', sole: '#fbe4dc', brow: '#22140f', ties: '#f2b134' }
  };
  const CAT = { fur: '#f0a04b', furD: '#d07a2a', furDD: '#b8661f', belly: '#fde3c8', nose: '#f28482', eye: '#3a4a2a', ink: '#4a2511' };

  /* ===================================================================
     THE KID PUPPET (front view). Feet at (0,0); about 190 units tall.
     Joints: hipL/knL hipR/knR (legs), shL/elL shR/elR (arms), neck, body.
     L and R mean the left and right of the SCREEN. Positive angle = clockwise.
     =================================================================== */
  function kidSvg(name) {
    const k = LOOKS[name];
    const lower = k.lower === 'skin' ? k.skin : k.pants;
    const leg = (side) => {
      const sx = side === 'L' ? -10 : 10, so = side === 'L' ? -2.5 : 2.5;
      return `<g transform="translate(${sx},-60)"><g data-j="hip${side}">
        <rect x="-7.5" y="-4" width="15" height="33" rx="7.5" fill="${k.pants}"/>
        <g transform="translate(0,28)"><g data-j="kn${side}">
          <rect x="-6.5" y="-3" width="13" height="28" rx="6.5" fill="${lower}"/>
          ${k.lower === 'skin' ? `<rect x="-7" y="18" width="14" height="6" rx="3" fill="#fff" opacity=".9"/>` : ''}
          <ellipse cx="${so}" cy="26" rx="10" ry="6" fill="${k.shoe}"/>
          <path d="M${so - 9} 28.5 Q${so} 32 ${so + 9} 28.5" fill="none" stroke="${k.sole}" stroke-width="2.4" stroke-linecap="round"/>
        </g></g>
      </g></g>`;
    };
    const arm = (side) => {
      const sx = side === 'L' ? -23 : 23;
      return `<g transform="translate(${sx},-103)"><g data-j="sh${side}">
        <rect x="-6" y="-4" width="12" height="30" rx="6" fill="${k.skin}"/>
        <rect x="-7.5" y="-6" width="15" height="17" rx="7" fill="${k.shirt}"/>
        <g transform="translate(0,24)"><g data-j="el${side}">
          <rect x="-5.5" y="-3" width="11" height="24" rx="5.5" fill="${k.skin}"/>
          <g transform="translate(0,22)"><g data-hand="${side}"><circle r="7.5" fill="${k.skin}"/><g class="held"></g></g></g>
        </g></g>
      </g></g>`;
    };
    const hairBack = name === 'maya'
      ? `<circle cx="-29" cy="-27" r="15" fill="${k.hair}"/><circle cx="29" cy="-27" r="15" fill="${k.hair}"/>
         <circle cx="-33" cy="-31" r="5" fill="${k.hairL}" opacity=".6"/><circle cx="25" cy="-31" r="5" fill="${k.hairL}" opacity=".6"/>`
      : '';
    const hairFront = name === 'maya'
      ? `<path d="M-33 -4 C-33 -33 33 -33 33 -4 C24 -19 8 -22 0 -16 C-8 -22 -24 -19 -33 -4Z" fill="${k.hair}"/>
         <rect x="-25" y="-21" width="9" height="6" rx="3" transform="rotate(-35 -20 -18)" fill="${k.ties}"/>
         <rect x="16" y="-21" width="9" height="6" rx="3" transform="rotate(35 20 -18)" fill="${k.ties}"/>`
      : `<path d="M-35 -2 C-37 -31 -12 -43 4 -39 C22 -41 37 -25 35 -2 C30 -12 24 -18 14 -19 C10 -13 2 -12 -4 -18 C-12 -12 -26 -12 -35 -2Z" fill="${k.hair}"/>
         <path d="M-10 -36 C-2 -40 10 -40 18 -35" fill="none" stroke="${k.hairL}" stroke-width="3" stroke-linecap="round" opacity=".7"/>`;
    return `<g data-j="body">
      ${leg('L')}${leg('R')}
      <path d="M-22 -113 Q-28 -113 -28 -105 L-29 -66 Q-29 -57 -20 -57 L20 -57 Q29 -57 29 -66 L28 -105 Q28 -113 22 -113 Z" fill="${k.shirt}"/>
      <path d="M-28 -80 L28 -80" stroke="${k.shirtD}" stroke-width="3" opacity=".35"/>
      ${k.lower === 'skin' ? `<rect x="-27" y="-70" width="54" height="16" rx="7" fill="${k.pants}"/>` : `<rect x="-27" y="-68" width="54" height="13" rx="6" fill="${k.pants}"/>`}
      <g transform="translate(0,-112)"><g data-j="neck">
        <rect x="-7" y="-8" width="14" height="12" rx="5" fill="${k.skinD}"/>
        <path d="M-12 1 Q0 7 12 1" fill="none" stroke="${k.shirtD}" stroke-width="3" stroke-linecap="round"/>
        <g transform="translate(0,-36)">
          ${hairBack}
          <circle cx="-34" cy="4" r="8" fill="${k.skinD}"/><circle cx="34" cy="4" r="8" fill="${k.skinD}"/>
          <circle r="35" fill="${k.skin}"/>
          <g data-p="face">
            <ellipse cx="-19" cy="10" rx="6.5" ry="4" fill="${k.cheek}" opacity=".45"/>
            <ellipse cx="19" cy="10" rx="6.5" ry="4" fill="${k.cheek}" opacity=".45"/>
            <g data-p="eyes">
              <g transform="translate(-12,0)"><ellipse rx="4.8" ry="5.6" fill="#2b2220"/><circle cx="-1.5" cy="-2" r="1.7" fill="#fff"/></g>
              <g transform="translate(12,0)"><ellipse rx="4.8" ry="5.6" fill="#2b2220"/><circle cx="-1.5" cy="-2" r="1.7" fill="#fff"/></g>
            </g>
            <g data-p="eyes2" style="display:none"></g>
            <g data-p="brows"><path d="M-18 -11 Q-12 -14 -6 -11" fill="none" stroke="${k.brow}" stroke-width="2.6" stroke-linecap="round"/><path d="M6 -11 Q12 -14 18 -11" fill="none" stroke="${k.brow}" stroke-width="2.6" stroke-linecap="round"/></g>
            <g data-p="mouth" transform="translate(0,14)"></g>
          </g>
          ${hairFront}
          <g class="hat"></g>
        </g>
      </g></g>
      ${arm('L')}${arm('R')}
    </g>`;
  }
  const MOUTHS = {
    smile: '<path d="M-8 -2 Q0 6 8 -2" fill="none" stroke="#6e3b26" stroke-width="2.8" stroke-linecap="round"/>',
    grin: '<path d="M-10 -3 Q0 12 10 -3 Z" fill="#9e3b33"/><path d="M-6 3 Q0 7 6 3" fill="none" stroke="#f08a80" stroke-width="3" stroke-linecap="round"/>',
    open: '<ellipse cx="0" cy="1" rx="6" ry="6.5" fill="#9e3b33"/><ellipse cx="0" cy="4" rx="3.5" ry="2.2" fill="#f08a80"/>',
    talk: '<ellipse cx="0" cy="0.5" rx="5.5" ry="4" fill="#9e3b33"/>',
    oh: '<ellipse cx="0" cy="1" rx="3.6" ry="4.4" fill="#9e3b33"/>',
    wide: '<ellipse cx="0" cy="3" rx="8" ry="11" fill="#9e3b33"/><ellipse cx="0" cy="8" rx="4.5" ry="3" fill="#f08a80"/>',
    blow: '<circle cx="3" cy="1" r="3.4" fill="#9e3b33"/>',
    chew: '<path d="M-6 0 Q0 3 6 0" fill="none" stroke="#6e3b26" stroke-width="2.8" stroke-linecap="round"/>',
    flat: '<path d="M-6 0 L6 0" stroke="#6e3b26" stroke-width="2.8" stroke-linecap="round"/>',
    sleep: '<path d="M-4 0 Q0 2 4 0" fill="none" stroke="#6e3b26" stroke-width="2.4" stroke-linecap="round"/>',
    brush: '<path d="M-9 -2 Q0 8 9 -2 Z" fill="#fff" stroke="#9e3b33" stroke-width="1.6"/><circle cx="-4" cy="3" r="2" fill="#e7f6fb"/><circle cx="3" cy="3.5" r="2.4" fill="#e7f6fb"/>'
  };
  const EYES2 = {
    happy: '<path d="M-17 1 Q-12 -6 -7 1" fill="none" stroke="#2b2220" stroke-width="2.8" stroke-linecap="round"/><path d="M7 1 Q12 -6 17 1" fill="none" stroke="#2b2220" stroke-width="2.8" stroke-linecap="round"/>',
    closed: '<path d="M-17 -1 Q-12 4 -7 -1" fill="none" stroke="#2b2220" stroke-width="2.6" stroke-linecap="round"/><path d="M7 -1 Q12 4 17 -1" fill="none" stroke="#2b2220" stroke-width="2.6" stroke-linecap="round"/>',
    squeeze: '<path d="M-17 -3 L-8 0 L-17 3" fill="none" stroke="#2b2220" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 -3 L8 0 L17 3" fill="none" stroke="#2b2220" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>'
  };

  const KID_BASE = { shL: 9, elL: -6, shR: -9, elR: 6, hipL: 2, knL: 0, hipR: -2, knR: 0, thL: 1, thR: 1, skL: 1, skR: 1, neck: 0, bx: 0, by: 0, br: 0, sy: 1, look: 0, lookY: 0, mouth: 'smile', eyes: 'open' };
  const KID_NUM = ['shL', 'elL', 'shR', 'elR', 'hipL', 'knL', 'hipR', 'knR', 'thL', 'thR', 'skL', 'skR', 'neck', 'bx', 'by', 'br', 'sy', 'look', 'lookY'];
  const KID_JOINT = {
    hipL: (p) => `rotate(${p.hipL.toFixed(1)}) scale(1,${p.thL.toFixed(3)})`,
    hipR: (p) => `rotate(${p.hipR.toFixed(1)}) scale(1,${p.thR.toFixed(3)})`,
    knL: (p) => `scale(1,${(1 / p.thL).toFixed(3)}) rotate(${p.knL.toFixed(1)}) scale(1,${p.skL.toFixed(3)})`,
    knR: (p) => `scale(1,${(1 / p.thR).toFixed(3)}) rotate(${p.knR.toFixed(1)}) scale(1,${p.skR.toFixed(3)})`,
    shL: (p) => `rotate(${p.shL.toFixed(1)})`, elL: (p) => `rotate(${p.elL.toFixed(1)})`,
    shR: (p) => `rotate(${p.shR.toFixed(1)})`, elR: (p) => `rotate(${p.elR.toFixed(1)})`,
    neck: (p) => `rotate(${p.neck.toFixed(1)})`,
    body: (p) => `translate(${p.bx.toFixed(1)},${p.by.toFixed(1)}) rotate(${p.br.toFixed(1)}) scale(1,${p.sy.toFixed(3)})`
  };

  /* Bent-knee helper: front view, knees bent outwards (crouch, landing, sitting on heels). */
  const crouch = (k) => ({ hipL: 18 * k, knL: -34 * k, hipR: -18 * k, knR: 34 * k, by: 11 * k });
  /* Knee lifted towards us (running, marching): the thigh looks shorter. */
  const lift = (side, k) => (side === 'L' ? { thL: 1 - 0.55 * k, knL: 4 * k } : { thR: 1 - 0.55 * k, knR: -4 * k });
  const sitDown = { thL: 0.32, thR: 0.32, hipL: 8, hipR: -8, knL: -4, knR: 4, by: 21 };   // sitting on a seat (thighs come towards us)
  const kneel = { thL: 0.55, thR: 0.55, hipL: 14, hipR: -14, knL: 0, knR: 0, skL: 0.22, skR: 0.22, by: 36 };   // kneeling on the ground

  /* ---------- What the kids can do. Each returns joint angles for time t (seconds). ---------- */
  const KID_ACTS = {
    idle: (t) => ({ by: Math.sin(t * 2.1) * 0.8, shL: 9 + Math.sin(t * 2.1) * 1.5, shR: -9 - Math.sin(t * 2.1) * 1.5 }),
    happy: (t) => ({ by: Math.sin(t * 3) * 1.2, eyes: 'happy', mouth: 'grin', shL: 14, shR: -14 }),
    wave: (t) => ({ shR: -126 + Math.sin(t * 7.5) * 8, elR: -34 + Math.sin(t * 7.5 + 0.6) * 26, neck: Math.sin(t * 3.7) * 4, mouth: 'grin', look: 0.4, by: Math.sin(t * 3.7) * 1 }),
    jump: (t, a) => {
      const p = cyc(t, 1.15), air = bump(p, 0.18, 0.82), sq = p < 0.18 ? bump(p, 0, 0.36) : p > 0.82 ? bump(p, 0.64, 1) : 0;
      if (p > 0.16 && p < 0.2 && a && !a._j) { a._j = 1; } if (p > 0.82 && a && a._j) { a._j = 0; if (a.scene) a.scene.puff(a.x - 20 * a.s, a.y, 2); }
      return Object.assign({}, crouch(sq * 0.9), { by: -62 * air + 10 * sq, shL: 30 + 120 * air, shR: -30 - 120 * air, elL: -10, elR: 10, mouth: air > 0.3 ? 'grin' : 'smile', sy: 1 - sq * 0.05 + air * 0.03 });
    },
    run: (t, a) => {
      const w = t * 9.5, s = Math.sin(w), c = Math.cos(w);
      if (a && a.scene && Math.random() < 0.05) a.scene.puff(a.x + rnd(-15, 15) * a.s, a.y, 1);
      return Object.assign({}, lift('L', Math.max(0, s)), lift('R', Math.max(0, -s)), {
        by: -Math.abs(c) * 5, shL: 20 + s * 38, elL: -58, shR: -20 + s * 38, elR: 58, br: 2, mouth: 'open', look: 0.6
      });
    },
    dance: (t) => {
      const w = t * 4.6, s = Math.sin(w);
      return { br: s * 7, bx: s * 6, by: -Math.abs(Math.cos(w)) * 7, shL: 120 + s * 30, elL: 20, shR: -40 - s * 20, elR: -60, hipL: 4 + Math.max(0, s) * 18, hipR: -4 + Math.min(0, s) * 18, neck: -s * 6, mouth: 'grin', eyes: 'happy' };
    },
    clap: (t, a) => {
      const k = S01(t * 10.5);
      if (a && k > 0.97 && !a._c) { a._c = 1; if (a.scene) a.scene.spark(a.x, a.y - 92 * a.s, 1); } if (k < 0.5) a._c = 0;
      return { shL: -32 - 14 * k, elL: -88 + 10 * k, shR: 32 + 14 * k, elR: 88 - 10 * k, by: Math.sin(t * 5) * 1.2, mouth: 'grin', eyes: 'happy' };
    },
    sing: (t, a) => {
      if (a && a.scene && Math.random() < 0.035) a.scene.note(a.x + 30 * a.s, a.y - 170 * a.s);
      const s = Math.sin(t * 2.6);
      return { neck: s * 7, br: s * 2, shL: 40 + s * 10, elL: -30, shR: -40 + s * 10, elR: 30, mouth: Math.sin(t * 5) > -0.2 ? 'open' : 'oh', eyes: 'happy' };
    },
    laugh: (t, a) => {
      if (a && a.scene && Math.random() < 0.025) a.scene.word(a.x + rnd(-40, 40) * a.s, a.y - 200 * a.s, 'Ha ha!');
      return { by: Math.abs(Math.sin(t * 14)) * -3, br: Math.sin(t * 3) * 3, neck: -8 + Math.sin(t * 14) * 2, mouth: 'wide', eyes: 'happy', shL: 30, elL: -100, shR: -30, elR: 100 };
    },
    yawn: (t) => {
      const p = cyc(t, 4.2), k = ease(clamp(bump(p, 0.1, 0.8) * 1.4, 0, 1));
      return { shL: 9 + 150 * k, elL: -6 - 30 * k, shR: -9 - 150 * k, elR: 6 + 30 * k, neck: -6 * k, by: -4 * k, mouth: k > 0.4 ? 'wide' : 'smile', eyes: k > 0.3 ? 'closed' : 'open' };
    },
    sneeze: (t, a) => {
      const p = cyc(t, 3.2);
      const back = ease(clamp((p - 0.15) / 0.45, 0, 1)) * (p < 0.62 ? 1 : 0);
      const fwd = bump(p, 0.62, 0.86);
      if (a && p > 0.62 && p < 0.66 && !a._s) { a._s = 1; if (a.scene) { a.scene.word(a.x + 40 * a.s, a.y - 205 * a.s, 'Achoo!', 1.3); a.scene.spray(a.x, a.y - 150 * a.s); } }
      if (p < 0.5) a._s = 0;
      return { neck: -10 * back + 14 * fwd, br: -4 * back + 6 * fwd, by: -3 * back, shR: -20 - 10 * back, elR: -120 * (1 - fwd), mouth: back > 0.5 ? 'oh' : fwd > 0.2 ? 'wide' : 'smile', eyes: back > 0.4 || fwd > 0.1 ? 'squeeze' : 'open' };
    },
    sleep: (t) => ({ eyes: 'closed', mouth: 'sleep', by: Math.sin(t * 1.4) * 1.2, shL: 4, shR: -4, sy: 1 + Math.sin(t * 1.4) * 0.008 }),
    sit: (t) => Object.assign({}, sitDown, { by: sitDown.by + Math.sin(t * 2) * 0.6 }),
    read: (t, a) => {
      const flip = cyc(t, 3.6) > 0.86;
      return Object.assign({}, sitDown, { shL: -24, elL: -86, shR: 24, elR: 86, neck: 6 + Math.sin(t * 0.9) * 2, lookY: 1, look: flip ? 0.5 : -0.2 + 0.4 * S01(t * 1.6), mouth: 'smile' });
    },
    eat: (t) => {
      const p = cyc(t, 2.4), up = ease(clamp(bump(p, 0.05, 0.7) * 1.6, 0, 1));
      return { shR: -9 + 45 * up, elR: 6 + 112 * up, neck: 3 * up, mouth: up > 0.8 ? (Math.sin(t * 16) > 0 ? 'chew' : 'oh') : 'chew', eyes: up > 0.85 ? 'happy' : 'open' };
    },
    drink: (t) => {
      const p = cyc(t, 3), up = ease(clamp(bump(p, 0.05, 0.8) * 1.5, 0, 1));
      return { shR: -9 + 40 * up, elR: 6 + 115 * up, neck: -9 * up, mouth: up > 0.7 ? 'oh' : 'smile', eyes: up > 0.8 ? 'closed' : 'open' };
    },
    kick: (t, a) => {
      const p = cyc(t, 2.2), back = bump(p, 0.1, 0.32), kick = bump(p, 0.3, 0.55);
      if (a && p > 0.4 && p < 0.44 && !a._k) { a._k = 1; if (a.onKick) a.onKick(); } if (p < 0.3) a._k = 0;
      return { hipR: 18 * back - 62 * kick, knR: -10 * back + 18 * kick, thR: 1 - 0.3 * back, shL: 30 + 30 * kick, shR: -20 - 25 * kick, br: -4 * kick, look: 0.8, mouth: kick > 0.3 ? 'grin' : 'smile' };
    },
    throw: (t, a) => {
      const p = cyc(t, 2.4), back = ease(clamp(p / 0.35, 0, 1)) * (p < 0.42 ? 1 : 0), go = bump(p, 0.4, 0.62);
      if (a && p > 0.45 && p < 0.49 && !a._t) { a._t = 1; if (a.onThrow) a.onThrow(); } if (p < 0.3) a._t = 0;
      return { shR: -9 - 160 * back - 40 * go, elR: 6 - 40 * back, br: -3 * back + 4 * go, look: 0.7, mouth: go ? 'grin' : 'smile' };
    },
    dig: (t, a) => {
      const p = cyc(t, 1.8), down = bump(p, 0.1, 0.5), up = bump(p, 0.5, 0.9);
      if (a && p > 0.55 && p < 0.59 && !a._d) { a._d = 1; if (a.scene) a.scene.dirt(a.x + 62 * a.s, a.y - 4); } if (p < 0.3) a._d = 0;
      return { shL: -30 - 10 * down + 20 * up, elL: -60 + 20 * up, shR: -40 - 20 * down + 30 * up, elR: -20 + 30 * up, br: 5 * down - 3 * up, by: 6 * down, hipL: 6, hipR: -10, look: 0.7, lookY: 1 };
    },
    water: (t) => ({ shR: -70 + Math.sin(t * 1.4) * 8, elR: -14, shL: 14, br: 2, look: 0.8, lookY: 1, neck: 3 }),
    paint: (t) => { const w = t * 2.8; return { shR: -96 + Math.sin(w) * 22, elR: -30 + Math.cos(w) * 22, shL: 18, br: 1, look: 0.9, mouth: 'smile' }; },
    brushTeeth: (t) => ({ shR: 36, elR: 120 + Math.sin(t * 15) * 9, neck: Math.sin(t * 15) * 1.5, mouth: 'brush', look: 0 }),
    wash: (t, a) => {
      if (a && a.scene && Math.random() < 0.08) a.scene.bubble(a.x + rnd(-14, 14) * a.s, a.y - 80 * a.s, 0.6);
      const s = Math.sin(t * 9);
      return { shL: -24 + s * 5, elL: -64 - s * 8, shR: 24 + s * 5, elR: 64 - s * 8, neck: 8, lookY: 1, mouth: 'smile' };
    },
    blowBubbles: (t, a) => {
      const p = cyc(t, 2.6), blowing = p > 0.35 && p < 0.85;
      if (a && a.scene && blowing && Math.random() < 0.16) a.scene.bubble(a.x + 52 * a.s, a.y - 160 * a.s, 1);
      return { shR: 25, elR: 120, mouth: blowing ? 'blow' : 'smile', sy: blowing ? 1.01 : 1, look: 0.6 };
    },
    kite: (t) => ({ shR: -160 + Math.sin(t * 1.3) * 10, elR: -10 + Math.sin(t * 1.7) * 8, shL: 20, look: 0.6, lookY: -1, neck: -5, by: Math.sin(t * 1.3) * 1.2, mouth: 'grin' }),
    telescope: (t) => ({ shR: -40, elR: -50, shL: 30, elL: -70, br: 4, neck: 10, look: 1, lookY: -0.6, eyes: Math.sin(t * 0.7) > 0.6 ? 'happy' : 'open' }),
    magnify: (t) => ({ shR: -58 + Math.sin(t * 1.2) * 4, elR: -42, br: 8, neck: 10, look: 0.9, lookY: 1, by: 5, shL: 24, mouth: 'oh' }),
    point: (t) => ({ shR: -112 + Math.sin(t * 2) * 4, elR: -8, look: 0.9, lookY: -0.4, mouth: 'oh' }),
    swim: (t, a) => {
      const w = t * 4.2;
      if (a && a.scene && Math.random() < 0.06) a.scene.splash(a.x + Math.sin(w) * 40 * a.s, a.y - 70 * a.s);
      return { shL: 90 + (w * 57.3) % 360, elL: -10, shR: -90 - ((w * 57.3 + 180) % 360), elR: 10, by: Math.sin(w * 2) * 2, neck: Math.sin(w) * 6, mouth: 'grin' };
    },
    build: (t) => { const s = Math.sin(t * 6); return Object.assign({}, kneel, { shL: -40 + s * 12, elL: -50, shR: 40 - s * 12, elR: 50, neck: 10, lookY: 1, look: 0.4 }); },
    pat: (t) => { const s = Math.sin(t * 5); return { shR: -66 + s * 8, elR: -30 + s * 14, shL: 14, look: 0.8, mouth: 'grin', eyes: 'happy' }; },
    feed: (t, a) => {
      const p = cyc(t, 2.2), go = bump(p, 0.35, 0.6);
      if (a && p > 0.45 && p < 0.49 && !a._f) { a._f = 1; if (a.onThrow) a.onThrow(); } if (p < 0.3) a._f = 0;
      return { shR: -30 - 60 * go, elR: -40 + 30 * go, shL: 20, look: 0.9, lookY: 0.5, mouth: 'smile' };
    },
    umbrella: (t) => ({ shR: -150, elR: 20, shL: 14, look: Math.sin(t * 0.8) * 0.6, lookY: -0.6, by: Math.sin(t * 2) * 0.8 }),
    stir: (t) => { const w = t * 5; return { shL: -38, elL: -80, shR: 30 + Math.sin(w) * 10, elR: 88 + Math.cos(w) * 12, neck: 6, lookY: 1, mouth: 'smile' }; },
    drum: (t, a) => {
      const w = t * 8.5, s = Math.sin(w);
      if (a && Math.abs(s) > 0.98 && !a._b) { a._b = 1; if (a.scene) a.scene.spark(a.x + (s > 0 ? -1 : 1) * 22 * a.s, a.y - 70 * a.s, 1); } if (Math.abs(s) < 0.5) a._b = 0;
      return Object.assign({}, sitDown, { shL: -20 + Math.max(0, s) * 50, elL: -70, shR: 20 - Math.max(0, -s) * 50, elR: 70, mouth: 'grin', lookY: 1 });
    },
    stretch: (t) => { const s = Math.sin(t * 2.2); return { shL: -28 + s * 6, elL: -80 + s * 10, shR: 28 - s * 6, elR: 80 - s * 10, neck: 5, lookY: 1, mouth: 'grin' }; },
    hug: (t) => Object.assign({}, kneel, { shL: -30, elL: -78, shR: 30, elR: 78, neck: 8, br: Math.sin(t * 2) * 3, eyes: 'happy', mouth: 'grin' }),
    stroke: (t) => Object.assign({}, kneel, { shR: -62 + Math.sin(t * 3) * 14, elR: -30, shL: 16, neck: 8, look: 0.9, lookY: 1, mouth: 'smile' }),
    plant: (t) => Object.assign({}, kneel, { shR: -40 + Math.sin(t * 2.4) * 8, elR: -40, shL: -24, elL: -50, neck: 10, look: 0.7, lookY: 1 }),
    launch: (t) => { const p = cyc(t, 4); const yay = bump(p, 0.45, 0.9); return { shL: 30 + 120 * yay, shR: -30 - 120 * yay, by: -10 * yay, look: 0.7, lookY: -1, mouth: yay > 0.2 ? 'grin' : 'oh', eyes: yay > 0.5 ? 'happy' : 'open' }; },
    slime: (t) => { const s = S01(t * 2.2); return { shL: 16 + 26 * s, elL: 136 - 26 * s - 16 - 26 * s + 16, shR: -16 - 26 * s, elR: -(136 - 26 * s - 16 - 26 * s + 16), mouth: 'grin', lookY: 0.6, eyes: s > 0.8 ? 'happy' : 'open' }; },
    carry: (t) => ({ shL: -26, elL: -70, shR: 26, elR: 70, by: Math.sin(t * 4) * 1.5, mouth: 'smile' }),
    hold: (t) => ({ shR: -24, elR: -66, by: Math.sin(t * 2) * 0.8 }),
    look: (t) => ({ look: Math.sin(t * 0.9) * 0.9, lookY: -0.3, by: Math.sin(t * 2) * 0.8 }),
    think: (t) => ({ shR: 38, elR: 125, neck: -6, look: 0.6, lookY: -1, by: Math.sin(t * 1.6) * 0.8, mouth: 'flat' }),
    walk: (t) => { const s = Math.sin(t * 5.5); return Object.assign({}, lift('L', Math.max(0, s) * 0.6), lift('R', Math.max(0, -s) * 0.6), { by: -Math.abs(Math.cos(t * 5.5)) * 2.5, shL: 9 + s * 16, shR: -9 + s * 16 }); }
  };

  /* ===================================================================
     MILO THE CAT (side view, facing right). Three bodies: standing, sitting, curled up.
     =================================================================== */
  function catHead(c) {
    return `<g data-j="head">
      <polygon points="-20,-12 -15,-36 -2,-20" fill="${c.fur}"/><polygon points="-16,-15 -13,-30 -5,-20" fill="#f7b2ad"/>
      <polygon points="4,-21 16,-37 22,-12" fill="${c.fur}"/><polygon points="7,-21 15,-31 18,-15" fill="#f7b2ad"/>
      <circle r="24" fill="${c.fur}"/>
      <path d="M-8 -22 Q-6 -12 -9 -6" fill="none" stroke="${c.furD}" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M2 -23 Q3 -13 0 -7" fill="none" stroke="${c.furD}" stroke-width="3.5" stroke-linecap="round"/>
      <ellipse cx="8" cy="9" rx="13" ry="9" fill="${c.belly}"/>
      <g data-p="ceyes">
        <g transform="translate(-4,-1)"><ellipse rx="4" ry="5" fill="${c.eye}"/><circle cx="1" cy="-1.6" r="1.4" fill="#fff"/></g>
        <g transform="translate(13,-1)"><ellipse rx="4" ry="5" fill="${c.eye}"/><circle cx="1" cy="-1.6" r="1.4" fill="#fff"/></g>
      </g>
      <g data-p="ceyes2" style="display:none">
        <path d="M-8 0 Q-4 3 0 0" fill="none" stroke="${c.ink}" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M9 0 Q13 3 17 0" fill="none" stroke="${c.ink}" stroke-width="2.4" stroke-linecap="round"/>
      </g>
      <polygon points="6,6 12,6 9,10" fill="${c.nose}"/>
      <g data-p="cmouth"><path d="M9 10 Q6 15 3 13 M9 10 Q12 15 15 13" fill="none" stroke="${c.ink}" stroke-width="1.8" stroke-linecap="round"/></g>
      <g data-p="tongue" style="display:none"><ellipse cx="10" cy="16" rx="3" ry="4" fill="#f28482"/></g>
      <g stroke="#9a6a45" stroke-width="1.4" stroke-linecap="round" opacity=".8">
        <line x1="20" y1="8" x2="36" y2="5"/><line x1="20" y1="11" x2="36" y2="13"/><line x1="-3" y1="9" x2="-18" y2="7"/><line x1="-3" y1="12" x2="-17" y2="14"/>
      </g>
    </g>`;
  }
  function catSvg(form) {
    const c = CAT;
    if (form === 'curl') {
      return `<g data-j="body">
        <path d="M48 -10 C78 -8 82 -36 56 -40" fill="none" stroke="${c.fur}" stroke-width="15" stroke-linecap="round"/>
        <ellipse cx="10" cy="-30" rx="58" ry="31" fill="${c.fur}"/>
        <path d="M0 -60 Q3 -40 -2 -32" fill="none" stroke="${c.furD}" stroke-width="6" stroke-linecap="round"/>
        <path d="M22 -59 Q26 -40 20 -30" fill="none" stroke="${c.furD}" stroke-width="6" stroke-linecap="round"/>
        <path d="M42 -50 Q46 -36 40 -26" fill="none" stroke="${c.furD}" stroke-width="5" stroke-linecap="round"/>
        <ellipse cx="-30" cy="-4" rx="14" ry="7" fill="${c.belly}"/><ellipse cx="4" cy="-3" rx="14" ry="7" fill="${c.belly}"/>
        <g transform="translate(-36,-30)"><g data-j="head">
          <polygon points="-24,-14 -16,-42 -2,-24" fill="${c.fur}"/><polygon points="-20,-16 -15,-35 -6,-24" fill="#f7b2ad"/>
          <polygon points="2,-24 16,-42 24,-14" fill="${c.fur}"/><polygon points="6,-24 15,-35 19,-17" fill="#f7b2ad"/>
          <circle r="27" fill="${c.fur}"/>
          <path d="M-15 0 Q-9 6 -3 0" fill="none" stroke="${c.ink}" stroke-width="3" stroke-linecap="round"/>
          <path d="M5 0 Q11 6 17 0" fill="none" stroke="${c.ink}" stroke-width="3" stroke-linecap="round"/>
          <polygon points="-2,9 6,9 2,14" fill="${c.nose}"/>
          <g stroke="#9a6a45" stroke-width="1.6" stroke-linecap="round" opacity=".8"><line x1="-20" y1="12" x2="-38" y2="9"/><line x1="-20" y1="16" x2="-38" y2="18"/></g>
        </g></g>
      </g>`;
    }
    if (form === 'sit') {
      return `<g data-j="body">
        <g transform="translate(-24,-8)"><g data-j="tail"><path d="M0 0 C-22 2 -36 -10 -30 -34" fill="none" stroke="${c.fur}" stroke-width="12" stroke-linecap="round"/><path d="M-30 -26 C-31 -30 -31 -32 -30 -34" fill="none" stroke="${c.furD}" stroke-width="12" stroke-linecap="round"/></g></g>
        <ellipse cx="-4" cy="-26" rx="30" ry="26" fill="${c.fur}"/>
        <path d="M-22 -44 Q-16 -30 -22 -16" fill="none" stroke="${c.furD}" stroke-width="5" stroke-linecap="round"/>
        <ellipse cx="12" cy="-44" rx="20" ry="30" fill="${c.fur}"/>
        <ellipse cx="18" cy="-38" rx="11" ry="20" fill="${c.belly}"/>
        <g transform="translate(14,-36)"><g data-j="lf2"><rect x="-6" y="0" width="12" height="36" rx="6" fill="${c.furD}"/></g></g>
        <g transform="translate(24,-36)"><g data-j="lf"><rect x="-6" y="0" width="12" height="36" rx="6" fill="${c.fur}"/><ellipse cx="2" cy="35" rx="8" ry="5" fill="${c.belly}"/></g></g>
        <ellipse cx="-12" cy="-3" rx="14" ry="6" fill="${c.fur}"/>
        <g transform="translate(16,-82)">${catHead(c)}</g>
      </g>`;
    }
    // standing
    const legC = (id, x, col, paw) => `<g transform="translate(${x},-32)"><g data-j="${id}"><rect x="-6" y="-2" width="12" height="33" rx="6" fill="${col}"/>${paw ? `<ellipse cx="2" cy="30" rx="8" ry="4.5" fill="${c.belly}"/>` : ''}</g></g>`;
    return `<g data-j="body">
      <g transform="translate(-42,-48)"><g data-j="tail"><path d="M0 0 C-16 -4 -26 -26 -16 -46" fill="none" stroke="${c.fur}" stroke-width="11" stroke-linecap="round"/><path d="M-19 -38 C-18 -42 -17 -44 -16 -46" fill="none" stroke="${c.furD}" stroke-width="11" stroke-linecap="round"/></g></g>
      ${legC('lb2', -30, c.furD)}${legC('lf2', 28, c.furD)}
      <ellipse cx="0" cy="-46" rx="46" ry="21" fill="${c.fur}"/>
      <ellipse cx="6" cy="-36" rx="30" ry="9" fill="${c.belly}" opacity=".85"/>
      <path d="M-20 -66 Q-16 -54 -22 -44" fill="none" stroke="${c.furD}" stroke-width="5" stroke-linecap="round"/>
      <path d="M-4 -67 Q0 -55 -6 -45" fill="none" stroke="${c.furD}" stroke-width="5" stroke-linecap="round"/>
      <path d="M12 -66 Q15 -56 10 -48" fill="none" stroke="${c.furD}" stroke-width="5" stroke-linecap="round"/>
      ${legC('lb', -22, c.fur, 1)}${legC('lf', 34, c.fur, 1)}
      <g transform="translate(44,-66)">${catHead(c)}</g>
    </g>`;
  }
  const CAT_BASE = { lf: 0, lf2: 0, lb: 0, lb2: 0, tail: 0, head: 0, hx: 0, hy: 0, bx: 0, by: 0, br: 0, sy: 1, eyes: 'open', tongue: 0 };
  const CAT_NUM = ['lf', 'lf2', 'lb', 'lb2', 'tail', 'head', 'hx', 'hy', 'bx', 'by', 'br', 'sy', 'tongue'];
  const CAT_JOINT = {
    lf: (p) => `rotate(${p.lf.toFixed(1)})`, lf2: (p) => `rotate(${p.lf2.toFixed(1)})`, lb: (p) => `rotate(${p.lb.toFixed(1)})`, lb2: (p) => `rotate(${p.lb2.toFixed(1)})`,
    tail: (p) => `rotate(${p.tail.toFixed(1)})`,
    head: (p) => `translate(${p.hx.toFixed(1)},${p.hy.toFixed(1)}) rotate(${p.head.toFixed(1)})`,
    body: (p) => `translate(${p.bx.toFixed(1)},${p.by.toFixed(1)}) rotate(${p.br.toFixed(1)}) scale(1,${p.sy.toFixed(3)})`
  };
  const CAT_ACTS = {
    sleep: { form: 'curl', f: (t, a) => { if (a && a.scene && Math.random() < 0.012) a.scene.zzz(a.x - 40 * a.s, a.y - 70 * a.s); return { sy: 1 + Math.sin(t * 1.5) * 0.025, by: -Math.sin(t * 1.5) * 0.6, head: Math.sin(t * 0.7) * 2 }; } },
    sit: { form: 'sit', f: (t) => ({ tail: Math.sin(t * 1.3) * 10, head: Math.sin(t * 0.8) * 4 }) },
    purr: { form: 'sit', f: (t, a) => { if (a && a.scene && Math.random() < 0.012) a.scene.word(a.x + 30 * a.s, a.y - 120 * a.s, 'purr…', 0.8); return { eyes: 'closed', bx: Math.sin(t * 70) * 0.5, tail: Math.sin(t * 1.1) * 12, head: 6 + Math.sin(t * 0.8) * 3 }; } },
    wash: { form: 'sit', f: (t) => { const p = cyc(t, 1.4), k = bump(p, 0.1, 0.9); return { lf: -120 * k, head: -14 * k, eyes: k > 0.3 ? 'closed' : 'open', tongue: k > 0.4 ? 1 : 0, tail: Math.sin(t * 1.2) * 8 }; } },
    play: { form: 'sit', f: (t, a) => { const p = cyc(t, 1.6), k = bump(p, 0.15, 0.55); if (a && p > 0.3 && p < 0.34 && !a._p) { a._p = 1; if (a.onBat) a.onBat(); } if (p < 0.1) a._p = 0; return { lf: -70 * k, head: 8 + 6 * k, tail: Math.sin(t * 3) * 14 }; } },
    walk: { form: 'stand', f: (t) => { const s = Math.sin(t * 6); return { lf: s * 24, lb: -s * 24, lf2: -s * 24, lb2: s * 24, by: -Math.abs(Math.cos(t * 6)) * 2, tail: Math.sin(t * 3) * 10, head: Math.sin(t * 6) * 2 }; } },
    stand: { form: 'stand', f: (t) => ({ tail: Math.sin(t * 1.5) * 12, head: Math.sin(t * 0.8) * 3, by: Math.sin(t * 2) * 0.5 }) },
    chase: { form: 'stand', f: (t) => { const p = cyc(t, 0.9), air = bump(p, 0.15, 0.75), s = Math.sin(p * Math.PI * 2); return { by: -34 * air, br: -10 * Math.cos(p * Math.PI * 2) * air, lf: -40 * air + 15 * s, lf2: -30 * air, lb: 40 * air, lb2: 30 * air, tail: 20 + 10 * s, head: -8 * air }; } },
    pounce: { form: 'stand', f: (t) => { const p = cyc(t, 2.6), crouchK = clamp(p / 0.4, 0, 1) * (p < 0.45 ? 1 : 0), air = bump(p, 0.45, 0.75); return { sy: 1 - 0.12 * crouchK, by: 6 * crouchK - 50 * air, br: -12 * air, tail: 25 * crouchK + Math.sin(t * 20) * 6 * crouchK, lf: -45 * air, lb: 40 * air, lf2: -35 * air, lb2: 30 * air, hx: 0 }; } },
    drink: { form: 'stand', f: (t) => ({ head: 24, hx: 6, hy: 30, tongue: Math.sin(t * 12) > 0 ? 1 : 0, eyes: 'closed', tail: Math.sin(t * 1.5) * 10, lf: -6, lf2: -6 }) },
    jump: { form: 'stand', f: (t) => { const p = cyc(t, 1.4), crouchK = bump(p, 0, 0.3), air = bump(p, 0.25, 0.85); return { sy: 1 - 0.1 * crouchK, by: 5 * crouchK - 70 * air, br: -14 * Math.cos(Math.PI * (p - 0.25) / 0.6) * air, lf: -50 * air, lf2: -40 * air, lb: 50 * air, lb2: 40 * air, tail: 30 * air }; } },
    stretch: { form: 'stand', f: (t) => { const k = S01(t * 1.2); return { br: 8 * k, by: 6 * k, lf: -30 * k, lf2: -30 * k, tail: 30 + 10 * k, eyes: k > 0.6 ? 'closed' : 'open' }; } },
    hugged: { form: 'sit', f: (t) => ({ eyes: 'closed', tail: Math.sin(t * 1.4) * 14, head: 10 }) },
    hide: { form: 'sit', f: (t) => ({ head: Math.sin(t * 1.4) * 8, tail: 0 }) }
  };

  /* ===================================================================
     PARTICLES – notes, bubbles, dirt, drops, Zs, sparkles… (few at a time)
     =================================================================== */
  const P_SVG = {
    note: () => `<g><ellipse cx="0" cy="8" rx="6" ry="4.5" fill="#6d597a" transform="rotate(-20 0 8)"/><rect x="4" y="-14" width="2.6" height="22" rx="1" fill="#6d597a"/><path d="M6.6 -14 q8 3 6 12" fill="none" stroke="#6d597a" stroke-width="2.6" stroke-linecap="round"/></g>`,
    bubble: (s) => `<g><circle r="${(9 * s).toFixed(1)}" fill="rgba(200,235,255,.25)" stroke="#8ec9ec" stroke-width="2"/><circle cx="${(-3 * s).toFixed(1)}" cy="${(-3 * s).toFixed(1)}" r="${(2.2 * s).toFixed(1)}" fill="#fff"/></g>`,
    dirt: () => `<ellipse rx="5" ry="4" fill="#7f4f24"/>`,
    drop: () => `<path d="M0 -6 Q5 1 0 5 Q-5 1 0 -6Z" fill="#6fb3e4"/>`,
    rain: () => `<rect x="-1" y="-9" width="2.2" height="16" rx="1.1" fill="#7fb2dd" opacity=".85"/>`,
    snow: () => `<circle r="${rnd(2.5, 4.5).toFixed(1)}" fill="#fff" stroke="#d6e4f0" stroke-width=".8"/>`,
    leaf: () => `<path d="M0 -8 Q8 -2 0 8 Q-8 -2 0 -8Z" fill="${['#e4893a', '#d9622b', '#e9b33d', '#c8552d'][Math.floor(Math.random() * 4)]}"/>`,
    puff: () => `<circle r="7" fill="#e6dccb" opacity=".8"/>`,
    spark: () => `<path d="M0 -9 L2.4 -2.4 L9 0 L2.4 2.4 L0 9 L-2.4 2.4 L-9 0 L-2.4 -2.4Z" fill="#f5c542"/>`,
    heart: () => `<path d="M0 6 C-12 -2 -6 -12 0 -5 C6 -12 12 -2 0 6Z" fill="#ef8a9a"/>`,
    seed: () => `<ellipse rx="3.2" ry="2.4" fill="#7cae5a"/>`,
    spray: () => `<circle r="${rnd(1.5, 3).toFixed(1)}" fill="#bfe3fb"/>`,
    star: () => `<path d="M0 -6 L1.6 -1.6 L6 0 L1.6 1.6 L0 6 L-1.6 1.6 L-6 0 L-1.6 -1.6Z" fill="#fff6c8"/>`,
    smoke: () => `<circle r="${rnd(8, 14).toFixed(1)}" fill="#eef1f4" opacity=".9"/>`,
    fire: () => `<circle r="${rnd(4, 8).toFixed(1)}" fill="${Math.random() < 0.5 ? '#f48c06' : '#ffd13b'}"/>`
  };

  /* ===================================================================
     THE SCENE – layers, actors, particles, role glows
     =================================================================== */
  let sceneCount = 0;
  const scenes = new Set();
  const GLOW = { who: '#e8833a', doing: '#e3b52c', what: '#3fa463', where: '#4a89dc', join: '#e06aa0', why: '#8e6cc9', when: '#9c6b3f', end: '#2f855a', hint: '#f5c542' };

  function el(tag, attrs, html) {
    const e = document.createElementNS(NS, tag);
    if (attrs) Object.keys(attrs).forEach((k) => e.setAttribute(k, attrs[k]));
    if (html != null) e.innerHTML = html;
    return e;
  }

  function makeScene(svg, opts) {
    opts = opts || {};
    const id = 'sb' + (++sceneCount);
    svg.setAttribute('viewBox', '0 0 800 400');
    svg.setAttribute('preserveAspectRatio', opts.aspect || 'xMidYMid meet');
    const filters = Object.keys(GLOW).map((r) => `<filter id="${id}-g-${r}" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="0" stdDeviation="7" flood-color="${GLOW[r]}" flood-opacity="1"/><feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="${GLOW[r]}" flood-opacity=".9"/></filter>`).join('');
    svg.innerHTML = `<defs>${filters}</defs><g class="L-bg"></g><g class="L-back"></g><g class="L-act"></g><g class="L-front"></g><g class="L-fx"></g><g class="L-top"></g>`;
    const L = { bg: svg.querySelector('.L-bg'), back: svg.querySelector('.L-back'), act: svg.querySelector('.L-act'), front: svg.querySelector('.L-front'), fx: svg.querySelector('.L-fx'), top: svg.querySelector('.L-top') };
    const S = {
      id, svg, L, actors: [], parts: [], emitters: [], places: {}, t: 0, alive: true, opts,
      clear() {
        S.actors.forEach((a) => a.remove && a.remove());
        S.actors = []; S.parts = []; S.emitters = []; S.places = {}; S.ticks = [];
        Object.values(L).forEach((g) => { g.innerHTML = ''; });
        S.t = 0;
      },
      ticks: [],
      onTick(fn) { S.ticks.push(fn); },
      bg(name, o) {
        L.bg.innerHTML = '';
        const B = window.SB_THINGS && window.SB_THINGS.bgs[name];
        if (!B) return;
        const out = B(o || {});
        const main = out.svg || out;
        // Wide screens: the picture carries on to the left and right (mirrored copies, without words or places).
        // Drawn as one flat picture, so there is no seam where it meets the middle.
        let ext = '';
        if (out.mirror !== false) {
          const side = main.replace(/<!--solo-->[\s\S]*?<!--\/solo-->/g, '').replace(/<text[\s\S]*?<\/text>/g, '');
          const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="800" height="400">${side}</svg>`);
          ext = `<image href="${url}" x="0" y="0" width="800" height="400" preserveAspectRatio="none" transform="matrix(-1 0 0 1 4 0)"/><image href="${url}" x="0" y="0" width="800" height="400" preserveAspectRatio="none" transform="matrix(-1 0 0 1 1596 0)"/>`;
        }
        L.bg.innerHTML = main + ext;
        if (out.front) L.front.insertAdjacentHTML('beforeend', out.front);
        svg.querySelectorAll('[data-place]').forEach((p) => { S.places[p.getAttribute('data-place')] = p; });
        if (out.tick) S.onTick(out.tick.bind(null, S));
        if (out.fx) out.fx(S);
      },
      kid(name, o) { const a = makeKid(S, name, o || {}); S.actors.push(a); return a; },
      cat(o) { const a = makeCat(S, o || {}); S.actors.push(a); return a; },
      thing(name, o) { const a = makeThing(S, name, o || {}); if (a) S.actors.push(a); return a; },
      prop(name, o) { o = Object.assign({ static: true }, o || {}); return S.thing(name, o); },
      // Particles
      spawn(kind, x, y, p) {
        if (REDUCED && !p.keep) return;
        const g = el('g', { class: 'pt' }, P_SVG[kind] ? P_SVG[kind](p.size || 1) : '');
        (p.layer ? L[p.layer] : L.fx).appendChild(g);
        S.parts.push(Object.assign({ g, x, y, vx: 0, vy: 0, ax: 0, ay: 0, life: 2, age: 0, rot: 0, vr: 0, sway: 0, fade: 0.3, grow: 0, sc: 1 }, p));
      },
      note(x, y) { S.spawn('note', x, y, { vx: rnd(-10, 14), vy: -34, life: 2.4, sway: 14, sc: rnd(0.8, 1.1) }); },
      bubble(x, y, s) { S.spawn('bubble', x, y, { size: s || 1, vx: rnd(-12, 22), vy: rnd(-36, -22), life: rnd(2.2, 3.4), sway: 10, sc: rnd(0.7, 1.3), pop: true }); },
      dirt(x, y) { for (let i = 0; i < 5; i++) S.spawn('dirt', x + rnd(-6, 6), y - 6, { vx: rnd(10, 70), vy: rnd(-130, -70), ay: 300, life: 1, sc: rnd(0.6, 1.2) }); },
      puff(x, y, n) { for (let i = 0; i < (n || 2); i++) S.spawn('puff', x + rnd(-8, 8), y - 4, { vx: rnd(-26, 26), vy: rnd(-14, -4), life: 0.7, grow: 1.2, fade: 0.6, sc: rnd(0.5, 0.9) }); },
      spark(x, y, n) { for (let i = 0; i < (n || 1); i++) S.spawn('spark', x + rnd(-6, 6), y + rnd(-6, 6), { life: 0.5, vr: 200, grow: 0.8, fade: 0.4, sc: rnd(0.5, 0.9) }); },
      zzz(x, y) { S.word(x, y, 'z', 0.9, { vx: -12, vy: -20, life: 2.6, sway: 8, color: '#4a6fa5' }); },
      splash(x, y) { for (let i = 0; i < 3; i++) S.spawn('drop', x + rnd(-8, 8), y, { vx: rnd(-50, 50), vy: rnd(-110, -60), ay: 320, life: 0.7, sc: rnd(0.6, 1) }); },
      spray(x, y) { for (let i = 0; i < 9; i++) S.spawn('spray', x + 30, y, { vx: rnd(60, 160), vy: rnd(-40, 40), life: 0.6, fade: 0.5 }); },
      hearts(x, y) { S.spawn('heart', x, y, { vx: rnd(-10, 10), vy: -30, life: 1.8, sway: 10, sc: rnd(0.8, 1.2) }); },
      word(x, y, text, size, p) {
        if (REDUCED) return;
        p = p || {};
        const g = el('g', { class: 'pt' }, `<text text-anchor="middle" font-family="Quicksand, sans-serif" font-weight="700" font-size="${Math.round(26 * (size || 1))}" fill="${p.color || '#5a4a8a'}" stroke="#fff" stroke-width="5" paint-order="stroke">${text}</text>`);
        L.top.appendChild(g);
        S.parts.push(Object.assign({ g, x, y, vx: 0, vy: -18, ax: 0, ay: 0, life: 1.6, age: 0, rot: 0, vr: 0, sway: 0, fade: 0.5, grow: 0.15, sc: 1, popIn: true }, p));
      },
      emit(kind, o) { S.emitters.push(Object.assign({ kind, rate: 6, acc: 0 }, o)); },
      // Role glows: the part of the picture that a card is about lights up in its colour.
      glow(role, ms, colour) {
        const els = svg.querySelectorAll(`[data-role~="${role}"]`);
        const f = `url(#${id}-g-${colour || role})`;
        els.forEach((e) => {
          e.setAttribute('filter', f);
          clearTimeout(e._gt);
          e._gt = setTimeout(() => e.removeAttribute('filter'), ms || 1500);
        });
        S.actors.forEach((a) => { if (a.roles && a.roles.includes(role)) a.pop = 1; });
        return els.length;
      },
      unglow() { svg.querySelectorAll('[filter]').forEach((e) => { if (/-g-/.test(e.getAttribute('filter'))) e.removeAttribute('filter'); }); },
      stop() { S.alive = false; scenes.delete(S); },
      start() { S.alive = true; scenes.add(S); },
      // Where is a point of an actor in scene coordinates (for particles from a hand)?
      pointOf(node) {
        try {
          const m = svg.getScreenCTM().inverse().multiply(node.getScreenCTM());
          return { x: m.e, y: m.f };
        } catch (e) { return { x: 400, y: 200 }; }
      }
    };
    scenes.add(S);
    return S;
  }

  /* ---------- Actors ---------- */
  function setRoles(g, roles) { if (roles && roles.length) g.setAttribute('data-role', roles.join(' ')); }
  function baseActor(S, o, layer) {
    const g = el('g', { class: 'actor' });
    (o.layer ? S.L[o.layer] : layer || S.L.act).appendChild(g);
    const a = {
      scene: S, g, x: o.x == null ? 400 : o.x, y: o.y == null ? 330 : o.y, s: o.s || 1, flip: o.flip ? -1 : 1, rot: o.rot || 0,
      roles: o.roles || [], pop: 0, action: o.act || 'idle', actT0: S.t, prev: null, blendT: 1, talking: false,
      nextBlink: S.t + rnd(1.5, 4), blinkUntil: 0, opacity: 1,
      remove() { g.remove(); }
    };
    setRoles(g, a.roles);
    return a;
  }
  function rootTransform(a, extraY) {
    const pop = a.pop > 0 ? 1 + 0.06 * Math.sin(Math.PI * a.pop) : 1;
    return `translate(${a.x.toFixed(1)},${(a.y + (extraY || 0)).toFixed(1)}) rotate(${a.rot}) scale(${(a.s * a.flip * pop).toFixed(3)},${(a.s * pop).toFixed(3)})`;
  }

  function makeKid(S, name, o) {
    const a = baseActor(S, o);
    a.kind = 'kid'; a.name = name;
    a.g.innerHTML = `<ellipse class="shadow" cx="0" cy="1" rx="32" ry="6.5" fill="rgba(40,40,60,.15)"/>` + kidSvg(name);
    if (o.noShadow) a.g.querySelector('.shadow').remove();
    a.j = {};
    a.g.querySelectorAll('[data-j]').forEach((n) => { a.j[n.getAttribute('data-j')] = n; });
    a.hands = { L: a.g.querySelector('[data-hand="L"] .held'), R: a.g.querySelector('[data-hand="R"] .held') };
    a.handEl = { L: a.g.querySelector('[data-hand="L"]'), R: a.g.querySelector('[data-hand="R"]') };
    a.face = a.g.querySelector('[data-p="face"]');
    a.eyes = a.g.querySelector('[data-p="eyes"]');
    a.eyes2 = a.g.querySelector('[data-p="eyes2"]');
    a.mouthEl = a.g.querySelector('[data-p="mouth"]');
    a.hatEl = a.g.querySelector('.hat');
    a.shadow = a.g.querySelector('.shadow');
    a.pose = Object.assign({}, KID_BASE);
    a.extra = o.pose || null;           // fixed extra joint values (e.g. sitting)
    a._m = ''; a._e = '';
    a.act = (n) => { if (n === a.action) return a; a.prev = Object.assign({}, a.pose); a.blendT = 0; a.action = n; a.actT0 = S.t; return a; };
    a.hold = (side, prop, po) => {
      po = po || {};
      const T = window.SB_THINGS && window.SB_THINGS.held[prop];
      a.hands[side].innerHTML = T ? `<g transform="translate(${po.dx || 0},${po.dy || 0}) rotate(${po.rot || 0}) scale(${po.s || 1})"${po.roles ? ` data-role="${po.roles.join(' ')}"` : ''}>${T}</g>` : '';
      return a;
    };
    a.hat = (h) => { const T = window.SB_THINGS && window.SB_THINGS.hats[h]; a.hatEl.innerHTML = T || ''; return a; };
    a.update = (t, dt) => {
      const fn = KID_ACTS[a.action] || KID_ACTS.idle;
      const lt = REDUCED ? 0.6 : t - a.actT0;
      const target = Object.assign({}, KID_BASE, a.extra || {}, fn(lt, a) || {});
      if (a.extra && a.extra.by && !(fn(lt, a) || {}).by) target.by = a.extra.by;
      if (a.blendT < 1 && a.prev) {
        a.blendT = Math.min(1, a.blendT + dt / 0.3);
        const k = ease(a.blendT);
        KID_NUM.forEach((n) => { target[n] = lerp(a.prev[n], target[n], k); });
      }
      a.pose = target;
      Object.keys(KID_JOINT).forEach((n) => { if (a.j[n]) a.j[n].setAttribute('transform', KID_JOINT[n](target)); });
      // face: look direction, eyes, mouth
      a.face.setAttribute('transform', `translate(${(target.look * 3.5).toFixed(1)},${(target.lookY * 2.5).toFixed(1)})`);
      let eyes = target.eyes;
      if (eyes === 'open') {
        if (t > a.nextBlink) { a.blinkUntil = t + 0.13; a.nextBlink = t + rnd(2.5, 5); }
        if (t < a.blinkUntil) eyes = 'blink';
      }
      if (eyes !== a._e) {
        a._e = eyes;
        if (eyes === 'open' || eyes === 'blink') {
          a.eyes.style.display = ''; a.eyes2.style.display = 'none';
          a.eyes.setAttribute('transform', eyes === 'blink' ? 'scale(1,0.12)' : '');
        } else { a.eyes.style.display = 'none'; a.eyes2.style.display = ''; a.eyes2.innerHTML = EYES2[eyes] || EYES2.closed; }
      }
      if (eyes === 'open') a.eyes.setAttribute('transform', `translate(${(target.look * 1.5).toFixed(1)},${(target.lookY * 1.2).toFixed(1)})`);
      let mouth = target.mouth;
      if (a.talking) mouth = Math.sin(t * 17) > 0 ? 'talk' : 'smile';
      if (mouth !== a._m) { a._m = mouth; a.mouthEl.innerHTML = MOUTHS[mouth] || MOUTHS.smile; }
      // shadow shrinks when jumping
      const hgt = Math.max(0, -target.by);
      if (a.shadow) a.shadow.setAttribute('transform', `scale(${(1 - Math.min(0.5, hgt / 140)).toFixed(3)},1)`);
      if (a.pop > 0) a.pop = Math.max(0, a.pop - dt * 2.2);
      a.g.setAttribute('transform', rootTransform(a));
    };
    if (o.hold) Object.keys(o.hold).forEach((side) => { const h = o.hold[side]; if (h) a.hold(side, h.prop || h, h); });
    if (o.hat) a.hat(o.hat);
    a.update(S.t, 1);
    return a;
  }

  function makeCat(S, o) {
    const a = baseActor(S, o);
    a.kind = 'cat'; a.name = 'milo';
    a.form = '';
    a.build = (form) => {
      a.form = form;
      a.g.innerHTML = `<ellipse class="shadow" cx="${form === 'curl' ? 10 : 0}" cy="1" rx="${form === 'sit' ? 34 : 52}" ry="6" fill="rgba(40,40,60,.15)"/>` + catSvg(form);
      if (o.noShadow) a.g.querySelector('.shadow').remove();
      a.j = {}; a.g.querySelectorAll('[data-j]').forEach((n) => { a.j[n.getAttribute('data-j')] = n; });
      a.ce = a.g.querySelector('[data-p="ceyes"]'); a.ce2 = a.g.querySelector('[data-p="ceyes2"]'); a.tg = a.g.querySelector('[data-p="tongue"]');
      a._e = ''; a._tg = -1;
    };
    a.pose = Object.assign({}, CAT_BASE);
    a.act = (n) => {
      const A = CAT_ACTS[n] || CAT_ACTS.sit;
      if (A.form !== a.form) { a.build(A.form); a.prev = null; a.blendT = 1; } else { a.prev = Object.assign({}, a.pose); a.blendT = 0; }
      a.action = n; a.actT0 = S.t; return a;
    };
    a.update = (t, dt) => {
      const A = CAT_ACTS[a.action] || CAT_ACTS.sit;
      const lt = REDUCED ? 0.6 : t - a.actT0;
      const target = Object.assign({}, CAT_BASE, A.f(lt, a) || {});
      if (a.blendT < 1 && a.prev) { a.blendT = Math.min(1, a.blendT + dt / 0.3); const k = ease(a.blendT); CAT_NUM.forEach((n) => { target[n] = lerp(a.prev[n], target[n], k); }); }
      a.pose = target;
      Object.keys(CAT_JOINT).forEach((n) => { if (a.j[n]) a.j[n].setAttribute('transform', CAT_JOINT[n](target)); });
      let eyes = target.eyes;
      if (eyes === 'open') { if (t > a.nextBlink) { a.blinkUntil = t + 0.13; a.nextBlink = t + rnd(2.5, 5); } if (t < a.blinkUntil) eyes = 'blink'; }
      if (a.ce && eyes !== a._e) {
        a._e = eyes;
        a.ce.style.display = eyes === 'closed' ? 'none' : ''; a.ce2.style.display = eyes === 'closed' ? '' : 'none';
        a.ce.setAttribute('transform', eyes === 'blink' ? 'scale(1,0.15)' : '');
      }
      if (a.tg && target.tongue !== a._tg) { a._tg = target.tongue; a.tg.style.display = target.tongue ? '' : 'none'; }
      if (a.pop > 0) a.pop = Math.max(0, a.pop - dt * 2.2);
      if (a.path) a.path(t, a);
      a.g.setAttribute('transform', rootTransform(a));
    };
    a.act(o.act || 'sit');
    a.update(S.t, 1);
    return a;
  }

  /* A creature, prop or thing from things.js: its svg plus an optional little animation. */
  function makeThing(S, name, o) {
    const T = window.SB_THINGS && window.SB_THINGS.things[name];
    if (!T) { console.warn('No thing called', name); return null; }
    const a = baseActor(S, o, T.layer ? S.L[T.layer] : null);
    a.kind = 'thing'; a.name = name; a.opts = o;
    a.g.innerHTML = typeof T.svg === 'function' ? T.svg(o) : T.svg;
    a.p = {}; a.g.querySelectorAll('[data-p]').forEach((n) => { a.p[n.getAttribute('data-p')] = n; });
    a.home = { x: a.x, y: a.y };
    a.anim = o.static && !o.act ? null : (T.acts && T.acts[o.act || T.def]) || null;
    a.act = (n) => { a.anim = T.acts && T.acts[n] || null; a.actT0 = S.t; a.action = n; return a; };
    a.update = (t, dt) => {
      a.dx = 0; a.dy = 0; a.drot = 0;
      if (a.anim) a.anim(REDUCED ? 0.6 : t - a.actT0, a, dt);
      if (a.pop > 0) a.pop = Math.max(0, a.pop - dt * 2.2);
      const pop = a.pop > 0 ? 1 + 0.08 * Math.sin(Math.PI * a.pop) : 1;
      a.g.setAttribute('transform', `translate(${(a.x + a.dx).toFixed(1)},${(a.y + a.dy).toFixed(1)}) rotate(${(a.rot + a.drot).toFixed(1)}) scale(${(a.s * a.flip * pop).toFixed(3)},${(a.s * pop).toFixed(3)})`);
      if (a.opacity !== a._op) { a._op = a.opacity; a.g.setAttribute('opacity', a.opacity); }
    };
    a.update(S.t, 1);
    return a;
  }

  /* ===================================================================
     THE ONE ANIMATION LOOP
     =================================================================== */
  let last = 0;
  function frame(now) {
    requestAnimationFrame(frame);
    const dtReal = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
    last = now;
    const dt = dtReal;
    scenes.forEach((S) => {
      if (!S.alive || !S.svg.isConnected) return;
      if (S.svg.getBoundingClientRect().width === 0) return;
      S.t += dt;
      S.ticks.forEach((fn) => { try { fn(S.t, dt); } catch (e) {} });
      S.actors.forEach((a) => { try { a.update(S.t, dt); } catch (e) {} });
      // emitters
      S.emitters.forEach((m) => {
        if (REDUCED) return;
        m.acc += dt * m.rate;
        while (m.acc >= 1) {
          m.acc -= 1;
          const x = typeof m.x === 'function' ? m.x() : m.x + rnd(-(m.w || 0) / 2, (m.w || 0) / 2);
          const y = typeof m.y === 'function' ? m.y() : m.y + rnd(-(m.h || 0) / 2, (m.h || 0) / 2);
          S.spawn(m.kind, x, y, Object.assign({}, m.p || {}, { vx: (m.p && m.p.vx || 0) + rnd(-(m.jx || 0), m.jx || 0), vy: (m.p && m.p.vy || 0) + rnd(-(m.jy || 0), m.jy || 0) }));
        }
      });
      // particles
      for (let i = S.parts.length - 1; i >= 0; i--) {
        const q = S.parts[i];
        q.age += dt;
        if (q.age >= q.life || (q.floor && q.y > q.floor)) { q.g.remove(); S.parts.splice(i, 1); if (q.floor && q.y > q.floor && q.onFloor) q.onFloor(q); continue; }
        q.vx += q.ax * dt; q.vy += q.ay * dt; q.x += q.vx * dt; q.y += q.vy * dt; q.rot += q.vr * dt;
        const k = q.age / q.life;
        let sc = q.sc * (1 + q.grow * k);
        if (q.popIn) sc *= Math.min(1, q.age / 0.15);
        const op = k > 1 - q.fade ? (1 - k) / q.fade : 1;
        const sx = q.sway ? Math.sin(q.age * 3 + i) * q.sway : 0;
        q.g.setAttribute('transform', `translate(${(q.x + sx).toFixed(1)},${q.y.toFixed(1)}) rotate(${q.rot.toFixed(0)}) scale(${sc.toFixed(2)})`);
        q.g.setAttribute('opacity', op.toFixed(2));
      }
    });
  }
  requestAnimationFrame(frame);

  /* ===================================================================
     PICTURES FOR CARDS – a tiny face of each character (start card, word cards)
     =================================================================== */
  function faceIcon(name) {
    if (name === 'milo') {
      return `<svg viewBox="-40 -44 80 74" aria-hidden="true"><g>${catHead(CAT)}</g></svg>`;
    }
    const tmp = kidSvg(name);
    const head = tmp.slice(tmp.indexOf('<g transform="translate(0,-36)">'), tmp.indexOf('<g class="hat"></g>'));
    return `<svg viewBox="-52 -82 104 106" aria-hidden="true"><g>${head}<g transform="translate(0,14)">${MOUTHS.smile}</g></g></g></svg>`.replace('<g data-p="mouth" transform="translate(0,14)"></g>', '');
  }

  window.SBArt = {
    makeScene, sound, faceIcon, LOOKS, KID_ACTS, CAT_ACTS, P_SVG, REDUCED,
    setSoundCheck(fn) { soundCheck = fn; },
    setSpeed(v) { SPEED = v; },
    helpers: { rnd, clamp, lerp, ease, S01, cyc, bump }
  };
})();
