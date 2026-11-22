# Learning Hub – design rules

Every game and page on the hub follows these rules, so hundreds of separately built pages work as one app.

- 🔒 = Kas's own rule. Don't change it or work around it without asking him.
- Everything else is how the hub already works. If there's a good reason to change a rule, change it here, never in just one game.
- The technical contract (stars.js, the safety line, `list.txt`, the checker) is in `AI-INSTRUCTIONS.md`. The research behind these rules is kept with Kas's project notes.

Last updated: 22 Nov 2026.

## 1. The hub frame: the same in every game

A child who has played one game already knows how every other game starts, shows, helps, rewards and ends. Keep these identical.

1. **Top bar.** `kit/stars.js` (or the kit's bar on hub-made pages) draws it: Home, section, game name, ⭐ total. Nothing else is fixed to the top of the screen.
2. **The same flow.** Start card → for a new kind of puzzle, the New-kind card and a Watch-me demo → one item at a time → at the end of a sitting (default 10 items), `Stars.done()` and the end card → Keep going.
3. **The same words.** Copy these exactly:
   - Start card: one big **Start** button (it also lets sound and voice play).
   - New kind: **✨ New kind of puzzle!**, the stage name, one line saying what's new, then "Stage N of *[number of stages]*. Watch me do the first one."
   - Demo banner: **👀 Watch me – this is a demo** / "You don't need to press anything yet".
   - After the demo: "That's how you do it. Now it's your turn!" and a big **Your turn →** button.
   - Harder version of a kind already learned: **⬆️ Next stage!** and one line saying what's new.
   - End of sitting: "That's 10 *[sums / questions / sentences]*! 🎉 Have a rest, or keep going." with **Keep going**.
   - Top of the game: one "*[Name]* expert! 🏆" card, then it carries on.
4. **The same feedback.** Right first time: the hub's star flies and chimes (no fanfare of the game's own). Wrong: a soft sound, a small wobble, and the wrong choice greys out. No buzzer, no "Wrong!", no red crosses.
5. **The same help** (§5).
6. **The same grown-ups button 👪** and panel (§8), in a corner away from the play area. It opens only with a press-and-hold of about a second (mark the button `data-grownups`; `kit/kit.js` does the rest), so a child can't change his stage with one tap (22 Nov 2026: that is how Addition's stage 5 was reached).
7. **The same voice and sound.** en-GB voice; soft sounds; one sound on/off that follows the shared `sounds` setting; read-aloud follows the shared `readAloud` setting; "reduce motion" is respected.
8. **The same characters** *(proposed, Kas to confirm)*. Ollie the owl is the guide in every game: he does the demos, introduces new kinds and celebrates at the end. Leo, Maya, Milo the cat and Rex the dog are the cast for scenes. Reuse the drawn characters (`writing/sentences/cast.js`, `writing/sentences/friends.js`); never draw a new Ollie.
9. **The same saving.** `Stars.save()` / `Stars.load()` only, with `level` (a number) and `label` ("Stage N of M: *name*") so the tiles show where the child is. A game on the ladder gets this from `kit/ladder.js`, which also names stages by id.
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
- 🔒 Aim for about 80% right first time. Every game moves on at about 80% (by default 8 of the last 10; two-choice questions 9 of 10, because guessing alone gets half right). Kas chose to keep this in every game rather than a stricter bar for some (22 Nov 2026). Fluency comes from variety and reviews, not a higher bar.
- 🔒 **Autistic children first: fluency before anything abstract** (Kas, 22 Nov 2026). Follow the school order, but stretch it out: the concrete basics take a long time and must be fluent (right across many different pictures, characters and sittings) before anything harder or more abstract. When a child is ready to move, move *sideways* first (new pictures, characters, places, longer versions of the same thing) before *up*. Topics autistic children find especially hard come very late, one at a time, with the picture showing the meaning. In English: names long before he/she/they, and I/you last; plurals by counting things you can see long before the "belongs to" apostrophe (Rex's bone); tense only when the picture shows the time; mixing look-alikes (dogs / dog's) at the very end. A quick start may skip only what the child already does well; it never jumps into a new, harder kind.
- 🔒 **Harder kinds open by themselves, only when he's fluent** (Kas, 22 Nov 2026). No grown-up switch: when the child is fluent at what comes before, the next harder kind is introduced slowly (its own card and demo, lots of small steps) and he gets plenty of time to become fluent with it before anything else new. Stages are named by id in saved progress, so a new stage can be slotted into a ladder later without moving anyone's place; a child already past it gets it through reviews first.
- 🔒 Show the same idea on different things (a pattern on a train, a necklace, tiles…) so the child learns the idea, not one picture.

### The ladder: every game with stages uses `kit/ladder.js`

One engine, so every game starts, moves on, finds a child's level and comes back the same way (22 Nov 2026; Sentence Studio and Addition are on it, the other games move over one at a time). The game draws the puzzles, cards and demos; the ladder decides what comes next and keeps the saved progress. Its numbers are in `Ladder.RULES`; a game passes only what differs (a two-choice game needs a stricter gate).

| Rule | The ladder's default |
|---|---|
| Steps | Each stage has 3–4 steps; each step changes one thing (bigger numbers, more parts, less help) |
| Harder | The first 2 at a step right first time → the next step; otherwise 4 of the last 5 |
| Easier | 2 misses in a row → one step easier; one slip holds steady |
| Next stage | At the top step: the first 5 there all right first time, or 8 of the last 10 and the last one right (about 80%) |
| Two-choice questions | 9 of the last 10 at the top (guessing alone gets half right) |
| Finding his level | After the first 2 right at a step, ⬆️ challenge items from up to 2 stages ahead; 3 in a row right first time → he moves there, landing just below the top of that stage. A missed challenge costs nothing. Never into or over a stage marked `noJump` or `fluent` |
| Step back | After a jump, 3 misses before 5 right → back to the first stage he skipped. Skipped stages come back as reviews: 3 right confirms one; 3 missed (more missed than right) → back to it. The 👪 panel can undo the last jump |
| Harder kinds | A stage marked `fluent` opens by itself only when he is fluent: the stage before passed, 8 of his last 10 reviews right, and the stage before played on 3 different days. Until then he keeps practising, with a review every 2nd item |
| Warm-ups | 2 easier items at the start of every visit, never a kind he hasn't been shown |
| Reviews | After every 4 items, 1 from an earlier stage (stages he jumped over first). A kind he has never been shown gets its card and demo first |
| Don't count | Warm-ups and reviews give stars but don't move the level |
| Demo again | After 3 items missed in a row (once a sitting) |
| Sitting | 10 items, then `Stars.done()` and the end card |
| Expert | After the last stage: one Expert card, then it carries on |

### Writing a game's ladder

1. **Stage 1 is the very simplest thing**, which a child who has never met the topic can do from the first screen (How many balls? 1 + 1. "Leo is jumping.").
2. **One new idea per stage**, in school order, stretched out: things to see and move first, then pictures, then numbers and symbols only.
3. **Inside a stage, 3–4 steps**, each changing one thing: bigger numbers, more parts, or less help (coloured → plain, pictures → none, a reminder → none). Give each step a plain `note` for the 👪 panel.
4. **The same idea with bigger numbers** is its own stage marked `same`: the "⬆️ Next stage!" card, no new demo.
5. **A new idea he may not know yet** is marked `noJump`: a challenge never jumps him into it.
6. **The harder, more abstract kinds** (missing numbers, he/she/they, the "belongs to" apostrophe, tense) come at the end, marked `fluent`: they open by themselves only once he is fluent, and are never jumped into.
7. **Give every stage an id that never changes.** A stage added later then slots in without moving anyone; old saves are carried over by a small `legacy` function, never to a stage higher than where the child was.
8. **Simulate pretend children before publishing** (always right, 9, 8 and 7 in 10, knows the first few stages, a beginner, one tapping at random): the random tapper stays at stage 1, a beginner stays at the start, a capable child is placed within about 40 items (10–15 minutes), and the harder kinds wait for different days.

Games not yet on the ladder keep their own `RULES` table at the top of the script with the same numbers where they fit.

## 4. Showing how (demos)

- 🔒 Every new kind of puzzle gets a big, centred "✨ New kind of puzzle!" card, never tucked at the side.
- 🔒 Then a demo that plays by itself and is obviously a demo: the blue Watch-me banner, a pretend finger (or Ollie) doing a small, easy example, and the voice saying each step. Nothing to press to start it; taps are ignored while it plays.
- Then the green "your turn" banner and the big **Your turn →** button.
- A harder version of a kind already learned (a stage marked `same`) gets only the "⬆️ Next stage!" card.
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
- 🔒 No fun facts after each right answer: they pull the child away from what they are doing (Kas, 22 Nov 2026, after Sentence Studio's "I wonder…" facts). After a right answer: the star, the picture reacts, then on to the next. Where finding something out *is* the task (Ask and Find Out), the answer stays: it is the reward.
- Choice where it costs nothing: let the child pick the world, the box, the picture.
- Use the child's interests as topics and worlds where possible.
- Never the same puzzle twice in a row; mix the kinds; easy kinds come back between harder ones.
- Make the answer the reward where possible: the box opens, the scene reacts, the reason fixes the problem.
- Where it fits, end a sitting with something to do in real life (ask a grown-up a question, find a pattern at home).
- 🔒 Story questions: about 80% right first time, and only things that are definitely in the story. Full rules: `story-time/AI-INSTRUCTIONS.md`.

## 8. The grown-ups panel 👪

The same contents, in this order:

0. The 👪 button opens with a press-and-hold (§1).
1. Where the child is, in plain words ("Stage 4 of 12: Take just enough — step 2 of 3: sums up to 8").
2. Right first time in the last 10, and by skill.
3. The moving-on rule, with progress ("7 of the last 10 – needs 8"), challenges and jumps, and when the next harder kind will open. Games on the ladder get all of this from `ladder.panel()`.
4. Move to any stage; easier / harder step; undo the last jump.
5. Show how to play (replays the demo).
6. Sounds on/off and voice on/off (plus calm mode if the game has it).
7. Start again from stage 1: tap twice; stars are kept.

## 9. Before publishing

- [ ] `node tools/check-game.mjs <file>` says OK.
- [ ] A complete beginner can start and gets the first items right.
- [ ] On the ladder (`kit/ladder.js`), with the ladder written as in §3 and simulated.
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
| Addition | Counting · Putting together · Taking just enough · One more · Counting on · Counting on: bigger numbers · Turned round · Number bonds · Missing number · Missing number: hidden · Adding without balls |
| More or Less | Which has more · More: close numbers · Which has less · More or less: mixed · Symbols < = > |
| Ask and Find Out | Asking what · Asking where · Asking who · Asking why · Using the reason · Asking my own questions · Asking a real person |
| Sentence Studio | Who and doing · Adding what · Adding where · In, on, under · Word by word · Asking questions · Joining words · Fixing sentences · Saying why |
| School Work (the Crayons books) | Finding facts · Problems and fixes · Feelings · Pictures and feelings · Who said it · Putting it together |
