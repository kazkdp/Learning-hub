/* Story Time player.
   Loads one story file from stories/<id>.json and runs it:
   video on the left, one question at a time on the right.
   - Wrong answers are greyed out and a clue appears (no buzzer, no red).
   - A star is earned for each question answered right first time.
   - If a question has "at" (seconds into the video), the clue offers "Show me",
     which replays that part of the video.
   - Results are saved with the shared kit, so the tracker can read them. */
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

  function optionsFor(q) {
    return shuffle(q.options.map(function (o, k) {
      return { text: o.text, emoji: o.emoji || '', correct: k === q.answer };
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

  /* ---------- Video ---------- */
  function videoFallback() {
    if (videoFailed) return;
    videoFailed = true;
    player = null;
    var link = story && story.source && story.source.url;
    videoBox.innerHTML =
      '<div class="video-fallback">' +
      '<p>The video can\'t play inside this page.</p>' +
      (link ? '<a class="btn-primary" href="' + esc(link) + '" target="_blank" rel="noopener">▶ Watch it on ' + esc(story.source.name || 'the story website') + '</a>' : '') +
      '</div>';
  }

  function setupVideo() {
    if (!story.youtube) { videoFallback(); return; }
    window.onYouTubeIframeAPIReady = function () {
      if (videoFailed || !document.getElementById('yt')) return;
      try {
        player = new YT.Player('yt', {
          host: 'https://www.youtube-nocookie.com',
          videoId: story.youtube,
          playerVars: { rel: 0, modestbranding: 1, playsinline: 1, iv_load_policy: 3 },
          events: { onError: function () { videoFallback(); } }
        });
      } catch (e) { videoFallback(); }
    };
    var s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    s.onerror = videoFallback;
    document.head.appendChild(s);
    setTimeout(function () { if (!player && !videoFailed) videoFallback(); }, 10000);
  }

  function playFrom(seconds) {
    if (!player || typeof player.seekTo !== 'function') return;
    try { player.seekTo(Math.max(0, seconds || 0), true); player.playVideo(); } catch (e) {}
  }
  function pauseVideo() {
    if (!player || typeof player.pauseVideo !== 'function') return;
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
      if (story.source && story.source.url) bits.push('from <a href="' + esc(story.source.url) + '" target="_blank" rel="noopener">' + esc(story.source.name || 'the story website') + '</a>');
      creditEl.innerHTML = bits.join(', ');
      setupVideo();
      showIntro();
    })
    .catch(function () { showError('Sorry, this story isn\'t ready yet.'); });
})();
