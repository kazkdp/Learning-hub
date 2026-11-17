/* Ask and Find Out – the game (version 2, 16 Nov 2026).
   Teaching idea (from the research): each puzzle tells him some things and hides one; he must notice what he
   doesn't know and ask the question that finds it out. The answer is the reward – the scene reacts to it.
   Motivation (Pivotal Response Treatment): he chooses (world, box, picture), tasks vary, easy ones come back,
   every question gets a real answer. "Seeing means knowing": Ollie saw, so Ollie is the one to ask. */
(function () {
  'use strict';

  const FXL = window.AskFX, FX = FXL.FX, C = window.ASK_CONTENT;
  const { WORLDS, BOX_ITEMS, HIDE, WHO, SUSPECTS, WHY, WONDER, MISSION_EXAMPLES } = C;

  /* =====================================================================
     1. RULES – how the game moves on (change the numbers here)
     ===================================================================== */
  const RULES = {
    sitting: 8,               // puzzles in a sitting, then "well done", discoveries and the real-life mission
    stage1Help: [0, 1, 3],    // stage 1 (only What): 3 boxes – copy the question, word given, no help – then stage 2
    upAfter: [1, 1, 2],       // right first time this many in a row at help level 0 / 1 / 2 -> less help
    downAfterMisses: 2,       // missed this many in a row -> more help
    gateWindow: 5, gateNeed: 4, gateKinds: 2,   // no help: 4 of the last 5 right, from 2+ kinds -> next stage
    gateWindowTwo: 6, gateNeedTwo: 5,           // stage 2 has only two words: 5 of the last 6
    replayAfterMisses: 3,     // missed this many in a row -> "watch me" again
    reviewEvery: 4,           // stage 5: after every 4 pictures, one "find out" puzzle comes back
    wonderAsks: [2, 2, 2, 3], // questions per picture at each help level (stage 5)
    wonderEach: 2,            // stage 5: pictures at each help level before less help
    expertAfter: 6,           // stage 5 pictures with no help -> one "Question Expert" card
    idleHintMs: 15000,        // nothing tapped for this long -> a gentle nudge
    boxHintMs: 4200,          // the chosen box rattles this often until he asks
    recentKeep: 22,
    jarMax: 60
  };

  const HELP = [
    { name: 'Copy the question', note: 'Ollie says the whole question; he taps it' },
    { name: 'Word given', note: 'Ollie names the question word' },
    { name: 'Clue given', note: 'Ollie says what we don’t know yet (the place, the reason…)' },
    { name: 'No help', note: 'he works out what is missing and picks the word himself' }
  ];
  const WORDS = {
    what: { label: 'What', icon: '🎁', meaning: 'thing' },
    where: { label: 'Where', icon: '📍', meaning: 'place' },
    who: { label: 'Who', icon: '🧑', meaning: 'person or animal' },
    why: { label: 'Why', icon: '💡', meaning: 'reason' },
    how: { label: 'How', icon: '⚙️', meaning: 'way' },
    when: { label: 'When', icon: '🕒', meaning: 'time' }
  };
  const WORD_ORDER = ['what', 'where', 'who', 'why', 'how', 'when'];
  const STAGES = {
    1: { name: 'Mystery box', words: ['what'], mix: { box: 1 }, start: 0, line: 'Pick a mystery box. Ask Ollie what is inside!' },
    2: { name: 'Hide and seek', words: ['what', 'where'], mix: { hide: 1, box: 1 }, start: 1, line: 'Close your eyes! Ollie watches where your friend hides. Ask Ollie where!' },
    3: { name: 'Who did it?', words: ['what', 'where', 'who'], mix: { who: 2, hide: 1, box: 1 }, start: 1, line: 'The lights go out and something happens. Ollie can see in the dark – ask who did it!' },
    4: { name: 'Why did it happen?', words: ['what', 'where', 'who', 'why'], mix: { why: 3, who: 1, hide: 1, box: 1 }, start: 1, line: 'Watch something happen. Ask Ollie why – then use the reason!' },
    5: { name: 'I wonder…', words: ['what', 'where', 'who', 'why', 'how', 'when'], mix: { wonder: 1 }, start: 1, line: 'Pick a picture and ask Ollie about anything you wonder!' }
  };
  const SKILL = { box: 'Asking what', hide: 'Asking where', who: 'Asking who', why: 'Asking why', use: 'Using the reason', wonder: 'Asking my own questions', mission: 'Asking a real person' };
  const BOX_COLOURS = [['#8fb3de', '#6f97c8'], ['#e9ad86', '#d38f66'], ['#94c9a6', '#74ad88'], ['#c4a8db', '#a688c4'], ['#e6c07a', '#cfa458']];
  const WHY_ICON = { slime: '🟢', bats: '🦇', night: '🌙', echo: '🗣️', oven: '🔥', road: '🦓', float: '🧊', hot: '🥵', tummy: '🍽️', teeth: '🦷', lean: '🌱', glasses: '👓', suncream: '🧴', steam: '☕', rainbow: '🌈', thunder: '⚡', puddle: '💧', melt: '🍦', shadow: '🌇', washing: '👕', pond: '🧊', tyre: '🚲', milk: '🥛', ball: '⚽', coat: '🧥', autumn: '🍂', plant: '🥀', pant: '🐕', huddle: '🐧' };

  /* =====================================================================
     2. SMALL HELPERS
     ===================================================================== */
  const $ = (id) => document.getElementById(id);
  const esc = (s) => (window.Kit ? Kit.esc(s) : String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])));
  const rand = (n) => Math.floor(Math.random() * n);
  const pick = (a) => a[rand(a.length)];
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const split = (s) => String(s).split('|');
  const joinQ = (t) => t.join(' ');
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  function today() { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function setting(name, value) {
    if (!window.Kit) return arguments.length > 1 ? value : undefined;
    return arguments.length > 1 ? Kit.setting(name, value) : Kit.setting(name);
  }
  let FAST = false;
  const wait = (ms) => new Promise((r) => setTimeout(r, FAST ? Math.min(ms, 20) : ms));

  /* =====================================================================
     3. TALKING – en-GB voice; his questions in a higher voice
     ===================================================================== */
  let voice = null;
  function pickVoice() {
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
  function speakable(t) {
    return String(t).replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}️‍]/gu, '')
      .replace(/\b([A-Z]{2,})\b/g, (m) => m.toLowerCase()).replace(/\s+/g, ' ').trim();
  }
  function stopTalk() { talkGen++; hush(); }
  function hush() { try { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); } catch (e) {} if (OWL) OWL.talk(false); }
  function talk(text, opts) {
    opts = opts || {};
    const clean = speakable(text);
    const readMs = Math.max(900, clean.length * 55);
    if (!clean) return Promise.resolve();
    if (FAST || !voiceOn() || !('speechSynthesis' in window)) {
      if (opts.owl && OWL && !FAST) { OWL.talk(true); return wait(Math.min(readMs, 3200)).then(() => OWL.talk(false)); }
      return wait(Math.min(readMs, 3200));
    }
    const my = talkGen;
    return new Promise((resolve) => {
      let done = false, guard = null, started = false;
      const finish = () => { if (done) return; done = true; clearTimeout(guard); if (opts.owl && OWL) OWL.talk(false); resolve(); };
      try {
        const u = new SpeechSynthesisUtterance(clean);
        if (voice) u.voice = voice;
        u.lang = (voice && voice.lang) || 'en-GB';
        u.rate = opts.rate || 0.92;
        u.pitch = opts.pitch || 1;
        u.onstart = () => {
          started = true;
          if (opts.owl && OWL && my === talkGen) OWL.talk(true);
          clearTimeout(guard);
          guard = setTimeout(finish, readMs * 2 + 2500);
        };
        u.onend = finish;
        u.onerror = (ev) => {
          const stopped = ev && /interrupted|canceled|cancelled/i.test(ev.error || '');
          if (stopped || started) finish(); else setTimeout(finish, Math.min(readMs, 3200));
        };
        keepU.push(u); if (keepU.length > 6) keepU.shift();
        window.speechSynthesis.speak(u);
        guard = setTimeout(() => { if (!started) { try { window.speechSynthesis.cancel(); } catch (e) {} setTimeout(finish, Math.min(readMs, 2500)); } }, 2200);
      } catch (e) { finish(); }
    });
  }
  const childTalk = (t) => talk(t, { pitch: 1.35, rate: 0.95 });
  const owlTalk = (t) => talk(t, { owl: true });

  /* =====================================================================
     4. SAVED PROGRESS
     ===================================================================== */
  const st = {
    v: 2, stage: 1, help: 0, run: [], gate: [], missRun: 0, atLevel: 0,
    seen: [], expert: false, expertCount: 0, recent: [], jar: [], missions: 0, lastMission: '',
    words: {}, use: { t: 0, f: 0 }, last10: [], sinceReview: 0, kindRun: [], solvedEver: 0,
    book: [], world: 'home', worlds: {}, replay: false
  };
  let sitting = 0, visitStarted = false, worldPicked = false, sittingFinds = [];
  const num = (v, d) => { v = Number(v); return isFinite(v) ? v : d; };
  function loadState() {
    let s = null;
    try { s = Stars.load(); } catch (e) { s = null; }
    if (!s || typeof s !== 'object') return;
    st.stage = Math.min(5, Math.max(1, Math.round(num(s.level, 1))));
    ['run', 'gate', 'seen', 'recent', 'jar', 'last10', 'kindRun', 'book'].forEach((k) => { if (Array.isArray(s[k])) st[k] = s[k].slice(-400); });
    ['missRun', 'atLevel', 'expertCount', 'missions', 'sinceReview', 'solvedEver'].forEach((k) => { st[k] = Math.max(0, Math.round(num(s[k], 0))); });
    st.expert = !!s.expert;
    st.lastMission = typeof s.lastMission === 'string' ? s.lastMission : '';
    if (s.words && typeof s.words === 'object') st.words = s.words;
    if (s.use && typeof s.use === 'object') st.use = { t: num(s.use.t, 0), f: num(s.use.f, 0) };
    if (s.worlds && typeof s.worlds === 'object') st.worlds = s.worlds;
    if (WORLDS[s.world]) st.world = s.world;
    st.jar = st.jar.filter((j) => j && typeof j.q === 'string').slice(-RULES.jarMax);
    if (s.v === 2) {
      st.help = Math.min(3, Math.max(0, Math.round(num(s.help, STAGES[st.stage].start))));
    } else {
      // Saved by version 1: keep the stage, his stats, jar and missions; show the new demos; fresh help level.
      st.seen = []; st.run = []; st.gate = []; st.atLevel = 0; st.recent = []; st.book = [];
      st.help = STAGES[st.stage].start;
    }
  }
  function saveState() {
    try {
      Stars.save({
        v: 2, level: st.stage, label: `Stage ${st.stage} of 5: ${STAGES[st.stage].name}`,
        help: st.help, run: st.run, gate: st.gate, missRun: st.missRun, atLevel: st.atLevel,
        seen: st.seen, expert: st.expert, expertCount: st.expertCount, recent: st.recent, jar: st.jar,
        missions: st.missions, lastMission: st.lastMission, words: st.words, use: st.use, last10: st.last10,
        sinceReview: st.sinceReview, kindRun: st.kindRun, solvedEver: st.solvedEver, book: st.book,
        world: st.world, worlds: st.worlds
      });
    } catch (e) {}
    updateTop();
  }

  /* =====================================================================
     5. MAKING PUZZLES (the world he chose is preferred)
     ===================================================================== */
  function prefer(list, worldsOf) {
    const mine = list.filter((x) => (worldsOf(x) || []).includes(st.world));
    return mine.length && Math.random() < 0.85 ? mine : list;
  }
  function fresh(list, idOf, n) {
    const free = shuffle(list.filter((x) => !st.recent.includes(idOf(x))));
    const rest = shuffle(list.filter((x) => st.recent.includes(idOf(x))));
    return free.concat(rest).slice(0, n || 1);
  }
  function remember(id) {
    if (!id) return;
    st.recent = st.recent.filter((r) => r !== id);
    st.recent.push(id);
    if (st.recent.length > RULES.recentKeep) st.recent.shift();
  }

  function boxPuzzle(fixed) {
    const items = fixed || fresh(prefer(BOX_ITEMS, (x) => x.w), (x) => 'box:' + x.id, 3);
    return {
      kind: 'box', goal: 'what', id: null, items, item: null, choose: true,
      line: 'Ollie packed three mystery boxes. Pick one!',
      q: { what: split('What|is|in the box?'), where: split('Where|is|it?'), who: split('Who|packed|the box?'), why: split('Why|is it|in a box?') },
      a: { what: '', where: '=It’s in the box', who: '=I packed it for you', why: 'Because it’s a surprise for you! 😊' },
      known: [['who', 'Ollie packed it'], ['where', 'In the box']],
      clue: 'The thing inside is a mystery! 🎁',
      colours: shuffle(BOX_COLOURS).slice(0, 3)
    };
  }
  function hidePuzzle(fixed) {
    const world = (fixed && fixed.world) || st.world;
    const room = HIDE[world];
    const h = fixed ? fixed.hider : fresh(room.hiders, (x) => 'hide:' + world + ':' + x[0])[0];
    const [name, e, what, full, snd] = h;
    const places = fixed ? fixed.places : shuffle(room.places).slice(0, st.help >= 3 ? 5 : 4);
    const at = fixed ? fixed.at : rand(places.length);
    return {
      kind: 'hide', goal: 'where', id: 'hide:' + world + ':' + name, world, bg: room.bg,
      line: `${full} is hiding!`,
      q: { where: split(`Where|is|${name}?`), what: split('What|is|hiding?'), who: split('Who|is|hiding?'), why: split(`Why|is|${name}|hiding?`) },
      a: { where: `${name} is ${places[at][0]}!`, what: `=It’s ${what}`, who: `=It’s ${name}`, why: `Because ${name} loves playing hide and seek!` },
      known: [['what', cap(what)], ['who', name]],
      clue: 'We don’t know the place yet. 📍',
      hider: { name, e, snd, full }, places, at
    };
  }
  function whoPuzzle(fixed) {
    const ev = fixed ? fixed.ev : fresh(prefer(WHO, (x) => x.w), (x) => 'who:' + x.id)[0];
    const suspects = fixed ? fixed.suspects : shuffle(SUSPECTS).slice(0, 3);
    const at = fixed ? fixed.at : rand(3);
    return {
      kind: 'who', goal: 'who', id: 'who:' + ev.id, ev, line: ev.line,
      q: { who: split(ev.who), what: split('What|happened?'), where: split('Where|did it|happen?'), why: split(ev.why[0]) },
      a: { who: `${suspects[at][0]} did it! ${ev.clue}`, what: '=' + ev.what, where: '=' + ev.where, why: ev.why[1] },
      known: [['what', ev.what], ['where', ev.where]],
      clue: 'We don’t know which animal did it yet. 🐾',
      suspects, at
    };
  }
  function whyPuzzle(fixed) {
    const w = fixed || fresh(prefer(WHY, (x) => x.w), (x) => 'why:' + x.id)[0];
    const q = {}, a = {}, known = [];
    ['why', 'what', 'where', 'who'].forEach((k) => {
      q[k] = split(w[k][0]); a[k] = w[k][1];
      if (k !== 'why' && w[k][1].charAt(0) === '=') known.push([k, w[k][1].slice(1)]);
    });
    return { kind: 'why', goal: 'why', id: 'why:' + w.id, w, line: w.line, q, a, known, clue: 'We don’t know the reason yet. 💡' };
  }
  function wonderPuzzle(fixed) {
    const pics = fixed ? [fixed] : fresh(prefer(WONDER, (x) => x.w), (x) => 'wonder:' + x.id, 3);
    return { kind: 'wonder', goal: null, id: null, pics, pic: null, choose: !fixed, line: fixed ? fixed.line : 'Pick a picture to wonder about!', q: {}, a: {}, known: [] };
  }
  function setWonderPic(p, pic) {
    p.pic = pic; p.id = 'wonder:' + pic.id; p.line = pic.line; p.choose = false;
    Object.keys(pic.ask).forEach((k) => { p.q[k] = split(pic.ask[k][0]); p.a[k] = pic.ask[k][1]; });
  }
  function makePuzzle(kind) {
    if (kind === 'box') return boxPuzzle();
    if (kind === 'hide') return hidePuzzle();
    if (kind === 'who') return whoPuzzle();
    if (kind === 'why') return whyPuzzle();
    return wonderPuzzle();
  }
  function pickKind(mix) {
    const kinds = Object.keys(mix);
    if (kinds.length === 1) return kinds[0];
    for (let tries = 0; tries < 20; tries++) {
      let total = 0; kinds.forEach((k) => { total += mix[k]; });
      let r = Math.random() * total, k = kinds[0];
      for (const kk of kinds) { r -= mix[kk]; if (r < 0) { k = kk; break; } }
      const run = st.kindRun.slice(-2);
      if (run.length === 2 && run[0] === k && run[1] === k) continue;
      return k;
    }
    return kinds[0];
  }

  const byId = (list, id) => list.find((x) => x.id === id);
  const DEMO = {
    1: () => boxPuzzle([byId(BOX_ITEMS, 'frog'), byId(BOX_ITEMS, 'rocket'), byId(BOX_ITEMS, 'teddy')]),
    2: () => hidePuzzle({ world: 'home', hider: HIDE.home.hiders[0], places: [HIDE.home.places[0], HIDE.home.places[1], HIDE.home.places[2], HIDE.home.places[4]], at: 1 }),
    3: () => whoPuzzle({ ev: byId(WHO, 'cake'), suspects: [SUSPECTS[0], SUSPECTS[1], SUSPECTS[2]], at: 1 }),
    4: () => whyPuzzle(byId(WHY, 'melt')),
    5: () => wonderPuzzle(byId(WONDER, 'rainbow'))
  };
  const DEMO_THINK = {
    1: ['Ollie packed the box, so Ollie knows what’s inside. I don’t know!', 'To find out what it is, I ask a WHAT question.'],
    2: ['I closed my eyes, so I don’t know where Mittens went. Ollie watched – so Ollie knows!', 'I need the PLACE. Places need a WHERE question.'],
    3: ['Someone ate the cake. I know what happened, and where.', 'I don’t know which animal did it – but Ollie saw. So I ask a WHO question.'],
    4: ['The ice cream melted. I know what, who and where.', 'I don’t know the REASON. Reasons need a WHY question.'],
    5: ['A rainbow! I can ask about anything I wonder.', 'I’ll ask a WHY question first.']
  };

  /* =====================================================================
     6. THE STAGE, OLLIE, AND WHAT IS ON SCREEN
     ===================================================================== */
  let S = null, OWL = null;
  let P = null, T = null, gen = 0, idleTimer = 0, boxTimer = 0;
  const alive = (g) => g === gen;

  function owl(text, sub) {
    $('owlText').innerHTML = '<p>' + esc(text) + '</p>' + (sub ? '<p class="sub">' + esc(sub) + '</p>' : '');
    $('bubble').scrollTop = 0;
    owl.last = sub ? text + ' ' + sub : text;
  }
  function line(text) { $('sceneLine').textContent = text || ''; placeLine(); }
  /* Keep the scene line clear of the blue/green demo banner: wrap it beside the banner, or move it under. */
  function placeLine() {
    const p = $('sceneLine'), sl = p.parentElement, b = $('demoBanner');
    sl.style.top = ''; p.style.maxWidth = '';
    if (!b.classList.contains('show') || !p.textContent) return;
    const r1 = p.getBoundingClientRect(), r2 = b.getBoundingClientRect();
    if (!(r1.left < r2.right && r2.left < r1.right && r1.top < r2.bottom && r2.top < r1.bottom)) return;
    const room = r2.left - r1.left - 10;
    if (room >= 190) { p.style.maxWidth = room + 'px'; return; }
    sl.style.top = Math.round(r2.bottom - sl.parentElement.getBoundingClientRect().top + 8) + 'px';
  }

  function wordsFor(p, flags) {
    const allowed = (flags && flags.words) || STAGES[st.stage].words;
    return WORD_ORDER.filter((w) => allowed.includes(w) && p.q[w]);
  }
  function promptFor(help) {
    if (P.kind === 'wonder') return T.count ? 'Great question! Ask me another one!' : 'What do you wonder? Ask me anything!';
    const g = WORDS[P.goal];
    if (help <= 0) return `Ask me: “${joinQ(P.q[P.goal])}”`;
    if (help === 1) return `Ask me a ${g.label.toUpperCase()} question.`;
    if (help === 2) return P.clue;
    return 'Your turn – ask me a question!';
  }
  const SEE = {
    box: 'I packed this box myself, so I know! 🎁',
    hide: (p) => `I kept my eyes open, so I saw where ${p.hider.name} went! 👀`,
    who: 'My owl eyes can see in the dark – I saw everything! 👀',
    why: 'I know all about this! 🦉'
  };

  function renderKnow() {
    const box = $('know');
    if (!P || !T || T.phase === 'intro' || T.phase === 'choose') { box.innerHTML = ''; return; }
    if (P.kind === 'wonder') {
      const done = Object.keys(T.asked).filter((w) => T.asked[w]);
      box.innerHTML = done.length ? '<span class="know-label">Found out:</span>' + done.map((w) => `<span class="know-chip w-${w}">${WORDS[w].icon} ${WORDS[w].label} <span class="tick">✓</span></span>`).join('') : '';
      return;
    }
    if (T.help >= 3 && !T.foundOut) { box.innerHTML = ''; return; }
    if (T.review) { box.innerHTML = ''; return; }
    const chips = P.known.map(([w, text]) => `<span class="know-chip w-${w}" data-w="${w}"><span aria-hidden="true">${WORDS[w].icon}</span>${esc(chipText(text))} <span class="tick">✓</span></span>`);
    const m = WORDS[P.goal];
    chips.push(T.foundOut
      ? `<span class="know-chip w-${P.goal}"><span aria-hidden="true">${m.icon}</span>${esc(m.meaning)} – found out! <span class="tick">✓</span></span>`
      : `<span class="know-chip missing w-${P.goal}"><span aria-hidden="true">${m.icon}</span>${esc(m.meaning)}: ?</span>`);
    box.innerHTML = '<span class="know-label">We know:</span>' + chips.join('');
  }
  function chipText(t) {
    t = String(t).replace(/^It[’']s /, '').replace(/ (did|does|was|is)$/, '');
    return cap(t);
  }
  function glowKnown(w) {
    const c = document.querySelector(`.know-chip[data-w="${w}"]`);
    if (c) { c.classList.remove('glow'); void c.offsetWidth; c.classList.add('glow'); }
  }

  function renderQ() {
    const q = $('qText'), ask = $('askBtn');
    if (T && T.word && P.q[T.word]) {
      const t = P.q[T.word];
      q.className = 'q-text full';
      q.innerHTML = `<span class="qw w-${T.word}">${esc(t[0])}</span> ${esc(joinQ(t.slice(1)))}` +
        (T.baseHelp <= 1 && !T.demo && T.phase !== 'answering' ? '<span class="tip">🗣️ Say it out loud!</span>' : '');
      ask.disabled = T.phase !== 'word';
      ask.classList.toggle('ready', T.phase === 'word');
    } else {
      q.className = 'q-text';
      q.innerHTML = T && T.phase === 'word' ? '<span class="hint-text">Tap a question word</span>' : '';
      ask.disabled = true;
      ask.classList.remove('ready');
    }
  }

  function wordButton(w, whole) {
    const W = WORDS[w], asked = !!T.asked[w], on = T.word === w;
    const label = whole ? joinQ(P.q[w]) : W.label;
    return `<button type="button" class="word-btn w-${w}${whole ? ' whole' : ''}${asked ? ' asked' : ''}${on ? ' on' : ''}" data-word="${w}"${asked ? ' aria-disabled="true"' : ''}>` +
      `<span class="wtop"><span aria-hidden="true">${W.icon}</span>${esc(label)}</span>` + (whole ? '' : `<span class="wm">${esc(W.meaning)}</span>`) + '</button>';
  }
  function renderChoices() {
    const c = $('choices');
    if (!T) { c.innerHTML = ''; return; }
    if (T.phase === 'word') c.innerHTML = T.words.map((w) => wordButton(w, T.help <= 0)).join('');
    else if (T.phase === 'use' && P.kind === 'why') {
      c.innerHTML = `<p class="choice-q">${esc(P.w.use.q)}</p>` + T.opts.map((o, i) =>
        `<button type="button" class="opt-btn${T.out[i] ? ' out' : ''}" data-o="${i}"><span class="oe" aria-hidden="true">${o[1]}</span><span>${esc(o[0])}</span></button>`).join('');
    } else if (T.phase === 'done') {
      c.innerHTML = T.demo
        ? '<button type="button" class="btn-primary big-go" id="turnBtn">Your turn →</button>'
        : `<span class="praise">${esc(T.praise || '')}</span><button type="button" class="btn-primary big-go" id="nextBtn">Next →</button>`;
    } else c.innerHTML = '';
    renderQ();
  }

  /* =====================================================================
     7. SETTING UP EACH KIND OF SCENE (the "mystery" moment)
     ===================================================================== */
  function giftHtml(col) {
    const [c1, c2] = col, rib = '#F2C14E', ribD = '#D9A62E';
    return '<svg viewBox="0 0 200 210" aria-hidden="true" focusable="false">' +
      '<ellipse cx="100" cy="200" rx="78" ry="8" fill="rgba(0,0,0,0.08)"/>' +
      `<rect x="26" y="88" width="148" height="108" rx="14" fill="${c1}"/><rect x="26" y="88" width="148" height="22" fill="${c2}" opacity="0.55"/>` +
      `<rect x="89" y="88" width="22" height="108" fill="${rib}"/>` +
      `<g class="lid"><rect x="16" y="62" width="168" height="34" rx="12" fill="${c2}"/><rect x="89" y="62" width="22" height="34" fill="${ribD}"/>` +
      `<path d="M100 62C84 36 58 34 60 52C62 66 88 64 100 62Z" fill="${rib}" stroke="${ribD}" stroke-width="3"/>` +
      `<path d="M100 62C116 36 142 34 140 52C138 66 112 64 100 62Z" fill="${rib}" stroke="${ribD}" stroke-width="3"/>` +
      `<circle cx="100" cy="62" r="8" fill="${ribD}"/></g></svg>`;
  }
  function addActors(map) {
    Object.keys(map || {}).forEach((id) => S.add(id, map[id]));
  }

  async function introBox(g) {
    S.setBg('boxes');
    const xs = [20, 50, 80];
    P.colours.forEach((col, i) => {
      S.add('b' + i, { shape: 'gift', html: giftHtml(col), x: xs[i], y: 60, button: true, label: 'Mystery box ' + (i + 1), data: { choice: i }, hidden: true });
    });
    for (let i = 0; i < 3; i++) {
      FX.appear(S, 'b' + i).then(() => FX.scaleTo(S, 'b' + i, 0.78, 200));
      await wait(220);
    }
    if (!alive(g)) return;
    T.phase = 'choose';
    owl('I packed three mystery boxes! 🎁', 'Pick one!');
    renderChoices();
    owlTalk('I packed three mystery boxes! Pick one!');
  }
  async function onChoose(i, fromDemo) {
    if (!T || T.phase !== 'choose' || (T.demo && !fromDemo)) return;
    const g = gen;
    T.phase = 'intro';
    armIdle();
    if (P.kind === 'wonder') return chooseWonder(i, g);
    P.item = P.items[i];
    P.id = 'box:' + P.item.id;
    P.a.what = `It’s ${P.item.name}! ${P.item.e}`;
    if (!T.demo) remember(P.id);
    FXL.sound('pop');
    [0, 1, 2].forEach((k) => { if (k !== i) FX.hide(S, 'b' + k); });
    const b = S.actors['b' + i];
    b.el.disabled = true; b.el.classList.remove('tap');
    S.actors.box = b;
    await Promise.all([FX.move(S, b, 50, 66, 600), FX.scaleTo(S, b, 1, 600)]);
    if (!alive(g)) return;
    S.add('item', { e: P.item.e, x: 50, y: 30, s: 26, hidden: true, z: 3 });
    line('Ollie put something in the box for you!');
    readyToAsk(g, SEE.box);
    boxRattle(g, true);
  }
  function boxRattle(g, first) {
    clearTimeout(boxTimer);
    const go = () => {
      if (!alive(g) || !T || !(T.phase === 'word' || T.phase === 'answering') || T.opened || !S.actors.box) return;
      FX.wiggle(S, 'box', 3, 6);
      FXL.sound(P.item.hint);
      boxTimer = setTimeout(go, FAST ? 999999 : RULES.boxHintMs);
    };
    boxTimer = setTimeout(go, first ? 600 : RULES.boxHintMs);
  }

  function placeSpots(n) {
    if (n <= 4) return [[17, 60], [39, 66], [61, 60], [83, 66]];
    return [[12, 60], [31, 67], [50, 60], [69, 67], [88, 60]];
  }
  async function introHide(g) {
    S.setBg(P.bg);
    const spots = placeSpots(P.places.length);
    const portrait = S.el.clientHeight > S.el.clientWidth;
    const size = (P.places.length > 4 ? 19 : 22) * (portrait ? 0.82 : 1);
    P.places.forEach((pl, i) => S.add('p' + i, { e: pl[1], x: spots[i][0], y: spots[i][1], s: size, button: true, tag: pl[2], label: pl[0], data: { place: i } }));
    S.add('hider', { e: P.hider.e, x: 50, y: 30, s: 18, hidden: true, z: 6 });
    line(P.line);
    if (T.help <= 1 || T.demo) owl(`Let’s play hide and seek with ${P.hider.name}! 🙈`, 'Close your eyes… I’ll keep mine open!');
    else owl(`Hide and seek with ${P.hider.name}! 🙈`, 'Close your eyes!');
    const say = owlTalk(owl.last);
    await FX.appear(S, 'hider', false);
    FXL.sound(P.hider.snd);
    await FX.hop(S, 'hider', 2, 5, false);
    await say;
    if (!alive(g)) return;
    await FX.dark(S, true, 500);
    const ct = document.createElement('div');
    ct.className = 'count-text';
    $('stageWrap').querySelector('.stage').appendChild(ct);
    FX.hide(S, 'hider');
    FXL.sound('rustle');
    for (const n of ['🙈', '1…', '2…', '3…']) {
      if (!alive(g)) { ct.remove(); return; }
      ct.textContent = n;
      FXL.sound('tick');
      await wait(650);
    }
    ct.remove();
    if (!alive(g)) return;
    await FX.dark(S, false, 500);
    if (!alive(g)) return;
    readyToAsk(g, SEE.hide(P));
  }

  async function introWho(g) {
    const ev = P.ev;
    S.setBg(ev.bg);
    addActors(ev.setup);
    if (ev.hideInside) { const pic = S.actors[ev.hideInside].inner.querySelector('.paper-pic'); if (pic) pic.style.opacity = 0; }
    const xs = [24, 50, 76];
    P.suspects.forEach((s, i) => S.add('s' + i, { e: s[1], x: 112, y: 80, s: 17, button: true, tag: s[0], label: s[0], data: { suspect: i }, hidden: true }));
    line('');
    if (ev.dark) {
      owl('Uh-oh – the lights are going out! 🔦');
      const say = owlTalk(owl.last);
      await wait(900);
      if (!alive(g)) return;
      await FX.dark(S, true, 600);
      FXL.sound(ev.dark);
      await wait(1300);
      await say;
      if (!alive(g)) return;
      await FX.dark(S, false, 600);
    }
    if (!alive(g)) return;
    line(P.line);
    if (ev.hideInside) { const pic = S.actors[ev.hideInside].inner.querySelector('.paper-pic'); if (pic) { pic.style.transition = 'opacity .5s'; pic.style.opacity = 1; FXL.sound('magic'); } }
    await FXL.timeline(S, ev.after, () => alive(g));
    if (!alive(g)) return;
    for (let i = 0; i < 3; i++) {
      const a = S.actors['s' + i];
      a.hidden = false; a.st.o = 1; a.st.sx = a.st.sy = 1; a.inner.style.opacity = 1; a.inner.style.transform = '';
      FX.move(S, 's' + i, xs[i], 80, 700, 'ease-out').then(() => FX.hop(S, 's' + i, 1, 3, false));
      FXL.sound('tick');
      await wait(260);
    }
    await wait(700);
    if (!alive(g)) return;
    readyToAsk(g, SEE.who);
  }

  async function introWhy(g, replay) {
    const w = P.w;
    S.clear();
    S.setBg(w.bg);
    addActors(w.actors);
    line(w.line);
    if (!replay) owl('Watch what happens… ⏩');
    $('replayBtn').hidden = true;
    await wait(500);
    await FXL.timeline(S, w.play, () => alive(g));
    if (!alive(g)) return;
    $('replayBtn').hidden = false;
    if (!replay) readyToAsk(g, SEE.why);
  }

  async function introWonder(g) {
    if (!P.choose) return chooseWonder(0, g, true);
    S.setBg('sky');
    const xs = [20, 50, 80];
    P.pics.forEach((pic, i) => S.add('c' + i, { e: pic.e, x: xs[i], y: 54, s: 24, button: true, tag: pic.line.replace(/^Look – /, '').replace(/!$/, ''), label: pic.line, data: { choice: i }, hidden: true }));
    for (let i = 0; i < P.pics.length; i++) { FX.appear(S, 'c' + i); await wait(220); }
    if (!alive(g)) return;
    T.phase = 'choose';
    line('');
    owl('Pick a picture to wonder about! ✨');
    renderChoices();
    owlTalk(owl.last);
  }
  async function chooseWonder(i, g, direct) {
    const pic = P.pics[i];
    setWonderPic(P, pic);
    if (!T.demo) remember(P.id);
    T.words = wordsFor(P, T.flags);
    if (!direct) { FXL.sound('pop'); await FX.scaleTo(S, 'c' + i, 1.3, 300); }
    if (!alive(g)) return;
    S.clear();
    S.setBg(pic.bg);
    addActors(pic.actors);
    line(pic.line);
    FXL.timeline(S, pic.ambient, () => alive(g));
    await wait(500);
    if (!alive(g)) return;
    readyToAsk(g, null);
  }

  /* After the mystery moment: ready for his question. */
  function readyToAsk(g, see) {
    if (!alive(g)) return;
    T.phase = 'word';
    renderKnow();
    renderChoices();
    const p = promptFor(T.help);
    if (see) owl(see, p); else owl(p);
    if (!T.demo) owlTalk(owl.last);
    armIdle();
    if (T.readyResolve) { T.readyResolve(); T.readyResolve = null; }
  }

  /* =====================================================================
     8. ONE PUZZLE
     ===================================================================== */
  function startPuzzle(p, flags) {
    flags = flags || {};
    stopTalk();
    gen++;
    const g = gen;
    clearTimeout(idleTimer); clearTimeout(boxTimer);
    if (OWL) { OWL.reset(); }
    P = p;
    const help = flags.help != null ? flags.help : st.help;
    T = {
      phase: 'intro', help, baseHelp: help, word: null, asked: {}, missed: false,
      demo: !!flags.demo, warm: !!flags.warm, review: !!flags.review, flags,
      words: wordsFor(p, flags), count: 0, need: RULES.wonderAsks[Math.min(3, help)],
      useMissed: false, wrongTaps: 0, out: {}, opts: [], foundOut: false, opened: false
    };
    if (!T.demo && p.id) remember(p.id);
    $('replayBtn').hidden = true;
    S.clear();
    S.el.querySelectorAll('.stamp, .count-text').forEach((n) => n.remove());
    line('');
    renderKnow();
    renderChoices();
    updateTop();
    const ready = new Promise((r) => { T.readyResolve = r; });
    const intro = { box: introBox, hide: introHide, who: introWho, why: introWhy, wonder: introWonder }[p.kind];
    intro(g).catch(() => {}).then(() => { if (alive(g) && T.phase === 'choose' && T.readyResolve) { T.readyResolve(); T.readyResolve = null; } });
    return ready;
  }

  function onWord(w, fromDemo) {
    if (!T || T.phase !== 'word' || (T.demo && !fromDemo) || T.asked[w] || !P.q[w]) return;
    armIdle();
    T.word = w;
    FXL.sound('tick');
    renderChoices();
  }

  /* He asks. Ollie answers whatever he asked – the answer is the reward. */
  async function ask(fromDemo) {
    if (!T || T.phase !== 'word' || !T.word || (T.demo && !fromDemo)) return;
    clearTimeout(idleTimer);
    hush();
    const g = gen, w = T.word;
    T.phase = 'answering';
    renderChoices();
    const qText = joinQ(P.q[w]);
    FXL.flyCard($('qText'), $('owlWrap'), esc(qText), 'q');
    OWL.listen(true);
    await childTalk(qText);
    if (!alive(g)) return;
    await wait(250);
    OWL.listen(false);
    if (P.kind === 'wonder') return wonderAnswer(w, g);
    if (w !== P.goal) return offAnswer(w, g);
    return goalAnswer(g);
  }

  /* A good question – but we knew that already (or it doesn't find out what's missing). */
  async function offAnswer(w, g) {
    const raw = P.a[w];
    const knew = raw.charAt(0) === '=';
    const text = knew ? 'Hoo-hoo! ' + raw.slice(1) + ' – we know that already! 😊' : raw;
    if (!T.missed) {
      T.missed = true;
      if (!T.demo) { Stars.miss(SKILL[P.kind]); wordStat(P.goal, false); }
    }
    T.asked[w] = true;
    T.help = Math.max(0, T.help - 1);
    OWL.giggle();
    owl(text);
    renderKnow();
    if (knew) glowKnown(w);
    await owlTalk(text);
    if (!alive(g)) return;
    T.word = null;
    T.phase = 'word';
    const next = 'Is there something we don’t know yet? ' + promptFor(T.help);
    owl(text, next);
    renderKnow();
    renderChoices();
    armIdle();
    if (P.kind === 'box') boxRattle(g, true);
    await owlTalk(next);
  }

  /* The question that finds out what was missing. */
  async function goalAnswer(g) {
    const clean = !T.missed;
    T.foundOut = true;
    renderKnow();
    if (!T.demo) {
      if (clean) Stars.win(SKILL[P.kind]);
      wordStat(P.goal, clean);
      if (!T.warm && !T.review) levelResult(P.kind, clean); else saveState();
    }
    OWL.happy();
    const text = P.a[P.goal];
    if (P.kind === 'box') {
      T.opened = true;
      clearTimeout(boxTimer);
      const box = S.actors.box;
      box.inner.classList.add('open');
      FXL.sound('pop');
      FX.sparkle(S, 50, 36, 8);
      await FX.grow(S, 'item', false);
      if (!alive(g)) return;
      S.actors.item.el.insertAdjacentHTML('beforeend', `<span class="a-tag">${esc(P.item.name)}</span>`);
      owl(text, P.item.fact);
      const say = owlTalk(text + ' ' + P.item.fact);
      await playItem(P.item);
      await say;
      if (!alive(g)) return;
      addBook(P.id, S.actors.item.inner, P.item.e);
      return finish(g);
    }
    if (P.kind === 'hide') {
      T.phase = 'use';
      renderChoices();
      const sub = `Can you find ${P.hider.name}? Tap the ${P.places[P.at][2]}.`;
      owl(text, sub);
      await owlTalk(text + ' ' + sub);
      armIdle();
      return;
    }
    if (P.kind === 'who') {
      T.phase = 'use';
      renderChoices();
      const c = S.actors['s' + P.at];
      c.el.insertAdjacentHTML('beforeend', `<span class="particle" style="left:80%;top:10%;font-size:7cqh">${P.ev.clueE}</span>`);
      FX.wiggle(S, c, 2, 8);
      FXL.sound('pop');
      const sub = `Tap ${P.suspects[P.at][0]}.`;
      owl(text, sub);
      await owlTalk(text + ' ' + sub);
      armIdle();
      return;
    }
    if (P.kind === 'why') {
      owl('💡 ' + text);
      await owlTalk(text);
      if (!alive(g)) return;
      T.phase = 'use';
      T.opts = shuffle(P.w.use.opts.map((o, i) => [o[0], o[1], i === 0]));
      T.out = {};
      renderChoices();
      armIdle();
      await owlTalk(P.w.use.q);
    }
  }

  /* What the treasure does when the box opens. */
  async function playItem(it) {
    const id = 'item';
    switch (it.anim) {
      case 'roll': return FX.roll(S, id);
      case 'walk': await FX.slide(S, id, 16, false, 2000); return FX.slide(S, id, -16, false, 2000);
      case 'launch': return FX.launch(S, id);
      case 'stomp': return FX.stomp(S, id);
      case 'wiggle': FXL.sound(it.hint); return FX.wiggle(S, id, 4, 10);
      case 'hug': await FX.pulse(S, id, 2, 1.12); return FX.hearts(S, id, 3, '💛');
      case 'slide': return FX.slide(S, id, 24, true, 2600);
      case 'water': await FX.drip(S, id, 3, '💧', 46); return FX.pulse(S, id, 1, 1.1);
      case 'fly': return FX.flyLoop(S, id, it.hint);
      case 'pull': return FX.pull(S, id, '📎');
      case 'moon': S.add('moonx', { e: '🌕', x: 80, y: 22, s: 16, hidden: true }); await FX.appear(S, 'moonx', 'twinkle'); return FX.pulse(S, 'moonx', 2, 1.2);
      case 'waddle': return FX.waddle(S, id, 6, 0);
      case 'crab': return FX.crab(S, id);
      case 'turn': S.add('sunx', { e: '☀️', x: 84, y: 18, s: 14, hidden: true }); await FX.appear(S, 'sunx'); return FX.turnTo(S, id, 22);
      case 'spin': FXL.sound(it.hint); return FX.spin(S, id, 1, 1600);
      case 'stretch': FXL.sound('boing'); await FX.stretch(S, id, 1, 1.45, 700); await wait(300); return FX.unstretch(S, id, 600);
      case 'swim': return FX.swim(S, id, 22);
      case 'sprout': return FX.sprout(S, id, ['🌱', '🌳']);
      case 'hatch': return FX.hatch(S, id);
      case 'hop': return FX.hop(S, id, 3, 6, it.hint === 'ribbit' ? 'ribbit' : 'boing');
      default: return FX.hop(S, id, 2, 5);
    }
  }

  /* Hide and seek: tapping the places. Before he asks, Ollie nudges him to ask. */
  async function onPlace(i, fromDemo) {
    if (!T || (T.demo && !fromDemo) || P.kind !== 'hide') return;
    const g = gen;
    if (T.phase === 'word') {
      FX.wiggle(S, 'p' + i, 2, 5);
      const t = `Hmm, ${P.hider.name} could be anywhere! I saw where – ask me! 👀`;
      owl(t, promptFor(T.help));
      owlTalk(t);
      armIdle();
      return;
    }
    if (T.phase !== 'use') return;
    armIdle();
    if (i !== P.at) {
      T.wrongTaps++;
      await FX.lift(S, 'p' + i);
      FXL.sound('soft');
      const t = `Not there! Remember: ${P.a.where}`;
      owl(t);
      owlTalk(t);
      await wait(500);
      FX.drop(S, 'p' + i);
      if (T.wrongTaps >= 2) OWL.flyTo(S.actors['p' + P.at].el);
      return;
    }
    T.phase = 'answering';
    const pl = S.actors['p' + P.at];
    await FX.lift(S, pl);
    const h = S.actors.hider;
    h.el.style.left = pl.x + '%'; h.el.style.top = (pl.y - 14) + '%'; h.x = pl.x; h.y = pl.y - 14;
    await FX.appear(S, 'hider', false);
    FXL.sound(P.hider.snd);
    FX.hearts(S, 'hider', 3);
    FXL.sound('yay');
    await FX.hop(S, 'hider', 2, 5, false);
    OWL.flyHome();
    const t = `You found ${P.hider.name}! 🎉`;
    owl(t);
    await owlTalk(t);
    if (!alive(g)) return;
    FX.drop(S, pl);
    addBook(P.id, h.inner, P.hider.e);
    finish(g);
  }

  /* Who did it: tapping the animals. */
  async function onSuspect(i, fromDemo) {
    if (!T || (T.demo && !fromDemo) || P.kind !== 'who') return;
    const g = gen;
    if (T.phase === 'word') {
      FX.say(S, 's' + i, 'Not telling! 🤐', 1400);
      const t = 'Hmm! They won’t tell. I saw everything – ask me! 👀';
      owl(t, promptFor(T.help));
      owlTalk(t);
      armIdle();
      return;
    }
    if (T.phase !== 'use') return;
    armIdle();
    if (i !== P.at) {
      T.wrongTaps++;
      FX.wiggle(S, 's' + i, 3, 10);
      FX.say(S, 's' + i, 'Not me!', 1400);
      const t = `Listen again: ${P.suspects[P.at][0]} did it!`;
      owl(t);
      owlTalk(t);
      if (T.wrongTaps >= 2) S.actors['s' + P.at].el.classList.add('lit');
      return;
    }
    T.phase = 'answering';
    const s = S.actors['s' + P.at];
    s.el.classList.remove('lit');
    await FX.sorry(S, s);
    const stamp = document.createElement('div');
    stamp.className = 'stamp';
    stamp.textContent = '🔍 Mystery solved!';
    $('stageWrap').querySelector('.stage').appendChild(stamp);
    FXL.sound('yay');
    FXL.run(stamp, [{ transform: 'translate(-50%, -50%) scale(2.2) rotate(-14deg)', opacity: 0 }, { transform: 'translate(-50%, -50%) scale(1) rotate(-8deg)', opacity: 1 }], 450, 'cubic-bezier(.3,1.4,.6,1)')
      .then(() => { stamp.style.transform = 'translate(-50%, -50%) rotate(-8deg)'; });
    const t = 'Mystery solved! 🎉';
    owl(t);
    await owlTalk(t);
    if (!alive(g)) return;
    addBook(P.id, s.inner, P.ev.clueE);
    finish(g);
  }

  /* Why: he uses the reason to decide – and sees what happens. */
  async function onOption(i, btn, fromDemo) {
    if (!T || T.phase !== 'use' || P.kind !== 'why' || (T.demo && !fromDemo) || T.out[i]) return;
    const g = gen;
    armIdle();
    const o = T.opts[i];
    if (!o[2]) {
      if (!T.useMissed) { T.useMissed = true; if (!T.demo) { Stars.miss(SKILL.use); st.use.t++; saveState(); } }
      T.out[i] = true;
      renderChoices();
      FXL.sound('soft');
      OWL.think();
      const t = `Hmm – remember the reason: ${P.a.why}`;
      owl(t);
      await owlTalk(t);
      return;
    }
    T.phase = 'answering';
    if (!T.useMissed && !T.demo) { Stars.win(SKILL.use); st.use.t++; st.use.f++; saveState(); }
    if (btn) btn.classList.add('right');
    const fix = P.w.fix || {};
    const target = fix.to && S.actors[fix.to] ? S.actors[fix.to].inner : $('stage');
    await FXL.flyCard(btn || $('choices'), target, o[1]);
    if (!alive(g)) return;
    FXL.sound('magic');
    OWL.happy();
    owl(P.w.use.yes);
    const say = owlTalk(P.w.use.yes);
    await FXL.timeline(S, fix.steps || [], () => alive(g));
    await say;
    if (!alive(g)) return;
    addBook(P.id, target, WHY_ICON[P.w.id] || '💡');
    finish(g);
  }

  /* I wonder: every question gets a real answer and the picture reacts. */
  async function wonderAnswer(w, g) {
    const text = P.a[w];
    T.asked[w] = true;
    T.count++;
    if (!T.demo && !st.book.includes(P.id + ':' + w)) { st.book.push(P.id + ':' + w); saveState(); }
    FXL.timeline(S, P.pic.poke, () => alive(g));
    owl(text);
    renderKnow();
    await owlTalk(text);
    if (!alive(g)) return;
    const left = T.words.filter((x) => !T.asked[x]).length;
    if (T.count >= T.need || !left) {
      if (!T.demo) {
        Stars.win(SKILL.wonder);
        if (!T.review) levelResult('wonder', true); else saveState();
      }
      OWL.happy();
      addBook(P.id, S.actors.main ? S.actors.main.inner : $('stage'), P.pic.e);
      return finish(g);
    }
    T.word = null;
    T.phase = 'word';
    const more = 'Great question! Ask me another one!';
    owl(text, more);
    renderChoices();
    armIdle();
    await owlTalk(more);
  }

  const PRAISE = ['Great asking! 🎉', 'You found out! 🌟', 'Brilliant question! 🎉', 'Well asked! 👏', 'That’s how to find things out! 🌟'];
  async function finish(g) {
    clearTimeout(idleTimer); clearTimeout(boxTimer);
    T.phase = 'done';
    T.praise = pick(PRAISE);
    if (!T.demo) {
      st.solvedEver++;
      sitting++;
      st.kindRun.push(P.kind); if (st.kindRun.length > 4) st.kindRun.shift();
      saveState();
    }
    renderChoices();
    if (T.demo) {
      banner('turn', 'That’s how you do it. Now it’s your turn!');
      await talk('That’s how you do it. Now it’s your turn!');
    }
  }
  function onNext() {
    if (!T || T.phase !== 'done' || T.demo) return;
    if (sitting >= RULES.sitting) return showEnd();
    nextPuzzle();
  }

  /* =====================================================================
     9. THE DISCOVERY BOOK
     ===================================================================== */
  function addBook(id, fromEl, e) {
    if (T && T.demo) return;
    if (!id || st.book.includes(id)) return;
    st.book.push(id);
    sittingFinds.push(e);
    saveState();
    FXL.flyCard(fromEl, $('bookBtn'), e).then(() => {
      const b = $('bookBtn'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
      FXL.sound('sparkle');
      updateTop();
    });
  }
  function bookPages() {
    const friends = [];
    Object.keys(HIDE).forEach((w) => HIDE[w].hiders.forEach((h) => friends.push({ id: 'hide:' + w + ':' + h[0], e: h[1], name: h[3], fact: `${h[3]} – you found them in the ${WORLDS[w].name} world.` })));
    return [
      { key: 'box', name: '🎁 Treasures', cards: BOX_ITEMS.map((x) => ({ id: 'box:' + x.id, e: x.e, name: cap(x.name.replace(/^(a|an) /, '')), fact: x.fact })) },
      { key: 'hide', name: '🙈 Friends', cards: friends },
      { key: 'who', name: '🔍 Mysteries', cards: WHO.map((x) => ({ id: 'who:' + x.id, e: x.clueE, name: joinQ(split(x.who)), fact: x.line + ' Mystery solved!' })) },
      { key: 'why', name: '💡 Reasons', cards: WHY.map((x) => ({ id: 'why:' + x.id, e: WHY_ICON[x.id] || '💡', name: joinQ(split(x.why[0])), fact: x.why[1] })) },
      { key: 'wonder', name: '✨ Wonders', cards: WONDER.map((x) => {
        const facts = Object.keys(x.ask).filter((w) => st.book.includes('wonder:' + x.id + ':' + w)).map((w) => x.ask[w][1]);
        return { id: 'wonder:' + x.id, e: x.e, name: x.line.replace(/^Look – /, '').replace(/!$/, ''), fact: facts.length ? facts.join(' ') : 'Ask about it to find out!' };
      }) }
    ];
  }
  let bookTab = 'box';
  function bookCount() { return bookPages().reduce((n, p) => n + p.cards.filter((c) => st.book.includes(c.id)).length, 0); }
  function bookTotal() { return bookPages().reduce((n, p) => n + p.cards.length, 0); }
  function renderBook() {
    const pages = bookPages();
    $('bookTotal').textContent = `You have found ${bookCount()} of ${bookTotal()} things.`;
    $('bookTabs').innerHTML = pages.map((p) => {
      const n = p.cards.filter((c) => st.book.includes(c.id)).length;
      return `<button type="button" class="btn-tool" data-tab="${p.key}"${p.key === bookTab ? ' aria-current="true"' : ''}>${p.name} ${n}/${p.cards.length}</button>`;
    }).join('');
    const page = pages.find((p) => p.key === bookTab) || pages[0];
    $('bookGrid').innerHTML = page.cards.map((c, i) => {
      const got = st.book.includes(c.id);
      return `<button type="button" class="bcard${got ? '' : ' locked'}" data-card="${i}"${got ? '' : ' aria-disabled="true"'}><span class="be" aria-hidden="true">${got ? c.e : '❔'}</span><span class="bn">${got ? esc(c.name) : '???'}</span></button>`;
    }).join('');
    $('bookFact').textContent = 'Tap something you found to hear about it again.';
  }
  function openBook() { stopIdle(); renderBook(); show('bookCard'); }

  /* =====================================================================
     10. MOVING ON – help levels and stages
     ===================================================================== */
  function wordStat(w, ok) {
    if (!w) return;
    const s = st.words[w] || (st.words[w] = { t: 0, f: 0 });
    s.t++; if (ok) s.f++;
    st.last10.push(ok ? 1 : 0);
    if (st.last10.length > 10) st.last10.shift();
  }
  function setHelp(h) { st.help = Math.max(0, Math.min(3, h)); st.run = []; st.gate = []; st.atLevel = 0; }
  let showExpertNext = false;
  function levelResult(kind, clean) {
    st.missRun = clean ? 0 : st.missRun + 1;
    if (st.missRun >= RULES.replayAfterMisses) { st.replay = true; st.missRun = 0; }
    if (st.stage === 5) {
      st.atLevel++;
      if (st.help < 3 && st.atLevel >= RULES.wonderEach) setHelp(st.help + 1);
      else if (st.help >= 3) { st.expertCount++; if (st.expertCount >= RULES.expertAfter && !st.expert) { st.expert = true; showExpertNext = true; } }
      return saveState();
    }
    if (st.stage === 1) {
      st.atLevel++;
      if (st.atLevel >= RULES.stage1Help.length) nextStage();
      else st.help = RULES.stage1Help[st.atLevel];
      return saveState();
    }
    if (st.help < 3) {
      st.run.push(clean ? 1 : 0);
      if (st.run.length > 6) st.run.shift();
      const need = RULES.upAfter[st.help];
      const tail = st.run.slice(-need);
      if (tail.length === need && tail.every((x) => x === 1)) setHelp(st.help + 1);
      else if (st.help > 0 && st.run.length >= RULES.downAfterMisses && st.run.slice(-RULES.downAfterMisses).every((x) => x === 0)) setHelp(st.help - 1);
    } else {
      st.gate.push({ ok: clean ? 1 : 0, kind });
      const two = STAGES[st.stage].words.length === 2;
      const win = two ? RULES.gateWindowTwo : RULES.gateWindow, need = two ? RULES.gateNeedTwo : RULES.gateNeed;
      if (st.gate.length > win) st.gate = st.gate.slice(-win);
      const ok = st.gate.filter((x) => x.ok).length;
      const kinds = new Set(st.gate.filter((x) => x.ok).map((x) => x.kind)).size;
      const last = st.gate.slice(-RULES.downAfterMisses);
      if (st.gate.length >= win && ok >= need && kinds >= RULES.gateKinds) nextStage();
      else if (last.length === RULES.downAfterMisses && last.every((x) => !x.ok)) setHelp(2);
    }
    saveState();
  }
  function nextStage() {
    if (st.stage >= 5) return;
    st.stage++;
    setHelp(STAGES[st.stage].start);
    st.missRun = 0; st.sinceReview = 0;
  }
  function moveToStage(s) {
    st.stage = Math.min(5, Math.max(1, s));
    setHelp(STAGES[st.stage].start);
    st.missRun = 0; st.sinceReview = 0; st.replay = false;
    saveState();
  }

  function nextPuzzle() {
    if (!worldPicked) return showWorlds();
    if (!st.seen.includes(st.stage)) return showNewKind(st.stage, 'new');
    if (st.replay) { st.replay = false; return showNewKind(st.stage, 'again'); }
    if (showExpertNext) { showExpertNext = false; return show('expertCard'); }
    if (!visitStarted) {
      visitStarted = true;
      if (st.solvedEver > 0 && st.stage > 1) {
        const prev = st.stage - 1;
        return startPuzzle(makePuzzle(pickKind(STAGES[prev].mix)), { warm: true, help: Math.max(1, Math.min(2, st.help)), words: STAGES[st.stage === 5 ? 4 : st.stage].words });
      }
    }
    if (st.stage === 5 && st.sinceReview >= RULES.reviewEvery) {
      st.sinceReview = 0;
      return startPuzzle(makePuzzle(pickKind(STAGES[4].mix)), { review: true, help: 2, words: STAGES[4].words });
    }
    if (st.stage === 5) st.sinceReview++;
    startPuzzle(makePuzzle(pickKind(STAGES[st.stage].mix)));
  }

  /* =====================================================================
     11. CARDS AND THE "WATCH ME" DEMO
     ===================================================================== */
  function show(id) { $(id).classList.add('show'); }
  function hide(id) { $(id).classList.remove('show'); }
  function anyCardOpen() { return !!document.querySelector('.overlay.show'); }

  function showWorlds() {
    stopTalk();
    $('worlds').innerHTML = Object.keys(WORLDS).map((k) => `<button type="button" class="world-btn w-${k}" data-world="${k}"><span class="wi" aria-hidden="true">${WORLDS[k].icon}</span>${esc(WORLDS[k].name)}</button>`).join('');
    show('worldCard');
    talk('Where shall we explore?');
  }
  function pickWorld(k) {
    if (!WORLDS[k]) return;
    st.world = k;
    st.worlds[k] = (st.worlds[k] || 0) + 1;
    worldPicked = true;
    saveState();
    hide('worldCard');
    FXL.sound('pop');
    nextPuzzle();
  }

  let newCardTimer = 0, newCardMode = 'new';
  function showNewKind(stage, mode) {
    stopTalk();
    newCardMode = mode;
    $('newBadge').textContent = mode === 'again' ? '👀 Let’s watch how to do it' : '✨ New kind of puzzle!';
    $('newTitle').textContent = STAGES[stage].name;
    $('newLine').textContent = STAGES[stage].line;
    $('newSmall').textContent = `Stage ${stage} of 5. Watch me do the first one.`;
    show('newCard');
    const g = ++gen;
    clearTimeout(newCardTimer);
    talk((mode === 'again' ? 'Let’s watch how to do it. ' : 'New kind of puzzle! ') + STAGES[stage].line + ' Watch me do the first one.')
      .then(() => { if (g === gen && $('newCard').classList.contains('show')) newCardTimer = setTimeout(startDemoFromCard, FAST ? 10 : 900); });
  }
  function startDemoFromCard() {
    if (!$('newCard').classList.contains('show')) return;
    clearTimeout(newCardTimer);
    hide('newCard');
    runDemo(st.stage, newCardMode === 'new');
  }
  function banner(kind, text, small) {
    const b = $('demoBanner');
    if (!kind) { b.className = 'demo-banner'; b.innerHTML = ''; placeLine(); return; }
    b.className = 'demo-banner show ' + kind;
    b.innerHTML = esc(text) + (small ? `<small>${esc(small)}</small>` : '');
    placeLine();
  }
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
  async function think(text, dg) {
    if (dg !== demoGen) return;
    $('qText').className = 'q-text';
    $('qText').innerHTML = '<span class="think-in">💭 ' + esc(text) + '</span>';
    await childTalk(text);
    await wait(350);
  }
  function stopDemo() {
    demoGen++;
    $('finger').classList.remove('show', 'press');
    $('game').classList.remove('demo-on');
    banner(null);
  }
  async function runDemo(stage, isNew) {
    const dg = ++demoGen;
    const p = DEMO[stage]();
    $('game').classList.add('demo-on');
    banner('watch', '👀 Watch me – this is a demo', 'You don’t need to press anything yet');
    await startPuzzle(p, { demo: true, help: 1, words: STAGES[stage].words });
    if (dg !== demoGen) return;
    if (T.phase === 'choose') {
      await think(stage === 5 ? 'I’ll pick the rainbow!' : 'I’ll pick a box!', dg);
      const el = S.actors.b0 || S.actors.c0;
      await fingerTo(el && el.el, dg);
      if (dg !== demoGen) return;
      await onChoose(0, true);
      await new Promise((r) => { const chk = () => (T.phase === 'word' || dg !== demoGen ? r() : setTimeout(chk, 50)); chk(); });
    }
    for (const t of DEMO_THINK[stage]) { if (dg !== demoGen) return; await think(t, dg); }
    const steps = stage === 5 ? ['why', 'what'] : [p.goal];
    for (let n = 0; n < steps.length; n++) {
      if (dg !== demoGen) return;
      const w = steps[n];
      if (n > 0) await think(`Now a ${WORDS[w].label.toUpperCase()} question.`, dg);
      await fingerTo(document.querySelector(`.word-btn[data-word="${w}"]`), dg);
      if (dg !== demoGen) return;
      onWord(w, true);
      await wait(300);
      await fingerTo($('askBtn'), dg);
      if (dg !== demoGen) return;
      $('finger').classList.remove('show');
      await ask(true);
      if (dg !== demoGen) return;
    }
    if (T && T.phase === 'use') {
      await wait(400);
      if (P.kind === 'hide') { const el = S.actors['p' + P.at].el; await fingerTo(el, dg); if (dg !== demoGen) return; await onPlace(P.at, true); }
      else if (P.kind === 'who') { const el = S.actors['s' + P.at].el; await fingerTo(el, dg); if (dg !== demoGen) return; await onSuspect(P.at, true); }
      else if (P.kind === 'why') {
        const i = T.opts.findIndex((o) => o[2]);
        const b = document.querySelector(`.opt-btn[data-o="${i}"]`);
        await fingerTo(b, dg);
        if (dg !== demoGen) return;
        await onOption(i, b, true);
      }
    }
    if (dg !== demoGen) return;
    $('finger').classList.remove('show');
    $('game').classList.remove('demo-on');
    if (isNew && !st.seen.includes(stage)) { st.seen.push(stage); saveState(); }
  }
  function yourTurn() { stopDemo(); nextPuzzle(); }

  function showEnd() {
    stopTalk(); stopIdle();
    try { Stars.done(); } catch (e) {}
    sitting = 0;
    worldPicked = false;
    const n = sittingFinds.length;
    $('endTitle').textContent = 'Great asking! 🎉';
    $('endLine').textContent = n ? `You found ${n} new ${n === 1 ? 'thing' : 'things'} for your Discovery Book!` : 'Have a rest, or keep going.';
    $('foundStrip').textContent = sittingFinds.slice(0, 12).join(' ');
    sittingFinds = [];
    const words = STAGES[st.stage].words;
    const w = words.includes('why') ? 'why' : words[words.length - 1];
    $('missionText').textContent = `Ask a grown-up a real question today. Try a ${WORDS[w].label.toUpperCase()} question!`;
    $('missionExample').textContent = 'For example: “' + pick(MISSION_EXAMPLES[w]) + '”';
    const doneToday = st.lastMission === today();
    $('missionBtn').disabled = doneToday;
    $('missionBtn').textContent = doneToday ? '✅ Done today – brilliant!' : '✅ I asked a grown-up!';
    $('jarBox').hidden = st.stage < 4;
    $('jarMsg').textContent = '';
    $('jarInput').value = '';
    show('endCard');
    talk('Great asking! ' + $('endLine').textContent + ' Here’s your real-life mission. ' + $('missionText').textContent);
  }
  function onMission() {
    if (st.lastMission === today()) return;
    st.lastMission = today();
    st.missions++;
    try { Stars.win(SKILL.mission, 'mission'); } catch (e) {}
    saveState();
    $('missionBtn').disabled = true;
    $('missionBtn').textContent = '✅ Done today – brilliant!';
    FXL.sound('yay');
  }
  function onJar() {
    const v = $('jarInput').value.replace(/\s+/g, ' ').trim().slice(0, 120);
    if (!v) { $('jarMsg').textContent = 'Type your question first.'; return; }
    st.jar.push({ q: v, at: today() });
    if (st.jar.length > RULES.jarMax) st.jar = st.jar.slice(-RULES.jarMax);
    saveState();
    $('jarInput').value = '';
    $('jarMsg').textContent = '🫙 It’s in the jar! A grown-up can help you find out.';
    FXL.sound('sparkle');
  }

  /* =====================================================================
     12. NUDGES – point where to look, never the answer
     ===================================================================== */
  function stopIdle() { clearTimeout(idleTimer); }
  function armIdle() {
    clearTimeout(idleTimer);
    if (!T || T.demo || FAST) return;
    const g = gen;
    idleTimer = setTimeout(() => {
      if (!alive(g) || !T || T.demo || anyCardOpen()) return;
      if (T.phase === 'choose') { owlTalk(P.kind === 'wonder' ? 'Pick a picture!' : 'Pick a box!'); Object.values(S.actors).forEach((a) => FX.pulse(S, a, 1, 1.06)); }
      else if (T.phase === 'word' && T.word) { const b = $('askBtn'); b.classList.remove('pulse'); void b.offsetWidth; b.classList.add('pulse'); }
      else if (T.phase === 'word') {
        const k = $('know'); if (k.innerHTML) { k.classList.remove('pulse'); void k.offsetWidth; k.classList.add('pulse'); }
        OWL.blink();
        owlTalk(T.count ? 'Ask me another one!' : promptFor(T.help));
      } else if (T.phase === 'use') {
        if (P.kind === 'hide') OWL.flyTo(S.actors['p' + P.at].el);
        else if (P.kind === 'who') { S.actors['s' + P.at].el.classList.add('lit'); owlTalk(`${P.suspects[P.at][0]} did it!`); }
        else if (P.kind === 'why') owlTalk(P.w.use.q);
      }
      armIdle();
    }, RULES.idleHintMs);
  }

  /* =====================================================================
     13. GROWN-UPS PANEL AND TOP BAR
     ===================================================================== */
  function updateTop() {
    $('stageLine').textContent = `Stage ${st.stage} of 5: ${STAGES[st.stage].name}`;
    $('bookCount').textContent = bookCount();
  }
  const fmt = (f, t) => (t ? `${f} of ${t} right first time` : 'not tried yet');
  let resetArmed = false, jarArmed = false;
  function renderGrownups() {
    const s = st.stage;
    const r10 = st.last10.reduce((a, b) => a + b, 0);
    let where = `Stage ${s} of 5: ${STAGES[s].name} — help: ${HELP[st.help].name.toLowerCase()} (${HELP[st.help].note}).`;
    if (st.last10.length) where += ` Right first time: ${r10} of his last ${st.last10.length} questions.`;
    $('gpStatus').textContent = where;
    let rule;
    if (s === 1) rule = 'Stage 1 has only the What button: 3 boxes (copy the question, word given, no help), then stage 2.';
    else if (s === 5) rule = `Every question he asks gets an answer. ${RULES.wonderEach} pictures at each help level, then less help. Every ${RULES.reviewEvery} pictures, one “find out” puzzle comes back.`;
    else {
      const two = STAGES[s].words.length === 2;
      rule = `Less help after 1–2 right first time in a row; more help after ${RULES.downAfterMisses} misses in a row. Next stage when, with no help, he gets ${two ? RULES.gateNeedTwo : RULES.gateNeed} of his last ${two ? RULES.gateWindowTwo : RULES.gateWindow} right, from at least ${RULES.gateKinds} kinds of puzzle.`;
      if (st.help >= 3 && st.gate.length) rule += ` So far: ${st.gate.filter((x) => x.ok).length} of the last ${st.gate.length}.`;
    }
    $('gpRule').textContent = rule;
    $('gpStages').innerHTML = [1, 2, 3, 4, 5].map((n) => `<button type="button" class="btn-tool" data-stage="${n}"${n === s ? ' aria-current="true"' : ''}>${n}. ${esc(STAGES[n].name)}</button>`).join('');
    $('gpVoice').textContent = 'Voices: ' + (voiceOn() ? 'on' : 'off');
    $('gpSounds').textContent = 'Sounds: ' + (soundsOn() ? 'on' : 'off');
    const skills = ['what', 'where', 'who', 'why'].map((w) => `<li><b>${WORDS[w].label}</b> questions: ${st.words[w] ? fmt(st.words[w].f, st.words[w].t) : 'not tried yet'}</li>`);
    skills.push(`<li><b>Using the reason</b> (after a Why answer): ${fmt(st.use.f, st.use.t)}</li>`);
    skills.push(`<li><b>Discovery Book:</b> ${bookCount()} of ${bookTotal()} found</li>`);
    $('gpSkills').innerHTML = skills.join('');
    const wk = Object.keys(st.worlds);
    $('gpWorlds').textContent = wk.length ? wk.map((k) => `${WORLDS[k].icon} ${WORLDS[k].name}: ${st.worlds[k]}`).join(' · ') + '. Tell Claude his favourite things and it can add worlds for them.' : 'None yet. He picks a world at the start of each go.';
    $('gpJar').innerHTML = st.jar.length
      ? st.jar.slice().reverse().map((j) => `<li>${esc(j.q)} <span class="small">(${esc(j.at)})</span></li>`).join('')
      : '<li>Empty so far. The jar appears at the end of a go from stage 4.</li>';
    $('gpMissions').textContent = st.missions ? `Done ${st.missions} ${st.missions === 1 ? 'time' : 'times'}${st.lastMission ? ' (last: ' + st.lastMission + ')' : ''}. One star a day.` : `Not done yet. It comes at the end of each go of ${RULES.sitting} puzzles.`;
    $('gpReset').textContent = 'Start again from stage 1';
    $('gpJarClear').textContent = 'Empty the Wonder Jar';
    resetArmed = false; jarArmed = false;
  }
  function updateSoundBtn() {
    const on = voiceOn() || soundsOn();
    $('soundIco').textContent = on ? '🔔' : '🔕';
    $('soundText').textContent = on ? 'Sound on' : 'Sound off';
  }
  function restartPuzzle() {
    if (!T || T.demo || !P || T.phase === 'done') return;
    const k = P.kind;
    if (k === 'wonder' && P.pic) return startPuzzle(wonderPuzzle(P.pic), {});
    if (k === 'box') return startPuzzle(boxPuzzle(P.items), {});
    if (k === 'hide') return startPuzzle(hidePuzzle({ world: P.world, hider: [P.hider.name, P.hider.e, P.a.what.replace(/^=It’s /, ''), P.hider.full, P.hider.snd], places: P.places, at: P.at }), {});
    if (k === 'who') return startPuzzle(whoPuzzle({ ev: P.ev, suspects: P.suspects, at: P.at }), {});
    if (k === 'why') return startPuzzle(whyPuzzle(P.w), {});
  }
  function hideCards() { ['newCard', 'endCard', 'expertCard', 'startCard', 'worldCard'].forEach(hide); clearTimeout(newCardTimer); }
  function measureBar() {
    const h = $('topbar').getBoundingClientRect().bottom;
    document.documentElement.style.setProperty('--bar-h', Math.max(0, Math.round(h)) + 'px');
  }

  /* =====================================================================
     14. WIRING
     ===================================================================== */
  function bind() {
    $('choices').addEventListener('click', (e) => {
      const wb = e.target.closest('.word-btn'); if (wb) return onWord(wb.dataset.word);
      const ob = e.target.closest('.opt-btn'); if (ob) return onOption(Number(ob.dataset.o), ob);
      if (e.target.closest('#nextBtn')) return onNext();
      if (e.target.closest('#turnBtn')) return yourTurn();
    });
    $('askBtn').addEventListener('click', () => ask());
    $('stageWrap').addEventListener('click', (e) => {
      const a = e.target.closest('.actor.tap');
      if (!a || !T) return;
      if (a.dataset.choice != null) return onChoose(Number(a.dataset.choice));
      if (a.dataset.place != null) return onPlace(Number(a.dataset.place));
      if (a.dataset.suspect != null) return onSuspect(Number(a.dataset.suspect));
    });
    $('replayBtn').addEventListener('click', () => { if (P && P.kind === 'why' && T && !T.demo && (T.phase === 'word' || T.phase === 'use')) { stopTalk(); introWhy(gen, true); } });
    $('lineSay').addEventListener('click', () => { const t = $('sceneLine').textContent; if (t) { stopTalk(); talk(t); } });
    $('owlSay').addEventListener('click', () => { if (owl.last) { stopTalk(); owlTalk(owl.last); } });
    $('startBtn').addEventListener('click', () => { hide('startCard'); FXL.sound('magic'); OWL.happy(); nextPuzzle(); });
    $('worlds').addEventListener('click', (e) => { const b = e.target.closest('[data-world]'); if (b) pickWorld(b.dataset.world); });
    $('watchBtn').addEventListener('click', startDemoFromCard);
    $('keepBtn').addEventListener('click', () => { hide('endCard'); stopTalk(); nextPuzzle(); });
    $('expertBtn').addEventListener('click', () => { hide('expertCard'); nextPuzzle(); });
    $('missionBtn').addEventListener('click', onMission);
    $('jarBtn').addEventListener('click', onJar);
    $('jarInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') onJar(); });
    $('bookBtn').addEventListener('click', openBook);
    $('bookClose').addEventListener('click', () => { hide('bookCard'); armIdle(); });
    $('bookCard').addEventListener('click', (e) => { if (e.target === $('bookCard')) { hide('bookCard'); armIdle(); } });
    $('bookTabs').addEventListener('click', (e) => { const b = e.target.closest('[data-tab]'); if (b) { bookTab = b.dataset.tab; renderBook(); } });
    $('bookGrid').addEventListener('click', (e) => {
      const b = e.target.closest('.bcard'); if (!b || b.classList.contains('locked')) return;
      const page = bookPages().find((p) => p.key === bookTab);
      const c = page.cards[Number(b.dataset.card)];
      $('bookFact').textContent = c.e + ' ' + c.name + ' – ' + c.fact;
      stopTalk(); owlTalk(c.name + '. ' + c.fact);
    });
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
      moveToStage(Number(b.dataset.stage));
      sitting = 0; worldPicked = true;
      nextPuzzle();
    });
    $('gpMore').addEventListener('click', () => { setHelp(st.help - 1); saveState(); renderGrownups(); restartPuzzle(); });
    $('gpLess').addEventListener('click', () => { setHelp(st.help + 1); saveState(); renderGrownups(); restartPuzzle(); });
    $('gpShow').addEventListener('click', () => { hide('gpCard'); stopDemo(); hideCards(); worldPicked = true; showNewKind(st.stage, 'again'); });
    $('gpVoice').addEventListener('click', () => { setting('readAloud', !voiceOn()); if (!voiceOn()) stopTalk(); renderGrownups(); updateSoundBtn(); });
    $('gpSounds').addEventListener('click', () => { setting('sounds', !soundsOn()); renderGrownups(); updateSoundBtn(); });
    $('gpReset').addEventListener('click', () => {
      if (!resetArmed) { resetArmed = true; $('gpReset').textContent = 'Tap again to start from stage 1'; return; }
      st.seen = []; st.expert = false; st.expertCount = 0; st.recent = []; st.kindRun = [];
      moveToStage(1);
      hide('gpCard'); stopDemo(); hideCards(); sitting = 0; worldPicked = true;
      nextPuzzle();
    });
    $('gpJarClear').addEventListener('click', () => {
      if (!jarArmed) { jarArmed = true; $('gpJarClear').textContent = 'Tap again to empty the jar'; return; }
      st.jar = []; saveState(); renderGrownups();
    });
    document.addEventListener('keydown', (e) => {
      if (anyCardOpen() || !T || T.demo) return;
      if (e.target && /input|textarea/i.test(e.target.tagName)) return;
      if (e.key === 'Enter' && T.phase === 'word' && T.word) { e.preventDefault(); ask(); }
      else if (e.key === 'Enter' && T.phase === 'done') { e.preventDefault(); onNext(); }
    });
    window.addEventListener('resize', measureBar);
    window.addEventListener('resize', placeLine);
  }

  /* =====================================================================
     15. START
     ===================================================================== */
  function init() {
    FXL.setSoundCheck(soundsOn);
    S = FXL.makeStage($('stage'));
    OWL = FXL.makeOwl($('owlWrap'));
    $('startOwl').innerHTML = FXL.owlSvg();
    loadState();
    updateTop();
    updateSoundBtn();
    bind();
    measureBar();
    setTimeout(measureBar, 400);
    // Something calm behind the Start card
    S.setBg('boxes');
    S.add('g', { shape: 'gift', html: giftHtml(BOX_COLOURS[0]), x: 50, y: 62 });
    owl('Hello! I’m Ollie. Ask me questions to find things out!');
    show('startCard');
  }

  /* For the automatic tests */
  window.askGame = {
    get state() { return st; }, get P() { return P; }, get T() { return T; }, get S() { return S; },
    RULES, STAGES, C, makePuzzle, startPuzzle, nextPuzzle, moveToStage, levelResult, runDemo, showEnd, boxPuzzle, hidePuzzle, whoPuzzle, whyPuzzle, wonderPuzzle,
    playItem, bookCount, bookTotal,
    set fast(v) { FAST = !!v; FXL.setSpeed(v ? 0.02 : 1); }, get fast() { return FAST; },
    get sitting() { return sitting; }, set sitting(v) { sitting = v; },
    set worldPicked(v) { worldPicked = !!v; }
  };

  init();
})();
