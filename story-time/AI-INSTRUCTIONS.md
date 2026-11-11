# Instructions: write a Story Time file

You are helping build **Story Time**, part of a learning website for a 10-year-old autistic boy. He watches a read-aloud video of a picture book from **Storyline Online** (storylineonline.net), then answers questions about it, one at a time. The website already exists. **Do not make a web page.** Your job is to write one **story file** (JSON) for the book I name, exactly in the format below. The website turns the file into the quiz.

The goal is basic comprehension and recall: did he follow the story and remember what happened? Not deeper meanings. A child who watched carefully should get about **80% right first time**.

---

## Step 1: Find the facts (do this first)

Use only facts you can find in these sources. List the ones you used in `checkedAgainst`.

1. The book's Storyline Online page: `https://storylineonline.net/books/<book-name>/` (reader, run time, summary).
2. The book's **Teacher Activity Guide** PDF, linked from that page (the "Synopsis" section).
3. Published reviews and descriptions: Publishers Weekly, School Library Journal, Kirkus, the publisher's own description.

**Never make up details.** You cannot see the video or the pictures, so do not ask about colours, clothes or anything in the illustrations unless a source states it. This applies to clues and yes-sentences too: no invented details such as spots, markings or sounds a character makes.

Use the **book**, not a film, TV or stage version. If a source describes a film (for example a different plot detail), ignore it. If a detail is unclear or the sources disagree, leave it out. If there is not enough information for at least 10 good questions, say so and do not make the file. A one-paragraph summary is **not** enough: you need sources that describe the story's events in order.

## Step 2: Write the questions

- **15 questions** (at least 10 if facts run short), in the order things happen in the story.
- Mark each one with `part`: `beginning`, `middle` or `end` of the story.
- Mark each one with `type`: `who`, `where`, `when`, `what` (what happened), `why`, or `feelings`.
  Aim for mostly `what`/`who`/`where`, 1–2 `feelings` and 2–3 `why`. Only ask "why" when the story itself gives the reason.
- Make the first two questions easy.
- **Three answers** per question. Put the **right answer first**; the website shuffles them.
- Wrong answers should be clearly wrong to someone who watched, but not silly. They must be the same kind of answer as the right one (a name for a name, a place for a place, a short sentence for a short sentence). Never use a single random word like "Hats" or "Doors". No trick questions. Every question must have exactly one right answer according to the story.
- **Answer lengths must not give the answer away.** In about a third of the questions the right answer is the longest, in a third the shortest, in a third the middle or the same length as the others.
- Plain, concrete words. UK spelling (favourite, colour, mum). No idioms or figures of speech. One idea per answer. Avoid "not" in questions.
- Word limits: question up to 15 words, each answer up to 7 words, clue up to 15 words, yes-sentence up to 15 words.
- Emojis go in the `"emoji"` field, never typed into the answer text.
- Feelings questions use faces as emojis, e.g. 😊 Happy, 😢 Sad, 😠 Angry, 😨 Scared. Use emojis on other questions only if all three answers have an obvious one (seasons 🍂🌸☀️, weather 🌀❄️🌫️, activities 📚⚽🏊). Otherwise no emojis.
- `clue`: a short hint shown after a wrong answer. It should point to the right answer (it can nearly give it away).
- `yes`: a short sentence shown after the right answer, stating the fact. **Do not start it with "Yes"** (the website adds that).
- No questions that need other books in a series, or general knowledge.

## Step 3: Find the video and the cover

- `youtube`: the 11-character ID of the Storyline Online video on YouTube (channel "StorylineOnline", usually titled "'Book Title' read by Reader Name"). It is the part after `watch?v=`. If you can't find it for certain, leave it as `""`.
- `isbn`: the book's ISBN-13 (digits only). If you can't find it for certain, leave it as `""`.
- `cover`: `https://covers.openlibrary.org/b/isbn/<ISBN>-L.jpg?default=false` using that ISBN, or `""` if there is no ISBN.

## Step 4: Output exactly this

1. The story file, valid JSON in one code block (double quotes, no comments, no trailing commas).
2. One line for the website's contents list, in a second code block:
   `Story Time | Storyline Online | <title> | story-time/story.html?s=<id> | <cover>`
3. One short line saying what you left out because it was unclear (or "Nothing left out").

### The format

```json
{
  "id": "calvin-cant-fly",
  "title": "Calvin Can't Fly",
  "emoji": "🐦",
  "author": "Jennifer Berne",
  "illustrator": "Keith Bendis",
  "reader": "Jonathan Pryce",
  "minutes": 9.5,
  "youtube": "rBAyKweZ2MI",
  "isbn": "9781454915751",
  "cover": "https://covers.openlibrary.org/b/isbn/9781454915751-L.jpg?default=false",
  "source": { "name": "Storyline Online", "url": "https://storylineonline.net/books/calvin-cant-fly/" },
  "guide": "https://storylineonline.net/wp-content/uploads/2025/09/CalvinCantFly-TeacherActivityGuide.pdf",
  "intro": "Calvin is a young starling. He loves books more than anything!",
  "checkedAgainst": ["Storyline Online page and teacher guide", "School Library Journal review", "Kirkus review"],
  "questions": [
    {
      "id": "q1", "part": "beginning", "type": "who",
      "q": "What kind of bird is Calvin?",
      "options": [ { "text": "A starling" }, { "text": "A woodpecker" }, { "text": "A robin" } ],
      "answer": 0,
      "clue": "The word starts with \"st\", like \"star\".",
      "yes": "Calvin is a starling."
    },
    {
      "id": "q5", "part": "beginning", "type": "feelings",
      "q": "How did Calvin feel in the library?",
      "options": [ { "text": "Happy", "emoji": "😊" }, { "text": "Sad", "emoji": "😢" }, { "text": "Angry", "emoji": "😠" } ],
      "answer": 0,
      "clue": "The library was Calvin's favourite place.",
      "yes": "The library was where Calvin was happiest."
    }
  ]
}
```

Field notes:
- `id`: the title in lower case, words joined with hyphens, no apostrophes or punctuation (`arnie-the-doughnut`, `room-on-the-broom`).
- `emoji`: one emoji that fits the book.
- `minutes`: the video's run time from the Storyline Online page.
- `intro`: one or two short sentences about the **start** of the story only. No spoilers.
- `questions`: numbered `q1`, `q2` … in order. `answer` is always `0` (right answer first).

## Step 5: Check before you answer

- [ ] Every fact is in my sources. Nothing invented, nothing about pictures I can't see.
- [ ] 10–15 questions, in story order, each with `part` and `type`.
- [ ] Three answers each, right answer first, `answer` is 0.
- [ ] The right answer is not usually the longest (or usually the shortest).
- [ ] Plain words, UK spelling, within the word limits.
- [ ] Every question has a `clue` and a `yes` (not starting with "Yes").
- [ ] The JSON is valid.
