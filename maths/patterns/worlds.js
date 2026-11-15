/* Patterns – the eight worlds, every kind of puzzle, and the ladder of levels (worlds.js).
   window.PWorlds is used by game.js.

   Each kind of puzzle has gen(params) which returns a puzzle:
     { prompt, mech, scene, hints, explain, ... }
   mech is how the child answers:
     choose  pick one answer (opts[]; target = the cell the answer goes into, if any)
     fill    fill gaps in order from a palette (slots[], palette[]; each slot cell knows its piece)
     tap     tap the right thing in the picture (rightIds[])
     build   add pieces from a palette, then Check (n, palette[], check(built), solution[])
     select  tap squares on a grid, then Check (want[] = cell ids)
     order   tap things in the right order (orderIds[])
   Levels are made from each world's blocks: one kind of puzzle at a time,
   several levels each, a little harder each time (see "The worlds and their
   levels" below). */
(function () {
  'use strict';
  const A = window.PArt;

  /* ---------- small helpers ---------- */
  const rand = n => Math.floor(Math.random() * n);
  const pick = a => a[rand(a.length)];
  const between = (a, b) => a + rand(b - a + 1);
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const K = A.key, NAME = A.name;
  const same = (a, b) => K(a) === K(b);
  function uniqToks(arr) { const seen = new Set(); return arr.filter(t => { const k = K(t); if (seen.has(k)) return false; seen.add(k); return true; }); }
  const words = arr => arr.join(', ');
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const spaced = s => s.split('').join(' ');
  const plural = s => /(sh|ch|s|x)$/.test(s) ? s + 'es' : s + 's';
  const ord = n => n + ((n % 100 >= 11 && n % 100 <= 13) ? 'th' : (['th', 'st', 'nd', 'rd'][n % 10] || 'th'));
  function periodOf(keys) {
    for (let p = 1; p * 2 <= keys.length; p++) {
      let ok = true;
      for (let i = p; i < keys.length; i++) if (keys[i] !== keys[i - p]) { ok = false; break; }
      if (ok) return p;
    }
    return 0;
  }
  function structure(keys) { const m = new Map(); return keys.map(k => { if (!m.has(k)) m.set(k, 'ABCDEFGH'[m.size]); return m.get(k); }).join(''); }
  const rotations = u => { const r = new Set(); for (let i = 0; i < u.length; i++) r.add(structure((u.slice(i) + u.slice(0, i)).split(''))); return r; };
  const numTok = (v, fmt) => ({ theme: 'num', v: Math.round(v * 100) / 100, fmt });
  const T = (v, fmt) => A.numText(v, fmt);

  /* ---------- which themes the grown-ups have switched on ---------- */
  const ALL_THEMES = Object.keys(A.THEMES);
  let allowed = ALL_THEMES.slice();
  function setThemes(list) { allowed = (list && list.length) ? list.filter(t => A.THEMES[t]) : ALL_THEMES.slice(); if (!allowed.length) allowed = ALL_THEMES.slice(); }

  /* ---------- picking pieces ---------- */
  const CLASH = ['red|orange', 'red|pink', 'orange|yellow', 'blue|purple', 'red|green', 'pink|purple', 'orange|pink', 'green|teal', 'blue|teal'];
  const clash = (a, b) => CLASH.includes(a + '|' + b) || CLASH.includes(b + '|' + a);
  function pieceSet(count, p, avoidTheme) {
    if (p.beads) return shuffle(Object.keys(A.BEADS)).slice(0, count).map(id => ({ theme: 'bead', id }));
    let themes = (p.themes || ALL_THEMES).filter(t => allowed.includes(t));
    if (!themes.length) themes = allowed.slice();
    themes = shuffle(themes).filter(t => t !== avoidTheme);
    if (!themes.length) themes = shuffle(allowed.filter(t => t !== avoidTheme));
    if (!themes.length) themes = ['shapes', 'fruit'].filter(t => t !== avoidTheme);
    for (const th of themes) {
      const ids = Object.keys(A.THEMES[th].pieces);
      if (ids.length < count) continue;
      for (let tries = 0; tries < 40; tries++) {
        const chosen = shuffle(ids).slice(0, count);
        const cols = chosen.map(id => A.THEMES[th].pieces[id].col);
        let ok = true;
        if (th === 'colours') for (let i = 0; i < cols.length && ok; i++) for (let j = i + 1; j < cols.length; j++) if (clash(cols[i], cols[j])) { ok = false; break; }
        if (ok) return chosen.map(id => ({ theme: th, id }));
      }
    }
    const fall = avoidTheme === 'shapes' ? 'fruit' : 'shapes';
    return shuffle(Object.keys(A.THEMES[fall].pieces)).slice(0, count).map(id => ({ theme: fall, id }));
  }

  /* ---------- repeating sequences ---------- */
  const U1 = ['AB'], U2 = ['AAB', 'ABB'], U3 = ['ABC', 'AABB'], U4 = ['ABCC', 'ABBC', 'AABC', 'ABCD'], U5 = ['AABBC', 'ABCDD', 'AABCC', 'ABBCC', 'ABCDE'];
  function makeSeq(p, ch = 0, spare = p.spare || 0) {
    const unit = pick(p.units || U1);
    const letters = [...new Set(unit)];
    const extra = Math.max(0, ch - letters.length) + spare;
    const toks = pieceSet(letters.length + extra, p);
    const map = {}; letters.forEach((L, i) => { map[L] = toks[i]; });
    return {
      unit, L: unit.length, letters, map, spare: toks.slice(letters.length),
      pieces: letters.map(L => map[L]),
      at: i => map[unit[i % unit.length]],
    };
  }
  const bitNames = s => words(s.unit.split('').map(L => NAME(s.map[L])));
  function seqCells(s, n, row = 0, prefix = 'r') {
    const out = [];
    for (let i = 0; i < n; i++) {
      const L = s.unit[i % s.L];
      out.push({ id: prefix === 'r' ? `r${row}c${i}` : `${prefix}${i}`, tok: s.map[L], u: Math.floor(i / s.L), note: s.letters.indexOf(L), letter: L });
    }
    return out;
  }
  function tokOpts(right, pool, ch) {
    const others = uniqToks(pool.filter(t => !same(t, right)));
    return shuffle([right].concat(shuffle(others).slice(0, Math.max(1, ch - 1))))
      .map(t => ({ tok: t, right: same(t, right), say: NAME(t) }));
  }
  function seqHints(s, last) {
    return [
      { show: 'units', text: 'Look for the bit that repeats. A line goes under each bit.' },
      { show: 'labels', text: `Say it with letters: ${spaced(s.unit)}, ${spaced(s.unit)}…` },
      { text: last || `Say it out loud from the start: ${bitNames(s)}, then again.` },
    ];
  }
  const line = (rows, extra) => Object.assign({ type: 'line', style: 'train', rows }, extra || {});
  const ringN = (L, p) => { const lo = Math.ceil((p.ringMin || 8) / L), hi = Math.max(lo, Math.floor((p.ringMax || (L >= 5 ? 20 : 16)) / L)); return L * between(lo, hi); };

  const KINDS = {};
  function def(k, o) { KINDS[k] = Object.assign({ id: k }, o); }

  /* ================================================================
     World 1: Train – patterns in a line
     ================================================================ */
  def('copy', {
    w: 0, name: 'Copy the train', base: { units: U1, themes: ['colours'], ghost: true },
    gen(p) {
      const s = makeSeq(p), n = s.L * 2;
      const top = seqCells(s, n, 0), bottom = seqCells(s, n, 1).map(c => Object.assign(c, { gap: true, ghost: !!p.ghost }));
      return {
        prompt: 'Copy the train.', mech: 'fill',
        scene: line([{ label: 'This train', cells: top }, { label: 'Your train', cells: bottom }], { unit: s.L }),
        slots: bottom.map(c => c.id), palette: shuffle(s.pieces.concat(s.spare)),
        hints: [{ show: 'units', text: 'Do one carriage at a time. Look at the top train, then find the same piece.' },
          { show: 'ghost', text: 'I’ve shown faintly where each piece goes.' }],
        explain: `Same as the top train. The bit that repeats is ${bitNames(s)}.`,
      };
    },
  });
  def('next', {
    w: 0, name: 'What comes next', base: { units: U1, ch: 2 },
    gen(p) {
      const ch = p.ch || 3, s = makeSeq(p, ch);
      const shown = Math.max(4, s.L * 2) + (p.partial ? rand(s.L) : 0);
      const cells = seqCells(s, shown + 1), q = cells[shown]; q.q = true;
      return {
        prompt: 'What comes next?', mech: 'choose', scene: line([{ cells }], { unit: s.L }), target: q.id,
        opts: tokOpts(q.tok, s.pieces.concat(s.spare), ch), hints: seqHints(s),
        explain: `The bit that repeats is ${bitNames(s)}. So next is ${NAME(q.tok)}.`,
      };
    },
  });
  def('carry', {
    w: 0, name: 'Carry on the pattern', base: { units: U1 },
    gen(p) {
      const s = makeSeq(p), shown = Math.max(4, s.L * 2), add = Math.min(4, Math.max(2, s.L));
      const cells = seqCells(s, shown + add);
      const slots = cells.slice(shown).map(c => { c.gap = true; return c.id; });
      return {
        prompt: 'Carry on the pattern.', mech: 'fill', scene: line([{ cells }], { unit: s.L }), slots,
        palette: shuffle(s.pieces.concat(s.spare)), hints: seqHints(s),
        explain: `The bit that repeats is ${bitNames(s)}.`,
      };
    },
  });
  def('missing', {
    w: 0, name: 'What is missing', base: { units: U1, ch: 2 },
    gen(p) {
      const ch = p.ch || 3, s = makeSeq(p, ch), n = Math.max(6, s.L * 3);
      const cells = seqCells(s, n), q = cells[between(s.L, n - 2)]; q.q = true;
      return {
        prompt: 'What is missing?', mech: 'choose', scene: line([{ cells }], { unit: s.L }), target: q.id,
        opts: tokOpts(q.tok, s.pieces.concat(s.spare), ch), hints: seqHints(s),
        explain: `The bit that repeats is ${bitNames(s)}. So the missing one is ${NAME(q.tok)}.`,
      };
    },
  });
  def('gaps', {
    w: 0, name: 'Fill the gaps', base: { units: U1 },
    gen(p) {
      const s = makeSeq(p), n = Math.max(7, s.L * 3), cells = seqCells(s, n);
      const count = s.L <= 2 ? 2 : 3;
      const at = shuffle(Array.from({ length: n - s.L }, (_, i) => i + s.L)).slice(0, count).sort((a, b) => a - b);
      at.forEach(i => { cells[i].gap = true; });
      return {
        prompt: 'Fill the gaps.', mech: 'fill', scene: line([{ cells }], { unit: s.L }),
        slots: at.map(i => cells[i].id), palette: shuffle(s.pieces.concat(s.spare)), hints: seqHints(s),
        explain: `The bit that repeats is ${bitNames(s)}.`,
      };
    },
  });
  const SIZE_WORD = ['small', 'middle', 'big'], SIZE_OF = { S: 0, M: 1, B: 2 };
  def('size', {
    w: 0, name: 'Small and big', base: { sizeUnits: ['SB', 'BS'], ch: 2 },
    gen(p) {
      const unit = pick(p.sizeUnits || ['SB', 'BS']), base = pieceSet(1, p)[0], ch = p.ch || 3;
      const tok = c => ({ theme: 'size', base, s: SIZE_OF[c] });
      const letters = [...new Set(unit)];
      const s = { unit, L: unit.length, letters, map: {}, spare: [] };
      letters.forEach(L => { s.map[L] = tok(L); });
      s.pieces = letters.map(L => s.map[L]);
      const shown = Math.max(4, s.L * 2) + (p.partial ? rand(s.L) : 0);
      const cells = seqCells(s, shown + 1), q = cells[shown]; q.q = true;
      const said = unit.split('').map(c => SIZE_WORD[SIZE_OF[c]]).join(', ');
      return {
        prompt: 'What comes next?', mech: 'choose', scene: line([{ cells }], { unit: s.L }), target: q.id,
        opts: tokOpts(q.tok, ['S', 'M', 'B'].map(tok), ch).map(o => Object.assign(o, { say: SIZE_WORD[o.tok.s] })),
        hints: [{ show: 'units', text: 'Look at the sizes. A line goes under each bit that repeats.' },
          { show: 'labels', text: `Say it: ${said}, ${said}…` }, { text: 'Is the next one small, middle or big?' }],
        explain: `It goes ${said}, again and again. So next is ${SIZE_WORD[q.tok.s]}.`,
      };
    },
  });
  def('unit', {
    w: 0, name: 'Where it starts again', base: { units: U1 },
    gen(p) {
      const s = makeSeq(p), cells = seqCells(s, s.L * 3).map(c => Object.assign(c, { tap: true }));
      return {
        prompt: 'Tap the carriage where the pattern starts again.', mech: 'tap', scene: line([{ cells }], { unit: s.L }),
        rightIds: cells.filter((c, i) => i > 0 && i % s.L === 0).map(c => c.id), showRight: cells[s.L].id,
        hints: [{ show: 'labels', text: `Say the letters: ${spaced(s.unit)}… Where does ${s.unit[0]} ${s.unit.slice(1, 2)} come back?` },
          { text: `The bit is ${s.L} carriages long.` }, { show: 'units', text: 'A line goes under each bit. Where does the second line start?' }],
        explain: `The bit ${bitNames(s)} ends, then it starts again here.`,
      };
    },
  });
  def('bit', {
    w: 0, name: 'Which bit repeats', base: { units: U1, ch: 2 },
    gen(p) {
      const s = makeSeq(p), cells = seqCells(s, s.L * 3), ch = p.ch || 3;
      const rot = rotations(s.unit), cand = new Set();
      cand.add(s.unit + s.unit[0]);
      if (s.L >= 3) cand.add(s.unit.slice(0, -1));
      for (let i = 0; i + 1 < s.L; i++) { const a = s.unit.split(''); [a[i], a[i + 1]] = [a[i + 1], a[i]]; cand.add(a.join('')); }
      cand.add(s.unit[0] + s.unit);
      cand.add(s.unit + s.unit[s.L - 1]);
      const bad = shuffle([...cand].filter(x => x !== s.unit && !rot.has(structure(x.split(''))) && x.split('').every(L => s.map[L])));
      const toToks = u => u.split('').map(L => s.map[L]);
      const opts = shuffle([{ mini: toToks(s.unit), right: true, say: bitNames(s) }]
        .concat(bad.slice(0, ch - 1).map(u => ({ mini: toToks(u), right: false, say: words(toToks(u).map(NAME)) }))));
      return {
        prompt: 'Which bit repeats?', mech: 'choose', scene: line([{ cells }], { unit: s.L }), opts,
        hints: [{ show: 'labels', text: `Say it with letters: ${spaced(s.unit + s.unit)}…` }, { show: 'units', text: 'A line goes under each bit. Which bit is above each line?' },
          { text: 'The right bit, said again and again, makes the whole train.' }],
        explain: `${cap(bitNames(s))}: that bit repeats all the way along.`,
      };
    },
  });
  def('is', {
    w: 0, name: 'Is it a pattern', base: { units: U1 },
    gen(p) {
      const s = makeSeq(p), n = Math.max(6, s.L * 3), yes = Math.random() < 0.5;
      let toks = Array.from({ length: n }, (_, i) => s.at(i));
      if (!yes) {
        for (let t = 0; t < 60; t++) {
          toks = Array.from({ length: n }, (_, i) => s.at(i));
          const i = between(s.L, n - 1); let j = between(1, n - 1);
          if (s.L === 2 || Math.random() < 0.5) { const o = s.pieces.filter(x => !same(x, toks[i])); toks[i] = pick(o); }
          else [toks[i], toks[j]] = [toks[j], toks[i]];
          if (!periodOf(toks.map(K))) break;
        }
      }
      const letters = structure(toks.map(K));
      const cells = toks.map((t, i) => ({ id: `r0c${i}`, tok: t, letter: letters[i], u: yes ? Math.floor(i / s.L) : undefined, note: s.pieces.findIndex(x => same(x, t)) }));
      return {
        prompt: 'Is this a pattern?', mech: 'choose', scene: line([{ cells }], { unit: yes ? s.L : 0 }),
        opts: shuffle([{ text: 'Yes, it repeats', right: yes }, { text: 'No, it doesn’t', right: !yes }]),
        hints: [{ show: 'labels', text: 'Say it with letters. Does the same bit keep coming back?' },
          { text: 'A pattern repeats the same bit again and again, all the way along.' }],
        explain: yes ? `Yes. ${cap(bitNames(s))} repeats all the way along.` : 'No. No bit repeats all the way along.',
        noLight: !yes,
      };
    },
  });
  def('fix', {
    w: 0, name: 'Spot the wrong one', base: { units: U1 },
    gen(p) {
      const s = makeSeq(p, 0, Math.max(1, p.spare || 0)), n = Math.max(6, s.L * 3), cells = seqCells(s, n);
      const c = cells[between(s.L, n - 1)];
      const pool = s.pieces.concat(s.spare).filter(t => !same(t, c.tok));
      c.fixTo = c.tok; c.tok = pick(s.L === 2 ? pool.slice(0, 1).concat(pool.slice(0, 1), pool) : pool); c.wrong = true;
      cells.forEach(x => { x.tap = true; });
      return {
        prompt: 'One carriage is wrong. Tap it.', mech: 'tap', scene: line([{ cells }], { unit: s.L }), rightIds: [c.id],
        hints: seqHints(s, 'Say the pattern from the start. Stop when it sounds wrong.'),
        explain: `It should be ${NAME(c.fixTo)}. The bit that repeats is ${bitNames(s)}.`,
      };
    },
  });
  const ALL_UNITS = ['AB', 'AAB', 'ABB', 'ABC', 'AABB', 'ABCC', 'ABBC', 'AABC', 'ABCD', 'AAAB', 'ABBB'];
  def('same', {
    w: 0, name: 'Same pattern, other things', base: { units: ['AB', 'AAB'], ch: 2 },
    gen(p) {
      const unit = pick(p.units || ['AB', 'AAB']), ch = p.ch || 3, L = unit.length, n = L * 2;
      const letters = [...new Set(unit)];
      const setA = pieceSet(letters.length, p);
      const others = shuffle(ALL_UNITS.filter(u => !rotations(unit).has(structure(u.split(''))) && Math.abs(u.length - L) <= 1));
      const need = Math.max(letters.length, ...others.slice(0, ch - 1).map(u => new Set(u).size));
      const setB = pieceSet(need, p, setA[0].theme);
      const seqOf = (u, set) => Array.from({ length: n }, (_, i) => set['ABCD'.indexOf(u[i % u.length])]);
      const top = seqOf(unit, setA).map((t, i) => ({ id: `r0c${i}`, tok: t, u: Math.floor(i / L), note: letters.indexOf(unit[i % L]), letter: unit[i % L] }));
      const opts = shuffle([{ mini: seqOf(unit, setB), right: true }].concat(others.slice(0, ch - 1).map(u => ({ mini: seqOf(u, setB), right: false }))))
        .map(o => Object.assign(o, { say: words(o.mini.map(NAME)) }));
      return {
        prompt: 'Which train has the same pattern?', mech: 'choose', scene: line([{ cells: top }], { unit: L }), opts,
        hints: [{ show: 'labels', text: `Say this train with letters: ${spaced(unit + unit)}.` }, { text: 'Now say each answer with letters. Which one sounds the same?' }],
        explain: `Both go ${spaced(unit)}, ${spaced(unit)}. Different things, same pattern.`,
      };
    },
  });
  def('letters', {
    w: 0, name: 'Pattern letters', base: { units: ['AB', 'AAB', 'ABB'], ch: 2 },
    gen(p) {
      const s = makeSeq(p), n = s.L * 2, cells = seqCells(s, n), ch = p.ch || 3;
      const toLetters = u => spaced(Array.from({ length: n }, (_, i) => u[i % u.length]).join(''));
      const others = shuffle(ALL_UNITS.filter(u => !rotations(s.unit).has(structure(u.split(''))))).slice(0, ch - 1);
      const opts = shuffle([{ text: toLetters(s.unit), right: true, letters: true }].concat(others.map(u => ({ text: toLetters(u), right: false, letters: true }))));
      return {
        prompt: 'Which letters match this train?', mech: 'choose', scene: line([{ cells }], { unit: s.L }), opts,
        hints: [{ text: `Give the first piece the letter A. ${s.letters.length > 1 ? 'A new piece gets the next letter, B.' : ''}` },
          { show: 'labels', text: 'I’ve put the letters under the train.' }],
        explain: `It goes ${toLetters(s.unit)}: ${s.letters.map(L => `${L} is ${NAME(s.map[L])}`).join(', ')}.`,
      };
    },
  });
  def('make', {
    w: 0, name: 'Make the same pattern', base: { units: U1 },
    gen(p) {
      const unit = pick(p.units || U1), L = unit.length, n = L * 2, letters = [...new Set(unit)];
      const setA = pieceSet(letters.length, p), setB = pieceSet(letters.length + (p.spare || 0), p, setA[0].theme);
      const topToks = Array.from({ length: n }, (_, i) => setA[letters.indexOf(unit[i % L])]);
      const top = topToks.map((t, i) => ({ id: `r0c${i}`, tok: t, u: Math.floor(i / L), note: letters.indexOf(unit[i % L]), letter: unit[i % L] }));
      const want = structure(topToks.map(K));
      const bottom = Array.from({ length: n }, (_, i) => ({ id: `r1c${i}`, empty: true, u: Math.floor(i / L) }));
      return {
        prompt: 'Make the same pattern with these.', mech: 'build', n,
        scene: line([{ label: 'This train', cells: top }, { label: 'Your train', cells: bottom, build: true }], { unit: L }),
        palette: shuffle(setB), solution: Array.from({ length: n }, (_, i) => setB[letters.indexOf(unit[i % L])]),
        check(built) {
          if (built.length < n) return { ok: false, msg: `Fill all ${n} carriages, then press Check.` };
          const got = structure(built.map(K));
          if (got === want) return { ok: true };
          let i = 0; while (i < n && got[i] === want[i]) i++;
          const j = want.indexOf(want[i]);
          return { ok: false, cut: i, msg: j < i ? `Carriage ${i + 1} doesn’t fit. In the top train, carriage ${i + 1} is the same as carriage ${j + 1}.` : `Carriage ${i + 1} doesn’t fit. In the top train, carriage ${i + 1} is something new.` };
        },
        hints: [{ show: 'labels', text: `Say the top train with letters: ${spaced(unit + unit)}.` }, { text: 'Choose one new piece for A and one for B. Then follow the letters.' }],
        explain: `Your train goes ${spaced(unit)}, ${spaced(unit)}, the same as the top train.`,
      };
    },
  });
  def('own', {
    w: 0, name: 'Make your own pattern', base: {},
    gen(p) {
      const set = pieceSet(4, p), n = 8;
      const cells = Array.from({ length: n }, (_, i) => ({ id: `r0c${i}`, empty: true }));
      return {
        prompt: 'Make your own pattern.', mech: 'build', n, own: true, scene: line([{ label: 'Your train', cells, build: true }], {}),
        palette: set, solution: Array.from({ length: 6 }, (_, i) => set[[0, 0, 1][i % 3]]),
        check(built) {
          if (built.length < 4) return { ok: false, msg: 'Add some more carriages first.' };
          const keys = built.map(K);
          if (new Set(keys).size < 2) return { ok: false, msg: 'Use at least 2 different pieces.' };
          const per = periodOf(keys);
          if (!per) return { ok: false, msg: 'It doesn’t repeat yet. Make a bit, then make the same bit again.' };
          return { ok: true, explain: `It’s a pattern! The bit that repeats is ${words(built.slice(0, per).map(NAME))}.` };
        },
        hints: [{ text: 'Choose a bit, like red, blue. Then do the same bit again, and again.' }],
        explain: 'It’s a pattern!',
      };
    },
  });

  /* ================================================================
     World 2: Bead necklace – patterns that go round
     ================================================================ */
  const ring = (cells, extra) => Object.assign({ type: 'circle', cells }, extra || {});
  def('ringNext', {
    w: 1, name: 'Next bead', base: { units: U1, ch: 2 },
    gen(p) {
      const ch = p.ch || 3, s = makeSeq(Object.assign({}, p, { beads: true }), ch), n = ringN(s.L, p);
      const m = n - 2 >= 2 * s.L ? between(2 * s.L, n - 2) : Math.max(s.L + 1, n - 2), cells = seqCells(s, n, 0, 'c');
      cells.forEach((c, i) => { if (i === m) c.q = true; if (i > m) c.later = true; });
      return {
        prompt: 'Which bead goes on next?', mech: 'choose', scene: ring(cells, { unit: s.L }), target: cells[m].id,
        opts: tokOpts(cells[m].tok, s.pieces.concat(s.spare), ch),
        hints: seqHints(s, 'Start at the clasp at the top and go round the same way as a clock.'),
        explain: `The bit that repeats is ${bitNames(s)}. So next is the ${NAME(cells[m].tok)}.`,
      };
    },
  });
  def('ringMissing', {
    w: 1, name: 'Missing bead', base: { units: U1, ch: 2 },
    gen(p) {
      const ch = p.ch || 3, s = makeSeq(Object.assign({}, p, { beads: true }), ch), n = ringN(s.L, p);
      const cells = seqCells(s, n, 0, 'c'), q = cells[between(1, n - 1)]; q.q = true;
      return {
        prompt: 'Which bead is missing?', mech: 'choose', scene: ring(cells, { unit: s.L }), target: q.id,
        opts: tokOpts(q.tok, s.pieces.concat(s.spare), ch),
        hints: seqHints(s, 'Look at the beads on both sides of the gap.'),
        explain: `The bit that repeats is ${bitNames(s)}. So the missing bead is the ${NAME(q.tok)}.`,
      };
    },
  });
  def('ringFinish', {
    w: 1, name: 'Finish the necklace', base: { units: U1 },
    gen(p) {
      const s = makeSeq(Object.assign({}, p, { beads: true }), 0, p.spare || 0), n = ringN(s.L, p);
      const room = n - 2 * s.L, cells = seqCells(s, n, 0, 'c');
      const m = room >= 2 ? n - between(2, Math.min(5, room)) : Math.max(s.L + 1, n - 2);
      const slots = cells.slice(m).map(c => { c.gap = true; return c.id; });
      return {
        prompt: 'Finish the necklace.', mech: 'fill', scene: ring(cells, { unit: s.L, join: true }), slots,
        palette: shuffle(s.pieces.concat(s.spare)), hints: seqHints(s, 'Keep going round. The last bead must fit next to the first one.'),
        explain: `The bit that repeats is ${bitNames(s)}, and it joins up at the clasp.`,
      };
    },
  });
  def('ringFix', {
    w: 1, name: 'Wrong bead', base: { units: U1 },
    gen(p) {
      const s = makeSeq(Object.assign({}, p, { beads: true }), 0, 1), n = ringN(s.L, p), cells = seqCells(s, n, 0, 'c');
      const c = cells[between(s.L, n - 1)];
      c.fixTo = c.tok; c.tok = pick(s.pieces.concat(s.spare).filter(t => !same(t, c.tok))); c.wrong = true;
      cells.forEach(x => { x.tap = true; });
      return {
        prompt: 'One bead is wrong. Tap it.', mech: 'tap', scene: ring(cells, { unit: s.L }), rightIds: [c.id],
        hints: seqHints(s, 'Go round from the clasp, saying the beads. Stop when it sounds wrong.'),
        explain: `It should be the ${NAME(c.fixTo)}. The bit that repeats is ${bitNames(s)}.`,
      };
    },
  });
  def('ringJoin', {
    w: 1, name: 'Does it join up', base: { units: U1 },
    gen(p) {
      const s = makeSeq(Object.assign({}, p, { beads: true })), yes = Math.random() < 0.5;
      let n = ringN(s.L, p); if (!yes) n += between(1, s.L - 1);
      const cells = seqCells(s, n, 0, 'c');
      if (!yes) cells.forEach(c => { c.u = undefined; });
      const lastL = s.unit[(n - 1) % s.L], nextL = s.unit[n % s.L];
      return {
        prompt: 'Does this necklace join up all the way round?', mech: 'choose', scene: ring(cells, { unit: yes ? s.L : 0, join: true, joinBad: !yes }),
        opts: shuffle([{ text: 'Yes, it joins up', right: yes }, { text: 'No, it breaks at the clasp', right: !yes }]),
        hints: [{ text: 'Start at the clasp and go round. When you get back to the clasp, does the pattern carry on?' },
          { show: 'units', text: `The bit is ${s.L} beads long. Does it fit an exact number of times?` }],
        explain: yes ? `Yes. ${n} beads is ${n / s.L} lots of ${bitNames(s)}, so it joins up.`
          : `No. After the last bead the pattern needs the ${NAME(s.map[nextL])}, but the first bead is the ${NAME(s.map[s.unit[0]])}.`,
        noLight: !yes, lastL,
      };
    },
  });
  def('ringCount', {
    w: 1, name: 'Count the beads', base: { units: U1, ch: 3 },
    gen(p) {
      const s = makeSeq(Object.assign({}, p, { beads: true })), lo = Math.ceil(21 / s.L);
      const n = p.big ? s.L * between(lo, Math.max(lo + 3, Math.floor(50 / s.L))) : ringN(s.L, p), reps = n / s.L;
      const L = pick(s.letters), per = s.unit.split('').filter(x => x === L).length, ans = reps * per;
      const big = p.big && n > 20;
      const cells = seqCells(s, big ? s.L * 2 : n, 0, 'c');
      // A long necklace is laid out flat: the first two bits, then … up to the last bead.
      if (big) { cells.forEach((c, i) => { c.pos = i + 1; }); cells.push({ id: 'end', faint: true, pos: n, far: true }); }
      const cand = shuffle([...new Set([ans + 1, ans - 1, ans + per, ans - per, reps, n, ans + 2, ans * 2].filter(v => v > 0 && v !== ans))]);
      const opts = shuffle([ans].concat(cand.slice(0, (p.ch || 3) - 1))).map(v => ({ tok: numTok(v), right: v === ans, say: String(v) }));
      const nm = plural(NAME(s.map[L]));
      return {
        prompt: big ? `A long necklace has ${n} beads. It starts like this. How many ${nm}?` : `How many ${nm} are on the necklace?`,
        mech: 'choose', scene: big ? line([{ cells }], { unit: s.L, positions: true, style: 'beads' }) : ring(cells, { unit: s.L }), opts,
        hints: [{ show: 'units', text: `Each bit has ${per} ${per === 1 ? NAME(s.map[L]) : nm}.` },
          { text: big ? `${n} beads is ${reps} bits of ${s.L}.` : `Count the bits: there are ${reps}.` },
          { text: `${reps} bits × ${per} = ?` }],
        explain: `There are ${reps} bits, and each bit has ${per} ${per === 1 ? NAME(s.map[L]) : nm}. That makes ${ans}.`,
      };
    },
  });

  /* ================================================================
     World 3: Tile garden – patterns in rows and columns
     ================================================================ */
  const TILE_COLS = ['green', 'blue', 'yellow', 'orange', 'purple', 'pink', 'teal', 'brown', 'white'];
  function tileColours(k) {
    for (let t = 0; t < 50; t++) {
      const c = shuffle(TILE_COLS).slice(0, k);
      let ok = true;
      for (let i = 0; i < k && ok; i++) for (let j = i + 1; j < k; j++) if (clash(c[i], c[j])) ok = false;
      if (ok) return c;
    }
    return ['green', 'yellow', 'blue', 'white'].slice(0, k);
  }
  const HALF_MOTIFS = [[[0, 90], [270, 180]], [[180, 270], [90, 0]], [[0, 0], [180, 180]], [[90, 180], [0, 270]], [[0, 270], [90, 180]]];
  function tilePattern(p) {
    const pat = pick(p.pats || ['rows']);
    const [w, h] = p.size || [5, 4];
    let k = Array.isArray(p.k) ? pick(p.k) : (p.k || 2);
    let at, unit, text;
    if (pat === 'rows') { const c = tileColours(k); at = (r) => ({ theme: 'tile', col: c[r % k] }); unit = [1, k]; text = 'Each row is one colour, and the colours take turns going down.'; }
    else if (pat === 'cols') { const c = tileColours(k); at = (r, cc) => ({ theme: 'tile', col: c[cc % k] }); unit = [k, 1]; text = 'Each column is one colour, and the colours take turns going across.'; }
    else if (pat === 'checker') { k = 2; const c = tileColours(2); at = (r, cc) => ({ theme: 'tile', col: c[(r + cc) % 2] }); unit = [2, 2]; text = 'The two colours take turns along every row and down every column.'; }
    else if (pat === 'diag') { k = 3; const c = tileColours(3); const dir = Math.random() < 0.5 ? 1 : -1; at = (r, cc) => ({ theme: 'tile', col: c[((cc + dir * r) % 3 + 3) % 3] }); unit = [3, 3]; text = 'Each row is the row above, moved along by one. That makes stripes that go slantwise.'; }
    else if (pat === 'motif2' || pat === 'motif3') {
      const mw = pat === 'motif2' ? 2 : 3, kk = pat === 'motif2' ? pick([2, 3]) : 3, c = tileColours(kk);
      let m;
      for (let t = 0; t < 60; t++) {
        m = [0, 1].map(() => Array.from({ length: mw }, () => pick(c)));
        const used = new Set(m.flat());
        const rowsSame = m[0].join() === m[1].join(), colsUniform = m[0].every((x, i) => x === m[1][i]);
        const rowUniform = m.some(rw => new Set(rw).size === 1) && m.every(rw => new Set(rw).size === 1);
        const colUniformAll = Array.from({ length: mw }, (_, i) => m[0][i] === m[1][i]).every(Boolean);
        if (used.size >= Math.min(kk, mw * 2) - (pat === 'motif3' ? 1 : 0) && !rowsSame && !colsUniform && !rowUniform && !colUniformAll) break;
      }
      at = (r, cc) => ({ theme: 'tile', col: m[r % 2][cc % mw] }); unit = [mw, 2]; text = 'The same little block of tiles repeats across and down.';
    } else {
      const c = pick(['teal', 'blue', 'green', 'purple', 'orange']), mm = pick(HALF_MOTIFS);
      at = (r, cc) => ({ theme: 'tile', col: c, motif: 'half', col2: 'white', rot: mm[r % 2][cc % 2] }); unit = [2, 2];
      text = 'Each tile is turned. The same little block of turns repeats across and down.';
    }
    const tiles = [];
    for (let r = 0; r < h; r++) for (let cc = 0; cc < w; cc++) tiles.push(at(r, cc));
    return { pat, w, h, tiles, at, unit, text };
  }
  function tileCells(g) {
    return g.tiles.map((t, i) => { const r = Math.floor(i / g.w), c = i % g.w; return { id: `g${i}`, tok: t, r, c, u: Math.floor(r / g.unit[1]) * 100 + Math.floor(c / g.unit[0]) }; });
  }
  function tileOpts(right, g, ch) {
    let pool = uniqToks(g.tiles);
    if (g.pat === 'half') pool = pool.concat([0, 90, 180, 270].map(rot => Object.assign({}, right, { rot })));
    while (uniqToks(pool).length < ch) pool.push({ theme: 'tile', col: pick(TILE_COLS.filter(c => !pool.some(t => t.col === c))) });
    return tokOpts(right, uniqToks(pool), ch);
  }
  const tileHints = g => [{ show: 'row', text: 'Look along the row with the gap.' }, { show: 'col', text: 'Now look up and down the column.' }, { show: 'motif', text: g.text }];
  const grid = (g, cells, extra) => Object.assign({ type: 'grid', kind: 'tile', w: g.w, h: g.h, cells, unitBox: g.unit }, extra || {});
  const interior = (g, avoidFirst = true) => {
    const out = [];
    for (let r = avoidFirst ? 1 : 0; r < g.h; r++) for (let c = avoidFirst ? 1 : 0; c < g.w; c++) out.push(r * g.w + c);
    return out;
  };
  def('tileMissing', {
    w: 2, name: 'Missing tile', base: { pats: ['rows'], k: 2, ch: 2, size: [4, 4] },
    gen(p) {
      const g = tilePattern(p), cells = tileCells(g), q = cells[pick(interior(g))]; q.q = true;
      return {
        prompt: 'Which tile is missing?', mech: 'choose', scene: grid(g, cells, { focus: q.id }), target: q.id,
        opts: tileOpts(q.tok, g, p.ch || 3), hints: tileHints(g), explain: g.text,
      };
    },
  });
  def('tileGaps', {
    w: 2, name: 'Fill the tile gaps', base: { pats: ['rows', 'cols'], k: 2, size: [4, 4] },
    gen(p) {
      const g = tilePattern(p), cells = tileCells(g);
      const at = shuffle(interior(g)).slice(0, 3).sort((a, b) => a - b);
      at.forEach(i => { cells[i].gap = true; });
      let palette = uniqToks(g.tiles);
      if (g.pat === 'half') palette = uniqToks(palette.concat([0, 90, 180, 270].map(rot => Object.assign({}, g.tiles[0], { rot }))));
      return {
        prompt: 'Fill the gaps in the garden.', mech: 'fill', scene: grid(g, cells), slots: at.map(i => cells[i].id),
        palette: shuffle(palette), hints: tileHints(g), explain: g.text,
      };
    },
  });
  def('tileFix', {
    w: 2, name: 'Wrong tile', base: { pats: ['rows', 'cols'], k: 2, size: [4, 4] },
    gen(p) {
      const g = tilePattern(p), cells = tileCells(g), c = cells[pick(interior(g))];
      let pool = uniqToks(g.tiles).filter(t => !same(t, c.tok));
      if (g.pat === 'half') pool = [0, 90, 180, 270].map(rot => Object.assign({}, c.tok, { rot })).filter(t => !same(t, c.tok));
      if (!pool.length) pool = [{ theme: 'tile', col: TILE_COLS.find(x => x !== c.tok.col) }];
      c.fixTo = c.tok; c.tok = pick(pool); c.wrong = true;
      cells.forEach(x => { x.tap = true; });
      return {
        prompt: 'One tile is wrong. Tap it.', mech: 'tap', scene: grid(g, cells), rightIds: [c.id],
        hints: [{ show: 'motif', text: g.text }, { text: 'Check each row against the row above or below it.' }],
        explain: `That tile should be ${NAME(c.fixTo)}. ${g.text}`,
      };
    },
  });
  def('tileRow', {
    w: 2, name: 'Next row', base: { pats: ['rows'], k: 2, ch: 2, size: [4, 4] },
    gen(p) {
      const g = tilePattern(p), cells = tileCells(g), last = g.h - 1, ch = p.ch || 3;
      const rowOf = r => Array.from({ length: g.w }, (_, c) => g.at(r, c));
      cells.forEach(c => { if (c.r === last) c.q = true; });
      const right = rowOf(last), keyOf = r => r.map(K).join('|');
      const cands = [rowOf(last - 1), rowOf(last + 1), right.slice(1).concat([g.at(last, g.w)]), [g.at(last, -1 + g.w * 10)].concat(right.slice(0, -1)), rowOf(last + 2)];
      const seen = new Set([keyOf(right)]), wrong = [];
      cands.forEach(r => { const k2 = keyOf(r); if (!seen.has(k2)) { seen.add(k2); wrong.push(r); } });
      while (wrong.length < ch - 1) { const r = right.map(t => Object.assign({}, t, { col: pick(TILE_COLS) })); const k2 = keyOf(r); if (!seen.has(k2)) { seen.add(k2); wrong.push(r); } }
      const opts = shuffle([{ row: right, right: true }].concat(shuffle(wrong).slice(0, ch - 1).map(r => ({ row: r, right: false }))))
        .map(o => Object.assign(o, { say: words(o.row.map(NAME)) }));
      return {
        prompt: 'Which row comes next?', mech: 'choose', scene: grid(g, cells, { qRow: last }), target: 'row', opts,
        hints: [{ show: 'col', text: 'Look down each column. What comes after the last tile?' }, { show: 'motif', text: g.text }],
        explain: g.text,
      };
    },
  });
  def('tileMotif', {
    w: 2, name: 'The block that repeats', base: { pats: ['checker'], ch: 2, size: [4, 4] },
    gen(p) {
      const pp = Object.assign({}, p, { pats: (p.pats || ['checker']).filter(x => x === 'checker' || x === 'motif2').concat([]) });
      if (!pp.pats.length) pp.pats = ['motif2'];
      const g = tilePattern(pp), cells = tileCells(g), ch = p.ch || 3;
      const block = (r, c) => [g.at(r, c), g.at(r, c + 1), g.at(r + 1, c), g.at(r + 1, c + 1)];
      const keyB = b => b.map(K).join('|');
      const windows = new Set();
      for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) windows.add(keyB(block(r, c)));
      const right = block(0, 0), cols = [...new Set(g.tiles.map(t => t.col))];
      const wrong = [], seen = new Set(windows);
      const tryAdd = b => { const k2 = keyB(b); if (!seen.has(k2)) { seen.add(k2); wrong.push(b); } };
      tryAdd([right[0], right[1], right[0], right[1]]);
      tryAdd([right[0], right[0], right[1], right[1]]);
      tryAdd([right[1], right[0], right[3], right[2]].map((t, i) => i === 0 ? Object.assign({}, t, { col: pick(cols) }) : t));
      for (let t = 0; t < 30 && wrong.length < ch - 1; t++) tryAdd(right.map(x => Object.assign({}, x, { col: pick(cols.concat(['white'])) })));
      const opts = shuffle([{ block: right, right: true }].concat(wrong.slice(0, ch - 1).map(b => ({ block: b, right: false }))))
        .map(o => Object.assign(o, { say: words(o.block.map(NAME)) }));
      return {
        prompt: 'Which little block repeats to make this garden?', mech: 'choose', scene: grid(g, cells, { corner: true }), opts,
        hints: [{ text: 'Look at the 4 tiles in the top left corner.' }, { show: 'motif', text: 'I’ve drawn lines around each block that repeats.' }],
        explain: 'That block of 4 tiles repeats across and down to make the whole garden.',
      };
    },
  });

  /* ================================================================
     World 4: Block builder – growing patterns
     ================================================================ */
  const FAMS = {
    tower1: () => ({ name: 'tower', a: 1, d: 1, cells: k => Array.from({ length: k }, (_, y) => [0, y]) }),
    tower2: () => { const a = pick([1, 2]); return { name: 'tower', a, d: 2, cells: k => Array.from({ length: a + 2 * (k - 1) }, (_, y) => [0, y]) }; },
    tower3: () => { const a = pick([1, 2]); return { name: 'tower', a, d: 3, cells: k => Array.from({ length: a + 3 * (k - 1) }, (_, y) => [0, y]) }; },
    row2: () => ({ name: 'wall', a: 2, d: 2, cells: k => { const o = []; for (let x = 0; x < k; x++) o.push([x, 0], [x, 1]); return o; } }),
    row3: () => ({ name: 'wall', a: 3, d: 3, cells: k => { const o = []; for (let x = 0; x < k; x++) o.push([x, 0], [x, 1], [x, 2]); return o; } }),
    L: () => ({ name: 'L shape', a: 1, d: 2, cells: k => { const o = []; for (let y = 0; y < k; y++) o.push([0, y]); for (let x = 1; x < k; x++) o.push([x, 0]); return o; } }),
    cross: () => ({ name: 'cross', a: 1, d: 4, max: 4, centred: true, cells: k => { const o = [[0, 0]]; for (let i = 1; i < k; i++) o.push([-i, 0], [i, 0], [0, -i], [0, i]); return o; } }),
    stairs: () => ({ name: 'staircase', tri: true, cells: k => { const o = []; for (let x = 0; x < k; x++) for (let y = 0; y <= x; y++) o.push([x, y]); return o; } }),
    square: () => ({ name: 'square', sq: true, max: 5, cells: k => { const o = []; for (let x = 0; x < k; x++) for (let y = 0; y < k; y++) o.push([x, y]); return o; } }),
  };
  const BLOCK_COLS = ['orange', 'blue', 'green', 'purple', 'red', 'teal'];
  function family(p) {
    const f = FAMS[pick(p.fams || ['tower1'])]();
    f.col = pick(BLOCK_COLS);
    f.count = k => f.cells(k).length;
    f.linear = !f.tri && !f.sq;
    if (f.linear) { f.a = f.count(1); f.d = f.count(2) - f.count(1); }
    return f;
  }
  const fig = (f, k, extra) => Object.assign({ blocks: f.cells(k), col: f.col, label: `Step ${k}`, k }, extra || {});
  function figKey(blocks) { const xs = blocks.map(b => b[0]), ys = blocks.map(b => b[1]); const mx = Math.min(...xs), my = Math.min(...ys); return blocks.map(b => (b[0] - mx) + ',' + (b[1] - my)).sort().join(' '); }
  function growWrong(f, k) {
    const right = f.cells(k), out = [];
    out.push(f.cells(k - 1));
    if (f.linear && f.name === 'tower') { out.push(Array.from({ length: right.length + 1 }, (_, y) => [0, y])); out.push(Array.from({ length: right.length - 1 }, (_, y) => [0, y])); }
    else {
      const extra = right.slice(); const top = right.reduce((m, b) => b[1] > m[1] ? b : m, right[0]); extra.push([top[0], top[1] + 1]); out.push(extra);
      out.push(right.slice(0, -1));
      out.push(f.cells(k + 1));
    }
    const seen = new Set([figKey(right)]);
    return out.filter(b => { const kk = figKey(b); if (!b.length || seen.has(kk)) return false; seen.add(kk); return true; });
  }
  const figsScene = (figs, extra) => Object.assign({ type: 'figs', figs }, extra || {});
  const growHints = f => [
    { show: 'count', text: 'Count the blocks in each step.' },
    { show: 'add', text: f.linear ? `Each step adds ${f.d} block${f.d > 1 ? 's' : ''}. The new ones are lighter.` : 'Look at what is new in each step. The new blocks are lighter.' },
  ];
  function ruleWords(f) {
    if (f.tri) return 'add one more block than last time';
    if (f.sq) return 'the step number times itself';
    return `add ${f.d} block${f.d > 1 ? 's' : ''} each time`;
  }
  def('order', {
    w: 3, name: 'Shortest to tallest', base: { towers: 3 },
    gen(p) {
      const n = Array.isArray(p.towers) ? pick(p.towers) : (p.towers || 3), col = pick(BLOCK_COLS);
      const hs = shuffle(Array.from({ length: 6 }, (_, i) => i + 1)).slice(0, n);
      const figs = hs.map((h, i) => ({ id: `f${i}`, blocks: Array.from({ length: h }, (_, y) => [0, y]), col, tap: true, h }));
      const down = !!p.down;
      const order = figs.slice().sort((a, b) => down ? b.h - a.h : a.h - b.h).map(f => f.id);
      return {
        prompt: down ? 'Tap the towers from tallest to shortest.' : 'Tap the towers from shortest to tallest.', mech: 'order',
        scene: figsScene(figs, { order: true }), orderIds: order,
        hints: [{ show: 'count', text: 'Count the blocks in each tower.' }, { text: down ? 'Find the tallest tower first.' : 'Find the shortest tower first.' }],
        explain: `In order: ${order.map(id => figs.find(f => f.id === id).h).join(', ')} blocks.`,
      };
    },
  });
  def('grow', {
    w: 3, name: 'Next step', base: { fams: ['tower1'], ch: 2 },
    gen(p) {
      const f = family(p), ch = p.ch || 3, shown = f.max && f.max <= 4 ? 2 : 3;
      const figs = Array.from({ length: shown }, (_, i) => fig(f, i + 1)).concat([fig(f, shown + 1, { q: true })]);
      const opts = shuffle([{ fig: f.cells(shown + 1), right: true }].concat(growWrong(f, shown + 1).slice(0, ch - 1).map(b => ({ fig: b, right: false }))))
        .map(o => Object.assign(o, { col: f.col, say: `${o.fig.length} blocks` }));
      return {
        prompt: 'What comes next?', mech: 'choose', scene: figsScene(figs), target: `f${shown}`, opts,
        hints: growHints(f), explain: `It grows the same way each time: ${ruleWords(f)}. So step ${shown + 1} has ${f.count(shown + 1)} blocks.`,
      };
    },
  });
  def('growMissing', {
    w: 3, name: 'Missing step', base: { fams: ['tower1'], ch: 2 },
    gen(p) {
      const f = family(p), ch = p.ch || 3, total = f.max && f.max <= 4 ? 4 : 4, miss = between(2, total - 1);
      const figs = Array.from({ length: total }, (_, i) => fig(f, i + 1, i + 1 === miss ? { q: true } : {}));
      const opts = shuffle([{ fig: f.cells(miss), right: true }].concat(growWrong(f, miss).slice(0, ch - 1).map(b => ({ fig: b, right: false }))))
        .map(o => Object.assign(o, { col: f.col, say: `${o.fig.length} blocks` }));
      return {
        prompt: 'Which step is missing?', mech: 'choose', scene: figsScene(figs), target: `f${miss - 1}`, opts,
        hints: growHints(f), explain: `Step ${miss} has ${f.count(miss)} blocks: ${ruleWords(f)}.`,
      };
    },
  });
  def('growBuild', {
    w: 3, name: 'Build the next step', base: { fams: ['tower1'] },
    gen(p) {
      const f = family(p);
      let shown = f.max && f.max <= 4 ? 2 : 3;
      const size = k => { const r = f.cells(k + 1), mx = Math.min(...r.map(b => b[0])), my = Math.min(...r.map(b => b[1])); return { raw: r, mx, my, h: Math.max(...r.map(b => b[1])) - my + 2, w: Math.max(...r.map(b => b[0])) - mx + 2 }; };
      // Keep the squares big enough to tap: a very tall step becomes "build step 3" instead of 4.
      if (shown > 2 && Math.max(size(shown).h, size(shown).w) > 8) shown = 2;
      const { raw, mx, my } = size(shown), target = raw.map(b => [b[0] - mx, b[1] - my]);
      const W = Math.max(3, Math.max(...target.map(b => b[0])) + 2), H = Math.max(3, Math.max(...target.map(b => b[1])) + 2);
      const figs = Array.from({ length: shown }, (_, i) => fig(f, i + 1));
      const cells = [];
      for (let y = H - 1; y >= 0; y--) for (let x = 0; x < W; x++) cells.push({ id: `b${x}_${y}`, x, y });
      return {
        prompt: `Build step ${shown + 1}.`, mech: 'select', scene: figsScene(figs, { build: { w: W, h: H, cells, col: f.col, label: `Step ${shown + 1}` } }),
        want: target.map(b => `b${b[0]}_${b[1]}`), shiftOk: true, maxSel: target.length + 3,
        hints: [{ show: 'count', text: `Count the blocks. Step ${shown + 1} needs ${f.count(shown + 1)} blocks.` }, { show: 'add', text: 'The new blocks in each step are lighter. Add the same again.' },
          { show: 'ghost', text: 'I’ve shown faintly where the blocks go.' }],
        explain: `Step ${shown + 1} has ${f.count(shown + 1)} blocks: ${ruleWords(f)}.`,
      };
    },
  });
  function numOpts(ans, cands, ch) {
    const c = shuffle([...new Set(cands.filter(v => v !== ans && v >= 0 && Number.isFinite(v)))]);
    let i = 1; while (c.length < ch - 1) { if (!c.includes(ans + i) && ans + i !== ans) c.push(ans + i); i++; }
    return shuffle([ans].concat(c.slice(0, ch - 1))).map(v => ({ tok: numTok(v), right: v === ans, say: String(v) }));
  }
  def('growAdd', {
    w: 3, name: 'What is added', base: { fams: ['tower1', 'tower2'], ch: 2 },
    gen(p) {
      const fams = (p.fams || ['tower1']).filter(x => !['stairs', 'square'].includes(x));
      const f = family(Object.assign({}, p, { fams: fams.length ? fams : ['tower2'] }));
      const figs = [1, 2, 3].map(k => fig(f, k));
      return {
        prompt: 'How many blocks are added each time?', mech: 'choose', scene: figsScene(figs),
        opts: numOpts(f.d, [f.d + 1, f.d - 1, f.d + 2, f.count(2), f.count(3)], p.ch || 3),
        hints: growHints(f), explain: `Each step has ${f.d} more block${f.d > 1 ? 's' : ''} than the one before.`,
      };
    },
  });
  def('growCount', {
    w: 3, name: 'Blocks in step 5', base: { fams: ['tower1'], ch: 3 },
    gen(p) {
      const f = family(p), shown = 3, ask = f.max && f.max <= 4 ? 4 : 5;
      const figs = Array.from({ length: Math.min(shown, ask - 1) }, (_, i) => fig(f, i + 1));
      const ans = f.count(ask);
      return {
        prompt: `How many blocks will step ${ask} need?`, mech: 'choose', scene: figsScene(figs, { more: ask }),
        opts: numOpts(ans, [f.count(ask - 1), ans + 1, ans - 1, ans + (f.d || 2)], p.ch || 3),
        hints: growHints(f).concat([{ text: `Keep going: step ${figs.length + 1}, then step ${figs.length + 2}…` }]),
        explain: `${Array.from({ length: ask }, (_, i) => f.count(i + 1)).join(', ')}. Step ${ask} needs ${ans} blocks.`,
      };
    },
  });
  def('growTable', {
    w: 3, name: 'The table', base: { fams: ['tower2'], ch: 3 },
    gen(p) {
      const f = family(p), cols = 5, miss = between(3, 5), ans = f.count(miss);
      const table = { head: ['Step', 'Blocks'], cols: Array.from({ length: cols }, (_, i) => [i + 1, f.count(i + 1)]), ask: miss - 1 };
      const figs = [1, 2].map(k => fig(f, k, { small: true }));
      return {
        prompt: 'Which number is missing from the table?', mech: 'choose', scene: figsScene(figs, { table }), target: 'table',
        opts: numOpts(ans, [f.count(miss - 1), f.count(miss + 1), ans + 1, ans - 1], p.ch || 3),
        hints: [{ show: 'diffs', text: 'Look at how much the numbers go up by.' }, { text: f.linear ? `They go up by ${f.d} each time.` : 'The jumps get bigger each time.' }],
        explain: `${table.cols.map(c => c[1]).join(', ')}: ${ruleWords(f)}.`,
      };
    },
  });
  def('growFar', {
    w: 3, name: 'A step far away', base: { fams: ['tower1'], far: [10], ch: 3 },
    gen(p) {
      const f = family(Object.assign({}, p, { fams: (p.fams || ['tower1']).filter(x => !['cross'].includes(x) || true) }));
      const N = pick(p.far || [10]), ans = f.count(N);
      const table = { head: ['Step', 'Blocks'], cols: [1, 2, 3, 4].map(k => [k, f.count(k)]).concat([[N, null]]), ask: 4, gapBefore: true };
      const wrong = f.linear ? [f.d * N, f.a * N, ans + f.d, ans - f.d, f.count(N - 1)] : [f.count(N - 1), f.count(N + 1), N * 2, ans + N];
      return {
        prompt: `How many blocks will step ${N} need?`, mech: 'choose', scene: figsScene([1, 2].map(k => fig(f, k, { small: true })), { table }), target: 'table',
        opts: numOpts(ans, wrong, p.ch || 3),
        hints: f.linear
          ? [{ text: `Each step adds ${f.d}. Step 1 has ${f.a}.` }, { text: `From step 1 to step ${N} there are ${N - 1} jumps of ${f.d}.` }, { text: `${f.a} + ${N - 1} × ${f.d} = ?` }]
          : [{ text: f.sq ? 'Each step is a square: the step number times itself.' : 'Each step adds one more block than the step before.' }],
        explain: f.linear ? `Step ${N} = ${f.a} + ${N - 1} jumps of ${f.d} = ${ans} blocks.` : (f.sq ? `${N} × ${N} = ${ans} blocks.` : `${ans} blocks.`),
      };
    },
  });
  def('growRule', {
    w: 3, name: 'The rule for any step', base: { fams: ['tower2', 'tower3'], words: true, ch: 2 },
    gen(p) {
      const fams = (p.fams || ['tower2']).filter(x => !['stairs', 'square'].includes(x));
      const f = family(Object.assign({}, p, { fams: fams.length ? fams : ['tower2'] }));
      const c = f.a - f.d, sym = !!p.symbols && Math.random() < 0.6;
      const say = (d, cc) => sym ? `${d === 1 ? '' : d}n${cc > 0 ? ' + ' + cc : cc < 0 ? ' − ' + (-cc) : ''}`
        : `${d === 1 ? 'the step number' : d + ' × the step number'}${cc > 0 ? ', add ' + cc : cc < 0 ? ', take away ' + (-cc) : ''}`;
      const right = say(f.d, c);
      const cands = [say(f.d, c + 1), say(f.d + 1, c - 1), say(f.d, c - 1), say(f.d + 1, c), say(Math.max(1, f.d - 1), c + 1)];
      const wrong = shuffle([...new Set(cands)].filter(x => x !== right));
      const opts = shuffle([{ text: right, right: true }].concat(wrong.slice(0, (p.ch || 3) - 1).map(t => ({ text: t, right: false }))));
      const table = { head: ['Step', 'Blocks'], cols: [1, 2, 3, 4].map(k => [k, f.count(k)]) };
      return {
        prompt: sym ? 'Which rule gives the blocks for step n?' : 'Which rule gives the number of blocks for any step?', mech: 'choose',
        scene: figsScene([1, 2, 3].map(k => fig(f, k, { small: true })), { table }), opts,
        hints: [{ text: `It goes up by ${f.d} each time, so it is ${f.d} × the step number, and a bit more or less.` }, { text: 'Try the rule on step 1 and step 2. Do you get the right numbers?' }],
        explain: `${cap(right)}: step 1 = ${f.count(1)}, step 2 = ${f.count(2)}, step 3 = ${f.count(3)}.`,
      };
    },
  });

  /* ================================================================
     World 5: Number grid – number patterns
     ================================================================ */
  function numSeq(p) {
    const step = pick(p.steps || [1]);
    const back = !!p.back && Math.random() < 0.5;
    const d = back ? -step : step;
    let fmt = null;
    if (step === 0.5) fmt = 'half'; else if (step === 0.25) fmt = 'quarter'; else if (step % 1) fmt = 'dec1';
    const len = 6;
    let start;
    if (p.cross0 && Math.random() < 0.6) start = back ? step * between(1, 3) : -step * between(2, 4);
    else if (p.from0 && Math.random() < 0.6) start = back ? step * between(5, 10) : 0;
    else {
      const [lo, hi] = p.start || [0, 20];
      start = between(lo, hi);
      if (step >= 2 && step <= 10 && Math.random() < 0.5) start = Math.round(start / step) * step;
      if (fmt) start = between(0, 6) + (fmt === 'dec1' ? rand(10) / 10 : 0);
      if (back) start = Math.max(start, Math.abs(d) * (len + 1));
    }
    const at = i => Math.round((start + i * d) * 100) / 100;
    const rule = (d > 0 ? '+ ' : '− ') + T(Math.abs(d), fmt);
    const ruleSay = d > 0 ? `add ${T(Math.abs(d), fmt)}` : `take away ${T(Math.abs(d), fmt)}`;
    return { d, step, start, fmt, at, rule, ruleSay };
  }
  const stones = (cells, extra) => Object.assign({ type: 'line', style: 'stones', rows: [{ cells }] }, extra || {});
  const numHints = ns => [{ show: 'hops', text: 'Look at the jumps between the numbers.' }, { text: `Each jump is ${ns.rule}.` }];
  function numWrong(ns, ans) {
    const s = Math.abs(ns.d), r = v => Math.round(v * 100) / 100;
    return [r(ans + ns.d), r(ans - 2 * ns.d), r(ans + 1), r(ans - 1), r(ans + s * 2), r(ans + (ns.d > 0 ? -1 : 1) * (s > 1 ? 1 : 0.5))].filter(v => v !== ans && (ns.fmt || Number.isInteger(v)));
  }
  function numOptsSeq(ns, ans, ch) {
    const c = shuffle([...new Set(numWrong(ns, ans))]).filter(v => !(v < 0 && !ns.allowNeg && ns.start >= 0 && ans >= 0 && !ns.cross));
    return shuffle([ans].concat(c.slice(0, ch - 1))).map(v => ({ tok: numTok(v, ns.fmt), right: v === ans, say: T(v, ns.fmt).replace('−', 'minus ') }));
  }
  def('numNext', {
    w: 4, name: 'Next number', base: { steps: [1], start: [1, 10], ch: 2 },
    gen(p) {
      const ns = numSeq(p), shown = 5, ch = p.ch || 3;
      const cells = Array.from({ length: shown + 1 }, (_, i) => ({ id: `r0c${i}`, tok: numTok(ns.at(i), ns.fmt), hop: i ? ns.rule : null }));
      cells[shown].q = true;
      return {
        prompt: 'What comes next?', mech: 'choose', scene: stones(cells, { hops: true }), target: cells[shown].id,
        opts: numOptsSeq(ns, ns.at(shown), ch), hints: numHints(ns),
        explain: `Each jump is ${ns.rule}. So next is ${T(ns.at(shown), ns.fmt)}.`,
      };
    },
  });
  def('numMissing', {
    w: 4, name: 'Missing number', base: { steps: [1], start: [1, 10], ch: 2 },
    gen(p) {
      const ns = numSeq(p), n = 6, ch = p.ch || 3, g = between(2, n - 2);
      const cells = Array.from({ length: n }, (_, i) => ({ id: `r0c${i}`, tok: numTok(ns.at(i), ns.fmt), hop: i ? ns.rule : null }));
      cells[g].q = true;
      return {
        prompt: 'Which number is missing?', mech: 'choose', scene: stones(cells, { hops: true }), target: cells[g].id,
        opts: numOptsSeq(ns, ns.at(g), ch), hints: numHints(ns),
        explain: `Each jump is ${ns.rule}. So the missing number is ${T(ns.at(g), ns.fmt)}.`,
      };
    },
  });
  def('numFix', {
    w: 4, name: 'Wrong number', base: { steps: [1, 2], start: [1, 10] },
    gen(p) {
      const ns = numSeq(p), n = 6, g = between(2, n - 1);
      const cells = Array.from({ length: n }, (_, i) => ({ id: `r0c${i}`, tok: numTok(ns.at(i), ns.fmt), hop: i ? ns.rule : null, tap: true }));
      const right = ns.at(g), wrongV = pick(numWrong(ns, right).filter(v => v !== ns.at(g - 1) && v !== ns.at(g + 1) && v !== ns.at(g - 2)));
      cells[g].fixTo = cells[g].tok; cells[g].tok = numTok(wrongV, ns.fmt); cells[g].wrong = true;
      return {
        prompt: 'One number is wrong. Tap it.', mech: 'tap', scene: stones(cells, { hops: true }), rightIds: [cells[g].id],
        hints: [{ text: 'Check each jump from the start.' }, { text: `Every jump should be ${ns.rule}.` }],
        explain: `It should be ${T(right, ns.fmt)}. Every jump is ${ns.rule}.`,
      };
    },
  });
  const SKIP_LOOK = { 2: 'every other column', 3: 'slanting lines', 4: 'zigzag columns', 5: 'two stripes going down', 6: 'slanting columns', 9: 'a slanting line', 10: 'one stripe going down', 11: 'a slanting line' };
  function hundred(max, lit, extra) {
    const cells = [];
    for (let v = 1; v <= max; v++) cells.push({ id: `n${v}`, num: v, on: lit.includes(v), tap: true });
    return Object.assign({ type: 'grid', kind: 'num', w: 10, h: Math.ceil(max / 10), cells }, extra || {});
  }
  def('gridNext', {
    w: 4, name: 'Next on the hundred square', base: { grid: 30, steps: [2, 10] },
    gen(p) {
      const st = (p.steps || []).filter(s => Number.isInteger(s) && s >= 2), d = pick(st.length ? st : [2]);
      let start = d <= 5 && Math.random() < 0.5 ? d : pick([d, d, between(1, d)]);
      const maxGrid = Math.max(30, p.grid || 30);
      let count = between(3, 5);
      while (start + count * d > maxGrid && count > 2) count--;
      if (start + count * d > maxGrid) { start = Math.min(start, d); count = Math.max(1, Math.floor((maxGrid - start) / d)); }
      const lit = Array.from({ length: count }, (_, i) => start + i * d), next = start + count * d;
      const rows = Math.min(maxGrid / 10, Math.max(3, Math.ceil((next + 1) / 10) + 1));
      return {
        prompt: `Counting in ${d}s. Tap the next number.`, mech: 'tap', scene: hundred(rows * 10, lit), rightIds: [`n${next}`],
        hints: [{ text: `Count on ${d} from ${lit[lit.length - 1]}.` }, { show: 'path', text: 'The coloured numbers make a pattern on the grid. Where does it go next?' }],
        explain: `${lit.concat([next]).join(', ')}: counting in ${d}s.`,
      };
    },
  });
  def('gridShape', {
    w: 4, name: 'Which counting pattern', base: { grid: 50, steps: [2, 5, 10], ch: 2 },
    gen(p) {
      const choices = (p.steps || [2, 5, 10]).filter(s => Number.isInteger(s) && SKIP_LOOK[s]);
      const d = pick(choices), max = d >= 7 ? 100 : (p.grid || 50);
      const lit = []; for (let v = d; v <= max; v += d) lit.push(v);
      const wrong = shuffle(Object.keys(SKIP_LOOK).map(Number).filter(x => x !== d));
      const opts = shuffle([d].concat(wrong.slice(0, (p.ch || 3) - 1))).map(x => ({ text: `Counting in ${x}s`, right: x === d }));
      return {
        prompt: 'Which counting pattern is coloured in?', mech: 'choose', scene: hundred(max, lit, { still: true }), opts,
        hints: [{ text: `Look at the first coloured numbers: ${lit.slice(0, 3).join(', ')}.` }, { text: 'How far is it from one coloured number to the next?' }],
        explain: `Counting in ${d}s makes ${SKIP_LOOK[d]}.`,
      };
    },
  });

  /* ================================================================
     World 6: Pattern machine – rules
     ================================================================ */
  function makeRule(p) {
    const op = pick(p.ops || ['+']);
    if (op === '+') { const a = pick(p.adds || [1, 2, 3]); return { op, a, f: x => x + a, inv: y => y - a, text: `+ ${a}`, say: `add ${a}`, okIn: () => true }; }
    if (op === '-') { const a = pick(p.adds || [1, 2, 3]); return { op, a, f: x => x - a, inv: y => y + a, text: `− ${a}`, say: `take away ${a}`, okIn: x => x - a >= 0 }; }
    if (op === 'x') { const a = pick(p.mults || [2, 3, 5, 10]); return { op, a, f: x => x * a, inv: y => y / a, text: `× ${a}`, say: `times ${a}`, okIn: () => true }; }
    const a = pick((p.mults || [2, 3, 5, 10]).filter(m => m <= 10)); return { op: '/', a, f: x => x / a, inv: y => y * a, text: `÷ ${a}`, say: `divide by ${a}`, okIn: x => x % a === 0 };
  }
  function ruleInput(r, p) {
    const max = p.max || 20;
    for (let t = 0; t < 100; t++) {
      let x = between(1, r.op === 'x' ? Math.min(12, max) : max);
      if (r.op === '/') x = r.a * between(1, 10);
      if (r.okIn(x) && r.f(x) <= (r.op === 'x' ? 200 : 1000)) return x;
    }
    return r.op === '/' ? r.a * 2 : r.a + 5;
  }
  function ruleWrongTexts(r) {
    const a = r.a, out = [];
    if (r.op === '+') out.push(`+ ${a + 1}`, `− ${a}`, `× ${Math.max(2, a)}`, `+ ${Math.max(1, a - 1)}`);
    if (r.op === '-') out.push(`− ${a + 1}`, `+ ${a}`, `− ${Math.max(1, a - 1)}`, `÷ ${Math.max(2, a)}`);
    if (r.op === 'x') out.push(`+ ${a}`, `× ${a + 1}`, `× ${Math.max(2, a - 1)}`, `+ ${a * 2}`);
    if (r.op === '/') out.push(`− ${a}`, `÷ ${a + 1}`, `× ${a}`, `− ${a * 2}`);
    return [...new Set(out.filter(t => t !== r.text && !/[+−] 0$/.test(t) && !/[×÷] 1$/.test(t)))];
  }
  const parseRule = t => { const [o, v] = t.split(' '); const a = +v; return o === '+' ? x => x + a : o === '−' ? x => x - a : o === '×' ? x => x * a : x => x / a; };
  const machine = (extra) => Object.assign({ type: 'machine' }, extra);
  def('machineOut', {
    w: 5, name: 'What comes out', base: { ops: ['+'], adds: [1, 2], max: 10, ch: 2 },
    gen(p) {
      const r = p.two ? twoRule(p) : makeRule(p), x = ruleInput(r, p), y = r.f(x);
      return {
        prompt: 'What comes out of the machine?', mech: 'choose', scene: machine({ rule: r.text, rows: [{ inp: x, out: y, ask: 'out' }] }), target: 'out0',
        opts: numOpts(y, [x, y + 1, y - 1, r.inv ? r.inv(x) : x - 1, y + 2].filter(v => Number.isInteger(v)), p.ch || 3),
        hints: [{ text: `The machine does ${r.say} to every number.` }, { text: `${x} ${r.text} = ?` }],
        explain: `${x} ${r.text} = ${y}.`,
      };
    },
  });
  def('machineRule', {
    w: 5, name: 'What the machine does', base: { ops: ['+'], adds: [1, 2, 3], max: 10, ch: 2 },
    gen(p) {
      const r = makeRule(p), ch = p.ch || 3;
      const ins = []; for (let t = 0; ins.length < 3 && t < 60; t++) { const x = ruleInput(r, p); if (!ins.includes(x)) ins.push(x); }
      const rows = ins.map(x => ({ inp: x, out: r.f(x) }));
      const wrong = shuffle(ruleWrongTexts(r).filter(t => !rows.every(rw => parseRule(t)(rw.inp) === rw.out)));
      const opts = shuffle([{ text: r.text, right: true, card: true, say: r.say }].concat(wrong.slice(0, ch - 1).map(t => ({ text: t, right: false, card: true }))));
      return {
        prompt: 'What does the machine do?', mech: 'choose', scene: machine({ rule: '?', rows }), target: 'rule', opts,
        hints: [{ text: `Look at the first one: ${rows[0].inp} goes in and ${rows[0].out} comes out.` }, { text: 'Check your rule works for every row.' }],
        explain: `The machine does ${r.say}: ${rows.map(rw => `${rw.inp} → ${rw.out}`).join(', ')}.`,
      };
    },
  });
  def('machineIn', {
    w: 5, name: 'What went in', base: { ops: ['+'], adds: [1, 2, 10], max: 20, ch: 2 },
    gen(p) {
      const r = makeRule(p), x = ruleInput(r, p), y = r.f(x);
      return {
        prompt: 'What went into the machine?', mech: 'choose', scene: machine({ rule: r.text, rows: [{ inp: x, out: y, ask: 'in' }] }), target: 'in0',
        opts: numOpts(x, [r.f(y), x + 1, x - 1, y].filter(v => Number.isInteger(v) && v >= 0), p.ch || 3),
        hints: [{ text: `Work backwards. The machine did ${r.say}.` }, { text: `Undo it: what ${r.text} makes ${y}?` }],
        explain: `${x} ${r.text} = ${y}, so ${x} went in.`,
      };
    },
  });
  def('ruleFind', {
    w: 5, name: 'Find the rule', base: { ops: ['+'], adds: [1, 2, 10], max: 30, ch: 2 },
    gen(p) {
      const r = makeRule(Object.assign({}, p, { ops: (p.ops || ['+']).filter(o => o === '+' || o === '-' || o === 'x') }));
      let x = ruleInput(r, Object.assign({}, p, { max: r.op === 'x' ? 5 : (p.max || 30) }));
      if (r.op === '-') x = Math.max(x, r.a * 5 + between(0, 10));
      if (r.op === 'x') x = between(1, r.a >= 5 ? 2 : 4);
      const vals = [x]; for (let i = 1; i < 5; i++) vals.push(r.f(vals[i - 1]));
      const cells = vals.map((v, i) => ({ id: `r0c${i}`, tok: numTok(v), hop: i ? r.text : null }));
      const wrong = shuffle(ruleWrongTexts(r).filter(t => !vals.every((v, i) => i === 0 || parseRule(t)(vals[i - 1]) === v)));
      const opts = shuffle([{ text: r.text, right: true, card: true, say: r.say }].concat(wrong.slice(0, (p.ch || 3) - 1).map(t => ({ text: t, right: false, card: true }))));
      return {
        prompt: 'What is the rule?', mech: 'choose', scene: stones(cells), opts,
        hints: [{ show: 'hops', text: 'Look at how you get from one number to the next.' }, { text: 'Check the rule works for every jump.' }],
        explain: `The rule is ${r.say}: ${vals.join(', ')}.`,
      };
    },
  });
  def('ruleUse', {
    w: 5, name: 'Use the rule', base: { ops: ['+'], adds: [2, 10], max: 30, ch: 3 },
    gen(p) {
      const r = makeRule(Object.assign({}, p, { ops: (p.ops || ['+']).filter(o => o !== '/') }));
      let x = between(1, r.op === 'x' ? 3 : 20); if (r.op === '-') x = r.a * 4 + between(1, 20);
      const n = 4, vals = [x]; for (let i = 1; i < n; i++) vals.push(r.f(vals[i - 1]));
      const cells = vals.map((v, i) => ({ id: `r0c${i}`, tok: numTok(v), hop: i ? r.text : null, q: i > 0, dim: i > 0 && i < n - 1 }));
      return {
        prompt: `Start at ${x}. The rule is ${r.text}. What is the ${ord(n)} number?`, mech: 'choose', scene: stones(cells, { hops: true, rule: r.text }), target: `r0c${n - 1}`,
        opts: numOpts(vals[n - 1], [vals[n - 2], r.f(vals[n - 1]), vals[n - 1] + 1, vals[n - 1] - 1], p.ch || 3),
        hints: [{ text: `Do the rule once: ${x} ${r.text} = ${vals[1]}.` }, { text: `Keep going: ${vals[1]} ${r.text} = ${vals[2]}.` }],
        explain: `${vals.join(', ')}. The ${ord(n)} number is ${vals[n - 1]}.`,
      };
    },
  });
  const SPECIALS = {
    double: { name: 'doubling', make: () => { const s = pick([1, 2, 3, 5]); return [0, 1, 2, 3, 4, 5].map(i => s * 2 ** i); }, say: 'doubles each time' },
    halve: { name: 'halving', make: () => { const s = pick([64, 96, 128, 160, 80]); return [0, 1, 2, 3, 4].map(i => s / 2 ** i); }, say: 'halves each time' },
    square: { name: 'square numbers', make: () => [1, 2, 3, 4, 5, 6].map(i => i * i), say: 'is a square number: 1×1, 2×2, 3×3…' },
    cube: { name: 'cube numbers', make: () => [1, 2, 3, 4, 5].map(i => i * i * i), say: 'is a cube number: 1×1×1, 2×2×2…' },
    triangle: { name: 'add 1 more each time', make: () => [1, 2, 3, 4, 5, 6].map(i => i * (i + 1) / 2), say: 'adds 1 more than last time: +2, +3, +4…' },
    fib: { name: 'add the two before', make: () => { const a = [1, 1]; while (a.length < 7) a.push(a[a.length - 1] + a[a.length - 2]); return a; }, say: 'is the two numbers before it added together' },
    odd: { name: 'add 2 (odd numbers)', make: () => [1, 3, 5, 7, 9, 11], say: 'goes up by 2: the odd numbers' },
  };
  def('special', {
    w: 5, name: 'Special number patterns', base: { specials: ['double'], ch: 3 },
    gen(p) {
      const key = pick(p.specials || ['double']), sp = SPECIALS[key], vals = sp.make();
      const shown = vals.length - 1, ans = vals[shown];
      const cells = vals.map((v, i) => ({ id: `r0c${i}`, tok: numTok(v), q: i === shown }));
      if (p.mode === 'rule' || (p.ruleMix && Math.random() < 0.4)) {
        cells[shown].q = false;
        const names = shuffle(Object.keys(SPECIALS).filter(k => k !== key)).slice(0, (p.ch || 3) - 1).map(k => SPECIALS[k].name);
        return {
          prompt: 'Which pattern is this?', mech: 'choose', scene: stones(cells),
          opts: shuffle([{ text: sp.name, right: true }].concat(names.map(t => ({ text: t, right: false })))),
          hints: [{ show: 'hops', text: 'Look at how the numbers change.' }], explain: `Each number ${sp.say}.`,
        };
      }
      const prev = vals[shown - 1];
      return {
        prompt: 'What comes next?', mech: 'choose', scene: stones(cells), target: cells[shown].id,
        opts: numOpts(ans, [prev + (prev - vals[shown - 2]), ans + 1, ans - 1, prev * 2, prev + 2].filter(v => v > 0), p.ch || 3),
        hints: [{ show: 'hops', text: 'Look at how the numbers change. It isn’t the same jump each time.' }, { text: `Each number ${sp.say}.` }],
        explain: `Each number ${sp.say}. So next is ${ans}.`,
      };
    },
  });
  function twoRule(p) {
    const m = pick(p.mults2 || [2, 3, 10]), a = pick([1, 2, 3, 5]), plus = Math.random() < 0.6;
    return { op: 'two', m, a, plus, f: x => plus ? x * m + a : x * m - a, inv: y => plus ? (y - a) / m : (y + a) / m, text: `× ${m}, then ${plus ? '+' : '−'} ${a}`, say: `times ${m}, then ${plus ? 'add' : 'take away'} ${a}`, okIn: x => plus || x * m - a >= 0 };
  }
  def('twoStep', {
    w: 5, name: 'Two-step machine', base: { ch: 3 },
    gen(p) {
      const r = twoRule(p), x = between(1, 10), y = r.f(x);
      if (p.askRule && Math.random() < 0.5) {
        const rows = [x, x + between(1, 3), x + between(4, 6)].map(v => ({ inp: v, out: r.f(v) }));
        const alt = [`× ${r.m}, then ${r.plus ? '−' : '+'} ${r.a}`, `× ${r.m + 1}, then ${r.plus ? '+' : '−'} ${r.a}`, `+ ${r.a}, then × ${r.m}`];
        return {
          prompt: 'What does the machine do?', mech: 'choose', scene: machine({ rule: '?', rows, two: true }), target: 'rule',
          opts: shuffle([{ text: r.text, right: true, card: true }].concat(alt.slice(0, (p.ch || 3) - 1).map(t => ({ text: t, right: false, card: true })))),
          hints: [{ text: 'Try each rule on the first number. Then check the others.' }], explain: `The machine does ${r.say}.`,
        };
      }
      return {
        prompt: 'What comes out of the machine?', mech: 'choose', scene: machine({ rule: r.text, rows: [{ inp: x, out: y, ask: 'out' }], two: true }), target: 'out0',
        opts: numOpts(y, [x * r.m, r.plus ? (x + r.a) * r.m : (x - r.a) * r.m, y + 1, y - 1].filter(v => v >= 0), p.ch || 3),
        hints: [{ text: `First do × ${r.m}: ${x} × ${r.m} = ${x * r.m}.` }, { text: `Then ${r.plus ? 'add' : 'take away'} ${r.a}.` }],
        explain: `${x} × ${r.m} = ${x * r.m}, then ${r.plus ? '+' : '−'} ${r.a} = ${y}.`,
      };
    },
  });
  def('nth', {
    w: 5, name: 'Any number in the pattern', base: { nth: 'value', small: true, ch: 3 },
    gen(p) {
      const d = pick(p.small ? [2, 3, 5, 10] : [2, 3, 4, 5, 6, 7]), c = pick(p.small ? [0, 1, 2] : [-3, -2, -1, 0, 1, 2, 3, 5]);
      const a = d + c; const at = n => d * n + c;
      const vals = [1, 2, 3, 4].map(at);
      const cells = vals.map((v, i) => ({ id: `r0c${i}`, tok: numTok(v), pos: i + 1 }));
      const ruleMode = p.nth === 'rule' && Math.random() < 0.6;
      if (ruleMode) {
        const sym = (dd, cc) => `${dd === 1 ? '' : dd}n${cc > 0 ? ' + ' + cc : cc < 0 ? ' − ' + (-cc) : ''}`;
        const right = sym(d, c), wrong = shuffle([...new Set([sym(d, c + d), sym(1, a - 1), sym(d + 1, c - 1), sym(d, a), 'n + ' + d])].filter(t => t !== right));
        return {
          prompt: 'Which rule gives the nth number?', mech: 'choose', scene: stones(cells, { positions: true }),
          opts: shuffle([{ text: right, right: true, card: true }].concat(wrong.slice(0, (p.ch || 3) - 1).map(t => ({ text: t, right: false, card: true })))),
          hints: [{ show: 'hops', text: `It goes up by ${d}, so the rule starts with ${d}n.` }, { text: `Try n = 1: ${d} × 1 = ${d}. What do you add to get ${a}?` }],
          explain: `${right}: n = 1 gives ${at(1)}, n = 2 gives ${at(2)}, n = 3 gives ${at(3)}.`,
        };
      }
      const N = pick(p.small ? [10] : [10, 20, 50, 100]), ans = at(N);
      return {
        prompt: `What is the ${ord(N)} number in this pattern?`, mech: 'choose', scene: stones(cells.concat([{ id: 'far', tok: numTok(ans), q: true, pos: N, far: true }]), { positions: true, hops: true }), target: 'far',
        opts: numOpts(ans, [at(N + 1), at(N - 1), d * N, a + d * N, ans + 1].filter(v => v >= 0), p.ch || 3),
        hints: [{ show: 'hops', text: `It goes up by ${d} each time. Number 1 is ${a}.` }, { text: `From number 1 to number ${N} is ${N - 1} jumps of ${d}.` }, { text: `${a} + ${N - 1} × ${d} = ?` }],
        explain: `${a} + ${N - 1} × ${d} = ${ans}. (The rule is ${d} × n ${c >= 0 ? '+ ' + c : '− ' + (-c)}.)`,
      };
    },
  });

  /* ================================================================
     World 7: Mirror pond – turns, flips and mirrors
     ================================================================ */
  const TURN_SAY = { 90: 'a quarter turn clockwise', '-90': 'a quarter turn anticlockwise', 180: 'a half turn', 45: 'an eighth of a turn clockwise', '-45': 'an eighth of a turn anticlockwise', 135: 'three eighths of a turn' };
  function turnSeq(p) {
    const g = pick(p.gs || ['arrow']), col = pick(['blue', 'orange', 'green', 'purple', 'teal']), step = pick(p.turns || [90]);
    const start = pick([0, 90, 180, 270]);
    return { g, col, step, at: i => ({ theme: 'turn', g, col, deg: ((start + i * step) % 360 + 360) % 360 }), say: TURN_SAY[step] || `${step} degrees` };
  }
  const cards = (cells, extra) => Object.assign({ type: 'line', style: 'cards', rows: [{ cells }] }, extra || {});
  function turnOpts(ts, right, ch) {
    const steps = Math.abs(ts.step) % 90 ? 45 : 90;
    const pool = []; for (let d = 0; d < 360; d += steps) pool.push({ theme: 'turn', g: ts.g, col: ts.col, deg: d });
    return tokOpts(right, pool, ch);
  }
  def('turnNext', {
    w: 6, name: 'Next turn', base: { turns: [90], gs: ['arrow'], ch: 2 },
    gen(p) {
      const ts = turnSeq(p), shown = 4, cells = Array.from({ length: shown + 1 }, (_, i) => ({ id: `r0c${i}`, tok: ts.at(i), turnHint: i ? ts.step : null }));
      cells[shown].q = true;
      return {
        prompt: 'What comes next?', mech: 'choose', scene: cards(cells), target: cells[shown].id, opts: turnOpts(ts, cells[shown].tok, p.ch || 3),
        hints: [{ show: 'turns', text: 'Watch how it turns from one to the next.' }, { text: `Each time it turns ${ts.say}.` }],
        explain: `Each time it turns ${ts.say}.`,
      };
    },
  });
  def('turnMissing', {
    w: 6, name: 'Missing turn', base: { turns: [90], gs: ['arrow'], ch: 2 },
    gen(p) {
      const ts = turnSeq(p), n = 5, g = between(1, n - 2), cells = Array.from({ length: n }, (_, i) => ({ id: `r0c${i}`, tok: ts.at(i), turnHint: i ? ts.step : null }));
      cells[g].q = true;
      return {
        prompt: 'Which one is missing?', mech: 'choose', scene: cards(cells), target: cells[g].id, opts: turnOpts(ts, cells[g].tok, p.ch || 3),
        hints: [{ show: 'turns', text: 'Watch how it turns from one to the next.' }, { text: `Each time it turns ${ts.say}.` }],
        explain: `Each time it turns ${ts.say}.`,
      };
    },
  });
  def('flipNext', {
    w: 6, name: 'Flips', base: { flips: 'simple', ch: 2 },
    gen(p) {
      const g = pick(['boot', 'flag']), col = pick(['green', 'red', 'blue', 'purple']);
      const states = p.flips === 'simple' ? [{ flip: false, deg: 0 }, { flip: true, deg: 0 }]
        : pick([[{ flip: false, deg: 0 }, { flip: true, deg: 0 }, { flip: false, deg: 180 }], [{ flip: false, deg: 0 }, { flip: false, deg: 0 }, { flip: true, deg: 0 }], [{ flip: false, deg: 0 }, { flip: true, deg: 0 }, { flip: true, deg: 180 }, { flip: false, deg: 180 }]]);
      const tok = st => ({ theme: 'flip', g, col, flip: st.flip, deg: st.deg });
      const L = states.length, shown = L * 2 + (p.flips === 'simple' ? 0 : rand(L));
      const cells = Array.from({ length: shown + 1 }, (_, i) => ({ id: `r0c${i}`, tok: tok(states[i % L]), u: Math.floor(i / L), note: i % L }));
      cells[shown].q = true;
      const pool = [{ flip: false, deg: 0 }, { flip: true, deg: 0 }, { flip: false, deg: 180 }, { flip: true, deg: 180 }].map(tok);
      return {
        prompt: 'What comes next?', mech: 'choose', scene: cards(cells, { unit: L }), target: cells[shown].id, opts: tokOpts(cells[shown].tok, pool, p.ch || 3),
        hints: [{ show: 'units', text: 'Look for the bit that repeats.' }, { text: 'Is the next one the same way round, flipped over, or upside down?' }],
        explain: L === 2 ? 'It flips over, then back, again and again.' : 'The same bit of flips and turns repeats.',
      };
    },
  });
  const PIX_COLS = ['blue', 'green', 'orange', 'purple', 'red', 'teal'];
  function randomPic(w, h, cells, avoidSym) {
    for (let t = 0; t < 80; t++) {
      const on = new Set();
      let x = rand(w), y = rand(h); on.add(`${x},${y}`);
      while (on.size < cells) {
        const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]], [dx, dy] = pick(dirs);
        const nx = Math.min(w - 1, Math.max(0, x + dx)), ny = Math.min(h - 1, Math.max(0, y + dy));
        if (Math.random() < 0.7) { x = nx; y = ny; } else { const a = pick([...on]).split(',').map(Number); x = a[0]; y = a[1]; }
        on.add(`${x},${y}`);
      }
      const pic = [...on].map(s => s.split(',').map(Number));
      const flipH = pic.map(([a, b]) => `${w - 1 - a},${b}`).sort().join(' '), flipV = pic.map(([a, b]) => `${a},${h - 1 - b}`).sort().join(' ');
      const k = pic.map(([a, b]) => `${a},${b}`).sort().join(' ');
      if (!avoidSym || (flipH !== k && flipV !== k)) return pic;
    }
    return [[0, 0], [1, 0], [0, 1]];
  }
  const picKey = cells => cells.map(([a, b]) => `${a},${b}`).sort().join(' ');
  def('mirrorWhich', {
    w: 6, name: 'Mirror picture', base: { grid: 3, cells: [2, 3], axis: 'v', ch: 2 },
    gen(p) {
      const n = p.grid || 3, axis = (Array.isArray(p.axis) ? pick(p.axis) : p.axis) === 'h' ? 'h' : 'v', col = pick(PIX_COLS);
      const pic = randomPic(n, n, between(...(p.cells || [2, 3])), true);
      const mir = pic.map(([x, y]) => axis === 'v' ? [n - 1 - x, y] : [x, n - 1 - y]);
      const other = pic.map(([x, y]) => axis === 'v' ? [x, n - 1 - y] : [n - 1 - x, y]);
      const both = pic.map(([x, y]) => [n - 1 - x, n - 1 - y]);
      const cands = [pic, other, both], seen = new Set([picKey(mir)]), wrong = [];
      cands.forEach(c => { const k2 = picKey(c); if (!seen.has(k2)) { seen.add(k2); wrong.push(c); } });
      const opts = shuffle([{ pic: { w: n, h: n, on: mir, col }, right: true }].concat(wrong.slice(0, (p.ch || 3) - 1).map(c => ({ pic: { w: n, h: n, on: c, col }, right: false }))));
      return {
        prompt: 'Which picture is the mirror image?', mech: 'choose', scene: { type: 'mirror', w: n, h: n, on: pic, col, axis, side: true }, opts,
        hints: [{ text: axis === 'v' ? 'In a mirror, left and right swap over. Top stays at the top.' : 'In this mirror, top and bottom swap over. Left stays on the left.' },
          { show: 'mirror', text: 'Squares next to the mirror stay next to the mirror.' }],
        explain: axis === 'v' ? 'Left and right swap over, like your reflection.' : 'Top and bottom swap over, like a reflection in a pond.',
      };
    },
  });
  def('mirrorFinish', {
    w: 6, name: 'Finish the mirror picture', base: { grid: 4, cells: [2, 3], axis: 'v' },
    gen(p) {
      const n = p.grid || 4, axis = (Array.isArray(p.axis) ? pick(p.axis) : p.axis) || 'v', col = pick(PIX_COLS), half = Math.floor(n / 2), W = n, H = n;
      let given, want;
      const cellsN = between(...(p.cells || [2, 3]));
      if (axis === 'v') { const pic = randomPic(half, H, cellsN); given = pic; want = pic.map(([x, y]) => [n - 1 - x, y]); }
      else if (axis === 'h') { const pic = randomPic(W, half, cellsN).map(([x, y]) => [x, y]); given = pic; want = pic.map(([x, y]) => [x, n - 1 - y]); }
      else { const pic = randomPic(half, half, cellsN); given = pic; const s = new Set(); pic.forEach(([x, y]) => { s.add(`${n - 1 - x},${y}`); s.add(`${x},${n - 1 - y}`); s.add(`${n - 1 - x},${n - 1 - y}`); }); want = [...s].map(k => k.split(',').map(Number)); }
      const givenSet = new Set(given.map(([x, y]) => `${x},${y}`));
      const cells = [];
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const k = `${x},${y}`, mine = axis === 'v' ? x < half : axis === 'h' ? y < half : (x < half && y < half);
        cells.push({ id: `m${x}_${y}`, x, y, on: givenSet.has(k), tap: !mine });
      }
      return {
        prompt: axis === 'both' ? 'Finish the picture so it matches across both mirrors.' : 'Finish the picture so both sides match.', mech: 'select',
        scene: { type: 'mirror', w: W, h: H, cells, col, axis, build: true }, want: want.map(([x, y]) => `m${x}_${y}`), maxSel: want.length + 3,
        hints: [{ text: 'Take one coloured square at a time. How far is it from the mirror?' }, { show: 'mirror', text: 'Put its partner the same distance away on the other side.' },
          { show: 'ghost', text: 'I’ve shown faintly where the squares go.' }],
        explain: 'Each square has a partner the same distance from the mirror on the other side.',
      };
    },
  });
  def('mirrorLine', {
    w: 6, name: 'Where is the mirror line', base: { grid: 4, lines: ['v', 'none'], ch: 2 },
    gen(p) {
      const n = p.grid || 4, kind = pick(p.lines || ['v', 'none']), col = pick(PIX_COLS), half = n / 2;
      let on;
      if (kind === 'none') on = randomPic(n, n, between(4, 6), true);
      else {
        const base = randomPic(kind === 'h' ? n : half, kind === 'v' ? n : half, between(2, 4));
        const s = new Set(base.map(([x, y]) => `${x},${y}`));
        base.forEach(([x, y]) => { if (kind === 'v' || kind === 'both') s.add(`${n - 1 - x},${y}`); if (kind === 'h' || kind === 'both') s.add(`${x},${n - 1 - y}`); if (kind === 'both') s.add(`${n - 1 - x},${n - 1 - y}`); });
        on = [...s].map(k => k.split(',').map(Number));
        const k0 = picKey(on), fh = picKey(on.map(([x, y]) => [n - 1 - x, y])), fv = picKey(on.map(([x, y]) => [x, n - 1 - y]));
        const realBoth = fh === k0 && fv === k0;
        if (kind !== 'both' && realBoth) return KINDS.mirrorLine.gen(p);
      }
      const labels = { v: 'A line going up and down', h: 'A line going across', both: 'Both lines', none: 'No mirror line' };
      const pool = (p.lines || ['v', 'none']).concat(['v', 'h', 'none']);
      const wrong = shuffle([...new Set(pool)].filter(x => x !== kind)).slice(0, (p.ch || 3) - 1);
      const opts = shuffle([kind].concat(wrong)).map(x => ({ line: x, text: labels[x], right: x === kind, pic: { w: n, h: n, on, col, line: x } }));
      return {
        prompt: 'Where is the mirror line?', mech: 'choose', scene: { type: 'mirror', w: n, h: n, on, col, axis: null }, opts,
        hints: [{ text: 'Imagine folding the picture in half. Do the two halves land on each other?' }, { text: 'Try folding it down the middle, then across the middle.' }],
        explain: kind === 'none' ? 'However you fold it, the two halves don’t match.' : kind === 'both' ? 'It matches folded both ways.' : `Fold it ${kind === 'v' ? 'down the middle' : 'across the middle'} and the halves match.`,
      };
    },
  });

  /* ================================================================
     World 8: Puzzle grids – harder pattern spotting
     ================================================================ */
  const MSHAPES = ['circle', 'square', 'triangle', 'star', 'heart', 'diamond'];
  const MCOLS = ['red', 'blue', 'yellow', 'green', 'purple'];
  const mt = o => Object.assign({ theme: 'm', count: 1 }, o);
  const matrixScene = (cells, extra) => Object.assign({ type: 'grid', kind: 'matrix', w: 3, h: 3, cells }, extra || {});
  def('matrixLatin', {
    w: 7, name: 'Shape grid', base: { ch: 3 },
    gen(p) {
      const shapes = shuffle(MSHAPES).slice(0, 3), col = pick(MCOLS), shift = pick([1, 2]);
      const cells = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) cells.push({ id: `g${r * 3 + c}`, r, c, tok: mt({ shape: shapes[(c + r * shift) % 3], col }) });
      const q = cells[p.anyGap ? between(3, 8) : 8]; q.q = true;
      const pool = shapes.map(s => mt({ shape: s, col })).concat([mt({ shape: MSHAPES.find(s => !shapes.includes(s)), col })]);
      return {
        prompt: 'Which shape is missing?', mech: 'choose', scene: matrixScene(cells), target: q.id, opts: tokOpts(q.tok, pool, p.ch || 3),
        hints: [{ show: 'row', text: 'Every row has the same 3 shapes, in a different order.' }, { text: 'Which shape is not in that row yet?' }],
        explain: `Each row has a ${shapes.join(', a ')}. The missing one is the ${q.tok.shape}.`,
      };
    },
  });
  def('matrixTwo', {
    w: 7, name: 'Two-way grid', base: { attrs: ['shape', 'col'], ch: 3 },
    gen(p) {
      const attrs = p.attrs || ['shape', 'col'];
      const rowAttr = 'shape', colAttr = pick(attrs.filter(a => a !== 'shape'));
      const shapes = shuffle(MSHAPES).slice(0, 3), cols = shuffle(MCOLS).slice(0, 3), counts = [1, 2, 3], fills = ['', 'outline', ''];
      const baseCol = pick(MCOLS);
      const make = (r, c) => mt({ shape: shapes[r], col: colAttr === 'col' ? cols[c] : baseCol, count: colAttr === 'count' ? counts[c] : 1, fill: colAttr === 'fill' ? (c === 1 ? 'outline' : '') : '' });
      const cells = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) cells.push({ id: `g${r * 3 + c}`, r, c, tok: make(r, c) });
      if (colAttr === 'fill') { cells.forEach(cl => { cl.tok.fill = cl.c === 1 ? 'outline' : ''; cl.tok.col = cl.c === 2 ? cols[0] : baseCol; }); }
      const q = cells[p.anyGap ? between(4, 8) : 8]; q.q = true;
      const r = q.r, c = q.c;
      const pool = [make((r + 1) % 3, c), make(r, (c + 1) % 3), make((r + 1) % 3, (c + 1) % 3), make(r, (c + 2) % 3), make((r + 2) % 3, c)];
      if (colAttr === 'fill') pool.forEach(t => { t.fill = t.fill ? '' : 'outline'; });
      const what = { col: 'colour', count: 'number of shapes', fill: 'filling' }[colAttr];
      return {
        prompt: 'Which one is missing?', mech: 'choose', scene: matrixScene(cells), target: q.id, opts: tokOpts(q.tok, pool, p.ch || 3),
        hints: [{ show: 'row', text: 'Along each row the shape stays the same.' }, { show: 'col', text: `Down each column the ${what} stays the same.` }],
        explain: `It needs the shape from its row and the ${what} from its column.`,
      };
    },
  });
  def('oddOne', {
    w: 7, name: 'Odd one out', base: { odd: ['shape'] },
    gen(p) {
      const mode = pick(p.odd || ['shape', 'col']);
      const s1 = pick(MSHAPES), s2 = pick(MSHAPES.filter(s => s !== s1)), c1 = pick(MCOLS), c2 = pick(MCOLS.filter(c => c !== c1));
      let items, why;
      if (mode === 'shape') { const cs = shuffle(MCOLS).slice(0, 4); items = [0, 1, 2].map(i => mt({ shape: s1, col: cs[i] })).concat([mt({ shape: s2, col: cs[3] })]); why = `The others are all ${s1}s.`; }
      else if (mode === 'col') { const ss = shuffle(MSHAPES).slice(0, 4); items = [0, 1, 2].map(i => mt({ shape: ss[i], col: c1 })).concat([mt({ shape: ss[3], col: c2 })]); why = `The others are all ${c1}.`; }
      else if (mode === 'count') { const ss = shuffle(MSHAPES).slice(0, 4), cs = shuffle(MCOLS); const k = pick([2, 3]); items = [0, 1, 2].map(i => mt({ shape: ss[i], col: cs[i], count: k })).concat([mt({ shape: ss[3], col: cs[3], count: k === 2 ? 3 : 2 })]); why = `The others all have ${k} shapes.`; }
      else { const g = pick(['arrow', 'boot']), col = pick(['blue', 'green', 'orange']), d = pick([0, 90, 180, 270]); items = [0, 1, 2].map(() => ({ theme: 'turn', g, col, deg: d })).concat([{ theme: 'turn', g, col, deg: (d + pick([90, 180, 270])) % 360 }]); why = 'The others all point the same way.'; }
      const order = shuffle([0, 1, 2, 3]);
      const cells = order.map((i, j) => ({ id: `r0c${j}`, tok: items[i], tap: true, odd: i === 3 }));
      return {
        prompt: 'Which one is the odd one out? Tap it.', mech: 'tap', scene: cards(cells, { roomy: true }), rightIds: cells.filter(c => c.odd).map(c => c.id),
        hints: [{ text: 'Look at the shapes, the colours, how many there are and which way they point.' }, { text: 'Three of them have something the same. One doesn’t.' }],
        explain: why, noLight: true,
      };
    },
  });
  def('analogy', {
    w: 7, name: 'This changes to that', base: { changes: ['col'], ch: 3 },
    gen(p) {
      const change = pick(p.changes || ['col']);
      const sA = pick(MSHAPES), sC = pick(MSHAPES.filter(s => s !== sA)), cA = pick(MCOLS), cB = pick(MCOLS.filter(c => c !== cA));
      let a, b, c, d, wrong, say;
      if (change === 'col') { a = mt({ shape: sA, col: cA }); b = mt({ shape: sA, col: cB }); c = mt({ shape: sC, col: cA }); d = mt({ shape: sC, col: cB }); wrong = [mt({ shape: sA, col: cB }), c, mt({ shape: sC, col: pick(MCOLS.filter(x => x !== cA && x !== cB)) })]; say = `It changes from ${cA} to ${cB}.`; }
      else if (change === 'size') { a = mt({ shape: sA, col: cA }); b = mt({ shape: sA, col: cA, small: true }); c = mt({ shape: sC, col: cB }); d = mt({ shape: sC, col: cB, small: true }); wrong = [c, mt({ shape: sA, col: cB, small: true }), mt({ shape: sC, col: cA, small: true })]; say = 'It gets smaller.'; }
      else if (change === 'count') { const k = pick([1, 2]); a = mt({ shape: sA, col: cA, count: k }); b = mt({ shape: sA, col: cA, count: k + 1 }); c = mt({ shape: sC, col: cB, count: k }); d = mt({ shape: sC, col: cB, count: k + 1 }); wrong = [c, mt({ shape: sC, col: cB, count: k + 2 }), mt({ shape: sA, col: cB, count: k + 1 })]; say = 'It gets one more.'; }
      else if (change === 'fill') { a = mt({ shape: sA, col: cA }); b = mt({ shape: sA, col: cA, fill: 'outline' }); c = mt({ shape: sC, col: cB }); d = mt({ shape: sC, col: cB, fill: 'outline' }); wrong = [c, mt({ shape: sA, col: cB, fill: 'outline' }), mt({ shape: sC, col: cA, fill: 'outline' })]; say = 'The colour is taken out, leaving the outline.'; }
      else {
        const g1 = pick(['arrow', 'boot']), g2 = g1 === 'arrow' ? 'boot' : 'arrow', col = pick(['blue', 'green', 'orange', 'purple']);
        if (change === 'flip') { a = { theme: 'flip', g: 'boot', col, flip: false }; b = { theme: 'flip', g: 'boot', col, flip: true }; c = { theme: 'flip', g: 'flag', col: 'red', flip: false }; d = { theme: 'flip', g: 'flag', col: 'red', flip: true }; wrong = [c, { theme: 'flip', g: 'flag', col: 'red', flip: false, deg: 180 }, { theme: 'flip', g: 'flag', col: 'red', flip: true, deg: 180 }]; say = 'It flips over, like a mirror.'; }
        else { const d0 = pick([0, 90, 180, 270]), t = pick([90, 180]); a = { theme: 'turn', g: g1, col, deg: d0 }; b = { theme: 'turn', g: g1, col, deg: (d0 + t) % 360 }; c = { theme: 'turn', g: g2, col: 'red', deg: d0 }; d = { theme: 'turn', g: g2, col: 'red', deg: (d0 + t) % 360 }; wrong = [c, { theme: 'turn', g: g2, col: 'red', deg: (d0 + t + 90) % 360 }, { theme: 'turn', g: g2, col: 'red', deg: (d0 + t + 180) % 360 }]; say = t === 90 ? 'It turns a quarter turn clockwise.' : 'It turns a half turn.'; }
      }
      return {
        prompt: 'This changes into this. What does this change into?', mech: 'choose', scene: { type: 'analogy', a, b, c }, target: 'd',
        opts: tokOpts(d, wrong, p.ch || 3),
        hints: [{ text: 'Look at the first pair. What is different about the second one?' }, { text: 'Do the same change to the third one.' }],
        explain: say,
      };
    },
  });
  def('twoThings', {
    w: 7, name: 'Two patterns at once', base: { ch: 3 },
    gen(p) {
      const su = pick(p.u1 || ['AB', 'ABC']), cu = pick((p.u2 || ['AB', 'ABC', 'AAB']).filter(u => u.length !== su.length || u !== su));
      const shapes = shuffle(MSHAPES).slice(0, 3), cols = shuffle(MCOLS).slice(0, 3);
      const at = i => mt({ shape: shapes['ABC'.indexOf(su[i % su.length])], col: cols['ABC'.indexOf(cu[i % cu.length])] });
      const shown = Math.max(6, su.length * cu.length > 6 ? 6 : su.length * cu.length), cells = Array.from({ length: shown + 1 }, (_, i) => ({ id: `r0c${i}`, tok: at(i) }));
      cells[shown].q = true;
      const right = at(shown), sNext = right.shape, cNext = right.col;
      const pool = [mt({ shape: sNext, col: pick(cols.filter(c => c !== cNext)) }), mt({ shape: pick(shapes.filter(s => s !== sNext)), col: cNext }), mt({ shape: pick(shapes.filter(s => s !== sNext)), col: pick(cols.filter(c => c !== cNext)) })];
      const sayU = (u, list) => u.split('').map(L => list['ABC'.indexOf(L)]).join(', ');
      return {
        prompt: 'What comes next? Watch the shape and the colour.', mech: 'choose', scene: cards(cells), target: cells[shown].id, opts: tokOpts(right, pool, p.ch || 3),
        hints: [{ text: `Just look at the shapes: ${sayU(su, shapes)}… What shape is next?` }, { text: `Now just the colours: ${sayU(cu, cols)}… What colour is next?` }],
        explain: `The shapes go ${sayU(su, shapes)}. The colours go ${sayU(cu, cols)}. So next is a ${cNext} ${sNext}.`,
      };
    },
  });
  def('far', {
    w: 7, name: 'Far along the train', base: { far: [10, 12], units: U1, ch: 2 },
    gen(p) {
      const s = makeSeq(Object.assign({ units: ['AB', 'ABC', 'AAB', 'ABB', 'AABB', 'ABCD'] }, p)), N = pick(p.far || [10, 12]);
      const shown = s.L * 2, cells = seqCells(s, shown).map((c, i) => Object.assign(c, { pos: i + 1 }));
      const ans = s.at(N - 1), posIn = ((N - 1) % s.L) + 1, lastEnd = Math.floor((N - 1) / s.L) * s.L;
      return {
        prompt: `What will carriage ${N} carry?`, mech: 'choose', scene: line([{ cells: cells.concat([{ id: 'far', q: true, tok: ans, pos: N, far: true }]) }], { unit: s.L, positions: true }), target: 'far',
        opts: tokOpts(ans, s.pieces.concat(s.spare), Math.min(p.ch || 3, Math.max(2, s.pieces.length))),
        hints: [{ show: 'units', text: `The bit is ${s.L} carriages long.` }, { text: `Bits end at carriage ${s.L}, ${s.L * 2}, ${s.L * 3}… and ${lastEnd || s.L}.` }, { text: `So carriage ${N} is number ${posIn} in the bit.` }],
        explain: `Bits end at carriage ${s.L}, ${s.L * 2}, ${s.L * 3}… ${lastEnd}. Carriage ${N} is number ${posIn} in the bit: ${NAME(ans)}.`,
      };
    },
  });

  /* ================================================================
     The worlds and their levels

     How the levels are built (Kas, 15 Nov 2026: "once you show how something
     is done, there should be many levels of the same way"):
     - Each world is a list of blocks. A block is ONE kind of puzzle, played on
       its own for several levels. The owl shows a kind the first time it comes.
     - Inside a block every level changes just one thing from the level before
       (a longer bit, one more answer, a bigger necklace, a new picture set).
     - A new kind always starts with its simplest version.
     - H(...) blocks are harder levels of a kind he already knows (no owl).
     - Old kinds come back only as warm-ups and "Remember this one?" puzzles.
     ================================================================ */
  const TH1 = ['colours'], TH2 = ['colours', 'shapes'], TH3 = ['colours', 'shapes', 'fruit', 'animals'];
  const R8 = { ringMin: 8, ringMax: 8 }, R12 = { ringMin: 8, ringMax: 12 }, R16 = { ringMin: 8, ringMax: 16 }, R20 = { ringMin: 10, ringMax: 20 };
  const EASY3 = ['AB', 'AAB', 'ABB', 'ABC'];
  const B = (k, ...subs) => ({ k, subs });
  const H = (k, ...subs) => ({ k, subs, harder: true });
  const S = (say, p) => ({ say, p });

  const WORLDS = [
    { id: 'train', name: 'Train world', short: 'Train', col: '#D9776A', tint: '#EEF4F7', intro: 'Patterns in a line, like carriages on a train.',
      fact: 'A pattern is a bit that repeats, in the same order, again and again.',
      blocks: [
        B('copy',
          S('Two colours, with faint guides', { units: U1, themes: TH1, ghost: true }),
          S('Two colours, no guides', { units: U1, themes: TH1 }),
          S('Colours or shapes', { units: U1, themes: TH2 }),
          S('Bits of three (A A B or A B B)', { units: U2, themes: TH2 })),
        B('next',
          S('Two colours, 2 answers', { units: U1, themes: TH1, ch: 2 }),
          S('Colours or shapes', { units: U1, themes: TH2, ch: 2 }),
          S('3 answers to choose from', { units: U1, themes: TH2, ch: 3 }),
          S('Bits of three (A A B or A B B)', { units: U2, themes: TH2, ch: 3 }),
          S('Three different pieces (A B C)', { units: ['ABC'], themes: TH2, ch: 3 }),
          S('All of these, with fruit and animals too', { units: EASY3, themes: TH3, ch: 3 }),
          S('The train can stop half-way through a bit', { units: EASY3, themes: TH3, ch: 3, partial: true })),
        B('carry',
          S('Two pieces', { units: U1, themes: TH2 }),
          S('Bits of three', { units: U2, themes: TH2 }),
          S('Three different pieces', { units: ['ABC'], themes: TH2 }),
          S('An extra piece that does not belong', { units: EASY3, themes: TH3, spare: 1 })),
        B('missing',
          S('Two pieces, 2 answers', { units: U1, themes: TH2, ch: 2 }),
          S('3 answers to choose from', { units: U1, themes: TH2, ch: 3 }),
          S('Bits of three', { units: U2, themes: TH2, ch: 3 }),
          S('Three different pieces', { units: ['ABC'], themes: TH2, ch: 3 }),
          S('All of these, more kinds of pictures', { units: EASY3, themes: TH3, ch: 3 })),
        B('gaps',
          S('Two pieces, 2 gaps', { units: U1, themes: TH2 }),
          S('Bits of three, 2 gaps', { units: U2, themes: TH2 }),
          S('Three different pieces, 3 gaps', { units: ['ABC'], themes: TH2 }),
          S('An extra piece that does not belong', { units: EASY3, themes: TH3, spare: 1 })),
        B('size',
          S('Small, big, small, big', { sizeUnits: ['SB', 'BS'], themes: TH2, ch: 2 }),
          S('Bits of three (small, small, big)', { sizeUnits: ['SSB', 'SBB', 'BBS', 'BSS'], themes: TH2, ch: 2 }),
          S('A middle size too, 3 answers', { sizeUnits: ['SMB', 'BMS', 'MSB'], themes: TH2, ch: 3 })),
        B('fix',
          S('Two pieces', { units: U1, themes: TH2 }),
          S('Bits of three', { units: U2, themes: TH2 }),
          S('Three different pieces', { units: ['ABC'], themes: TH2 }),
          S('All of these, more kinds of pictures', { units: EASY3, themes: TH3 })),
        B('unit',
          S('Two pieces', { units: U1, themes: TH2 }),
          S('Bits of three', { units: U2, themes: TH2 }),
          S('Bits of three or four (A B C, A A B B)', { units: ['ABC', 'AABB'], themes: TH2 })),
        B('bit',
          S('Two pieces, 2 answers', { units: U1, themes: TH2, ch: 2 }),
          S('Bits of three, 2 answers', { units: U2, themes: TH2, ch: 2 }),
          S('Bits of three or four, 3 answers', { units: ['ABC', 'AABB'], themes: TH2, ch: 3 })),
        B('is',
          S('Two pieces', { units: U1, themes: TH2 }),
          S('Bits of three', { units: U2.concat(['ABC']), themes: TH2 }),
          S('All of these, more kinds of pictures', { units: EASY3.concat(['AABB']), themes: TH3 })),
        B('same',
          S('Short trains, 2 answers', { units: ['AB', 'AAB', 'ABB'], themes: TH2, ch: 2 }),
          S('3 answers to choose from', { units: ['AB', 'AAB', 'ABB'], themes: TH2, ch: 3 }),
          S('Longer bits, more kinds of pictures', { units: EASY3, themes: TH3, ch: 3 })),
        B('letters',
          S('Short trains, 2 answers', { units: ['AB', 'AAB', 'ABB'], themes: TH2, ch: 2 }),
          S('3 answers to choose from', { units: ['AB', 'AAB', 'ABB'], themes: TH2, ch: 3 }),
          S('Longer bits, more kinds of pictures', { units: EASY3.concat(['AABB']), themes: TH3, ch: 3 })),
        B('make',
          S('Two pieces', { units: U1, themes: TH2 }),
          S('Bits of three', { units: U2, themes: TH2 }),
          S('Three or four pieces', { units: ['ABC', 'AABB'], themes: TH3 })),
        B('own',
          S('Any pattern he likes', { themes: TH2 }),
          S('More kinds of pictures', { themes: TH3 })),
        H('next', S('Bits of four (A A B B, A B C D)', { units: ['AABB'].concat(U4), themes: TH3, ch: 3 })),
        H('next', S('Bits of four, 4 answers, an extra piece', { units: ['AABB'].concat(U4), ch: 4, spare: 1, partial: true })),
        H('missing', S('Bits of four, 4 answers', { units: ['AABB'].concat(U4), ch: 4, spare: 1 })),
        H('gaps', S('Bits of four', { units: ['AABB'].concat(U4), spare: 1 })),
        H('fix', S('Bits of four', { units: ['AABB'].concat(U4), spare: 1 })),
        H('next', S('Bits of five', { units: U5, ch: 4, spare: 1, partial: true })),
      ] },
    { id: 'necklace', name: 'Bead necklace', short: 'Necklace', col: '#D98BB0', tint: '#F4EFE8', intro: 'Patterns that go round in a circle, like beads on a necklace.',
      fact: 'A pattern that goes round in a circle only joins up if the bit fits an exact number of times.',
      blocks: [
        B('ringNext',
          S('Small necklace of 8 beads, 2 answers', Object.assign({ units: U1, ch: 2 }, R8)),
          S('Bigger necklaces, up to 12 beads', Object.assign({ units: U1, ch: 2 }, R12)),
          S('3 answers to choose from', Object.assign({ units: U1, ch: 3 }, R12)),
          S('Bits of three (A A B or A B B)', Object.assign({ units: U2, ch: 3 }, R12)),
          S('Three different beads (A B C)', Object.assign({ units: ['ABC'], ch: 3 }, R12))),
        B('ringFinish',
          S('Small necklace, two beads', Object.assign({ units: U1 }, R8)),
          S('Up to 12 beads', Object.assign({ units: U1 }, R12)),
          S('Bits of three', Object.assign({ units: U2 }, R12)),
          S('Three different beads', Object.assign({ units: ['ABC'] }, R12))),
        B('ringMissing',
          S('Small necklace, 2 answers', Object.assign({ units: U1, ch: 2 }, R8)),
          S('Up to 12 beads', Object.assign({ units: U1, ch: 2 }, R12)),
          S('3 answers to choose from', Object.assign({ units: U1, ch: 3 }, R12)),
          S('Bits of three', Object.assign({ units: U2.concat(['ABC']), ch: 3 }, R12))),
        B('ringFix',
          S('Small necklace', Object.assign({ units: U1 }, R8)),
          S('Up to 12 beads', Object.assign({ units: U1 }, R12)),
          S('Bits of three', Object.assign({ units: U2.concat(['ABC']) }, R12))),
        B('ringJoin',
          S('Small necklace', Object.assign({ units: U1 }, R8)),
          S('Up to 12 beads', Object.assign({ units: U1 }, R12)),
          S('Bits of three', Object.assign({ units: U2.concat(['ABC']) }, R12))),
        B('ringCount',
          S('Small necklace, 2 answers', Object.assign({ units: U1, ch: 2 }, R8)),
          S('Up to 12 beads, 3 answers', Object.assign({ units: U1, ch: 3 }, R12)),
          S('Bits of three', Object.assign({ units: U2, ch: 3 }, R12)),
          S('Bits of three or four, up to 16 beads', Object.assign({ units: ['ABC', 'AABB'], ch: 3 }, R16)),
          S('A long necklace (25 to 50 beads)', { units: U1.concat(U2), ch: 3, big: true }),
          S('Long necklaces with longer bits, 4 answers', { units: ['ABC', 'AABB'].concat(U4), ch: 4, big: true })),
        H('ringNext', S('Bits of four, up to 16 beads, 4 answers', Object.assign({ units: ['AABB'].concat(U4), ch: 4, spare: 1 }, R16))),
        H('ringMissing', S('Bits of four, 4 answers', Object.assign({ units: ['AABB'].concat(U4), ch: 4, spare: 1 }, R16))),
        H('ringFinish', S('Bits of four or five, up to 20 beads', Object.assign({ units: U4.concat(U5), spare: 1 }, R20))),
        H('ringFix', S('Bits of four or five', Object.assign({ units: U4.concat(U5) }, R20))),
      ] },
    { id: 'tiles', name: 'Tile garden', short: 'Tiles', col: '#6BAF85', tint: '#EEF4EC', intro: 'Patterns that go across and down, like tiles on a garden path.',
      fact: 'A pattern can repeat in two directions at once: across and down.',
      blocks: [
        B('tileMissing',
          S('Stripes going across, 2 colours, 2 answers', { pats: ['rows'], k: 2, size: [4, 4], ch: 2 }),
          S('Stripes going down', { pats: ['cols'], k: 2, size: [4, 4], ch: 2 }),
          S('Across or down, 3 answers', { pats: ['rows', 'cols'], k: 2, size: [5, 4], ch: 3 }),
          S('Three colours', { pats: ['rows', 'cols'], k: 3, size: [5, 4], ch: 3 }),
          S('Chessboard pattern', { pats: ['checker'], size: [5, 4], ch: 3 }),
          S('Slanting stripes', { pats: ['diag'], size: [5, 5], ch: 3 })),
        B('tileGaps',
          S('Stripes, 2 colours', { pats: ['rows', 'cols'], k: 2, size: [4, 4] }),
          S('Three colours', { pats: ['rows', 'cols'], k: 3, size: [5, 4] }),
          S('Chessboard', { pats: ['checker'], size: [5, 4] }),
          S('Slanting stripes', { pats: ['diag'], size: [5, 5] })),
        B('tileFix',
          S('Stripes, 2 colours', { pats: ['rows', 'cols'], k: 2, size: [4, 4] }),
          S('Three colours or chessboard', { pats: ['rows', 'cols', 'checker'], k: 3, size: [5, 4] }),
          S('Slanting stripes', { pats: ['diag'], size: [5, 5] })),
        B('tileRow',
          S('Stripes going across, 2 answers', { pats: ['rows'], k: 2, size: [4, 4], ch: 2 }),
          S('Across or down, 3 answers', { pats: ['rows', 'cols'], k: [2, 3], size: [5, 4], ch: 3 }),
          S('Chessboard', { pats: ['checker'], size: [5, 5], ch: 3 }),
          S('Slanting stripes', { pats: ['diag'], size: [5, 5], ch: 3 })),
        B('tileMotif',
          S('Chessboard, 2 answers', { pats: ['checker'], size: [4, 4], ch: 2 }),
          S('Little blocks of 4 tiles, 2 answers', { pats: ['motif2'], size: [6, 4], ch: 2 }),
          S('3 answers to choose from', { pats: ['checker', 'motif2'], size: [6, 4], ch: 3 })),
        H('tileMissing', S('Repeating blocks of tiles', { pats: ['motif2', 'motif3'], size: [6, 4], ch: 3 })),
        H('tileGaps', S('Repeating blocks of tiles', { pats: ['motif2', 'motif3'], size: [6, 6] })),
        H('tileMissing', S('Turned tiles, 4 answers', { pats: ['half'], size: [6, 4], ch: 4 })),
        H('tileFix', S('Turned tiles and blocks of tiles', { pats: ['half', 'motif2', 'motif3'], size: [6, 6] })),
      ] },
    { id: 'blocks', name: 'Block builder', short: 'Blocks', col: '#E3A85A', tint: '#F6F0E6', intro: 'Patterns that grow, step by step.',
      fact: 'A growing pattern changes by the same rule every step, so you can work out any step without building it.',
      blocks: [
        B('order',
          S('3 towers', { towers: 3 }),
          S('4 towers', { towers: 4 }),
          S('5 towers', { towers: 5 }),
          S('Tallest first', { towers: 4, down: true })),
        B('grow',
          S('Towers that grow by 1, 2 answers', { fams: ['tower1'], ch: 2 }),
          S('3 answers to choose from', { fams: ['tower1'], ch: 3 }),
          S('Towers that grow by 2', { fams: ['tower2'], ch: 3 }),
          S('Walls that grow', { fams: ['row2'], ch: 3 }),
          S('L shapes', { fams: ['L'], ch: 3 })),
        B('growMissing',
          S('Towers that grow by 1, 2 answers', { fams: ['tower1'], ch: 2 }),
          S('Grow by 1 or 2, 3 answers', { fams: ['tower1', 'tower2'], ch: 3 }),
          S('Walls and L shapes', { fams: ['row2', 'L'], ch: 3 })),
        B('growBuild',
          S('Towers that grow by 1', { fams: ['tower1'] }),
          S('Towers that grow by 2', { fams: ['tower2'] }),
          S('Walls and L shapes', { fams: ['row2', 'L'] }),
          S('Crosses and staircases', { fams: ['cross', 'stairs'] })),
        B('growAdd',
          S('Grow by 1 or 2, 2 answers', { fams: ['tower1', 'tower2'], ch: 2 }),
          S('Grow by 2 or 3, 3 answers', { fams: ['tower2', 'tower3'], ch: 3 }),
          S('Walls, L shapes and crosses', { fams: ['L', 'row2', 'row3', 'cross'], ch: 3 })),
        B('growCount',
          S('Towers that grow by 1', { fams: ['tower1'], ch: 3 }),
          S('Towers that grow by 2', { fams: ['tower2'], ch: 3 }),
          S('Grow by 3, walls and L shapes', { fams: ['tower3', 'L', 'row2'], ch: 3 }),
          S('Crosses and big walls, 4 answers', { fams: ['cross', 'row3'], ch: 4 })),
        B('growTable',
          S('Towers', { fams: ['tower1', 'tower2'], ch: 3 }),
          S('Grow by 3, walls and L shapes', { fams: ['tower3', 'L', 'row2'], ch: 3 }),
          S('Crosses, big walls and staircases, 4 answers', { fams: ['cross', 'row3', 'stairs'], ch: 4 })),
        B('growFar',
          S('Step 10 of a tower that grows by 1', { fams: ['tower1'], far: [10], ch: 3 }),
          S('Step 10, growing by 2', { fams: ['tower2'], far: [10], ch: 3 }),
          S('Step 10, more shapes, 4 answers', { fams: ['tower2', 'tower3', 'L'], far: [10], ch: 4 }),
          S('Step 10 or 20', { fams: ['tower2', 'tower3', 'L', 'row2', 'cross'], far: [10, 20], ch: 4 }),
          S('Step 20, 50 or 100, squares too', { fams: ['tower2', 'tower3', 'L', 'row2', 'row3', 'square'], far: [20, 50, 100], ch: 4 })),
        B('growRule',
          S('The rule in words, 2 answers', { fams: ['tower2', 'tower3'], ch: 2 }),
          S('The rule in words, 3 answers', { fams: ['tower2', 'tower3', 'L'], ch: 3 }),
          S('Some rules use n (like 2n + 1)', { fams: ['tower2', 'tower3', 'L', 'row2'], symbols: true, ch: 3 }),
          S('More shapes, 4 answers', { fams: ['tower2', 'tower3', 'L', 'row2', 'row3', 'cross'], symbols: true, ch: 4 })),
      ] },
    { id: 'numbers', name: 'Number grid', short: 'Numbers', col: '#6A97CC', tint: '#EFEFF7', intro: 'Patterns made of numbers.',
      fact: 'Number patterns follow a rule, like add 3 each time. If you know the rule, you know every number.',
      blocks: [
        B('numNext',
          S('Counting on in 1s, 2 answers', { steps: [1], start: [1, 10], ch: 2 }),
          S('3 answers, bigger numbers', { steps: [1], start: [0, 20], ch: 3 }),
          S('Counting in 2s', { steps: [2], from0: true, start: [0, 20], ch: 3 }),
          S('Counting in 10s', { steps: [10], from0: true, start: [0, 50], ch: 3 }),
          S('Counting in 5s', { steps: [5], from0: true, start: [0, 50], ch: 3 }),
          S('In 2s, 5s or 10s, starting anywhere', { steps: [2, 5, 10], start: [0, 40], ch: 3 }),
          S('Counting back too', { steps: [1, 2, 5, 10], back: true, start: [20, 100], ch: 3 })),
        B('numMissing',
          S('Counting in 1s, 2 answers', { steps: [1], start: [1, 10], ch: 2 }),
          S('In 2s, 5s or 10s, 3 answers', { steps: [2, 5, 10], from0: true, start: [0, 30], ch: 3 }),
          S('Starting anywhere', { steps: [2, 5, 10], start: [0, 40], ch: 3 }),
          S('Counting back too', { steps: [1, 2, 5, 10], back: true, start: [20, 100], ch: 3 })),
        B('numFix',
          S('Counting in 1s or 2s', { steps: [1, 2], start: [1, 10] }),
          S('In 5s or 10s', { steps: [5, 10], from0: true, start: [0, 50] }),
          S('Any of these, backwards too', { steps: [2, 5, 10], back: true, start: [10, 100] })),
        B('gridNext',
          S('Counting in 10s', { grid: 30, steps: [10] }),
          S('Counting in 2s', { grid: 30, steps: [2] }),
          S('Counting in 5s', { grid: 50, steps: [5] }),
          S('In 2s, 5s or 10s', { grid: 50, steps: [2, 5, 10] }),
          S('In 3s or 4s', { grid: 50, steps: [3, 4] })),
        B('gridShape',
          S('5s or 10s, 2 answers', { grid: 50, steps: [5, 10], ch: 2 }),
          S('2s, 5s or 10s, 3 answers', { grid: 50, steps: [2, 5, 10], ch: 3 }),
          S('On the whole hundred square', { grid: 100, steps: [2, 3, 4, 5, 10], ch: 3 }),
          S('More patterns, 4 answers', { grid: 100, steps: [2, 3, 4, 5, 6, 9, 10, 11], ch: 4 })),
        H('numNext', S('Counting in 3s and 4s', { steps: [3, 4], start: [0, 40], ch: 3 })),
        H('numMissing', S('In 3s, 4s and 6s, 4 answers', { steps: [3, 4, 6], start: [0, 60], ch: 4 })),
        H('numNext', S('Big jumps: 25, 50 and 100', { steps: [25, 50, 100], start: [0, 60], ch: 4 })),
        H('numNext', S('Going below zero', { steps: [1, 2, 5], back: true, cross0: true, ch: 4 })),
        H('numMissing', S('Going below zero', { steps: [2, 3, 5], back: true, cross0: true, ch: 4 })),
        H('numNext', S('Halves, quarters and tenths', { steps: [0.5, 0.25, 0.1], ch: 4 })),
        H('numMissing', S('Halves, quarters and tenths', { steps: [0.5, 0.25, 0.1], ch: 4 })),
        H('numFix', S('Any jump, backwards, below zero', { steps: [3, 4, 6, 7, 8, 9, 11, 25], back: true, cross0: true, start: [0, 80], ch: 4 })),
      ] },
    { id: 'machine', name: 'Pattern machine', short: 'Machine', col: '#8E82C9', tint: '#EEF0F5', intro: 'Machines that follow a rule: a number goes in, another comes out.',
      fact: 'A rule can tell you the next number, or any number at all, like the 100th.',
      blocks: [
        B('machineOut',
          S('Add 1 or 2 to small numbers, 2 answers', { ops: ['+'], adds: [1, 2], max: 10, ch: 2 }),
          S('Add up to 10, 3 answers', { ops: ['+'], adds: [1, 2, 3, 5, 10], max: 20, ch: 3 }),
          S('Take away', { ops: ['-'], adds: [1, 2, 3, 5], max: 20, ch: 3 }),
          S('Times 2, 5 or 10', { ops: ['x'], mults: [2, 5, 10], max: 12, ch: 3 }),
          S('Times or divide', { ops: ['x', '/'], mults: [2, 3, 5, 10], max: 12, ch: 3 })),
        B('machineRule',
          S('Adding machines, 2 answers', { ops: ['+'], adds: [1, 2, 3], max: 10, ch: 2 }),
          S('Adding or taking away, 3 answers', { ops: ['+', '-'], adds: [1, 2, 3, 4, 5, 10], max: 20, ch: 3 }),
          S('Times machines too', { ops: ['+', 'x'], adds: [2, 3, 5], mults: [2, 5, 10], max: 12, ch: 3 }),
          S('All four, 4 answers', { ops: ['+', '-', 'x', '/'], adds: [2, 3, 4, 5, 10], mults: [2, 3, 5, 10], max: 20, ch: 4 })),
        B('machineIn',
          S('Adding machines, 2 answers', { ops: ['+'], adds: [1, 2, 10], max: 20, ch: 2 }),
          S('Adding or taking away, 3 answers', { ops: ['+', '-'], adds: [2, 3, 4, 5, 10], max: 30, ch: 3 }),
          S('Times machines', { ops: ['x'], mults: [2, 5, 10], max: 12, ch: 3 })),
        B('ruleFind',
          S('Adding, 2 answers', { ops: ['+'], adds: [1, 2, 10], max: 30, ch: 2 }),
          S('Adding or taking away, 3 answers', { ops: ['+', '-'], adds: [2, 3, 4, 5, 10], max: 50, ch: 3 }),
          S('Times too', { ops: ['+', '-', 'x'], adds: [3, 4, 5], mults: [2, 3, 10], ch: 3 })),
        B('ruleUse',
          S('Adding', { ops: ['+'], adds: [2, 10], ch: 3 }),
          S('Adding or taking away', { ops: ['+', '-'], adds: [3, 4, 5, 10], ch: 3 }),
          S('Times too', { ops: ['+', 'x'], adds: [3, 5], mults: [2, 3], ch: 3 })),
        B('special',
          S('Doubling', { specials: ['double'], ch: 3 }),
          S('Halving and odd numbers', { specials: ['halve', 'odd'], ch: 3 }),
          S('Square numbers and add one more each time', { specials: ['square', 'triangle'], ch: 3 }),
          S('Add the two before, cube numbers', { specials: ['fib', 'cube'], ch: 3 }),
          S('Name the pattern, 4 answers', { specials: ['double', 'halve', 'odd', 'square', 'triangle', 'fib', 'cube'], mode: 'rule', ch: 4 })),
        B('twoStep',
          S('Times 2 or 10, then add or take away', { mults2: [2, 10], ch: 3 }),
          S('Times 2, 3, 5 or 10', { mults2: [2, 3, 5, 10], ch: 3 }),
          S('Some ask for the rule', { mults2: [2, 3, 5, 10], askRule: true, ch: 3 })),
        B('nth',
          S('The 10th number', { nth: 'value', small: true, ch: 3 }),
          S('The 20th, 50th or 100th number, 4 answers', { nth: 'value', ch: 4 }),
          S('The rule for the nth number (like 3n + 1)', { nth: 'rule', small: true, ch: 3 }),
          S('Harder rules, 4 answers', { nth: 'rule', ch: 4 })),
      ] },
    { id: 'mirror', name: 'Mirror pond', short: 'Mirror', col: '#4FA9B8', tint: '#EAF4F4', intro: 'Patterns that turn, flip and reflect.',
      fact: 'Turning and flipping are patterns too: the same move, again and again.',
      blocks: [
        B('turnNext',
          S('Arrows, quarter turns, 2 answers', { turns: [90], gs: ['arrow'], ch: 2 }),
          S('Arrows or pie pieces, 3 answers', { turns: [90], gs: ['arrow', 'pie'], ch: 3 }),
          S('Turning the other way too', { turns: [90, -90], gs: ['arrow', 'pie'], ch: 3 }),
          S('Half turns, and boots', { turns: [90, 180], gs: ['arrow', 'pie', 'boot'], ch: 3 }),
          S('Eighth turns, 4 answers', { turns: [45, -45], gs: ['arrow'], ch: 4 })),
        B('turnMissing',
          S('Arrows, quarter turns, 2 answers', { turns: [90], gs: ['arrow'], ch: 2 }),
          S('Both ways, 3 answers', { turns: [90, -90], gs: ['arrow', 'pie'], ch: 3 }),
          S('Half and eighth turns, 4 answers', { turns: [180, 45], gs: ['arrow', 'boot'], ch: 4 })),
        B('flipNext',
          S('Flip over, flip back, 2 answers', { flips: 'simple', ch: 2 }),
          S('3 answers to choose from', { flips: 'simple', ch: 3 }),
          S('Flips and turns together', { flips: 'mixed', ch: 3 }),
          S('4 answers', { flips: 'mixed', ch: 4 })),
        B('mirrorWhich',
          S('Small picture, mirror going down, 2 answers', { grid: 3, cells: [2, 3], axis: 'v', ch: 2 }),
          S('Bigger pictures, 3 answers', { grid: 3, cells: [3, 4], axis: 'v', ch: 3 }),
          S('Mirror going across', { grid: 4, cells: [3, 4], axis: 'h', ch: 3 }),
          S('Either mirror, more squares', { grid: 4, cells: [4, 5], axis: ['v', 'h'], ch: 3 })),
        B('mirrorFinish',
          S('Mirror going down', { grid: 4, cells: [2, 3], axis: 'v' }),
          S('Mirror going across', { grid: 4, cells: [3, 4], axis: 'h' }),
          S('Bigger grid', { grid: 6, cells: [3, 5], axis: ['v', 'h'] }),
          S('Two mirrors at once', { grid: 6, cells: [3, 4], axis: 'both' })),
        B('mirrorLine',
          S('Going down, or no line; 2 answers', { grid: 4, lines: ['v', 'none'], ch: 2 }),
          S('Down, across or no line; 3 answers', { grid: 4, lines: ['v', 'h', 'none'], ch: 3 }),
          S('Bigger pictures, both lines too; 4 answers', { grid: 6, lines: ['v', 'h', 'both', 'none'], ch: 4 })),
      ] },
    { id: 'grids', name: 'Puzzle grids', short: 'Grids', col: '#5C6A9C', tint: '#F5F2EA', intro: 'Harder puzzles: you have to spot more than one pattern.',
      fact: 'Spotting patterns means looking at one thing at a time: shape, colour, number, turn, then putting them together.',
      blocks: [
        B('oddOne',
          S('A different shape', { odd: ['shape'] }),
          S('A different colour', { odd: ['col'] }),
          S('A different number of shapes', { odd: ['count'] }),
          S('Pointing a different way', { odd: ['turn'] }),
          S('Any of these', { odd: ['shape', 'col', 'count', 'turn'] })),
        B('matrixLatin',
          S('The gap is in the corner', { ch: 3 }),
          S('The gap can be anywhere', { anyGap: true, ch: 3 }),
          S('4 answers', { anyGap: true, ch: 4 })),
        B('matrixTwo',
          S('Shape and colour', { attrs: ['shape', 'col'], ch: 3 }),
          S('Shape and how many', { attrs: ['shape', 'count'], ch: 3 }),
          S('Shape and filled or outline', { attrs: ['shape', 'fill'], ch: 3 }),
          S('Any of these, gap anywhere, 4 answers', { attrs: ['shape', 'col', 'count', 'fill'], anyGap: true, ch: 4 })),
        B('analogy',
          S('It changes colour', { changes: ['col'], ch: 3 }),
          S('It gets smaller', { changes: ['size'], ch: 3 }),
          S('It gets one more', { changes: ['count'], ch: 3 }),
          S('It turns or flips', { changes: ['turn', 'flip'], ch: 3 }),
          S('Any change, 4 answers', { changes: ['col', 'size', 'count', 'turn', 'flip', 'fill'], ch: 4 })),
        B('twoThings',
          S('Shapes take turns, colours in threes', { u1: ['AB'], u2: ['ABC', 'AAB'], ch: 3 }),
          S('Shapes in twos or threes', { u1: ['AB', 'ABC'], u2: ['ABC', 'AB', 'AAB'], ch: 3 }),
          S('Longer bits, 4 answers', { u1: ['AB', 'ABC'], u2: ['ABC', 'AABB', 'AAB'], ch: 4 })),
        B('far',
          S('Two pieces, carriage 10 or 12, 2 answers', { units: ['AB'], far: [10, 12], ch: 2 }),
          S('Carriage 12 to 20', { units: ['AB', 'ABC'], far: [12, 15, 20], ch: 3 }),
          S('Longer bits, carriage 20 or 30', { units: ['AAB', 'ABB', 'AABB'], far: [20, 30], ch: 3 }),
          S('Carriage 50 or 100, 4 answers', { units: ['ABC', 'AABB', 'ABCD'], far: [50, 100], ch: 4 })),
      ] },
  ];

  /* ---------- the ladder: one level for every step of every block ---------- */
  const kindOf = e => (typeof e === 'string' ? e : e.t);
  const LADDER = [];
  (function build() {
    const met = new Set();
    WORLDS.forEach((W, w) => {
      W.first = LADDER.length + 1;
      W.blocks.forEach(bl => {
        const isNew = !met.has(bl.k);
        met.add(bl.k);
        const start = LADDER.length + 1;
        bl.subs.forEach((sub, i) => {
          LADDER.push({
            w, kind: bl.k, deck: [bl.k], p: Object.assign({}, KINDS[bl.k].base, sub.p), say: sub.say,
            sub: i + 1, subOf: bl.subs.length, blockStart: start, newKind: isNew && i === 0, harder: !!bl.harder,
            need: 12, win: 15, fast: 8,
          });
        });
      });
      W.last = LADDER.length;
    });
    LADDER.forEach((L, i) => { L.n = i + 1; L.inWorld = L.n - WORLDS[L.w].first + 1; L.ofWorld = WORLDS[L.w].last - WORLDS[L.w].first + 1; });
  })();

  /* ---------- an easier version, for practice after two misses ---------- */
  function easier(p) {
    const e = Object.assign({}, p);
    e.ch = 2;
    if (e.units) { const min = Math.min(...e.units.map(u => u.length)); e.units = e.units.filter(u => u.length === min); }
    if (e.sizeUnits) e.sizeUnits = e.sizeUnits.filter(u => u.length === 2).length ? e.sizeUnits.filter(u => u.length === 2) : ['SB', 'BS'];
    delete e.partial; delete e.spare; delete e.big; delete e.back; delete e.cross0; delete e.symbols;
    if (e.steps) { const ints = e.steps.filter(s => Number.isInteger(s)); e.steps = [Math.min(...(ints.length ? ints : [1]))]; }
    if (e.pats) e.pats = e.pats.includes('rows') ? ['rows'] : [e.pats[0]];
    if (e.k) e.k = 2;
    if (e.size) e.size = [4, 4];
    if (e.fams) e.fams = [e.fams[0]];
    if (e.far) e.far = [Math.min(...e.far)];
    if (e.adds) e.adds = [Math.min(...e.adds)];
    if (e.ops) e.ops = [e.ops[0] === '-' ? '+' : e.ops[0]];
    if (e.mults) e.mults = [2];
    if (e.turns) e.turns = [90];
    if (e.grid && e.grid > 4 && e.grid <= 8) e.grid = 4;
    if (Array.isArray(e.axis)) e.axis = e.axis[0];
    if (e.axis === 'both') e.axis = 'v';
    if (e.ringMax) { e.ringMin = 8; e.ringMax = 8; }
    if (e.towers) { e.towers = 3; delete e.down; }
    delete e.askRule;
    if (e.cells) e.cells = [2, 3];
    if (e.lines) e.lines = ['v', 'none'];
    if (e.changes) e.changes = [e.changes[0]];
    if (e.attrs) e.attrs = ['shape', 'col'];
    if (e.odd) e.odd = [e.odd[0]];
    if (e.specials) e.specials = ['double'];
    if (e.nth === 'rule') e.nth = 'value';
    e.small = true; e.flips = 'simple'; e.anyGap = false;
    return e;
  }

  function makePuzzle(kind, params) {
    const k = KINDS[kind];
    for (let t = 0; t < 6; t++) {
      try {
        const pz = k.gen(Object.assign({}, params));
        pz.kind = kind; pz.w = k.w;
        return pz;
      } catch (err) { if (t === 5) throw err; }
    }
  }

  window.PWorlds = { WORLDS, KINDS, LADDER, kindOf, easier, makePuzzle, setThemes, periodOf, structure, ALL_THEMES };
})();
