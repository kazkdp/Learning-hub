# Learning Hub

Learning pages and games, built one section at a time.

## How the site is put together

| File or folder | What it is |
|---|---|
| `index.html` | The landing page. It draws a big tile for each section. |
| `list.txt` | The contents page. Every activity is one line in here. |
| `kit/` | The shared look, read-aloud, sounds and progress saving that every page uses. `kit/stars.js` is the star system for every new game. |
| `AI-INSTRUCTIONS.md` | The rules to give another AI so a game it makes works with the hub's stars. |
| `story-time/` | **Story Time**: watch a story video, then answer questions. |
| `story-time/stories/` | One small file of questions per story. |
| `story-time/AI-INSTRUCTIONS.md` | Instructions to give another AI so it writes story files in the right format. |
| `reading/` | **Reading**: `reading/reading-detective.html` is **Reading Detective** (100 short stories to read, each with 3 questions; some answers are proved by tapping the sentence that says so). |
| `maths/` | **Maths**: number games. `maths/tally-charts.html` is **Tallies and Bar Charts** (24 levels that adjust to how he's doing). `maths/patterns.html` is **Patterns** (55 levels, from copying a red, blue train up to number rules). |
| `my-stars.html` | **My Stars**: stars collected, stories and games done, a grown-ups view and backup. |
| `tools/check-story.mjs` | Checks a story file against the rules before it goes up. |
| `tools/check-game.mjs` | Checks a game made by another AI against `AI-INSTRUCTIONS.md` before it goes up. |

## Stars for new games: `kit/stars.js`

Every new game gets its stars from one file, so no game has to work out its own reward system.

- A game adds one line, `<script src="https://kazkdp.github.io/Learning-hub/kit/stars.js"></script>` (plus a safety line), then calls `Stars.win('Skill name')` when something is right first time and `Stars.miss('Skill name')` when it isn't. `Stars.done()` ends a round; `Stars.save()` and `Stars.load()` remember the level.
- stars.js does the rest: the bar across the top (Home, section, game name, star counter), the flying star and chime, saving into the same record as the kit (so My Stars, the home page and the section tiles count the stars), and a block in My Stars' grown-ups view for each game's skills.
- The rules live only in stars.js (`RULES` at the top): one star for each thing right first time; a question with an id pays once a day; more than 30 stars in a minute is a bug and isn't counted.
- Outside the hub (an AI's preview, a file opened on the computer) it runs in practice mode: stars fly but nothing is saved.
- It is linked without `?v=`, so a change reaches every game within about 10 minutes.

## Adding a game made by another AI

1. Give the AI the whole of `AI-INSTRUCTIONS.md` with the idea for the game.
2. Check the file: `node tools/check-game.mjs maths/the-game.html`.
3. Put it in its section's folder and add the line the AI gives you to `list.txt`.

## How stars work

- **Story Time:** one star for each question right first time. Only the best go at each story counts, so watching the same story again can't add stars.
- **Reading Detective:** one star for every story finished (all 3 questions answered). Every finished story counts, even one read before. Each round of 10 stories is one line in the history.
- **Maths games:** one star for each part of a round right first time (in Tallies and Bar Charts: the tally chart, the bar chart and the questions, so up to 3 a round).  In Patterns each puzzle is one part: one star for each puzzle right first time, and a sitting is 10 puzzles.
- A game saves its sitting after every round (`Kit.saveResult` with `adds: true` and a `session` id), so stopping half-way keeps the stars, and each sitting is one line in the history.
- A game's level is kept as the setting `progress:<page>`, so the My Stars backup carries it to another device. (Reading Detective keeps its finished stories, its round and any stories added by a grown-up there too.)
- Pages link the kit as `kit/kit.js?v=6` and `kit/kit.css?v=6`. When the kit changes, raise the number on every page so browsers fetch the new copy.

## Adding a story to Story Time

1. Add the story's question file to `story-time/stories/` (for example `room-on-the-broom.json`).
2. Add one line to `list.txt`:

```
Story Time | Storyline Online | Room on the Broom | story-time/story.html?s=room-on-the-broom | 🧹
```

The Story Time page and the landing page pick it up by themselves.

## Rules for story questions

The full rules are in `story-time/AI-INSTRUCTIONS.md`. In short:


- Only ask about things that are definitely in the story. If something is unclear, leave it out.
- About 15 questions, in story order, each marked beginning, middle or end.
- Three short answers of similar length, so the longest answer is not a clue.
- Plain words, one idea per answer. Feelings questions use faces.
- Every question has a short clue for after a wrong answer, and a short "yes" sentence.

Progress is saved in the browser on the device being used. Nothing is sent anywhere.
