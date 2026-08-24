/* ============================================================
   NUMBER LAND — the engine
   ------------------------------------------------------------
   Fifteen activities, a trail of places, and the rules that
   decide what a right answer and a wrong answer do.

   Two rules run through all of it:

   1. A child is never stuck. Every question accepts a second
      try; after that the answer is shown in the picture they
      already know — the ten frame — and the game moves on. A
      four-year-old who cannot get past question three has
      learnt only that maths is where you get stuck.

   2. Nothing is timed except the subitising flash, where the
      short look IS the skill. Everywhere else a child may take
      as long as they like, because thinking time is where the
      counting strategy actually gets built.
   ============================================================ */

const NumberLand = (() => {

const D = NLData;

/* ── small helpers ──────────────────────────────────────── */
const $  = id => document.getElementById(id);
const rnd = n => Math.floor(Math.random() * n);
const pick = a => a[rnd(a.length)];
const range = (a, b) => Array.from({length: b - a + 1}, (_, i) => a + i);
const shuffle = a => { a = a.slice(); for(let i = a.length - 1; i > 0; i--){
  const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]] } return a };
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const el = (tag, cls, html) => { const n = document.createElement(tag);
  if(cls) n.className = cls; if(html != null) n.innerHTML = html; return n };

/* ════════════════════════════════════════════════════════════
   THE VOICE
   ------------------------------------------------------------
   Word Land's audio layer already knows how to find a
   recording and fall back to the computer voice, so Number
   Land borrows it rather than building a second one. Record
   the number words into the same words/ folder the reading
   games use — words/seven.mp3 — and every game gets them.

   With wordland-audio.js absent this still talks, using the
   browser's own voice.
   ════════════════════════════════════════════════════════════ */
let MUTED = false;

function tts(text){
  if(MUTED) return Promise.resolve();
  try{
    const u = new SpeechSynthesisUtterance(String(text).replace(/\*/g, ''));
    u.rate = .82; u.pitch = 1.08;
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  }catch(e){}
  return Promise.resolve();
}

const Say = {
  unlock(){ try{ window.WLAudio && WLAudio.unlock() }catch(e){} },
  word(w){ if(MUTED) return Promise.resolve();
    try{ if(window.WLAudio && WLAudio.word) return WLAudio.word(w) }catch(e){}
    return tts(w) },
  num(n){ return Say.word(D.WORD[n] != null ? D.WORD[n] : String(n)) },
  phrase(t){ if(MUTED) return Promise.resolve();
    try{ if(window.WLAudio && WLAudio.phrase) return WLAudio.phrase(t) }catch(e){}
    return tts(t) },
  cheer(t){ if(MUTED) return Promise.resolve();
    try{ if(window.WLAudio && WLAudio.cheer) return WLAudio.cheer(t) }catch(e){}
    return tts(t) }
};

/* ════════════════════════════════════════════════════════════
   WHAT IS REMEMBERED
   ------------------------------------------------------------
   Kept per child if profiles.js is there, and under one key if
   it is not — so this file works dropped into the repo and
   works opened on its own.
   ════════════════════════════════════════════════════════════ */
const Save = {
  key(){
    let who = 'solo';
    try{ const p = window.Profiles && Profiles.active(); if(p) who = p.id }catch(e){}
    return 'numberland-' + who;
  },
  read(){
    try{ return JSON.parse(localStorage.getItem(Save.key())) || {} }catch(e){ return {} }
  },
  write(o){ try{ localStorage.setItem(Save.key(), JSON.stringify(o)) }catch(e){} },
  stars(i){ return (Save.read().places || {})[i] || 0 },
  open(i){
    if(i === 0) return true;
    const s = Save.read().places || {};
    // the first place of every map opens as soon as the map before it is finished
    const prev = D.NODES[i - 1];
    if(D.NODES[i].map !== prev.map) return !!s[i - 1];
    return !!s[i - 1];
  },
  finish(i, stars, right, asked, ms){
    const o = Save.read();
    o.places = o.places || {};
    o.places[i] = Math.max(o.places[i] || 0, stars);
    o.right = (o.right || 0) + right;
    o.asked = (o.asked || 0) + asked;
    o.ms = (o.ms || 0) + ms;
    Save.write(o);
    /* If profiles.js grows a recorder, Number Land will show up in
       the grown-ups dashboard beside the reading games. Until then
       this does nothing and nothing breaks. */
    try{
      if(window.Profiles && typeof Profiles.record === 'function')
        Profiles.record('numberland', {correct: right, wrong: asked - right, ms, places: 1});
    }catch(e){}
  },
  reset(){ try{ localStorage.removeItem(Save.key()) }catch(e){} }
};

/* ════════════════════════════════════════════════════════════
   THE PICTURES
   ------------------------------------------------------------
   Four ways of showing an amount, used consistently. Which one
   a question uses is a teaching decision, not decoration:

     frame    for anything 6 and over, so it is seen as five
              and some more rather than counted from one
     dice     for 1–6, the patterns a child will meet on every
              board game they ever play
     scatter  when counting one at a time is the point
     row      when the amount is not the thing being tested
   ════════════════════════════════════════════════════════════ */

/* Filled left to right along the top row, then the bottom — the
   same order every single time, in every activity. The row break
   after five is doing the teaching: it is what turns eight into
   "a full five and three more". */
function frameEl(n, opts){
  opts = opts || {};
  const cap = opts.cap || 10;
  const f = el('div', 'nl-frame' + (opts.small ? ' small' : ''));
  for(let i = 0; i < cap; i++) f.appendChild(el('span', 'cell' + (i < n ? ' on' : '')));
  return f;
}

const DICE = {1:[4], 2:[0,8], 3:[0,4,8], 4:[0,2,6,8], 5:[0,2,4,6,8], 6:[0,2,3,5,6,8]};

function dotsEl(n){
  if(n > 6 || n < 1) return frameEl(n);
  const on = DICE[n];
  const d = el('div', 'nl-dots');
  for(let i = 0; i < 9; i++) d.appendChild(el('span', on.indexOf(i) >= 0 ? 'on' : ''));
  return d;
}

function rowEl(n, thing){
  const r = el('div', 'nl-row');
  for(let i = 0; i < n; i++) r.appendChild(el('span', 'thing', thing));
  return r;
}

/* thrown about, but never on top of each other: a jittered grid
   keeps them countable while still looking unordered */
function scatterEl(n, thing, opts){
  opts = opts || {};
  const box = el('div', 'nl-scatter');
  if(opts.wide) box.style.width = 'min(40vw,300px)';
  const cols = Math.max(2, Math.ceil(Math.sqrt(n * 1.7)));
  const rows = Math.max(1, Math.ceil(n / cols));
  shuffle(range(0, cols * rows - 1)).slice(0, n).forEach(i => {
    const t = el('span', 'thing', thing);
    const cx = i % cols, cy = Math.floor(i / cols);
    t.style.left = clamp((cx + .5) / cols * 100 + (Math.random() - .5) * 46 / cols, 10, 90) + '%';
    t.style.top  = clamp((cy + .5) / rows * 100 + (Math.random() - .5) * 46 / rows, 14, 86) + '%';
    box.appendChild(t);
  });
  return box;
}

function drawSet(n, style, thing){
  if(style === 'frame')   return frameEl(n);
  if(style === 'dice')    return dotsEl(n);
  if(style === 'scatter') return scatterEl(n, thing);
  return rowEl(n, thing);
}

/* a group on a card, for the choosing activities */
function setCard(n, thing){
  const b = el('button', 'nl-card');
  b.type = 'button';
  const s = el('div', 'set');
  for(let i = 0; i < n; i++) s.appendChild(el('span', '', thing));
  b.appendChild(s);
  b.dataset.n = n;
  return b;
}

/* ── the numerals to choose from ────────────────────────────
   Always includes the answer, always plausible neighbours —
   a child who is one out should have somewhere to be one out
   to, because that near miss is the information a grown-up
   watching actually needs. */
function numberChoices(host, answer, max, cb, opts){
  opts = opts || {};
  const lo = opts.lo != null ? opts.lo : 0;
  const hi = opts.hi != null ? opts.hi : Math.max(max, answer + 1);
  const want = max <= 3 ? 3 : 4;
  const set = new Set([answer]);
  [answer - 1, answer + 1, answer + 2, answer - 2].forEach(v => {
    if(set.size < want && v >= lo && v <= hi && v !== answer) set.add(v);
  });
  let guard = 0;
  while(set.size < want && guard++ < 60){
    const v = lo + rnd(hi - lo + 1); if(v !== answer) set.add(v);
  }
  const wrap = el('div', 'nl-choices');
  shuffle([...set]).forEach(v => {
    const b = el('button', 'nl-num', String(v));
    b.type = 'button';
    b.onclick = () => {
      if(wrap.dataset.done) return;
      const ok = v === answer;
      b.classList.add(ok ? 'right' : 'wrong');
      if(ok) wrap.dataset.done = '1';
      else setTimeout(() => b.classList.remove('wrong'), 420);
      cb(v, b, wrap);
    };
    wrap.appendChild(b);
  });
  host.appendChild(wrap);
  return wrap;
}

/* ════════════════════════════════════════════════════════════
   PRAISE
   ════════════════════════════════════════════════════════════ */
function celebrate(){
  const f = $('nlFlash');
  f.classList.remove('on'); void f.offsetWidth; f.classList.add('on');
  const stage = $('nlStage').getBoundingClientRect();
  for(let i = 0; i < 3; i++){
    const s = el('div', 'nl-star', pick(['⭐','✨','🌟']));
    s.style.left = (stage.left + stage.width * (.3 + Math.random() * .4)) + 'px';
    s.style.top  = (stage.top + stage.height * .55) + 'px';
    s.style.animationDelay = (i * 90) + 'ms';
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 1100);
  }
}

/* ════════════════════════════════════════════════════════════
   A ROUND
   ════════════════════════════════════════════════════════════ */
let S = null;          // the place being played
let locked = false;    // stops a fast child answering twice

const A = {
  get stage(){ return $('nlStage') },
  get max(){ return S.cfg.max },

  /* The question. Numbers inside it are bolded and it is read
     out; tapping it reads it again, which is the only help a
     child who cannot read can find on their own. */
  ask(text, spoken, replay){
    const bar = $('nlAsk');
    bar.innerHTML = '<span class="spk">🔊</span><span>' +
      String(text).replace(/(\d+)/g, '<b>$1</b>') + '</span>';
    S.spoken = spoken || String(text);
    S.replay = replay || null;
    bar.onclick = () => { Say.phrase(S.spoken); if(S.replay) S.replay() };
    Say.phrase(S.spoken);
  },

  tell(html){ $('nlTell').innerHTML = html || '' },

  /* a wrong tap that does not end the question */
  slip(){
    if(locked) return;
    S.slips++;
    Say.phrase(pick(D.NUDGE));
  },

  /* the one call an activity makes when it is settled.
     answer  — the number (or text) to show if they run out of tries
     reveal  — optional, draws the right picture on the stage */
  judge(ok, answer, reveal){
    if(locked) return;
    if(ok){
      locked = true;
      S.right++;
      if(!S.slips && !S.tries) S.clean++;
      celebrate();
      Say.cheer(pick(D.PRAISE));
      setTimeout(next, 850);
      return;
    }
    S.tries++;
    if(S.tries < 2){ Say.phrase(pick(D.NUDGE)); return }

    locked = true;
    A.tell('It was <b>' + answer + '</b>');
    if(reveal) try{ reveal() }catch(e){}
    if(typeof answer === 'number') Say.phrase('It was ' + (D.WORD[answer] || answer));
    setTimeout(next, 2600);
  }
};

function next(){
  S.step++;
  if(S.step >= S.plan.length) return finishPlace();
  runStep();
}

function pips(){
  const p = $('nlPips');
  p.innerHTML = S.plan.map((_, i) =>
    '<i class="' + (i < S.step ? 'done' : i === S.step ? 'now' : '') + '"></i>').join('');
}

function runStep(){
  locked = false;
  const spec = S.plan[S.step];
  const bits = String(spec).split(':');
  const name = bits[0];
  const node = S.node;
  S.cfg = {
    max: Number(bits[1]) || node.top,
    style: bits[2] || null,
    node,
    things: D.THINGS[node.set] || ['⭐'],
    thing: pick(D.THINGS[node.set] || ['⭐']),
    map: node.map
  };
  S.tries = 0; S.slips = 0;
  A.stage.innerHTML = '';
  A.tell('');
  pips();
  (ACT[name] || ACT.howMany)(S.cfg, A);
}

/* ════════════════════════════════════════════════════════════
   THE ACTIVITIES
   ════════════════════════════════════════════════════════════ */
const ACT = {};

/* ── SUBITISING ─────────────────────────────────────────────
   A pattern appears and goes again before it can be counted.
   That is the whole design: if the child has time to count,
   the activity has failed, because seeing three without
   counting is a different skill from counting to three and the
   one everything later is built on.

   The look is two seconds on Map 1 and just over one on Map 2.
   A grown-up can slow it down in settings. */
ACT.subitize = (c, A) => {
  const n = 1 + rnd(c.max);
  const flash = FLASH[c.map] || 1400;

  const holder = el('div');
  holder.style.visibility = 'hidden';
  holder.appendChild(c.style === 'frame' || n > 6 ? frameEl(n) : dotsEl(n));
  A.stage.appendChild(holder);

  const later = el('div');
  A.stage.appendChild(later);

  const show = () => {
    holder.style.visibility = 'visible';
    setTimeout(() => { holder.style.visibility = 'hidden' }, flash);
  };

  A.ask('How many?', 'Look quickly. How many?', show);
  setTimeout(show, 700);

  setTimeout(() => {
    numberChoices(later, n, c.max, v => A.judge(v === n, n,
      () => { holder.style.visibility = 'visible' }));
  }, 700 + flash + 150);
};

/* ── ONE-TO-ONE, THEN CARDINALITY ───────────────────────────
   Two things at once, and the second is the one that matters.
   Touching each thing exactly once is counting; knowing that
   the last number you said is how many there are is the leap,
   and plenty of children can do the first for a year before
   they can do the second. So the question is always asked
   again at the end, after the numbers have stopped. */
ACT.count = (c, A) => {
  const n = 1 + rnd(c.max);
  const box = scatterEl(n, c.thing);
  A.stage.appendChild(box);
  const later = el('div');
  A.stage.appendChild(later);

  let got = 0;
  A.ask('Touch each one', 'Touch each one and count them.');

  box.querySelectorAll('.thing').forEach(t => {
    t.onclick = () => {
      if(t.classList.contains('counted') || got >= n) return;
      got++;
      t.classList.add('counted');
      t.appendChild(el('span', 'tag', String(got)));
      Say.num(got);
      if(got === n) setTimeout(cardinality, 700);
    };
  });

  function cardinality(){
    A.ask('So how many?', 'So how many are there?');
    numberChoices(later, n, c.max, v => A.judge(v === n, n));
  }
};

/* ── AMOUNT TO NUMERAL ─────────────────────────────────────
   The style is chosen by the plan, not at random: a ten frame
   when the point is seeing the amount whole, scattered things
   when the point is counting them. */
ACT.howMany = (c, A) => {
  const n = 1 + rnd(c.max);
  A.stage.appendChild(drawSet(n, c.style || 'frame', c.thing));
  const later = el('div');
  A.stage.appendChild(later);
  A.ask('How many?', 'How many are there?');
  numberChoices(later, n, c.max, v => A.judge(v === n, n));
};

/* ── NUMERAL TO AMOUNT ─────────────────────────────────────
   The other direction, and much the harder one. Counters go in
   one at a time, in the frame's fixed order, and each one is
   counted aloud — so a child hears "…six, seven" and stops,
   rather than filling the frame and hoping. */
ACT.showMe = (c, A) => {
  const n = 2 + rnd(Math.max(1, c.max - 1));
  const big = el('div', 'nl-box', String(n));
  A.stage.appendChild(big);

  const f = frameEl(0, {cap: Math.max(10, n)});
  f.classList.add('tap');
  A.stage.appendChild(f);

  const go = el('button', 'nl-go', 'Done');
  go.type = 'button';
  A.stage.appendChild(go);

  let put = 0;
  const cells = [...f.querySelectorAll('.cell')];

  f.onclick = e => {
    if(locked) return;
    const cell = e.target.closest('.cell');
    if(!cell) return;
    const i = cells.indexOf(cell);
    if(i < put){                       // tapping a counter takes it back off
      for(let k = put - 1; k >= i; k--) cells[k].classList.remove('on');
      put = i;
      return;
    }
    if(put >= cells.length) return;
    cells[put].classList.add('on', 'pop');
    put++;
    Say.num(put);
  };

  A.ask('Show me ' + n, 'Show me ' + D.WORD[n] + '. Put them in the frame.');

  go.onclick = () => A.judge(put === n, n, () => {
    cells.forEach((cell, i) => cell.classList.toggle('on', i < n));
  });
};

/* ── MATCHING ──────────────────────────────────────────────
   Three numerals, three amounts, drawn three different ways so
   the pairing cannot be done on looks. */
ACT.match = (c, A) => {
  const pool = shuffle(range(1, c.max)).slice(0, 3);
  const styles = shuffle(['frame', 'scatter', 'row']);

  const top = el('div', 'nl-choices');
  const bottom = el('div', 'nl-choices');
  A.stage.appendChild(top);
  A.stage.appendChild(bottom);

  shuffle(pool).forEach(n => {
    const b = el('button', 'nl-num', String(n));
    b.type = 'button'; b.dataset.n = n;
    b.onclick = () => choose(b, 'num');
    top.appendChild(b);
  });

  shuffle(pool).forEach((n, i) => {
    const b = el('button', 'nl-card');
    b.type = 'button'; b.dataset.n = n;
    const inner = drawSet(n, styles[i], c.thing);
    if(styles[i] === 'scatter'){ inner.style.width = '130px'; inner.style.height = '92px';
      inner.style.border = 'none' }
    if(styles[i] === 'frame') inner.classList.add('small');
    b.appendChild(inner);
    b.onclick = () => choose(b, 'set');
    bottom.appendChild(b);
  });

  let held = null, done = 0;
  A.ask('Match them up', 'Tap a number, then tap how many.');

  function choose(b, kind){
    if(locked || b.classList.contains('gone')) return;
    if(!held){ held = {b, kind}; b.classList.add('picked'); return }
    if(held.kind === kind){                     // changed their mind
      held.b.classList.remove('picked'); held = {b, kind}; b.classList.add('picked'); return;
    }
    if(held.b.dataset.n === b.dataset.n){
      held.b.classList.remove('picked');
      held.b.classList.add('gone'); b.classList.add('gone');
      Say.num(Number(b.dataset.n));
      held = null;
      if(++done === 3) setTimeout(() => A.judge(true, ''), 400);
    }else{
      b.classList.add('wrong');
      setTimeout(() => b.classList.remove('wrong'), 420);
      held.b.classList.remove('picked'); held = null;
      A.slip();
    }
  }
};

/* ── MORE, FEWER, THE SAME ─────────────────────────────────
   The trap this activity is built to spring: children judge
   "more" by how much space something takes up long before they
   judge it by number. So the smaller group is often the one
   spread wider, and the two groups are never drawn the same
   way. Getting it right here means they counted. */
ACT.compare = (c, A) => {
  const kind = c.style || 'more';

  if(kind === 'same'){
    const n = 2 + rnd(Math.max(1, c.max - 1));
    A.stage.appendChild(frameEl(n));
    const row = el('div', 'nl-choices');
    const wrong = shuffle(range(1, c.max + 1).filter(v => v !== n)).slice(0, 2);
    shuffle([n, ...wrong]).forEach(v => {
      const card = setCard(v, c.thing);
      card.onclick = () => A.judge(v === n, n, () => {
        [...row.children].forEach(x => x.classList.toggle('right', +x.dataset.n === n));
      });
      row.appendChild(card);
    });
    A.stage.appendChild(row);
    A.ask('Which is the same?', 'Which one has the same number?');
    return;
  }

  let a = 1 + rnd(c.max), b = 1 + rnd(c.max);
  let guard = 0;
  while(a === b && guard++ < 40) b = 1 + rnd(c.max);
  if(a === b) b = a === c.max ? a - 1 : a + 1;

  const answer = kind === 'more' ? Math.max(a, b) : Math.min(a, b);
  const row = el('div', 'nl-choices');
  const thingA = c.things[0], thingB = c.things[1] || c.things[0];

  [[a, thingA], [b, thingB]].forEach(([v, t], i) => {
    const card = setCard(v, t);
    /* the smaller group gets the roomier card half the time */
    if((v !== answer) === (Math.random() < .5)) card.style.minWidth = 'clamp(130px,22vh,210px)';
    card.onclick = () => A.judge(v === answer, answer, () => {
      [...row.children].forEach(x => x.classList.toggle('right', +x.dataset.n === answer));
    });
    row.appendChild(card);
  });

  A.stage.appendChild(row);
  A.ask(kind === 'more' ? 'Which has more?' : 'Which has fewer?',
        kind === 'more' ? 'Which one has more?' : 'Which one has fewer?');
};

/* ── ORDER ─────────────────────────────────────────────────
   A run of five, shuffled, tapped smallest first. Rote
   counting on its own is a party trick; putting numerals in
   order is the bit that shows the sequence is understood. */
ACT.order = (c, A) => {
  const span = Math.min(5, Math.max(3, c.max));
  const start = 1 + rnd(Math.max(1, c.max - span + 1));
  const run = range(start, start + span - 1);

  const row = el('div', 'nl-choices');
  let want = 0;

  shuffle(run).forEach(v => {
    const b = el('button', 'nl-num', String(v));
    b.type = 'button';
    b.onclick = () => {
      if(locked || b.classList.contains('gone')) return;
      if(v === run[want]){
        b.classList.add('gone');
        Say.num(v);
        if(++want === run.length) setTimeout(() => A.judge(true, ''), 400);
      }else{
        b.classList.add('wrong');
        setTimeout(() => b.classList.remove('wrong'), 420);
        A.slip();
      }
    };
    row.appendChild(b);
  });

  A.stage.appendChild(row);
  A.ask('Smallest first', 'Tap them in order. Start with the smallest.');
};

/* ── BEFORE AND AFTER ──────────────────────────────────────
   One tick of the number line is blank. Counting on from a
   number you can see is the strategy this is quietly
   rehearsing, so the neighbours are always shown. */
ACT.beforeAfter = (c, A) => {
  const span = Math.min(6, Math.max(4, c.max));
  const lo = rnd(Math.max(1, c.max - span + 2));
  const ticks = range(lo, lo + span - 1);
  const gapAt = 1 + rnd(ticks.length - 2);   // never an end, so both sides help
  const answer = ticks[gapAt];

  const line = el('div', 'nl-line');
  ticks.forEach((v, i) => {
    const t = el('div', 'tick' + (i === gapAt ? ' blank' : ''), String(v));
    t.dataset.v = v;
    line.appendChild(t);
  });
  A.stage.appendChild(line);

  const later = el('div');
  A.stage.appendChild(later);

  A.ask('Which number is missing?', 'Which number is missing?');
  numberChoices(later, answer, c.max, v => A.judge(v === answer, answer, () => {
    const t = line.children[gapAt];
    t.classList.remove('blank'); t.classList.add('filled'); t.textContent = answer;
  }), {lo: 0, hi: Math.max(c.max, lo + span)});
};

/* ── NUMBER BONDS ──────────────────────────────────────────
   The frame is filled part of the way and the empty cells are
   left visible. A child who cannot yet work out that six and
   four make ten can still see four holes and count them — and
   that is the intended route, not a workaround. The counting
   drops away on its own once the pairs are known. */
ACT.bond = (c, A) => {
  const total = c.max;
  const a = 1 + rnd(total - 1);
  const answer = total - a;

  const f = frameEl(a, {cap: total});
  A.stage.appendChild(f);

  const sum = el('div', 'nl-sign', a + ' + ? = ' + total);
  A.stage.appendChild(sum);

  const later = el('div');
  A.stage.appendChild(later);

  A.ask(a + ' and how many more make ' + total + '?',
        D.WORD[a] + ' and how many more make ' + D.WORD[total] + '?');

  numberChoices(later, answer, total, v => A.judge(v === answer, answer, () => {
    [...f.children].forEach((cell, i) => { if(i >= a && i < total) cell.classList.add('on', 'b') });
    sum.textContent = a + ' + ' + answer + ' = ' + total;
  }));
};

/* ── ADDING BY COUNTING ALL ────────────────────────────────
   Both groups stay in sight, so the child may count every
   single thing from one. That is the correct strategy at this
   stage and the game does not hurry it along. Count-On Cliff
   is where it gets taken away. */
ACT.addAll = (c, A) => {
  const a = 1 + rnd(Math.max(1, c.max - 2));
  const b = 1 + rnd(Math.max(1, c.max - a));
  const answer = a + b;

  const row = el('div', 'nl-frames');
  row.appendChild(rowEl(a, c.things[0]));
  row.appendChild(el('div', 'nl-sign', '+'));
  row.appendChild(rowEl(b, c.things[1] || c.things[0]));
  A.stage.appendChild(row);

  const later = el('div');
  A.stage.appendChild(later);

  A.ask(a + ' and ' + b + ' — how many altogether?',
        D.WORD[a] + ' and ' + D.WORD[b] + '. How many altogether?');

  numberChoices(later, answer, c.max, v => A.judge(v === answer, answer,
    () => { row.appendChild(el('div', 'nl-sign', '= ' + answer)) }),
    {hi: Math.max(c.max, answer + 1)});
};

/* ── COUNTING ON ───────────────────────────────────────────
   The step that actually makes addition quick, and it will not
   happen while the first group can be seen — a child who can
   see six dots will count six dots, every time, for years.

   So the bigger group goes in a closed box with its numeral on
   the front. There is nothing to count in there. The only way
   through is to hold six in your head and go "…seven, eight,
   nine", which is the whole point of the exercise. */
ACT.countOn = (c, A) => {
  const a = Math.max(4, 4 + rnd(Math.max(1, c.max - 6)));   // the hidden one, always the bigger
  const b = 1 + rnd(3);                                      // one, two or three more
  const answer = a + b;

  const row = el('div', 'nl-frames');
  const box = el('div', 'nl-box', a + '<small>in the box</small>');
  row.appendChild(box);
  row.appendChild(el('div', 'nl-sign', '+'));
  row.appendChild(rowEl(b, c.thing));
  A.stage.appendChild(row);

  const later = el('div');
  A.stage.appendChild(later);

  A.ask(a + ' in the box, and ' + b + ' more',
        'There are ' + D.WORD[a] + ' in the box. Count on ' + D.WORD[b] + ' more.');

  numberChoices(later, answer, answer + 2, v => A.judge(v === answer, answer, () => {
    box.innerHTML = a + '<small>in the box</small>';
    row.appendChild(el('div', 'nl-sign', '= ' + answer));
  }), {lo: Math.max(1, a - 1), hi: answer + 2});
};

/* ── TAKING AWAY ───────────────────────────────────────────
   The things that leave stay faintly on the screen. Children
   asked what is left will otherwise often answer how many
   went, and the ghosts make the two groups tellable apart
   without a word of explanation. */
ACT.takeAway = (c, A) => {
  const total = 3 + rnd(Math.max(1, c.max - 2));
  const gone = 1 + rnd(Math.max(1, total - 1));
  const answer = total - gone;

  const row = el('div', 'nl-scatter');
  row.style.height = 'min(34vh,220px)';
  const kids = [];
  for(let i = 0; i < total; i++){
    const t = el('span', 'thing', c.thing);
    t.style.left = (8 + (i % 5) * 19 + (i > 4 ? 6 : 0)) + '%';
    t.style.top  = (i < 5 ? 32 : 70) + '%';
    row.appendChild(t); kids.push(t);
  }
  A.stage.appendChild(row);

  const later = el('div');
  A.stage.appendChild(later);

  A.ask(total + ' here. ' + gone + ' go away.',
        'There are ' + D.WORD[total] + '. ' + D.WORD[gone] + ' go away.');

  setTimeout(() => {
    for(let i = 0; i < gone; i++) kids[total - 1 - i].classList.add('gone');
    setTimeout(() => {
      A.ask('How many are left?', 'How many are left?');
      numberChoices(later, answer, total, v => A.judge(v === answer, answer, () => {
        const tagged = el('div', '', answer + ' left');
        tagged.style.cssText = 'position:absolute;bottom:6px;right:14px;font-weight:700';
        row.appendChild(tagged);
      }), {lo: 0, hi: total});
    }, 900);
  }, 1100);
};

/* ── THE MISSING PART ──────────────────────────────────────
   Bonds again, but written down and with the picture taken
   away. A child who needs it can tap the question to get one
   frame's worth of help; most stop asking within a place or
   two. This is the first thing here that is genuinely
   algebra, and five-year-olds are entirely fine with it as
   long as it stays a story about a box of things. */
ACT.missing = (c, A) => {
  const sub = c.max >= 8 && Math.random() < .4;
  const total = 4 + rnd(Math.max(1, c.max - 3));
  const a = 1 + rnd(total - 1);
  const answer = total - a;

  const sum = el('div', 'nl-box');
  sum.style.width = 'auto'; sum.style.padding = '0 26px';
  sum.style.fontSize = 'clamp(30px,6vh,52px)';
  sum.textContent = sub ? total + ' − ? = ' + a : a + ' + ? = ' + total;
  A.stage.appendChild(sum);

  const help = frameEl(a, {cap: total});
  help.hidden = true;
  A.stage.appendChild(help);

  const later = el('div');
  A.stage.appendChild(later);

  A.ask(sub ? 'Take away how many?' : 'How many more?',
        sub ? D.WORD[total] + ' take away how many leaves ' + D.WORD[a] + '?'
            : D.WORD[a] + ' and how many more make ' + D.WORD[total] + '?',
        () => { help.hidden = false });

  numberChoices(later, answer, total, v => A.judge(v === answer, answer, () => {
    help.hidden = false;
    [...help.children].forEach((cell, i) => { if(i >= a) cell.classList.add('on', 'b') });
    sum.textContent = sub ? total + ' − ' + answer + ' = ' + a : a + ' + ' + answer + ' = ' + total;
  }));
};

/* ── DOUBLES ───────────────────────────────────────────────
   Doubles are learnt before any other addition fact and then
   used to reach the ones either side of them, so they are
   worth drilling on their own. Two identical frames, never one
   long row — the sameness is the fact. */
ACT.double = (c, A) => {
  const n = 1 + rnd(Math.floor(c.max / 2));
  const answer = n * 2;

  const row = el('div', 'nl-frames');
  row.appendChild(frameEl(n, {cap: 5, small: true}));
  row.appendChild(el('div', 'nl-sign', '+'));
  row.appendChild(frameEl(n, {cap: 5, small: true}));
  A.stage.appendChild(row);

  const later = el('div');
  A.stage.appendChild(later);

  A.ask('Double ' + n + ' is?', 'Double ' + D.WORD[n] + ' is?');
  numberChoices(later, answer, c.max, v => A.judge(v === answer, answer,
    () => { row.appendChild(el('div', 'nl-sign', '= ' + answer)) }));
};

/* ── A WORD PROBLEM ────────────────────────────────────────
   Read out line by line, with the picture built underneath as
   it is read. A five-year-old solving a word problem is
   solving a picture; the words are how they learn which
   picture to draw. */
ACT.story = (c, A) => {
  const op = c.style === 'take' ? 'take' : 'add';
  const lines = pick(D.STORIES[op]);
  const thing = c.thing;
  const name = D.NAMES[thing] || 'things';

  const a = op === 'add' ? 1 + rnd(Math.max(1, c.max - 2)) : 3 + rnd(Math.max(1, c.max - 3));
  const b = op === 'add' ? 1 + rnd(Math.max(1, c.max - a)) : 1 + rnd(Math.max(1, a - 1));
  const answer = op === 'add' ? a + b : a - b;

  const fill = s => s.replace('{a}', a).replace('{b}', b).replace('{things}', name);

  const row = el('div', 'nl-frames');
  const first = rowEl(a, thing);
  row.appendChild(first);
  A.stage.appendChild(row);

  const later = el('div');
  A.stage.appendChild(later);

  A.ask(fill(lines[0]), fill(lines[0]));

  setTimeout(() => {
    A.ask(fill(lines[0]) + ' ' + fill(lines[1]), fill(lines[1]));
    if(op === 'add'){
      row.appendChild(el('div', 'nl-sign', '+'));
      row.appendChild(rowEl(b, thing));
    }else{
      [...first.children].slice(a - b).forEach(x => { x.style.opacity = '.25' });
    }
    setTimeout(() => {
      A.ask(fill(lines[2]), fill(lines[2]));
      numberChoices(later, answer, c.max, v => A.judge(v === answer, answer,
        () => { row.appendChild(el('div', 'nl-sign', '= ' + answer)) }),
        {lo: 0, hi: Math.max(c.max, answer + 1)});
    }, 1500);
  }, 1900);
};

/* ════════════════════════════════════════════════════════════
   PLACES AND THE TRAIL
   ════════════════════════════════════════════════════════════ */
const FLASH = {1: 2000, 2: 1300};

function startPlace(i){
  const node = D.NODES[i];
  S = {idx: i, node, plan: node.plan.slice(), step: 0,
       right: 0, clean: 0, tries: 0, slips: 0, t0: Date.now()};
  $('nlTitle').textContent = node.name;
  show('nlPlay');
  Say.unlock();
  runStep();
}

/* Ten questions from everything already unlocked. This is the
   free-play door, for the days when a child wants to play but
   not to be taught anything new. */
function startMixed(){
  const openIdx = D.NODES.map((_, i) => i).filter(i => Save.stars(i) > 0);
  if(!openIdx.length) return startPlace(0);
  const plan = [];
  for(let k = 0; k < 10; k++){
    const n = D.NODES[pick(openIdx)];
    plan.push(pick(n.plan));
  }
  const node = D.NODES[openIdx[openIdx.length - 1]];
  S = {idx: -1, node, plan, step: 0, right: 0, clean: 0, tries: 0, slips: 0, t0: Date.now()};
  $('nlTitle').textContent = 'Anything goes';
  show('nlPlay');
  Say.unlock();
  runStep();
}

function finishPlace(){
  const asked = S.plan.length;
  const stars = S.clean >= asked - 1 ? 3 : S.clean >= asked - 3 ? 2 : 1;
  const ms = Date.now() - S.t0;
  if(S.idx >= 0) Save.finish(S.idx, stars, S.right, asked, ms);

  const node = S.node;
  const chapter = (S.idx >= 0 ? node.story : ['Ten questions, all done.', 'Zib is impressed.'])
    .map(l => '<p>' + l.replace(/\*([^*]+)\*/g, '<i data-w="$1">$1</i>') + '</p>').join('');

  $('nlWin').innerHTML =
    '<div class="nl-win">' +
      '<div style="font-size:52px">' + node.emoji + '</div>' +
      '<h2>' + node.name + '</h2>' +
      '<p class="score">' + '⭐'.repeat(stars) + '☆'.repeat(3 - stars) +
        ' · ' + S.clean + ' of ' + asked + ' first time</p>' +
      '<div class="chapter">' + chapter + '</div>' +
      '<div class="row">' +
        '<button class="nl-go" id="nlAgain">Play it again</button>' +
        '<button class="nl-icon" id="nlToMap" style="width:auto;padding:0 18px;height:48px;' +
          'border-radius:16px;font-size:16px;font-weight:600">Back to the map</button>' +
      '</div>' +
    '</div>';

  show('nlWon');
  Say.cheer(stars === 3 ? 'Every one first time' : 'Well done');

  $('nlWin').querySelectorAll('i[data-w]').forEach(w => {
    w.onclick = () => Say.word(w.dataset.w.toLowerCase());
  });
  $('nlAgain').onclick = () => S.idx >= 0 ? startPlace(S.idx) : startMixed();
  $('nlToMap').onclick = () => openTrail(node.map);
}

let currentMap = 1;

function openTrail(map){
  currentMap = map || currentMap;
  const maps = D.MAPS;

  $('nlMaps').innerHTML = maps.map(m => {
    const first = D.NODES.findIndex(n => n.map === m);
    const open = m === maps[0] || Save.stars(first - 1) > 0 || Save.stars(first) > 0;
    return '<button class="nl-map-btn" data-map="' + m + '" ' +
      'aria-pressed="' + (m === currentMap) + '"' + (open ? '' : ' disabled') + '>Map ' + m + '</button>';
  }).join('');
  $('nlMaps').querySelectorAll('[data-map]').forEach(b =>
    b.onclick = () => openTrail(Number(b.dataset.map)));

  $('nlTrail').innerHTML = D.NODES.map((n, i) => {
    if(n.map !== currentMap) return '';
    const stars = Save.stars(i), open = Save.open(i);
    return '<button class="nl-place' + (open ? '' : ' locked') + (stars ? ' done' : '') +
      '" data-i="' + i + '"' + (open ? '' : ' disabled') + '>' +
      '<span class="num">' + (i % 10 + 1) + '</span>' +
      '<span class="pe">' + (open ? n.emoji : '🔒') + '</span>' +
      '<span class="pn">' + n.name + '</span>' +
      '<span class="pt">' + n.teaches + '</span>' +
      '<span class="stars">' + (stars ? '⭐'.repeat(stars) : '') + '</span>' +
      '</button>';
  }).join('');

  $('nlTrail').querySelectorAll('[data-i]').forEach(b =>
    b.onclick = () => startPlace(Number(b.dataset.i)));

  const done = D.NODES.filter((_, i) => Save.stars(i)).length;
  $('nlMixed').hidden = done < 2;

  show('nlMap');
}

/* ════════════════════════════════════════════════════════════
   SCREENS
   ════════════════════════════════════════════════════════════ */
const SCREENS = ['nlMap', 'nlPlay', 'nlWon', 'nlSet'];
function show(id){
  SCREENS.forEach(s => $(s).hidden = (s !== id));
  try{ speechSynthesis.cancel() }catch(e){}
  window.scrollTo(0, 0);
}

/* ── grown-ups, behind a small sum ──────────────────────────
   The same idea as Word Land's settings: a child who can do
   this sum has finished the game anyway. */
function openSettings(){
  const a = 4 + rnd(6), b = 4 + rnd(6);
  const got = prompt('Grown-ups only.\n\nWhat is ' + a + ' + ' + b + '?');
  if(Number(got) !== a + b) return;

  const s = Save.read();
  const asked = s.asked || 0, right = s.right || 0;
  const pct = asked ? Math.round(right / asked * 100) : null;

  $('nlSetBody').innerHTML =
    '<div class="nl-win" style="text-align:left">' +
      '<h2 style="text-align:center">Grown-ups</h2>' +
      '<p class="score" style="text-align:center">' +
        (asked ? right + ' right out of ' + asked + ' · ' + pct + '%' : 'Nothing played yet') +
      '</p>' +
      '<p style="font-size:15px;line-height:1.6">Flashes on the subitising games last ' +
        '<b>' + (FLASH[1] / 1000) + 's</b> on Map 1 and <b>' + (FLASH[2] / 1000) + 's</b> on Map 2. ' +
        'Shorter is harder — if your child is counting the dots rather than seeing them, ' +
        'shorten it. If they are guessing, lengthen it.</p>' +
      '<div class="row" style="margin-top:14px">' +
        '<button class="nl-go" id="nlSlow">Slower flash</button>' +
        '<button class="nl-go" id="nlFast">Quicker flash</button>' +
      '</div>' +
      '<div class="row" style="margin-top:10px">' +
        '<button class="nl-go" id="nlMute" style="background:var(--lav,#9B8BB4);box-shadow:none">' +
          (MUTED ? 'Sound off' : 'Sound on') + '</button>' +
        '<button class="nl-go" id="nlWipe" style="background:#C23A3A;box-shadow:none">Start again</button>' +
      '</div>' +
      '<div class="row" style="margin-top:14px">' +
        '<button class="nl-go" id="nlSetBack" style="background:var(--frame)">Back</button>' +
      '</div>' +
    '</div>';

  show('nlSet');
  const step = d => { FLASH[1] = clamp(FLASH[1] + d, 600, 4000);
                      FLASH[2] = clamp(FLASH[2] + d, 500, 3000); openSettings() };
  $('nlSlow').onclick = () => step(300);
  $('nlFast').onclick = () => step(-300);
  $('nlMute').onclick = () => { MUTED = !MUTED; openSettings() };
  $('nlWipe').onclick = () => { if(confirm('Wipe all progress for this player?')){
    Save.reset(); openTrail(1) } };
  $('nlSetBack').onclick = () => openTrail();
}

/* ════════════════════════════════════════════════════════════
   START
   ════════════════════════════════════════════════════════════ */
function boot(){
  $('nlBack').onclick = () => openTrail();
  $('nlGear').onclick = openSettings;
  $('nlMixed').onclick = startMixed;
  $('nlAsk').addEventListener('keydown', e => {
    if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); $('nlAsk').click() }
  });
  document.addEventListener('pointerdown', () => Say.unlock(), {once: true, passive: true});
  const upTo = D.NODES.findIndex((_, i) => Save.stars(i) === 0);
  openTrail(upTo > 0 ? D.NODES[upTo].map : 1);
}

return {boot, startPlace, openTrail, Save, ACT};
})();

document.addEventListener('DOMContentLoaded', NumberLand.boot);
