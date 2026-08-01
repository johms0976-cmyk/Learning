/* Rebuilds js/wordland-data.js from the original, applying every
   curriculum fix. Run:  node build-data.js                       */

const fs = require('fs');
const orig = require('./data-orig.js')  /* the original js/wordland-data.js, copied here */;
const TABLE = require('./lesson-table.js');
const PHON  = require('./phon-table.js');

const notes = [];
const decide = [];
const L = n => (n.map - 1) * 10 + n.no;

/* ── 1. word-level corrections ───────────────────────────── */

/* words whose first sound is not the letter the lesson teaches */
const DROP_WORD = {
  4:["THREE"], 62:["THREE"], 39:["WHALE"], 119:["SHOUT"]
};
/* replacements so the picture rows stay full */
const ADD_WORD = {
  4:[{w:"TOAST",e:"🍞"}], 62:[{w:"TUB",e:"🛁"}],
  39:[{w:"WAGON",e:"🛒"}], 119:[{w:"SLIDE",e:"🛝"}]
};
/* pictures that did not say what they had to say */
const FIX_EMOJI = {
  MAT:"🟫", THORN:"🥀", JAM:"🍯", TRAY:"🥡", MAN:"👨",
  MEAT:"🥩", MODE:"⚙️"
};
/* words carried in `hfw` that are not high-frequency words.
   They stay in the lesson as vocabulary; they leave the sight
   game, where they were being matched against "at" and "man". */
const NOT_HFW = new Set(["DELICIOUS","EXCITED","PURPLE","ORANGE","SATURDAY",
  "EVERYWHERE","SOMEWHERE","WORRIED","PERFECT","SCARED","CLOTHES","FLOWER",
  "GREY","BROWN","WHITE","GREEN","BLACK","BLUE","HUNGRY","ASLEEP","TINY",
  "SUDDENLY","THANKS","TOGETHER","ANYTHING","CAUGHT","BOSSY","SEVEN","NINE",
  "EIGHT","THREE","TWO","SWAM","BIKE","SHOP","TABLE","BIRD","STOP","GOT",
  "TOOK","NEED","WALK","GROW","WATER","CLEAN","CHOOSE","EASY","HIGH","WORK",
  "COUNT","ABOVE","NIGHT","HOURS","OUTSIDE","BROTHER","ANOTHER","PARK",
  "TODAY","MADE","TRIED","BUY","NEW","GIRL","BOY","HOME","NONE","FINE",
  "MAKES","ASKED","LIKES","WANTS","LIVES","GOES","HAPPY","BABY","DAY","WAY",
  "TEN","DOWN","UP","NOW","INTO","OFF","OVER","TOO","MUCK","PUCK"]);
/* family members with no onset once the rime is removed */
const DROP_FAMILY = { 38:["OX"], 70:["US"], 98:["APE"], 118:["STORK"] };

/* ── 2. plan repair ──────────────────────────────────────── */

/* activities that only make sense while a letter's sound is new */
const ALPHABET_LEVEL = new Set(
  ["sound","beginSound","starts","tapAll","hunt","caseMatch","match","write"]);

/* initial-letter work still belongs in a word-family lesson (it IS the
   onset), but not in a magic-e, vowel-team, suffix or vowel-contrast
   lesson, where the interesting part of the word is not the first letter. */
const NO_INITIAL = new Set(["pattern","ending","vowels","skill"]);

/* what to use instead, per lesson kind, in order */
const SUBSTITUTE = {
  family:  ["machine","blendIt","spell","rhyme","listen","readLine","sentence","spell"],
  blend:   ["machine","blendIt","spell","rhyme","listen","readLine","sentence","spell"],
  pattern: ["blendIt","spell","machine","rhyme","listen","readLine","sentence","spell"],
  vowels:  ["vowelPick","blendIt","spell","vowelPick","listen","readLine","sentence","spell"],
  ending:  ["addEnding","blendIt","spell","addEnding","rhyme","readLine","sentence","spell"],
  sight:   ["sight","blendIt","listen","spell","readLine","pickWord","sentence","sight"],
  skill:   ["alphabet","caseMatch","match","spell","blendIt","readLine","sentence","alphabet"],
  review:  ["blendIt","spell","machine","rhyme","listen","readLine","pickWord","sentence"],
  grapheme:["sound","beginSound","tapAll","hunt","listen","spell","blendIt","sentence"],
  digraph: ["sound","beginSound","tapAll","machine","blendIt","spell","listen","sentence"]
};

const WRITABLE = /^[A-Z]$/;

function repairPlan(node, row){
  const kind = row.kind;
  const pool = SUBSTITUTE[kind] || SUBSTITUTE.review;
  let at = 0;
  const nextSub = () => pool[at++ % pool.length];

  const canWrite = (row.teaches || []).some(t => WRITABLE.test(t));
  const alphabetOK = kind === "grapheme" || kind === "digraph";

  const out = node.plan.map(entry => {
    let [type, flavour] = String(entry).split(":");
    if(type === "trace") type = "write";

    /* the writing round needs a single letter with a stroke form */
    if(type === "write"){
      if(canWrite) return flavour ? "write:" + flavour : "write";
      notes.push(`L${L(node)} write → ${pool[at % pool.length]} (teaches ${(row.teaches||[]).join(",")||"no new letter"} — nothing to trace)`);
      return nextSub();
    }
    /* the word-family machine needs a real rime */
    if(type === "machine" && !row.rime && !row.onset){
      notes.push(`L${L(node)} machine → ${pool[at % pool.length]} (word list is not a rime family)`);
      return nextSub();
    }
    if(type === "initial" && NO_INITIAL.has(kind)){
      notes.push(`L${L(node)} initial → ${pool[at % pool.length]} (${kind} lesson — the first letter is not the point)`);
      return nextSub();
    }
    /* alphabet-level work on a lesson that is past the alphabet */
    if(ALPHABET_LEVEL.has(type) && !alphabetOK){
      notes.push(`L${L(node)} ${type} → ${pool[at % pool.length]} (${kind} lesson, not a new letter)`);
      return nextSub();
    }
    return entry;
  });

  /* a lesson should not repeat the same activity three times */
  const seen = {};
  let plan = out.map(e => {
    const t = String(e).split(":")[0];
    seen[t] = (seen[t] || 0) + 1;
    if(seen[t] > 3){ const s = nextSub(); seen[s] = (seen[s]||0)+1; return s }
    return e;
  });

  /* soft c and soft g need the activity that is actually about them:
     does this letter say /k/ or /s/ here? */
  if(row.sortTwo){
    let put = 0;
    plan = plan.map(e => {
      const t = String(e).split(":")[0];
      if(put < 2 && (t === "listen" || t === "rhyme" || t === "blend")){ put++; return "sortTwo" }
      return e;
    });
    if(!put) plan[1] = "sortTwo";
  }

  /* and the same activity twice in a row is dull — swap it along */
  for(let i = 1; i < plan.length; i++){
    if(String(plan[i]).split(":")[0] === String(plan[i-1]).split(":")[0]){
      for(let k = i + 1; k < plan.length; k++){
        if(String(plan[k]).split(":")[0] !== String(plan[i]).split(":")[0] &&
           String(plan[k]).split(":")[0] !== String(plan[i-1]).split(":")[0]){
          const t = plan[i]; plan[i] = plan[k]; plan[k] = t; break;
        }
      }
    }
  }
  return plan;
}

/* ── 3. rebuild every node ───────────────────────────────── */

const maps = orig.MAPS.map(m => ({ ...m, nodes: m.nodes.map(n0 => {
  const n = JSON.parse(JSON.stringify(n0));
  n.map = m.no;
  const les = L(n);
  const row = TABLE[les];
  if(!row) throw new Error("no table row for lesson " + les);

  /* vocabulary corrections */
  if(DROP_WORD[les]){
    n.vocab = n.vocab.filter(v => !DROP_WORD[les].includes(v.w));
    notes.push(`L${les} removed ${DROP_WORD[les].join(", ")} — does not begin with the sound taught`);
  }
  if(ADD_WORD[les]) n.vocab = n.vocab.concat(ADD_WORD[les]);
  if(DROP_FAMILY[les]){
    n.family = n.family.filter(v => !DROP_FAMILY[les].includes(v.w));
    notes.push(`L${les} removed ${DROP_FAMILY[les].join(", ")} from the family — no onset left once the rime comes off`);
  }
  [n.vocab, n.words, n.family].forEach(list =>
    list.forEach(v => { if(FIX_EMOJI[v.w]) v.e = FIX_EMOJI[v.w] }));

  /* sight words that are not sight words become vocabulary */
  const moved = n.hfw.filter(h => NOT_HFW.has(h.w));
  if(moved.length){
    n.hfw = n.hfw.filter(h => !NOT_HFW.has(h.w));
    notes.push(`L${les} moved ${moved.map(h=>h.w.toLowerCase()).join(", ")} out of the sight-word game`);
  }

  /* curriculum spine */
  n.kind    = row.kind;
  n.teaches = row.teaches !== undefined ? row.teaches : [];
  if(row.rime)     n.rime    = row.rime;
  if(row.onset)    n.onset   = row.onset;
  if(row.suffix){  n.suffix  = row.suffix; n.suffixSound = row.suffixSound }
  if(row.position) n.position = row.position;
  if(row.pattern)  n.pattern  = row.pattern;
  if(row.skill)    n.skill    = row.skill;
  if(row.sortTwo)  n.sortTwo  = row.sortTwo;
  if(row.machine === false) n.machine = false;
  if(row.note) decide.push(`L${les} ${n.region} — ${row.note}. Words: ${n.family.map(v=>v.w.toLowerCase()).join(" ")}`);

  /* check the declared rime actually fits every word */
  if(n.rime && n.family.length){
    const bad = n.family.filter(v =>
      !v.w.toUpperCase().endsWith(n.rime) || v.w.length <= n.rime.length);
    if(bad.length){
      decide.push(`L${les} ${n.region} — these do not fit -${n.rime.toLowerCase()}: ${bad.map(v=>v.w.toLowerCase()).join(" ")}`);
      n.family = n.family.filter(v => !bad.includes(v));
    }
  }
  if(n.onset && n.family.length){
    const bad = n.family.filter(v => !v.w.toUpperCase().startsWith(n.onset));
    if(bad.length) n.family = n.family.filter(v => !bad.includes(v));
  }

  n.plan = repairPlan(n, row);
  delete n.map;
  return n;
})}));

/* ── 4. write the file ───────────────────────────────────── */

const j = o => JSON.stringify(o);
const nodeSrc = n => {
  const parts = [
    `no:${n.no}, region:${j(n.region)}, art:${j(n.art)}`,
    ` grad:${j(n.grad)}`,
    ` kind:${j(n.kind)}, teaches:${j(n.teaches)}${n.position?`, position:${j(n.position)}`:""}` +
      `${n.rime?`, rime:${j(n.rime)}`:""}${n.onset?`, onset:${j(n.onset)}`:""}` +
      `${n.suffix?`, suffix:${j(n.suffix)}, suffixSound:${j(n.suffixSound)}`:""}` +
      `${n.pattern?`, pattern:${j(n.pattern)}`:""}${n.skill?`, skill:${j(n.skill)}`:""}` +
      `${n.machine===false?", machine:false":""}${n.sortTwo?`, sortTwo:${j(n.sortTwo)}`:""}`,
    ` letters:${j(n.letters)}, confuse:${j(n.confuse||[])}, teach:${j(n.teach||"")}`,
    ` vocab:${j(n.vocab)}`,
    ` words:${j(n.words)}`,
    ` family:${j(n.family)}`,
    ` hfw:${j(n.hfw)}`,
    n.sentences ? ` sentences:${j(n.sentences)}` : null,
    ` plan:${j(n.plan)}`,
    ` story:${j(n.story)}`
  ].filter(Boolean);
  return "{" + parts.join(",\n") + "}";
};

let out = fs.readFileSync("header.txt", "utf8");
out += "\nconst PHON = " + JSON.stringify(PHON, null, 1) + ";\n\n";
out += `/* Legacy filename map — every recording already made still resolves.
   One change is needed in js/wordland-audio.js: the filename lookup
   must read SOUND_FILE[letter] instead of SOUND[letter].          */
const SOUND_FILE = {};
Object.keys(PHON).forEach(k => SOUND_FILE[k] = PHON[k].file);

/* What the child SEES:  /t/ , never "tuh"  */
const SOUND_LABEL = {};
Object.keys(PHON).forEach(k => SOUND_LABEL[k] = PHON[k].say);

/* The sounds no speech engine can say without adding a vowel.
   These must be recorded; the dashboard lists them first.        */
const MUST_RECORD = Object.keys(PHON).filter(k => PHON[k].tts === null);

`;
out += fs.readFileSync("keyword.txt", "utf8") + "\n";
out += `
/* What the computer voice says when there is no recording.
   For a stop consonant there is no honest answer, so instead of a
   schwa we name the keyword and let the child hear the sound at the
   front of it. Record these and this line never runs.            */
const SOUND = {};
Object.keys(PHON).forEach(k => {
  SOUND[k] = PHON[k].tts !== null ? PHON[k].tts
           : (KEYWORD[k] ? "the first sound in " + KEYWORD[k].w.toLowerCase() : k);
});

`;


maps.forEach((m, i) => {
  out += `\n/* ════════ MAP ${m.no} · ${m.lessons} · ${m.name} ════════ */\n`;
  out += `const MAP${m.no} = [\n\n` + m.nodes.map(nodeSrc).join(",\n\n") + `\n];\n`;
});

out += "\nconst MAPS = [\n" + maps.map(m =>
  ` {no:${m.no}, name:${j(m.name)}, art:${j(m.art)}, level:${j(m.level)},\n` +
  `  lessons:${j(m.lessons)}, grad:${j(m.grad)},\n` +
  `  focus:${j(m.focus)}, extra:${j(m.extra)},\n` +
  `  blurb:${j(m.blurb)},\n  nodes:MAP${m.no}}`
).join(",\n\n") + "\n];\n\n";
out += fs.readFileSync("footer.txt", "utf8");

fs.writeFileSync("out/wordland-data.js", out);
fs.writeFileSync("out/CURRICULUM-CHANGES.txt",
  "AUTOMATIC REPAIRS\n=================\n\n" + notes.join("\n") +
  "\n\n\nNEEDS YOUR DECISION\n===================\n\n" + decide.join("\n") + "\n");

console.log("wrote out/wordland-data.js");
console.log("automatic repairs:", notes.length);
console.log("needs your decision:", decide.length);
