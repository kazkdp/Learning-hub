// Checks the whole hub in one go, before publishing.
// Usage: node tools/check-all.mjs
//   - every page in list.txt exists, and every game passes tools/check-game.mjs
//     (games still on the older star system are listed, not failed: they move to stars.js one at a time)
//   - every Story Time file passes tools/check-story.mjs
//   - every script or stylesheet a page links to exists
//   - kit/kit.js and kit/stars.js keep the saved record the same way (they must, see kit.js's header)
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';

// Games that still save with Kit.saveResult (README "What each page uses"). Remove a line when a game moves to stars.js.
const OLDER = new Set([
  'maths/patterns.html',
  'maths/tally-charts.html',
  'reading/reading-detective.html',
  'story-time/story.html',
]);

const problems = [];
const notes = [];
const node = process.execPath;

function run(script, files) {
  try {
    return { ok: true, out: execFileSync(node, [script, ...files], { encoding: 'utf8' }) };
  } catch (e) {
    return { ok: false, out: String(e.stdout || '') + String(e.stderr || '') };
  }
}

// 1. list.txt
const list = readFileSync('list.txt', 'utf8').split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
const pages = new Set();
for (const line of list) {
  const p = line.replace(/^@/, '').split('|').map((x) => x.trim());
  const page = (line.startsWith('@') ? p[3] : p[3]) || '';
  const file = page.split(/[?#]/)[0];
  if (!file) continue;
  const path = file.endsWith('/') ? file + 'index.html' : file;
  if (!existsSync(path)) problems.push(`list.txt points to ${page}, which doesn't exist`);
  else pages.add(path);
}

// 2. games
for (const page of [...pages].sort()) {
  if (/(^|\/)index\.html$/.test(page)) continue;
  const r = run('tools/check-game.mjs', [page]);
  if (r.ok) continue;
  if (OLDER.has(page)) notes.push(`${page}: still on the older star system (planned to move to stars.js)`);
  else problems.push(`${page} fails tools/check-game.mjs:\n${r.out.trim().split('\n').filter((l) => /PROBLEM/.test(l)).join('\n')}`);
}

// 3. stories
const stories = readdirSync('story-time/stories').filter((f) => f.endsWith('.json')).map((f) => 'story-time/stories/' + f);
const s = run('tools/check-story.mjs', stories);
if (!s.ok) problems.push('Story Time files have problems:\n' + s.out.split('\n').filter((l) => /^==|PROBLEM/.test(l)).join('\n'));
const storyWarnings = s.out.split('\n').filter((l) => /warning/.test(l)).length;
if (storyWarnings) notes.push(`Story Time: ${storyWarnings} warning(s), see node tools/check-story.mjs story-time/stories/*.json`);

// 4. linked files exist
const htmlFiles = [];
(function walk(dir) {
  for (const f of readdirSync(dir, { withFileTypes: true })) {
    if (f.name.startsWith('.')) continue;
    const p = join(dir, f.name);
    if (f.isDirectory()) walk(p);
    else if (f.name.endsWith('.html')) htmlFiles.push(p);
  }
})('.');
for (const page of htmlFiles) {
  const html = readFileSync(page, 'utf8');
  for (const m of html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)=["']([^"':]+\.(?:js|css))(\?[^"']*)?["']/gi)) {
    const target = join(dirname(page), m[1]);
    if (!existsSync(target)) problems.push(`${page} links to ${m[1]}, which doesn't exist`);
  }
}

// 5. kit.js and stars.js agree on how the record is kept
const kit = readFileSync('kit/kit.js', 'utf8');
const stars = readFileSync('kit/stars.js', 'utf8');
for (const name of ['STORE_KEY', 'TEST_KEY', 'MAX_RESULTS', 'KEEP_ITEMS']) {
  const a = (kit.match(new RegExp(name + "\\s*=\\s*([^;]+);")) || [])[1];
  const b = (stars.match(new RegExp(name + "\\s*=\\s*([^;]+);")) || [])[1];
  if (!a || !b || a.trim() !== b.trim()) problems.push(`kit.js and stars.js disagree on ${name} (${a} / ${b})`);
}

notes.forEach((n) => console.log('note: ' + n));
if (problems.length) {
  problems.forEach((p) => console.log('PROBLEM: ' + p));
  process.exit(1);
}
console.log(`OK: ${pages.size} pages in list.txt, ${stories.length} stories, ${htmlFiles.length} HTML files checked.`);
