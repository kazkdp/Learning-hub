/* Learning Hub – the ladder (kit/ladder.js)
   One way of starting, moving on and finding a child's level, shared by every game with stages
   (DESIGN-RULES §3). The game draws its puzzles, cards and demos; the ladder decides what comes next
   and keeps the saved progress (through kit/stars.js).

   What it carries (Kas, 22 Nov 2026):
   - start at the very simplest thing; inside a stage, help fades step by step;
   - about 80% to move on: 8 of the last 10 at the top of a stage (or the first 5 there all right);
   - a child who clearly knows it is placed quickly: ⬆️ challenges from up to 2 stages ahead, with safety nets;
   - a harder kind (fluent: true) opens by itself only once he is fluent, and is never jumped into;
   - every new kind gets its card and demo before he meets it, even in a review or a warm-up;
   - stages are saved by id, so a stage can be added later without moving anyone.

   How a game uses it:
     const ladder = Ladder.create({
       stages: [{ id: 'count', name: 'How many?', skill: 'Counting', steps: [{ note: 'up to 3' }, …],
                  noJump: true,   // a challenge never jumps into (or over) this stage
                  fluent: true,   // a harder kind: opens only when he is fluent (and is never jumped into)
                  same: true }],  // done the same way as the stage before (the game shows "⬆️ Next stage!", no demo)
       words: { items: 'sums', expert: 'Addition expert' },   // for the 👪 panel
       legacy: (saved) => …,      // turns a save from before the ladder into this format (stage ids), or null
       keep: { save: () => ({ … }), load: (saved) => { … } },   // the game's own extra saved things
       rules: { … }               // only what differs from Ladder.RULES (two-choice games need a stricter gate)
     });
     const plan = ladder.next();
       plan.card 'new' | 'again' | 'review' | 'challenge' → the New-kind card and demo for plan.stage, then ladder.shown(plan)
       plan.card 'expert' → the Expert card (once)        plan.card 'end' → the end-of-sitting card, then ladder.newSitting()
       no card → one item of plan.stage at plan.step (plan.warm / plan.review / plan.challenge say why it was chosen)
     const out = ladder.result(plan, rightFirstTime);   // out.note and out.say: a line to show and say (or '')
*/
(function () {
  'use strict';

  var RULES = {
    sitting: 10,                    // items in a sitting, then the end card
    upFirst: 2,                     // the first 2 at a step right first time -> the next step straight away
    upWindow: 5, upNeed: 4,         // otherwise 4 of the last 5 at a step -> the next step
    downMisses: 2,                  // 2 misses in a row -> one step easier
    fastTop: 5,                     // next stage: the first 5 at the top step all right first time...
    gateTop: 10, gateTopNeed: 8,    // ...or 8 of the last 10 there and the last one right (about 80%)
    replayAfterMisses: 3,           // 3 misses in a row -> the demo again (once a sitting)
    reviewEvery: 4,                 // after every 4 items, one from an earlier stage
    warmups: 2,                     // each visit starts with 2 easier ones
    chalAfter: 2,                   // the first 2 at a step right first time -> ⬆️ challenges from further up
    chalNeed: 3,                    // 3 challenges in a row right first time -> he moves up there
    chalStages: 2,                  // at most 2 stages at once
    chalRest: 8,                    // after a missed challenge, no new one for 8 items
    backMiss: 3, backSafe: 5,       // after a jump: 3 misses before 5 right -> back to the first stage he skipped
    skipOk: 3, skipBackMiss: 3,     // skipped stages come back as reviews: 3 right -> confirmed;
                                    // 3 missed (and more missed than right) -> back to that stage
    fluentReviews: 10, fluentNeed: 8,   // a harder kind opens once 8 of his last 10 reviews were right...
    fluentDays: 3,                  // ...and he has played the stage before it on at least 3 different days
    waitReviewEvery: 2              // while a harder kind waits, every 2nd item is a review (sideways, not up)
  };

  var has = function (a, x) { return a.indexOf(x) >= 0; };
  var sum = function (a) { var t = 0; for (var i = 0; i < a.length; i++) t += a[i]; return t; };
  var numv = function (v, d) { v = Number(v); return isFinite(v) ? v : d; };
  var bits = function (a, n) { return Array.isArray(a) ? a.filter(function (x) { return x === 0 || x === 1; }).slice(-n) : []; };
  var push = function (a, x, n) { a.push(x); while (a.length > n) a.shift(); };
  function todayLocal() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function create(o) {
    var R = Object.assign({}, RULES, o.rules || {});
    var LIST = o.stages, N = LIST.length;
    var W = Object.assign({ item: 'item', items: 'items', expert: 'Expert' }, o.words || {});
    var today = o.today || todayLocal;
    var rand = o.random || Math.random;
    var storage = o.storage || {
      load: function () { return window.Stars ? window.Stars.load() : null; },
      save: function (d) { if (window.Stars) window.Stars.save(d); }
    };

    var S = function (n) { return LIST[n - 1]; };
    var id = function (n) { return LIST[n - 1] ? LIST[n - 1].id : ''; };
    var num = function (x) { for (var i = 0; i < N; i++) if (LIST[i].id === x) return i + 1; return 0; };
    var ok = function (n) { return n >= 1 && n <= N && Math.round(n) === n; };
    var topStep = function (n) { return S(n).steps.length - 1; };
    var chalStep = function (n) { return Math.max(0, topStep(n) - 1); };   // challenges, landings and checks: just below the top
    var hard = function (n) { var s = S(n); return !!(s && (s.noJump || s.fluent)); };
    var pick = function (n) { return Math.floor(rand() * n); };

    function fresh() {
      return { stage: 1, step: 0, stepHist: [], stageHist: [], topHist: [], topCount: 0, missRun: 0, replay: false,
        seen: [], expert: false, sinceReview: 0, solved: 0, skills: {}, last10: [], chal: null, chalRest: 0,
        jump: null, skipped: [], skipMiss: {}, skipGood: {}, jumps: [], revHist: [], stageDays: [], wait: false };
    }
    var st = fresh();
    var visitWarm = 0, sitting = 0, replayed = false, expertNext = false, pendingReview = 0;
    var msg = { note: '', say: '', moved: '' };

    /* ---------- saved progress (by stage id) ---------- */
    function load() {
      var s = null;
      try { s = storage.load(); } catch (e) { s = null; }
      if (!s || typeof s !== 'object') return;
      if (!(Number(s.v) >= 2)) { try { s = o.legacy ? o.legacy(s) : null; } catch (e) { s = null; } }
      if (!s || typeof s !== 'object' || !(Number(s.v) >= 2)) return;
      var n = function (x) { return num(String(x)); };
      st.stage = n(s.sid) || Math.min(N, Math.max(1, Math.round(numv(s.level, 1))));
      st.step = Math.min(topStep(st.stage), Math.max(0, Math.round(numv(s.step, 0))));
      st.stepHist = bits(s.stepHist, 60); st.stageHist = bits(s.stageHist, 10); st.topHist = bits(s.topHist, R.gateTop);
      st.last10 = bits(s.last10, 10); st.revHist = bits(s.revHist, R.fluentReviews);
      ['missRun', 'sinceReview', 'solved', 'topCount', 'chalRest'].forEach(function (k) { st[k] = Math.max(0, Math.round(numv(s[k], 0))); });
      st.expert = !!s.expert; st.wait = !!s.wait;
      st.seen = (Array.isArray(s.seen) ? s.seen : []).map(n).filter(ok).filter(function (x, i, a) { return a.indexOf(x) === i; });
      st.skills = {};
      if (s.skills && typeof s.skills === 'object') Object.keys(s.skills).forEach(function (k) {
        var v = s.skills[k];
        if (num(k) && v && typeof v === 'object') st.skills[k] = { t: Math.max(0, numv(v.t, 0)), f: Math.max(0, numv(v.f, 0)) };
      });
      if (s.chal) { var to = n(s.chal.to); if (ok(to) && to > st.stage) st.chal = { to: to, ok: Math.max(0, numv(s.chal.ok, 0)), demo: !!s.chal.demo }; }
      if (s.jump) {
        var jf = n(s.jump.from), jt = n(s.jump.to);
        if (ok(jf) && jt === st.stage) st.jump = { from: jf, fromStep: Math.max(0, numv(s.jump.fromStep, 0)), to: jt, miss: numv(s.jump.miss, 0), right: numv(s.jump.right, 0) };
      }
      st.skipped = (Array.isArray(s.skipped) ? s.skipped : []).map(n).filter(function (k) { return ok(k) && k < st.stage; })
        .filter(function (x, i, a) { return a.indexOf(x) === i; }).sort(function (a, b) { return a - b; });
      ['skipMiss', 'skipGood'].forEach(function (k) {
        st[k] = {};
        if (s[k] && typeof s[k] === 'object') Object.keys(s[k]).forEach(function (x) { var m = n(x); if (m) st[k][m] = numv(s[k][x], 0); });
      });
      st.jumps = (Array.isArray(s.jumps) ? s.jumps : []).slice(-10).map(function (j) {
        return { from: n(j.from), fromStep: j.fromStep, to: n(j.to), d: String(j.d || today()), back: j.back ? n(j.back) : 0 };
      }).filter(function (j) { return j.from && j.to; });
      st.stageDays = (Array.isArray(s.stageDays) ? s.stageDays : []).map(String).slice(-30);
      if (st.expert && st.stage < N) st.expert = false;   // stages were added after where he finished
      if (o.keep && o.keep.load) o.keep.load(s);
    }

    function save() {
      var ids = function (a) { return a.map(id).filter(Boolean); };
      var byId = function (obj) { var out = {}; Object.keys(obj || {}).forEach(function (k) { var i = id(Number(k)); if (i) out[i] = obj[k]; }); return out; };
      var data = Object.assign({}, o.keep && o.keep.save ? o.keep.save() : {}, {
        v: 2, level: st.stage, sid: id(st.stage), label: label(),
        step: st.step, stepHist: st.stepHist, stageHist: st.stageHist, topHist: st.topHist, topCount: st.topCount, missRun: st.missRun,
        seen: ids(st.seen), expert: st.expert, sinceReview: st.sinceReview, solved: st.solved,
        chal: st.chal ? { to: id(st.chal.to), ok: st.chal.ok, demo: st.chal.demo } : null, chalRest: st.chalRest,
        jump: st.jump ? { from: id(st.jump.from), fromStep: st.jump.fromStep, to: id(st.jump.to), miss: st.jump.miss, right: st.jump.right } : null,
        skipped: ids(st.skipped), skipMiss: byId(st.skipMiss), skipGood: byId(st.skipGood),
        jumps: st.jumps.map(function (j) { return { from: id(j.from), fromStep: j.fromStep, to: id(j.to), d: j.d, back: j.back ? id(j.back) : 0 }; }),
        skills: st.skills, last10: st.last10, revHist: st.revHist, stageDays: st.stageDays, wait: st.wait
      });
      try { storage.save(data); } catch (e) {}
      if (o.onChange) o.onChange();
    }

    function label() { return 'Stage ' + st.stage + ' of ' + N + ': ' + S(st.stage).name; }

    /* ---------- what comes next ---------- */
    var reviewStep = function (n) { return has(st.skipped, n) ? chalStep(n) : topStep(n); };
    function next() {
      if (sitting >= R.sitting) return { card: 'end' };
      if (!has(st.seen, st.stage)) return { card: 'new', stage: st.stage };
      if (st.replay) { st.replay = false; return { card: 'again', stage: st.stage }; }
      if (expertNext) { expertNext = false; return { card: 'expert' }; }
      // a review of a kind he had never been shown: its card and demo came first, now his own go
      if (pendingReview) { var pr = pendingReview; pendingReview = 0; return { stage: pr, step: reviewStep(pr), review: true }; }
      // warm-ups at the start of each visit: easier than where he is (never a kind he hasn't been shown)
      if (visitWarm < R.warmups && st.solved > 0 && (st.stage > 1 || st.step > 0)) {
        visitWarm++;
        if (st.step > 0) return { stage: st.stage, step: st.step - 1, warm: true };
        var w = st.stage - 1; while (w > 1 && !has(st.seen, w)) w--;
        return { stage: w, step: topStep(w), warm: true };
      }
      visitWarm = R.warmups;
      // ⬆️ challenges from further up (a new kind gets its card and demo first)
      if (st.chal) {
        var to = st.chal.to;
        if (!has(st.seen, to) && !st.chal.demo) { st.chal.demo = true; save(); return { card: 'challenge', stage: to }; }
        return { stage: to, step: chalStep(to), challenge: true };
      }
      // every few items, one from an earlier stage (stages he jumped over first)
      if (st.stage > 1 && st.sinceReview >= (st.wait ? R.waitReviewEvery : R.reviewEvery)) {
        st.sinceReview = 0;
        var sk = st.skipped.filter(function (k) { return k < st.stage; });
        var r = sk.length ? sk[pick(sk.length)] : 1 + pick(st.stage - 1);
        if (!has(st.seen, r)) { pendingReview = r; return { card: 'review', stage: r }; }
        return { stage: r, step: reviewStep(r), review: true };
      }
      return { stage: st.stage, step: st.step };
    }

    // The card and demo for a kind were shown: he has now seen it (a challenge's demo only counts if he jumps there).
    function shown(plan) {
      if (plan && (plan.card === 'new' || plan.card === 'review') && !has(st.seen, plan.stage)) { st.seen.push(plan.stage); save(); }
    }

    /* ---------- after each item ---------- */
    function result(plan, clean) {
      msg = { note: '', say: '', moved: '' };
      var sk = st.skills[id(plan.stage)] || (st.skills[id(plan.stage)] = { t: 0, f: 0 });
      sk.t++; if (clean) sk.f++;
      push(st.last10, clean ? 1 : 0, 10);
      st.solved++; sitting++;
      if (st.stageDays[st.stageDays.length - 1] !== today()) push(st.stageDays, today(), 30);
      if (plan.review) push(st.revHist, clean ? 1 : 0, R.fluentReviews);
      if (plan.challenge) challengeResult(clean);
      else if (plan.review && has(st.skipped, plan.stage)) skippedResult(plan.stage, clean);
      else if (!plan.warm && !plan.review) levelResult(clean);
      else st.missRun = clean ? 0 : st.missRun + 1;
      if (st.wait && fluentReady()) nextStage();
      save();
      return { note: msg.note, say: msg.say, moved: msg.moved };
    }

    function resetStage(step) {
      st.step = step; st.stepHist = []; st.stageHist = []; st.topHist = []; st.topCount = 0;
      st.missRun = 0; st.sinceReview = 0; st.stageDays = []; st.wait = false;
    }
    function setStep(s) {
      st.step = Math.max(0, Math.min(topStep(st.stage), s)); st.stepHist = [];
      if (st.step < topStep(st.stage)) { st.topHist = []; st.topCount = 0; }
    }

    function levelResult(clean) {
      var r = clean ? 1 : 0;
      st.missRun = clean ? 0 : st.missRun + 1;
      if (st.chalRest > 0) st.chalRest--;
      // just jumped? too many misses before settling in -> back to the first stage he skipped
      if (st.jump && st.jump.to === st.stage) {
        if (clean) st.jump.right++; else st.jump.miss++;
        if (st.jump.miss >= R.backMiss && st.jump.right < R.backSafe) { stepBack(); return; }
        if (st.jump.right >= R.backSafe) st.jump = null;
      }
      var firstRun = st.step < topStep(st.stage) ? st.stepHist : st.topHist;
      if (clean && firstRun.length + 1 === R.chalAfter && sum(firstRun) + 1 === R.chalAfter) offerChallenge();
      if (st.missRun >= R.replayAfterMisses) { st.missRun = 0; if (!replayed) { st.replay = true; replayed = true; } }
      push(st.stageHist, r, 10);
      st.sinceReview++;
      var top = topStep(st.stage);
      if (st.step < top) {
        st.stepHist.push(r);
        var h = st.stepHist, last = h.slice(-R.upWindow);
        if ((h.length === R.upFirst && sum(h) === R.upFirst) || (last.length >= R.upWindow && sum(last) >= R.upNeed)) setStep(st.step + 1);
        else if (st.step > 0 && h.length >= R.downMisses && h.slice(-R.downMisses).every(function (x) { return x === 0; })) setStep(st.step - 1);
      } else {
        push(st.topHist, r, R.gateTop);
        var t = st.topHist;
        st.topCount++;
        var fast = st.topCount === R.fastTop && t.length === R.fastTop && sum(t) === R.fastTop;
        var steady = t.length >= R.gateTop && sum(t) >= R.gateTopNeed && clean;
        if ((fast || steady) && !st.wait) {
          if (st.stage < N && S(st.stage + 1).fluent && !fluentReady()) st.wait = true;   // passed: the harder kind waits until he's fluent
          else nextStage();
        } else if (t.length >= R.downMisses && t.slice(-R.downMisses).every(function (x) { return x === 0; }) && top > 0) setStep(top - 1);
      }
    }

    // Fluent enough for a harder kind: still right at the top of this stage, 8 of his last 10 reviews right,
    // and he has played this stage on at least 3 different days.
    function fluentReady() {
      var rev = st.revHist.slice(-R.fluentReviews), t = st.topHist.slice(-R.gateTop);
      var topOk = st.step === topStep(st.stage) && t.length >= R.fastTop && sum(t) * R.gateTop >= t.length * R.gateTopNeed;
      return topOk && rev.length >= R.fluentReviews && sum(rev) >= R.fluentNeed && st.stageDays.length >= R.fluentDays;
    }

    function nextStage() {
      st.wait = false;
      if (st.stage >= N) {
        if (!st.expert) { st.expert = true; expertNext = true; }
        st.stageHist = []; st.topHist = []; st.topCount = 0;
        return;
      }
      st.stage++; resetStage(0); st.jump = null; st.chal = null;
      msg.moved = 'up';
    }

    /* ---------- finding his level: challenges, jumps and the safety nets ---------- */
    // How far a challenge can reach: up to chalStages ahead, never into or over a stage marked noJump or fluent.
    function challengeTarget() {
      var to = st.stage;
      for (var k = 1; k <= R.chalStages && st.stage + k <= N; k++) { if (hard(st.stage + k)) break; to = st.stage + k; }
      return to > st.stage ? to : 0;
    }
    function offerChallenge() {
      if (st.chal || st.chalRest > 0 || st.jump || st.wait) return;
      var to = challengeTarget();
      if (to) st.chal = { to: to, ok: 0, demo: false };
    }
    function challengeResult(clean) {
      if (!st.chal) return;
      if (!clean) { st.chal = null; st.chalRest = R.chalRest; return; }   // costs nothing: back to his own items, no step lost
      st.chal.ok++;
      if (st.chal.ok >= R.chalNeed) doJump(st.chal.to);
    }
    function doJump(to) {
      var from = st.stage, fromStep = st.step;
      for (var k = from; k < to; k++) if (!has(st.skipped, k)) st.skipped.push(k);
      st.skipped.sort(function (a, b) { return a - b; });
      push(st.jumps, { from: from, fromStep: fromStep, to: to, d: today(), back: 0 }, 10);
      st.jump = { from: from, fromStep: fromStep, to: to, miss: 0, right: 0 };
      st.stage = to; resetStage(chalStep(to));
      if (!has(st.seen, to)) st.seen.push(to);
      st.chal = null;
      msg = { note: '⬆️ Moving up to Stage ' + to + ': ' + S(to).name + '!', say: 'Brilliant! You’re moving up to stage ' + to + '.', moved: 'jump' };
    }
    // After a jump that was too big: back to the first stage he skipped, a step below its top, without fuss.
    function stepBack() {
      var j = st.jump; st.jump = null;
      var back = Math.min.apply(null, st.skipped.filter(function (k) { return k >= j.from && k < j.to; }).concat([j.from]));
      st.skipped = st.skipped.filter(function (k) { return k < back; });
      st.stage = back; resetStage(Math.min(chalStep(back), back === j.from ? j.fromStep : chalStep(back)));
      st.chalRest = R.chalRest * 2;
      var last = st.jumps[st.jumps.length - 1]; if (last) last.back = back;
      msg = { note: 'Let’s practise this kind a bit more first.', say: '', moved: 'back' };
    }
    // Reviews from a stage he jumped over: 3 right -> confirmed; 3 missed (and more missed than right) -> back to that stage.
    function skippedResult(stage, clean) {
      st.missRun = clean ? 0 : st.missRun + 1;
      if (clean) {
        st.skipGood[stage] = (st.skipGood[stage] || 0) + 1;
        if (st.skipGood[stage] >= R.skipOk) { st.skipped = st.skipped.filter(function (k) { return k !== stage; }); delete st.skipGood[stage]; delete st.skipMiss[stage]; }
        return;
      }
      st.skipMiss[stage] = (st.skipMiss[stage] || 0) + 1;
      if (st.skipMiss[stage] >= R.skipBackMiss && st.skipMiss[stage] > (st.skipGood[stage] || 0)) {
        st.skipped = st.skipped.filter(function (k) { return k < stage; }); delete st.skipMiss[stage]; delete st.skipGood[stage];
        st.jump = null; st.chal = null; st.chalRest = R.chalRest * 2;
        st.stage = stage; resetStage(chalStep(stage));
        var last = st.jumps[st.jumps.length - 1]; if (last) last.back = stage;
        msg = { note: 'Let’s practise this kind a bit more first.', say: '', moved: 'back' };
      }
    }

    /* ---------- grown-ups ---------- */
    function canUndo() { var j = st.jumps[st.jumps.length - 1]; return !!(j && !j.back && j.to === st.stage); }
    function undoJump() {
      var last = st.jumps[st.jumps.length - 1];
      if (!canUndo()) return;
      st.jump = null; st.chal = null; st.chalRest = R.chalRest * 2;
      st.skipped = st.skipped.filter(function (k) { return k < last.from; });
      last.back = last.from;
      st.stage = last.from; resetStage(Math.min(topStep(last.from), last.fromStep != null ? last.fromStep : chalStep(last.from)));
      save();
    }
    // A grown-up chose a stage: it starts at its first step, with no warm-ups first.
    function moveTo(n) {
      st.stage = Math.min(N, Math.max(1, n)); resetStage(0); st.replay = false; visitWarm = R.warmups; pendingReview = 0;
      st.chal = null; st.jump = null; st.chalRest = 0; st.skipped = st.skipped.filter(function (k) { return k < st.stage; });
      save();
    }
    // "Start again from stage 1": every kind is new again (cards and demos); his record by skill is kept.
    function restart() {
      st.seen = []; st.expert = false; st.skipped = []; st.skipMiss = {}; st.skipGood = {}; st.jumps = []; st.revHist = [];
      sitting = 0; replayed = false; expertNext = false;
      moveTo(1);
    }
    function easier() { setStep(st.step - 1); save(); }
    function harder() { setStep(st.step + 1); save(); }

    // The 👪 panel's words, from the same numbers the ladder uses.
    function panel() {
      var s = st.stage, G = S(s), L = G.steps[st.step] || {};
      var where = 'Stage ' + s + ' of ' + N + ': ' + G.name + ' — step ' + (st.step + 1) + ' of ' + G.steps.length + (L.note ? ': ' + L.note : '') + '.';
      if (st.last10.length) where += ' Right first time: ' + sum(st.last10) + ' of his last ' + st.last10.length + ' ' + W.items + '.';
      var rule = 'Next step: the first ' + R.upFirst + ' at a step right first time, or ' + R.upNeed + ' of the last ' + R.upWindow + '. ' +
        R.downMisses + ' misses in a row: one step easier. Next stage, from the last step: the first ' + R.fastTop + ' there all right first time, or ' +
        R.gateTopNeed + ' of the last ' + R.gateTop + ' right first time (about 80%) and the last one right.';
      rule += st.step === topStep(s) ? ' So far at the last step: ' + sum(st.topHist) + ' of his last ' + st.topHist.length + '.'
        : ' So far at this step: ' + sum(st.stepHist) + ' of ' + st.stepHist.length + '.';
      if (s < N && S(s + 1).fluent) {
        var rev = st.revHist.slice(-R.fluentReviews);
        rule += ' Next comes ' + S(s + 1).name + ', a harder kind. It opens by itself once he is fluent: this stage passed, ' + R.fluentNeed + ' of his last ' +
          R.fluentReviews + ' “remember this one?” ' + W.items + ' right (now ' + sum(rev) + ' of ' + rev.length + '), and this stage played on at least ' +
          R.fluentDays + ' different days (now ' + st.stageDays.length + ').' + (st.wait ? ' He has passed this stage; until then he keeps practising it, with more reviews mixed in.' : '');
      }
      if (st.expert) rule += ' He has finished all ' + N + ' stages (' + W.expert + ') – it keeps going with mixed practice.';
      var chal = 'Challenges: after the first ' + R.chalAfter + ' right at a step, ' + R.chalNeed + ' ⬆️ challenge ' + W.items + ' from up to ' + R.chalStages +
        ' stages ahead (never into a harder kind); all ' + R.chalNeed + ' right first time → he moves up there. A missed challenge costs nothing.';
      if (st.chal) chal += ' A challenge from stage ' + st.chal.to + ' is on (' + st.chal.ok + ' of ' + R.chalNeed + ' right).';
      if (st.jumps.length) chal += ' Jumps: ' + st.jumps.map(function (j) {
        return 'stage ' + j.from + ' → ' + j.to + ' (' + j.d.slice(8) + '/' + j.d.slice(5, 7) + ')' + (j.back ? ', went back to stage ' + j.back : '');
      }).join('; ') + '.';
      if (st.skipped.length) chal += ' Stages he jumped over (or that are new since he passed them), still being checked: ' +
        st.skipped.map(function (k) { return k + '. ' + S(k).name; }).join(', ') + '.';
      return {
        where: where, rule: rule, chal: chal, canUndo: canUndo(),
        stages: LIST.map(function (G2, i) { return { n: i + 1, id: G2.id, name: G2.name, current: i + 1 === s }; }),
        skills: LIST.map(function (G2) { var k = st.skills[G2.id]; return { name: G2.name, f: k ? k.f : 0, t: k ? k.t : 0 }; })
      };
    }

    load();
    return {
      RULES: R, stages: LIST, top: N, state: st,
      S: S, id: id, num: num, topStep: topStep, chalStep: chalStep,
      get stage() { return st.stage; }, get step() { return st.step; },
      next: next, shown: shown, result: result, label: label, panel: panel,
      moveTo: moveTo, restart: restart, easier: easier, harder: harder, undoJump: undoJump, canUndo: canUndo,
      newSitting: function () { sitting = 0; replayed = false; },
      sitting: function () { return sitting; },
      fluentReady: fluentReady, save: save, load: load
    };
  }

  window.Ladder = { create: create, RULES: RULES };
})();
