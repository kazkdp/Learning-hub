# Learning Hub – design rules

Every game and page on the hub follows these rules, so hundreds of separately built pages work as one app.

- 🔒 = Kas's own rule. Don't change it or work around it without asking him.
- Everything else is how the hub already works. If there's a good reason to change a rule, change it here, never in just one game.
- The technical contract (stars.js, the safety line, `list.txt`, the checker) is in `AI-INSTRUCTIONS.md`. The research behind these rules is kept with Kas's project notes.

Last updated: 19 Nov 2026.

## 1. The hub frame: the same in every game

A child who has played one game already knows how every other game starts, shows, helps, rewards and ends. Keep these identical.

1. **Top bar.** `kit/stars.js` (or the kit's bar on hub-made pages) draws it: Home, section, game name, ⭐ total. Nothing else is fixed to the top of the screen.
2. **The same flow.** Start card → for a new kind of puzzle, the New-kind card and a Watch-me demo → one item at a time → at the end of a sitting (default 10 items), `Stars.done()` and the end card → Keep going.
3. **The same words.** Copy these exactly:
   - Start card: one big **Start** button (it also lets sound and voice play).
   - New kind: **✨ New kind of puzzle!**, the stage name, one line saying what's new, then "Stage N of 5. Watch me do the first one."
   - Demo banner: **👀 Watch me – this is a demo** / "You don't need to press anything yet".
   - After the demo: "That's how you do it. Now it's your turn!" and a big **Your turn →** button.
   - Harder version of a kind already learned: **⬆️ Next stage!** and one line saying what's new.
   - End of sitting: "That's 10 *[sums / questions / sentences]*! 🎉 Have a rest, or keep going." with **Keep going**.
   - Top of the game: one "*[Name]* expert! 🏆" card, then it carries on.
4. **The same feedback.** Right first time: the hub's star flies and chimes (no fanfare of the game's own). Wrong: a soft sound, a small wobble, and the wrong choice greys out. No buzzer, no "Wrong!", no red crosses.
5. **The same help** (§5).
6. **The same grown-ups button 👪** and panel (§8), in a corner away from the play area.
7. **The same voice and sound.** en-GB voice; soft sounds; one sound on/off that follows the shared `sounds` setting; read-aloud follows the shared `readAloud` setting; "reduce motion" is respected.
8. **The same characters** *(proposed, Kas to confirm)*. Ollie the owl is the guide in every game: he does the demos, introduces new kinds and celebrates at the end. Leo, Maya, Milo the cat and Rex the dog are the cast for scenes. Reuse the drawn characters (`writing/sentences/cast.js`, `writing/sentences/friends.js`); never draw a new Ollie.
9. **The same saving.** `Stars.save()` / `Stars.load()` only, with `level` (a number) and `label` ("Stage N of 5: *name*") so the tiles show where the child is.
10. 🔒 **No links off the site.** No links to YouTube, Storyline Online or anywhere else. Credits are plain text. Videos play inside the page in the hub's locked player.

**What may differ between games:** the art and setting (within §2), the puzzle mechanics, the number of stages and levels, and the sitting length when there's a reason (Ask and Find Out uses 8).

## 2. Look and feel

- 🔒 Premium but calm: plain backgrounds, few colours, not much happening at once, and the objects themselves drawn really well. Too bright or busy distracts.
- One thing moving at a time. Movement slow and smooth enough to follow; nothing whizzing or flashing.
- 🔒 Only one thing on screen telling the child what to do, placed where they are looking.
- Big targets: at least 48px, keypads and main buttons 52px or more. Works with touch, mouse and keyboard.
- Chromebook first, and it must also work on tablets and phones. Laptop and tablet fit without scrolling; a phone held upright fits one screen where possible.
- Plain words, British spelling.
- Scores, skill numbers and percentages are for grown-ups only (the 👪 panel), never on the child's screen.

## 3. Starting and moving on

- 🔒 A very gradual start. A child who has never met the topic must be able to start and succeed from the first screen.
- 🔒 Inside a stage, make it harder through the content (bigger numbers, more colours, longer bits, more pieces), not with new kinds of question.
- 🔒 New kinds of puzzle come slowly, with plenty of levels of each before the next new kind. The harder kinds (what's missing, spot the wrong one, find the mistake) come near the end of the game.
- 🔒 Don't move on until the child is confident. A child who is clearly getting it moves faster, and steps back if a jump was too big.
- 🔒 Aim for about 80% right first time.
- 🔒 Show the same idea on different things (a pattern on a train, a necklace, tiles…) so the child learns the idea, not one picture.

### Default levelling

Copy these numbers unless there's a reason not to, and keep them in a `RULES` table at the top of the game's script.

| Rule | Default |
|---|---|
| Harder | 4 of the last 5 new items right first time (a bigger step if all 5) |
| Easier | 3 misses in the last 5, or 2 in a row |
| One slip | Holds steady |
| Next stage | 8 of the last 10 new items right first time, including 4 of the last 5 asked near the top of the stage, and the last one right |
| Two-choice questions | 9 of the last 10, and the last 5 near the top all right (guessing alone gets half right) |
| Fast track | The first few at a level all right → move on straight away (Sentence Studio: the first 2 at a step; Patterns: the first 10 all right → jump up to 5 levels, never past the end of the current kind) |
| Step back | After a jump, too many misses → back to the skipped levels (Patterns: 5 misses before 6 right) |
| Warm-ups | 2 easier items at the start of every visit |
| Reviews | After every 4 new items, 1 from an earlier stage or a finished kind, never the kind being learned now |
| Don't count | Warm-ups, reviews and repeats give stars but don't move the level |
| Demo again | After 3 new items missed in a row (once a sitting) |
| Sitting | 10 items, then `Stars.done()` and the end card |
| Expert | After the last stage to the same standard: one Expert card, then it carries on |

**Check the levelling before publishing** by simulating pretend children (always right, 9 in 10, 8 in 10, 7 in 10, 6 in 10, and one tapping at random):

- the random tapper almost never gets past stage 1;
- a beginner stays at about 75–85% right first time;
- an 8-in-10 child moves on, slowly;
- in a 5-stage game, an always-right child reaches the end in about 6–8 sittings.

## 4. Showing how (demos)

- 🔒 Every new kind of puzzle gets a big, centred "✨ New kind of puzzle!" card, never tucked at the side.
- 🔒 Then a demo that plays by itself and is obviously a demo: the blue Watch-me banner, a pretend finger (or Ollie) doing a small, easy example, and the voice saying each step. Nothing to press to start it; taps are ignored while it plays.
- Then the green "your turn" banner and the big **Your turn →** button.
- A harder version of a kind already learned gets only the "⬆️ Next stage!" card.
- The demo plays again after 3 misses in a row, and grown-ups can replay it from the 👪 panel.

## 5. Mistakes and help

- Never punish: no buzzer, no "Wrong!", no red crosses, no lost stars or levels for one slip. Every attempt gets a friendly response.
- The wrong choice greys out or wobbles back, so the same mistake can't be repeated.
- Help comes in steps, and the answer is never the first help:
  1. Nothing tapped for about 9–15 seconds: gently pulse where to look and say the question again.
  2. After a miss: a short tip saying where to look.
  3. After 2–3 misses: the right part of the picture, or the right card, glows.
  4. After 3–5 misses on the same thing: it's shown or done for the child, and play carries on.
- Ignore taps for about 0.7 seconds after a miss, so tapping everything doesn't work.
- Design out guessing: shuffle answer positions; make wrong answers about as long as the right one (the longest answer mustn't be a clue); make "tap everything" fail (in Addition stage 2, one ball too many and they all bounce back out).
- **Next** appears only once it's solved, and play moves on by itself after about 2 seconds.

## 6. Stars (site rule)

- One star for each thing right first time, given only by `kit/stars.js`. Exactly one `Stars.win` or `Stars.miss` per item; `Stars.miss` at the first mistake.
- No stars, points, coins, streaks or win sounds of the game's own.
- Skill names: 3–8 per game, plain words a parent understands. Where two games practise the same skill, use the same name, so My Stars can follow one skill across games. Names in use are listed in §10.
- Questions from a fixed list get an id (`Stars.win('Skill', 'id')`), so each pays once a day.

## 7. Content

- 🔒 Teach something real. Facts must be true and checked; leave out anything unclear. Keep it at a level a primary-school child understands.
- A short "I wonder…" fact after an answer is welcome (grown-ups can turn these off).
- Choice where it costs nothing: let the child pick the world, the box, the picture.
- Use the child's interests as topics and worlds where possible.
- Never the same puzzle twice in a row; mix the kinds; easy kinds come back between harder ones.
- Make the answer the reward where possible: the box opens, the scene reacts, the reason fixes the problem.
- Where it fits, end a sitting with something to do in real life (ask a grown-up a question, find a pattern at home).
- 🔒 Story questions: about 80% right first time, and only things that are definitely in the story. Full rules: `story-time/AI-INSTRUCTIONS.md`.

## 8. The grown-ups panel 👪

The same contents, in this order:

1. Where the child is, in plain words ("Stage 2 of 5: Take just enough – sums up to 9 at the moment").
2. Right first time in the last 10, and by skill.
3. The moving-on rule, with progress ("7 of the last 10 – needs 8").
4. Move to any stage; easier / harder.
5. Show how to play (replays the demo).
6. Sounds on/off and voice on/off (plus calm mode or "I wonder…" facts if the game has them).
7. Start again from stage 1: tap twice; stars are kept.

## 9. Before publishing

- [ ] `node tools/check-game.mjs <file>` says OK.
- [ ] A complete beginner can start and gets the first items right.
- [ ] Levelling simulated (§3); the numbers are in the `RULES` table.
- [ ] Every new kind has its card and demo; the harder kinds come near the end.
- [ ] Wrong answers: no buzzer, greyed out, help steps up, the answer is never the first help.
- [ ] The hub frame (§1): same words, 👪 panel, end card, `Stars.done()`.
- [ ] Calm: one thing moving, one instruction, no scores on the child's screen.
- [ ] Screen sizes: 1366×650, 1024×768, 1920×1080, 768×1024, 390×844, 844×390.
- [ ] Works in practice mode, and works when stars.js can't load.
- [ ] No links off the site; facts checked.
- [ ] Own script files linked with `?v=N` (bumped when changed); a test hook `window.<name>Game`.
- [ ] One line added to `list.txt`; checked live after publishing (the bar shows the section and a star flies).

## 10. Skill names in use

Reuse these where a new game practises the same thing.

| Game | Skill names |
|---|---|
| Addition | Putting together · Taking just enough · Counting on · Counting on: bigger numbers · Missing number |
| More or Less | Which has more · More: close numbers · Which has less · More or less: mixed · Symbols < = > |
| Ask and Find Out | Asking what · Asking where · Asking who · Asking why · Using the reason · Asking my own questions · Asking a real person |
| Sentence Studio | Who and doing · Adding what · Adding where · Word by word · Asking questions · Joining words · Fixing sentences |
