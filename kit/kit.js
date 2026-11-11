/* Learning Hub – shared kit used by every page.
   - Kit.loadList()     reads list.txt (the site's contents page)
   - Kit.saveResult()   saves how an activity went (kept in this browser only)
   - Kit.resultsFor()   reads saved results for one activity
   - Kit.speak()        reads text out loud
   - Kit.chime()        soft "well done" sound
   - Kit.setting()      remembers small choices (sounds on/off, read aloud)
   Everything is saved in this browser under one key, so every page on the
   site shares the same record. Nothing is sent anywhere. */
(function () {
  'use strict';

  var STORE_KEY = 'learninghub:v1';
  var MAX_RESULTS = 500;

  function emptyStore() { return { v: 1, results: [], settings: {} }; }

  function readStore() {
    try {
      var data = JSON.parse(window.localStorage.getItem(STORE_KEY));
      if (!data || typeof data !== 'object') return emptyStore();
      if (!Array.isArray(data.results)) data.results = [];
      if (!data.settings || typeof data.settings !== 'object') data.settings = {};
      return data;
    } catch (e) {
      return emptyStore();
    }
  }

  function writeStore(data) {
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
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
  function saveResult(result) {
    var data = readStore();
    result = Object.assign({ finishedAt: new Date().toISOString() }, result);
    data.results.push(result);
    if (data.results.length > MAX_RESULTS) data.results = data.results.slice(-MAX_RESULTS);
    return writeStore(data);
  }

  function resultsFor(activity) {
    return readStore().results.filter(function (r) { return r && r.activity === activity; });
  }

  function allResults() { return readStore().results.slice(); }

  /* ---------- Backup ---------- */
  function exportData() {
    return { app: 'learning-hub', version: 1, exportedAt: new Date().toISOString(), data: readStore() };
  }

  /* Adds results from a backup to the ones already here (nothing is deleted).
     Returns how many results were added, or -1 if the file isn't a backup. */
  function importData(backup) {
    var incoming = backup && backup.data && Array.isArray(backup.data.results) ? backup.data.results : null;
    if (!incoming) return -1;
    var data = readStore();
    var seen = {};
    data.results.forEach(function (r) { if (r) seen[r.activity + '|' + r.finishedAt] = true; });
    var added = 0;
    incoming.forEach(function (r) {
      if (!r || !r.activity) return;
      var key = r.activity + '|' + r.finishedAt;
      if (seen[key]) return;
      seen[key] = true;
      data.results.push(r);
      added++;
    });
    data.results.sort(function (a, b) { return String(a.finishedAt || '').localeCompare(String(b.finishedAt || '')); });
    if (data.results.length > MAX_RESULTS) data.results = data.results.slice(-MAX_RESULTS);
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
      voices.find(function (v) { return /en-GB/i.test(v.lang) && /female|libby|sonia|hazel|serena|google uk english female/i.test(v.name); }) ||
      voices.find(function (v) { return /en-GB/i.test(v.lang); }) ||
      voices.find(function (v) { return /^en/i.test(v.lang); }) ||
      null;
  }
  if ('speechSynthesis' in window) {
    pickVoice();
    if (typeof window.speechSynthesis.addEventListener === 'function') {
      window.speechSynthesis.addEventListener('voiceschanged', pickVoice);
    }
  }

  function speak(text) {
    if (!('speechSynthesis' in window) || !text) return false;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(String(text));
      if (chosenVoice) u.voice = chosenVoice;
      u.lang = (chosenVoice && chosenVoice.lang) || 'en-GB';
      u.rate = 0.9;
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
    exportData: exportData,
    importData: importData,
    setting: setting,
    speak: speak,
    stopSpeaking: stopSpeaking,
    chime: chime,
    soundsOn: soundsOn
  };
})();
