/* ============================================================
   NUMBER LAND — a smoke test
   ------------------------------------------------------------
   Loads the real page in a real DOM and plays it like a child
   would: taps things, gets some wrong on purpose, and checks
   that the help ladder, the gates and the record-keeping all do
   what they claim to.

       node tools/nl-smoke.js
   ============================================================ */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
let fails = 0, checks = 0;
const ok = (cond, msg) => { checks++; if (!cond) { fails++; console.log('  ✗ ' + msg) } };

/* Several activities draw their answer buttons after a pause —
   the subitising flash has to finish before there is anything to
   tap. `fast` runs those callbacks straight away so the test can
   read the result without sitting through 200 real flashes. */
function boot(fast) {
  const html = fs.readFileSync(path.join(ROOT, 'numberland.html'), 'utf8');
  const quiet = new (require('jsdom').VirtualConsole)();
  quiet.on('jsdomError', () => {});          // scrollTo etc — not our problem here
  const dom = new JSDOM(html, { runScripts: 'outside-only', pretendToBeVisual: true,
                                virtualConsole: quiet });
  const w = dom.window;
  w.speechSynthesis = { cancel() {}, speak() {} };
  w.SpeechSynthesisUtterance = function () {};
  w.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {} });
  w.scrollTo = () => {};

  // a localStorage that actually stores
  const mem = {};
  Object.defineProperty(w, 'localStorage', {
    value: {
      getItem: k => (k in mem ? mem[k] : null),
      setItem: (k, v) => { mem[k] = String(v) },
      removeItem: k => { delete mem[k] },
      clear: () => Object.keys(mem).forEach(k => delete mem[k])
    }, configurable: true
  });

  /* Both files in one eval, so the engine can see NLData the way
     it does in the browser, then hoisted onto window so the test
     can reach it from later evals. */
  const src = ['js/numberland-data.js', 'js/numberland.js']
    .map(f => fs.readFileSync(path.join(ROOT, f), 'utf8')).join('\n');
  if (fast) {
    let depth = 0;
    const real = w.setTimeout;
    w.setTimeout = (fn, ms) => {
      if (typeof fn !== 'function' || depth > 40) return real(fn, ms);
      depth++; try { fn() } finally { depth-- }
      return 0;
    };
  }
  w.eval(src + '\n;window.NumberLand = NumberLand;');
  w.eval('NumberLand.boot()');
  return { w, mem };
}

const D = require(path.join(ROOT, 'js/numberland-data.js'));

/* every activity name the content actually uses */
const ACTS = [...new Set(D.NODES.flatMap(n => n.plan.map(s => s.split(':')[0])))];

console.log('Number Land smoke test\n');

/* ── 1. every activity runs and puts something on the stage ── */
console.log('every activity draws something');
{
  const { w } = boot();
  const doc = w.document;
  ACTS.forEach(act => {
    // find a plan step using it, so it gets realistic config
    let spec = null, node = null;
    D.NODES.some(n => n.plan.some(s => {
      if (s.split(':')[0] === act) { spec = s; node = n; return true }
      return false;
    }));
    let threw = null;
    try {
      w.eval(`
        (function(){
          var i = ${D.NODES.indexOf(node)};
          NumberLand.startPlace(i);
        })();
      `);
      // force the specific step
      w.eval(`
        (function(){
          var S = null;
          NumberLand.runSpec(${JSON.stringify(spec)});
        })();
      `);
    } catch (e) { threw = e }
    ok(!threw, act + ' threw: ' + (threw && threw.message));
    const stage = doc.getElementById('nlStage');
    ok(stage && stage.children.length > 0, act + ' drew nothing on the stage');
  });
}

/* ── 2. subitising never asks for more than five ───────────── */
console.log('subitising stays in the perceptual range');
{
  const { w } = boot(true);
  const doc = w.document;
  let worst = 0, saw = 0;
  for (let i = 0; i < 200; i++) {
    w.eval('NumberLand.startPlace(19)');          // top:10 place
    w.eval('NumberLand.runSpec("subitize:10")');
    /* the ANSWER is what must stay in the perceptual range — a 6
       sitting there as a near-miss distractor is fine, and wanted */
    const wrap = doc.querySelector('#nlStage .nl-choices');
    if (wrap) { saw++; worst = Math.max(worst, Number(wrap.dataset.answer)) }
  }
  ok(saw > 150, 'the test never actually saw the choices (' + saw + ' of 200) — it would pass vacuously');
  ok(worst <= 5, 'subitising asked for ' + worst + ' — above five nobody subitises, they count');
  ok(worst === 5, 'subitising never used the top of its range (highest was ' + worst + ')');
}

console.log('seeing five and some more only asks above five');
{
  const { w } = boot(true);
  const doc = w.document;
  let lowest = 99, saw = 0;
  for (let i = 0; i < 120; i++) {
    w.eval('NumberLand.startPlace(19)');
    w.eval('NumberLand.runSpec("seeGroups:10")');
    const pairs = [...doc.querySelectorAll('#nlStage .nl-pair')];
    if (!pairs.length) continue;
    saw++;
    const right = Number(doc.querySelector('#nlStage .nl-choices').dataset.answer);
    lowest = Math.min(lowest, right + 5);
    // every option must be a real pair of the form "5 and n"
    ok(pairs.every(b => /^\d+ and \d+$/.test(b.textContent)), 'a pair button read "' + pairs[0].textContent + '"');
  }
  ok(saw > 90, 'never saw the pair choices (' + saw + ' of 120)');
  ok(lowest >= 6, 'asked how it was seen for ' + lowest + ' — below six there is nothing to split');
}

/* ── 3. the flash is shorter for small amounts ──────────────── */
console.log('the flash scales with the amount');
{
  const { w } = boot();
  const small = w.eval('NumberLand.flashFor(3,1)');
  const big = w.eval('NumberLand.flashFor(8,1)');
  ok(small < big, 'a three (' + small + 'ms) should flash quicker than an eight (' + big + 'ms)');
  ok(small <= 700, 'a three flashes for ' + small + 'ms — long enough to count it');
}

/* ── 4. the help ladder: hint, then narrow, then tell ───────── */
console.log('a wrong answer scaffolds instead of telling');
{
  const { w } = boot();
  const doc = w.document;
  w.eval('NumberLand.startPlace(3)');
  w.eval('NumberLand.runSpec("howMany:5:scatter")');

  const wrap = doc.querySelector('#nlStage .nl-choices');
  const answer = Number(wrap.dataset.answer);
  const wrongs = [...wrap.querySelectorAll('.nl-num')].filter(b => Number(b.dataset.v) !== answer);

  const before = doc.querySelectorAll('#nlStage .nl-frame').length;
  wrongs[0].dispatchEvent(new w.Event('click'));
  const after = doc.querySelectorAll('#nlStage .nl-frame').length;
  ok(after > before, 'first miss should put the amount in a ten frame');
  ok(!doc.getElementById('nlTell').textContent.includes(String(answer)),
     'first miss must not give the answer away');

  const live1 = [...wrap.querySelectorAll('.nl-num')].filter(b => !b.classList.contains('dropped')).length;
  wrongs[1] && wrongs[1].dispatchEvent(new w.Event('click'));
  const live2 = [...wrap.querySelectorAll('.nl-num')].filter(b => !b.classList.contains('dropped')).length;
  ok(live2 < live1, 'second miss should narrow the choices (was ' + live1 + ', now ' + live2 + ')');
  ok(live2 === 2, 'second miss should leave exactly two, left ' + live2);
  const stillThere = [...wrap.querySelectorAll('.nl-num')]
    .filter(b => !b.classList.contains('dropped'))
    .some(b => Number(b.dataset.v) === answer);
  ok(stillThere, 'narrowing must keep the right answer on screen');
}

/* ── 5. off-by-one is recorded apart from wild misses ───────── */
console.log('the kind of mistake is recorded, not just that there was one');
{
  const { w } = boot();
  const doc = w.document;
  w.eval('NumberLand.startPlace(3)');
  w.eval('NumberLand.runSpec("howMany:5:frame")');
  const wrap = doc.querySelector('#nlStage .nl-choices');
  const answer = Number(wrap.dataset.answer);
  const near = [...wrap.querySelectorAll('.nl-num')]
    .find(b => Math.abs(Number(b.dataset.v) - answer) === 1);
  if (near) {
    near.dispatchEvent(new w.Event('click'));
    const s = w.eval('NumberLand.Save.skills()').howMany;
    ok(s && s.near === 1, 'an out-by-one answer should be filed as such, got ' + JSON.stringify(s));
  } else { ok(true, 'no near option available this draw') }
}

/* ── 6. the gate actually gates ─────────────────────────────── */
console.log('two stars, not one, opens the next place');
{
  const { w, mem } = boot();
  const key = w.eval('NumberLand.Save.key()');
  mem[key] = JSON.stringify({ places: { 0: 1 } });
  ok(w.eval('NumberLand.Save.open(1)') === false, 'one star should not open the next place');
  mem[key] = JSON.stringify({ places: { 0: 2 } });
  ok(w.eval('NumberLand.Save.open(1)') === true, 'two stars should open the next place');

  // a place already played stays reachable
  mem[key] = JSON.stringify({ places: { 0: 1, 1: 1 } });
  ok(w.eval('NumberLand.Save.open(1)') === true, 'somewhere already played must stay open');
}

console.log('a skill gate holds a place shut');
{
  const { w, mem } = boot();
  const key = w.eval('NumberLand.Save.key()');
  const places = {}; for (let i = 0; i < 17; i++) places[i] = 3;
  // Count-On Cliff (17) needs subitising at .65
  mem[key] = JSON.stringify({ places, skills: { subitize: { asked: 20, right: 4, near: 8 } } });
  ok(w.eval('NumberLand.Save.open(17)') === false, 'weak subitising should hold Count-On Cliff shut');
  ok(/glance/.test(w.eval('NumberLand.Save.why(17)')), 'and should say why: ' + w.eval('NumberLand.Save.why(17)'));

  mem[key] = JSON.stringify({ places, skills: { subitize: { asked: 20, right: 18, near: 1 } } });
  ok(w.eval('NumberLand.Save.open(17)') === true, 'solid subitising should open it');

  // not enough evidence either way -> do not block
  mem[key] = JSON.stringify({ places, skills: { subitize: { asked: 2, right: 0, near: 0 } } });
  ok(w.eval('NumberLand.Save.open(17)') === true, 'too few tries to judge should not block');
}

/* ── 7. mixed practice favours weak and stale places ────────── */
console.log('mixed practice favours what needs it');
{
  const { w, mem } = boot();
  const key = w.eval('NumberLand.Save.key()');
  const now = Date.now();
  mem[key] = JSON.stringify({
    places: { 0: 3, 1: 1 },
    last: { 0: now, 1: now - 20 * 86400000 }     // place 1 is weak AND stale
  });
  let one = 0, zero = 0;
  for (let i = 0; i < 400; i++) {
    w.eval('NumberLand.startMixed()');
    const idx = w.eval('NumberLand.lastMixedPicks()');
    idx.forEach(v => { v === 1 ? one++ : zero++ });
  }
  ok(one > zero * 1.3,
     'the weak, stale place should come up clearly more often (' + one + ' vs ' + zero + ')');
}

/* ── 8. word problems: all four shapes work ─────────────────── */
console.log('all four word-problem shapes run');
{
  const { w } = boot(true);
  const doc = w.document;
  ['add', 'take', 'change', 'compare'].forEach(kind => {
    let threw = null;
    try {
      w.eval('NumberLand.startPlace(9)');
      w.eval(`NumberLand.runSpec("story:5:${kind}")`);
    } catch (e) { threw = e }
    ok(!threw, 'story:' + kind + ' threw: ' + (threw && threw.message));
    const wrap = doc.querySelector('#nlStage .nl-choices');
    ok(wrap && wrap.querySelectorAll('.nl-num').length >= 3,
       'story:' + kind + ' never offered an answer to tap');
    if (wrap) ok(Number(wrap.dataset.answer) >= 0,
       'story:' + kind + ' had a nonsense answer: ' + wrap.dataset.answer);
  });
}

console.log('\n' + (fails ? '✗ ' + fails + ' of ' + checks + ' checks failed'
                           : '✓ all ' + checks + ' checks passed'));
process.exit(fails ? 1 : 0);
