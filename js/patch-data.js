/* ============================================================
   PATCH-DATA  ·  node patch-data.js
   ------------------------------------------------------------
   out/wordland-data.js is GENERATED from phon-table.js and
   lesson-table.js by build-data.js. Both source tables have
   changed, so the generated file is stale.

   build-data.js already copies PHON straight through and already
   copies `kind` and `teaches` straight through, so re-running it
   is all that is really needed and this script becomes dead. It
   exists so the change can be applied and tested TODAY, without
   build-data.js in hand, and so that what build-data.js has to
   do is written down somewhere unambiguous:

     1. PHON            = phon-table.js, verbatim
     2. TH_VOICED       = phon-table.js's TH_VOICED list
     3. node.teaches    = lesson-table.js's teaches, verbatim
     4. SOUND_FILE / SOUND_LABEL / SOUND / MUST_RECORD are all
        derived from PHON and need no change
     5. LETTER_NAME     = new, derived from PHON[g].name

   Run it once, run check-curriculum.js, then delete it.
   ============================================================ */

const fs = require('fs'), path = require('path');
const PHON   = require('./phon-table.js');
const LESSON = require('./lesson-table.js');
const FILE   = path.join(__dirname, 'out/wordland-data.js');

let src = fs.readFileSync(FILE, 'utf8');
const before = src;

/* idempotent: strip anything a previous run added */
src = src.replace(/\n\/\* which words take the voiced th[\s\S]*?LETTER_NAME\[k\] = PHON\[k\]\.name \}\);\n/, '\n');

/* ── 1. PHON ────────────────────────────────────────────────
   Everything except the two non-grapheme exports. */
const graphemes = {};
Object.keys(PHON).forEach(k => {
  if(k === 'TH_VOICED' || k === 'MUST_RECORD_NOTE') return;
  graphemes[k] = PHON[k];
});

const phonStart = src.indexOf('const PHON = {');
const phonEnd   = src.indexOf('\n};', phonStart) + 3;
if(phonStart < 0) throw new Error('cannot find PHON block');
src = src.slice(0, phonStart)
    + 'const PHON = ' + JSON.stringify(graphemes, null, 1) + ';\n\n'
    + '/* which words take the voiced th. Everything else is unvoiced. */\n'
    + 'const TH_VOICED = ' + JSON.stringify(PHON.TH_VOICED) + ';\n'
    + 'PHON.TH_VOICED = TH_VOICED;\n\n'
    + '/* letter NAMES. Most children find the sound inside the name,\n'
    + '   and letter-name knowledge is the strongest single predictor\n'
    + '   of later decoding (NELP, 2008). The table had sounds and no\n'
    + '   names at all. */\n'
    + 'const LETTER_NAME = {};\n'
    + 'Object.keys(PHON).forEach(k => { if(PHON[k] && PHON[k].name) LETTER_NAME[k] = PHON[k].name });\n'
    + src.slice(phonEnd);

/* ── 2. teaches, lesson by lesson ────────────────────────── */
/* Nodes appear in order across MAP1..MAP12, so the nth `{no:` at
   the start of a line is lesson n. */
const lines = src.split('\n');
let lesson = 0, patched = 0;
const changes = [];
for(let i = 0; i < lines.length; i++){
  if(!/^\{no:\d+, region:/.test(lines[i])) continue;
  lesson++;
  const spec = LESSON[lesson];
  if(!spec) continue;
  /* the kind/teaches line is the next few lines down */
  for(let j = i; j < i + 6 && j < lines.length; j++){
    const m = lines[j].match(/^(\s*)kind:"([a-z]+)", teaches:\[([^\]]*)\](.*)$/);
    if(!m) continue;
    const want = spec.teaches || [];
    const have = m[3].length ? m[3].split(',').map(s => s.replace(/[" ]/g,'')) : [];
    if(want.join(',') !== have.join(',')){
      lines[j] = `${m[1]}kind:"${m[2]}", teaches:[${want.map(g=>`"${g}"`).join(',')}]${m[4]}`;
      changes.push(`L${lesson}: [${have.join(' ')}] -> [${want.join(' ')}]`);
      patched++;
    }
    break;
  }
}
src = lines.join('\n');

/* ── 3. export the new tables ───────────────────────────── */
src = src.replace(
  /module\.exports = \{ SOUND, SOUND_FILE, SOUND_LABEL, MUST_RECORD, PHON,/,
  'module.exports = { SOUND, SOUND_FILE, SOUND_LABEL, MUST_RECORD, PHON,\n                     TH_VOICED, LETTER_NAME,');

if(src === before){ console.log('nothing to change'); process.exit(0) }
fs.writeFileSync(FILE, src);
console.log(`PHON rewritten (${Object.keys(graphemes).length} graphemes, was 37)`);
console.log(`teaches updated on ${patched} lessons:`);
changes.forEach(c => console.log('  ' + c));
