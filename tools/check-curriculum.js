/* ============================================================
   CURRICULUM CHECKER
   Builds every activity of all 120 lessons, many times over, and
   fails loudly on anything that would put the wrong thing in
   front of a child. Run before shipping:  node check-curriculum.js
   ============================================================ */

const fs = require('fs'), vm = require('vm'), path = require('path');
const DATA = path.join(__dirname, 'out/wordland-data.js');
const ENG  = path.join(__dirname, 'wordland.js');
const RUNS = 25;                       // rounds are random; try each lesson often

/* ── a browser, roughly ──────────────────────────────────── */
const el = () => ({ classList:{ add(){}, remove(){}, toggle(){}, contains(){ return false } },
  style:{}, dataset:{}, textContent:'', innerHTML:'', appendChild(){}, setAttribute(){},
  addEventListener(){}, focus(){}, querySelectorAll:()=>[] });
const ctx = {
  console, setTimeout:()=>0, clearTimeout(){}, Promise, Date, Math, JSON, RegExp, Object, Array, String, Number,
  document:{ getElementById:()=>el(), querySelectorAll:()=>[], querySelector:()=>null,
             createElement:()=>el(), addEventListener(){}, readyState:'complete', body:el() },
  localStorage:{ getItem:()=>null, setItem(){}, removeItem(){} },
  LETTERFORMS:Object.fromEntries('abcdefghijklmnopqrstuvwxyz'.split('').map(c=>[c,1])),
  LetterPad:null, Profiles:undefined,
  WLAudio:{ init(){}, unlock(){}, stop(){}, setMuted(){}, isMuted:()=>false, sound(){}, word(){},
            line(){}, praise(){}, cheer(){}, chapter(){}, preloadMap(){}, preloadNode(){},
            report:()=>Promise.resolve({ total:0, found:0, rows:[], source:'test' }), rescan(){} }
};
ctx.window = ctx; ctx.globalThis = ctx;
vm.createContext(ctx);
/* const/let are lexical, so the two files must run as one script or
   the engine cannot see the data. */
const src = fs.readFileSync(DATA,'utf8') + '\n' +
  fs.readFileSync(ENG,'utf8').replace(/^if\(document\.readyState[\s\S]*$/m,'') +
  '\n;globalThis.__api = { MAPS, ALL_NODES, useMap, buildRounds, ENG, PHON, SOUND_LABEL, KEYWORD, graphemesUpTo, hfwUpTo, splitGraphemes };';
vm.runInContext(src, ctx, { filename:'wordland.js' });
Object.assign(ctx, ctx.__api);

/* ── checks ──────────────────────────────────────────────── */
const fail = [], warn = [];
const ALPHABET_LEVEL = ['sound','beginSound','starts','tapAll','hunt','caseMatch','match','write'];

ctx.MAPS.forEach(m => {
  ctx.useMap(m.no);
  m.nodes.forEach(n => {
    const L = (m.no - 1) * 10 + n.no;
    const tag = `L${L} ${n.region}`;

    /* the lesson must declare what it teaches */
    if(!n.kind) fail.push(`${tag}: no kind`);

    /* alphabet-level work only while a letter is new */
    /* upper/lowercase matching IS the alphabet lesson, so `skill`
       is allowed those two; nothing else outside grapheme work is. */
    const allowed = n.kind === 'skill' ? ['caseMatch','match'] : [];
    if(!['grapheme','digraph'].includes(n.kind))
      n.plan.forEach(p => { const t = String(p).split(':')[0];
        if(ALPHABET_LEVEL.includes(t) && !allowed.includes(t))
          fail.push(`${tag}: ${t} on a ${n.kind} lesson`) });

    for(let k = 0; k < RUNS; k++){
      let rounds;
      try { rounds = ctx.buildRounds(n) }
      catch(e){ fail.push(`${tag}: buildRounds threw — ${e.message}`); break }
      if(rounds.length !== 10) fail.push(`${tag}: ${rounds.length} activities, expected 10`);

      rounds.forEach(r => {
        if(!ctx.ENG[r.type]) fail.push(`${tag}: no renderer for "${r.type}"`);

        /* the writing pad must have a shape to trace */
        if(r.type === 'write'){
          if(!r.letter) fail.push(`${tag}: write round with no letter`);
          else if(!(n.teaches||[]).includes(r.letter))
            fail.push(`${tag}: writing "${r.letter}", which this lesson does not teach`);
        }
        /* the machine must build the words it claims are correct */
        if(r.type === 'machine'){
          if(!r.correct.length) fail.push(`${tag}: machine with no words`);
          r.correct.forEach(w => {
            const built = r.mode === 'onset'
              ? r.parts.some(p => r.fixed + p === w)
              : r.parts.some(p => p + r.fixed === w);
            if(!built) fail.push(`${tag}: machine cannot build "${w.toLowerCase()}" from -${r.fixed.toLowerCase()}`);
          });
          const rubbish = r.parts.filter(p => {
            const made = r.mode === 'onset' ? r.fixed + p : p + r.fixed;
            return r.correct.includes(made);
          });
          if(!rubbish.length) fail.push(`${tag}: machine has no correct piece`);
        }
        /* sound boxes must hold the word */
        if(r.type === 'spell'){
          if(r.units.join('') !== r.answer)
            fail.push(`${tag}: sound boxes ${r.units.join('·')} do not spell ${r.answer}`);
          r.units.forEach(u => { if(!r.tiles.includes(u))
            fail.push(`${tag}: no tile for "${u}" in ${r.answer}`) });
        }
        if(r.type === 'blendIt' && r.units.join('') !== r.answer)
          fail.push(`${tag}: blend units ${r.units.join('·')} do not spell ${r.answer}`);
        /* every multiple choice needs exactly one right answer */
        if(r.opts && r.answer !== undefined && ['sound','beginSound','initial','caseMatch','sight','blend','rhyme','vowelPick','listen','starts'].includes(r.type)){
          const hits = r.opts.filter(o => (o && o.w ? o.w : o) === r.answer).length;
          if(hits !== 1) fail.push(`${tag}: ${r.type} has ${hits} correct options`);
        }
        /* a distractor must not be a different shape from the answer */
        if(r.type === 'sound' || r.type === 'beginSound'){
          const odd = r.opts.filter(o => String(o).length !== String(r.answer).length);
          if(odd.length) warn.push(`${tag}: ${r.type} answer "${r.answer}" among ${odd.join(',')}`);
        }
        /* sight words should be plausibly confusable, not obviously wrong */
        if(r.type === 'sight'){
          const plausible = r.opts.filter(o => o !== r.answer &&
            (o[0] === r.answer[0] || Math.abs(o.length - r.answer.length) <= 2));
          if(!plausible.length) warn.push(`${tag}: "${r.answer.toLowerCase()}" offered against ${r.opts.filter(o=>o!==r.answer).map(o=>o.toLowerCase()).join(', ')}`);
        }
      });
    }
  });
});

/* ── initial-sound honesty: does the word start with the sound? ── */
const TRAP = [/^TH/,/^CH/,/^SH/,/^WH/,/^PH/,/^KN/,/^WR/];
ctx.ALL_NODES.forEach(n => {
  if(!['grapheme','digraph'].includes(n.kind)) return;
  (n.teaches||[]).forEach(g => {
    if(g.length > 1) return;
    n.vocab.filter(v => v.w.startsWith(g)).forEach(v => {
      if(TRAP.some(t => t.test(v.w)) && !v.w.startsWith(g + (v.w[1]||'')))
        fail.push(`L${(n.map-1)*10+n.no}: "${v.w.toLowerCase()}" does not begin with /${g.toLowerCase()}/`);
    });
  });
});

/* ── how much of each story chapter can the child actually read? ──
   A reward chapter that invites tapping every word is a reading text,
   and a reading text should be built from what has been taught. */
function decodability(){
  const rows = [];
  ctx.ALL_NODES.forEach(n => {
    const known = new Set(ctx.graphemesUpTo(n.map, n.no));
    const hf = new Set(ctx.hfwUpTo(n.map, n.no).map(h => h.w));
    const words = n.story.lines.join(' ').replace(/[*.,!'?]/g, ' ')
      .split(/\s+/).filter(Boolean).map(w => w.toUpperCase());
    const ok = words.filter(w => hf.has(w) || ctx.splitGraphemes(w).every(g => known.has(g)));
    rows.push({ L:(n.map-1)*10+n.no, pct: Math.round(ok.length / words.length * 100) });
  });
  const avg = Math.round(rows.reduce((a, r) => a + r.pct, 0) / rows.length);
  const good = rows.filter(r => r.pct >= 90).length;
  console.log(`\nDecodability of the story chapters: ${avg}% average, ` +
              `${good} of ${rows.length} at 90% or better.`);
  if(avg < 90) console.log('  These read beautifully aloud, but a child cannot decode them.\n' +
    '  A short decodable page per lesson, built only from taught graphemes\n' +
    '  and taught sight words, is the biggest thing still missing.');
}

/* ── report ──────────────────────────────────────────────── */
const uniq = a => [...new Set(a)];
const f = uniq(fail), w = uniq(warn);
console.log(`\n${ctx.ALL_NODES.length} lessons · ${RUNS} builds each · ${ctx.ALL_NODES.length*RUNS*10} activities checked\n`);
if(f.length){ console.log('FAILURES (' + f.length + ')'); f.slice(0,40).forEach(x=>console.log('  ✗ '+x)) }
else console.log('No failures.');
if(w.length){ console.log('\nWorth a look (' + w.length + ')'); w.slice(0,20).forEach(x=>console.log('  · '+x)) }
decodability();
process.exit(f.length ? 1 : 0);
