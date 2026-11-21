/* Crayon letters – one engine for every crayon book in School Work (added 21 Nov 2026).
   Each book is its own page with its own data file (window.CRAYON_BOOK, e.g. crayons/quit.js), its own
   saved progress and its own tile, so the books never mix. To add another crayon book: copy one of the
   two pages, point it at a new data file in the same format, and add one line to list.txt.

   How it plays: Start card -> (first visit) New kind card and a Watch-me demo -> the crayon box with a
   card for each letter -> a letter on the left, one question at a time on the right. Wrong: the choice
   greys out and a tip shows (the book's own hint, or the line of the letter to look at); a second
   wrong answer shows the right one. One Stars.win / Stars.miss per question (id = section.part.number,
   so each pays once a day). End of a letter: Stars.done() and the end card. Grown-ups panel: where he
   is, right first time, the report for school (prints), redo a letter, demo, sounds, read aloud. */
(function () {
  'use strict';

  var BOOK = window.CRAYON_BOOK;
  if (!BOOK) return;

  /* ---------- Rules ---------- */
  var RULES = {
    missLockMs: 700,      // taps ignored after a wrong answer, so tapping everything doesn't work
    autoNextMs: 2200,     // after a right answer, moves on by itself (Next can be tapped sooner)
    idleHintMs: 12000,    // nothing tapped for this long: the question and letter glow (and the question is said again if read-aloud is on)
    newKindMs: 4200,      // shortest time the "New kind of puzzle" card stays before the demo starts
    recentKept: 40,       // answers kept for "right first time in the last 10"
    fontMin: 0.95, fontMax: 1.6, fontStep: 0.1
  };

  var KitX = window.Kit || { soundsOn: function () { return true; }, setting: function () { return undefined; } };
  var SECS = BOOK.sections;
  var LETTERS = SECS.filter(function (s) { return s.kind === 'letter'; });
  var DEMO_SEC = Math.max(0, SECS.indexOf(LETTERS[0]));

  SECS.forEach(function (s, si) {
    s.items = [];
    s.parts.forEach(function (p, pi) {
      p.questions.forEach(function (q, qi) {
        s.items.push({ s: s, si: si, p: p, pi: pi, q: q, qi: qi, id: s.id + '.' + p.key + '.' + qi });
      });
    });
  });

  /* ---------- Saved progress (stars.js keeps it; nothing else is stored) ---------- */
  function blank() { return { v: 1, ans: {}, recent: [], seen: false, expert: false, font: 1.12, last: null, justDone: null }; }
  var P = blank();
  try {
    var saved = window.Stars && Stars.load();
    if (saved && typeof saved === 'object') P = Object.assign(blank(), saved);
  } catch (e) { P = blank(); }
  if (!P.ans || typeof P.ans !== 'object') P.ans = {};
  if (!Array.isArray(P.recent)) P.recent = [];

  function lettersRead() { return LETTERS.filter(isDone).length; }
  function label() {
    if (SECS.every(isDone)) return 'All letters read 🏆';
    return lettersRead() + ' of ' + LETTERS.length + ' letters read';
  }
  function saveP() {
    try { Stars.save(Object.assign({}, P, { level: lettersRead(), label: label() })); } catch (e) {}
  }

  function answered(s) { return s.items.filter(function (it) { return P.ans[it.id]; }).length; }
  function isDone(s) { return answered(s) === s.items.length; }
  function stateOf(s) { var a = answered(s); return a === s.items.length ? 'done' : (a ? 'going' : 'new'); }
  function firstOpen(s) {
    for (var k = 0; k < s.items.length; k++) if (!P.ans[s.items[k].id]) return k;
    return -1;
  }
  function nextOpenIndex(from) {
    for (var n = 1; n <= SECS.length; n++) {
      var i = (from + n + SECS.length) % SECS.length;
      if (from < 0) i = n - 1;
      if (!isDone(SECS[i])) return i;
    }
    return -1;
  }
  function doneName(s) { return s.doneName || (s.name + "'s letter"); }

  /* ---------- Small helpers ---------- */
  function $(id) { return document.getElementById(id); }
  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function lum(hex) {
    var m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
    if (!m) return 1;
    var n = parseInt(m[1], 16);
    return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  }
  function accentOf(s) { return s.white ? '#94a3b8' : s.color; }
  function colourVars(s) { return '--accent:' + accentOf(s) + ';--ink-c:' + (s.ink || '#1b4332'); }
  function setColours(node, s) { node.style.setProperty('--accent', accentOf(s)); node.style.setProperty('--ink-c', s.ink || '#1b4332'); }
  function picUrl(file) { return (BOOK.pictureFolder || '') + file; }
  function isPic(q) {
    return /\b(picture|illustration|photo)\b/i.test(q.q) || /zoom picture|illustration|the picture/i.test(q.hint || '');
  }
  function fill(t, q) {
    return String(t || '')
      .replace('{hint}', q.hint || 'Look back at the letter.')
      .replace('{answer}', q.options[q.correct]);
  }
  function readAloudOn() { return KitX.setting('readAloud') === true; }

  /* ---------- Drawings ---------- */
  function crayonSvg(s, label) {
    var c = s.color, line = s.white ? '#334155' : 'rgba(0,0,0,0.22)', sw = s.white ? 1.6 : 1;
    var face = lum(c) < 0.36 ? '#ffffff' : '#1f2937';
    return '<svg viewBox="0 0 40 124" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + esc(label || s.name) + '">' +
      '<path d="M12.5 30 L18.6 7.5 Q20 3.5 21.4 7.5 L27.5 30 Z" fill="' + c + '" stroke="' + line + '" stroke-width="' + sw + '" stroke-linejoin="round"/>' +
      '<path d="M20 5 L27.5 30 L20 30 Z" fill="#000" opacity="0.1"/>' +
      '<rect x="8" y="29" width="24" height="91" rx="5" fill="' + c + '" stroke="' + line + '" stroke-width="' + sw + '"/>' +
      '<rect x="8" y="38" width="24" height="4" fill="#000" opacity="0.16"/>' +
      '<rect x="8" y="106" width="24" height="4" fill="#000" opacity="0.16"/>' +
      '<rect x="11.5" y="33" width="3.2" height="83" rx="1.6" fill="#fff" opacity="0.3"/>' +
      '<circle cx="16.3" cy="66" r="1.9" fill="' + face + '"/><circle cx="23.7" cy="66" r="1.9" fill="' + face + '"/>' +
      '<path d="M16.2 72.2 Q20 75.8 23.8 72.2" fill="none" stroke="' + face + '" stroke-width="1.7" stroke-linecap="round"/>' +
      '</svg>';
  }
  function art(s, big) {
    if (s.emoji) return '<span class="cl-emoji" aria-hidden="true">' + s.emoji + '</span>';
    return crayonSvg(s);
  }
  // The crayon box: a crayon stands in it for every letter read.
  function boxSvg(dropId) {
    var n = LETTERS.length, w = n * 26 + 30, h = 86, out = '';
    out += '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Crayon box: ' + lettersRead() + ' of ' + n + ' crayons back">';
    out += '<rect x="2" y="38" width="' + (w - 4) + '" height="10" rx="4" fill="#1b4332" opacity="0.55"/>';
    LETTERS.forEach(function (s, i) {
      if (!isDone(s)) return;
      var line = s.white ? '#334155' : 'rgba(0,0,0,0.25)';
      out += '<g transform="translate(' + (16 + i * 26) + ',2)"><g class="' + (s.id === dropId ? 'cl-slot-new' : '') + '">' +
        '<path d="M4 22 L10.2 4 Q12 0.5 13.8 4 L20 22 Z" fill="' + s.color + '" stroke="' + line + '"/>' +
        '<rect x="2" y="21" width="20" height="52" rx="3" fill="' + s.color + '" stroke="' + line + '"/>' +
        '<rect x="2" y="28" width="20" height="3" fill="#000" opacity="0.16"/></g></g>';
    });
    out += '<rect x="0" y="42" width="' + w + '" height="' + (h - 42) + '" rx="12" fill="#2d6a4f"/>';
    out += '<rect x="14" y="54" width="' + (w - 28) + '" height="22" rx="11" fill="#fff6d6"/>';
    out += '<text x="' + (w / 2) + '" y="69.5" text-anchor="middle" font-family="Quicksand, system-ui, sans-serif" font-size="13" font-weight="700" fill="#6b4a00" letter-spacing="2">CRAYONS</text>';
    return out + '</svg>';
  }

  /* ---------- Voice ---------- */
  var voice = null, talking = null, talkKind = '';
  function pickVoice() {
    if (!('speechSynthesis' in window)) return;
    var v = window.speechSynthesis.getVoices() || [];
    voice = v.find(function (x) { return /en-GB/i.test(x.lang) && /female|libby|sonia|hazel|serena|google uk english female/i.test(x.name); }) ||
      v.find(function (x) { return /en-GB/i.test(x.lang); }) || v.find(function (x) { return /^en/i.test(x.lang); }) || null;
  }
  if ('speechSynthesis' in window) {
    pickVoice();
    try { window.speechSynthesis.addEventListener('voiceschanged', pickVoice); } catch (e) {}
  }
  function speak(text, opts) {
    opts = opts || {};
    if (!('speechSynthesis' in window) || !text) { if (opts.onend) setTimeout(opts.onend, 0); return false; }
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(String(text));
      if (voice) u.voice = voice;
      u.lang = (voice && voice.lang) || 'en-GB';
      u.rate = 0.9;
      var fin = false;
      u.onend = u.onerror = function () {
        if (fin) return;
        fin = true;
        if (talking === u) { talking = null; talkKind = ''; }
        if (opts.onend) opts.onend();
      };
      if (opts.onword) u.onboundary = function (e) { if (!e.name || e.name === 'word') opts.onword(e.charIndex); };
      talking = u;
      talkKind = opts.kind || '';
      window.speechSynthesis.speak(u);
      return true;
    } catch (e) { if (opts.onend) setTimeout(opts.onend, 0); return false; }
  }
  function hush() { try { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); } catch (e) {} }

  /* ---------- Soft sounds (follow the hub's shared sounds setting) ---------- */
  var actx = null;
  function tone(f, t0, len, vol) {
    var o = actx.createOscillator(), g = actx.createGain();
    o.type = 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, actx.currentTime + t0);
    g.gain.exponentialRampToValueAtTime(vol, actx.currentTime + t0 + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + t0 + len);
    o.connect(g); g.connect(actx.destination);
    o.start(actx.currentTime + t0); o.stop(actx.currentTime + t0 + len + 0.05);
  }
  function wakeAudio() {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume();
    } catch (e) { actx = null; }
  }
  function sound(kind) {
    if (!KitX.soundsOn()) return;
    wakeAudio();
    if (!actx) return;
    try {
      if (kind === 'miss') { tone(392, 0, 0.22, 0.05); tone(330, 0.13, 0.3, 0.05); }
      else if (kind === 'good') { tone(523.25, 0, 0.25, 0.06); tone(659.25, 0.12, 0.35, 0.06); }
    } catch (e) {}
  }

  /* ---------- The page skeleton ---------- */
  var app = document.getElementById('app') || document.body.appendChild(document.createElement('div'));
  app.className = 'cl';
  app.innerHTML =
    '<div class="cl-screen" id="clHome"></div>' +
    '<div class="cl-screen" id="clRead"><div class="cl-read">' +
      '<div class="cl-readbar"><button class="cl-back" data-act="home">← All letters</button>' +
        '<div class="cl-where" id="clWhere"></div>' +
        '<button class="cl-grown" data-act="grown" aria-label="For grown-ups">👪</button></div>' +
      '<div class="cl-cols">' +
        '<section class="cl-card letter" id="clLetterCard" aria-label="The letter">' +
          '<div class="cl-lhead"><div class="cl-lname" id="clLName"></div><div class="cl-tools" id="clTools"></div></div>' +
          '<div class="cl-lbody" id="clLBody"></div></section>' +
        '<section class="cl-card quiz" id="clQuizCard" aria-label="The question">' +
          '<div class="cl-qhead" id="clQHead"></div><div class="cl-qbody" id="clQBody" aria-live="polite"></div></section>' +
      '</div></div></div>' +
    '<div class="cl-ov" id="clBigWrap"><div class="cl-big" id="clBig" role="dialog" aria-modal="true"></div></div>' +
    '<div class="cl-ov cl-zoom" id="clZoom" data-act="unzoom" role="dialog" aria-label="Picture"></div>' +
    '<div class="cl-ov cl-panel-wrap" id="clPanelWrap" data-act="pclose"><div class="cl-panel" id="clPanel" role="dialog" aria-label="For grown-ups"></div></div>' +
    '<div class="cl-block" id="clBlock"></div>' +
    '<div class="cl-banner" id="clBanner" role="status" aria-live="polite"></div>' +
    '<div class="cl-finger" id="clFinger" aria-hidden="true"></div>';
  var printBox = document.createElement('div');
  printBox.id = 'cl-print';
  document.body.appendChild(printBox);

  var screen = 'start', cur = -1, view = 'letter', Q = null, tokens = [], reading = false;
  var idleT = 0, autoT = 0, lookT = 0, demoOn = false, demoTok = 0, demoBack = null;

  function show(which) {
    screen = which;
    $('clHome').classList.toggle('on', which === 'home');
    $('clRead').classList.toggle('on', which === 'read');
  }
  function clearTimers() { clearTimeout(idleT); clearTimeout(autoT); clearTimeout(lookT); }
  function overlayOpen() {
    return $('clBigWrap').classList.contains('on') || $('clZoom').classList.contains('on') || $('clPanelWrap').classList.contains('on');
  }

  /* ---------- Big cards ---------- */
  var bigActs = [];
  function showBig(o) {
    bigActs = (o.buttons || []).map(function (b) { return b[2]; });
    $('clBig').innerHTML =
      (o.art ? '<div class="cl-big-art' + (o.row ? ' row' : '') + '">' + o.art + '</div>' : '') +
      (o.badge ? '<div class="cl-badge">' + esc(o.badge) + '</div>' : '') +
      '<h2>' + esc(o.title) + '</h2>' +
      (o.text ? '<p>' + esc(o.text) + '</p>' : '') +
      (o.small ? '<p>' + esc(o.small) + '</p>' : '') +
      ((o.buttons || []).length ? '<div class="cl-row">' + o.buttons.map(function (b, i) {
        return '<button class="' + (b[1] === 'primary' ? 'btn-primary' : 'btn-secondary') + '" data-big="' + i + '">' + esc(b[0]) + '</button>';
      }).join('') + '</div>' : '');
    $('clBigWrap').classList.add('on');
    var first = $('clBig').querySelector('[data-big]');
    if (first) setTimeout(function () { try { first.focus({ preventScroll: true }); } catch (e) {} }, 50);
  }
  function hideBig() { $('clBigWrap').classList.remove('on'); }

  /* ---------- Start ---------- */
  function startCard() {
    show('home');
    renderHome();
    showBig({
      art: LETTERS.slice(0, 7).map(function (s) { return crayonSvg(s); }).join(''), row: true,
      title: BOOK.title,
      text: BOOK.say.lead,
      buttons: [['Start', 'primary', start]]
    });
  }
  function start() {
    wakeAudio();
    pickVoice();
    hideBig();
    if (!P.seen) newKind(null);
    else goHome();
  }
  function newKind(back) {
    showBig({
      badge: '✨ New kind of puzzle!',
      title: 'Crayon letters',
      text: "Read a crayon's letter, then answer questions about it.",
      small: 'Watch me do the first one.'
    });
    var t0 = Date.now(), tok = ++demoTok, once = false;
    var go = function () {
      if (once || tok !== demoTok) return;
      once = true;
      setTimeout(function () { if (tok === demoTok) runDemo(back); }, Math.max(600, RULES.newKindMs - (Date.now() - t0)));
    };
    if (KitX.soundsOn()) speak("New kind of puzzle! Crayon letters. Read a crayon's letter, then answer questions about it. Watch me do the first one.", { kind: 'demo', onend: go });
    else go();
    setTimeout(go, 11000);   // in case the voice never says it has finished
  }

  /* ---------- Home: the crayon box and a card for every letter ---------- */
  function renderHome() {
    var n = lettersRead(), next = nextOpenIndex(-1), drop = P.justDone;
    var note = n === 0 ? 'Pick a letter to start.' : (next < 0 ? 'Every letter read! 🏆' : 'Pick the next letter, or any letter you like.');
    $('clHome').innerHTML =
      '<div class="cl-home">' +
        '<div class="cl-head"><div class="cl-head-text"><h1 class="cl-title">' + esc(BOOK.title) + '</h1>' +
          '<p class="cl-lead">' + esc(BOOK.say.lead) + '</p></div>' +
          '<button class="cl-grown" data-act="grown" aria-label="For grown-ups">👪</button></div>' +
        '<div class="cl-box">' + boxSvg(drop) + '<div class="cl-box-line">' + n + ' of ' + LETTERS.length + ' letters read<small>' + esc(note) + '</small></div></div>' +
        '<div class="cl-grid">' + SECS.map(function (s, i) {
          var st = stateOf(s);
          return '<button class="cl-pick is-' + st + (i === next ? ' is-next' : '') + '" data-open="' + i + '" style="' + colourVars(s) + '">' +
            art(s) + '<span class="nm">' + esc(s.card || s.name) + '</span>' +
            '<span class="st">' + { 'new': 'New', going: 'Carry on', done: '✓ Done' }[st] + '</span></button>';
        }).join('') + '</div>' +
      '</div>';
    if (drop) { P.justDone = null; saveP(); }
  }
  function goHome() {
    stopEverything();
    show('home');
    renderHome();
    window.scrollTo(0, 0);
  }
  function stopEverything() {
    clearTimers();
    hush();
    reading = false;
    Q = null;
  }

  /* ---------- Reading a letter ---------- */
  function openSection(i) {
    stopEverything();
    cur = i;
    var s = SECS[i];
    show('read');
    setColours($('clRead'), s);
    $('clLName').innerHTML = (s.emoji ? '<span class="cl-emoji" aria-hidden="true">' + s.emoji + '</span>' : crayonSvg(s)) +
      '<div><h2>' + esc(s.heading || s.name) + '</h2>' + (s.friend ? '<span class="fr">' + esc(s.friend) + '</span>' : '') + '</div>';
    $('clTools').innerHTML =
      (s.pictures ? '<button class="cl-tool" data-act="vletter" aria-pressed="true">✉️ <span class="t">Letter</span></button>' +
        '<button class="cl-tool" data-act="vpic" aria-pressed="false">🖼️ <span class="t">Picture</span></button>' : '') +
      '<button class="cl-tool" data-act="read" id="clReadBtn">🔊 <span class="t">Read it to me</span></button>' +
      '<button class="cl-tool" data-act="smaller" aria-label="Smaller writing">A−</button>' +
      '<button class="cl-tool" data-act="bigger" aria-label="Bigger writing">A+</button>';
    view = 'letter';
    renderLetterBody();
    window.scrollTo(0, 0);
    showQuestion();
  }

  function renderLetterBody() {
    var s = SECS[cur];
    tokens = [];
    if (view === 'pic' && s.pictures) {
      $('clLBody').classList.add('pic');
      $('clLBody').innerHTML = '<div class="cl-pics' + (s.pictures.length > 1 ? ' two' : '') + '">' +
        s.pictures.map(function (f, i) {
          return '<img src="' + esc(picUrl(f)) + '" alt="' + esc((s.heading || s.name) + ' – picture' + (s.pictures.length > 1 ? ' ' + (i + 1) : '')) + '" data-act="zoom">';
        }).join('') +
        '<button class="cl-zoompill" data-act="zoom">🔍 Bigger</button></div>';
    } else {
      $('clLBody').classList.remove('pic');
      var off = 0, html = '';
      s.letter.split('\n').forEach(function (ln, li) {
        if (!ln.trim()) { html += '<span class="cl-gap"></span>'; off += ln.length + 1; return; }
        html += '<span class="cl-line" data-l="' + li + '" data-o="' + off + '">';
        ln.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { html += part; off += part.length; return; }
          tokens.push({ s: off, e: off + part.length });
          html += '<span class="cl-w" data-i="' + (tokens.length - 1) + '">' + esc(part) + '</span>';
          off += part.length;
        });
        html += '</span>';
        off += 1;
      });
      $('clLBody').innerHTML = '<div class="cl-paper' + (s.dark ? ' dark' : '') + '" style="--fs:' + P.font + 'rem">' + html + '</div>';
    }
    $('clTools').querySelectorAll('[data-act="vletter"],[data-act="vpic"]').forEach(function (b) {
      b.setAttribute('aria-pressed', String((b.getAttribute('data-act') === 'vpic') === (view === 'pic')));
    });
  }
  function setView(v) {
    if (!SECS[cur].pictures) v = 'letter';
    if (v === view) return;
    view = v;
    renderLetterBody();
  }
  function markWord(i) {
    var old = $('clLBody').querySelector('.cl-w.on');
    if (old) old.classList.remove('on');
    if (i == null || i < 0) return;
    var w = $('clLBody').querySelector('.cl-w[data-i="' + i + '"]');
    if (w) w.classList.add('on');
  }
  function tokenAt(ci) {
    for (var i = 0; i < tokens.length; i++) if (ci < tokens[i].e) return ci >= tokens[i].s - 1 ? i : -1;
    return -1;
  }
  function setReading(on) {
    reading = on;
    var b = $('clReadBtn');
    if (!b) return;
    b.classList.toggle('reading', on);
    b.innerHTML = on ? '⏹ <span class="t">Stop</span>' : '🔊 <span class="t">Read it to me</span>';
  }
  function readLetter() {
    if (reading) { hush(); return; }
    var s = SECS[cur];
    setReading(true);
    speak(s.letter, {
      kind: 'letter',
      onword: function (ci) { markWord(tokenAt(ci)); },
      onend: function () { markWord(-1); setReading(false); }
    });
  }
  function readLine(lineEl) {
    var start = Number(lineEl.getAttribute('data-o')) || 0;
    setReading(false);
    speak(lineEl.textContent, {
      kind: 'line',
      onword: function (ci) { markWord(tokenAt(start + ci)); },
      onend: function () { markWord(-1); }
    });
  }

  // After a wrong answer: light up the line of the letter the answer comes from, when it can be found surely.
  var STOP = {};
  ('the and for with are was were been his her she its they them their this that these those you your not yes does did from but ' +
    'than very all any some just only also too can could would should will what which who whom why how when where because about ' +
    'into out over under again more most less much many one two has have had him our off get got').split(' ').forEach(function (w) { STOP[w] = 1; });
  function words(t) {
    return (String(t).toLowerCase().match(/[a-z']+/g) || []).map(function (w) { return w.replace(/'s$/, '').replace(/'/g, ''); })
      .filter(function (w) { return w.length >= 3 && !STOP[w]; }).map(function (w) { return w.slice(0, 5); });
  }
  function findLine(s, answer) {
    var want = words(answer).filter(function (w, i, a) { return a.indexOf(w) === i; });
    if (!want.length) return -1;
    var best = -1, bestScore = 0, tie = false;
    s.letter.split('\n').forEach(function (ln, li) {
      if (!ln.trim()) return;
      var have = words(ln), sc = 0;
      want.forEach(function (w) { if (have.indexOf(w) >= 0) sc++; });
      if (sc > bestScore) { bestScore = sc; best = li; tie = false; } else if (sc && sc === bestScore) tie = true;
    });
    var need = want.length <= 2 ? 1 : 2;
    return bestScore >= need && !tie ? best : -1;
  }
  function lookLine(q) {
    if (view !== 'letter') return;
    var li = findLine(SECS[cur], q.options[q.correct]);
    if (li < 0) return;
    var el = $('clLBody').querySelector('.cl-line[data-l="' + li + '"]');
    if (!el) return;
    el.classList.add('look');
    try { el.scrollIntoView({ block: 'nearest' }); } catch (e) {}
  }
  function clearLook() {
    $('clLBody').querySelectorAll('.cl-line.look').forEach(function (el) { el.classList.remove('look'); });
  }

  /* ---------- One question at a time ---------- */
  function renderQHead(k, demo) {
    var s = SECS[cur], it = s.items[k];
    var chip = demo ? '👀 Watch me' :
      (s.parts.length > 1 ? 'Part ' + (it.pi + 1) + ' of ' + s.parts.length + ' · ' : '') + it.p.title;
    var dots = demo ? '' : s.items.map(function (x, i) {
      return '<span class="cl-dot' + (i && x.pi !== s.items[i - 1].pi ? ' gap' : '') + (P.ans[x.id] ? ' done' : '') + (i === k ? ' now' : '') + '"></span>';
    }).join('');
    $('clQHead').innerHTML = '<span class="cl-part">' + esc(chip) + '</span>' + (dots ? '<div class="cl-dots" aria-hidden="true">' + dots + '</div>' : '');
    $('clWhere').textContent = demo ? '' : (s.heading || s.name) + ' – question ' + (k + 1) + ' of ' + s.items.length;
  }
  function questionHtml(q, order, intro) {
    return (intro ? '<p class="cl-intro">' + esc(intro) + '</p>' : '') +
      '<div class="cl-q" id="clQ"><span>' + esc(q.q) + '</span>' +
        '<button class="cl-say" data-act="sayq" aria-label="Read the question out loud">🔊</button></div>' +
      '<div class="cl-opts" id="clOpts">' + order.map(function (oi, n) {
        return '<button class="cl-opt" data-opt="' + oi + '"><span class="k">' + (n + 1) + '</span><span>' + esc(q.options[oi]) + '</span></button>';
      }).join('') + '</div>' +
      '<div id="clHelp"></div>' +
      '<div class="cl-next-row" id="clNextRow" hidden><button class="btn-primary" data-act="next">Next ➜</button></div>';
  }
  function showQuestion() {
    clearTimers();
    var s = SECS[cur], k = firstOpen(s);
    if (k < 0) { showAllDone(); return; }
    var it = s.items[k], q = it.q;
    Q = { k: k, it: it, tries: 0, wrongs: [], answered: false, lockUntil: 0,
      order: shuffle(q.options.map(function (_, i) { return i; })) };
    renderQHead(k);
    $('clQBody').innerHTML = questionHtml(q, Q.order, it.p.intro);
    if (s.pictures) setView(isPic(q) ? 'pic' : 'letter');
    clearLook();
    if (readAloudOn()) sayQuestion();
    armIdle();
    if (window.matchMedia && window.matchMedia('(max-width: 759px)').matches) {
      var card = $('clQuizCard'), r = card.getBoundingClientRect();
      if (r.top > window.innerHeight * 0.7 || r.top < 56) window.scrollTo(0, window.scrollY + r.top - 64);
    }
  }
  function sayQuestion() {
    if (!Q) return;
    var q = Q.it.q;
    speak(q.q + ' ' + Q.order.map(function (oi, n) { return (n + 1) + '. ' + q.options[oi] + '.'; }).join(' '), { kind: 'q' });
  }
  function optButton(oi) { return $('clOpts') && $('clOpts').querySelector('[data-opt="' + oi + '"]'); }
  function help(text, kind, clue) {
    $('clHelp').innerHTML = '<div class="cl-help' + (kind ? ' ' + kind : '') + '">' + esc(text) +
      (clue ? '<span class="clue">' + esc(clue) + '</span>' : '') + '</div>';
  }
  function lockAll() { $('clOpts').querySelectorAll('.cl-opt').forEach(function (b) { b.disabled = true; }); }

  function choose(oi) {
    if (!Q || Q.answered || demoOn || Date.now() < Q.lockUntil) return;
    if (Q.wrongs.indexOf(oi) >= 0) return;
    clearTimeout(idleT);
    var it = Q.it, q = it.q, s = SECS[cur], btn = optButton(oi);
    if (oi === q.correct) {
      Q.answered = true;
      var first = Q.tries === 0;
      if (first) Stars.win(it.p.skill, it.id);
      else sound('good');
      btn.classList.add('right');
      lockAll();
      help(q.yes || (first ? BOOK.say.right : fill(BOOK.say.second, q)), 'good');
      record(it, first ? 'f' : 's');
      showNext(true);
      return;
    }
    if (Q.tries === 0) Stars.miss(it.p.skill, it.id);
    Q.tries++;
    Q.wrongs.push(oi);
    btn.classList.add('off', 'wobble');
    btn.disabled = true;
    sound('miss');
    Q.lockUntil = Date.now() + RULES.missLockMs;
    var left = q.options.map(function (_, i) { return i; }).filter(function (i) { return Q.wrongs.indexOf(i) < 0; });
    if (left.length <= 1) {
      Q.answered = true;
      var rb = optButton(q.correct);
      rb.classList.add('right', 'glow');
      lockAll();
      help(fill(BOOK.say.shown, q), '');
      record(it, 'm');
      showNext(false);
      return;
    }
    var pic = isPic(q) && s.pictures;
    help(q.no || fill(BOOK.say.wrong, q), '', pic && s.clue ? s.clue : '');
    if (pic) setView('pic'); else lookLine(q);
    armIdle();
  }
  function record(it, o) {
    P.ans[it.id] = { o: o, w: Q.wrongs.slice() };
    P.recent.push({ id: it.id, f: o === 'f' ? 1 : 0 });
    if (P.recent.length > RULES.recentKept) P.recent = P.recent.slice(-RULES.recentKept);
    P.last = it.s.id;
    saveP();
    renderQHead(Q.k);
  }
  function showNext(auto) {
    var s = SECS[cur], last = firstOpen(s) < 0;
    var row = $('clNextRow');
    row.querySelector('button').textContent = last ? 'Finish ➜' : 'Next ➜';
    row.hidden = false;
    if (auto) autoT = setTimeout(goNext, RULES.autoNextMs);
  }
  function goNext() {
    clearTimers();
    if (talkKind === 'q') hush();
    var s = SECS[cur];
    if (firstOpen(s) >= 0) showQuestion();
    else finishSection();
  }
  function armIdle() {
    clearTimeout(idleT);
    idleT = setTimeout(function () {
      if (!Q || Q.answered || demoOn || overlayOpen() || screen !== 'read') return;
      var qEl = $('clQ'), card = $('clLetterCard');
      if (qEl) qEl.classList.add('look');
      card.classList.add('look');
      lookT = setTimeout(function () { if (qEl) qEl.classList.remove('look'); card.classList.remove('look'); }, 3000);
      if (readAloudOn() && !reading) sayQuestion();
    }, RULES.idleHintMs);
  }

  function showAllDone() {
    var s = SECS[cur], next = nextOpenIndex(cur);
    Q = null;
    $('clQHead').innerHTML = '<span class="cl-part">✓ All done</span><div class="cl-dots" aria-hidden="true">' +
      s.items.map(function (x, i) { return '<span class="cl-dot done' + (i && x.pi !== s.items[i - 1].pi ? ' gap' : '') + '"></span>'; }).join('') + '</div>';
    $('clWhere').textContent = (s.heading || s.name) + ' – all done';
    $('clQBody').innerHTML = '<div class="cl-alldone">' + '<div class="cl-big-art">' + art(s) + '</div>' +
      '<h3>All done! ✓</h3><p>You have answered all ' + s.items.length + ' questions about ' + esc(doneName(s)) + '.</p>' +
      '<div class="cl-row"><button class="btn-secondary" data-act="redo">↺ Answer them again</button>' +
      (next >= 0 ? '<button class="btn-primary" data-act="open" data-i="' + next + '">Next: ' + esc(SECS[next].card || SECS[next].name) + ' ➜</button>'
        : '<button class="btn-primary" data-act="home">🖍️ All letters</button>') + '</div></div>';
  }
  function redoSection(s) {
    s.items.forEach(function (it) { delete P.ans[it.id]; });
    saveP();
  }

  function finishSection() {
    var s = SECS[cur];
    Q = null;
    try { Stars.done(); } catch (e) {}
    P.justDone = s.id;
    saveP();
    var allNow = SECS.every(isDone);
    showBig({
      art: art(s, true),
      title: "That's " + doneName(s) + ' done! 🎉',
      text: 'Have a rest, or keep going.',
      buttons: [['Keep going ➜', 'primary', function () {
        hideBig();
        if (allNow && !P.expert) {
          P.expert = true;
          saveP();
          showBig({
            art: LETTERS.slice(0, 7).map(function (x) { return crayonSvg(x); }).join(''), row: true,
            title: 'Crayon letters expert! 🏆',
            text: "You've read every letter in " + BOOK.title + ' and answered all the questions.',
            buttons: [['Keep going ➜', 'primary', function () { hideBig(); goHome(); }]]
          });
          return;
        }
        var n = nextOpenIndex(cur);
        if (n >= 0) openSection(n); else goHome();
      }], ['🖍️ All letters', 'secondary', function () { hideBig(); goHome(); }]]
    });
  }

  /* ---------- Watch-me demo ---------- */
  var DEMO_Q = { q: 'Who is this letter to?', options: ["Duncan's sister", 'Duncan', 'The teacher'], correct: 1 };
  function banner(kind, title, small, button) {
    var b = $('clBanner');
    if (!kind) { b.className = 'cl-banner'; b.innerHTML = ''; return; }
    b.className = 'cl-banner on ' + kind;
    b.innerHTML = esc(title) + (small ? '<small>' + esc(small) + '</small>' : '') +
      (button ? '<button class="btn-primary" data-act="turn">' + esc(button) + '</button>' : '');
  }
  function fingerTo(el, tok) {
    var f = $('clFinger');
    if (!el || tok !== demoTok) return wait(0);
    var r = el.getBoundingClientRect();
    if (!f.classList.contains('on')) {
      f.style.transition = 'none';
      f.style.transform = 'translate(' + (window.innerWidth / 2) + 'px,' + (window.innerHeight - 40) + 'px)';
      f.classList.add('on');
      void f.offsetWidth;
      f.style.transition = '';
    }
    f.style.transform = 'translate(' + Math.round(r.left + Math.min(r.width / 2, 120)) + 'px,' + Math.round(r.top + r.height / 2) + 'px)';
    return wait(850);
  }
  function sayStep(text, tok) {
    return new Promise(function (res) {
      if (tok !== demoTok) { res(); return; }
      var done = false, finish = function () { if (!done) { done = true; res(); } };
      var spare = Math.max(1600, text.length * 65), least = Math.max(1400, text.length * 45), t0 = Date.now();
      // Wait for the voice, but never less than reading time (some devices have no voice and "finish" at once).
      var ended = function () { setTimeout(finish, Math.max(350, least - (Date.now() - t0))); };
      if (KitX.soundsOn() && speak(text, { kind: 'demo', onend: ended })) setTimeout(finish, spare + 6000);
      else setTimeout(finish, spare);
    });
  }
  function runDemo(back) {
    var tok = ++demoTok;
    demoOn = true;
    demoBack = back;
    hideBig();
    $('clBlock').classList.add('on');
    openSection(DEMO_SEC);
    clearTimers();
    Q = null;
    setView('letter');
    renderQHead(0, true);
    $('clQBody').innerHTML = questionHtml(DEMO_Q, [0, 1, 2], '');
    banner('watch', '👀 Watch me – this is a demo', "You don't need to press anything yet");
    var s = SECS[DEMO_SEC];
    var firstLine = s.letter.split('\n').filter(function (l) { return l.trim(); })[0] || '';
    var step = function (t) { help(t, ''); };
    (async function () {
      await wait(700);
      await fingerTo($('clQ').firstChild, tok);
      step('First I read the question: Who is this letter to?');
      await sayStep('First I read the question. Who is this letter to?', tok);
      var lineEl = $('clLBody').querySelector('.cl-line');
      await fingerTo(lineEl, tok);
      if (tok !== demoTok) return;
      if (lineEl) lineEl.classList.add('look');
      step('Then I look back at the letter. It starts: "' + firstLine + '"');
      await sayStep('Then I look back at the letter. It starts, ' + firstLine, tok);
      var btn = optButton(1);
      await fingerTo(btn, tok);
      if (tok !== demoTok) return;
      $('clFinger').classList.add('press');
      await wait(220);
      $('clFinger').classList.remove('press');
      btn.classList.add('right');
      lockAll();
      help('So the letter is to Duncan!', 'good');
      await sayStep('So the letter is to Duncan!', tok);
      if (tok !== demoTok) return;
      $('clFinger').classList.remove('on');
      banner('turn', "That's how you do it. Now it's your turn!", '', 'Your turn →');
      var tb = $('clBanner').querySelector('button');
      if (tb) try { tb.focus({ preventScroll: true }); } catch (e) {}
    })();
  }
  function yourTurn() {
    demoTok++;
    demoOn = false;
    banner('');
    $('clFinger').classList.remove('on');
    $('clBlock').classList.remove('on');
    hush();
    var firstTime = !P.seen;
    P.seen = true;
    saveP();
    if (firstTime) openSection(0);
    else if (demoBack != null && demoBack >= 0) openSection(demoBack);
    else goHome();
  }

  /* ---------- Picture made bigger ---------- */
  function zoom() {
    var s = SECS[cur];
    if (!s || !s.pictures) return;
    var z = $('clZoom');
    z.classList.toggle('two', s.pictures.length > 1);
    z.innerHTML = '<div class="cl-zoom-row">' + s.pictures.map(function (f) {
      return '<img src="' + esc(picUrl(f)) + '" alt="' + esc((s.heading || s.name) + ' – big picture') + '">';
    }).join('') + '</div><button class="btn-secondary" data-act="unzoom">✕ Close</button>';
    z.classList.add('on');
  }

  /* ---------- Grown-ups panel ---------- */
  var armed = {};
  function twoTap(key, btn, firstText) {
    if (armed[key] && Date.now() - armed[key] < 5000) { armed[key] = 0; return true; }
    armed[key] = Date.now();
    btn.textContent = firstText;
    return false;
  }
  function secStats(s) {
    var r = { f: 0, s: 0, m: 0, a: 0, n: s.items.length };
    s.items.forEach(function (it) {
      var x = P.ans[it.id];
      if (!x) return;
      r.a++;
      if (x.o === 'f') r.f++; else if (x.o === 's') r.s++; else r.m++;
    });
    return r;
  }
  function skillStats() {
    var out = {}, order = [];
    SECS.forEach(function (s) {
      s.items.forEach(function (it) {
        var k = it.p.skill;
        if (!out[k]) { out[k] = { f: 0, a: 0 }; order.push(k); }
        var x = P.ans[it.id];
        if (x) { out[k].a++; if (x.o === 'f') out[k].f++; }
      });
    });
    return order.map(function (k) { return { skill: k, f: out[k].f, a: out[k].a }; });
  }
  function missesHtml(s) {
    var rows = s.items.filter(function (it) { var x = P.ans[it.id]; return x && x.o !== 'f'; });
    if (!rows.length) return '<p class="muted">Every answer right first time.</p>';
    return rows.map(function (it) {
      var x = P.ans[it.id], q = it.q;
      return '<div class="miss"><b>' + esc(q.q) + '</b>' +
        'He chose: ' + x.w.map(function (i) { return '<s>' + esc(q.options[i]) + '</s>'; }).join(', then ') +
        '<br>Answer: ' + esc(q.options[q.correct]) + (x.o === 's' ? ' (he found it after the tip)' : ' (shown to him)') + '</div>';
    }).join('');
  }
  function openPanel() {
    clearTimeout(idleT);
    renderPanel();
    $('clPanelWrap').classList.add('on');
  }
  function renderPanel() {
    var n = lettersRead(), next = nextOpenIndex(-1), last10 = P.recent.slice(-10);
    var f10 = last10.filter(function (r) { return r.f; }).length;
    var where = next < 0 ? 'Every letter read.' :
      'Next: ' + (SECS[next].heading || SECS[next].name) + (answered(SECS[next]) ? ' (question ' + (firstOpen(SECS[next]) + 1) + ' of ' + SECS[next].items.length + ')' : '') + '.';
    var sounds = KitX.soundsOn(), ra = readAloudOn();
    $('clPanel').innerHTML =
      '<div class="cl-panel-top"><h2>👪 For grown-ups</h2><button class="btn-tool" data-act="pclose">✕ Close</button></div>' +
      '<p class="muted">' + esc(BOOK.title) + '</p>' +
      '<h3>Where he is</h3><p>' + n + ' of ' + LETTERS.length + ' letters read. ' + esc(where) + '</p>' +
      '<h3>Right first time</h3><p>' + (last10.length ? f10 + ' of the last ' + last10.length + ' answers.' : 'No answers yet.') + '</p>' +
      '<table><tr><th>Kind of question</th><th>Right first time</th></tr>' + skillStats().map(function (r) {
        return '<tr><td>' + esc(r.skill) + '</td><td class="n">' + (r.a ? r.f + ' of ' + r.a + ' (' + Math.round(100 * r.f / r.a) + '%)' : '–') + '</td></tr>';
      }).join('') + '</table>' +
      '<h3>How it works</h3><p class="muted">No levels: he picks any letter, and the questions in a letter go in order (' +
        'about 16 a letter, in parts). A star for each answer right first time (each question pays once a day). A wrong answer greys out and a tip ' +
        'appears (the book\'s hint, or the line of the letter to look at); a second wrong answer shows the right one. ' +
        'After about 12 seconds with nothing tapped, the question and the letter glow.</p>' +
      '<h3>Report for school</h3>' +
      '<table><tr><th>Letter</th><th>Done</th><th>Right first time</th><th></th></tr>' + SECS.map(function (s, i) {
        var st = secStats(s);
        return '<tr><td>' + esc(s.heading || s.name) +
          (st.a && st.f < st.a ? '<details><summary>Answers that needed help (' + (st.a - st.f) + ')</summary>' + missesHtml(s) + '</details>' : '') + '</td>' +
          '<td class="n">' + st.a + ' of ' + st.n + '</td>' +
          '<td class="n">' + (st.a ? st.f + ' of ' + st.a : '–') + '</td>' +
          '<td class="n"><button class="btn-tool small-btn" data-act="popen" data-i="' + i + '">Open</button>' +
          (st.a ? ' <button class="btn-tool small-btn" data-act="predo" data-i="' + i + '">↺ Redo</button>' : '') + '</td></tr>';
      }).join('') + '</table>' +
      '<div class="pbtns"><button class="btn-tool" data-act="pprint">🖨️ Print the report</button></div>' +
      '<h3>Show how to play</h3><div class="pbtns"><button class="btn-tool" data-act="pdemo">▶ Play the demo again</button></div>' +
      '<h3>Sounds and voice</h3><div class="pbtns">' +
        '<button class="btn-tool" data-act="psound" aria-pressed="' + sounds + '">' + (sounds ? '🔔 Sounds on' : '🔕 Sounds off') + '</button>' +
        '<button class="btn-tool" data-act="pread" aria-pressed="' + ra + '">' + (ra ? '🗣️ Read questions out loud: on' : '🗣️ Read questions out loud: off') + '</button></div>' +
      '<p class="muted">These follow the hub\'s own settings, so they change every game. The 🔊 buttons always work.</p>' +
      '<h3>Start again</h3><div class="pbtns"><button class="btn-tool" data-act="preset">Clear all answers in this book</button></div>' +
      '<p class="muted">Tap twice. Stars already won are kept.</p>';
  }
  function printReport() {
    var all = [], answeredN = 0, firstN = 0;
    SECS.forEach(function (s) { var st = secStats(s); answeredN += st.a; firstN += st.f; });
    all.push('<h1>' + esc(BOOK.title) + ' – reading report</h1>');
    all.push('<p>' + esc(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })) + '. ' +
      lettersRead() + ' of ' + LETTERS.length + ' letters read. Right first time: ' + firstN + ' of ' + answeredN + ' answers.</p>');
    all.push('<table><tr><th>Letter</th><th>Answered</th><th>Right first time</th><th>Right after a tip</th><th>Answer shown</th></tr>' +
      SECS.map(function (s) {
        var st = secStats(s);
        return '<tr><td>' + esc(s.heading || s.name) + '</td><td>' + st.a + ' of ' + st.n + '</td><td>' + st.f + '</td><td>' + st.s + '</td><td>' + st.m + '</td></tr>';
      }).join('') + '</table>');
    all.push('<h2>Questions that needed help</h2>');
    var any = false;
    SECS.forEach(function (s) {
      var rows = s.items.filter(function (it) { var x = P.ans[it.id]; return x && x.o !== 'f'; });
      if (!rows.length) return;
      any = true;
      all.push('<h2>' + esc(s.heading || s.name) + '</h2>' + rows.map(function (it) {
        var x = P.ans[it.id], q = it.q;
        return '<div class="q"><b>' + esc(q.q) + '</b><br>He chose: ' + x.w.map(function (i) { return esc(q.options[i]); }).join(', then ') +
          '<br>Answer: ' + esc(q.options[q.correct]) + '</div>';
      }).join(''));
    });
    if (!any) all.push('<p>None so far.</p>');
    printBox.innerHTML = all.join('');
    window.print();
  }

  /* ---------- Taps and keys ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target;
    var big = t.closest('[data-big]');
    if (big) { var fn = bigActs[Number(big.getAttribute('data-big'))]; if (fn) fn(); return; }
    var opt = t.closest('.cl-opt');
    if (opt && !opt.disabled) { choose(Number(opt.getAttribute('data-opt'))); return; }
    var pick = t.closest('[data-open]');
    if (pick) { openSection(Number(pick.getAttribute('data-open'))); return; }
    var a = t.closest('[data-act]');
    if (a) {
      var act = a.getAttribute('data-act');
      switch (act) {
        case 'home': hideBig(); goHome(); return;
        case 'open': openSection(Number(a.getAttribute('data-i'))); return;
        case 'grown': openPanel(); return;
        case 'read': readLetter(); return;
        case 'vletter': setView('letter'); return;
        case 'vpic': setView('pic'); return;
        case 'smaller': case 'bigger':
          P.font = Math.round(Math.min(RULES.fontMax, Math.max(RULES.fontMin, P.font + (act === 'bigger' ? 1 : -1) * RULES.fontStep)) * 100) / 100;
          var paper = $('clLBody').querySelector('.cl-paper');
          if (paper) paper.style.setProperty('--fs', P.font + 'rem');
          saveP();
          return;
        case 'zoom': zoom(); return;
        case 'unzoom': $('clZoom').classList.remove('on'); return;
        case 'sayq': sayQuestion(); return;
        case 'next': goNext(); return;
        case 'redo': redoSection(SECS[cur]); showQuestion(); return;
        case 'turn': yourTurn(); return;
        case 'pclose':
          if (t.closest('.cl-panel') && !t.closest('[data-act="pclose"].btn-tool')) return;
          $('clPanelWrap').classList.remove('on');
          if (screen === 'home') renderHome();
          else if (Q && !Q.answered) armIdle();
          return;
        case 'pdemo':
          $('clPanelWrap').classList.remove('on');
          newKind(screen === 'read' ? cur : null);
          return;
        case 'psound': KitX.setting && KitX.setting('sounds', !KitX.soundsOn()); renderPanel(); return;
        case 'pread': KitX.setting && KitX.setting('readAloud', !readAloudOn()); renderPanel(); return;
        case 'pprint': printReport(); return;
        case 'popen': $('clPanelWrap').classList.remove('on'); openSection(Number(a.getAttribute('data-i'))); return;
        case 'predo':
          if (!twoTap('redo' + a.getAttribute('data-i'), a, 'Tap again to clear')) return;
          redoSection(SECS[Number(a.getAttribute('data-i'))]);
          renderPanel();
          if (screen === 'read' && cur === Number(a.getAttribute('data-i'))) showQuestion();
          return;
        case 'preset':
          if (!twoTap('reset', a, 'Tap again to clear every answer')) return;
          P.ans = {}; P.recent = []; P.expert = false; P.justDone = null;
          saveP();
          renderPanel();
          if (screen === 'read') showQuestion();
          return;
      }
    }
    var line = t.closest('.cl-line');
    if (line && !demoOn) { readLine(line); return; }
  });
  document.addEventListener('pointerdown', function () {
    if (screen === 'read' && Q && !Q.answered && !demoOn) armIdle();
  }, true);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if ($('clZoom').classList.contains('on')) { $('clZoom').classList.remove('on'); return; }
      if ($('clPanelWrap').classList.contains('on')) { $('clPanelWrap').classList.remove('on'); return; }
    }
    if (demoOn || overlayOpen() || screen !== 'read' || e.ctrlKey || e.metaKey || e.altKey) return;
    if (/^[1-3]$/.test(e.key) && Q && !Q.answered && Q.order[Number(e.key) - 1] != null) {
      var b = optButton(Q.order[Number(e.key) - 1]);
      if (b && !b.disabled) { e.preventDefault(); choose(Q.order[Number(e.key) - 1]); }
      return;
    }
    if ((e.key === 'Enter' || e.key === 'ArrowRight') && $('clNextRow') && !$('clNextRow').hidden) {
      if (document.activeElement && document.activeElement.closest && document.activeElement.closest('button') && e.key === 'Enter') return;
      e.preventDefault();
      goNext();
    }
  });

  /* ---------- Test hook ---------- */
  window.crayonLetters = {
    BOOK: BOOK, RULES: RULES,
    get P() { return P; },
    state: function () { return { screen: screen, cur: cur, view: view, demoOn: demoOn, q: Q && { k: Q.k, id: Q.it.id, tries: Q.tries, answered: Q.answered, order: Q.order.slice(), correct: Q.it.q.correct } }; },
    open: openSection, home: goHome, demo: function () { newKind(screen === 'read' ? cur : null); },
    choose: choose, next: goNext, findLine: findLine, isPic: isPic
  };

  startCard();
})();
