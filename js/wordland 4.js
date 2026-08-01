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

/* ════════════════════════════════════════════════════════════
   SOUNDS, GRAPHEMES, AND SAYING THEM PROPERLY
   ════════════════════════════════════════════════════════════ */

/* Which recordings actually exist. Filled in at boot. Until it is,
   nothing breaks — we just fall back to the computer voice. */
const RECORDED = new Set();

/* The stops (/t/ /b/ /k/ /d/ /g/ /p/) cannot be produced by any
   speech engine without a vowel stuck on the end, and "tuh" is the
   single most reliable way to stop a child blending. Where there is
   no recording, we never say the sound in isolation — we say the
   keyword and let the child hear the sound at the front of it. */
function needsVoice(g){
  const p = (typeof PHON !== 'undefined') && PHON[g];
  return !!(p && p.tts === null && !RECORDED.has(p.file));
}
function saySound(g){
  if(!needsVoice(g)) return WLAudio.sound(g);
  const k = (typeof KEYWORD !== 'undefined' && KEYWORD[g]) || null;
  if(k) WLAudio.line(k.w.toLowerCase(), 0.65, 1.15);
  else WLAudio.sound(g);
}
/* What the child SEES. "/t/", never "tuh". */
function sndLabel(g){
  return (typeof SOUND_LABEL !== 'undefined' && SOUND_LABEL[g]) || ('/' + String(g).toLowerCase() + '/');
}

/* ── splitting a word into graphemes, not letters ────────────
   The old blend game split on characters, so "ship" was sounded
   out s-h-i-p and "cake" c-a-k-e. Both teach the wrong thing.  */
const MULTI = ['IGH','TCH','SH','CH','TH','NG','CK','QU','EE','OO','EA','ER','IR','UR','OR','AR','OA','OU','OW','AY','AI','OI','OY','LL','SS','FF','ZZ'];
function splitGraphemes(word){
  const w = String(word).toUpperCase();
  const out = [];
  for(let i = 0; i < w.length; ){
    const three = w.slice(i, i+3), two = w.slice(i, i+2);
    if(MULTI.includes(three)){ out.push(three); i += 3 }
    else if(MULTI.includes(two)){ out.push(two); i += 2 }
    else { out.push(w[i]); i += 1 }
  }
  return out;                       // always joins back to the word
}
/* Magic e. cake is three sounds in four letters: the e says nothing
   and the a says its own name. Returns the index of the silent e, or
   -1. Kept separate from the splitter so a spelling box always holds
   the letters that are really there. */
function magicEAt(units){
  const n = units.length;
  if(n < 3 || units[n-1] !== 'E') return -1;
  if(!/^[AEIOU]$/.test(units[n-3])) return -1;
  if(!/^[A-Z]{1,2}$/.test(units[n-2]) || /[AEIOU]/.test(units[n-2])) return -1;
  return n - 1;
}
const LONG = { A:'ay', E:'ee', I:'eye', O:'oh', U:'you' };
function unitText(u){ return String(u).toLowerCase() }
function unitSound(u){ return String(u) }

/* play one unit of a word, knowing where it sits */
function sayUnit(units, i){
  const e = magicEAt(units);
  if(e >= 0 && i === e) return;                       // the silent e says nothing
  if(e >= 0 && i === e - 2 && LONG[units[i]])         // ...so the vowel says its name
    return WLAudio.line(LONG[units[i]], 0.8, 1.25);
  saySound(units[i]);
}
function unitSilent(units, i){ return magicEAt(units) === i }

/* ── per-item record, so a grown-up can see WHAT is hard ─────
   The old save held one correct and one wrong count per place,
   which tells a parent a percentage and nothing else.          */
function logItem(type, target, ok){
  const r = nodeRec(run.node);
  if(!r.items) r.items = {};
  const key = type + '|' + String(target || '').toUpperCase();
  if(!r.items[key]) r.items[key] = { n:0, wrong:0 };
  r.items[key].n++;
  if(!ok) r.items[key].wrong++;
}

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
function freshDB(){ return { v:3, started:Date.now(), maps:{}, muted:false, unlockAll:false, masteryGate:true } }
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
/* Finishing is not the same as knowing it. A place scraped through on
   one star does not open the next map while the gate is on. */
function mapMastered(m){
  if(!mapPlayable(m)) return false;
  const rec = mapRec(m.no).nodes;
  return m.nodes.every(n => rec[n.no] && rec[n.no].stars >= 2);
}
function needsPractice(no){
  const r = mapRec(CURRENT_MAP.no).nodes[no];
  return !!(r && r.stars === 1);
}
function mapUnlocked(m){
  if(DB.unlockAll) return true;
  if(m.no === 1) return true;
  const prev = MAPS.find(x => x.no === m.no - 1);
  if(!prev) return false;
  return DB.masteryGate === false ? mapFinished(prev) : mapMastered(prev);
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
    if(done){ const t=document.createElement('div'); t.className='tick';
              t.textContent = needsPractice(n.no) ? '↻' : '✓';
              t.title = needsPractice(n.no) ? 'Worth another go' : 'Finished';
              stone.appendChild(t) }
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
function picsWith(L, node, atEnd){
  const hit = v => atEnd ? v.w.endsWith(L) : v.w.startsWith(L);
  const mine = node.vocab.filter(hit);
  return mine.length >= 3 ? mine : ALL_PICS.filter(hit);
}
function picsStartingWith(L, node){ return picsWith(L, node, false) }

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
  const writeLetter = [...(n.teaches && n.teaches.length ? n.teaches : n.letters)].reverse()
      .find(l => l.length === 1 && LETTERFORMS[l.toLowerCase()]) || null;

  /* The alphabet games work on what this lesson TEACHES, not on every
     letter that happens to appear in its words. Without this, Lesson 94
     (-ake) asks a child to tap pictures beginning with k. */
  const focus = (n.teaches && n.teaches.length) ? n.teaches : n.letters;
  const atEnd = n.position === 'final';

  /* Words that cannot be sounded out must never go into a sound box
     or a blending strip. "come", "have" and "there" are learned by
     sight for a reason. */
  const IRREGULAR = new Set(["THE","A","I","TO","DO","OF","IS","AS","HAS","WAS","ARE",
    "SAID","COME","SOME","HAVE","HERE","THERE","WHERE","WHO","WHAT","WHEN","WHY",
    "ONE","TWO","THREE","EIGHT","THEY","YOU","YOUR","MY","BE","ME","WE","SHE","HE",
    "GOES","DOES","LIVES","LIKE","LITTLE","VERY","WOULD","COULD","SHOULD","ANOTHER",
    "TOGETHER","THROUGH","BEHIND","ABOUT","ABOVE","WATER","MOTHER","BROTHER","FRIENDS",
    "PEOPLE","ONCE","LOVE","DONE","GONE","MOVE","EYE","BUY","SAYS","ASKED","TRIED"]);
  const soundable = list => {
    const ok = list.filter(v => !IRREGULAR.has(v.w) && !n.hfw.some(h => h.w === v.w));
    return ok.length ? ok : list;
  };

  const used = { pic:[], word:[], hfw:[], letter:[], fam:[], sent:[] };
  const nextLetter = () => { const av=focus.filter(l=>!used.letter.includes(l)); const l=av.length?rnd(av):rnd(focus); used.letter.push(l); return l };
  const nextPic = () => { const av=n.vocab.filter(v=>!used.pic.includes(v.w)); const v=av.length?rnd(av):rnd(n.vocab); used.pic.push(v.w); return v };
  const nextWord = () => { const src = n.words.length ? n.words : (n.family.length ? n.family : n.vocab);
                           const av=src.filter(v=>!used.word.includes(v.w)); const v=av.length?rnd(av):rnd(src); used.word.push(v.w); return v };
  /* the same, but only words a child can actually decode */
  const nextSoundable = () => { const src = soundable(n.family.length ? n.family : (n.words.length ? n.words : n.vocab));
                           const av=src.filter(v=>!used.word.includes(v.w)); const v=av.length?rnd(av):rnd(src); used.word.push(v.w); return v };
  const nextHfw = () => { const av=hfwPool.filter(v=>!used.hfw.includes(v.w)); const v=av.length?rnd(av):rnd(hfwPool); used.hfw.push(v.w); return v };
  const nextSent = () => { const all=sentencesFor(n); const av=all.filter(s=>!used.sent.includes(s.s.join(' ')));
                           const s=av.length?rnd(av):rnd(all); used.sent.push(s.s.join(' ')); return s };
  /* A two-letter answer among one-letter options gives itself away.
     Offer distractors of the same shape wherever we can. */
  const DIGRAPHS = ['SH','CH','TH','NG','EE','OO','EA','ER','OR','OA','AY','IR'];
  const wrongLetters = (right,k) => {
    const sameShape = right.length > 1 ? DIGRAPHS : LETTER_POOL;
    const pool = [...(n.confuse||[]), ...sameShape].filter(x => x !== right && x.length === right.length);
    const out = shuffle(pool).filter((v,i,a)=>a.indexOf(v)===i).slice(0,k);
    while(out.length < k){                       // last resort, keep the game playable
      const x = rnd([...LETTER_POOL, ...DIGRAPHS]);
      if(x !== right && !out.includes(x)) out.push(x);
    }
    return out;
  };

  return n.plan.map(entry => {
    let [type, flavour] = String(entry).split(':');
    if(type === 'trace') type = 'write';                 // the old name still works

    if(type==='sound'){
      const L = nextLetter();
      const key = n.vocab.find(v=>v.w.startsWith(L)) || KEYWORD[L] || n.vocab[0] || {w:L,e:'✨'};
      return { type, answer:L, key, atEnd, opts:shuffle([L, ...wrongLetters(L,2)]) };
    }

    if(type==='beginSound'){
      /* where the lesson teaches a sound at the END of a word (x, ng)
         the question has to be about the end of the word */
      const hit = v => atEnd ? focus.some(L => v.w.endsWith(L))
                             : focus.some(L => v.w.startsWith(L));
      const onFocus = n.vocab.filter(v => hit(v) && !used.pic.includes(v.w));
      const target = onFocus.length ? rnd(onFocus) : nextPic();
      used.pic.push(target.w);
      const L = (atEnd ? focus.filter(x => target.w.endsWith(x))
                       : focus.filter(x => target.w.startsWith(x)))[0] || target.w[0];
      return { type, answer:L, target, atEnd, opts:shuffle([L, ...wrongLetters(L,2)]) };
    }

    if(type==='starts'){
      const onFocus = n.vocab.filter(v => focus.some(L=>v.w.startsWith(L)) && !used.pic.includes(v.w));
      const spare = n.vocab.filter(v => !used.pic.includes(v.w));
      const right = onFocus.length ? rnd(onFocus) : spare.length ? rnd(spare) : rnd(n.vocab);
      used.pic.push(right.w);
      const L = focus.filter(x => right.w.startsWith(x))[0] || right.w[0];
      const wrong = shuffle(ALL_PICS.filter(v => !v.w.startsWith(L) && v.w!==right.w)).slice(0,3);
      return { type, answer:right.w, letter:L, opts:shuffle([right,...wrong]) };
    }

    if(type==='tapAll'){
      const has = (v,L) => atEnd ? v.w.endsWith(L) : v.w.startsWith(L);
      const able = focus.map(L=>({L, pics:picsWith(L,n,atEnd)})).filter(x=>x.pics.length>=3);
      const chosen = able.length ? rnd(able)
        : { L:focus[0], pics:ALL_PICS.filter(v=>has(v,focus[0])) };
      const right = shuffle(chosen.pics).slice(0,3);
      const wrong = shuffle(ALL_PICS.filter(v => !has(v,chosen.L) && !right.some(r=>r.w===v.w))).slice(0,3);
      return { type, letter:chosen.L, atEnd, correct:right.map(r=>r.w), opts:shuffle([...right,...wrong]) };
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
      const junk = shuffle([...(n.confuse||[]), ...LETTER_POOL].filter(x=>x!==L && x.length===1));
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
      /* Sound boxes: one box per phoneme. "ship" is three sounds in
         four letters, and a child who is given four boxes learns the
         wrong thing about it. */
      const w = nextSoundable();
      const units = splitGraphemes(w.w);
      const extra = shuffle(LETTER_POOL.filter(l => !units.includes(l))).slice(0, units.length < 3 ? 2 : 1);
      return { type, answer:w.w, target:w, units, tiles:shuffle([...units, ...extra]) };
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
      /* The old pool was thirteen Level-1 words, fixed for all 120
         lessons, so "through" was offered against "at" and "man".
         Draw instead on the words this child has actually met, and
         prefer the ones that look like the answer — that is what
         gets confused in real reading. */
      const met = (typeof hfwUpTo === 'function'
        ? hfwUpTo(CURRENT_MAP.no, n.no).map(x => x.w)
        : []);
      /* A distractor does not have to be a word the child has been
         taught — it has to be one they could mistake for the answer.
         "little" against "at" and "man" teaches nothing. */
      const COMMON = ["I","AM","AT","IT","IS","AN","AS","MY","BY","GO","NO","SO","UP","ON","IN",
        "THE","THEY","THEM","THEN","THERE","THEIR","THIS","THAT","THESE","WITH","WHEN","WHERE",
        "WHAT","WHO","WHY","SEE","SAW","SAY","SAID","CAN","MAN","AND","HAD","HAS","HAVE","HERE",
        "HEAR","HIM","HIS","HER","COME","SOME","LOOK","BOOK","TOOK","LIKE","LITTLE","LETTER",
        "WANT","WENT","WAS","WERE","FOR","OFF","OF","ONE","ONCE","OUT","OUR","YOU","YOUR","DOWN",
        "DO","DOES","GOES","MAKE","TAKE","PLAY","AWAY","ARE","VERY","EVERY","OVER","AFTER"];
      const pool = [...new Set([...met, ...COMMON])].filter(w => w !== h.w);
      const near = (a,b) => (a[0]===b[0]?3:0) + (a.length===b.length?2:0)
                          + (Math.abs(a.length-b.length)<=1?1:0)
                          + (a[a.length-1]===b[b.length-1]?1:0)
                          + (a.slice(0,2)===b.slice(0,2)?2:0);
      const ranked = pool.sort((a,b)=>near(h.w,b)-near(h.w,a));
      const close = ranked.slice(0, 6);
      return { type, answer:h.w, target:h, opts:shuffle([h.w, ...shuffle(close).slice(0,2)]) };
    }

    /* ── the word-family machine (Worksheet 2) ────────────── */
    if(type==='machine'){
      /* Two ways round, both real onset-rime work:
           rime mode   -ash + cl fl spl tr      (onsets may be blends)
           onset mode  sh + ed ell ip op        (one onset, many rimes)
         The rime used to be guessed from the word list, which turned
         crash/flash/splash into cash/fash/sash. It is data now. */
      if(n.onset){
        const fam = shuffle(n.family.filter(v => v.w.startsWith(n.onset))).slice(0,4);
        if(fam.length >= 2){
          const rimes = fam.map(v => v.w.slice(n.onset.length));
          const dud = shuffle(['ELP','OLD','UMP','AND','INT','EST']
            .filter(r => !rimes.includes(r)))[0] || 'UMP';
          return { type, mode:'onset', fixed:n.onset, correct:fam.map(v=>v.w),
                   parts:shuffle([...rimes, dud]) };
        }
      }
      const rime = n.rime || rimeOf(famPool) || '';
      const fits = famPool.filter(v => rime && v.w.endsWith(rime) && v.w.length > rime.length);
      /* Rather than force a rime onto words that do not share one —
         which is how crash/flash/splash became cash/fash/sash — do a
         different activity. */
      if(fits.length < 2){
        const w = nextSoundable(); const units = splitGraphemes(w.w);
        const extra = shuffle(LETTER_POOL.filter(l => !units.includes(l))).slice(0,1);
        return { type:'spell', answer:w.w, target:w, units, tiles:shuffle([...units, ...extra]) };
      }
      const real = shuffle(fits).slice(0,4);
      const onsets = real.map(v => v.w.slice(0, v.w.length - rime.length));
      const dud = shuffle(LETTER_POOL.filter(l =>
        !real.some(v => v.w === l + rime) && l !== rime[0]))[0] || 'Z';
      return { type, mode:'rime', fixed:rime, correct:real.map(v=>v.w),
               parts:shuffle([...new Set([...onsets, dud])]) };
    }

    /* ── the alphabet snake (Worksheet 1) ─────────────────── */
    if(type==='alphabet'){
      const start = Math.floor(Math.random() * (ALPHABET.length - 5));
      const seq = ALPHABET.slice(start, start + 5);      // was `run` — shadowed the play state
      const hideAt = 1 + Math.floor(Math.random()*3);
      const answer = seq[hideAt].toUpperCase();
      const wrong = shuffle(ALPHABET.filter(l => !seq.includes(l))).slice(0,2).map(l=>l.toUpperCase());
      return { type, run:seq, hideAt, answer, opts:shuffle([answer, ...wrong]) };
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
      /* No single letter to trace? Sixteen lessons used to fall back to
         the letter m, so a child at Lesson 120 traced m. Spell instead. */
      if(!writeLetter){
        const w = nextSoundable(); const units = splitGraphemes(w.w);
        const extra = shuffle(LETTER_POOL.filter(l=>!units.includes(l))).slice(0,1);
        return { type:'spell', answer:w.w, target:w, units, tiles:shuffle([...units, ...extra]) };
      }
      return { type, letter:writeLetter, upper: flavour==='u' };
    }

    /* ── sound it out for yourself ─────────────────────────────
       The old blend round played the word and offered three written
       words: that is word recognition. Here the child taps each
       sound, then pushes them together, then finds the meaning. */
    if(type==='blendIt'){
      const w = nextSoundable();
      const units = splitGraphemes(w.w);
      const wrong = shuffle(ALL_PICS.filter(v => v.w !== w.w && v.e && v.e !== w.e)).slice(0,2);
      return { type, answer:w.w, target:w, units, opts:shuffle([w, ...wrong]) };
    }

    /* ── which vowel is in the middle? ─────────────────────────
       Medial vowels are where CVC spelling falls over, and nothing
       in the program asked about them. */
    if(type==='vowelPick'){
      const src = [...n.family, ...n.words, ...n.vocab]
        .filter(v => /^[A-Z]?[A-Z]?[AEIOU][A-Z]{1,2}$/.test(v.w) && v.w.length <= 5);
      const target = src.length ? rnd(src) : { w:'CAT', e:'🐱' };
      const at = target.w.split('').findIndex(c => 'AEIOU'.includes(c));
      const answer = target.w[at];
      return { type, target, at, answer, opts:shuffle([answer,
        ...shuffle('AEIOU'.split('').filter(v=>v!==answer)).slice(0,2)]) };
    }

    /* ── what does the ending say? ─────────────────────────────
       For the -y and -er lessons, where the interesting sound is at
       the end and the old machine was building words like "by". */
    if(type==='addEnding'){
      const suf = n.suffix || 'Y';
      const words = (n.family.length ? n.family : n.vocab)
        .filter(v => v.w.endsWith(suf)).slice(0,4);
      const show = words.length >= 2 ? words : n.family.slice(0,3);
      const answer = n.suffixSound || 'eee';
      const opts = shuffle([answer, ...['yuh','ay','uh','er','eye']
        .filter(x => x !== answer).slice(0,2)]);
      return { type, suffix:suf, words:show, answer, opts };
    }

    /* ── two jobs for one letter (soft c, soft g) ────────────── */
    if(type==='sortTwo'){
      const cfg = n.sortTwo || { letter:'C', a:'kuh', b:'sss' };
      const L = cfg.letter;
      const soft = n.vocab.filter(v => new RegExp('^'+L+'[EIY]').test(v.w));
      const hard = ALL_PICS.filter(v => new RegExp('^'+L+'[AOUR]').test(v.w));
      const pool = shuffle([...soft.slice(0,3), ...shuffle(hard).slice(0,3)]);
      const target = pool.length ? rnd(pool) : { w:L+'AT', e:'🐱' };
      const isSoft = new RegExp('^'+L+'[EIY]').test(target.w);
      return { type, letter:L, target, answer:isSoft ? 'b' : 'a', cfg };
    }

    return { type:'sound', answer:'M', key:{w:'MOON',e:'🌙'}, opts:['M','S','T'] };
  });
}

/* ════════════════════════════════════════════════════════════
   PLAY LOOP
   ════════════════════════════════════════════════════════════ */
let run = { node:1, rounds:[], i:0, mistakes:0, missThis:0, busy:false, startedAt:0, firstTry:0, planned:0, requeued:0 };

function startNode(no){
  closeSheet();
  const n = NODES[no-1];
  const rounds = buildRounds(n);
  run = { node:no, rounds, i:0, mistakes:0, missThis:0, busy:false,
          startedAt:Date.now(), firstTry:0, planned:rounds.length, requeued:0 };
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
  const r = run.rounds[run.i];
  const clean = run.missThis === 0;
  if(clean && run.i < run.planned) run.firstTry++;
  nodeRec(run.node).correct++;
  logItem(r ? r.type : '?', word || (r && (r.answer || r.letter)), clean);

  /* Anything the child stumbled on comes back once more before the end.
     Getting it right after help is not the same as knowing it. */
  if(!clean && r && run.requeued < 3 && !r._again){
    run.rounds.push({ ...r, _again:true }); run.requeued++;
  }
  save();

  /* Praise on every single item, for a second and a quarter, is twenty
     minutes of applause per map and it stops meaning anything. A quick
     tick for routine work; the real cheer every third one and at the end. */
  const big = (run.i % 3 === 2) || run.i >= run.rounds.length - 1;
  const c = rnd(CHEERS);
  $('cheerE').textContent = big ? c[0] : '✓';
  $('cheerT').textContent = big ? c[1] : '';
  if(big) WLAudio.praise(c[1], 0.85, 1.2);
  $('cheerW').textContent = word ? String(word).toLowerCase() : '';
  $('cheer').classList.add('on');
  setTimeout(() => {
    $('cheer').classList.remove('on');
    run.i++;
    if(run.i >= run.rounds.length) finishNode(); else renderRound();
  }, big ? 1050 : 420);
}
function miss(el){
  if(run.busy) return;
  run.mistakes++; run.missThis++;
  const r = run.rounds[run.i];
  nodeRec(run.node).wrong++;
  logItem(r ? r.type : '?', r && (r.answer || r.letter), false);
  save();
  if(el){ el.classList.add('wrong'); setTimeout(()=>el.classList.remove('wrong'),450) }
  WLAudio.line(rnd(TRY_AGAIN), 0.85, 1.2);

  /* Second miss: show AND say the right answer. Highlighting it in
     silence teaches a child to wait for the glow. */
  if(run.missThis >= 2){
    document.querySelectorAll('.is-correct').forEach(e=>e.classList.add('nudge'));
    reteach(r);
  }
}

/* the bit that was missing — say what the answer is */
function reteach(r){
  if(!r) return;
  const g = r.answer || r.letter;
  if(!g) return;
  setTimeout(() => {
    if(['sound','beginSound','starts','caseMatch','hunt','vowelPick'].includes(r.type)){
      inst(`This one is <b>${String(g).toLowerCase()}</b> — it says <b>${sndLabel(g)}</b>`);
      saySound(g);
    } else if(r.type === 'sight'){
      inst(`This word is <b>${String(g).toLowerCase()}</b>`);
      WLAudio.word(g);
    } else {
      inst(`Listen — <b>${String(g).toLowerCase()}</b>`);
      WLAudio.word(g);
    }
  }, 620);
}
function ans(el, ok, word){ ok ? win(word) : miss(el) }

function finishNode(){
  const n = NODES[run.node-1];
  /* Stars used to need a flawless run, so the child who most needed
     encouragement could never earn three. Judge first-try accuracy
     instead — and a retry after a re-teach is help, not failure, so
     it is not counted against the child. */
  const acc = run.planned ? run.firstTry / run.planned : 1;
  const stars = acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1;
  nodeRec(run.node).acc = Math.round(acc * 100);
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
  inst(`Which letter says <b>${sndLabel(r.answer)}</b>?`);
  stage(
    `<div class="say-card">
       <button class="say-btn" onclick="saySound('${r.answer}')" aria-label="Hear the sound">🔊</button>
       <p class="say-hint">${sndLabel(r.answer)} … like <b>${r.key.w.toLowerCase()}</b> ${r.key.e}</p>
     </div>`,
    `<div class="row">${r.opts.map((l,i)=>
      `<button class="letter-btn${l===r.answer?' is-correct':''}" style="background:${col(i+2)}"
        onclick="ans(this,${l===r.answer},'${l}')">${l.toLowerCase()}</button>`).join('')}</div>`);
  setTimeout(()=>saySound(r.answer), 320);
},

/* look at a picture, choose its first or last letter */
beginSound(r){
  inst(r.atEnd ? 'Which letter does it <b>end</b> with?' : 'Which letter does it start with?');
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
       <button class="say-btn letter" onclick="saySound('${r.letter}')">${r.letter.toLowerCase()}</button>
       <p class="say-hint">says <b>${sndLabel(r.letter)}</b></p>
     </div>`,
    `<div class="grid2">${r.opts.map(v=>
      `<div class="pic-card${v.w===r.answer?' is-correct':''}" role="button" tabindex="0"
        onclick="picTap(this,'${v.w}','${r.answer}')">
        <div class="e">${v.e}</div><div class="w">${v.w.toLowerCase()}</div></div>`).join('')}</div>`);
  setTimeout(()=>saySound(r.letter), 320);
},

/* tap every picture with the sound (Worksheet 1) */
tapAll(r){
  window._tapAll = { left: r.correct.slice() };
  inst(`Tap <b>all</b> the pictures that ${r.atEnd?'<b>end</b>':'start'} with <b>${r.letter.toLowerCase()}</b>`);
  stage(
    `<div class="say-card">
       <button class="say-btn letter" onclick="saySound('${r.letter}')">${r.letter.toLowerCase()}</button>
       <p class="say-hint">find <b>${r.correct.length}</b> of them</p>
     </div>`,
    `<div class="grid3">${r.opts.map(v=>
      `<div class="pic-card${r.correct.includes(v.w)?' is-correct':''}" role="button" tabindex="0"
        onclick="tapAllTap(this,'${v.w}')"><div class="e">${v.e}</div><div class="w">${v.w.toLowerCase()}</div></div>`).join('')}</div>`);
  setTimeout(()=>saySound(r.letter), 320);
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
       <button class="say-btn letter" onclick="saySound('${r.letter}')">${r.letter.toLowerCase()}</button>
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
       <div class="big-pic glyph" onclick="saySound('${r.answer}')">${r.lower}</div>
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
  const ls = splitGraphemes(r.target.w);
  inst('Listen to it, then pick the word');
  stage(
    `<div class="blend-row" id="blendRow">${ls.map((l,i)=>`<div class="blend-l" id="bl${i}">${unitText(l)}</div>`).join('')}</div>
     <button class="sound-btn" id="blendBtn" onclick="blendGo('${r.target.w}')">🔊 Sound it out</button>`,
    `<div class="row" id="blendOpts" style="opacity:.35;pointer-events:none">${r.opts.map((w,i)=>
      `<button class="word-btn${w.w===r.answer?' is-correct':''}" style="background:${col(i+1)}"
        onclick="ans(this,${w.w===r.answer},'${w.w}')">${w.w.toLowerCase()}</button>`).join('')}</div>`);
  setTimeout(()=>blendGo(r.target.w), 380);
},

/* build the word */
spell(r){
  const units = r.units || splitGraphemes(r.answer);
  window._spell = { word:r.answer, units, at:0 };
  inst(`Spell <b>${r.target.w.toLowerCase()}</b> — <b>${units.length}</b> sounds`);
  stage(
    `<div class="say-card">
       <div class="big-pic" onclick="WLAudio.word('${r.answer}')">${r.target.e}</div>
       <p class="say-hint">${r.target.h||''}</p>
     </div>`,
    `<div class="slots" id="spellSlots">${units.map((u,i)=>
      `<div class="slot${i===0?' active':''}" id="sl${i}"></div>`).join('')}</div>
     <div class="row wrap">${r.tiles.map((l,i)=>
      `<button class="letter-btn" data-l="${l}" style="background:${col(i)}" onclick="spellTap(this,'${l}')">${unitText(l)}</button>`).join('')}</div>`);
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
  window._machine = { left:r.correct.slice(), mode:r.mode, fixed:r.fixed };
  const onsetMode = r.mode === 'onset';
  inst(onsetMode
    ? `Put <b>${r.fixed.toLowerCase()}</b> at the front and make a word`
    : `Make a word ending in <b>${r.fixed.toLowerCase()}</b>`);
  const makes = part => onsetMode ? r.fixed + part : part + r.fixed;
  stage(
    `<div class="machine">
       <div class="hopper" id="machineHopper">?</div>
       <div class="body"><span class="rime">${r.fixed.toLowerCase()}</span></div>
       <div class="spout" id="machineOut"></div>
     </div>
     <p class="say-hint">tap a piece to drop it in — there are <b>${r.correct.length}</b> words</p>`,
    `<div class="row wrap">${r.parts.map((part,i)=>
      `<button class="letter-btn${r.correct.includes(makes(part))?' is-correct':''}" data-l="${part}"
        style="background:${col(i)}" onclick="machineTap(this,'${part}')">${part.toLowerCase()}</button>`).join('')}</div>`);
},

/* ── sound it out for yourself ────────────────────────────────
   Tap each sound, then push them together. The pictures stay shut
   until the child has actually blended it. */
blendIt(r){
  window._blend = { units:r.units, at:0, word:r.answer };
  inst('Tap each sound, then push them together');
  stage(
    `<div class="blend-row" id="blendRow">${r.units.map((u,i)=>
      `<div class="blend-l${unitSilent(r.units,i)?' silent':''}" id="bu${i}" role="button" tabindex="0"
        onclick="blendItTap(${i})">${unitText(u)}</div>`).join('')}</div>
     <button class="sound-btn" id="blendBtn" disabled onclick="blendItPush()">👉 Push them together</button>`,
    `<div class="grid3" id="blendOpts" style="opacity:.3;pointer-events:none">${r.opts.map(v=>
      `<div class="pic-card${v.w===r.answer?' is-correct':''}" role="button" tabindex="0"
        onclick="picTap(this,'${v.w}','${r.answer}')">
        <div class="e">${v.e}</div></div>`).join('')}</div>`);
},

/* ── which vowel is in the middle? ──────────────────────────── */
vowelPick(r){
  inst('Which sound is in the middle?');
  const w = r.target.w;
  stage(
    `<div class="say-card">
       <div class="big-pic" onclick="WLAudio.word('${r.target.w}')">${r.target.e}</div>
       <div class="slots" style="margin:10px 0 0">
         ${w.split('').map((c,i)=> i===r.at
            ? `<div class="slot active">?</div>`
            : `<div class="slot fixed">${c.toLowerCase()}</div>`).join('')}
       </div>
     </div>`,
    `<div class="row">${r.opts.map((v,i)=>
      `<button class="letter-btn${v===r.answer?' is-correct':''}" style="background:${col(i+2)}"
        onclick="vowelTap(this,'${v}','${r.answer}','${r.target.w}')">${v.toLowerCase()}</button>`).join('')}</div>`);
  setTimeout(()=>WLAudio.word(r.target.w), 320);
},

/* ── what does the ending say? ──────────────────────────────── */
addEnding(r){
  inst(`What does <b>${r.suffix.toLowerCase()}</b> say at the end?`);
  stage(
    `<div class="say-card">
       <div class="line-slots" style="flex-wrap:wrap;justify-content:center">
         ${r.words.map(v=>`<div class="wslot filled" style="cursor:pointer"
            onclick="WLAudio.word('${v.w}')">${v.w.toLowerCase()}</div>`).join('')}
       </div>
       <p class="say-hint">tap a word to hear it</p>
     </div>`,
    `<div class="row">${r.opts.map((o,i)=>
      `<button class="word-btn${o===r.answer?' is-correct':''}" style="background:${col(i+3)}"
        onclick="ans(this,${JSON.stringify(o===r.answer)},'${o}')">${o}</button>`).join('')}</div>`);
},

/* ── one letter, two jobs (soft c, soft g) ──────────────────── */
sortTwo(r){
  inst(`Listen. What does <b>${r.letter.toLowerCase()}</b> say in this word?`);
  stage(
    `<div class="say-card">
       <div class="big-pic" onclick="WLAudio.word('${r.target.w}')">${r.target.e}</div>
       <p class="say-hint"><b>${r.target.w.toLowerCase()}</b></p>
     </div>`,
    `<div class="row">
       <button class="word-btn${r.answer==='a'?' is-correct':''}" style="background:${col(1)}"
         onclick="ans(this,${JSON.stringify(r.answer==='a')},'${r.cfg.a}')">${r.cfg.a}</button>
       <button class="word-btn${r.answer==='b'?' is-correct':''}" style="background:${col(4)}"
         onclick="ans(this,${JSON.stringify(r.answer==='b')},'${r.cfg.b}')">${r.cfg.b}</button>
     </div>`);
  setTimeout(()=>WLAudio.word(r.target.w), 320);
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
  /* A sentence starts with a capital and ends with a full stop. The
     builder used to render "i can see a cat" with neither, which
     contradicts the print-concept objectives the program is built on. */
  const disp = {};
  r.words.forEach((w,i) => { if(!(w in disp))
    disp[w] = i === 0 ? w[0] + w.slice(1).toLowerCase()
            : w === 'I' ? 'I' : w.toLowerCase() });
  window._sentence = { words:r.words, at:0, disp };
  inst('Put the words in order');
  stage(
    `<div class="say-card">
       <div class="big-pic" onclick="sentenceSay()">${r.pic}</div>
       <div class="line-slots" id="sentSlots">${r.words.map((w,i)=>
         `<div class="wslot${i===0?' active':''}" id="ws${i}"></div>`).join('')}<div class="wslot stop">.</div></div>
     </div>`,
    `<div class="row wrap">${r.tiles.map((w,i)=>
      `<button class="word-btn tile" data-w="${w}" style="background:${col(i+3)}"
        onclick="sentenceTap(this,'${w}')">${disp[w]}</button>`).join('')}</div>`);
  setTimeout(sentenceSay, 380);
  markSentenceTarget();
},

/* ── one word is missing (Worksheet 3, question 2) ────────── */
pickWord(r){
  inst('Which word finishes it?');
  const line = r.words.map((w,i)=> i===r.at
      ? `<span class="gap">?</span>`
      : `<span>${i===0 ? w[0]+w.slice(1).toLowerCase() : (w==='I'?'I':w.toLowerCase())}</span>`).join(' ') + '.';
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

/* sounding out, one grapheme at a time */
function blendItTap(i){
  const s = window._blend; if(!s || run.busy) return;
  const el = $('bu'+i); if(el) el.classList.add('on');
  sayUnit(s.units, i);
  if(i === s.at) s.at++;
  if(s.at >= s.units.length){
    const b = $('blendBtn'); if(b) b.disabled = false;
  }
}
function blendItPush(){
  const s = window._blend; if(!s) return;
  s.units.forEach((u,i)=>{ const e=$('bu'+i); if(e) e.classList.add('all') });
  WLAudio.word(s.word);
  const o = $('blendOpts'); if(o){ o.style.opacity='1'; o.style.pointerEvents='auto' }
  inst('Now — which picture is it?');
}
function vowelTap(el, v, answer, word){
  saySound(v);
  ans(el, v === answer, word);
}

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
  /* graphemes, not letters: "ship" is sh-i-p and "cake" is c-a_e-k */
  const ls = splitGraphemes(word);
  const btn = $('blendBtn'); if(btn) btn.disabled = true;
  ls.forEach((l,i) => setTimeout(() => {
    const e = $('bl'+i); if(e){ e.classList.add('on'); sayUnit(ls, i) }
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
  const want = s.units[s.at];
  let marked = false;
  document.querySelectorAll('#playBody .letter-btn').forEach(b => {
    if(!marked && !b.classList.contains('used') && b.dataset.l === want){ b.classList.add('is-correct'); marked = true }
  });
}
function spellTap(el, letter){
  const s = window._spell; if(!s || run.busy) return;
  if(letter === s.units[s.at]){
    const slot = $('sl'+s.at);
    slot.textContent = unitText(letter);
    slot.classList.remove('active'); slot.classList.add('filled');
    el.classList.add('used');
    sayUnit(s.units, s.at);
    s.at++; run.missThis = 0;
    if(s.at >= s.units.length){ setTimeout(()=>{ WLAudio.word(s.word); win(s.word) }, 450) }
    else { const nx = $('sl'+s.at); if(nx) nx.classList.add('active'); markSpellTarget() }
  } else {
    const sl = $('spellSlots'); if(sl){ sl.classList.add('shake'); setTimeout(()=>sl.classList.remove('shake'),450) }
    miss(el); markSpellTarget();
    if(run.missThis>=2) document.querySelectorAll('#playBody .letter-btn.is-correct').forEach(b=>b.classList.add('nudge'));
  }
}

/* the -at machine */
function machineTap(el, part){
  const s = window._machine; if(!s || run.busy || el.classList.contains('used')) return;
  const made = s.mode === 'onset' ? s.fixed + part : part + s.fixed;
  const word = s.left.find(w => w === made);
  const hopper = $('machineHopper');
  if(hopper){ hopper.textContent = part.toLowerCase(); hopper.classList.add('drop');
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
  WLAudio.line(s.words.map(w => w==='I' ? 'I' : w.toLowerCase()).join(' ') + '.', 0.55, 1.12);
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
    if(slot){ slot.textContent = (s.disp && s.disp[word]) || (word==='I' ? 'I' : word.toLowerCase());
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
        <div class="mid"><b style="font-size:15px">Finish a map properly before the next one opens</b>
          <div class="small">On, every one of the ten places needs two stars or better —
            seven answers in ten right first time — before the next map unlocks.
            Off, simply reaching the end of each place is enough.</div></div>
        <div class="switch${DB.masteryGate!==false?' on':''}" id="gateSwitch" role="button" tabindex="0"
             onclick="toggleGate()" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleGate()}"><i></i></div>
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
            const acc = d.acc != null ? d.acc : (total ? Math.round(d.correct/total*100) : null);
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
      <h3>What to practise</h3>
      ${practiceReport()}
    </div>

    <div class="panel">
      <h3>Sounds that must be recorded</h3>
      <p class="small">No computer voice can say <b>/t/ /b/ /k/ /d/ /g/ /p/</b> without putting a
        vowel on the end, and "tuh" is what stops a child blending <i>c-a-t</i> into <i>cat</i>.
        Until these are recorded in your own voice the game plays a keyword instead
        — correct, but slower going. These are the ones worth doing first.</p>
      <div class="file-list">${(typeof MUST_RECORD!=='undefined'?MUST_RECORD:[]).map(g=>
        `<span class="file-chip${RECORDED.has((PHON[g]||{}).file)?' found':''}">${
          RECORDED.has((PHON[g]||{}).file)?'✓':'●'} ${SOUND_LABEL[g]} — sounds/${(PHON[g]||{}).file}.mp3</span>`).join('')}</div>
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
/* ── what is actually hard for this child ────────────────────
   The old report gave a percentage per place, which tells a parent
   that something is wrong but never what. This reads the per-item
   log and names it. */
function practiceReport(){
  const tally = {};
  MAPS.filter(mapPlayable).forEach(m => {
    const rec = mapRec(m.no).nodes;
    Object.keys(rec).forEach(no => {
      const items = rec[no].items || {};
      Object.keys(items).forEach(k => {
        const [type, target] = k.split('|');
        if(!target) return;
        const t = tally[target] || (tally[target] = { n:0, wrong:0, types:{} });
        t.n += items[k].n; t.wrong += items[k].wrong;
        t.types[type] = true;
      });
    });
  });
  const rows = Object.entries(tally)
    .filter(([, v]) => v.n >= 3 && v.wrong / v.n >= 0.3)
    .sort((a, b) => (b[1].wrong / b[1].n) - (a[1].wrong / a[1].n))
    .slice(0, 12);
  if(!rows.length) return `<p class="small">Nothing is standing out yet. Once a few places have
    been played, anything being missed more than a third of the time will be listed here,
    with what to do about it.</p>`;
  return rows.map(([target, v]) => {
    const pct = Math.round(v.wrong / v.n * 100);
    const isSound = typeof PHON !== 'undefined' && PHON[target];
    const advice = isSound
      ? `Say it together, hold a mirror up: <b>${SOUND_LABEL[target]}</b>. Find three things
         around the house that start with it.`
      : `Write it on a card and put it on the fridge. Read it every time you walk past.`;
    return `<p class="small" style="padding:7px 0;border-bottom:1px solid var(--ghost)">
      <b style="color:var(--purple);font-size:15px">${isSound ? SOUND_LABEL[target] : target.toLowerCase()}</b>
      — missed ${pct}% of ${v.n} tries.<br><span style="color:var(--lav)">${advice}</span></p>`;
  }).join('');
}

async function recheckAudio(){ await WLAudio.rescan(); openDash() }
function toggleGate(){
  DB.masteryGate = DB.masteryGate === false;   // undefined counts as on
  save();
  const s = $('gateSwitch'); if(s) s.classList.toggle('on', DB.masteryGate !== false);
}
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
  injectStyles();
  /* Stop the pinch-zoom that wrecks a drawing canvas — but only over
     the canvas. Blocking it for the whole page stops a low-vision
     child enlarging the text, which is not a trade worth making. */
  document.addEventListener('gesturestart', e => {
    if(e.target && e.target.closest && e.target.closest('.pad-wrap, canvas')) e.preventDefault();
  });
  window.addEventListener('orientationchange', () => setTimeout(() => {
    const r = run.rounds[run.i];
    if(PAD && r && r.type === 'write') openPad(r.upper ? r.letter.toUpperCase() : r.letter.toLowerCase(), r.letter);
  }, 300));

  load();
  WLAudio.init();
  /* Which sounds have a real recording. Until this resolves the game
     simply uses the computer voice, so nothing waits on it. */
  Promise.resolve(WLAudio.report()).then(rep => {
    (rep && rep.rows || []).forEach(r => { if(r.kind === 'sounds' && r.found) RECORDED.add(r.name) });
  }).catch(()=>{});
}
/* Styles for the activities added since the stylesheets were written,
   kept here so css/wordland.css does not have to change. */
function injectStyles(){
  if($('wlExtraCss')) return;
  const st = document.createElement('style');
  st.id = 'wlExtraCss';
  st.textContent = `
    .blend-l[role="button"]{ cursor:pointer }
    .blend-l.silent{ opacity:.38; font-style:italic }
    .blend-l.silent::after{ content:"shh"; display:block; font-size:9px;
      letter-spacing:.5px; opacity:.8; margin-top:-2px }
    .wslot.stop{ min-width:18px; width:18px; border:none; background:none;
      font-weight:800; align-self:flex-end }
    .letter-btn{ font-size:clamp(17px, 7vw, 30px) }
    .row.wrap .letter-btn{ padding-left:14px; padding-right:14px; width:auto; min-width:56px }
    .cheer .t:empty{ display:none }
    .tick[title="Worth another go"]{ background:#FFC93C; color:#6B4E00 }
  `;
  document.head.appendChild(st);
}

if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
