/* Learning Hub – the coach (kit/coach.js): the hub frame for a game on the ladder, written once.
   DESIGN-RULES §1, §4, §8: every game starts, shows how, helps and ends the same way. The game draws its
   puzzles and plays its own demo steps; the coach does the rest:
     - cards: Start, "✨ New kind of puzzle!" / "⬆️ Next stage!" / "👀 Let's watch it again", end of sitting, Expert
     - the Watch-me / Your-turn banner, the pretend finger and the demo's timing (stopped cleanly at any moment)
     - the 👪 panel from ladder.panel() (press-and-hold via kit.js), with stages, easier/harder, undo the jump,
       show how, sounds, voice and "start again" (tap twice)
     - the one hub voice (Kit.voice()), and what Enter / Space does
   Made from Addition and Taking Away (28 Nov 2026), so they and More or Less stop being copies of each other.

   The page needs these ids: startCard startBtn · newKindCard newKindBadge newKindTitle newKindLine newKindSmall ·
   endCard endTitle endLine keepGoingBtn · turnBtn · demoBanner · finger · grownupsDock grownupsBtn gpStatus gpRule
   gpJump gpUndoJump gpStages gpEasier gpHarder gpShow gpSounds gpVoice gpSkills gpReset. (kit/nightsky.css styles them.)

   const coach = Coach.create({
     ladder: () => ladder,                 // the game's Ladder (a function: it may be made later)
     stages: STAGES, top: 12,              // STAGES[n] = { name, line, same } for n = 1..top
     words: { items: 'sums', expert: 'Addition expert', expertLine: 'You can do all 12 kinds of adding sums.' },
     shell: '.app-shell',                  // the pretend finger moves inside this element
     voice: { rate: 0.95, pitch: 1.05 },   // optional
     onPause: () => { state.paused = true; },   // a card is showing
     onStart, onTurn, onKeepGoing,         // the Start, Your turn and Keep going buttons (each starts the next item)
     canNext, onNext,                      // Enter/Space moves on only when canNext() is true
     onRestart,                            // a grown-up changed the stage or step: show a fresh item
     onShowHow,                            // "Show how to play" in the 👪 panel
     onStopDemo                            // the game's own clean-up when a demo stops (balls held by the finger…)
   });
   coach.bind() once the page is ready. */
(function () {
  'use strict';

  function create(o) {
    var $ = function (id) { return document.getElementById(id); };
    var L = function () { return typeof o.ladder === 'function' ? o.ladder() : o.ladder; };
    var stage = function (n) { return o.stages[n] || {}; };
    var demo = { token: 0, timers: [], speed: 1, running: false, plan: null, fx: 0, fy: 0 };
    var words = o.words || {};

    /* ---------- voice and sounds (the hub's shared settings) ---------- */
    function setting(k) { return window.Kit ? Kit.setting(k) : undefined; }
    function soundsOn() { return setting('sounds') !== false; }
    function voiceOn() { return setting('readAloud') !== false; }
    function say(text, force) {
      if (!('speechSynthesis' in window)) return;
      if (!voiceOn() && !force) return;
      try {
        window.speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(String(text));
        var v = window.Kit && Kit.voice ? Kit.voice() : null;
        u.lang = (v && v.lang) || 'en-GB';
        if (v) u.voice = v;
        u.rate = (o.voice && o.voice.rate) || 0.95;
        u.pitch = (o.voice && o.voice.pitch) || 1.05;
        window.speechSynthesis.speak(u);
      } catch (e) { /* no voice: carry on */ }
    }

    /* ---------- cards and the banner ---------- */
    function showCard(id) { if (o.onPause) o.onPause(); $(id).classList.add('show'); }
    function hideCard(id) { $(id).classList.remove('show'); }
    function hideAllCards() { ['startCard', 'newKindCard', 'endCard'].forEach(hideCard); }
    function cardShowing(id) { return $(id).classList.contains('show'); }
    function showBanner(kind, text, small) {
      var el = $('demoBanner');
      el.className = 'demo-banner show ' + kind;
      el.textContent = '';
      var main = document.createElement('span');
      main.textContent = text;
      el.appendChild(main);
      if (small) { var sub = document.createElement('small'); sub.textContent = small; el.appendChild(sub); }
    }
    function hideBanner() { $('demoBanner').className = 'demo-banner'; }

    // The big card: mode 'new' | 'challenge' | 'again' | 'next'
    function kindCard(n, mode) {
      var top = o.top;
      $('newKindTitle').textContent = stage(n).name;
      $('newKindLine').textContent = stage(n).line;
      if (mode === 'again') {
        $('newKindBadge').textContent = '\u{1F440} Let’s watch it again';
        $('newKindSmall').textContent = 'Watch me, then it’s your turn.';
      } else if (mode === 'next') {
        $('newKindBadge').textContent = '⬆️ Next stage!';
        $('newKindSmall').textContent = 'Stage ' + n + ' of ' + top + '.';
      } else {
        $('newKindBadge').textContent = '✨ New kind of puzzle!';
        $('newKindSmall').textContent = mode === 'challenge'
          ? 'A ⬆️ challenge from stage ' + n + ' of ' + top + '. Watch me do the first one.'
          : 'Stage ' + n + ' of ' + top + '. Watch me do the first one.';
      }
    }

    // End of a sitting, or the Expert card (once)
    function endCard(mode) {
      hideBanner();
      if (mode === 'expert') {
        $('endTitle').textContent = (words.expert || 'Expert') + '! \u{1F3C6}';
        $('endLine').textContent = (words.expertLine || 'You can do every kind.') + ' Keep going to stay sharp.';
        say((words.expert || 'Expert') + '! ' + (words.expertLine || ''));
      } else {
        var n = L() && L().RULES ? L().RULES.sitting : 10;
        $('endTitle').textContent = 'That’s ' + n + ' ' + (words.items || 'questions') + '! \u{1F389}';
        $('endLine').textContent = 'Have a rest, or keep going.';
        say('That’s ' + (n === 10 ? 'ten' : n) + ' ' + (words.items || 'questions') + '! Well done.');
      }
      showCard('endCard');
    }
    function endSitting() {
      if (window.Stars) Stars.done();
      if (L()) L().newSitting();   // the next item starts a new sitting
      endCard('sitting');
    }

    /* ---------- the demo's timing and the pretend finger ---------- */
    function wait(ms, tok) {
      return new Promise(function (resolve) {
        var t = setTimeout(function () { if (tok === demo.token) resolve(); }, ms / demo.speed);
        demo.timers.push(t);
      });
    }
    function until(cond, tok, maxMs) {
      var t0 = Date.now();
      return (function loop() {
        if (cond() || Date.now() - t0 >= maxMs) return Promise.resolve();
        return wait(100, tok).then(loop);
      })();
    }
    function stopDemo() {
      demo.token++;
      demo.plan = null;
      demo.timers.forEach(clearTimeout);
      demo.timers = [];
      demo.running = false;
      hideFinger();
      hideCard('newKindCard');
      document.querySelectorAll('.key-btn.key-show').forEach(function (k) { k.classList.remove('key-show'); });
      if (o.onStopDemo) o.onStopDemo();
    }
    function shellRect() { return document.querySelector(o.shell || '.app-shell').getBoundingClientRect(); }
    function centre(el) {
      var r = el.getBoundingClientRect(), s = shellRect();
      return { x: r.left - s.left + r.width / 2, y: r.top - s.top + r.height / 2 };
    }
    function placeFinger(x, y) {
      demo.fx = x; demo.fy = y;
      $('finger').style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    }
    function showFinger(x, y) { placeFinger(x, y); $('finger').classList.add('show'); }
    function hideFinger() { $('finger').classList.remove('show', 'press'); }
    // Moves the pretend finger smoothly to target() (a point in the shell); onMove(x, y) follows it (a held ball).
    function fingerTo(target, ms, tok, onMove) {
      return new Promise(function (resolve) {
        var sx = demo.fx, sy = demo.fy, t0 = performance.now();
        function step(now) {
          if (tok !== demo.token) return;
          var k = Math.min(1, (now - t0) * demo.speed / ms);
          var e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
          var p = target();
          var x = sx + (p.x - sx) * e, y = sy + (p.y - sy) * e;
          placeFinger(x, y);
          if (onMove) onMove(x, y);
          if (k < 1) requestAnimationFrame(step); else resolve();
        }
        requestAnimationFrame(step);
      });
    }
    function press(tok) {
      var f = $('finger');
      f.classList.add('press');
      return wait(170, tok).then(function () { f.classList.remove('press'); });
    }
    function pulse(el) { el.classList.remove('hint-pulse'); void el.offsetWidth; el.classList.add('hint-pulse'); }
    // The finger goes to an element, presses it, it pulses, and the voice says something.
    function point(el, tok, words2) {
      return fingerTo(function () { return centre(el); }, 650, tok).then(function () { return press(tok); }).then(function () {
        pulse(el);
        if (words2 != null) say(words2);
      });
    }

    // A stage done the same way as the one before: just the "⬆️ Next stage!" card, then on.
    function stageCard(p) {
      stopDemo();
      var tok = demo.token;
      kindCard(p.stage, 'next');
      showCard('newKindCard');
      say('Next stage! ' + stage(p.stage).line);
      return wait(4200, tok).then(function () {
        hideCard('newKindCard');
        if (L()) L().shown(p);
        return true;
      });
    }

    /* ---------- the 👪 panel ---------- */
    function closePanel() {
      $('grownupsDock').classList.remove('open');
      $('grownupsBtn').setAttribute('aria-expanded', 'false');
    }
    function updatePanel() {
      var lad = L();
      if (!lad) return;
      var g = lad.panel();
      $('gpStatus').textContent = g.where;
      $('gpRule').textContent = g.rule;
      $('gpJump').textContent = g.chal;
      $('gpUndoJump').hidden = !g.canUndo;
      document.querySelectorAll('#gpStages .gp-btn').forEach(function (btn) {
        btn.classList.toggle('active', Number(btn.dataset.stage) === lad.stage);
      });
      $('gpSounds').textContent = 'Sounds: ' + (soundsOn() ? 'on' : 'off');
      $('gpSounds').classList.toggle('active', soundsOn());
      $('gpVoice').textContent = 'Voice: ' + (voiceOn() ? 'on' : 'off');
      $('gpVoice').classList.toggle('active', voiceOn());
      $('gpSkills').innerHTML = g.skills.map(function (k) {
        return '<li><b>' + k.name + ':</b> ' + (k.t ? k.f + ' of ' + k.t + ' right first time' : 'not tried yet') + '</li>';
      }).join('');
    }
    function restart() { updatePanel(); if (o.onRestart) o.onRestart(); }

    // What Enter or Space does right now (keyboard players)
    function action() {
      if (cardShowing('startCard')) return o.onStart;
      if (cardShowing('endCard')) return o.onKeepGoing;
      if ($('turnBtn').classList.contains('visible')) return o.onTurn;
      if (o.canNext && o.canNext()) return o.onNext;
      return null;
    }

    function bind() {
      $('startBtn').addEventListener('click', function () { o.onStart(); });
      $('turnBtn').addEventListener('click', function () { o.onTurn(); });
      $('keepGoingBtn').addEventListener('click', function () { o.onKeepGoing(); });
      // Enter / Space press the one button that matters (capture, so a game's own keys come after)
      window.addEventListener('keydown', function (e) {
        var onButton = document.activeElement && document.activeElement.tagName === 'BUTTON';
        if ((e.key === 'Enter' || e.key === ' ') && !onButton) {
          var a = action();
          if (a) { e.preventDefault(); e.stopImmediatePropagation(); a(); }
        }
      }, true);

      var dock = $('grownupsDock'), dockBtn = $('grownupsBtn');
      dockBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = !dock.classList.contains('open');
        dock.classList.toggle('open', open);
        dockBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) updatePanel();
      });
      document.addEventListener('click', function (e) { if (!dock.contains(e.target)) closePanel(); });

      var row = $('gpStages');
      for (var n = 1; n <= o.top; n++) {
        (function (n) {
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'gp-btn';
          b.dataset.stage = String(n);
          b.textContent = n + '. ' + stage(n).name;
          b.addEventListener('click', function () { L().moveTo(n); closePanel(); restart(); });
          row.appendChild(b);
        })(n);
      }
      $('gpEasier').addEventListener('click', function () { L().easier(); restart(); });
      $('gpHarder').addEventListener('click', function () { L().harder(); restart(); });
      $('gpUndoJump').addEventListener('click', function () { L().undoJump(); restart(); });
      $('gpShow').addEventListener('click', function () { closePanel(); hideAllCards(); if (o.onShowHow) o.onShowHow(L().stage); });
      $('gpSounds').addEventListener('click', function () { if (window.Kit) Kit.setting('sounds', !soundsOn()); updatePanel(); });
      $('gpVoice').addEventListener('click', function () {
        if (window.Kit) Kit.setting('readAloud', !voiceOn());
        if (!voiceOn() && 'speechSynthesis' in window) window.speechSynthesis.cancel();
        updatePanel();
      });
      // Start again: tap twice (stars are kept)
      var reset = $('gpReset'), resetTimer = null;
      reset.addEventListener('click', function () {
        if (!reset.classList.contains('armed')) {
          reset.classList.add('armed');
          reset.textContent = 'Tap again to start again from stage 1';
          resetTimer = setTimeout(function () { reset.classList.remove('armed'); reset.textContent = 'Start again from stage 1'; }, 4000);
          return;
        }
        clearTimeout(resetTimer);
        reset.classList.remove('armed');
        reset.textContent = 'Start again from stage 1';
        L().restart();
        closePanel();
        restart();
      });
    }

    return {
      demo: demo, say: say, soundsOn: soundsOn, voiceOn: voiceOn,
      showCard: showCard, hideCard: hideCard, hideAllCards: hideAllCards, cardShowing: cardShowing,
      showBanner: showBanner, hideBanner: hideBanner, kindCard: kindCard, endCard: endCard, endSitting: endSitting,
      stageCard: stageCard, wait: wait, until: until, stopDemo: stopDemo, shellRect: shellRect, centre: centre,
      placeFinger: placeFinger, showFinger: showFinger, hideFinger: hideFinger, fingerTo: fingerTo, press: press,
      pulse: pulse, point: point, closePanel: closePanel, updatePanel: updatePanel, action: action, bind: bind
    };
  }

  window.Coach = { create: create };
})();
