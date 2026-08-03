/* ============================================================
   MAKE-MANIFEST  ·  node tools/make-manifest.js
   ------------------------------------------------------------
   Lists every recording that actually exists into
   audio/wordland/manifest.json, so the game stops probing for
   files one at a time.

   Same job as tools/make-manifest.sh, but runs anywhere Node
   runs — no bash needed, so it works on Windows too.

   Run it after adding or removing any .mp3, and commit the result.
   ============================================================ */
const fs = require('fs'), path = require('path');

const ROOT = path.join(__dirname, '..');
const DIR = path.join(ROOT, 'audio', 'wordland');

if (!fs.existsSync(DIR)) {
  console.log('No audio/wordland folder yet — nothing to list.');
  process.exit(0);
}

const files = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.toLowerCase().endsWith('.mp3'))
      files.push(path.relative(DIR, full).split(path.sep).join('/'));
  }
})(DIR);

files.sort();
fs.writeFileSync(path.join(DIR, 'manifest.json'), JSON.stringify(files, null, 1) + '\n');
console.log(`audio/wordland/manifest.json written — ${files.length} recordings listed`);
