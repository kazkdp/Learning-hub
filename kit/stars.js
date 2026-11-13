/* Learning Hub – stars.js: one star system for every page and game.

   Add it to any page with one line (it works from any folder, and on other
   websites in practice mode):
     <script src="https://kazkdp.github.io/Learning-hub/kit/stars.js"></script>

   A game then only ever calls:
     Stars.win('Skill name')          right on the first go -> one star
     Stars.miss('Skill name')         not right first go -> no star (grown-ups see what is hard)
     Stars.win('Skill name', 'id')    the same for a question from a fixed list: pays once a day
     Stars.done()                     end of a round or game -> a small "well done"
     Stars.save(data), Stars.load()   remember the game's level (kept in backups)
     Stars.total()                    the total stars, if a game wants to say it

   This file does everything else: the bar across the top (Home, section,
   game name, star counter), the flying star and chime, and saving into the
   hub's shared record (the same one kit.js uses), so My Stars, the home page
   and the section tiles count these stars with no extra work. The star rules
   live here only (RULES below), so changing them here changes every game.

   On the hub, stars are saved in this browser. Anywhere else (an AI's
   preview, a file opened on the computer, or a page marked
   <html data-stars="practice">) it runs in practice mode: everything works
   and shows, but nothing is saved. Nothing is ever sent anywhere. */
(function () {
  'use strict';

  // Loaded twice? Keep the first one.
  if (window.Stars && window.Stars.__hub) return;

  /* ---------- The star rules for the whole site ---------- */
  var RULES = {
    starsPerWin: 1,         // one star for each thing right on the first go
    maxPerMinute: 30,       // more than this in one minute is a bug, not a child: not counted
    sittingGapMinutes: 30   // after a break this long, a new line starts in the history
    // A question with an id – Stars.win('Skill', 'id') – pays at most once a day.
  };

  var HUB = 'https://kazkdp.github.io/Learning-hub/';
  var STORE_KEY = 'learninghub:v1';   // shared with kit.js, same format
  var MAX_RESULTS = 2000;             // same as kit.js
  var MAX_ITEMS = 300;                // questions kept per sitting
  var BAR_HEIGHT = 56;

  /* ---------- Where am I? ---------- */
  function findScript() {
    var s = document.currentScript;
    if (s && /stars\.js/i.test(s.src || '')) return s;
    var all = document.getElementsByTagName('script');
    for (var i = all.length - 1; i >= 0; i--) {
      if (/\/kit\/stars\.js([?#]|$)/i.test(all[i].src || '')) return all[i];
    }
    return null;
  }
  var me = findScript();
  var root = HUB;   // the hub's top folder, worked out from where this file came from
  try { if (me && me.src) root = new URL('../', me.src).href; } catch (e) { root = HUB; }

  var here = String(location.href).split('#')[0].split('?')[0];
  var onHub = /^https?:/i.test(here) && here.indexOf(root) === 0;
  var practice = !onHub || document.documentElement.getAttribute('data-stars') === 'practice';

  // The page's name in the saved record, e.g. "maths/flags.html" – the same as its line in list.txt.
  var activity = 'practice';
  if (onHub) {
    activity = here.slice(root.length);
    try { activity = decodeURI(activity); } catch (e) {}
    if (!activity || /\/$/.test(activity)) activity += 'index.html';
    else if (!/\.[a-z0-9]+$/i.test(activity)) activity += '.html';
  }
  var progressKey = 'progress:' + activity;
  var folder = (/^([^\/]+)\//.exec(activity) || [])[1] || '';

  /* ---------- The saved record (same format as kit.js) ---------- */
  var storageOk = !practice;
  var memory = null;   // used in practice mode, or if the browser won't let us save

  function emptyStore() { return { v: 1, results: [], settings: {} }; }
  function tidy(d) {
    if (!d || typeof d !== 'object') return emptyStore();
    if (!Array.isArray(d.results)) d.results = [];
    if (!d.settings || typeof d.settings !== 'object') d.settings = {};
    return d;
  }
  function readStore() {
    if (storageOk) {
      var raw = null;
      try { raw = window.localStorage.getItem(STORE_KEY); } catch (e) { storageOk = false; }
      if (storageOk) {
        try { return tidy(JSON.parse(raw)); } catch (e2) { return emptyStore(); }
      }
    }
    return memory || (memory = emptyStore());
  }
  function writeStore(d) {
    if (storageOk) {
      try { window.localStorage.setItem(STORE_KEY, JSON.stringify(d)); return true; } catch (e) { storageOk = false; }
    }
    memory = d;
    return false;
  }

  // Same sum as Kit.starSummary(): games that add (adds: true) count every go, others their best go.
  function starTotal(results) {
    var acts = {};
    results.forEach(function (r) {
      if (!r || !r.activity) return;
      var a = acts[r.activity] || (acts[r.activity] = { best: 0, sum: 0, adds: false });
      var score = Number(r.score) || 0;
      a.best = Math.max(a.best, score);
      a.sum += score;
      if (r.adds) a.adds = true;
    });
    var total = 0;
    Object.keys(acts).forEach(function (k) { total += acts[k].adds ? acts[k].sum : acts[k].best; });
    return total;
  }
  function total() { return starTotal(readStore().results); }

  /* ---------- The page's name and section (from list.txt) ---------- */
  function words(name) {
    return String(name || '').replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ').trim()
      .replace(/\b[a-z]/g, function (c) { return c.toUpperCase(); });
  }
  var info = {
    ready: false,
    title: '',
    section: practice ? 'Practice' : (words(folder) || 'Games'),
    sectionLink: folder ? folder + '/' : '',
    sectionEmoji: ''
  };
  function pageTitle() {
    var t = String(document.title || '').replace(/\s*[–—|-]\s*Learning Hub\s*$/i, '').trim();
    return info.title || t || words(activity.split('/').pop()) || 'Game';
  }

  function parseList(text) {
    var sections = [], items = [];
    String(text || '').split(/\r?\n/).forEach(function (raw) {
      var line = raw.trim(), p;
      if (!line || line.charAt(0) === '#') return;
      if (line.charAt(0) === '@') {
        p = line.slice(1).split('|').map(function (x) { return x.trim(); });
        if (p[0]) sections.push({ name: p[0], emoji: p[1] || '', link: p[3] || '' });
        return;
      }
      p = line.split('|').map(function (x) { return x.trim(); });
      if (p.length >= 4 && p[0] && p[2] && p[3]) items.push({ section: p[0], title: p[2], page: p[3] });
    });
    return { sections: sections, items: items };
  }

  function loadInfo() {
    if (practice || !window.fetch) return;
    fetch(root + 'list.txt', { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.text() : ''; })
      .then(function (text) {
        var list = parseList(text), item = null, sec = null, i;
        for (i = 0; i < list.items.length && !item; i++) {
          if (list.items[i].page.split(/[?#]/)[0] === activity) item = list.items[i];
        }
        if (item) { info.title = item.title; info.section = item.section; }
        for (i = 0; i < list.sections.length && !sec; i++) {
          var s = list.sections[i];
          if (item ? s.name === item.section : (folder && s.link === folder + '/')) sec = s;
        }
        if (sec) { info.section = sec.name; info.sectionLink = sec.link; info.sectionEmoji = sec.emoji; }
        info.ready = true;
        if (session && session.tried) commit();   // put the right names on this sitting's line
        drawBar();
      })
      .catch(function () { info.ready = true; drawBar(); });
  }

  /* ---------- Sittings: one line in the history per sitting ---------- */
  var session = null;
  var recentWins = [];

  function sittingFor(now) {
    if (!session || now - session.lastAt > RULES.sittingGapMinutes * 60000) {
      session = {
        id: now.toString(36) + Math.random().toString(36).slice(2, 7),
        startedAt: new Date(now).toISOString(),
        stars: 0, tried: 0, items: [], lastAt: now
      };
    }
    session.lastAt = now;
    return session;
  }

  function today() {
    var d = new Date();
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }

  // Counts every question tried in this game; backups keep the copy with the bigger number.
  function bumpRounds(d) {
    var p = d.settings[progressKey];
    if (!p || typeof p !== 'object') p = d.settings[progressKey] = { by: 'stars.js', rounds: 0 };
    p.rounds = (Number(p.rounds) || 0) + 1;
  }

  // Saves this sitting's line (replacing the earlier copy), after any other change.
  function commit(change) {
    var d = readStore();
    if (change) change(d);
    var s = session;
    var result = {
      finishedAt: new Date().toISOString(),
      activity: activity, section: info.section, title: pageTitle(),
      kind: 'game', adds: true, by: 'stars.js',
      session: s.id, startedAt: s.startedAt,
      score: s.stars, total: s.tried, rounds: s.tried,
      items: s.items.slice()
    };
    var p = d.settings[progressKey];
    if (p && p.level != null) result.level = p.level;
    var at = -1;
    for (var i = d.results.length - 1; i >= 0; i--) {
      var r = d.results[i];
      if (r && r.activity === activity && r.session === s.id) { at = i; break; }
    }
    if (at >= 0) d.results[at] = result; else d.results.push(result);
    if (d.results.length > MAX_RESULTS) d.results = d.results.slice(-MAX_RESULTS);
    writeStore(d);
    return d;
  }

  function record(firstTry, skill, id) {
    var s = sittingFor(Date.now());
    var name = String(skill == null ? '' : skill).replace(/\s+/g, ' ').trim().slice(0, 60) || 'Other';
    var q = id == null ? '' : String(id).trim().slice(0, 80);
    var item = { type: name, firstTry: firstTry };
    if (q) item.id = q;
    s.tried++;
    s.items.push(item);
    if (s.items.length > MAX_ITEMS) s.items.shift();
    return { s: s, q: q };
  }

  /* ---------- What games call ---------- */
  function win(skill, id) {
    var now = Date.now();
    recentWins = recentWins.filter(function (t) { return now - t < 60000; });
    var r = record(true, skill, id);
    var paid = recentWins.length < RULES.maxPerMinute, again = false;
    var d = commit(function (d) {
      bumpRounds(d);
      if (paid && r.q) {
        var day = today(), key = activity + '|' + r.q;
        var book = d.settings['stars:paid'];
        if (!book || typeof book !== 'object' || book.day !== day || !book.keys) {
          book = d.settings['stars:paid'] = { day: day, keys: {} };
        }
        if (book.keys[key]) { paid = false; again = true; } else book.keys[key] = 1;
      }
      if (paid) r.s.stars += RULES.starsPerWin;
    });
    if (paid) {
      recentWins.push(now);
      showWin(starTotal(d.results), d.settings.sounds !== false);
    } else if (again) {
      message('You already won a star for this one today 👍');
    } else if (window.console) {
      console.warn('stars.js: more than ' + RULES.maxPerMinute + ' stars in a minute, so this one was not counted.');
    }
    return paid;
  }

  function miss(skill, id) {
    record(false, skill, id);
    commit(bumpRounds);
    return false;
  }

  function done() {
    var s = session;
    if (!s || !s.tried) return;
    session = null;   // the next question starts a new sitting
    var d = readStore(), t = starTotal(d.results), n = s.stars;
    setCount(t);
    message(n ? '🎉 Well done! ' + n + (n === 1 ? ' star' : ' stars') + ' this time. ' + t + ' altogether!'
      : 'Well done for practising! 💪', 4500);
    if (n && d.settings.sounds !== false) chime(true);
  }

  function save(data) {
    var copy = data === undefined ? null : JSON.parse(JSON.stringify(data));
    var d = readStore();
    var old = d.settings[progressKey];
    var p = {
      by: 'stars.js',
      rounds: old && typeof old === 'object' ? Number(old.rounds) || 0 : 0,
      savedAt: new Date().toISOString(),
      data: copy
    };
    if (copy && typeof copy === 'object') {
      if (copy.level != null && copy.level !== '' && isFinite(Number(copy.level))) p.level = Number(copy.level);
      if (typeof copy.label === 'string' && copy.label.trim()) p.label = copy.label.trim().slice(0, 60);
    }
    d.settings[progressKey] = p;
    writeStore(d);
    return true;
  }

  function load() {
    var p = readStore().settings[progressKey];
    if (!p || typeof p !== 'object' || p.by !== 'stars.js' || p.data == null) return null;
    return JSON.parse(JSON.stringify(p.data));
  }

  /* ---------- The bar, the flying star and messages ---------- */
  var ui = { bar: null, starBtn: null, count: null, section: null, title: null, fx: null, live: null,
    topbar: null, shown: 0, target: 0, toast: null, toastTimer: 0 };
  var lastPoint = null;   // where the last tap was, so the star flies from there
  document.addEventListener('pointerdown', function (e) {
    lastPoint = { x: e.clientX, y: e.clientY, t: Date.now() };
  }, true);

  var FONT = '"Quicksand",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';
  var BAR_CSS =
    ':host{all:initial}*{box-sizing:border-box}[hidden]{display:none!important}' +
    '.bar,.row{display:flex;align-items:center;gap:8px;font:700 16px/1.2 ' + FONT + ';color:#1f2937}' +
    '.bar{position:fixed;top:0;left:0;right:0;height:' + BAR_HEIGHT + 'px;padding:0 12px;background:#fff;' +
      'border-bottom:2px solid #edf2f7;box-shadow:0 6px 20px rgba(31,41,55,.08)}' +
    '.row{display:inline-flex}' +
    '.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;flex:none;height:42px;' +
      'padding:0 14px;border-radius:14px;border:2px solid transparent;font:inherit;text-decoration:none;' +
      'white-space:nowrap;cursor:pointer;-webkit-tap-highlight-color:transparent}' +
    '.btn:focus-visible{outline:4px solid #4c8bf5;outline-offset:2px}' +
    '.home{background:#eaf4ed;color:#1b4332;border-color:#c7e6d2}.home:hover{background:#dcefe3}' +
    '.section{background:#f4f7fa;color:#586776;border-color:#dbe4ea}.section:hover{background:#e9eff4;color:#1f2937}' +
    '.title{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;' +
      'color:#2d6a4f;font-size:19px;padding-left:4px}' +
    '.chip{flex:none;font-size:13px;color:#586776;background:#f4f7fa;border:1px dashed #b8c6d2;' +
      'border-radius:999px;padding:4px 10px;white-space:nowrap}' +
    '.stars{background:#fff6d6;color:#6b4a00;border-color:#ffd666;font-size:18px}.stars:hover{background:#ffefb3}' +
    '.count{font-variant-numeric:tabular-nums}' +
    '.pop{animation:pop .5s ease}@keyframes pop{0%{transform:scale(1)}35%{transform:scale(1.3)}100%{transform:scale(1)}}' +
    '@media (max-width:600px){.bar{gap:6px;padding:0 8px}.label{display:none}.btn{padding:0 11px}.title{font-size:17px}}' +
    '@media (prefers-reduced-motion:reduce){.pop{animation:none}}';
  var FX_CSS =
    ':host{all:initial}' +
    '.fly{position:fixed;font-size:34px;line-height:1;pointer-events:none;will-change:transform,opacity;' +
      'filter:drop-shadow(0 2px 6px rgba(178,107,0,.4))}' +
    '.toast{position:fixed;left:50%;transform:translate(-50%,-10px);opacity:0;transition:opacity .25s ease,transform .25s ease;' +
      'max-width:min(92vw,520px);background:#fff6d6;color:#6b4a00;border:2px solid #ffd666;border-radius:16px;' +
      'padding:10px 18px;font:700 17px/1.35 ' + FONT + ';text-align:center;box-shadow:0 8px 24px rgba(31,41,55,.14)}' +
    '.toast.show{opacity:1;transform:translate(-50%,0)}' +
    '.sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}' +
    '@media (prefers-reduced-motion:reduce){.toast{transition:none}}';

  function make(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function setLink(a, path) {
    a.href = /^https?:/i.test(path) ? path : root + path;
    if (practice) { a.target = '_blank'; a.rel = 'noopener'; }
  }
  function reducedMotion() {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
  }

  function addFont() {
    if (document.querySelector('link[href*="family=Quicksand"]')) return;
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Quicksand:wght@600;700&display=swap';
    (document.head || document.documentElement).appendChild(l);
  }

  // The bar sits outside <body>, so a game that redraws its whole body can't wipe it.
  function buildUI() {
    if (ui.fx || !document.body || !Element.prototype.attachShadow) return;
    var html = document.documentElement;
    addFont();

    var fxHost = document.createElement('lh-stars-fx');
    fxHost.setAttribute('style', 'all:initial;position:fixed;top:0;left:0;right:0;bottom:0;pointer-events:none;z-index:2147483001;');
    ui.fx = fxHost.attachShadow({ mode: 'open' });
    ui.fx.appendChild(make('style', null, FX_CSS));
    ui.live = make('div', 'sr');
    ui.live.setAttribute('aria-live', 'polite');
    ui.fx.appendChild(ui.live);

    var host = document.createElement('lh-stars');
    var homeBtn = document.querySelector('.topbar .btn-home');
    ui.topbar = homeBtn ? homeBtn.closest('.topbar') : null;
    var shadow;
    if (ui.topbar) {
      // A hub page that already has its top bar: just add the star button to it.
      host.setAttribute('style', 'all:initial;display:inline-flex;align-items:center;');
      shadow = host.attachShadow({ mode: 'open' });
      ui.bar = make('div', 'row');
    } else {
      host.setAttribute('style', 'all:initial;position:fixed;top:0;left:0;width:0;height:0;z-index:2147483000;');
      shadow = host.attachShadow({ mode: 'open' });
      ui.bar = make('div', 'bar');
      var home = make('a', 'btn home');
      home.innerHTML = '<span aria-hidden="true">🏠</span><span class="label">Home</span>';
      home.setAttribute('aria-label', 'Home');
      setLink(home, 'index.html');
      ui.bar.appendChild(home);
      ui.section = make('a', 'btn section');
      ui.section.hidden = true;
      ui.bar.appendChild(ui.section);
      ui.title = make('span', 'title');
      ui.bar.appendChild(ui.title);
    }
    shadow.appendChild(make('style', null, BAR_CSS));
    if (practice) {
      var chip = make('span', 'chip');
      chip.innerHTML = 'Practice<span class="label"> – stars not saved</span>';
      chip.title = 'Stars are only saved on the Learning Hub';
      ui.bar.appendChild(chip);
    }
    ui.starBtn = make('a', 'btn stars');
    ui.starBtn.innerHTML = '<span aria-hidden="true">⭐</span><span class="count">0</span>';
    ui.count = ui.starBtn.querySelector('.count');
    setLink(ui.starBtn, 'my-stars.html');
    ui.bar.appendChild(ui.starBtn);
    shadow.appendChild(ui.bar);

    if (ui.topbar) ui.topbar.appendChild(host);
    else { html.insertBefore(host, document.body); padBody(); }
    html.insertBefore(fxHost, document.body);
    setCount(total());
    drawBar();
  }

  function padBody() {
    var b = document.body, cur = 0;
    try { cur = parseFloat(window.getComputedStyle(b).paddingTop) || 0; } catch (e) {}
    b.style.setProperty('padding-top', (cur + BAR_HEIGHT) + 'px', 'important');
    document.documentElement.style.setProperty('--hub-bar', BAR_HEIGHT + 'px');
    document.documentElement.style.setProperty('scroll-padding-top', BAR_HEIGHT + 'px');
  }

  function drawBar() {
    if (!ui.bar) return;
    if (ui.title) ui.title.textContent = pageTitle();
    if (!ui.section) return;
    if (practice || !info.ready || !info.sectionLink) { ui.section.hidden = true; return; }
    ui.section.textContent = '';
    if (info.sectionEmoji) ui.section.appendChild(make('span', null, info.sectionEmoji)).setAttribute('aria-hidden', 'true');
    ui.section.appendChild(make('span', info.sectionEmoji ? 'label' : null, info.section));
    ui.section.setAttribute('aria-label', info.section);
    setLink(ui.section, info.sectionLink);
    ui.section.hidden = false;
  }

  function showCount() {
    if (!ui.count) return;
    ui.count.textContent = ui.shown;
    ui.starBtn.setAttribute('aria-label', ui.shown + (ui.shown === 1 ? ' star' : ' stars') + ' – open My Stars');
  }
  function setCount(t) { ui.shown = ui.target = t; showCount(); }

  function say(text) {
    if (!ui.live) return;
    ui.live.textContent = '';
    setTimeout(function () { ui.live.textContent = text; }, 30);
  }

  function landed() {
    ui.shown = Math.min(ui.shown + RULES.starsPerWin, ui.target);
    showCount();
    if (!ui.starBtn) return;
    ui.starBtn.classList.remove('pop');
    void ui.starBtn.offsetWidth;
    ui.starBtn.classList.add('pop');
  }

  function showWin(t, sound) {
    if (sound) chime(false);
    ui.target = t;
    say('Star won! You have ' + t + (t === 1 ? ' star.' : ' stars.'));
    if (!ui.count) { ui.shown = t; return; }
    if (reducedMotion() || !Element.prototype.animate) { landed(); return; }
    var r = ui.starBtn.getBoundingClientRect();
    var to = r.width && r.bottom > 0 && r.top < window.innerHeight
      ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : { x: window.innerWidth - 48, y: 28 };
    var from = lastPoint && Date.now() - lastPoint.t < 4000 ? lastPoint : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    var star = make('span', 'fly', '⭐');
    star.style.left = from.x + 'px';
    star.style.top = from.y + 'px';
    ui.fx.appendChild(star);
    var finished = false;
    function end() {
      if (finished) return;
      finished = true;
      if (star.parentNode) star.parentNode.removeChild(star);
      landed();
    }
    try {
      var anim = star.animate([
        { transform: 'translate(-50%,-50%) scale(.4)', opacity: 0 },
        { transform: 'translate(-50%,-50%) translate(0,-46px) scale(1.7)', opacity: 1, offset: 0.28 },
        { transform: 'translate(-50%,-50%) translate(' + (to.x - from.x) + 'px,' + (to.y - from.y) + 'px) scale(.65)', opacity: 0.95 }
      ], { duration: 950, easing: 'cubic-bezier(.45,0,.25,1)', fill: 'forwards' });
      anim.onfinish = end;
    } catch (e) { end(); }
    setTimeout(end, 1600);
  }

  function message(text, ms) {
    say(text);
    if (!ui.fx) return;
    if (ui.toast && ui.toast.parentNode) ui.toast.parentNode.removeChild(ui.toast);
    clearTimeout(ui.toastTimer);
    var t = make('div', 'toast', text);
    var top = BAR_HEIGHT + 10;
    if (ui.topbar) top = Math.max(10, ui.topbar.getBoundingClientRect().bottom + 10);
    t.style.top = top + 'px';
    ui.fx.appendChild(t);
    ui.toast = t;
    requestAnimationFrame(function () { requestAnimationFrame(function () { t.classList.add('show'); }); });
    ui.toastTimer = setTimeout(function () {
      t.classList.remove('show');
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 400);
    }, ms || 2800);
  }

  /* ---------- Soft chime (same as kit.js; follows the hub's sounds on/off setting) ---------- */
  var audio = null;
  function tone(ctx, freq, start, length) {
    var osc = ctx.createOscillator(), gain = ctx.createGain();
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
  function chime(big) {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === 'suspended') audio.resume();
      tone(audio, 659.25, 0, 0.35);
      tone(audio, 880, 0.12, 0.45);
      if (big) tone(audio, 1046.5, 0.26, 0.6);
    } catch (e) {}
  }

  /* ---------- Start ---------- */
  // A mistake in here must never stop a game working.
  var warned = false;
  function safe(fn, fallback) {
    return function () {
      try { return fn.apply(null, arguments); }
      catch (e) {
        if (!warned && window.console) { warned = true; console.error('stars.js:', e); }
        return fallback;
      }
    };
  }

  window.Stars = {
    __hub: true,
    version: 1,
    practice: practice,
    win: safe(win, false),
    miss: safe(miss, false),
    done: safe(done),
    save: safe(save, false),
    load: safe(load, null),
    total: safe(total, 0)
  };

  function start() { safe(buildUI)(); safe(loadInfo)(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
  // Coming back to the page with the Back button: show the latest total.
  window.addEventListener('pageshow', function (e) { if (e.persisted) safe(function () { setCount(total()); })(); });
})();
