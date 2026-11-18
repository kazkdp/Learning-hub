/* Sentence Studio – two more friends for the cast (18 Nov 2026).
   OLLIE the owl: the same Ollie as in Ask and Find Out (same shapes and colours), rigged so his wings,
   head, eyes and beak all move. REX the dog: a friendly golden dog with floppy ears and a waggy tail.
   Like the kids and Milo, each is drawn once; an action is a small function of time that sets joint
   values, and the engine eases between them. Use them in any scene: S.owl({ x, y, s, act }) and
   S.dog({ x, y, s, act }). Springs make ears flop and tails swish. */
(function () {
  'use strict';
  const ART = window.SBArt;
  const I = ART.INTERNAL;
  const { rnd, clamp, lerp, ease, S01, cyc, bump, D2R, f1, spring, tailChain, REDUCED } = I;

  /* =====================================================================
     OLLIE THE OWL (front view). Feet at (0,0); about 112 units tall.
     ===================================================================== */
  const OWL = { body: '#A0704F', d: '#7A5038', belly: '#F6E1BF', b: '#F0A33A', bD: '#D9892A', eye: '#2A2440' };
  const OWL_WING = 'M0 0 C-11 4 -17 22 -14 42 C-12 50 -7 54 -3 50 C-1 55 5 55 6 49 C10 36 9 13 0 0Z';
  function owlHead() {
    const c = OWL;
    return `<path d="M-33 -82L-29 -111L-11 -95Z" fill="${c.d}" stroke="${c.d}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M33 -82L29 -111L11 -95Z" fill="${c.d}" stroke="${c.d}" stroke-width="4" stroke-linejoin="round"/>
      <ellipse cx="0" cy="-72" rx="38" ry="26" fill="${c.body}"/>
      <ellipse cx="-12" cy="-88" rx="14" ry="6" fill="#fff" opacity=".1"/>
      <g data-k="ofaceX">
        <circle cx="-15" cy="-69" r="17.5" fill="${c.belly}"/><circle cx="15" cy="-69" r="17.5" fill="${c.belly}"/>
        <circle cx="-15" cy="-69" r="11.5" fill="#fff"/><circle cx="15" cy="-69" r="11.5" fill="#fff"/>
        <g data-k="pupils"><circle cx="-12.5" cy="-68" r="6.5" fill="${c.eye}"/><circle cx="17.5" cy="-68" r="6.5" fill="${c.eye}"/>
          <circle cx="-10" cy="-70.5" r="2.3" fill="#fff"/><circle cx="20" cy="-70.5" r="2.3" fill="#fff"/></g>
        <g data-k="lidL"><ellipse cx="-15" cy="-69" rx="12.6" ry="12.6" fill="${c.belly}"/></g>
        <g data-k="lidR"><ellipse cx="15" cy="-69" rx="12.6" ry="12.6" fill="${c.belly}"/></g>
        <path data-k="shutL" d="M-23 -70 Q-15 -63 -7 -70" fill="none" stroke="${c.eye}" stroke-width="2.6" stroke-linecap="round" opacity="0"/>
        <path data-k="shutR" d="M7 -70 Q15 -63 23 -70" fill="none" stroke="${c.eye}" stroke-width="2.6" stroke-linecap="round" opacity="0"/>
        <path data-k="hapL" d="M-22 -67 Q-15 -76 -8 -67" fill="none" stroke="${c.eye}" stroke-width="3" stroke-linecap="round" opacity="0"/>
        <path data-k="hapR" d="M8 -67 Q15 -76 22 -67" fill="none" stroke="${c.eye}" stroke-width="3" stroke-linecap="round" opacity="0"/>
        <path d="M-6 -58L6 -58L0 -51Z" fill="${c.b}" stroke="${c.b}" stroke-width="2.5" stroke-linejoin="round"/>
        <g data-k="beakLo"><path d="M-4.5 -52.5L4.5 -52.5L0 -47Z" fill="${c.bD}" stroke="${c.bD}" stroke-width="2" stroke-linejoin="round"/></g>
        <ellipse cx="-27" cy="-55" rx="5.5" ry="3.2" fill="#F4A6A0" opacity=".7"/><ellipse cx="27" cy="-55" rx="5.5" ry="3.2" fill="#F4A6A0" opacity=".7"/>
      </g>`;
  }
  function owlMarkup() {
    const c = OWL;
    const feather = '<path d="M-6 14 Q-9 26 -8 36 M-1 18 Q-3 30 -2 42" fill="none" stroke="#A97D5C" stroke-width="1.8" stroke-linecap="round" opacity=".7"/>';
    return `<g data-k="obody">
      <g data-k="feet"><ellipse cx="-13" cy="-5" rx="9" ry="5" fill="${c.b}"/><ellipse cx="13" cy="-5" rx="9" ry="5" fill="${c.b}"/>
        <path d="M-19 -3 v3 M-13 -2 v3.5 M-7 -3 v3 M7 -3 v3 M13 -2 v3.5 M19 -3 v3" stroke="${c.bD}" stroke-width="2" stroke-linecap="round"/></g>
      <g data-k="wingL"><g transform="rotate(14)"><path d="${OWL_WING}" fill="${c.d}"/>${feather}</g></g>
      <g data-k="wingR"><g transform="scale(-1,1) rotate(14)"><path d="${OWL_WING}" fill="${c.d}"/>${feather}</g></g>
      <ellipse cx="0" cy="-52" rx="40" ry="47" fill="${c.body}"/>
      <ellipse cx="0" cy="-35" rx="26" ry="27" fill="${c.belly}"/>
      <ellipse cx="-16" cy="-80" rx="12" ry="9" fill="#fff" opacity=".08"/>
      <path d="M-11 -42l4.5 4.5 4.5-4.5M2 -42l4.5 4.5 4.5-4.5M-4.5 -30l4.5 4.5 4.5-4.5" fill="none" stroke="#D2AE84" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
      <g data-k="ohead">${owlHead()}</g>
      <g data-k="ohold"></g>
      <g data-k="owingFront" opacity="0"><path data-k="wfL" d="M-40 -46 Q-30 -40 -26 -26 Q-25 -16 -32 -15 Q-40 -18 -42 -30Z" fill="${c.d}"/><path data-k="wfR" d="M40 -46 Q30 -40 26 -26 Q25 -16 32 -15 Q40 -18 42 -30Z" fill="${c.d}"/></g>
    </g>`;
  }
  const OWL_BASE = { wL: 0, wR: 0, tilt: 0, turn: 0, bx: 0, by: 0, br: 0, sy: 1, look: 0, lookY: 0, beak: 0, tuck: 0, hy: 0, grip: 0, gx: 0, gy: 0 };
  const OWL_NUM = Object.keys(OWL_BASE);
  const OWL_EYES = { open: { lid: 0, sq: 0 }, closed: { lid: 1, sq: 0 }, happy: { lid: 0, sq: 1 }, sleepy: { lid: 0.55, sq: 0 } };
  const OWL_ACTS = {
    idle: (t) => ({ sy: 1 + Math.sin(t * 2) * 0.012, tilt: Math.sin(t * 0.7) * 5 + (S01(t * 0.31) > 0.85 ? 10 : 0), look: Math.sin(t * 0.5) * 0.6, wL: 2 + Math.sin(t * 2) * 1.5, wR: 2 + Math.sin(t * 2) * 1.5 }),
    happy: (t) => { const p = cyc(t, 0.9), hop = bump(p, 0, 0.55); return { by: -16 * hop, sy: 1 - 0.06 * bump(p, 0.55, 1), wL: 20 + 50 * hop, wR: 20 + 50 * hop, eyes: 'happy', tilt: Math.sin(t * 3.5) * 8, tuck: hop * 0.6 }; },
    wave: (t) => ({ wR: 105 + Math.sin(t * 8) * 22, wL: 6, tilt: -8 + Math.sin(t * 4) * 4, eyes: 'happy', by: Math.sin(t * 4) * 1.5, look: 0.3 }),
    fly: (t, a) => {
      const w = t * 9, flap = S01(w);
      if (a && a.scene && Math.random() < 0.02) a.scene.spawn('puff', a.x + rnd(-20, 20) * a.s, a.y + 6, { life: 0.6, sc: 0.35, fade: 0.8 });
      return { wL: 18 + 92 * flap, wR: 18 + 92 * flap, by: -10 * Math.sin(w + 1.3), br: 4, tuck: 1, sy: 1 + 0.03 * Math.sin(w + 1.3), tilt: -4, look: 0.5 };
    },
    glide: (t) => ({ wL: 78 + Math.sin(t * 2) * 6, wR: 78 - Math.sin(t * 2) * 6, by: Math.sin(t * 1.4) * 6, br: Math.sin(t * 0.9) * 6, tuck: 1, look: 0.4 }),
    hoot: (t, a) => {
      const p = cyc(t, 2.6), h1 = bump(p, 0.2, 0.42), h2 = bump(p, 0.48, 0.75);
      if (a && a.scene && p > 0.2 && p < 0.24 && !a._h) { a._h = 1; a.scene.word(a.x + 46 * a.s, a.y - 120 * a.s, 'Hoot!', 0.9); }
      if (p < 0.1) a._h = 0;
      return { beak: Math.max(h1, h2), tilt: -10 * (h1 + h2), hy: 3 * (h1 + h2), sy: 1 - 0.04 * (h1 + h2), wL: 8 * (h1 + h2), wR: 8 * (h1 + h2) };
    },
    read: (t) => { const p = cyc(t, 3.6); const line = cyc(t, 1.2); return { wL: -30, wR: -30, grip: 1, tilt: 7 - 6 * bump(p, 0.86, 1), lookY: 0.9, look: p > 0.86 ? 0.8 : -0.7 + 1.4 * line, sy: 1 + Math.sin(t * 2) * 0.008, eyes: p > 0.88 && p < 0.97 ? 'happy' : 'open' }; },
    sleep: (t, a) => { if (a && a.scene && Math.random() < 0.012) a.scene.zzz(a.x + 30 * a.s, a.y - 110 * a.s); return { eyes: 'closed', tilt: 10 + Math.sin(t * 0.9) * 3, hy: 4, sy: 1 + Math.sin(t * 1.5) * 0.02, wL: -2, wR: -2 }; },
    point: (t, a) => ({ wR: 98 + Math.sin(t * 2.4) * 4, wL: 6, tilt: -6, look: 0.9, lookY: -0.2, beak: a && a.talking ? 0 : 0 }),
    teach: (t) => { const p = cyc(t, 3); const k = bump(p, 0, 0.5); return { wR: 70 + 30 * k, wL: 8, tilt: -6 + 10 * bump(p, 0.5, 1), look: 0.8 - 1.4 * bump(p, 0.5, 1), beak: 0.6 * Math.max(0, Math.sin(t * 11)) * k }; },
    dance: (t) => { const s = Math.sin(t * 4.2); return { br: s * 9, bx: s * 5, by: -Math.abs(Math.cos(t * 4.2)) * 8, wL: 40 + 50 * Math.max(0, s), wR: 40 + 50 * Math.max(0, -s), tilt: -s * 10, eyes: 'happy' }; },
    clap: (t) => { const k = Math.pow(S01(t * 11), 0.6); return { wL: -20, wR: -20, grip: 1, gx: k, gy: 6, eyes: 'happy', mouth: 1, beak: 0.3, by: Math.sin(t * 5.5) * 1.5 - 1, tilt: Math.sin(t * 2.75) * 6 }; },
    think: (t) => ({ wR: -30, wL: 4, grip: 0, tilt: -10 + Math.sin(t * 0.9) * 3, look: 0.6, lookY: -0.9, sy: 1 + Math.sin(t * 2) * 0.01, hy: Math.sin(t * 0.9) * 1 }),
    look: (t) => { const turn = Math.sin(t * 0.8); return { turn, tilt: turn * 6, look: turn * 0.8, sy: 1 + Math.sin(t * 2) * 0.01 }; },
    turnHead: (t) => { const p = cyc(t, 5), k = ease(clamp(bump(p, 0.05, 0.75) * 1.5, 0, 1)); return { turn: k, tilt: k * 25, look: k * 0.9 }; },
    land: (t) => { const p = Math.min(1, t / 1.2); const fall = 1 - ease(p); return { by: -60 * fall, wL: 30 + 70 * fall * S01(t * 14), wR: 30 + 70 * fall * S01(t * 14), tuck: fall, sy: 1 - 0.07 * bump(p, 0.85, 1) }; }
  };

  function makeOwl(S, o, I2) {
    const a = I.baseActor(S, o);
    a.kind = 'owl'; a.name = 'ollie';
    a.g.innerHTML = (o.noShadow ? '' : `<ellipse class="shadow" cx="0" cy="0" rx="30" ry="5.5" fill="rgba(40,40,60,.14)"/>`) + owlMarkup();
    const q = (k) => a.g.querySelector(`[data-k="${k}"]`);
    const E = { hold: q('ohold'), wf: q('owingFront'), wfL: q('wfL'), wfR: q('wfR'), body: q('obody'), head: q('ohead'), face: q('ofaceX'), pupils: q('pupils'), lidL: q('lidL'), lidR: q('lidR'), hapL: q('hapL'), hapR: q('hapR'), shutL: q('shutL'), shutR: q('shutR'), beak: q('beakLo'), wingL: q('wingL'), wingR: q('wingR'), feet: q('feet') };
    a.shadow = a.g.querySelector('.shadow');
    a.cur = Object.assign({}, OWL_BASE); a.fc = { lid: 0, sq: 0, beak: 0 }; a.first = true; a.blinkAt = null;
    a.tufts = { x: 0, v: 0 }; a.prevY = null;
    a.act = (n) => { if (n === a.action && n !== 'land') return a; a.prev = Object.assign({}, a.cur); a.blendT = 0; a.action = n; a.actT0 = S.t; return a; };
    a.update = (t, dt) => {
      if (a.path) a.path(t, a);
      const fn = OWL_ACTS[a.action] || OWL_ACTS.idle;
      const res = fn(REDUCED ? 0.6 : t - a.actT0, a) || {};
      const tg = Object.assign({}, OWL_BASE, res);
      if (a.blendT < 1 && a.prev) { a.blendT = Math.min(1, a.blendT + dt / 0.35); const kb = ease(a.blendT); OWL_NUM.forEach((n) => { tg[n] = lerp(a.prev[n], tg[n], kb); }); }
      const p = a.cur, kj = a.first ? 1 : 1 - Math.exp(-dt * 20);
      OWL_NUM.forEach((n) => { p[n] += (tg[n] - p[n]) * kj; });
      const X = OWL_EYES[res.eyes] || OWL_EYES.open;
      let beak = p.beak;
      if (a.talking) beak = 0.2 + 0.6 * Math.abs(Math.sin(t * 12) * 0.7 + Math.sin(t * 7.3) * 0.3);
      const kf = a.first ? 1 : 1 - Math.exp(-dt * 16);
      a.fc.lid += (X.lid - a.fc.lid) * kf; a.fc.sq += (X.sq - a.fc.sq) * kf; a.fc.beak += (beak - a.fc.beak) * (a.first ? 1 : 1 - Math.exp(-dt * 30));
      if (X.lid < 0.5 && X.sq < 0.5 && t > a.nextBlink && !REDUCED) { a.blinkAt = t; a.nextBlink = t + rnd(2.4, 5.5); if (Math.random() < 0.25) a.nextBlink = t + 0.3; }
      const bl = a.blinkAt != null && t - a.blinkAt < 0.2 ? Math.sin(Math.PI * (t - a.blinkAt) / 0.2) : 0;
      const lid = Math.min(1, a.fc.lid + bl * (1 - a.fc.lid));
      E.body.setAttribute('transform', `translate(${f1(p.bx)},${f1(p.by)}) rotate(${f1(p.br)}) scale(${(2 - p.sy).toFixed(3)},${p.sy.toFixed(3)})`);
      // head: tilt about the neck, turn slides the face sideways (owls can turn their heads a long way!)
      E.head.setAttribute('transform', `translate(0,${f1(p.hy)}) rotate(${f1(p.tilt)} 0 -60)`);
      E.face.setAttribute('transform', `translate(${f1(p.turn * 9)},0) scale(${(1 - Math.abs(p.turn) * 0.12).toFixed(3)},1)`);
      E.pupils.setAttribute('transform', `translate(${f1(p.look * 3.5)},${f1(p.lookY * 3)})`);
      const lt = (cx) => `translate(${cx},-81.6) scale(1,${Math.max(0.001, lid).toFixed(3)}) translate(${-cx},81.6)`;
      E.lidL.setAttribute('transform', lt(-15)); E.lidR.setAttribute('transform', lt(15));
      E.lidL.setAttribute('opacity', a.fc.sq > 0.5 ? 1 : 1); E.lidR.setAttribute('opacity', 1);
      if (a.fc.sq > 0.02) { const k = a.fc.sq; E.lidL.setAttribute('transform', lt(-15).replace(/scale\(1,[^)]+\)/, `scale(1,${Math.max(lid, k).toFixed(3)})`)); E.lidR.setAttribute('transform', lt(15).replace(/scale\(1,[^)]+\)/, `scale(1,${Math.max(lid, k).toFixed(3)})`)); }
      E.hapL.setAttribute('opacity', a.fc.sq.toFixed(2)); E.hapR.setAttribute('opacity', a.fc.sq.toFixed(2));
      const sh = (clamp((lid - 0.75) / 0.2, 0, 1) * (1 - a.fc.sq)).toFixed(2);
      E.shutL.setAttribute('opacity', sh); E.shutR.setAttribute('opacity', sh);
      E.beak.setAttribute('transform', `translate(0,${f1(a.fc.beak * 5)}) scale(1,${(1 + a.fc.beak * 0.6).toFixed(3)})`);
      E.wingL.setAttribute('transform', `translate(-31,-66) rotate(${f1(p.wL)})`);
      E.wingR.setAttribute('transform', `translate(31,-66) rotate(${f1(-p.wR)})`);
      E.wf.setAttribute('opacity', clamp(p.grip, 0, 1).toFixed(2));
      if (p.grip > 0.01) { E.wfL.setAttribute('transform', `translate(${f1(p.gx * 21)},${f1(-p.gy * p.gx)})`); E.wfR.setAttribute('transform', `translate(${f1(-p.gx * 21)},${f1(-p.gy * p.gx)})`); }
      E.feet.setAttribute('transform', `translate(0,${f1(-p.tuck * 6)}) scale(1,${(1 - p.tuck * 0.5).toFixed(3)})`);
      if (a.shadow) { const h = Math.max(0, -p.by) + (a.flyH || 0); a.shadow.setAttribute('transform', `translate(${f1(p.bx)},0) scale(${(1 - Math.min(0.6, h / 120)).toFixed(3)},1)`); a.shadow.setAttribute('opacity', (1 - Math.min(0.7, h / 120)).toFixed(2)); }
      if (a.pop > 0) a.pop = Math.max(0, a.pop - dt * 2.2);
      a.g.setAttribute('transform', I.rootTransform(a));
      a.first = false;
    };
    /* Ollie holds things in front of his tummy, with his wing tips round them (o.hold: 'bookOpen' etc.). */
    a.hold = (side, prop, po) => {
      po = po || (typeof prop === 'object' ? prop : {}); if (typeof prop === 'object') prop = prop.prop;
      const T = window.SB_THINGS && window.SB_THINGS.held[prop];
      E.hold.innerHTML = T ? `<g transform="translate(${po.dx || 0},${-30 + (po.dy || 0)}) rotate(${po.rot || 0}) scale(${po.s || 1})"${po.roles ? ` data-role="${po.roles.join(' ')}"` : ''}>${T}</g>` : '';
      return a;
    };
    if (o.hold) a.hold('front', o.hold.prop || o.hold, o.hold);
    a.update(S.t, 1 / 60);
    return a;
  }
  const owlFace = () => `<svg viewBox="-46 -116 92 76" aria-hidden="true"><g>${owlHead()}</g></svg>`;

  /* =====================================================================
     REX THE DOG (side view, facing right). Standing, sitting or lying down.
     ===================================================================== */
  const DOG = { fur: '#d99a55', furD: '#bd7f42', furDD: '#9a6230', ear: '#8a5530', light: '#f7ead8', nose: '#2b2220', collar: '#e5484d', tag: '#f5c542', tongue: '#ef7f93' };
  function dogHead() {
    const c = DOG;
    return `<g data-k="dhead">
      <rect x="-9" y="-6" width="18" height="10" rx="5" fill="${c.collar}" transform="rotate(-65)"/>
      <g data-k="tagG"><circle cx="2" cy="9" r="4" fill="${c.tag}" stroke="#d9a520" stroke-width="1.2"/></g>
      <ellipse cx="14" cy="-18" rx="21" ry="19" fill="${c.fur}"/>
      <ellipse cx="8" cy="-28" rx="10" ry="6" fill="#fff" opacity=".12"/>
      <g data-k="jaw"><path d="M16 -6 Q28 6 44 -1 Q41 7 30 9 Q20 9 16 0Z" fill="${c.light}"/><ellipse data-k="dtongue" cx="34" cy="7" rx="5.2" ry="7" fill="${c.tongue}"/></g>
      <ellipse cx="32" cy="-10" rx="15" ry="10" fill="${c.light}"/>
      <path d="M44 -6 Q40 0 31 -1" fill="none" stroke="${c.nose}" stroke-width="1.8" stroke-linecap="round"/>
      <ellipse cx="45.5" cy="-13" rx="5.5" ry="4.3" fill="${c.nose}"/><ellipse cx="44" cy="-14.5" rx="1.8" ry="1.1" fill="#fff" opacity=".6"/>
      <g data-k="deye"><ellipse cx="22" cy="-24" rx="3.8" ry="4.5" fill="#2b2220"/><circle cx="21" cy="-25.6" r="1.4" fill="#fff"/></g>
      <path data-k="deyeH" d="M17.5 -23 Q22 -29 26.5 -23" fill="none" stroke="#2b2220" stroke-width="2.4" stroke-linecap="round" opacity="0"/>
      <path data-k="deyeC" d="M17.5 -25 Q22 -21 26.5 -25" fill="none" stroke="#2b2220" stroke-width="2.4" stroke-linecap="round" opacity="0"/>
      <path d="M17 -31 Q22 -34 27 -31" fill="none" stroke="${c.furDD}" stroke-width="2.2" stroke-linecap="round"/>
      <g data-k="ear"><path d="M0 0 C-11 2 -14 22 -7 34 C-3 38 4 35 4 27 C6 15 6 4 0 0Z" fill="${c.ear}" transform="translate(5,-33)"/></g>
    </g>`;
  }
  function dogMarkup(form) {
    const c = DOG;
    const leg = (k, x, y, len, col, paw) => `<g transform="translate(${x},${y})"><g data-k="${k}"><rect x="-6.5" y="-3" width="13" height="${len + 3}" rx="6.5" fill="${col}"/><ellipse cx="3" cy="${len}" rx="9" ry="5" fill="${paw}"/></g></g>`;
    const tail = `<path data-k="dtail" fill="none" stroke="${c.fur}" stroke-width="10" stroke-linecap="round"/><path data-k="dtailTip" fill="none" stroke="${c.light}" stroke-width="10" stroke-linecap="round"/>`;
    if (form === 'lie') {
      return `<g data-k="dbody">${tail}
        <ellipse cx="0" cy="-22" rx="56" ry="22" fill="${c.fur}"/><path d="M-40 -40 Q0 -50 36 -40 Q10 -34 -40 -34Z" fill="${c.furD}" opacity=".5"/>
        <ellipse cx="-36" cy="-6" rx="16" ry="6" fill="${c.furD}"/>
        <ellipse cx="52" cy="-6" rx="16" ry="6" fill="${c.light}"/><ellipse cx="40" cy="-4" rx="14" ry="5.5" fill="${c.light}"/>
        <g transform="translate(48,-30) scale(1.13)"><g data-k="headJ">${dogHead()}</g></g>
      </g>`;
    }
    if (form === 'sit') {
      return `<g data-k="dbody">${tail}
        <ellipse cx="-12" cy="-30" rx="30" ry="28" fill="${c.fur}"/>
        <ellipse cx="2" cy="-5" rx="15" ry="6" fill="${c.light}"/>
        ${leg('lf2', 14, -52, 50, c.furD, c.furDD)}
        <ellipse cx="16" cy="-58" rx="22" ry="34" fill="${c.fur}"/><ellipse cx="26" cy="-56" rx="12" ry="22" fill="${c.light}"/>
        ${leg('lf', 26, -50, 48, c.fur, c.light)}
        <g transform="translate(24,-88) scale(1.13)"><g data-k="headJ">${dogHead()}</g></g>
      </g>`;
    }
    return `<g data-k="dbody">${tail}
      ${leg('lb2', -30, -42, 41, c.furD, c.furDD)}${leg('lf2', 30, -42, 41, c.furD, c.furDD)}
      <path d="M-50 -60 Q-52 -83 -24 -81 L28 -81 Q52 -81 52 -60 Q53 -36 30 -35 L-30 -35 Q-51 -36 -50 -60Z" fill="${c.fur}"/>
      <path d="M-40 -80 Q0 -88 32 -80 Q10 -72 -40 -73Z" fill="${c.furD}" opacity=".45"/>
      <ellipse cx="0" cy="-39" rx="32" ry="5" fill="${c.light}" opacity=".7"/>
      <ellipse cx="40" cy="-52" rx="13" ry="16" fill="${c.light}"/>
      ${leg('lb', -22, -42, 41, c.fur, c.light)}${leg('lf', 38, -42, 41, c.fur, c.light)}
      <g transform="translate(46,-74) scale(1.13)"><g data-k="headJ">${dogHead()}</g></g>
    </g>`;
  }
  const DOG_BASE = { lf: 0, lf2: 0, lb: 0, lb2: 0, head: 0, hx: 0, hy: 0, jaw: 0.15, tongue: 1, tail: 0, wag: 14, wagSpeed: 5, bx: 0, by: 0, br: 0, sy: 1 };
  const DOG_NUM = ['lf', 'lf2', 'lb', 'lb2', 'head', 'hx', 'hy', 'jaw', 'tongue', 'tail', 'wag', 'wagSpeed', 'bx', 'by', 'br', 'sy'];
  const DOG_ACTS = {
    stand: { form: 'stand', f: (t) => ({ jaw: 0.25 + 0.12 * Math.sin(t * 9), head: Math.sin(t * 0.7) * 4, by: Math.sin(t * 9) * 0.6, wag: 16 }) },
    wag: { form: 'stand', f: (t) => ({ wag: 34, wagSpeed: 13, br: Math.sin(t * 13) * 1.5, bx: Math.sin(t * 13) * 1, jaw: 0.35, head: -4 + Math.sin(t * 2) * 5, eyes: 'happy', tail: 8 }) },
    bark: { form: 'stand', f: (t, a) => {
      const p = cyc(t, 1.6), b1 = bump(p, 0.1, 0.3), b2 = bump(p, 0.38, 0.58);
      if (a && a.scene && ((p > 0.12 && p < 0.16) || (p > 0.4 && p < 0.44)) && !a._b) { a._b = 1; a.scene.word(a.x + 100 * a.s * a.flip, a.y - 120 * a.s, 'Woof!', 1); } if (p > 0.2 && p < 0.38 || p > 0.6) a._b = 0;
      const k = Math.max(b1, b2);
      return { jaw: 0.1 + 0.9 * k, head: -12 * k, hx: 4 * k, by: -2 * k, lf: -6 * k, lb: 6 * k, tongue: 0.3, wag: 20 };
    } },
    run: { form: 'stand', f: (t, a) => {
      const w = t * 11, s = Math.sin(w), c = Math.cos(w);
      if (a && a.scene && Math.random() < 0.06) a.scene.puff(a.x - 40 * a.s * a.flip, a.y, 1);
      return { lf: -38 * s, lf2: -30 * s + 10, lb: 38 * s, lb2: 30 * s - 10, br: -5 * c, by: -9 * Math.abs(s), head: 4 * c, jaw: 0.5, wag: 10, tail: -20 };
    } },
    fetch: { form: 'stand', f: (t, a) => { const r = DOG_ACTS.run.f(t, a); r.jaw = 0.3; r.tongue = 0; return r; } },
    walk: { form: 'stand', f: (t) => { const s = Math.sin(t * 6); return { lf: 22 * s, lb: -22 * s, lf2: -22 * s, lb2: 22 * s, by: -Math.abs(Math.cos(t * 6)) * 2.5, head: Math.sin(t * 6) * 2, jaw: 0.3, wag: 18 }; } },
    dig: { form: 'stand', f: (t, a) => {
      const w = t * 13, s = Math.sin(w);
      if (a && a.scene && Math.random() < 0.22) a.scene.spawn('dirt', a.x + 34 * a.s * a.flip, a.y - 6, { vx: -a.flip * rnd(90, 220), vy: rnd(-150, -60), ay: 360, life: 1, sc: rnd(0.6, 1.2) });
      return { lf: -30 - 30 * Math.max(0, s), lf2: -30 - 30 * Math.max(0, -s), head: 26, hy: 10, hx: 6, br: 9, by: 4, jaw: 0.2, wag: 26, wagSpeed: 9, tail: 10 };
    } },
    drink: { form: 'stand', f: (t) => ({ head: 34, hx: 8, hy: 30, br: 8, by: 3, jaw: 0.35 + 0.25 * Math.max(0, Math.sin(t * 12)), tongue: 1, lf: -8, lf2: -8, wag: 12 }) },
    jump: { form: 'stand', f: (t) => { const p = cyc(t, 1.4), cr = bump(p, 0, 0.3), air = bump(p, 0.25, 0.85); return { sy: 1 - 0.1 * cr, by: 6 * cr - 80 * air, br: -16 * Math.cos(Math.PI * (p - 0.25) / 0.6) * air, lf: -60 * air, lf2: -50 * air, lb: 55 * air, lb2: 45 * air, jaw: 0.6 * air, wag: 20, tail: 25 * air }; } },
    catch2: { form: 'stand', f: (t) => { const p = cyc(t, 2.4), cr = bump(p, 0.55, 0.68), air = bump(p, 0.66, 0.98); return { sy: 1 - 0.08 * cr, by: 4 * cr - 62 * air, br: -18 * air, lf: -50 * air, lf2: -40 * air, lb: 30 * air, lb2: 20 * air, jaw: 0.15 + 0.85 * bump(p, 0.62, 0.82), head: -18 * air, wag: 28, wagSpeed: 10, tail: 15, eyes: p > 0.85 ? 'happy' : 'open' }; } },
    catch: { form: 'stand', f: (t) => { const p = cyc(t, 1.8), air = bump(p, 0.2, 0.7); return { by: -70 * air, br: -22 * air, lf: -50 * air, lf2: -40 * air, lb: 30 * air, lb2: 20 * air, jaw: 0.2 + 0.8 * bump(p, 0.15, 0.4), head: -20 * air, wag: 26, tail: 20 }; } },
    swim: { form: 'stand', f: (t, a) => {
      const w = t * 7, s = Math.sin(w);
      if (a && a.scene && Math.random() < 0.05) a.scene.splash(a.x + 20 * a.s * a.flip, a.y - 34 * a.s);
      return { lf: -40 + 40 * s, lf2: -40 - 40 * s, lb: 30 - 30 * s, lb2: 30 + 30 * s, by: Math.sin(w * 0.5) * 2.5, br: -10, head: -14, jaw: 0.3, wag: 8, tail: -30 };
    } },
    shake: { form: 'stand', f: (t, a) => {
      const p = cyc(t, 2.6), k = bump(p, 0.1, 0.75), s = Math.sin(t * 34);
      if (a && a.scene && k > 0.3 && Math.random() < 0.6) a.scene.spawn('drop', a.x + rnd(-50, 60) * a.s, a.y - rnd(40, 90) * a.s, { vx: rnd(-160, 160), vy: rnd(-140, -40), ay: 380, life: 0.8, sc: rnd(0.5, 0.9) });
      return { br: 7 * s * k, bx: 3 * s * k, head: 10 * Math.sin(t * 34 + 0.8) * k, eyes: k > 0.2 ? 'closed' : 'open', jaw: 0.1, wag: 30 * k + 6, wagSpeed: 16, earShake: s * k };
    } },
    sniff: { form: 'stand', f: (t, a) => {
      if (a && a.scene && Math.random() < 0.01) a.scene.word(a.x + 90 * a.s * a.flip, a.y - 50 * a.s, 'sniff sniff', 0.6);
      return { head: 24 + Math.sin(t * 1.7) * 6, hy: 12, hx: 8, br: 6, jaw: 0, tongue: 0, hxW: Math.sin(t * 20) * 1, wag: 14 };
    } },
    sit: { form: 'sit', f: (t) => ({ jaw: 0.25 + 0.12 * Math.sin(t * 9), head: Math.sin(t * 0.6) * 5, wag: 12, wagSpeed: 4 }) },
    beg: { form: 'sit', f: (t) => ({ lf: -70 + Math.sin(t * 6) * 8, lf2: -60 + Math.sin(t * 6 + 1) * 8, by: -8, br: -10, head: -10 + Math.sin(t * 2) * 6, jaw: 0.35, eyes: 'happy', wag: 20, wagSpeed: 7 }) },
    tilt: { form: 'sit', f: (t) => { const k = S01(t * 1.2); return { head: -18 * k, jaw: 0.1, wag: 10 }; } },
    sleep: { form: 'lie', f: (t, a) => { if (a && a.scene && Math.random() < 0.012) a.scene.zzz(a.x + 50 * a.s, a.y - 60 * a.s); return { head: 26, hy: 10, eyes: 'closed', jaw: 0, tongue: 0, sy: 1 + Math.sin(t * 1.5) * 0.03, wag: 3, wagSpeed: 1.5, tail: 0 }; } },
    lie: { form: 'lie', f: (t) => ({ head: 6 + Math.sin(t * 0.6) * 4, jaw: 0.25 + 0.1 * Math.sin(t * 8), wag: 10 }) },
    eat: { form: 'stand', f: (t) => ({ head: 30, hx: 6, hy: 26, br: 8, by: 3, jaw: 0.1 + 0.4 * Math.max(0, Math.sin(t * 10)), tongue: 0, wag: 30, wagSpeed: 11 }) }
  };
  const TAIL = { stand: [-46, -66, [236, 252, 268, 284, 298]], sit: [-34, -10, [182, 190, 205, 230, 260]], lie: [-52, -20, [170, 176, 190, 215, 245]] };
  function makeDog(S, o) {
    const a = I.baseActor(S, o);
    a.kind = 'dog'; a.name = 'rex';
    a.ear = { x: 0, v: 0 }; a.tailSt = {}; a.prevHY = null;
    a.build = (form) => {
      a.form = form;
      a.g.innerHTML = (o.noShadow ? '' : `<ellipse class="shadow" cx="${form === 'sit' ? 4 : 6}" cy="1" rx="${form === 'sit' ? 38 : 58}" ry="6.5" fill="rgba(40,40,60,.15)"/>`) + dogMarkup(form);
      const q = (k) => a.g.querySelector(`[data-k="${k}"]`);
      a.E = { body: q('dbody'), head: q('headJ'), jaw: q('jaw'), tongue: q('dtongue'), eye: q('deye'), eyeH: q('deyeH'), eyeC: q('deyeC'), ear: q('ear'), tag: q('tagG'), tail: q('dtail'), tip: q('dtailTip'), lf: q('lf'), lf2: q('lf2'), lb: q('lb'), lb2: q('lb2'), mouthHold: null };
      a.shadow = a.g.querySelector('.shadow');
      a.tailSt = {}; a.cur = null;
      a.E.jaw.insertAdjacentHTML('beforeend', '<g data-k="mouthHold"></g>');
      a.E.mouthHold = q('mouthHold');
      if (a.held) a.E.mouthHold.innerHTML = a.held;
    };
    a.holdMouth = (svg) => { a.held = svg; if (a.E) a.E.mouthHold.innerHTML = svg || ''; return a; };
    a.act = (n) => {
      const A = DOG_ACTS[n] || DOG_ACTS.stand;
      if (A.form !== a.form) { a.build(A.form); a.prev = null; a.blendT = 1; } else { a.prev = Object.assign({}, a.cur); a.blendT = 0; }
      a.action = n; a.actT0 = S.t; return a;
    };
    a.first = true; a.fcSq = 0; a.fcLid = 0; a.blinkAt = null;
    a.update = (t, dt) => {
      if (a.path) a.path(t, a);
      const A = DOG_ACTS[a.action] || DOG_ACTS.stand;
      const res = A.f(REDUCED ? 0.6 : t - a.actT0, a) || {};
      const tg = Object.assign({}, DOG_BASE, res);
      if (a.blendT < 1 && a.prev) { a.blendT = Math.min(1, a.blendT + dt / 0.35); const kb = ease(a.blendT); DOG_NUM.forEach((n) => { tg[n] = lerp(a.prev[n], tg[n], kb); }); }
      if (!a.cur) a.cur = Object.assign({}, tg);
      const p = a.cur, kj = a.first ? 1 : 1 - Math.exp(-dt * 22);
      DOG_NUM.forEach((n) => { p[n] += (tg[n] - p[n]) * kj; });
      const E = a.E;
      E.body.setAttribute('transform', `translate(${f1(p.bx)},${f1(p.by)}) rotate(${f1(p.br)}) scale(1,${p.sy.toFixed(3)})`);
      ['lf', 'lf2', 'lb', 'lb2'].forEach((k) => { if (E[k]) E[k].setAttribute('transform', `rotate(${f1(p[k])})`); });
      E.head.setAttribute('transform', `translate(${f1(p.hx + (res.hxW || 0))},${f1(p.hy)}) rotate(${f1(p.head)})`);
      E.jaw.setAttribute('transform', `rotate(${f1(clamp(p.jaw, 0, 1) * 26)} 16 -4)`);
      E.tongue.setAttribute('transform', `translate(0,${f1(-4 + clamp(p.tongue, 0, 1) * 4)}) scale(1,${(0.3 + 0.7 * clamp(p.tongue, 0, 1) * clamp(p.jaw * 2, 0.2, 1)).toFixed(3)})`);
      // floppy ear: lags behind head and body movement
      const hyw = p.by + p.hy - p.head * 0.4;
      if (a.prevHY != null && dt > 0) spring(a.ear, clamp(((hyw - a.prevHY) / dt) * 0.25, -40, 40) + (res.earShake || 0) * 35, dt, 120, 7);
      a.prevHY = hyw;
      E.ear.setAttribute('transform', `rotate(${f1(-p.head * 0.5 + (REDUCED ? 0 : a.ear.x))} 5 -33)`);
      E.tag.setAttribute('transform', `rotate(${f1(-p.head * 0.8 - p.br)} 2 4)`);
      // eyes
      const want = res.eyes || 'open';
      const kf = 1 - Math.exp(-dt * 14);
      a.fcSq += ((want === 'happy' ? 1 : 0) - a.fcSq) * (a.first ? 1 : kf);
      a.fcLid += ((want === 'closed' ? 1 : 0) - a.fcLid) * (a.first ? 1 : kf);
      if (want === 'open' && t > a.nextBlink && !REDUCED) { a.blinkAt = t; a.nextBlink = t + rnd(2.4, 5.5); }
      const bl = a.blinkAt != null && t - a.blinkAt < 0.18 ? Math.sin(Math.PI * (t - a.blinkAt) / 0.18) : 0;
      const lid = Math.min(1, a.fcLid + bl);
      E.eye.setAttribute('transform', `translate(22,-24) scale(1,${Math.max(0.06, 1 - lid).toFixed(3)}) translate(-22,24)`);
      E.eye.setAttribute('opacity', ((1 - a.fcSq) * (lid > 0.85 ? 0 : 1)).toFixed(2));
      E.eyeH.setAttribute('opacity', a.fcSq.toFixed(2));
      E.eyeC.setAttribute('opacity', (clamp((lid - 0.7) / 0.25, 0, 1) * (1 - a.fcSq)).toFixed(2));
      // waggy tail
      const T = TAIL[a.form];
      const tc = tailChain(a.tailSt, T[0], T[1], T[2], a.form === 'stand' ? 8.5 : 9, p.tail + Math.sin(t * p.wagSpeed) * p.wag * 0.6, REDUCED ? 0 : p.wag * 0.6, p.wagSpeed, t, dt);
      E.tail.setAttribute('d', tc.d); E.tip.setAttribute('d', tc.tip);
      if (a.shadow) { const h = Math.max(0, -p.by); a.shadow.setAttribute('transform', `scale(${(1 - Math.min(0.5, h / 140)).toFixed(3)},1)`); }
      if (a.pop > 0) a.pop = Math.max(0, a.pop - dt * 2.2);
      a.g.setAttribute('transform', I.rootTransform(a));
      a.first = false;
    };
    a.hold = () => a;
    a.act(o.act || 'stand');
    a.update(S.t, 1 / 60);
    return a;
  }
  const dogFace = () => `<svg viewBox="-12 -56 66 66" aria-hidden="true"><g>${dogHead()}</g></svg>`;

  ART.register('owl', makeOwl, owlFace);
  ART.register('dog', makeDog, dogFace);
  ART.OWL_ACTS = OWL_ACTS; ART.DOG_ACTS = DOG_ACTS;
})();
