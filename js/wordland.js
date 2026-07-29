/* ============================================================
   WORD LAND · ENGINE
   Needs wordland-data.js and wordland-audio.js to be loaded first.
   ============================================================ */

const $ = id => document.getElementById(id);
const COLORS = ["#FF6B6B","#FFC93C","#4ECDC4","#45B7D1","#96E6A1","#FF9FF3","#F8A5C2","#778BEB"];
const CHEERS = [["🎉","Yes!"],["🌟","Nice one!"],["🥳","You got it!"],["✨","Brilliant!"],["🎈","Well done!"],["💫","Superstar!"]];
const TRY_AGAIN = ["Try again","Not that one","Have another go"];

function shuffle(a){ const b=[...a]; for(let i=b.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [b[i],b[j]]=[b[j],b[i]] } return b }
function rnd(a){ return a[Math.floor(Math.random()*a.length)] }
function col(i){ return COLORS[i%COLORS.length] }
function showScreen(id){ document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active')); $(id).classList.add('active'); window.scrollTo(0,0) }
function esc(s){ return String(s).replace(/'/g,"\\'") }

/* ── progress, saved locally ─────────────────────────────── */
const Store = (() => {
  const mem = {};
  const hasArtifact = typeof window!=='undefined' && window.storage && typeof window.storage.get==='function';
  let hasLS = false;
  try { localStorage.setItem('__t','1'); localStorage.removeItem('__t'); hasLS = true } catch(e){}
  return {
    async get(k){
      if(hasArtifact){ try{ const r=await window.storage.get(k); return r&&r.value!=null?r.value:null }catch(e){} }
      if(hasLS){ try{ return localStorage.getItem(k) }catch(e){} }
      return k in mem ? mem[k] : null },
    async set(k,v){
      if(hasArtifact){ try{ await window.storage.set(k,v); return }catch(e){} }
      if(hasLS){ try{ localStorage.setItem(k,v); return }catch(e){} }
      mem[k]=v }
  };
})();
const SAVE_KEY = 'wordLand2';

function freshDB(){
  const nodes = {};
  NODES.forEach(n => nodes[n.no] = { stars:0, plays:0, correct:0, wrong:0, timeMs:0 });
  return { v:2, started:Date.now(), nodes, muted:false, unlockAll:false };
}
let DB = freshDB();
let saveTimer = null;
function save(){ clearTimeout(saveTimer); saveTimer = setTimeout(()=>Store.set(SAVE_KEY, JSON.stringify(DB)), 160) }
async function load(){
  try{
    const raw = await Store.get(SAVE_KEY);
    if(raw){
      const d = JSON.parse(raw);
      if(d && d.v===2 && d.nodes){
        DB = d;
        NODES.forEach(n => { if(!DB.nodes[n.no]) DB.nodes[n.no] = {stars:0,plays:0,correct:0,wrong:0,timeMs:0} });
      }
    }
  }catch(e){}
  WLAudio.setMuted(!!DB.muted);
  renderMap();
}

function isDone(no){ return DB.nodes[no] && DB.nodes[no].stars > 0 }
function unlocked(no){ return DB.unlockAll || no===1 || isDone(no-1) }
function storyCount(){ return NODES.filter(n=>isDone(n.no)).length }

function confetti(){
  const c = $('confettiC'); c.innerHTML='';
  for(let i=0;i<34;i++){
    const d=document.createElement('div'); d.className='confetti-p'; const sz=7+Math.random()*11;
    Object.assign(d.style,{ left:Math.random()*100+'%', width:sz+'px', height:sz+'px',
      backgroundColor:COLORS[i%COLORS.length], borderRadius:i%3===0?'50%':i%3===1?'3px':'0',
      transform:`rotate(${Math.random()*360}deg)`,
      animation:`confettiFall ${1.5+Math.random()}s ease-in ${Math.random()*.5}s forwards` });
    c.appendChild(d);
  }
  setTimeout(()=>c.innerHTML='',3000);
}

/* ════════════════════════════════════════════════════════════
   MAP
   ════════════════════════════════════════════════════════════ */
const OFFSETS = [0,42,-30,36,-40,26,-36,40,-18,0];

function renderMap(){
  const el = $('trail'); el.innerHTML='';
  const current = NODES.find(n => unlocked(n.no) && !isDone(n.no));

  NODES.forEach((n,i) => {
    if(i>0){
      const wrap = document.createElement('div'); wrap.className='dots';
      for(let d=0;d<3;d++){
        const dot=document.createElement('div');
        dot.className='dot'+(isDone(NODES[i-1].no)?' done':'');
        wrap.appendChild(dot);
      }
      el.appendChild(wrap);
    }
    const done = isDone(n.no), locked = !unlocked(n.no), now = current && current.no===n.no;
    const node = document.createElement('div');
    node.className = 'tnode' + (locked?' locked':'');
    node.style.setProperty('--off', OFFSETS[i]);
    if(!locked){
      node.setAttribute('role','button'); node.tabIndex = 0;
      node.onclick = () => openSheet(n.no);
      node.onkeydown = e => { if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openSheet(n.no) } };
    }
    const stone = document.createElement('div');
    stone.className = 'stone' + (locked?' locked':'') + (now?' current':'');
    if(!locked) stone.style.background = n.grad;
    stone.textContent = locked ? '🔒' : n.art;
    const num = document.createElement('div'); num.className='num'; num.textContent=n.no; stone.appendChild(num);
    if(done){ const t=document.createElement('div'); t.className='tick'; t.textContent='✓'; stone.appendChild(t) }
    if(now){ const s=document.createElement('div'); s.className='sprite'; s.textContent='🧚'; node.appendChild(s) }
    node.appendChild(stone);

    const pill = document.createElement('div'); pill.className='pill';
    pill.innerHTML = locked ? '<span class="fx">Locked</span>' : n.region;
    node.appendChild(pill);

    const st = document.createElement('div'); st.className='stars';
    st.textContent = done ? '⭐'.repeat(DB.nodes[n.no].stars) + '·'.repeat(3-DB.nodes[n.no].stars) : '';
    node.appendChild(st);
    el.appendChild(node);
  });

  const c = storyCount();
  $('bookCount').textContent = c + ' of ' + NODES.length + ' story pages';
  $('mapSub').textContent = c===0 ? 'Help Zib carry the letters home'
    : c===NODES.length ? 'Every letter is home. You did it!'
    : 'Letters found: ' + NODES.slice(0,c).flatMap(n=>n.letters).filter((v,i,a)=>a.indexOf(v)===i).join(' ');
}

/* ── the card that opens when you tap a place ────────────── */
function openSheet(no){
  const n = NODES[no-1], s = DB.nodes[no];
  WLAudio.preloadNode(n);                       // warm the recordings up

  let learn = '<div class="lbl">In this place you will learn</div><div class="learn-row">';
  learn += n.letters.map(l=>`<span class="tag snd">${l.toLowerCase()} · ${SOUND[l]||''}</span>`).join('');
  learn += '</div>';
  if(n.words.length) learn += '<div class="learn-row">' + n.words.slice(0,6).map(w=>`<span class="tag">${w.w.toLowerCase()}</span>`).join('') + '</div>';
  if(n.hfw.length)   learn += '<div class="learn-row">' + n.hfw.map(h=>`<span class="tag hf">${h.w.toLowerCase()}</span>`).join('') + '</div>';

  $('sheet').innerHTML = `
    <div class="grab"></div>
    <div class="sheet-top">
      <div class="badge" style="background:${n.grad}">${n.art}</div>
      <div><div class="eyebrow">Place ${n.no} · Lesson ${n.no}</div><h2>${n.region}</h2></div>
    </div>
    <div class="learn-box">${learn}</div>
    <p class="note">${n.plan.length} activities, then a new chapter for your storybook.${s.stars?` Your best: ${'⭐'.repeat(s.stars)}`:''}</p>
    <button class="big-btn go" onclick="startNode(${no})">${s.stars?'Play again':'Start the journey'} →</button>
    ${s.stars?`<button class="big-btn quiet" style="margin-top:9px" onclick="closeSheet();readStory(${no},'map')">Read the story 📖</button>`:''}
    <button class="big-btn quiet" style="margin-top:9px" onclick="closeSheet()">Not yet</button>`;
  $('sheetBg').classList.add('open');
}
function closeSheet(){ $('sheetBg').classList.remove('open') }

/* ════════════════════════════════════════════════════════════
   BUILDING A PLACE'S TEN ACTIVITIES
   ════════════════════════════════════════════════════════════ */
function picsStartingWith(L, node){
  const mine = node.vocab.filter(v => v.w[0]===L);
  return mine.length >= 3 ? mine : ALL_PICS.filter(v => v.w[0]===L);
}

function buildRounds(n){
  const used = { pic:[], word:[], hfw:[], letter:[], fam:[] };
  const nextLetter = () => { const av=n.letters.filter(l=>!used.letter.includes(l)); const l=av.length?rnd(av):rnd(n.letters); used.letter.push(l); return l };
  const nextPic = () => { const av=n.vocab.filter(v=>!used.pic.includes(v.w)); const v=av.length?rnd(av):rnd(n.vocab); used.pic.push(v.w); return v };
  const nextWord = () => { const av=n.words.filter(v=>!used.word.includes(v.w)); const v=av.length?rnd(av):rnd(n.words); used.word.push(v.w); return v };
  const nextHfw = () => { const av=n.hfw.filter(v=>!used.hfw.includes(v.w)); const v=av.length?rnd(av):rnd(n.hfw); used.hfw.push(v.w); return v };
  const wrongLetters = (right,k) => shuffle([...(n.confuse||[]), ...LETTER_POOL].filter(x=>x!==right)).filter((v,i,a)=>a.indexOf(v)===i).slice(0,k);

  return n.plan.map(entry => {
    const [type, flavour] = String(entry).split(':');

    if(type==='sound'){
      const L = nextLetter();
      const key = n.vocab.find(v=>v.w[0]===L) || KEYWORD[L] || n.vocab[0] || {w:L,e:'✨'};
      return { type, answer:L, sound:SOUND[L]||L, key, opts:shuffle([L, ...wrongLetters(L,2)]) };
    }

    if(type==='beginSound'){
      const onFocus = n.vocab.filter(v => n.letters.includes(v.w[0]) && !used.pic.includes(v.w));
      const target = onFocus.length ? rnd(onFocus) : nextPic();
      used.pic.push(target.w);
      const L = target.w[0];
      return { type, answer:L, target, opts:shuffle([L, ...wrongLetters(L,2)]) };
    }

    if(type==='starts'){
      const onFocus = n.vocab.filter(v => n.letters.includes(v.w[0]) && !used.pic.includes(v.w));
      const spare = n.vocab.filter(v => !used.pic.includes(v.w));
      const right = onFocus.length ? rnd(onFocus) : spare.length ? rnd(spare) : rnd(n.vocab);
      used.pic.push(right.w);
      const L = right.w[0];
      const wrong = shuffle(ALL_PICS.filter(v => v.w[0]!==L && v.w!==right.w)).slice(0,3);
      return { type, answer:right.w, letter:L, opts:shuffle([right,...wrong]) };
    }

    if(type==='tapAll'){
      const able = n.letters.map(L=>({L, pics:picsStartingWith(L,n)})).filter(x=>x.pics.length>=3);
      const chosen = able.length ? rnd(able) : { L:n.letters[0], pics:ALL_PICS.filter(v=>v.w[0]===n.letters[0]) };
      const right = shuffle(chosen.pics).slice(0,3);
      const wrong = shuffle(ALL_PICS.filter(v => v.w[0]!==chosen.L && !right.some(r=>r.w===v.w))).slice(0,3);
      return { type, letter:chosen.L, correct:right.map(r=>r.w), opts:shuffle([...right,...wrong]) };
    }

    if(type==='listen'){
      const right = nextPic();
      const wrong = shuffle(ALL_PICS.filter(v=>v.w!==right.w)).slice(0,3);
      return { type, answer:right.w, target:right, opts:shuffle([right,...wrong]) };
    }

    if(type==='match'){
      const taught = lettersUpTo(n.no);
      // prefer letters already met; never reach outside this land, so every
      // letter the child hears here is one we have a recording for
      const others = shuffle(taught.filter(l=>!n.letters.includes(l)))
        .concat(shuffle(landLetters().filter(l=>!n.letters.includes(l))))
        .filter((v,i,a)=>a.indexOf(v)===i);
      const letters = [n.letters[0]];
      for(const L of others){ if(letters.length>=3) break; if(ALL_PICS.some(v=>v.w[0]===L)) letters.push(L) }
      const pairs = letters.map(L => ({ l:L, pic:rnd(ALL_PICS.filter(v=>v.w[0]===L)) }));
      return { type, pairs, order:shuffle(pairs.map(p=>p.l)) };
    }

    if(type==='hunt'){
      const L = nextLetter();
      const cells = [];
      const hits = 4 + Math.floor(Math.random()*2);           // 4 or 5 to find
      for(let i=0;i<hits;i++) cells.push({ ch: i%2 ? L : L.toLowerCase(), ok:true });
      const junk = shuffle([...(n.confuse||[]), ...LETTER_POOL].filter(x=>x!==L));
      while(cells.length<12){
        const j = junk[cells.length % junk.length];
        cells.push({ ch: Math.random()<.5 ? j : j.toLowerCase(), ok:false });
      }
      return { type, letter:L, cells: shuffle(cells).map((c,i)=>({ ...c, font:['font-a','font-b','font-c'][i%3] })) };
    }

    if(type==='caseMatch'){
      const L = nextLetter();
      return { type, answer:L, lower:L.toLowerCase(), opts:shuffle([L, ...wrongLetters(L,2)]) };
    }

    if(type==='initial'){
      const fromVocab = n.vocab.filter(v => n.letters.includes(v.w[0]) && !used.word.includes(v.w));
      const fromFamily = n.family.filter(v => !used.fam.includes(v.w));
      let src = fromVocab.length ? fromVocab : (fromFamily.length ? fromFamily : (n.family.length ? n.family : n.vocab));
      // short words only — the child has to see the whole rime at once
      const short = src.filter(v => v.w.length <= 5);
      if(short.length) src = short;
      const target = rnd(src);
      used.word.push(target.w); used.fam.push(target.w);
      const L = target.w[0];
      return { type, answer:L, target, opts:shuffle([L, ...wrongLetters(L,3)]) };
    }

    if(type==='blend'){
      const w = nextWord();
      const pool = NODES[NODES.length-1].words;
      const wrong = shuffle(pool.filter(x=>x.w!==w.w)).slice(0,2);
      return { type, answer:w.w, target:w, opts:shuffle([w,...wrong]) };
    }

    if(type==='spell'){
      const w = nextWord();
      const extra = shuffle(LETTER_POOL.filter(l=>!w.w.includes(l))).slice(0, w.w.length<3 ? 2 : 1);
      return { type, answer:w.w, target:w, tiles:shuffle([...w.w.split(''), ...extra]) };
    }

    if(type==='rhyme'){
      const fam = n.family.length ? n.family : NODES[NODES.length-1].family;
      const target = rnd(fam);
      const right = rnd(fam.filter(v=>v.w!==target.w));
      const wrong = shuffle(ALL_PICS.filter(v => !fam.some(f=>f.w===v.w) && v.w!==target.w)).slice(0,2);
      return { type, answer:right.w, target, opts:shuffle([right,...wrong]) };
    }

    if(type==='sight'){
      const h = nextHfw();
      const pool = ["I","AM","AT","A","IT","IS","AN","MY","THE","SAT"].filter(x=>x!==h.w);
      return { type, answer:h.w, target:h, opts:shuffle([h.w, ...shuffle(pool).slice(0,2)]) };
    }

    if(type==='trace'){
      const L = n.letters[0];
      return { type, letter:L, upper: flavour==='u' };
    }

    return { type:'sound', answer:'M', sound:'mmm', key:{w:'MOON',e:'🌙'}, opts:['M','S','T'] };
  });
}

/* ════════════════════════════════════════════════════════════
   PLAY LOOP
   ════════════════════════════════════════════════════════════ */
let run = { node:1, rounds:[], i:0, mistakes:0, missThis:0, busy:false, startedAt:0 };

function startNode(no){
  closeSheet();
  const n = NODES[no-1];
  run = { node:no, rounds:buildRounds(n), i:0, mistakes:0, missThis:0, busy:false, startedAt:Date.now() };
  DB.nodes[no].plays++; save();
  $('playTitle').textContent = n.region;
  showScreen('playScreen');
  renderRound();
}
function quitNode(){ WLAudio.stop(); teardownTrace(); toMap() }
function toMap(){ WLAudio.stop(); renderMap(); showScreen('mapScreen') }

function renderRound(){
  const r = run.rounds[run.i];
  run.missThis = 0; run.busy = false;
  teardownTrace();
  $('pips').innerHTML = run.rounds.map((_,i)=>
    `<div class="pip${i<run.i?' done':i===run.i?' now':''}"></div>`).join('');
  $('progTxt').textContent = `Activity ${run.i+1} of ${run.rounds.length}`;
  ENG[r.type](r);
}
function inst(html){ $('instr').innerHTML = html }
function stage(stim, answers, single){
  $('playBody').innerHTML =
    `<div class="stage${single?' single':''}">
       <div class="stimulus">${stim||''}</div>
       <div class="answers">${answers||''}</div>
     </div>`;
}

function win(word){
  if(run.busy) return;
  run.busy = true;
  DB.nodes[run.node].correct++; save();
  const c = rnd(CHEERS);
  $('cheerE').textContent = c[0]; $('cheerT').textContent = c[1];
  $('cheerW').textContent = word ? String(word).toLowerCase() : '';
  $('cheer').classList.add('on');
  setTimeout(() => {
    $('cheer').classList.remove('on');
    run.i++;
    if(run.i >= run.rounds.length) finishNode(); else renderRound();
  }, 1250);
}
function miss(el){
  if(run.busy) return;
  run.mistakes++; run.missThis++;
  DB.nodes[run.node].wrong++; save();
  if(el){ el.classList.add('wrong'); setTimeout(()=>el.classList.remove('wrong'),450) }
  WLAudio.line(rnd(TRY_AGAIN), 0.85, 1.2);
  if(run.missThis>=2) document.querySelectorAll('.is-correct').forEach(e=>e.classList.add('nudge'));
}
function ans(el, ok, word){ ok ? win(word) : miss(el) }

function finishNode(){
  const n = NODES[run.node-1];
  const stars = run.mistakes===0 ? 3 : run.mistakes<=3 ? 2 : 1;
  const rec = DB.nodes[run.node];
  const first = rec.stars === 0;
  if(stars > rec.stars) rec.stars = stars;
  rec.timeMs += Date.now() - run.startedAt;
  save(); confetti();

  $('doneArt').textContent = n.art;
  $('doneTitle').textContent = first ? n.region + ' is safe!' : 'Nice one!';
  $('doneSub').innerHTML = first
    ? `You found <b>${n.letters.join(', ')}</b> for Zib.`
    : `You travelled through ${n.region} again.`;
  $('doneStars').textContent = '⭐'.repeat(stars) + '·'.repeat(3-stars);
  $('doneRewardK').textContent = first ? 'New chapter' : 'Chapter';
  $('doneReward').textContent = n.story.t;
  showScreen('doneScreen');
  WLAudio.line(first ? 'You did it! A new chapter for your storybook.' : 'Well done!', 0.8, 1.2);
}

/* ════════════════════════════════════════════════════════════
   THE FOURTEEN ACTIVITIES
   ════════════════════════════════════════════════════════════ */
const ENG = {

/* 1 · hear a sound, choose the letter */
sound(r){
  inst(`Which letter says <b>${r.sound}</b>?`);
  stage(
    `<div class="say-card">
       <button class="say-btn" onclick="WLAudio.sound('${r.answer}')" aria-label="Hear the sound">🔊</button>
       <p class="say-hint">${r.sound} … like <b>${r.key.w.toLowerCase()}</b> ${r.key.e}</p>
     </div>`,
    `<div class="row">${r.opts.map((l,i)=>
      `<button class="letter-btn${l===r.answer?' is-correct':''}" style="background:${col(i+2)}"
        onclick="ans(this,${l===r.answer},'${l}')">${l.toLowerCase()}</button>`).join('')}</div>`);
  setTimeout(()=>WLAudio.sound(r.answer), 320);
},

/* 2 · look at a picture, choose its first letter */
beginSound(r){
  inst('Which letter does it start with?');
  stage(
    `<div class="say-card">
       <div class="big-pic" onclick="WLAudio.word('${r.target.w}')">${r.target.e}</div>
       <p class="say-hint"><b>${r.target.w.toLowerCase()}</b></p>
     </div>`,
    `<div class="row">${r.opts.map((l,i)=>
      `<button class="letter-btn${l===r.answer?' is-correct':''}" style="background:${col(i+1)}"
        onclick="ans(this,${l===r.answer},'${l}')">${l.toLowerCase()}</button>`).join('')}</div>`);
  setTimeout(()=>WLAudio.word(r.target.w), 320);
},

/* 3 · hear a letter, choose the picture */
starts(r){
  inst(`Which one starts with <b>${r.letter.toLowerCase()}</b>?`);
  stage(
    `<div class="say-card">
       <button class="say-btn letter" onclick="WLAudio.sound('${r.letter}')">${r.letter.toLowerCase()}</button>
       <p class="say-hint">says <b>${SOUND[r.letter]||''}</b></p>
     </div>`,
    `<div class="grid2">${r.opts.map(v=>
      `<div class="pic-card${v.w===r.answer?' is-correct':''}" role="button" tabindex="0"
        onclick="picTap(this,'${v.w}','${r.answer}')">
        <div class="e">${v.e}</div><div class="w">${v.w.toLowerCase()}</div></div>`).join('')}</div>`);
  setTimeout(()=>WLAudio.sound(r.letter), 320);
},

/* 4 · tap every picture that begins with the letter  (Worksheet 1) */
tapAll(r){
  window._tapAll = { left: r.correct.slice() };
  inst(`Tap <b>all</b> the pictures that start with <b>${r.letter.toLowerCase()}</b>`);
  stage(
    `<div class="say-card">
       <button class="say-btn letter" onclick="WLAudio.sound('${r.letter}')">${r.letter.toLowerCase()}</button>
       <p class="say-hint">find <b>${r.correct.length}</b> of them</p>
     </div>`,
    `<div class="grid3">${r.opts.map(v=>
      `<div class="pic-card${r.correct.includes(v.w)?' is-correct':''}" role="button" tabindex="0"
        onclick="tapAllTap(this,'${v.w}')"><div class="e">${v.e}</div><div class="w">${v.w.toLowerCase()}</div></div>`).join('')}</div>`);
  setTimeout(()=>WLAudio.sound(r.letter), 320);
},

/* 5 · hear a word, find the picture */
listen(r){
  inst('Which picture is it?');
  stage(
    `<div class="say-card">
       <button class="say-btn" onclick="WLAudio.word('${r.target.w}')" aria-label="Hear the word">🔊</button>
       <p class="say-hint">tap to hear it again</p>
     </div>`,
    `<div class="grid2">${r.opts.map(v=>
      `<div class="pic-card blank${v.w===r.answer?' is-correct':''}" role="button" tabindex="0"
        onclick="picTap(this,'${v.w}','${r.answer}')"><div class="e">${v.e}</div><div class="w">${v.w.toLowerCase()}</div></div>`).join('')}</div>`);
  setTimeout(()=>WLAudio.word(r.target.w), 320);
},

/* 6 · join each letter to a picture  (Worksheet 1, question 2) */
match(r){
  window._match = { picked:null, left:r.pairs.length };
  inst('Tap a letter, then tap its picture');
  const letters = r.order.map(L =>
    `<div class="match-item" role="button" tabindex="0" data-l="${L}" onclick="matchTapLetter(this,'${L}')">${L.toLowerCase()}</div>`).join('');
  const pics = shuffle(r.pairs).map(p =>
    `<div class="match-item pic" role="button" tabindex="0" data-l="${p.l}" onclick="matchTapPic(this,'${p.l}','${p.pic.w}')">${p.pic.e}</div>`).join('');
  stage('', `<div class="match-wrap"><div class="match-col">${letters}</div><div class="match-col">${pics}</div></div>`, true);
},

/* 7 · find the letter in every shape it takes  (Find stage) */
hunt(r){
  window._hunt = { left: r.cells.filter(c=>c.ok).length };
  inst(`Find every <b>${r.letter.toLowerCase()}</b> — big and small`);
  stage(
    `<div class="say-card">
       <button class="say-btn letter" onclick="WLAudio.sound('${r.letter}')">${r.letter.toLowerCase()}</button>
       <p class="say-hint">there are <b>${window._hunt.left}</b> to find</p>
     </div>`,
    `<div class="hunt-grid">${r.cells.map((c,i)=>
      `<div class="hunt-cell ${c.font}${c.ok?' is-correct':''}" role="button" tabindex="0"
        onclick="huntTap(this,${c.ok})">${c.ch}</div>`).join('')}</div>`);
},

/* 8 · small letter, big letter */
caseMatch(r){
  inst('Which one is the big letter?');
  stage(
    `<div class="say-card">
       <div class="big-pic glyph" onclick="WLAudio.sound('${r.answer}')">${r.lower}</div>
       <p class="say-hint">this is the small <b>${r.lower}</b></p>
     </div>`,
    `<div class="row">${r.opts.map((l,i)=>
      `<button class="letter-btn${l===r.answer?' is-correct':''}" style="background:${col(i+4)}"
        onclick="ans(this,${l===r.answer},'${l}')">${l}</button>`).join('')}</div>`);
},

/* 9 · add the first letter and read the word  (Worksheet 3) */
initial(r){
  const rest = r.target.w.slice(1);
  inst('Which letter is missing?');
  stage(
    `<div class="say-card">
       <div class="big-pic" onclick="WLAudio.word('${r.target.w}')">${r.target.e}</div>
       <div class="slots" style="margin:10px 0 0">
         <div class="slot active">?</div>
         ${rest.split('').map(l=>`<div class="slot fixed">${l.toLowerCase()}</div>`).join('')}
       </div>
     </div>`,
    `<div class="row">${r.opts.map((l,i)=>
      `<button class="letter-btn${l===r.answer?' is-correct':''}" style="background:${col(i+3)}"
        onclick="ans(this,${l===r.answer},'${r.target.w}')">${l.toLowerCase()}</button>`).join('')}</div>`);
  setTimeout(()=>WLAudio.word(r.target.w), 320);
},

/* 10 · sound it out, then choose the word */
blend(r){
  const ls = r.target.w.split('');
  inst('Sound it out, then pick the word');
  stage(
    `<div class="blend-row" id="blendRow">${ls.map((l,i)=>`<div class="blend-l" id="bl${i}">${l.toLowerCase()}</div>`).join('')}</div>
     <button class="sound-btn" id="blendBtn" onclick="blendGo('${r.target.w}')">🔊 Sound it out</button>`,
    `<div class="row" id="blendOpts" style="opacity:.35;pointer-events:none">${r.opts.map((w,i)=>
      `<button class="word-btn${w.w===r.answer?' is-correct':''}" style="background:${col(i+1)}"
        onclick="ans(this,${w.w===r.answer},'${w.w}')">${w.w.toLowerCase()}</button>`).join('')}</div>`);
  setTimeout(()=>blendGo(r.target.w), 380);
},

/* 11 · build the word */
spell(r){
  window._spell = { word:r.answer, at:0 };
  inst(`Spell <b>${r.target.w.toLowerCase()}</b>`);
  stage(
    `<div class="say-card">
       <div class="big-pic" onclick="WLAudio.word('${r.answer}')">${r.target.e}</div>
       <p class="say-hint">${r.target.h||''}</p>
     </div>`,
    `<div class="slots" id="spellSlots">${r.answer.split('').map((l,i)=>
      `<div class="slot${i===0?' active':''}" id="sl${i}"></div>`).join('')}</div>
     <div class="row">${r.tiles.map((l,i)=>
      `<button class="letter-btn" data-l="${l}" style="background:${col(i)}" onclick="spellTap(this,'${l}')">${l.toLowerCase()}</button>`).join('')}</div>`);
  setTimeout(()=>WLAudio.word(r.answer), 320);
  markSpellTarget();
},

/* 12 · which word rhymes? */
rhyme(r){
  inst(`Which one rhymes with <b>${r.target.w.toLowerCase()}</b>?`);
  stage(
    `<div class="say-card">
       <div class="big-pic" onclick="WLAudio.word('${r.target.w}')">${r.target.e}</div>
       <p class="say-hint"><b>${r.target.w.toLowerCase()}</b></p>
     </div>`,
    `<div class="grid3">${r.opts.map(v=>
      `<div class="pic-card${v.w===r.answer?' is-correct':''}" role="button" tabindex="0"
        onclick="picTap(this,'${v.w}','${r.answer}')">
        <div class="e">${v.e}</div><div class="w">${v.w.toLowerCase()}</div></div>`).join('')}</div>`);
  setTimeout(()=>WLAudio.word(r.target.w), 320);
},

/* 13 · high-frequency word */
sight(r){
  inst('Find this word');
  stage(
    `<div class="flash">
       <div class="w" onclick="WLAudio.word('${r.answer}')">${r.answer.toLowerCase()}</div>
       <div class="s">${r.target.s||''}</div>
     </div>
     <button class="sound-btn" onclick="WLAudio.line('${esc(r.target.s||r.answer)}',0.6,1.15)">🔊 Hear the sentence</button>`,
    `<div class="row">${r.opts.map((w,i)=>
      `<button class="word-btn${w===r.answer?' is-correct':''}" style="background:${col(i+4)}"
        onclick="ans(this,${w===r.answer},'${w}')">${w.toLowerCase()}</button>`).join('')}</div>`);
  setTimeout(()=>WLAudio.word(r.answer), 320);
},

/* 14 · trace the letter with your finger */
trace(r){
  const shown = r.upper ? r.letter.toUpperCase() : r.letter.toLowerCase();
  inst(`Trace the letter <b>${shown}</b> with your finger`);
  stage(
    `<div class="say-card">
       <button class="say-btn letter" onclick="WLAudio.sound('${r.letter}')">${shown}</button>
       <p class="say-hint">${r.upper?'the big':'the small'} <b>${shown}</b> · says <b>${SOUND[r.letter]||''}</b></p>
     </div>`,
    `<div class="trace-card">
       <canvas id="traceCanvas" class="trace-canvas"></canvas>
       <div class="trace-tools">
         <button class="tool-btn" onclick="traceClear()">↺ Start again</button>
         <button class="tool-btn done" onclick="traceCheck()">I'm done ✓</button>
       </div>
       <div class="trace-score" id="traceScore">Start at the dot and follow the grey letter</div>
     </div>`);
  setupTrace(shown);
  setTimeout(()=>WLAudio.sound(r.letter), 320);
}
};

/* ── shared handlers ─────────────────────────────────────── */
function picTap(el, word, answer){ WLAudio.word(word); ans(el, word===answer, word) }

function tapAllTap(el, word){
  const s = window._tapAll; if(!s || run.busy) return;
  WLAudio.word(word);
  const i = s.left.indexOf(word);
  if(i >= 0){
    s.left.splice(i,1);
    el.classList.add('right'); el.style.pointerEvents='none';
    run.missThis = 0;
    if(!s.left.length) setTimeout(()=>win(''), 350);
  } else {
    miss(el);
  }
}

function matchTapLetter(el, L){
  const s = window._match; if(!s || run.busy || el.classList.contains('done')) return;
  document.querySelectorAll('.match-item.picked').forEach(e=>e.classList.remove('picked'));
  el.classList.add('picked');
  s.picked = L;
  WLAudio.sound(L);
}
function matchTapPic(el, L, word){
  const s = window._match; if(!s || run.busy || el.classList.contains('done')) return;
  WLAudio.word(word);
  if(!s.picked){ el.classList.add('picked'); setTimeout(()=>el.classList.remove('picked'),350); return }
  if(s.picked === L){
    el.classList.remove('picked'); el.classList.add('done');
    const lt = document.querySelector(`.match-item[data-l="${L}"]:not(.pic)`);
    if(lt){ lt.classList.remove('picked'); lt.classList.add('done') }
    s.picked = null; s.left--; run.missThis = 0;
    if(s.left <= 0) setTimeout(()=>win(''), 400);
  } else {
    miss(el);
    document.querySelectorAll('.match-item.picked').forEach(e=>e.classList.remove('picked'));
    s.picked = null;
  }
}

function huntTap(el, ok){
  const s = window._hunt; if(!s || run.busy || el.classList.contains('got')) return;
  if(ok){
    el.classList.add('got'); s.left--; run.missThis = 0;
    if(s.left <= 0) setTimeout(()=>win(''), 350);
  } else {
    miss(el);
  }
}

function blendGo(word){
  const ls = word.split('');
  const btn = $('blendBtn'); if(btn) btn.disabled = true;
  ls.forEach((l,i) => setTimeout(() => {
    const e = $('bl'+i); if(e){ e.classList.add('on'); WLAudio.sound(l) }
  }, i*780));
  setTimeout(() => {
    ls.forEach((l,i) => { const e=$('bl'+i); if(e) e.classList.add('all') });
    WLAudio.word(word);
    const o = $('blendOpts'); if(o){ o.style.opacity='1'; o.style.pointerEvents='auto' }
    const b = $('blendBtn'); if(b){ b.disabled = false; b.textContent = '🔊 Again' }
  }, ls.length*780 + 250);
}

function markSpellTarget(){
  const s = window._spell; if(!s) return;
  document.querySelectorAll('#playBody .letter-btn').forEach(b=>b.classList.remove('is-correct'));
  const want = s.word[s.at];
  let marked = false;
  document.querySelectorAll('#playBody .letter-btn').forEach(b => {
    if(!marked && !b.classList.contains('used') && b.dataset.l === want){ b.classList.add('is-correct'); marked = true }
  });
}
function spellTap(el, letter){
  const s = window._spell; if(!s || run.busy) return;
  if(letter === s.word[s.at]){
    const slot = $('sl'+s.at);
    slot.textContent = letter.toLowerCase();
    slot.classList.remove('active'); slot.classList.add('filled');
    el.classList.add('used');
    WLAudio.sound(letter);
    s.at++; run.missThis = 0;
    if(s.at >= s.word.length){ setTimeout(()=>{ WLAudio.word(s.word); win(s.word) }, 450) }
    else { const nx = $('sl'+s.at); if(nx) nx.classList.add('active'); markSpellTarget() }
  } else {
    const sl = $('spellSlots'); if(sl){ sl.classList.add('shake'); setTimeout(()=>sl.classList.remove('shake'),450) }
    miss(el); markSpellTarget();
    if(run.missThis>=2) document.querySelectorAll('#playBody .letter-btn.is-correct').forEach(b=>b.classList.add('nudge'));
  }
}

/* ════════════════════════════════════════════════════════════
   TRACING  —  finger writing on the canvas
   ════════════════════════════════════════════════════════════ */
let T = null;          // the current tracing session
let traceToken = 0;    // guards against a late setup landing after we've moved on

function traceSize(){
  const landscape = window.innerWidth > window.innerHeight && window.innerWidth >= 760;
  if(landscape) return Math.min(380, Math.max(260, Math.floor(window.innerHeight * 0.52)));
  return Math.min(320, Math.max(220, window.innerWidth - 90));
}

async function setupTrace(letter){
  const mine = ++traceToken;
  const canvas = $('traceCanvas'); if(!canvas) return;
  const size = traceSize();
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';
  canvas.width = Math.floor(size * dpr);
  canvas.height = Math.floor(size * dpr);

  const ctx = canvas.getContext('2d');
  if(!ctx){                                    // no canvas (rare) — don't block the child
    $('traceScore').textContent = 'Tracing needs a touch screen. Tap "I\'m done" to carry on.';
    T = { broken:true };
    return;
  }
  ctx.scale(dpr, dpr);

  // The literacy typeface must be ready before we measure the letter.
  try { if(document.fonts && document.fonts.load){ await document.fonts.load('700 200px Andika'); await document.fonts.ready } } catch(e){}
  if(mine !== traceToken) return;          // the child has already moved on

  const pad = size * 0.12;
  let fs = size * 0.62;
  const font = w => `700 ${w}px Andika, 'Comic Sans MS', sans-serif`;
  ctx.font = font(fs);
  let m = ctx.measureText(letter);
  const gh = (m.actualBoundingBoxAscent||fs*.7) + (m.actualBoundingBoxDescent||0);
  if(gh > 0) fs = Math.min(size*0.8, fs * ((size - pad*2) / gh));
  ctx.font = font(fs);
  m = ctx.measureText(letter);
  const asc = m.actualBoundingBoxAscent || fs*0.7;
  const desc = m.actualBoundingBoxDescent || 0;
  const baseline = size/2 + (asc - (asc+desc)/2);

  // x-height line, for the dashed guide
  ctx.font = font(fs);
  const xm = ctx.measureText('x');
  const xh = xm.actualBoundingBoxAscent || fs*0.45;

  const tol = Math.max(18, size * 0.085);      // how far off the line is still fine
  const ink = document.createElement('canvas'); ink.width = canvas.width; ink.height = canvas.height;
  const ictx = ink.getContext('2d'); ictx.scale(dpr, dpr);
  ictx.lineWidth = Math.max(16, size*0.065);
  ictx.lineCap = 'round'; ictx.lineJoin = 'round'; ictx.strokeStyle = '#5B4A8A';

  // masks, at CSS resolution — plenty accurate and quick to read back
  const mk = (widen) => {
    const c = document.createElement('canvas'); c.width = size; c.height = size;
    const x = c.getContext('2d');
    x.font = font(fs); x.textAlign = 'center'; x.textBaseline = 'alphabetic';
    if(widen){ x.lineWidth = tol*2; x.lineJoin='round'; x.strokeStyle='#000'; x.strokeText(letter, size/2, baseline) }
    x.fillStyle = '#000'; x.fillText(letter, size/2, baseline);
    return x.getImageData(0,0,size,size).data;
  };
  const glyph = mk(false), zone = mk(true);

  T = { canvas, ctx, ink, ictx, size, dpr, letter, fs, baseline, xh, tol, glyph, zone,
        font, drawing:false, last:null, marks:0, fails:0, broken:false };

  drawTraceGuide();
  bindTrace();
}

function drawTraceGuide(){
  if(!T || T.broken) return;
  const { ctx, size, letter, baseline, xh, font, fs } = T;
  ctx.clearRect(0,0,size,size);
  ctx.fillStyle = '#FCFAFF'; ctx.fillRect(0,0,size,size);

  // handwriting lines, like the worksheet
  ctx.strokeStyle = '#E3DAF3'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(size*0.06, baseline); ctx.lineTo(size*0.94, baseline); ctx.stroke();
  ctx.setLineDash([7,8]); ctx.strokeStyle = '#EDE6F8';
  ctx.beginPath(); ctx.moveTo(size*0.06, baseline-xh); ctx.lineTo(size*0.94, baseline-xh); ctx.stroke();
  ctx.setLineDash([]);

  // the letter to follow
  ctx.font = font(fs); ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#E6DFF4';
  ctx.fillText(letter, size/2, baseline);
  ctx.lineWidth = 2; ctx.strokeStyle = '#CFC2E8'; ctx.setLineDash([6,7]);
  ctx.strokeText(letter, size/2, baseline);
  ctx.setLineDash([]);

  // where to begin
  const m = ctx.measureText(letter);
  const startX = size/2 - (m.actualBoundingBoxLeft || m.width/2) + T.size*0.03;
  const startY = baseline - (m.actualBoundingBoxAscent || T.fs*0.7) + 6;
  ctx.beginPath(); ctx.arc(startX, startY, 8, 0, Math.PI*2);
  ctx.fillStyle = '#F0B429'; ctx.fill();
  ctx.lineWidth = 3; ctx.strokeStyle = '#fff'; ctx.stroke();

  ctx.drawImage(T.ink, 0, 0, T.size, T.size);
}

function bindTrace(){
  if(!T || T.broken) return;
  const c = T.canvas;
  const pos = e => {
    const r = c.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    return { x: (p.clientX - r.left) * (T.size / r.width), y: (p.clientY - r.top) * (T.size / r.height) };
  };
  T.onDown = e => { e.preventDefault(); T.drawing = true; T.last = pos(e);
    T.ictx.beginPath(); T.ictx.moveTo(T.last.x, T.last.y); T.ictx.lineTo(T.last.x+.1, T.last.y+.1); T.ictx.stroke();
    T.marks++; drawTraceGuide(); };
  T.onMove = e => { if(!T.drawing) return; e.preventDefault();
    const p = pos(e);
    T.ictx.beginPath(); T.ictx.moveTo(T.last.x, T.last.y); T.ictx.lineTo(p.x, p.y); T.ictx.stroke();
    T.last = p; T.marks++; drawTraceGuide(); };
  T.onUp = () => { T.drawing = false; T.last = null };

  if(window.PointerEvent){
    c.addEventListener('pointerdown', T.onDown, { passive:false });
    c.addEventListener('pointermove', T.onMove, { passive:false });
    c.addEventListener('pointercancel', T.onUp);
    window.addEventListener('pointerup', T.onUp);
    T.bound = 'pointer';
  } else {                                   // older iPadOS
    c.addEventListener('touchstart', T.onDown, { passive:false });
    c.addEventListener('touchmove', T.onMove, { passive:false });
    window.addEventListener('touchend', T.onUp);
    T.bound = 'touch';
  }
}
function teardownTrace(){
  traceToken++;
  if(T && !T.broken && T.canvas){
    if(T.bound === 'pointer'){
      T.canvas.removeEventListener('pointerdown', T.onDown);
      T.canvas.removeEventListener('pointermove', T.onMove);
      T.canvas.removeEventListener('pointercancel', T.onUp);
      window.removeEventListener('pointerup', T.onUp);
    } else if(T.bound === 'touch'){
      T.canvas.removeEventListener('touchstart', T.onDown);
      T.canvas.removeEventListener('touchmove', T.onMove);
      window.removeEventListener('touchend', T.onUp);
    }
  }
  T = null;
}
function traceClear(){
  if(!T || T.broken) return;
  T.ictx.clearRect(0,0,T.size,T.size);
  T.marks = 0;
  drawTraceGuide();
  const s = $('traceScore'); if(s) s.textContent = 'Start at the dot and follow the grey letter';
}

/* how much of the letter did they cover, and how much of their
   drawing stayed on it? Both are deliberately forgiving. */
function traceScore(){
  const { ink, size, dpr, glyph, zone } = T;
  const tmp = document.createElement('canvas'); tmp.width = size; tmp.height = size;
  const tx = tmp.getContext('2d');
  tx.drawImage(ink, 0, 0, size, size);
  const drawn = tx.getImageData(0,0,size,size).data;

  let need = 0, met = 0, mine = 0, on = 0;
  const step = 3;
  for(let y=0; y<size; y+=step){
    for(let x=0; x<size; x+=step){
      const i = (y*size + x) * 4 + 3;
      if(glyph[i] > 60){ need++; if(drawn[i] > 40) met++ }
      if(drawn[i] > 60){ mine++; if(zone[i] > 30) on++ }
    }
  }
  return { covered: need ? met/need : 0, neat: mine ? on/mine : 0, ink: mine };
}

function traceCheck(){
  if(!T){ return }
  if(T.broken){ win(''); return }
  const s = traceScore();
  const box = $('traceScore');
  if(s.ink < 40){
    if(box) box.textContent = 'Draw on the letter with your finger';
    return;
  }
  const good = s.covered >= 0.55 && s.neat >= 0.45;
  if(good){
    if(box) box.textContent = s.covered > 0.8 ? 'Beautiful letter! ⭐' : 'That is a good letter ⭐';
    setTimeout(()=>win(T.letter), 450);
    return;
  }
  T.fails++;
  if(T.fails >= 2){                    // never let a wobbly line stop the journey
    if(box) box.textContent = 'Good try! Keep going 💪';
    miss(null);
    setTimeout(()=>win(T.letter), 700);
    return;
  }
  miss(null);
  if(box) box.textContent = s.covered < 0.4 ? 'Try to cover the whole letter' : 'Nearly! Stay on the grey line';
  setTimeout(traceClear, 900);
}

/* ════════════════════════════════════════════════════════════
   STORY
   ════════════════════════════════════════════════════════════ */
let storyFrom = 'map';
function readStory(no, from){
  storyFrom = from || 'map';
  const n = NODES[no-1];
  const lines = n.story.lines.map(l =>
    l.replace(/\*([^*]+)\*/g, (m,w) =>
      `<span class="hl" onclick="WLAudio.word('${esc(w.replace(/[^A-Za-z-]/g,''))}')">${w}</span>`));
  $('storyCard').innerHTML = `
    <div class="page">Chapter ${no} of ${NODES.length} · ${n.region}</div>
    <div class="art">${n.story.art}</div>
    <h2>${n.story.t}</h2>
    ${lines.map(l=>`<p>${l}</p>`).join('')}
    <button class="read-btn" onclick="readAloud(${no})">🔊 Read it to me</button>`;
  $('storyNext').textContent = storyFrom==='shelf' ? 'Back to my storybook' : 'Back to the map';
  showScreen('storyScreen');
}
function readAloud(no){
  const n = NODES[no-1];
  WLAudio.chapter(no, n.story.lines.map(l=>l.replace(/\*/g,'')).join(' '));
}
function storyBack(){ WLAudio.stop(); storyFrom==='shelf' ? openShelf() : toMap() }

function openShelf(){
  const c = storyCount();
  $('shelfSub').textContent = c===0
    ? 'No chapters yet — finish Mossy Meadow to win the first one.'
    : `${c} of ${NODES.length} chapters collected`;
  $('shelfGrid').innerHTML = NODES.map(n => isDone(n.no)
    ? `<div class="shelf-card" role="button" tabindex="0" onclick="readStory(${n.no},'shelf')">
         <div class="e">${n.story.art}</div><div class="t">${n.story.t}</div><div class="p">Chapter ${n.no}</div></div>`
    : `<div class="shelf-card locked"><div class="e">🔒</div><div class="t">${n.region}</div><div class="p">Chapter ${n.no}</div></div>`
  ).join('');
  showScreen('shelfScreen');
}

/* ════════════════════════════════════════════════════════════
   GROWN-UPS
   ════════════════════════════════════════════════════════════ */
let gateAnswer = 0, gateThen = null;
function askGrownUp(then){
  const a = 4 + Math.floor(Math.random()*7), b = 3 + Math.floor(Math.random()*7);
  gateAnswer = a + b; gateThen = then;
  $('gateQ').textContent = `What is ${a} + ${b}?`;
  $('gateIn').value = ''; $('gateMsg').textContent = '';
  $('gateBg').classList.add('open');
  setTimeout(()=>$('gateIn').focus(), 80);
}
function closeGate(){ $('gateBg').classList.remove('open') }
function submitGate(){
  if(parseInt($('gateIn').value,10) === gateAnswer){ closeGate(); if(gateThen) gateThen() }
  else { $('gateMsg').textContent = 'Not quite — try that sum again.'; $('gateIn').value = '' }
}

async function openDash(){
  showScreen('dashScreen');
  $('dashBody').innerHTML = `<div class="panel"><h3>Voice recordings</h3><p class="small">Checking…</p></div>`;
  const rep = await WLAudio.report();
  const pct = rep.total ? Math.round(rep.found/rep.total*100) : 0;
  const groups = ['sounds','words','story'];

  let html = `
    <div class="panel">
      <h3>Your recordings</h3>
      <div class="meter"><i style="width:${pct}%"></i></div>
      <p class="small"><b>${rep.found} of ${rep.total}</b> files found (${rep.source}).
         Anything missing is read by the computer voice, so the game always works.</p>
      <button class="tool-btn" style="margin-top:12px" onclick="recheckAudio()">Check for new recordings</button>
      ${groups.map(g=>{
        const rows = rep.rows.filter(r=>r.kind===g);
        return `<p class="small" style="margin-top:10px"><b>${g}</b> — ${rows.filter(r=>r.found).length}/${rows.length}
          <span style="color:#C4BAD6">· audio/wordland/${g}/</span></p>
          <div class="file-list">${rows.map(r=>`<span class="file-chip${r.found?' found':''}">${r.found?'✓':'·'} ${r.name}.mp3</span>`).join('')}</div>`;
      }).join('')}
    </div>

    <div class="panel">
      <div class="switch-row">
        <div class="mid"><b style="font-size:15px">Sound</b><div class="small">Turn all audio off</div></div>
        <div class="switch${WLAudio.isMuted()?'':' on'}" id="soundSwitch" role="button" tabindex="0" onclick="toggleSound()"><i></i></div>
      </div>
    </div>

    <div class="panel">
      <h3>Progress</h3>
      ${NODES.map(n=>{
        const d = DB.nodes[n.no];
        const total = d.correct + d.wrong;
        const acc = total ? Math.round(d.correct/total*100) : null;
        return `<p class="small" style="display:flex;gap:8px;align-items:center;padding:5px 0;border-bottom:1px solid var(--ghost)">
          <span style="width:22px">${n.art}</span>
          <b style="flex:1;color:var(--purple)">${n.region}</b>
          <span>${d.stars?'⭐'.repeat(d.stars):'—'}</span>
          <span style="width:64px;text-align:right">${acc!==null?acc+'% right':''}</span></p>`;
      }).join('')}
    </div>

    <button class="big-btn quiet" onclick="askGrownUp(doReset)">Start the journey over</button>`;
  $('dashBody').innerHTML = html;
}
async function recheckAudio(){
  await WLAudio.rescan();
  openDash();
}
function toggleSound(){
  const m = !WLAudio.isMuted();
  WLAudio.setMuted(m); DB.muted = m; save();
  const s = $('soundSwitch'); if(s) s.classList.toggle('on', !m);
}
function doReset(){ DB = freshDB(); save(); renderMap(); showScreen('mapScreen') }

/* ════════════════════════════════════════════════════════════
   START
   ════════════════════════════════════════════════════════════ */
function boot(){
  $('gateIn').addEventListener('keydown', e => { if(e.key==='Enter') submitGate() });
  $('sheetBg').addEventListener('click', e => { if(e.target === $('sheetBg')) closeSheet() });
  // iPad only lets sound start from a real tap — take the first one.
  const unlock = () => { WLAudio.unlock(); window.removeEventListener('pointerdown', unlock); window.removeEventListener('touchstart', unlock) };
  window.addEventListener('pointerdown', unlock);
  window.addEventListener('touchstart', unlock);
  // stop the two-finger / double-tap zoom that wrecks a drawing canvas
  document.addEventListener('gesturestart', e => e.preventDefault());
  window.addEventListener('orientationchange', () => setTimeout(() => { if(T && !T.broken) setupTrace(T.letter) }, 300));

  // Draw the map straight away; work out what's recorded in the background.
  load();
  WLAudio.init();
}
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
