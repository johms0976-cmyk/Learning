/* ============================================================
   WORD LAND · CONTENT
   ------------------------------------------------------------
   Everything the child sees lives here. No game logic.

   Content follows ABC Reading Eggs, Level 1–3, Maps 1–12
   (Lessons 1–120): phonic letters and sounds, phonically
   decodable words, high-frequency words and vocabulary.

   THIS FILE IS GENERATED. Edit lesson-table.js / phon-table.js
   and run `node build-data.js` — otherwise your changes will be
   overwritten. CURRICULUM-CHANGES.txt lists every repair made
   and every lesson still needing a decision.

   Each lesson now declares what it actually teaches:

     kind      grapheme | digraph | family | blend | pattern |
               vowels | ending | sight | skill | review
     teaches   the grapheme(s) genuinely new here
     rime      the ending the word-family machine swaps onsets
               onto. Onsets are whatever is left, so cl- and
               spl- work, not just single letters.
     onset     for sh + ed/ell/ip/op families
     position  "final" where the sound is taught at the END of a
               word (x, ng) — initial-sound games are wrong there
     machine   false where the words are not a rime family

   The engine reads `kind` to decide which activities a lesson is
   allowed to use. That is what stops Lesson 94 asking a child to
   tap pictures beginning with k.
   ============================================================ */

const PHON = {
 "M": {
  "file": "mmm",
  "tts": "mmmm",
  "say": "/m/",
  "type": "cont"
 },
 "S": {
  "file": "sss",
  "tts": "sssss",
  "say": "/s/",
  "type": "cont"
 },
 "F": {
  "file": "fff",
  "tts": "ffff",
  "say": "/f/",
  "type": "cont"
 },
 "N": {
  "file": "nnn",
  "tts": "nnnn",
  "say": "/n/",
  "type": "cont"
 },
 "R": {
  "file": "rrr",
  "tts": "rrrr",
  "say": "/r/",
  "type": "cont"
 },
 "L": {
  "file": "lll",
  "tts": "llll",
  "say": "/l/",
  "type": "cont"
 },
 "V": {
  "file": "vvv",
  "tts": "vvvv",
  "say": "/v/",
  "type": "cont"
 },
 "Z": {
  "file": "zzz",
  "tts": "zzzz",
  "say": "/z/",
  "type": "cont"
 },
 "H": {
  "file": "huh",
  "tts": "hhh",
  "say": "/h/",
  "type": "cont"
 },
 "W": {
  "file": "wuh",
  "tts": "wwww",
  "say": "/w/",
  "type": "cont"
 },
 "Y": {
  "file": "yuh",
  "tts": "yyyy",
  "say": "/y/",
  "type": "cont"
 },
 "T": {
  "file": "tuh",
  "tts": null,
  "say": "/t/",
  "type": "stop"
 },
 "B": {
  "file": "buh",
  "tts": null,
  "say": "/b/",
  "type": "stop"
 },
 "C": {
  "file": "kuh",
  "tts": null,
  "say": "/k/",
  "type": "stop"
 },
 "K": {
  "file": "kuh",
  "tts": null,
  "say": "/k/",
  "type": "stop"
 },
 "D": {
  "file": "duh",
  "tts": null,
  "say": "/d/",
  "type": "stop"
 },
 "G": {
  "file": "guh",
  "tts": null,
  "say": "/g/",
  "type": "stop"
 },
 "P": {
  "file": "puh",
  "tts": null,
  "say": "/p/",
  "type": "stop"
 },
 "J": {
  "file": "juh",
  "tts": null,
  "say": "/j/",
  "type": "stop"
 },
 "Q": {
  "file": "kwuh",
  "tts": null,
  "say": "/kw/",
  "type": "stop"
 },
 "X": {
  "file": "ks",
  "tts": null,
  "say": "/ks/",
  "type": "stop"
 },
 "CH": {
  "file": "chh",
  "tts": null,
  "say": "/ch/",
  "type": "stop",
  "digraph": true
 },
 "A": {
  "file": "aah",
  "tts": "aaa",
  "say": "/a/",
  "type": "vowel"
 },
 "E": {
  "file": "eh",
  "tts": "eh",
  "say": "/e/",
  "type": "vowel"
 },
 "I": {
  "file": "ih",
  "tts": "ih",
  "say": "/i/",
  "type": "vowel"
 },
 "O": {
  "file": "oh",
  "tts": "awe",
  "say": "/o/",
  "type": "vowel",
  "fixed": "was taught as 'oh' — that is LONG o. Short o as in hot."
 },
 "U": {
  "file": "uh",
  "tts": "uh",
  "say": "/u/",
  "type": "vowel"
 },
 "SH": {
  "file": "shh",
  "tts": "shhh",
  "say": "/sh/",
  "type": "cont",
  "digraph": true
 },
 "TH": {
  "file": "thh",
  "tts": "thhh",
  "say": "/th/",
  "type": "cont",
  "digraph": true
 },
 "NG": {
  "file": "ing",
  "tts": "nnng",
  "say": "/ng/",
  "type": "cont",
  "digraph": true
 },
 "EE": {
  "file": "eee",
  "tts": "eee",
  "say": "/ee/",
  "type": "vowel",
  "digraph": true
 },
 "OO": {
  "file": "ooo",
  "tts": "oooo",
  "say": "/oo/",
  "type": "vowel",
  "digraph": true
 },
 "EA": {
  "file": "eee",
  "tts": "eee",
  "say": "/ea/",
  "type": "vowel",
  "digraph": true
 },
 "ER": {
  "file": "er",
  "tts": "err",
  "say": "/er/",
  "type": "vowel",
  "digraph": true
 },
 "IR": {
  "file": "er",
  "tts": "err",
  "say": "/ir/",
  "type": "vowel",
  "digraph": true
 },
 "OR": {
  "file": "or",
  "tts": "or",
  "say": "/or/",
  "type": "vowel",
  "digraph": true
 },
 "OA": {
  "file": "oh",
  "tts": "oh",
  "say": "/oa/",
  "type": "vowel",
  "digraph": true
 },
 "IGH": {
  "file": "eye",
  "tts": "eye",
  "say": "/igh/",
  "type": "vowel",
  "digraph": true
 },
 "AY": {
  "file": "ay",
  "tts": "ay",
  "say": "/ay/",
  "type": "vowel",
  "digraph": true
 }
};

/* Legacy filename map — every recording already made still resolves.
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

/* Fallback picture for a letter that heads no word in a place */
const KEYWORD = {
  A:{w:"APPLE",e:"🍎"}, B:{w:"BALL",e:"⚽"},  C:{w:"CAT",e:"🐱"},
  F:{w:"FISH",e:"🐟"},  I:{w:"INK",e:"🖊️"},  M:{w:"MOON",e:"🌙"},
  S:{w:"SUN",e:"☀️"},   T:{w:"TENT",e:"⛺"},  N:{w:"NEST",e:"🪺"},
  P:{w:"PIG",e:"🐷"},   H:{w:"HAT",e:"🎩"},  R:{w:"RING",e:"💍"},
  Z:{w:"ZEBRA",e:"🦓"}, E:{w:"EGG",e:"🥚"},  EE:{w:"BEE",e:"🐝"},
  V:{w:"VAN",e:"🚐"},   D:{w:"DOG",e:"🐕"},  J:{w:"JAM",e:"🍓"},
  O:{w:"OCTOPUS",e:"🐙"}, Q:{w:"QUEEN",e:"👑"},
  G:{w:"GOAT",e:"🐐"},  L:{w:"LEAF",e:"🍃"}, K:{w:"KITE",e:"🪁"},
  Y:{w:"YOYO",e:"🪀"},  X:{w:"BOX",e:"📦"},  W:{w:"WEB",e:"🕸️"},
  U:{w:"UMBRELLA",e:"☂️"},
  SH:{w:"SHIP",e:"🚢"},  CH:{w:"CHIPS",e:"🍟"}, TH:{w:"THORN",e:"🌵"},
  NG:{w:"RING",e:"💍"},  OO:{w:"MOON",e:"🌙"},  EA:{w:"LEAF",e:"🍃"},
  ER:{w:"LETTER",e:"✉️"}, OR:{w:"CORN",e:"🌽"}, OA:{w:"BOAT",e:"⛵"},
  IR:{w:"BIRD",e:"🐦"},  IGH:{w:"LIGHT",e:"🔦"}, AY:{w:"TRAY",e:"🍽️"}
};

/* Letters offered as wrong answers */
const LETTER_POOL = ["M","S","A","T","B","C","F","I","N","P","H","R","Z","E",
                     "D","G","L","J","V","O","Q","K","W","X","Y","U"];

/* ════════════════════════════════════════════════════════════
   MAP 1 · Lessons 1–10 · m s a t b c f i
   The word list here is unchanged, so recordings already made


/* What the computer voice says when there is no recording.
   For a stop consonant there is no honest answer, so instead of a
   schwa we name the keyword and let the child hear the sound at the
   front of it. Record these and this line never runs.            */
const SOUND = {};
Object.keys(PHON).forEach(k => {
  SOUND[k] = PHON[k].tts !== null ? PHON[k].tts
           : (KEYWORD[k] ? "the first sound in " + KEYWORD[k].w.toLowerCase() : k);
});


/* ════════ MAP 1 · Lessons 1–10 · The Lost Letters ════════ */
const MAP1 = [

{no:1, region:"Mossy Meadow", art:"🌙",
 grad:"linear-gradient(135deg,#8FCF8A,#5EA36B)",
 kind:"grapheme", teaches:["M"],
 letters:["M"], confuse:["N","W","H"], teach:"the sound m",
 vocab:[{"w":"MOON","e":"🌙"},{"w":"MONKEY","e":"🐒"},{"w":"MOUSE","e":"🐭"},{"w":"MOP","e":"🧹"},{"w":"MEAT","e":"🥩"},{"w":"MAN","e":"👨"},{"w":"MUM","e":"👩"},{"w":"MILK","e":"🥛"}],
 words:[],
 family:[],
 hfw:[],
 plan:["sound","beginSound","write:l","starts","tapAll","listen","match","hunt","caseMatch","write:u"],
 story:{"t":"Zib Lands in the Moss","art":"🌙🐒","lines":["The wind blew Zib into the *moss*.","A *monkey* and a *mouse* were hiding there.","'*Mmm*,' said the monkey. 'That is my sound!'","Zib put *M* in the bag. One letter home."]}},

{no:2, region:"Silver Sands", art:"🐚",
 grad:"linear-gradient(135deg,#8FD3E8,#4A9EC4)",
 kind:"grapheme", teaches:["S"],
 letters:["S"], confuse:["M","Z","C"], teach:"the sound s",
 vocab:[{"w":"SUN","e":"☀️"},{"w":"SNAKE","e":"🐍"},{"w":"SOCK","e":"🧦"},{"w":"SEED","e":"🌱"},{"w":"SIX","e":"6️⃣"},{"w":"SOAP","e":"🧼"},{"w":"SPOON","e":"🥄"},{"w":"SNAIL","e":"🐌"},{"w":"SANDWICH","e":"🥪"},{"w":"STRAWBERRY","e":"🍓"}],
 words:[],
 family:[],
 hfw:[],
 plan:["sound","beginSound","write:l","tapAll","starts","listen","hunt","match","caseMatch","write:u"],
 story:{"t":"The Sound in the Sand","art":"🐚🐍","lines":["Zib walked out onto the *sand*.","The *sun* was hot. A *snail* went slow.","A *snake* hissed, '*Sss*, that one is mine!'","Now Zib had *M* and *S*."]}},

{no:3, region:"Apple Hollow", art:"🍎",
 grad:"linear-gradient(135deg,#FF9A8B,#E5564B)",
 kind:"grapheme", teaches:["A","I"],
 letters:["A","I"], confuse:["M","S","T","E"], teach:"the sounds a and i",
 vocab:[{"w":"APPLE","e":"🍎"},{"w":"ANT","e":"🐜"},{"w":"ARROW","e":"🏹"},{"w":"ASTRONAUT","e":"👨‍🚀"},{"w":"AMBULANCE","e":"🚑"},{"w":"ALIEN","e":"👽"},{"w":"INK","e":"🖊️"},{"w":"IGUANA","e":"🦎"},{"w":"JAM","e":"🍯"},{"w":"LAMP","e":"💡"},{"w":"LAMB","e":"🐑"},{"w":"CLAM","e":"🦪"}],
 words:[{"w":"SAM","e":"👦","h":"a boy"},{"w":"AM","e":"🙋","h":"I am"}],
 family:[],
 hfw:[{"w":"I","s":"I am Sam."},{"w":"AM","s":"I am here."}],
 plan:["sound","beginSound","write:l","hunt","starts","listen","sight","match","initial","write:u"],
 story:{"t":"A Boy Called Sam","art":"🍎👦","lines":["In *Apple* Hollow, Zib met a boy.","'*I* *am* *Sam*,' said the boy.","Sam had *jam* on his chin!","*A* and *I* jumped into the bag."]}},

{no:4, region:"Tall Tree Trail", art:"🌲",
 grad:"linear-gradient(135deg,#A0E8AF,#41916C)",
 kind:"grapheme", teaches:["T"],
 letters:["T"], confuse:["F","I","L"], teach:"the sound t",
 vocab:[{"w":"TENT","e":"⛺"},{"w":"TIGER","e":"🐯"},{"w":"TRAIN","e":"🚂"},{"w":"TRACTOR","e":"🚜"},{"w":"TURTLE","e":"🐢"},{"w":"TEETH","e":"🦷"},{"w":"TOMATO","e":"🍅"},{"w":"TOY","e":"🧸"},{"w":"TICKET","e":"🎟️"},{"w":"TV","e":"📺"},{"w":"TOAST","e":"🍞"}],
 words:[],
 family:[],
 hfw:[],
 plan:["sound","beginSound","write:l","tapAll","starts","listen","hunt","match","caseMatch","write:u"],
 story:{"t":"Ten Tall Trees","art":"🌲🐯","lines":["Sam and Zib walked the *tall* *tree* trail.","A *tiger* slept beside a *tent*.","*Tuh*, *tuh*, went the little *train*.","*T* was found. Four letters now!"]}},

{no:5, region:"Cat Cave", art:"🐱",
 grad:"linear-gradient(135deg,#FFC97B,#E08A2E)",
 kind:"family", teaches:[], rime:"AT",
 letters:["A","T"], confuse:["M","S","B","C"], teach:"the -at family",
 vocab:[{"w":"CAT","e":"🐱"},{"w":"BAT","e":"🦇"},{"w":"HAT","e":"🎩"},{"w":"MAT","e":"🟫"},{"w":"RAT","e":"🐀"}],
 words:[{"w":"AT","e":"🎯","h":"at the mat"},{"w":"SAT","e":"🪑","h":"the cat sat"}],
 family:[{"w":"BAT","e":"🦇"},{"w":"CAT","e":"🐱"},{"w":"HAT","e":"🎩"},{"w":"MAT","e":"🟫"},{"w":"RAT","e":"🐀"},{"w":"SAT","e":"🪑"}],
 hfw:[{"w":"AT","s":"The cat is at the mat."},{"w":"A","s":"A cat sat."}],
 plan:["machine","blendIt","machine","rhyme","initial","blend","spell","sight","spell","rhyme"],
 story:{"t":"The Cat on the Mat","art":"🐱🧶","lines":["Deep in the cave, a *cat* *sat* on a *mat*.","A *bat* and a *rat* sat down too.","'We all end the same,' said the cat. '*-at*!'","*Bat*, *cat*, *hat*, *mat*, *rat*, *sat*."]}},

{no:6, region:"Bumble Bridge", art:"🐝",
 grad:"linear-gradient(135deg,#FFE066,#E0A800)",
 kind:"grapheme", teaches:["B"],
 letters:["B"], confuse:["D","P","M"], teach:"the sound b",
 vocab:[{"w":"BEE","e":"🐝"},{"w":"BALL","e":"⚽"},{"w":"BOOK","e":"📖"},{"w":"BEAR","e":"🐻"},{"w":"BOAT","e":"⛵"},{"w":"BREAD","e":"🍞"},{"w":"BELL","e":"🔔"},{"w":"BONE","e":"🦴"},{"w":"BAG","e":"👜"},{"w":"BATH","e":"🛁"},{"w":"BABY","e":"👶"},{"w":"BALLOON","e":"🎈"}],
 words:[{"w":"BAT","e":"🦇","h":"it flies at night"}],
 family:[{"w":"BAT","e":"🦇"},{"w":"CAT","e":"🐱"},{"w":"HAT","e":"🎩"}],
 hfw:[{"w":"AT","s":"The bee is at the bridge."}],
 plan:["sound","beginSound","write:l","tapAll","starts","caseMatch","initial","blend","hunt","write:u"],
 story:{"t":"Bees on the Bridge","art":"🐝🌉","lines":["A wooden *bridge* buzzed with *bees*.","A *bear* wanted the *bread*. So did the bees!","'*Buh*, *buh*, *bear*,' laughed Sam.","*B* went into the bag."]}},

{no:7, region:"Cloud Cove", art:"☁️",
 grad:"linear-gradient(135deg,#C3B7F5,#7B68C9)",
 kind:"grapheme", teaches:["C"],
 letters:["C"], confuse:["S","K","O"], teach:"the sound c",
 vocab:[{"w":"CAR","e":"🚗"},{"w":"CUP","e":"☕"},{"w":"COW","e":"🐄"},{"w":"CRAB","e":"🦀"},{"w":"CAMEL","e":"🐫"},{"w":"CARROT","e":"🥕"},{"w":"CORN","e":"🌽"},{"w":"COAT","e":"🧥"},{"w":"CAMERA","e":"📷"},{"w":"CAN","e":"🥫"},{"w":"CAP","e":"🧢"}],
 words:[{"w":"CAT","e":"🐱","h":"it says meow"}],
 family:[{"w":"CAT","e":"🐱"},{"w":"BAT","e":"🦇"},{"w":"HAT","e":"🎩"}],
 hfw:[{"w":"A","s":"A cow in a car!"}],
 plan:["sound","beginSound","write:l","tapAll","starts","listen","initial","blend","rhyme","write:u"],
 story:{"t":"A Crab in a Cup","art":"☁️🦀","lines":["The *cove* was full of soft *clouds*.","A *crab* was fast asleep in a *cup*!","A *cow* drove past in a *car*. '*Kuh*!'","*C* was safe in the bag."]}},

{no:8, region:"Fox Forest", art:"🦊",
 grad:"linear-gradient(135deg,#FFA07A,#D2601A)",
 kind:"grapheme", teaches:["F"],
 letters:["F"], confuse:["T","E","P"], teach:"the sound f",
 vocab:[{"w":"FOX","e":"🦊"},{"w":"FISH","e":"🐟"},{"w":"FROG","e":"🐸"},{"w":"FIRE","e":"🔥"},{"w":"FLOWER","e":"🌸"},{"w":"FEATHER","e":"🪶"},{"w":"FOOT","e":"🦶"},{"w":"FLY","e":"🪰"}],
 words:[{"w":"FAT","e":"🐷","h":"not thin"}],
 family:[{"w":"FAT","e":"🐷"},{"w":"CAT","e":"🐱"},{"w":"BAT","e":"🦇"},{"w":"MAT","e":"🟫"},{"w":"SAT","e":"🪑"},{"w":"HAT","e":"🎩"},{"w":"RAT","e":"🐀"}],
 hfw:[{"w":"AT","s":"The fox is at the fire."}],
 plan:["sound","beginSound","write:l","sound","starts","listen","initial","blend","spell","write:u"],
 story:{"t":"The Fox by the Fire","art":"🦊🔥","lines":["A *fox* sat by a warm *fire*.","A *fish* and a *frog* sat down too.","'*Fff*,' said the fire. 'That is my sound.'","*F* was the seventh letter."]}},

{no:9, region:"Sam's Camp", art:"🏕️",
 grad:"linear-gradient(135deg,#96E6A1,#3FA34D)",
 kind:"family", teaches:[], rime:"AT",
 letters:["A","M","T"], confuse:["S","B","C","F"], teach:"putting the sounds together",
 vocab:[{"w":"APPLE","e":"🍎"},{"w":"MOON","e":"🌙"},{"w":"SUN","e":"☀️"},{"w":"TENT","e":"⛺"}],
 words:[{"w":"AM","e":"🙋","h":"I am"},{"w":"SAM","e":"👦","h":"a boy"},{"w":"CAT","e":"🐱","h":"it says meow"},{"w":"BAT","e":"🦇","h":"it flies at night"},{"w":"FAT","e":"🐷","h":"not thin"},{"w":"MAT","e":"🟫","h":"you wipe your feet on it"}],
 family:[{"w":"BAT","e":"🦇"},{"w":"CAT","e":"🐱"},{"w":"FAT","e":"🐷"},{"w":"HAT","e":"🎩"},{"w":"MAT","e":"🟫"},{"w":"RAT","e":"🐀"}],
 hfw:[{"w":"I","s":"I am Sam."},{"w":"A","s":"A cat sat."}],
 plan:["machine","alphabet","blendIt","spell","initial","blend","rhyme","sight","machine","spell"],
 story:{"t":"Camp of Words","art":"🏕️✏️","lines":["At camp, *Sam* made words in the sand.","*I* *am* *Sam*. *A* *cat* *sat*.","*Bat*, *mat*, *fat*, *hat* — all of them!","One place left. The tower is close."]}},

{no:10, region:"Wizard's Tower", art:"🏰",
 grad:"linear-gradient(135deg,#B39DDB,#5E35B1)",
 kind:"review", teaches:[],
 letters:["M","S","A","T","B","C","F","I"], confuse:["N","P","H","R"], teach:"every letter you have found",
 vocab:[{"w":"APPLE","e":"🍎"},{"w":"MOON","e":"🌙"},{"w":"SUN","e":"☀️"},{"w":"TENT","e":"⛺"},{"w":"BEE","e":"🐝"},{"w":"CAR","e":"🚗"},{"w":"FOX","e":"🦊"},{"w":"BOAT","e":"⛵"},{"w":"TIGER","e":"🐯"}],
 words:[{"w":"AM","e":"🙋","h":"I am"},{"w":"SAM","e":"👦","h":"a boy"},{"w":"AT","e":"🎯","h":"at the mat"},{"w":"BAT","e":"🦇","h":"it flies at night"},{"w":"CAT","e":"🐱","h":"it says meow"},{"w":"FAT","e":"🐷","h":"not thin"},{"w":"MAT","e":"🟫","h":"you wipe your feet on it"},{"w":"SAT","e":"🪑","h":"the cat sat down"}],
 family:[{"w":"BAT","e":"🦇"},{"w":"CAT","e":"🐱"},{"w":"FAT","e":"🐷"},{"w":"HAT","e":"🎩"},{"w":"MAT","e":"🟫"},{"w":"RAT","e":"🐀"},{"w":"SAT","e":"🪑"}],
 hfw:[{"w":"I","s":"I am Sam."},{"w":"AM","s":"I am here."},{"w":"AT","s":"The cat is at the mat."},{"w":"A","s":"A cat sat."}],
 plan:["blendIt","spell","machine","spell","initial","blend","rhyme","sight","rhyme","listen"],
 story:{"t":"The Spellbook Opens","art":"🏰📖","lines":["At the top of the tower lay the big book.","Zib tipped out *M*, *S*, *A*, *T*, *B*, *C*, *F*, *I*.","The book glowed. Words came back to Word Land!","'More letters are lost,' said Zib. 'Ready?'"]}}
];

/* ════════ MAP 2 · Lessons 11–20 · Words That Hold Hands ════════ */
const MAP2 = [

{no:1, region:"Nest Ridge", art:"🪺",
 grad:"linear-gradient(135deg,#A8D8B9,#4E8C6A)",
 kind:"grapheme", teaches:["N"],
 letters:["N"], confuse:["M","H","U"], teach:"the sound n",
 vocab:[{"w":"NEST","e":"🪺"},{"w":"NOSE","e":"👃"},{"w":"NUT","e":"🥜"},{"w":"NET","e":"🥅"},{"w":"NAIL","e":"🔩"},{"w":"NEEDLE","e":"🪡"},{"w":"NURSE","e":"👩‍⚕️"},{"w":"NINE","e":"9️⃣"}],
 words:[],
 family:[],
 hfw:[{"w":"I","s":"I can see a nest."}],
 plan:["sound","beginSound","write:l","tapAll","starts","listen","hunt","match","sight","write:u"],
 story:{"t":"The Nest on the Ridge","art":"🪺🐦","lines":["Beyond the tower, a high ridge climbed into the sky.","*Nine* eggs sat in one round *nest*.","'*Nnn*,' hummed the bird. '*Nest*. *Nose*. *Nut*.'","*I* can see it, said Zib. *N* was letter nine."]}},

{no:2, region:"Peach Path", art:"🍑",
 grad:"linear-gradient(135deg,#FFB3A7,#E06C5B)",
 kind:"grapheme", teaches:["P"],
 letters:["P"], confuse:["B","D","R"], teach:"the sound p",
 vocab:[{"w":"PIG","e":"🐷"},{"w":"PEACH","e":"🍑"},{"w":"PEAR","e":"🍐"},{"w":"PEN","e":"🖊️"},{"w":"PENCIL","e":"✏️"},{"w":"PIE","e":"🥧"},{"w":"PLATE","e":"🍽️"},{"w":"POTATO","e":"🥔"},{"w":"PAN","e":"🍳"},{"w":"PEANUT","e":"🥜"},{"w":"PEA","e":"🫛"}],
 words:[{"w":"PAT","e":"🤚","h":"pat the cat"},{"w":"PIT","e":"🕳️","h":"a hole"}],
 family:[{"w":"PAT","e":"🤚"},{"w":"CAT","e":"🐱"},{"w":"BAT","e":"🦇"},{"w":"HAT","e":"🎩"}],
 hfw:[{"w":"AM","s":"I am at the peach tree."}],
 plan:["sound","beginSound","write:l","tapAll","starts","initial","blend","sight","caseMatch","write:u"],
 story:{"t":"A Pig on the Peach Path","art":"🍑🐷","lines":["The path down the ridge was lined with *peach* trees.","A *pig* was eating a *pear* off a *plate*!","'*Puh*, *puh*, *pig*,' said Sam, and gave it a *pat*.","*P* was in the bag. '*I* *am* quick,' said Zib."]}},

{no:3, region:"Map Market", art:"🗺️",
 grad:"linear-gradient(135deg,#FFD68A,#D9932A)",
 kind:"family", teaches:[], rime:"AP",
 letters:["A","P"], confuse:["T","N","M"], teach:"the -ap family",
 vocab:[{"w":"MAP","e":"🗺️"},{"w":"CAP","e":"🧢"},{"w":"TAP","e":"🚰"},{"w":"NAP","e":"😴"},{"w":"LAP","e":"🦵"},{"w":"GAP","e":"🚧"},{"w":"ZAP","e":"⚡"}],
 words:[{"w":"MAP","e":"🗺️","h":"it shows the way"},{"w":"CAP","e":"🧢","h":"a hat you wear"},{"w":"TAP","e":"🚰","h":"water comes out"},{"w":"ZAP","e":"⚡","h":"a flash of lightning"}],
 family:[{"w":"CAP","e":"🧢"},{"w":"GAP","e":"🚧"},{"w":"LAP","e":"🦵"},{"w":"MAP","e":"🗺️"},{"w":"NAP","e":"😴"},{"w":"TAP","e":"🚰"},{"w":"ZAP","e":"⚡"}],
 hfw:[{"w":"A","s":"A map and a cap."}],
 plan:["machine","rhyme","machine","initial","blend","spell","blendIt","sight","spell","rhyme"],
 story:{"t":"The Market of Maps","art":"🗺️🧢","lines":["Every stall in the market sold one thing: *maps*.","A man in a red *cap* filled a cup at the *tap*.","'They all end the same,' said Sam. '*-ap*!'","*Cap*, *gap*, *lap*, *map*, *nap*, *tap*, *zap*."]}},

{no:4, region:"Hammer Hill", art:"🔨",
 grad:"linear-gradient(135deg,#9FC7EA,#3E6FA8)",
 kind:"grapheme", teaches:["H"],
 letters:["H"], confuse:["N","M","K"], teach:"the sound h",
 vocab:[{"w":"HAT","e":"🎩"},{"w":"HORSE","e":"🐴"},{"w":"HAMMER","e":"🔨"},{"w":"HEART","e":"❤️"},{"w":"HELMET","e":"⛑️"},{"w":"HAIR","e":"💇"},{"w":"HEAD","e":"🗣️"},{"w":"HIVE","e":"🍯"},{"w":"HOLE","e":"🕳️"},{"w":"HAMBURGER","e":"🍔"}],
 words:[{"w":"HAT","e":"🎩","h":"it goes on your head"},{"w":"HAM","e":"🍖","h":"you eat it"}],
 family:[{"w":"HAT","e":"🎩"},{"w":"CAT","e":"🐱"},{"w":"BAT","e":"🦇"},{"w":"MAT","e":"🟫"},{"w":"RAT","e":"🐀"}],
 hfw:[{"w":"A","s":"A horse in a helmet."}],
 plan:["sound","beginSound","write:l","tapAll","starts","listen","initial","blend","sound","write:u"],
 story:{"t":"The Horse on Hammer Hill","art":"🔨🐴","lines":["*Hammer* Hill rang all day: tap, tap, tap.","A *horse* in a *helmet* was building a *hive*.","'*Huh*, *huh*, *hat*,' it puffed, and lost its *hat*.","Sam caught it. *H* was theirs."]}},

{no:5, region:"Rope Ridge", art:"🪢",
 grad:"linear-gradient(135deg,#F3A5C0,#C4457C)",
 kind:"grapheme", teaches:["R"],
 letters:["R"], confuse:["P","B","N"], teach:"the sound r",
 vocab:[{"w":"RING","e":"💍"},{"w":"ROBOT","e":"🤖"},{"w":"ROSE","e":"🌹"},{"w":"RABBIT","e":"🐰"},{"w":"RICE","e":"🍚"},{"w":"RUG","e":"🧿"},{"w":"ROPE","e":"🪢"},{"w":"RAFT","e":"🛶"},{"w":"RADIO","e":"📻"},{"w":"RULER","e":"📏"},{"w":"RASPBERRY","e":"🫐"}],
 words:[{"w":"RAT","e":"🐀","h":"a long tail"},{"w":"RAN","e":"🏃","h":"the man ran"}],
 family:[{"w":"RAT","e":"🐀"},{"w":"CAT","e":"🐱"},{"w":"BAT","e":"🦇"},{"w":"HAT","e":"🎩"},{"w":"MAT","e":"🟫"}],
 hfw:[{"w":"A","s":"A rabbit on a raft."}],
 plan:["sound","beginSound","write:l","tapAll","starts","listen","initial","blend","rhyme","write:u"],
 story:{"t":"A Rope Across the Ridge","art":"🪢🐰","lines":["One long *rope* crossed the gap between two cliffs.","A *rabbit* held a *rose*. A *robot* held a *ruler*.","'*Rrr*,' growled the rope as they pulled.","A *rat* *ran* over first. *R* was letter twelve."]}},

{no:6, region:"Van Valley", art:"🚐",
 grad:"linear-gradient(135deg,#A5D6C7,#2E8B78)",
 kind:"family", teaches:[], rime:"AN",
 letters:["A","N"], confuse:["M","T","P"], teach:"the -an family",
 vocab:[{"w":"VAN","e":"🚐"},{"w":"FAN","e":"🌀"},{"w":"MAN","e":"👨"},{"w":"CAN","e":"🥫"},{"w":"PAN","e":"🍳"},{"w":"HAND","e":"✋"},{"w":"BAND","e":"🎺"}],
 words:[{"w":"RAN","e":"🏃","h":"the man ran"},{"w":"FAN","e":"🌀","h":"it keeps you cool"},{"w":"CAN","e":"🥫","h":"a tin"},{"w":"MAN","e":"👨","h":"a grown-up"},{"w":"PAN","e":"🍳","h":"you cook in it"},{"w":"VAN","e":"🚐","h":"a little truck"}],
 family:[{"w":"CAN","e":"🥫"},{"w":"FAN","e":"🌀"},{"w":"MAN","e":"👨"},{"w":"PAN","e":"🍳"},{"w":"RAN","e":"🏃"},{"w":"TAN","e":"🟤"},{"w":"VAN","e":"🚐"}],
 hfw:[{"w":"MAN","s":"The man ran."},{"w":"CAN","s":"I can see the van."}],
 plan:["machine","rhyme","machine","initial","blend","spell","sight","pickWord","blendIt","spell"],
 story:{"t":"The Van in the Valley","art":"🚐🌀","lines":["Down in the valley an old *van* was stuck in the mud.","A *man* with a *fan* and a *pan* came to help.","'*Can* we?' said Sam. They pushed. The van *ran*!","*Can*, *fan*, *man*, *pan*, *ran*, *tan*, *van*."]}},

{no:7, region:"Zigzag Zoo", art:"🦓",
 grad:"linear-gradient(135deg,#C9B6E4,#6A4C9C)",
 kind:"grapheme", teaches:["Z"],
 letters:["Z"], confuse:["S","N","X"], teach:"the sound z",
 vocab:[{"w":"ZEBRA","e":"🦓"},{"w":"ZOO","e":"🎪"},{"w":"ZIP","e":"🤐"},{"w":"ZERO","e":"0️⃣"},{"w":"ZUCCHINI","e":"🥒"},{"w":"ZIGZAG","e":"⚡"}],
 words:[{"w":"ZAP","e":"⚡","h":"a flash of lightning"}],
 family:[{"w":"ZAP","e":"⚡"},{"w":"CAP","e":"🧢"},{"w":"MAP","e":"🗺️"},{"w":"TAP","e":"🚰"},{"w":"NAP","e":"😴"}],
 hfw:[{"w":"CAN","s":"I can see a zebra."}],
 plan:["sound","beginSound","write:l","tapAll","starts","listen","initial","sound","caseMatch","write:u"],
 story:{"t":"The Zebra's Zigzag","art":"🦓⚡","lines":["The path through the *zoo* went *zigzag*, left and right.","A *zebra* with a *zip* on its coat led the way.","'*Zzz*,' it buzzed. '*Zap*! *Zero*! *Zoo*!'","Sam laughed. *Z* went into the bag."]}},

{no:8, region:"Bee Tree", art:"🐝",
 grad:"linear-gradient(135deg,#FFE39B,#D9A404)",
 kind:"grapheme", teaches:["E","EE"],
 letters:["E","EE"], confuse:["A","I","O"], teach:"e, and ee saying its name",
 vocab:[{"w":"BEE","e":"🐝"},{"w":"TREE","e":"🌳"},{"w":"SHEEP","e":"🐑"},{"w":"CHEESE","e":"🧀"},{"w":"QUEEN","e":"👑"},{"w":"KNEE","e":"🦵"},{"w":"TEEPEE","e":"⛺"},{"w":"SEED","e":"🌱"},{"w":"THREE","e":"3️⃣"},{"w":"WEED","e":"🌿"}],
 words:[{"w":"BEE","e":"🐝","h":"it makes honey"},{"w":"SEE","e":"👀","h":"with your eyes"},{"w":"TREE","e":"🌳","h":"it has leaves"},{"w":"SEED","e":"🌱","h":"a plant starts here"},{"w":"WEED","e":"🌿","h":"a plant you pull up"}],
 family:[{"w":"BEE","e":"🐝"},{"w":"SEE","e":"👀"},{"w":"TREE","e":"🌳"},{"w":"THREE","e":"3️⃣"}],
 hfw:[{"w":"SEE","s":"I can see three bees."}],
 plan:["sound","beginSound","write:l","listen","rhyme","blend","spell","sight","pickWord","write:u"],
 story:{"t":"Three Bees in the Tree","art":"🐝🌳","lines":["One huge *tree* stood alone, humming.","*Three* *bees* flew out. Then a *sheep* and a *queen*!","'*Eee*,' sang the bees. 'That is two e's, together.'","'*I* can *see* it,' said Sam. '*Bee*. *Tree*. *See*.'"]}},

{no:9, region:"Sentence Springs", art:"💧",
 grad:"linear-gradient(135deg,#8FD3E8,#2E7DA8)",
 kind:"skill", teaches:[], skill:"sentence",
 letters:["A","N","P"], confuse:["M","S","T","H"], teach:"putting words into a sentence",
 vocab:[{"w":"CAT","e":"🐱"},{"w":"MAN","e":"👨"},{"w":"BEE","e":"🐝"},{"w":"HAT","e":"🎩"},{"w":"VAN","e":"🚐"}],
 words:[{"w":"SAM","e":"👦","h":"a boy"},{"w":"CAN","e":"🥫","h":"a tin"},{"w":"SEE","e":"👀","h":"with your eyes"},{"w":"MAN","e":"👨","h":"a grown-up"},{"w":"FAN","e":"🌀","h":"it keeps you cool"},{"w":"PAN","e":"🍳","h":"you cook in it"},{"w":"TAP","e":"🚰","h":"water comes out"},{"w":"CAP","e":"🧢","h":"a hat you wear"},{"w":"HAT","e":"🎩","h":"it goes on your head"},{"w":"BAT","e":"🦇","h":"it flies at night"},{"w":"CAT","e":"🐱","h":"it says meow"}],
 family:[{"w":"CAN","e":"🥫"},{"w":"FAN","e":"🌀"},{"w":"MAN","e":"👨"},{"w":"PAN","e":"🍳"},{"w":"RAN","e":"🏃"}],
 hfw:[{"w":"SEE","s":"I can see Sam."},{"w":"THE","s":"The man ran."},{"w":"I","s":"I am Sam."},{"w":"CAN","s":"I can see the van."},{"w":"MAN","s":"The man has a hat."}],
 sentences:[{"s":["I","CAN","SEE","A","CAT"],"e":"🐱"},{"s":["SAM","CAN","SEE","THE","MAN"],"e":"🧍"},{"s":["THE","MAN","RAN"],"e":"🏃"},{"s":["I","AM","AT","THE","TREE"],"e":"🌳"}],
 plan:["sentence","pickWord","alphabet","sight","blend","spell","alphabet","readLine","caseMatch","match"],
 story:{"t":"Words That Hold Hands","art":"💧✏️","lines":["At the springs, the words were floating in the water.","Sam caught three and put them in a row.","*I* *can* *see* *a* *cat*. It was a whole *sentence*!","'Words hold hands,' said Zib. 'That is reading.'"]}},

{no:10, region:"Lantern Lighthouse", art:"🗼",
 grad:"linear-gradient(135deg,#F7B7A3,#B34F3C)",
 kind:"review", teaches:[],
 letters:["N","P","H","R","Z","E"], confuse:["M","S","T","B","C","F"], teach:"every letter of this map",
 vocab:[{"w":"NEST","e":"🪺"},{"w":"PIG","e":"🐷"},{"w":"HORSE","e":"🐴"},{"w":"ROBOT","e":"🤖"},{"w":"ZEBRA","e":"🦓"},{"w":"BEE","e":"🐝"},{"w":"CAT","e":"🐱"},{"w":"BAT","e":"🦇"},{"w":"VAN","e":"🚐"}],
 words:[{"w":"CAN","e":"🥫","h":"a tin"},{"w":"SEE","e":"👀","h":"with your eyes"},{"w":"HAT","e":"🎩","h":"it goes on your head"},{"w":"MAN","e":"👨","h":"a grown-up"},{"w":"MAP","e":"🗺️","h":"it shows the way"},{"w":"RAN","e":"🏃","h":"the man ran"},{"w":"ZAP","e":"⚡","h":"a flash of lightning"},{"w":"BEE","e":"🐝","h":"it makes honey"}],
 family:[{"w":"CAN","e":"🥫"},{"w":"FAN","e":"🌀"},{"w":"MAN","e":"👨"},{"w":"PAN","e":"🍳"},{"w":"RAN","e":"🏃"},{"w":"VAN","e":"🚐"}],
 hfw:[{"w":"SEE","s":"I can see the sea."},{"w":"THE","s":"The man ran."},{"w":"CAN","s":"I can see a bee."},{"w":"MAN","s":"The man has a map."}],
 sentences:[{"s":["I","CAN","SEE","THE","BEE"],"e":"🐝"},{"s":["THE","MAN","CAN","SEE","A","VAN"],"e":"🚐"},{"s":["SAM","RAN","TO","THE","TREE"],"e":"🌳"}],
 plan:["blendIt","spell","machine","rhyme","blend","spell","sight","sentence","readLine","listen"],
 story:{"t":"The Light at the Top","art":"🗼✨","lines":["The lighthouse leaned out over a dark, wide sea.","Zib emptied the bag: *N*, *P*, *H*, *R*, *Z* and *E*.","The lamp lit. Across the water, sentences appeared.","'*The* *man* *ran*,' read Sam — every word, all by himself."]}}
];

/* ════════ MAP 3 · Lessons 21–30 · The Sunken Path ════════ */
const MAP3 = [

{no:1, region:"Violin Valley", art:"🎻",
 grad:"linear-gradient(135deg,#C9A7E8,#7B4FA8)",
 kind:"grapheme", teaches:["V"],
 letters:["V"], confuse:["W","U","Y"], teach:"the sound v",
 vocab:[{"w":"VAN","e":"🚐"},{"w":"VIOLIN","e":"🎻"},{"w":"VASE","e":"🏺"},{"w":"VEST","e":"🦺"},{"w":"VULTURE","e":"🦅"},{"w":"VOLCANO","e":"🌋"},{"w":"VET","e":"🐾"},{"w":"VEGETABLES","e":"🥦"}],
 words:[{"w":"VAN","e":"🚐","h":"a little truck"}],
 family:[{"w":"CAN","e":"🥫"},{"w":"FAN","e":"🌀"},{"w":"MAN","e":"👨"},{"w":"PAN","e":"🍳"},{"w":"RAN","e":"🏃"},{"w":"VAN","e":"🚐"}],
 hfw:[{"w":"THE","s":"The van is red."}],
 plan:["sound","beginSound","write:l","tapAll","starts","listen","initial","blend","rhyme","write:u"],
 story:{"t":"The Vulture's Violin","art":"🎻🦅","lines":["Past the lighthouse the sea had gone, and a sunken path led down.","In the first valley a *vulture* was playing a *violin*.","'*Vvv*,' hummed the strings. '*Van*. *Vase*. *Vest*.'","*V* went into the bag. Map three had begun."]}},

{no:2, region:"Handprint Sands", art:"🖐️",
 grad:"linear-gradient(135deg,#F5D9A8,#C99A46)",
 kind:"family", teaches:[], rime:"AND",
 letters:["A","N"], confuse:["M","T","D"], teach:"the -and family",
 vocab:[{"w":"LAND","e":"🏝️"},{"w":"BAND","e":"🎺"},{"w":"HAND","e":"✋"},{"w":"SAND","e":"🏖️"},{"w":"ANT","e":"🐜"},{"w":"SANDWICH","e":"🥪"}],
 words:[{"w":"LAND","e":"🏝️","h":"not the sea"},{"w":"BAND","e":"🎺","h":"they play music"},{"w":"HAND","e":"✋","h":"it has five fingers"},{"w":"SAND","e":"🏖️","h":"it is on the beach"},{"w":"AND","e":"🔗","h":"you and me"}],
 family:[{"w":"BAND","e":"🎺"},{"w":"HAND","e":"✋"},{"w":"LAND","e":"🏝️"},{"w":"SAND","e":"🏖️"}],
 hfw:[{"w":"AND","s":"Sam and Zib."},{"w":"SEE","s":"I can see the sand."},{"w":"THE","s":"The band is on the sand."}],
 plan:["machine","rhyme","machine","initial","blend","spell","sight","blendIt","spell","rhyme"],
 story:{"t":"Handprints in the Sand","art":"🖐️🏖️","lines":["Below the valley the path opened out into wide, dry *sand*.","Someone had left *hand* prints — a whole *band* of them.","'They all end the same,' said Sam. '*-and*!'","*Band*, *hand*, *land*, *sand* — *and* on they walked."]}},

{no:3, region:"Dragon Door", art:"🐉",
 grad:"linear-gradient(135deg,#F0A3A3,#B03A3A)",
 kind:"grapheme", teaches:["D"],
 letters:["D"], confuse:["B","P","G"], teach:"the sound d",
 vocab:[{"w":"DOG","e":"🐕"},{"w":"DUCK","e":"🦆"},{"w":"DRAGON","e":"🐉"},{"w":"DICE","e":"🎲"},{"w":"DOOR","e":"🚪"},{"w":"DOLPHIN","e":"🐬"},{"w":"DOLL","e":"🪆"},{"w":"DINOSAUR","e":"🦕"},{"w":"DOCTOR","e":"🩺"},{"w":"DANCE","e":"💃"}],
 words:[{"w":"DAD","e":"👨","h":"your father"},{"w":"DAN","e":"🧒","h":"a boy's name"}],
 family:[{"w":"BAD","e":"👎"},{"w":"DAD","e":"👨"},{"w":"HAD","e":"🤲"},{"w":"MAD","e":"😠"},{"w":"SAD","e":"😢"}],
 hfw:[{"w":"AND","s":"A dog and a duck."}],
 plan:["sound","beginSound","write:l","tapAll","starts","listen","initial","blend","sound","write:u"],
 story:{"t":"The Dragon at the Door","art":"🐉🚪","lines":["A red *door* stood in the rock with no house behind it.","A small *dragon* opened it. A *dog* and a *duck* ran out.","'*Duh*, *duh*,' said the dragon. 'My *dad* built this door.'","*D* went into the bag beside *V*."]}},

{no:4, region:"Ivy Inn", art:"🏚️",
 grad:"linear-gradient(135deg,#A8D8C9,#3E8A78)",
 kind:"sight", teaches:[],
 letters:["I","D"], confuse:["A","E","N"], teach:"the words in and had",
 vocab:[{"w":"INK","e":"🖊️"},{"w":"IGLOO","e":"🧊"},{"w":"IGUANA","e":"🦎"},{"w":"INSECT","e":"🐞"}],
 words:[{"w":"IN","e":"📥","h":"in the box"},{"w":"HAD","e":"🤲","h":"the cat had a hat"},{"w":"CAT","e":"🐱","h":"it says meow"},{"w":"RAT","e":"🐀","h":"a long tail"},{"w":"HAT","e":"🎩","h":"it goes on your head"},{"w":"CAN","e":"🥫","h":"a tin"}],
 family:[{"w":"BAT","e":"🦇"},{"w":"CAT","e":"🐱"},{"w":"HAT","e":"🎩"},{"w":"MAT","e":"🟫"},{"w":"RAT","e":"🐀"},{"w":"SAT","e":"🪑"}],
 hfw:[{"w":"IN","s":"The cat is in the van."},{"w":"HAD","s":"Dan had a hat."},{"w":"I","s":"I can see Dan."},{"w":"CAN","s":"I can see a rat."}],
 sentences:[{"s":["DAN","HAD","A","HAT"],"e":"🎩"},{"s":["I","CAN","SEE","THE","RAT"],"e":"🐀"},{"s":["A","CAT","SAT","IN","THE","VAN"],"e":"🚐"}],
 plan:["sight","pickWord","sight","spell","blend","initial","rhyme","sentence","readLine","blendIt"],
 story:{"t":"A Room at the Ivy Inn","art":"🏚️🌿","lines":["Halfway down the path an old inn stood under thick *ivy*.","A boy called *Dan* *had* left his *hat* on the step.","'It is *in* here!' called Sam, and read the little sign.","*Dan* *had* a *cat*. The *cat* *sat* *in* a *hat*."]}},

{no:5, region:"Jelly Jetty", art:"🫙",
 grad:"linear-gradient(135deg,#F5B7D0,#C2447A)",
 kind:"grapheme", teaches:["J"],
 letters:["J"], confuse:["G","I","Y"], teach:"the sound j",
 vocab:[{"w":"JAM","e":"🍯"},{"w":"JET","e":"✈️"},{"w":"JUG","e":"🫖"},{"w":"JUICE","e":"🧃"},{"w":"JELLY","e":"🍮"},{"w":"JUMP","e":"🤸"},{"w":"JEANS","e":"👖"},{"w":"JAR","e":"🫙"},{"w":"JIGSAW","e":"🧩"}],
 words:[{"w":"JAM","e":"🍯","h":"you spread it on bread"},{"w":"JET","e":"✈️","h":"a very fast plane"},{"w":"JUG","e":"🫖","h":"it holds the milk"}],
 family:[{"w":"DAM","e":"🌊"},{"w":"HAM","e":"🍖"},{"w":"JAM","e":"🍯"},{"w":"RAM","e":"🐏"},{"w":"SAM","e":"👦"}],
 hfw:[{"w":"HAD","s":"Sam had jam."}],
 plan:["sound","beginSound","write:l","starts","tapAll","hunt","initial","blend","sound","write:u"],
 story:{"t":"Jam on the Jetty","art":"🫙🍓","lines":["At the bottom a wooden *jetty* ran out over the dry sand.","On it sat a *jug*, a *jar* of *jam* and a plate of *jelly*.","'*Juh*, *juh*,' said Zib, and had a taste. '*Jam*!'","*Sam* *had* some too. *J* went into the bag."]}},

{no:6, region:"Lilypad Lagoon", art:"🪷",
 grad:"linear-gradient(135deg,#9FD8E8,#2E7A96)",
 kind:"family", teaches:[], rime:"AD",
 letters:["A","D"], confuse:["N","P","T"], teach:"the -ad family",
 vocab:[{"w":"BAD","e":"👎"},{"w":"DAD","e":"👨"},{"w":"MAD","e":"😠"},{"w":"PAD","e":"📝"},{"w":"SAD","e":"😢"},{"w":"FLOWER","e":"🌸"},{"w":"FROG","e":"🐸"}],
 words:[{"w":"BAD","e":"👎","h":"not good"},{"w":"DAD","e":"👨","h":"your father"},{"w":"MAD","e":"😠","h":"very cross"},{"w":"PAD","e":"📝","h":"you write on it"},{"w":"SAD","e":"😢","h":"not happy"},{"w":"HAD","e":"🤲","h":"the frog had a nap"}],
 family:[{"w":"BAD","e":"👎"},{"w":"DAD","e":"👨"},{"w":"HAD","e":"🤲"},{"w":"MAD","e":"😠"},{"w":"PAD","e":"📝"},{"w":"SAD","e":"😢"}],
 hfw:[{"w":"HAD","s":"Dad had a nap."},{"w":"AND","s":"Mad and sad."}],
 plan:["machine","rhyme","machine","initial","blend","spell","sight","pickWord","blendIt","spell"],
 story:{"t":"The Lagoon of Lily Pads","art":"🪷🐸","lines":["A green lagoon lay very still, covered in lily *pads*.","One *frog* looked *sad*. The frog beside it looked *mad*.","'Do not be *sad*,' said Sam. 'Listen — you rhyme!'","*Bad*, *dad*, *had*, *mad*, *pad*, *sad*."]}},

{no:7, region:"Octopus Ocean", art:"🐙",
 grad:"linear-gradient(135deg,#F5A15C,#C25A16)",
 kind:"grapheme", teaches:["O"],
 letters:["O"], confuse:["A","C","U"], teach:"the sound o",
 vocab:[{"w":"OCTOPUS","e":"🐙"},{"w":"ORANGE","e":"🍊"},{"w":"ONION","e":"🧅"},{"w":"OTTER","e":"🦦"},{"w":"OLIVE","e":"🫒"},{"w":"OSTRICH","e":"🦤"},{"w":"OX","e":"🐂"},{"w":"OAR","e":"🚣"},{"w":"OIL","e":"🛢️"}],
 words:[{"w":"OX","e":"🐂","h":"a big strong animal"},{"w":"DAD","e":"👨","h":"your father"},{"w":"JAM","e":"🍯","h":"you spread it on bread"}],
 family:[{"w":"BAD","e":"👎"},{"w":"DAD","e":"👨"},{"w":"HAD","e":"🤲"},{"w":"MAD","e":"😠"},{"w":"PAD","e":"📝"},{"w":"SAD","e":"😢"}],
 hfw:[{"w":"AND","s":"An otter and an ox."}],
 plan:["sound","beginSound","write:l","tapAll","starts","listen","match","initial","rhyme","write:u"],
 story:{"t":"The Octopus in the Ocean","art":"🐙🌊","lines":["Past the lagoon the ocean came back, deep and very blue.","An *octopus* was holding an *orange* in every arm.","'*Oh*, *oh*, *oh*,' it sang. '*Otter*. *Onion*. *Ox*.'","An *otter* rowed them across with one long *oar*."]}},

{no:8, region:"Misty Isle", art:"🏝️",
 grad:"linear-gradient(135deg,#B7C7E8,#4A5F94)",
 kind:"sight", teaches:[],
 letters:["I","S"], confuse:["E","A","Z"], teach:"the words is and has",
 vocab:[{"w":"BEE","e":"🐝"},{"w":"ANT","e":"🐜"},{"w":"CAP","e":"🧢"},{"w":"BAT","e":"🦇"},{"w":"GOOD","e":"👍"},{"w":"BAD","e":"👎"},{"w":"SAD","e":"😢"}],
 words:[{"w":"IS","e":"🟰","h":"the bee is good"},{"w":"HAS","e":"🎁","h":"Dan has a cap"},{"w":"CAP","e":"🧢","h":"a hat you wear"},{"w":"BAT","e":"🦇","h":"it flies at night"},{"w":"SAD","e":"😢","h":"not happy"},{"w":"BAD","e":"👎","h":"not good"}],
 family:[{"w":"CAP","e":"🧢"},{"w":"GAP","e":"🚧"},{"w":"LAP","e":"🦵"},{"w":"MAP","e":"🗺️"},{"w":"NAP","e":"😴"},{"w":"TAP","e":"🚰"},{"w":"ZAP","e":"⚡"}],
 hfw:[{"w":"IS","s":"The ant is on the sand."},{"w":"HAS","s":"Dan has a cap."},{"w":"A","s":"A bee has a hat."},{"w":"THE","s":"The cap is bad."}],
 sentences:[{"s":["THE","BEE","IS","SAD"],"e":"🐝"},{"s":["DAN","HAS","A","CAP"],"e":"🧢"},{"s":["THE","ANT","IS","IN","THE","VAN"],"e":"🐜"}],
 plan:["sight","pickWord","sight","spell","blend","initial","blendIt","sentence","readLine","listen"],
 story:{"t":"The Isle in the Mist","art":"🏝️🌫️","lines":["An isle rose out of the mist, small and quiet and green.","A *bee* sat on a red *cap*. An *ant* sat on the *bee*.","'The bee *has* a cap,' said Sam. 'The cap *is* red.'","Two tiny words, and the whole sentence stood up."]}},

{no:9, region:"Stepping Stones", art:"🪨",
 grad:"linear-gradient(135deg,#A8C8B0,#4A7A5C)",
 kind:"sight", teaches:[],
 letters:["O","N"], confuse:["A","M","D"], teach:"the word on, and longer sentences",
 vocab:[{"w":"JET","e":"✈️"},{"w":"APPLE","e":"🍎"},{"w":"OCTOPUS","e":"🐙"},{"w":"DOG","e":"🐕"},{"w":"BEE","e":"🐝"},{"w":"MAT","e":"🟫"},{"w":"VAN","e":"🚐"}],
 words:[{"w":"ON","e":"🔛","h":"on the mat"},{"w":"AND","e":"🔗","h":"you and me"},{"w":"IS","e":"🟰","h":"the dog is big"},{"w":"SAT","e":"🪑","h":"the cat sat down"},{"w":"MAT","e":"🟫","h":"you wipe your feet on it"},{"w":"DOG","e":"🐕","h":"it says woof"}],
 family:[{"w":"CAN","e":"🥫"},{"w":"FAN","e":"🌀"},{"w":"MAN","e":"👨"},{"w":"PAN","e":"🍳"},{"w":"RAN","e":"🏃"},{"w":"VAN","e":"🚐"}],
 hfw:[{"w":"ON","s":"The dog sat on the mat."},{"w":"AND","s":"A jet and a van."},{"w":"IS","s":"The bee is on the apple."},{"w":"THE","s":"The dog is sad."},{"w":"A","s":"A jet is on the sand."}],
 sentences:[{"s":["THE","DOG","SAT","ON","THE","MAT"],"e":"🐕"},{"s":["A","BEE","IS","ON","THE","APPLE"],"e":"🍎"},{"s":["DAN","AND","SAM","RAN"],"e":"🏃"},{"s":["THE","JET","IS","ON","THE","SAND"],"e":"✈️"}],
 plan:["sentence","pickWord","sight","readLine","sight","blend","spell","rhyme","blendIt","listen"],
 story:{"t":"Stones Across the Water","art":"🪨💧","lines":["Flat stones crossed the water, one word painted on each.","Sam stepped: *The* — *dog* — *sat* — *on* — *the* — *mat*.","Every stone he read held firm. The wrong ones sank.","'Read it and it holds,' said Zib. 'That is the way across.'"]}},

{no:10, region:"Queen's Quarry", art:"👑",
 grad:"linear-gradient(135deg,#E8C46B,#A87A16)",
 kind:"grapheme", teaches:["Q"],
 letters:["V","D","J","O","Q"], confuse:["M","S","N","P","B"], teach:"every letter of this map",
 vocab:[{"w":"QUEEN","e":"👑"},{"w":"QUAIL","e":"🐤"},{"w":"QUILT","e":"🛏️"},{"w":"QUIET","e":"🤫"},{"w":"QUEUE","e":"🧑‍🤝‍🧑"},{"w":"QUARTER","e":"🪙"},{"w":"VAN","e":"🚐"},{"w":"DOG","e":"🐕"},{"w":"JET","e":"✈️"},{"w":"OCTOPUS","e":"🐙"}],
 words:[{"w":"VAN","e":"🚐","h":"a little truck"},{"w":"DAD","e":"👨","h":"your father"},{"w":"JAM","e":"🍯","h":"you spread it on bread"},{"w":"SAD","e":"😢","h":"not happy"},{"w":"HAD","e":"🤲","h":"Dad had a nap"},{"w":"HAS","e":"🎁","h":"the queen has a quilt"},{"w":"IS","e":"🟰","h":"the quail is quiet"},{"w":"ON","e":"🔛","h":"on the mat"},{"w":"LAND","e":"🏝️","h":"not the sea"}],
 family:[{"w":"BAD","e":"👎"},{"w":"DAD","e":"👨"},{"w":"HAD","e":"🤲"},{"w":"MAD","e":"😠"},{"w":"PAD","e":"📝"},{"w":"SAD","e":"😢"}],
 hfw:[{"w":"IS","s":"The queen is quiet."},{"w":"HAS","s":"The queen has a quilt."},{"w":"AND","s":"A quail and a queen."},{"w":"ON","s":"The quilt is on the bed."},{"w":"IN","s":"The quail is in the nest."},{"w":"HAD","s":"Dad had a nap."}],
 sentences:[{"s":["THE","QUEEN","HAS","A","QUILT"],"e":"👑"},{"s":["THE","QUAIL","IS","ON","THE","SAND"],"e":"🐤"},{"s":["DAD","AND","DAN","RAN","TO","THE","VAN"],"e":"🚐"}],
 plan:["sound","hunt","write:l","sound","blend","spell","sight","sentence","readLine","write:u"],
 story:{"t":"The Quiet Quarry","art":"👑🪨","lines":["The sunken path ended in a quarry, cut deep and very *quiet*.","A *queen* sat there alone under a patchwork *quilt*.","Zib tipped out *V*, *D*, *J*, *O* and *Q*.","'*The* *queen* *has* *a* *quilt*,' read Sam — and a door opened onto sand."]}}
];

/* ════════ MAP 4 · Lessons 31–40 · The Glass Desert ════════ */
const MAP4 = [

{no:1, region:"Goat Gorge", art:"🐐",
 grad:"linear-gradient(135deg,#CFD96B,#7A8C2E)",
 kind:"grapheme", teaches:["G"],
 letters:["G"], confuse:["C","Q","J"], teach:"the sound g",
 vocab:[{"w":"GOAT","e":"🐐"},{"w":"GHOST","e":"👻"},{"w":"GLASSES","e":"👓"},{"w":"GUITAR","e":"🎸"},{"w":"GRAPE","e":"🍇"},{"w":"GLUE","e":"🧴"},{"w":"GLOVE","e":"🧤"},{"w":"GOLDFISH","e":"🐠"},{"w":"GARBAGE","e":"🗑️"}],
 words:[{"w":"PIG","e":"🐷","h":"it says oink"},{"w":"GAP","e":"🚧","h":"a space to get through"},{"w":"JAM","e":"🍯","h":"you spread it on bread"}],
 family:[{"w":"CAP","e":"🧢"},{"w":"GAP","e":"🚧"},{"w":"MAP","e":"🗺️"},{"w":"NAP","e":"😴"},{"w":"TAP","e":"🚰"},{"w":"ZAP","e":"⚡"}],
 hfw:[{"w":"THE","s":"The goat has a guitar."}],
 plan:["sound","beginSound","write:l","tapAll","starts","listen","initial","blend","sound","write:u"],
 story:{"t":"The Goat with the Guitar","art":"🐐🎸","lines":["The door in the quarry opened onto a desert of *glass*.","In the first gorge a *goat* sat playing a *guitar*.","'*Guh*, *guh*,' it sang. '*Grape*. *Glove*. *Glue*.'","*G* went into the bag. Map four had begun."]}},

{no:2, region:"Lizard Ledge", art:"🦎",
 grad:"linear-gradient(135deg,#BFE36B,#4F8C36)",
 kind:"grapheme", teaches:["L"],
 letters:["L"], confuse:["I","T","J"], teach:"the sound l",
 vocab:[{"w":"LEAF","e":"🍃"},{"w":"LAMP","e":"💡"},{"w":"LEMON","e":"🍋"},{"w":"LOCK","e":"🔒"},{"w":"LADDER","e":"🪜"},{"w":"LIZARD","e":"🦎"},{"w":"LAMB","e":"🐑"},{"w":"LOLLIPOP","e":"🍭"},{"w":"LADYBUG","e":"🐞"},{"w":"LIGHT","e":"🔦"}],
 words:[{"w":"LAP","e":"🦵","h":"sit on my lap"},{"w":"LAD","e":"🧒","h":"a boy"}],
 family:[{"w":"BAD","e":"👎"},{"w":"DAD","e":"👨"},{"w":"HAD","e":"🤲"},{"w":"LAD","e":"🧒"},{"w":"MAD","e":"😠"},{"w":"PAD","e":"📝"},{"w":"SAD","e":"😢"}],
 hfw:[{"w":"AND","s":"A lamb and a lizard."}],
 plan:["sound","beginSound","write:l","tapAll","starts","listen","initial","blend","rhyme","write:u"],
 story:{"t":"The Lizard on the Ledge","art":"🦎💡","lines":["A long *ledge* ran along the glass cliff, warm in the sun.","A *lizard* lay on it with a *lamp* and a *leaf*.","'*Lll*,' it said slowly. '*Lock*. *Lemon*. *Lamb*.'","A little *lad* climbed up too. *L* was theirs."]}},

{no:3, region:"Twin Dunes", art:"👫",
 grad:"linear-gradient(135deg,#F5D08A,#C4923A)",
 kind:"sight", teaches:[],
 letters:["H","S"], confuse:["M","N","C"], teach:"the words he and she",
 vocab:[{"w":"CAT","e":"🐱"},{"w":"CAP","e":"🧢"},{"w":"JAM","e":"🍯"},{"w":"TAP","e":"🚰"},{"w":"CAN","e":"🥫"},{"w":"MAN","e":"👨"},{"w":"VAN","e":"🚐"}],
 words:[{"w":"HE","e":"🧑","h":"he ran fast"},{"w":"SHE","e":"👧","h":"she has a map"},{"w":"CAT","e":"🐱","h":"it says meow"},{"w":"SAT","e":"🪑","h":"the cat sat down"},{"w":"TAP","e":"🚰","h":"water comes out"},{"w":"CAN","e":"🥫","h":"a tin"},{"w":"JAM","e":"🍯","h":"you spread it on bread"}],
 family:[{"w":"BAT","e":"🦇"},{"w":"CAT","e":"🐱"},{"w":"FAT","e":"🐷"},{"w":"HAT","e":"🎩"},{"w":"MAT","e":"🟫"},{"w":"RAT","e":"🐀"},{"w":"SAT","e":"🪑"}],
 hfw:[{"w":"HE","s":"He can see the goat."},{"w":"SHE","s":"She has a map."},{"w":"THE","s":"The lad sat down."},{"w":"CAN","s":"I can see the van."}],
 sentences:[{"s":["HE","CAN","SEE","THE","GOAT"],"e":"🐐"},{"s":["SHE","HAS","A","MAP"],"e":"🗺️"},{"s":["HE","SAT","ON","THE","SAND"],"e":"🏖️"}],
 plan:["sight","pickWord","sight","spell","blend","initial","rhyme","sentence","readLine","blendIt"],
 story:{"t":"Two Dunes, Two Words","art":"👫🏜️","lines":["Two dunes rose out of the glass, one on each side of the path.","A girl waved from one. A boy waved from the other.","'*She* is up there,' said Sam. '*He* is over here.'","Two small words, and now he could say who did what."]}},

{no:4, region:"Kite Kingdom", art:"🪁",
 grad:"linear-gradient(135deg,#9FD6F0,#3C7FB0)",
 kind:"grapheme", teaches:["K"],
 letters:["K"], confuse:["X","H","R"], teach:"k, which says the same sound as c",
 vocab:[{"w":"KITE","e":"🪁"},{"w":"KING","e":"👑"},{"w":"KEY","e":"🔑"},{"w":"KOALA","e":"🐨"},{"w":"KANGAROO","e":"🦘"},{"w":"KITTEN","e":"🐈"},{"w":"KENNEL","e":"🏠"},{"w":"KISS","e":"💋"}],
 words:[{"w":"CAT","e":"🐱","h":"it says meow"},{"w":"CAP","e":"🧢","h":"a hat you wear"},{"w":"CAN","e":"🥫","h":"a tin"}],
 family:[{"w":"BAT","e":"🦇"},{"w":"CAT","e":"🐱"},{"w":"HAT","e":"🎩"},{"w":"MAT","e":"🟫"},{"w":"RAT","e":"🐀"},{"w":"SAT","e":"🪑"}],
 hfw:[{"w":"THE","s":"The king has a kite."},{"w":"HAS","s":"The koala has a key."}],
 plan:["sound","beginSound","write:l","tapAll","starts","listen","match","initial","caseMatch","write:u"],
 story:{"t":"The King and the Kite","art":"🪁👑","lines":["Above the desert, a hundred *kites* hung in the hot air.","A *king* held every string, with a *key* around his neck.","'*Kuh*,' he said. 'The same sound as *cat* — two ways to write it.'","A *koala* let go of one kite, and *K* fell into the bag."]}},

{no:5, region:"Ragbag Ridge", art:"👜",
 grad:"linear-gradient(135deg,#E8B98A,#A6702E)",
 kind:"family", teaches:[], rime:"AG",
 letters:["A","G"], confuse:["N","P","D"], teach:"the -ag family",
 vocab:[{"w":"BAG","e":"👜"},{"w":"TAG","e":"🏷️"},{"w":"RAG","e":"🧽"},{"w":"FLAG","e":"🚩"},{"w":"GOAT","e":"🐐"},{"w":"JAM","e":"🍯"}],
 words:[{"w":"BAG","e":"👜","h":"you carry things in it"},{"w":"TAG","e":"🏷️","h":"it tells you the price"},{"w":"RAG","e":"🧽","h":"an old bit of cloth"},{"w":"HAS","e":"🎁","h":"the lad has a bag"},{"w":"AS","e":"🟰","h":"as big as a goat"}],
 family:[{"w":"BAG","e":"👜"},{"w":"FLAG","e":"🚩"},{"w":"RAG","e":"🧽"},{"w":"TAG","e":"🏷️"}],
 hfw:[{"w":"AS","s":"As big as a goat."},{"w":"HAS","s":"The lad has a bag."},{"w":"THE","s":"The flag is on the ridge."}],
 sentences:[{"s":["THE","LAD","HAS","A","BAG"],"e":"👜"},{"s":["SHE","HAS","A","FLAG"],"e":"🚩"}],
 plan:["machine","rhyme","machine","initial","blend","spell","sight","pickWord","blendIt","spell"],
 story:{"t":"Everything in the Bag","art":"👜🏷️","lines":["On the ridge a trader had spread out her whole *bag*.","A *rag*, a *flag*, and a price *tag* on every single one.","'They all end the same,' said Sam. '*-ag*!'","'*As* quick *as* that,' said Zib. 'Now she *has* nothing left.'"]}},

{no:6, region:"Yellow Yard", art:"🪀",
 grad:"linear-gradient(135deg,#FFE066,#D19C08)",
 kind:"grapheme", teaches:["Y"],
 letters:["Y"], confuse:["V","W","J"], teach:"the sound y",
 vocab:[{"w":"YOYO","e":"🪀"},{"w":"YACHT","e":"⛵"},{"w":"YAWN","e":"🥱"},{"w":"YOGURT","e":"🍦"},{"w":"YOLK","e":"🍳"},{"w":"YELLOW","e":"🟡"},{"w":"YEAR","e":"📅"},{"w":"YARN","e":"🧶"}],
 words:[{"w":"YAM","e":"🍠","h":"a food like a potato"},{"w":"YES","e":"✅","h":"not no"}],
 family:[{"w":"DAM","e":"🌊"},{"w":"HAM","e":"🍖"},{"w":"JAM","e":"🍯"},{"w":"RAM","e":"🐏"},{"w":"SAM","e":"👦"},{"w":"YAM","e":"🍠"}],
 hfw:[{"w":"HAD","s":"Sam had a yoyo."},{"w":"AND","s":"A yam and some ham."}],
 plan:["sound","beginSound","write:l","tapAll","starts","listen","initial","blend","sound","write:u"],
 story:{"t":"The Yard of Yellow","art":"🪀🟡","lines":["Every wall in the yard was painted the same *yellow*.","A boy spun a *yoyo* up and down and gave a great *yawn*.","'*Yuh*, *yuh*,' he said. '*Yam*. *Yolk*. *Yacht*.'","Sam *had* a turn with the yoyo. *Y* went into the bag."]}},

{no:7, region:"The Asking Arch", art:"🏛️",
 grad:"linear-gradient(135deg,#F0B7A3,#B0523C)",
 kind:"sight", teaches:[],
 letters:["Y"], confuse:["J","G","V"], teach:"the words yes and you",
 vocab:[{"w":"HAT","e":"🎩"},{"w":"CAT","e":"🐱"},{"w":"ANT","e":"🐜"},{"w":"MAN","e":"👨"},{"w":"VAN","e":"🚐"},{"w":"MAP","e":"🗺️"}],
 words:[{"w":"YES","e":"✅","h":"not no"},{"w":"YOU","e":"👉","h":"me and you"},{"w":"HAS","e":"🎁","h":"Dan has a hat"},{"w":"AND","e":"🔗","h":"you and me"},{"w":"BAT","e":"🦇","h":"it flies at night"},{"w":"DAN","e":"🧒","h":"a boy's name"}],
 family:[{"w":"CAN","e":"🥫"},{"w":"FAN","e":"🌀"},{"w":"MAN","e":"👨"},{"w":"PAN","e":"🍳"},{"w":"RAN","e":"🏃"},{"w":"VAN","e":"🚐"}],
 hfw:[{"w":"YES","s":"Yes, you can!"},{"w":"YOU","s":"You had a hat."},{"w":"HAS","s":"Dan has a van."},{"w":"AND","s":"Dan and the man."},{"w":"A","s":"A cat and an ant."}],
 sentences:[{"s":["YES","YOU","CAN"],"e":"✅"},{"s":["YOU","HAD","A","HAT"],"e":"🎩"},{"s":["DAN","HAS","A","VAN"],"e":"🚐"},{"s":["THE","ANT","AND","THE","MAN"],"e":"🐜"}],
 plan:["sight","pickWord","sight","spell","blend","initial","alphabet","sentence","readLine","blendIt"],
 story:{"t":"The Arch That Asked","art":"🏛️❓","lines":["A stone arch stood alone in the sand, and it asked a question.","'Can *you* read?' it said. The whole desert went quiet.","Sam looked up. '*Yes*,' he said. '*Yes*, *you* can go.'","The arch let them through. Three places left."]}},

{no:8, region:"Box Canyon", art:"📦",
 grad:"linear-gradient(135deg,#D9A87E,#8C5524)",
 kind:"grapheme", teaches:["X"], position:"final",
 letters:["X"], confuse:["Z","K","Y"], teach:"x, the sound at the end",
 vocab:[{"w":"BOX","e":"📦"},{"w":"SIX","e":"6️⃣"},{"w":"TAXI","e":"🚕"},{"w":"FOX","e":"🦊"},{"w":"EXIT","e":"🚪"},{"w":"WAX","e":"🕯️"},{"w":"MIX","e":"🥣"},{"w":"OX","e":"🐂"}],
 words:[{"w":"BOX","e":"📦","h":"you put things in it"},{"w":"OX","e":"🐂","h":"a big strong animal"},{"w":"SIX","e":"6️⃣","h":"one more than five"}],
 family:[{"w":"BOX","e":"📦"},{"w":"FOX","e":"🦊"}],
 hfw:[{"w":"THE","s":"The fox is in the box."},{"w":"IN","s":"Six in a box."}],
 plan:["sound","beginSound","write:l","tapAll","starts","listen","initial","blend","rhyme","write:u"],
 story:{"t":"Six in a Box","art":"📦🦊","lines":["The canyon walls were stacked with *boxes*, right to the top.","A *fox* counted them. '*Six*,' it said. Then, '*Ks*, *ks*.'","'That sound hides at the *end* of a word,' said Zib.","*Bo-x*. *Fo-x*. *O-x*. *X* went into the bag."]}},

{no:9, region:"Windmill Way", art:"🌬️",
 grad:"linear-gradient(135deg,#A8CFE8,#37658C)",
 kind:"grapheme", teaches:["W"],
 letters:["W"], confuse:["V","M","U"], teach:"the sound w",
 vocab:[{"w":"WEB","e":"🕸️"},{"w":"WORM","e":"🪱"},{"w":"WAND","e":"🪄"},{"w":"WATER","e":"💧"},{"w":"WOMAN","e":"👩"},{"w":"WAX","e":"🕯️"},{"w":"WINDMILL","e":"🌬️"},{"w":"WAGON","e":"🛒"}],
 words:[{"w":"WEB","e":"🕸️","h":"a spider made it"},{"w":"WAG","e":"🐕","h":"the dog wags its tail"},{"w":"ZIP","e":"🤐","h":"it does up your coat"},{"w":"BEE","e":"🐝","h":"it makes honey"}],
 family:[{"w":"BAG","e":"👜"},{"w":"RAG","e":"🧽"},{"w":"TAG","e":"🏷️"},{"w":"WAG","e":"🐕"}],
 hfw:[{"w":"SEE","s":"I can see a web."},{"w":"THE","s":"The whale is in the water."}],
 plan:["sound","beginSound","write:l","tapAll","starts","listen","initial","blend","sound","write:u"],
 story:{"t":"The Windmill and the Web","art":"🌬️🕸️","lines":["One *windmill* turned at the far edge of the glass.","A spider had spun a *web* between two of its sails.","'*Wuh*, *wuh*,' went the wind. '*Water*. *Wand*. *Worm*.'","A dog ran up to *wag* its tail. *W* was the last new sound."]}},

{no:10, region:"Tower of Glass", art:"💎",
 grad:"linear-gradient(135deg,#C7D8F0,#5A6E94)",
 kind:"review", teaches:[],
 letters:["G","L","K","Y","X","W"], confuse:["M","S","N","P","B"], teach:"every letter of this map",
 vocab:[{"w":"GOAT","e":"🐐"},{"w":"LEAF","e":"🍃"},{"w":"KITE","e":"🪁"},{"w":"YOYO","e":"🪀"},{"w":"BOX","e":"📦"},{"w":"WEB","e":"🕸️"},{"w":"VAN","e":"🚐"},{"w":"PIG","e":"🐷"},{"w":"JAM","e":"🍯"}],
 words:[{"w":"VAN","e":"🚐","h":"a little truck"},{"w":"SAD","e":"😢","h":"not happy"},{"w":"ZAP","e":"⚡","h":"a flash of lightning"},{"w":"MAN","e":"👨","h":"a grown-up"},{"w":"GAP","e":"🚧","h":"a space to get through"},{"w":"RAN","e":"🏃","h":"the man ran"},{"w":"HAM","e":"🍖","h":"you eat it"},{"w":"BAG","e":"👜","h":"you carry things in it"},{"w":"YES","e":"✅","h":"not no"},{"w":"WEB","e":"🕸️","h":"a spider made it"}],
 family:[{"w":"DAM","e":"🌊"},{"w":"HAM","e":"🍖"},{"w":"JAM","e":"🍯"},{"w":"RAM","e":"🐏"},{"w":"SAM","e":"👦"},{"w":"YAM","e":"🍠"}],
 hfw:[{"w":"HE","s":"He can see the box."},{"w":"SHE","s":"She has a bag."},{"w":"AS","s":"As big as a goat."},{"w":"HAS","s":"The king has a kite."},{"w":"YES","s":"Yes, you can."},{"w":"YOU","s":"You can see the web."}],
 sentences:[{"s":["HE","CAN","SEE","THE","BOX"],"e":"📦"},{"s":["SHE","HAS","A","BAG"],"e":"👜"},{"s":["YES","YOU","CAN","SEE","THE","GOAT"],"e":"🐐"}],
 plan:["blendIt","spell","machine","rhyme","blend","spell","sight","sentence","readLine","listen"],
 story:{"t":"The Tower of Glass","art":"💎🎶","lines":["At the end of the desert stood a tower made of clear *glass*.","Zib tipped out *G*, *L*, *K*, *Y*, *X* and *W*, and it rang like a bell.","Far below the sand, something was *singing*.","'*Yes*,' said Sam, '*you* first.' And down they went."]}}
];

/* ════════ MAP 5 · Lessons 41–50 · The Singing Caves ════════ */
const MAP5 = [

{no:1, region:"Umbrella Cavern", art:"☂️",
 grad:"linear-gradient(135deg,#B7A7E8,#5A46A0)",
 kind:"grapheme", teaches:["U"],
 letters:["U"], confuse:["N","V","O"], teach:"the sound u",
 vocab:[{"w":"UMBRELLA","e":"☂️"},{"w":"UNICORN","e":"🦄"},{"w":"UNDERGROUND","e":"🚇"},{"w":"UNHAPPY","e":"☹️"},{"w":"UNLOCK","e":"🔓"},{"w":"UNWRAP","e":"🎁"},{"w":"UP","e":"⬆️"}],
 words:[{"w":"FUN","e":"🎉","h":"a very good time"},{"w":"SUN","e":"☀️","h":"it lights up the day"},{"w":"CUP","e":"☕","h":"you drink from it"},{"w":"MUD","e":"🟤","h":"wet dirt"}],
 family:[{"w":"BUN","e":"🍞"},{"w":"FUN","e":"🎉"},{"w":"RUN","e":"🏃"},{"w":"SUN","e":"☀️"}],
 hfw:[{"w":"IS","s":"The sun is up."},{"w":"THE","s":"The cup is in the mud."}],
 plan:["sound","beginSound","write:l","tapAll","starts","listen","initial","blend","rhyme","write:u"],
 story:{"t":"Under the Umbrella","art":"☂️🦄","lines":["The way down led *under* the desert into a cool, dark cave.","Someone had left an *umbrella* open on the very first step.","'*Uh*, *uh*,' said Zib. '*Up*. *Cup*. *Mud*. *Sun*.'","'This will be *fun*,' said Sam, and took the umbrella."]}},

{no:2, region:"The Alphabet Arch", art:"🔤",
 grad:"linear-gradient(135deg,#8FD3E8,#2E7DA8)",
 kind:"skill", teaches:[], skill:"alphabet",
 letters:["A","E","I","O","U"], confuse:["B","C","D","M"], teach:"every letter, from a to z",
 vocab:[{"w":"APPLE","e":"🍎"},{"w":"BEE","e":"🐝"},{"w":"CAT","e":"🐱"},{"w":"DOG","e":"🐕"},{"w":"EGG","e":"🥚"},{"w":"FOX","e":"🦊"},{"w":"GOAT","e":"🐐"},{"w":"HAT","e":"🎩"},{"w":"KITE","e":"🪁"},{"w":"UMBRELLA","e":"☂️"}],
 words:[{"w":"CAT","e":"🐱","h":"it says meow"},{"w":"MAT","e":"🟫","h":"you wipe your feet on it"},{"w":"RAT","e":"🐀","h":"a long tail"},{"w":"HAM","e":"🍖","h":"you eat it"},{"w":"MAP","e":"🗺️","h":"it shows the way"},{"w":"TAP","e":"🚰","h":"water comes out"},{"w":"GAP","e":"🚧","h":"a space to get through"},{"w":"ZAP","e":"⚡","h":"a flash of lightning"}],
 family:[{"w":"CAP","e":"🧢"},{"w":"GAP","e":"🚧"},{"w":"LAP","e":"🦵"},{"w":"MAP","e":"🗺️"},{"w":"NAP","e":"😴"},{"w":"TAP","e":"🚰"},{"w":"ZAP","e":"⚡"}],
 hfw:[{"w":"IT","s":"It is a big cat."},{"w":"THE","s":"The rat sat on the mat."},{"w":"SEE","s":"I can see the letters."},{"w":"YOU","s":"You know them all."},{"w":"YES","s":"Yes, from a to z."}],
 sentences:[{"s":["THE","RAT","SAT","ON","THE","MAT"],"e":"🐀"},{"s":["IT","IS","A","BIG","GAP"],"e":"🚧"}],
 plan:["alphabet","caseMatch","alphabet","match","spell","blend","sight","rhyme","pickWord","spell"],
 story:{"t":"Twenty-Six Lamps","art":"🔤✨","lines":["The tunnel opened into an arch lit by twenty-six little lamps.","One for every letter, *a* to *z*, in a long curve overhead.","Sam walked under them and said each sound as he passed.","Not one lamp went out. 'You know the whole *alphabet*,' said Zib."]}},

{no:3, region:"The Kid's Hideout", art:"🧒",
 grad:"linear-gradient(135deg,#A8D8C9,#357A66)",
 kind:"family", teaches:[], rime:"ID",
 letters:["I","D"], confuse:["E","A","B"], teach:"the -id family",
 vocab:[{"w":"LID","e":"🫙"},{"w":"KID","e":"🧒"},{"w":"BIN","e":"🗑️"},{"w":"PIN","e":"📌"},{"w":"PIG","e":"🐷"}],
 words:[{"w":"HID","e":"🙈","h":"he hid in the cave"},{"w":"LID","e":"🫙","h":"it goes on top of a jar"},{"w":"KID","e":"🧒","h":"a child, or a young goat"},{"w":"DID","e":"✅","h":"she did it"},{"w":"BIN","e":"🗑️","h":"rubbish goes in it"}],
 family:[{"w":"DID","e":"✅"},{"w":"HID","e":"🙈"},{"w":"KID","e":"🧒"},{"w":"LID","e":"🫙"}],
 hfw:[{"w":"HAS","s":"The kid has a lid."},{"w":"IS","s":"The lid is on the bin."}],
 plan:["machine","rhyme","machine","initial","blend","spell","sight","blendIt","spell","rhyme"],
 story:{"t":"Who Hid the Lid?","art":"🧒🫙","lines":["Behind a rock, a *kid* had made a hideout out of old jars.","Every jar had a *lid* — except one, and that lid was gone.","'I *hid* it,' the kid said. 'Read my clue and you can have it.'","*Did*, *hid*, *kid*, *lid*. Sam read them all. The lid was under the bin."]}},

{no:4, region:"The Mixing Pools", art:"🥣",
 grad:"linear-gradient(135deg,#9FC7EA,#3E6FA8)",
 kind:"family", teaches:[], rime:"IN",
 letters:["I","X"], confuse:["S","Z","N"], teach:"words that end in x and in n",
 vocab:[{"w":"SIX","e":"6️⃣"},{"w":"MIX","e":"🥣"},{"w":"PIN","e":"📌"},{"w":"TIN","e":"🥫"},{"w":"FIN","e":"🐬"},{"w":"BIN","e":"🗑️"},{"w":"RING","e":"💍"},{"w":"WIN","e":"🏆"}],
 words:[{"w":"SIX","e":"6️⃣","h":"one more than five"},{"w":"FIX","e":"🔧","h":"to mend it"},{"w":"MIX","e":"🥣","h":"stir it all together"},{"w":"PIN","e":"📌","h":"it is small and sharp"},{"w":"TIN","e":"🥫","h":"a can"},{"w":"WIN","e":"🏆","h":"to come first"},{"w":"HIM","e":"🧑","h":"I can see him"},{"w":"IN","e":"📥","h":"in the box"}],
 family:[{"w":"BIN","e":"🗑️"},{"w":"FIN","e":"🐬"},{"w":"PIN","e":"📌"},{"w":"TIN","e":"🥫"},{"w":"WIN","e":"🏆"}],
 hfw:[{"w":"IN","s":"The pin is in the tin."},{"w":"HIM","s":"Sam can see him."},{"w":"IS","s":"The fin is big."}],
 sentences:[{"s":["THE","PIN","IS","IN","THE","TIN"],"e":"📌"},{"s":["SAM","CAN","SEE","HIM"],"e":"🧑"}],
 plan:["machine","rhyme","machine","initial","blend","spell","sight","pickWord","sentence","blendIt"],
 story:{"t":"Six Little Pools","art":"🥣💧","lines":["*Six* round pools sat in the cave floor, each a different colour.","Zib dropped a *pin* in one and the whole lot began to *mix*.","'Do not *fix* it,' laughed Sam. 'Look — a *fin*!'","A small fish went past. *Bin*, *fin*, *pin*, *tin*, *win*."]}},

{no:5, region:"Pebble Pit", art:"🕳️",
 grad:"linear-gradient(135deg,#D9C7A8,#8C7042)",
 kind:"family", teaches:[], rime:"IT",
 letters:["I","T"], confuse:["A","E","L"], teach:"the -it family",
 vocab:[{"w":"SIT","e":"🪑"},{"w":"HIT","e":"🥊"},{"w":"KIT","e":"🧰"},{"w":"LIT","e":"🕯️"},{"w":"PIT","e":"🕳️"},{"w":"FIT","e":"👕"},{"w":"BIT","e":"🍪"}],
 words:[{"w":"SIT","e":"🪑","h":"sit down here"},{"w":"HIT","e":"🥊","h":"to give it a bang"},{"w":"BIT","e":"🍪","h":"a little piece"},{"w":"FIT","e":"👕","h":"the right size"},{"w":"LIT","e":"🕯️","h":"the lamp is lit"},{"w":"PIT","e":"🕳️","h":"a big hole"},{"w":"IT","e":"🟰","h":"it is here"}],
 family:[{"w":"BIT","e":"🍪"},{"w":"FIT","e":"👕"},{"w":"HIT","e":"🥊"},{"w":"LIT","e":"🕯️"},{"w":"PIT","e":"🕳️"},{"w":"SIT","e":"🪑"}],
 hfw:[{"w":"IT","s":"It is in the pit."},{"w":"THIS","s":"This hat can fit."}],
 plan:["machine","rhyme","machine","initial","blend","spell","sight","pickWord","blendIt","spell"],
 story:{"t":"A Bit of a Pit","art":"🕳️🕯️","lines":["The floor dropped away into a round *pit* full of smooth pebbles.","Sam *lit* the lamp and sat on the edge. '*It* is deep,' he said.","Each pebble had a word on it, and every word ended the same.","*Bit*, *fit*, *hit*, *lit*, *pit*, *sit*. He read the lot."]}},

{no:6, region:"The Big Dig", art:"⛏️",
 grad:"linear-gradient(135deg,#F0A8A8,#A83A3A)",
 kind:"family", teaches:[], rime:"IG",
 letters:["I","G"], confuse:["J","Q","P"], teach:"the -ig family",
 vocab:[{"w":"PIG","e":"🐷"},{"w":"WIG","e":"👱"},{"w":"DIG","e":"⛏️"},{"w":"BIG","e":"🐘"},{"w":"CASTLE","e":"🏰"},{"w":"QUEEN","e":"👑"},{"w":"DRESS","e":"👗"},{"w":"HORSE","e":"🐴"}],
 words:[{"w":"BIG","e":"🐘","h":"not little"},{"w":"DIG","e":"⛏️","h":"make a hole"},{"w":"PIG","e":"🐷","h":"it says oink"},{"w":"WIG","e":"👱","h":"hair you put on"},{"w":"RIG","e":"🚚","h":"a very big truck"}],
 family:[{"w":"BIG","e":"🐘"},{"w":"DIG","e":"⛏️"},{"w":"PIG","e":"🐷"},{"w":"RIG","e":"🚚"},{"w":"WIG","e":"👱"}],
 hfw:[{"w":"LIKE","s":"I like the big pig."},{"w":"SAID","s":"'Dig!' said Sam."},{"w":"THIS","s":"This pig is big."}],
 sentences:[{"s":["THIS","PIG","IS","BIG"],"e":"🐷"},{"s":["I","LIKE","THE","BIG","WIG"],"e":"👱"}],
 plan:["machine","rhyme","machine","initial","blend","spell","sight","sentence","readLine","blendIt"],
 story:{"t":"The Queen Who Dug","art":"⛏️👑","lines":["Under a buried *castle*, a *queen* in a muddy *dress* was digging.","Her *crown* was on a rock. Her *wig* was on the crown.","'*Dig*,' she *said*. 'There is something *big* down here.'","Sam dug. Out came a *pig*, cross as anything."]}},

{no:7, region:"The Pointing Stone", art:"🪧",
 grad:"linear-gradient(135deg,#A8C8B0,#456F55)",
 kind:"sight", teaches:[],
 letters:["I"], confuse:["E","A","U"], teach:"the word this",
 vocab:[{"w":"PIG","e":"🐷"},{"w":"LID","e":"🫙"},{"w":"PIN","e":"📌"},{"w":"HILL","e":"⛰️"},{"w":"DOG","e":"🐕"},{"w":"CAT","e":"🐱"}],
 words:[{"w":"THIS","e":"👉","h":"this one, right here"},{"w":"WAG","e":"🐕","h":"the dog wags its tail"},{"w":"BIG","e":"🐘","h":"not little"},{"w":"DIG","e":"⛏️","h":"make a hole"},{"w":"SIT","e":"🪑","h":"sit down here"},{"w":"HID","e":"🙈","h":"he hid in the cave"}],
 family:[{"w":"BAG","e":"👜"},{"w":"RAG","e":"🧽"},{"w":"TAG","e":"🏷️"},{"w":"WAG","e":"🐕"}],
 hfw:[{"w":"THIS","s":"This is my hat."},{"w":"IS","s":"This dog is big."},{"w":"HAS","s":"This kid has a pin."},{"w":"IT","s":"It is this one."}],
 sentences:[{"s":["THIS","IS","A","BIG","PIG"],"e":"🐷"},{"s":["THIS","KID","CAN","DIG"],"e":"🧒"},{"s":["THE","DOG","CAN","WAG"],"e":"🐕"}],
 plan:["sight","pickWord","sight","spell","blend","initial","rhyme","sentence","readLine","blendIt"],
 story:{"t":"The Stone That Pointed","art":"🪧👉","lines":["Three tunnels. One stone, carved into a pointing hand.","Under the hand, four letters: *t*, *h*, *i*, *s*.","'*This* one,' read Sam, and the middle tunnel lit up.","A dog came out of it to *wag* them along."]}},

{no:8, region:"The Zip Line", art:"🎢",
 grad:"linear-gradient(135deg,#8FB7E8,#2F4F94)",
 kind:"family", teaches:[], rime:"IP",
 letters:["I","P"], confuse:["B","D","T"], teach:"the -ip family",
 vocab:[{"w":"LIP","e":"👄"},{"w":"ZIP","e":"🤐"},{"w":"RIP","e":"📄"},{"w":"SIP","e":"🥤"},{"w":"SHIP","e":"🚢"},{"w":"DRIP","e":"💧"},{"w":"BLUE","e":"🔵"},{"w":"BLACK","e":"⚫"}],
 words:[{"w":"LIP","e":"👄","h":"it is on your face"},{"w":"ZIP","e":"🤐","h":"it does up your coat"},{"w":"RIP","e":"📄","h":"to tear it"},{"w":"DIP","e":"🥣","h":"put it in and take it out"},{"w":"SIP","e":"🥤","h":"a little drink"},{"w":"TIP","e":"📍","h":"the very end of it"},{"w":"HIP","e":"🕺","h":"beside your leg"}],
 family:[{"w":"DIP","e":"🥣"},{"w":"HIP","e":"🕺"},{"w":"LIP","e":"👄"},{"w":"RIP","e":"📄"},{"w":"SIP","e":"🥤"},{"w":"TIP","e":"📍"},{"w":"ZIP","e":"🤐"}],
 hfw:[{"w":"LITTLE","s":"A little black cat."}],
 plan:["machine","rhyme","machine","initial","blend","spell","sight","pickWord","blendIt","spell"],
 story:{"t":"Zip Across the Dark","art":"🎢🤐","lines":["The tunnel ended at a drop, with one wire running over it.","Sam *zipped* his coat, took a *sip* of water and held on.","'Do not let the rope *rip*,' said Zib, from the very *tip* of it.","*Dip*, *hip*, *lip*, *rip*, *sip*, *tip*, *zip* — and they were across."]}},

{no:9, region:"Hilltop Mill", art:"🏔️",
 grad:"linear-gradient(135deg,#C7B7E0,#5F4A8C)",
 kind:"family", teaches:[], rime:"ILL",
 letters:["I","L"], confuse:["T","E","F"], teach:"the -ill family",
 vocab:[{"w":"HILL","e":"⛰️"},{"w":"MILL","e":"🏭"},{"w":"PILL","e":"💊"},{"w":"BILL","e":"🧾"},{"w":"FILL","e":"🥛"},{"w":"JILL","e":"👧"},{"w":"GILL","e":"🐟"}],
 words:[{"w":"HILL","e":"⛰️","h":"you walk up it"},{"w":"WILL","e":"✍️","h":"I will do it"},{"w":"FILL","e":"🥛","h":"fill it right up"},{"w":"BILL","e":"🧾","h":"it says what to pay"},{"w":"MILL","e":"🏭","h":"it grinds up the grain"},{"w":"PILL","e":"💊","h":"medicine to swallow"},{"w":"JILL","e":"👧","h":"a girl's name"}],
 family:[{"w":"BILL","e":"🧾"},{"w":"FILL","e":"🥛"},{"w":"HILL","e":"⛰️"},{"w":"JILL","e":"👧"},{"w":"MILL","e":"🏭"},{"w":"PILL","e":"💊"},{"w":"WILL","e":"✍️"}],
 hfw:[{"w":"WILL","s":"Jill will go up the hill."},{"w":"THIS","s":"This hill is big."}],
 sentences:[{"s":["JILL","WILL","RUN","UP","THE","HILL"],"e":"⛰️"},{"s":["THIS","MILL","IS","BIG"],"e":"🏭"}],
 plan:["machine","rhyme","machine","initial","blend","spell","sight","sentence","readLine","blendIt"],
 story:{"t":"Up the Hill to the Mill","art":"🏔️🏭","lines":["The cave opened out, and inside it stood a *hill* with a *mill* on top.","A girl called *Jill* was carrying a jug up to *fill* it.","'Two l's at the end,' she said, 'and they only say one sound.'","*Bill*, *fill*, *hill*, *Jill*, *mill*, *pill*, *will*."]}},

{no:10, region:"The Singing Cave", art:"🎶",
 grad:"linear-gradient(135deg,#7FB77E,#2F5A2E)",
 kind:"family", teaches:[], rime:"ING",
 letters:["U","I","N","G"], confuse:["A","E","O","M"], teach:"every sound of this map",
 vocab:[{"w":"KING","e":"👑"},{"w":"RING","e":"💍"},{"w":"WING","e":"🪶"},{"w":"SUN","e":"☀️"},{"w":"SIX","e":"6️⃣"},{"w":"PIG","e":"🐷"},{"w":"HILL","e":"⛰️"},{"w":"BIRD","e":"🐦"}],
 words:[{"w":"KING","e":"👑","h":"he wears a crown"},{"w":"RING","e":"💍","h":"it goes on your finger"},{"w":"SING","e":"🎤","h":"to make a song"},{"w":"WING","e":"🪶","h":"a bird has two"},{"w":"BIRD","e":"🐦","h":"it can fly"},{"w":"TWO","e":"2️⃣","h":"one more than one"},{"w":"BIG","e":"🐘","h":"not little"},{"w":"SIT","e":"🪑","h":"sit down here"},{"w":"LID","e":"🫙","h":"it goes on top of a jar"},{"w":"WIN","e":"🏆","h":"to come first"}],
 family:[{"w":"KING","e":"👑"},{"w":"RING","e":"💍"},{"w":"SING","e":"🎤"},{"w":"WING","e":"🪶"}],
 hfw:[{"w":"CANNOT","s":"The pig cannot sing."},{"w":"THIS","s":"This is a big ring."},{"w":"IT","s":"It is on the hill."},{"w":"LIKE","s":"I like the song."}],
 sentences:[{"s":["THE","KING","HAS","A","RING"],"e":"👑"},{"s":["THE","BIRD","CAN","SING"],"e":"🐦"},{"s":["THIS","IS","A","BIG","WING"],"e":"🪶"}],
 plan:["machine","blendIt","spell","machine","blend","spell","sight","sentence","readLine","rhyme"],
 story:{"t":"The Cave That Sang","art":"🎶👑","lines":["The singing came from the last cave of all, and it never stopped.","A *king* sat there with a *ring* on every finger, singing one long note.","'*-ing*,' he sang. '*King*. *Ring*. *Sing*. *Wing*.'","A *bird* flew up and out, and Sam saw daylight — and, far off, the sea."]}}
];

/* ════════ MAP 6 · Lessons 51–60 · Frost Harbour ════════ */
const MAP6 = [

{no:1, region:"Frost Pier", art:"🧊",
 grad:"linear-gradient(135deg,#BFE3F0,#3E7C9E)",
 kind:"review", teaches:[],
 letters:["P","K"], confuse:["B","D","G"], teach:"the words go and by",
 vocab:[{"w":"PIER","e":"🛥️"},{"w":"PIG","e":"🐷"},{"w":"BEE","e":"🐝"},{"w":"ICE","e":"🧊"},{"w":"SHIP","e":"🚢"},{"w":"ROPE","e":"🪢"}],
 words:[{"w":"GO","e":"➡️","h":"do not stop"},{"w":"BY","e":"🚶","h":"right beside it"},{"w":"PINK","e":"🌸","h":"a light red"},{"w":"BIG","e":"🐘","h":"not little"}],
 family:[{"w":"BIG","e":"🐘"},{"w":"DIG","e":"⛏️"},{"w":"PIG","e":"🐷"},{"w":"WIG","e":"👱"}],
 hfw:[{"w":"GO","s":"Go up the pier."},{"w":"BY","s":"The ship is by the pier."},{"w":"THIS","s":"This ice is thick."}],
 plan:["sight","pickWord","blendIt","spell","blend","initial","rhyme","spell","machine","rhyme"],
 story:{"t":"The Frozen Pier","art":"🧊🛥️","lines":["The cave let them out at a harbour, and the whole harbour was frozen.","A long wooden pier ran out into the white, with two words nailed to it.","'*Go*,' read Sam. And underneath: '*By* the ship.'","So they went by the ship, and their boots did not slip once."]}},

{no:2, region:"The Hot Pot", art:"🍲",
 grad:"linear-gradient(135deg,#F0A87E,#A6521E)",
 kind:"family", teaches:[], rime:"OT",
 letters:["O","T"], confuse:["A","U","C"], teach:"the -ot family",
 vocab:[{"w":"POT","e":"🍲"},{"w":"DOT","e":"⚫"},{"w":"COT","e":"🛏️"},{"w":"SEAGULL","e":"🕊️"},{"w":"TURTLE","e":"🐢"},{"w":"DOLPHIN","e":"🐬"},{"w":"WHALE","e":"🐋"},{"w":"MERMAID","e":"🧜"}],
 words:[{"w":"HOT","e":"🔥","h":"not cold"},{"w":"POT","e":"🍲","h":"you cook soup in it"},{"w":"DOT","e":"⚫","h":"a tiny round mark"},{"w":"GOT","e":"🎁","h":"she got a gift"},{"w":"LOT","e":"📚","h":"a great many"},{"w":"NOT","e":"🚫","h":"the opposite of yes"},{"w":"COT","e":"🛏️","h":"a little bed"}],
 family:[{"w":"COT","e":"🛏️"},{"w":"DOT","e":"⚫"},{"w":"GOT","e":"🎁"},{"w":"HOT","e":"🔥"},{"w":"LOT","e":"📚"},{"w":"NOT","e":"🚫"},{"w":"POT","e":"🍲"}],
 hfw:[{"w":"LOOK","s":"Look in the pot."},{"w":"IS","s":"The pot is hot."}],
 plan:["machine","rhyme","machine","initial","blend","spell","sight","pickWord","blendIt","spell"],
 story:{"t":"One Pot Kept Warm","art":"🍲🐬","lines":["At the end of the pier, one *pot* was still bubbling *hot*.","A *turtle*, a *dolphin* and a very rude *seagull* were waiting for it.","'*Look*,' said the seagull. 'She *got* here first.'","*Cot*, *dot*, *got*, *hot*, *lot*, *not*, *pot*. Soup all round."]}},

{no:3, region:"Foggy Docks", art:"🌫️",
 grad:"linear-gradient(135deg,#C4CFD9,#5A6B7A)",
 kind:"family", teaches:[], rime:"OG",
 letters:["O","G"], confuse:["A","C","Q"], teach:"the -og family",
 vocab:[{"w":"DOG","e":"🐕"},{"w":"LOG","e":"🪵"},{"w":"FOG","e":"🌫️"},{"w":"FROG","e":"🐸"},{"w":"ROCK","e":"🪨"},{"w":"HOG","e":"🐖"}],
 words:[{"w":"DOG","e":"🐕","h":"it says woof"},{"w":"LOG","e":"🪵","h":"a cut piece of tree"},{"w":"FOG","e":"🌫️","h":"cloud down on the ground"},{"w":"JOG","e":"🏃","h":"to run slowly"},{"w":"HOG","e":"🐖","h":"another word for pig"},{"w":"COG","e":"⚙️","h":"a wheel with teeth"}],
 family:[{"w":"COG","e":"⚙️"},{"w":"DOG","e":"🐕"},{"w":"FOG","e":"🌫️"},{"w":"HOG","e":"🐖"},{"w":"JOG","e":"🏃"},{"w":"LOG","e":"🪵"}],
 hfw:[{"w":"LOOK","s":"Look at the dog on the log."},{"w":"THE","s":"The fog is thick."}],
 plan:["machine","rhyme","machine","initial","blend","spell","sight","blendIt","spell","rhyme"],
 story:{"t":"A Dog in the Fog","art":"🌫️🐕","lines":["*Fog* came down over the docks until Sam could not see his own boots.","Something sat on a *log*, waiting. It was a *dog*.","'*Look*,' it seemed to say, and set off at a *jog*.","They followed. *Cog*, *dog*, *fog*, *hog*, *jog*, *log*."]}},

{no:4, region:"The Shop on the Slope", art:"🏪",
 grad:"linear-gradient(135deg,#F0C27E,#A87226)",
 kind:"family", teaches:[], rime:"OP",
 letters:["O","P"], confuse:["A","B","D"], teach:"the -op family",
 vocab:[{"w":"MOP","e":"🧹"},{"w":"TOP","e":"🔝"},{"w":"POP","e":"🎈"},{"w":"SHOP","e":"🏪"},{"w":"STOP","e":"🛑"},{"w":"PLAYGROUND","e":"🛝"}],
 words:[{"w":"HOP","e":"🐇","h":"a little jump"},{"w":"MOP","e":"🧹","h":"you clean the floor with it"},{"w":"POP","e":"🎈","h":"the sound a balloon makes"},{"w":"TOP","e":"🔝","h":"the highest bit"},{"w":"COP","e":"👮","h":"a police officer"},{"w":"STOP","e":"🛑","h":"do not go"},{"w":"SHOP","e":"🏪","h":"you buy things there"}],
 family:[{"w":"COP","e":"👮"},{"w":"HOP","e":"🐇"},{"w":"MOP","e":"🧹"},{"w":"POP","e":"🎈"},{"w":"SHOP","e":"🏪"},{"w":"STOP","e":"🛑"},{"w":"TOP","e":"🔝"}],
 hfw:[{"w":"PLAY","s":"We play at the top."},{"w":"GO","s":"Go to the top."}],
 plan:["machine","rhyme","machine","initial","blend","spell","sight","pickWord","blendIt","spell"],
 story:{"t":"Everything Must Stop","art":"🏪🛑","lines":["Halfway up the slope stood one small *shop* with a red sign.","*STOP*, it said. And under that, in tiny letters: *or hop*.","So Sam *hopped* — all the way to the *top* of the slope.","The shopkeeper laughed and let them *play* on the roof."]}},

{no:5, region:"The Popcorn Stall", art:"🍿",
 grad:"linear-gradient(135deg,#F5E0A8,#C49A2E)",
 kind:"family", teaches:[], rime:"OTS",
 letters:["O","S"], confuse:["C","Z","A"], teach:"adding s to make more than one",
 vocab:[{"w":"POPCORN","e":"🍿"},{"w":"HOTDOG","e":"🌭"},{"w":"POT","e":"🍲"},{"w":"DOT","e":"⚫"},{"w":"LOG","e":"🪵"},{"w":"MOP","e":"🧹"}],
 words:[{"w":"LOTS","e":"📚","h":"a great many"},{"w":"POTS","e":"🍲","h":"more than one pot"},{"w":"DOTS","e":"⚫","h":"more than one dot"},{"w":"HOPS","e":"🐇","h":"she hops along"},{"w":"TOPS","e":"🔝","h":"more than one top"}],
 family:[{"w":"COTS","e":"🛏️"},{"w":"DOTS","e":"⚫"},{"w":"LOTS","e":"📚"},{"w":"POTS","e":"🍲"}],
 hfw:[{"w":"LOOK","s":"Look at all the pots."},{"w":"AND","s":"Popcorn and a hotdog."}],
 plan:["machine","spell","machine","blend","rhyme","initial","sight","pickWord","blendIt","spell"],
 story:{"t":"Lots and Lots","art":"🍿🌭","lines":["The stall sold *popcorn* in *pots* and *hotdogs* in rows.","'How many?' asked the seller. Sam looked. '*Lots*,' he said.","Zib found the trick: one *pot*, two *pots*. One *dot*, ten *dots*.","'Add an *s*,' said Zib, 'and one turns into many.'"]}},

{no:6, region:"The Red Sail", art:"⛵",
 grad:"linear-gradient(135deg,#F09A9A,#A83232)",
 kind:"sight", teaches:[],
 letters:["N","O"], confuse:["M","A","U"], teach:"the words not, are and said",
 vocab:[{"w":"RED","e":"🟥"},{"w":"YELLOW","e":"🟡"},{"w":"SAIL","e":"⛵"},{"w":"HAPPY","e":"😀"},{"w":"SAD","e":"😢"},{"w":"DOG","e":"🐕"}],
 words:[{"w":"NOT","e":"🚫","h":"the opposite of yes"},{"w":"ARE","e":"🤝","h":"we are here"},{"w":"SAID","e":"💬","h":"she said it out loud"},{"w":"GOT","e":"🎁","h":"she got a gift"},{"w":"HOT","e":"🔥","h":"not cold"}],
 family:[{"w":"COT","e":"🛏️"},{"w":"GOT","e":"🎁"},{"w":"HOT","e":"🔥"},{"w":"NOT","e":"🚫"},{"w":"POT","e":"🍲"}],
 hfw:[{"w":"ARE","s":"We are happy."},{"w":"SAID","s":"'Stop,' said Sam."},{"w":"NOT","s":"The sail is not red."}],
 sentences:[{"s":["THE","SAIL","IS","NOT","RED"],"e":"⛵"},{"s":["WE","ARE","HAPPY"],"e":"😀"},{"s":["STOP","SAID","SAM"],"e":"🛑"}],
 plan:["sight","pickWord","sight","spell","blend","initial","rhyme","sentence","readLine","blendIt"],
 story:{"t":"The Sail That Was Not Red","art":"⛵🟨","lines":["One boat in the harbour had a sail everybody talked about.","'It is red,' *said* the seagull. 'We *are* certain of it.'","The fog lifted. The sail was *yellow*. It was *not* red at all.","'*Said* is a word you cannot sound out,' said Zib. 'You just know it.'"]}},

{no:7, region:"The Royal Ship", art:"🚢",
 grad:"linear-gradient(135deg,#C9A7E8,#6B3FA0)",
 kind:"sight", teaches:[],
 letters:["W","H"], confuse:["M","N","V"], teach:"the words we, his and her",
 vocab:[{"w":"KING","e":"👑"},{"w":"PRINCESS","e":"👸"},{"w":"PRINCE","e":"🤴"},{"w":"KNIGHT","e":"🛡️"},{"w":"LADY","e":"👩"},{"w":"BONE","e":"🦴"},{"w":"GAME","e":"🎲"}],
 words:[{"w":"WE","e":"👥","h":"you and me together"},{"w":"HIS","e":"👦","h":"it belongs to him"},{"w":"HER","e":"👧","h":"it belongs to her"},{"w":"GOT","e":"🎁","h":"she got a gift"},{"w":"DOG","e":"🐕","h":"it says woof"}],
 family:[{"w":"COG","e":"⚙️"},{"w":"DOG","e":"🐕"},{"w":"FOG","e":"🌫️"},{"w":"JOG","e":"🏃"},{"w":"LOG","e":"🪵"}],
 hfw:[{"w":"WE","s":"We can see the ship."},{"w":"HIS","s":"His dog got a bone."},{"w":"HER","s":"Her game is on the top."},{"w":"SAID","s":"'Come in,' said the King."}],
 sentences:[{"s":["WE","CAN","SEE","THE","KING"],"e":"👑"},{"s":["HIS","DOG","GOT","A","BONE"],"e":"🦴"},{"s":["HER","GAME","IS","ON","THE","TOP"],"e":"🎲"}],
 plan:["sight","pickWord","sight","spell","blend","initial","alphabet","sentence","readLine","blendIt"],
 story:{"t":"Whose Is Whose?","art":"🚢👑","lines":["The biggest ship in the harbour belonged to a *King* and a *Queen*.","*His* dog had a *bone*. *Her* knight had a *game* of dice.","'*We* have room for two more,' *said* the Queen.","So Sam and Zib went aboard, and nobody minded at all."]}},

{no:8, region:"Cod Jetty", art:"🐟",
 grad:"linear-gradient(135deg,#9FD6C7,#2E7A66)",
 kind:"family", teaches:[], rime:"OD",
 letters:["O","D"], confuse:["A","B","P"], teach:"the -od family",
 vocab:[{"w":"COD","e":"🐟"},{"w":"ROD","e":"🎣"},{"w":"POD","e":"🫛"},{"w":"DOCK","e":"⚓"},{"w":"LOCK","e":"🔒"},{"w":"CLOCK","e":"🕰️"},{"w":"BOXES","e":"📦"}],
 words:[{"w":"COD","e":"🐟","h":"a fish you can eat"},{"w":"ROD","e":"🎣","h":"you catch fish with it"},{"w":"NOD","e":"🙂","h":"to say yes with your head"},{"w":"POD","e":"🫛","h":"peas grow in it"},{"w":"DOCK","e":"⚓","h":"where a boat ties up"}],
 family:[{"w":"COD","e":"🐟"},{"w":"NOD","e":"🙂"},{"w":"POD","e":"🫛"},{"w":"ROD","e":"🎣"}],
 hfw:[{"w":"LOOK","s":"Look at the cod."},{"w":"BY","s":"The rod is by the dock."}],
 plan:["machine","rhyme","machine","initial","blend","spell","sight","pickWord","blendIt","spell"],
 story:{"t":"One Nod from the Dock","art":"🐟🎣","lines":["An old fisher sat at the end of the *dock* with a bent *rod*.","She did not speak. She only gave a slow *nod*.","Then the line went tight and up came a *cod* the size of a boot.","*Cod*, *nod*, *pod*, *rod*. Sam wrote all four in the frost."]}},

{no:9, region:"Puppy Point", art:"🐶",
 grad:"linear-gradient(135deg,#F5C7A8,#B06B36)",
 kind:"ending", teaches:[], suffix:"Y", suffixSound:"eee",
 letters:["Y"], confuse:["I","E","J"], teach:"y on the end saying eee",
 vocab:[{"w":"PUPPY","e":"🐶"},{"w":"MUDDY","e":"🟤"},{"w":"MESSY","e":"🌪️"},{"w":"SILLY","e":"🤪"},{"w":"SORRY","e":"😔"},{"w":"BOSSY","e":"🗣️"},{"w":"BEAR","e":"🐻"},{"w":"MOUSE","e":"🐭"}],
 words:[{"w":"PUPPY","e":"🐶","h":"a baby dog"},{"w":"MUDDY","e":"🟤","h":"covered in mud"},{"w":"SILLY","e":"🤪","h":"very funny and daft"},{"w":"MESSY","e":"🌪️","h":"not tidy at all"},{"w":"SORRY","e":"😔","h":"you say it when you are wrong"}],
 family:[{"w":"BOSSY","e":"🗣️"},{"w":"MESSY","e":"🌪️"},{"w":"MUDDY","e":"🟤"},{"w":"SILLY","e":"🤪"}],
 hfw:[{"w":"VERY","s":"The puppy is very muddy."},{"w":"IS","s":"He is silly."},{"w":"SAID","s":"'Sorry,' said the puppy."}],
 plan:["listen","rhyme","addEnding","blendIt","blend","spell","sight","spell","addEnding","rhyme"],
 story:{"t":"The Very Muddy Puppy","art":"🐶🟤","lines":["A *puppy* came tearing along the point, *very* *muddy* and *very* pleased.","It knocked over a bear, a mouse and one extremely *bossy* seagull.","'*Silly*! *Messy*!' they shouted. The puppy looked *sorry* for a second.","'Listen to the end,' said Zib. 'That *y* is saying *eee*.'"]}},

{no:10, region:"Clockwork Harbour", art:"🕰️",
 grad:"linear-gradient(135deg,#A8C4D9,#3E5F7A)",
 kind:"family", teaches:[], rime:"OCK",
 letters:["O","C","K"], confuse:["A","U","G"], teach:"every sound of this map",
 vocab:[{"w":"CLOCK","e":"🕰️"},{"w":"ROCK","e":"🪨"},{"w":"DOCK","e":"⚓"},{"w":"POT","e":"🍲"},{"w":"DOG","e":"🐕"},{"w":"SHOP","e":"🏪"},{"w":"COD","e":"🐟"},{"w":"PUPPY","e":"🐶"}],
 words:[{"w":"CLOCK","e":"🕰️","h":"it tells you the time"},{"w":"ROCK","e":"🪨","h":"a very hard stone"},{"w":"SOCK","e":"🧦","h":"it goes on your foot"},{"w":"LOCK","e":"🔒","h":"you need a key for it"},{"w":"DOCK","e":"⚓","h":"where a boat ties up"},{"w":"HOT","e":"🔥","h":"not cold"},{"w":"STOP","e":"🛑","h":"do not go"},{"w":"NOD","e":"🙂","h":"to say yes with your head"}],
 family:[{"w":"CLOCK","e":"🕰️"},{"w":"DOCK","e":"⚓"},{"w":"LOCK","e":"🔒"},{"w":"ROCK","e":"🪨"},{"w":"SOCK","e":"🧦"}],
 hfw:[{"w":"WORDS","s":"I can read the words."},{"w":"LOOK","s":"Look at the clock."},{"w":"PLAY","s":"We play by the dock."},{"w":"WE","s":"We got here."},{"w":"ARE","s":"We are not late."},{"w":"SAID","s":"'Go,' said the King."}],
 sentences:[{"s":["LOOK","AT","THE","BIG","CLOCK"],"e":"🕰️"},{"s":["WE","ARE","NOT","AT","THE","SHOP"],"e":"🏪"},{"s":["HIS","DOG","SAT","ON","A","ROCK"],"e":"🪨"}],
 plan:["machine","blendIt","spell","machine","blend","spell","sight","sentence","readLine","rhyme"],
 story:{"t":"The Harbour Clock Strikes","art":"🕰️⚓","lines":["One great *clock* stood over the harbour, and it had been stopped for years.","Zib set *O*, *C* and *K* into the empty holes on its face.","It struck once. The ice cracked, the ships lifted, and the frost let go.","'Now the *words* can travel again,' said Zib. 'And so can we.'"]}}
];

/* ════════ MAP 7 · Lessons 61–70 · The Rumbling Road ════════ */
const MAP7 = [

{no:1, region:"The First Milestone", art:"🚏",
 grad:"linear-gradient(135deg,#D9C7A8,#8C7042)",
 kind:"sight", teaches:[],
 letters:["M","B"], confuse:["N","P","D"], teach:"the words me and be",
 vocab:[{"w":"CLIMB","e":"🧗"},{"w":"EAT","e":"🍽️"},{"w":"DRAW","e":"🖍️"},{"w":"SLEEP","e":"😴"},{"w":"LAUGH","e":"😂"},{"w":"KICK","e":"🦵"},{"w":"JUMP","e":"🤸"},{"w":"READ","e":"📖"}],
 words:[{"w":"ME","e":"👤","h":"you and me"},{"w":"BE","e":"⭐","h":"I want to be a reader"},{"w":"BIG","e":"🐘","h":"not little"},{"w":"STOP","e":"🛑","h":"do not go"}],
 family:[{"w":"BIG","e":"🐘"},{"w":"DIG","e":"⛏️"},{"w":"PIG","e":"🐷"},{"w":"WIG","e":"👱"}],
 hfw:[{"w":"ME","s":"Come with me."},{"w":"BE","s":"I can be quick."},{"w":"WE","s":"We can read."}],
 plan:["sight","pickWord","sight","spell","blend","initial","alphabet","blendIt","listen","spell"],
 story:{"t":"The Road That Rumbled","art":"🚏🛻","lines":["The road out of the harbour hummed under their feet before they saw a thing.","A milestone stood at the start of it with two small words carved in.","'*Be* quick,' read Sam, 'and come with *me*.'","Then the first truck came round the bend, rumbling like thunder."]}},

{no:2, region:"Nut Hut", art:"🥜",
 grad:"linear-gradient(135deg,#E8C48A,#9E6B22)",
 kind:"family", teaches:[], rime:"UT",
 letters:["U","T"], confuse:["A","O","N"], teach:"the -ut and -up families",
 vocab:[{"w":"NUT","e":"🥜"},{"w":"CUP","e":"☕"},{"w":"HUT","e":"🛖"},{"w":"BALLOON","e":"🎈"},{"w":"GREEN","e":"🟩"},{"w":"TUB","e":"🛁"}],
 words:[{"w":"NUT","e":"🥜","h":"a hard little snack"},{"w":"CUT","e":"✂️","h":"to cut it in two"},{"w":"HUT","e":"🛖","h":"a very small house"},{"w":"BUT","e":"↩️","h":"I can, but not yet"},{"w":"PUT","e":"🫳","h":"put it down there"},{"w":"CUP","e":"☕","h":"you drink from it"},{"w":"PUP","e":"🐶","h":"a baby dog"},{"w":"UP","e":"⬆️","h":"the way to the sky"}],
 family:[{"w":"BUT","e":"↩️"},{"w":"CUT","e":"✂️"},{"w":"HUT","e":"🛖"},{"w":"NUT","e":"🥜"},{"w":"PUT","e":"🫳"}],
 hfw:[],
 plan:["machine","rhyme","machine","initial","blend","spell","sight","pickWord","blendIt","spell"],
 story:{"t":"Three Nuts and a Cup","art":"🥜☕","lines":["A green *hut* sat by the road, no bigger than a wardrobe.","Inside were *three* *nuts*, one *cup*, and a *pup* asleep on a shelf.","'*Put* one back,' said a voice. Sam did.","*But*, *cut*, *hut*, *nut*, *put* — the pup slept through all of them."]}},

{no:3, region:"Bug Bridge", art:"🐛",
 grad:"linear-gradient(135deg,#A8D88A,#417A2E)",
 kind:"family", teaches:[], rime:"UG",
 letters:["U","G"], confuse:["A","O","Q"], teach:"the -ug and -un families",
 vocab:[{"w":"BUG","e":"🐛"},{"w":"JUG","e":"🫖"},{"w":"MUG","e":"🍵"},{"w":"RUG","e":"🧿"},{"w":"BUN","e":"🍞"},{"w":"SUN","e":"☀️"}],
 words:[{"w":"BUG","e":"🐛","h":"a little crawling thing"},{"w":"DUG","e":"⛏️","h":"he dug a hole"},{"w":"HUG","e":"🤗","h":"you put your arms round"},{"w":"MUG","e":"🍵","h":"a big cup"},{"w":"TUG","e":"🪢","h":"a hard pull"},{"w":"RUN","e":"🏃","h":"go fast on your feet"},{"w":"BUN","e":"🍞","h":"a small round loaf"},{"w":"FUN","e":"🎉","h":"a very good time"}],
 family:[{"w":"BUG","e":"🐛"},{"w":"DUG","e":"⛏️"},{"w":"HUG","e":"🤗"},{"w":"JUG","e":"🫖"},{"w":"MUG","e":"🍵"},{"w":"RUG","e":"🧿"},{"w":"TUG","e":"🪢"}],
 hfw:[{"w":"THIS","s":"This bug can run."},{"w":"IS","s":"The sun is up."},{"w":"SAID","s":"'Give me a hug,' said the bug."}],
 plan:["machine","rhyme","machine","initial","blend","spell","sight","blendIt","spell","rhyme"],
 story:{"t":"The Bug Who Wanted a Hug","art":"🐛🤗","lines":["Under the bridge a very large *bug* was crying into a *mug*.","'Nobody will give me a *hug*,' it said. 'They just *run*.'","Sam gave it one. The bug cheered up and shared its *bun*.","*Bug*, *dug*, *hug*, *jug*, *mug*, *rug*, *tug*. Even the crying rhymed."]}},

{no:4, region:"Duck Puddle", art:"🦆",
 grad:"linear-gradient(135deg,#A8CFE8,#37658C)",
 kind:"family", teaches:[], rime:"UCK",
 letters:["U","C","K"], confuse:["O","A","G"], teach:"the -uck family",
 vocab:[{"w":"DUCK","e":"🦆"},{"w":"MUD","e":"🟤"},{"w":"LUCK","e":"🍀"},{"w":"BUD","e":"🌷"},{"w":"SUN","e":"☀️"},{"w":"PUDDLE","e":"💧"}],
 words:[{"w":"DUCK","e":"🦆","h":"it says quack"},{"w":"LUCK","e":"🍀","h":"good things by chance"},{"w":"MUCK","e":"🟫","h":"dirt and mess"},{"w":"MUD","e":"🟤","h":"wet dirt"},{"w":"BUD","e":"🌷","h":"a flower before it opens"},{"w":"TO","e":"➡️","h":"go to the shop"}],
 family:[{"w":"DUCK","e":"🦆"},{"w":"LUCK","e":"🍀"},{"w":"MUCK","e":"🟫"},{"w":"TUCK","e":"🛏️"}],
 hfw:[{"w":"TO","s":"Go to the puddle."},{"w":"IS","s":"The duck is in the mud."},{"w":"LOOK","s":"Look at the muck!"}],
 plan:["machine","rhyme","machine","initial","blend","spell","sight","pickWord","blendIt","spell"],
 story:{"t":"Down to the Duck Puddle","art":"🦆🟤","lines":["The road dipped, and the dip had filled right *up* with brown water.","One *duck* sat in the middle of it looking extremely pleased.","'Bad *luck*,' said Zib, as Sam stepped straight into the *muck*.","They walked on *to* the next bend, one boot squelching."]}},

{no:5, region:"Truck Stop", art:"🛻",
 grad:"linear-gradient(135deg,#E8A87E,#A0521E)",
 kind:"family", teaches:[], rime:"UCK",
 letters:["U","C","K"], confuse:["O","E","G"], teach:"more -uck words",
 vocab:[{"w":"TRUCK","e":"🛻"},{"w":"FLUFF","e":"☁️"},{"w":"PUCK","e":"🏒"},{"w":"YUCK","e":"🤢"},{"w":"TUCK","e":"🛏️"},{"w":"MUG","e":"🍵"}],
 words:[{"w":"TRUCK","e":"🛻","h":"it carries heavy loads"},{"w":"PUCK","e":"🏒","h":"you hit it on ice"},{"w":"TUCK","e":"🛏️","h":"tuck it in tight"},{"w":"YUCK","e":"🤢","h":"you say it at nasty food"},{"w":"STUCK","e":"🪤","h":"it will not move"}],
 family:[{"w":"DUCK","e":"🦆"},{"w":"LUCK","e":"🍀"},{"w":"PUCK","e":"🏒"},{"w":"STUCK","e":"🪤"},{"w":"TRUCK","e":"🛻"},{"w":"TUCK","e":"🛏️"},{"w":"YUCK","e":"🤢"}],
 hfw:[{"w":"THAT","s":"That truck is stuck."},{"w":"WE","s":"We can help."},{"w":"ARE","s":"They are not stuck now."}],
 plan:["machine","rhyme","machine","initial","blend","spell","sight","pickWord","blendIt","spell"],
 story:{"t":"The Truck That Was Stuck","art":"🛻🪤","lines":["A red *truck* had gone into the mud up to its axles.","'*Yuck*,' said the driver, who was covered to the elbows.","Sam and the bug and the duck all pushed. Out it came.","'Good *luck*,' called the driver, and rumbled off up the road."]}},

{no:6, region:"Three Ways", art:"🛤️",
 grad:"linear-gradient(135deg,#A8D8C9,#357A66)",
 kind:"digraph", teaches:["TH"], onset:"TH",
 letters:["TH"], confuse:["T","H","F"], teach:"the words there, that and this",
 vocab:[{"w":"MOUNTAIN","e":"⛰️"},{"w":"FOREST","e":"🌲"},{"w":"BRANCH","e":"🌿"},{"w":"LEAF","e":"🍃"},{"w":"HELLO","e":"👋"},{"w":"ROAD","e":"🛣️"}],
 words:[{"w":"THERE","e":"🔭","h":"over there, far off"},{"w":"THAT","e":"👆","h":"that one, not this one"},{"w":"THIS","e":"👉","h":"this one, right here"},{"w":"THE","e":"📘","h":"the little word before a naming word"}],
 family:[{"w":"THAT","e":"👆"},{"w":"THIS","e":"👉"},{"w":"THEN","e":"⏭️"},{"w":"THEM","e":"👥"}],
 hfw:[{"w":"THERE","s":"The forest is there."},{"w":"THAT","s":"That road goes up."},{"w":"THIS","s":"This road goes down."},{"w":"WE","s":"We go that way."}],
 sentences:[{"s":["THAT","ROAD","GOES","UP"],"e":"⛰️"},{"s":["THIS","IS","THE","WAY"],"e":"🛤️"},{"s":["THE","FOREST","IS","THERE"],"e":"🌲"}],
 plan:["sight","pickWord","sound","listen","blend","spell","match","sentence","readLine","beginSound"],
 story:{"t":"Three Roads, One Word","art":"🛤️🌲","lines":["The road split into three, and every one of them rumbled.","A woman waved *hello* from a rock. 'Not *that* one,' she said.","'Not *this* one either. *There* — the middle road, past the branch.'","*Th* is two letters making one sound, and it holds a lot of little words together."]}},

{no:7, region:"The Face in the Rock", art:"👀",
 grad:"linear-gradient(135deg,#C4B7A8,#6B5A42)",
 kind:"sight", teaches:[],
 letters:["H","V"], confuse:["N","W","U"], teach:"the word have",
 vocab:[{"w":"EYES","e":"👀"},{"w":"NOSE","e":"👃"},{"w":"HAIR","e":"💇"},{"w":"CHIN","e":"🧔"},{"w":"EARS","e":"👂"},{"w":"MOUTH","e":"👄"}],
 words:[{"w":"HAVE","e":"🤲","h":"I have two hands"},{"w":"HUG","e":"🤗","h":"you put your arms round"},{"w":"HUT","e":"🛖","h":"a very small house"},{"w":"WE","e":"👥","h":"you and me together"}],
 family:[{"w":"BUT","e":"↩️"},{"w":"CUT","e":"✂️"},{"w":"HUT","e":"🛖"},{"w":"NUT","e":"🥜"}],
 hfw:[{"w":"HAVE","s":"We have two ears."},{"w":"WE","s":"We have a map."},{"w":"THIS","s":"This nose is huge."}],
 sentences:[{"s":["WE","HAVE","TWO","EYES"],"e":"👀"},{"s":["I","HAVE","A","BIG","NOSE"],"e":"👃"}],
 plan:["sight","pickWord","sight","spell","blend","initial","blendIt","sentence","readLine","listen"],
 story:{"t":"The Rock That Watched","art":"👀🧔","lines":["A cliff hung over the middle road, and the cliff had a *face*.","Two stone *eyes*, one great *nose*, and a *mouth* full of *ears* listening.","'I *have* watched this road for a thousand years,' it said.","'Then you *have* earned a rest,' said Sam, and the face smiled."]}},

{no:8, region:"Counting Camp", art:"🔢",
 grad:"linear-gradient(135deg,#F0D08A,#B08A22)",
 kind:"family", teaches:[], rime:"UN",
 letters:["T","F"], confuse:["L","I","E"], teach:"the word they",
 vocab:[{"w":"ONE","e":"1️⃣"},{"w":"TWO","e":"2️⃣"},{"w":"FOUR","e":"4️⃣"},{"w":"LEGS","e":"🦵"},{"w":"TENT","e":"⛺"},{"w":"FIRE","e":"🔥"}],
 words:[{"w":"THEY","e":"👨‍👩‍👧","h":"more than one of them"},{"w":"TWO","e":"2️⃣","h":"one more than one"},{"w":"FUN","e":"🎉","h":"a very good time"},{"w":"RUN","e":"🏃","h":"go fast on your feet"}],
 family:[{"w":"BUN","e":"🍞"},{"w":"FUN","e":"🎉"},{"w":"RUN","e":"🏃"},{"w":"SUN","e":"☀️"}],
 hfw:[{"w":"THEY","s":"They have four legs."},{"w":"HAVE","s":"They have a map."}],
 sentences:[{"s":["THEY","HAVE","FOUR","LEGS"],"e":"🦵"},{"s":["THEY","CAN","RUN"],"e":"🏃"}],
 plan:["sight","pickWord","machine","spell","blend","alphabet","rhyme","sentence","readLine","blendIt"],
 story:{"t":"How Many Legs?","art":"🔢⛺","lines":["Two *tents* stood in a field, and a game was going on between them.","'*One*,' said a child. '*Two*. *Four*. How many legs have *they* got?'","The duck had two. The dog had four. The bug had far too many to count.","'*They* is the word for more than one,' said Zib, 'when you are not naming them.'"]}},

{no:9, region:"Jump Gully", art:"🤸",
 grad:"linear-gradient(135deg,#F0A8C4,#A03462)",
 kind:"family", teaches:[], rime:"UG",
 letters:["J","U"], confuse:["G","Y","I"], teach:"the word do",
 vocab:[{"w":"JUMP","e":"🤸"},{"w":"SWIM","e":"🏊"},{"w":"FLY","e":"🪰"},{"w":"GRIN","e":"😁"},{"w":"RUN","e":"🏃"},{"w":"HOP","e":"🐇"}],
 words:[{"w":"JUMP","e":"🤸","h":"push off with both feet"},{"w":"DO","e":"✔️","h":"do it now"},{"w":"JUG","e":"🫖","h":"it holds the milk"},{"w":"JUST","e":"⏱️","h":"only that and no more"}],
 family:[{"w":"BUG","e":"🐛"},{"w":"DUG","e":"⛏️"},{"w":"HUG","e":"🤗"},{"w":"JUG","e":"🫖"},{"w":"MUG","e":"🍵"},{"w":"TUG","e":"🪢"}],
 hfw:[{"w":"DO","s":"Do it now."},{"w":"THEY","s":"They can jump."},{"w":"CANNOT","s":"A pig cannot fly."}],
 sentences:[{"s":["THEY","CAN","JUMP"],"e":"🤸"},{"s":["DO","NOT","STOP"],"e":"🛑"},{"s":["A","PIG","CANNOT","FLY"],"e":"🐷"}],
 plan:["sight","pickWord","machine","spell","blend","initial","machine","sentence","readLine","blendIt"],
 story:{"t":"The Gully You Have to Jump","art":"🤸🏊","lines":["The road stopped at a gully too wide to walk and too deep to climb.","'*Do* we *jump*?' said Sam. 'Or *swim*? Or *fly*?'","Zib grinned. 'You *jump*. I am small enough to be carried.'","He *jumped*. He made it. He *grinned* the whole way down the other side."]}},

{no:10, region:"The Rumbling Bus", art:"🚌",
 grad:"linear-gradient(135deg,#C88BC4,#6A3766)",
 kind:"review", teaches:[],
 letters:["U","S"], confuse:["A","O","Z"], teach:"every sound of this map",
 vocab:[{"w":"BUS","e":"🚌"},{"w":"NUT","e":"🥜"},{"w":"BUG","e":"🐛"},{"w":"DUCK","e":"🦆"},{"w":"TRUCK","e":"🛻"},{"w":"CUP","e":"☕"},{"w":"SUN","e":"☀️"},{"w":"MUD","e":"🟤"}],
 words:[{"w":"BUS","e":"🚌","h":"lots of people ride in it"},{"w":"US","e":"👥","h":"come with us"},{"w":"CUT","e":"✂️","h":"to cut it in two"},{"w":"HUG","e":"🤗","h":"you put your arms round"},{"w":"RUN","e":"🏃","h":"go fast on your feet"},{"w":"UP","e":"⬆️","h":"the way to the sky"},{"w":"STUCK","e":"🪤","h":"it will not move"},{"w":"JUMP","e":"🤸","h":"push off with both feet"}],
 family:[{"w":"BUS","e":"🚌"},{"w":"PLUS","e":"➕"}],
 hfw:[{"w":"ME","s":"Come with me."},{"w":"BE","s":"I can be quick."},{"w":"TO","s":"Get on to the bus."},{"w":"THERE","s":"The wood is there."},{"w":"HAVE","s":"We have two seats."},{"w":"THEY","s":"They can jump."},{"w":"DO","s":"Do not stop."}],
 sentences:[{"s":["THE","BUS","IS","STUCK","IN","THE","MUD"],"e":"🚌"},{"s":["THEY","HAVE","A","BIG","TRUCK"],"e":"🛻"},{"s":["DO","NOT","RUN","TO","THE","BUS"],"e":"🏃"}],
 plan:["blendIt","spell","machine","rhyme","blend","spell","sight","sentence","readLine","listen"],
 story:{"t":"The Last Bus Out","art":"🚌🌲","lines":["At the end of the road one *bus* was waiting with its engine rumbling.","Zib tipped short *u* into the fuel tank and the whole thing woke *up*.","'Room for *us*?' asked Sam. The driver nodded at the empty seats.","It carried them to the edge of a hollow, where something was burning low and red."]}}
];

/* ════════ MAP 8 · Lessons 71–80 · Ember Hollow ════════ */
const MAP8 = [

{no:1, region:"The Long Table", art:"🍽️",
 grad:"linear-gradient(135deg,#F0B08A,#A85A2E)",
 kind:"sight", teaches:[],
 letters:["C","M"], confuse:["K","N","S"], teach:"the words come, my and here",
 vocab:[{"w":"TABLE","e":"🪑"},{"w":"PLATE","e":"🍽️"},{"w":"PEOPLE","e":"🧑‍🤝‍🧑"},{"w":"FOOD","e":"🍲"},{"w":"BAND","e":"🎺"},{"w":"DAY","e":"🌞"}],
 words:[{"w":"COME","e":"🙌","h":"come over here"},{"w":"MY","e":"🫱","h":"it belongs to me"},{"w":"HERE","e":"📍","h":"in this very place"},{"w":"CUP","e":"☕","h":"you drink from it"}],
 family:[{"w":"BUS","e":"🚌"},{"w":"CUP","e":"☕"},{"w":"CUT","e":"✂️"},{"w":"NUT","e":"🥜"}],
 hfw:[{"w":"COME","s":"Come and sit here."},{"w":"MY","s":"My plate is full."},{"w":"HERE","s":"The food is here."}],
 sentences:[{"s":["COME","AND","SIT","HERE"],"e":"🪑"},{"s":["MY","PLATE","IS","HERE"],"e":"🍽️"}],
 plan:["sight","pickWord","sight","spell","blend","initial","blendIt","sentence","readLine","listen"],
 story:{"t":"A Table in the Hollow","art":"🍽️🎺","lines":["The hollow was warm, and down the middle of it ran one very long *table*.","Every seat was taken. A *band* played at the far end.","'*Come*,' said somebody, moving up. '*Here*. Take *my* plate.'","Sam sat down between a knight and a duck and ate for an hour."]}},

{no:2, region:"The Cracking Egg", art:"🥚",
 grad:"linear-gradient(135deg,#F5E0A8,#C4972E)",
 kind:"grapheme", teaches:["NG"], position:"final", rime:"ING",
 letters:["E","NG"], confuse:["A","I","N"], teach:"e, and -ing on the end",
 vocab:[{"w":"EGG","e":"🥚"},{"w":"DINOSAUR","e":"🦕"},{"w":"NEST","e":"🪺"},{"w":"SHELL","e":"🐚"},{"w":"BABY","e":"👶"},{"w":"SPIKES","e":"🔺"}],
 words:[{"w":"EGG","e":"🥚","h":"a bird lays it"},{"w":"JUMPING","e":"🤸","h":"jumping up and down"},{"w":"BANGING","e":"🥁","h":"making a loud noise"},{"w":"ROLLING","e":"🎳","h":"going over and over"},{"w":"CRACKING","e":"⚡","h":"starting to break open"}],
 family:[{"w":"KING","e":"👑"},{"w":"RING","e":"💍"},{"w":"SING","e":"🎤"},{"w":"WING","e":"🪶"}],
 hfw:[{"w":"IS","s":"The egg is cracking."},{"w":"COME","s":"Come and look at the egg."}],
 plan:["sound","listen","sound","machine","blend","spell","sight","rhyme","match","beginSound"],
 story:{"t":"Something in the Egg","art":"🥚🦕","lines":["Under the table sat an *egg* the size of a barrel, and it was moving.","*Rolling*. *Banging*. Then, very slowly, *cracking*.","'Add *-ing*,' said Zib, 'and the word means it is happening right now.'","Out came a *baby* dinosaur, blinking, already *jumping*."]}},

{no:3, region:"The Red Beds", art:"🛏️",
 grad:"linear-gradient(135deg,#F09A9A,#A02E2E)",
 kind:"family", teaches:[], rime:"ED",
 letters:["E","D"], confuse:["A","B","O"], teach:"the -ed family",
 vocab:[{"w":"BED","e":"🛏️"},{"w":"RED","e":"🟥"},{"w":"SHED","e":"🏚️"},{"w":"BREAD","e":"🍞"},{"w":"THREAD","e":"🧵"},{"w":"SLED","e":"🛷"}],
 words:[{"w":"BED","e":"🛏️","h":"you sleep in it"},{"w":"RED","e":"🟥","h":"the colour of a fire engine"},{"w":"FED","e":"🍽️","h":"she fed the dog"},{"w":"LED","e":"🕯️","h":"he led the way"},{"w":"WED","e":"💍","h":"to get married"}],
 family:[{"w":"BED","e":"🛏️"},{"w":"FED","e":"🍽️"},{"w":"LED","e":"🕯️"},{"w":"RED","e":"🟥"},{"w":"SLED","e":"🛷"},{"w":"WED","e":"💍"}],
 hfw:[{"w":"MY","s":"My bed is red."},{"w":"HERE","s":"The bed is here."},{"w":"THEY","s":"They fed the baby."}],
 plan:["machine","rhyme","machine","initial","blend","spell","sight","pickWord","blendIt","spell"],
 story:{"t":"Nine Red Beds","art":"🛏️🟥","lines":["Nine *beds* stood in a row along the wall of the hollow, every one *red*.","The dinosaur was already asleep across four of them.","Sam *fed* it the last of the *bread* and it did not even wake.","*Bed*, *fed*, *led*, *red*, *sled*, *wed*. Then he slept too."]}},

{no:4, region:"Ten Hens", art:"🐔",
 grad:"linear-gradient(135deg,#E8C48A,#9E7022)",
 kind:"family", teaches:[], rime:"ET",
 letters:["E","N"], confuse:["A","U","M"], teach:"the -en and -et families",
 vocab:[{"w":"HEN","e":"🐔"},{"w":"PEN","e":"🖊️"},{"w":"DEN","e":"🕳️"},{"w":"TEN","e":"🔟"},{"w":"JET","e":"✈️"},{"w":"NET","e":"🥅"},{"w":"HOOK","e":"🪝"}],
 words:[{"w":"HEN","e":"🐔","h":"it lays the eggs"},{"w":"PEN","e":"🖊️","h":"you write with it"},{"w":"TEN","e":"🔟","h":"two more than eight"},{"w":"DEN","e":"🕳️","h":"a hidden little home"},{"w":"MEN","e":"🧍","h":"more than one man"},{"w":"GET","e":"🫴","h":"go and fetch it"},{"w":"PET","e":"🐾","h":"an animal you look after"},{"w":"WET","e":"💧","h":"not dry"},{"w":"SET","e":"🧩","h":"a whole group of them"}],
 family:[{"w":"BET","e":"🎲"},{"w":"GET","e":"🫴"},{"w":"JET","e":"✈️"},{"w":"MET","e":"🤝"},{"w":"NET","e":"🥅"},{"w":"PET","e":"🐾"},{"w":"SET","e":"🧩"}],
 hfw:[{"w":"WHERE","s":"Where is the hen?"},{"w":"MY","s":"My pet is wet."}],
 plan:["machine","rhyme","machine","initial","blend","spell","sight","pickWord","blendIt","spell"],
 story:{"t":"Ten Hens and One Pen","art":"🐔🔟","lines":["*Ten* *hens* lived in a *pen* behind the beds, and one of them could write.","She held the *pen* in her beak and made a list of everyone she had *met*.","'*Where* do you keep the ink?' asked Sam. The hen tapped a *wet* *net*.","*Bet*, *get*, *jet*, *met*, *net*, *pet*, *set*, *vet*."]}},

{no:5, region:"The Ladder Down", art:"🪜",
 grad:"linear-gradient(135deg,#C4B7A8,#6B5A42)",
 kind:"family", teaches:[], rime:"ENT",
 letters:["W","D"], confuse:["V","M","B"], teach:"the words where and when",
 vocab:[{"w":"LADDER","e":"🪜"},{"w":"HOLE","e":"🕳️"},{"w":"LAMP","e":"💡"},{"w":"STEP","e":"🪞"},{"w":"DARK","e":"🌑"},{"w":"NOW","e":"⏰"}],
 words:[{"w":"WHERE","e":"❓","h":"in what place"},{"w":"WHEN","e":"⏰","h":"at what time"},{"w":"DOWN","e":"⬇️","h":"the way to the ground"},{"w":"UP","e":"⬆️","h":"the way to the sky"},{"w":"WENT","e":"🚶","h":"he went that way"}],
 family:[{"w":"BENT","e":"🪝"},{"w":"SENT","e":"📮"},{"w":"TENT","e":"⛺"},{"w":"WENT","e":"🚶"}],
 hfw:[{"w":"WHERE","s":"Where does it go?"},{"w":"WHEN","s":"When can we go down?"},{"w":"GO","s":"Go down now."}],
 sentences:[{"s":["WHERE","IS","THE","LADDER"],"e":"🪜"},{"s":["WE","GO","DOWN","NOW"],"e":"⬇️"}],
 plan:["sight","pickWord","machine","spell","blend","initial","rhyme","sentence","readLine","blendIt"],
 story:{"t":"Where Does It Go?","art":"🪜🌑","lines":["A *ladder* went straight down through the floor of the hollow.","'*Where* does it go?' asked Sam, holding the *lamp* over the *hole*.","'*When* you climb down,' said Zib, 'you will know.'","So they *went* *down*, one rung at a time, into the warm dark."]}},

{no:6, region:"Peg Cliff", art:"⛓️",
 grad:"linear-gradient(135deg,#A8C4B7,#3E6B5A)",
 kind:"family", teaches:[], rime:"EG",
 letters:["E","G"], confuse:["A","O","Q"], teach:"the -eg family",
 vocab:[{"w":"LEG","e":"🦵"},{"w":"PEG","e":"📎"},{"w":"KEG","e":"🛢️"},{"w":"EGG","e":"🥚"},{"w":"ROPE","e":"🪢"},{"w":"CLIFF","e":"🧗"}],
 words:[{"w":"LEG","e":"🦵","h":"you stand on two of them"},{"w":"PEG","e":"📎","h":"it holds things up"},{"w":"BEG","e":"🙏","h":"to ask and ask"},{"w":"KEG","e":"🛢️","h":"a small barrel"},{"w":"PECK","e":"🐦","h":"what a bird does with its beak"}],
 family:[{"w":"BEG","e":"🙏"},{"w":"KEG","e":"🛢️"},{"w":"LEG","e":"🦵"},{"w":"PEG","e":"📎"}],
 hfw:[{"w":"HERE","s":"The peg is here."},{"w":"MY","s":"My leg hurts."}],
 plan:["machine","rhyme","machine","initial","blend","spell","sight","blendIt","spell","rhyme"],
 story:{"t":"Hanging by a Peg","art":"⛓️🪢","lines":["The ladder ran out. After that there were only *pegs* hammered into the cliff.","Sam went down one *leg* at a time, and did not *beg* to stop once.","A bird came to *peck* at the rope and Zib shooed it off.","*Beg*, *keg*, *leg*, *peg*. Four words, and the bottom at last."]}},

{no:7, region:"Who Lives Here?", art:"🐘",
 grad:"linear-gradient(135deg,#A8D88A,#417A2E)",
 kind:"family", teaches:[], rime:"EN",
 letters:["W","H"], confuse:["V","N","M"], teach:"the word who",
 vocab:[{"w":"MONKEY","e":"🐒"},{"w":"BUTTERFLY","e":"🦋"},{"w":"BIRD","e":"🐦"},{"w":"ELEPHANT","e":"🐘"},{"w":"NEST","e":"🪺"},{"w":"DEN","e":"🕳️"}],
 words:[{"w":"WHO","e":"🕵️","h":"which person"},{"w":"INTO","e":"📥","h":"right inside it"},{"w":"HERE","e":"📍","h":"in this very place"},{"w":"WENT","e":"🚶","h":"he went that way"}],
 family:[{"w":"DEN","e":"🕳️"},{"w":"HEN","e":"🐔"},{"w":"MEN","e":"🧍"},{"w":"PEN","e":"🖊️"},{"w":"TEN","e":"🔟"}],
 hfw:[{"w":"WHO","s":"Who lives here?"},{"w":"HERE","s":"An elephant lives here."}],
 sentences:[{"s":["WHO","LIVES","HERE"],"e":"🕵️"},{"s":["IT","WENT","INTO","THE","DEN"],"e":"🕳️"}],
 plan:["sight","pickWord","machine","spell","blend","initial","blendIt","sentence","readLine","spell"],
 story:{"t":"Who Lives Here?","art":"🐘🦋","lines":["At the foot of the cliff, doors were cut into the rock. Big ones. Small ones.","'*Who* *lives* *here*?' Sam called through the smallest.","A *butterfly* came out. Then a *monkey*. Then, from the widest door, an *elephant*.","'Everyone,' said the elephant, and went back *into* the dark."]}},

{no:8, region:"The Dragon's Tail", art:"🪶",
 grad:"linear-gradient(135deg,#F0A87E,#A6421E)",
 kind:"sight", teaches:[],
 letters:["W","T"], confuse:["V","F","L"], teach:"the word what",
 vocab:[{"w":"DRAGON","e":"🐉"},{"w":"WING","e":"🪶"},{"w":"TAIL","e":"🌀"},{"w":"CLAWS","e":"🐾"},{"w":"SPIKES","e":"🔺"},{"w":"FIRE","e":"🔥"}],
 words:[{"w":"WHAT","e":"❔","h":"which thing"},{"w":"WET","e":"💧","h":"not dry"},{"w":"GET","e":"🫴","h":"go and fetch it"},{"w":"WENT","e":"🚶","h":"he went that way"}],
 family:[{"w":"GET","e":"🫴"},{"w":"JET","e":"✈️"},{"w":"NET","e":"🥅"},{"w":"PET","e":"🐾"},{"w":"SET","e":"🧩"},{"w":"WET","e":"💧"}],
 hfw:[{"w":"WHAT","s":"What has claws and wings?"},{"w":"WHO","s":"Who is that?"},{"w":"WHERE","s":"Where is its tail?"}],
 sentences:[{"s":["WHAT","IS","THAT"],"e":"❔"},{"s":["IT","HAS","ONE","BIG","WING"],"e":"🪶"}],
 plan:["sight","pickWord","sight","spell","blend","initial","rhyme","sentence","readLine","blendIt"],
 story:{"t":"What Has Claws and Wings?","art":"🪶🔥","lines":["Something enormous was asleep across the whole floor of the cave.","'*What* is it?' whispered Sam. He counted *spikes* along its back.","Two *wings*. Four *claws*. One long *tail* curled round a warm red egg.","'The baby's mother,' said Zib. 'Walk quietly. Do not *get* between them.'"]}},

{no:9, region:"The Wishing Well", art:"🔔",
 grad:"linear-gradient(135deg,#9FC7EA,#2E5F94)",
 kind:"family", teaches:[], rime:"ELL",
 letters:["E","L"], confuse:["A","I","T"], teach:"the -ell family",
 vocab:[{"w":"BELL","e":"🔔"},{"w":"WELL","e":"🪣"},{"w":"SHELL","e":"🐚"},{"w":"NUMBERS","e":"🔢"},{"w":"COIN","e":"🪙"},{"w":"WATER","e":"💧"}],
 words:[{"w":"BELL","e":"🔔","h":"it rings"},{"w":"WELL","e":"🪣","h":"a deep hole with water in it"},{"w":"TELL","e":"🗣️","h":"say it to someone"},{"w":"FELL","e":"🍂","h":"it dropped down"},{"w":"SELL","e":"🏪","h":"swap it for money"},{"w":"YELL","e":"📢","h":"a very loud shout"},{"w":"SHELL","e":"🐚","h":"a snail lives in one"}],
 family:[{"w":"BELL","e":"🔔"},{"w":"FELL","e":"🍂"},{"w":"SELL","e":"🏪"},{"w":"SHELL","e":"🐚"},{"w":"TELL","e":"🗣️"},{"w":"WELL","e":"🪣"},{"w":"YELL","e":"📢"}],
 hfw:[{"w":"WHO","s":"Who rang the bell?"},{"w":"WHAT","s":"What is in the well?"},{"w":"WHERE","s":"Where did it fall?"}],
 plan:["machine","rhyme","machine","initial","blend","spell","sight","pickWord","blendIt","spell"],
 story:{"t":"The Well That Rang","art":"🔔🪣","lines":["Past the dragon stood a *well* with a *bell* hung over it.","Sam dropped a *shell* in and, a long way down, the bell began to ring.","'*Tell* it a word,' said Zib, 'and it rings that word back.'","Sam yelled '*WELL*!' and the whole cave answered: *bell*, *fell*, *sell*, *tell*, *yell*."]}},

{no:10, region:"The Seventh Ember", art:"🎂",
 grad:"linear-gradient(135deg,#E07A5F,#8C2E1A)",
 kind:"review", teaches:[],
 letters:["E","N","D","L"], confuse:["A","I","O","M"], teach:"every sound of this map",
 vocab:[{"w":"BIRTHDAY","e":"🎂"},{"w":"PARTY","e":"🎉"},{"w":"BELL","e":"🔔"},{"w":"HEN","e":"🐔"},{"w":"BED","e":"🛏️"},{"w":"EGG","e":"🥚"},{"w":"LEG","e":"🦵"},{"w":"JET","e":"✈️"}],
 words:[{"w":"SEVEN","e":"7️⃣","h":"one more than six"},{"w":"BED","e":"🛏️","h":"you sleep in it"},{"w":"HEN","e":"🐔","h":"it lays the eggs"},{"w":"WET","e":"💧","h":"not dry"},{"w":"LEG","e":"🦵","h":"you stand on two of them"},{"w":"BELL","e":"🔔","h":"it rings"},{"w":"WENT","e":"🚶","h":"he went that way"},{"w":"RED","e":"🟥","h":"the colour of a fire engine"}],
 family:[{"w":"BELL","e":"🔔"},{"w":"FELL","e":"🍂"},{"w":"SELL","e":"🏪"},{"w":"TELL","e":"🗣️"},{"w":"WELL","e":"🪣"},{"w":"YELL","e":"📢"}],
 hfw:[{"w":"COME","s":"Come to the party."},{"w":"MY","s":"It is my birthday."},{"w":"HERE","s":"The cake is here."},{"w":"WHERE","s":"Where is the bell?"},{"w":"WHEN","s":"When is the party?"},{"w":"WHO","s":"Who lives here?"},{"w":"WHAT","s":"What is in the egg?"}],
 sentences:[{"s":["COME","TO","MY","PARTY"],"e":"🎉"},{"s":["WHO","HAS","THE","BELL"],"e":"🔔"},{"s":["THE","HEN","WENT","TO","BED"],"e":"🐔"}],
 plan:["blendIt","spell","machine","rhyme","blend","spell","sight","sentence","readLine","listen"],
 story:{"t":"Seven Candles in the Dark","art":"🎂🔥","lines":["The last cave in the hollow was set out for a *birthday* *party*.","*Seven* embers burned in a row, and six of them had names on.","Zib set short *e* into the seventh. It caught, and the whole hollow lit up.","'Level two is done,' said Zib. 'Beyond that wood, the words get longer.'"]}}
];

/* ════════ MAP 9 · Lessons 81–90 · The Whispering Wood ════════ */
const MAP9 = [

{no:1, region:"The Five Senses Gate", art:"🖐️",
 grad:"linear-gradient(135deg,#A8D8C9,#2E7A66)",
 kind:"vowels", teaches:[],
 letters:["A","E","I","O","U"], confuse:["B","C","D","M"], teach:"the five short vowels",
 vocab:[{"w":"TOUCH","e":"🖐️"},{"w":"TASTE","e":"👅"},{"w":"HEAR","e":"👂"},{"w":"SMELL","e":"👃"},{"w":"TONGUE","e":"😛"},{"w":"EYES","e":"👀"}],
 words:[{"w":"PEN","e":"🖊️","h":"you write with it"},{"w":"PIG","e":"🐷","h":"it says oink"},{"w":"LEG","e":"🦵","h":"you stand on two of them"},{"w":"LOG","e":"🪵","h":"a cut piece of tree"},{"w":"MUG","e":"🍵","h":"a big cup"},{"w":"MOP","e":"🧹","h":"you clean the floor with it"},{"w":"HAT","e":"🎩","h":"it goes on your head"},{"w":"HUG","e":"🤗","h":"you put your arms round"},{"w":"BED","e":"🛏️","h":"you sleep in it"},{"w":"BOX","e":"📦","h":"you put things in it"}],
 family:[{"w":"HAT","e":"🎩"},{"w":"HEN","e":"🐔"},{"w":"HID","e":"🙈"},{"w":"HOP","e":"🐇"},{"w":"HUG","e":"🤗"}],
 hfw:[{"w":"HAVE","s":"We have five senses."},{"w":"WITH","s":"I hear with my ears."},{"w":"WHAT","s":"What can you smell?"},{"w":"YOU","s":"You can taste it."}],
 sentences:[{"s":["I","CAN","SEE","WITH","MY","EYES"],"e":"👀"},{"s":["WHAT","CAN","YOU","SMELL"],"e":"👃"}],
 plan:["vowelPick","listen","blendIt","spell","blend","spell","sight","sentence","readLine","vowelPick"],
 story:{"t":"Five Ways In","art":"🖐️👂","lines":["A gate stood at the edge of the wood with five keyholes in it.","*a*, *e*, *i*, *o*, *u* — one short vowel for each.","'Five senses, five vowels,' said Zib. 'You *have* them all already.'","Sam said each sound out loud, and the gate swung open on the trees."]}},

{no:2, region:"Pie Path", art:"🥧",
 grad:"linear-gradient(135deg,#F0C08A,#A8621E)",
 kind:"family", teaches:[], rime:"IE",
 letters:["I","E"], confuse:["A","Y","O"], teach:"i and e together, saying eye",
 vocab:[{"w":"PIE","e":"🥧"},{"w":"TIE","e":"👔"},{"w":"SMILE","e":"🙂"},{"w":"CROCODILE","e":"🐊"},{"w":"PEACH","e":"🍑"},{"w":"PLUM","e":"🍇"}],
 words:[{"w":"PIE","e":"🥧","h":"fruit baked in pastry"},{"w":"TIE","e":"👔","h":"it goes round your neck"},{"w":"LIE","e":"🛌","h":"lie down and rest"},{"w":"SMILE","e":"🙂","h":"what your mouth does when you are glad"},{"w":"MILE","e":"🛣️","h":"a very long way"}],
 family:[{"w":"DIE","e":"🍂"},{"w":"LIE","e":"🛌"},{"w":"PIE","e":"🥧"},{"w":"TIE","e":"👔"}],
 hfw:[{"w":"GOING","s":"We are going to the shop."},{"w":"WANT","s":"I want a pie."},{"w":"WHERE","s":"Where is the pie shop?"}],
 plan:["listen","rhyme","machine","blend","machine","spell","sight","pickWord","blendIt","spell"],
 story:{"t":"The Crocodile's Pie Shop","art":"🥧🐊","lines":["The path into the wood was lined with pie shops, all of them shut but one.","A *crocodile* stood behind the counter in a spotted *tie*, with an enormous *smile*.","'What are you *going* to *want*?' it asked. '*Peach*? *Plum*?'","'Two *pies*,' said Sam. 'And please stop smiling quite so much.'"]}},

{no:3, region:"The Family Line", art:"〰️",
 grad:"linear-gradient(135deg,#C9B6E4,#5F4A9C)",
 kind:"pattern", teaches:[], rime:"INE", pattern:"magicE",
 letters:["I","N"], confuse:["A","M","U"], teach:"words that end in a magic e",
 vocab:[{"w":"MOTHER","e":"👩"},{"w":"FATHER","e":"👨"},{"w":"SISTER","e":"👧"},{"w":"BROTHER","e":"👦"},{"w":"FAMILY","e":"👨‍👩‍👧"},{"w":"HOMEWORK","e":"📚"},{"w":"SHOE","e":"👞"},{"w":"CAR","e":"🚗"}],
 words:[{"w":"LINE","e":"〰️","h":"a long straight mark"},{"w":"MINE","e":"🫱","h":"it belongs to me"},{"w":"LIKE","e":"👍","h":"I like it a lot"},{"w":"HIKE","e":"🥾","h":"a long walk"},{"w":"NINE","e":"9️⃣","h":"one less than ten"}],
 family:[{"w":"DINE","e":"🍽️"},{"w":"LINE","e":"〰️"},{"w":"MINE","e":"🫱"},{"w":"NINE","e":"9️⃣"},{"w":"PINE","e":"🌲"}],
 hfw:[{"w":"LIKE","s":"I like my family."},{"w":"MY","s":"My brother is nine."}],
 plan:["machine","rhyme","blendIt","spell","blend","spell","sight","pickWord","machine","rhyme"],
 story:{"t":"A Line of Nine","art":"〰️👨‍👩‍👧","lines":["Someone had drawn a long *line* down the path and stood a *family* along it.","*Mother*, *father*, *sister*, *brother* — *nine* of them altogether.","'That last one is *mine*,' said the smallest, pointing at a *pine* tree.","'Say the *e* on the end silently,' said Zib, 'and the *i* says its own name.'"]}},

{no:4, region:"The Bike Trail", art:"🚲",
 grad:"linear-gradient(135deg,#9FD6E8,#2E7A96)",
 kind:"pattern", teaches:[], pattern:"magicE", machine:false,
 letters:["I","K"], confuse:["C","T","H"], teach:"the -ike and -ide families",
 vocab:[{"w":"BIKE","e":"🚲"},{"w":"TRACK","e":"🛤️"},{"w":"RIDE","e":"🏇"},{"w":"SLIDE","e":"🛝"},{"w":"PINE","e":"🌲"},{"w":"HELMET","e":"⛑️"}],
 words:[{"w":"BIKE","e":"🚲","h":"it has two wheels"},{"w":"HIKE","e":"🥾","h":"a long walk"},{"w":"RIDE","e":"🏇","h":"to sit on and go"},{"w":"HIDE","e":"🙈","h":"go where nobody can see"},{"w":"WIDE","e":"↔️","h":"very far across"},{"w":"FINE","e":"👌","h":"all right, quite good"}],
 family:[{"w":"BIKE","e":"🚲"},{"w":"HIDE","e":"🙈"},{"w":"HIKE","e":"🥾"},{"w":"LIKE","e":"👍"},{"w":"RIDE","e":"🏇"},{"w":"WIDE","e":"↔️"}],
 hfw:[{"w":"THIS","s":"This bike is fine."}],
 sentences:[{"s":["I","LIKE","THIS","BIKE"],"e":"🚲"},{"s":["HE","FELL","OFF","AND","GOT","UP"],"e":"🚲"}],
 plan:["blendIt","rhyme","spell","machine","blend","spell","sight","sentence","readLine","rhyme"],
 story:{"t":"Crash, and Up Again","art":"🚲🛤️","lines":["A *bike* lay against a *pine* with nobody near it, so Sam had a go.","The *track* was *too* narrow. He went *over* a root and *off* he came.","'Are you all right?' said Zib. '*Fine*,' said Sam, and got back on.","By the third try he could *ride* the whole *wide* trail without falling once."]}},

{no:5, region:"The Sheep Shed", art:"🐑",
 grad:"linear-gradient(135deg,#D9D9E8,#5A5A7A)",
 kind:"digraph", teaches:["SH"], onset:"SH",
 letters:["SH"], confuse:["S","H","CH"], teach:"sh, two letters making one sound",
 vocab:[{"w":"SHEEP","e":"🐑"},{"w":"SHIP","e":"🚢"},{"w":"SHED","e":"🏚️"},{"w":"SHELL","e":"🐚"},{"w":"SHARK","e":"🦈"},{"w":"SHIRT","e":"👕"},{"w":"SHOES","e":"👟"}],
 words:[{"w":"SHIP","e":"🚢","h":"a very big boat"},{"w":"SHOP","e":"🏪","h":"you buy things there"},{"w":"SHED","e":"🏚️","h":"a little hut in the garden"},{"w":"SHELL","e":"🐚","h":"a snail lives in one"},{"w":"SHUT","e":"🚪","h":"not open"}],
 family:[{"w":"SHED","e":"🏚️"},{"w":"SHELL","e":"🐚"},{"w":"SHIP","e":"🚢"},{"w":"SHOP","e":"🏪"},{"w":"SHUT","e":"🚪"}],
 hfw:[{"w":"WITH","s":"A sheep with a shell."}],
 plan:["sound","beginSound","sound","listen","starts","blend","spell","sight","machine","beginSound"],
 story:{"t":"Shh, Says the Shed","art":"🐑🏚️","lines":["Deep in the wood stood a *shed* with *sheep* asleep all around it.","The door was *shut*. On it, two letters: *s* and *h*.","'*Shhh*,' said Zib. 'Together they make one sound, and it is a quiet one.'","*Shed*, *shell*, *ship*, *shop*, *shut*. The sheep never woke."]}},

{no:6, region:"The Shoe Shop", art:"👟",
 grad:"linear-gradient(135deg,#F0B7A3,#A0432C)",
 kind:"digraph", teaches:[], onset:"SH",
 letters:["SH"], confuse:["CH","TH","S"], teach:"more sh words",
 vocab:[{"w":"SHOES","e":"👟"},{"w":"LACES","e":"🎀"},{"w":"SHINY","e":"✨"},{"w":"SHORT","e":"📏"},{"w":"SHOPPING","e":"🛍️"},{"w":"BOOTS","e":"🥾"}],
 words:[{"w":"SHOPPING","e":"🛍️","h":"going round the shops"},{"w":"SHINY","e":"✨","h":"it catches the light"},{"w":"SHORT","e":"📏","h":"not long"},{"w":"SHOP","e":"🏪","h":"you buy things there"},{"w":"SHEEP","e":"🐑","h":"its coat makes wool"}],
 family:[{"w":"SHED","e":"🏚️"},{"w":"SHEEP","e":"🐑"},{"w":"SHIP","e":"🚢"},{"w":"SHOP","e":"🏪"}],
 hfw:[{"w":"THESE","s":"These laces are too short."}],
 sentences:[{"s":["THESE","SHOES","ARE","NEW"],"e":"👟"},{"s":["THE","SHOP","IS","SHUT"],"e":"🏪"}],
 plan:["sound","starts","sound","listen","blend","spell","sight","sentence","readLine","beginSound"],
 story:{"t":"Shelley's Shoe Shop","art":"👟✨","lines":["Shelley kept the only *shoe* *shop* in the wood, and every pair was *shiny*.","Sam *tried* on nine. One was *too* *short*. One had no *laces* at all.","'*These*,' he said at last, holding up a pair of muddy green boots.","'Good choice,' said Shelley. 'You have a long way left to walk.'"]}},

{no:7, region:"The Long Hike", art:"🥾",
 grad:"linear-gradient(135deg,#A8C88A,#3E6B2E)",
 kind:"pattern", teaches:[], rime:"ITE", pattern:"magicE",
 letters:["I","T"], confuse:["E","A","D"], teach:"long i, with a magic e on the end",
 vocab:[{"w":"KITE","e":"🪁"},{"w":"BIKE","e":"🚲"},{"w":"HIKE","e":"🥾"},{"w":"WHITE","e":"⬜"},{"w":"NINE","e":"9️⃣"},{"w":"HOT","e":"🔥"},{"w":"COLD","e":"🧊"},{"w":"DRY","e":"🍂"}],
 words:[{"w":"KITE","e":"🪁","h":"it flies on a string"},{"w":"BITE","e":"🍎","h":"what your teeth do"},{"w":"HIDE","e":"🙈","h":"go where nobody can see"},{"w":"RIDE","e":"🏇","h":"to sit on and go"},{"w":"WHITE","e":"⬜","h":"the colour of snow"},{"w":"TIME","e":"⏰","h":"the clock tells it"}],
 family:[{"w":"BITE","e":"🍎"},{"w":"KITE","e":"🪁"},{"w":"SITE","e":"📍"},{"w":"WHITE","e":"⬜"}],
 hfw:[],
 plan:["machine","rhyme","blendIt","spell","blend","spell","sight","listen","machine","rhyme"],
 story:{"t":"Nine White Kites","art":"🥾🪁","lines":["The hike climbed out of the trees and onto a bare, windy ridge.","*Nine* *white* *kites* were up there, and nobody holding a single string.","'Who flies them?' asked Sam. 'The hill does,' said Zib.","*Bite*, *kite*, *white*. Add a magic *e* and the *i* says its own name."]}},

{no:8, region:"The Chimp's Chest", art:"🐒",
 grad:"linear-gradient(135deg,#E8C48A,#96631E)",
 kind:"digraph", teaches:["CH"], onset:"CH",
 letters:["CH"], confuse:["SH","TH","C"], teach:"ch, two letters making one sound",
 vocab:[{"w":"CHEESE","e":"🧀"},{"w":"CHICK","e":"🐤"},{"w":"CHIN","e":"🧔"},{"w":"CHIPS","e":"🍟"},{"w":"CHEST","e":"🧰"},{"w":"CHIMP","e":"🐒"}],
 words:[{"w":"CHAT","e":"💬","h":"a friendly talk"},{"w":"CHIN","e":"🧔","h":"under your mouth"},{"w":"CHIP","e":"🍟","h":"a hot slice of potato"},{"w":"CHEST","e":"🧰","h":"a big strong box"},{"w":"CHICK","e":"🐤","h":"a baby hen"}],
 family:[{"w":"CHAT","e":"💬"},{"w":"CHIN","e":"🧔"},{"w":"CHIP","e":"🍟"},{"w":"CHOP","e":"🪓"}],
 hfw:[{"w":"SAYS","s":"The chimp says hello."},{"w":"ASK","s":"Ask for the key."},{"w":"WHY","s":"Why is the chest shut?"}],
 plan:["sound","beginSound","sound","listen","starts","blend","spell","sight","machine","beginSound"],
 story:{"t":"What the Chimp Kept","art":"🐒🧰","lines":["A *chimp* sat on a locked *chest*, eating *chips* and refusing to move.","'*Why*?' asked Sam. 'You will *ask* nicely first,' the chimp *says*.","So Sam asked nicely, and shared his *cheese*, and had a long *chat*.","*Ch* is two letters, one sound, and it opened the chest at last."]}},

{no:9, region:"Thorn Thicket", art:"🌿",
 grad:"linear-gradient(135deg,#A8C4B7,#2E5A46)",
 kind:"digraph", teaches:[], onset:"TH",
 letters:["TH"], confuse:["SH","CH","F"], teach:"th, two letters making one sound",
 vocab:[{"w":"THORN","e":"🥀"},{"w":"THICK","e":"📚"},{"w":"THIN","e":"📏"},{"w":"CUPBOARD","e":"🚪"},{"w":"FRIDGE","e":"🧊"},{"w":"CHOCOLATE","e":"🍫"},{"w":"SANDWICH","e":"🥪"}],
 words:[{"w":"THIN","e":"📏","h":"not thick"},{"w":"THICK","e":"📚","h":"not thin"},{"w":"THROW","e":"🤾","h":"send it through the air"},{"w":"THINK","e":"🤔","h":"what your head does"},{"w":"THUD","e":"💥","h":"the sound of something heavy landing"}],
 family:[{"w":"THAT","e":"👆"},{"w":"THEN","e":"⏭️"},{"w":"THICK","e":"📚"},{"w":"THIN","e":"📏"},{"w":"THINK","e":"🤔"}],
 hfw:[],
 plan:["sound","beginSound","sound","listen","starts","blend","spell","sight","match","beginSound"],
 story:{"t":"Through the Thorns","art":"🌿🥪","lines":["The last of the wood was *thick* *thorn*, and only one path went *through*.","It was *thin*. Sam had to *throw* the bag ahead of him with a *thud*.","On the far side sat a cottage with a *fridge*, a *cupboard* and one *sandwich*.","'*Thanks*,' said Sam, to nobody, and ate it in four bites."]}},

{no:10, region:"The Whispering Heart", art:"🌳",
 grad:"linear-gradient(135deg,#5FA37E,#1E4A36)",
 kind:"review", teaches:[], onset:"CH",
 letters:["SH","CH","TH"], confuse:["S","C","T","H"], teach:"every sound of this map",
 vocab:[{"w":"CHIMP","e":"🐒"},{"w":"CHICKEN","e":"🐔"},{"w":"CHEESE","e":"🧀"},{"w":"CHILLI","e":"🌶️"},{"w":"SHEEP","e":"🐑"},{"w":"SHIP","e":"🚢"},{"w":"THORN","e":"🥀"},{"w":"KITE","e":"🪁"}],
 words:[{"w":"CHOMP","e":"😋","h":"to eat with big bites"},{"w":"SHOP","e":"🏪","h":"you buy things there"},{"w":"SHUT","e":"🚪","h":"not open"},{"w":"THIN","e":"📏","h":"not thick"},{"w":"THINK","e":"🤔","h":"what your head does"},{"w":"CHIN","e":"🧔","h":"under your mouth"},{"w":"WHITE","e":"⬜","h":"the colour of snow"},{"w":"RIDE","e":"🏇","h":"to sit on and go"}],
 family:[{"w":"CHAT","e":"💬"},{"w":"CHIN","e":"🧔"},{"w":"CHIP","e":"🍟"},{"w":"CHOP","e":"🪓"},{"w":"CHOMP","e":"😋"}],
 hfw:[{"w":"THESE","s":"These are made together."},{"w":"WHY","s":"Why is it shut?"},{"w":"ASK","s":"Ask the chimp."},{"w":"WITH","s":"Cheese with chilli."}],
 sentences:[{"s":["THESE","CHIPS","ARE","TOO","HOT"],"e":"🍟"},{"s":["THE","SHEEP","WENT","INTO","THE","SHED"],"e":"🐑"},{"s":["I","THINK","THIS","IS","THE","WAY"],"e":"🌳"}],
 plan:["blendIt","spell","machine","listen","blend","spell","sight","sentence","readLine","rhyme"],
 story:{"t":"The Tree at the Heart","art":"🌳✨","lines":["At the centre of the wood stood one tree older than all the rest.","Its bark was cut with three pairs: *sh*, *ch*, *th*.","'Two letters, one sound, always *together*,' said Zib, setting them in.","The whispering stopped. Ahead, through the trunks, something flat and bright: water."]}}
];

/* ════════ MAP 10 · Lessons 91–100 · The Mirror Lake ════════ */
const MAP10 = [

{no:1, region:"Circle City", art:"🏙️",
 grad:"linear-gradient(135deg,#B7C7E8,#3E4F94)",
 kind:"pattern", teaches:[], pattern:"softC", machine:false, sortTwo:{"a":"kuh","b":"sss","letter":"C"},
 letters:["C"], confuse:["S","K","G"], teach:"c saying sss",
 vocab:[{"w":"CITY","e":"🏙️"},{"w":"CELERY","e":"🥬"},{"w":"CIRCUS","e":"🎪"},{"w":"CIRCLE","e":"⭕"},{"w":"BICYCLE","e":"🚲"},{"w":"CEMENT","e":"🧱"}],
 words:[{"w":"CITY","e":"🏙️","h":"a very big town"},{"w":"CIRCLE","e":"⭕","h":"a perfectly round shape"},{"w":"ICE","e":"🧊","h":"frozen water"},{"w":"PARK","e":"🌳","h":"grass and trees in a town"},{"w":"DARK","e":"🌑","h":"no light at all"}],
 family:[{"w":"BARK","e":"🐕"},{"w":"DARK","e":"🌑"},{"w":"PARK","e":"🌳"},{"w":"SHARK","e":"🦈"}],
 hfw:[{"w":"ONE","s":"One city by the lake."},{"w":"FOUR","s":"Four parks."},{"w":"FIVE","s":"Five gates into the city."}],
 plan:["blendIt","sortTwo","spell","machine","sortTwo","spell","sight","rhyme","listen","readLine"],
 story:{"t":"The City on the Water","art":"🏙️⭕","lines":["The trees ended, and across a huge still lake stood a *city* built in *circles*.","Everything about it came twice: once in stone, once upside down in the water.","'Careful,' said Zib. 'Here *c* can turn soft and say *sss*.'","*City*. *Celery*. *Circus*. *Circle*. Not one of them said *kuh*."]}},

{no:2, region:"Mice on the Ice", art:"🐭",
 grad:"linear-gradient(135deg,#CFE8F0,#4A8CA8)",
 kind:"pattern", teaches:[], rime:"ICE", pattern:"magicE",
 letters:["I","C"], confuse:["S","K","E"], teach:"the -ice family",
 vocab:[{"w":"MICE","e":"🐭"},{"w":"RICE","e":"🍚"},{"w":"DICE","e":"🎲"},{"w":"SLICE","e":"🍰"},{"w":"LIGHTHOUSE","e":"🗼"},{"w":"SHOELACE","e":"🎀"}],
 words:[{"w":"MICE","e":"🐭","h":"more than one mouse"},{"w":"RICE","e":"🍚","h":"little white grains you cook"},{"w":"DICE","e":"🎲","h":"you roll them in a game"},{"w":"NICE","e":"😊","h":"kind and pleasant"},{"w":"SLICE","e":"🍰","h":"a piece cut off"}],
 family:[{"w":"DICE","e":"🎲"},{"w":"MICE","e":"🐭"},{"w":"NICE","e":"😊"},{"w":"RICE","e":"🍚"},{"w":"SLICE","e":"🍰"}],
 hfw:[{"w":"LOOK","s":"Look at the dice."}],
 plan:["machine","rhyme","blendIt","spell","blend","spell","sight","pickWord","machine","rhyme"],
 story:{"t":"Nine Mice and a Slice","art":"🐭🎲","lines":["Out on the frozen edge of the lake, nine white *mice* were playing *dice*.","The stakes were one *slice* of cake and a bowl of *rice*.","'Be *nice*,' said the smallest mouse, and lost anyway.","Sam gave it half his cake. *Dice*, *mice*, *nice*, *rice*, *slice*."]}},

{no:3, region:"The Giant's Stage", art:"🎭",
 grad:"linear-gradient(135deg,#E8C46B,#96731A)",
 kind:"pattern", teaches:[], rime:"AGE", pattern:"softG", sortTwo:{"a":"guh","b":"juh","letter":"G"},
 letters:["G"], confuse:["J","C","Q"], teach:"g saying juh",
 vocab:[{"w":"GIRAFFE","e":"🦒"},{"w":"GEM","e":"💎"},{"w":"GIANT","e":"🗿"},{"w":"STAGE","e":"🎭"},{"w":"CAGE","e":"🔒"},{"w":"MAGIC","e":"🪄"},{"w":"GELATO","e":"🍨"}],
 words:[{"w":"CAGE","e":"🔒","h":"bars to keep something in"},{"w":"PAGE","e":"📄","h":"one leaf of a book"},{"w":"STAGE","e":"🎭","h":"actors stand on it"},{"w":"RAGE","e":"😡","h":"very great anger"},{"w":"GEM","e":"💎","h":"a bright precious stone"}],
 family:[{"w":"CAGE","e":"🔒"},{"w":"PAGE","e":"📄"},{"w":"RAGE","e":"😡"},{"w":"STAGE","e":"🎭"}],
 hfw:[],
 plan:["blendIt","sortTwo","spell","machine","sortTwo","spell","sight","rhyme","machine","rhyme"],
 story:{"t":"The Giant Reads a Page","art":"🎭🦒","lines":["In the middle of the city a *stage* had been built for one enormous performer.","A *giant* stood on it holding a book, and could not read a single *page*.","'Some *g*'s say *juh*,' Sam told him. '*Giraffe*. *Gem*. *Cage*. *Stage*.'","The giant tried it, got it right, and laughed hard enough to shake the seats."]}},

{no:4, region:"Cake Lake", art:"🍰",
 grad:"linear-gradient(135deg,#F5C7D8,#B04A78)",
 kind:"pattern", teaches:[], rime:"AKE", pattern:"magicE",
 letters:["A","K"], confuse:["E","C","T"], teach:"the -ake family",
 vocab:[{"w":"CAKE","e":"🍰"},{"w":"LAKE","e":"🏞️"},{"w":"RAKE","e":"🧹"},{"w":"SNAKE","e":"🐍"},{"w":"ROOSTER","e":"🐓"},{"w":"WHEEL","e":"☸️"}],
 words:[{"w":"CAKE","e":"🍰","h":"you bake it for a party"},{"w":"LAKE","e":"🏞️","h":"a lot of still water"},{"w":"BAKE","e":"🧁","h":"cook it in the oven"},{"w":"TAKE","e":"🫴","h":"pick it up and go"},{"w":"WAKE","e":"⏰","h":"stop being asleep"},{"w":"MAKE","e":"🔨","h":"build it yourself"},{"w":"SNAKE","e":"🐍","h":"it has no legs at all"}],
 family:[{"w":"BAKE","e":"🧁"},{"w":"CAKE","e":"🍰"},{"w":"LAKE","e":"🏞️"},{"w":"MAKE","e":"🔨"},{"w":"RAKE","e":"🧹"},{"w":"SNAKE","e":"🐍"},{"w":"TAKE","e":"🫴"},{"w":"WAKE","e":"⏰"}],
 hfw:[{"w":"MAKE","s":"We make a cake."},{"w":"TAKE","s":"Take one slice."},{"w":"THESE","s":"These cakes are for you."}],
 plan:["machine","rhyme","blendIt","spell","blend","spell","sight","pickWord","machine","rhyme"],
 story:{"t":"A Cake the Size of a Boat","art":"🍰🐍","lines":["On the shore of the *lake* somebody had *baked* a *cake* the size of a rowing boat.","A *snake* lay round the outside of it, fast asleep and perfectly polite.","'Do not *wake* it,' said Zib. 'Just *take* a slice from this end.'","*Bake*, *cake*, *lake*, *make*, *rake*, *snake*, *take*, *wake*."]}},

{no:5, region:"Plane Lane", art:"✈️",
 grad:"linear-gradient(135deg,#A8CFE8,#2E5F8C)",
 kind:"pattern", teaches:[], rime:"ANE", pattern:"magicE",
 letters:["A","N"], confuse:["E","M","U"], teach:"the -ane family and long a",
 vocab:[{"w":"PLANE","e":"✈️"},{"w":"CANE","e":"🦯"},{"w":"MANE","e":"🦁"},{"w":"LANE","e":"🛣️"},{"w":"APE","e":"🦍"},{"w":"BOWL","e":"🥣"}],
 words:[{"w":"PLANE","e":"✈️","h":"it flies with wings"},{"w":"CANE","e":"🦯","h":"a stick to walk with"},{"w":"MANE","e":"🦁","h":"the hair round a lion's head"},{"w":"LANE","e":"🛣️","h":"a narrow little road"},{"w":"GAME","e":"🎲","h":"you play it with rules"},{"w":"APE","e":"🦍","h":"a big cousin of the monkey"}],
 family:[{"w":"CANE","e":"🦯"},{"w":"LANE","e":"🛣️"},{"w":"MANE","e":"🦁"},{"w":"PLANE","e":"✈️"}],
 hfw:[{"w":"ABOUT","s":"Tell me about the plane."}],
 plan:["machine","rhyme","blendIt","spell","blend","spell","sight","pickWord","machine","rhyme"],
 story:{"t":"The Lane Full of Planes","art":"✈️🦁","lines":["A narrow *lane* ran up from the lake with paper *planes* stuck in every hedge.","A lion with an enormous *mane* was throwing *another* one as they arrived.","'*About* time,' it said. 'Nobody here can fold them properly.'","Sam folded one that flew the whole length of the *lane*."]}},

{no:6, region:"Star Space", art:"🌌",
 grad:"linear-gradient(135deg,#7B68C9,#2E2360)",
 kind:"pattern", teaches:[], rime:"ACE", pattern:"magicE",
 letters:["A","C"], confuse:["E","S","K"], teach:"the -ace family",
 vocab:[{"w":"SPACE","e":"🌌"},{"w":"FACE","e":"😀"},{"w":"LACE","e":"🎀"},{"w":"STARS","e":"⭐"},{"w":"SKY","e":"🌃"},{"w":"CLOUDS","e":"☁️"}],
 words:[{"w":"SPACE","e":"🌌","h":"where the stars are"},{"w":"FACE","e":"😀","h":"eyes, nose and mouth"},{"w":"LACE","e":"🎀","h":"the string in your shoe"},{"w":"RACE","e":"🏁","h":"who can get there first"},{"w":"PLACE","e":"📍","h":"a spot where something is"}],
 family:[{"w":"FACE","e":"😀"},{"w":"LACE","e":"🎀"},{"w":"PLACE","e":"📍"},{"w":"RACE","e":"🏁"},{"w":"SPACE","e":"🌌"}],
 hfw:[],
 plan:["machine","rhyme","blendIt","spell","blend","spell","sight","machine","rhyme","listen"],
 story:{"t":"Count What Is Above","art":"🌌⭐","lines":["At the top of the city there was a *place* for lying on your back.","*Above* them the *sky* went on and on, with no *clouds* in the way.","'*Count* them,' said Zib. Sam got to two hundred and gave up.","*Face*, *lace*, *place*, *race*, *space*. The last one was the biggest."]}},

{no:7, region:"The Spacesuit Shed", art:"👨‍🚀",
 grad:"linear-gradient(135deg,#C4CFD9,#4A5A6B)",
 kind:"pattern", teaches:[], pattern:"magicE", machine:false,
 letters:["A","E","I","O","U"], confuse:["C","G","S","T"], teach:"the long vowels, saying their own names",
 vocab:[{"w":"ASTRONAUT","e":"👨‍🚀"},{"w":"SPACESUIT","e":"🧑‍🚀"},{"w":"PHOTO","e":"📷"},{"w":"MUSIC","e":"🎵"},{"w":"STRAW","e":"🥤"},{"w":"EXERCISE","e":"🏋️"}],
 words:[{"w":"LIFE","e":"🌱","h":"everything that grows and moves"},{"w":"SPACE","e":"🌌","h":"where the stars are"},{"w":"TIME","e":"⏰","h":"the clock tells it"},{"w":"NOTE","e":"🎵","h":"one sound in a tune"},{"w":"CUBE","e":"🧊","h":"a box shape with six sides"}],
 family:[{"w":"CAKE","e":"🍰"},{"w":"KITE","e":"🪁"},{"w":"NOTE","e":"🎵"},{"w":"CUBE","e":"🧊"}],
 hfw:[],
 plan:["blendIt","listen","spell","machine","blend","spell","sight","rhyme","alphabet","listen"],
 story:{"t":"A Suit for Going Up","art":"👨‍🚀🎵","lines":["Behind the star place was a shed full of *spacesuits* on hooks.","An *astronaut* sat inside it playing one *note* over and over.","'*a*, *e*, *i*, *o*, *u*,' she sang. 'Long ones. They say their own names.'","*Cake*. *Kite*. *Note*. *Cube*. Sam sang them back and she let him try a helmet on."]}},

{no:8, region:"The Puppet Bench", art:"✂️",
 grad:"linear-gradient(135deg,#F0C08A,#A0621E)",
 kind:"pattern", teaches:[], rime:"APE", pattern:"magicE",
 letters:["A","E"], confuse:["I","O","U"], teach:"long vowel words with a magic e",
 vocab:[{"w":"PUPPET","e":"🎎"},{"w":"PAPER","e":"📄"},{"w":"PAINT","e":"🎨"},{"w":"GLUE","e":"🧴"},{"w":"SPIDER","e":"🕷️"},{"w":"BUTTERFLY","e":"🦋"}],
 words:[{"w":"MAKE","e":"🔨","h":"build it yourself"},{"w":"SNAKE","e":"🐍","h":"it has no legs at all"},{"w":"FIVE","e":"5️⃣","h":"one more than four"},{"w":"APE","e":"🦍","h":"a big cousin of the monkey"},{"w":"TAPE","e":"📼","h":"sticky, and it comes on a roll"}],
 family:[{"w":"CAPE","e":"🦸"},{"w":"GRAPE","e":"🍇"},{"w":"TAPE","e":"📼"}],
 hfw:[{"w":"THESE","s":"These are made of paper."},{"w":"OF","s":"Made of paper."},{"w":"OUT","s":"Cut it out."}],
 sentences:[{"s":["THESE","ARE","MADE","OF","PAPER"],"e":"📄"},{"s":["I","CAN","MAKE","A","SNAKE"],"e":"🐍"}],
 plan:["machine","rhyme","blendIt","spell","blend","spell","sight","sentence","readLine","machine"],
 story:{"t":"Eight Legs and a Cape","art":"✂️🕷️","lines":["The bench was buried in *paper*, *paint*, *glue* and half-finished *puppets*.","'*Make* one,' said the puppet-maker. '*These* are all mine. That side is yours.'","Sam made a *spider* with *eight* legs and, because he had *tape* left, a *cape*.","It hung from the ceiling and turned slowly for the rest of the afternoon."]}},

{no:9, region:"The Silly Circus", art:"🤹",
 grad:"linear-gradient(135deg,#F0A8C4,#A03462)",
 kind:"ending", teaches:[], suffix:"Y", suffixSound:"eee",
 letters:["Y"], confuse:["I","E","J"], teach:"y on the end saying eee",
 vocab:[{"w":"CIRCUS","e":"🎪"},{"w":"PARTY","e":"🎉"},{"w":"ITCHY","e":"🐜"},{"w":"HAIRY","e":"🦁"},{"w":"RUSTY","e":"🔩"},{"w":"CREEPY","e":"🕸️"},{"w":"FLOPPY","e":"🐰"}],
 words:[{"w":"PARTY","e":"🎉","h":"a day with games and cake"},{"w":"ITCHY","e":"🐜","h":"it makes you scratch"},{"w":"HAIRY","e":"🦁","h":"covered in hair"},{"w":"RUSTY","e":"🔩","h":"old metal gone orange"},{"w":"FLOPPY","e":"🐰","h":"soft and hanging down"},{"w":"CREEPY","e":"🕸️","h":"it gives you shivers"}],
 family:[{"w":"BOSSY","e":"🗣️"},{"w":"CREEPY","e":"🕸️"},{"w":"ITCHY","e":"🐜"},{"w":"MESSY","e":"🌪️"},{"w":"RUSTY","e":"🔩"},{"w":"SILLY","e":"🤪"}],
 hfw:[{"w":"VERY","s":"A very silly clown."}],
 plan:["listen","rhyme","addEnding","blendIt","blend","spell","sight","pickWord","spell","addEnding"],
 story:{"t":"The Lion Lets Itself Out","art":"🤹🦁","lines":["The city *circus* was old, *rusty* and, frankly, a bit *creepy*.","Halfway through the show a *hairy* lion opened its own cage door.","It did not eat anybody. It juggled, badly, and everyone clapped.","'*Easy*,' said the lion, and went back in for a nap."]}},

{no:10, region:"The Mirror Lake", art:"🪞",
 grad:"linear-gradient(135deg,#7FC7D9,#1E5A70)",
 kind:"review", teaches:[],
 letters:["C","G","A","I"], confuse:["S","J","E","O"], teach:"every sound of this map",
 vocab:[{"w":"MICE","e":"🐭"},{"w":"CAGE","e":"🔒"},{"w":"CAKE","e":"🍰"},{"w":"PLANE","e":"✈️"},{"w":"SPACE","e":"🌌"},{"w":"CITY","e":"🏙️"},{"w":"KITTEN","e":"🐈"},{"w":"ASTRONAUT","e":"👨‍🚀"}],
 words:[{"w":"FIVE","e":"5️⃣","h":"one more than four"},{"w":"MICE","e":"🐭","h":"more than one mouse"},{"w":"CAGE","e":"🔒","h":"bars to keep something in"},{"w":"AWAKE","e":"👁️","h":"not asleep"},{"w":"FULL","e":"🥛","h":"there is no room left"},{"w":"EMPTY","e":"🕳️","h":"nothing in it at all"},{"w":"NICE","e":"😊","h":"kind and pleasant"},{"w":"MAKE","e":"🔨","h":"build it yourself"}],
 family:[{"w":"BAKE","e":"🧁"},{"w":"CAKE","e":"🍰"},{"w":"LAKE","e":"🏞️"},{"w":"MAKE","e":"🔨"},{"w":"SNAKE","e":"🐍"},{"w":"TAKE","e":"🫴"},{"w":"WAKE","e":"⏰"}],
 hfw:[{"w":"OUT","s":"The lights went out."}],
 sentences:[{"s":["FIVE","MICE","WENT","INTO","THE","CAGE"],"e":"🐭"},{"s":["THE","CAKE","IS","BY","THE","LAKE"],"e":"🍰"},{"s":["AT","NIGHT","THE","CITY","IS","AWAKE"],"e":"🏙️"}],
 plan:["blendIt","spell","machine","rhyme","blend","spell","sight","sentence","readLine","listen"],
 story:{"t":"Down Through the Mirror","art":"🪞🌊","lines":["At midnight the lake went flat as glass and showed the whole city upside down.","Zib dropped soft *c*, soft *g* and long *a* into the reflection.","The surface opened like a door. Below it the water was warm and lit.","'Hold your breath,' said Zib. 'Everything down here is *deep* and *blue*.'"]}}
];

/* ════════ MAP 11 · Lessons 101–110 · The Deep Blue ════════ */
const MAP11 = [

{no:1, region:"The Cook's Book", art:"📖",
 grad:"linear-gradient(135deg,#E8C48A,#96631E)",
 kind:"pattern", teaches:["OO"], rime:"OOK", pattern:"vowelTeam",
 letters:["OO"], confuse:["O","U","EA"], teach:"oo, the short one, as in book",
 vocab:[{"w":"BOOK","e":"📖"},{"w":"COOK","e":"👩‍🍳"},{"w":"WOOL","e":"🧶"},{"w":"FOOT","e":"🦶"},{"w":"CHOCOLATE","e":"🍫"},{"w":"CREAM","e":"🍦"}],
 words:[{"w":"BOOK","e":"📖","h":"it is full of words"},{"w":"COOK","e":"👩‍🍳","h":"she makes the food"},{"w":"LOOK","e":"👁️","h":"use your eyes"},{"w":"TOOK","e":"🫴","h":"he took one"},{"w":"WOOL","e":"🧶","h":"a sheep grows it"},{"w":"FOOT","e":"🦶","h":"you stand on it"}],
 family:[{"w":"BOOK","e":"📖"},{"w":"COOK","e":"👩‍🍳"},{"w":"HOOK","e":"🪝"},{"w":"LOOK","e":"👁️"},{"w":"TOOK","e":"🫴"}],
 hfw:[{"w":"LOOK","s":"Look in the book."}],
 plan:["blendIt","listen","spell","machine","blend","spell","sight","rhyme","machine","rhyme"],
 story:{"t":"The Cook Under the Water","art":"📖👩‍🍳","lines":["The first room below the lake was a kitchen, warm and dry and impossible.","A *cook* stood at the table with one enormous *book* open in front of her.","'*Look*,' she said. 'Every recipe in here has *oo* in it somewhere.'","*Book*, *cook*, *hook*, *look*, *took*. And the *chocolate* *cream* was *delicious*."]}},

{no:2, region:"Moon Pool", art:"🌕",
 grad:"linear-gradient(135deg,#B7C7E8,#2E3F74)",
 kind:"pattern", teaches:[], rime:"OON", pattern:"vowelTeam",
 letters:["OO"], confuse:["O","U","EA"], teach:"oo, the long one, as in moon",
 vocab:[{"w":"MOON","e":"🌙"},{"w":"SPOON","e":"🥄"},{"w":"POOL","e":"🏊"},{"w":"ZOO","e":"🎪"},{"w":"BABOON","e":"🐒"},{"w":"RACCOON","e":"🦝"},{"w":"COCOON","e":"🐛"},{"w":"MOOSE","e":"🦌"}],
 words:[{"w":"MOON","e":"🌙","h":"it shines at night"},{"w":"SPOON","e":"🥄","h":"you eat soup with it"},{"w":"POOL","e":"🏊","h":"water you can swim in"},{"w":"COOL","e":"❄️","h":"a little bit cold"},{"w":"NOON","e":"🕛","h":"the middle of the day"},{"w":"ROOF","e":"🏠","h":"the top of a house"}],
 family:[{"w":"MOON","e":"🌙"},{"w":"NOON","e":"🕛"},{"w":"SOON","e":"⏳"},{"w":"SPOON","e":"🥄"}],
 hfw:[{"w":"SOON","s":"We will go soon."},{"w":"WHO","s":"Who is in the pool?"},{"w":"HERE","s":"The moon is here, under the water."},{"w":"SAID","s":"'Swim,' said the moose."}],
 plan:["blendIt","listen","spell","machine","blend","spell","sight","rhyme","machine","rhyme"],
 story:{"t":"The Moon in the Pool","art":"🌕🥄","lines":["A round *pool* lay in the next cavern with the *moon* sitting in it.","Not a reflection. The actual moon, *cool* and bright and slightly damp.","A *raccoon* was trying to lift it out with a *spoon*.","'The same two letters,' said Zib, 'but *book* and *moon* do not rhyme. Listen hard.'"]}},

{no:3, region:"Mole Hollow", art:"🦔",
 grad:"linear-gradient(135deg,#C4B7A8,#5A4A32)",
 kind:"pattern", teaches:[], rime:"OLE", pattern:"magicE",
 letters:["O","L"], confuse:["A","U","E"], teach:"the -ole family",
 vocab:[{"w":"MOLE","e":"🦔"},{"w":"HOLE","e":"🕳️"},{"w":"POLE","e":"🎏"},{"w":"STONE","e":"🪨"},{"w":"BONE","e":"🦴"},{"w":"PHONE","e":"📱"},{"w":"WOMBAT","e":"🐨"}],
 words:[{"w":"MOLE","e":"🦔","h":"it digs under the grass"},{"w":"HOLE","e":"🕳️","h":"a gap that goes right through"},{"w":"POLE","e":"🎏","h":"a long straight stick"},{"w":"JOKE","e":"😂","h":"it makes people laugh"},{"w":"POKE","e":"👉","h":"a little push with one finger"},{"w":"WOKE","e":"⏰","h":"she woke up early"},{"w":"BONE","e":"🦴","h":"it is hard, and inside you"}],
 family:[{"w":"HOLE","e":"🕳️"},{"w":"MOLE","e":"🦔"},{"w":"POLE","e":"🎏"},{"w":"STOLE","e":"🥷"}],
 hfw:[{"w":"OWN","s":"The mole dug its own hole."},{"w":"WRONG","s":"That was the wrong hole."}],
 plan:["machine","rhyme","blendIt","spell","blend","spell","sight","pickWord","machine","rhyme"],
 story:{"t":"The Wrong Hole","art":"🦔🕳️","lines":["Under the pool the rock was full of *holes*, and every one looked the same.","A *mole* leaned on a *pole* and watched them pick.","'*Wrong*,' it said, four times. Then, 'That one. It is my *own*.'","It was a *joke*. All four had been right. Moles have a strange sense of humour."]}},

{no:4, region:"Foam and Float", art:"🌊",
 grad:"linear-gradient(135deg,#9FD8E8,#1E6A88)",
 kind:"pattern", teaches:[], pattern:"magicE", machine:false,
 letters:["O","E"], confuse:["A","U","I"], teach:"long o, with a magic e on the end",
 vocab:[{"w":"BOAT","e":"⛵"},{"w":"COAT","e":"🧥"},{"w":"GOAT","e":"🐐"},{"w":"ROSE","e":"🌹"},{"w":"TADPOLE","e":"🐸"},{"w":"SEAWEED","e":"🌿"},{"w":"FOAM","e":"🫧"}],
 words:[{"w":"RODE","e":"🏇","h":"she rode all the way"},{"w":"ROSE","e":"🌹","h":"a flower with thorns"},{"w":"VOTE","e":"🗳️","h":"everybody chooses"},{"w":"FLOAT","e":"🛟","h":"to sit on top of the water"},{"w":"BOAT","e":"⛵","h":"it carries you over water"},{"w":"COAT","e":"🧥","h":"you wear it when it is cold"}],
 family:[{"w":"CODE","e":"🔐"},{"w":"NOTE","e":"🎵"},{"w":"RODE","e":"🏇"},{"w":"ROSE","e":"🌹"},{"w":"VOTE","e":"🗳️"}],
 hfw:[{"w":"THROUGH","s":"Swim through the seaweed."},{"w":"BEHIND","s":"The boat is behind us."}],
 plan:["blendIt","rhyme","spell","machine","blend","spell","sight","listen","rhyme","listen"],
 story:{"t":"Everything That Floats","art":"🌊🫧","lines":["The tunnel opened out and the water lifted them, gently, up through *foam*.","A *goat* went past in a *coat*, standing on a *boat*, entirely calm.","*Tadpoles* and *seaweed* drifted *together* just under the surface.","'*Suddenly* everything floats,' said Sam. '*Rode*, *rose*, *vote*, *note*.'"]}},

{no:5, region:"The Crab Shallows", art:"🦀",
 grad:"linear-gradient(135deg,#F0A87E,#A03A1E)",
 kind:"blend", teaches:[], rime:"AM",
 letters:["C","L"], confuse:["S","K","T"], teach:"blends, two letters at the start",
 vocab:[{"w":"CRAB","e":"🦀"},{"w":"CLAM","e":"🦪"},{"w":"SLUG","e":"🐌"},{"w":"FROG","e":"🐸"},{"w":"TRAM","e":"🚋"},{"w":"PLUG","e":"🔌"}],
 words:[{"w":"CLAM","e":"🦪","h":"it lives in two shells"},{"w":"CRAB","e":"🦀","h":"it walks sideways"},{"w":"SLUG","e":"🐌","h":"a snail with no shell"},{"w":"SWAM","e":"🏊","h":"she swam across"},{"w":"GRAB","e":"🤏","h":"take hold of it fast"},{"w":"PLUG","e":"🔌","h":"it goes in the socket"},{"w":"SLAM","e":"🚪","h":"shut it hard and loud"}],
 family:[{"w":"CLAM","e":"🦪"},{"w":"SLAM","e":"🚪"},{"w":"SWAM","e":"🏊"},{"w":"GRAM","e":"⚖️"}],
 hfw:[{"w":"FRIENDS","s":"The crab and the clam are friends."},{"w":"OPEN","s":"The clam will not open."},{"w":"EAT","s":"Crabs eat almost anything."}],
 plan:["machine","blendIt","spell","machine","blend","spell","sight","rhyme","initial","rhyme"],
 story:{"t":"Two Letters, Both Heard","art":"🦀🦪","lines":["In the shallows a *crab* and a *clam* were arguing about who was faster.","'*Cl*,' said the clam. '*Cr*,' said the crab. 'You can hear us both.'","That is what a blend is: two letters side by side, neither one hiding.","*Clam*, *crab*, *slug*, *swam*, *grab*, *plug*. The *slug* won the race, eventually."]}},

{no:6, region:"Green Trunk Reef", art:"🌿",
 grad:"linear-gradient(135deg,#A8D88A,#2E6B22)",
 kind:"blend", teaches:[], rime:"ASH",
 letters:["G","R"], confuse:["C","B","P"], teach:"more blends at the start",
 vocab:[{"w":"GREEN","e":"🟩"},{"w":"TRUNK","e":"🪵"},{"w":"TREE","e":"🌳"},{"w":"CRASH","e":"💥"},{"w":"BUTTERFLY","e":"🦋"},{"w":"LUNCH","e":"🥪"}],
 words:[{"w":"GREEN","e":"🟩","h":"the colour of grass"},{"w":"TREE","e":"🌳","h":"it has leaves and a trunk"},{"w":"TRUNK","e":"🪵","h":"the thick middle of a tree"},{"w":"CRASH","e":"💥","h":"a loud bang"},{"w":"FLY","e":"🪰","h":"to move through the air"},{"w":"LUNCH","e":"🥪","h":"the meal in the middle of the day"}],
 family:[{"w":"CRASH","e":"💥"},{"w":"FLASH","e":"⚡"},{"w":"SPLASH","e":"💦"},{"w":"TRASH","e":"🗑️"}],
 hfw:[],
 plan:["machine","blendIt","spell","machine","blend","spell","sight","rhyme","listen","rhyme"],
 story:{"t":"The Reef That Grew Trees","art":"🌿🦋","lines":["Nothing on this reef behaved. *Trees* grew out of it, underwater, *green* and tall.","*Butterflies* swam between the *trunks* as if that were perfectly normal.","Sam bumped one with a *crash* and a shower of bubbles came down.","'I am *hungry*,' said Zib. So they had *lunch* on a branch, twenty feet under."]}},

{no:7, region:"The Sleeping Seal", art:"🦭",
 grad:"linear-gradient(135deg,#A8CFD9,#2E5A6B)",
 kind:"pattern", teaches:["EA"], rime:"EACH", pattern:"vowelTeam",
 letters:["EA"], confuse:["EE","E","OO"], teach:"ea, two letters saying eee",
 vocab:[{"w":"SEAL","e":"🦭"},{"w":"PEA","e":"🫛"},{"w":"LEAF","e":"🍃"},{"w":"PEACH","e":"🍑"},{"w":"BEACH","e":"🏖️"},{"w":"BADGER","e":"🦡"},{"w":"DREAM","e":"💭"}],
 words:[{"w":"SEAL","e":"🦭","h":"it swims and barks"},{"w":"LEAF","e":"🍃","h":"it grows on a tree"},{"w":"DREAM","e":"💭","h":"the story in your head at night"},{"w":"BEACH","e":"🏖️","h":"sand beside the sea"},{"w":"EAT","e":"🍽️","h":"put food in your mouth"},{"w":"PEACH","e":"🍑","h":"a soft fruit with fuzz"},{"w":"BEAST","e":"🐺","h":"a big wild animal"}],
 family:[{"w":"BEACH","e":"🏖️"},{"w":"PEACH","e":"🍑"},{"w":"REACH","e":"🙆"},{"w":"TEACH","e":"🧑‍🏫"}],
 hfw:[{"w":"NICE","s":"A nice dream."},{"w":"LIGHT","s":"The light comes down through the water."}],
 plan:["blendIt","listen","spell","machine","blend","spell","sight","rhyme","machine","rhyme"],
 story:{"t":"What the Seal Was Dreaming","art":"🦭💭","lines":["A *seal* lay *asleep* on the sand at the bottom, snoring in small bubbles.","Above its head its *dream* hung in the water where anyone could read it.","A *beach*. A *peach*. A *leaf* going round and round in the sun.","'*Ea* says *eee*,' whispered Zib. They tiptoed past without waking it."]}},

{no:8, region:"The Ice Cube Tune", art:"🧊",
 grad:"linear-gradient(135deg,#CFE8F0,#3E7C9E)",
 kind:"pattern", teaches:[], pattern:"magicE", machine:false,
 letters:["U","E"], confuse:["O","A","I"], teach:"long u, saying its own name",
 vocab:[{"w":"CUBE","e":"🧊"},{"w":"FLUTE","e":"🎼"},{"w":"TUBE","e":"🧪"},{"w":"HEDGEHOG","e":"🦔"},{"w":"TEETH","e":"🦷"},{"w":"TONGUE","e":"😛"}],
 words:[{"w":"CUBE","e":"🧊","h":"a box shape with six sides"},{"w":"TUNE","e":"🎶","h":"a little bit of music"},{"w":"TUBE","e":"🧪","h":"a long thin round thing"},{"w":"FLUTE","e":"🎼","h":"you blow it to make music"},{"w":"JUNE","e":"📅","h":"the sixth month"},{"w":"DUKE","e":"🎩","h":"a very grand person"}],
 family:[{"w":"CUBE","e":"🧊"},{"w":"DUKE","e":"🎩"},{"w":"JUNE","e":"📅"},{"w":"TUBE","e":"🧪"},{"w":"TUNE","e":"🎶"}],
 hfw:[],
 plan:["blendIt","rhyme","spell","machine","blend","spell","sight","listen","rhyme","listen"],
 story:{"t":"The Duke and the Flute","art":"🧊🎶","lines":["A *duke* sat on an ice *cube* at the mouth of a long glass *tube*.","He had a *flute* and could play exactly one *tune*, over and over.","'I am *worried*,' he said, 'that it is the only one I know.'","Sam taught him a second. It took until roughly *June*, but he got it."]}},

{no:9, region:"The Builders' Bay", art:"🧑‍🔧",
 grad:"linear-gradient(135deg,#E8C48A,#8C6322)",
 kind:"ending", teaches:["ER"], suffix:"ER", suffixSound:"er",
 letters:["ER"], confuse:["OR","AR","E"], teach:"er on the end of a word",
 vocab:[{"w":"BUILDER","e":"👷"},{"w":"PLUMBER","e":"🚿"},{"w":"CLEANER","e":"🧽"},{"w":"BADGER","e":"🦡"},{"w":"GARDEN","e":"🌷"},{"w":"LADDER","e":"🪜"}],
 words:[{"w":"HELPER","e":"🙋","h":"someone who helps"},{"w":"CLEANER","e":"🧽","h":"they make it spotless"},{"w":"BIGGER","e":"🐘","h":"more big than that one"},{"w":"BETTER","e":"👍","h":"more good than before"},{"w":"SISTER","e":"👧","h":"a girl in your family"},{"w":"BROTHER","e":"👦","h":"a boy in your family"}],
 family:[{"w":"BETTER","e":"👍"},{"w":"BIGGER","e":"🐘"},{"w":"HELPER","e":"🙋"},{"w":"LETTER","e":"✉️"}],
 hfw:[{"w":"BIGGER","s":"This one is bigger."},{"w":"BETTER","s":"That is better."}],
 sentences:[{"s":["MY","SISTER","IS","BIGGER"],"e":"👧"},{"s":["THIS","ONE","IS","BETTER"],"e":"👍"}],
 plan:["addEnding","listen","blendIt","spell","blend","spell","sight","sentence","readLine","addEnding"],
 story:{"t":"The Bay of Helpers","art":"🧑‍🔧🪜","lines":["A whole town of workers lived in the bay: a *plumber*, a *builder*, a *cleaner*.","Every job title ended the same way, and none of them could say why.","'*Er*,' said Zib. 'It is the sound of the person who does the doing.'","*Helper*, *cleaner*, *bigger*, *better*. The *badger* wrote them all down."]}},

{no:10, region:"The Deep Blue Trench", art:"🐋",
 grad:"linear-gradient(135deg,#4E7FD1,#12234A)",
 kind:"review", teaches:[],
 letters:["OO","EA","ER"], confuse:["O","E","U","A"], teach:"every sound of this map",
 vocab:[{"w":"WHALE","e":"🐋"},{"w":"MOON","e":"🌙"},{"w":"SEAL","e":"🦭"},{"w":"CRAB","e":"🦀"},{"w":"BOOK","e":"📖"},{"w":"FLUTE","e":"🎼"},{"w":"CLOUD","e":"☁️"},{"w":"FLOWER","e":"🌸"}],
 words:[{"w":"STRONG","e":"💪","h":"it can lift a lot"},{"w":"PRETTY","e":"🌸","h":"lovely to look at"},{"w":"DRY","e":"🍂","h":"not wet"},{"w":"CRUNCHY","e":"🥕","h":"it snaps when you bite it"},{"w":"GROUND","e":"🟫","h":"what you stand on"},{"w":"CLOUD","e":"☁️","h":"it floats in the sky"},{"w":"DRANK","e":"🥛","h":"she drank it all"},{"w":"BETTER","e":"👍","h":"more good than before"}],
 family:[{"w":"BOOK","e":"📖"},{"w":"COOK","e":"👩‍🍳"},{"w":"HOOK","e":"🪝"},{"w":"LOOK","e":"👁️"},{"w":"TOOK","e":"🫴"}],
 hfw:[{"w":"SOON","s":"We will be up soon."}],
 sentences:[{"s":["THE","WHALE","IS","VERY","STRONG"],"e":"🐋"},{"s":["LOOK","AT","THE","GREY","CLOUD"],"e":"☁️"},{"s":["WE","SWAM","UP","TOGETHER"],"e":"🏊"}],
 plan:["blendIt","spell","machine","rhyme","blend","spell","sight","sentence","readLine","listen"],
 story:{"t":"Up from the Trench","art":"🐋🌅","lines":["The deepest part of the blue was quiet enough to hear your own heart.","A *whale* the size of the harbour came out of the dark and waited.","Zib set *oo*, *ea* and *er* along its back, and it turned upward.","They rose for a long time. Then air, sky, *grey* *cloud* — and one small light, blinking."]}}
];

/* ════════ MAP 12 · Lessons 111–120 · The Last Lighthouse ════════ */
const MAP12 = [

{no:1, region:"Flash Rock", art:"🌩️",
 grad:"linear-gradient(135deg,#F0C07E,#A0521E)",
 kind:"blend", teaches:[], rime:"ASH",
 letters:["C","R"], confuse:["B","P","T"], teach:"blends at the start of a word",
 vocab:[{"w":"CRAB","e":"🦀"},{"w":"FLAG","e":"🚩"},{"w":"PRAM","e":"🛒"},{"w":"TRACK","e":"🛤️"},{"w":"FLASH","e":"⚡"},{"w":"CRASH","e":"💥"}],
 words:[{"w":"CLAP","e":"👏","h":"hit your hands together"},{"w":"CRACK","e":"🥚","h":"a thin split"},{"w":"FLASH","e":"⚡","h":"a very quick light"},{"w":"SLIP","e":"🧊","h":"your feet go out from under you"},{"w":"STUCK","e":"🪤","h":"it will not move"},{"w":"TRACK","e":"🛤️","h":"the line a train runs on"},{"w":"PROP","e":"🪵","h":"something that holds it up"}],
 family:[{"w":"CRASH","e":"💥"},{"w":"FLASH","e":"⚡"},{"w":"SPLASH","e":"💦"},{"w":"TRASH","e":"🗑️"}],
 hfw:[{"w":"WHY","s":"Why is the light flashing?"},{"w":"FRIENDS","s":"Friends stay together."},{"w":"CANNOT","s":"We cannot stop now."}],
 plan:["machine","blendIt","spell","machine","blend","spell","sight","rhyme","initial","rhyme"],
 story:{"t":"The Rock That Flashed","art":"🌩️⚡","lines":["They came out of the water onto a rock in the middle of a storm.","Every few seconds a *flash* lit the whole sea white, then let it go black.","'*Why* is it doing that?' shouted Sam over the *crash* of the waves.","Far off, something answered with a light of its own. Steady. Turning. Waiting."]}},

{no:2, region:"The Keeper's Table", art:"🥗",
 grad:"linear-gradient(135deg,#A8D8A8,#2E7A3E)",
 kind:"blend", teaches:[], rime:"EED",
 letters:["S","H"], confuse:["C","T","F"], teach:"the words somewhere and need",
 vocab:[{"w":"WATER","e":"💧"},{"w":"FOOD","e":"🍲"},{"w":"CLOTHES","e":"👕"},{"w":"SLEEP","e":"😴"},{"w":"EXERCISE","e":"🏋️"},{"w":"HOME","e":"🏠"}],
 words:[{"w":"NEED","e":"🙏","h":"you cannot do without it"},{"w":"SUN","e":"☀️","h":"it lights up the day"},{"w":"HAT","e":"🎩","h":"it goes on your head"},{"w":"DRINK","e":"🥛","h":"you swallow it"},{"w":"WEAR","e":"👕","h":"put it on your body"}],
 family:[{"w":"FEED","e":"🍽️"},{"w":"NEED","e":"🙏"},{"w":"SEED","e":"🌱"},{"w":"WEED","e":"🌿"}],
 hfw:[],
 sentences:[{"s":["WE","NEED","FOOD","AND","WATER"],"e":"🍲"},{"s":["THE","LIGHT","IS","SOMEWHERE","OUT","THERE"],"e":"🌊"}],
 plan:["sight","pickWord","machine","spell","blend","rhyme","blendIt","sentence","readLine","spell"],
 story:{"t":"Everything a Body Needs","art":"🥗🏠","lines":["A woman rowed out through the storm and took them back to a warm kitchen.","'You *need* four things,' she said. '*Food*. *Water*. *Sleep*. Dry *clothes*.'","She was the lighthouse keeper, and the light was *somewhere* to the north.","'Eat first,' she said. 'You can be brave again in the morning.'"]}},

{no:3, region:"Bump and Thump Steps", art:"🥁",
 grad:"linear-gradient(135deg,#C9A7E8,#5F3A96)",
 kind:"blend", teaches:[], rime:"UMP",
 letters:["N","D"], confuse:["M","B","T"], teach:"blends at the end of a word",
 vocab:[{"w":"GOLD","e":"🪙"},{"w":"GIFT","e":"🎁"},{"w":"SAND","e":"🏖️"},{"w":"RAMP","e":"🛹"},{"w":"STAMP","e":"📮"},{"w":"PINK","e":"🌸"}],
 words:[{"w":"BEST","e":"🏅","h":"better than all the rest"},{"w":"GOLD","e":"🪙","h":"a shiny yellow metal"},{"w":"GIFT","e":"🎁","h":"a present"},{"w":"STAMP","e":"📮","h":"it goes on a letter"},{"w":"THUMP","e":"🥁","h":"a heavy dull bang"},{"w":"BUMP","e":"💥","h":"you knock into something"},{"w":"BLINK","e":"👁️","h":"shut your eyes for a moment"}],
 family:[{"w":"BUMP","e":"💥"},{"w":"JUMP","e":"🤸"},{"w":"LUMP","e":"🪨"},{"w":"THUMP","e":"🥁"}],
 hfw:[{"w":"LOOK","s":"Look at the gift."},{"w":"THIS","s":"This is the best one."}],
 plan:["machine","rhyme","machine","initial","blend","spell","sight","pickWord","blendIt","spell"],
 story:{"t":"Every Step Sounded","art":"🥁🪙","lines":["The stair up the cliff was old wood, and every step had its own noise.","*Bump*. *Thump*. *Clunk*. Sam counted forty of them in the dark.","At the top somebody had left a *gift*: a *gold* coin and one used *stamp*.","'Two letters at the *end* this time,' said Zib. 'Say them both.'"]}},

{no:4, region:"The Coast Road", art:"🛣️",
 grad:"linear-gradient(135deg,#F0C08A,#96601E)",
 kind:"pattern", teaches:["OA"], rime:"OAT", pattern:"vowelTeam",
 letters:["OA"], confuse:["O","OO","A"], teach:"oa, two letters saying oh",
 vocab:[{"w":"BOAT","e":"⛵"},{"w":"COAT","e":"🧥"},{"w":"GOAT","e":"🐐"},{"w":"TOAST","e":"🍞"},{"w":"SOAP","e":"🧼"},{"w":"ROAD","e":"🛣️"},{"w":"RAINCOAT","e":"🌧️"}],
 words:[{"w":"SOAP","e":"🧼","h":"it makes bubbles in the bath"},{"w":"ROAD","e":"🛣️","h":"cars drive along it"},{"w":"TOAST","e":"🍞","h":"bread that has been cooked brown"},{"w":"COAST","e":"🏖️","h":"where the land meets the sea"},{"w":"LOAF","e":"🥖","h":"a whole bread"},{"w":"MOAN","e":"😩","h":"a long unhappy sound"},{"w":"SOAK","e":"💧","h":"leave it in the water"}],
 family:[{"w":"BOAT","e":"⛵"},{"w":"COAT","e":"🧥"},{"w":"FLOAT","e":"🛟"},{"w":"GOAT","e":"🐐"}],
 hfw:[{"w":"SOME","s":"Some toast and jam."},{"w":"SAID","s":"'Sit down,' she said."}],
 plan:["blendIt","listen","spell","machine","blend","spell","sight","rhyme","machine","rhyme"],
 story:{"t":"Toast on the Coast Road","art":"🛣️🍞","lines":["The *road* north ran along the *coast* with the sea on one side the whole way.","A *goat* in a yellow *raincoat* was selling *toast* out of a boat on a trailer.","'*Some* for the road?' it *asked*. It made very good toast.","*Boat*, *coat*, *float*, *goat*, *road*, *toast*. All of them saying *oh*."]}},

{no:5, region:"The Bird Garden", art:"🌱",
 grad:"linear-gradient(135deg,#A8D88A,#37752E)",
 kind:"pattern", teaches:["IR"], pattern:"vowelTeam", machine:false,
 letters:["IR"], confuse:["ER","OR","I"], teach:"ir, saying er",
 vocab:[{"w":"BIRD","e":"🐦"},{"w":"GIRL","e":"👧"},{"w":"SHIRT","e":"👕"},{"w":"SKIRT","e":"👗"},{"w":"DIRT","e":"🟫"},{"w":"SEEDLING","e":"🌱"},{"w":"SOIL","e":"🪴"}],
 words:[{"w":"BIRD","e":"🐦","h":"it has feathers and can fly"},{"w":"GIRL","e":"👧","h":"a young woman"},{"w":"DIRT","e":"🟫","h":"earth on your hands"},{"w":"SHIRT","e":"👕","h":"you wear it on top"},{"w":"FIRST","e":"🥇","h":"before everybody else"},{"w":"THIRD","e":"🥉","h":"after first and second"},{"w":"STIR","e":"🥄","h":"go round and round with a spoon"}],
 family:[{"w":"BIRD","e":"🐦"},{"w":"DIRT","e":"🟫"},{"w":"FIRST","e":"🥇"},{"w":"SHIRT","e":"👕"},{"w":"SKIRT","e":"👗"},{"w":"THIRD","e":"🥉"}],
 hfw:[],
 plan:["blendIt","listen","spell","machine","blend","spell","sight","rhyme","listen","rhyme"],
 story:{"t":"The Garden Halfway Up","art":"🌱🐦","lines":["Halfway up the headland somebody had dug a garden into the cliff.","A *girl* in a muddy *shirt* was pressing *seedlings* into the *dirt*.","'*First* the *soil*,' she said. '*Third*, the *water*. And then you wait.'","*Bird*, *dirt*, *first*, *shirt*, *skirt*, *third*. Every one of them said *er*."]}},

{no:6, region:"The Light at Night", art:"🌟",
 grad:"linear-gradient(135deg,#8C7FD1,#2E2360)",
 kind:"pattern", teaches:["IGH"], rime:"IGHT", pattern:"vowelTeam",
 letters:["IGH"], confuse:["I","IR","AY"], teach:"igh, three letters saying eye",
 vocab:[{"w":"LIGHT","e":"🔦"},{"w":"NIGHT","e":"🌃"},{"w":"MOONLIGHT","e":"🌕"},{"w":"STARLIGHT","e":"⭐"},{"w":"WATERFALL","e":"🏞️"},{"w":"SANDPAPER","e":"🧻"}],
 words:[{"w":"LIGHT","e":"🔦","h":"it lets you see in the dark"},{"w":"NIGHT","e":"🌃","h":"when the sun has gone"},{"w":"RIGHT","e":"✅","h":"not wrong"},{"w":"BRIGHT","e":"🌟","h":"shining very hard"},{"w":"HIGH","e":"⛰️","h":"a long way up"},{"w":"TIGHT","e":"🪢","h":"pulled hard, not loose"},{"w":"SIGHT","e":"👀","h":"what your eyes give you"}],
 family:[{"w":"BRIGHT","e":"🌟"},{"w":"LIGHT","e":"🔦"},{"w":"NIGHT","e":"🌃"},{"w":"RIGHT","e":"✅"},{"w":"SIGHT","e":"👀"},{"w":"TIGHT","e":"🪢"}],
 hfw:[{"w":"SAID","s":"'Goodnight,' she said."},{"w":"WHO","s":"Who lit the light?"}],
 plan:["blendIt","listen","spell","machine","blend","spell","sight","rhyme","machine","rhyme"],
 story:{"t":"Three Letters, One Sound","art":"🌟🌃","lines":["By *night* the headland was black except for one turning beam.","*Moonlight* on the water. *Starlight* above. And that beam, going round.","'*igh*,' said Zib. 'Three letters, and they only say *eye*.'","*Bright*, *light*, *night*, *right*, *sight*, *tight*. They walked on by the beam."]}},

{no:7, region:"Lion Sands", art:"🦁",
 grad:"linear-gradient(135deg,#F0C87E,#A67A1E)",
 kind:"grapheme", teaches:[], position:"final", rime:"ING",
 letters:["N","G"], confuse:["M","D","K"], teach:"reading longer words",
 vocab:[{"w":"LION","e":"🦁"},{"w":"SWING","e":"🛝"},{"w":"BUTTERFLY","e":"🦋"},{"w":"SANDPIT","e":"🏖️"},{"w":"FLOWER","e":"🌸"},{"w":"TREE","e":"🌳"}],
 words:[{"w":"SANDPIT","e":"🏖️","h":"a box of sand to dig in"},{"w":"SWING","e":"🛝","h":"it hangs and goes back and forth"},{"w":"ROAR","e":"📢","h":"the noise a lion makes"},{"w":"LOUDLY","e":"🔊","h":"with a lot of noise"},{"w":"CAUGHT","e":"🥅","h":"she caught it before it fell"},{"w":"CHEW","e":"😋","h":"what your teeth do to food"}],
 family:[{"w":"KING","e":"👑"},{"w":"RING","e":"💍"},{"w":"SING","e":"🎤"},{"w":"SWING","e":"🛝"},{"w":"WING","e":"🪶"}],
 hfw:[{"w":"NICE","s":"That was a nice catch."},{"w":"FRIENDS","s":"They are friends now."},{"w":"BETTER","s":"He feels better."}],
 sentences:[{"s":["THE","LION","CAN","ROAR"],"e":"🦁"},{"s":["SHE","CAUGHT","IT","IN","THE","SANDPIT"],"e":"🏖️"}],
 plan:["blend","spell","sound","machine","pickWord","sight","rhyme","sentence","readLine","beginSound"],
 story:{"t":"The Lion in the Sandpit","art":"🦁🛝","lines":["There was a playground at the foot of the lighthouse, of all the places for one.","A *lion* sat in the *sandpit* with its knees round its ears, looking silly.","It *roared* once, *loudly*, and a *butterfly* landed on its nose.","Sam *caught* the *swing* for it. They were *friends* by the time the tide turned."]}},

{no:8, region:"The Stork's Fork", art:"🍴",
 grad:"linear-gradient(135deg,#A8C4D9,#3E5F82)",
 kind:"pattern", teaches:["OR"], rime:"ORN", pattern:"vowelTeam",
 letters:["OR"], confuse:["IR","ER","O"], teach:"or, saying or",
 vocab:[{"w":"CORN","e":"🌽"},{"w":"FORK","e":"🍴"},{"w":"HORN","e":"📯"},{"w":"STORK","e":"🕊️"},{"w":"THORN","e":"🥀"},{"w":"SHORTS","e":"🩳"},{"w":"BOOTS","e":"🥾"},{"w":"JUMPER","e":"🧥"}],
 words:[{"w":"CORN","e":"🌽","h":"it grows on a cob"},{"w":"FORK","e":"🍴","h":"you eat with it"},{"w":"HORN","e":"📯","h":"you blow it, and it is loud"},{"w":"SHORT","e":"📏","h":"not long"},{"w":"SPORT","e":"⚽","h":"a game you play hard"},{"w":"SORT","e":"🗂️","h":"put them in order"},{"w":"STORM","e":"🌩️","h":"wind and rain and thunder"}],
 family:[{"w":"CORN","e":"🌽"},{"w":"HORN","e":"📯"},{"w":"THORN","e":"🥀"}],
 hfw:[{"w":"COLD","s":"It is cold and windy."},{"w":"WARM","s":"Boots and a warm jumper."}],
 plan:["blendIt","listen","spell","machine","blend","spell","sight","rhyme","machine","rhyme"],
 story:{"t":"The Stork Sorts the Weather","art":"🍴🌽","lines":["A *stork* kept the weather station at the *short* end of the headland.","It ate *corn* with a *fork* and *sorted* the day's *storms* into piles.","'*Cold* today,' it said. 'Wear the *warm* *clothes*. Take the *boots*.'","*Corn*, *fork*, *horn*, *thorn*, *storm*, *short*. It was right about the boots."]}},

{no:9, region:"The Last Climb", art:"🧗",
 grad:"linear-gradient(135deg,#E8A87E,#96431E)",
 kind:"blend", teaches:[], rime:"AP",
 letters:["S","T"], confuse:["C","P","F"], teach:"words that tell you what to do",
 vocab:[{"w":"CLIMB","e":"🧗"},{"w":"LEAP","e":"🦘"},{"w":"CREEP","e":"🐈"},{"w":"ROLL","e":"🎳"},{"w":"SWOOP","e":"🦅"},{"w":"SLIDE","e":"🛝"}],
 words:[{"w":"LEAP","e":"🦘","h":"a very big jump"},{"w":"CREEP","e":"🐈","h":"move slowly and quietly"},{"w":"SHOUT","e":"📢","h":"call out very loudly"},{"w":"STOMP","e":"👣","h":"walk with heavy feet"},{"w":"CLING","e":"🤲","h":"hold on and do not let go"},{"w":"FLAP","e":"🪽","h":"what wings do"},{"w":"ROLL","e":"🎳","h":"go over and over"}],
 family:[{"w":"FLAP","e":"🪽"},{"w":"CLAP","e":"👏"},{"w":"SLAP","e":"🖐️"},{"w":"TRAP","e":"🪤"}],
 hfw:[{"w":"ASK","s":"Ask before you climb."},{"w":"SAID","s":"'Hold on,' said Zib."}],
 sentences:[{"s":["WALK","DO","NOT","RUN"],"e":"🚶"},{"s":["CLING","ON","AND","DO","NOT","STOP"],"e":"🤲"}],
 plan:["blend","spell","machine","pickWord","machine","sight","initial","sentence","readLine","blendIt"],
 story:{"t":"The Last Climb","art":"🧗🌬️","lines":["The stair inside the lighthouse went up and up and did not stop.","Sam did not *leap* or *creep* or *shout*. He just kept walking.","The wind came in at every window and made him *cling* to the rail.","'Two hundred steps,' said Zib, from his shoulder. 'You have come further than that.'"]}},

{no:10, region:"The Last Lighthouse", art:"🌅",
 grad:"linear-gradient(135deg,#F0A868,#8C2E1A)",
 kind:"review", teaches:["AY"],
 letters:["AY","OA","IR","IGH","OR"], confuse:["A","O","I","E","U"], teach:"every sound you have found",
 vocab:[{"w":"LIGHTHOUSE","e":"🗼"},{"w":"SUNDAY","e":"📅"},{"w":"HAY","e":"🌾"},{"w":"CLAY","e":"🏺"},{"w":"TRAY","e":"🥡"},{"w":"BOAT","e":"⛵"},{"w":"BIRD","e":"🐦"},{"w":"CORN","e":"🌽"}],
 words:[{"w":"DAY","e":"🌞","h":"from morning until night"},{"w":"PLAY","e":"🛝","h":"to have a game"},{"w":"STAY","e":"🏠","h":"do not go away"},{"w":"AWAY","e":"👋","h":"off somewhere else"},{"w":"TODAY","e":"📅","h":"this very day"},{"w":"HAY","e":"🌾","h":"dry grass for animals"},{"w":"TRAY","e":"🥡","h":"you carry the cups on it"},{"w":"WAY","e":"🛣️","h":"the road that gets you there"}],
 family:[{"w":"BAY","e":"🌊"},{"w":"CLAY","e":"🏺"},{"w":"DAY","e":"🌞"},{"w":"HAY","e":"🌾"},{"w":"PLAY","e":"🛝"},{"w":"STAY","e":"🏠"},{"w":"TRAY","e":"🥡"}],
 hfw:[{"w":"SAY","s":"Say it out loud."},{"w":"FRIENDS","s":"Friends to the end."}],
 sentences:[{"s":["TODAY","WE","GO","HOME"],"e":"🏠"},{"s":["THE","LIGHT","IS","ON","THE","BAY"],"e":"🌊"},{"s":["SAM","CAN","READ","THE","WORDS"],"e":"📖"}],
 plan:["blendIt","spell","machine","rhyme","blend","spell","sight","sentence","readLine","listen"],
 story:{"t":"The Light Comes Back","art":"🌅🗼","lines":["At the top there was one empty lamp, and a book open beside it.","Zib tipped out everything left in the bag: *ay*, *oa*, *ir*, *igh*, *or*.","The lamp lit. Every word Sam had ever found flew back out over the water.","'You did not need me for the last one,' said Zib. 'You can read. *Today*, and every *day* after.'"]}}
];

const MAPS = [
 {no:1, name:"The Lost Letters", art:"🗺️", level:"Level 1 · Starting Out",
  lessons:"Lessons 1–10", grad:"linear-gradient(135deg,#8C6FD1,#523A88)",
  focus:"m s a t b c f i", extra:"-at words",
  blurb:"Ten places, one sound in each, and a chapter of the story every time.",
  nodes:MAP1},

 {no:2, name:"Words That Hold Hands", art:"🌊", level:"Level 1 · Starting Out",
  lessons:"Lessons 11–20", grad:"linear-gradient(135deg,#3E8FB0,#1E5A78)",
  focus:"n p h r z e ee", extra:"-ap and -an words · first sentences",
  blurb:"Six more sounds, two more word families, and your first whole sentence.",
  nodes:MAP2},

 {no:3, name:"The Sunken Path", art:"🌋", level:"Level 1 · Starting Out",
  lessons:"Lessons 21–30", grad:"linear-gradient(135deg,#D97757,#8E3F2A)",
  focus:"v d j o q", extra:"-and and -ad words · in, had, is, has, and, on",
  blurb:"Five more sounds, two more word families, and the little words that hold a sentence together.",
  nodes:MAP3},

 {no:4, name:"The Glass Desert", art:"🏜️", level:"Level 1 · Starting Out",
  lessons:"Lessons 31–40", grad:"linear-gradient(135deg,#E8B04B,#A66F16)",
  focus:"g l k y x w", extra:"-ag and -am words · he, she, as, has, yes, you",
  blurb:"Six more sounds, two more word families, and the words that say who did it.",
  nodes:MAP4},

 {no:5, name:"The Singing Caves", art:"🕳️", level:"Level 2 · Beginning to Read",
  lessons:"Lessons 41–50", grad:"linear-gradient(135deg,#7FB77E,#3D6B3C)",
  focus:"u · the whole alphabet", extra:"-id, -ix, -in, -it, -ig, -ip, -ill, -ing",
  blurb:"Short u, every letter from a to z, and seven word families built on short i.",
  nodes:MAP5},

 {no:6, name:"Frost Harbour", art:"⚓", level:"Level 2 · Beginning to Read",
  lessons:"Lessons 51–60", grad:"linear-gradient(135deg,#6FA8D1,#2F5F82)",
  focus:"short o", extra:"-ot -og -op -od -ock · go, by, look, play, we, his, her",
  blurb:"Five families built on short o, y saying eee on the end, and a harbour frozen solid.",
  nodes:MAP6},

 {no:7, name:"The Rumbling Road", art:"🛻", level:"Level 2 · Beginning to Read",
  lessons:"Lessons 61–70", grad:"linear-gradient(135deg,#C88BC4,#7A4276)",
  focus:"short u", extra:"-ut -up -un -ug -uck -us · me, be, to, there, have, they, do",
  blurb:"Short u the whole way along a rumbling road, and the little words that carry a sentence.",
  nodes:MAP7},

 {no:8, name:"Ember Hollow", art:"🔥", level:"Level 2 · Beginning to Read",
  lessons:"Lessons 71–80", grad:"linear-gradient(135deg,#E07A5F,#98402A)",
  focus:"short e", extra:"-ed -en -et -eg -ell · -ing · come, my, here, where, who, what",
  blurb:"The last short vowel, -ing on the end of a word, and every question word there is.",
  nodes:MAP8},

 {no:9, name:"The Whispering Wood", art:"🌲", level:"Level 3 · Building Confidence",
  lessons:"Lessons 81–90", grad:"linear-gradient(135deg,#5FA37E,#27604A)",
  focus:"sh ch th · long i", extra:"-ie -ine -ike -ide · magic e",
  blurb:"Two letters that make one sound, and the magic e that makes a vowel say its own name.",
  nodes:MAP9},

 {no:10, name:"The Mirror Lake", art:"🪞", level:"Level 3 · Building Confidence",
  lessons:"Lessons 91–100", grad:"linear-gradient(135deg,#7FC7D9,#2E7A90)",
  focus:"soft c · soft g · long a", extra:"-ice -ake -ane -ace · y on the end",
  blurb:"When c says sss and g says juh, four long-a families, and a city reflected in a lake.",
  nodes:MAP10},

 {no:11, name:"The Deep Blue", art:"🐋", level:"Level 3 · Building Confidence",
  lessons:"Lessons 101–110", grad:"linear-gradient(135deg,#4E7FD1,#22406F)",
  focus:"oo · ea · er · long o and u", extra:"-ole · first blends: cl cr fr gr sl sw pl tr",
  blurb:"Vowel teams, long o and long u, and the first blends — two letters, both of them heard.",
  nodes:MAP11},

 {no:12, name:"The Last Lighthouse", art:"🌅", level:"Level 3 · Building Confidence",
  lessons:"Lessons 111–120", grad:"linear-gradient(135deg,#F0A868,#B04A2E)",
  focus:"oa ir igh or ay", extra:"blends at the start and at the end · the last sight words",
  blurb:"The last five sounds, blends at both ends of a word, and the light at the end of the story.",
  nodes:MAP12}
];

/* ── every place across every finished map ──────────────────
   Used by the recording checker, so nothing needs listing twice.
   ---------------------------------------------------------- */
const ALL_MAPS = MAPS.filter(m => m.nodes && m.nodes.length);
const ALL_NODES = ALL_MAPS.flatMap(m => m.nodes.map(n => ({ ...n, map:m.no })));

/* NODES points at the map being played. The engine sets it. */
let NODES = MAPS[0].nodes;
let CURRENT_MAP = MAPS[0];
function useMap(no){
  const m = MAPS.find(x => x.no === no) || MAPS[0];
  if(!m.nodes || !m.nodes.length) return null;
  CURRENT_MAP = m; NODES = m.nodes;
  return m;
}

/* ── picture pool, for wrong answers ────────────────────────
   Drawn from every finished map so distractors stay varied,
   and de-duplicated so a word never appears twice in one row.
   ---------------------------------------------------------- */
const ALL_PICS = (() => {
  const seen = new Map();
  ALL_NODES.forEach(n => [...n.vocab, ...n.words, ...n.family]
    .forEach(v => { if(!seen.has(v.w)) seen.set(v.w, { w:v.w, e:v.e }) }));
  return [...seen.values()];
})();

/* ── helpers the engine asks for ────────────────────────────── */
function lettersUpTo(no){                    // letters taught so far, this map
  const out = [];
  NODES.filter(n => n.no <= no).forEach(n =>
    n.letters.forEach(l => { if(!out.includes(l)) out.push(l) }));
  return out;
}
function landLetters(){                      // every letter in this map
  const out = [];
  NODES.forEach(n => n.letters.forEach(l => { if(!out.includes(l)) out.push(l) }));
  return out;
}
function spokenLetters(){                    // every letter needing a recording
  const out = [];
  ALL_NODES.forEach(n => n.letters.forEach(l => { if(!out.includes(l)) out.push(l) }));
  return out;
}

/* ── cumulative review, across every map ────────────────────
   lettersUpTo() only ever looked inside the current map, so a
   child in Map 8 never met a Map 3 letter again. These two walk
   the whole program up to the lesson being played.
   ---------------------------------------------------------- */
function graphemesUpTo(mapNo, nodeNo){
  const out = [];
  ALL_NODES.forEach(n => {
    if(n.map > mapNo || (n.map === mapNo && n.no > nodeNo)) return;
    (n.teaches || []).forEach(g => { if(!out.includes(g)) out.push(g) });
  });
  return out;
}
function hfwUpTo(mapNo, nodeNo){
  const out = [];
  ALL_NODES.forEach(n => {
    if(n.map > mapNo || (n.map === mapNo && n.no > nodeNo)) return;
    (n.hfw || []).forEach(h => { if(!out.some(x => x.w === h.w)) out.push(h) });
  });
  return out;
}

/* The alphabet strip, for the "what comes next" activity */
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SOUND, SOUND_FILE, SOUND_LABEL, MUST_RECORD, PHON,
                     MAPS, ALL_NODES, ALL_PICS, KEYWORD, LETTER_POOL,
                     graphemesUpTo, hfwUpTo };
}
