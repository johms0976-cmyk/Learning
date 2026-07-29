/* ============================================================
   WORD LAND · CONTENT
   ------------------------------------------------------------
   This is the file to edit when you want to change what the
   child learns. No game logic lives here.

   Content follows ABC Reading Eggs, Level 1 "Starting Out",
   Map 1 (Lessons 1-10): phonic letters and sounds, phonically
   decodable words, high-frequency words and vocabulary.
   ============================================================ */

/* ── Letter → spoken sound ──────────────────────────────────
   The value is BOTH the text passed to the computer voice AND
   the audio filename:  M -> audio/wordland/sounds/mmm.mp3
   ---------------------------------------------------------- */
const SOUND = {
  M:"mmm", S:"sss", A:"aah", T:"tuh", B:"buh", C:"kuh", F:"fff", I:"ih",
  P:"puh", R:"ruh", H:"huh", N:"nuh", D:"duh", G:"guh", L:"luh", J:"juh"
};

/* Fallback picture for a letter that heads no word in a place */
const KEYWORD = {
  A:{w:"APPLE",e:"🍎"}, B:{w:"BALL",e:"⚽"},  C:{w:"CAT",e:"🐱"},
  F:{w:"FISH",e:"🐟"},  I:{w:"INK",e:"🖊️"},  M:{w:"MOON",e:"🌙"},
  S:{w:"SUN",e:"☀️"},   T:{w:"TENT",e:"⛺"}
};

/* Letters offered as wrong answers */
const LETTER_POOL = ["M","S","A","T","B","C","F","I","P","R","H","N","D","G","L","J"];

/* ── The ten places of Map 1 ────────────────────────────────
   letters      the focus sound(s) of the lesson
   confuse      letters this one is easily muddled with
   vocab        picture words (used for listening + initial sounds)
   words        decodable words (used for blending + spelling)
   family       the -at word family (rhyming + missing first letter)
   hfw          high-frequency words, each with a sentence
   plan         the ten activities, in order
   story        the chapter won by finishing the place
   ---------------------------------------------------------- */
const NODES = [

/* ── 1 ─────────────────────────────────────────────────── */
{no:1, region:"Mossy Meadow", art:"🌙", color:"#7FB77E",
 grad:"linear-gradient(135deg,#8FCF8A,#5EA36B)",
 letters:["M"], confuse:["N","W","H"], teach:"the sound m",
 vocab:[{w:"MOON",e:"🌙"},{w:"MONKEY",e:"🐒"},{w:"MOUSE",e:"🐭"},{w:"MOP",e:"🧹"},
        {w:"MEAT",e:"🍖"},{w:"MAN",e:"🧍"},{w:"MUM",e:"👩"},{w:"MILK",e:"🥛"}],
 words:[], family:[], hfw:[],
 plan:["sound","beginSound","trace:l","starts","tapAll","listen","match","hunt","caseMatch","trace:u"],
 story:{t:"Zib Lands in the Moss", art:"🌙🐒",
  lines:["The wind blew Zib into the *moss*.",
         "A *monkey* and a *mouse* were hiding there.",
         "'*Mmm*,' said the monkey. 'That is my sound!'",
         "Zib put *M* in the bag. One letter home."]}},

/* ── 2 ─────────────────────────────────────────────────── */
{no:2, region:"Silver Sands", art:"🐚", color:"#57B8D6",
 grad:"linear-gradient(135deg,#6FCBE6,#3D9CBD)",
 letters:["S"], confuse:["Z","C","G"], teach:"the sound s",
 vocab:[{w:"SUN",e:"☀️"},{w:"SNAKE",e:"🐍"},{w:"SNAIL",e:"🐌"},{w:"SOCK",e:"🧦"},
        {w:"SPOON",e:"🥄"},{w:"SEED",e:"🌱"},{w:"SOAP",e:"🧼"},{w:"STRAWBERRY",e:"🍓"},
        {w:"SANDWICH",e:"🥪"},{w:"SIX",e:"6️⃣"}],
 words:[], family:[], hfw:[],
 plan:["sound","trace:l","starts","beginSound","tapAll","initial","listen","hunt","match","caseMatch"],
 story:{t:"The Sound in the Sand", art:"🐚🐌",
  lines:["Zib walked out onto the *sand*.",
         "The *sun* was hot. A *snail* went slow.",
         "A *snake* hissed, '*Sss*, that one is mine!'",
         "Now Zib had *M* and *S*."]}},

/* ── 3 ─────────────────────────────────────────────────── */
{no:3, region:"Apple Hollow", art:"🍎", color:"#E85D5D",
 grad:"linear-gradient(135deg,#FF7B7B,#D14545)",
 letters:["A","I"], confuse:["E","O","L"], teach:"a, i and the word am",
 vocab:[{w:"APPLE",e:"🍎"},{w:"ANT",e:"🐜"},{w:"ASTRONAUT",e:"👨‍🚀"},{w:"ARROW",e:"➡️"},
        {w:"ALIEN",e:"👽"},{w:"AMBULANCE",e:"🚑"},{w:"IGUANA",e:"🦎"},{w:"INK",e:"🖊️"},
        {w:"JAM",e:"🍓"},{w:"LAMB",e:"🐑"},{w:"LAMP",e:"💡"},{w:"CLAM",e:"🦪"}],
 words:[{w:"AM",e:"🙋",h:"I am here!"},{w:"SAM",e:"🧒",h:"A boy's name"}],
 family:[],
 hfw:[{w:"I", s:"I can see the sun."},{w:"AM", s:"I am Sam."}],
 plan:["sound","trace:l","starts","tapAll","listen","sight","blend","spell","initial","spell"],
 story:{t:"A Boy Called Sam", art:"🍎🧒",
  lines:["In *Apple* Hollow, Zib met a boy.",
         "'*I* *am* *Sam*,' said the boy.",
         "Sam had *jam* on his chin!",
         "*A* and *I* jumped into the bag."]}},

/* ── 4 ─────────────────────────────────────────────────── */
{no:4, region:"Tall Tree Trail", art:"🌳", color:"#4E9F5C",
 grad:"linear-gradient(135deg,#63BB72,#387C46)",
 letters:["T"], confuse:["F","L","I"], teach:"the sound t",
 vocab:[{w:"TENT",e:"⛺"},{w:"TURTLE",e:"🐢"},{w:"TRAIN",e:"🚂"},{w:"TIGER",e:"🐅"},
        {w:"TOMATO",e:"🍅"},{w:"TRACTOR",e:"🚜"},{w:"TEETH",e:"🦷"},{w:"TICKET",e:"🎫"},
        {w:"TV",e:"📺"},{w:"TOY",e:"🧸"},{w:"THREE",e:"3️⃣"}],
 words:[], family:[],
 hfw:[{w:"AM", s:"I am on the trail."}],
 plan:["sound","trace:l","beginSound","starts","tapAll","listen","initial","match","hunt","trace:u"],
 story:{t:"Ten Tall Trees", art:"🌳🐅",
  lines:["Sam and Zib walked the *tall* *tree* *trail*.",
         "A *tiger* slept beside a *tent*.",
         "*Tuh*, *tuh*, went the little *train*.",
         "*T* was found. Four letters now!"]}},

/* ── 5 ─────────────────────────────────────────────────── */
{no:5, region:"Cat Cave", art:"🐱", color:"#8A6BC9",
 grad:"linear-gradient(135deg,#A184DD,#7053B5)",
 letters:["A","T"], confuse:["E","O","F"], teach:"the -at word family",
 vocab:[{w:"CAT",e:"🐱"},{w:"BAT",e:"🦇"},{w:"HAT",e:"🎩"},{w:"RAT",e:"🐀"}],
 words:[{w:"CAT",e:"🐱",h:"Meow!"},{w:"BAT",e:"🦇",h:"Flies at night"},
        {w:"HAT",e:"🎩",h:"On your head"},{w:"MAT",e:"🟫",h:"Wipe your feet"},
        {w:"SAT",e:"💺",h:"Sat right down"},{w:"RAT",e:"🐀",h:"A long tail"}],
 family:[{w:"CAT",e:"🐱"},{w:"BAT",e:"🦇"},{w:"HAT",e:"🎩"},{w:"RAT",e:"🐀"}],
 hfw:[{w:"AT", s:"Look at the cat."},{w:"A", s:"A cat sat."}],
 plan:["sound","initial","blend","rhyme","spell","sight","initial","blend","spell","sight"],
 story:{t:"The Cat on the Mat", art:"🐱🦇",
  lines:["Deep in the cave, a *cat* *sat* on a *mat*.",
         "A *bat* and a *rat* sat down too.",
         "'We all end the same,' said the cat. '*-at*!'",
         "*Bat*, *cat*, *hat*, *mat*, *rat*, *sat*."]}},

/* ── 6 ─────────────────────────────────────────────────── */
{no:6, region:"Bumble Bridge", art:"🐝", color:"#EFA92B",
 grad:"linear-gradient(135deg,#FFC44D,#D98E12)",
 letters:["B"], confuse:["D","P","Q"], teach:"the sound b",
 vocab:[{w:"BEE",e:"🐝"},{w:"BEAR",e:"🐻"},{w:"BREAD",e:"🍞"},{w:"BOOK",e:"📕"},
        {w:"BELL",e:"🔔"},{w:"BALLOON",e:"🎈"},{w:"BABY",e:"👶"},{w:"BONE",e:"🦴"},
        {w:"BALL",e:"⚽"},{w:"BOAT",e:"⛵"},{w:"BAG",e:"🎒"},{w:"BATH",e:"🛁"}],
 words:[{w:"BAT",e:"🦇",h:"Flies at night"}],
 family:[{w:"BAT",e:"🦇"},{w:"CAT",e:"🐱"},{w:"HAT",e:"🎩"}],
 hfw:[{w:"AT", s:"A bee at the bridge."}],
 plan:["sound","trace:l","beginSound","tapAll","starts","initial","listen","match","spell","hunt"],
 story:{t:"Bees on the Bridge", art:"🐝🍞",
  lines:["A wooden *bridge* buzzed with *bees*.",
         "A *bear* wanted the *bread*. So did the bees!",
         "'*Buh*, *buh*, *bear*,' laughed Sam.",
         "*B* went into the bag."]}},

/* ── 7 ─────────────────────────────────────────────────── */
{no:7, region:"Cloud Cove", art:"☁️", color:"#5E9BE8",
 grad:"linear-gradient(135deg,#7FB4F2,#4179C9)",
 letters:["C"], confuse:["O","G","S"], teach:"the sound c",
 vocab:[{w:"CAR",e:"🚗"},{w:"COW",e:"🐄"},{w:"CUP",e:"🥤"},{w:"CRAB",e:"🦀"},
        {w:"CAMEL",e:"🐫"},{w:"CARROT",e:"🥕"},{w:"CORN",e:"🌽"},{w:"CAP",e:"🧢"},
        {w:"CAMERA",e:"📷"},{w:"COAT",e:"🧥"},{w:"CAN",e:"🥫"}],
 words:[{w:"CAT",e:"🐱",h:"Meow!"}],
 family:[{w:"CAT",e:"🐱"},{w:"HAT",e:"🎩"},{w:"BAT",e:"🦇"}],
 hfw:[{w:"A", s:"A crab in a cup."}],
 plan:["sound","trace:l","starts","beginSound","tapAll","initial","listen","match","spell","hunt"],
 story:{t:"A Crab in a Cup", art:"☁️🦀",
  lines:["The *cove* was full of soft *clouds*.",
         "A *crab* was fast asleep in a *cup*!",
         "A *cow* drove past in a *car*. '*Kuh*!'",
         "*C* was safe in the bag."]}},

/* ── 8 ─────────────────────────────────────────────────── */
{no:8, region:"Fox Forest", art:"🦊", color:"#E8763C",
 grad:"linear-gradient(135deg,#FF9159,#C75A22)",
 letters:["F"], confuse:["T","L","E"], teach:"the sound f and -at words",
 vocab:[{w:"FOX",e:"🦊"},{w:"FISH",e:"🐟"},{w:"FROG",e:"🐸"},{w:"FLOWER",e:"🌸"},
        {w:"FIRE",e:"🔥"},{w:"FOOT",e:"🦶"},{w:"FEATHER",e:"🪶"},{w:"FLY",e:"🪰"}],
 words:[{w:"FAT",e:"🐷",h:"Not thin"},{w:"CAT",e:"🐱",h:"Meow!"},
        {w:"MAT",e:"🟫",h:"Wipe your feet"},{w:"SAT",e:"💺",h:"Sat right down"}],
 family:[{w:"CAT",e:"🐱"},{w:"BAT",e:"🦇"},{w:"RAT",e:"🐀"},{w:"HAT",e:"🎩"}],
 hfw:[{w:"AT", s:"The fox sat at the fire."}],
 plan:["sound","trace:l","beginSound","starts","tapAll","initial","blend","spell","rhyme","sight"],
 story:{t:"The Fox by the Fire", art:"🦊🔥",
  lines:["A *fox* *sat* by a warm *fire*.",
         "A *fish* and a *frog* sat down too.",
         "'*Fff*,' said the fire. 'That is my sound.'",
         "*F* was the seventh letter."]}},

/* ── 9 ─────────────────────────────────────────────────── */
{no:9, region:"Sam's Camp", art:"⛺", color:"#3FA6A0",
 grad:"linear-gradient(135deg,#58C5BE,#2C837E)",
 letters:["A","M","T","S"], confuse:["N","E","F"], teach:"putting it all together",
 vocab:[{w:"CAT",e:"🐱"},{w:"BAT",e:"🦇"},{w:"HAT",e:"🎩"},{w:"MOON",e:"🌙"},
        {w:"SUN",e:"☀️"},{w:"TENT",e:"⛺"},{w:"APPLE",e:"🍎"}],
 words:[{w:"AM",e:"🙋",h:"I am here!"},{w:"SAM",e:"🧒",h:"A boy's name"},
        {w:"CAT",e:"🐱",h:"Meow!"},{w:"BAT",e:"🦇",h:"Flies at night"},
        {w:"FAT",e:"🐷",h:"Not thin"},{w:"MAT",e:"🟫",h:"Wipe your feet"}],
 family:[{w:"CAT",e:"🐱"},{w:"BAT",e:"🦇"},{w:"HAT",e:"🎩"},{w:"RAT",e:"🐀"}],
 hfw:[{w:"I", s:"I am Sam."},{w:"A", s:"A cat sat."}],
 plan:["blend","spell","sight","initial","rhyme","spell","blend","sight","listen","match"],
 story:{t:"Camp of Words", art:"⛺🔥",
  lines:["At camp, Sam made words in the sand.",
         "*I* *am* *Sam*. A *cat* *sat*.",
         "*Bat*, *mat*, *fat*, *hat* — all of them!",
         "One place left. The tower is close."]}},

/* ── 10 ────────────────────────────────────────────────── */
{no:10, region:"Wizard's Tower", art:"🗼", color:"#6B4FA8",
 grad:"linear-gradient(135deg,#8C6FD1,#523A88)",
 letters:["A","B","C","F","I","M","S","T"], confuse:["D","P","N","E"],
 teach:"every sound so far",
 vocab:[{w:"MOON",e:"🌙"},{w:"SUN",e:"☀️"},{w:"BEE",e:"🐝"},{w:"CAR",e:"🚗"},
        {w:"FOX",e:"🦊"},{w:"TIGER",e:"🐅"},{w:"APPLE",e:"🍎"},{w:"CAT",e:"🐱"},
        {w:"BOAT",e:"⛵"},{w:"TENT",e:"⛺"}],
 words:[{w:"AM",e:"🙋",h:"I am here!"},{w:"SAM",e:"🧒",h:"A boy's name"},
        {w:"AT",e:"👉",h:"Look at me"},{w:"BAT",e:"🦇",h:"Flies at night"},
        {w:"CAT",e:"🐱",h:"Meow!"},{w:"FAT",e:"🐷",h:"Not thin"},
        {w:"MAT",e:"🟫",h:"Wipe your feet"},{w:"SAT",e:"💺",h:"Sat right down"}],
 family:[{w:"CAT",e:"🐱"},{w:"BAT",e:"🦇"},{w:"HAT",e:"🎩"},{w:"RAT",e:"🐀"}],
 hfw:[{w:"I", s:"I am at the tower."},{w:"AM", s:"I am Sam."},
      {w:"AT", s:"Look at the book."},{w:"A", s:"A cat sat."}],
 plan:["sound","beginSound","initial","blend","spell","rhyme","sight","spell","blend","tapAll"],
 story:{t:"The Spellbook Opens", art:"🗼📖",
  lines:["At the top of the tower lay the big *book*.",
         "Zib tipped out *M*, *S*, *A*, *T*, *B*, *C*, *F*, *I*.",
         "The book glowed. Words came back to Word Land!",
         "'More letters are lost,' said Zib. 'Ready?'"]}}
];

/* Every picture word in the land — the pool wrong answers come from */
const ALL_PICS = (() => {
  const seen = {}, out = [];
  NODES.forEach(n => n.vocab.forEach(v => { if (!seen[v.w]) { seen[v.w] = 1; out.push(v) } }));
  return out;
})();

/* Every letter taught anywhere in this land */
function landLetters() {
  const out = [];
  NODES.forEach(n => n.letters.forEach(l => { if (!out.includes(l)) out.push(l) }));
  return out;
}

/* Every letter the child will actually hear spoken: focus sounds, plus
   the letters inside words they blend and spell. This is the sound
   recording list. */
function spokenLetters() {
  const out = landLetters();
  NODES.forEach(n => [...n.words, ...n.family].forEach(v =>
    v.w.split('').forEach(l => { if (!out.includes(l)) out.push(l) })));
  return out;
}

/* Letters taught by the time you reach a given place */
function lettersUpTo(no) {
  const out = [];
  NODES.filter(n => n.no <= no).forEach(n => n.letters.forEach(l => { if (!out.includes(l)) out.push(l) }));
  return out;
}
