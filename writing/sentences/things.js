/* Sentence Studio – props, creatures and places (17 Nov 2026).
   Drawn once here and reused by every scene in content.js.
   held:   things a character holds (drawn in the hand's own direction: +y runs along the forearm)
   hats:   things on a character's head
   things: creatures and objects in the scene (origin at the bottom middle unless it flies), each with
           optional little animations (acts) that move its parts (data-p) over time
   bgs:    the places (800 × 400; the ground is at about y = 330). Parts marked data-place are what a
           "where" card lights up. */
(function () {
  'use strict';
  const H = window.SBArt.helpers;
  const { rnd, S01, cyc, bump, clamp, ease } = H;
  const R2 = (n) => n.toFixed(1);

  /* =================================================================== HELD */
  const held = {
    apple: '<g transform="translate(0,10)"><circle r="10" fill="#e5484d"/><circle cx="-3" cy="-3" r="3" fill="#ff8f8f" opacity=".7"/><path d="M0 -10 q1 -5 4 -6" stroke="#6b4226" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M2 -12 q6 -5 9 0 q-5 3 -9 0Z" fill="#5fae5a"/></g>',
    banana: '<g transform="translate(0,8) rotate(20)"><path d="M-14 -4 Q0 14 16 -6 Q2 6 -14 -4Z" fill="#f5d04c" stroke="#d9b02c" stroke-width="1.5"/></g>',
    cup: '<g transform="translate(0,2)"><path d="M-9 -16 L9 -16 L7 12 L-7 12Z" fill="rgba(210,236,252,.7)" stroke="#8fbfdc" stroke-width="2"/><path d="M-8 -6 L8 -6 L7 11 L-7 11Z" fill="#7fc0ea" opacity=".75"/></g>',
    spade: '<g><rect x="-2.5" y="-8" width="5" height="62" rx="2" fill="#a0703f"/><rect x="-7" y="-12" width="14" height="6" rx="3" fill="#6b4a2a"/><path d="M-11 52 L11 52 L9 74 Q0 82 -9 74Z" fill="#8d99ae" stroke="#6b7385" stroke-width="1.5"/></g>',
    can: '<g transform="rotate(-90)"><path d="M-4 6 Q-4 -6 8 -6 Q20 -6 20 6" fill="none" stroke="#3f8f6b" stroke-width="4"/><rect x="-10" y="6" width="34" height="26" rx="6" fill="#4caf7d"/><path d="M22 14 L46 2" stroke="#4caf7d" stroke-width="6" stroke-linecap="round"/><ellipse cx="47" cy="1" rx="5" ry="7" transform="rotate(-25 47 1)" fill="#3f8f6b"/></g>',
    brush: '<g><rect x="-2.5" y="-6" width="5" height="40" rx="2.5" fill="#c08a52"/><rect x="-3.5" y="32" width="7" height="6" fill="#9aa5b1"/><path d="M-4 38 Q0 52 4 38Z" fill="#e5484d"/></g>',
    toothbrush: '<g transform="rotate(90)"><rect x="-3" y="-4" width="6" height="40" rx="3" fill="#4a89dc"/><rect x="-4" y="34" width="8" height="10" rx="2" fill="#fff" stroke="#cfe3f7"/></g>',
    wand: '<g><rect x="-2" y="-4" width="4" height="34" rx="2" fill="#e0795f"/><circle cx="0" cy="40" r="9" fill="rgba(200,235,255,.3)" stroke="#e0795f" stroke-width="3"/></g>',
    magnifier: '<g><rect x="-3" y="-4" width="6" height="26" rx="3" fill="#6b4a2a"/><circle cx="0" cy="36" r="15" fill="rgba(220,240,255,.45)" stroke="#5b6b7d" stroke-width="4"/><path d="M-7 30 Q-5 26 -1 25" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/></g>',
    umbrella: '<g><path d="M0 0 L0 -96" stroke="#4a4a5a" stroke-width="3.5"/><path d="M0 4 q0 8 -7 8" fill="none" stroke="#4a4a5a" stroke-width="3.5" stroke-linecap="round"/><path d="M-62 -92 Q0 -150 62 -92 Q46 -100 31 -92 Q15 -102 0 -92 Q-15 -102 -31 -92 Q-46 -100 -62 -92Z" fill="#e5484d"/><path d="M0 -146 L0 -92 M-31 -92 Q-22 -126 0 -146 M31 -92 Q22 -126 0 -146" fill="none" stroke="#c23b40" stroke-width="2"/></g>',
    stick: '<g><rect x="-2" y="-6" width="4" height="40" rx="2" fill="#c08a52"/><circle cx="0" cy="36" r="5" fill="#f2e8d5"/></g>',
    spoon: '<g><rect x="-2" y="-4" width="4" height="34" rx="2" fill="#c08a52"/><ellipse cx="0" cy="34" rx="5" ry="7" fill="#c08a52"/></g>',
    seed: '<g transform="translate(0,6)"><ellipse rx="3.4" ry="2.4" fill="#8a6a3b"/></g>',
    bone: '<g transform="translate(0,10) rotate(80)"><rect x="-14" y="-3.5" width="28" height="7" rx="3.5" fill="#f6efe2"/><circle cx="-14" cy="-3.5" r="4.5" fill="#f6efe2"/><circle cx="-14" cy="3.5" r="4.5" fill="#f6efe2"/><circle cx="14" cy="-3.5" r="4.5" fill="#f6efe2"/><circle cx="14" cy="3.5" r="4.5" fill="#f6efe2"/></g>',
    peas: '<g transform="translate(0,6)"><circle cx="-3" r="3" fill="#7cae5a"/><circle cx="3" cy="1" r="3" fill="#6aa04a"/></g>',
    catbrush: '<g><rect x="-2.5" y="-4" width="5" height="22" rx="2.5" fill="#c08a52"/><rect x="-9" y="18" width="18" height="12" rx="4" fill="#e0795f"/><path d="M-7 30 v5 M-3 30 v5 M1 30 v5 M5 30 v5" stroke="#6b4a2a" stroke-width="1.5"/></g>',
    string: '<g></g>',
    bookOpen: '<g transform="translate(0,22) scale(0.82)"><path d="M0 -4 Q-20 -12 -36 -6 L-36 -40 Q-20 -46 0 -38Z" fill="#fff" stroke="#c9d3dc" stroke-width="2"/><path d="M0 -4 Q20 -12 36 -6 L36 -40 Q20 -46 0 -38Z" fill="#fff" stroke="#c9d3dc" stroke-width="2"/><path d="M-30 -30 h22 M-30 -22 h22 M-30 -14 h16 M8 -30 h22 M8 -22 h22 M8 -14 h18" stroke="#c9d3dc" stroke-width="2"/><path d="M0 -38 V-4" stroke="#8fa1b3" stroke-width="2"/><path d="M-38 -4 Q-20 -10 0 -2 Q20 -10 38 -4 L38 0 Q20 -6 0 2 Q-20 -6 -38 0Z" fill="#e0795f"/></g>',
    ballHeld: '<g transform="translate(0,12)"><circle r="12" fill="#e5484d" stroke="#b81d2a" stroke-width="2"/><path d="M-9 -4 Q0 6 9 -4" fill="none" stroke="#fff" stroke-width="2.5" opacity=".8"/></g>'
  };
  const hats = {
    sunhat: '<g transform="translate(0,-26)"><ellipse cx="0" cy="4" rx="54" ry="11" fill="#f2d48a"/><path d="M-30 4 Q-30 -30 0 -30 Q30 -30 30 4Z" fill="#f2d48a"/><path d="M-30 -2 Q0 4 30 -2" fill="none" stroke="#e0795f" stroke-width="6"/></g>',
    woolly: '<g transform="translate(0,-18)"><path d="M-36 6 Q-36 -36 0 -36 Q36 -36 36 6Z" fill="#4a89dc"/><rect x="-38" y="-2" width="76" height="13" rx="6" fill="#e0795f"/><circle cy="-40" r="9" fill="#f2b134"/></g>',
    goggles: '<g transform="translate(0,-2)"><path d="M-35 -2 L35 -2" stroke="#2a9d8f" stroke-width="4"/><circle cx="-12" cy="-1" r="10" fill="rgba(160,215,240,.55)" stroke="#2a9d8f" stroke-width="3"/><circle cx="12" cy="-1" r="10" fill="rgba(160,215,240,.55)" stroke="#2a9d8f" stroke-width="3"/></g>'
  };

  /* =================================================================== THINGS */
  const wing = (t, a, part, speed, minS) => { if (a.p[part]) a.p[part].setAttribute('transform', `scale(1,${(minS + (1 - minS) * Math.abs(Math.sin(t * speed))).toFixed(2)})`); };
  const things = {
    /* ---------- creatures ---------- */
    bee: {
      svg: `<g data-p="b"><g data-p="wings" opacity=".8"><ellipse cx="-4" cy="-14" rx="9" ry="12" fill="#e6f4fb" stroke="#a9cfe4" stroke-width="1.5"/><ellipse cx="7" cy="-13" rx="8" ry="11" fill="#e6f4fb" stroke="#a9cfe4" stroke-width="1.5"/></g>
        <ellipse rx="17" ry="12" fill="#f5c542"/><path d="M-6 -11 Q-9 0 -6 11 M3 -12 Q0 0 3 12" stroke="#3a2c1f" stroke-width="5" fill="none"/>
        <circle cx="15" cy="-2" r="8" fill="#3a2c1f"/><circle cx="17" cy="-4" r="2" fill="#fff"/><path d="M-17 0 L-24 1" stroke="#3a2c1f" stroke-width="2.5" stroke-linecap="round"/></g>`,
      def: 'fly',
      acts: {
        fly: (t, a) => { const w = t * 1.3; a.dx = Math.cos(w) * 70; a.dy = Math.sin(w * 2) * 22; a.flip = Math.sin(w) > 0 ? -1 : 1; wing(t, a, 'wings', 40, 0.35); if (a.scene && Math.random() < 0.01) a.scene.word(a.x + a.dx, a.y + a.dy - 30, 'bzz', 0.6, { color: '#8a6a00' }); },
        visit: (t, a) => { const p = cyc(t, 4), k = ease(clamp(p < 0.5 ? p / 0.3 : (1 - p) / 0.3, 0, 1)); a.dx = (1 - k) * -90 + Math.sin(t * 3) * 3; a.dy = (1 - k) * -60 + Math.sin(t * 5) * 3 * (1 - k); a.flip = p < 0.5 ? 1 : -1; wing(t, a, 'wings', 40, 0.35); }
      }
    },
    butterfly: {
      svg: `<g><g data-p="w"><path d="M0 0 C-22 -30 -36 -6 -20 4 C-34 14 -16 28 0 6Z" fill="#8e6cc9"/><path d="M0 0 C22 -30 36 -6 20 4 C34 14 16 28 0 6Z" fill="#a98ddf"/><circle cx="-16" cy="-8" r="4" fill="#f5c542"/><circle cx="16" cy="-8" r="4" fill="#f5c542"/></g><rect x="-2.5" y="-10" width="5" height="22" rx="2.5" fill="#3a2c1f"/><path d="M-1 -10 q-4 -8 -8 -9 M1 -10 q4 -8 8 -9" stroke="#3a2c1f" stroke-width="1.6" fill="none"/></g>`,
      def: 'flutter',
      acts: {
        flutter: (t, a) => { a.dx = Math.sin(t * 0.9) * 60; a.dy = Math.sin(t * 1.7) * 20; const k = Math.abs(Math.sin(t * 9)); a.p.w.setAttribute('transform', `scale(${(0.25 + 0.75 * k).toFixed(2)},1)`); },
        flee: (t, a) => { const p = cyc(t, 0.9); a.dy = -20 * bump(p, 0, 1) + Math.sin(t * 2.3) * 14; a.dx = Math.sin(t * 0.7) * 24; const k = Math.abs(Math.sin(t * 10)); a.p.w.setAttribute('transform', `scale(${(0.25 + 0.75 * k).toFixed(2)},1)`); },
        rest: (t, a) => { const k = 0.6 + 0.4 * Math.abs(Math.sin(t * 1.2)); a.p.w.setAttribute('transform', `scale(${k.toFixed(2)},1)`); }
      }
    },
    caterpillar: {
      svg: () => {
        let s = '';
        for (let i = 5; i >= 0; i--) s += `<g data-p="s${i}"><circle cx="${-i * 15}" cy="-11" r="${i === 0 ? 13 : 11}" fill="${i % 2 ? '#7cc36a' : '#8fd07c'}"/>${i > 0 ? `<rect x="${-i * 15 - 2}" y="-3" width="4" height="5" rx="2" fill="#4f8a3f"/>` : ''}</g>`;
        return `<g>${s}<g data-p="head"><circle cx="4" cy="-14" r="2.6" fill="#2b2220"/><path d="M3 -24 q2 -8 6 -9 M-4 -24 q-1 -8 2 -10" stroke="#4f8a3f" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M5 -7 q3 2 6 -1" stroke="#2b2220" stroke-width="1.6" fill="none" stroke-linecap="round"/></g></g>`;
      },
      def: 'crawl',
      acts: {
        crawl: (t, a) => { for (let i = 0; i < 6; i++) a.p['s' + i].setAttribute('transform', `translate(0,${R2(-Math.max(0, Math.sin(t * 4 - i * 0.8)) * 7)})`); a.dx = (t * 10) % 80 - 40; },
        eat: (t, a) => { for (let i = 0; i < 6; i++) a.p['s' + i].setAttribute('transform', `translate(0,${R2(-Math.max(0, Math.sin(t * 2 - i * 0.7)) * 3)})`); const k = Math.sin(t * 9); a.p.s0.setAttribute('transform', `translate(${R2(2 + k * 2)},${R2(-2 + k * 1.5)})`); a.p.head.setAttribute('transform', `translate(${R2(2 + k * 2)},${R2(-2 + k * 1.5)})`); }
      }
    },
    snail: {
      svg: `<g><path d="M-30 0 Q-34 -10 -18 -12 L26 -10 Q40 -10 42 -2 Q44 2 36 2 Z" fill="#d9c2a0"/><g data-p="eyes"><path d="M30 -10 L34 -30 M36 -9 L44 -27" stroke="#d9c2a0" stroke-width="4" stroke-linecap="round"/><circle cx="34" cy="-31" r="3.2" fill="#3a2c1f"/><circle cx="44" cy="-28" r="3.2" fill="#3a2c1f"/></g>
        <circle cx="-2" cy="-26" r="22" fill="#c98a4b"/><path d="M-2 -26 m-14 0 a14 14 0 1 1 14 14 a9 9 0 1 1 -9 -9 a5 5 0 1 1 5 5" fill="none" stroke="#8d5a2b" stroke-width="3"/></g>`,
      def: 'slide',
      acts: { slide: (t, a) => { a.dx = ((t * 8) % 120) - 60; a.p.eyes.setAttribute('transform', `rotate(${R2(Math.sin(t * 2) * 4)} 32 -10)`); if (a.scene && Math.random() < 0.05) a.scene.spawn('puff', a.x + a.dx - 30, a.y - 1, { life: 1.6, sc: 0.35, fade: 0.8, layer: 'back' }); } }
    },
    frog: {
      svg: `<g><g data-p="legs"><ellipse cx="-20" cy="-6" rx="14" ry="7" fill="#4f9a3f"/><ellipse cx="20" cy="-6" rx="14" ry="7" fill="#4f9a3f"/></g><ellipse cx="0" cy="-18" rx="26" ry="18" fill="#6cc24a"/><ellipse cx="0" cy="-12" rx="16" ry="9" fill="#d8efb0"/>
        <circle cx="-12" cy="-35" r="9" fill="#6cc24a"/><circle cx="12" cy="-35" r="9" fill="#6cc24a"/><circle cx="-12" cy="-36" r="4.5" fill="#2b2220"/><circle cx="12" cy="-36" r="4.5" fill="#2b2220"/><path d="M-10 -22 Q0 -16 10 -22" stroke="#2f6b25" stroke-width="2.2" fill="none" stroke-linecap="round"/></g>`,
      def: 'jump',
      acts: {
        jump: (t, a) => { const p = cyc(t, 2.2), air = bump(p, 0.3, 0.75), k = ease(clamp((p - 0.3) / 0.45, 0, 1)); a.dy = -90 * air + 54 * k; a.dx = 120 * k; a.drot = -15 * air; a.p.legs.setAttribute('transform', `scale(1,${R2(1 + air * 0.8)})`); if (p > 0.74 && p < 0.77 && a.scene && !a._s) { a._s = 1; a.scene.splash(a.x + a.dx, a.y - 4); } if (p < 0.5) a._s = 0; a.opacity = p > 0.82 ? Math.max(0, 1 - (p - 0.82) / 0.06) : p < 0.06 ? p / 0.06 : 1; },
        sit: (t, a) => { a.p.legs.setAttribute('transform', `scale(1,${R2(1 + Math.max(0, Math.sin(t * 3)) * 0.1)})`); }
      }
    },
    duck: {
      svg: `<g><path d="M-30 -14 Q-34 -34 -12 -30 L18 -30 Q30 -30 30 -16 Q28 0 0 0 Q-26 0 -30 -14Z" fill="#fff6dc" stroke="#e7d9b3" stroke-width="1.5"/><path d="M-30 -18 L-40 -26 L-30 -26Z" fill="#fff6dc"/><path d="M-12 -24 Q0 -12 14 -22" fill="none" stroke="#e7d9b3" stroke-width="3"/>
        <g data-p="head"><circle cx="20" cy="-42" r="13" fill="#fff6dc" stroke="#e7d9b3" stroke-width="1.5"/><path d="M30 -42 L44 -40 L30 -36Z" fill="#f2a33a"/><circle cx="24" cy="-45" r="2.6" fill="#2b2220"/></g></g>`,
      def: 'swim',
      acts: {
        swim: (t, a) => { a.dy = Math.sin(t * 2.2) * 2; a.dx = Math.sin(t * 0.4) * 40; a.flip = Math.cos(t * 0.4) > 0 ? 1 : -1; a.p.head.setAttribute('transform', `rotate(${R2(Math.sin(t * 1.3) * 5)} 20 -30)`); if (a.scene && Math.random() < 0.04) a.scene.spawn('puff', a.x + a.dx - 30 * a.flip, a.y + 2, { life: 1.2, sc: 0.4, grow: 1, fade: 0.8, layer: 'back' }); },
        eat: (t, a) => { const p = cyc(t, 2.2), k = bump(p, 0.45, 0.85); a.dy = Math.sin(t * 2.2) * 2; a.p.head.setAttribute('transform', `rotate(${R2(35 * k)} 20 -30)`); }
      }
    },
    bird: {
      svg: `<g><path d="M-18 -4 L-30 4 L-28 -6Z" fill="#7a5a43"/><ellipse cx="0" cy="-14" rx="18" ry="15" fill="#8c6a50"/><ellipse cx="6" cy="-10" rx="11" ry="10" fill="#e8743b"/>
        <g data-p="head"><circle cx="12" cy="-30" r="11" fill="#8c6a50"/><circle cx="15" cy="-32" r="2.4" fill="#2b2220"/><g data-p="beak"><path d="M22 -31 L30 -29 L22 -27Z" fill="#f2a33a"/></g><g data-p="beak2"><path d="M22 -29 L29 -26 L22 -27Z" fill="#e0912a"/></g></g>
        <path d="M-2 0 L-4 8 M4 0 L4 8" stroke="#b07a3a" stroke-width="2" stroke-linecap="round"/></g>`,
      def: 'sing',
      acts: {
        sing: (t, a) => { const open = Math.sin(t * 7) > 0.2; a.p.beak2.setAttribute('transform', open ? 'rotate(14 22 -28)' : ''); a.p.head.setAttribute('transform', `rotate(${R2(-8 + Math.sin(t * 1.4) * 5)} 12 -22)`); if (a.scene && Math.random() < 0.03) a.scene.note(a.x + 30 * a.s, a.y - 50 * a.s); },
        hop: (t, a) => { const p = cyc(t, 0.8); a.dy = -14 * bump(p, 0, 0.5); a.dx = Math.sin(t * 0.6) * 40; },
        build: (t, a) => { const p = cyc(t, 3.2), k = ease(clamp(p < 0.5 ? p / 0.4 : (1 - p) / 0.4, 0, 1)); a.dx = -110 * (1 - k); a.dy = -40 * (1 - k) * Math.abs(Math.sin(p * 9)); a.flip = p < 0.5 ? 1 : -1; if (a.p.twig) a.p.twig.style.display = p < 0.5 ? '' : 'none'; }
      }
    },
    owl: {
      svg: `<g><ellipse cx="0" cy="-30" rx="26" ry="32" fill="#8c6a50"/><ellipse cx="0" cy="-22" rx="17" ry="20" fill="#d9c2a0"/><path d="M-12 -24 q4 3 8 0 M4 -24 q4 3 8 0 M-6 -14 q4 3 8 0" stroke="#b49a78" stroke-width="2" fill="none"/>
        <g data-p="head"><polygon points="-22,-56 -16,-74 -6,-58" fill="#8c6a50"/><polygon points="22,-56 16,-74 6,-58" fill="#8c6a50"/><ellipse cx="0" cy="-54" rx="25" ry="20" fill="#8c6a50"/>
        <circle cx="-11" cy="-55" r="11" fill="#fff8e1"/><circle cx="11" cy="-55" r="11" fill="#fff8e1"/><g data-p="eyes"><circle cx="-11" cy="-55" r="6" fill="#2b2220"/><circle cx="11" cy="-55" r="6" fill="#2b2220"/><circle cx="-9" cy="-57" r="2" fill="#fff"/><circle cx="13" cy="-57" r="2" fill="#fff"/></g><path d="M-4 -46 L0 -38 L4 -46Z" fill="#f2a33a"/></g>
        <path d="M-8 0 l-3 6 M8 0 l3 6" stroke="#f2a33a" stroke-width="3" stroke-linecap="round"/></g>`,
      def: 'hoot',
      acts: { hoot: (t, a) => { const p = cyc(t, 4); a.p.head.setAttribute('transform', `rotate(${R2(Math.sin(t * 0.8) * 14)} 0 -40)`); a.p.eyes.setAttribute('transform', p > 0.9 && p < 0.93 ? 'translate(0,-55) scale(1,0.1) translate(0,55)' : ''); if (p > 0.3 && p < 0.32 && a.scene && !a._h) { a._h = 1; a.scene.word(a.x + 50 * a.s, a.y - 100 * a.s, 'Hoot!', 0.9); } if (p < 0.2) a._h = 0; } }
    },
    squirrel: {
      svg: `<g><g data-p="tail"><path d="M-14 -10 C-50 -10 -54 -60 -26 -74 C-14 -80 -6 -70 -14 -60 C-30 -50 -20 -30 -10 -24Z" fill="#c8733a"/></g><ellipse cx="0" cy="-20" rx="16" ry="20" fill="#d9844a"/><ellipse cx="4" cy="-16" rx="9" ry="12" fill="#f6dcc0"/>
        <g data-p="head"><circle cx="8" cy="-44" r="12" fill="#d9844a"/><polygon points="2,-54 4,-66 10,-55" fill="#d9844a"/><circle cx="13" cy="-46" r="2.4" fill="#2b2220"/><circle cx="19" cy="-41" r="2" fill="#5a3a2a"/></g>
        <g data-p="paws"><ellipse cx="14" cy="-22" rx="5" ry="4" fill="#c8733a"/></g><ellipse cx="-4" cy="-2" rx="9" ry="4" fill="#c8733a"/></g>`,
      def: 'dig',
      acts: { dig: (t, a) => { const p = cyc(t, 1.2), k = bump(p, 0.1, 0.6); a.drot = 14 * k; a.p.paws.setAttribute('transform', `translate(${R2(6 * k)},${R2(14 * k)})`); a.p.tail.setAttribute('transform', `rotate(${R2(Math.sin(t * 2) * 6)} -14 -10)`); if (p > 0.4 && p < 0.44 && a.scene && !a._d) { a._d = 1; a.scene.dirt(a.x + 24 * a.s, a.y - 2); } if (p < 0.2) a._d = 0; } }
    },
    spider: {
      svg: () => {
        let legs = '';
        for (let i = 0; i < 4; i++) { const y = -6 + i * 4; legs += `<path d="M-6 ${y} q-14 -10 -20 ${4 + i * 3}" stroke="#2b2220" stroke-width="2.4" fill="none"/><path d="M6 ${y} q14 -10 20 ${4 + i * 3}" stroke="#2b2220" stroke-width="2.4" fill="none"/>`; }
        return `<g><line data-p="thread" x1="0" y1="-12" x2="0" y2="-200" stroke="#cfd6de" stroke-width="1.4"/>${legs}<ellipse cx="0" cy="0" rx="10" ry="12" fill="#3a2c3f"/><circle cx="0" cy="-12" r="7" fill="#3a2c3f"/><circle cx="-2.5" cy="-13" r="1.8" fill="#fff"/><circle cx="2.5" cy="-13" r="1.8" fill="#fff"/></g>`;
      },
      def: 'spin',
      acts: { spin: (t, a) => { a.dy = Math.sin(t * 0.8) * 26; a.p.thread.setAttribute('y2', R2(-200 - a.dy)); } }
    },
    web: {
      layer: 'back',
      svg: () => {
        let s = '<g stroke="#c4ccd6" stroke-width="1.6" fill="none" data-p="web">';
        for (let i = 0; i < 8; i++) { const an = i * Math.PI / 4; s += `<line x1="0" y1="0" x2="${R2(Math.cos(an) * 80)}" y2="${R2(Math.sin(an) * 80)}"/>`; }
        for (let r = 16; r <= 76; r += 15) { let d = ''; for (let i = 0; i <= 8; i++) { const an = i * Math.PI / 4; d += (i ? 'L' : 'M') + R2(Math.cos(an) * r) + ' ' + R2(Math.sin(an) * r); } s += `<path d="${d}"/>`; }
        return s + '</g>';
      },
      def: 'grow',
      acts: { grow: (t, a) => { const k = Math.min(1, 0.35 + cyc(t, 9) * 1.1); a.p.web.setAttribute('transform', `scale(${k.toFixed(2)})`); } }
    },
    ant: {
      svg: `<g><g data-p="leaf"><path d="M-10 -26 Q14 -54 40 -30 Q14 -14 -10 -26Z" fill="#6aa84f"/><path d="M-6 -27 Q14 -34 36 -31" stroke="#4f8a3f" stroke-width="1.6" fill="none"/></g>
        <g data-p="legs" stroke="#3a2c1f" stroke-width="2" stroke-linecap="round"><line x1="-8" y1="-8" x2="-14" y2="0"/><line x1="0" y1="-8" x2="0" y2="0"/><line x1="8" y1="-8" x2="14" y2="0"/></g>
        <ellipse cx="-12" cy="-10" rx="7" ry="6" fill="#4a3426"/><ellipse cx="0" cy="-10" rx="5" ry="4.5" fill="#4a3426"/><circle cx="10" cy="-12" r="5.5" fill="#4a3426"/><path d="M13 -16 q4 -6 8 -6" stroke="#3a2c1f" stroke-width="1.6" fill="none"/><path d="M2 -14 L4 -24" stroke="#3a2c1f" stroke-width="2" stroke-linecap="round"/></g>`,
      def: 'carry',
      acts: { carry: (t, a) => { a.dx = ((t * 18) % 260) - 130; a.dy = -Math.abs(Math.sin(t * 12)) * 1.2; a.p.legs.setAttribute('transform', `skewX(${R2(Math.sin(t * 14) * 18)})`); } }
    },
    ladybird: {
      svg: `<g><circle cx="12" cy="-8" r="6" fill="#2b2220"/><path d="M-13 0 A13 13 0 0 1 13 0Z" transform="translate(0,-1) scale(1,1.1)" fill="#e5484d"/><path d="M0 -14 L0 0" stroke="#2b2220" stroke-width="1.6"/><circle cx="-6" cy="-7" r="2.4" fill="#2b2220"/><circle cx="6" cy="-7" r="2.4" fill="#2b2220"/><circle cx="-3" cy="-2" r="1.8" fill="#2b2220"/><circle cx="4" cy="-2" r="1.8" fill="#2b2220"/></g>`,
      def: 'crawl',
      acts: { crawl: (t, a) => { a.dx = Math.sin(t * 0.5) * 18; a.flip = Math.cos(t * 0.5) > 0 ? 1 : -1; } }
    },
    fish: {
      svg: `<g><g data-p="tail"><path d="M-22 0 L-40 -14 L-38 14Z" fill="#f2a33a"/></g><ellipse cx="0" cy="0" rx="26" ry="16" fill="#f5b942"/><path d="M-4 -15 Q4 -24 12 -14" fill="#f2a33a"/><circle cx="14" cy="-4" r="3.5" fill="#2b2220"/><circle cx="15" cy="-5" r="1.2" fill="#fff"/><path d="M4 -10 Q8 0 4 10" stroke="#e0912a" stroke-width="2" fill="none"/></g>`,
      def: 'swim',
      acts: { swim: (t, a) => { a.dx = Math.sin(t * 0.5) * 120; a.dy = Math.sin(t * 1.3) * 12; a.flip = Math.cos(t * 0.5) > 0 ? 1 : -1; a.p.tail.setAttribute('transform', `rotate(${R2(Math.sin(t * 8) * 14)} -22 0)`); if (a.scene && Math.random() < 0.03) a.scene.bubble(a.x + a.dx + 24 * a.flip, a.y + a.dy - 10, 0.4); } }
    },
    /* ---------- sky, space and weather ---------- */
    sun: {
      svg: () => { let r = ''; for (let i = 0; i < 12; i++) r += `<rect x="-3.5" y="-78" width="7" height="20" rx="3.5" fill="#f5c542" transform="rotate(${i * 30})"/>`; return `<g><circle r="64" fill="#ffe082" opacity=".35" data-p="glow"/><g data-p="rays">${r}</g><circle r="44" fill="#ffd13b"/><circle r="44" fill="none" stroke="#f5b030" stroke-width="3"/></g>`; },
      def: 'shine',
      acts: { shine: (t, a) => { a.p.rays.setAttribute('transform', `rotate(${R2(t * 6)})`); a.p.glow.setAttribute('transform', `scale(${R2(1 + Math.sin(t * 1.6) * 0.08)})`); } }
    },
    moon: {
      svg: `<g><circle r="58" fill="#fff6c8" opacity=".18" data-p="glow"/><circle r="40" fill="#f4f1de"/><circle cx="-12" cy="-10" r="8" fill="#e0dac3"/><circle cx="14" cy="10" r="10" fill="#e0dac3"/><circle cx="-4" cy="18" r="5" fill="#e0dac3"/></g>`,
      def: 'glow',
      acts: { glow: (t, a) => { a.p.glow.setAttribute('transform', `scale(${R2(1 + Math.sin(t * 1.2) * 0.1)})`); } }
    },
    earth: {
      svg: `<g><defs><clipPath id="earthClip"><circle r="80"/></clipPath></defs><circle r="80" fill="#2b85e4"/>
        <g clip-path="url(#earthClip)"><g data-p="land">${[0, 1, 2].map((k) => `<g transform="translate(${k * 240 - 240},0)"><path d="M-70 -50 Q-40 -64 -24 -30 Q-10 2 -42 32 Q-74 18 -70 -50Z" fill="#4cc96b"/><path d="M10 -14 Q40 -34 54 6 Q44 52 14 42Z" fill="#4cc96b"/><path d="M70 -60 Q100 -66 110 -40 Q90 -20 70 -60Z" fill="#4cc96b"/><rect x="-60" y="-40" width="50" height="9" rx="4.5" fill="#fff" opacity=".7"/><rect x="20" y="20" width="56" height="10" rx="5" fill="#fff" opacity=".7"/></g>`).join('')}</g>
        <circle cx="-26" cy="-28" r="70" fill="rgba(255,255,255,.1)"/></g><circle r="80" fill="none" stroke="#1e64b4" stroke-width="3.5"/></g>`,
      def: 'spin',
      acts: { spin: (t, a) => { a.p.land.setAttribute('transform', `translate(${R2(-((t * 30) % 240))},0)`); } }
    },
    rocket: {
      svg: `<g><g data-p="flame"><path d="M-16 0 Q0 70 16 0Z" fill="#f48c06"/><path d="M-9 0 Q0 44 9 0Z" fill="#ffd13b"/></g>
        <path d="M-22 -40 L-40 4 L-16 -4Z" fill="#d62828"/><path d="M22 -40 L40 4 L16 -4Z" fill="#d62828"/>
        <path d="M0 -150 C30 -110 32 -50 24 0 L-24 0 C-32 -50 -30 -110 0 -150Z" fill="#f8f9fa" stroke="#d62828" stroke-width="4"/><path d="M0 -150 C14 -132 22 -112 24 -100 L-24 -100 C-22 -112 -14 -132 0 -150Z" fill="#e63946"/>
        <circle cx="0" cy="-62" r="15" fill="#a8dadc" stroke="#457b9d" stroke-width="4"/><circle cx="-4" cy="-66" r="4" fill="#fff" opacity=".8"/></g>`,
      def: 'fly',
      acts: { fly: (t, a) => { a.dy = Math.sin(t * 1.6) * 8; a.p.flame.setAttribute('transform', `scale(${R2(0.9 + Math.random() * 0.25)},${R2(0.85 + Math.random() * 0.35)})`); if (a.scene && Math.random() < 0.3) a.scene.spawn('smoke', a.x + rnd(-10, 10), a.y + a.dy + 40 * a.s, { vy: 60, vx: rnd(-20, 20), life: 1.2, grow: 1.2, fade: 0.8, sc: 0.6, layer: 'back' }); } }
    },
    toyrocket: {
      svg: `<g><rect x="-26" y="-8" width="52" height="8" rx="3" fill="#8d99ae"/><g data-p="r"><g data-p="flame" style="display:none"><path d="M-8 -14 Q0 24 8 -14Z" fill="#f48c06"/></g><path d="M-10 -26 L-18 -10 L-8 -14Z" fill="#4a89dc"/><path d="M10 -26 L18 -10 L8 -14Z" fill="#4a89dc"/><path d="M0 -76 C14 -60 14 -30 10 -12 L-10 -12 C-14 -30 -14 -60 0 -76Z" fill="#fff" stroke="#4a89dc" stroke-width="3"/><circle cx="0" cy="-44" r="6" fill="#f2b134"/></g></g>`,
      def: 'launch',
      acts: { launch: (t, a) => { const p = cyc(t, 4), up = clamp((p - 0.4) / 0.45, 0, 1); a.p.r.setAttribute('transform', `translate(0,${R2(-320 * up * up)})`); a.p.flame.style.display = up > 0 && up < 1 ? '' : 'none'; a.p.r.setAttribute('opacity', p > 0.92 ? 0 : 1); if (up > 0 && up < 0.6 && a.scene && Math.random() < 0.5) a.scene.spawn('smoke', a.x + rnd(-6, 6), a.y - 10 - 320 * up * up, { vy: 30, vx: rnd(-30, 30), life: 1, grow: 1, fade: 0.8, sc: 0.5 }); } }
    },
    cloud: {
      layer: 'back',
      svg: `<g fill="#fff" opacity=".95"><ellipse cx="0" cy="0" rx="46" ry="20"/><circle cx="-18" cy="-12" r="20"/><circle cx="12" cy="-18" r="24"/></g>`,
      def: 'drift',
      acts: { drift: (t, a) => { a.dx = Math.sin(t * 0.08 + a.home.x) * 30; } }
    },
    raincloud: {
      layer: 'back',
      svg: `<g fill="#9aa7b5"><ellipse cx="0" cy="0" rx="70" ry="26"/><circle cx="-28" cy="-16" r="28"/><circle cx="18" cy="-24" r="34"/></g>`,
      def: 'rain',
      acts: { rain: (t, a, dt) => { a.dx = Math.sin(t * 0.3) * 10; if (a.scene && Math.random() < 0.55) a.scene.spawn('rain', a.x + a.dx + rnd(-60, 60), a.y + 20, { vy: 380, life: 1.2, floor: a.opts.floor || 380, fade: 0.1 }); } }
    },
    snowman: {
      svg: `<g data-p="m"><ellipse cx="0" cy="-34" rx="40" ry="36" fill="#fff" stroke="#dce6ef" stroke-width="2"/><circle cx="0" cy="-92" r="27" fill="#fff" stroke="#dce6ef" stroke-width="2"/>
        <circle cx="-9" cy="-97" r="3" fill="#2b2220"/><circle cx="9" cy="-97" r="3" fill="#2b2220"/><path d="M0 -90 L22 -86 L0 -84Z" fill="#f48c06"/><path d="M-10 -80 Q0 -74 10 -80" fill="none" stroke="#2b2220" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M-26 -68 Q0 -60 26 -68 L22 -60 Q0 -54 -22 -60Z" fill="#e5484d"/><circle cx="0" cy="-44" r="3" fill="#2b2220"/><circle cx="0" cy="-30" r="3" fill="#2b2220"/>
        <path d="M-36 -54 L-64 -76 M36 -54 L62 -78" stroke="#7a5038" stroke-width="4" stroke-linecap="round"/><path d="M-22 -114 h44 v-6 h-44Z M-14 -120 v-22 h28 v22Z" fill="#3a3a4a"/></g><ellipse data-p="pool" cx="0" cy="2" rx="40" ry="6" fill="#a8d4f2" opacity=".0"/>`,
      def: 'stand',
      acts: {
        stand: () => {},
        melt: (t, a) => { const k = 0.25 + 0.5 * S01(t * 0.5 - Math.PI / 2); a.p.m.setAttribute('transform', `scale(${R2(1 + k * 0.18)},${(1 - k * 0.42).toFixed(3)})`); a.p.pool.setAttribute('opacity', (0.3 + k * 0.6).toFixed(2)); a.p.pool.setAttribute('transform', `scale(${R2(1 + k)},1)`); if (a.scene && Math.random() < 0.05) a.scene.spawn('drop', a.x + rnd(-30, 30) * a.s, a.y - (70 - k * 30) * a.s, { vy: 40, ay: 200, life: 0.8, sc: 0.6 }); }
      }
    },
    plant: {
      svg: `<g><path d="M-26 0 L-30 -36 L30 -36 L26 0Z" fill="#c8733a"/><rect x="-34" y="-44" width="68" height="10" rx="4" fill="#d9844a"/><g data-p="g"><path d="M0 -44 L0 -130" stroke="#4f9a3f" stroke-width="5" stroke-linecap="round"/><path d="M0 -76 Q-30 -88 -34 -68 Q-14 -64 0 -76Z" fill="#6cc24a"/><path d="M0 -100 Q30 -114 34 -92 Q14 -88 0 -100Z" fill="#6cc24a"/><g transform="translate(0,-134)"><circle r="9" fill="#f5c542"/>${[0, 60, 120, 180, 240, 300].map((r) => `<ellipse cx="0" cy="-15" rx="7" ry="10" fill="#f28482" transform="rotate(${r})"/>`).join('')}<circle r="8" fill="#f5c542"/></g></g></g>`,
      def: 'grow',
      acts: { grow: (t, a) => { const k = 0.2 + 0.8 * ease(clamp(cyc(t, 7) / 0.7, 0, 1)); a.p.g.setAttribute('transform', `translate(0,-44) scale(${R2(0.6 + 0.4 * k)},${k.toFixed(3)}) translate(0,44)`); } }
    },
    flower: {
      svg: (o) => { const c = o.colour || '#f28482'; return `<g data-p="f"><path d="M0 0 Q-4 -30 0 -60" stroke="#4f9a3f" stroke-width="4" fill="none"/><path d="M0 -24 Q-18 -32 -20 -18 Q-8 -14 0 -24Z" fill="#6cc24a"/><g transform="translate(0,-64)">${[0, 72, 144, 216, 288].map((r) => `<ellipse cx="0" cy="-11" rx="8" ry="11" fill="${c}" transform="rotate(${r})"/>`).join('')}<circle r="7" fill="#f5c542"/></g></g>`; },
      def: 'sway',
      acts: { sway: (t, a) => { a.p.f.setAttribute('transform', `rotate(${R2(Math.sin(t * 1.1 + a.home.x) * 3)})`); } }
    },
    leaf: {
      svg: `<g><path d="M-40 0 Q-10 -40 50 -20 Q10 16 -40 0Z" fill="#6aa84f"/><path d="M-36 -1 Q6 -14 46 -20" stroke="#4f8a3f" stroke-width="2" fill="none"/><path d="M20 -24 a6 6 0 0 0 10 8 a5 5 0 0 0 6 -2" fill="#fff8e7" opacity="0"/></g>`
    },
    tree: {
      layer: 'back',
      svg: (o) => { const c = o.autumn ? ['#e4893a', '#d9622b', '#e9b33d'] : ['#6fb35f', '#5fa24f', '#7cc36a']; return `<g><path d="M-14 0 L-10 -120 L10 -120 L14 0Z" fill="#8d5f3b"/><path d="M-6 -90 L-34 -120 M6 -80 L30 -110" stroke="#8d5f3b" stroke-width="7" stroke-linecap="round"/><g data-place="tree"><circle cx="-40" cy="-140" r="46" fill="${c[1]}"/><circle cx="36" cy="-146" r="48" fill="${c[0]}"/><circle cx="0" cy="-186" r="52" fill="${c[2]}"/><circle cx="-2" cy="-130" r="40" fill="${c[0]}"/></g></g>`; }
    },
    nest: { svg: `<g><path d="M-36 -10 Q0 18 36 -10 Q30 6 0 8 Q-30 6 -36 -10Z" fill="#9c6b3f"/><path d="M-34 -10 Q-10 -2 6 -12 M-20 -4 Q4 4 30 -8 M-30 -6 L26 -14" stroke="#7a5038" stroke-width="2.4" fill="none"/><ellipse cx="-8" cy="-12" rx="7" ry="5" fill="#a8dadc"/><ellipse cx="6" cy="-12" rx="7" ry="5" fill="#a8dadc"/></g>` },
    twigbird: { svg: '<g></g>' },
    /* ---------- objects ---------- */
    ball: {
      svg: `<g><g data-p="b"><circle cx="0" cy="-16" r="16" fill="#e5484d" stroke="#b81d2a" stroke-width="2.5"/><path d="M-12 -21 Q0 -10 12 -21" fill="none" stroke="#fff" stroke-width="3" opacity=".8"/><circle cx="-6" cy="-24" r="3" fill="#fff" opacity=".6"/></g></g>`,
      def: 'still',
      acts: {
        still: () => {},
        kicked: (t, a) => { const p = cyc(t, 2.2), k = clamp((p - 0.42) / 0.5, 0, 1); a.dx = 330 * ease(k); a.dy = -110 * Math.sin(Math.PI * Math.min(1, k * 1.4)) * (k < 0.72 ? 1 : 0) - 26 * bump(k, 0.72, 1); a.drot = k * 720; a.opacity = k > 0.9 ? 1 - (k - 0.9) * 10 : p < 0.1 ? p * 10 : 1; },
        bounce: (t, a) => { const p = cyc(t, 0.9); a.dy = -60 * Math.sin(Math.PI * p); a.p.b.setAttribute('transform', p < 0.06 || p > 0.94 ? 'translate(0,2) scale(1.12,0.86) translate(0,-2)' : ''); },
        thrown: (t, a) => { const p = cyc(t, 2.4), k = clamp((p - 0.47) / 0.45, 0, 1); a.dx = 300 * k; a.dy = -170 * Math.sin(Math.PI * k) + 150 * (k > 0 ? 0 : 0); a.drot = 400 * k; a.opacity = k <= 0 || k >= 0.97 ? 0 : 1; }
      }
    },
    goal: { layer: 'back', svg: `<g><path d="M-10 0 L-10 -90 L70 -90 L70 0" fill="none" stroke="#fff" stroke-width="6"/><g stroke="#e8eef3" stroke-width="1.5">${[0, 1, 2, 3, 4, 5, 6].map((i) => `<line x1="${-10 + i * 13}" y1="-90" x2="${-10 + i * 13}" y2="0"/>`).join('')}${[1, 2, 3, 4, 5].map((i) => `<line x1="-10" y1="${-i * 15}" x2="70" y2="${-i * 15}"/>`).join('')}</g></g>` },
    book: {
      svg: `<g><path d="M0 -4 Q-20 -12 -36 -6 L-36 -40 Q-20 -46 0 -38Z" fill="#fff" stroke="#c9d3dc" stroke-width="2"/><path d="M0 -4 Q20 -12 36 -6 L36 -40 Q20 -46 0 -38Z" fill="#fff" stroke="#c9d3dc" stroke-width="2"/><path d="M-30 -30 h22 M-30 -22 h22 M-30 -14 h16 M8 -30 h22 M8 -22 h22 M8 -14 h18" stroke="#c9d3dc" stroke-width="2"/><path d="M0 -38 V-4" stroke="#8fa1b3" stroke-width="2"/><path d="M-38 -4 Q-20 -10 0 -2 Q20 -10 38 -4 L38 0 Q20 -6 0 2 Q-20 -6 -38 0Z" fill="#4a89dc"/><g data-p="page" style="display:none"><path d="M0 -38 Q14 -48 26 -36 L26 -6 Q14 -16 0 -4Z" fill="#f4f7fa" stroke="#c9d3dc"/></g></g>`,
      def: 'read',
      acts: { read: (t, a) => { const p = cyc(t, 3.6); a.p.page.style.display = p > 0.86 ? '' : 'none'; } }
    },
    bowl: { svg: `<g><path d="M-28 -16 Q-26 0 0 0 Q26 0 28 -16Z" fill="#4a89dc"/><ellipse cx="0" cy="-16" rx="28" ry="6" fill="#7fb2dd"/><ellipse cx="0" cy="-16" rx="22" ry="4" fill="#bfe3fb"/><text x="0" y="-4" text-anchor="middle" font-size="10" font-weight="700" fill="#fff" font-family="Quicksand, sans-serif">MILO</text></g>` },
    mixbowl: { svg: `<g><path d="M-40 -30 Q-38 0 0 0 Q38 0 40 -30Z" fill="#f4f1de" stroke="#d6cfb4" stroke-width="2"/><ellipse cx="0" cy="-30" rx="40" ry="8" fill="#f1d9a9"/><ellipse cx="0" cy="-30" rx="32" ry="5" fill="#e9c27a"/></g>` },
    wool: {
      svg: `<g><g data-p="b"><circle cx="0" cy="-14" r="14" fill="#ef8a9a"/><path d="M-12 -20 Q0 -8 12 -22 M-12 -10 Q2 -22 13 -8 M-6 -26 Q4 -14 2 -2" stroke="#d9677a" stroke-width="2" fill="none"/></g><path data-p="tail" d="M-14 -6 Q-40 4 -60 -2" fill="none" stroke="#ef8a9a" stroke-width="2.5"/></g>`,
      def: 'roll',
      acts: { roll: (t, a) => { const p = cyc(t, 1.6), k = bump(p, 0.32, 0.9); a.dx = 26 * k; a.drot = 0; a.p.b.setAttribute('transform', `rotate(${R2(120 * k)} 0 -14)`); } }
    },
    box: { svg: `<g><path d="M-40 0 L-40 -50 L40 -50 L40 0Z" fill="#d4a373"/><path d="M-40 -50 L-56 -66 L24 -66 L40 -50Z" fill="#e0b88a"/><path d="M-40 -50 L40 -50" stroke="#9c6644" stroke-width="2"/><path d="M0 -50 V0" stroke="#9c6644" stroke-width="2" opacity=".5"/></g>` },
    /* For "In, on, under": a big closed box to sit ON, and an open box in two parts (back and front) to sit IN. */
    bigbox: { layer: 'back', svg: `<g data-place="box"><path d="M-56 0 V-70 H56 V0Z" fill="#d4a373"/><path d="M56 0 V-70 L74 -92 V-22Z" fill="#b9875a"/><path d="M-56 -70 L-38 -92 H74 L56 -70Z" fill="#e6c193"/><path d="M-47 -81 H65" stroke="#c9a06d" stroke-width="7" opacity=".8"/><path d="M-56 -70 H56 L74 -92" fill="none" stroke="#9c6644" stroke-width="2"/><path d="M0 -70 V0" stroke="#9c6644" stroke-width="2" opacity=".35"/></g>` },
    boxBack: { layer: 'back', svg: `<g data-place="box"><path d="M-38 -92 L-44 -128 H68 L74 -92Z" fill="#dcb385"/><path d="M-56 -70 L-38 -92 L-74 -104 L-92 -82Z" fill="#e6c193"/><path d="M-56 -70 L-38 -92 H74 L56 -70Z" fill="#6b4a2a"/><path d="M-50 -72 L-36 -88 H70" fill="none" stroke="#5a3d22" stroke-width="3" opacity=".6"/></g>` },
    boxFront: { layer: 'front', svg: `<g data-place="box"><path d="M-56 0 V-70 H56 V0Z" fill="#d4a373"/><path d="M56 0 V-70 L74 -92 V-22Z" fill="#b9875a"/><path d="M56 -70 L74 -92 L104 -84 L84 -60Z" fill="#c99764"/><path d="M-56 -70 H56 L60 -52 H-60Z" fill="#e0b88a"/><path d="M-56 -70 H56" stroke="#9c6644" stroke-width="2"/><path d="M0 -52 V0" stroke="#9c6644" stroke-width="2" opacity=".35"/></g>` },
    chair: { layer: 'back', svg: `<g data-place="chair"><rect x="-34" y="-112" width="8" height="76" fill="#8d5f3b"/><rect x="26" y="-112" width="8" height="76" fill="#8d5f3b"/><rect x="-36" y="-116" width="72" height="28" rx="7" fill="#b07c50"/><rect x="-40" y="-48" width="80" height="11" rx="4" fill="#b07c50"/><rect x="-34" y="-38" width="8" height="38" fill="#8d5f3b"/><rect x="26" y="-38" width="8" height="38" fill="#8d5f3b"/></g>` },
    sandcastle: {
      svg: `<g data-p="c"><path d="M-50 0 L-46 -40 L46 -40 L50 0Z" fill="#e8c77d"/><rect x="-46" y="-70" width="24" height="32" fill="#e8c77d"/><rect x="22" y="-70" width="24" height="32" fill="#e8c77d"/><rect x="-14" y="-88" width="28" height="50" fill="#efd28f"/>
        <path d="M-46 -70 h6 v-6 h6 v6 h6 v-6 h6 v6 M22 -70 h6 v-6 h6 v6 h6 v-6 h6 v6 M-14 -88 h7 v-6 h7 v6 h7 v-6 h7 v6" fill="none" stroke="#d9b465" stroke-width="3"/><path d="M-8 0 v-22 q8 -10 16 0 v22Z" fill="#c9a35a"/><path d="M0 -88 V-112 L16 -104 L0 -98" fill="#e5484d" stroke="#8a6a3b" stroke-width="2"/></g>`,
      def: 'grow',
      acts: { grow: (t, a) => { const k = 0.4 + 0.6 * ease(clamp(cyc(t, 6) / 0.8, 0, 1)); a.p.c.setAttribute('transform', `scale(1,${k.toFixed(3)})`); } }
    },
    bucket: { svg: `<g><path d="M-18 0 L-22 -34 L22 -34 L18 0Z" fill="#4a89dc"/><path d="M-22 -34 Q0 -60 22 -34" fill="none" stroke="#2f6bb3" stroke-width="3"/><rect x="-24" y="-38" width="48" height="6" rx="3" fill="#2f6bb3"/></g>` },
    drum: { svg: `<g><rect x="-34" y="-46" width="68" height="44" rx="6" fill="#e0795f"/><path d="M-34 -40 L-12 -6 L12 -40 L34 -6" stroke="#f2e8d5" stroke-width="3" fill="none"/><ellipse cx="0" cy="-46" rx="34" ry="9" fill="#f6efe2" stroke="#c9b48a" stroke-width="2"/><ellipse cx="0" cy="-2" rx="34" ry="5" fill="#c8634a"/></g>` },
    telescope: { svg: `<g><path d="M-30 0 L0 -70 L30 0 M0 -70 L0 0" stroke="#5b6b7d" stroke-width="4" fill="none" stroke-linecap="round"/><g transform="translate(0,-74) rotate(-28)"><rect x="-46" y="-11" width="96" height="22" rx="6" fill="#4a5f7a"/><rect x="40" y="-14" width="14" height="28" rx="4" fill="#33465e"/><rect x="-52" y="-7" width="10" height="14" rx="3" fill="#33465e"/><rect x="-20" y="-11" width="6" height="22" fill="#f2b134"/></g></g>` },
    pot: {
      svg: `<g><path d="M-26 0 L-30 -36 L30 -36 L26 0Z" fill="#c8733a"/><rect x="-34" y="-44" width="68" height="10" rx="4" fill="#d9844a"/><ellipse cx="0" cy="-44" rx="30" ry="5" fill="#6b4a2a"/><g data-p="sprout"><path d="M0 -44 L0 -58" stroke="#4f9a3f" stroke-width="3"/><path d="M0 -56 Q-10 -64 -12 -56 Q-6 -52 0 -56Z M0 -56 Q10 -64 12 -56 Q6 -52 0 -56Z" fill="#6cc24a"/></g></g>`,
      def: 'sprout',
      acts: { sprout: (t, a) => { const k = ease(clamp((cyc(t, 6) - 0.4) / 0.4, 0, 1)); a.p.sprout.setAttribute('transform', `translate(0,-44) scale(${R2(k)}) translate(0,44)`); } }
    },
    easel: {
      layer: 'back',
      svg: () => {
        const cols = ['#e5484d', '#f48c06', '#f5c542', '#4caf50', '#4a89dc', '#3f51b5', '#8e6cc9'];
        const arcs = cols.map((c, i) => `<path d="M${-46 + i * 5} 6 A${46 - i * 5} ${46 - i * 5} 0 0 1 ${46 - i * 5} 6" fill="none" stroke="${c}" stroke-width="5" pathLength="100" stroke-dasharray="100" data-p="a${i}"/>`).join('');
        return `<g><path d="M-50 0 L-20 -190 M50 0 L20 -190 M0 -190 L0 0" stroke="#a0703f" stroke-width="7" stroke-linecap="round"/><rect x="-62" y="-176" width="124" height="96" rx="4" fill="#fff" stroke="#e1d6c3" stroke-width="3"/><g transform="translate(0,-108)">${arcs}</g><rect x="-66" y="-82" width="132" height="8" rx="3" fill="#a0703f"/></g>`;
      },
      def: 'paint',
      acts: { paint: (t, a) => { const p = cyc(t, 8); for (let i = 0; i < 7; i++) { const k = clamp((p - i * 0.1) / 0.1, 0, 1); a.p['a' + i].setAttribute('stroke-dashoffset', R2(100 - 100 * k)); } } }
    },
    slime: {
      svg: `<g><path data-p="s" d="" fill="#7ed957" stroke="#3f9a3a" stroke-width="3" stroke-linejoin="round"/><path data-p="hl" d="" fill="none" stroke="#c9f5b0" stroke-width="4" stroke-linecap="round"/></g>`
    },
    puddle: { layer: 'back', svg: `<g><ellipse cx="0" cy="0" rx="70" ry="13" fill="#9fc6e4"/><ellipse cx="-10" cy="-2" rx="40" ry="6" fill="#bfdcf0"/></g>` },
    kite: {
      svg: `<g><path d="M0 -50 L32 0 L0 50 L-32 0Z" fill="#e5484d"/><path d="M0 -50 L0 50 M-32 0 L32 0" stroke="#fff" stroke-width="2.5"/><path d="M0 -50 L32 0 L0 0Z" fill="#f2b134"/><path d="M0 50 q-10 16 0 28 q10 14 0 28" fill="none" stroke="#4a89dc" stroke-width="2.5"/><path d="M-6 66 l6 6 l6 -6 M-6 92 l6 6 l6 -6" fill="#4a89dc"/></g>`,
      def: 'fly',
      acts: { fly: (t, a) => { a.dx = Math.sin(t * 0.7) * 30; a.dy = Math.sin(t * 1.1) * 18; a.drot = Math.sin(t * 0.9) * 12; } }
    },
    thermometer: { svg: `<g><rect x="-8" y="-90" width="16" height="84" rx="8" fill="#fff" stroke="#c9d3dc" stroke-width="2"/><circle cx="0" cy="-6" r="13" fill="#e5484d"/><rect x="-4" y="-70" width="8" height="64" rx="4" fill="#e5484d"/></g>` },
    table: { layer: 'back', svg: `<g data-place="table"><rect x="-110" y="-74" width="220" height="14" rx="5" fill="#b07c50"/><rect x="-96" y="-60" width="12" height="60" fill="#8d5f3b"/><rect x="84" y="-60" width="12" height="60" fill="#8d5f3b"/></g>` },
    stool: { layer: 'back', svg: `<g><rect x="-26" y="-40" width="52" height="10" rx="4" fill="#b07c50"/><rect x="-20" y="-30" width="8" height="30" fill="#8d5f3b"/><rect x="12" y="-30" width="8" height="30" fill="#8d5f3b"/></g>` },
    acorn: { svg: `<g><ellipse cx="0" cy="-8" rx="7" ry="9" fill="#a0703f"/><path d="M-8 -12 Q0 -22 8 -12Z" fill="#6b4a2a"/><path d="M0 -20 v-4" stroke="#6b4a2a" stroke-width="2"/></g>` },
    basket: { layer: 'back', svg: `<g data-place="basket"><path d="M-86 -12 Q-92 -62 0 -64 Q92 -62 86 -12Z" fill="#b07c50"/><path d="M-74 -16 Q-78 -50 0 -52 Q78 -50 74 -16Z" fill="#c99764"/><ellipse cx="0" cy="-16" rx="72" ry="16" fill="#8fb3de"/><path d="M-60 -50 Q0 -58 60 -50" fill="none" stroke="#9c6644" stroke-width="2" opacity=".6"/></g>` },
    basketFront: { layer: 'front', svg: `<g data-place="basket"><path d="M-88 -26 Q-86 10 0 12 Q86 10 88 -26 Q66 -8 0 -6 Q-66 -8 -88 -26Z" fill="#c08a52"/><path d="M-80 -16 Q0 4 80 -16 M-70 -2 Q0 12 70 -2" fill="none" stroke="#9c6644" stroke-width="2.4" stroke-linecap="round"/></g>` },
    dogbowl: { svg: `<g><path d="M-30 -16 Q-28 0 0 0 Q28 0 30 -16Z" fill="#e5484d"/><ellipse cx="0" cy="-16" rx="30" ry="6" fill="#f08a8a"/><ellipse cx="0" cy="-16" rx="24" ry="4" fill="#bfe3fb"/><text x="0" y="-4" text-anchor="middle" font-size="10" font-weight="700" fill="#fff" font-family="Quicksand, sans-serif">REX</text></g>` },
    bone: { svg: `<g><rect x="-16" y="-4" width="32" height="8" rx="4" fill="#f6efe2"/><circle cx="-16" cy="-4" r="5" fill="#f6efe2"/><circle cx="-16" cy="4" r="5" fill="#f6efe2"/><circle cx="16" cy="-4" r="5" fill="#f6efe2"/><circle cx="16" cy="4" r="5" fill="#f6efe2"/></g>` },
    water: { layer: 'front', svg: `<g><path d="M-90 0 Q-45 -7 0 0 T90 0 L90 54 Q0 62 -90 54Z" fill="#8ccbe8"/><g data-p="rip" fill="none" stroke="#d9f0fb" stroke-width="3" stroke-linecap="round"><path d="M-70 8 q14 -5 28 0"/><path d="M30 14 q14 -5 28 0"/></g></g>`, def: 'ripple',
      acts: { ripple: (t, a) => { a.p.rip.setAttribute('transform', `translate(${R2(Math.sin(t * 1.4) * 6)},0)`); } } },
    hole: { layer: 'back', svg: `<g data-place="hole"><ellipse cx="0" cy="0" rx="44" ry="11" fill="#5b3a1a"/><path d="M28 -6 Q50 -30 72 -4 Z" fill="#7f4f24"/></g>` },
    lily: { layer: 'back', svg: `<g><ellipse rx="30" ry="9" fill="#5fae5a"/><path d="M0 0 L26 -6 L24 4Z" fill="#4f9a3f"/></g>` }
  };

  /* =================================================================== PLACES */
  const sky = (id, a, b) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect x="-800" width="2400" height="400" fill="url(#${id})"/>`;
  const clouds = (S, list) => list.forEach(([x, y, s]) => S.thing('cloud', { x, y, s }));
  const grassBlades = (y0, n, col) => { let s = ''; for (let i = 0; i < n; i++) { const x = (i * 97) % 800 + 10; s += `<path d="M${x} ${y0 + (i * 37) % 50} q2 -10 5 -12 q-1 8 1 12" fill="${col}"/>`; } return s; };
  const fence = (y) => { let s = `<rect x="0" y="${y + 22}" width="800" height="9" fill="#e9d5b5"/><rect x="0" y="${y + 52}" width="800" height="9" fill="#e9d5b5"/>`; for (let x = 6; x < 800; x += 38) s += `<path d="M${x} ${y + 82} V${y + 8} L${x + 13} ${y} L${x + 26} ${y + 8} V${y + 82}Z" fill="#f3e3c7" stroke="#e2cba6" stroke-width="1.5"/>`; return s; };
  const wall = (col, col2, floor) => `<rect x="-800" width="2400" height="300" fill="${col}"/><rect x="-800" y="292" width="2400" height="12" fill="${col2}"/><rect x="-800" y="304" width="2400" height="96" fill="${floor}"/>`;
  const wallDefs = '<defs><linearGradient id="wallShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".25"/><stop offset="1" stop-color="#000" stop-opacity=".03"/></linearGradient></defs>';
  const windowAt = (x, y, w, h, night) => `<g><rect x="${x - 8}" y="${y - 8}" width="${w + 16}" height="${h + 16}" rx="8" fill="#fff"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${night ? '#24305e' : '#cfe8fb'}"/>${night ? `<circle cx="${x + w * 0.7}" cy="${y + h * 0.35}" r="${h * 0.16}" fill="#f4f1de"/><circle cx="${x + w * 0.25}" cy="${y + h * 0.3}" r="2" fill="#fff"/><circle cx="${x + w * 0.4}" cy="${y + h * 0.65}" r="1.6" fill="#fff"/>` : `<circle cx="${x + w * 0.75}" cy="${y + h * 0.3}" r="${h * 0.13}" fill="#ffe082"/><ellipse cx="${x + w * 0.3}" cy="${y + h * 0.45}" rx="${w * 0.18}" ry="${h * 0.08}" fill="#fff"/>`}<path d="M${x + w / 2} ${y} V${y + h} M${x} ${y + h / 2} H${x + w}" stroke="#fff" stroke-width="6"/></g>`;

  const bgs = {
    garden: (o) => ({ edge: ['#cfe8fb', '#94cb7d'],
      svg: sky('skyG', '#cfe8fb', '#f1f8fd') + `<!--solo--><circle cx="690" cy="70" r="34" fill="#ffe082"/><circle cx="690" cy="70" r="50" fill="#ffe082" opacity=".25"/><!--/solo-->` +
        `<g opacity=".9">${fence(176)}</g>` +
        `<g data-place="garden"><path d="M0 262 Q200 250 400 258 T800 256 V400 H0Z" fill="#a6d790"/><path d="M0 300 Q200 290 400 300 T800 296 V400 H0Z" fill="#94cb7d"/>${grassBlades(300, 16, '#7fb86a')}</g>` +
        (o.flowers === false ? '' : `<g>${[[40, 262, '#f28482'], [74, 258, '#f5c542'], [108, 264, '#8e6cc9'], [742, 258, '#f28482'], [772, 262, '#f5c542']].map(([x, y, c]) => `<g transform="translate(${x},${y})"><path d="M0 0 V-26" stroke="#4f9a3f" stroke-width="3"/><g transform="translate(0,-30)">${[0, 72, 144, 216, 288].map((r) => `<ellipse cy="-6" rx="4.5" ry="6" fill="${c}" transform="rotate(${r})"/>`).join('')}<circle r="3.6" fill="#f5c542"/></g></g>`).join('')}</g>`),
      fx: (S) => clouds(S, [[160, 66, 0.8], [470, 46, 0.6]])
    }),
    park: (o) => ({ edge: ['#cfe8fb', '#a3d68d'],
      svg: sky('skyP', '#cfe8fb', '#eef7fd') +
        `<path d="M0 230 Q160 170 330 220 T640 200 T800 214 V300 H0Z" fill="#b9dfa3"/>` +
        `<g data-place="park"><path d="M0 250 Q220 236 420 248 T800 240 V400 H0Z" fill="#a3d68d"/><path d="M300 400 Q360 320 470 290 Q560 266 800 270 V290 Q600 292 520 310 Q430 336 400 400Z" fill="#eadcbc"/>${grassBlades(300, 14, '#86c070')}</g>` +
        `<g><rect x="640" y="252" width="110" height="9" rx="4" fill="#b07c50"/><rect x="640" y="236" width="110" height="8" rx="4" fill="#b07c50"/><rect x="648" y="261" width="7" height="24" fill="#7a5038"/><rect x="735" y="261" width="7" height="24" fill="#7a5038"/></g>`,
      fx: (S) => { S.thing('tree', { x: 90, y: 268, s: 0.95 }); clouds(S, [[300, 70, 0.7], [600, 50, 0.9]]); }
    }),
    kitchen: () => ({ edge: ['#eef4f1', '#e7d9c6'],
      mirror: false,
      svg: wallDefs + wall('#eef4f1', '#c9d6cf', '#e7d9c6') + `<g data-place="kitchen">${windowAt(80, 70, 150, 110)}<rect x="0" y="210" width="800" height="16" fill="#fff" opacity=".6"/>` +
        `<rect x="520" y="196" width="280" height="104" fill="#d4a373"/><rect x="510" y="186" width="290" height="14" rx="4" fill="#efe6d6"/><rect x="540" y="214" width="110" height="70" rx="6" fill="#c08a5a"/><rect x="670" y="214" width="110" height="70" rx="6" fill="#c08a5a"/><circle cx="640" cy="250" r="4" fill="#8d5f3b"/><circle cx="680" cy="250" r="4" fill="#8d5f3b"/>` +
        `<g transform="translate(580,186)"><rect x="-10" y="-34" width="20" height="34" rx="4" fill="#4a89dc"/><rect x="18" y="-26" width="28" height="26" rx="5" fill="#f2b134"/></g></g>`
    }),
    bedroom: (o) => ({ edge: [o.night ? '#c9cbe6' : '#e9e6f6', '#d9c7b0'],
      mirror: false,
      svg: wallDefs + wall(o.night ? '#c9cbe6' : '#e9e6f6', '#c4bedf', '#d9c7b0') + `<g data-place="bedroom">${windowAt(80, 60, 130, 110, o.night)}` +
        `<rect x="250" y="80" width="120" height="10" rx="3" fill="#b07c50"/><rect x="258" y="52" width="14" height="28" fill="#e0795f"/><rect x="274" y="56" width="12" height="24" fill="#4a89dc"/><rect x="288" y="50" width="16" height="30" fill="#2a9d8f"/><rect x="306" y="58" width="12" height="22" fill="#f2b134"/></g>` +
        `<g data-place="rug"><ellipse cx="300" cy="352" rx="150" ry="26" fill="#e09f87"/><ellipse cx="300" cy="352" rx="120" ry="19" fill="#f2c1ae"/></g>` +
        `<g data-place="bed"><rect x="470" y="150" width="20" height="170" rx="6" fill="#9c6644"/><rect x="760" y="196" width="20" height="124" rx="6" fill="#9c6644"/><rect x="476" y="232" width="300" height="62" rx="12" fill="#f4f7fa"/><rect x="494" y="208" width="84" height="38" rx="16" fill="#fff" stroke="#e1e7ee" stroke-width="2"/></g>`,
      front: o.covered ? `<g data-place="bed"><path d="M556 230 Q650 186 776 208 L776 300 Q660 310 556 300 Z" fill="#8fb3de"/><path d="M556 230 Q650 186 776 208 L776 220 Q650 200 556 242Z" fill="#a9c6e8"/><path d="M600 262 Q680 250 760 258" fill="none" stroke="#7da2cf" stroke-width="2.5" stroke-linecap="round"/></g>` : ''
    }),
    livingroom: (o) => ({ edge: ['#f6efe2', '#c9a27a'],
      mirror: false,
      svg: wallDefs + wall('#f6efe2', '#e2d2b6', '#c9a27a') + `<g data-place="livingroom">${windowAt(560, 60, 150, 110)}<g><rect x="80" y="170" width="250" height="70" rx="22" fill="#6d8fb8"/><rect x="70" y="214" width="270" height="70" rx="16" fill="#7aa0cb"/><rect x="62" y="196" width="30" height="96" rx="12" fill="#6d8fb8"/><rect x="318" y="196" width="30" height="96" rx="12" fill="#6d8fb8"/></g>` +
        `<g transform="translate(420,300)"><rect x="-3" y="-140" width="6" height="140" fill="#8a8f98"/><path d="M-28 -140 L28 -140 L18 -176 L-18 -176Z" fill="#f2d48a"/><ellipse cx="0" cy="0" rx="22" ry="5" fill="#8a8f98"/></g></g>` +
        `<g data-place="rug"><ellipse cx="560" cy="350" rx="190" ry="30" fill="#b85c4a"/><ellipse cx="560" cy="350" rx="160" ry="22" fill="#d47a62"/><ellipse cx="560" cy="350" rx="110" ry="14" fill="#e9a487"/></g>`
    }),
    bathroom: () => ({ edge: ['#d7ecf5', '#c3dde9'],
      mirror: false,
      svg: `<rect x="-800" width="2400" height="400" fill="#d7ecf5"/><g opacity=".7" stroke="#fff" stroke-width="2.5">${Array.from({ length: 46 }, (_, i) => `<line x1="${i * 52 - 832}" y1="0" x2="${i * 52 - 832}" y2="300"/>`).join('')}${Array.from({ length: 6 }, (_, i) => `<line x1="-800" y1="${i * 52}" x2="1600" y2="${i * 52}"/>`).join('')}</g><rect x="-800" y="300" width="2400" height="100" fill="#c3dde9"/>` +
        `<g data-place="bathroom"><rect x="520" y="60" width="160" height="110" rx="14" fill="#eef6fa" stroke="#fff" stroke-width="8"/><path d="M540 80 L600 140" stroke="#fff" stroke-width="6" opacity=".7"/></g>` +
        `<path d="M650 250 L650 214 Q650 200 634 200 L618 200 L618 212" fill="none" stroke="#8d99ae" stroke-width="9" stroke-linecap="round"/>`,
      front: `<g data-place="sink"><rect x="586" y="272" width="28" height="70" fill="#e9eef2"/><path d="M490 250 L710 250 Q700 292 600 292 Q500 292 490 250Z" fill="#fff" stroke="#c5d4dd" stroke-width="3"/><path d="M500 252 L700 252" stroke="#e3edf2" stroke-width="5"/></g>`
    }),
    beach: () => ({ edge: ['#cfe8fb', '#ecd59d'],
      svg: sky('skyB', '#cfe8fb', '#eef7fd') + `<!--solo--><circle cx="680" cy="64" r="32" fill="#ffe082"/><!--/solo-->` +
        `<g data-place="sea"><rect y="170" width="800" height="110" fill="#79bfe3"/><rect y="170" width="800" height="16" fill="#a9d8f0"/><g data-p="waves" stroke="#d9f0fb" stroke-width="3" fill="none" opacity=".9" class="waves">${[0, 1, 2].map((r) => `<path d="M-40 ${205 + r * 24} q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0"/>`).join('')}</g></g>` +
        `<g data-place="beach"><path d="M0 268 Q200 252 400 262 T800 256 V400 H0Z" fill="#f3e2b6"/><path d="M0 268 Q200 252 400 262 T800 256" fill="none" stroke="#fff" stroke-width="5" opacity=".8"/><circle cx="120" cy="340" r="5" fill="#f0c9d4"/><circle cx="660" cy="360" r="4" fill="#fff"/></g>`,
      tick: (S, t) => { const w = S.svg.querySelector('.waves'); if (w) w.setAttribute('transform', `translate(${(Math.sin(t * 0.5) * 20).toFixed(1)},0)`); }
    }),
    sea: () => ({ edge: ['#cfe8fb', '#5aa7d2'],
      svg: sky('skyS', '#cfe8fb', '#eef7fd') + `<!--solo--><circle cx="680" cy="64" r="32" fill="#ffe082"/><!--/solo--><g data-place="sea"><rect y="170" width="800" height="230" fill="#6db6dc"/><rect y="170" width="800" height="16" fill="#a9d8f0"/></g>`,
      front: `<g data-place="sea"><path d="M0 296 Q50 286 100 296 T200 296 T300 296 T400 296 T500 296 T600 296 T700 296 T800 296 V400 H0Z" fill="#5aa7d2" opacity=".97" class="seafront"/></g>`,
      tick: (S, t) => { const w = S.svg.querySelector('.seafront'); if (w) w.setAttribute('transform', `translate(${(Math.sin(t * 0.8) * 16).toFixed(1)},${(Math.sin(t * 1.3) * 2).toFixed(1)})`); }
    }),
    night: () => ({ edge: ['#1d2654', '#34502f'],
      svg: sky('skyN', '#1d2654', '#3a4682') + `<g data-place="sky">${Array.from({ length: 28 }, (_, i) => `<circle class="tw" cx="${(i * 131) % 790 + 5}" cy="${(i * 53) % 190 + 10}" r="${(i % 3) + 1.2}" fill="#fff"/>`).join('')}</g>` +
        `<g data-place="garden"><path d="M0 280 Q200 250 420 266 T800 262 V400 H0Z" fill="#3f5a3a"/><path d="M0 310 Q240 296 440 306 T800 302 V400 H0Z" fill="#34502f"/></g>`,
      tick: (S, t) => { S.svg.querySelectorAll('.tw').forEach((s, i) => { if (i % 4 === Math.floor(t * 2) % 4) s.setAttribute('opacity', (0.5 + 0.5 * Math.sin(t * 3 + i)).toFixed(2)); }); }
    }),
    classroom: () => ({ edge: ['#fbf1d9', '#d6c09d'],
      mirror: false,
      svg: wallDefs + wall('#fbf1d9', '#e3cfa6', '#d6c09d') + `<g data-place="classroom"><rect x="200" y="50" width="400" height="160" rx="10" fill="#fff" stroke="#b07c50" stroke-width="10"/><text x="230" y="110" font-family="Quicksand, sans-serif" font-weight="700" font-size="34" fill="#4a89dc">Aa Bb Cc</text><text x="230" y="160" font-family="Quicksand, sans-serif" font-weight="700" font-size="30" fill="#e0795f">1 2 3 .  ?</text>` +
        `<g transform="translate(90,150)"><circle r="34" fill="#fff" stroke="#8a8f98" stroke-width="5"/><path d="M0 0 V-22 M0 0 L14 8" stroke="#2b2220" stroke-width="4" stroke-linecap="round"/></g>` +
        `<g transform="translate(700,120)">${['#e5484d', '#f5c542', '#4caf50', '#4a89dc'].map((c, i) => `<rect x="${-40 + i * 22}" y="0" width="18" height="60" rx="3" fill="${c}" transform="rotate(${-6 + i * 4})"/>`).join('')}</g></g>`
    }),
    pond: () => ({ edge: ['#d3ebfb', '#a6d790'],
      mirror: false,
      svg: sky('skyPo', '#d3ebfb', '#eef7fd') + `<path d="M-800 212 L0 220 Q200 190 400 210 T800 204 L1600 212 V300 H-800Z" fill="#b9dfa3"/>` +
        `<g data-place="garden"><rect x="-800" y="230" width="2400" height="170" fill="#a6d790"/></g>` +
        `<g data-place="pond"><ellipse cx="420" cy="320" rx="330" ry="66" fill="#79bfe3"/><ellipse cx="420" cy="316" rx="300" ry="54" fill="#8ccbe8"/><path d="M200 318 q30 -6 60 0 M540 300 q30 -6 60 0" stroke="#d9f0fb" stroke-width="3" fill="none"/></g>` +
        `<g>${[100, 116, 130, 700, 716].map((x, i) => `<path d="M${x} 300 Q${x - 4} ${250 - i * 6} ${x + 2} ${220 - i * 8}" stroke="#4f8a3f" stroke-width="4" fill="none"/><rect x="${x - 2}" y="${226 - i * 8}" width="7" height="22" rx="3.5" fill="#8d5f3b"/>`).join('')}</g>`,
      fx: (S) => { S.thing('lily', { x: 260, y: 330 }); S.thing('lily', { x: 590, y: 340, s: 0.8 }); clouds(S, [[200, 60, 0.7], [620, 80, 0.6]]); }
    }),
    snow: () => ({ edge: ['#dde8f2', '#ffffff'],
      svg: sky('skySn', '#dde8f2', '#f1f6fa') + `<path d="M0 230 Q200 200 400 222 T800 214 V300 H0Z" fill="#eef3f8"/>` +
        `<g data-place="snow"><path d="M0 262 Q200 248 400 258 T800 252 V400 H0Z" fill="#ffffff"/><path d="M0 262 Q200 248 400 258 T800 252" fill="none" stroke="#dbe6f0" stroke-width="3"/></g>` +
        `<g transform="translate(110,262)"><path d="M-8 0 V-30" stroke="#8d5f3b" stroke-width="8"/><path d="M-60 -30 L0 -150 L60 -30Z" fill="#5f8f6b"/><path d="M-40 -70 L0 -150 L40 -70 Q20 -80 0 -72 Q-20 -80 -40 -70Z" fill="#fff"/><path d="M-60 -30 Q-30 -40 0 -32 Q30 -40 60 -30 L50 -46 Q0 -56 -50 -46Z" fill="#fff"/></g>`,
      fx: (S) => S.emit('snow', { x: 400, y: -10, w: 800, rate: 4, p: { vy: 40, life: 9, sway: 18, fade: 0.2 } })
    }),
    rain: () => ({ edge: ['#9eabb9', '#7f9f78'],
      svg: sky('skyR', '#9eabb9', '#c9d3dc') + `<path d="M0 230 Q200 210 400 224 T800 220 V300 H0Z" fill="#8fae86"/>` +
        `<g data-place="rain"><path d="M0 256 Q200 246 400 254 T800 250 V400 H0Z" fill="#7f9f78"/></g>` +
        `<g transform="translate(680,256)"><rect x="-50" y="-110" width="100" height="110" fill="#d7c8b6"/><path d="M-62 -110 L0 -160 L62 -110Z" fill="#a0605a"/><rect x="-14" y="-50" width="28" height="50" fill="#7a5038"/><rect x="-38" y="-94" width="24" height="24" fill="#cfe8fb"/><rect x="14" y="-94" width="24" height="24" fill="#cfe8fb"/></g>`,
      fx: (S) => { S.thing('raincloud', { x: 200, y: 50, s: 1, floor: 360 }); S.thing('raincloud', { x: 560, y: 40, s: 0.9, floor: 360 }); }
    }),
    forest: () => ({ edge: ['#f6dcc0', '#b98d55'],
      svg: sky('skyF', '#f6dcc0', '#fbeee0') +
        `<g data-place="forest"><path d="M0 250 Q200 232 400 246 T800 240 V400 H0Z" fill="#c9a26a"/><path d="M0 290 Q240 278 440 288 T800 284 V400 H0Z" fill="#b98d55"/>${Array.from({ length: 12 }, (_, i) => `<path d="M${(i * 71) % 800} ${300 + (i * 29) % 80} q8 -6 14 0 q-6 6 -14 0Z" fill="${['#e4893a', '#d9622b', '#e9b33d'][i % 3]}"/>`).join('')}</g>`,
      fx: (S) => { S.thing('tree', { x: 110, y: 262, s: 1, autumn: true }); S.thing('tree', { x: 700, y: 256, s: 0.9, autumn: true }); S.emit('leaf', { x: 400, y: -10, w: 700, rate: 1.4, p: { vy: 34, vr: 60, life: 10, sway: 26, fade: 0.2 } }); }
    }),
    space: () => ({ edge: ['#141c44', '#141c44'],
      svg: `<rect width="800" height="400" fill="#141c44"/><rect width="800" height="400" fill="url(#spg)"/><defs><radialGradient id="spg" cx=".3" cy=".3" r=".9"><stop offset="0" stop-color="#2a3a7a"/><stop offset="1" stop-color="#141c44"/></radialGradient></defs>` +
        `<g data-place="space">${Array.from({ length: 40 }, (_, i) => `<circle class="tw" cx="${(i * 137) % 790 + 5}" cy="${(i * 71) % 390 + 5}" r="${(i % 3) * 0.7 + 1}" fill="#fff"/>`).join('')}</g>`,
      tick: (S, t) => { S.svg.querySelectorAll('.tw').forEach((s, i) => { if (i % 5 === Math.floor(t * 2) % 5) s.setAttribute('opacity', (0.5 + 0.5 * Math.sin(t * 3 + i)).toFixed(2)); }); }
    }),
    sky: () => ({ edge: ['#bfe2fb', '#a6d790'],
      svg: sky('skyK', '#bfe2fb', '#eaf6fd') + `<g data-place="sky"><rect width="800" height="300" fill="transparent"/></g><path d="M0 330 Q200 316 400 326 T800 320 V400 H0Z" fill="#a6d790"/>`,
      fx: (S) => clouds(S, [[160, 90, 0.8], [620, 130, 0.7]])
    }),
    plain: () => ({ edge: ['#f6f1e7', '#f6f1e7'], mirror: false, svg: `<rect x="-800" width="2400" height="400" fill="#f6f1e7"/><ellipse cx="400" cy="340" rx="300" ry="24" fill="#ebe2d2"/>` })
  };

  window.SB_THINGS = { held, hats, things, bgs };
})();
