/* Story Time player.
   Loads one story file from stories/<id>.json and runs it:
   video on the left, one question at a time on the right.
   - Wrong answers are greyed out and a clue appears (no buzzer, no red).
   - A star is earned for each question answered right first time.
   - If a question has "at" (seconds into the video), the clue offers "Show me",
     which replays that part of the video.
   - Results are saved with the shared kit, so the tracker can read them.
   - No links to other websites: the YouTube player is locked and driven by our own buttons. */
(function () {
  'use strict';

  var esc = Kit.esc;
  var quiz = document.getElementById('quiz');
  var dotsBox = document.getElementById('dots');
  var titleEl = document.getElementById('story-title');
  var creditEl = document.getElementById('credit');
  var videoBox = document.getElementById('video-box');
  var soundsBtn = document.getElementById('btn-sounds');

  var LETTERS = ['A', 'B', 'C', 'D'];
  var PARTS = [['beginning', 'Beginning'], ['middle', 'Middle'], ['end', 'End']];

  var story = null;
  var activity = '';
  var player = null;
  var videoFailed = false;
  var state = null;

  /* ---------- Sounds button ---------- */
  function showSoundsButton() {
    var on = Kit.soundsOn();
    soundsBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    soundsBtn.textContent = on ? '🔔 Sounds on' : '🔕 Sounds off';
  }
  soundsBtn.addEventListener('click', function () {
    Kit.setting('sounds', !Kit.soundsOn());
    showSoundsButton();
  });
  showSoundsButton();

  function autoRead() { return Kit.setting('readAloud') === true; }

  /* ---------- Helpers ---------- */
  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* The right answer is the first option unless the file says otherwise. */
  function optionsFor(q) {
    var answer = typeof q.answer === 'number' ? q.answer : 0;
    return shuffle(q.options.map(function (o, k) {
      return { text: o.text, emoji: o.emoji || '', correct: k === answer };
    }));
  }

  function partBar(part) {
    if (!part) return '';
    var label = '';
    var html = PARTS.map(function (p) {
      if (p[0] === part) label = p[1];
      return '<span class="' + (p[0] === part ? 'on' : '') + '">' + (p[0] === part ? '📍 ' : '') + p[1] + '</span>';
    }).join('');
    return '<div class="partbar" role="img" aria-label="This happens at the ' + esc(label.toLowerCase()) + ' of the story">' + html + '</div>';
  }

  function questionSpeech(q, opts) {
    return q.q + ' ' + opts.map(function (o, k) { return LETTERS[k] + '. ' + o.text + '.'; }).join(' ');
  }

  function renderDots() {
    var n = story.questions.length;
    var html = '';
    for (var k = 0; k < n; k++) {
      var cls = 'dot';
      var label = String(k + 1);
      if (state && state.result[k] === 'star') { cls += ' star'; label = '⭐'; }
      else if (state && state.result[k] === 'done') { cls += ' done'; label = '✓'; }
      else if (state && state.phase === 'question' && k === state.i) { cls += ' current'; }
      html += '<span class="' + cls + '">' + label + '</span>';
    }
    dotsBox.innerHTML = html;
  }

  /* ---------- Video ----------
     The YouTube player is locked: nothing inside it can be tapped, so its title,
     logo, "Watch on YouTube" and suggested videos can't take a child off the site.
     Our own buttons (big play button, pause, back 10 seconds, progress bar,
     full screen) drive it through the YouTube player API. There are no links
     to other websites anywhere on the page. */
  var ready = false;
  var wantPlay = false;
  var everPlayed = false;
  var cover = null;
  var tick = null;
  var tapTimer = null;
  var vc = {};

  function fmt(t) {
    t = Math.max(0, Math.floor(t || 0));
    return Math.floor(t / 60) + ':' + ('0' + (t % 60)).slice(-2);
  }

  function thumb() {
    return 'https://i.ytimg.com/vi/' + encodeURIComponent(story.youtube) + '/hqdefault.jpg';
  }

  function videoHelp(text) {
    var help = document.getElementById('video-help');
    if (!help) return;
    help.textContent = text || '';
    help.hidden = !text;
  }

  /* Our own message when the video can't play. No links. */
  function videoFallback(code) {
    if (videoFailed) return;
    videoFailed = true;
    stopTick();
    clearTimeout(tapTimer);
    try { if (player && typeof player.destroy === 'function') player.destroy(); } catch (e) {}
    player = null;
    if (vc.bar) vc.bar.hidden = true;
    videoHelp('');
    videoBox.classList.remove('unlocked');
    videoBox.innerHTML =
      '<div class="video-fallback">' +
      '<p class="vf-big">😕 Sorry, this story video won\'t play right now.</p>' +
      '<p>Please tell a grown-up.</p>' +
      (code ? '<p class="vf-code">For grown-ups: YouTube error ' + esc(String(code)) + '</p>' : '') +
      '</div>';
  }

  function lock() {
    videoBox.classList.remove('unlocked');
    videoHelp('');
  }

  /* Some phones and tablets only start a video when it is tapped directly.
     If our play button didn't start it, open just the middle of the video
     (YouTube's own play button) for tapping. The edges, where YouTube puts its
     title, logo and "Watch on YouTube", stay covered. Locked again once it plays. */
  function unlockForTap() {
    if (videoFailed || everPlayed) return;
    showCover(null);
    videoBox.classList.add('unlocked');
    videoHelp('👆 Tap the play button in the middle of the video.');
  }

  function showCover(kind) {
    if (!cover) return;
    if (!kind) { cover.hidden = true; cover.innerHTML = ''; return; }
    var html = '';
    cover.className = 'video-cover';
    cover.style.backgroundImage = '';
    if (kind === 'start' || kind === 'ended') {
      cover.classList.add('with-thumb');
      cover.style.backgroundImage = 'url("' + thumb() + '")';
    }
    if (kind === 'start') {
      html = '<button class="cover-play" type="button" data-act="play" aria-label="Play the story"><span aria-hidden="true">▶</span></button>' +
        '<span class="cover-label">Play the story</span>';
    } else if (kind === 'paused') {
      html = '<button class="cover-play" type="button" data-act="play" aria-label="Keep watching"><span aria-hidden="true">▶</span></button>' +
        '<span class="cover-label">Keep watching</span>';
    } else if (kind === 'ended') {
      html = '<p class="cover-end">🎉 The end!</p>' +
        '<div class="cover-actions">' +
        '<button class="btn-secondary" type="button" data-act="again">↺ Watch again</button>' +
        (state ? '' : '<button class="btn-primary" type="button" data-act="questions">Start the questions ➜</button>') +
        '</div>';
    }
    cover.innerHTML = html;
    cover.hidden = false;
  }

  function stateNow() {
    try { return player && ready ? player.getPlayerState() : -1; } catch (e) { return -1; }
  }

  function update() {
    if (!player || !ready || !vc.bar) return;
    var t = 0, d = 0;
    try { t = player.getCurrentTime() || 0; d = player.getDuration() || 0; } catch (e) {}
    if (d > 0) {
      vc.seek.max = String(Math.floor(d));
      if (!vc.dragging) vc.seek.value = String(Math.floor(t));
    }
    vc.time.textContent = fmt(vc.dragging ? Number(vc.seek.value) : t) + ' / ' + fmt(d);
  }
  function startTick() { if (!tick) tick = setInterval(update, 300); }
  function stopTick() { clearInterval(tick); tick = null; }

  function setPlayButton(playing) {
    if (!vc.play) return;
    vc.play.textContent = playing ? '⏸ Pause' : '▶ Play';
    vc.play.setAttribute('aria-label', playing ? 'Pause the video' : 'Play the video');
  }

  function play() {
    if (videoFailed) return;
    if (!player || !ready) { wantPlay = true; return; }
    try { player.playVideo(); } catch (e) {}
    clearTimeout(tapTimer);
    if (!everPlayed) {
      tapTimer = setTimeout(function () {
        var s = stateNow();
        if (s !== 1 && s !== 3) unlockForTap();
      }, 3500);
    }
  }

  function togglePlay() {
    var s = stateNow();
    if (s === 1 || s === 3) pauseVideo(); else play();
  }

  function seekTo(seconds) {
    if (!player || !ready) return;
    try { player.seekTo(Math.max(0, seconds || 0), true); } catch (e) {}
    update();
  }

  function isFullscreen() { return !!(document.fullscreenElement || document.webkitFullscreenElement); }
  function toggleFullscreen() {
    var frame = document.getElementById('video-frame');
    try {
      if (isFullscreen()) {
        (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      } else if (frame) {
        (frame.requestFullscreen || frame.webkitRequestFullscreen).call(frame);
      }
    } catch (e) {}
  }
  function exitFullscreen() { if (isFullscreen()) toggleFullscreen(); }

  function onState(e) {
    var s = e && e.data;
    if (s === 1 || s === 3) {           // playing or loading
      everPlayed = true;
      clearTimeout(tapTimer);
      lock();
      showCover(null);
      setPlayButton(true);
      startTick();
    } else if (s === 2) {               // paused
      stopTick(); update(); setPlayButton(false);
      showCover('paused');
    } else if (s === 0) {               // ended
      stopTick(); update(); setPlayButton(false);
      showCover('ended');
    }
  }

  function setupControls() {
    vc.bar = document.getElementById('video-controls');
    vc.play = document.getElementById('vc-play');
    vc.back = document.getElementById('vc-back');
    vc.seek = document.getElementById('vc-seek');
    vc.time = document.getElementById('vc-time');
    vc.full = document.getElementById('vc-full');
    if (!vc.bar) return;
    vc.play.addEventListener('click', togglePlay);
    vc.back.addEventListener('click', function () {
      var t = 0;
      try { t = player.getCurrentTime() || 0; } catch (e) {}
      seekTo(t - 10);
    });
    vc.seek.addEventListener('input', function () { vc.dragging = true; update(); });
    vc.seek.addEventListener('change', function () { vc.dragging = false; seekTo(Number(vc.seek.value)); });
    if (document.fullscreenEnabled || document.webkitFullscreenEnabled) {
      vc.full.addEventListener('click', toggleFullscreen);
      var label = function () {
        vc.full.textContent = isFullscreen() ? '✕ Small' : '⛶ Big';
        vc.full.setAttribute('aria-label', isFullscreen() ? 'Leave full screen' : 'Full screen');
      };
      document.addEventListener('fullscreenchange', label);
      document.addEventListener('webkitfullscreenchange', label);
      label();
    } else {
      vc.full.hidden = true;
    }
  }

  function setupVideo() {
    if (!story.youtube) { videoFallback(); return; }

    // A see-through layer over the video takes every tap: tap = play / pause.
    var shield = document.createElement('div');
    shield.className = 'video-shield';
    shield.addEventListener('click', togglePlay);
    videoBox.appendChild(shield);
    // Used only while the middle is open for tapping (see unlockForTap).
    ['top', 'bottom', 'left', 'right'].forEach(function (side) {
      var edge = document.createElement('div');
      edge.className = 'video-edge edge-' + side;
      videoBox.appendChild(edge);
    });

    cover = document.createElement('div');
    cover.className = 'video-cover';
    cover.hidden = true;
    cover.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]');
      var act = b ? b.getAttribute('data-act') : 'play';
      if (act === 'play') play();
      else if (act === 'again') { seekTo(0); play(); }
      else if (act === 'questions') { exitFullscreen(); start(); }
    });
    videoBox.appendChild(cover);
    showCover('start');
    setupControls();

    window.onYouTubeIframeAPIReady = function () {
      if (videoFailed || !document.getElementById('yt')) return;
      try {
        player = new YT.Player('yt', {
          videoId: story.youtube,
          playerVars: {
            controls: 0, disablekb: 1, fs: 0, rel: 0, playsinline: 1,
            iv_load_policy: 3, modestbranding: 1, origin: window.location.origin
          },
          events: {
            onReady: function () {
              ready = true;
              try {
                var f = player.getIframe();
                f.setAttribute('tabindex', '-1');
                f.setAttribute('title', 'Story video');
              } catch (e) {}
              if (vc.bar) vc.bar.hidden = false;
              update();
              if (wantPlay) { wantPlay = false; play(); }
            },
            onStateChange: onState,
            onError: function (e) { videoFallback((e && e.data) || 'unknown'); }
          }
        });
      } catch (e) { videoFallback(); }
    };
    var s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    s.onerror = function () { videoFallback(); };
    document.head.appendChild(s);
    setTimeout(function () { if (!player && !videoFailed) videoFallback(); }, 10000);
  }

  function playFrom(seconds) {
    if (!player || !ready) return;
    seekTo(seconds);
    play();
  }
  function pauseVideo() {
    if (!player || !ready) return;
    try { player.pauseVideo(); } catch (e) {}
  }

  /* ---------- Screens ---------- */
  function showIntro() {
    state = null;
    renderDots();
    var n = story.questions.length;
    quiz.innerHTML =
      '<h2 class="intro-title">📖 Before you start</h2>' +
      '<p class="intro-text">' + esc(story.intro || '') + '</p>' +
      '<ol class="steps">' +
        '<li><span class="num">1</span> Watch the story video.</li>' +
        '<li><span class="num">2</span> Answer ' + n + ' questions about it.</li>' +
        '<li><span class="num">3</span> See your stars!</li>' +
      '</ol>' +
      '<label class="check"><input type="checkbox" id="opt-read"' + (autoRead() ? ' checked' : '') + '> Read the questions out loud</label>' +
      '<div class="q-tools"><button class="btn-tool" type="button" id="read-intro">🔊 Read to me</button></div>' +
      '<div class="q-bottom"><button class="btn-primary" type="button" id="start">I watched it. Start the questions ➜</button></div>';

    document.getElementById('opt-read').addEventListener('change', function (e) { Kit.setting('readAloud', e.target.checked); });
    document.getElementById('read-intro').addEventListener('click', function () {
      Kit.speak((story.intro || '') + ' First, watch the story video. Then answer ' + n + ' questions about it.');
    });
    document.getElementById('start').addEventListener('click', start);
  }

  function start() {
    var n = story.questions.length;
    state = {
      phase: 'question',
      i: 0,
      tries: new Array(n).fill(0),
      result: new Array(n).fill(null),
      options: story.questions.map(optionsFor),
      startedAt: new Date().toISOString()
    };
    pauseVideo();
    showQuestion();
  }

  function showQuestion() {
    var q = story.questions[state.i];
    var opts = state.options[state.i];
    var n = story.questions.length;
    state.answered = false;
    renderDots();

    quiz.innerHTML =
      '<div class="q-top"><span class="chip">Question ' + (state.i + 1) + ' of ' + n + '</span>' + partBar(q.part) + '</div>' +
      '<h2 class="q-text" id="q-text" tabindex="-1">' + esc(q.q) + '</h2>' +
      '<div class="q-tools"><button class="btn-tool" type="button" id="read-q">🔊 Read to me</button></div>' +
      '<div class="options" role="group" aria-label="Answers">' +
        opts.map(function (o, k) {
          return '<button class="option" type="button" data-k="' + k + '">' +
            '<span class="key" aria-hidden="true">' + LETTERS[k] + '</span>' +
            (o.emoji ? '<span class="opt-emoji" aria-hidden="true">' + esc(o.emoji) + '</span>' : '') +
            '<span class="opt-text">' + esc(o.text) + '</span>' +
            '</button>';
        }).join('') +
      '</div>' +
      '<div class="feedback" id="feedback" hidden></div>' +
      '<div class="q-bottom"><button class="btn-primary" type="button" id="next" hidden>' +
        (state.i === n - 1 ? 'See my stars ➜' : 'Next question ➜') + '</button></div>';

    document.getElementById('read-q').addEventListener('click', function () { Kit.speak(questionSpeech(q, opts)); });
    Array.prototype.forEach.call(quiz.querySelectorAll('.option'), function (btn) {
      btn.addEventListener('click', function () { choose(Number(btn.getAttribute('data-k')), btn); });
    });
    document.getElementById('next').addEventListener('click', next);

    var heading = document.getElementById('q-text');
    if (heading) heading.focus({ preventScroll: true });
    quiz.scrollTop = 0;
    if (autoRead()) Kit.speak(questionSpeech(q, opts));
  }

  function choose(k, btn) {
    if (state.answered) return;
    var q = story.questions[state.i];
    var o = state.options[state.i][k];
    var fb = document.getElementById('feedback');
    state.tries[state.i]++;

    if (o.correct) {
      state.answered = true;
      var first = state.tries[state.i] === 1;
      state.result[state.i] = first ? 'star' : 'done';
      btn.classList.add('is-correct');
      btn.querySelector('.key').textContent = '✓';
      Array.prototype.forEach.call(quiz.querySelectorAll('.option'), function (b) { b.disabled = true; });
      fb.className = 'feedback good';
      fb.innerHTML = '<span class="tag">' + (first ? '⭐ Yes! First try!' : '✅ Yes, that\'s right!') + '</span>' + esc(q.yes || '');
      fb.hidden = false;
      Kit.chime(first);
      renderDots();
      var nextBtn = document.getElementById('next');
      nextBtn.hidden = false;
      nextBtn.focus({ preventScroll: true });
      nextBtn.scrollIntoView({ block: 'nearest' });
      if (autoRead()) Kit.speak((first ? 'Yes! First try! ' : 'Yes, that is right! ') + (q.yes || ''));
    } else {
      btn.classList.add('is-wrong');
      btn.disabled = true;
      btn.insertAdjacentHTML('beforeend', '<span class="opt-note">Not this one</span>');
      var canShow = typeof q.at === 'number' && player && !videoFailed;
      fb.className = 'feedback clue';
      fb.innerHTML = '<span class="tag">💡 Not that one. Here is a clue:</span>' + esc(q.clue || 'Have another look at the story.') +
        (canShow ? '<br><button class="btn-tool" type="button" id="show-me">▶ Show me in the video</button>' : '');
      fb.hidden = false;
      if (canShow) {
        document.getElementById('show-me').addEventListener('click', function () { playFrom(q.at); });
      }
      fb.scrollIntoView({ block: 'nearest' });
      if (autoRead()) Kit.speak('Not that one. Here is a clue. ' + (q.clue || ''));
    }
  }

  function next() {
    Kit.stopSpeaking();
    if (state.i < story.questions.length - 1) {
      state.i++;
      showQuestion();
    } else {
      finish();
    }
  }

  function finish() {
    var n = story.questions.length;
    var stars = state.result.filter(function (r) { return r === 'star'; }).length;
    state.phase = 'done';
    renderDots();

    Kit.saveResult({
      activity: 'story-time/story.html?s=' + story.id,
      section: 'Story Time',
      title: story.title,
      kind: 'story-quiz',
      score: stars,
      total: n,
      startedAt: state.startedAt,
      items: story.questions.map(function (q, k) {
        return { id: q.id, type: q.type || '', part: q.part || '', firstTry: state.result[k] === 'star', tries: state.tries[k] };
      })
    });

    var message = stars >= n - 2 ? 'Brilliant! You remembered nearly everything.'
      : stars >= Math.ceil(n * 0.66) ? 'Great listening! You remembered lots.'
      : 'Good try! Watching the story again can help.';

    quiz.innerHTML =
      '<div class="score"><div><h2>All done! 🌟</h2><p>' + esc(message) + '</p></div>' +
      '<div class="big">' + stars + ' / ' + n + ' ⭐</div></div>' +
      '<div class="actions">' +
        '<a class="btn-primary" href="./">📺 Pick another story</a>' +
        '<button class="btn-secondary" type="button" id="again">Try again</button>' +
        '<button class="btn-secondary" type="button" id="print">🖨️ Print</button>' +
      '</div>' +
      '<p style="color:var(--muted)">⭐ = right first time &nbsp;·&nbsp; 💡 = got it with a clue</p>' +
      '<ul class="review">' +
        story.questions.map(function (q, k) {
          var first = state.result[k] === 'star';
          return '<li class="' + (first ? 'first' : 'clued') + '">' +
            '<div class="r-q"><span>' + (k + 1) + '. ' + esc(q.q) + '</span><span aria-label="' + (first ? 'right first time' : 'needed a clue') + '">' + (first ? '⭐' : '💡') + '</span></div>' +
            '<div class="r-fact">' + esc(q.yes || '') + '</div></li>';
        }).join('') +
      '</ul>';

    Kit.chime(true);
    quiz.scrollTop = 0;
    document.getElementById('again').addEventListener('click', function () { showIntro(); });
    document.getElementById('print').addEventListener('click', function () { window.print(); });
    if (autoRead()) Kit.speak('All done! You got ' + stars + ' stars out of ' + n + '. ' + message);
  }

  function showError(text) {
    quiz.innerHTML =
      '<div class="error-box"><p style="font-size:1.2rem">' + esc(text) + '</p>' +
      '<a class="btn-primary" href="./">📺 Back to the stories</a></div>';
    videoBox.innerHTML = '';
  }

  /* ---------- Load the story ---------- */
  var id = (new URLSearchParams(window.location.search).get('s') || '').toLowerCase().replace(/[^a-z0-9-]/g, '');
  if (!id) { showError('No story was picked.'); return; }

  fetch('stories/' + id + '.json', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error('missing'); return r.json(); })
    .then(function (data) {
      if (!data || !Array.isArray(data.questions) || !data.questions.length) throw new Error('empty');
      story = data;
      story.id = story.id || id;
      document.title = story.title + ' – Story Time';
      titleEl.textContent = (story.emoji ? story.emoji + ' ' : '') + story.title;
      var bits = [];
      if (story.author) bits.push('Written by ' + esc(story.author));
      if (story.reader) bits.push('read by ' + esc(story.reader));
      if (story.source && story.source.name) bits.push('from ' + esc(story.source.name));   // plain text: no links off the site
      creditEl.innerHTML = bits.join(', ');
      setupVideo();
      showIntro();
    })
    .catch(function () { showError('Sorry, this story isn\'t ready yet.'); });
})();
