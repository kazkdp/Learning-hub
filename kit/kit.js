/* Learning Hub – shared kit used by every page.
   - Kit.loadList()     reads list.txt (the site's contents page)
   - Kit.saveResult()   saves how an activity went (kept in this browser only)
   - Kit.resultsFor()   reads saved results for one activity
   - Kit.starSummary()  adds up the stars (used by the home page and My Stars)
   - Kit.speak()        reads text out loud (optionally tells you when it has finished)
   - Kit.chime()        soft "well done" sound
   - Kit.setting()      remembers small choices (sounds on/off, read aloud) and
                        game levels (settings named "progress:<page>")
   - Grown-ups lock     any button marked data-grownups (the 👪 button) opens only with a
                        press-and-hold, so a child can't change stages with one tap
   - Kit.renderSection() draws a section page's tiles from list.txt
   - Kit.voice()        the one en-GB voice every game should use
   - Testing            Kit.setTesting(minutes) makes this device test without saving anything
   Everything is saved in this browser under one key, so every page on the
   site shares the same record. Nothing is sent anywhere.

   Keeping it small (28 Nov 2026): the record keeps the newest MAX_RESULTS sittings. Older ones are
   folded into a "bank" (settings['stars:bank']) so their stars are never lost, and only the newest
   KEEP_ITEMS sittings keep their question-by-question detail. kit/stars.js does exactly the same
   (it has to work on its own), so change both together. */
(function () {
  'use strict';

  var STORE_KEY = 'learninghub:v1';
  var TEST_KEY = 'learninghub:testing';   // when testing ends (a time); kept out of the record and backups
  var MAX_RESULTS = 1500;
  var KEEP_ITEMS = 600;

  function emptyStore() { return { v: 1, results: [], settings: {} }; }
  function clone(d) { return JSON.parse(JSON.stringify(d)); }

  /* ---------- Testing on this device ----------
     While testing is on, every change stays in memory and disappears when the page closes,
     so a grown-up can try games on the child's device without adding stars or moving levels. */
  function testingUntil() {
    try { var t = Number(window.localStorage.getItem(TEST_KEY)) || 0; return t > Date.now() ? t : 0; } catch (e) { return 0; }
  }
  var testing = !!testingUntil();
  var overlay = null;
  function setTesting(minutes) {
    try {
      if (minutes > 0) window.localStorage.setItem(TEST_KEY, String(Date.now() + minutes * 60000));
      else window.localStorage.removeItem(TEST_KEY);
    } catch (e) {}
    testing = !!testingUntil();
    overlay = null;
    var chip = document.querySelector('.kit-testing');
    if (testing) showTesting(); else if (chip) chip.remove();
    return testingUntil();
  }

  function tidy(data) {
    if (!data || typeof data !== 'object') return emptyStore();
    if (!Array.isArray(data.results)) data.results = [];
    if (!data.settings || typeof data.settings !== 'object') data.settings = {};
    return data;
  }

  function readStore() {
    if (testing && overlay) return clone(overlay);
    try {
      return tidy(JSON.parse(window.localStorage.getItem(STORE_KEY)));
    } catch (e) {
      return emptyStore();
    }
  }

  /* ---------- The bank: stars from sittings too old to keep in full ----------
     settings['stars:bank'][activity] = { sum, best, times, adds, title, until }. "until" is the finish time of
     the newest sitting in the bank: any sitting that old or older counts through the bank only, so a backup
     loaded from another device can never count the same stars twice. */
  function bankOf(data) {
    var b = data.settings['stars:bank'];
    if (!b || typeof b !== 'object') b = data.settings['stars:bank'] = {};
    return b;
  }
  function bankOne(bank, r) {
    if (!r || !r.activity) return;
    var a = bank[r.activity] || (bank[r.activity] = { sum: 0, best: 0, times: 0, adds: false, title: '', until: '' });
    var score = Number(r.score) || 0;
    a.sum += score;
    a.best = Math.max(a.best, score);
    a.times += 1;
    if (r.adds) a.adds = true;
    if (r.title) a.title = r.title;
    if (String(r.finishedAt || '') > String(a.until || '')) a.until = String(r.finishedAt);
  }
  function banked(bank, r) {
    var b = bank && r && bank[r.activity];
    return !!(b && b.until && String(r.finishedAt || '') <= String(b.until));
  }
  function byTime(a, b) { return String((a && a.finishedAt) || '').localeCompare(String((b && b.finishedAt) || '')); }
  function compact(data, hard) {
    var extra = data.results.length - MAX_RESULTS;
    if (extra > 0) {
      var bank = bankOf(data);
      data.results.sort(byTime);
      data.results.slice(0, extra).forEach(function (r) { bankOne(bank, r); });
      data.results = data.results.slice(extra);
    }
    var keep = hard ? 100 : KEEP_ITEMS;
    for (var i = 0; i < data.results.length - keep; i++) {
      if (data.results[i] && data.results[i].items) delete data.results[i].items;
    }
    return data;
  }

  function writeStore(data) {
    compact(data);
    if (testing) { overlay = clone(data); return true; }
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      // Browser storage full: drop more of the old question-by-question detail and try once more.
      try { window.localStorage.setItem(STORE_KEY, JSON.stringify(compact(data, true))); return true; } catch (e2) { return false; }
    }
  }

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* Where the site's top folder is, relative to this page ("." or ".."). */
  var root = document.documentElement.getAttribute('data-root') || '.';
  function url(path) {
    path = String(path || '').replace(/^\/+/, '');
    return root === '.' ? path : root.replace(/\/+$/, '') + '/' + path;
  }

  /* ---------- Contents list (list.txt) ----------
     "@ Section | picture | short text | link"   describes a section tile
     "Section | Group | Title | Page | Picture"  is one activity
     Lines starting with # are notes and are ignored. */
  function parseList(text) {
    var sections = [];
    var items = [];
    String(text || '').split(/\r?\n/).forEach(function (raw) {
      var line = raw.trim();
      if (!line || line.charAt(0) === '#') return;
      if (line.charAt(0) === '@') {
        var s = line.slice(1).split('|').map(function (x) { return x.trim(); });
        if (s[0]) sections.push({ name: s[0], emoji: s[1] || '⭐', text: s[2] || '', link: s[3] || '' });
        return;
      }
      var p = line.split('|').map(function (x) { return x.trim(); });
      if (p.length < 4 || !p[0] || !p[2] || !p[3]) return;
      items.push({ section: p[0], group: p[1] || '', title: p[2], page: p[3], picture: p[4] || '⭐' });
    });
    return { sections: sections, items: items };
  }

  /* A tile picture can be an emoji or an image (a web link or a file on the site). */
  function isImage(value) {
    return /^(https?:)?\/\//i.test(value) || /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(value);
  }
  function picture(value, fallback) {
    value = String(value || '').trim();
    fallback = fallback || '⭐';
    if (isImage(value)) {
      var src = /^(https?:)?\/\//i.test(value) ? value : url(value);
      return '<img class="tile-img" src="' + esc(src) + '" alt="" loading="lazy" ' +
        'data-fallback="' + esc(fallback) + '" onerror="Kit.pictureFailed(this)">';
    }
    return '<span class="tile-emoji" aria-hidden="true">' + esc(value || fallback) + '</span>';
  }
  /* If an image can't load, show the emoji instead of a broken picture. */
  function pictureFailed(img) {
    var span = document.createElement('span');
    span.className = 'tile-emoji';
    span.setAttribute('aria-hidden', 'true');
    span.textContent = img.getAttribute('data-fallback') || '⭐';
    if (img.parentNode) img.parentNode.replaceChild(span, img);
  }

  function loadList() {
    return fetch(url('list.txt'), { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error('list.txt missing'); return r.text(); })
      .then(parseList);
  }

  /* ---------- Results ---------- */
  /* A result with a "session" id replaces the earlier result from the same
     session. Games save after every round this way, so stopping half-way
     keeps the stars already earned, and each sitting is one line in the history. */
  function saveResult(result) {
    var data = readStore();
    result = Object.assign({ finishedAt: new Date().toISOString() }, result);
    var at = -1;
    if (result.session) {
      for (var i = data.results.length - 1; i >= 0; i--) {
        var r = data.results[i];
        if (r && r.activity === result.activity && r.session === result.session) { at = i; break; }
      }
    }
    if (at >= 0) data.results[at] = result; else data.results.push(result);
    return writeStore(data);
  }

  /* Takes one sitting (and its stars) out of the record: for a grown-up removing a test that
     slipped through. The game's stage stays where it is. Returns true if it was found. */
  function removeResult(activity, session, finishedAt) {
    var data = readStore(), before = data.results.length;
    data.results = data.results.filter(function (r) {
      if (!r || r.activity !== activity) return true;
      return session ? r.session !== session : r.finishedAt !== finishedAt;
    });
    if (data.results.length === before) return false;
    writeStore(data);
    return true;
  }

  function resultsFor(activity) {
    return readStore().results.filter(function (r) { return r && r.activity === activity; });
  }

  function allResults() { return readStore().results.slice(); }

  /* ---------- Stars ----------
     Most activities (like a story) count their best go only, so watching the
     same story again can't add stars. Results marked "adds: true" come from
     games that make a brand-new round every time, so every go counts. */
  function starSummary(results) {
    var acts = {};
    // Stars from old sittings folded into the bank count first (they are never lost).
    var bank = readStore().settings['stars:bank'] || {};
    Object.keys(bank).forEach(function (k) {
      var b = bank[k] || {};
      acts[k] = { stars: 0, best: Number(b.best) || 0, sum: Number(b.sum) || 0, total: 0, times: Number(b.times) || 0,
        last: '', title: b.title || '', adds: !!b.adds };
    });
    (results || allResults()).forEach(function (r) {
      if (!r || !r.activity || banked(bank, r)) return;
      var a = acts[r.activity] || (acts[r.activity] = { stars: 0, best: 0, sum: 0, total: 0, times: 0, last: '', title: '', adds: false });
      var score = Number(r.score) || 0;
      a.best = Math.max(a.best, score);
      a.sum += score;
      a.total = r.total || a.total;
      a.times += 1;
      a.last = r.finishedAt || a.last;
      a.title = r.title || a.title;
      if (r.adds) a.adds = true;
    });
    var total = 0;
    Object.keys(acts).forEach(function (k) {
      var a = acts[k];
      a.stars = a.adds ? a.sum : a.best;
      total += a.stars;
    });
    return { total: total, acts: acts };
  }

  /* ---------- Backup ---------- */
  function exportData() {
    return { app: 'learning-hub', version: 1, exportedAt: new Date().toISOString(), data: readStore() };
  }

  /* Adds results from a backup to the ones already here (nothing is deleted).
     Game levels ("progress:" settings) come back too, if the backup is further on.
     Returns how many results were added, or -1 if the file isn't a backup. */
  function importData(backup) {
    var incoming = backup && backup.data && Array.isArray(backup.data.results) ? backup.data.results : null;
    if (!incoming) return -1;
    var data = readStore();
    function keyOf(r) { return r.session ? r.activity + '|session|' + r.session : r.activity + '|' + r.finishedAt; }
    var seen = {};
    data.results.forEach(function (r, i) { if (r) seen[keyOf(r)] = i; });
    var added = 0;
    incoming.forEach(function (r) {
      if (!r || !r.activity) return;
      var key = keyOf(r);
      if (Object.prototype.hasOwnProperty.call(seen, key)) {
        // The same game sitting saved twice (e.g. a backup made half-way): keep the later one.
        var mine = data.results[seen[key]];
        if (r.session && String(r.finishedAt || '') > String((mine && mine.finishedAt) || '')) data.results[seen[key]] = r;
        return;
      }
      seen[key] = data.results.length;
      data.results.push(r);
      added++;
    });
    var theirSettings = (backup.data && backup.data.settings) || {};
    // The bank: for each activity keep whichever bank reaches further forward in time.
    var theirBank = theirSettings['stars:bank'];
    if (theirBank && typeof theirBank === 'object') {
      var myBank = bankOf(data);
      Object.keys(theirBank).forEach(function (k) {
        var t = theirBank[k], m = myBank[k];
        if (t && typeof t === 'object' && String(t.until || '') > String((m && m.until) || '')) myBank[k] = clone(t);
      });
    }
    Object.keys(theirSettings).forEach(function (k) {
      if (k.indexOf('progress:') !== 0) return;
      var theirs = theirSettings[k], mine = data.settings[k];
      if (theirs && typeof theirs === 'object' && (!mine || (Number(theirs.rounds) || 0) > (Number(mine.rounds) || 0))) {
        data.settings[k] = theirs;
      }
    });
    var bankNow = bankOf(data);
    data.results = data.results.filter(function (r) { return !banked(bankNow, r); });
    data.results.sort(byTime);
    writeStore(data);
    return added;
  }

  /* ---------- Settings ---------- */
  function setting(name, value) {
    var data = readStore();
    if (arguments.length > 1) {
      data.settings[name] = value;
      writeStore(data);
      return value;
    }
    return data.settings[name];
  }

  /* ---------- Read aloud ---------- */
  var chosenVoice = null;
  function pickVoice() {
    if (!('speechSynthesis' in window)) return;
    var voices = window.speechSynthesis.getVoices() || [];
    chosenVoice =
      voices.find(function (v) { return /en[-_]GB/i.test(v.lang) && /female|libby|sonia|hazel|serena|kate|martha|google uk english female/i.test(v.name); }) ||
      voices.find(function (v) { return /en[-_]GB/i.test(v.lang); }) ||
      voices.find(function (v) { return /^en/i.test(v.lang); }) ||
      null;
  }
  if ('speechSynthesis' in window) {
    pickVoice();
    if (typeof window.speechSynthesis.addEventListener === 'function') {
      window.speechSynthesis.addEventListener('voiceschanged', pickVoice);
    }
  }

  /* Kit.speak(text) reads text out loud. Kit.speak(text, { onend: fn }) also calls fn once
     when it finishes or is stopped (used to read a story one sentence at a time). */
  var lastUtterance = null;   // kept so Chrome doesn't drop it before it finishes
  function speak(text, opts) {
    var onend = opts && typeof opts.onend === 'function' ? opts.onend : null;
    if (!('speechSynthesis' in window) || !text) return false;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(String(text));
      if (chosenVoice) u.voice = chosenVoice;
      u.lang = (chosenVoice && chosenVoice.lang) || 'en-GB';
      u.rate = 0.9;
      var finished = false;
      u.onend = u.onerror = function () {
        if (finished) return;
        finished = true;
        if (lastUtterance === u) lastUtterance = null;
        if (onend) onend();
      };
      lastUtterance = u;
      window.speechSynthesis.speak(u);
      return true;
    } catch (e) {
      return false;
    }
  }

  function stopSpeaking() {
    try { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); } catch (e) {}
  }

  /* ---------- Soft sounds ---------- */
  var audioCtx = null;
  function tone(freq, start, length, ctx) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(0.09, ctx.currentTime + start + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + length);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + start);
    osc.stop(ctx.currentTime + start + length + 0.05);
  }
  function soundsOn() { return setting('sounds') !== false; }
  function chime(big) {
    if (!soundsOn()) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      tone(659.25, 0, 0.35, audioCtx);
      tone(880, 0.12, 0.45, audioCtx);
      if (big) tone(1046.5, 0.26, 0.6, audioCtx);
    } catch (e) {}
  }

  /* ---------- The grown-ups lock (Kas, 22 Nov 2026) ----------
     A child changed Addition's stage with one tap on 👪. Every 👪 button now needs a press-and-hold of about
     a second (touch, mouse, or holding Enter/Space); a quick tap just says "Grown-ups: press and hold".
     Games only mark the button: <button data-grownups …>. Nothing else in the game changes. */
  var HOLD_MS = 900;
  (function grownupsLock() {
    if (typeof document === 'undefined') return;
    var timer = 0, holding = null, opening = null, opened = null, openedAt = 0, tip = null, tipTimer = 0;
    function find(e) { var t = e.target; return t && t.closest ? t.closest('[data-grownups]') : null; }
    function style() {
      if (document.getElementById('kit-grownups-style')) return;
      var st = document.createElement('style');
      st.id = 'kit-grownups-style';
      st.textContent = '@keyframes kitHold{from{outline-offset:12px;outline-color:rgba(245,158,11,.15)}to{outline-offset:2px;outline-color:#f59e0b}}' +
        '[data-grownups].kit-holding{outline:3px solid #f59e0b;animation:kitHold ' + HOLD_MS + 'ms linear forwards}' +
        '.kit-gu-tip{position:fixed;z-index:2147483000;background:#1f2937;color:#fff;font:600 14px/1.3 system-ui,sans-serif;padding:8px 12px;border-radius:10px;' +
        'box-shadow:0 6px 18px rgba(0,0,0,.3);pointer-events:none;opacity:0;transition:opacity .2s}.kit-gu-tip.show{opacity:1}';
      document.head.appendChild(st);
    }
    function hint(el) {
      style();
      if (!tip) { tip = document.createElement('div'); tip.className = 'kit-gu-tip'; tip.setAttribute('role', 'status'); tip.textContent = 'Grown-ups: press and hold'; document.body.appendChild(tip); }
      var r = el.getBoundingClientRect();
      tip.style.left = Math.max(8, Math.min(window.innerWidth - 220, r.left)) + 'px';
      tip.style.top = (r.bottom + 8 > window.innerHeight - 40 ? r.top - 44 : r.bottom + 8) + 'px';
      tip.classList.add('show');
      clearTimeout(tipTimer);
      tipTimer = setTimeout(function () { tip.classList.remove('show'); }, 1800);
    }
    function stop() { clearTimeout(timer); if (holding) holding.classList.remove('kit-holding'); holding = null; }
    function start(el) {
      stop(); style();
      holding = el; el.classList.add('kit-holding');
      timer = setTimeout(function () {
        stop();
        opening = el;
        try { el.click(); } finally { opening = null; opened = el; openedAt = Date.now(); }
      }, HOLD_MS);
    }
    document.addEventListener('pointerdown', function (e) { var el = find(e); if (el && e.button === 0) start(el); }, true);
    ['pointerup', 'pointercancel'].forEach(function (n) { document.addEventListener(n, stop, true); });
    document.addEventListener('keydown', function (e) {
      var el = find(e);
      if (!el || (e.key !== 'Enter' && e.key !== ' ')) return;
      e.preventDefault();
      if (!e.repeat) start(el);
    }, true);
    document.addEventListener('keyup', function (e) { if (find(e)) { e.preventDefault(); stop(); } }, true);
    // Any click that isn't the hold finishing is stopped before the game sees it.
    document.addEventListener('click', function (e) {
      var el = find(e);
      if (!el || el === opening) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      if (el === opened && Date.now() - openedAt < 1500) { opened = null; return; }   // the finger lifting after a hold
      hint(el);
    }, true);
  })();

  /* ---------- Section pages ----------
     Every section page (maths/, reading/ …) is the same: its tiles come from list.txt.
     Kit.renderSection({ section: 'Maths', emoji: '🔢', box: 'games', empty: 'No maths games yet.' }) */
  function renderSection(o) {
    var box = document.getElementById(o.box || 'games');
    if (!box) return;
    var acts = starSummary().acts;
    function badgeFor(page) {
      var a = acts[page];
      var progress = setting('progress:' + page);
      if (!a && !progress) return '<span class="tile-badge is-new">New</span>';
      var stars = a ? a.stars : 0;
      return (progress && (progress.label || progress.level) ? '<span class="tile-level">' + esc(progress.label || 'Level ' + progress.level) + '</span>' : '') +
        '<span class="tile-badge">⭐ ' + stars + (stars === 1 ? ' star' : ' stars') + '</span>';
    }
    loadList().then(function (list) {
      var items = list.items.filter(function (it) { return it.section === o.section; });
      box.innerHTML = items.map(function (it) {
        return '<a class="tile" href="' + esc(url(it.page)) + '">' +
          picture(it.picture, o.emoji || '⭐') +
          '<span class="tile-title">' + esc(it.title) + '</span>' +
          badgeFor(it.page) +
          '</a>';
      }).join('') || '<p class="message-box">' + esc(o.empty || 'Nothing here yet.') + '</p>';
    }).catch(function () {
      box.innerHTML = '<p class="message-box">' + esc(o.failed || 'Sorry, this page did not load. Try refreshing the page.') + '</p>';
    });
  }

  /* While testing, hub pages with the kit's top bar say so. (Games show it in the stars bar.) */
  function showTesting() {
    if (!testing || document.querySelector('.kit-testing')) return;
    var bar = document.querySelector('.topbar');
    if (!bar) return;
    var chip = document.createElement('span');
    chip.className = 'kit-testing';
    chip.textContent = '🧪 Testing – stars not saved';
    bar.appendChild(chip);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', showTesting);
  else showTesting();

  window.Kit = {
    esc: esc,
    url: url,
    root: root,
    parseList: parseList,
    loadList: loadList,
    picture: picture,
    pictureFailed: pictureFailed,
    saveResult: saveResult,
    resultsFor: resultsFor,
    allResults: allResults,
    starSummary: starSummary,
    exportData: exportData,
    importData: importData,
    setting: setting,
    speak: speak,
    stopSpeaking: stopSpeaking,
    chime: chime,
    soundsOn: soundsOn,
    voice: function () { return chosenVoice; },
    renderSection: renderSection,
    removeResult: removeResult,
    testingUntil: testingUntil,
    setTesting: setTesting,
    grownupsHoldMs: HOLD_MS
  };
})();
