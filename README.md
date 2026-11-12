# Learning Hub

Learning pages and games, built one section at a time.

## How the site is put together

| File or folder | What it is |
|---|---|
| `index.html` | The landing page. It draws a big tile for each section. |
| `list.txt` | The contents page. Every activity is one line in here. |
| `kit/` | The shared look, read-aloud, sounds and progress saving that every page uses. |
| `story-time/` | **Story Time**: watch a story video, then answer questions. |
| `story-time/stories/` | One small file of questions per story. |
| `story-time/AI-INSTRUCTIONS.md` | Instructions to give another AI so it writes story files in the right format. |
| `maths/` | **Maths**: number games. `maths/tally-charts.html` is **Tallies and Bar Charts** (24 levels that adjust to how he's doing). `maths/patterns.html` is **Patterns** (55 levels, from copying a red, blue train up to number rules). |
| `my-stars.html` | **My Stars**: stars collected, stories and games done, a grown-ups view and backup. |
| `tools/check-story.mjs` | Checks a story file against the rules before it goes up. |

## How stars work

- **Story Time:** one star for each question right first time. Only the best go at each story counts, so watching the same story again can't add stars.
- **Maths games:** one star for each part of a round right first time (in Tallies and Bar Charts: the tally chart, the bar chart and the questions, so up to 3 a round).  In Patterns each puzzle is one part: one star for each puzzle right first time, and a sitting is 10 puzzles.
- A game saves its sitting after every round (`Kit.saveResult` with `adds: true` and a `session` id), so stopping half-way keeps the stars, and each sitting is one line in the history.
- A game's level is kept as the setting `progress:<page>`, so the My Stars backup carries it to another device.

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
