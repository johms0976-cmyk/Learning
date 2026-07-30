#!/usr/bin/env node
/* Builds RECORDING-LIST.md from js/wordland-data.js.
   Run it after you change any words or stories:   node tools/list-audio.js  */

const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

const src = fs.readFileSync(path.join(root, 'js/wordland-data.js'), 'utf8');
const scope = {};
(new Function(src + '\n;this.SOUND=SOUND;this.MAPS=MAPS;this.ALL_NODES=ALL_NODES;')).call(scope);
const { SOUND, MAPS, ALL_NODES } = scope;

const slug = s => String(s).toLowerCase().trim()
  .replace(/['’.,!?]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9_-]/g, '');
const chapterName = (mapNo, no) => (Number(mapNo) === 1 ? '' : 'map' + mapNo + '-') + 'chapter' + no;
const uniq = a => [...new Set(a)];

const sounds = new Map();   // file -> which letters use it
const words  = new Map();   // file -> where it appears
const story  = [];

ALL_NODES.forEach(n => {
  const where = `map ${n.map} · place ${n.no}`;
  n.letters.forEach(l => {
    const f = slug(SOUND[l] || l);
    sounds.set(f, (sounds.get(f) || []).concat(`${l} — ${where}`));
  });
  const add = w => {
    const f = slug(w);
    words.set(f, (words.get(f) || []).concat(where));
  };
  n.vocab.forEach(v => add(v.w));
  n.words.forEach(v => add(v.w));
  n.family.forEach(v => add(v.w));
  n.hfw.forEach(h => add(h.w));
  (n.sentences || []).forEach(s => s.s.forEach(add));
  story.push({ file: chapterName(n.map, n.no), map: n.map, region: n.region,
               title: n.story.t, text: n.story.lines.map(l => l.replace(/\*/g, '')) });
});

const soundRows = [...sounds.keys()].sort();
const wordRows  = [...words.keys()].sort();

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

Map 1's chapters keep their original names (\`chapter1.mp3\` …), so
anything you recorded before still plays. Later maps are prefixed:
\`map2-chapter1.mp3\`.

---

## 1 · Letter sounds — ${soundRows.length} files

Say the **sound**, not the letter name: \`mmm\`, not "em".
Stretch the ones you can (mmm, sss, fff, nnn, rrr, zzz) and keep the
others crisp (b, t, k, p) without adding an "uh" on the end.

| file | the sound for |
|---|---|
${soundRows.map(f => `| \`sounds/${f}.mp3\` | ${uniq(sounds.get(f)).join(', ')} |`).join('\n')}

---

## 2 · Words — ${wordRows.length} files

Just the word on its own, clearly, with a small pause before and after.

| file | say | used in |
|---|---|---|
${wordRows.map(f => `| \`words/${f}.mp3\` | ${f.replace(/-/g, ' ')} | ${uniq(words.get(f)).join(', ')} |`).join('\n')}

---

## 3 · Story chapters — ${story.length} files

Read each chapter as one take. The words in the story are also tappable,
and those play the single-word files above.
`;

MAPS.filter(m => m.nodes && m.nodes.length).forEach(m => {
  md += `\n### Map ${m.no} · ${m.name}\n`;
  story.filter(s => s.map === m.no).forEach(s => {
    md += `\n#### \`story/${s.file}.mp3\` — ${s.title}\n*${s.region}*\n\n`;
    md += s.text.map(l => '> ' + l).join('\n') + '\n';
  });
});

const total = soundRows.length + wordRows.length + story.length;
md += `\n---

**${total} files in total** — ${soundRows.length} sounds, ${wordRows.length} words, ${story.length} chapters.

After adding files, run \`bash tools/make-manifest.sh\` so the game can
find them instantly instead of checking one by one.
`;

fs.writeFileSync(path.join(root, 'RECORDING-LIST.md'), md);
console.log(`RECORDING-LIST.md written — ${total} files ` +
            `(${soundRows.length} sounds, ${wordRows.length} words, ${story.length} chapters)`);
