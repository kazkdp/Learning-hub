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
| `maths/` | **Maths**: number games. `maths/tally-charts.html` is **Tallies and Bar Charts** (24 levels that adjust to how he's doing). `maths/patterns.html` is **Patterns**: a journey through 8 worlds and 303 levels: the first seven worlds carry patterns on in different places (train, necklace, tiles, towers, numbers, machines, mirrors), and the harder kinds come in the last world, Pattern detective (Train, Bead necklace, Tile garden, Block builder, Number grid, Pattern machine, Mirror pond, Puzzle grids), from copying a two-colour train up to Key Stage 3 number rules. Its code is in `maths/patterns/` (art, worlds, scenes, game). `maths/addition.html` is **Addition**: put blue and orange balls in a pot, count them and tap the answer, in 5 stages (put both in, take just enough, count on, bigger numbers, missing number); the first game on `kit/stars.js`. `maths/more-or-less.html` is **More or Less**: tap the group with more (or less) balls, then use < = > with numbers, in 5 stages. |
| `writing/` | **Writing**: `writing/sentence-studio.html` is **Sentence Studio**: building sentences the way UK schools teach it (Colourful Semantics: Who? orange, What doing? yellow, What? green, Where? blue). A small cast (Leo, Maya and Milo the cat) is drawn once as moving puppets and acts out every sentence in 65 scenes. He taps the cards in order and finishes with the full stop, which is a card of its own. 7 stages: who and doing, adding what, adding where, word by word (capital letter first), asking questions (? or .), joining words (and, because), sentence detective (find the mistake). Help fades step by step inside each stage; moving on needs about 80%. Every sentence ends with an “I wonder…” question and fact. Its code is in `writing/sentences/` (`cast.js` puppets and animation, `things.js` props, animals and places, `content.js` scenes and sentences, `game.js` the rules). On `kit/stars.js`. |
| `questions/` | **Questions**: games that teach asking questions. `questions/ask-and-find-out.html` is **Ask and Find Out** (its code is in `questions/ask/`: `fx.js` = animations and sounds, `content.js` = all the puzzles, `game.js` = the rules). Ollie the owl knows things; each animated scene shows something happen, tells some facts and hides one, and he picks the question word that finds out what's missing (asking for something already known gets a giggly "we know that already!"). The answer is the reward: the box opens and the toy comes alive, the hider pops out, the culprit is caught, the reason fixes the problem. 5 stages in the order research recommends: Mystery box (What), Hide and seek (What, Where), Who did it? (+Who), Why did it happen? (+Why, then use the reason to fix something), and I wonder… (his own questions about a moving picture). He picks a world (Home, Outdoors, Seaside, Space) each go, every new kind of puzzle starts with Ollie showing how, and puzzles never repeat back to back. Everything he finds goes in his Discovery Book (107 pages). Help fades from the whole question to the word to a clue to nothing. Each sitting is 8 puzzles and ends with a real-life mission (ask a grown-up a question) and, from stage 4, the Wonder Jar for his own questions. On `kit/stars.js`. |
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
- **Sentence Studio:** one star for each sentence built (or fixed) right first time; a sitting is 10 sentences.
- **Ask and Find Out:** one star for each question that finds out what was missing on the first go, one for using the reason right first time (Why stage), one per picture in "I wonder…", and one a day for the real-life mission.
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
