/* ============================================================
   TTS-SPEC  ·  node tools/tts-spec.js
   ------------------------------------------------------------
   Writes tools/tts-spec.json — one entry per audio file, with
   the exact text to feed the voice and the prosody to use.

   Nothing here talks to a network. Generating the spec and
   generating the audio are deliberately separate steps so you
   can open the JSON, fix a pronunciation, and re-run only the
   synthesis.
   ============================================================ */
const fs = require('fs'), path = require('path');
const { out, have, D } = require('./full-audio-list.js');
const R = path.join(__dirname, '..');

/* ── words the voice gets wrong, or that need coaxing ────────
   Edit freely. Left is the filename, right is what to say.
   Spelling it the way it sounds is the whole trick. */
const OVERRIDES = {
  'words/tv':        'T V',
  'words/a':         'uh',            // the word "a", not the letter
  'words/i':         'eye',
  'words/moss':      'moss',
  'words/mum':       'mum',
  'words/read':      'reed',
  'words/live':      'liv',
  'words/wind':      'wind',
  'words/bow':       'boh',
  'words/tear':      'teer',
  'words/lead':      'leed',
  'words/row':       'roh',
  'words/close':     'klohz',
  'words/use':       'yooz',
  'words/wound':     'woond'
};

/* Per-folder voice settings. Values are edge-tts style, e.g. "-15%".

   Paths in the spec are pack-neutral — 'words/cat.mp3', never
   'voices/uk-male/words/cat.mp3'. The generator adds the pack
   folder, so one spec builds all four voices. */
const STYLE = {
  sounds:  { rate: '-30%', pitch: '+0Hz'  },
  letters: { rate: '-20%', pitch: '+10Hz' },
  words:   { rate: '-20%', pitch: '+5Hz'  },
  story:   { rate: '-18%', pitch: '+0Hz'  },
  phrases: { rate: '-12%', pitch: '+12Hz' },
  praise:  { rate: '-12%', pitch: '+18Hz' },
  players: { rate: '-15%', pitch: '+12Hz' },
  /* A name lands on the end of a rising line, so it wants the
     same warmth as praise but a finished fall, which is what you
     get by leaving the full stop on. */
  names:   { rate: '-15%', pitch: '+12Hz' }
};

const spec = [];
const push = o => spec.push(o);

/* ── sounds ──────────────────────────────────────────────────
   Held back on purpose. A neural voice cannot say /b/ without
   putting a vowel after it — feed it "buh" and it says "buh",
   which is precisely the habit the game exists to prevent.
   Left in the spec, marked skip, so the count still reconciles. */
for (const [name, v] of out.sounds) {
  push({
    path: 'sounds/' + name + '.mp3',
    text: name,
    ...STYLE.sounds,
    skip: 'phonics — record this one yourself; TTS adds a schwa'
  });
}

/* ── letter names ────────────────────────────────────────── */
for (const name of out.letters.keys()) {
  push({
    path: 'letters/' + name + '.mp3',
    text: D.LETTER_NAME[name.toUpperCase()] || name,
    ...STYLE.letters
  });
}

/* ── words ───────────────────────────────────────────────── */
for (const name of out.words.keys()) {
  const key = 'words/' + name;
  let text;
  if (OVERRIDES[key]) text = OVERRIDES[key];
  else if (name.length === 1) text = D.LETTER_NAME[name.toUpperCase()] || name;  // "*M*" tapped in a story
  else text = name.replace(/-/g, ' ');
  push({ path: key + '.mp3', text, ...STYLE.words });
}

/* ── story chapters ──────────────────────────────────────── */
D.ALL_NODES.forEach(n => {
  const file = (n.map === 1 ? '' : 'map' + n.map + '-') + 'chapter' + n.no;
  const text = ((n.story && n.story.lines) || [])
    .map(l => l.replace(/\*/g, ''))
    .join(' ');
  push({ path: 'story/' + file + '.mp3', text, ...STYLE.story });
});

/* ── phrases ─────────────────────────────────────────────── */
for (const [name, v] of out.phrases) {
  push({ path: 'phrases/' + name + '.mp3', text: v.say, ...STYLE.phrases });
}

/* ── praise ──────────────────────────────────────────────────
   A trailing comma is what makes the voice hold the pitch up,
   so the child's name lands on the end instead of after a full
   stop. Do not remove it. */
for (const [name, v] of out.praise) {
  push({
    path: 'praise/' + name + '.mp3',
    text: v.say.replace(/[.!?]+$/, '') + ',',
    ...STYLE.praise
  });
}

/* ── the name library ────────────────────────────────────────
   From audio/wordland/names.json — run tools/names-list.js first.
   Said on its own, finished, because it lands on the end of a
   rising praise line: "Hello," → "Sarah."

   A name the voice mispronounces is worth fixing here rather than
   re-recording: add it to NAME_SAY spelled the way it sounds. */
const NAME_SAY = {
  'aisha':   'Ay-ee-sha',
  'niamh':   'Neev',
  'saoirse': 'Sur-sha',
  'siobhan': 'Shiv-awn',
  'xanthe':  'Zan-thee',
  'esme':    'Ez-may',
  'zoe':     'Zo-ee',
  'chloe':   'Klo-ee',
  'joel':    'Jo-el',
  'thea':    'Tay-uh',
  'rhea':    'Ree-uh',
  'ines':    'Ee-ness',
  'hugo':    'Hew-go',
  'imogen':  'Im-oh-jen'
};

for (const [name, v] of out.names) {
  push({
    path: 'names/' + name + '.mp3',
    text: NAME_SAY[name] || v.say,
    ...STYLE.names
  });
}

/* ── the children's names ────────────────────────────────────
   Nobody but you knows what these are. Put them in
   tools/tts-names.json as {"player1":"Sarah"} and re-run. */
let names = {};
const namesFile = path.join(__dirname, 'tts-names.json');
if (fs.existsSync(namesFile)) names = JSON.parse(fs.readFileSync(namesFile, 'utf8'));
for (const name of out.players.keys()) {
  push({
    path: 'players/' + name + '.mp3',
    text: names[name] || '',
    ...STYLE.players,
    skip: names[name] ? undefined : 'no name set — add it to tools/tts-names.json'
  });
}

/* Marks what already sits in the PLAIN folders, so the summary
   below is about the originals. Each voice pack is checked on
   disk by the generator as it goes, so a file you recorded
   yourself in any pack is never overwritten. */
spec.forEach(s => { s.exists = have.has(s.path.replace(/\.mp3$/, '')); });

fs.writeFileSync(path.join(__dirname, 'tts-spec.json'), JSON.stringify(spec, null, 1));

const todo = spec.filter(s => !s.skip && !s.exists);
const skipped = spec.filter(s => s.skip);
console.log('tts-spec.json written');
console.log('  entries          ' + spec.length);
console.log('  already in the plain folders ' + spec.filter(s => s.exists).length);
console.log('  held back        ' + skipped.length + '  (' + [...new Set(skipped.map(s => s.path.split('/')[0]))].join(', ') + ')');
console.log('  to synthesise    ' + todo.length + '  per voice');
console.log('  characters       ' + todo.reduce((a, s) => a + s.text.length, 0) + '  per voice');
console.log('\nThe spec is pack-neutral. Build a voice with:');
console.log('  python3 tools/tts-generate.py --pack uk-male');
