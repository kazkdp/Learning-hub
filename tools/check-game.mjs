// Checks a game page made by another AI against the rules in AI-INSTRUCTIONS.md.
// Usage: node tools/check-game.mjs maths/telling-the-time.html [more files…]
// Prints problems (must fix), warnings (worth a look) and the skill names the game uses.
import { readFileSync } from 'node:fs';

function check(path) {
  const problems = [];
  const warnings = [];
  let html;
  try {
    html = readFileSync(path, 'utf8');
  } catch (e) {
    return { path, problems: ['Cannot read the file: ' + e.message], warnings, skills: [] };
  }
  const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]).join('\n');
  const stub = (html.match(/window\.Stars\s*=\s*window\.Stars\s*\|\|[^\n<]*/) || [''])[0];
  const code = scripts.replace(stub, '');

  if (!/<script[^>]+src=["'](https:\/\/kazkdp\.github\.io\/Learning-hub\/|(\.\.\/)*)kit\/stars\.js["']/i.test(html)) {
    problems.push('the stars.js line is missing: <script src="https://kazkdp.github.io/Learning-hub/kit/stars.js"></script>');
  }
  if (!stub) problems.push('the safety line is missing: <script>window.Stars = window.Stars || { … }</script>');
  for (const fn of ['win', 'miss', 'done', 'save', 'load', 'total']) {
    if (new RegExp('Stars\\.' + fn + '\\s*\\(').test(code) && stub && !new RegExp('\\b' + fn + '\\b').test(stub)) {
      problems.push(`the game calls Stars.${fn}() but the safety line has no ${fn}(): it would break where stars.js can't load`);
    }
  }
  if (!/Stars\.win\s*\(/.test(code)) problems.push('never calls Stars.win(…), so it can never give a star');
  if (!/Stars\.miss\s*\(/.test(code)) warnings.push('never calls Stars.miss(…): grown-ups won\'t see what is hard');
  if (/\blocalStorage\b|\bsessionStorage\b|document\.cookie/.test(code)) {
    problems.push('uses localStorage, sessionStorage or cookies: use Stars.save() and Stars.load() instead');
  }
  if (!/<html[^>]*\blang=["']en-GB["']/i.test(html)) warnings.push('the <html> tag should have lang="en-GB"');
  if (!/<meta[^>]+name=["']robots["'][^>]*noindex/i.test(html)) warnings.push('missing <meta name="robots" content="noindex, nofollow">');
  if (!/<meta[^>]+name=["']viewport["']/i.test(html)) warnings.push('missing the viewport line, so it will look tiny on a phone');
  if (!/<title>\s*[^<\s][^<]*<\/title>/i.test(html)) warnings.push('missing a <title>: the hub bar shows it as the game\'s name');
  if (/\b(alert|confirm|prompt)\s*\(/.test(code)) warnings.push('uses alert(), confirm() or prompt(): use messages on the page instead');
  const css = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join('\n');
  for (const rule of css.match(/[^{}]+\{[^{}]*\}/g) || []) {
    if (/position\s*:\s*(fixed|sticky)/i.test(rule) && /(^|[;{\s])top\s*:\s*0(px)?\s*[;}]/i.test(rule)) {
      warnings.push('something is fixed to the top of the screen and will sit under the hub bar: ' + rule.split('{')[0].trim());
    }
  }
  if (/(^|[^-])height\s*:\s*100d?vh/.test(css) && !/calc\(\s*100d?vh\s*-\s*56px\s*\)/.test(css)) {
    warnings.push('uses 100vh: if the game fills the screen it should be calc(100vh - 56px) to leave room for the hub bar');
  }

  const skills = new Set();
  for (const m of code.matchAll(/Stars\.(?:win|miss)\(\s*(['"`])([^'"`]+)\1/g)) skills.add(m[2]);
  if (skills.size > 10) warnings.push(`${skills.size} different skill names: 3 to 8 is easier for grown-ups to read`);
  return { path, problems, warnings, skills: [...skills] };
}

const files = process.argv.slice(2);
if (!files.length) {
  console.log('Usage: node tools/check-game.mjs <game.html> [more files…]');
  process.exit(1);
}
let failed = false;
for (const path of files) {
  const r = check(path);
  console.log(`\n== ${r.path}`);
  r.problems.forEach((p) => console.log('   PROBLEM: ' + p));
  r.warnings.forEach((w) => console.log('   warning: ' + w));
  if (r.skills.length) console.log('   skills: ' + r.skills.join(', '));
  if (!r.problems.length) console.log('   OK');
  if (r.problems.length) failed = true;
}
process.exit(failed ? 1 : 0);
