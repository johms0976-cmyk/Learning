/* ============================================================
   WORD LAND · ENGINE
   Needs, in this order:
     writeit-letters.js   the letter shapes
     letter-pad.js        the writing pad
     wordland-data.js     the maps
     wordland-audio.js    recordings, with the computer voice behind
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
/* Each child keeps their own progress. The hub puts their player
   number on the end of the save key, so nothing here changes except
   where it is written. Opened on its own, with nobody chosen, the key
   stays bare and behaves exactly as it did before profiles existed. */
const PROF = (typeof Profiles !== 'undefined') ? Profiles : null;
const SAVE_KEY = PROF ? PROF.key('wordLand3') : 'wordLand3';
const OLD_KEY  = PROF ? PROF.key('wordLand2') : 'wordLand2';

function freshNode(){ return { stars:0, plays:0, correct:0, wrong:0, timeMs:0 } }
function freshDB(){ return { v:3, started:Date.now(), maps:{}, muted:false, unlockAll:false } }
let DB = freshDB();
let saveTimer = null;
function save(){ clearTimeout(saveTimer); saveTimer = setTimeout(()=>Store.set(SAVE_KEY, JSON.stringify(DB)), 160) }

/* every map keeps its own ten places */
function mapRec(mapNo){
  const k = String(mapNo);
  if(!DB.maps[k]) DB.maps[k] = { nodes:{} };
  return DB.maps[k];
}
function nodeRec(no, mapNo){
  const m = mapRec(mapNo || CURRENT_MAP.no);
  if(!m.nodes[no]) m.nodes[no] = freshNode();
  return m.nodes[no];
}

async function load(){
  try{
    const raw = await Store.get(SAVE_KEY);
    if(raw){
      const d = JSON.parse(raw);
      if(d && d.v===3 && d.maps) DB = d;
    } else {
      /* Map 1 progress from the earlier one-map version — keep it. */
      const old = await Store.get(OLD_KEY);
      if(old){
        const d = JSON.parse(old);
        if(d && d.nodes){
          DB = freshDB();
          DB.muted = !!d.muted; DB.unlockAll = !!d.unlockAll;
          mapRec(1).nodes = d.nodes;
          save();
        }
      }
    }
  }catch(e){}
  WLAudio.setMuted(!!DB.muted);
  openMaps();
}

/* ── what is finished, what is open ──────────────────────── */
function isDone(no){ const r = mapRec(CURRENT_MAP.no).nodes[no]; return !!(r && r.stars > 0) }
function unlocked(no){ return DB.unlockAll || no===1 || isDone(no-1) }
function storyCount(){ return NODES.filter(n=>isDone(n.no)).length }

function mapPlayable(m){ return !!(m.nodes && m.nodes.length) }
function mapStarsDone(m){
  if(!mapPlayable(m)) return 0;
  const rec = mapRec(m.no).nodes;
  return m.nodes.filter(n => rec[n.no] && rec[n.no].stars > 0).length;
}
function mapFinished(m){ return mapPlayable(m) && mapStarsDone(m) === m.nodes.length }
function mapUnlocked(m){
  if(DB.unlockAll) return true;
  if(m.no === 1) return true;
  const prev = MAPS.find(x => x.no === m.no - 1);
  return !!(prev && mapFinished(prev));
}

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
   CHOOSING A MAP
   ════════════════════════════════════════════════════════════ */
function openMaps(){
  WLAudio.stop();
  const total = MAPS.filter(mapPlayable).reduce((a,m)=>a+mapStarsDone(m),0);
  const built = MAPS.filter(mapPlayable).reduce((a,m)=>a+m.nodes.length,0);
  $('mapsSub').textContent = total === 0
    ? 'Twelve maps. Start at the first one.'
    : `${total} of ${built} places finished`;

  $('mapsGrid').innerHTML = MAPS.map(m => {
    const playable = mapPlayable(m), open = mapUnlocked(m);
    const done = mapStarsDone(m), all = playable ? m.nodes.length : 10;
    const state = !playable ? 'soon' : !open ? 'locked' : mapFinished(m) ? 'done' : 'open';
    const dots = playable
      ? `<div class="map-dots">${m.nodes.map(n =>
          `<i class="${mapRec(m.no).nodes[n.no] && mapRec(m.no).nodes[n.no].stars ? 'on':''}"></i>`).join('')}</div>`
      : `<div class="map-dots">${'<i class="ghost"></i>'.repeat(10)}</div>`;

    const tag = state==='soon'   ? '<span class="map-state soon">Not built yet</span>'
              : state==='locked' ? '<span class="map-state locked">🔒 Finish map ' + (m.no-1) + '</span>'
              : state==='done'   ? '<span class="map-state done">✓ All ten places</span>'
              : `<span class="map-state open">${done} of ${all} places</span>`;

    const go = state==='open' ? (done ? 'Keep going →' : 'Start →')
             : state==='done' ? 'Play again →' : '';

    return `<div class="map-card ${state}" ${state==='open'||state==='done'
        ? `role="button" tabindex="0" onclick="chooseMap(${m.no})" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();chooseMap(${m.no})}"`
        : ''}>
      <div class="map-art" style="background:${m.grad}">
        ${state==='locked' ? '🔒' : m.art}<span class="map-no">${m.no}</span>
      </div>
      <div class="map-body">
        <span class="map-eyebrow">${m.level} · ${m.lessons}</span>
        <h3>${m.name}</h3>
        <div class="map-focus"><i>${m.focus}</i>${m.extra?`<em>${m.extra}</em>`:''}</div>
        ${dots}
        ${tag}
      </div>
      ${go?`<div class="map-go">${go}</div>`:''}
    </div>`;
  }).join('');
  showScreen('mapsScreen');
}

function chooseMap(no){
  const m = useMap(no);
  if(!m) return;
  mapRec(no);
  WLAudio.preloadMap(m);
  renderTrail();
  showScreen('mapScreen');
}

/* ════════════════════════════════════════════════════════════
   THE TRAIL WITHIN ONE MAP
   ════════════════════════════════════════════════════════════ */
const OFFSETS = [0,42,-30,36,-40,26,-36,40,-18,0];

function renderTrail(){
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
    node.style.setProperty('--off', OFFSETS[i % OFFSETS.length]);
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
    const rec = mapRec(CURRENT_MAP.no).nodes[n.no];
    st.textContent = done ? '⭐'.repeat(rec.stars) + '·'.repeat(3-rec.stars) : '';
    node.appendChild(st);
    el.appendChild(node);
  });

  const c = storyCount();
  $('mapTitle').textContent = CURRENT_MAP.name;
  $('bookCount').textContent = c + ' of ' + NODES.length + ' story pages';
  $('mapSub').textContent = c===0 ? 'Help Zib carry the letters home'
    : c===NODES.length ? 'Every letter is home. You did it!'
    : 'Letters found: ' + NODES.slice(0,c).flatMap(n=>n.letters).filter((v,i,a)=>a.indexOf(v)===i).join(' ');
  $('mapFoot').textContent = CURRENT_MAP.lessons + ' · ' + CURRENT_MAP.level;
}
/* kept so old links and buttons still work */
function renderMap(){ renderTrail() }

/* ── the card that opens when you tap a place ────────────── */
function openSheet(no){
  const n = NODES[no-1], s = nodeRec(no);
  WLAudio.preloadNode(n);

  let learn = '<div class="lbl">In this place you will learn</div><div class="learn-row">';
  learn += n.letters.map(l=>`<span class="tag snd">${l.toLowerCase()} · ${SOUND[l]||''}</span>`).join('');
  learn += '</div>';
  if(n.words.length) learn += '<div class="learn-row">' + n.words.slice(0,6).map(w=>`<span class="tag">${w.w.toLowerCase()}</span>`).join('') + '</div>';
  if(n.hfw.length)   learn += '<div class="learn-row">' + n.hfw.map(h=>`<span class="tag hf">${h.w.toLowerCase()}</span>`).join('') + '</div>';

  $('sheet').innerHTML = `
    <div class="grab"></div>
    <div class="sheet-top">
      <div class="badge" style="background:${n.grad}">${n.art}</div>
      <div><div class="eyebrow">Place ${n.no} · Lesson ${n.lesson || ((CURRENT_MAP.no-1)*10 + n.no)}</div><h2>${n.region}</h2></div>
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
   BUILDING A PLACE'S ACTIVITIES
   ════════════════════════════════════════════════════════════ */
function picsStartingWith(L, node){
  const mine = node.vocab.filter(v => v.w[0]===L);
  return mine.length >= 3 ? mine : ALL_PICS.filter(v => v.w[0]===L);
}

/* the shared ending of a word family: bat/cat/hat -> "at" */
function rimeOf(family){
  if(!family.length) return '';
  let r = family[0].w;
  family.forEach(v => { while(r && !v.w.toUpperCase().endsWith(r)) r = r.slice(1) });
  return r;
}

/* a sentence to build or read — from the place if it has any,
   otherwise put one together from the words it teaches */
function sentencesFor(n){
  if(n.sentences && n.sentences.length) return n.sentences;
  const pic = n.vocab.length ? rnd(n.vocab) : { w:'CAT', e:'🐱' };
  return [{ s:['I','CAN','SEE','A', pic.w], e:pic.e }];
}

function buildRounds(n){
  /* The first places of a map teach a sound and nothing else — no word
     family, no sight words yet. Borrow from later in the same map so a
     plan can name any activity without stopping the journey. */
  const famPool = n.family.length > 1 ? n.family
    : (NODES.find(x => x.family.length > 1) || { family:[] }).family;
  const hfwPool = n.hfw.length ? n.hfw
    : (NODES.find(x => x.hfw.length) || { hfw:[{ w:"I", s:"I am Sam." }] }).hfw;

  /* The letters of a place are listed oldest first, so the last single
     letter is the one this lesson actually introduces — that is the one
     worth writing. Both the small and the capital round use it, so a
     child meets the same letter twice. "ee" has no glyph of its own,
     hence the length check. */
  const writeLetter = [...n.letters].reverse()
      .find(l => l.length === 1 && LETTERFORMS[l.toLowerCase()]) || 'M';

  const used = { pic:[], word:[], hfw:[], letter:[], fam:[], sent:[] };
  const nextLetter = () => { const av=n.letters.filter(l=>!used.letter.includes(l)); const l=av.length?rnd(av):rnd(n.letters); used.letter.push(l); return l };
  const nextPic = () => { const av=n.vocab.filter(v=>!used.pic.includes(v.w)); const v=av.length?rnd(av):rnd(n.vocab); used.pic.push(v.w); return v };
  const nextWord = () => { const src = n.words.length ? n.words : (n.family.length ? n.family : n.vocab);
                           const av=src.filter(v=>!used.word.includes(v.w)); const v=av.length?rnd(av):rnd(src); used.word.push(v.w); return v };
  const nextHfw = () => { const av=hfwPool.filter(v=>!used.hfw.includes(v.w)); const v=av.length?rnd(av):rnd(hfwPool); used.hfw.push(v.w); return v };
  const nextSent = () => { const all=sentencesFor(n); const av=all.filter(s=>!used.sent.includes(s.s.join(' ')));
                           const s=av.length?rnd(av):rnd(all); used.sent.push(s.s.join(' ')); return s };
  const wrongLetters = (right,k) => shuffle([...(n.confuse||[]), ...LETTER_POOL].filter(x=>x!==right)).filter((v,i,a)=>a.indexOf(v)===i).slice(0,k);

  return n.plan.map(entry => {
    let [type, flavour] = String(entry).split(':');
    if(type === 'trace') type = 'write';                 // the old name still works

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
      const hits = 4 + Math.floor(Math.random()*2);
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
      const short = src.filter(v => v.w.length <= 5);
      if(short.length) src = short;
      const target = rnd(src);
      used.word.push(target.w); used.fam.push(target.w);
      const L = target.w[0];
      return { type, answer:L, target, opts:shuffle([L, ...wrongLetters(L,3)]) };
    }

    if(type==='blend'){
      const w = nextWord();
      const pool = [...n.words, ...n.family, ...NODES[NODES.length-1].words];
      const wrong = shuffle(pool.filter(x=>x.w!==w.w)).filter((v,i,a)=>a.findIndex(z=>z.w===v.w)===i).slice(0,2);
      return { type, answer:w.w, target:w, opts:shuffle([w,...wrong]) };
    }

    if(type==='spell'){
      const w = nextWord();
      const extra = shuffle(LETTER_POOL.filter(l=>!w.w.includes(l))).slice(0, w.w.length<3 ? 2 : 1);
      return { type, answer:w.w, target:w, tiles:shuffle([...w.w.split(''), ...extra]) };
    }

    if(type==='rhyme'){
      const fam = famPool;
      const target = rnd(fam);
      const right = rnd(fam.filter(v=>v.w!==target.w));
      const wrong = shuffle(ALL_PICS.filter(v => !fam.some(f=>f.w===v.w) && v.w!==target.w)).slice(0,2);
      return { type, answer:right.w, target, opts:shuffle([right,...wrong]) };
    }

    if(type==='sight'){
      const h = nextHfw();
      const pool = ["I","AM","AT","A","IT","IS","AN","MY","THE","SAT","SEE","CAN","MAN"].filter(x=>x!==h.w);
      return { type, answer:h.w, target:h, opts:shuffle([h.w, ...shuffle(pool).slice(0,2)]) };
    }

    /* ── the word-family machine (Worksheet 2) ────────────── */
    if(type==='machine'){
      const fam = famPool;
      const rime = rimeOf(fam) || fam[0].w.slice(1);
      const real = shuffle(fam).slice(0,4);
      const onsets = real.map(v => v.w[0]);
      const dud = shuffle(LETTER_POOL.filter(l => !fam.some(v => v.w[0]===l) && l!==rime[0].toUpperCase()))[0] || 'Z';
      return { type, rime, correct:real.map(v=>v.w), onsets:shuffle([...onsets, dud]) };
    }

    /* ── the alphabet snake (Worksheet 1) ─────────────────── */
    if(type==='alphabet'){
      const start = Math.floor(Math.random() * (ALPHABET.length - 5));
      const run = ALPHABET.slice(start, start + 5);
      const hideAt = 1 + Math.floor(Math.random()*3);
      const answer = run[hideAt].toUpperCase();
      const wrong = shuffle(ALPHABET.filter(l => !run.includes(l))).slice(0,2).map(l=>l.toUpperCase());
      return { type, run, hideAt, answer, opts:shuffle([answer, ...wrong]) };
    }

    /* ── build the sentence ───────────────────────────────── */
    if(type==='sentence'){
      const s = nextSent();
      return { type, words:s.s, pic:s.e, tiles:shuffle(s.s) };
    }

    /* ── one word is missing (Worksheet 3, question 2) ────── */
    if(type==='pickWord'){
      const s = nextSent();
      const at = s.s.length - 1;                       // the last word carries the meaning
      const answer = s.s[at];
      const near = [...n.family, ...n.words, ...n.vocab]
        .map(v => v.w)
        .filter(w => w !== answer && w.length === answer.length);
      const wrong = near.length ? rnd(near) : rnd(ALL_PICS.filter(v=>v.w!==answer)).w;
      return { type, words:s.s, at, answer, pic:s.e, opts:shuffle([answer, wrong]) };
    }

    /* ── read the whole line ──────────────────────────────── */
    if(type==='readLine'){
      const s = nextSent();
      const wrong = shuffle(ALL_PICS.filter(v => v.e !== s.e)).slice(0,2);
      const right = { w:s.s[s.s.length-1], e:s.e };
      return { type, words:s.s, answer:right.w, target:right, opts:shuffle([right, ...wrong]) };
    }

    /* ── write the letter, stroke by stroke ───────────────── */
    if(type==='write'){
      return { type, letter:writeLetter, upper: flavour==='u' };
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
  nodeRec(no).plays++; save();
  $('playTitle').textContent = n.region;
  showScreen('playScreen');
  renderRound();
}
function quitNode(){ WLAudio.stop(); closePad(); showScreen('mapScreen'); renderTrail() }
function toMap(){ WLAudio.stop(); closePad(); renderTrail(); showScreen('mapScreen') }

function renderRound(){
  const r = run.rounds[run.i];
  run.missThis = 0; run.busy = false;
  closePad();
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
  nodeRec(run.node).correct++; save();
  const c = rnd(CHEERS);
  $('cheerE').textContent = c[0]; $('cheerT').textContent = c[1];
  WLAudio.praise(c[1], 0.85, 1.2);      // "Nice one" — with the child's name now and then
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
  nodeRec(run.node).wrong++; save();
  if(el){ el.classList.add('wrong'); setTimeout(()=>el.classList.remove('wrong'),450) }
  WLAudio.line(rnd(TRY_AGAIN), 0.85, 1.2);
  if(run.missThis>=2) document.querySelectorAll('.is-correct').forEach(e=>e.classList.add('nudge'));
}
function ans(el, ok, word){ ok ? win(word) : miss(el) }

function finishNode(){
  const n = NODES[run.node-1];
  const stars = run.mistakes===0 ? 3 : run.mistakes<=3 ? 2 : 1;
  const rec = nodeRec(run.node);
  const first = rec.stars === 0;
  if(stars > rec.stars) rec.stars = stars;
  rec.timeMs += Date.now() - run.startedAt;
  save(); confetti();

  const justFinishedMap = first && mapFinished(CURRENT_MAP);
  const nextMap = MAPS.find(m => m.no === CURRENT_MAP.no + 1);

  $('doneArt').textContent = n.art;
  $('doneTitle').textContent = first ? n.region + ' is safe!' : 'Nice one!';
  $('doneSub').innerHTML = first
    ? `You found <b>${n.letters.join(', ')}</b> for Zib.`
    : `You travelled through ${n.region} again.`;
  $('doneStars').textContent = '⭐'.repeat(stars) + '·'.repeat(3-stars);
  $('doneRewardK').textContent = first ? 'New chapter' : 'Chapter';
  $('doneReward').textContent = n.story.t;

  $('doneExtra').innerHTML = justFinishedMap && nextMap
    ? `<div class="map-unlocked">🗝️ <b>${nextMap.name}</b> is open.<br>
       <span>${nextMap.lessons} · ${nextMap.focus}</span></div>`
    : '';
  showScreen('doneScreen');
  /* Finishing a place is the big moment, so this one always uses the
     name if there is a recording for it. */
  if(first){
    WLAudio.cheer('You did it', 0.8, 1.2);
    setTimeout(() => WLAudio.line('You did it! A new chapter for your storybook.', 0.8, 1.2), 1400);
  }else{
    WLAudio.cheer('Well done', 0.8, 1.2);
  }
}

/* ════════════════════════════════════════════════════════════
   THE ACTIVITIES
   ════════════════════════════════════════════════════════════ */
const ENG = {

/* hear a sound, choose the letter */
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

/* look at a picture, choose its first letter */
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

/* hear a letter, choose the picture */
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

/* tap every picture that begins with the letter (Worksheet 1) */
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

/* hear a word, find the picture */
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

/* join each letter to a picture (Worksheet 1, question 2) */
match(r){
  window._match = { picked:null, left:r.pairs.length };
  inst('Tap a letter, then tap its picture');
  const letters = r.order.map(L =>
    `<div class="match-item" role="button" tabindex="0" data-l="${L}" onclick="matchTapLetter(this,'${L}')">${L.toLowerCase()}</div>`).join('');
  const pics = shuffle(r.pairs).map(p =>
    `<div class="match-item pic" role="button" tabindex="0" data-l="${p.l}" onclick="matchTapPic(this,'${p.l}','${p.pic.w}')">${p.pic.e}</div>`).join('');
  stage('', `<div class="match-wrap"><div class="match-col">${letters}</div><div class="match-col">${pics}</div></div>`, true);
},

/* find the letter in every shape it takes */
hunt(r){
  window._hunt = { left: r.cells.filter(c=>c.ok).length };
  inst(`Find every <b>${r.letter.toLowerCase()}</b> — big and small`);
  stage(
    `<div class="say-card">
       <button class="say-btn letter" onclick="WLAudio.sound('${r.letter}')">${r.letter.toLowerCase()}</button>
       <p class="say-hint">there are <b>${window._hunt.left}</b> to find</p>
     </div>`,
    `<div class="hunt-grid">${r.cells.map(c=>
      `<div class="hunt-cell ${c.font}${c.ok?' is-correct':''}" role="button" tabindex="0"
        onclick="huntTap(this,${c.ok})">${c.ch}</div>`).join('')}</div>`);
},

/* small letter, big letter */
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

/* add the first letter and read the word (Worksheet 3) */
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

/* sound it out, then choose the word */
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

/* build the word */
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

/* which word rhymes? */
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

/* high-frequency word */
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

/* ── the word-family machine (Worksheet 2) ──────────────────
   Feed a letter into the -at machine and a word comes out. */
machine(r){
  window._machine = { left:r.correct.slice(), rime:r.rime };
  inst(`Make a word ending in <b>${r.rime.toLowerCase()}</b>`);
  stage(
    `<div class="machine">
       <div class="hopper" id="machineHopper">?</div>
       <div class="body"><span class="rime">${r.rime.toLowerCase()}</span></div>
       <div class="spout" id="machineOut"></div>
     </div>
     <p class="say-hint">tap a letter to drop it in — there are <b>${r.correct.length}</b> words</p>`,
    `<div class="row">${r.onsets.map((l,i)=>
      `<button class="letter-btn${r.correct.some(w=>w[0]===l)?' is-correct':''}" data-l="${l}"
        style="background:${col(i)}" onclick="machineTap(this,'${l}')">${l.toLowerCase()}</button>`).join('')}</div>`);
},

/* ── the alphabet snake (Worksheet 1) ─────────────────────── */
alphabet(r){
  inst('Which letter is missing?');
  stage(
    `<div class="snake">${r.run.map((l,i)=>
      i===r.hideAt ? `<div class="seg gap" id="snakeGap">?</div>`
                   : `<div class="seg">${l}</div>`).join('')}
     </div>
     <p class="say-hint">say the alphabet to help you</p>`,
    `<div class="row">${r.opts.map((l,i)=>
      `<button class="letter-btn${l===r.answer?' is-correct':''}" style="background:${col(i+2)}"
        onclick="alphabetTap(this,'${l}','${r.answer}')">${l.toLowerCase()}</button>`).join('')}</div>`);
},

/* ── build the sentence ───────────────────────────────────── */
sentence(r){
  window._sentence = { words:r.words, at:0 };
  inst('Put the words in order');
  stage(
    `<div class="say-card">
       <div class="big-pic" onclick="sentenceSay()">${r.pic}</div>
       <div class="line-slots" id="sentSlots">${r.words.map((w,i)=>
         `<div class="wslot${i===0?' active':''}" id="ws${i}"></div>`).join('')}</div>
     </div>`,
    `<div class="row wrap">${r.tiles.map((w,i)=>
      `<button class="word-btn tile" data-w="${w}" style="background:${col(i+3)}"
        onclick="sentenceTap(this,'${w}')">${w==='I'?'I':w.toLowerCase()}</button>`).join('')}</div>`);
  setTimeout(sentenceSay, 380);
  markSentenceTarget();
},

/* ── one word is missing (Worksheet 3, question 2) ────────── */
pickWord(r){
  inst('Which word finishes it?');
  const line = r.words.map((w,i)=> i===r.at
      ? `<span class="gap">?</span>`
      : `<span>${w==='I'?'I':w.toLowerCase()}</span>`).join(' ');
  stage(
    `<div class="say-card">
       <div class="big-pic" onclick="WLAudio.word('${r.answer}')">${r.pic}</div>
       <div class="read-line">${line}</div>
     </div>`,
    `<div class="row">${r.opts.map((w,i)=>
      `<button class="word-btn${w===r.answer?' is-correct':''}" style="background:${col(i+1)}"
        onclick="ans(this,${w===r.answer},'${w}')">${w.toLowerCase()}</button>`).join('')}</div>`);
},

/* ── read the whole line ──────────────────────────────────── */
readLine(r){
  const said = r.words.map(w => w==='I' ? 'I' : w.toLowerCase()).join(' ');
  inst('Read it, then find the picture');
  stage(
    `<div class="read-line big">${r.words.map(w=>
       `<span onclick="WLAudio.word('${w}')">${w==='I'?'I':w.toLowerCase()}</span>`).join(' ')}</div>
     <button class="sound-btn" onclick="WLAudio.line('${esc(said)}',0.55,1.12)">🔊 Read it to me</button>`,
    `<div class="grid3">${r.opts.map(v=>
      `<div class="pic-card blank${v.w===r.answer?' is-correct':''}" role="button" tabindex="0"
        onclick="picTap(this,'${v.w}','${r.answer}')"><div class="e">${v.e}</div></div>`).join('')}</div>`);
  setTimeout(()=>WLAudio.line(said, 0.55, 1.12), 420);
},

/* ── write the letter, stroke by stroke ───────────────────── */
write(r){
  const shown = r.upper ? r.letter.toUpperCase() : r.letter.toLowerCase();
  inst(`Write the letter <b>${shown}</b>`);
  stage(
    `<div class="say-card tight">
       <button class="say-btn letter" onclick="WLAudio.sound('${r.letter}')">${shown}</button>
       <p class="say-hint">${r.upper?'the big':'the small'} <b>${shown}</b> · says <b>${SOUND[r.letter]||''}</b></p>
     </div>`,
    `<div class="pad-card">
       <div class="pad-pips" id="padPips"></div>
       <canvas id="padCanvas" class="pad-canvas"></canvas>
       <div class="pad-hint" id="padHint">Start on the yellow dot ① and follow the arrow.</div>
       <div class="pad-tools">
         <button class="tool-btn" onclick="padDemo()">👀 Show me</button>
         <button class="tool-btn" onclick="padClear()">↺ Start again</button>
       </div>
       <div class="pad-escape" id="padEscape"></div>
     </div>`);
  openPad(shown, r.letter);
  setTimeout(()=>WLAudio.sound(r.letter), 320);
}
};

/* ════════════════════════════════════════════════════════════
   THE WRITING PAD, inside a round
   ════════════════════════════════════════════════════════════ */
let PAD = null, padEscapeTimer = null;

function openPad(shown, letter){
  closePad();
  const canvas = $('padCanvas');
  if(!canvas) return;
  const total = () => PAD ? PAD.strokes.length : 1;

  PAD = LetterPad.create({
    canvas, ch: shown, mode: 'trace',
    onTip: (t, kind) => {
      const h = $('padHint'); if(!h) return;
      h.textContent = t || '';
      h.className = 'pad-hint' + (kind ? ' ' + kind : '');
    },
    onStroke: (done, all) => {
      const p = $('padPips'); if(!p) return;
      p.innerHTML = Array.from({length:all}, (_,i) =>
        `<div class="pip${i < done ? ' done' : i === done ? ' now' : ''}"></div>`).join('');
    },
    onDone: () => {
      WLAudio.sound(letter);
      setTimeout(()=>win(shown), 420);
    }
  });

  if(!PAD){                                  // shapes missing — never block the journey
    const e = $('padEscape');
    if(e) e.innerHTML = `<button class="tool-btn done" onclick="padSkip()">Carry on ✓</button>`;
    return;
  }
  /* After a while, offer a way past. A wobbly finger should never
     be the reason a child cannot finish a place. */
  padEscapeTimer = setTimeout(() => {
    const e = $('padEscape');
    if(e && PAD && !PAD.done) e.innerHTML =
      `<button class="tool-btn quiet" onclick="padSkip()">This one is tricky — carry on</button>`;
  }, 25000);
}
function closePad(){
  clearTimeout(padEscapeTimer); padEscapeTimer = null;
  if(PAD){ PAD.destroy(); PAD = null }
}
function padDemo(){ if(PAD) PAD.demo() }
function padClear(){
  if(PAD){ PAD.clear(); const h=$('padHint'); if(h){ h.textContent='Start on the yellow dot ① and follow the arrow.'; h.className='pad-hint' } }
}
function padSkip(){
  const r = run.rounds[run.i];
  if(PAD) PAD.giveUp();
  const h = $('padHint'); if(h){ h.textContent = 'Good try! Keep going 💪'; h.className = 'pad-hint good' }
  setTimeout(()=>win(r && r.letter ? (r.upper ? r.letter.toUpperCase() : r.letter.toLowerCase()) : ''), 600);
}

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

/* the -at machine */
function machineTap(el, letter){
  const s = window._machine; if(!s || run.busy || el.classList.contains('used')) return;
  const word = s.left.find(w => w[0] === letter);
  const hopper = $('machineHopper');
  if(hopper){ hopper.textContent = letter.toLowerCase(); hopper.classList.add('drop');
              setTimeout(()=>hopper.classList.remove('drop'), 420) }
  if(word){
    s.left = s.left.filter(w => w !== word);
    el.classList.add('used');
    const out = $('machineOut');
    if(out){
      const chip = document.createElement('div');
      chip.className = 'made'; chip.textContent = word.toLowerCase();
      out.appendChild(chip);
    }
    WLAudio.word(word);
    run.missThis = 0;
    if(!s.left.length) setTimeout(()=>win(''), 700);
  } else {
    if(hopper){ hopper.classList.add('reject'); setTimeout(()=>hopper.classList.remove('reject'), 450) }
    miss(el);
  }
}

function alphabetTap(el, letter, answer){
  WLAudio.sound(letter);
  if(letter === answer){
    const g = $('snakeGap');
    if(g){ g.textContent = letter.toLowerCase(); g.classList.remove('gap'); g.classList.add('seg','filled') }
    setTimeout(()=>win(letter), 380);
  } else miss(el);
}

/* building a sentence */
function sentenceSay(){
  const s = window._sentence; if(!s) return;
  WLAudio.line(s.words.map(w => w==='I' ? 'I' : w.toLowerCase()).join(' '), 0.55, 1.12);
}
function markSentenceTarget(){
  const s = window._sentence; if(!s) return;
  document.querySelectorAll('#playBody .word-btn.tile').forEach(b=>b.classList.remove('is-correct'));
  const want = s.words[s.at];
  let marked = false;
  document.querySelectorAll('#playBody .word-btn.tile').forEach(b => {
    if(!marked && !b.classList.contains('used') && b.dataset.w === want){ b.classList.add('is-correct'); marked = true }
  });
}
function sentenceTap(el, word){
  const s = window._sentence; if(!s || run.busy) return;
  if(word === s.words[s.at]){
    const slot = $('ws'+s.at);
    if(slot){ slot.textContent = word==='I' ? 'I' : word.toLowerCase();
              slot.classList.remove('active'); slot.classList.add('filled') }
    el.classList.add('used');
    WLAudio.word(word);
    s.at++; run.missThis = 0;
    if(s.at >= s.words.length){
      setTimeout(()=>{ sentenceSay(); win('') }, 520);
    } else {
      const nx = $('ws'+s.at); if(nx) nx.classList.add('active');
      markSentenceTarget();
    }
  } else {
    const sl = $('sentSlots'); if(sl){ sl.classList.add('shake'); setTimeout(()=>sl.classList.remove('shake'),450) }
    miss(el); markSentenceTarget();
  }
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
  WLAudio.chapter(CURRENT_MAP.no, no, n.story.lines.map(l=>l.replace(/\*/g,'')).join(' '));
}
function storyBack(){ WLAudio.stop(); storyFrom==='shelf' ? openShelf() : toMap() }

function openShelf(){
  const c = storyCount();
  $('shelfSub').textContent = c===0
    ? `No chapters yet — finish ${NODES[0].region} to win the first one.`
    : `${c} of ${NODES.length} chapters from ${CURRENT_MAP.name}`;
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

  const built = MAPS.filter(mapPlayable);

  let html = `
    <div class="panel">
      <div class="switch-row">
        <div class="mid"><b style="font-size:15px">Open every map and place</b>
          <div class="small">Off, a child unlocks the next place by finishing the one before,
            and the next map by finishing all ten places. On, everything is open straight away.</div></div>
        <div class="switch${DB.unlockAll?' on':''}" id="unlockSwitch" role="button" tabindex="0"
             onclick="toggleUnlockAll()" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleUnlockAll()}"><i></i></div>
      </div>
      <div class="switch-row" style="margin-top:6px">
        <div class="mid"><b style="font-size:15px">Sound</b><div class="small">Turn all audio off</div></div>
        <div class="switch${WLAudio.isMuted()?'':' on'}" id="soundSwitch" role="button" tabindex="0"
             onclick="toggleSound()" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleSound()}"><i></i></div>
      </div>
    </div>

    <div class="panel">
      <h3>Progress</h3>
      ${built.map(m => {
        const done = mapStarsDone(m);
        return `<p class="small" style="margin:12px 0 4px;color:var(--purple);font-weight:700">
            ${m.art} ${m.name} — ${done}/${m.nodes.length}</p>` +
          m.nodes.map(n=>{
            const d = mapRec(m.no).nodes[n.no] || freshNode();
            const total = d.correct + d.wrong;
            const acc = total ? Math.round(d.correct/total*100) : null;
            return `<p class="small" style="display:flex;gap:8px;align-items:center;padding:5px 0;border-bottom:1px solid var(--ghost)">
              <span style="width:22px">${n.art}</span>
              <b style="flex:1;color:var(--purple)">${n.region}</b>
              <span>${d.stars?'⭐'.repeat(d.stars):'—'}</span>
              <span style="width:64px;text-align:right">${acc!==null?acc+'% right':''}</span></p>`;
          }).join('');
      }).join('')}
      ${MAPS.filter(m=>!mapPlayable(m)).length
        ? `<p class="small" style="margin-top:14px;color:var(--lav)">
             Maps ${MAPS.filter(m=>!mapPlayable(m))[0].no}–12 are not built yet.
             Add ten places to <code>MAPS</code> in <code>js/wordland-data.js</code> and they appear here.</p>`
        : ''}
    </div>

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

    <button class="big-btn quiet" onclick="askGrownUp(doReset)">Start the journey over</button>`;
  $('dashBody').innerHTML = html;
}
async function recheckAudio(){ await WLAudio.rescan(); openDash() }
function toggleSound(){
  const m = !WLAudio.isMuted();
  WLAudio.setMuted(m); DB.muted = m; save();
  const s = $('soundSwitch'); if(s) s.classList.toggle('on', !m);
}
function toggleUnlockAll(){
  DB.unlockAll = !DB.unlockAll; save();
  const s = $('unlockSwitch'); if(s) s.classList.toggle('on', DB.unlockAll);
}
function doReset(){ DB = freshDB(); save(); openMaps() }

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
  window.addEventListener('orientationchange', () => setTimeout(() => {
    const r = run.rounds[run.i];
    if(PAD && r && r.type === 'write') openPad(r.upper ? r.letter.toUpperCase() : r.letter.toLowerCase(), r.letter);
  }, 300));

  load();
  WLAudio.init();
}
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
