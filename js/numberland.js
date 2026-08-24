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
  when(i){ return (Save.read().last || {})[i] || 0 },

  /* ── what each skill looks like so far ────────────────────
     Kept per activity, not just as one total, because "62%
     right" tells a grown-up nothing they can act on and
     "subitising 40%, counting 95%" tells them exactly what to
     sit down and do. `near` counts answers that were out by
     one, which in early counting is the single most telling
     error there is — a child who answers 6 for 5 is losing
     track while counting, and a child who answers 2 for 5 is
     not counting at all. Those need opposite responses. */
  note(act, ok, got, answer){
    const o = Save.read();
    o.skills = o.skills || {};
    const s = o.skills[act] || (o.skills[act] = {asked: 0, right: 0, near: 0});
    s.asked++;
    if(ok) s.right++;
    else if(typeof got === 'number' && typeof answer === 'number'
            && Math.abs(got - answer) === 1) s.near++;
    Save.write(o);
  },
  skills(){ return Save.read().skills || {} },

  /* How well a skill is going, as 0–1, or null if it has not
     been met enough times to say. Used by the gates below. */
  rate(act, least){
    const s = Save.skills()[act];
    if(!s || s.asked < (least || 6)) return null;
    return s.right / s.asked;
  },

  /* ── the gate ─────────────────────────────────────────────
     Two stars, not one. The whole sequence rests on each stage
     being secure before the next is built on it, so the gate
     has to actually mean something: one star is 7 of 10 first
     time, which is not a child who has understood it.

     A place also names the skill it leans on, and will not
     open until that skill is going well — there is no sense
     counting on from a number you cannot yet see without
     counting. Anything already played stays open, so nobody is
     ever locked out of somewhere they have been. */
  open(i){
    if(i === 0) return true;
    if(Save.stars(i) > 0) return true;              // already been there
    if(Save.stars(i - 1) < 2) return false;
    const need = D.NODES[i].needs;
    if(need){
      const r = Save.rate(need.skill);
      if(r !== null && r < need.min) return false;
    }
    return true;
  },

  /* Why a place is shut, in words a grown-up can act on. */
  why(i){
    if(i === 0 || Save.open(i)) return '';
    if(Save.stars(i - 1) < 2) return 'Two stars on ' + D.NODES[i - 1].name + ' opens this';
    const need = D.NODES[i].needs;
    return need ? need.why : 'Finish the place before this one';
  },

  finish(i, stars, right, asked, ms){
    const o = Save.read();
    o.places = o.places || {};
    o.last = o.last || {};
    o.places[i] = Math.max(o.places[i] || 0, stars);
    o.last[i] = Date.now();
    o.right = (o.right || 0) + right;
    o.asked = (o.asked || 0) + asked;
    o.ms = (o.ms || 0) + ms;
    Save.write(o);
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

/* ── HANDS ──────────────────────────────────────────────────
   Drawn rather than emoji, because ✋ is always five and the
   whole point is showing three.

   Fingers are the counters a child already owns, and a hand is
   the same five-and-some-more the ten frame teaches: seven is
   one whole hand and two, seen in one look. Raised fingers are
   filled, folded ones are stubs — so the amount reads at a
   glance without counting, which is the idea.

   `mirror` flips the second hand, so the two face each other
   the way a child's own hands do. */
function handEl(up, mirror){
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 100 130');
  svg.setAttribute('class', 'nl-hand');
  if(mirror) svg.style.transform = 'scaleX(-1)';

  const add = (tag, attrs, cls) => {
    const n = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for(const k in attrs) n.setAttribute(k, attrs[k]);
    if(cls) n.setAttribute('class', cls);
    svg.appendChild(n);
    return n;
  };

  /* four fingers, then the thumb — the thumb is the fifth one
     raised, which is how a hand actually counts */
  const FING = [[26, 34], [44, 24], [62, 28], [79, 42]];
  FING.forEach((f, i) => {
    const raised = i < Math.min(up, 4);
    const x = f[0], topY = raised ? f[1] : 62;
    add('rect', {x: x - 8, y: topY, width: 16, height: 76 - (topY - 20), rx: 8},
        'fing' + (raised ? '' : ' down'));
  });
  add('rect', {x: 16, y: 74, width: 68, height: 46, rx: 16}, 'palm');
  const thumbUp = up >= 5;
  add('rect', {x: thumbUp ? 2 : 12, y: thumbUp ? 74 : 86, width: 16,
               height: thumbUp ? 40 : 26, rx: 8},
      'fing' + (thumbUp ? '' : ' down'));
  return svg;
}

function handsEl(n){
  const box = el('div', 'nl-hands');
  box.appendChild(handEl(Math.min(n, 5), false));
  box.appendChild(handEl(Math.max(0, n - 5), true));
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
  wrap.dataset.answer = answer;
  shuffle([...set]).forEach(v => {
    const b = el('button', 'nl-num', String(v));
    b.type = 'button';
    b.dataset.v = v;
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
  /* the current question's choices, so a second miss can take
     them down to two rather than take the question away */
  if(S) S.choices = wrap;
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

  /* An activity says how to help, rather than the engine
     guessing. `fn` re-draws the same amount in a form that
     carries more of the answer — nearly always the ten frame,
     because that is the picture every child here already
     knows how to read. */
  scaffold(fn){ S.hint = fn },

  /* the one call an activity makes when it is settled.
     ok      — was the tap right
     answer  — the right answer
     reveal  — optional, draws the right picture on the stage
     opts    — {got} the number actually tapped, so the kind of
               mistake can be recorded and not just the fact of one

     ── WHAT A WRONG ANSWER DOES ─────────────────────────────
     Not "wrong, wrong, here is the answer". Telling a child the
     answer ends the thinking; the child who miscounted needed
     to count again, not to be informed. So the help fades in
     instead of the question being taken away:

       1st miss  the same amount, drawn in the ten frame — the
                 structure does the explaining
       2nd miss  down to two choices, one of them right, so the
                 last step is always one a child can take
       3rd miss  now show it, because being stuck is worse

     A child still finishes nearly every question themselves,
     which is the difference between learning that maths is
     something you work out and learning that it is something
     you are told. */
  judge(ok, answer, reveal, opts){
    if(locked) return;
    opts = opts || {};
    Save.note(S.act, ok, opts.got, answer);

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

    if(S.tries === 1){
      Say.phrase(pick(D.NUDGE));
      if(S.hint){
        try{ S.hint() }catch(e){}
        A.tell('Have a look at the frame');
      }
      return;
    }

    if(S.tries === 2 && S.choices && narrowTo(S.choices, answer)){
      A.tell('One of these two');
      Say.phrase('One of these two. Which one?');
      return;
    }

    locked = true;
    A.tell('It was <b>' + answer + '</b>');
    if(reveal) try{ reveal() }catch(e){}
    if(typeof answer === 'number') Say.phrase('It was ' + (D.WORD[answer] || answer));
    setTimeout(next, 2600);
  }
};

/* Take the choices down to the right one and its nearest rival,
   so the last step left is one a child can actually take.

   Every choice button carries its value in data-v and the row
   carries the right one in data-answer, which is what lets this
   work for the "5 and 3" pair buttons as well as the numerals —
   there the value is the part that varies.

   Returns false if there was nothing left to narrow, so judge
   knows to go on and show the answer instead. */
function narrowTo(wrap, answer){
  if(!wrap || wrap.dataset.answer == null) return false;
  const want = Number(wrap.dataset.answer);
  const live = [...wrap.querySelectorAll('[data-v]')].filter(b => !b.classList.contains('dropped'));
  if(live.length <= 2) return false;

  let keep = null, best = Infinity;
  live.forEach(b => {
    const v = Number(b.dataset.v);
    if(v === want) return;
    const d = Math.abs(v - want);
    if(d < best){ best = d; keep = b }
  });
  live.forEach(b => {
    if(Number(b.dataset.v) === want || b === keep) return;
    b.classList.add('dropped');
  });
  return true;
}

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
  S.act = name;             // what to file this question's result under
  S.hint = null;            // how to help, set by the activity if it can
  S.choices = null;
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

   TWO THINGS THAT ARE NOT THE SAME SKILL
   ------------------------------------------------------------
   Seeing 1–5 at a glance is perceptual subitising: it is
   immediate, and it is what this activity trains. Seeing 8 at a
   glance is not — nobody does that. What a person actually does
   with 8 is see five and three, which is conceptual subitising,
   a different thing built on top of part-whole. It has its own
   activity below, and asks its own question.

   So this one stops at five however high the place counts. A
   flashed 8 asked as "how many?" only teaches a child to guess.

   HOW LONG THE LOOK IS
   ------------------------------------------------------------
   Scaled to the amount, not fixed per map. Two seconds is
   plenty of time to count three, which would defeat the whole
   exercise — small amounts need a genuinely short look. Larger
   ones need longer simply to be taken in. */
function flashFor(n, map){
  const base = FLASH[map] || 1400;
  const scale = n <= 3 ? .40 : n <= 5 ? .65 : 1;
  return clamp(Math.round(base * scale), 220, 4000);
}

ACT.subitize = (c, A) => {
  const top = Math.min(5, c.max);          // perceptual only, never higher
  const n = 1 + rnd(top);
  const flash = flashFor(n, c.map);

  const holder = el('div');
  holder.style.visibility = 'hidden';
  holder.appendChild(c.style === 'frame' ? frameEl(n) : dotsEl(n));
  A.stage.appendChild(holder);

  const later = el('div');
  A.stage.appendChild(later);

  const show = () => {
    holder.style.visibility = 'visible';
    setTimeout(() => { holder.style.visibility = 'hidden' }, flash);
  };

  A.ask('How many?', 'Look quickly. How many?', show);
  setTimeout(show, 700);

  /* A miss brings it back as a ten frame and leaves it there.
     The child still says how many — but now from a picture that
     shows the amount rather than from memory of a flash. */
  A.scaffold(() => {
    holder.innerHTML = '';
    holder.appendChild(frameEl(n));
    holder.classList.add('nl-help');
    holder.style.visibility = 'visible';
  });

  setTimeout(() => {
    numberChoices(later, n, top, v => A.judge(v === n, n,
      () => { holder.style.visibility = 'visible' }, {got: v}));
  }, 700 + flash + 150);
};

/* ── SEEING IT AS FIVE AND SOME MORE ────────────────────────
   Conceptual subitising, and the question is the important
   part. Asking "how many?" of a flashed eight tests memory.
   Asking "how did you see it?" tests the thing that actually
   makes eight quick to handle — that it is five and three —
   and it is the same part-whole idea Bond Bridge needs later.

   The frame always fills five along the top and the rest
   underneath, so the split a child sees is never in doubt. */
ACT.seeGroups = (c, A) => {
  const lo = Math.max(6, Math.min(6, c.max));
  const n = lo + rnd(Math.max(1, c.max - lo + 1));
  const part = n - 5;
  const flash = flashFor(n, c.map);

  const holder = el('div');
  holder.style.visibility = 'hidden';
  holder.appendChild(frameEl(n));
  A.stage.appendChild(holder);

  const later = el('div');
  A.stage.appendChild(later);

  const show = () => {
    holder.style.visibility = 'visible';
    setTimeout(() => { holder.style.visibility = 'hidden' }, flash);
  };

  A.ask('How did you see it?', 'Look quickly. How did you see it?', show);
  setTimeout(show, 700);

  A.scaffold(() => {
    holder.classList.add('nl-help');
    holder.style.visibility = 'visible';
  });

  /* Wrong pairs are near misses on purpose — five and four when
     it was five and three — so the choice turns on the part,
     which is the bit being learnt. */
  const opts = [[5, part]];
  [part + 1, part - 1, part + 2].forEach(p => {
    if(p > 0 && p <= 5 && opts.length < 3 && !opts.some(o => o[1] === p)) opts.push([5, p]);
  });
  if(opts.length < 3 && n % 2 === 0) opts.push([n / 2, n / 2]);

  setTimeout(() => {
    const wrap = el('div', 'nl-choices');
    wrap.dataset.answer = part;          // the part is what varies
    shuffle(opts).forEach(([x, y]) => {
      const b = el('button', 'nl-pair', x + ' and ' + y);
      b.type = 'button';
      b.dataset.v = y;
      b.onclick = () => {
        if(locked) return;
        const ok = (x === 5 && y === part);
        b.classList.add(ok ? 'right' : 'wrong');
        if(!ok) setTimeout(() => b.classList.remove('wrong'), 420);
        if(ok) Say.phrase('Five and ' + D.WORD[part] + ' is ' + D.WORD[n]);
        A.judge(ok, '5 and ' + part, () => {
          holder.style.visibility = 'visible';
        }, {got: y});
      };
      wrap.appendChild(b);
    });
    later.appendChild(wrap);
    S.choices = wrap;
  }, 700 + flash + 150);
};

/* ── FINGERS ────────────────────────────────────────────────
   The best manipulative a five-year-old owns, and the one that
   goes home with them. A hand is already grouped into five, so
   reading seven off two hands is exactly the move the ten frame
   is teaching — but on something they can do at the dinner
   table without the iPad.

   Shown briefly and then left up: this is not a subitising
   test, it is about tying the finger picture to the numeral. */
ACT.fingers = (c, A) => {
  const n = 1 + rnd(Math.min(10, c.max));
  const hands = handsEl(n);
  A.stage.appendChild(hands);

  const later = el('div');
  A.stage.appendChild(later);

  A.ask('How many fingers?', 'How many fingers are up?');

  /* the same amount in the frame, side by side with the hands —
     the two pictures explaining each other is the whole lesson */
  A.scaffold(() => {
    const f = frameEl(n);
    f.classList.add('nl-help');
    A.stage.insertBefore(f, later);
    if(n > 5) Say.phrase('One whole hand and ' + D.WORD[n - 5] + ' more');
  });

  numberChoices(later, n, Math.min(10, c.max), v => A.judge(v === n, n, () => {
    const f = frameEl(n); f.classList.add('nl-help');
    A.stage.insertBefore(f, later);
  }, {got: v}));
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

    /* They counted correctly and still could not say how many —
       which is the cardinality gap, and very common. So put the
       count back in the frame and say the last number again,
       rather than treating it as a wrong answer to be corrected. */
    A.scaffold(() => {
      const f = frameEl(n);
      f.classList.add('nl-help');
      A.stage.insertBefore(f, later);
      Say.phrase('You counted to ' + D.WORD[n] + '. So there are ' + D.WORD[n] + '.');
    });

    numberChoices(later, n, c.max, v => A.judge(v === n, n, null, {got: v}));
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

  /* Scattered things are hard to keep track of; the same amount
     in the frame is not. A miss swaps one for the other rather
     than handing over the number. */
  A.scaffold(() => {
    const f = frameEl(n);
    f.classList.add('nl-help');
    A.stage.insertBefore(f, later);
  });

  numberChoices(later, n, c.max, v => A.judge(v === n, n, null, {got: v}));
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

  /* Nearly always one out. Rather than filling it in for them,
     clear the frame and count the target aloud so they can put
     them in one at a time against the numbers. */
  A.scaffold(() => {
    cells.forEach(cell => cell.classList.remove('on'));
    put = 0;
    Say.phrase('Start again. Put them in one at a time and count.');
  });

  go.onclick = () => A.judge(put === n, n, () => {
    cells.forEach((cell, i) => cell.classList.toggle('on', i < n));
  }, {got: put});
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
      }, {got: v});
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
    }, {got: v});
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

  /* Say the line up to the gap. Hearing "four, five, …" and
     stopping is the whole strategy this rehearses. */
  A.scaffold(() => {
    line.children[gapAt].classList.add('want');
    const before = ticks.slice(0, gapAt).slice(-2).map(v => D.WORD[v]).join(', ');
    Say.phrase(before + ', and then?');
  });
  numberChoices(later, answer, c.max, v => A.judge(v === answer, answer, () => {
    const t = line.children[gapAt];
    t.classList.remove('blank'); t.classList.add('filled'); t.textContent = answer;
  }, {got: v}), {lo: 0, hi: Math.max(c.max, lo + span)});
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

  /* The holes in the frame ARE the answer, so the help is
     simply to point at them — count the empty cells. That is
     the intended route to the bonds, not a workaround. */
  A.scaffold(() => {
    [...f.children].forEach((cell, i) => {
      if(i >= a && i < total) cell.classList.add('gap');
    });
    Say.phrase('Count the empty ones');
  });

  numberChoices(later, answer, total, v => A.judge(v === answer, answer, () => {
    [...f.children].forEach((cell, i) => { if(i >= a && i < total) cell.classList.add('on', 'b') });
    sum.textContent = a + ' + ' + answer + ' = ' + total;
  }, {got: v}));
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

  /* Both groups poured into one frame. Counting all is the
     right strategy here, and the frame makes it countable. */
  A.scaffold(() => {
    const f = frameEl(answer, {cap: Math.max(10, answer)});
    f.classList.add('nl-help');
    A.stage.insertBefore(f, later);
  });

  numberChoices(later, answer, c.max, v => A.judge(v === answer, answer,
    () => { row.appendChild(el('div', 'nl-sign', '= ' + answer)) }, {got: v}),
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

  /* The box stays shut. Opening it would hand back exactly the
     habit this activity exists to break — a child who can see
     six things will count six things. Instead the extras get
     numbered as they would be counted on, so the child hears
     where to start rather than being shown what to count. */
  A.scaffold(() => {
    [...row.querySelectorAll('.nl-row .thing')].forEach((t, i) => {
      t.appendChild(el('span', 'tag', String(a + i + 1)));
    });
    Say.phrase('Start at ' + D.WORD[a] + '. Then ' +
      range(a + 1, a + b).map(v => D.WORD[v]).join(', ') + '.');
  });

  numberChoices(later, answer, answer + 2, v => A.judge(v === answer, answer, () => {
    box.innerHTML = a + '<small>in the box</small>';
    row.appendChild(el('div', 'nl-sign', '= ' + answer));
  }, {got: v}), {lo: Math.max(1, a - 1), hi: answer + 2});
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

      /* Children asked what is left very often answer how many
         went. The frame shows only the ones still here, which
         settles that without a word of explanation. */
      A.scaffold(() => {
        const f = frameEl(answer, {cap: Math.max(10, total)});
        f.classList.add('nl-help');
        A.stage.insertBefore(f, later);
        Say.phrase('These are the ones still here');
      });

      numberChoices(later, answer, total, v => A.judge(v === answer, answer, () => {
        const tagged = el('div', '', answer + ' left');
        tagged.style.cssText = 'position:absolute;bottom:6px;right:14px;font-weight:700';
        row.appendChild(tagged);
      }, {got: v}), {lo: 0, hi: total});
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

  /* This one is written down with no picture, so the help is
     the picture: the frame it was written from. */
  A.scaffold(() => {
    help.hidden = false;
    help.classList.add('nl-help');
    [...help.children].forEach((cell, i) => { if(i >= a) cell.classList.add('gap') });
  });

  numberChoices(later, answer, total, v => A.judge(v === answer, answer, () => {
    help.hidden = false;
    [...help.children].forEach((cell, i) => { if(i >= a) cell.classList.add('on', 'b') });
    sum.textContent = sub ? total + ' − ' + answer + ' = ' + a : a + ' + ' + answer + ' = ' + total;
  }, {got: v}));
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

  A.scaffold(() => {
    const f = frameEl(answer, {cap: Math.max(10, answer)});
    f.classList.add('nl-help');
    A.stage.insertBefore(f, later);
    Say.phrase(D.WORD[n] + ' and ' + D.WORD[n]);
  });
  numberChoices(later, answer, c.max, v => A.judge(v === answer, answer,
    () => { row.appendChild(el('div', 'nl-sign', '= ' + answer)) }, {got: v}));
};

/* ── A WORD PROBLEM ────────────────────────────────────────
   Read out line by line, with the picture built underneath as
   it is read. A five-year-old solving a word problem is
   solving a picture; the words are how they learn which
   picture to draw. */
/* FOUR SHAPES, NOT TWO
   ------------------------------------------------------------
   "Three and two more, how many?" is the easiest word problem
   there is — the unknown is at the end, and a child can just
   act the story out in order. Two harder shapes matter as much
   and are usually left out entirely:

     change   the unknown is in the middle. "Zib had three.
              Some more came. Now there are seven." You cannot
              act this out forwards; you have to work back, and
              that is the beginning of algebra.

     compare  two lots side by side, and the answer is a
              difference — a number that is not sitting there to
              be counted in either group. This is the hardest of
              the four and by far the most neglected, and it is
              where number sense either forms or does not.

   Compare gets the representation it needs: two rows lined up
   end to end, so the extras stick out past the shorter row.
   The overhang IS the difference, and a five-year-old can see
   it without being told a method. */
ACT.story = (c, A) => {
  const kinds = {add: 'add', take: 'take', change: 'change', compare: 'compare'};
  const op = kinds[c.style] || 'add';
  const lines = pick(D.STORIES[op]);
  const thing = c.thing;
  const other = c.things[1] || thing;
  const name = D.NAMES[thing] || 'things';

  let a, b, total, answer;
  if(op === 'add'){
    a = 1 + rnd(Math.max(1, c.max - 2));
    b = 1 + rnd(Math.max(1, c.max - a));
    answer = a + b;
  }else if(op === 'take'){
    a = 3 + rnd(Math.max(1, c.max - 3));
    b = 1 + rnd(Math.max(1, a - 1));
    answer = a - b;
  }else if(op === 'change'){
    total = 3 + rnd(Math.max(1, c.max - 2));
    a = 1 + rnd(Math.max(1, total - 1));
    answer = total - a;                       // how many arrived
    b = answer;
  }else{                                       // compare
    a = 2 + rnd(Math.max(1, c.max - 2));
    b = 1 + rnd(Math.max(1, a - 1));
    if(b >= a) b = a - 1;
    answer = a - b;                            // the difference
  }

  const fill = s => String(s)
    .replace('{a}', a).replace('{b}', b)
    .replace('{total}', total).replace('{things}', name);

  const row = el('div', op === 'compare' ? 'nl-lineup' : 'nl-frames');
  A.stage.appendChild(row);
  const later = el('div');
  A.stage.appendChild(later);

  let first = null, laneA = null, laneB = null;

  if(op === 'compare'){
    laneA = el('div', 'lane');
    laneA.appendChild(el('span', 'who', 'Zib'));
    const pa = el('div', 'pips');
    for(let i = 0; i < a; i++) pa.appendChild(el('span', '', thing));
    laneA.appendChild(pa);
    row.appendChild(laneA);
  }else{
    first = rowEl(a, thing);
    row.appendChild(first);
  }

  A.ask(fill(lines[0]), fill(lines[0]));

  setTimeout(() => {
    A.ask(fill(lines[0]) + ' ' + fill(lines[1]), fill(lines[1]));

    if(op === 'add'){
      row.appendChild(el('div', 'nl-sign', '+'));
      row.appendChild(rowEl(b, thing));
    }else if(op === 'take'){
      [...first.children].slice(a - b).forEach(x => { x.style.opacity = '.25' });
    }else if(op === 'change'){
      /* the arrivals go in a shut box — that is the unknown, and
         it has to look like something rather than nothing */
      row.appendChild(el('div', 'nl-sign', '+'));
      row.appendChild(el('div', 'nl-hidden-box', '?'));
      row.appendChild(el('div', 'nl-sign', '=' + total));
    }else{
      laneB = el('div', 'lane');
      laneB.appendChild(el('span', 'who', 'Ana'));
      const pb = el('div', 'pips');
      for(let i = 0; i < b; i++) pb.appendChild(el('span', '', other));
      laneB.appendChild(pb);
      row.appendChild(laneB);
    }

    setTimeout(() => {
      A.ask(fill(lines[2]), fill(lines[2]));

      if(op === 'compare'){
        /* light up the overhang — the ones with nothing opposite */
        A.scaffold(() => {
          [...laneA.querySelectorAll('.pips span')].forEach((s, i) => {
            if(i >= b) s.classList.add('extra');
          });
          Say.phrase('Look at the ones with nobody underneath');
        });
      }else if(op === 'change'){
        A.scaffold(() => {
          const f = frameEl(a, {cap: total});
          f.classList.add('nl-help');
          [...f.children].forEach((cell, i) => { if(i >= a) cell.classList.add('gap') });
          A.stage.insertBefore(f, later);
          Say.phrase('There were ' + D.WORD[a] + '. Now there are ' + D.WORD[total] +
                     '. Count the empty ones.');
        });
      }else{
        A.scaffold(() => {
          const f = frameEl(answer, {cap: Math.max(10, c.max)});
          f.classList.add('nl-help');
          A.stage.insertBefore(f, later);
        });
      }

      numberChoices(later, answer, c.max, v => A.judge(v === answer, answer,
        () => {
          if(op === 'compare'){
            [...laneA.querySelectorAll('.pips span')].forEach((s, i) => {
              if(i >= b) s.classList.add('extra');
            });
          }else{
            row.appendChild(el('div', 'nl-sign', '= ' + answer));
          }
        }, {got: v}),
        {lo: 0, hi: Math.max(c.max, answer + 1)});
    }, 1500);
  }, 1900);
};

/* ════════════════════════════════════════════════════════════
   PLACES AND THE TRAIL
   ════════════════════════════════════════════════════════════ */
/* The reference look, for a frame of six and up. Small amounts
   get a much shorter one — see flashFor. Two seconds used to be
   the figure for everything on Map 1, which is comfortably long
   enough to count three, and counting is precisely what this is
   meant to make impossible. */
const FLASH = {1: 1500, 2: 1200};

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

  /* ── WHAT COMES BACK, AND HOW OFTEN ──────────────────────
     Not evenly. Picking at random over everything unlocked
     means a place finished three weeks ago is as likely as
     yesterday's, which is the one thing you would not choose
     if you were choosing.

     So two things raise a place's chances: it went badly (one
     star pulls harder than three), and it has not been seen for
     a while. That is spacing and it is most of what makes
     practice stick — a shaky place seen a week later is worth
     more than a solid one seen twice in a day. */
  const now = Date.now();
  const DAY = 86400000;
  const weight = i => {
    const stars = Save.stars(i);
    const days = Save.when(i) ? Math.min(14, (now - Save.when(i)) / DAY) : 14;
    return (4 - stars) * 3 + days;
  };
  const weights = openIdx.map(weight);
  const total = weights.reduce((x, y) => x + y, 0);
  const draw = () => {
    let r = Math.random() * total;
    for(let k = 0; k < openIdx.length; k++){ r -= weights[k]; if(r <= 0) return openIdx[k] }
    return openIdx[openIdx.length - 1];
  };

  const plan = [], picks = [];
  for(let k = 0; k < 10; k++){
    const i = draw();
    picks.push(i);
    plan.push(pick(D.NODES[i].plan));
  }
  const node = D.NODES[openIdx[openIdx.length - 1]];
  S = {idx: -1, node, plan, picks, step: 0, right: 0, clean: 0, tries: 0, slips: 0, t0: Date.now()};
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
    /* A locked place says what would open it. "Locked" on its
       own tells a grown-up nothing, and two stars is a gate they
       can only help with if they know it is there. */
    return '<button class="nl-place' + (open ? '' : ' locked') + (stars ? ' done' : '') +
      '" data-i="' + i + '"' + (open ? '' : ' disabled') + '>' +
      '<span class="num">' + (i % 10 + 1) + '</span>' +
      '<span class="pe">' + (open ? n.emoji : '🔒') + '</span>' +
      '<span class="pn">' + n.name + '</span>' +
      '<span class="pt">' + (open ? n.teaches : Save.why(i)) + '</span>' +
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

/* ── WHAT EACH SKILL LOOKS LIKE ─────────────────────────────
   One overall percentage is not something a grown-up can act
   on. "Counting 95%, subitising 40%" is: it says sit down and
   play snap with a pack of cards, and stop worrying about the
   counting.

   The out-by-one column is the useful one. A child answering 6
   for 5 is counting but losing their place — double-counting or
   skipping — and needs to slow down and touch each thing. A
   child answering 2 for 5 is not counting at all and needs
   something else entirely. Both show up as "wrong" in every
   other maths game and get the same useless response. */
const SKILL_NAMES = {
  subitize:'Seeing small amounts', seeGroups:'Seeing five and some more',
  count:'Counting one by one', howMany:'Amount → numeral', showMe:'Numeral → amount',
  fingers:'Fingers', match:'Matching', compare:'More, fewer, same',
  order:'Putting in order', beforeAfter:'Before and after', bond:'Number bonds',
  addAll:'Adding by counting all', countOn:'Counting on', takeAway:'Taking away',
  missing:'The missing part', double:'Doubles', story:'Word problems'
};

function skillTable(){
  const s = Save.skills();
  const rows = Object.keys(s)
    .filter(k => s[k].asked >= 3)
    .map(k => ({k, ...s[k], pct: Math.round(s[k].right / s[k].asked * 100)}))
    .sort((x, y) => x.pct - y.pct);

  if(!rows.length) return '<p style="font-size:14px;color:var(--lav,#9B8BB4);margin-top:10px">' +
    'Once a few places have been played, each skill will be listed here on its own.</p>';

  const near = rows.reduce((a, r) => a + r.near, 0);
  const missed = rows.reduce((a, r) => a + (r.asked - r.right), 0);

  return '<div style="margin-top:14px">' +
    rows.map(r =>
      '<div style="display:flex;align-items:center;gap:10px;padding:7px 0;' +
        'border-top:2px solid var(--ghost,#F3EEFB)">' +
        '<span style="flex:1;font-size:14.5px;font-weight:600">' +
          (SKILL_NAMES[r.k] || r.k) + '</span>' +
        (r.near ? '<span style="font-size:12px;color:var(--lav,#9B8BB4)">' +
          r.near + ' out by one</span>' : '') +
        '<span style="font-weight:700;font-size:15px;color:' +
          (r.pct >= 80 ? 'var(--leaf,#2E8B57)' : r.pct >= 55 ? 'var(--gold,#D98E12)' : 'var(--berry,#C9184A)') +
          '">' + r.pct + '%</span>' +
      '</div>').join('') +
    (missed ? '<p style="font-size:13px;line-height:1.6;color:var(--lav,#9B8BB4);margin-top:10px">' +
      '<b>' + near + ' of ' + missed + '</b> wrong answers were out by one. ' +
      'Mostly out by one means the counting is there but the keeping-track is not — ' +
      'slow down and touch each thing. Wrong by a lot more often means the amount ' +
      'is not being counted at all.</p>' : '') +
    '</div>';
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
      skillTable() +
      '<p style="font-size:15px;line-height:1.6">The flash scales with the amount — ' +
        'a three is shown for about <b>' + (flashFor(3, 1) / 1000).toFixed(2) + 's</b> ' +
        'and a full frame for <b>' + (flashFor(8, 1) / 1000).toFixed(2) + 's</b> on Map 1. ' +
        'Small amounts get a short look on purpose: two seconds is long enough to count ' +
        'three, and counting is the thing these games are trying to make unnecessary. ' +
        'If your child is counting rather than seeing, shorten it. If they are guessing, ' +
        'lengthen it.</p>' +
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

/* ── hooks for tools/nl-smoke.js ────────────────────────────
   The test drives the real page rather than a copy of it, so it
   needs to be able to run one named step and to see what mixed
   practice chose. Neither is reachable from the game itself. */
function runSpec(spec){
  if(!S) startPlace(0);
  S.plan[S.step] = spec;
  runStep();
}
function lastMixedPicks(){ return (S && S.picks) || [] }
function state(){ return S }

return {boot, startPlace, startMixed, openTrail, Save, ACT, runSpec, lastMixedPicks, state, flashFor};
})();

document.addEventListener('DOMContentLoaded', NumberLand.boot);
