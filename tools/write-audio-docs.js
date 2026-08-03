const fs = require('fs'), path = require('path');
const { out, have, D, MAX } = require('./full-audio-list.js');
/* writes into the repo, next to the recordings it describes */
const OUT = path.join(__dirname, '..', 'audio', 'wordland');
fs.mkdirSync(OUT, { recursive: true });

const sortNames = k => [...out[k].keys()].sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
const tick = p => have.has(p) ? '✅' : '☐';
const esc = s => String(s == null ? '' : s).replace(/\|/g, '\\|');

/* ── work out, for every word, the earliest map it is needed in ── */
const wordMap = new Map();   // slug -> earliest map number, or 99 for Spell It only
for (const [name, v] of out.words) {
  let earliest = 99;
  for (const f of v.from) {
    const m = f.match(/Map (\d+)/);
    if (m) earliest = Math.min(earliest, Number(m[1]));
  }
  wordMap.set(name, earliest);
}

/* ── priority ─────────────────────────────────────────────── */
function priority(kind, name) {
  if (kind === 'phrases' || kind === 'praise' || kind === 'players') return 1;
  if (kind === 'sounds' || kind === 'letters') return 1;
  const map = kind === 'words' ? wordMap.get(name)
            : Number((name.match(/^map(\d+)-/) || [0, 1])[1]);
  if (map === 99) return 3;                 // Spell It / Write It only
  if (map === 1) return 2;                  // Map 1 — the first thing played
  if (map <= 4) return 4;
  if (map <= 8) return 5;
  return 6;
}
const PRIO_NAME = {
  1: 'P1 · Shared voice — every screen, every game',
  2: 'P2 · Map 1 (lessons 1–10)',
  3: 'P3 · Spell It & Write It only',
  4: 'P4 · Maps 2–4 (lessons 11–40)',
  5: 'P5 · Maps 5–8 (lessons 41–80)',
  6: 'P6 · Maps 9–12 (lessons 81–120)'
};

/* ── counts ───────────────────────────────────────────────── */
const KINDS = ['sounds', 'letters', 'words', 'story', 'phrases', 'praise', 'players'];
let grand = 0, grandDone = 0;
const counts = KINDS.map(k => {
  const n = sortNames(k), d = n.filter(x => have.has(k + '/' + x)).length;
  grand += n.length; grandDone += d;
  return { k, total: n.length, done: d };
});
const prioCount = {};
KINDS.forEach(k => sortNames(k).forEach(n => {
  const p = priority(k, n);
  prioCount[p] = prioCount[p] || { total: 0, done: 0 };
  prioCount[p].total++;
  if (have.has(k + '/' + n)) prioCount[p].done++;
}));

const L = [];
const P = s => L.push(s);

P('# Word Land · Complete Audio Recording List');
P('');
P('Every file the three games (**Word Land**, **Spell It**, **Write It**) will look for,');
P('generated straight from the source tables so it cannot drift from the code.');
P('');
P('| | |');
P('|---|---|');
P(`| **Total files** | **${grand}** |`);
P(`| Already recorded | ${grandDone} |`);
P(`| Still to record | ${grand - grandDone} |`);
P(`| Generated from | \`js/wordland-data.js\`, \`js/wordland-audio.js\`, \`js/mascot.js\`, \`js/profiles.js\`, \`spelling-game.html\` |`);
P('');
P('## By folder');
P('');
P('| Folder | Files | Recorded | To do |');
P('|---|---:|---:|---:|');
counts.forEach(c => P(`| \`audio/wordland/${c.k}/\` | ${c.total} | ${c.done} | ${c.total - c.done} |`));
P(`| **Total** | **${grand}** | **${grandDone}** | **${grand - grandDone}** |`);
P('');
P('## Suggested recording order');
P('');
P('Nothing breaks if you record out of order — every missing file falls back to the');
P('computer voice. But the earlier groups are heard far more often per file recorded.');
P('');
P('| Priority | Files | Recorded | To do |');
P('|---|---:|---:|---:|');
Object.keys(PRIO_NAME).forEach(p => {
  const c = prioCount[p] || { total: 0, done: 0 };
  P(`| ${PRIO_NAME[p]} | ${c.total} | ${c.done} | ${c.total - c.done} |`);
});
P('');
P('**P1 is 146 files and carries the whole product.** Zib talks on every screen, the');
P('cheers fire after every single round, and the letter sounds are reused by all 120');
P('lessons. Record that block first and the games stop sounding like a robot.');
P('');
P('---');
P('');
P('## How a filename is decided');
P('');
P('The filename is the thing being said: lower case, apostrophes and punctuation dropped,');
P('spaces turned into dashes, `.mp3` on the end. `"Well done!"` → `phrases/well-done.mp3`.');
P('That rule lives in `slug()` in `js/wordland-audio.js` — everything below has already');
P('been put through it, so the left-hand column is literally what to name the file.');
P('');
P('```');
P('audio/wordland/');
P('  sounds/    the sound a letter makes      sss.mp3');
P('  letters/   the NAME of a letter          s.mp3   ("ess")');
P('  words/     a whole word                  monkey.mp3');
P('  story/     a story chapter               chapter1.mp3, map2-chapter1.mp3');
P('  phrases/   a fixed line the game says    well-done.mp3');
P('  praise/    praise that runs into a name  well-done.mp3  (recorded RISING)');
P('  players/   each child\'s name             player1.mp3');
P('```');
P('');
P('`praise/` and `phrases/` can hold the *same* name and both are needed — `phrases/well-done.mp3`');
P('is the finished line ("Well done!"), `praise/well-done.mp3` is the unfinished one that runs');
P('into a child\'s name ("Well done, Sarah"). Record them as two separate takes.');
P('');
P('---');
P('');

/* ═══ SOUNDS ═══ */
P('## 1 · Letter sounds — `audio/wordland/sounds/`');
P('');
P(`${out.sounds.size} files. Say the **sound**, not the letter name — \`mmm\`, not "em".`);
P('Stretchy ones (`mmm`, `sss`, `fff`) held about a second; stopped ones (`b`, `t`, `k`)');
P('crisp, with no "uh" on the end. That "uh" is what makes a child read *cat* as "cuh-a-tuh".');
P('');
P('**⚠️ marks a sound no speech engine can say honestly** — there is no way to voice /b/ without');
P('adding a vowel, so until you record these the game falls back to naming a keyword instead');
P('("the first sound in ball"). These are the highest-value recordings in the whole project.');
P('');
P('| | File | Sound | Grapheme | Must record |');
P('|---|---|---|---|---|');
sortNames('sounds').forEach(n => {
  const v = out.sounds.get(n);
  const g = [...v.from].map(f => f.replace('grapheme ', '')).join(', ');
  P(`| ${tick('sounds/' + n)} | \`sounds/${n}.mp3\` | ${esc(v.say.split('  ')[0])} | ${esc(g)} | ${v.note ? '⚠️ yes' : '' } |`);
});
P('');

/* ═══ LETTERS ═══ */
P('## 2 · Letter names — `audio/wordland/letters/`');
P('');
P(`${out.letters.size} files, a–z. This is the letter's **name** ("ess"), not its sound ("sss").`);
P('Both are needed and they are different recordings in different folders.');
P('');
P('| | File | Say | | File | Say |');
P('|---|---|---|---|---|---|');
const ls = sortNames('letters');
for (let i = 0; i < 13; i++) {
  const a = ls[i], b = ls[i + 13];
  const nameOf = x => (D.LETTER_NAME[x.toUpperCase()] || x.toUpperCase());
  P(`| ${tick('letters/' + a)} | \`letters/${a}.mp3\` | "${nameOf(a)}" | ${tick('letters/' + b)} | \`letters/${b}.mp3\` | "${nameOf(b)}" |`);
}
P('');

/* ═══ PHRASES ═══ */
P('## 3 · Spoken lines — `audio/wordland/phrases/`');
P('');
P(`${out.phrases.size} files. Fixed lines the games say out loud. Warm, unhurried, a little`);
P('sing-song. Anything not on this list is generated on the spot and always uses the computer voice.');
P('');
P('| | File | Say | Heard in |');
P('|---|---|---|---|');
sortNames('phrases').forEach(n => {
  const v = out.phrases.get(n);
  P(`| ${tick('phrases/' + n)} | \`phrases/${n}.mp3\` | "${esc(v.say)}" | ${esc([...v.from].join('; '))} |`);
});
P('');

/* ═══ PRAISE ═══ */
P('## 4 · Praise that runs into a name — `audio/wordland/praise/`');
P('');
P(`${out.praise.size} files. **Record these RISING**, as though the sentence has not finished,`);
P('because each one is glued straight onto a child\'s name:');
P('');
P('> `praise/well-done.mp3` + `players/player1.mp3` → *"Well done, Sarah"*');
P('');
P('So it is "Well done**,**" — not "Well done**!**". If either half is missing the game says the');
P('whole line in the computer voice instead, so the two voices never meet mid-sentence.');
P('');
P('| | File | Say (rising) | Heard in |');
P('|---|---|---|---|');
sortNames('praise').forEach(n => {
  const v = out.praise.get(n);
  P(`| ${tick('praise/' + n)} | \`praise/${n}.mp3\` | "${esc(v.say)}," | ${esc([...v.from].join('; '))} |`);
});
P('');

/* ═══ PLAYERS ═══ */
P('## 5 · Children\'s names — `audio/wordland/players/`');
P('');
P(`${out.players.size} files — one per profile seat the hub can hold (\`Profiles.MAX = ${MAX}\`).`);
P('Record each child\'s name the way you actually say it, falling slightly, so it lands after a');
P('rising praise line. Re-record when a seat changes hands.');
P('');
P('| | File | Say |');
P('|---|---|---|');
sortNames('players').forEach(n => {
  P(`| ${tick('players/' + n)} | \`players/${n}.mp3\` | the name of the child in seat ${n.replace('player', '')} |`);
});
P('');

/* ═══ STORY ═══ */
P('## 6 · Story chapters — `audio/wordland/story/`');
P('');
P(`${out.story.size} files, one per lesson. Map 1 keeps the plain names (\`chapter1.mp3\`) so`);
P('anything already recorded still plays; later maps are prefixed (`map2-chapter1.mp3`).');
P('Read slowly, with the asterisked words landing clearly — those are the ones a child can tap.');
P('The full text is below, ready to read.');
P('');
const byMap = {};
D.ALL_NODES.forEach(n => { (byMap[n.map] = byMap[n.map] || []).push(n); });
Object.keys(byMap).sort((a, b) => a - b).forEach(mapNo => {
  const nodes = byMap[mapNo];
  P(`### Map ${mapNo} — lessons ${nodes[0].no}–${nodes[nodes.length - 1].no}`);
  P('');
  nodes.forEach(n => {
    const file = (n.map === 1 ? '' : 'map' + n.map + '-') + 'chapter' + n.no;
    P(`${tick('story/' + file)} **\`story/${file}.mp3\`** — *${n.story ? n.story.t : ''}* · ${n.region}`);
    P('');
    ((n.story && n.story.lines) || []).forEach(l => P('> ' + l));
    P('');
  });
});

/* ═══ WORDS ═══ */
P('## 7 · Words — `audio/wordland/words/`');
P('');
P(`${out.words.size} files — the largest group by far. One clear reading of the word on its own,`);
P('at a natural pace. Grouped below by where the word is first needed.');
P('');
P('Note the short entries (`a`, `m`, `at`, `-at`): these come from tappable words inside the story');
P('pages and from the high-frequency word lists, and the game really does ask for `words/m.mp3`');
P('separately from `letters/m.mp3`. Record the single letters here as the letter **name**.');
P('');
const groups = {};
for (const name of sortNames('words')) {
  const m = wordMap.get(name);
  const key = m === 99 ? 'Spell It & Write It only' : 'Map ' + m;
  (groups[key] = groups[key] || []).push(name);
}
const gkeys = Object.keys(groups).sort((a, b) => {
  const na = a.startsWith('Map') ? Number(a.slice(4)) : 99;
  const nb = b.startsWith('Map') ? Number(b.slice(4)) : 99;
  return na - nb;
});
gkeys.forEach(g => {
  const names = groups[g];
  const done = names.filter(n => have.has('words/' + n)).length;
  P(`### ${g} — ${names.length} words (${done} recorded, ${names.length - done} to do)`);
  P('');
  P(names.map(n => (have.has('words/' + n) ? '~~' + n + '~~' : n)).join(' · '));
  P('');
});

/* ═══ ISSUES ═══ */
P('---');
P('');
P('## Things worth fixing before you record');
P('');
P('These turned up while cross-checking the code against the files already in the repo.');
P('');
P('**1 · The sound filename lookup is reading the wrong table.**');
P('`soundName()` in `js/wordland-audio.js` returns `SOUND[letter]`, which is the *computer-voice*');
P('string, not the filename. For M that is `"mmmm"` (four m\'s), so the game asks for');
P('`sounds/mmmm.mp3` while the file you recorded is `sounds/mmm.mp3`. For stop consonants it is');
P('worse — B gives `"the first sound in ball"`, so the game looks for');
P('`sounds/the-first-sound-in-ball.mp3`. `js/wordland-data.js` line 553 already flags this:');
P('the lookup should read `SOUND_FILE[letter]`. Until that one-word change lands, **no sound');
P('recording will ever be found.** The filenames in section 1 above are the `SOUND_FILE` ones,');
P('which is what you want to record against.');
P('');
P('**2 · Five recordings are in the wrong folder or misnamed.**');
P('');
P('| File in the repo | Problem | Should be |');
P('|---|---|---|');
P('| `phrases/come-and-play.mp3` | Zib marks this `name:true` | `praise/come-and-play.mp3` |');
P('| `phrases/look-at-that.mp3` | `name:true` | `praise/look-at-that.mp3` |');
P('| `phrases/nice-to-meet-you.mp3` | `name:true` | `praise/nice-to-meet-you.mp3` |');
P('| `phrases/see-you-soon.mp3` | `name:true` | `praise/see-you-soon.mp3` |');
P('| `phrases/i-like-playing-with-you..mp3` | double dot in the filename | `phrases/i-like-playing-with-you.mp3` |');
P('');
P('The four `name:true` lines also need re-recording rather than just moving, because praise files');
P('have to rise into the child\'s name rather than land as finished sentences.');
P('');
P('**3 · `words/flour.mp3` is orphaned.** Nothing in the current content asks for it —');
P('`flower` is the one that is used. Probably a leftover from an earlier word list.');
P('');
P('**4 · `manifest.json` is stale.** It lists what has been recorded and the game trusts it');
P('completely when present. Re-run `bash tools/make-manifest.sh` after every batch, or newly');
P('added recordings will be ignored.');
P('');
P('---');
P('');
P('*Regenerate this list with `node tools/full-audio-list.js` after any content change.*');

fs.writeFileSync(path.join(OUT, 'AUDIO-MASTER-LIST.md'), L.join('\n') + '\n');
console.log('audio/wordland/AUDIO-MASTER-LIST.md written —', grand, 'files (' + (grand - grandDone) + ' still to record)');

/* ── flat rows for the tracker ── */
const rows = [];
KINDS.forEach(k => sortNames(k).forEach(n => {
  const v = out[k].get(n);
  const p = priority(k, n);
  rows.push({
    priority: p,
    group: PRIO_NAME[p],
    folder: k,
    file: k + '/' + n + '.mp3',
    say: k === 'story' ? (v.note || '') : v.say,
    where: [...v.from].join('; '),
    rising: k === 'praise' ? 'YES — rising' : '',
    must: v.note && v.note.startsWith('MUST') ? 'YES' : '',
    status: have.has(k + '/' + n) ? 'Recorded' : 'To do'
  });
}));
fs.writeFileSync(path.join(__dirname, 'audio-rows.json'), JSON.stringify(rows, null, 1));
console.log('tools/audio-rows.json written —', rows.length, 'rows');
