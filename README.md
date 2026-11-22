# Learning Hub

Learning pages and games for Kas's son first (and his class later), designed for autistic and SEND learners.
Live at https://kazkdp.github.io/Learning-hub/ (GitHub Pages from `main`).

## The master files: one place for each kind of rule

| File | What it holds |
|---|---|
| `DESIGN-RULES.md` | How every game looks, starts, moves on, shows how, helps and rewards, and how to write a game's ladder. Change a rule here, never in just one game. |
| `AI-INSTRUCTIONS.md` | What to give another AI that makes a game: the technical contract (stars, saving, the top bar, the ladder). |
| `story-time/AI-INSTRUCTIONS.md` | The format for Story Time question files. |
| `list.txt` | The contents. Every section and activity is one line; the home page and section pages are built from it. |
| `kit/kit.css`, `kit/kit.js` | The shared look, read-aloud, sounds, settings and saving, and the grown-ups lock (a button marked `data-grownups` opens only with a press-and-hold). |
| `kit/stars.js` | Stars: the bar across the top and `Stars.win / miss / done / save / load`. One star for each thing right first time. |
| `kit/ladder.js` | The ladder every game with stages uses: steps inside a stage, the 80% rule, ⬆️ challenges to find a child's level, warm-ups, reviews, and harder kinds that open only once he is fluent. |
| `tools/check-game.mjs`, `tools/check-story.mjs` | Check a game or a story file before it goes up. |

## What each page uses

| Page | Look | Stars | Moving on |
|---|---|---|---|
| `maths/addition.html` – Addition, 12 stages | its own (night sky) + `kit.js` | `stars.js` | `ladder.js` |
| `writing/sentence-studio.html` – Sentence Studio, 9 stages (code in `writing/sentences/`) | kit | `stars.js` | `ladder.js` |
| `maths/more-or-less.html` – More or Less, 5 stages | its own (night sky) + `kit.js` | `stars.js` | its own, until it moves to the ladder |
| `questions/ask-and-find-out.html` – Ask and Find Out (code in `questions/ask/`) | kit | `stars.js` | its own, until it moves to the ladder |
| `maths/patterns.html` – Patterns (code in `maths/patterns/`) | kit | `Kit.saveResult` (the older way) | its own, until it moves to the ladder |
| `maths/tally-charts.html` – Tallies and Bar Charts | kit | `Kit.saveResult` | its own, until it moves to the ladder |
| `reading/reading-detective.html` – Reading Detective | kit | `Kit.saveResult` | its own |
| `story-time/story.html` – Story Time (one question file per story in `story-time/stories/`) | kit | `Kit.saveResult`, best go per story | – |
| `school/` – School Work (the Crayons books; code in `school/crayons/`) | kit | `stars.js` | – |
| `read-along.html`, `my-stars.html`, the home and section pages | kit | – | – |

The older games move onto `stars.js` and the ladder one at a time, each once Kas has agreed its ladder.
Both ways of saving stars write to the same record, so My Stars and the tiles count every star.

## Adding things

- **A game made by another AI:** give it the whole of `AI-INSTRUCTIONS.md` with the idea, check the file with `node tools/check-game.mjs <file>`, put it in its section's folder and add the line it gives you to `list.txt`.
- **A story:** `story-time/AI-INSTRUCTIONS.md` for the question file, `node tools/check-story.mjs <file>`, then one line in `list.txt`.
- **A new section:** copy `maths/index.html` into the new folder (change `SECTION`, the title and the wording) and add an `@` line to `list.txt`.

## Versions

Pages link `kit/kit.css?v=7`, `kit/kit.js?v=7` and `kit/ladder.js?v=1`, and a game's own script files carry their own `?v=N`.
When one of these files changes, raise its number on every page that loads it, so browsers fetch the new copy.
`kit/stars.js` has no number on purpose: a change reaches every game within about 10 minutes.

Progress is saved in the browser on the device being used. Nothing is sent anywhere; My Stars has a backup to move it to another device.
