/* Sentence Studio – the game (17 Nov 2026).
   Teaching idea: Colourful Semantics. A sentence answers questions about a picture, in order:
   Who? (orange) → What doing? (yellow) → What? (green) → Where? (blue). He taps the cards in order and
   finishes with the full stop, which is a card of its own so he learns it always goes last.
   9 stages, one new thing each; inside a stage help fades step by step. Moving on needs about 80%.
   Stages have ids (who, what, where, pos, …) so new ones can be slotted in later without breaking saved progress.
   The order follows school order, stretched out for autistic children: concrete, picture-led steps first,
   anything abstract much later (DESIGN-RULES §3).
   When a sentence is finished it is read back once and play moves on by itself after about 2 seconds.
   No facts after each sentence: Kas found they pulled the child away from building it (22 Nov 2026). */
(function () {
  'use strict';

  const ART = window.SBArt, C = window.SB_CONTENT;
  const { SCENES, ICONS, NO_DISTRACT, PLACE_GROUP, DOING_GROUP } = C;

  /* =====================================================================
     1. RULES – this game's own numbers. How it moves on (steps, stages, 80%, challenges, reviews,
        warm-ups, sittings of 10) is the hub's ladder, the same in every game: kit/ladder.js.
     ===================================================================== */
  const RULES = {
    autoAfter: 5,         // wrong taps on one box before the right card moves in by itself
    glowAfter: 3,         // wrong taps on one box before the right card glows
    idleHintMs: 12000,
    tapLockMs: 700,       // taps are ignored this long after a miss, so tapping everything doesn't work
    autoNextMs: 2200,     // a finished sentence stays this long after it is read back, then the next one comes
    recentKeep: 26,
    builtKeep: 40
  };

  const ROLE = { o: 'who', y: 'doing', g: 'what', b: 'where', k: 'join', r: 'why' };
  const LABEL = { who: 'Who?', doing: 'What doing?', what: 'What?', where: 'Where?', join: 'Joining word', why: 'Why?' };
  const STAGE_LIST = [
    { id: 'who', name: 'Who and doing', skill: 'Who and doing', mode: 'chunk', key: ['who', 'doing'],
      line: 'Who is it? What are they doing? Put the cards in order, then finish with a full stop.',
      steps: [
        { help: 0, extra: 0, form: 'a', note: 'coloured cards and boxes, with pictures' },
        { help: 1, extra: 0, form: 'a', note: 'coloured boxes, plain cards' },
        { help: 1, extra: 1, form: 'a', note: 'coloured boxes, plus one card that doesn’t match the picture' },
        { help: 2, extra: 1, form: 'a', note: 'plain boxes and cards, plus one card that doesn’t match' }] },
    { id: 'what', name: 'Adding what', skill: 'Adding what', mode: 'chunk', key: ['who', 'doing', 'what'],
      line: 'Now say WHAT they are doing it to. Who? What doing? What?',
      steps: [
        { help: 0, extra: 0, form: 'b', note: 'coloured cards and boxes, with pictures' },
        { help: 1, extra: 0, form: 'b', note: 'coloured boxes, plain cards' },
        { help: 1, extra: 1, form: 'b', note: 'coloured boxes, plus one card that doesn’t match the picture' },
        { help: 2, extra: 1, form: 'b', note: 'plain boxes and cards, plus one card that doesn’t match' }] },
    { id: 'where', name: 'Adding where', skill: 'Adding where', mode: 'chunk', key: ['who', 'doing', 'what', 'where'],
      line: 'Now say WHERE it is happening. Who? What doing? What? Where?',
      steps: [
        { help: 0, extra: 0, form: 'c3', note: 'who, doing and where; coloured, with pictures' },
        { help: 0, extra: 0, form: 'c4', note: 'four parts; coloured, with pictures' },
        { help: 1, extra: 1, form: 'c', note: 'coloured boxes, plain cards, one card that doesn’t match' },
        { help: 2, extra: 1, form: 'c', note: 'plain boxes and cards, one card that doesn’t match' }] },
    // In, on, under (22 Nov 2026): the picture shows the position; the wrong card is the same place with the wrong word.
    { id: 'pos', name: 'In, on, under', skill: 'In, on, under', mode: 'chunk', key: ['who', 'doing', 'where'],
      line: 'Look where they are. IN, ON or UNDER? The picture shows you.',
      steps: [
        { help: 0, extra: 0, form: 'pos', note: 'in, on or under; coloured, with pictures' },
        { help: 0, extra: 1, form: 'pos', note: 'coloured, plus the same place with the wrong word (in, on or under)' },
        { help: 1, extra: 1, form: 'pos', note: 'coloured boxes, plain cards, plus the wrong position' },
        { help: 2, extra: 1, form: 'pos', note: 'plain boxes and cards, plus the wrong position' }] },
    { id: 'word', name: 'Word by word', skill: 'Word by word', mode: 'word', key: [],
      line: 'Now build it one word at a time. A sentence starts with a capital letter and ends with a full stop.',
      steps: [
        { help: 0, extra: 0, form: 'a', note: '3 to 4 words, coloured' },
        { help: 1, extra: 0, form: 'b', note: '4 to 6 words, plain' },
        { help: 1, extra: 1, form: 'b', note: '4 to 6 words, plus one extra word' },
        { help: 2, extra: 1, form: 'c', note: '5 to 8 words, plus one extra word' }] },
    { id: 'ask', name: 'Asking questions', skill: 'Asking questions', mode: 'word', key: [],
      line: 'Some sentences ASK something. They start with words like Why, How or What, and end with a question mark.',
      steps: [
        { help: 0, extra: 0, q: 1, note: 'only questions; tips on' },
        { help: 1, extra: 0, q: 0.5, note: 'questions and telling sentences mixed: ? or .' },
        { help: 2, extra: 1, q: 0.5, note: 'mixed, plus one extra word' }] },
    // Joining with "and" on its own (22 Nov 2026): two people first (Leo and Maya are…), then two whole parts.
    { id: 'and', name: 'Joining with and', skill: 'Joining words', mode: 'chunk', key: ['who', 'join', 'doing'],
      line: 'AND joins two parts together. Leo AND Maya are dancing.',
      steps: [
        { help: 0, extra: 0, form: 'and2', note: 'two people joined with “and”, coloured' },
        { help: 1, extra: 0, form: 'and2', note: 'two people, coloured boxes, plain cards' },
        { help: 1, extra: 1, form: 'and', note: 'any “and” sentence, plus one card that doesn’t match' },
        { help: 2, extra: 1, form: 'and', note: 'plain boxes and cards, plus one card that doesn’t match' }] },
    { id: 'detect', name: 'Sentence detective', skill: 'Fixing sentences', mode: 'fix', key: [],
      line: 'Each sentence has ONE mistake. Find it and tap it to fix it!',
      steps: [
        { mistakes: ['stop'], check: true, note: 'a missing full stop' },
        { mistakes: ['stop', 'cap'], check: true, note: 'a missing full stop or capital letter at the start' },
        { mistakes: ['stop', 'cap', 'name'], check: true, note: '+ names without a capital letter' },
        { mistakes: ['stop', 'cap', 'name', 'mark', 'swap'], check: false, note: '+ the wrong end mark, or two words swapped' }] },
    // Saying why, the first of the "still concrete" stages: the reason is always in the picture. Never jumped into.
    { id: 'because', name: 'Saying why', skill: 'Saying why', mode: 'chunk', key: ['who', 'doing', 'join', 'why'], noJump: true,
      line: 'BECAUSE tells us WHY. Look at the picture to find the reason.',
      steps: [
        { help: 0, extra: 0, form: 'because', note: '“because” and a reason you can see, coloured' },
        { help: 1, extra: 0, form: 'because', note: 'coloured boxes, plain cards' },
        { help: 1, extra: 1, form: 'because', note: 'coloured boxes, plus a reason that doesn’t fit the picture' },
        { help: 2, extra: 1, form: 'because', note: 'plain boxes and cards, plus a reason that doesn’t fit' }] }
  ];
  const STAGES = {};
  STAGE_LIST.forEach((S, i) => { STAGES[i + 1] = S; });
  const TOP = STAGE_LIST.length;
  const SID = (n) => (STAGES[n] ? STAGES[n].id : '');
  const SNUM = (id) => STAGE_LIST.findIndex((S) => S.id === id) + 1;   // 0 if unknown
  const isAsk = (n) => SID(n) === 'ask';
  const NAMES = ['Leo', 'Maya', 'Milo', 'Rex', 'Ollie'];

  /* =====================================================================
     2. SMALL HELPERS
     ===================================================================== */
  const $ = (id) => document.getElementById(id);
  const esc = (s) => (window.Kit ? Kit.esc(s) : String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])));
  const rand = (n) => Math.floor(Math.random() * n);
  const pick = (a) => a[rand(a.length)];
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const sum = (a) => a.reduce((x, y) => x + y, 0);
  const lc = (s) => s.charAt(0).toLowerCase() + s.slice(1);
  const uc = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  function today() { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function setting(name, value) {
    if (!window.Kit) return arguments.length > 1 ? value : undefined;
    return arguments.length > 1 ? Kit.setting(name, value) : Kit.setting(name);
  }
  let FAST = false;
  const wait = (ms) => new Promise((r) => setTimeout(r, FAST ? Math.min(ms, 15) : ms));
  const parse = (str) => String(str).split('|').map((c) => ({ role: ROLE[c.charAt(0)] || 'plain', text: c.slice(2).trim() }));
  const words = (parts) => { const out = []; parts.forEach((p) => p.text.split(' ').forEach((w) => out.push({ role: p.role, text: w }))); return out; };
  const qWords = (q) => q.replace(/[?.!]\s*$/, '').split(' ').map((w) => ({ role: 'plain', text: w }));
  const sentenceText = (parts, end) => parts.map((p) => p.text).join(' ') + end;

  /* =====================================================================
     3. TALKING – en-GB voice; questions he builds in a younger voice
     ===================================================================== */
  let voice = null;
  function pickVoice() {
    // One voice for the whole hub: the kit's (DESIGN-RULES §1.7). The lines below are only for a preview without the kit.
    if (window.Kit && Kit.voice) { voice = Kit.voice(); return; }
    if (!('speechSynthesis' in window)) return;
    const vs = window.speechSynthesis.getVoices() || [];
    voice = vs.find((v) => /en-GB/i.test(v.lang) && /female|libby|sonia|hazel|serena|google uk english female/i.test(v.name)) ||
      vs.find((v) => /en-GB/i.test(v.lang)) || vs.find((v) => /^en/i.test(v.lang)) || null;
  }
  if ('speechSynthesis' in window) { pickVoice(); try { window.speechSynthesis.addEventListener('voiceschanged', pickVoice); } catch (e) {} }
  const voiceOn = () => setting('readAloud') !== false;
  const soundsOn = () => setting('sounds') !== false;
  let talkGen = 0;
  const keepU = [];
  let talker = null;   // a character whose mouth moves while the voice talks
  function speakable(t) {
    return String(t).replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}️‍]/gu, '').replace(/\s+/g, ' ').trim();
  }
  const speaking = () => { try { return !FAST && 'speechSynthesis' in window && window.speechSynthesis.speaking; } catch (e) { return false; } };
  function stopTalk() { talkGen++; try { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); } catch (e) {} if (talker) talker.talking = false; }
  function talk(text, opts) {
    opts = opts || {};
    const clean = speakable(text);
    const readMs = Math.max(700, clean.length * 55);
    if (!clean) return Promise.resolve();
    const who = opts.who || null;
    if (FAST || !voiceOn() || !('speechSynthesis' in window)) return wait(FAST ? 10 : Math.min(readMs, 2600));
    const my = ++talkGen;
    return new Promise((resolve) => {
      let done = false, guard = null, started = false;
      const finish = () => { if (done) return; done = true; clearTimeout(guard); if (who) who.talking = false; resolve(my === talkGen); };
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(clean);
        if (voice) u.voice = voice;
        u.lang = (voice && voice.lang) || 'en-GB';
        u.rate = opts.rate || 0.9;
        u.pitch = opts.pitch || 1;
        u.onstart = () => { started = true; if (who && my === talkGen) { talker = who; who.talking = true; } clearTimeout(guard); guard = setTimeout(finish, readMs * 2 + 2500); };
        u.onend = finish;
        u.onerror = () => { if (started) finish(); else setTimeout(finish, Math.min(readMs, 2600)); };
        keepU.push(u); if (keepU.length > 6) keepU.shift();
        window.speechSynthesis.speak(u);
        guard = setTimeout(() => { if (!started) { try { window.speechSynthesis.cancel(); } catch (e) {} setTimeout(finish, Math.min(readMs, 2200)); } }, 2200);
      } catch (e) { finish(); }
    });
  }
  const sayMark = (m) => (m === '?' ? 'question mark' : 'full stop');

  /* =====================================================================
     4. SAVED PROGRESS – the ladder keeps where he is (by stage id, through Stars.save);
        the game adds its own: the pictures seen lately and the sentences he built.
     ===================================================================== */
  const st = { recent: [], built: [] };
  let ladder = null, sittingBuilt = [], started = false;
  /* Saves from before stages had ids (v1 used the numbers 1–7) are moved across. A child already past
     "Adding where" gets "In, on, under" checked through reviews (it comes back like a stage he jumped over). */
  const V1 = { 1: 'who', 2: 'what', 3: 'where', 4: 'word', 5: 'ask', 6: 'and', 7: 'detect' };
  function legacy(s) {
    const old = Math.round(Number(s.level) || 1);
    const I = (x) => V1[Math.round(Number(x))] || '';
    const ids = (a) => (Array.isArray(a) ? a.map(I).filter(Boolean) : []);
    const keys = (o) => { const out = {}; if (o && typeof o === 'object') Object.keys(o).forEach((k) => { if (I(k)) out[I(k)] = o[k]; }); return out; };
    const out = Object.assign({}, s, {
      v: 2, sid: I(old) || 'who', seen: ids(s.seen), skills: keys(s.skills), skipped: ids(s.skipped), skipMiss: keys(s.skipMiss), skipGood: keys(s.skipGood),
      chal: s.chal ? Object.assign({}, s.chal, { to: I(s.chal.to) }) : null,
      jump: s.jump ? Object.assign({}, s.jump, { from: I(s.jump.from), to: I(s.jump.to) }) : null,
      jumps: Array.isArray(s.jumps) ? s.jumps.map((j) => Object.assign({}, j, { from: I(j.from), to: I(j.to), back: j.back ? I(j.back) : 0 })) : [],
      built: Array.isArray(s.built) ? s.built.map((b) => Object.assign({}, b, { s: I(b.s) })) : []
    });
    if (old >= 4 && !out.skipped.includes('pos')) out.skipped.push('pos');
    // "Because" used to be part of the old joining stage: if he had seen that stage, he has seen "because" too.
    if (Array.isArray(s.seen) && s.seen.map(Number).includes(6)) out.seen.push('because');
    return out;
  }
  function makeLadder() {
    ladder = Ladder.create({
      stages: STAGE_LIST, legacy,
      words: { item: 'sentence', items: 'sentences', expert: 'Sentence Expert' },
      keep: {
        save: () => ({ recent: st.recent, built: st.built.slice(-RULES.builtKeep) }),
        load: (s) => { if (Array.isArray(s.recent)) st.recent = s.recent.slice(-60); if (Array.isArray(s.built)) st.built = s.built.slice(-60); }
      },
      onChange: () => updateTop()
    });
  }
  const saveState = () => ladder.save();

  /* =====================================================================
     5. MAKING A PUZZLE
     ===================================================================== */
  const FORM = {
    a: (s) => s.a, b: (s) => s.b, c: (s) => s.c,
    c3: (s) => s.c && parse(s.c).length === 3 && s.c, c4: (s) => s.c && parse(s.c).length === 4 && s.c,
    pos: (s) => s.p && s.px && s.p,
    and: (s) => s.n || (s.j && s.j.includes('|k and|') && s.j),
    and2: (s) => { const t = FORM.and(s); return t && /^o [^|]+\|k and\|o /.test(t) && t; },   // two people: Leo and Maya are…
    because: (s) => s.j && s.j.includes('k because') && s.jx && s.j
  };
  function fresh(list) {
    const free = shuffle(list.filter((s) => !st.recent.includes(s.id)));
    return free.length ? free[0] : pick(list);
  }
  function remember(id) {
    st.recent = st.recent.filter((r) => r !== id);
    st.recent.push(id);
    if (st.recent.length > RULES.recentKeep) st.recent.shift();
  }
  // Every chunk of every scene, by role (to choose cards that don't fit the picture)
  const POOL = { who: [], doing: [], what: [], where: [] };
  SCENES.forEach((s) => ['a', 'b', 'c', 'j', 'n'].forEach((k) => { if (s[k]) parse(s[k]).forEach((p) => { if (POOL[p.role] && !POOL[p.role].some((q) => q.text === p.text)) POOL[p.role].push({ text: p.text, from: s.id }); }); }));
  function sceneTexts(sc) {
    const t = new Set();
    ['a', 'b', 'c', 'j', 'n', 'p'].forEach((k) => { if (sc[k]) parse(sc[k]).forEach((p) => t.add(p.text.toLowerCase())); });
    (sc.also || []).forEach((x) => t.add(x.toLowerCase()));
    if (/milo/i.test(sc.id) || /Milo/.test(sc.j || '')) t.add('milo');
    if (sc.id === 'maya-laugh') t.add('milo');
    return t;
  }
  function chunkExtras(sc, parts, n, form) {
    const out = [], used = sceneTexts(sc);
    // In, on, under: the wrong card is the same place with the wrong position word
    if (form === 'pos' && n > 0 && sc.px) shuffle(sc.px).slice(0, n).forEach((t) => out.push({ role: 'where', text: t }));
    if (out.length >= n) return out;
    const plural = parts.some((p) => p.role === 'doing' && /^are\b/.test(p.text));
    const roles = shuffle(parts.filter((p) => ['who', 'doing', 'what', 'where'].includes(p.role) && !(p.role === 'who' && (plural || parts.filter((q) => q.role === 'who').length > 1))));
    if (n > 0 && sc.jx && parts.some((p) => p.role === 'why')) out.push({ role: 'why', text: parse(sc.jx)[0].text });
    for (const p of roles) {
      if (out.length >= n) break;
      let pool = POOL[p.role].filter((q) => q.from !== sc.id && !used.has(q.text.toLowerCase()) && !NO_DISTRACT.includes(q.text));
      if (p.role === 'where') pool = pool.filter((q) => !PLACE_GROUP[p.text] || PLACE_GROUP[q.text] !== PLACE_GROUP[p.text]);
      if (p.role === 'doing') pool = pool.filter((q) => (!DOING_GROUP[p.text] || DOING_GROUP[q.text] !== DOING_GROUP[p.text]) && q.text.split(' ')[0] === p.text.split(' ')[0] && q.text.split(' ').length === p.text.split(' ').length);
      if (p.role === 'who') pool = pool.filter((q) => !/ and /.test(q.text) && q.text !== 'The leaves');
      if (!pool.length) continue;
      const q = pick(pool);
      out.push({ role: p.role, text: q.text });
      used.add(q.text.toLowerCase());
    }
    return out;
  }
  function wordExtras(sc, ws, n) {
    const out = [], have = new Set(ws.map((w) => w.text));
    const first = ws[0].text;
    const tries = shuffle(['twin', 'who', 'doing', 'what', 'doing', 'what']);
    for (const kind of tries) {
      if (out.length >= n) break;
      if (kind === 'twin') {
        if (!NAMES.includes(first) && !have.has(lc(first)) && /^[A-Z]/.test(first)) { out.push({ role: 'plain', text: lc(first), twin: true }); have.add(lc(first)); }
        continue;
      }
      const role = kind;
      const pool = POOL[role].filter((q) => q.from !== sc.id && !NO_DISTRACT.includes(q.text));
      const used = sceneTexts(sc);
      for (const q of shuffle(pool)) {
        if (used.has(q.text.toLowerCase())) continue;
        const w = role === 'who' ? (q.text.startsWith('The ') ? q.text.slice(4) : q.text) : q.text.split(' ').pop();
        if (!w || have.has(w) || have.has(uc(w)) || have.has(lc(w)) || w.length < 3) continue;
        out.push({ role, text: role === 'who' && !NAMES.includes(w) ? lc(w) : w });
        have.add(w);
        break;
      }
    }
    return out;
  }

  let cardSeq = 0;
  function cardsFor(parts, extras, ends) {
    const list = parts.map((p) => ({ id: 'c' + (++cardSeq), text: p.text, role: p.role, kind: 'part' }))
      .concat(extras.map((p) => ({ id: 'c' + (++cardSeq), text: p.text, role: p.role, kind: 'extra' })))
      .concat(ends.map((m) => ({ id: 'c' + (++cardSeq), text: m, role: 'plain', kind: 'end' })));
    // shuffle, but never in the sentence's own order and never with the right first card first
    for (let t = 0; t < 30; t++) {
      const s = shuffle(list);
      const inOrder = s.filter((c) => c.kind === 'part').every((c, i) => c.text === parts[i].text);
      if ((s[0].text !== parts[0].text || list.length < 3) && !(inOrder && parts.length > 1)) return s;
    }
    return list.slice().reverse();
  }

  function makePuzzle(stage, step, flags) {
    flags = flags || {};
    const SG = STAGES[stage], L = SG.steps[Math.min(step, SG.steps.length - 1)];
    if (SG.mode === 'fix') return makeFix(stage, step, L, flags);
    let sc = flags.scene || null, parts, end = '.', isQ = false, answer = '';
    let f = '';
    if (isAsk(stage)) {
      isQ = flags.question != null ? flags.question : Math.random() < L.q;
      if (isQ) {
        sc = sc || fresh(SCENES.filter((s) => s.w && qWords(s.w[0]).length <= (step === 0 ? 6 : 8)));
        parts = qWords(sc.w[0]); end = '?'; answer = sc.w[1];
      } else {
        sc = sc || fresh(SCENES.filter((s) => s.a || s.b));
        parts = words(parse(Math.random() < 0.5 && sc.a ? sc.a : (sc.b || sc.a)));
      }
    } else {
      f = flags.form || L.form;
      sc = sc || fresh(SCENES.filter((s) => FORM[f](s)));
      parts = parse(FORM[f](sc) || sc.a || sc.b);
      if (SG.mode === 'word') parts = words(parts);
    }
    const nExtra = flags.extra != null ? flags.extra : L.extra;
    const extras = SG.mode === 'word' ? wordExtras(sc, parts, nExtra) : chunkExtras(sc, parts, nExtra, f);
    const help = flags.help != null ? flags.help : L.help;
    const ends = isAsk(stage) ? ['.', '?'] : ['.'];
    return {
      kind: 'build', stage, step, scene: sc, parts, end, isQ, answer, help, mode: SG.mode,
      cards: cardsFor(parts, extras, ends), skill: SG.skill,
      cardColour: help === 0 && !isAsk(stage), slotColour: SG.mode === 'chunk' ? help <= 1 : help === 0 && !isAsk(stage), sid: SG.id,
      labels: SG.mode === 'chunk' && help <= 1, icons: help === 0 && SG.mode === 'chunk', ask: help === 0,
      warm: !!flags.warm, review: !!flags.review, demo: !!flags.demo, challenge: !!flags.challenge
    };
  }

  /* Sentence detective: one mistake to find. */
  function statements() {
    const out = [];
    SCENES.forEach((s) => ['a', 'b', 'c', 'n', 'p'].forEach((k) => { if (s[k]) out.push({ sc: s, ws: words(parse(s[k])).map((w) => w.text), end: '.' }); }));
    return out;
  }
  function questions() { return SCENES.filter((s) => s.w && qWords(s.w[0]).length <= 7).map((s) => ({ sc: s, ws: qWords(s.w[0]).map((w) => w.text), end: '?' })); }
  function makeFix(stage, step, L, flags) {
    const type = flags.mistake || pick(L.mistakes);
    let pool;
    if (type === 'cap') pool = statements().filter((x) => !NAMES.includes(x.ws[0]));
    else if (type === 'name') pool = statements().concat(questions()).filter((x) => x.ws.some((w) => NAMES.includes(w)));
    else if (type === 'swap') pool = statements().filter((x) => x.ws.length >= 4);
    else if (type === 'mark') pool = statements().concat(questions(), questions());
    else pool = statements();
    if (flags.scene) pool = pool.filter((x) => x.sc.id === flags.scene.id).concat(pool.filter((x) => x.sc.id === flags.scene.id).length ? [] : pool);
    const fresher = pool.filter((x) => !st.recent.includes(x.sc.id));
    const base = flags.scene ? pool[0] : pick(fresher.length ? fresher : pool);
    const ws = base.ws.slice();
    const toks = ws.map((w) => ({ text: w, fix: w }));
    let at = [];
    let endTok = { text: base.end, fix: base.end, end: true };
    if (type === 'stop') { endTok = { text: '', fix: '.', end: true, gap: true }; at = [ws.length]; }
    else if (type === 'cap') { toks[0].text = lc(ws[0]); at = [0]; }
    else if (type === 'name') { const i = ws.findIndex((w) => NAMES.includes(w)); toks[i].text = lc(ws[i]); at = [i]; }
    else if (type === 'mark') { endTok = { text: base.end === '?' ? '.' : '?', fix: base.end, end: true }; at = [ws.length]; }
    else if (type === 'swap') {
      const cand = []; for (let i = 1; i < ws.length - 1; i++) if (ws[i] !== ws[i + 1] && !NAMES.includes(ws[i + 1])) cand.push(i);
      const i = pick(cand.length ? cand : [1]);
      toks[i] = { text: ws[i + 1], fix: ws[i] }; toks[i + 1] = { text: ws[i], fix: ws[i + 1] }; at = [i, i + 1];
    }
    toks.push(endTok);
    return {
      kind: 'fix', stage, step, scene: base.sc, type, toks, at, end: base.end, isQ: base.end === '?',
      parts: ws.map((w) => ({ text: w, role: 'plain' })), skill: STAGES[stage].skill, check: L.check, checks: L.mistakes,
      answer: base.end === '?' ? base.sc.w[1] : '', warm: !!flags.warm, review: !!flags.review, demo: !!flags.demo, challenge: !!flags.challenge
    };
  }

  /* =====================================================================
     6. THE SCREEN – picture, sentence strip, cards
     ===================================================================== */
  let SC = null, P = null, T = null, gen = 0, idleTimer = 0;
  const alive = (g) => g === gen;
  const faceCache = {};
  function iconFor(c) {
    if (c.role === 'who' || c.role === 'what') {
      const n = c.text.toLowerCase();
      if (['leo', 'maya', 'milo', 'rex', 'ollie'].includes(n)) return faceCache[n] || (faceCache[n] = ART.faceIcon(n));
    }
    const e = ICONS[c.text.toLowerCase()];
    return e ? esc(e) : '';
  }
  function tip(text, good) {
    const t = $('tip');
    t.textContent = text || '';
    t.className = good ? 'good' : '';
  }
  function cardHtml(c, opts) {
    opts = opts || {};
    if (c.kind === 'end') return `<button type="button" class="card mark${c.text === '?' ? ' q' : ''}" data-id="${c.id}" aria-label="${sayMark(c.text)}"><span class="mk">${c.text === '?' ? '?' : '●'}</span></button>`;
    const colour = opts.colour ? 'r-' + (c.role === 'plain' ? 'plain' : c.role) : 'r-plain';
    const ic = opts.icon ? iconFor(c) : '';
    return `<button type="button" class="card ${colour}${P && P.mode === 'word' ? ' word' : ''}" data-id="${c.id}">${ic ? `<span class="ic" aria-hidden="true">${ic}</span>` : ''}<span class="tx">${esc(c.text)}</span></button>`;
  }
  function renderSlots() {
    const box = $('slots');
    if (P.kind === 'fix') return renderFix();
    box.className = 'slots';
    const n = P.parts.length;
    let html = '';
    P.parts.forEach((p, i) => {
      const filled = T.filled[i];
      const role = p.role === 'plain' ? 'plain' : p.role;
      const cls = ['slot', P.mode === 'word' ? 'word' : '', P.slotColour && role !== 'plain' ? 'coloured r-' + role : '', filled ? 'filled' : '', !filled && i === T.at ? 'next' : ''].filter(Boolean).join(' ');
      const lab = P.labels && LABEL[role] ? `<span class="lab">${esc(LABEL[role])}</span>` : '';
      html += `<div class="${cls}" data-slot="${i}">${filled ? cardHtml(filled, { colour: !isAsk(P.stage) && filled.role !== 'plain' }) : lab + '<span class="dot"></span>'}</div>`;
    });
    const endFilled = T.filled[n];
    html += `<div class="slot end${endFilled ? ' filled done' : ''}${!endFilled && T.at === n ? ' next' : ''}" data-slot="${n}">${endFilled ? cardHtml(endFilled) : '<span class="dot"></span>'}<span class="lab">${P.help === 0 ? (isAsk(P.stage) ? '? or .' : 'full stop') : ''}</span></div>`;
    box.innerHTML = html;
  }
  function renderBank() {
    const bank = $('bank');
    if (P.kind === 'fix') { bank.innerHTML = P.check ? `<div class="checklist">${checklist().map((c) => `<span>${esc(c)}</span>`).join('')}</div>` : ''; return; }
    bank.innerHTML = P.cards.map((c) => (T.used.has(c.id) ? cardHtml(c, { colour: P.cardColour, icon: P.icons }).replace('class="card', 'class="card used') : cardHtml(c, { colour: P.cardColour, icon: P.icons }))).join('');
  }
  function checklist() {
    const out = ['✔ Capital letter at the start', '✔ Full stop at the end'];
    if (P.checks.includes('name')) out.push('✔ Names start with a capital letter');
    return out;
  }
  function showSide(mode) {
    const side = $('side');
    if (mode === 'next') side.innerHTML = `<button type="button" class="round-btn" id="hearBtn" aria-label="Hear my sentence">🔊</button>`;
    else side.innerHTML = `<button type="button" class="round-btn" id="readCards" title="Read the cards to me" aria-label="Read the cards to me">🔊</button>`;
  }

  /* ---------- the picture ---------- */
  function buildScene(sc) {
    SC.clear();
    SC.bg(sc.bg, sc.bgo || {});
    try { sc.setup(SC); } catch (e) { console.warn(e); }
    if (sc.place) SC.svg.querySelectorAll(`[data-place="${sc.place}"]`).forEach((e) => e.setAttribute('data-role', ((e.getAttribute('data-role') || '') + ' where').trim()));
    else SC.svg.querySelectorAll(`[data-place="${sc.bg === 'night' ? 'garden' : sc.bg}"]`).forEach((e) => e.setAttribute('data-role', 'where'));
    if (!SC.svg.querySelector('[data-role~="where"]')) { const g = SC.svg.querySelector('[data-place]'); if (g) g.setAttribute('data-role', 'where'); }
  }
  function mainKid() { return SC.actors.find((a) => a.kind === 'kid' && a.roles.includes('who')) || null; }

  /* =====================================================================
     7. PLAYING A PUZZLE
     ===================================================================== */
  function startPuzzle(p) {
    stopTalk(); stopIdle();
    const g = ++gen;
    P = p;
    T = { at: 0, filled: [], used: new Set(), mistakes: 0, slotMiss: {}, phase: 'build', demo: p.demo, lock: 0, idle: 0 };
    remember(p.scene.id);
    buildScene(p.scene);
    showSide('build');
    renderSlots(); renderBank();
    tip('');
    $('game').classList.toggle('fixing', p.kind === 'fix');
    if (p.challenge) {
      tip('⬆️ Challenge! A tricky one – give it a go.');
      talk(p.kind === 'fix' ? 'A challenge! Find the mistake and tap it.' : 'A challenge! Give it a go.');
    } else if (p.kind === 'fix') {
      tip('Find the mistake and tap it.');
      if (!p.demo) talk('Find the mistake and tap it.');
    } else if (p.ask && !p.demo) {
      talk(slotQuestion(0));
    } else if (!p.demo && isAsk(p.stage) && p.help === 0) {
      tip('Does it ASK something? Then it ends with a question mark ?');
    }
    if (!p.demo) armIdle();
    updateTop();
    return g;
  }

  /* The question for each box (Colourful Semantics asks these). */
  function slotQuestion(i) {
    if (!P || P.kind !== 'build') return '';
    if (i >= P.parts.length) return isAsk(P.stage) ? 'Does it ask or tell? Choose the end.' : 'The sentence is finished. What goes at the end?';
    if (P.mode === 'word') return i === 0 ? 'Which word comes first?' : 'Which word comes next?';
    const p = P.parts[i];
    if (p.role === 'who') return P.parts.slice(0, i).some((q) => q.role === 'who') ? 'Who else is there?' : /^The /.test(p.text) ? 'Who or what is it?' : 'Who is it?';
    if (p.role === 'join') return 'Which word joins the two parts?';
    let wi = -1;
    for (let k = i - 1; k >= 0; k--) if (P.parts[k].role === 'who') { wi = k; break; }
    let whoText = wi >= 0 ? P.parts[wi].text : 'it';
    if (wi >= 2 && P.parts[wi - 1].text === 'and' && P.parts[wi - 2].role === 'who') {
      const d = P.parts.slice(wi + 1).find((q) => q.role === 'doing');
      if (d && /^are\b/.test(d.text)) whoText = P.parts[wi - 2].text + ' and ' + whoText;
    }
    const whoL = /^The /.test(whoText) ? lc(whoText) : whoText;
    const clause = P.parts.slice(wi + 1, i);
    const doing = clause.find((q) => q.role === 'doing') || P.parts.slice(wi + 1).find((q) => q.role === 'doing');
    const what = clause.find((q) => q.role === 'what');
    const aux = doing ? doing.text.split(' ')[0] : 'is', rest = doing ? doing.text.split(' ').slice(1).join(' ') : '';
    const tail = rest + (what ? ' ' + what.text : '');
    if (p.role === 'doing') return clause.some((q) => q.role === 'doing') ? `What else ${aux} ${whoL} doing?` : `What ${aux} ${whoL} doing?`;
    if (p.role === 'what') return `What ${aux} ${whoL} ${rest}?`;
    if (p.role === 'where') return P.sid === 'pos' ? `Where ${aux} ${whoL} ${tail}? In, on or under?` : `Where ${aux} ${whoL} ${tail}?`;
    if (p.role === 'why') return `Why ${aux} ${whoL} ${tail}?`;
    return 'What comes next?';
  }

  function cardById(id) { return P.cards.find((c) => c.id === id); }
  function onCard(id, fromDemo) {
    if (!P || P.kind !== 'build' || !T || T.phase !== 'build') return;
    if (T.demo && !fromDemo) return;
    if (!fromDemo && Date.now() < T.lock) return;
    const c = cardById(id); if (!c || T.used.has(id)) return;
    const n = P.parts.length, i = T.at;
    const ok = i < n ? (c.kind === 'part' && c.text === P.parts[i].text) : (c.kind === 'end' && c.text === P.end);
    stopIdle();
    if (ok) return place(c, i, fromDemo);
    miss(c, i);
  }

  function flyCard(fromEl, toEl) {
    if (!fromEl || !toEl || FAST) return Promise.resolve();
    const a = fromEl.getBoundingClientRect(), b = toEl.getBoundingClientRect();
    const clone = fromEl.cloneNode(true);
    clone.classList.add('flyer'); clone.classList.remove('hint', 'lit');
    clone.style.left = a.left + 'px'; clone.style.top = a.top + 'px'; clone.style.width = a.width + 'px'; clone.style.height = a.height + 'px';
    document.body.appendChild(clone);
    fromEl.classList.add('used');
    const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    const anim = clone.animate([{ transform: 'translate(0,0) scale(1)' }, { transform: `translate(${dx}px, ${dy - 18}px) scale(1.06)`, offset: 0.7 }, { transform: `translate(${dx}px, ${dy}px) scale(1)` }], { duration: ART.REDUCED ? 120 : 380, easing: 'cubic-bezier(.3,.7,.4,1)' });
    return anim.finished.catch(() => {}).then(() => clone.remove());
  }

  async function place(c, i, fromDemo) {
    const g = gen;
    const n = P.parts.length;
    T.used.add(c.id);
    T.filled[i] = c;
    T.at = i + 1;
    const from = document.querySelector(`#bank [data-id="${c.id}"]`), to = document.querySelector(`#slots [data-slot="${i}"]`);
    tip('');
    stopTalk();
    await flyCard(from, to);
    if (!alive(g)) return;
    renderSlots(); renderBank();
    if (c.kind === 'end') {
      ART.sound('dot');
      const done = await talk(sayMark(c.text));
      if (!alive(g)) return;
      return complete(fromDemo, done);
    }
    ART.sound('place', i);
    const role = P.parts[i].role;
    if (role === 'join') SC.glow('doing', 1200, 'join');
    else if (role === 'why') SC.glow('where', 1500, 'why');
    else if (role !== 'plain') SC.glow(role, 1500, role);
    const spoke = talk(c.text);
    if (!fromDemo) armIdle();
    if (P.ask && !fromDemo && T.at <= n) {
      const ok = await spoke;
      if (ok && alive(g) && T.phase === 'build' && T.at === i + 1) { await wait(250); if (alive(g) && T.phase === 'build' && T.at === i + 1) talk(slotQuestion(T.at)); }
    }
  }

  function miss(c, i) {
    const g = gen;
    const n = P.parts.length;
    T.mistakes++;
    if (T.mistakes === 1 && !T.demo && !P.missed) { P.missed = true; try { Stars.miss(P.skill); } catch (e) {} }
    T.slotMiss[i] = (T.slotMiss[i] || 0) + 1;
    T.lock = Date.now() + (FAST ? 0 : RULES.tapLockMs);
    ART.sound('soft');
    const el = document.querySelector(`#bank [data-id="${c.id}"]`);
    if (el) { el.classList.remove('wiggle'); void el.offsetWidth; el.classList.add('wiggle'); }
    // What to say – point to where to look, never the answer
    let say;
    if (c.kind === 'end' && i < n) say = c.text === '?' ? 'The question mark goes at the end, when the sentence is finished.' : 'The full stop goes at the end, when the sentence is finished.';
    else if (c.kind === 'end') say = P.end === '?' ? 'This sentence ASKS something, so it needs a question mark.' : 'This sentence TELLS us something, so it ends with a full stop.';
    else if (P.mode === 'word' && i === 0 && /^[A-Z]/.test(P.parts[0].text) && c.text.toLowerCase() === P.parts[0].text.toLowerCase()) say = 'A sentence starts with a capital letter.';
    else if (c.kind === 'extra' && P.sid === 'pos' && c.role === 'where') { say = 'Look at the picture again. In, on or under?'; SC.glow('where', 1600, 'hint'); }
    else if (c.kind === 'extra') { say = 'Look at the picture again.'; SC.glow(['who', 'doing', 'what', 'where'].includes(c.role) ? c.role : c.role === 'why' ? 'where' : 'who', 1600, 'hint'); }
    else if (P.mode === 'word' && i === 0 && !/^[A-Z]/.test(c.text)) say = 'A sentence starts with a capital letter.';
    else say = P.mode === 'word' ? 'Not yet. ' + slotQuestion(i) : 'That card comes later. ' + slotQuestion(i);
    tip(say);
    talk(say);
    if (i < n && T.slotMiss[i] >= 2) { const r = P.parts[i].role; if (r !== 'plain') setTimeout(() => { if (alive(g)) SC.glow(r === 'join' ? 'doing' : r, 1800, 'hint'); }, 300); }
    if (T.slotMiss[i] >= RULES.glowAfter) glowRight();
    if (T.slotMiss[i] >= RULES.autoAfter) setTimeout(() => { if (alive(g) && T.phase === 'build' && T.at === i) { const r = rightCard(); if (r) place(r, i, true); } }, FAST ? 0 : 900);
  }
  function rightCard() {
    const n = P.parts.length, i = T.at;
    return P.cards.find((c) => !T.used.has(c.id) && (i < n ? c.kind === 'part' && c.text === P.parts[i].text : c.kind === 'end' && c.text === P.end));
  }
  function glowRight() {
    const r = rightCard(); if (!r) return;
    const el = document.querySelector(`#bank [data-id="${r.id}"]`); if (el) el.classList.add('hint');
  }

  /* ---------- the sentence is finished ---------- */
  const PRAISE = ['Brilliant sentence! 🎉', 'Well built! 👏', 'That’s a great sentence! 🎉', 'You did it! 🎉', 'Super sentence! 👏'];   // no star emojis: only stars.js gives stars
  async function complete(fromDemo) {
    const g = gen;
    T.phase = 'done';
    stopIdle();
    const clean = T.mistakes === 0;
    if (!T.demo) {
      if (clean) { try { Stars.win(P.skill); } catch (e) {} } else ART.sound('yay');
      recordResult(clean);
      if (jumpNote) { ART.sound('magic'); }
    } else ART.sound('sparkle');
    const text = P.kind === 'fix' ? P.parts.map((p) => p.text).join(' ') + P.end : sentenceText(P.parts, P.end);
    tip(T.demo ? '' : jumpNote || (P.challenge && !clean ? 'That was a tricky one! Well done for finishing it.' : pick(PRAISE)), true);
    jumpNote = '';
    showSide('next');
    if (!T.demo) showNext();
    await readSentence(g);
    if (!alive(g)) return;
    if (jumpSay) { const say = jumpSay; jumpSay = ''; await talk(say); if (!alive(g)) return; }
    const nb = $('nextBtn'); if (nb) nb.classList.add('ready');
    if (!T.demo) autoNext(g);
    return text;
  }
  async function readSentence(g) {
    const slots = [...document.querySelectorAll('#slots .slot, #slots .tok')];
    const text = P.kind === 'fix' ? P.toks.map((t) => t.fix).join(' ').replace(/ ([.?])$/, '$1') : sentenceText(P.parts, P.end);
    const total = text.length;
    let acc = 0;
    const timers = [];
    const ms = Math.max(1400, total * 62);
    P.parts.forEach((p, i) => {
      const at = (acc / total) * ms;
      acc += p.text.length + 1;
      timers.push(setTimeout(() => {
        if (!alive(g)) return;
        slots.forEach((s) => { const c = s.querySelector('.card') || s; c.classList.remove('lit'); });
        const s = slots[i]; if (s) (s.querySelector('.card') || s).classList.add('lit');
        if (p.role !== 'plain' && P.kind !== 'fix') SC.glow(p.role === 'join' ? 'doing' : p.role === 'why' ? 'where' : p.role, 900, p.role);
      }, FAST ? 0 : at));
    });
    await talk(text, { rate: 0.88, pitch: P.isQ ? 1.25 : 1 });
    timers.forEach(clearTimeout);
    slots.forEach((s) => { const c = s.querySelector('.card') || s; c.classList.remove('lit'); });
  }
  function showNext() {
    const bank = $('bank');
    bank.innerHTML = `<button type="button" class="btn-primary next-btn" id="nextBtn">Next ➜</button>`;
  }
  /* Hub rule: once it's solved, play moves on by itself after about 2 seconds (Next still works sooner).
     It waits while a card or the grown-ups panel is open, or while something is being read aloud. */
  function autoNext(g) {
    setTimeout(function go() {
      if (!alive(g) || T.phase !== 'done' || T.demo) return;
      if (anyCardOpen() || speaking()) return setTimeout(go, 600);
      onNext();
    }, RULES.autoNextMs);
  }
  /* ---------- Ollie the owl, our host: introduces new kinds of puzzle and cheers at the end ---------- */
  const OWLS = {}, owlTimers = {};
  function owlHost(where) {
    if (OWLS[where]) return OWLS[where];
    const svg = $(where + 'Owl'); if (!svg) return null;
    const m = ART.mini(svg, 'owl', { act: 'idle', viewBox: '-74 -126 148 130' });
    return (OWLS[where] = m.actor);
  }
  /* A little sequence for Ollie: [[action, at ms], …]. A new one replaces any that is still waiting. */
  function owlSeq(where, steps) {
    const o = owlHost(where); if (!o) return;
    (owlTimers[where] || []).forEach(clearTimeout);
    owlTimers[where] = steps.map(([act, at]) => (at ? setTimeout(() => o.act(act), at) : (o.act(act), 0)));
  }
  /* Ollie does something now; `back` ms later he goes back to standing. */
  function owlAct(where, act, back) { owlSeq(where, back ? [[act, 0], ['idle', back]] : [[act, 0]]); }

  function recordResult(clean) {
    const text = P.kind === 'fix' ? P.parts.map((p) => p.text).join(' ') + P.end : sentenceText(P.parts, P.end);
    st.built.push({ t: text, ok: clean ? 1 : 0, s: SID(P.stage), d: today() });
    if (st.built.length > RULES.builtKeep) st.built.shift();
    sittingBuilt.push({ t: text, ok: clean });
    const out = ladder.result(plan || { stage: P.stage, step: P.step }, clean);   // the ladder decides what happens next
    jumpNote = out.note; jumpSay = out.say;
  }

  /* ---------- Sentence detective ---------- */
  function renderFix() {
    const box = $('slots');
    box.className = 'slots fix-row';
    box.innerHTML = P.toks.map((t, i) => {
      const cls = ['tok', t.gap ? 'gap' : '', t.end ? 'markt' : '', t.done ? 'fixed' : '', t.okd ? 'ok' : ''].filter(Boolean).join(' ');
      const label = t.gap ? 'the end of the sentence' : t.text === '.' ? 'full stop' : t.text === '?' ? 'question mark' : t.text;
      return `<button type="button" class="${cls}" data-tok="${i}" aria-label="${esc(label)}">${t.gap ? '·' : esc(t.end && t.text === '.' ? '●' : t.text)}</button>`;
    }).join('');
  }
  async function onTok(i, fromDemo) {
    if (!P || P.kind !== 'fix' || !T || T.phase !== 'build') return;
    if (T.demo && !fromDemo) return;
    if (!fromDemo && Date.now() < T.lock) return;
    stopIdle();
    const g = gen;
    if (P.at.includes(i)) {
      T.phase = 'fixing';
      P.toks.forEach((t) => { t.text = t.fix; if (t.gap) t.gap = false; });
      P.at.forEach((k) => { P.toks[k].done = true; });
      renderFix();
      ART.sound('fix');
      const rule = { stop: 'A sentence ends with a full stop.', cap: 'A sentence starts with a capital letter.', name: 'Names always start with a capital letter.', mark: P.end === '?' ? 'It asks something, so it needs a question mark.' : 'It tells us something, so it ends with a full stop.', swap: 'Now the words are in the right order.' }[P.type];
      tip('✔ ' + rule, true);
      await talk(rule);
      if (!alive(g)) return;
      return complete(fromDemo);
    }
    T.mistakes++;
    if (T.mistakes === 1 && !T.demo && !P.missed) { P.missed = true; try { Stars.miss(P.skill); } catch (e) {} }
    T.lock = Date.now() + (FAST ? 0 : RULES.tapLockMs);
    ART.sound('soft');
    P.toks[i].okd = true;
    renderFix();
    const el = document.querySelector(`#slots [data-tok="${i}"]`);
    if (el) { el.classList.remove('wiggle'); void el.offsetWidth; el.classList.add('wiggle'); }
    const say = T.mistakes >= 2 ? (P.type === 'swap' ? 'Read it out loud. Does it sound right?' : P.type === 'name' ? 'Check the names.' : 'Check the start and the end of the sentence.') : 'That part is fine. Look again.';
    tip(say); talk(say);
    if (T.mistakes >= RULES.glowAfter) P.at.forEach((k) => { const e = document.querySelector(`#slots [data-tok="${k}"]`); if (e) e.classList.add('hint'); });
    if (T.mistakes >= RULES.autoAfter) setTimeout(() => { if (alive(g) && T.phase === 'build') onTok(P.at[0], true); }, 900);
  }

  /* =====================================================================
     8. MOVING ON – steps and stages
     ===================================================================== */
  /* ---------- What comes next: the ladder's plan (kit/ladder.js) ---------- */
  let jumpNote = '', jumpSay = '', plan = null, cardPlan = null;
  function play(p) { plan = p; startPuzzle(makePuzzle(p.stage, p.step, { warm: p.warm, review: p.review, challenge: p.challenge })); }
  function nextPuzzle() {
    const p = ladder.next();
    if (p.card === 'end') return showEnd();
    if (p.card === 'expert') { owlAct('expert', 'happy'); return show('expertCard'); }
    if (p.card) return showNewKind(p.stage, p.card, p);   // new / again / review / challenge: the card and demo first
    play(p);
  }
  function onNext() {
    stopTalk();
    nextPuzzle();
  }

  /* =====================================================================
     9. CARDS AND THE "WATCH ME" DEMO
     ===================================================================== */
  function show(id) { $(id).classList.add('show'); }
  function hide(id) { $(id).classList.remove('show'); }
  function anyCardOpen() { return !!document.querySelector('.overlay.show'); }

  let newCardTimer = 0, newCardMode = 'new', newCardStage = 1;
  function showNewKind(stage, mode, p) {
    stopTalk(); stopIdle();
    newCardMode = mode; newCardStage = stage; cardPlan = p || null;
    const S = STAGES[stage];
    $('newBadge').textContent = mode === 'again' ? '👀 Let’s watch how to do it' : '✨ New kind of puzzle!';
    $('newTitle').textContent = S.name;
    $('newLine').textContent = S.line;
    $('newKey').innerHTML = S.key.map((r) => `<span class="r-${r}">${esc(LABEL[r])}</span>`).join('') + (S.mode === 'fix' ? '' : `<span class="r-plain">${isAsk(stage) ? '? or ●' : '● full stop'}</span>`);
    $('newSmall').textContent = mode === 'challenge' ? `A ⬆️ challenge from stage ${stage} of ${TOP}. Watch me do the first one.` : `Stage ${stage} of ${TOP}. Watch me do the first one.`;
    show('newCard');
    owlSeq('new', [['land', 0], ['wave', 1150], ['teach', 2700]]);
    const g = ++gen;
    clearTimeout(newCardTimer);
    talk((mode === 'again' ? 'Let’s watch how to do it. ' : mode === 'challenge' ? 'Here’s a challenge! A new kind of puzzle. ' : 'New kind of puzzle! ') + S.line + ' Watch me do the first one.', { who: owlHost('new') })
      .then(() => { if (g === gen && $('newCard').classList.contains('show')) newCardTimer = setTimeout(startDemoFromCard, FAST ? 5 : 900); });
  }
  function startDemoFromCard() {
    if (!$('newCard').classList.contains('show')) return;
    clearTimeout(newCardTimer);
    hide('newCard');
    runDemo(newCardStage, true);
  }
  function banner(kind, text, small) {
    const b = $('demoBanner');
    if (!kind) { b.className = 'demo-banner'; b.innerHTML = ''; return; }
    b.className = 'demo-banner show ' + kind;
    b.innerHTML = esc(text) + (small ? `<small>${esc(small)}</small>` : '');
  }
  const byId = (id) => SCENES.find((s) => s.id === id);
  const DEMO = {
    who: (n) => makePuzzle(n, 0, { scene: byId('leo-jump'), demo: true }),
    what: (n) => makePuzzle(n, 0, { scene: byId('maya-apple'), demo: true }),
    where: (n) => makePuzzle(n, 0, { scene: byId('milo-sleep'), demo: true }),
    pos: (n) => makePuzzle(n, 1, { scene: byId('pos-milo-on-box'), demo: true }),
    word: (n) => makePuzzle(n, 0, { scene: byId('bee'), demo: true, form: 'a' }),
    ask: (n) => makePuzzle(n, 0, { scene: byId('milo-sleep'), demo: true, question: true }),
    and: (n) => makePuzzle(n, 0, { scene: byId('kids-wave'), demo: true }),
    detect: (n) => makePuzzle(n, 0, { scene: byId('leo-jump'), demo: true, mistake: 'stop' }),
    because: (n) => makePuzzle(n, 0, { scene: byId('leo-umbrella'), demo: true })
  };
  let demoGen = 0;
  async function fingerTo(el, dg) {
    if (!el || dg !== demoGen) return;
    const f = $('finger'), r = el.getBoundingClientRect();
    f.classList.add('show');
    f.style.transform = `translate(${Math.round(r.left + r.width / 2)}px, ${Math.round(r.top + r.height / 2)}px)`;
    await wait(750);
    if (dg !== demoGen) return;
    f.classList.add('press');
    await wait(220);
    f.classList.remove('press');
  }
  async function coach(text, dg) {
    if (dg !== demoGen) return;
    tip('💭 ' + text);
    await talk(text);
    await wait(250);
  }
  function stopDemo() {
    demoGen++;
    $('finger').classList.remove('show', 'press');
    $('game').classList.remove('demo-on');
    banner(null);
  }
  async function runDemo(stage, isNew) {
    const dg = ++demoGen;
    const id = SID(stage), p = DEMO[id](stage);
    $('game').classList.add('demo-on');
    banner('watch', '👀 Watch me – this is a demo', 'You don’t need to press anything yet');
    startPuzzle(p);
    await wait(900);
    if (dg !== demoGen) return;
    if (p.kind === 'fix') {
      await coach('One thing is wrong in this sentence. Let’s check the start.', dg);
      await fingerTo(document.querySelector('#slots [data-tok="0"]'), dg);
      await coach('Leo has a capital letter. That’s fine. Now the end…', dg);
      if (dg !== demoGen) return;
      await coach('There’s no full stop! Tap the end to fix it.', dg);
      await fingerTo(document.querySelector(`#slots [data-tok="${p.at[0]}"]`), dg);
      if (dg !== demoGen) return;
      await onTok(p.at[0], true);
    } else {
      const n = p.parts.length;
      if (id === 'word') await coach('A sentence starts with a capital letter. The has a capital T.', dg);
      if (id === 'ask') await coach('This sentence asks something. It starts with How.', dg);
      for (let i = 0; i <= n; i++) {
        if (dg !== demoGen) return;
        if (i < n && P.mode === 'chunk') await coach(slotQuestion(i), dg);
        if (i < n && p.parts[i].role === 'join') await coach(p.parts[i].text === 'and' ? 'And joins them together.' : 'Because tells us why.', dg);
        if (i < n && id === 'pos' && p.parts[i].role === 'where') await coach('He is ON the box, so we choose on the box.', dg);
        if (i === n) await coach(isAsk(stage) ? 'It asks a question, so it ends with a question mark.' : 'The sentence is finished, so it needs a full stop.', dg);
        const r = rightCard();
        await fingerTo(document.querySelector(`#bank [data-id="${r.id}"]`), dg);
        if (dg !== demoGen) return;
        if (i < n) await place(r, i, true);
        else { $('finger').classList.remove('show'); await place(r, i, true); }
        await wait(300);
      }
    }
    if (dg !== demoGen) return;
    $('finger').classList.remove('show');
    await wait(400);
    if (dg !== demoGen) return;
    $('game').classList.remove('demo-on');
    banner('turn', 'That’s how you do it. Now it’s your turn!');
    tip('');
    $('bank').innerHTML = `<button type="button" class="btn-primary next-btn ready" id="turnBtn">Your turn ➜</button>`;
    talk('That’s how you do it. Now it’s your turn!');
    if (isNew && cardPlan) { ladder.shown(cardPlan); cardPlan = null; }   // he has now been shown this kind
  }
  function yourTurn() { stopDemo(); nextPuzzle(); }

  function showEnd() {
    stopTalk(); stopIdle();
    try { Stars.done(); } catch (e) {}
    const n = sittingBuilt.length;
    $('endTitle').textContent = `That’s ${n} sentence${n === 1 ? '' : 's'}! 🎉`;
    $('endLine').textContent = 'Have a rest, or keep going.';
    $('builtList').innerHTML = sittingBuilt.map((b, i) => `<button type="button" data-b="${i}">${esc(b.t)}<span class="st">${b.ok ? '⭐' : '✔'}</span></button>`).join('');
    show('endCard');
    owlAct('end', 'dance', 2600);
    talk(`That’s ${n} sentence${n === 1 ? '' : 's'}! Have a rest, or keep going.`, { who: owlHost('end') });
    ladder.newSitting();
  }

  /* =====================================================================
     10. NUDGES – point where to look, never the answer
     ===================================================================== */
  function stopIdle() { clearTimeout(idleTimer); }
  function armIdle() {
    clearTimeout(idleTimer);
    if (!T || T.demo || FAST) return;
    const g = gen;
    idleTimer = setTimeout(() => {
      if (!alive(g) || !T || T.demo || T.phase !== 'build' || anyCardOpen()) return;
      T.idle++;
      if (P.kind === 'fix') {
        tip(T.idle > 1 ? 'Check the start and the end of the sentence.' : 'Find the mistake and tap it.');
        talk($('tip').textContent);
      } else {
        const s = document.querySelector(`#slots [data-slot="${T.at}"]`);
        if (s) { s.classList.remove('ask'); void s.offsetWidth; s.classList.add('ask'); }
        const q = slotQuestion(T.at);
        tip(q); talk(q);
        if (T.idle > 1 && T.at < P.parts.length) { const r = P.parts[T.at].role; if (r !== 'plain') SC.glow(r === 'join' ? 'doing' : r, 1800, 'hint'); }
      }
      armIdle();
    }, RULES.idleHintMs);
  }

  /* =====================================================================
     11. GROWN-UPS PANEL AND TOP BAR
     ===================================================================== */
  function updateTop() {
    if (!ladder) return;
    let line = ladder.label();
    if (P && P.challenge && ladder.state.chal) line = `⬆️ Challenge from stage ${P.stage}`;
    else if (P && P.warm) line += ' · warm-up'; else if (P && P.review) line += ' · remember this one?';
    $('stageLine').textContent = line;
  }
  const fmt = (f, t) => (t ? `${f} of ${t} right first time` : 'not tried yet');
  let resetArmed = false;
  function renderGrownups() {
    const g = ladder.panel();   // the same words in every game on the ladder
    $('gpStatus').textContent = g.where;
    $('gpRule').textContent = g.rule;
    $('gpJump').textContent = g.chal;
    $('gpUndoJump').hidden = !g.canUndo;
    $('gpStages').innerHTML = g.stages.map((x) => `<button type="button" class="btn-tool" data-stage="${x.n}"${x.current ? ' aria-current="true"' : ''}>${x.n}. ${esc(x.name)}</button>`).join('');
    $('gpVoice').textContent = 'Voice: ' + (voiceOn() ? 'on' : 'off');
    $('gpSounds').textContent = 'Sounds: ' + (soundsOn() ? 'on' : 'off');
    $('gpSkills').innerHTML = g.skills.map((k) => `<li><b>${esc(k.name)}:</b> ${fmt(k.f, k.t)}</li>`).join('');
    $('gpBuilt').innerHTML = st.built.length ? st.built.slice(-14).reverse().map((b) => `<li>${esc(b.t)} ${b.ok ? '⭐' : '<span class="small">(after a try)</span>'}</li>`).join('') : '<li>None yet.</li>';
    $('gpReset').textContent = 'Start again from stage 1';
    resetArmed = false;
  }
  function updateSoundBtn() {
    const on = voiceOn() || soundsOn();
    $('soundIco').textContent = on ? '🔔' : '🔕';
    $('soundText').textContent = on ? 'Sound on' : 'Sound off';
  }
  function hideCards() { ['newCard', 'endCard', 'expertCard', 'startCard'].forEach(hide); clearTimeout(newCardTimer); }
  function measureBar() {
    const h = $('topbar').getBoundingClientRect().bottom;
    document.documentElement.style.setProperty('--bar-h', Math.max(0, Math.round(h)) + 'px');
  }
  async function readCards() {
    if (!P || !T || T.phase !== 'build') return;
    stopTalk(); stopIdle();
    const g = gen;
    if (P.kind === 'fix') { await talk(P.toks.map((t) => t.text).join(' ')); armIdle(); return; }
    for (const c of P.cards) {
      if (T.used.has(c.id) || !alive(g)) continue;
      const el = document.querySelector(`#bank [data-id="${c.id}"]`);
      if (el) el.classList.add('lit');
      const ok = await talk(c.kind === 'end' ? sayMark(c.text) : c.text);
      if (el) el.classList.remove('lit');
      if (!ok) break;
      await wait(150);
    }
    armIdle();
  }

  /* =====================================================================
     12. WIRING
     ===================================================================== */
  function bind() {
    $('bank').addEventListener('click', (e) => {
      const c = e.target.closest('.card'); if (c && c.dataset.id) return onCard(c.dataset.id);
      if (e.target.closest('#nextBtn')) return onNext();
      if (e.target.closest('#turnBtn')) return yourTurn();
    });
    $('slots').addEventListener('click', (e) => {
      const t = e.target.closest('.tok'); if (t) return onTok(Number(t.dataset.tok));
      const c = e.target.closest('.slot.filled .card'); if (c) { const card = P && P.cards && P.cards.find((x) => x.id === c.dataset.id); if (card) { stopTalk(); talk(card.kind === 'end' ? sayMark(card.text) : card.text); } }
    });
    $('side').addEventListener('click', (e) => {
      if (e.target.closest('#readCards')) return readCards();
      if (e.target.closest('#hearBtn')) { stopTalk(); readSentence(gen); }
    });
    $('sayBtn').addEventListener('click', () => {
      if (!P) return;
      stopTalk();
      if (T.phase !== 'build') return readSentence(gen);
      const so = P.kind === 'fix' ? P.toks.map((t) => t.text).join(' ') : T.filled.filter(Boolean).map((c) => (c.kind === 'end' ? '' : c.text)).join(' ');
      if (so) talk(so); else talk(slotQuestion(T.at));
    });
    $('startBtn').addEventListener('click', () => {
      hide('startCard');
      ART.sound('magic');
      if (startScene) startScene.stop();
      started = true;
      nextPuzzle();
    });
    $('watchBtn').addEventListener('click', startDemoFromCard);
    $('keepBtn').addEventListener('click', () => { hide('endCard'); stopTalk(); sittingBuilt = []; nextPuzzle(); });
    $('builtList').addEventListener('click', (e) => { const b = e.target.closest('[data-b]'); if (b) { stopTalk(); talk(sittingBuilt[Number(b.dataset.b)] ? sittingBuilt[Number(b.dataset.b)].t : b.textContent); } });
    $('expertBtn').addEventListener('click', () => { hide('expertCard'); nextPuzzle(); });
    $('soundBtn').addEventListener('click', () => {
      const on = !(voiceOn() || soundsOn());
      setting('readAloud', on); setting('sounds', on);
      if (!on) stopTalk();
      updateSoundBtn();
    });
    $('gpBtn').addEventListener('click', () => { stopIdle(); renderGrownups(); show('gpCard'); });
    $('gpClose').addEventListener('click', () => { hide('gpCard'); armIdle(); });
    $('gpCard').addEventListener('click', (e) => { if (e.target === $('gpCard')) { hide('gpCard'); armIdle(); } });
    $('gpStages').addEventListener('click', (e) => {
      const b = e.target.closest('[data-stage]'); if (!b) return;
      stopDemo(); hideCards(); hide('gpCard');
      ladder.moveTo(Number(b.dataset.stage));
      started = true;
      nextPuzzle();
    });
    const here = () => { renderGrownups(); if (started && P && !T.demo) play({ stage: ladder.stage, step: ladder.step }); };
    $('gpEasier').addEventListener('click', () => { ladder.easier(); here(); });
    $('gpUndoJump').addEventListener('click', () => { ladder.undoJump(); here(); });
    $('gpHarder').addEventListener('click', () => { ladder.harder(); here(); });
    $('gpShow').addEventListener('click', () => { hide('gpCard'); stopDemo(); hideCards(); started = true; showNewKind(ladder.stage, 'again'); });
    $('gpVoice').addEventListener('click', () => { setting('readAloud', !voiceOn()); if (!voiceOn()) stopTalk(); renderGrownups(); updateSoundBtn(); });
    $('gpSounds').addEventListener('click', () => { setting('sounds', !soundsOn()); renderGrownups(); updateSoundBtn(); });
    $('gpReset').addEventListener('click', () => {
      if (!resetArmed) { resetArmed = true; $('gpReset').textContent = 'Tap again to start from stage 1'; return; }
      st.recent = [];
      ladder.restart();
      hide('gpCard'); stopDemo(); hideCards(); sittingBuilt = []; started = true;
      nextPuzzle();
    });
    document.addEventListener('keydown', (e) => {
      if (anyCardOpen() || !T || T.demo) return;
      if (e.target && /input|textarea/i.test(e.target.tagName)) return;
      if (e.key === 'Enter' && T.phase === 'done' && $('nextBtn')) { e.preventDefault(); onNext(); }
    });
    window.addEventListener('resize', measureBar);
  }

  /* =====================================================================
     13. START
     ===================================================================== */
  let startScene = null;
  function init() {
    ART.setSoundCheck(soundsOn);
    SC = ART.makeScene($('scene'));
    makeLadder();
    updateTop();
    updateSoundBtn();
    bind();
    measureBar();
    setTimeout(measureBar, 400);
    // The cast says hello on the Start card
    startScene = ART.makeScene($('startScene'), { aspect: 'xMidYMax slice' });
    startScene.bg('park');
    startScene.kid('leo', { x: 235, y: 372, s: 0.86, act: 'wave' });
    startScene.kid('maya', { x: 345, y: 372, s: 0.86, act: 'jump' });
    startScene.cat({ x: 448, y: 374, s: 0.78, act: 'sit' });
    startScene.dog({ x: 572, y: 376, s: 0.76, act: 'wag', flip: true });
    const ow = startScene.owl({ x: 646, y: 250, s: 0.5, act: 'fly', noShadow: true });
    ow.path = (t, a) => { const w = ART.REDUCED ? 0.5 : t * Math.PI * 2 / 8; a.x = 646 + 38 * Math.sin(w); a.y = 250 + 14 * Math.sin(2 * w); a.rot = 9 * Math.cos(w); };
    SC.bg('plain');
    show('startCard');
  }

  /* For the automatic tests */
  window.sentenceGame = {
    get state() { return ladder.state; }, get ladder() { return ladder; }, get own() { return st; },
    get P() { return P; }, get T() { return T; }, get SC() { return SC; },
    RULES, STAGES, SCENES, SID, SNUM, saveState, loadState: () => makeLadder(), makePuzzle, startPuzzle, nextPuzzle, play,
    moveToStage: (n) => ladder.moveTo(n), runDemo, showEnd, onCard, onTok, rightCard, slotQuestion,
    set fast(v) { FAST = !!v; }, get fast() { return FAST; },
    stopDemo, hideCards, parse, words, qWords
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
