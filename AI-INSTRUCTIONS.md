# Learning Hub – rules for making a game or page

You are making one learning page (a game, quiz or activity) for the Learning Hub, a website where a 10-year-old in the UK learns at home. The hub already does the stars, the saving, the Home button and the bar across the top. Your job is only the game itself. Follow these rules exactly.

## 1. One file, starting like this

Make one self-contained HTML file (HTML, CSS and JavaScript together; no build step, nothing to install). It must work on a Chromebook and a phone, with touch and a mouse. Start it exactly like this:

    <!DOCTYPE html>
    <html lang="en-GB">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="robots" content="noindex, nofollow">
      <title>Name of the Game</title>
      <script src="https://kazkdp.github.io/Learning-hub/kit/stars.js"></script>
      <script>window.Stars = window.Stars || { win() {}, miss() {}, done() {}, save() {}, load() { return null; }, total() { return 0; } };</script>

The first script is the hub's star system. The second line keeps the game working if the first can't load (for example in a preview). Keep both lines exactly as they are.

## 2. Stars: one call per question

For every question or puzzle, call exactly one of these, once:

- Right on the FIRST go: `Stars.win('Skill name')`
- Wrong on the first go (even if right later): `Stars.miss('Skill name')`

That is the star rule for the whole site: one star for each thing right first time. Never call `Stars.win()` for anything else: not for finishing, bonuses, streaks or levels.

`'Skill name'` is a short, plain name for what the question practises, like `'Adding up'`, `'Capital cities'` or `'Reading the clock'`. Use the same 3 to 12 names all through the game (one for each kind of question). The grown-ups' page uses them to show what is easy and what is harder.

If the questions come from a fixed list (the same questions every time), give each one a short id that never changes. Then a question pays a star only once a day:

    Stars.win('Capital cities', 'france')
    Stars.miss('Capital cities', 'france')

If the game makes new questions each time, leave the id out.

When a round or the whole game ends, call `Stars.done()`. The hub shows a small "well done" with the stars won.

## 3. Don't build these – the hub does them

- No star counter, score, points, coins or reward screen of your own, and no sound for winning a star (the hub plays one). "Correct!" and "Well done!" messages are fine.
- No Home button and no bar at the top. The hub adds a bar 56px tall across the top with Home, the section, the game's name (from your `<title>`) and the stars.
- Nothing fixed or sticky at the top of the screen (it would sit under the hub's bar). If the game fills the whole screen, make it 56px shorter: `height: calc(100vh - 56px)`.
- Don't use localStorage, sessionStorage or cookies.
- The grown-ups button (👪, for settings and progress) must open only with a press-and-hold, so a child can't change his level with one tap. Don't build that yourself: mark the button `data-grownups` and add `<script src="https://kazkdp.github.io/Learning-hub/kit/kit.js"></script>` after the two lines in §1.

## 4. Levels: use the hub's ladder (only if the game has levels)

Every hub game with levels moves on the same way, using the hub's ladder. Add one more line after the two above:

      <script src="https://kazkdp.github.io/Learning-hub/kit/ladder.js"></script>

Describe the stages (stage 1 must be the very simplest thing; one new idea per stage; 3–4 steps in each, every step changing one thing), then ask the ladder what comes next and tell it how each question went. It saves the level itself (with `Stars.save`), so don't save it yourself.

    const ladder = Ladder.create({
      stages: [
        { id: 'small', name: 'Small numbers', skill: 'Adding up', steps: [{ note: 'up to 5' }, { note: 'up to 10' }, { note: 'up to 20' }] },
        { id: 'tens', name: 'Adding tens', skill: 'Adding tens', steps: [{ note: '10 + 20' }, { note: '30 + 40' }, { note: 'any tens' }] }
      ],
      words: { items: 'sums', expert: 'Adding expert' }
    });

    function next() {
      const plan = ladder.next();
      if (plan.card === 'end')    { Stars.done(); /* show "That's 10! Have a rest, or keep going." */ ladder.newSitting(); return; }
      if (plan.card === 'expert') { /* show "Expert! 🏆" once, then carry on */ return; }
      if (plan.card)              { /* "✨ New kind of puzzle!" + a short demo of plan.stage */ ladder.shown(plan); return; }
      showQuestion(plan.stage, plan.step, plan);   // make one question for that stage and step
    }
    // when the question is solved:
    const out = ladder.result(plan, rightFirstTime);   // out.note: a line to show, like "⬆️ Moving up to Stage 2!"

Mark a stage `same: true` if it's the same idea with bigger numbers (no new demo), `noJump: true` if it is a new idea he may not know yet, and `fluent: true` for the harder, more abstract kinds near the end (they open only once he is fluent). Give every stage an `id` that never changes.

If the ladder can't load (some previews), start at the first stage and keep going: `const ladder = window.Ladder ? Ladder.create({ … }) : null;`.

Without levels, nothing to save. (A game that keeps something else between visits can still use `Stars.save({ … })` and `Stars.load()`.)

## 5. How the games should feel

- Start easy enough for any child who has never met the topic. The ladder (§4) only moves him on when he is confident; give each kind of question plenty of steps.
- A new kind of question gets a big, clear "New kind of puzzle!" message, then a short demo that plays by itself and obviously says it is a demo, then "Your turn".
- Wrong answers: no buzzer and no "Wrong!". Grey out the choice and let him try again. Hints point to where to look; they never give the answer.
- Big buttons (at least 48px tall), plain words, British spelling, calm friendly colours.
- The full rules for how every hub game looks, levels up, shows how and helps are in `DESIGN-RULES.md` (live copy: https://kazkdp.github.io/Learning-hub/DESIGN-RULES.md). Follow them too. Where it and this file differ, this file wins on the technical parts (stars, saving, the top bar).

## 6. Check it, then tell Kas three things

If you can preview the page, the bar at the top says "Practice" (stars only save once the page is on the hub) and a star flies up to the counter for each thing right first time. In some previews the bar can't load at all; the game must still work without it.

When it's finished, tell Kas:

1. the file name, lowercase with dashes (for example `telling-the-time.html`)
2. which section it belongs in (Maths, Reading, Story Time, Questions, or a new one such as Geography)
3. one line for the hub's contents list, in this form:

        Maths | Time | Telling the Time | maths/telling-the-time.html | 🕒

## Small example

    <p>What is the capital of France?</p>
    <button onclick="answer(this, true)">Paris</button>
    <button onclick="answer(this, false)">Rome</button>
    <script>
      let missed = false;
      function answer(button, right) {
        if (!right) {
          if (!missed) Stars.miss('Capital cities', 'france');
          missed = true;
          button.disabled = true;   // grey it out and let him try again
          return;
        }
        if (!missed) Stars.win('Capital cities', 'france');
        missed = false;
        // say "Correct!" and go on to the next question
      }
    </script>
