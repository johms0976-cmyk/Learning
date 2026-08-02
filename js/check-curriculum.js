/* ============================================================
   CURRICULUM CHECKER
   Builds every activity of all 120 lessons, many times over, and
   fails loudly on anything that would put the wrong thing in
   front of a child. Run before shipping:  node check-curriculum.js
   ============================================================ */

const fs = require('fs'), vm = require('vm'), path = require('path');
const DATA = path.join(__dirname, 'out/wordland-data.js');
const READ = path.join(__dirname, 'wordland-reading.js');
const ENG  = path.join(__dirname, 'wordland.js');
const RUNS = 25;                       // rounds are random; try each lesson often

/* The reading page must be readable. Not "mostly", not "on
   average" — a page whose whole purpose is that the child can
   get through it unaided fails at anything under this. */
const PAGE_FLOOR = 100;                // % decodable, per lesson
const CHAPTER_FLOOR = 0;               // chapters are read TO the child; not gated

/* ── a browser, roughly ──────────────────────────────────── */
const el = () => ({ classList:{ add(){}, remove(){}, toggle(){}, contains(){ return false } },
  style:{}, dataset:{}, textContent:'', innerHTML:'', appendChild(){}, setAttribute(){},
  addEventListener(){}, focus(){}, querySelectorAll:()=>[], querySelector:()=>null });
const ctx = {
  console, setTimeout:()=>0, clearTimeout(){}, Promise, Date, Math, JSON, RegExp, Object, Array, String, Number, Set, Map,
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
/* const/let are lexical, so the files must run as one script or
   the engine cannot see the data. Order matters: data, then the
   reading module (it owns splitGraphemes), then the engine. */
const strip = f => fs.readFileSync(f,'utf8')
  .replace(/^if\s*\(?\s*typeof module[\s\S]*?^\}\s*$/m, '')     // node-only exports
  .replace(/^if\(document\.readyState[\s\S]*$/m, '');           // boot
const src = strip(DATA) + '\n' + strip(READ) + '\n' + strip(ENG) +
  '\n;globalThis.__api = { MAPS, ALL_NODES, useMap, buildRounds, ENG, PHON, SOUND_LABEL, KEYWORD,' +
  ' graphemesUpTo, hfwUpTo, splitGraphemes, decodablePage, phonFor, blendPlan, wordIsDecodable,' +
  ' HOLD_WHOLE, normalisePlan, LETTER_NAME, initialTrapped, initialDialect,' +
  ' INITIAL_TRAP, NOUN, ANIMATE };';
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
      ctx.normalisePlan(n).forEach(p => { const t = String(p).split(':')[0];
        if(ALPHABET_LEVEL.includes(t) && !allowed.includes(t))
          fail.push(`${tag}: ${t} on a ${n.kind} lesson`) });

    /* every rime lesson must also work at the phoneme, not only
       at the rime — swapping onsets onto -at is not decoding */
    if(['family','blend'].includes(n.kind)){
      const types = ctx.normalisePlan(n).map(p => String(p).split(':')[0]);
      if(!types.includes('blendIt'))
        fail.push(`${tag}: a ${n.kind} lesson with no full-phoneme blending`);
      if(!types.includes('spell'))
        fail.push(`${tag}: a ${n.kind} lesson with no sound boxes`);
    }

    for(let k = 0; k < RUNS; k++){
      let rounds;
      try { rounds = ctx.buildRounds(n) }
      catch(e){ fail.push(`${tag}: buildRounds threw — ${e.message}`); break }
      if(rounds.length !== 10) fail.push(`${tag}: ${rounds.length} activities, expected 10`);

      /* spaced retrieval: two of the ten should come from before */
      const rev = rounds.filter(r => r.review).length;
      if(L > 12 && rev === 0) warn.push(`${tag}: no review items interleaved`);

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

/* ── every grapheme a word needs must be a grapheme somebody
      teaches. -ock and -uck were taught as rimes for sixty
      lessons while CK was in nobody's `teaches`.            ── */
{
  const taught = new Set(ctx.graphemesUpTo(12, 10));
  const need = new Set();
  ctx.ALL_NODES.forEach(n => [...n.words, ...n.family].forEach(v =>
    ctx.splitGraphemes(v.w).forEach(g => need.add(g))));
  [...need].forEach(g => {
    if(!taught.has(g) && !ctx.PHON[g])
      warn.push(`grapheme "${g.toLowerCase()}" is used in word lists but is in no PHON entry`);
    else if(!taught.has(g) && !/^[A-Z]$/.test(g))
      fail.push(`grapheme "${g.toLowerCase()}" appears in decodable word lists but no lesson teaches it`);
    else if(!/^[A-Z]$/.test(g)){
      /* taught eventually — but is it taught before it is used? */
      const firstTaught = ctx.ALL_NODES.find(n => (n.teaches||[]).includes(g));
      const firstUsed = ctx.ALL_NODES.find(n => [...n.words, ...n.family]
        .some(v => ctx.splitGraphemes(v.w).includes(g)));
      if(firstTaught && firstUsed){
        const tl = (firstTaught.map-1)*10+firstTaught.no, ul = (firstUsed.map-1)*10+firstUsed.no;
        if(ul < tl) warn.push(`"${g.toLowerCase()}" is used in a word at L${ul} but not taught until L${tl}`);
      }
    }
  });
}

/* ── initial-sound honesty: does the word start with the sound? ──
   The consonant traps were caught; the vowel traps were not, and
   they are the ones that slip through review, because "alien"
   looks like an a-word on the page. It is not — it begins with
   the NAME of the letter, which is exactly the confusion an
   initial-sound activity exists to resolve.

   The trap tables live in wordland-reading.js, so the check and
   the engine cannot disagree about which words are barred: the
   engine filters them out, and this verifies the filter works by
   inspecting the rounds it actually builds.                    */
ctx.MAPS.forEach(m => {
  ctx.useMap(m.no);
  m.nodes.forEach(n => {
    const L = `L${(m.no-1)*10+n.no}`;
    for(let k = 0; k < 5; k++){
      let rounds; try { rounds = ctx.buildRounds(n) } catch(e){ break }
      rounds.forEach(r => {
        const letter = r.letter || r.answer;
        if(!letter || String(letter).length > 1) return;
        const check = w => {
          if(r.atEnd) return;
          if(ctx.initialTrapped(letter, w))
            fail.push(`${L}: "${String(w).toLowerCase()}" offered as a ${String(letter).toLowerCase()}-word in a ${r.type} round — it does not begin with ${ctx.SOUND_LABEL[letter]||letter}`);
          else if(ctx.initialDialect(letter, w))
            warn.push(`${L}: "${String(w).toLowerCase()}" as a ${String(letter).toLowerCase()}-word depends on accent — check it in your voice`);
        };
        if(r.type === 'starts')      check(r.answer);
        if(r.type === 'beginSound')  check(r.target && r.target.w);
        if(r.type === 'initial')     check(r.target && r.target.w);
        if(r.type === 'tapAll')      (r.correct||[]).forEach(check);
      });
    }
  });
});

/* the same words must also not be sitting in the vocabulary of a
   lesson that teaches that letter without the engine knowing */
ctx.ALL_NODES.forEach(n => {
  if(!['grapheme','digraph'].includes(n.kind)) return;
  (n.teaches||[]).forEach(g => {
    if(g.length > 1 || /_/.test(g)) return;
    const L = `L${(n.map-1)*10+n.no}`;
    n.vocab.filter(v => v.w.startsWith(g)).forEach(v => {
      if(ctx.initialTrapped(g, v.w))
        warn.push(`${L}: "${v.w.toLowerCase()}" is in the vocabulary for ${ctx.SOUND_LABEL[g]||g} but does not begin with it — kept as a picture, barred from initial-sound rounds`);
    });
  });
});

/* ── th must know which th it is ─────────────────────────── */
{
  const seen = { TH_V:[], TH_U:[] };
  ctx.ALL_NODES.forEach(n => [...n.vocab, ...n.words, ...n.family].forEach(v => {
    if(!/TH/.test(v.w)) return;
    seen[ctx.phonFor('TH', v.w, 0, ctx.splitGraphemes(v.w))].push(v.w);
  }));
  if(!seen.TH_V.length || !seen.TH_U.length)
    fail.push('th: only one of the two th sounds is ever used — the split is not wired up');
  if(ctx.phonFor('TH','THE') !== 'TH_V' || ctx.phonFor('TH','THIN') !== 'TH_U')
    fail.push('th: "the" and "thin" are not getting different sounds');
}

/* ── the reading page: can the child actually read it? ────── */
function readingPages(){
  const rows = [], empty = [];
  ctx.MAPS.forEach(m => {
    ctx.useMap(m.no);
    m.nodes.forEach(n => {
      const L = (m.no - 1) * 10 + n.no;
      const p = ctx.decodablePage({ ...n, map:m.no });
      if(!p){ empty.push(L); return }
      rows.push({ L, pct:p.pct, words:p.words.length, text:p.lines.map(l=>l.words.join(' ')).join(' / ') });
      if(p.pct < PAGE_FLOOR)
        fail.push(`L${L}: reading page is ${p.pct}% decodable — ` +
          p.words.filter(w => !ctx.wordIsDecodable(w, new Set(ctx.graphemesUpTo(m.no,n.no)),
            new Set(ctx.hfwUpTo(m.no,n.no).map(h=>h.w)))).join(', '));
    });
  });
  const avg = rows.length ? Math.round(rows.reduce((a,r)=>a+r.pct,0)/rows.length) : 0;
  console.log(`\nReading pages: ${rows.length} of 120 lessons, ${avg}% decodable on average, ` +
              `${rows.filter(r=>r.pct>=PAGE_FLOOR).length} at ${PAGE_FLOOR}%.`);
  if(empty.length)
    console.log(`  No page yet at lessons ${empty.join(', ')} — too few taught words to ` +
                `build a sentence. Correct: an unreadable page is worse than none.`);
  console.log('  Samples:');
  [3,10,25,50,80,120].forEach(L => {
    const r = rows.find(x => x.L === L); if(r) console.log(`    L${L}: ${r.text.toLowerCase()}`);
  });
  return rows;
}

/* ── how much of each story chapter can the child decode? ────
   Not a failure. The chapter is read TO the child and carries
   the language comprehension half of the job; holding it to a
   decodability floor would flatten it into the reading page.
   Reported so the gap stays visible.                          */
function chapterDecodability(){
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
  console.log(`Story chapters: ${avg}% decodable on average ` +
              `(read aloud to the child — not gated).`);
}

/* ── report ──────────────────────────────────────────────── */
const uniq = a => [...new Set(a)];
const f = uniq(fail), w = uniq(warn);
console.log(`\n${ctx.ALL_NODES.length} lessons · ${RUNS} builds each · ${ctx.ALL_NODES.length*RUNS*10} activities checked`);
console.log(`${Object.keys(ctx.PHON).filter(k=>typeof ctx.PHON[k]==='object').length} graphemes · ` +
            `${Object.keys(ctx.LETTER_NAME||{}).length} with letter names\n`);
if(f.length){ console.log('FAILURES (' + f.length + ')'); f.slice(0,40).forEach(x=>console.log('  ✗ '+x)) }
else console.log('No failures.');
if(w.length){ console.log('\nWorth a look (' + w.length + ')'); w.slice(0,20).forEach(x=>console.log('  · '+x)) }
readingPages();
chapterDecodability();
process.exit(f.length ? 1 : 0);
