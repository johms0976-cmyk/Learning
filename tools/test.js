#!/usr/bin/env node
/* Builds audio/wordland/RECORDING-LIST.md from js/wordland-data.js.
   Run it after you change any words or stories:   node tools/list-audio.js  */

const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

/* load the content file into this scope */
const src = fs.readFileSync(path.join(root, 'js/wordland-data.js'), 'utf8');
const scope = {};
(new Function(src + '\n;this.SOUND=SOUND;this.NODES=NODES;this.spokenLetters=spokenLetters;')).call(scope);
const { SOUND, NODES, spokenLetters } = scope;

const slug = s => String(s).toLowerCase().trim()
  .replace(/['’.,!?]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9_-]/g, '');

const sounds = new Map();   // file -> which letters use it
const words = new Map();    // file -> where it appears
const story = [];

NODES.forEach(n => {
  n.letters.forEach(l => {
    const f = slug(SOUND[l] || l);
    sounds.set(f, (sounds.get(f) || []).concat(`${l} — taught in place ${n.no}`));
  });
  const add = (w, why) => {
    const f = slug(w);
    words.set(f, (words.get(f) || []).concat(why));
  };
  n.vocab.forEach(v => add(v.w, 'place ' + n.no));
  n.words.forEach(v => add(v.w, 'place ' + n.no));
  n.family.forEach(v => add(v.w, 'place ' + n.no));
  n.hfw.forEach(h => add(h.w, 'place ' + n.no));
  story.push({ file: 'chapter' + n.no, region: n.region, title: n.story.t,
               text: n.story.lines.map(l => l.replace(/\*/g, '')) });
});

/* letters heard while blending and spelling, even if never taught alone */
spokenLetters().forEach(l => {
  const f = slug(SOUND[l] || l);
  if (!sounds.has(f)) sounds.set(f, [`${l} — heard inside words`]);
});

const uniq = a => [...new Set(a)];
let md = `# Recording list

Every file is a short **.mp3**. Record at a calm, slightly slow pace —
these are for a child who is sounding words out.

Any file you have not recorded yet is simply read by the computer voice,
so you can record them in any order and drop them in as you go.

| what | where it goes |
|---|---|
| letter sounds | \`audio/wordland/sounds/\` |
| words | \`audio/wordland/words/\` |
| story chapters | \`audio/wordland/story/\` |

---

## 1 · Letter sounds — ${sounds.size} files

Say the **sound**, not the letter name: \`mmm\`, not "em".
Stretch the ones you can (mmm, sss, fff) and keep the others crisp (b, t, k)
without adding an "uh" on the end.

| file | the sound for |
|---|---|
`;
[...sounds.keys()].sort().forEach(f => {
  md += `| \`sounds/${f}.mp3\` | ${uniq(sounds.get(f)).join(', ')} |\n`;
});

md += `\n---\n\n## 2 · Words — ${words.size} files\n\nJust the word on its own, clearly, with a small pause before and after.\n\n| file | say | used in |\n|---|---|---|\n`;
[...words.keys()].sort().forEach(f => {
  md += `| \`words/${f}.mp3\` | ${f.replace(/-/g, ' ')} | ${uniq(words.get(f)).join(', ')} |\n`;
});

md += `\n---\n\n## 3 · Story chapters — ${story.length} files\n\nRead each chapter as one take. The words in the story are also tappable,\nand those play the single-word files above.\n\n`;
story.forEach(s => {
  md += `### \`story/${s.file}.mp3\` — ${s.title}\n*${s.region}*\n\n`;
  s.text.forEach(l => { md += `> ${l}\n` });
  md += `\n`;
});

const total = sounds.size + words.size + story.length;
md += `---\n\n**${total} files in total** — ${sounds.size} sounds, ${words.size} words, ${story.length} chapters.\n\nAfter adding files, run \`bash tools/make-manifest.sh\` so the game can\nfind them instantly instead of checking one by one.\n`;

fs.writeFileSync(path.join(root, 'audio/wordland/RECORDING-LIST.md'), md);
console.log(`RECORDING-LIST.md written — ${total} files (${sounds.size} sounds, ${words.size} words, ${story.length} chapters)`);
