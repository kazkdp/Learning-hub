/* Patterns – the drawn pieces and pictures (art.js).
   Everything is SVG drawn from code, so it looks the same on every device
   and nothing has to download. window.PArt is used by scenes.js and game.js.

   A "token" is one piece in a puzzle, a plain object such as
     { theme: 'fruit', id: 'apple' }            a drawn piece
     { theme: 'num', v: 12 }                    a number on a stone
     { theme: 'size', base: tok, s: 0|1|2 }     a piece small / middle / big
     { theme: 'bead', id: 'round' }             a bead
     { theme: 'tile', col, motif, rot }         a garden tile
     { theme: 'turn', g: 'arrow', deg }         something that turns
     { theme: 'flip', g: 'boot', flip, deg }    something that flips
     { theme: 'm', shape, col, count, fill }    a shape for the puzzle grids
   PArt.key(tok) gives a string that is the same for two tokens that look the same. */
(function () {
  'use strict';

  /* ---------- colours: [light, middle, dark] ---------- */
  const C = {
    red:    ['#F39A90', '#D9564F', '#B13D37'],
    blue:   ['#A4C6EE', '#4F82C2', '#36629E'],
    yellow: ['#FFE6A0', '#F2C24F', '#D4A12B'],
    green:  ['#AEDCA8', '#5DAB6B', '#418A51'],
    purple: ['#CDB8F0', '#9070C6', '#6E51A4'],
    orange: ['#FFCB9C', '#EE913F', '#C77023'],
    pink:   ['#F9C6DC', '#E485AB', '#C16089'],
    brown:  ['#DDB495', '#A57452', '#7B5339'],
    grey:   ['#DCE1E8', '#A1AAB8', '#737D8D'],
    white:  ['#FFFFFF', '#F4EFE7', '#D3C9B8'],
    black:  ['#868C9C', '#4B5160', '#2E323C'],
    teal:   ['#A6DDD5', '#44A99C', '#2D8075'],
    sky:    ['#E1F1FC', '#A9D2F1', '#73ABDB'],
    gold:   ['#FFEAAA', '#F4C452', '#D6A12A'],
    amber:  ['#FFD58A', '#F3A63A', '#C98120'],
    peach:  ['#FFE3D0', '#F5B58E', '#D68C63'],
    moon:   ['#FFF7DA', '#F2DE9C', '#CBAE62'],
    cream:  ['#FFFEFA', '#FBF4E6', '#E3D5BC'],
  };
  const fill = c => `url(#pg-${c})`;
  const dark = c => C[c][2];
  const n = x => { let s = (Math.round(x * 10) / 10).toString(); return s === '-0' ? '0' : s; };
  const hl = (x, y, rx, ry, rot = -30, op = 0.45) =>
    `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#FFFFFF" opacity="${op}" transform="rotate(${rot} ${x} ${y})"/>`;
  function starPts(ro, ri, cx = 0, cy = 0, k = 5, rot = -90) {
    const out = [];
    for (let i = 0; i < 2 * k; i++) {
      const r = i % 2 ? ri : ro, a = (rot + i * 180 / k) * Math.PI / 180;
      out.push(n(cx + r * Math.cos(a)) + ',' + n(cy + r * Math.sin(a)));
    }
    return out.join(' ');
  }

  /* ---------- the shared <defs>: gradients, a mask and a clip ---------- */
  function defs() {
    let g = '';
    for (const k in C) {
      const [a, b, c] = C[k];
      g += `<radialGradient id="pg-${k}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="${a}"/>` +
        `<stop offset=".55" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></radialGradient>`;
    }
    g += '<linearGradient id="pg-shade" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".32"/>' +
      '<stop offset=".5" stop-color="#FFFFFF" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity=".1"/></linearGradient>';
    g += '<mask id="pm-moon" maskUnits="userSpaceOnUse" x="-50" y="-50" width="100" height="100">' +
      '<rect x="-50" y="-50" width="100" height="100" fill="#FFFFFF"/><circle cx="14" cy="-10" r="26" fill="#000000"/></mask>';
    g += '<clipPath id="pc-flag"><rect x="-40" y="-27" width="80" height="54" rx="6"/></clipPath>';
    return `<svg width="0" height="0" style="position:absolute;width:0;height:0" aria-hidden="true" focusable="false"><defs>${g}</defs></svg>`;
  }

  /* ---------- the pieces, theme by theme ---------- */
  const ball = c => `<circle r="33" fill="${fill(c)}" stroke="${dark(c)}" stroke-width="3"/>${hl(-12, -14, 11, 7)}`;

  const SHAPE = {
    circle: c => `<circle r="33" fill="${fill(c)}" stroke="${dark(c)}" stroke-width="3"/>${hl(-12, -14, 10, 6)}`,
    square: c => `<rect x="-30" y="-30" width="60" height="60" rx="9" fill="${fill(c)}" stroke="${dark(c)}" stroke-width="3"/>${hl(-14, -16, 10, 5)}`,
    triangle: c => `<path d="M0 -34L35 28H-35Z" fill="${fill(c)}" stroke="${dark(c)}" stroke-width="3" stroke-linejoin="round"/>${hl(-6, -4, 6, 10, 25)}`,
    star: c => `<polygon points="${starPts(37, 16, 0, 3)}" fill="${fill(c)}" stroke="${dark(c)}" stroke-width="3" stroke-linejoin="round"/>${hl(-7, -6, 6, 4)}`,
    heart: c => `<path d="M0 32C-42 6 -38 -30 -15 -30C-5 -30 0 -22 0 -15C0 -22 5 -30 15 -30C38 -30 42 6 0 32Z" fill="${fill(c)}" stroke="${dark(c)}" stroke-width="3" stroke-linejoin="round"/>${hl(-16, -14, 8, 5)}`,
    diamond: c => `<path d="M0 -37L29 0L0 37L-29 0Z" fill="${fill(c)}" stroke="${dark(c)}" stroke-width="3" stroke-linejoin="round"/>${hl(-8, -12, 5, 9, 35)}`,
    oval: c => `<ellipse rx="22" ry="34" fill="${fill(c)}" stroke="${dark(c)}" stroke-width="3"/>${hl(-8, -14, 6, 9, 20)}`,
    flower: c => {
      let p = '';
      for (let i = 0; i < 5; i++) {
        const a = (-90 + i * 72) * Math.PI / 180;
        p += `<circle cx="${n(18 * Math.cos(a))}" cy="${n(18 * Math.sin(a))}" r="14" fill="${fill(c)}" stroke="${dark(c)}" stroke-width="2.5"/>`;
      }
      return p + `<circle r="11" fill="${fill('gold')}" stroke="${dark('gold')}" stroke-width="2.5"/>`;
    },
  };

  const FRUIT = {
    apple: `<g transform="translate(0 5)"><path d="M0 -22C-10 -31 -34 -27 -34 0C-34 22 -18 34 -7 32C-3 31 3 31 7 32C18 34 34 22 34 0C34 -27 10 -31 0 -22Z" fill="${fill('red')}" stroke="${dark('red')}" stroke-width="3" stroke-linejoin="round"/>${hl(-16, -6, 6, 11, 20, 0.4)}` +
      `<path d="M0 -22C0 -30 2 -36 7 -41" fill="none" stroke="#6B4A2B" stroke-width="4" stroke-linecap="round"/>` +
      `<path d="M5 -32C13 -45 29 -43 33 -36C26 -28 13 -27 5 -32Z" fill="${fill('green')}" stroke="${dark('green')}" stroke-width="2" stroke-linejoin="round"/></g>`,
    banana: `<g transform="translate(0 7)"><path d="M-34 -14C-24 14 16 24 36 -20Q2 6 -28 -18Z" fill="${fill('yellow')}" stroke="${dark('yellow')}" stroke-width="3" stroke-linejoin="round"/>` +
      `<path d="M-24 -8C-12 6 10 9 26 -8" fill="none" stroke="#FFF6CF" stroke-width="3" stroke-linecap="round" opacity=".8"/>` +
      `<circle cx="-32" cy="-16" r="3.5" fill="#6B4A2B"/><path d="M34 -19L41 -27" stroke="#6B4A2B" stroke-width="5" stroke-linecap="round"/></g>`,
    pear: `<g transform="translate(0 2)"><path d="M0 -26C9 -26 12 -17 12 -11C12 -3 27 3 27 16C27 30 15 37 0 37C-15 37 -27 30 -27 16C-27 3 -12 -3 -12 -11C-12 -17 -9 -26 0 -26Z" fill="${fill('green')}" stroke="${dark('green')}" stroke-width="3" stroke-linejoin="round"/>${hl(-14, 14, 6, 10, 15, 0.38)}` +
      `<path d="M0 -26C0 -32 2 -36 5 -40" fill="none" stroke="#6B4A2B" stroke-width="4" stroke-linecap="round"/>` +
      `<path d="M3 -33C10 -42 22 -40 24 -35C18 -29 9 -29 3 -33Z" fill="${fill('green')}" stroke="${dark('green')}" stroke-width="2" stroke-linejoin="round"/></g>`,
    orange: `<g transform="translate(0 3)"><circle r="32" fill="${fill('orange')}" stroke="${dark('orange')}" stroke-width="3"/>${hl(-12, -12, 10, 6)}` +
      ['8,6', '-6,14', '16,-8', '-16,4', '4,22', '20,12', '-2,-4'].map(p => { const [x, y] = p.split(','); return `<circle cx="${x}" cy="${y}" r="1.7" fill="${dark('orange')}" opacity=".45"/>`; }).join('') +
      `<path d="M2 -30C8 -40 20 -40 22 -34C16 -28 8 -28 2 -30Z" fill="${fill('green')}" stroke="${dark('green')}" stroke-width="2" stroke-linejoin="round"/><circle cy="-31" r="3" fill="#6B8E3A"/></g>`,
    grapes: (() => {
      let g = '<g transform="translate(0 -6)"><path d="M0 -21C0 -29 4 -33 9 -36" fill="none" stroke="#6B4A2B" stroke-width="4" stroke-linecap="round"/>' +
        `<path d="M5 -30C12 -40 24 -38 26 -33C20 -27 11 -27 5 -30Z" fill="${fill('green')}" stroke="${dark('green')}" stroke-width="2" stroke-linejoin="round"/>`;
      [[-21, -11], [-7, -11], [7, -11], [21, -11], [-14, 5], [0, 5], [14, 5], [-7, 20], [7, 20], [0, 34]].forEach(([x, y]) => {
        g += `<circle cx="${x}" cy="${y}" r="10.5" fill="${fill('purple')}" stroke="${dark('purple')}" stroke-width="2"/><circle cx="${x - 3}" cy="${y - 3.5}" r="2.6" fill="#FFFFFF" opacity=".5"/>`;
      });
      return g + '</g>';
    })(),
    strawberry: (() => {
      let g = `<g transform="translate(0 4)"><path d="M0 34C-22 22 -32 2 -28 -12C-25 -24 -11 -26 0 -21C11 -26 25 -24 28 -12C32 2 22 22 0 34Z" fill="${fill('red')}" stroke="${dark('red')}" stroke-width="3" stroke-linejoin="round"/>`;
      [[-14, -8], [0, -10], [14, -8], [-20, 4], [-7, 2], [7, 2], [20, 4], [-12, 14], [0, 13], [12, 14], [-5, 24], [5, 24]].forEach(([x, y]) => {
        g += `<ellipse cx="${x}" cy="${y}" rx="1.7" ry="2.6" fill="#FFE9A6"/>`;
      });
      [[-10, -25, -25], [10, -25, 25], [-4, -29, -65], [4, -29, 65]].forEach(([x, y, r]) => {
        g += `<ellipse cx="${x}" cy="${y}" rx="10" ry="4.5" fill="${fill('green')}" stroke="${dark('green')}" stroke-width="1.5" transform="rotate(${r} ${x} ${y})"/>`;
      });
      return g + '<path d="M0 -27L1 -36" stroke="#6B8E3A" stroke-width="3.5" stroke-linecap="round"/></g>';
    })(),
  };

  const EYE = (x, y, r = 4) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#2E323C"/><circle cx="${n(x + r * 0.35)}" cy="${n(y - r * 0.35)}" r="${n(r * 0.36)}" fill="#FFFFFF"/>`;
  const CHEEK = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="5" ry="3" fill="#F2A1A8" opacity=".65"/>`;
  const ANIMALS = {
    cat: `<g transform="translate(0 4)"><path d="M-29 -10L-25 -40L-6 -24Z" fill="${fill('orange')}" stroke="${dark('orange')}" stroke-width="3" stroke-linejoin="round"/>` +
      `<path d="M29 -10L25 -40L6 -24Z" fill="${fill('orange')}" stroke="${dark('orange')}" stroke-width="3" stroke-linejoin="round"/>` +
      `<path d="M-23 -16L-21 -31L-12 -23Z" fill="#F7B9C4"/><path d="M23 -16L21 -31L12 -23Z" fill="#F7B9C4"/>` +
      `<ellipse cy="4" rx="31" ry="27" fill="${fill('orange')}" stroke="${dark('orange')}" stroke-width="3"/>` +
      `<path d="M-6 -20L-4 -11M0 -22V-12M6 -20L4 -11" stroke="${dark('orange')}" stroke-width="2.5" stroke-linecap="round"/>` +
      `<ellipse cy="14" rx="13" ry="9" fill="#FFF4E6"/>${EYE(-11, 0, 4.4)}${EYE(11, 0, 4.4)}` +
      `<path d="M-4 9H4L0 14Z" fill="#E485AB" stroke="#E485AB" stroke-width="1.5" stroke-linejoin="round"/>` +
      `<path d="M0 14Q-5 19 -9 16M0 14Q5 19 9 16" fill="none" stroke="#7B5339" stroke-width="2" stroke-linecap="round"/>` +
      `<path d="M-13 13L-31 9M-13 16L-30 18M13 13L31 9M13 16L30 18" stroke="#7B5339" stroke-width="1.6" stroke-linecap="round" opacity=".6"/></g>`,
    dog: `<g transform="translate(0 2)"><ellipse cx="-25" cy="-2" rx="10" ry="21" fill="${dark('brown')}" transform="rotate(16 -25 -2)"/>` +
      `<ellipse cx="25" cy="-2" rx="10" ry="21" fill="${dark('brown')}" transform="rotate(-16 25 -2)"/>` +
      `<ellipse rx="26" ry="28" fill="${fill('brown')}" stroke="${dark('brown')}" stroke-width="3"/>` +
      `<ellipse cx="10" cy="-8" rx="9" ry="8" fill="${dark('brown')}" opacity=".45"/>` +
      `<ellipse cy="13" rx="14" ry="11" fill="#F6E7D6"/>${EYE(-10, -6, 4.2)}${EYE(10, -6, 4.2)}` +
      `<ellipse cy="7" rx="6.5" ry="4.5" fill="#2E323C"/><path d="M0 11Q0 18 -6 19M0 11Q0 18 6 19" fill="none" stroke="#2E323C" stroke-width="2" stroke-linecap="round"/></g>`,
    rabbit: `<g transform="translate(0 7)"><ellipse cx="-11" cy="-31" rx="8.5" ry="20" fill="${fill('white')}" stroke="${dark('grey')}" stroke-width="2.5" transform="rotate(-10 -11 -31)"/>` +
      `<ellipse cx="11" cy="-31" rx="8.5" ry="20" fill="${fill('white')}" stroke="${dark('grey')}" stroke-width="2.5" transform="rotate(10 11 -31)"/>` +
      `<ellipse cx="-11" cy="-30" rx="3.8" ry="13" fill="#F7B9C4" transform="rotate(-10 -11 -30)"/><ellipse cx="11" cy="-30" rx="3.8" ry="13" fill="#F7B9C4" transform="rotate(10 11 -30)"/>` +
      `<circle cy="8" r="25" fill="${fill('white')}" stroke="${dark('grey')}" stroke-width="2.5"/>${CHEEK(-14, 14)}${CHEEK(14, 14)}` +
      `${EYE(-9, 3, 3.8)}${EYE(9, 3, 3.8)}<ellipse cy="12" rx="3.6" ry="2.6" fill="#E485AB"/>` +
      `<path d="M0 14Q-4 19 -8 17M0 14Q4 19 8 17" fill="none" stroke="#7B5339" stroke-width="2" stroke-linecap="round"/>` +
      `<rect x="-3" y="17" width="6" height="5" rx="1" fill="#FFFFFF" stroke="${dark('grey')}" stroke-width="1.2"/></g>`,
    frog: `<g transform="translate(0 2)"><circle cx="-14" cy="-13" r="12" fill="${fill('green')}" stroke="${dark('green')}" stroke-width="3"/>` +
      `<circle cx="14" cy="-13" r="12" fill="${fill('green')}" stroke="${dark('green')}" stroke-width="3"/>` +
      `<ellipse cy="8" rx="33" ry="23" fill="${fill('green')}" stroke="${dark('green')}" stroke-width="3"/>` +
      `<circle cx="-14" cy="-13" r="8" fill="#FFFFFF"/><circle cx="14" cy="-13" r="8" fill="#FFFFFF"/>${EYE(-13, -12, 4.3)}${EYE(15, -12, 4.3)}` +
      `<path d="M-15 14Q0 25 15 14" fill="none" stroke="${dark('green')}" stroke-width="3" stroke-linecap="round"/>` +
      `<circle cx="-4" cy="4" r="1.6" fill="${dark('green')}"/><circle cx="4" cy="4" r="1.6" fill="${dark('green')}"/>${CHEEK(-22, 12)}${CHEEK(22, 12)}</g>`,
    pig: `<g transform="translate(0 3)"><path d="M-26 -8L-25 -33L-8 -21Z" fill="${fill('pink')}" stroke="${dark('pink')}" stroke-width="3" stroke-linejoin="round"/>` +
      `<path d="M26 -8L25 -33L8 -21Z" fill="${fill('pink')}" stroke="${dark('pink')}" stroke-width="3" stroke-linejoin="round"/>` +
      `<circle cy="4" r="28" fill="${fill('pink')}" stroke="${dark('pink')}" stroke-width="3"/>${EYE(-11, -5, 3.8)}${EYE(11, -5, 3.8)}` +
      `<ellipse cy="11" rx="12.5" ry="9" fill="#F6A9C8" stroke="${dark('pink')}" stroke-width="2"/>` +
      `<ellipse cx="-4.5" cy="11" rx="2.3" ry="3.4" fill="#A8466F"/><ellipse cx="4.5" cy="11" rx="2.3" ry="3.4" fill="#A8466F"/>` +
      `<path d="M-6 23Q0 27 6 23" fill="none" stroke="${dark('pink')}" stroke-width="2" stroke-linecap="round"/></g>`,
    chick: `<g transform="translate(0 2)"><path d="M-3 -24Q-3 -34 4 -33M2 -24Q6 -36 12 -30" fill="none" stroke="${dark('yellow')}" stroke-width="3" stroke-linecap="round"/>` +
      `<ellipse cx="-27" cy="10" rx="8" ry="13" fill="${dark('yellow')}" transform="rotate(22 -27 10)"/><ellipse cx="27" cy="10" rx="8" ry="13" fill="${dark('yellow')}" transform="rotate(-22 27 10)"/>` +
      `<circle cy="6" r="28" fill="${fill('yellow')}" stroke="${dark('yellow')}" stroke-width="3"/>${hl(-12, -8, 9, 5)}${EYE(-10, 0, 4)}${EYE(10, 0, 4)}` +
      `<path d="M-7 7L0 2L7 7L0 14Z" fill="${fill('orange')}" stroke="${dark('orange')}" stroke-width="1.6" stroke-linejoin="round"/><path d="M-7 7H7" stroke="${dark('orange')}" stroke-width="1.4"/>` +
      `${CHEEK(-17, 9)}${CHEEK(17, 9)}<path d="M-9 34V38M9 34V38" stroke="${dark('orange')}" stroke-width="3.5" stroke-linecap="round"/></g>`,
  };

  const WEATHER = {
    sun: (() => {
      let g = '';
      for (let i = 0; i < 8; i++) g += `<rect x="-4" y="-41" width="8" height="14" rx="4" fill="${fill('amber')}" transform="rotate(${i * 45})"/>`;
      return g + `<circle r="22" fill="${fill('gold')}" stroke="${dark('gold')}" stroke-width="3"/>${hl(-8, -9, 7, 4.5)}`;
    })(),
    cloud: (() => {
      const shapes = '<circle cx="-16" cy="5" r="16"/><circle cx="4" cy="-6" r="21"/><circle cx="22" cy="6" r="14"/><rect x="-32" y="5" width="60" height="18" rx="9"/>';
      return `<g transform="translate(0 2)"><g fill="#AEB9C9" stroke="#AEB9C9" stroke-width="6">${shapes}</g><g fill="#F7F9FC">${shapes}</g>` +
        '<path d="M-28 16H26" stroke="#E3E9F2" stroke-width="7" stroke-linecap="round"/>' + hl(-6, -14, 9, 5, -20, 0.8) + '</g>';
    })(),
    raindrop: `<g transform="translate(0 1)"><path d="M0 -34C12 -18 26 -4 26 12C26 27 14 36 0 36C-14 36 -26 27 -26 12C-26 -4 -12 -18 0 -34Z" fill="${fill('blue')}" stroke="${dark('blue')}" stroke-width="3" stroke-linejoin="round"/>${hl(-10, 10, 5, 9, 20, 0.45)}</g>`,
    snowflake: (() => {
      let g = '<g stroke="#79AEE0" stroke-width="5" stroke-linecap="round" fill="none">';
      for (let i = 0; i < 6; i++) g += `<g transform="rotate(${i * 60})"><path d="M0 0V-33M0 -19L-9 -27M0 -19L9 -27"/></g>`;
      return g + '</g><circle r="6" fill="#D6EAFB" stroke="#79AEE0" stroke-width="3"/>';
    })(),
    lightning: `<path d="M7 -37L-19 5H-2L-11 37L21 -8H4L13 -37Z" fill="${fill('amber')}" stroke="${dark('amber')}" stroke-width="3" stroke-linejoin="round"/>${hl(2, -20, 3, 7, 30, 0.5)}`,
    rainbow: (() => {
      let g = '<g transform="translate(0 -4)" fill="none" stroke-linecap="round">';
      [[34, '#E06A5E'], [27, '#F2C24F'], [20, '#5DAB6B'], [13, '#4F82C2']].forEach(([r, c]) => { g += `<path d="M${-r} 18A${r} ${r} 0 0 1 ${r} 18" stroke="${c}" stroke-width="7.5"/>`; });
      g += '</g><g fill="#F7F9FC" stroke="#C3CCD9" stroke-width="2"><circle cx="-31" cy="18" r="8"/><circle cx="-21" cy="20" r="7"/><circle cx="21" cy="20" r="7"/><circle cx="31" cy="18" r="8"/></g>';
      return g + '<g fill="#F7F9FC"><rect x="-36" y="17" width="20" height="9" rx="4.5"/><rect x="16" y="17" width="20" height="9" rx="4.5"/></g>';
    })(),
  };

  const SPACE = {
    planet: `<ellipse rx="41" ry="11" fill="none" stroke="#E5C77F" stroke-width="5" transform="rotate(-18)"/>` +
      `<circle r="23" fill="${fill('purple')}" stroke="${dark('purple')}" stroke-width="3"/>` +
      `<path d="M-20 -8C-8 -4 8 -12 21 -6" fill="none" stroke="#FFFFFF" stroke-width="3" opacity=".35" stroke-linecap="round"/>${hl(-9, -11, 6, 4)}` +
      `<path d="M38 -12.4A41 11 -18 0 1 -38 12.4" fill="none" stroke="#E5C77F" stroke-width="5" stroke-linecap="round"/>`,
    moon: `<g transform="translate(-4 0)"><circle r="32" fill="${fill('moon')}" stroke="${dark('moon')}" stroke-width="3" mask="url(#pm-moon)"/>` +
      `<circle cx="-16" cy="8" r="4" fill="${dark('moon')}" opacity=".35"/><circle cx="-8" cy="22" r="3" fill="${dark('moon')}" opacity=".35"/>${hl(-18, -10, 4, 8, 20, 0.5)}</g>`,
    star: `<polygon points="${starPts(37, 16, 0, 3)}" fill="${fill('gold')}" stroke="${dark('gold')}" stroke-width="3" stroke-linejoin="round"/>${hl(-7, -6, 6, 4)}`,
    rocket: `<path d="M-8 14Q0 42 8 14Z" fill="${fill('amber')}"/>` +
      `<path d="M-14 0L-27 19L-14 17Z" fill="${fill('red')}" stroke="${dark('red')}" stroke-width="2" stroke-linejoin="round"/><path d="M14 0L27 19L14 17Z" fill="${fill('red')}" stroke="${dark('red')}" stroke-width="2" stroke-linejoin="round"/>` +
      `<path d="M0 -39C12 -27 16 -8 14 16H-14C-16 -8 -12 -27 0 -39Z" fill="${fill('white')}" stroke="${dark('grey')}" stroke-width="3" stroke-linejoin="round"/>` +
      `<path d="M0 -39C7 -32 10 -25 11 -20H-11C-10 -25 -7 -32 0 -39Z" fill="${fill('red')}"/>` +
      `<circle cy="-4" r="7" fill="${fill('sky')}" stroke="${dark('grey')}" stroke-width="3"/>`,
    earth: `<circle r="32" fill="${fill('blue')}" stroke="${dark('blue')}" stroke-width="3"/>` +
      `<path d="M-20 -18C-8 -26 4 -20 2 -10C0 -2 -10 -2 -14 6C-18 12 -27 6 -27 -4C-27 -10 -24 -15 -20 -18Z" fill="${fill('green')}"/>` +
      `<path d="M8 8C16 2 26 6 25 14C23 22 16 26 10 22C6 18 4 12 8 8Z" fill="${fill('green')}"/><path d="M12 -24C18 -24 22 -20 20 -16C16 -16 12 -19 12 -24Z" fill="${fill('green')}"/>${hl(-12, -14, 9, 5, -30, 0.35)}`,
    ufo: `<ellipse cy="-6" rx="16" ry="15" fill="${fill('sky')}" stroke="${dark('grey')}" stroke-width="2.5"/>${hl(-6, -12, 4, 6, 30, 0.6)}` +
      `<ellipse cy="7" rx="39" ry="12" fill="${fill('grey')}" stroke="${dark('grey')}" stroke-width="3"/><ellipse cy="13" rx="18" ry="5" fill="${dark('grey')}" opacity=".5"/>` +
      `<circle cx="-20" cy="8" r="3.6" fill="${C.gold[1]}"/><circle cy="10" r="3.6" fill="${C.gold[1]}"/><circle cx="20" cy="8" r="3.6" fill="${C.gold[1]}"/>`,
  };

  const TRANSPORT = {
    car: `<g transform="translate(0 3) scale(1.08)"><path d="M-38 10V-2C-38 -6 -34 -8 -30 -8H-18L-8 -22H16L26 -8H32C36 -8 38 -4 38 0V10Z" fill="${fill('red')}" stroke="${dark('red')}" stroke-width="3" stroke-linejoin="round"/>` +
      `<path d="M-14 -9L-6 -19H4V-9Z" fill="${fill('sky')}" stroke="${dark('red')}" stroke-width="2" stroke-linejoin="round"/><path d="M8 -9V-19H14L21 -9Z" fill="${fill('sky')}" stroke="${dark('red')}" stroke-width="2" stroke-linejoin="round"/>` +
      `<circle cx="-22" cy="12" r="9" fill="#3A3F4B"/><circle cx="-22" cy="12" r="3.5" fill="#C9CED8"/><circle cx="22" cy="12" r="9" fill="#3A3F4B"/><circle cx="22" cy="12" r="3.5" fill="#C9CED8"/>` +
      `<rect x="33" y="-4" width="5" height="4" rx="1.5" fill="#FFE6A0"/></g>`,
    bus: `<g transform="translate(0 -1)"><rect x="-40" y="-24" width="80" height="40" rx="8" fill="${fill('gold')}" stroke="${dark('gold')}" stroke-width="3"/>` +
      [-34, -16, 2, 20].map(x => `<rect x="${x}" y="-18" width="14" height="13" rx="3" fill="${fill('sky')}" stroke="${dark('gold')}" stroke-width="2"/>`).join('') +
      `<rect x="-40" y="4" width="80" height="4" fill="${C.amber[1]}"/>` +
      `<circle cx="-24" cy="17" r="8" fill="#3A3F4B"/><circle cx="-24" cy="17" r="3" fill="#C9CED8"/><circle cx="24" cy="17" r="8" fill="#3A3F4B"/><circle cx="24" cy="17" r="3" fill="#C9CED8"/></g>`,
    boat: `<g transform="translate(0 2)"><path d="M0 12V-36" stroke="#7B5339" stroke-width="3" stroke-linecap="round"/>` +
      `<path d="M3 -34V6H31Z" fill="${fill('white')}" stroke="${dark('grey')}" stroke-width="2.5" stroke-linejoin="round"/><path d="M-3 -27V6H-25Z" fill="#F7EEDC" stroke="${dark('grey')}" stroke-width="2.5" stroke-linejoin="round"/>` +
      `<path d="M0 -36H-10L-6 -32L-10 -28H0" fill="${C.red[1]}"/>` +
      `<path d="M-37 11H37L26 28H-26Z" fill="${fill('blue')}" stroke="${dark('blue')}" stroke-width="3" stroke-linejoin="round"/><path d="M-30 17H30" stroke="#FFFFFF" stroke-width="2.5" opacity=".5"/></g>`,
    plane: `<path d="M-34 -6L-42 -26H-34L-24 -8Z" fill="${fill('blue')}" stroke="${dark('blue')}" stroke-width="2" stroke-linejoin="round"/>` +
      `<path d="M-4 -2L-20 -31H-10L14 -2Z" fill="${fill('blue')}" stroke="${dark('blue')}" stroke-width="2" stroke-linejoin="round"/>` +
      `<path d="M-40 0C-40 -8 -30 -10 -18 -10H26C36 -10 42 -4 42 0C42 4 36 8 26 8H-18C-30 8 -40 6 -40 0Z" fill="${fill('white')}" stroke="${dark('grey')}" stroke-width="3"/>` +
      `<path d="M30 -8C34 -8 38 -5 39 -2H30Z" fill="${fill('sky')}"/>` +
      [-12, -4, 4, 12, 20].map(x => `<circle cx="${x}" cy="-2" r="2.6" fill="${C.sky[2]}"/>`).join('') +
      `<path d="M-4 4L-14 27H-6L12 4Z" fill="${fill('blue')}" stroke="${dark('blue')}" stroke-width="2" stroke-linejoin="round"/>`,
    balloon: `<path d="M-7 22L-6 31M7 22L6 31" stroke="#7B5339" stroke-width="2"/>` +
      `<path d="M0 -40C24 -40 34 -22 30 -6C26 8 12 16 8 22H-8C-12 16 -26 8 -30 -6C-34 -22 -24 -40 0 -40Z" fill="${fill('red')}" stroke="${dark('red')}" stroke-width="3" stroke-linejoin="round"/>` +
      `<path d="M0 -40C10 -36 12 -10 4 22H-4C-12 -10 -10 -36 0 -40Z" fill="${fill('gold')}"/>${hl(-16, -20, 6, 10, 20, 0.35)}` +
      `<rect x="-8" y="30" width="16" height="10" rx="2.5" fill="${fill('brown')}" stroke="${dark('brown')}" stroke-width="2"/>`,
    bike: `<g transform="translate(0 -3)" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="-20" cy="14" r="14" stroke="#3A3F4B" stroke-width="4"/><circle cx="20" cy="14" r="14" stroke="#3A3F4B" stroke-width="4"/>` +
      `<path d="M-20 14H-4L8 -6H-12ZM8 -6L20 14M-12 -6L-14 -13M8 -6L6 -17" stroke="${C.blue[1]}" stroke-width="4.5"/>` +
      `<path d="M-20 -13H-8M2 -18H11" stroke="#3A3F4B" stroke-width="4.5"/><circle cx="-20" cy="14" r="2.5" fill="#3A3F4B" stroke="none"/><circle cx="20" cy="14" r="2.5" fill="#3A3F4B" stroke="none"/></g>`,
  };

  const FLAG_FRAME = '<rect x="-40" y="-27" width="80" height="54" rx="6" fill="url(#pg-shade)"/><rect x="-40" y="-27" width="80" height="54" rx="6" fill="none" stroke="#2E323C" stroke-opacity=".22" stroke-width="2"/>';
  const flag = inner => `<g clip-path="url(#pc-flag)">${inner}</g>${FLAG_FRAME}`;
  const FLAGS = {
    uk: flag('<rect x="-40" y="-27" width="80" height="54" fill="#27428C"/>' +
      '<path d="M-40 -27L40 27M-40 27L40 -27" stroke="#FFFFFF" stroke-width="11"/><path d="M-40 -27L40 27M-40 27L40 -27" stroke="#C9283A" stroke-width="4"/>' +
      '<path d="M0 -27V27M-40 0H40" stroke="#FFFFFF" stroke-width="18"/><path d="M0 -27V27M-40 0H40" stroke="#C9283A" stroke-width="10"/>'),
    france: flag('<rect x="-40" y="-27" width="27" height="54" fill="#2B4C9A"/><rect x="-13" y="-27" width="26" height="54" fill="#FFFFFF"/><rect x="13" y="-27" width="27" height="54" fill="#D33A3A"/>'),
    japan: flag('<rect x="-40" y="-27" width="80" height="54" fill="#FFFFFF"/><circle r="15" fill="#C8263B"/>'),
    germany: flag('<rect x="-40" y="-27" width="80" height="18" fill="#2E323C"/><rect x="-40" y="-9" width="80" height="18" fill="#D2333C"/><rect x="-40" y="9" width="80" height="18" fill="#F2C14E"/>'),
    sweden: flag('<rect x="-40" y="-27" width="80" height="54" fill="#2C6CB0"/><rect x="-18" y="-27" width="10" height="54" fill="#F4C842"/><rect x="-40" y="-5" width="80" height="10" fill="#F4C842"/>'),
    brazil: flag('<rect x="-40" y="-27" width="80" height="54" fill="#2E9B4F"/><path d="M0 -22L34 0L0 22L-34 0Z" fill="#F5C93D"/><circle r="12" fill="#2B4C9A"/><path d="M-11 -3Q0 -9 11 1" fill="none" stroke="#FFFFFF" stroke-width="2.5"/>'),
  };

  const SEA = {
    fish: `<g transform="translate(-2 0)"><path d="M18 0L38 -16L35 0L38 16Z" fill="${fill('orange')}" stroke="${dark('orange')}" stroke-width="3" stroke-linejoin="round"/>` +
      `<path d="M-10 -16Q2 -30 12 -14Z" fill="${fill('orange')}" stroke="${dark('orange')}" stroke-width="2.5" stroke-linejoin="round"/>` +
      `<ellipse cx="-4" rx="26" ry="18" fill="${fill('orange')}" stroke="${dark('orange')}" stroke-width="3"/>` +
      `<path d="M-6 -9Q-1 0 -6 9" fill="none" stroke="${dark('orange')}" stroke-width="2.5" stroke-linecap="round"/>` +
      `<circle cx="-17" cy="-4" r="5.5" fill="#FFFFFF"/><circle cx="-18" cy="-4" r="2.8" fill="#2E323C"/>${hl(-6, -10, 7, 3.5, -10, 0.4)}</g>`,
    crab: `<g transform="translate(0 2)" stroke="${dark('red')}" stroke-linecap="round" fill="none" stroke-width="3.5">` +
      '<path d="M-18 6L-34 12M-18 12L-32 22M-16 16L-26 28M18 6L34 12M18 12L32 22M16 16L26 28"/>' +
      '<path d="M-14 -2L-24 -9M14 -2L24 -9M-6 -6L-8 -16M6 -6L8 -16"/></g>' +
      `<g transform="translate(0 2)"><path d="M-36 -14A10 10 0 1 1 -22 -24L-28 -15Z" fill="${fill('red')}" stroke="${dark('red')}" stroke-width="2.5" stroke-linejoin="round"/>` +
      `<path d="M36 -14A10 10 0 1 0 22 -24L28 -15Z" fill="${fill('red')}" stroke="${dark('red')}" stroke-width="2.5" stroke-linejoin="round"/>` +
      `<ellipse cy="8" rx="24" ry="16" fill="${fill('red')}" stroke="${dark('red')}" stroke-width="3"/>` +
      `<circle cx="-8" cy="-17" r="4.5" fill="#FFFFFF" stroke="${dark('red')}" stroke-width="1.5"/><circle cx="8" cy="-17" r="4.5" fill="#FFFFFF" stroke="${dark('red')}" stroke-width="1.5"/>` +
      `<circle cx="-8" cy="-17" r="2.2" fill="#2E323C"/><circle cx="8" cy="-17" r="2.2" fill="#2E323C"/>` +
      `<path d="M-6 12Q0 16 6 12" fill="none" stroke="${dark('red')}" stroke-width="2" stroke-linecap="round"/>${hl(-10, 2, 7, 4)}</g>`,
    shell: `<g transform="translate(0 -1)"><path d="M-8 28H8L4 36H-4Z" fill="${fill('peach')}" stroke="${dark('peach')}" stroke-width="2.5" stroke-linejoin="round"/>` +
      `<path d="M0 30L-32 -4C-30 -22 -16 -32 0 -32C16 -32 30 -22 32 -4Z" fill="${fill('peach')}" stroke="${dark('peach')}" stroke-width="3" stroke-linejoin="round"/>` +
      '<path d="M0 30L-24 -18M0 30L-12 -28M0 30V-32M0 30L12 -28M0 30L24 -18" stroke="' + dark('peach') + '" stroke-width="2" opacity=".6"/></g>',
    whale: `<path d="M30 -2C34 -14 44 -20 46 -18C44 -10 40 -4 36 0C40 4 44 10 46 18C44 20 34 14 30 2Z" fill="${fill('blue')}" stroke="${dark('blue')}" stroke-width="2.5" stroke-linejoin="round"/>` +
      `<path d="M-38 6C-38 -16 -14 -24 6 -22C24 -20 34 -10 34 2C34 12 26 18 12 18H-26C-34 18 -38 12 -38 6Z" fill="${fill('blue')}" stroke="${dark('blue')}" stroke-width="3"/>` +
      `<path d="M-34 10C-20 17 10 18 28 11C22 16 12 18 -4 18H-26C-30 18 -33 14 -34 10Z" fill="#D6E7F8"/><circle cx="-22" cy="0" r="3" fill="#2E323C"/>` +
      `<path d="M-12 -23C-12 -31 -20 -35 -24 -33M-12 -23C-12 -31 -4 -35 0 -33" fill="none" stroke="${C.sky[2]}" stroke-width="3" stroke-linecap="round"/>${hl(-14, -12, 8, 4, -15, 0.35)}`,
    octopus: `<g fill="none" stroke="${C.purple[1]}" stroke-width="7" stroke-linecap="round"><path d="M-18 2C-24 14 -14 20 -22 30M-9 4C-12 16 -4 22 -10 32M0 4C0 16 6 22 0 33M9 4C12 16 4 22 10 32M18 2C24 14 14 20 22 30"/></g>` +
      `<path d="M-23 6C-25 -22 -12 -35 0 -35C12 -35 25 -22 23 6Z" fill="${fill('purple')}" stroke="${dark('purple')}" stroke-width="3" stroke-linejoin="round"/>` +
      `<circle cx="-8" cy="-10" r="5" fill="#FFFFFF"/><circle cx="8" cy="-10" r="5" fill="#FFFFFF"/><circle cx="-7" cy="-10" r="2.6" fill="#2E323C"/><circle cx="9" cy="-10" r="2.6" fill="#2E323C"/>` +
      `${CHEEK(-14, -1)}${CHEEK(14, -1)}${hl(-9, -24, 7, 4)}`,
    starfish: `<polygon points="${starPts(37, 15, 0, 3)}" fill="${C.amber[1]}" stroke="${C.amber[1]}" stroke-width="8" stroke-linejoin="round"/>` +
      `<polygon points="${starPts(37, 15, 0, 3)}" fill="${fill('amber')}" stroke="${dark('amber')}" stroke-width="2.5" stroke-linejoin="round"/>` +
      [[0, -18], [0, -8], [-17, -3], [17, -3], [-9, 15], [9, 15]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="#FFF0C8"/>`).join(''),
  };

  /* ---------- themes: the pieces a child can choose in the grown-ups panel ---------- */
  const THEMES = {
    colours: { label: 'Colours', pieces: {} },
    shapes: { label: 'Shapes', pieces: {} },
    fruit: { label: 'Fruit', pieces: {} },
    animals: { label: 'Animals', pieces: {} },
    weather: { label: 'Weather', pieces: {} },
    space: { label: 'Space', pieces: {} },
    transport: { label: 'Transport', pieces: {} },
    flags: { label: 'Flags', pieces: {} },
    sea: { label: 'Sea', pieces: {} },
  };
  // [id, name, colour family (for the colour clash rule)]
  ['red', 'blue', 'yellow', 'green', 'purple', 'orange', 'pink'].forEach(c => { THEMES.colours.pieces[c] = { name: c, col: c, art: ball(c) }; });
  [['circle', 'red'], ['square', 'blue'], ['triangle', 'yellow'], ['star', 'purple'], ['heart', 'pink'], ['diamond', 'green']].forEach(([s, c]) => {
    THEMES.shapes.pieces[s] = { name: s, col: c, art: SHAPE[s](c) };
  });
  const add = (t, map, names, cols) => Object.keys(map).forEach(id => { THEMES[t].pieces[id] = { name: names[id] || id, col: cols[id], art: map[id] }; });
  add('fruit', FRUIT, {}, { apple: 'red', banana: 'yellow', pear: 'green', orange: 'orange', grapes: 'purple', strawberry: 'red' });
  add('animals', ANIMALS, {}, { cat: 'orange', dog: 'brown', rabbit: 'white', frog: 'green', pig: 'pink', chick: 'yellow' });
  add('weather', WEATHER, {}, { sun: 'yellow', cloud: 'white', raindrop: 'blue', snowflake: 'sky', lightning: 'amber', rainbow: 'rainbow' });
  add('space', SPACE, {}, { planet: 'purple', moon: 'moon', star: 'gold', rocket: 'white', earth: 'blue', ufo: 'grey' });
  add('transport', TRANSPORT, { boat: 'sailing boat', balloon: 'hot air balloon' }, { car: 'red', bus: 'yellow', boat: 'blue', plane: 'white', balloon: 'red', bike: 'blue' });
  add('flags', FLAGS, { uk: 'UK flag', france: 'France flag', japan: 'Japan flag', germany: 'Germany flag', sweden: 'Sweden flag', brazil: 'Brazil flag' },
    { uk: 'blue', france: 'blue', japan: 'white', germany: 'black', sweden: 'sky', brazil: 'green' });
  add('sea', SEA, {}, { fish: 'orange', crab: 'red', shell: 'peach', whale: 'blue', octopus: 'purple', starfish: 'amber' });

  // Beads for the necklace world: each bead has its own shape AND colour.
  const BEADS = {
    round: { name: 'blue round bead', col: 'blue', shape: 'circle' },
    cube: { name: 'yellow square bead', col: 'yellow', shape: 'square' },
    long: { name: 'pink long bead', col: 'pink', shape: 'oval' },
    heart: { name: 'green heart bead', col: 'green', shape: 'heart' },
    star: { name: 'purple star bead', col: 'purple', shape: 'star' },
    flower: { name: 'orange flower bead', col: 'orange', shape: 'flower' },
  };

  /* ---------- numbers ---------- */
  function numText(v, fmt) {
    const neg = v < 0, a = Math.abs(v);
    let s;
    if (fmt === 'half') {
      const whole = Math.floor(a + 1e-9), half = Math.abs(a - whole - 0.5) < 1e-6;
      s = half ? (whole ? whole + '½' : '½') : String(whole);
    } else if (fmt === 'quarter') {
      const whole = Math.floor(a + 1e-9), f = Math.round((a - whole) * 4);
      const part = ['', '¼', '½', '¾'][f];
      s = whole ? whole + part : (part || '0');
    } else if (fmt === 'dec1') s = a.toFixed(1);
    else if (fmt === 'dec2') s = a.toFixed(2);
    else s = String(Math.round(a));
    return (neg ? '−' : '') + s;
  }
  function stone(text, opts = {}) {
    const len = [...text].length, fs = len <= 2 ? 42 : len === 3 ? 36 : len === 4 ? 29 : 24;
    const c = opts.col || 'cream';
    return `<rect x="-43" y="-38" width="86" height="76" rx="24" fill="${fill(c)}" stroke="${opts.line || '#D7C9AF'}" stroke-width="3"/>` +
      `<text y="${n(fs * 0.35)}" text-anchor="middle" font-family="Quicksand, sans-serif" font-weight="700" font-size="${fs}" fill="#26324B">${text}</text>`;
  }

  /* ---------- tiles for the tile garden ---------- */
  function tile(t) {
    const c = t.col;
    let s = `<rect x="-46" y="-46" width="92" height="92" rx="10" fill="${fill(c)}" stroke="${dark(c)}" stroke-width="3"/>`;
    if (t.motif === 'dot') s += '<circle r="14" fill="#FFFFFF" opacity=".75"/>';
    if (t.motif === 'half') s += `<path d="M-44 -44H44L-44 44Z" fill="${C[t.col2 || 'white'][1]}" transform="rotate(${t.rot || 0})"/>`;
    if (t.motif === 'arc') s += `<path d="M-46 -6A40 40 0 0 0 -6 -46" fill="none" stroke="#FFFFFF" stroke-width="9" opacity=".85" transform="rotate(${t.rot || 0})"/>` +
      `<path d="M46 6A40 40 0 0 0 6 46" fill="none" stroke="#FFFFFF" stroke-width="9" opacity=".85" transform="rotate(${t.rot || 0})"/>`;
    s += '<rect x="-38" y="-38" width="76" height="76" rx="7" fill="none" stroke="#FFFFFF" stroke-opacity=".28" stroke-width="3"/>';
    return s;
  }

  /* ---------- things that turn or flip ---------- */
  const TURN = {
    arrow: c => `<path d="M0 -36L26 -6H11V32H-11V-6H-26Z" fill="${fill(c)}" stroke="${dark(c)}" stroke-width="3" stroke-linejoin="round"/>`,
    pie: c => `<circle r="33" fill="#FFFFFF" stroke="${dark('grey')}" stroke-width="3"/><path d="M0 0V-33A33 33 0 0 1 33 0Z" fill="${fill(c)}" stroke="${dark(c)}" stroke-width="2" stroke-linejoin="round"/>`,
    boot: c => `<path d="M-20 -32H2V8H26V32H-20Z" fill="${fill(c)}" stroke="${dark(c)}" stroke-width="3" stroke-linejoin="round"/>`,
    flag: c => `<path d="M-14 -34V34" stroke="#6B5A45" stroke-width="5" stroke-linecap="round"/><path d="M-12 -32H26L16 -18L26 -4H-12Z" fill="${fill(c)}" stroke="${dark(c)}" stroke-width="3" stroke-linejoin="round"/>`,
  };
  const TURN_NAME = { arrow: 'arrow', pie: 'circle', boot: 'shape', flag: 'flag' };
  const POINT = { 0: 'up', 90: 'right', 180: 'down', 270: 'left' };

  /* ---------- shapes for the puzzle grids ---------- */
  function mshape(t) {
    const count = t.count || 1, draw = SHAPE[t.shape];
    const one = c => {
      let s = draw(c);
      if (t.fill === 'outline') s = s.replace(/fill="url\(#pg-[a-z]+\)"/g, 'fill="#FFFFFF"');
      return s;
    };
    const rot = t.deg ? ` rotate(${t.deg})` : '';
    if (count === 1) return `<g transform="scale(${t.small ? 0.62 : 1})${rot}">${one(t.col)}</g>`;
    const spots = { 2: [[-20, 0], [20, 0]], 3: [[-22, 14], [22, 14], [0, -18]], 4: [[-20, -20], [20, -20], [-20, 20], [20, 20]] }[count];
    return spots.map(([x, y]) => `<g transform="translate(${x} ${y}) scale(.48)${rot}">${one(t.col)}</g>`).join('');
  }

  /* ---------- drawing any token ---------- */
  function piece(t) {
    const th = THEMES[t.theme];
    return th && th.pieces[t.id];
  }
  function draw(t) {
    if (!t) return '';
    switch (t.theme) {
      case 'num': return stone(numText(t.v, t.fmt), t);
      case 'size': return `<g transform="scale(${[0.5, 0.75, 1][t.s]})">${draw(t.base)}</g>`;
      case 'bead': { const b = BEADS[t.id]; return SHAPE[b.shape](b.col); }
      case 'tile': return tile(t);
      case 'turn': return `<g transform="rotate(${t.deg || 0})">${TURN[t.g](t.col || 'blue')}</g>`;
      case 'flip': return `<g transform="rotate(${t.deg || 0}) scale(${t.flip ? -1 : 1} 1)">${TURN[t.g](t.col || 'green')}</g>`;
      case 'm': return mshape(t);
      case 'letter': return `<text y="15" text-anchor="middle" font-family="Quicksand, sans-serif" font-weight="700" font-size="46" fill="#26324B">${t.v}</text>`;
      default: { const p = piece(t); return p ? p.art : ''; }
    }
  }
  function svg(t, cls = 'tok') {
    return `<svg class="${cls}" viewBox="-50 -50 100 100" aria-hidden="true" focusable="false">${draw(t)}</svg>`;
  }
  function name(t) {
    if (!t) return '';
    switch (t.theme) {
      case 'num': return numText(t.v, t.fmt).replace('−', 'minus ');
      case 'size': return ['small', 'middle-sized', 'big'][t.s] + ' ' + name(t.base);
      case 'bead': return BEADS[t.id].name;
      case 'tile': return (t.motif === 'half' || t.motif === 'arc') ? `${t.col} tile turned ${t.rot || 0} degrees` : `${t.col} tile` + (t.motif === 'dot' ? ' with a dot' : '');
      case 'turn': return `${TURN_NAME[t.g]} pointing ${POINT[(t.deg % 360 + 360) % 360] || 'round'}`;
      case 'flip': return `${TURN_NAME[t.g]}${t.flip ? ' flipped' : ''}`;
      case 'm': return `${t.count > 1 ? t.count + ' ' : ''}${t.fill === 'outline' ? 'white ' : t.col + ' '}${t.shape}${t.count > 1 ? 's' : ''}`;
      case 'letter': return t.v;
      default: { const p = piece(t); return p ? p.name : ''; }
    }
  }
  function key(t) {
    if (!t) return '';
    switch (t.theme) {
      case 'num': return 'num:' + t.v;
      case 'size': return 'size:' + t.s + ':' + key(t.base);
      case 'tile': return `tile:${t.col}:${t.motif || ''}:${t.col2 || ''}:${((t.rot || 0) % 360 + 360) % 360}`;
      case 'turn': return `turn:${t.g}:${t.col}:${((t.deg || 0) % 360 + 360) % 360}`;
      case 'flip': return `flip:${t.g}:${t.col}:${t.flip ? 1 : 0}:${((t.deg || 0) % 360 + 360) % 360}`;
      case 'm': return `m:${t.shape}:${t.col}:${t.count || 1}:${t.fill || ''}:${t.small ? 1 : 0}:${((t.deg || 0) % 360 + 360) % 360}`;
      default: return t.theme + ':' + (t.id || t.v);
    }
  }
  function colourOf(t) {
    if (!t) return '';
    if (t.theme === 'bead') return BEADS[t.id].col;
    if (t.col) return t.col;
    const p = piece(t);
    return p ? p.col : '';
  }

  /* ---------- the owl (only in "Watch me") ---------- */
  function owl(flap = true) {
    const body = '#A0704F', d = '#7A5038', belly = '#F6E1BF', b = '#F0A33A';
    const lw = flap ? ' class="wing-l"' : '', rw = flap ? ' class="wing-r"' : '';
    return '<g>' +
      `<ellipse cx="-13" cy="51" rx="9" ry="5" fill="${b}"/><ellipse cx="13" cy="51" rx="9" ry="5" fill="${b}"/>` +
      `<g${lw}><ellipse cx="-37" cy="12" rx="13" ry="27" fill="${d}" transform="rotate(18 -37 12)"/></g>` +
      `<g${rw}><ellipse cx="37" cy="12" rx="13" ry="27" fill="${d}" transform="rotate(-18 37 12)"/></g>` +
      `<path d="M-33 -26L-29 -55L-11 -39Z" fill="${d}" stroke="${d}" stroke-width="4" stroke-linejoin="round"/>` +
      `<path d="M33 -26L29 -55L11 -39Z" fill="${d}" stroke="${d}" stroke-width="4" stroke-linejoin="round"/>` +
      `<ellipse cx="0" cy="4" rx="40" ry="47" fill="${body}"/>` +
      `<ellipse cx="0" cy="21" rx="26" ry="27" fill="${belly}"/>` +
      '<path d="M-11 14l4.5 4.5 4.5-4.5M2 14l4.5 4.5 4.5-4.5M-4.5 26l4.5 4.5 4.5-4.5" fill="none" stroke="#D2AE84" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>' +
      `<circle cx="-15" cy="-13" r="17.5" fill="${belly}"/><circle cx="15" cy="-13" r="17.5" fill="${belly}"/>` +
      '<circle cx="-15" cy="-13" r="11.5" fill="#FFFFFF"/><circle cx="15" cy="-13" r="11.5" fill="#FFFFFF"/>' +
      '<circle cx="-12.5" cy="-12" r="6.5" fill="#2A2440"/><circle cx="17.5" cy="-12" r="6.5" fill="#2A2440"/>' +
      '<circle cx="-10" cy="-14.5" r="2.3" fill="#FFFFFF"/><circle cx="20" cy="-14.5" r="2.3" fill="#FFFFFF"/>' +
      `<path d="M-6 -2L6 -2L0 8Z" fill="${b}" stroke="${b}" stroke-width="2.5" stroke-linejoin="round"/>` +
      '<ellipse cx="-27" cy="1" rx="5.5" ry="3.2" fill="#F4A6A0" opacity=".7"/><ellipse cx="27" cy="1" rx="5.5" ry="3.2" fill="#F4A6A0" opacity=".7"/>' +
      '</g>';
  }

  /* ---------- a simple, quiet train engine (faces left) ---------- */
  function engine() {
    return '<svg class="engine" viewBox="0 0 120 92" aria-hidden="true" focusable="false">' +
      '<rect x="6" y="64" width="110" height="11" rx="5.5" fill="#4E6782"/>' +
      '<rect x="14" y="34" width="64" height="34" rx="17" fill="#7393B3"/>' +
      '<rect x="7" y="36" width="17" height="30" rx="8.5" fill="#4E6782"/>' +
      '<rect x="24" y="15" width="15" height="23" rx="4" fill="#4E6782"/>' +
      '<rect x="70" y="18" width="42" height="50" rx="9" fill="#7393B3"/>' +
      '<rect x="65" y="11" width="52" height="11" rx="5.5" fill="#4E6782"/>' +
      '<rect x="81" y="28" width="21" height="18" rx="5" fill="#F7F1E6"/>' +
      '<rect x="22" y="40" width="44" height="6" rx="3" fill="#FFFFFF" opacity=".2"/>' +
      '<circle cx="34" cy="80" r="11" fill="#3A4150"/><circle cx="34" cy="80" r="4" fill="#AEB8C6"/>' +
      '<circle cx="92" cy="80" r="11" fill="#3A4150"/><circle cx="92" cy="80" r="4" fill="#AEB8C6"/>' +
      '</svg>';
  }

  /* ---------- small line icons for buttons ---------- */
  const ICON = {
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/>',
    maths: '<path d="M7 4v6M4 7h6"/><path d="M14 7h6"/><path d="M4.5 14.5l5 5M9.5 14.5l-5 5"/><path d="M14 15h6M14 19h6"/>',
    speak: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6"/><path d="M18 6.5a7.5 7.5 0 0 1 0 11"/>',
    mute: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>',
    people: '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 19.5c.6-3.4 2.8-5.3 5.5-5.3s4.9 1.9 5.5 5.3"/><circle cx="17" cy="9.5" r="2.4"/><path d="M15.6 14.4c2.6-.4 4.5 1.3 5 4.6"/>',
    bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.4 1.1 2.2h5c0-.8.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3.2"/>',
    next: '<path d="M9 5.5l7 6.5-7 6.5"/>',
    back: '<path d="M15 5.5L8 12l7 6.5"/>',
    undo: '<path d="M9 7L4.5 11.5 9 16"/><path d="M5 11.5h9a5 5 0 0 1 0 10h-2"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    map: '<path d="M3.5 6.5l5.5-2.5 6 2.5 5.5-2.5v13.5l-5.5 2.5-6-2.5-5.5 2.5z"/><path d="M9 4v13.5M15 6.5V20"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    brush: '<path d="M14.5 4.5l5 5L11 18l-5-5z"/><path d="M6 13c-2 1-2.5 3-2.5 6.5 3.5 0 5.5-.5 6.5-2.5"/>',
    star: '',
  };
  function icon(name, size = 22, stroke = 'currentColor', sw = 2.2) {
    if (name === 'star') return starIcon(size);
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICON[name]}</svg>`;
  }
  function starIcon(size = 24, f = '#F4C452', line = '#D6A12A') {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><polygon points="${starPts(10.5, 4.8, 12, 12.9)}" fill="${f}" stroke="${line}" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
  }
  function note(c = '#E39A1E') {
    return `<svg class="note" viewBox="-20 -24 40 44" aria-hidden="true" focusable="false"><g fill="${c}"><ellipse cx="-7" cy="10" rx="8" ry="6" transform="rotate(-20 -7 10)"/>` +
      '<rect x="-0.5" y="-20" width="4" height="31" rx="2"/><path d="M3.5 -20C12 -17 16 -11 15 -2C12 -8 8 -10 3.5 -11Z"/></g></svg>';
  }

  /* ---------- the world icons (map, cards) ---------- */
  function worldIcon(i, col, ink = '#FFFFFF') {
    if (i === 0) return '<g transform="translate(0 -2)"><g fill="' + ink + '"><rect x="-25" y="-5" width="30" height="17" rx="6"/>' +
      '<rect x="1" y="-19" width="21" height="31" rx="4"/><rect x="-20" y="-18" width="8" height="14" rx="2"/>' +
      '<rect x="-27" y="10" width="51" height="5" rx="2.5"/><circle cx="-14" cy="17" r="6.5"/><circle cx="12" cy="17" r="6.5"/></g>' +
      `<circle cx="-14" cy="17" r="2.5" fill="${col}"/><circle cx="12" cy="17" r="2.5" fill="${col}"/><rect x="5" y="-14" width="13" height="10" rx="2.5" fill="${col}"/></g>`;
    if (i === 1) {
      let b = '';
      for (let k = 0; k < 8; k++) { const a = (-67.5 + 45 * k) * Math.PI / 180; b += `<circle cx="${n(19 * Math.cos(a))}" cy="${n(2 + 19 * Math.sin(a))}" r="5.6" fill="${ink}"/>`; }
      return `<circle cx="0" cy="2" r="19" fill="none" stroke="${ink}" stroke-width="2.5" opacity=".8"/>${b}<circle cx="0" cy="-19" r="3.5" fill="none" stroke="${ink}" stroke-width="2.5"/>`;
    }
    if (i === 2) { let s = ''; for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) s += `<rect x="${-23 + c * 16}" y="${-23 + r * 16}" width="14" height="14" rx="3" fill="${ink}" opacity="${(r + c) % 2 ? 0.45 : 1}"/>`; return s; }
    if (i === 3) return [[-23, 9], [-7, 9], [-7, -7], [9, 9], [9, -7], [9, -23]].map(([x, y]) => `<rect x="${x}" y="${y}" width="14" height="14" rx="3" fill="${ink}"/>`).join('');
    if (i === 4) { let s = ''; for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) s += `<rect x="${-23 + c * 12}" y="${-23 + r * 12}" width="10" height="10" rx="2" fill="${ink}" opacity="${r === c ? 1 : 0.4}"/>`; return s; }
    if (i === 5) {
      const g = [];
      for (let k = 0; k < 32; k++) { const a = k * Math.PI * 2 / 32, r = k % 4 === 1 || k % 4 === 2 ? 23 : 17; g.push(n(r * Math.cos(a)) + ',' + n(r * Math.sin(a))); }
      return `<polygon points="${g.join(' ')}" fill="${ink}" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/><circle r="7" fill="${col}"/>`;
    }
    if (i === 6) return `<g fill="${ink}"><ellipse cx="-11" cy="-7" rx="11" ry="15" transform="rotate(-32 -11 -7)"/><ellipse cx="11" cy="-7" rx="11" ry="15" transform="rotate(32 11 -7)"/>` +
      '<ellipse cx="-9" cy="12" rx="7.5" ry="10" transform="rotate(28 -9 12)"/><ellipse cx="9" cy="12" rx="7.5" ry="10" transform="rotate(-28 9 12)"/></g>' +
      `<rect x="-2.5" y="-16" width="5" height="34" rx="2.5" fill="${col}"/><path d="M-1 -16L-7 -25M1 -16L7 -25" stroke="${ink}" stroke-width="2.2" stroke-linecap="round"/>`;
    if (i === 7) {
      let s = '';
      for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
        const x = -23 + c * 16, y = -23 + r * 16;
        if (r === 2 && c === 2) { s += `<rect x="${x}" y="${y}" width="14" height="14" rx="3" fill="none" stroke="${ink}" stroke-width="2" stroke-dasharray="3 2"/>`; continue; }
        s += `<rect x="${x}" y="${y}" width="14" height="14" rx="3" fill="${ink}"/>`;
        const k = (r + c) % 3, cx = x + 7, cy = y + 7;
        s += k === 0 ? `<circle cx="${cx}" cy="${cy}" r="3.2" fill="${col}"/>` : k === 1 ? `<rect x="${cx - 3}" y="${cy - 3}" width="6" height="6" fill="${col}"/>` :
          `<path d="M${cx} ${cy - 3.6}L${cx + 3.6} ${cy + 3}L${cx - 3.6} ${cy + 3}Z" fill="${col}"/>`;
      }
      return s;
    }
    return `<path d="M-15 -20H15V-6C15 6 8 12 0 12C-8 12 -15 6 -15 -6Z" fill="${ink}"/>` +
      `<path d="M-15 -15H-23C-23 -3 -18 2 -12 3M15 -15H23C23 -3 18 2 12 3" fill="none" stroke="${ink}" stroke-width="3.5" stroke-linecap="round"/>` +
      `<rect x="-3.5" y="11" width="7" height="8" fill="${ink}"/><rect x="-12" y="18" width="24" height="6" rx="2" fill="${ink}"/>`;
  }

  window.PArt = {
    C, defs, draw, svg, name, key, colourOf, numText, owl, engine, icon, starIcon, note, worldIcon, starPts,
    THEMES, BEADS, SHAPES: Object.keys(SHAPE), TURN_KINDS: Object.keys(TURN),
  };
})();
