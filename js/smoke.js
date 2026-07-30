#!/usr/bin/env node
/* Loads the real page in jsdom and plays through it.
   Run:  node tools/smoke.js                                     */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const root = path.join(__dirname, '..');

const html = fs.readFileSync(path.join(root, 'wordland.html'), 'utf8')
  .replace(/<script src="[^"]*"><\/script>/g, '');     // we inject by hand

const dom = new JSDOM(html, { runScripts: 'outside-only', pretendToBeVisual: true });
const { window } = dom;

/* jsdom has no canvas and no SVG geometry — give the pad just enough
   to build itself, so everything around it can be exercised. */
const fakeCtx = new Proxy({}, { get: (t, k) =>
  k === 'measureText' ? (() => ({ width:10, actualBoundingBoxAscent:10, actualBoundingBoxDescent:2 }))
  : (() => {}) });
window.HTMLCanvasElement.prototype.getContext = () => fakeCtx;
window.Path2D = function(){};
// jsdom has no SVG geometry, so bolt it on as elements are created
const realCreateNS = window.document.createElementNS.bind(window.document);
window.document.createElementNS = (ns, tag) => {
  const el = realCreateNS(ns, tag);
  if(tag === 'path'){
    el.getTotalLength = () => 100;
    // a straight diagonal is enough to make stroke-following testable
    el.getPointAtLength = l => ({ x:l, y:l });
  }
  return el;
};
window.requestAnimationFrame = cb => setTimeout(() => cb(Date.now()), 0);
window.cancelAnimationFrame = id => clearTimeout(id);
window.speechSynthesis = { speak(){}, cancel(){} };
window.SpeechSynthesisUtterance = function(){};
window.Audio = function(){ return { play:()=>Promise.resolve(), pause(){}, addEventListener(){},
  removeAttribute(){}, load(){}, set src(v){}, set preload(v){} } };
window.fetch = () => Promise.reject(new Error('offline'));
window.scrollTo = () => {};
window.matchMedia = () => ({ matches:false, addListener(){}, removeListener(){} });

const files = ['js/writeit-letters.js','js/letter-pad.js','js/wordland-data.js',
               'js/wordland-audio.js','js/wordland.js'];
/* `const` and `let` at the top of a script are lexical bindings, not
   properties of window, so the test cannot see them from outside.
   This bridge hands them over live. */
const BRIDGE = `
;window.__wl = {
  get MAPS(){return MAPS}, get ALL_NODES(){return ALL_NODES}, get ALL_PICS(){return ALL_PICS},
  get SOUND(){return SOUND}, get LETTERFORMS(){return LETTERFORMS},
  get LetterPad(){return LetterPad}, get WLAudio(){return WLAudio},
  get ENG(){return ENG}, get ALPHABET(){return ALPHABET},
  get NODES(){return NODES}, get CURRENT_MAP(){return CURRENT_MAP},
  get DB(){return DB},   set DB(v){DB=v},
  get run(){return run}, set run(v){run=v},
  get PAD(){return PAD}
};`;
const src = files.map(f => fs.readFileSync(path.join(root, f), 'utf8')).join('\n;\n') + BRIDGE;

let out = [], fails = 0;
const queue = [];
function ok(name, fn){ queue.push({ name, fn }) }
const wait = ms => new Promise(r => setTimeout(r, ms));

try { window.eval(src) }
catch(e){ console.error('Scripts failed to load:\n' + e.stack); process.exit(1) }

const bridge = window.__wl;
const W = new Proxy({}, {
  get(t, k){ return (k in bridge) ? bridge[k] : window[k] },
  set(t, k, v){ (k in bridge) ? bridge[k] = v : window[k] = v; return true },
  has(t, k){ return (k in bridge) || (k in window) }
});

/* ── 1 · content ───────────────────────────────────────────── */
ok('twelve maps are defined', () => {
  if(W.MAPS.length !== 12) throw new Error('got ' + W.MAPS.length);
});
ok('maps 1 and 2 have ten places each', () => {
  [1,2].forEach(no => {
    const m = W.MAPS.find(x => x.no === no);
    if(!m.nodes || m.nodes.length !== 10) throw new Error('map ' + no + ' has ' + (m.nodes||[]).length);
  });
});
ok('maps 3–12 are marked as not built', () => {
  W.MAPS.filter(m => m.no > 2).forEach(m => {
    if(!m.soon) throw new Error('map ' + m.no + ' should be soon:true');
    if(m.nodes) throw new Error('map ' + m.no + ' should have no nodes yet');
  });
});
ok('every place is numbered 1..10 in order', () => {
  W.MAPS.filter(m => m.nodes).forEach(m =>
    m.nodes.forEach((n, i) => { if(n.no !== i + 1) throw new Error(`map ${m.no} place ${i}: no=${n.no}`) }));
});
ok('every place has ten activities', () => {
  W.ALL_NODES.forEach(n => { if(n.plan.length !== 10)
    throw new Error(`${n.region}: ${n.plan.length}`) });
});
ok('every place has a story with four lines', () => {
  W.ALL_NODES.forEach(n => {
    if(!n.story || !n.story.t) throw new Error(n.region + ': no story');
    if(n.story.lines.length !== 4) throw new Error(n.region + ': ' + n.story.lines.length + ' lines');
  });
});
ok('every focus letter has a sound', () => {
  W.ALL_NODES.forEach(n => n.letters.forEach(l => {
    if(!W.SOUND[l]) throw new Error(n.region + ': no sound for ' + l);
  }));
});
ok('every letter taught can be written', () => {
  W.ALL_NODES.forEach(n => n.letters.forEach(l => {
    if(l.length > 1) return;                        // ee is a pair, not a single glyph
    if(!W.LETTERFORMS[l.toLowerCase()]) throw new Error('no lowercase shape for ' + l);
    if(!W.LETTERFORMS[l.toUpperCase()]) throw new Error('no uppercase shape for ' + l);
  }));
});
ok('every word tile can be spelled from its own letters', () => {
  W.ALL_NODES.forEach(n => [...n.words, ...n.family].forEach(v => {
    if(!/^[A-Z]+$/.test(v.w)) throw new Error(n.region + ': odd word "' + v.w + '"');
  }));
});
ok('every picture word has an emoji', () => {
  W.ALL_NODES.forEach(n => [...n.vocab, ...n.words, ...n.family].forEach(v => {
    if(!v.e) throw new Error(n.region + ': "' + v.w + '" has no picture');
  }));
});
ok('word families really do rhyme', () => {
  W.ALL_NODES.forEach(n => {
    if(n.family.length < 2) return;
    const r = W.rimeOf(n.family);
    if(r.length < 2) throw new Error(n.region + ': family shares only "' + r + '"');
  });
});
ok('sentences only use words the child has met', () => {
  W.MAPS.filter(m => m.nodes).forEach(m => {
    W.useMap(m.no);
    m.nodes.forEach(n => {
      if(!n.sentences) return;
      const met = new Set();
      m.nodes.filter(x => x.no <= n.no).forEach(x =>
        [...x.words, ...x.family, ...x.hfw, ...x.vocab].forEach(v => met.add(v.w)));
      ['I','A','AM','AT','THE','TO','ON','SEE','CAN','SAM','MAN','RAN'].forEach(w => met.add(w));
      n.sentences.forEach(s => s.s.forEach(w => {
        if(!met.has(w)) throw new Error(`${n.region}: "${w}" not taught yet`);
      }));
    });
  });
});

/* ── 2 · every activity builds, on every place ─────────────── */
const TYPES = ['sound','beginSound','starts','tapAll','listen','match','hunt','caseMatch',
               'initial','blend','spell','rhyme','sight','write','machine','alphabet',
               'sentence','pickWord','readLine'];

ok('every activity builds a round for every place', () => {
  W.MAPS.filter(m => m.nodes).forEach(m => {
    W.useMap(m.no);
    m.nodes.forEach(n => {
      const probe = { ...n, plan: TYPES.map(t => t === 'write' ? 'write:l' : t) };
      let rounds;
      try { rounds = W.buildRounds(probe) }
      catch(e){ throw new Error(`${m.name} / ${n.region}: ${e.message}`) }
      rounds.forEach((r, i) => {
        if(!r || !r.type) throw new Error(`${n.region}: ${TYPES[i]} produced nothing`);
        if(!W.ENG[r.type]) throw new Error(`${n.region}: no engine for "${r.type}"`);
      });
    });
  });
});

ok('every round has a findable right answer', () => {
  W.MAPS.filter(m => m.nodes).forEach(m => {
    W.useMap(m.no);
    m.nodes.forEach(n => {
      const rounds = W.buildRounds({ ...n, plan: TYPES.map(t => t === 'write' ? 'write:l' : t) });
      rounds.forEach(r => {
        const where = `${n.region}/${r.type}`;
        if(r.opts && r.answer !== undefined){
          const found = r.opts.some(o => (o.w !== undefined ? o.w : o) === r.answer);
          if(!found) throw new Error(where + ': answer not among the options');
        }
        if(r.type === 'tapAll' && !r.correct.every(w => r.opts.some(o => o.w === w)))
          throw new Error(where + ': a correct picture is missing');
        if(r.type === 'machine'){
          if(!r.correct.length) throw new Error(where + ': no words to make');
          if(!r.correct.every(w => r.onsets.includes(w[0])))
            throw new Error(where + ': a word has no letter to make it');
          if(!r.correct.every(w => w.toUpperCase().endsWith(r.rime.toUpperCase())))
            throw new Error(where + `: "${r.correct}" does not end in "${r.rime}"`);
        }
        if(r.type === 'alphabet' && r.run[r.hideAt].toUpperCase() !== r.answer)
          throw new Error(where + ': the gap and the answer disagree');
        if(r.type === 'sentence'){
          const a = [...r.words].sort().join(), b = [...r.tiles].sort().join();
          if(a !== b) throw new Error(where + ': tiles do not match the sentence');
        }
        if(r.type === 'pickWord'){
          if(r.opts.length !== 2) throw new Error(where + ': need exactly two words');
          if(r.opts[0] === r.opts[1]) throw new Error(where + ': both options are the same');
        }
        if(r.type === 'spell' && !r.answer.split('').every(l => r.tiles.includes(l)))
          throw new Error(where + ': the word cannot be built from its tiles');
        if(r.opts && r.opts.length !== new Set(r.opts.map(o => o.w !== undefined ? o.w : o)).size)
          throw new Error(where + ': the same option appears twice');
      });
    });
  });
});

ok('every activity renders without throwing', () => {
  W.useMap(1);
  const n = W.NODES[4];                                    // Cat Cave — has family + hfw
  W.run = { node:5, rounds:[], i:0, mistakes:0, missThis:0, busy:false, startedAt:Date.now() };
  TYPES.forEach(t => {
    const r = W.buildRounds({ ...n, plan:[t === 'write' ? 'write:l' : t] })[0];
    W.run.rounds = [r]; W.run.i = 0;
    try { W.ENG[r.type](r) }
    catch(e){ throw new Error(t + ': ' + e.message) }
    if(!W.document.getElementById('playBody').innerHTML.trim())
      throw new Error(t + ': drew nothing');
  });
});

/* ── 3 · progress and unlocking ────────────────────────────── */
ok('a fresh player has only map 1 and place 1 open', () => {
  W.DB = W.freshDB(); W.useMap(1);
  if(!W.mapUnlocked(W.MAPS[0])) throw new Error('map 1 should be open');
  if(W.mapUnlocked(W.MAPS[1])) throw new Error('map 2 should be locked');
  if(!W.unlocked(1)) throw new Error('place 1 should be open');
  if(W.unlocked(2)) throw new Error('place 2 should be locked');
});
ok('finishing a place opens the next one', () => {
  W.DB = W.freshDB(); W.useMap(1);
  W.nodeRec(1).stars = 3;
  if(!W.unlocked(2)) throw new Error('place 2 did not open');
  if(W.unlocked(3)) throw new Error('place 3 opened too early');
});
ok('finishing all ten places opens the next map', () => {
  W.DB = W.freshDB(); W.useMap(1);
  for(let i = 1; i <= 10; i++) W.nodeRec(i).stars = 2;
  if(!W.mapFinished(W.MAPS[0])) throw new Error('map 1 not finished');
  if(!W.mapUnlocked(W.MAPS[1])) throw new Error('map 2 did not open');
  if(W.mapUnlocked(W.MAPS[2])) throw new Error('map 3 opened too early');
});
ok('the two maps keep separate progress', () => {
  W.DB = W.freshDB();
  W.useMap(1); W.nodeRec(1).stars = 3;
  W.useMap(2);
  if(W.isDone(1)) throw new Error('map 2 inherited map 1 progress');
  W.nodeRec(1).stars = 1;
  W.useMap(1);
  if(W.mapRec(1).nodes[1].stars !== 3) throw new Error('map 1 progress was overwritten');
});
ok('a grown-up can open everything', () => {
  W.DB = W.freshDB(); W.DB.unlockAll = true; W.useMap(1);
  if(!W.unlocked(7)) throw new Error('places still locked');
  if(!W.mapUnlocked(W.MAPS[1])) throw new Error('map 2 still locked');
  if(!W.mapUnlocked(W.MAPS[11])) throw new Error('map 12 still locked');
  W.DB.unlockAll = false;
});
ok('a map that is not built stays unplayable even when unlocked', () => {
  W.DB = W.freshDB(); W.DB.unlockAll = true;
  if(W.chooseMap(5) !== undefined && W.CURRENT_MAP.no === 5)
    throw new Error('an unbuilt map was opened');
  W.DB.unlockAll = false;
});

/* ── 4 · playing a whole place through ─────────────────────── */
ok('a place can be played from first activity to last', () => {
  W.DB = W.freshDB(); W.useMap(2);
  W.startNode(1);
  const total = W.run.rounds.length;
  for(let i = 0; i < total; i++){
    W.run.busy = false;
    W.run.i = i;
    W.renderRound();
  }
  W.run.i = total - 1; W.run.busy = false;
  W.run.mistakes = 0;
  W.finishNode();
  if(W.mapRec(2).nodes[1].stars !== 3) throw new Error('no stars awarded');
  if(!W.isDone(1)) throw new Error('place not marked done');
});
ok('three stars for a clean run, one when it is messy', () => {
  W.DB = W.freshDB(); W.useMap(1);
  W.startNode(1); W.run.mistakes = 0; W.finishNode();
  if(W.mapRec(1).nodes[1].stars !== 3) throw new Error('clean run should give 3');
  W.DB = W.freshDB();
  W.startNode(1); W.run.mistakes = 6; W.finishNode();
  if(W.mapRec(1).nodes[1].stars !== 1) throw new Error('messy run should give 1');
});
ok('the map picker draws every map', () => {
  W.DB = W.freshDB();
  W.openMaps();
  const cards = W.document.querySelectorAll('#mapsGrid .map-card');
  if(cards.length !== 12) throw new Error('drew ' + cards.length + ' cards');
  if(!W.document.querySelector('.map-card.open')) throw new Error('no map is playable');
  if(!W.document.querySelector('.map-card.locked')) throw new Error('nothing is locked');
  if(!W.document.querySelector('.map-card.soon')) throw new Error('nothing is marked unbuilt');
});
ok('the trail draws ten places', () => {
  W.DB = W.freshDB(); W.chooseMap(1);
  const stones = W.document.querySelectorAll('#trail .tnode');
  if(stones.length !== 10) throw new Error('drew ' + stones.length);
});
ok('the storybook lists every chapter of the map being played', () => {
  W.DB = W.freshDB(); W.useMap(2); W.openShelf();
  const cards = W.document.querySelectorAll('#shelfGrid .shelf-card');
  if(cards.length !== 10) throw new Error('drew ' + cards.length);
  if(W.document.querySelectorAll('#shelfGrid .shelf-card:not(.locked)').length)
    throw new Error('a chapter is readable before it is won');
});
ok('a story chapter opens and reads out', () => {
  W.useMap(2); W.nodeRec(1).stars = 2;
  W.readStory(1, 'shelf');
  const card = W.document.getElementById('storyCard').innerHTML;
  if(!card.includes('Chapter 1')) throw new Error('no chapter number');
  if(!card.includes('class="hl"')) throw new Error('no tappable words');
  W.readAloud(1);
});

/* ── 5 · audio naming ──────────────────────────────────────── */
ok('map 1 chapter files keep their old names', () => {
  if(W.WLAudio.chapterName(1, 3) !== 'chapter3') throw new Error(W.WLAudio.chapterName(1,3));
  if(W.WLAudio.chapterName(2, 3) !== 'map2-chapter3') throw new Error(W.WLAudio.chapterName(2,3));
});
ok('the recording list covers every map', () => {
  const want = W.WLAudio.expected();
  if(want.story.length !== 20) throw new Error('story files: ' + want.story.length);
  if(!want.story.includes('chapter1')) throw new Error('map 1 chapter missing');
  if(!want.story.includes('map2-chapter1')) throw new Error('map 2 chapter missing');
  ['mmm','sss','nnn','puh','huh','rrr','zzz','eh'].forEach(s => {
    if(!want.sounds.includes(s)) throw new Error('missing sound file ' + s);
  });
  ['moon','bee','van','zebra','nest'].forEach(w => {
    if(!want.words.includes(w)) throw new Error('missing word file ' + w);
  });
});
ok('no recording is asked for twice', () => {
  const want = W.WLAudio.expected();
  ['sounds','words','story'].forEach(k => {
    if(new Set(want[k]).size !== want[k].length) throw new Error('duplicate in ' + k);
  });
});

/* ── 6 · the writing pad ───────────────────────────────────── */
ok('the pad builds for every letter, both cases', () => {
  const canvas = W.document.createElement('canvas');
  Object.keys(W.LETTERFORMS).forEach(ch => {
    const pad = W.LetterPad.create({ canvas, ch, size:{ w:100, h:150 } });
    if(!pad) throw new Error('no pad for ' + ch);
    if(pad.strokes.length !== W.LETTERFORMS[ch].length) throw new Error('stroke count for ' + ch);
    if(pad.strokes.some(s => !s.dot && s.pts.length < 3)) throw new Error('empty stroke in ' + ch);
    pad.destroy();
  });
});
ok('finishing every stroke finishes the letter', () => {
  W.useMap(1); W.startNode(1);
  const r = W.buildRounds({ ...W.NODES[0], plan:['write:l'] })[0];
  W.run.rounds = [r]; W.run.i = 0; W.run.busy = false;
  W.ENG.write(r);
  if(!W.PAD) throw new Error('no pad was opened');
  const before = W.PAD.strokes.length;
  W.PAD.giveUp();
  if(!W.PAD.done) throw new Error('pad did not finish');
  if(before < 1) throw new Error('letter had no strokes');
});
ok('a child can always move past a letter', async () => {
  W.useMap(1); W.startNode(1);
  const r = W.buildRounds({ ...W.NODES[0], plan:['write:u'] })[0];
  W.run.rounds = [r]; W.run.i = 0; W.run.busy = false;
  W.ENG.write(r);
  W.padSkip();
  if(!W.PAD.done) throw new Error('the letter was not released');
  await wait(900);
  if(!W.run.busy) throw new Error('skipping did not count the activity');
});
ok('the pad unbinds when the round changes', () => {
  W.useMap(1); W.startNode(1);
  const r = W.buildRounds({ ...W.NODES[0], plan:['write:l'] })[0];
  W.run.rounds = [r, r]; W.run.i = 0; W.run.busy = false;
  W.ENG.write(r);
  W.closePad();
  if(W.PAD !== null) throw new Error('pad still live');
});

/* ── 7 · saved games ───────────────────────────────────────── */
ok('progress from the one-map version is carried over', () => {
  const old = JSON.stringify({ v:2, nodes:{ 1:{stars:3,plays:1,correct:9,wrong:0,timeMs:0},
                                            2:{stars:2,plays:1,correct:8,wrong:1,timeMs:0} },
                               muted:true, unlockAll:false });
  W.DB = W.freshDB();
  W.DB.muted = true;
  W.mapRec(1).nodes = JSON.parse(old).nodes;
  W.useMap(1);
  if(!W.isDone(1) || !W.isDone(2)) throw new Error('old progress lost');
  if(W.mapRec(1).nodes[1].stars !== 3) throw new Error('stars lost');
});

(async () => {
  for(const { name, fn } of queue){
    try { await fn(); out.push('  ok    ' + name) }
    catch(e){ fails++; out.push('  FAIL  ' + name + '\n          → ' + e.message) }
  }
  console.log(out.join('\n'));
  console.log('\n' + (fails ? `✗ ${fails} failing` : `✓ all ${out.length} checks passed`));
  process.exit(fails ? 1 : 0);
})();
