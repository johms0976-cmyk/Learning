/* Builds the complete list of every audio file the three games can ask for.
   Reads the same tables the games read, so it can't drift. */
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..');
const D = require(path.join(R, 'js/wordland-data.js'));

/* the games' own slug(), copied from js/wordland-audio.js */
const slug = s => String(s).toLowerCase().trim()
  .replace(/['’.,!?]/g, '').replace(/\s+/g, '-')
  .replace(/[^a-z0-9_-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');

const out = { sounds:new Map(), letters:new Map(), words:new Map(),
              story:new Map(), phrases:new Map(), praise:new Map(), players:new Map() };
const add = (k, name, why) => {
  if (!name) return;
  if (!out[k].has(name)) out[k].set(name, { say:why.say, from:new Set([why.from]), note:why.note });
  else out[k].get(name).from.add(why.from);
};

/* ── 1. SOUNDS ───────────────────────────────────────────── */
/* filename comes from PHON[g].file (SOUND_FILE) */
const usedGraphemes = new Set();
D.ALL_NODES.forEach(n => (n.letters||[]).forEach(l => usedGraphemes.add(String(l).toUpperCase())));
'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(c => usedGraphemes.add(c)); // Spell It + Write It use all 26
[...usedGraphemes].forEach(g => {
  const p = D.PHON[g];
  if (!p) return;
  add('sounds', p.file, {
    say: p.say + '  (the sound, not the letter name)',
    from: 'grapheme ' + g,
    note: p.tts === null ? 'MUST record — no speech engine can say this cleanly' : null
  });
});

/* ── 2. LETTER NAMES ─────────────────────────────────────── */
'abcdefghijklmnopqrstuvwxyz'.split('').forEach(c => {
  const nm = D.LETTER_NAME[c.toUpperCase()];
  add('letters', c, { say:'the letter name "' + (nm || c.toUpperCase()) + '"', from:'alphabet', note:null });
});

/* ── 3. WORDS ────────────────────────────────────────────── */
const word = (w, from) => add('words', slug(w), { say:String(w).toLowerCase(), from, note:null });

D.ALL_NODES.forEach(n => {
  const L = 'Map ' + n.map + ' L' + n.no;
  (n.vocab||[]).forEach(v => word(v.w, L));
  (n.words||[]).forEach(v => word(v.w, L));
  (n.family||[]).forEach(v => word(v.w, L));
  (n.hfw||[]).forEach(h => word(h.w, L));
  (n.sentences||[]).forEach(s => (s.s||[]).forEach(w => word(w, L)));
});
Object.values(D.KEYWORD).forEach(k => word(k.w, 'keyword picture'));

/* tappable *asterisked* words inside the story pages call WLAudio.word()
   after stripping punctuation — js/wordland.js readStory() */
D.ALL_NODES.forEach(n => {
  ((n.story && n.story.lines) || []).forEach(l => {
    (l.match(/\*([^*]+)\*/g) || []).forEach(raw => {
      const w = raw.replace(/\*/g, '').replace(/[^A-Za-z-]/g, '');
      if (w) word(w, 'story tap \u00b7 Map ' + n.map + ' ch' + n.no);
    });
  });
});

/* Spell It's own banks — pulled straight out of spelling-game.html */
const html = fs.readFileSync(path.join(R, 'spelling-game.html'), 'utf8');
const grab = name => {
  const m = html.match(new RegExp('const\\s+' + name + '\\s*=\\s*(\\[[\\s\\S]*?\\n\\];)'));
  if (!m) { console.error('!! could not find ' + name); return []; }
  return eval(m[1].replace(/;$/, ''));
};
grab('CVC').forEach(w => word(w.w, 'Spell It \u00b7 word bank'));
grab('SIGHT_WORDS').forEach(w => word(w, 'Spell It \u00b7 sight words'));
grab('RHYME_FAMILIES').forEach(f => f.i.forEach(x => word(x.w, 'Spell It \u00b7 rhyme')));
grab('PAINT_SHAPES').forEach(s => word(s.n, 'Spell It \u00b7 painted shape'));
grab('BUILD_SENTENCES').forEach(s => s.w.forEach(w => word(w, 'Spell It \u00b7 sentence building')));
grab('SENTENCES').forEach(s => {
  s.t.forEach(w => { if (w !== '___') word(w, 'Spell It \u00b7 cloze sentence'); });
  s.o.forEach(w => word(w, 'Spell It \u00b7 cloze sentence'));
});
const letterTable = html.match(/const\s+PHONICS\s*=\s*(\{[\s\S]*?\n\};)/);
if (letterTable) {
  const t = eval('(' + letterTable[1].replace(/;$/, '') + ')');
  Object.values(t).forEach(v => word(v.w, 'Spell It \u00b7 letter picture'));
} else console.error('!! PHONICS not found');

/* ── 4. STORY CHAPTERS ───────────────────────────────────── */
D.ALL_NODES.forEach(n => {
  const name = (n.map === 1 ? '' : 'map' + n.map + '-') + 'chapter' + n.no;
  const lines = (n.story && n.story.lines) ? n.story.lines : [];
  add('story', name, {
    say: (n.story ? n.story.t : '') + ' — ' + lines.length + ' lines',
    from: 'Map ' + n.map + ' · ' + n.region,
    note: lines.join(' ')
  });
});

/* ── 5 & 6. PHRASES AND PRAISE ───────────────────────────── */
const PHRASE_LINES = [
  'Try again','Not that one','Have another go',
  'Yes!','Nice one!','You got it!','Brilliant!','Well done!','Superstar!',
  'You did it! A new chapter for your storybook.',
  'You wrote it!','Next letter','Good',
  'Find the words that rhyme',
  'Pop the letter','Paint every letter','Drive through the letter','You painted a',
  'Wonderful!','Great job!','You did it!','Hooray!','Amazing!',
  'Welcome to your learning journey!','What is your name?'
];
const PRAISE_LINES = ['Hello','Yes','Nice one','You got it','Brilliant','Well done',
  'Superstar','Wonderful','Great job','You did it','Hooray','Amazing','Keep going','Off you go'];

PHRASE_LINES.forEach(l => add('phrases', slug(l), { say:l, from:'game phrase', note:null }));
PRAISE_LINES.forEach(l => add('praise', slug(l), { say:l, from:'praise + name', note:'record RISING — runs into the child\u2019s name' }));

/* Zib's script */
const mascot = fs.readFileSync(path.join(R, 'js/mascot.js'), 'utf8');
const zibBlock = mascot.match(/const LINES = \[([\s\S]*?)\n  \];/)[1];
const zibRe = /\{\s*t:\s*(".*?"|'.*?')\s*,\s*g:\s*'([^']*)'\s*,\s*tier:\s*(\d)([^}]*)\}/g;
let m2, zibCount = 0;
while ((m2 = zibRe.exec(zibBlock))) {
  const text = eval(m2[1]), group = m2[2], tier = m2[3], rest = m2[4] || '';
  const isName = /name:\s*true/.test(rest);
  zibCount++;
  add(isName ? 'praise' : 'phrases', slug(text), {
    say: text, from: 'Zib · ' + group + ' (tier ' + tier + ')',
    note: isName ? 'record RISING — runs into the child\u2019s name' : null
  });
}

/* ── 7. PLAYER NAMES ─────────────────────────────────────── */
const MAX = Number((fs.readFileSync(path.join(R,'js/profiles.js'),'utf8').match(/const MAX = (\d+)/)||[])[1] || 4);
for (let i = 1; i <= MAX; i++)
  add('players', 'player' + i, { say:"child " + i + "'s name, as you say it", from:'profiles', note:null });

/* ── what already exists ─────────────────────────────────── */
const have = new Set();
['sounds','letters','words','story','phrases','praise','players'].forEach(k => {
  const dir = path.join(R, 'audio/wordland', k);
  if (fs.existsSync(dir)) fs.readdirSync(dir).filter(f => f.endsWith('.mp3'))
    .forEach(f => have.add(k + '/' + f.replace(/\.mp3$/, '')));
});

module.exports = { out, have, slug, D, zibCount, MAX };

if (require.main === module) {
  let total = 0, done = 0;
  for (const k of ['sounds','letters','words','story','phrases','praise','players']) {
    const names = [...out[k].keys()].sort((a,b)=>a.localeCompare(b,'en',{numeric:true}));
    const d = names.filter(n => have.has(k + '/' + n)).length;
    total += names.length; done += d;
    console.log(k.padEnd(9) + String(names.length).padStart(4) + '   recorded: ' + d);
  }
  console.log('-'.repeat(34));
  console.log('TOTAL'.padEnd(9) + String(total).padStart(4) + '   recorded: ' + done + '   to do: ' + (total - done));
  console.log('Zib lines parsed: ' + zibCount + ' · profile seats: ' + MAX);
}
