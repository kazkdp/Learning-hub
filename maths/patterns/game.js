/* Patterns – the game itself (game.js): the journey map, each puzzle,
   the owl's "Watch me", hints, stars, levels and the grown-ups panel.

   The rules (asked for by Kas):
   - Move up a level after 12 of the last 15 puzzles at the level are right
     first time, on his own (no hint, not practice) – or 8 in a row – and he has
     got every kind of puzzle on the level right at least once.
   - A new kind of puzzle first gets a level of its own, with the simplest
     version, and the owl shows it once ("Watch me").
   - Each sitting is 10 puzzles: 2 warm-ups a little below his level first,
     then after every 4 puzzles at his level, 1 old puzzle comes back.
   - One mistake: another of the same kind. Two in a row: an easier practice
     version (with the first hint showing) until he gets one; the owl shows
     it again if practice is hard too. The level never drops by itself.
   - Fast tapping does nothing: taps right after a mistake are ignored, a grid
     that gets far too many squares starts again, and a star only comes when it
     is right first time.
   Stars are saved with Kit.saveResult after every puzzle, like Tallies. */
(function () {
  'use strict';
  const A = window.PArt, PW = window.PWorlds, SC = window.PScenes;
  const { WORLDS, KINDS, LADDER, kindOf } = PW;
  const TOP = LADDER.length;
  const ACTIVITY = 'maths/patterns.html', TITLE = 'Patterns', SECTION = 'Maths';
  const PROGRESS_KEY = 'progress:' + ACTIVITY, SITTING = 10;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => Kit.esc(String(s));
  const rand = n => Math.floor(Math.random() * n), pick = a => a[rand(a.length)];
  const sum = a => a.reduce((x, y) => x + y, 0);
  const wait = ms => new Promise(r => setTimeout(r, ms));

  /* ---------- settings ---------- */
  const savedSet = Kit.setting('patterns') || {};
  const SET = { watch: savedSet.watch !== false, calm: !!savedSet.calm, themes: savedSet.themes && typeof savedSet.themes === 'object' ? savedSet.themes : {} };
  const saveSet = () => Kit.setting('patterns', SET);
  const themesOn = () => PW.ALL_THEMES.filter(t => SET.themes[t] !== false);
  PW.setThemes(themesOn());
  const autoRead = () => Kit.setting('readAloud') === true;
  const motionOK = () => !SET.calm && !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---------- sounds: soft tones, notes from one friendly scale ---------- */
  let actx = null;
  function audio() {
    if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { actx = null; } }
    if (actx && actx.state === 'suspended') actx.resume();
    return actx;
  }
  const NOTES = [523.25, 659.25, 783.99, 880, 587.33, 1046.5];
  function tone(f, t0, len, vol, type) {
    const c = audio(); if (!c) return;
    const o = c.createOscillator(), g = c.createGain(), t = c.currentTime + t0;
    o.type = type || 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + len + 0.05);
  }
  function sound(kind, i) {
    if (!Kit.soundsOn()) return;
    if (kind === 'tick') tone(660, 0, 0.09, 0.05);
    else if (kind === 'soft') tone(233, 0, 0.25, 0.06, 'triangle');
    else if (kind === 'right') { tone(783.99, 0, 0.35, 0.09); tone(1046.5, 0.12, 0.5, 0.08); }
    else if (kind === 'note') { if (!SET.calm) tone(NOTES[(i || 0) % NOTES.length], 0, 0.45, 0.06); }
    else if (kind === 'level') [523.25, 659.25, 783.99, 1046.5].forEach((f, k) => tone(f, k * 0.14, 0.55, 0.08));
  }
  function speak(text) {
    const t = String(text).replace(/[▶✓]/g, '').replace(/−\s?/g, 'minus ').replace(/×/g, ' times ').replace(/÷/g, ' divided by ')
      .replace(/\+/g, ' plus ').replace(/…/g, ', ').replace(/→/g, ' to ').replace(/(\d)n\b/g, '$1 n').replace(/½/g, ' and a half').replace(/¼/g, ' and a quarter').replace(/¾/g, ' and three quarters');
    Kit.speak(t);
  }

  /* ---------- progress ---------- */
  function blank() { return { v: 3, level: 1, win: [], got: {}, at: 0, rounds: 0, stars: 0, skills: {}, seen: {}, recent: [], cards: {}, expert: false }; }
  let P = blank();
  const stored = Kit.setting(PROGRESS_KEY);
  let hasSaved = !!stored;
  if (stored && typeof stored === 'object') {
    if (stored.v === 3) P = Object.assign(blank(), stored);
    else {
      // The first Patterns (one long train ladder): keep his stars, and start him at the same place in the Train world.
      const old = Math.max(1, Math.round(stored.level) || 1), trainEnd = WORLDS[0].last;
      P.level = old <= 21 ? Math.max(1, Math.min(trainEnd, Math.round(old / 21 * trainEnd))) : WORLDS[1].first;
      P.rounds = stored.rounds || 0; P.stars = stored.stars || 0;
      for (let i = 0; i < P.level - 1; i++) LADDER[i].deck.forEach(e => { P.seen[kindOf(e)] = 1; });
      P.cards.intro0 = 1;
    }
  }
  P.level = Math.min(TOP, Math.max(1, Math.round(P.level) || 1));
  ['win', 'recent'].forEach(k => { if (!Array.isArray(P[k])) P[k] = []; });
  ['got', 'skills', 'seen', 'cards'].forEach(k => { if (!P[k] || typeof P[k] !== 'object') P[k] = {}; });
  P.again = null;
  const cur = () => LADDER[P.level - 1];
  function save() {
    if (!hasSaved && !(P.rounds > 0 || P.level > 1 || Object.keys(P.seen).length)) return;
    hasSaved = true;
    const L = cur();
    P.label = `${WORLDS[L.w].short} level ${L.inWorld}`;
    Kit.setting(PROGRESS_KEY, P);
  }
  const rateOf = k => { const s = P.skills[k]; return s && s[0] >= 2 ? s[1] / s[0] : 0.6; };

  /* ---------- a sitting and planning the next puzzle ---------- */
  let session = null;
  function newSession() {
    session = { id: 'pat-' + Date.now().toString(36), startedAt: new Date().toISOString(), count: 0, stars: 0, items: [], dots: [], frontier: 0, needReview: false };
  }
  function paramsFor(lvl, e, help) {
    let p = Object.assign({}, LADDER[lvl - 1].p, typeof e === 'object' ? e : {});
    if (help) p = PW.easier(p);
    return p;
  }
  function pickWarm() {
    const lo = Math.max(1, P.level - 3), cands = [];
    for (let n = lo; n < P.level; n++) LADDER[n - 1].deck.forEach(e => cands.push({ lvl: n, e }));
    if (!cands.length) return null;
    const sameW = cands.filter(c => LADDER[c.lvl - 1].w === cur().w), base = sameW.length ? sameW : cands;
    const good = base.filter(c => rateOf(kindOf(c.e)) >= 0.6);
    const c = pick(good.length ? good : base);
    return { flavour: 'warm', lvl: c.lvl, e: c.e };
  }
  function pickReview() {
    if (P.level <= 1) return null;
    const recentLo = Math.max(1, P.level - 8), useOld = P.level > 10 && Math.random() < 0.4;
    const lo = useOld ? 1 : recentLo, hi = useOld ? recentLo : P.level, cands = [];
    for (let n = lo; n < hi; n++) LADDER[n - 1].deck.forEach(e => cands.push({ lvl: n, e, wt: 1.5 - rateOf(kindOf(e)) }));
    if (!cands.length) return null;
    let t = Math.random() * sum(cands.map(c => c.wt));
    for (const c of cands) { t -= c.wt; if (t <= 0) return { flavour: 'review', lvl: c.lvl, e: c.e }; }
    return { flavour: 'review', lvl: cands[0].lvl, e: cands[0].e };
  }
  function makePlan() {
    const L = cur();
    if (session.count < 2 && P.level > 1 && !session.noWarm) { const w = pickWarm(); if (w) return w; }
    if (P.again) {
      const a = P.again;
      if (a.step === 'retry') return { flavour: 'retry', lvl: a.lvl, e: a.e };
      return { flavour: 'practice', lvl: a.lvl, e: a.e, help: true, demoAgain: a.misses >= 2 && !a.demoed };
    }
    if (session.needReview) { session.needReview = false; const r = pickReview(); if (r) return r; }
    let e = L.deck[P.at % L.deck.length];
    const missing = [...new Set(L.deck.map(kindOf))].filter(k => !P.got[k]);
    if (missing.length && sum(P.win) >= L.need - 3 && !missing.includes(kindOf(e))) e = L.deck.find(x => kindOf(x) === missing[0]);
    return { flavour: 'level', lvl: P.level, e };
  }

  /* ---------- screens ---------- */
  let screenNow = 'map';
  function screen(name) {
    screenNow = name;
    ['map', 'play', 'card', 'summary'].forEach(s => { $('#' + s).hidden = s !== name; });
    document.body.dataset.screen = name;
  }
  let msgText = '';
  function setMsg(text, kind) {
    msgText = text;
    const m = $('#msg');
    m.dataset.kind = kind || 'info';
    $('#msg-text').textContent = text;
    $('#avatar').hidden = !(V && V.demo && screenNow === 'play');
  }

  /* ---------- top bar ---------- */
  function drawTop() {
    const L = cur(), W = WORLDS[L.w];
    const pct = Math.min(100, Math.round(100 * Math.max(sum(P.win) / L.need, streak() / L.fast)));
    $('#sub').innerHTML = `<span class="chip world" style="--wc:${W.col}"><svg viewBox="-30 -30 60 60" aria-hidden="true"><circle r="29" fill="${W.col}"/>${A.worldIcon(L.w, W.col)}</svg>${esc(W.name)}</span>` +
      `<span class="chip lvl">Level ${L.inWorld} of ${L.ofWorld}</span>` +
      `<span class="meter" title="Moves up at ${L.need} of the last ${L.win} right first time on his own, or ${L.fast} in a row"><span style="width:${pct}%"></span></span>`;
    const showDots = screenNow === 'play' || screenNow === 'summary';
    $('#dots').hidden = !showDots;
    if (showDots && session) {
      let d = '';
      for (let i = 0; i < SITTING; i++) {
        const s = session.dots[i];
        d += s === 'star' ? `<li class="dot star">${A.starIcon(24)}</li>` : s === 'soft' ? '<li class="dot soft"><span></span></li>'
          : i === session.count && screenNow === 'play' ? `<li class="dot now">${i + 1}</li>` : '<li class="dot"><span></span></li>';
      }
      $('#dots').innerHTML = d;
      $('#dots').setAttribute('aria-label', `Puzzle ${Math.min(session.count + 1, SITTING)} of ${SITTING} in this sitting`);
    }
    let total = P.stars;
    try { const s = Kit.starSummary(); if (s && typeof s.total === 'number') total = s.total; } catch (e) { /* keep this game's count */ }
    $('#star-count').textContent = total;
    $('#stars').setAttribute('aria-label', `${total} stars`);
    $('#sound-btn').innerHTML = A.icon(Kit.soundsOn() ? 'speak' : 'mute', 22);
    $('#sound-btn').setAttribute('aria-pressed', Kit.soundsOn() ? 'true' : 'false');
  }
  const streak = () => { let n = 0; for (let i = P.win.length - 1; i >= 0 && P.win[i]; i--) n++; return n; };

  /* ---------- the puzzle screen ---------- */
  let PZ = null, PLAN = null, V = null;
  function freshV(o) {
    return {
      id: (V ? V.id : 0) + 1, demo: !!o.demo, locked: !!o.demo, solved: false, revealed: false, lit: false,
      filled: {}, fillAt: 0, justId: null, ghostSlots: new Set(), slotMiss: 0, vis: new Set(), marks: {},
      built: [], justBuilt: false, sel: new Set(), order: [], tries: 0, misses: 0, hints: 0, checks: 0,
      cool: Date.now() + 400, star: false, event: null,
    };
  }
  function showPuzzle(plan, o = {}) {
    const kind = kindOf(plan.e);
    PLAN = plan;
    PZ = PW.makePuzzle(kind, paramsFor(plan.lvl, plan.e, plan.help));
    V = freshV(o);
    if (plan.help && !o.demo) { const h = PZ.hints.find(x => x.show && x.show !== 'ghost'); if (h) { V.vis.add(h.show); } }
    screen('play');
    drawAll();
    setMsg(openingText(), o.demo ? 'demo' : 'info');
    if (autoRead()) speak(PZ.prompt);
    if (o.demo) runDemo();
  }
  function openingText() {
    if (V.demo) return P.seen[PZ.kind] ? 'Let me show you this one again. Just watch.' : 'A new kind of puzzle! Watch me do the first one.';
    const f = PLAN.flavour;
    if (f === 'warm') return 'A warm-up. ' + PZ.prompt;
    if (f === 'review') return 'Remember this one? ' + PZ.prompt;
    if (f === 'practice') return 'Let’s practise this one. I’ve put a clue on.';
    if (f === 'retry') return 'Here’s another one like that.';
    return PZ.prompt;
  }
  const FLAVOUR = { warm: 'Warm-up', review: 'Remember this one?', practice: 'Practice', retry: 'Another one like that' };
  function drawAll() { drawTop(); drawPlay(); drawButtons(); }
  function drawPlay() {
    const W = WORLDS[PZ.w];
    $('#play').style.setProperty('--tint', W.tint);
    const banner = $('#banner');
    banner.hidden = !V.demo;
    if (V.demo) {
      const again = P.seen[PZ.kind];
      banner.innerHTML = `<span class="b-eye">${A.icon('eye', 26, '#FFFFFF', 2.4)}</span><span class="b-big">${again ? 'Watch me show you again' : 'Watch me do the first one'}</span>` +
        `<span class="b-small">You don’t need to press anything yet.</span>${again ? '' : `<span class="b-new">${A.starIcon(20, '#FFFFFF', '#3A2A00')}New kind of puzzle</span>`}`;
      banner.classList.toggle('done', V.solved);
      if (V.solved) banner.innerHTML = `<span class="b-eye">${A.icon('check', 26, '#FFFFFF', 3)}</span><span class="b-big">That’s how you do it. Now it’s your turn.</span>`;
    }
    $('#q').textContent = PZ.prompt;
    const fl = $('#flavour');
    fl.hidden = !(PLAN && FLAVOUR[PLAN.flavour]) || V.demo;
    fl.textContent = PLAN && FLAVOUR[PLAN.flavour] || '';
    fl.dataset.kind = PLAN && PLAN.flavour || '';
    redraw();
  }
  function redraw() {
    const sc = $('#scene');
    sc.className = `scene sc-${PZ.scene.type} k-${PZ.kind}`;
    sc.innerHTML = SC.render(PZ, V);
    $('#answers').innerHTML = answersHTML();
    $('#answers').className = `answers m-${PZ.mech}${V.locked ? ' locked' : ''}`;
    V.justId = null; V.justBuilt = false;
  }
  function answersHTML() {
    const lock = V.locked ? ' aria-disabled="true"' : '';
    if (PZ.mech === 'choose') {
      return PZ.opts.map((o, i) => {
        const m = V.marks['opt' + i] || '';
        const off = V.solved || V.revealed || m === 'gone' ? ' disabled' : '';
        return `<button type="button" class="opt k-${SC.optionKind(o)} ${m}" data-act="opt" data-i="${i}" aria-label="${esc(o.say || o.text || A.name(o.tok) || 'answer')}"${lock}${off && !m.includes('right') ? off : ''}>${SC.option(o)}</button>`;
      }).join('');
    }
    if (PZ.mech === 'fill' || PZ.mech === 'build') {
      const done = V.solved || V.revealed;
      let h = '<div class="pal">' + PZ.palette.map((t, i) => `<button type="button" class="opt k-tok pal-b" data-act="pal" data-i="${i}" aria-label="${esc(A.name(t))}"${lock}${done ? ' disabled' : ''}>${A.svg(t, 'pc')}</button>`).join('') + '</div>';
      if (PZ.mech === 'build' && !done) {
        h += `<div class="tools"><button type="button" class="tool" data-act="undo"${lock}${V.built.length ? '' : ' disabled'}>${A.icon('undo', 22)}Take one off</button>` +
          `<button type="button" class="tool check" data-act="check"${lock}${V.built.length ? '' : ' disabled'}>${A.icon('check', 22, 'currentColor', 3)}Check</button></div>`;
      }
      return h;
    }
    if (PZ.mech === 'select' && !(V.solved || V.revealed)) {
      return `<div class="tools"><button type="button" class="tool" data-act="clear"${lock}${V.sel.size ? '' : ' disabled'}>${A.icon('undo', 22)}Clear</button>` +
        `<button type="button" class="tool check" data-act="check"${lock}${V.sel.size ? '' : ' disabled'}>${A.icon('check', 22, 'currentColor', 3)}Check</button></div>`;
    }
    return '';
  }
  function drawButtons() {
    const main = $('#main-btn'), hint = $('#hint-btn');
    let label = '';
    if (screenNow === 'map') label = session && session.count && session.count < SITTING ? 'Carry on' : 'Keep going';
    else if (screenNow === 'card') label = cardLabel;
    else if (screenNow === 'summary') label = 'Play 10 more';
    else if (V && V.demo) label = V.solved ? 'Your turn' : '';
    else if (V && V.solved) label = session.count >= SITTING ? 'See my stars' : 'Next';
    main.hidden = !label;
    main.innerHTML = `${esc(label)}${A.icon('next', 24, '#FFFFFF', 3)}`;
    const canHint = screenNow === 'play' && V && !V.locked && !V.solved && !V.revealed && V.hints < PZ.hints.length;
    hint.hidden = !canHint;
    $('#say-btn').hidden = screenNow === 'card';
  }

  /* ---------- answering ---------- */
  function findCell(id) {
    const sc = PZ.scene;
    const all = sc.type === 'line' ? sc.rows.flatMap(r => r.cells) : (sc.cells || []);
    return all.find(c => c.id === id);
  }
  function missed(el, text) {
    sound('soft');
    V.cool = Date.now() + 700;
    if (el) { el.classList.remove('nudge'); void el.offsetWidth; el.classList.add('nudge'); }
    setMsg(text || pick(['Not that one. Have another look.', 'Not quite. Look again.', 'Have another look.']), 'try');
  }
  function onPlayClick(ev) {
    const b = ev.target.closest('[data-act]');
    if (!b || !V || V.locked || V.solved || V.revealed || b.getAttribute('aria-disabled') === 'true') return;
    if (Date.now() < V.cool) return;
    audio();
    const act = b.dataset.act;
    if (act === 'opt') pickOption(+b.dataset.i, b);
    else if (act === 'pal') pickPalette(+b.dataset.i, b);
    else if (act === 'cell') tapCell(b.dataset.id, b);
    else if (act === 'undo') { V.built.pop(); sound('tick'); redraw(); }
    else if (act === 'clear') { V.sel.clear(); sound('tick'); redraw(); }
    else if (act === 'check') check();
  }
  function pickOption(i, btn) {
    const o = PZ.opts[i];
    if (!o || V.marks['opt' + i]) return;
    V.tries++;
    if (o.right) { V.marks['opt' + i] = 'right'; solve(V.tries === 1); return; }
    V.marks['opt' + i] = 'gone'; V.misses++;
    if (V.misses >= 2 || PZ.opts.filter((x, k) => !V.marks['opt' + k]).length <= 1) { missed(btn); giveAnswer(); return; }
    redraw(); missed($(`#answers [data-i="${i}"]`));
  }
  function pickPalette(i, btn) {
    const tok = PZ.palette[i];
    if (PZ.mech === 'build') {
      if (V.built.length >= PZ.n) { setMsg('Your train is full. Press Check, or take one off.', 'try'); return; }
      V.built.push(tok); V.justBuilt = true; sound('tick'); redraw(); return;
    }
    const id = PZ.slots[V.fillAt]; if (!id) return;
    const cell = findCell(id);
    if (A.key(tok) === A.key(cell.tok)) {
      V.filled[id] = tok; V.justId = id; V.fillAt++; V.slotMiss = 0; sound('tick');
      if (V.fillAt >= PZ.slots.length) solve(V.misses === 0); else { redraw(); setMsg(PZ.slots.length > 1 ? 'Yes. Now the next one.' : PZ.prompt, 'info'); }
      return;
    }
    V.misses++; V.slotMiss++;
    if (V.misses >= 8) { missed(btn); giveAnswer('Let’s finish this one together. '); return; }
    if (V.slotMiss >= 4) {
      // Still stuck after the clue: put this one in for him, so it never turns into a battle.
      V.filled[id] = cell.tok; V.justId = id; V.fillAt++; V.slotMiss = 0;
      if (V.fillAt >= PZ.slots.length) { giveAnswer('I’ve put that one in for you. '); return; }
      redraw(); missed(null, 'I’ve put that one in for you. Now the next one.'); return;
    }
    if (V.slotMiss >= 2) { V.ghostSlots.add(id); redraw(); missed($(`#answers [data-i="${i}"]`), 'Here’s a clue: I’ve shown the piece faintly.'); return; }
    missed(btn);
  }
  function tapCell(id, el) {
    if (PZ.mech === 'tap') {
      V.tries++;
      if (PZ.rightIds.includes(id)) { V.marks[id] = 'right'; solve(V.tries === 1); return; }
      V.marks[id] = 'nope'; V.misses++;
      if (V.misses >= 2) { missed(el); giveAnswer(); return; }
      redraw(); missed($(`#scene [data-id="${id}"]`));
    } else if (PZ.mech === 'select') {
      if (V.sel.has(id)) V.sel.delete(id);
      else {
        if (PZ.maxSel && V.sel.size >= PZ.maxSel) {
          V.sel.clear(); V.misses++; redraw();
          missed(null, 'That’s a lot of squares. Let’s start this one again.'); return;
        }
        V.sel.add(id);
      }
      sound('tick'); redraw();
    } else if (PZ.mech === 'order') {
      if (V.order.includes(id)) return;
      const want = PZ.orderIds[V.order.length];
      if (id === want) {
        V.order.push(id); V.marks[id] = 'picked'; sound('tick');
        if (V.order.length === PZ.orderIds.length) solve(V.misses === 0); else redraw();
        return;
      }
      V.misses++;
      if (V.misses >= 3) { missed(el); giveAnswer(); return; }
      missed(el);
    }
  }
  const normKey = ids => {
    const pts = ids.map(id => id.slice(1).split('_').map(Number));
    const mx = Math.min(...pts.map(p => p[0])), my = Math.min(...pts.map(p => p[1]));
    return pts.map(p => (p[0] - mx) + ',' + (p[1] - my)).sort().join(' ');
  };
  function check() {
    V.checks++;
    if (PZ.mech === 'build') {
      const r = PZ.check(V.built);
      if (r.ok) { if (r.explain) PZ.explain = r.explain; solve(V.checks === 1); return; }
      V.misses++;
      if (r.cut !== undefined) V.built = V.built.slice(0, r.cut);
      if (V.checks >= 3) { missed(null); giveAnswer(PZ.own ? 'Here is one way to do it. ' : ''); return; }
      redraw(); missed(null, r.msg); return;
    }
    if (PZ.mech === 'select') {
      const want = new Set(PZ.want);
      const ok = PZ.shiftOk && V.sel.size ? normKey([...V.sel]) === normKey(PZ.want) : (V.sel.size === want.size && [...want].every(id => V.sel.has(id)));
      if (ok) { solve(V.checks === 1 && V.misses === 0); return; }
      V.misses++;
      let wrong = 0;
      [...V.sel].forEach(id => { if (!want.has(id)) { V.sel.delete(id); wrong++; } });
      const left = [...want].filter(id => !V.sel.has(id)).length;
      if (V.checks >= 3) { missed(null); giveAnswer(); return; }
      redraw();
      missed(null, wrong ? `${wrong === 1 ? 'One square' : wrong + ' squares'} didn’t fit, so I took ${wrong === 1 ? 'it' : 'them'} away.${left ? ' Some are still missing.' : ''}` : 'Some squares are still missing.');
    }
  }
  function solve(clean) {
    V.solved = true; V.lit = !PZ.noLight;
    const star = clean && !V.demo;
    V.star = star;
    if (!V.demo) record(star);
    sound(V.demo ? 'tick' : (star ? 'right' : 'tick'));
    drawPlay();
    let text = star ? pick(['Yes!', 'That’s right!', 'Well done!', 'Brilliant!', 'You got it!']) + ' ' + PZ.explain : (clean ? '' : 'That’s it. ') + PZ.explain;
    if (V.demo) text = 'See? ' + PZ.explain + ' Now it’s your turn.';
    text += eventText();
    setMsg(text, V.demo ? 'demo' : 'good');
    drawButtons(); drawTop();
    if (V.event && V.event.type === 'level') sound('level');
    lightUp();
    if (autoRead() || V.demo) speak(text);
  }
  function giveAnswer(lead) {
    V.revealed = true; V.solved = true; V.lit = !PZ.noLight;
    if (PZ.mech === 'choose') PZ.opts.forEach((o, i) => { if (o.right) V.marks['opt' + i] = 'right'; });
    if (PZ.mech === 'tap') V.marks[PZ.showRight || PZ.rightIds[0]] = 'right';
    if (PZ.mech === 'build') V.built = PZ.solution.slice();
    if (PZ.mech === 'order') { V.order = PZ.orderIds.slice(); PZ.orderIds.forEach(id => { V.marks[id] = 'picked'; }); }
    if (PZ.mech === 'fill') PZ.slots.forEach(id => { V.filled[id] = findCell(id).tok; });
    if (PZ.mech === 'select') V.sel = new Set(PZ.want);
    if (!V.demo) record(false);
    drawPlay();
    setMsg((lead || 'Here’s the answer. ') + PZ.explain + eventText(), 'info');
    drawButtons(); drawTop();
    lightUp();
  }
  function eventText() {
    const ev = V.event;
    if (!ev) return '';
    const L = cur();
    if (ev.type === 'level') return ` Level up! Now level ${L.inWorld} of the ${WORLDS[L.w].name}.`;
    if (ev.type === 'world') return ` You finished the ${WORLDS[ev.from].name}!`;
    if (ev.type === 'expert') return ' You are a Pattern Expert!';
    return '';
  }

  /* ---------- light up the bits that repeat, with a note for each piece ---------- */
  async function lightUp() {
    const id = V.id;
    if (PZ.noLight) return;
    await wait(motionOK() ? 350 : 0);
    const els = $$('#scene [data-u]');
    if (!els.length || V.id !== id) return;
    const groups = new Map();
    els.forEach(e => { const u = e.dataset.u; if (!groups.has(u)) groups.set(u, []); groups.get(u).push(e); });
    const keys = [...groups.keys()].sort((a, b) => +a - +b).slice(0, 8);
    if (!motionOK()) return;
    for (const k of keys) {
      if (V.id !== id) return;
      const g = groups.get(k).filter(e => e.isConnected);
      g.forEach(e => e.classList.add('glow'));
      for (const e of g) { if (e.dataset.note !== undefined) { sound('note', +e.dataset.note); await wait(120); } }
      await wait(200);
      g.forEach(e => e.classList.remove('glow'));
    }
  }

  /* ---------- recording: stars, saving, moving up ---------- */
  function record(star) {
    const plan = PLAN, kind = PZ.kind, own = star && V.hints === 0 && plan.flavour !== 'practice';
    const s = P.skills[kind] || [0, 0]; s[0]++; if (star) s[1]++; P.skills[kind] = s;
    P.rounds++; if (star) P.stars++;
    session.count++; if (star) session.stars++;
    session.dots.push(star ? 'star' : 'soft');
    session.items.push({ type: 'pat-' + WORLDS[PZ.w].id, firstTry: star });
    if (session.items.length > 200) session.items = session.items.slice(-200);
    P.recent.push({ l: plan.lvl, k: kind, ok: star ? 1 : 0, f: plan.flavour }); if (P.recent.length > 40) P.recent = P.recent.slice(-40);
    if (plan.flavour === 'level' || plan.flavour === 'retry' || plan.flavour === 'practice') {
      session.frontier++;
      if (session.frontier % 4 === 0) session.needReview = true;
    }
    let event = null;
    if (plan.flavour === 'level' || plan.flavour === 'retry') {
      if (plan.flavour === 'level') P.at++;
      if (plan.lvl === P.level) {
        const L = cur();
        P.win.push(own ? 1 : 0); if (P.win.length > L.win) P.win = P.win.slice(-L.win);
        if (own) P.got[kind] = 1;
        P.again = star ? null : (plan.flavour === 'level' ? { step: 'retry', lvl: plan.lvl, e: plan.e } : { step: 'practice', lvl: plan.lvl, e: plan.e, misses: 0, n: 0 });
        event = checkLevel();
      }
    } else if (plan.flavour === 'practice') {
      const a = P.again || { step: 'practice', lvl: plan.lvl, e: plan.e, misses: 0, n: 0 };
      a.n++;
      if (plan.demoAgain) a.demoed = true;
      if (star) P.again = null;
      else { a.misses++; P.again = a.n >= 3 ? null : a; }
    }
    V.event = event;
    save();
    Kit.saveResult({
      activity: ACTIVITY, section: SECTION, title: TITLE, kind: 'maths-game', adds: true,
      session: session.id, startedAt: session.startedAt, score: session.stars, total: session.count,
      rounds: session.count, level: P.level, items: session.items,
    });
  }
  function checkLevel() {
    const L = cur();
    const covered = [...new Set(L.deck.map(kindOf))].every(k => P.got[k]);
    const gate = P.win.length >= L.need && sum(P.win) >= L.need;
    const fast = P.win.length >= L.fast && P.win.slice(-L.fast).every(Boolean);
    if (!covered || !(gate || fast)) return null;
    if (P.level >= TOP) {
      if (P.expert) return null;
      P.expert = true; P.win = [];
      return { type: 'expert' };
    }
    const from = L.w;
    P.level++; P.win = []; P.got = {}; P.at = 0; P.again = null;
    return cur().w !== from ? { type: 'world', from, to: cur().w } : { type: 'level' };
  }

  /* ---------- the owl shows how (only for a new kind of puzzle) ---------- */
  let owlPos = { x: 0, y: 0 };
  const owlTf = p => `translate(${Math.round(p.x - 48)}px, ${Math.round(p.y - 104)}px)`;
  const carryTf = p => `translate(${Math.round(p.x - 30)}px, ${Math.round(p.y - 26)}px)`;
  function placeOwl(p) {
    owlPos = p;
    $('#owl').style.transform = owlTf(p);
    $('#carry').style.transform = carryTf(p);
  }
  function moveOwl(to, fast) {
    const from = owlPos, owl = $('#owl'), carry = $('#carry');
    owlPos = to;
    if (!motionOK()) { placeOwl(to); return wait(260); }
    const ms = fast ? 380 : Math.min(950, 360 + Math.hypot(to.x - from.x, to.y - from.y) * 0.85);
    const opts = { duration: ms, easing: 'ease-in-out', fill: 'forwards' };
    const a = owl.animate([{ transform: owlTf(from) }, { transform: owlTf(to) }], opts);
    if (!carry.hidden) carry.animate([{ transform: carryTf(from) }, { transform: carryTf(to) }], opts);
    return a.finished.then(() => { placeOwl(to); }).catch(() => placeOwl(to));
  }
  function spot(sel) {
    const el = $(sel);
    if (!el) return null;
    const box = $('#play').getBoundingClientRect(), r = el.getBoundingClientRect();
    return { x: r.left - box.left + r.width / 2, y: r.top - box.top + Math.min(r.height * 0.45, 40) };
  }
  function demoSteps() {
    const s = [];
    if (PZ.mech === 'choose') {
      const i = PZ.opts.findIndex(o => o.right);
      const to = PZ.target && $(`#scene [data-id="${PZ.target}"]`) ? `#scene [data-id="${PZ.target}"]` : null;
      s.push({ from: `#answers [data-i="${i}"]`, carry: to ? SC.option(PZ.opts[i]) : null, to, apply: () => { V.marks['opt' + i] = 'right'; V.solved = true; } });
    } else if (PZ.mech === 'fill') {
      PZ.slots.forEach((id, k) => {
        const want = findCell(id).tok, pi = PZ.palette.findIndex(t => A.key(t) === A.key(want));
        s.push({ from: `#answers [data-i="${pi}"]`, carry: A.svg(want, 'pc'), to: `#scene [data-id="${id}"]`, apply: () => { V.filled[id] = want; V.fillAt = k + 1; V.justId = id; } });
      });
    } else if (PZ.mech === 'tap') {
      const id = PZ.showRight || PZ.rightIds[0];
      s.push({ to: `#scene [data-id="${id}"]`, tap: true, apply: () => { V.marks[id] = 'right'; V.solved = true; } });
    } else if (PZ.mech === 'build') {
      const row = PZ.scene.rows.findIndex(r => r.build);
      PZ.solution.forEach((t, k) => {
        const pi = PZ.palette.findIndex(x => A.key(x) === A.key(t));
        s.push({ from: `#answers [data-i="${pi}"]`, carry: A.svg(t, 'pc'), to: `#scene [data-id="r${row}c${k}"]`, apply: () => { V.built.push(t); V.justBuilt = true; } });
      });
      s.push({ to: '#answers [data-act="check"]', tap: true, apply: () => { V.solved = true; } });
    } else if (PZ.mech === 'select') {
      PZ.want.forEach(id => s.push({ to: `#scene [data-id="${id}"]`, tap: true, quick: true, apply: () => { V.sel.add(id); } }));
      s.push({ to: '#answers [data-act="check"]', tap: true, apply: () => { V.solved = true; } });
    } else if (PZ.mech === 'order') {
      PZ.orderIds.forEach(id => s.push({ to: `#scene [data-id="${id}"]`, tap: true, apply: () => { V.order.push(id); V.marks[id] = 'picked'; } }));
    }
    return s;
  }
  async function runDemo() {
    const id = V.id, owl = $('#owl'), carry = $('#carry');
    const box = $('#play').getBoundingClientRect();
    carry.hidden = true; carry.innerHTML = '';
    placeOwl({ x: -60, y: box.height * 0.55 });
    owl.hidden = false;
    await wait(motionOK() ? 900 : 400);
    if (V.id !== id) return;
    await moveOwl({ x: 90, y: box.height * 0.5 });
    await wait(motionOK() ? 500 : 200);
    for (const st of demoSteps()) {
      if (V.id !== id) return;
      if (st.from) {
        const f = spot(st.from);
        if (f) { await moveOwl({ x: f.x, y: f.y - 6 }); if (V.id !== id) return; }
        if (st.carry) { carry.innerHTML = st.carry; carry.hidden = false; placeOwl(owlPos); sound('tick'); }
        await wait(motionOK() ? 200 : 120);
      }
      if (st.to) {
        const t = spot(st.to);
        if (t) await moveOwl({ x: t.x, y: t.y - 6 }, st.quick);
        if (V.id !== id) return;
        if (st.tap && motionOK()) { await moveOwl({ x: owlPos.x, y: owlPos.y + 10 }, true); await moveOwl({ x: owlPos.x, y: owlPos.y - 10 }, true); }
      }
      carry.hidden = true; carry.innerHTML = '';
      st.apply(); sound('tick'); redraw();
      await wait(motionOK() ? (st.quick ? 160 : 380) : 300);
    }
    if (V.id !== id) return;
    const b = $('#play').getBoundingClientRect();
    await moveOwl({ x: -80, y: b.height * 0.45 });
    owl.hidden = true;
    if (V.id !== id) return;
    V.locked = false; V.solved = true;
    solve(false);
  }
  function hideOwl() { $('#owl').hidden = true; $('#carry').hidden = true; }

  /* ---------- hints ---------- */
  function showHint() {
    if (!V || V.solved || V.locked) return;
    const h = PZ.hints[V.hints];
    if (!h) return;
    V.hints++;
    if (h.show) V.vis.add(h.show);
    redraw(); drawButtons();
    setMsg(h.text, 'hint');
    if (autoRead()) speak(h.text);
  }

  /* ---------- the flow ---------- */
  let cardLabel = 'Next', cardThen = null;
  function startSitting() {
    if (!session || session.count >= SITTING) newSession();
    nextPuzzle();
  }
  function nextPuzzle() {
    hideOwl();
    if (session.count >= SITTING) { showSummary(); return; }
    const plan = makePlan(), kind = kindOf(plan.e), w = LADDER[plan.lvl - 1].w;
    if (plan.flavour === 'level' && !P.cards['intro' + w]) { showCard('intro', { to: w }, () => nextPuzzle()); return; }
    if (SET.watch && (!P.seen[kind] || plan.demoAgain)) { showPuzzle(plan, { demo: true }); return; }
    P.seen[kind] = 1;
    showPuzzle(plan);
  }
  function onMain() {
    audio();
    if (screenNow === 'map' || screenNow === 'summary') { startSitting(); return; }
    if (screenNow === 'card') { const f = cardThen; cardThen = null; if (f) f(); return; }
    if (!V || !V.solved) return;
    if (V.demo) {
      P.seen[PZ.kind] = 1;
      if (PLAN.demoAgain && P.again) P.again.demoed = true;
      save();
      showPuzzle(PLAN);
      return;
    }
    const ev = V.event; V.event = null;
    if (ev && ev.type === 'world') { showCard('done', ev, () => showCard('intro', { to: ev.to }, () => nextPuzzle())); return; }
    if (ev && ev.type === 'expert') { showCard('expert', ev, () => nextPuzzle()); return; }
    nextPuzzle();
  }

  /* ---------- cards: a new world, a world finished, Pattern Expert ---------- */
  function showCard(type, ev, then) {
    hideOwl();
    screen('card');
    cardThen = then;
    let h = '';
    if (type === 'intro') {
      const W = WORLDS[ev.to];
      P.cards['intro' + ev.to] = 1; save();
      cardLabel = 'Let’s go';
      h = `<div class="card-in"><svg class="card-icon" viewBox="-50 -50 100 100" aria-hidden="true"><circle r="48" fill="${W.col}"/><g transform="scale(1.3)">${A.worldIcon(ev.to, W.col)}</g></svg>` +
        `<p class="card-kicker">World ${ev.to + 1} of ${WORLDS.length}</p><h2>${esc(W.name)}</h2><p class="card-text">${esc(W.intro)}</p></div>`;
      setMsg(`${W.name}. ${W.intro}`, 'info');
    } else if (type === 'done') {
      const W = WORLDS[ev.from];
      cardLabel = 'Next';
      sound('level');
      h = `<div class="card-in"><svg class="card-icon" viewBox="-50 -50 100 100" aria-hidden="true"><circle r="48" fill="#F4C452"/><g transform="scale(1.3)">${A.worldIcon(8, '#F4C452')}</g></svg>` +
        `<p class="card-kicker">You finished the</p><h2>${esc(W.name)}</h2><p class="card-fact"><strong>Pattern fact:</strong> ${esc(W.fact)}</p></div>`;
      setMsg(`You finished the ${W.name}! Pattern fact: ${W.fact}`, 'good');
    } else {
      cardLabel = 'Keep going';
      sound('level');
      h = `<div class="card-in"><svg class="card-icon" viewBox="-50 -50 100 100" aria-hidden="true"><circle r="48" fill="#F4C452"/><g transform="scale(1.3)">${A.worldIcon(8, '#F4C452')}</g></svg>` +
        '<p class="card-kicker">You finished all eight worlds</p><h2>Pattern Expert</h2><p class="card-text">You can spot patterns in lines, circles, grids, numbers, rules, mirrors and puzzles. You can keep playing the hardest puzzles here.</p></div>';
      setMsg('You are a Pattern Expert! You can keep playing the hardest puzzles.', 'good');
    }
    $('#card').innerHTML = h;
    drawTop(); drawButtons();
    if (autoRead()) speak(msgText);
  }

  /* ---------- the journey map ---------- */
  const STOPS = [[160, 236], [430, 190], [705, 236], [985, 190], [1160, 372], [885, 428], [605, 386], [330, 430], [128, 470]];
  function mapSVG() {
    const L = cur(), now = L.w;
    const pts = STOPS, seg = [];
    const p = [pts[0]].concat(pts, [pts[pts.length - 1]]);
    for (let i = 1; i < p.length - 2; i++) {
      const [p0, p1, p2, p3] = [p[i - 1], p[i], p[i + 1], p[i + 2]];
      seg.push(`M${p1[0]} ${p1[1]}C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0]} ${p2[1]}`);
    }
    let s = '<svg class="map-svg" viewBox="0 0 1326 576" preserveAspectRatio="xMidYMid meet" role="img" aria-label="The pattern journey: eight worlds joined by a path.">' +
      '<rect x="6" y="6" width="1314" height="564" rx="24" fill="#F8EEDB"/><rect x="18" y="18" width="1290" height="540" rx="20" fill="none" stroke="#E3CEA8" stroke-width="3" stroke-dasharray="1 10" stroke-linecap="round"/>';
    s += `<path d="${seg.join('')}" fill="none" stroke="#EDDDBD" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/>`;
    seg.forEach((d, i) => { s += `<path d="${d}" fill="none" stroke="${i < now ? '#E3A12A' : '#BF9761'}" stroke-width="7" stroke-linecap="round" stroke-dasharray="0 18"/>`; });
    pts.forEach(([x, y], i) => {
      const W = WORLDS[i], col = W ? W.col : '#E2B04A', state = i < now ? 'done' : i === now ? 'now' : (i === 8 && P.expert ? 'done' : 'later');
      let g = '';
      if (state === 'now') g += `<circle class="map-pulse" cx="${x}" cy="${y}" r="66" fill="none" stroke="#F4C452" stroke-width="7"/>`;
      g += `<g${state === 'later' ? ' class="later"' : ''}><circle cx="${x}" cy="${y}" r="56" fill="#FFFDF7" stroke="#D9C29A" stroke-width="3"/><circle cx="${x}" cy="${y}" r="46" fill="${col}"/><g transform="translate(${x} ${y})">${A.worldIcon(i, col)}</g></g>`;
      if (state === 'done') g += `<circle cx="${x + 38}" cy="${y - 38}" r="16" fill="#F4C452" stroke="#FFFDF7" stroke-width="3"/><path d="M${x + 31} ${y - 38}l5 5 9 -10" fill="none" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;
      const name = W ? W.name : 'Pattern Expert', w = Math.round(name.length * 10.4 + 30);
      g += `<rect x="${x - w / 2}" y="${y + 60}" width="${w}" height="32" rx="16" fill="#FFFDF7" stroke="#E2CBA3" stroke-width="2"/><text x="${x}" y="${y + 82}" text-anchor="middle" class="map-label">${esc(name)}</text>`;
      if (state === 'now') g += `<text x="${x}" y="${y + 116}" text-anchor="middle" class="map-sub">Level ${L.inWorld} of ${L.ofWorld}</text>`;
      s += g;
    });
    const [cx, cy] = pts[now];
    s += `<g transform="translate(${cx} ${cy - 80})"><rect x="-74" y="-18" width="148" height="36" rx="18" fill="#2F5DA8"/><path d="M-9 17L0 28L9 17Z" fill="#2F5DA8"/><text x="0" y="7" text-anchor="middle" class="map-tag">You are here</text></g>`;
    s += `<g transform="translate(${cx + 92} ${cy + 26}) scale(.56)"><g class="owl-bob">${A.owl(false)}</g></g>`;
    return s + '</svg>';
  }
  function showMap() {
    hideOwl();
    screen('map');
    const L = cur(), W = WORLDS[L.w];
    $('#map').innerHTML = `<div class="map-head"><h2>Your pattern journey</h2><p>Eight worlds. Each one starts easy.</p></div>${mapSVG()}`;
    setMsg(P.rounds ? `You are in the ${W.name}, level ${L.inWorld} of ${L.ofWorld}. Press Keep going when you are ready.` : 'Welcome to Patterns! Press Keep going to start with the Train world.', 'info');
    drawTop(); drawButtons();
  }

  /* ---------- end of a sitting ---------- */
  function showSummary() {
    hideOwl();
    screen('summary');
    const L = cur(), W = WORLDS[L.w], n = session.stars;
    const pct = Math.min(100, Math.round(100 * Math.max(sum(P.win) / L.need, streak() / L.fast)));
    $('#summary').innerHTML = `<div class="sum-in"><div class="sum-star">${A.starIcon(110)}</div>` +
      `<h2>${n} ${n === 1 ? 'star' : 'stars'}</h2><p class="sum-sub">${n === SITTING ? 'Every one right first time!' : `You got ${n} of ${SITTING} right first time.`}</p>` +
      `<p class="sum-where">${esc(W.name)} · level ${L.inWorld} of ${L.ofWorld}</p><div class="meter big"><span style="width:${pct}%"></span></div>` +
      `<div class="sum-btns"><button type="button" class="tool" id="to-map">${A.icon('map', 22)}Journey map</button><a class="tool" href="../my-stars.html">${A.starIcon(22)}My Stars</a></div></div>`;
    $('#to-map').addEventListener('click', () => showMap());
    setMsg(n >= 8 ? `Brilliant! ${n} stars.` : n >= 5 ? `Well done! ${n} stars.` : `Good work. ${n} ${n === 1 ? 'star' : 'stars'}. Every puzzle helps you learn.`, 'good');
    drawTop(); drawButtons();
    if (autoRead()) speak(msgText);
  }

  /* ---------- grown-ups panel ---------- */
  function renderGrownups() {
    const L = cur(), W = WORLDS[L.w];
    const kinds = [...new Set(L.deck.map(kindOf))];
    const todo = kinds.filter(k => !P.got[k]).map(k => KINDS[k].name);
    let jump = '<select id="g-jump" aria-label="Jump to a level">';
    WORLDS.forEach((Wd, w) => {
      jump += `<optgroup label="${esc(Wd.name)}">`;
      LADDER.forEach(Lv => {
        if (Lv.w !== w) return;
        const label = Lv.focus ? `new: ${KINDS[Lv.focus].name}` : [...new Set(Lv.deck.map(kindOf))].map(k => KINDS[k].name).join(', ');
        jump += `<option value="${Lv.n}"${Lv.n === P.level ? ' selected' : ''}>${Lv.inWorld}. ${esc(label)}</option>`;
      });
      jump += '</optgroup>';
    });
    jump += '</select>';
    const byWorld = WORLDS.map((Wd, w) => {
      let n = 0, r = 0;
      Object.entries(P.skills).forEach(([k, s]) => { if (KINDS[k] && KINDS[k].w === w) { n += s[0]; r += s[1]; } });
      return n ? `<tr><th>${esc(Wd.name)}</th><td>${Math.round(100 * r / n)}%</td><td>${r} of ${n}</td></tr>` : '';
    }).join('');
    const recent = P.recent.slice(-12).reverse().map(x => `<li><span class="${x.ok ? 'ok' : 'no'}">${x.ok ? '★' : '·'}</span> ${esc(KINDS[x.k] ? KINDS[x.k].name : x.k)}${x.f !== 'level' ? ` <em>(${esc(FLAVOUR[x.f] || x.f)})</em>` : ''}</li>`).join('');
    const tog = (key, label, on) => `<label class="g-toggle"><input type="checkbox" data-set="${key}"${on ? ' checked' : ''}> ${label}</label>`;
    const themes = PW.ALL_THEMES.map(t => {
      const first = Object.keys(A.THEMES[t].pieces)[0];
      return `<button type="button" class="g-theme" data-theme="${t}" aria-pressed="${SET.themes[t] !== false}">${A.svg({ theme: t, id: first }, 'pc')}${esc(A.THEMES[t].label)}</button>`;
    }).join('');
    $('#grown-body').innerHTML =
      `<section><h3>Where he is</h3><p><strong>${esc(W.name)}</strong> (world ${L.w + 1} of 8), level ${L.inWorld} of ${L.ofWorld}. That is level ${L.n} of ${TOP} in all.</p>` +
      `<p>${L.focus ? `This level has one new kind of puzzle on its own: <strong>${esc(KINDS[L.focus].name)}</strong>.` : `This level mixes: ${kinds.map(k => esc(KINDS[k].name)).join(', ')}.`}</p>` +
      `<p>He moves up after <strong>${L.need} of his last ${L.win}</strong> puzzles at this level are right first time on his own (no hint), or ${L.fast} in a row. So far: ${sum(P.win)} of the last ${P.win.length}.` +
      `${todo.length ? ` Still to get right on his own: ${todo.map(esc).join(', ')}.` : ''}</p>` +
      `<div class="g-row"><button type="button" class="tool" data-g="down"${P.level <= 1 ? ' disabled' : ''}>− Easier level</button><button type="button" class="tool" data-g="up"${P.level >= TOP ? ' disabled' : ''}>Harder level +</button></div>` +
      `<p class="g-label">Jump to any level:</p>${jump}</section>` +
      `<section><h3>Settings</h3>${tog('watch', 'The owl shows each new kind of puzzle first (“Watch me”)', SET.watch)}${tog('read', 'Read questions out loud (all games)', autoRead())}` +
      `${tog('sounds', 'Sounds and chimes', Kit.soundsOn())}${tog('calm', 'Calm mode: less movement, no chimes', SET.calm)}</section>` +
      `<section><h3>Pieces he likes</h3><p>Repeating patterns use only the pieces switched on. Keep at least two on.</p><div class="g-themes">${themes}</div></section>` +
      `<section><h3>Right first time</h3>${byWorld ? `<table class="g-table"><tbody>${byWorld}</tbody></table>` : '<p>Nothing yet.</p>'}` +
      `${recent ? `<p class="g-label">Recent puzzles:</p><ul class="g-recent">${recent}</ul>` : ''}</section>` +
      '<section><h3>How it works</h3><ul class="g-how"><li>8 worlds, ' + TOP + ' levels, from copying a two-colour train up to Key Stage 3 number rules and puzzle grids.</li>' +
      '<li>Each new kind of puzzle gets a level of its own with the easiest version first. The owl shows it once.</li>' +
      '<li>Each sitting is 10 puzzles: 2 warm-ups first, then one old puzzle after every 4 at his level.</li>' +
      '<li>One mistake: another of the same kind. Two in a row: an easier practice one with a clue. The level never goes down by itself.</li>' +
      '<li>One star for each puzzle right first time. Stars show in My Stars like every other game.</li></ul></section>' +
      `<section><h3>Start again</h3><p>Back to the first level. His stars stay.</p><button type="button" class="tool warn" data-g="reset">Start again from level 1</button></section>`;
  }
  function setLevel(n) {
    P.level = Math.min(TOP, Math.max(1, n)); P.win = []; P.got = {}; P.at = 0; P.again = null;
    save(); renderGrownups();
    if (screenNow === 'map') showMap(); else drawTop();
  }
  function onGrownClick(ev) {
    const b = ev.target.closest('button');
    if (!b) return;
    if (b.dataset.g === 'up') setLevel(P.level + 1);
    else if (b.dataset.g === 'down') setLevel(P.level - 1);
    else if (b.dataset.g === 'reset') {
      if (b.dataset.sure) { const keep = { rounds: P.rounds, stars: P.stars }; P = Object.assign(blank(), keep); save(); renderGrownups(); if (screenNow !== 'play') showMap(); }
      else { b.dataset.sure = '1'; b.textContent = 'Press again to start again'; }
    } else if (b.dataset.theme) {
      const t = b.dataset.theme, on = SET.themes[t] !== false;
      if (on && themesOn().length <= 2) return;
      SET.themes[t] = !on; saveSet(); PW.setThemes(themesOn());
      b.setAttribute('aria-pressed', String(!on));
    }
  }
  function onGrownChange(ev) {
    const t = ev.target;
    if (t.id === 'g-jump') { setLevel(+t.value); return; }
    const k = t.dataset.set;
    if (!k) return;
    if (k === 'watch') { SET.watch = t.checked; saveSet(); }
    if (k === 'calm') { SET.calm = t.checked; saveSet(); document.body.classList.toggle('calm', SET.calm); }
    if (k === 'read') Kit.setting('readAloud', t.checked);
    if (k === 'sounds') { Kit.setting('sounds', t.checked); drawTop(); }
  }

  /* ---------- start ---------- */
  function init() {
    document.body.insertAdjacentHTML('afterbegin', A.defs());
    document.body.classList.toggle('calm', SET.calm);
    $('#home-icon').innerHTML = A.icon('home', 22);
    $('#maths-icon').innerHTML = A.icon('maths', 22);
    $('#star-icon').innerHTML = A.starIcon(28);
    $('#grown-btn').innerHTML = A.icon('people', 22);
    $('#say-btn').innerHTML = A.icon('speak', 22);
    $('#hint-btn').innerHTML = `${A.icon('bulb', 22)}Hint`;
    $('#avatar').innerHTML = `<svg viewBox="-46 -60 92 92" aria-hidden="true">${A.owl(false)}</svg>`;
    $('#owl').innerHTML = `<svg viewBox="-60 -68 120 128" aria-hidden="true">${A.owl(true)}</svg>`;
    $('#grown-close').innerHTML = A.icon('close', 22);
    $('#play').addEventListener('click', onPlayClick);
    $('#main-btn').addEventListener('click', onMain);
    $('#hint-btn').addEventListener('click', showHint);
    $('#say-btn').addEventListener('click', () => { audio(); speak(screenNow === 'play' && V && !V.solved ? PZ.prompt + '. ' + (msgText !== PZ.prompt ? msgText : '') : msgText); });
    $('#sound-btn').addEventListener('click', () => { Kit.setting('sounds', !Kit.soundsOn()); drawTop(); if (Kit.soundsOn()) sound('tick'); });
    const dlg = $('#grownups');
    $('#grown-btn').addEventListener('click', () => { renderGrownups(); if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', ''); });
    $('#grown-close').addEventListener('click', () => { if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); });
    dlg.addEventListener('click', onGrownClick);
    dlg.addEventListener('change', onGrownChange);
    dlg.addEventListener('close', () => { if (screenNow === 'map') showMap(); else drawTop(); });
    showMap();
  }

  // For testing in a browser: window.patternsGame
  window.patternsGame = {
    get progress() { return P; }, get view() { return V; }, get puzzle() { return PZ; }, get plan() { return PLAN; }, get session() { return session; }, get screen() { return screenNow; },
    LADDER, WORLDS, KINDS,
    show(kind, lvl, opts = {}) { if (!session) newSession(); const L = LADDER[(lvl || P.level) - 1]; const e = L.deck.find(x => kindOf(x) === kind) || kind; showPuzzle({ flavour: opts.flavour || 'level', lvl: L.n, e, help: !!opts.help }, opts); },
    setLevel, start: startSitting, map: showMap,
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
