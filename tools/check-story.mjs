// Checks Story Time files against the rules in story-time/AI-INSTRUCTIONS.md.
// Usage: node tools/check-story.mjs story-time/stories/calvin-cant-fly.json [more files…]
// Prints problems (must fix), warnings (worth a look) and the line for list.txt.
import { readFileSync } from 'node:fs';

const PARTS = ['beginning', 'middle', 'end'];
const TYPES = ['who', 'where', 'when', 'what', 'why', 'feelings'];
const words = (s) => String(s || '').trim().split(/\s+/).filter(Boolean).length;

function check(path) {
  const problems = [];
  const warnings = [];
  let s;
  try {
    s = JSON.parse(readFileSync(path, 'utf8'));
  } catch (e) {
    return { path, problems: ['Not valid JSON: ' + e.message], warnings, line: '' };
  }

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s.id || '')) problems.push('id must be lower-case words joined with hyphens');
  if (!path.endsWith('/' + s.id + '.json') && !path.endsWith(s.id + '.json')) warnings.push(`file name should be ${s.id}.json`);
  if (!s.title) problems.push('title is missing');
  if (!s.intro) problems.push('intro is missing');
  if (!s.source || !s.source.url) problems.push('source.url is missing');
  if (!/^[A-Za-z0-9_-]{11}$/.test(s.youtube || '')) warnings.push('youtube ID missing or not 11 characters: the video will not show');
  if (s.isbn && !/^\d{13}$/.test(s.isbn)) warnings.push('isbn should be 13 digits');
  if (!s.cover) warnings.push('no cover: the tile will show the emoji');
  if (!Array.isArray(s.checkedAgainst) || !s.checkedAgainst.length) warnings.push('checkedAgainst is empty');

  const qs = Array.isArray(s.questions) ? s.questions : [];
  if (qs.length < 10 || qs.length > 15) problems.push(`has ${qs.length} questions (needs 10–15)`);

  const ids = new Set();
  let lastPart = 0;
  const len = { longest: 0, shortest: 0, other: 0 };
  qs.forEach((q, i) => {
    const n = `Q${i + 1}`;
    if (!q.id || ids.has(q.id)) problems.push(`${n}: id missing or repeated`);
    ids.add(q.id);
    if (!PARTS.includes(q.part)) problems.push(`${n}: part must be beginning, middle or end`);
    else {
      const p = PARTS.indexOf(q.part);
      if (p < lastPart) warnings.push(`${n}: goes back to the ${q.part} of the story (questions should be in story order)`);
      lastPart = Math.max(lastPart, p);
    }
    if (!TYPES.includes(q.type)) problems.push(`${n}: type must be one of ${TYPES.join(', ')}`);
    if (!q.q) problems.push(`${n}: question text missing`);
    else if (words(q.q) > 15) warnings.push(`${n}: question is ${words(q.q)} words (limit 15)`);
    if (!Array.isArray(q.options) || q.options.length !== 3) { problems.push(`${n}: needs exactly 3 answers`); return; }
    const answer = typeof q.answer === 'number' ? q.answer : 0;
    if (answer < 0 || answer > 2) problems.push(`${n}: answer must be 0, 1 or 2`);
    q.options.forEach((o, k) => {
      if (!o || !o.text) problems.push(`${n}: answer ${k + 1} has no text`);
      else if (words(o.text) > 7) warnings.push(`${n}: answer "${o.text}" is ${words(o.text)} words (limit 7)`);
    });
    const withEmoji = q.options.filter((o) => o && o.emoji).length;
    if (withEmoji && withEmoji !== 3) warnings.push(`${n}: only some answers have emojis`);
    const texts = q.options.map((o) => String((o && o.text) || ''));
    if (new Set(texts.map((t) => t.toLowerCase())).size !== 3) problems.push(`${n}: two answers are the same`);
    const L = texts.map((t) => t.length);
    const c = L[answer];
    const others = L.filter((_, k) => k !== answer);
    if (others.every((x) => x < c)) len.longest++;
    else if (others.every((x) => x > c)) len.shortest++;
    else len.other++;
    if (!q.clue) problems.push(`${n}: clue missing`);
    else if (words(q.clue) > 15) warnings.push(`${n}: clue is ${words(q.clue)} words (limit 15)`);
    if (!q.yes) problems.push(`${n}: yes-sentence missing`);
    else {
      if (/^\s*yes\b/i.test(q.yes)) warnings.push(`${n}: yes-sentence starts with "Yes" (the page adds that)`);
      if (words(q.yes) > 15) warnings.push(`${n}: yes-sentence is ${words(q.yes)} words (limit 15)`);
    }
  });

  if (qs.length) {
    const share = (x) => x / qs.length;
    if (share(len.longest) > 0.45) warnings.push(`right answer is the longest in ${len.longest} of ${qs.length} questions: too easy to guess`);
    if (share(len.shortest) > 0.45) warnings.push(`right answer is the shortest in ${len.shortest} of ${qs.length} questions: too easy to guess`);
  }

  const picture = s.cover || s.emoji || '📺';
  const line = `Story Time | Storyline Online | ${s.title} | story-time/story.html?s=${s.id} | ${picture}`;
  return { path, problems, warnings, line, lengths: len };
}

let failed = false;
for (const path of process.argv.slice(2)) {
  const r = check(path);
  console.log(`\n== ${r.path}`);
  if (r.lengths) console.log(`   right answer longest/shortest/other: ${r.lengths.longest}/${r.lengths.shortest}/${r.lengths.other}`);
  r.problems.forEach((p) => console.log('   PROBLEM: ' + p));
  r.warnings.forEach((w) => console.log('   warning: ' + w));
  if (!r.problems.length) console.log('   OK. list.txt line:\n   ' + r.line);
  if (r.problems.length) failed = true;
}
process.exit(failed ? 1 : 0);
