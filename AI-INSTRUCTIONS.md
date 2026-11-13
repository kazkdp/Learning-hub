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

`'Skill name'` is a short, plain name for what the question practises, like `'Adding up'`, `'Capital cities'` or `'Reading the clock'`. Use the same 3 to 8 names all through the game. The grown-ups' page uses them to show what is easy and what is harder.

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

## 4. Remembering the level (only if the game has levels)

    const saved = Stars.load();                    // at the start: null the first time
    Stars.save({ level: 3, anythingElse: 'ok' });  // after each question

Put the level number in `level` so it shows on the hub's tiles. Anything that can be turned into JSON is fine.

## 5. How the games should feel

- Start easy enough for any child. Only get harder when he is confident (for example 4 of his last 5 right first time). Don't move on to a new kind of question too fast: give each kind plenty of levels.
- A new kind of question gets a big, clear "New kind of puzzle!" message, then a short demo that plays by itself and obviously says it is a demo, then "Your turn".
- Wrong answers: no buzzer and no "Wrong!". Grey out the choice and let him try again. Hints point to where to look; they never give the answer.
- Big buttons (at least 48px tall), plain words, British spelling, calm friendly colours.

## 6. Check it, then tell Kas three things

If you can preview the page, the bar at the top says "Practice" (stars only save once the page is on the hub) and a star flies up to the counter for each thing right first time. In some previews the bar can't load at all; the game must still work without it.

When it's finished, tell Kas:

1. the file name, lowercase with dashes (for example `telling-the-time.html`)
2. which section it belongs in (Maths, Reading, Story Time, or a new one such as Geography)
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
