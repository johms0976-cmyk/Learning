/* ============================================================
   WORD LAND · CONTENT
   ------------------------------------------------------------
   Everything the child sees lives here. No game logic.

   Content follows ABC Reading Eggs, Level 1–3, Maps 1–12
   (Lessons 1–120): phonic letters and sounds, phonically
   decodable words, high-frequency words and vocabulary.

   Maps 1 and 2 are written out in full. Maps 3–12 carry their
   real letters and lesson numbers from the scope and sequence
   so the map picker can show what is coming, and are marked
   `soon:true` until their places are written.
   ============================================================ */

/* ── Letter → spoken sound ──────────────────────────────────
   The value is BOTH the text passed to the computer voice AND
   the audio filename:  M -> audio/wordland/sounds/mmm.mp3
   ---------------------------------------------------------- */
const SOUND = {
  M:"mmm", S:"sss", A:"aah", T:"tuh", B:"buh", C:"kuh", F:"fff", I:"ih",
  N:"nnn", P:"puh", H:"huh", R:"rrr", Z:"zzz", E:"eh", EE:"eee",
  D:"duh", G:"guh", L:"lll", J:"juh", V:"vvv", W:"wuh", Y:"yuh",
  K:"kuh", O:"oh", U:"uh", Q:"kwuh", X:"ks"
};

/* Fallback picture for a letter that heads no word in a place */
const KEYWORD = {
  A:{w:"APPLE",e:"🍎"}, B:{w:"BALL",e:"⚽"},  C:{w:"CAT",e:"🐱"},
  F:{w:"FISH",e:"🐟"},  I:{w:"INK",e:"🖊️"},  M:{w:"MOON",e:"🌙"},
  S:{w:"SUN",e:"☀️"},   T:{w:"TENT",e:"⛺"},  N:{w:"NEST",e:"🪺"},
  P:{w:"PIG",e:"🐷"},   H:{w:"HAT",e:"🎩"},  R:{w:"RING",e:"💍"},
  Z:{w:"ZEBRA",e:"🦓"}, E:{w:"EGG",e:"🥚"},  EE:{w:"BEE",e:"🐝"}
};

/* Letters offered as wrong answers */
const LETTER_POOL = ["M","S","A","T","B","C","F","I","N","P","H","R","Z","E","D","G","L","J"];

/* ════════════════════════════════════════════════════════════
   MAP 1 · Lessons 1–10 · m s a t b c f i
   The word list here is unchanged, so recordings already made
   still match. Do not rename a word without re-recording it.
   ════════════════════════════════════════════════════════════ */
const MAP1 = [

{no:1, region:"Mossy Meadow", art:"🌙",
 grad:"linear-gradient(135deg,#8FCF8A,#5EA36B)",
 letters:["M"], confuse:["N","W","H"], teach:"the sound m",
 vocab:[{w:"MOON",e:"🌙"},{w:"MONKEY",e:"🐒"},{w:"MOUSE",e:"🐭"},{w:"MOP",e:"🧹"},
        {w:"MEAT",e:"🍖"},{w:"MAN",e:"🧍"},{w:"MUM",e:"👩"},{w:"MILK",e:"🥛"}],
 words:[], family:[], hfw:[],
 plan:["sound","beginSound","write:l","starts","tapAll","listen","match","hunt","caseMatch","write:u"],
 story:{t:"Zib Lands in the Moss", art:"🌙🐒",
  lines:["The wind blew Zib into the *moss*.",
         "A *monkey* and a *mouse* were hiding there.",
         "'*Mmm*,' said the monkey. 'That is my sound!'",
         "Zib put *M* in the bag. One letter home."]}},

{no:2, region:"Silver Sands", art:"🐚",
 grad:"linear-gradient(135deg,#8FD3E8,#4A9EC4)",
 letters:["S"], confuse:["M","Z","C"], teach:"the sound s",
 vocab:[{w:"SUN",e:"☀️"},{w:"SNAKE",e:"🐍"},{w:"SOCK",e:"🧦"},{w:"SEED",e:"🌱"},
        {w:"SIX",e:"6️⃣"},{w:"SOAP",e:"🧼"},{w:"SPOON",e:"🥄"},{w:"SNAIL",e:"🐌"},
        {w:"SANDWICH",e:"🥪"},{w:"STRAWBERRY",e:"🍓"}],
 words:[], family:[], hfw:[],
 plan:["sound","beginSound","write:l","tapAll","starts","listen","hunt","match","caseMatch","write:u"],
 story:{t:"The Sound in the Sand", art:"🐚🐍",
  lines:["Zib walked out onto the *sand*.",
         "The *sun* was hot. A *snail* went slow.",
         "A *snake* hissed, '*Sss*, that one is mine!'",
         "Now Zib had *M* and *S*."]}},

{no:3, region:"Apple Hollow", art:"🍎",
 grad:"linear-gradient(135deg,#FF9A8B,#E5564B)",
 letters:["A","I"], confuse:["M","S","T","E"], teach:"the sounds a and i",
 vocab:[{w:"APPLE",e:"🍎"},{w:"ANT",e:"🐜"},{w:"ARROW",e:"🏹"},{w:"ASTRONAUT",e:"👨‍🚀"},
        {w:"AMBULANCE",e:"🚑"},{w:"ALIEN",e:"👽"},{w:"INK",e:"🖊️"},{w:"IGUANA",e:"🦎"},
        {w:"JAM",e:"🍓"},{w:"LAMP",e:"💡"},{w:"LAMB",e:"🐑"},{w:"CLAM",e:"🦪"}],
 words:[{w:"SAM",e:"👦",h:"a boy"},{w:"AM",e:"🙋",h:"I am"}],
 family:[],
 hfw:[{w:"I",s:"I am Sam."},{w:"AM",s:"I am here."}],
 plan:["sound","beginSound","write:l","hunt","starts","listen","sight","match","initial","write:u"],
 story:{t:"A Boy Called Sam", art:"🍎👦",
  lines:["In *Apple* Hollow, Zib met a boy.",
         "'*I* *am* *Sam*,' said the boy.",
         "Sam had *jam* on his chin!",
         "*A* and *I* jumped into the bag."]}},

{no:4, region:"Tall Tree Trail", art:"🌲",
 grad:"linear-gradient(135deg,#A0E8AF,#41916C)",
 letters:["T"], confuse:["F","I","L"], teach:"the sound t",
 vocab:[{w:"TENT",e:"⛺"},{w:"TIGER",e:"🐯"},{w:"TRAIN",e:"🚂"},{w:"TRACTOR",e:"🚜"},
        {w:"TURTLE",e:"🐢"},{w:"TEETH",e:"🦷"},{w:"TOMATO",e:"🍅"},{w:"TOY",e:"🧸"},
        {w:"TICKET",e:"🎟️"},{w:"THREE",e:"3️⃣"},{w:"TV",e:"📺"}],
 words:[], family:[], hfw:[],
 plan:["sound","beginSound","write:l","tapAll","starts","listen","hunt","match","caseMatch","write:u"],
 story:{t:"Ten Tall Trees", art:"🌲🐯",
  lines:["Sam and Zib walked the *tall* *tree* trail.",
         "A *tiger* slept beside a *tent*.",
         "*Tuh*, *tuh*, went the little *train*.",
         "*T* was found. Four letters now!"]}},

{no:5, region:"Cat Cave", art:"🐱",
 grad:"linear-gradient(135deg,#FFC97B,#E08A2E)",
 letters:["A","T"], confuse:["M","S","B","C"], teach:"the -at family",
 vocab:[{w:"CAT",e:"🐱"},{w:"BAT",e:"🦇"},{w:"HAT",e:"🎩"},{w:"MAT",e:"🧶"},{w:"RAT",e:"🐀"}],
 words:[{w:"AT",e:"🎯",h:"at the mat"},{w:"SAT",e:"🪑",h:"the cat sat"}],
 family:[{w:"BAT",e:"🦇"},{w:"CAT",e:"🐱"},{w:"HAT",e:"🎩"},
         {w:"MAT",e:"🧶"},{w:"RAT",e:"🐀"},{w:"SAT",e:"🪑"}],
 hfw:[{w:"AT",s:"The cat is at the mat."},{w:"A",s:"A cat sat."}],
 plan:["sound","machine","write:l","rhyme","initial","blend","spell","sight","hunt","write:u"],
 story:{t:"The Cat on the Mat", art:"🐱🧶",
  lines:["Deep in the cave, a *cat* *sat* on a *mat*.",
         "A *bat* and a *rat* sat down too.",
         "'We all end the same,' said the cat. '*-at*!'",
         "*Bat*, *cat*, *hat*, *mat*, *rat*, *sat*."]}},

{no:6, region:"Bumble Bridge", art:"🐝",
 grad:"linear-gradient(135deg,#FFE066,#E0A800)",
 letters:["B"], confuse:["D","P","M"], teach:"the sound b",
 vocab:[{w:"BEE",e:"🐝"},{w:"BALL",e:"⚽"},{w:"BOOK",e:"📖"},{w:"BEAR",e:"🐻"},
        {w:"BOAT",e:"⛵"},{w:"BREAD",e:"🍞"},{w:"BELL",e:"🔔"},{w:"BONE",e:"🦴"},
        {w:"BAG",e:"👜"},{w:"BATH",e:"🛁"},{w:"BABY",e:"👶"},{w:"BALLOON",e:"🎈"}],
 words:[{w:"BAT",e:"🦇",h:"it flies at night"}],
 family:[{w:"BAT",e:"🦇"},{w:"CAT",e:"🐱"},{w:"HAT",e:"🎩"}],
 hfw:[{w:"AT",s:"The bee is at the bridge."}],
 plan:["sound","beginSound","write:l","tapAll","starts","caseMatch","initial","blend","hunt","write:u"],
 story:{t:"Bees on the Bridge", art:"🐝🌉",
  lines:["A wooden *bridge* buzzed with *bees*.",
         "A *bear* wanted the *bread*. So did the bees!",
         "'*Buh*, *buh*, *bear*,' laughed Sam.",
         "*B* went into the bag."]}},

{no:7, region:"Cloud Cove", art:"☁️",
 grad:"linear-gradient(135deg,#C3B7F5,#7B68C9)",
 letters:["C"], confuse:["S","K","O"], teach:"the sound c",
 vocab:[{w:"CAR",e:"🚗"},{w:"CUP",e:"☕"},{w:"COW",e:"🐄"},{w:"CRAB",e:"🦀"},
        {w:"CAMEL",e:"🐫"},{w:"CARROT",e:"🥕"},{w:"CORN",e:"🌽"},{w:"COAT",e:"🧥"},
        {w:"CAMERA",e:"📷"},{w:"CAN",e:"🥫"},{w:"CAP",e:"🧢"}],
 words:[{w:"CAT",e:"🐱",h:"it says meow"}],
 family:[{w:"CAT",e:"🐱"},{w:"BAT",e:"🦇"},{w:"HAT",e:"🎩"}],
 hfw:[{w:"A",s:"A cow in a car!"}],
 plan:["sound","beginSound","write:l","tapAll","starts","listen","initial","blend","rhyme","write:u"],
 story:{t:"A Crab in a Cup", art:"☁️🦀",
  lines:["The *cove* was full of soft *clouds*.",
         "A *crab* was fast asleep in a *cup*!",
         "A *cow* drove past in a *car*. '*Kuh*!'",
         "*C* was safe in the bag."]}},

{no:8, region:"Fox Forest", art:"🦊",
 grad:"linear-gradient(135deg,#FFA07A,#D2601A)",
 letters:["F"], confuse:["T","E","P"], teach:"the sound f",
 vocab:[{w:"FOX",e:"🦊"},{w:"FISH",e:"🐟"},{w:"FROG",e:"🐸"},{w:"FIRE",e:"🔥"},
        {w:"FLOWER",e:"🌸"},{w:"FEATHER",e:"🪶"},{w:"FOOT",e:"🦶"},{w:"FLY",e:"🪰"}],
 words:[{w:"FAT",e:"🐷",h:"not thin"}],
 family:[{w:"FAT",e:"🐷"},{w:"CAT",e:"🐱"},{w:"BAT",e:"🦇"},{w:"MAT",e:"🧶"},
         {w:"SAT",e:"🪑"},{w:"HAT",e:"🎩"},{w:"RAT",e:"🐀"}],
 hfw:[{w:"AT",s:"The fox is at the fire."}],
 plan:["sound","beginSound","write:l","machine","starts","listen","initial","blend","spell","write:u"],
 story:{t:"The Fox by the Fire", art:"🦊🔥",
  lines:["A *fox* sat by a warm *fire*.",
         "A *fish* and a *frog* sat down too.",
         "'*Fff*,' said the fire. 'That is my sound.'",
         "*F* was the seventh letter."]}},

{no:9, region:"Sam's Camp", art:"🏕️",
 grad:"linear-gradient(135deg,#96E6A1,#3FA34D)",
 letters:["A","M","T"], confuse:["S","B","C","F"], teach:"putting the sounds together",
 vocab:[{w:"APPLE",e:"🍎"},{w:"MOON",e:"🌙"},{w:"SUN",e:"☀️"},{w:"TENT",e:"⛺"}],
 words:[{w:"AM",e:"🙋",h:"I am"},{w:"SAM",e:"👦",h:"a boy"},{w:"CAT",e:"🐱",h:"it says meow"},
        {w:"BAT",e:"🦇",h:"it flies at night"},{w:"FAT",e:"🐷",h:"not thin"},
        {w:"MAT",e:"🧶",h:"you wipe your feet on it"}],
 family:[{w:"BAT",e:"🦇"},{w:"CAT",e:"🐱"},{w:"FAT",e:"🐷"},{w:"HAT",e:"🎩"},
         {w:"MAT",e:"🧶"},{w:"RAT",e:"🐀"}],
 hfw:[{w:"I",s:"I am Sam."},{w:"A",s:"A cat sat."}],
 plan:["sound","alphabet","write:l","spell","initial","blend","rhyme","sight","machine","write:u"],
 story:{t:"Camp of Words", art:"🏕️✏️",
  lines:["At camp, *Sam* made words in the sand.",
         "*I* *am* *Sam*. *A* *cat* *sat*.",
         "*Bat*, *mat*, *fat*, *hat* — all of them!",
         "One place left. The tower is close."]}},

{no:10, region:"Wizard's Tower", art:"🏰",
 grad:"linear-gradient(135deg,#B39DDB,#5E35B1)",
 letters:["M","S","A","T","B","C","F","I"], confuse:["N","P","H","R"],
 teach:"every letter you have found",
 vocab:[{w:"APPLE",e:"🍎"},{w:"MOON",e:"🌙"},{w:"SUN",e:"☀️"},{w:"TENT",e:"⛺"},
        {w:"BEE",e:"🐝"},{w:"CAR",e:"🚗"},{w:"FOX",e:"🦊"},{w:"BOAT",e:"⛵"},{w:"TIGER",e:"🐯"}],
 words:[{w:"AM",e:"🙋",h:"I am"},{w:"SAM",e:"👦",h:"a boy"},{w:"AT",e:"🎯",h:"at the mat"},
        {w:"BAT",e:"🦇",h:"it flies at night"},{w:"CAT",e:"🐱",h:"it says meow"},
        {w:"FAT",e:"🐷",h:"not thin"},{w:"MAT",e:"🧶",h:"you wipe your feet on it"},
        {w:"SAT",e:"🪑",h:"the cat sat down"}],
 family:[{w:"BAT",e:"🦇"},{w:"CAT",e:"🐱"},{w:"FAT",e:"🐷"},{w:"HAT",e:"🎩"},
         {w:"MAT",e:"🧶"},{w:"RAT",e:"🐀"},{w:"SAT",e:"🪑"}],
 hfw:[{w:"I",s:"I am Sam."},{w:"AM",s:"I am here."},
      {w:"AT",s:"The cat is at the mat."},{w:"A",s:"A cat sat."}],
 plan:["sound","hunt","write:l","spell","initial","blend","rhyme","sight","machine","write:u"],
 story:{t:"The Spellbook Opens", art:"🏰📖",
  lines:["At the top of the tower lay the big book.",
         "Zib tipped out *M*, *S*, *A*, *T*, *B*, *C*, *F*, *I*.",
         "The book glowed. Words came back to Word Land!",
         "'More letters are lost,' said Zib. 'Ready?'"]}}
];

/* ════════════════════════════════════════════════════════════
   MAP 2 · Lessons 11–20 · n p h r z e·ee, and the first sentences
   ════════════════════════════════════════════════════════════ */
const MAP2 = [

{no:1, lesson:11, region:"Nest Ridge", art:"🪺",
 grad:"linear-gradient(135deg,#A8D8B9,#4E8C6A)",
 letters:["N"], confuse:["M","H","U"], teach:"the sound n",
 vocab:[{w:"NEST",e:"🪺"},{w:"NOSE",e:"👃"},{w:"NUT",e:"🥜"},{w:"NET",e:"🥅"},
        {w:"NAIL",e:"🔩"},{w:"NEEDLE",e:"🪡"},{w:"NURSE",e:"👩‍⚕️"},{w:"NINE",e:"9️⃣"}],
 words:[], family:[],
 hfw:[{w:"I",s:"I can see a nest."}],
 plan:["sound","beginSound","write:l","tapAll","starts","listen","hunt","match","sight","write:u"],
 story:{t:"The Nest on the Ridge", art:"🪺🐦",
  lines:["Beyond the tower, a high ridge climbed into the sky.",
         "*Nine* eggs sat in one round *nest*.",
         "'*Nnn*,' hummed the bird. '*Nest*. *Nose*. *Nut*.'",
         "*I* can see it, said Zib. *N* was letter nine."]}},

{no:2, lesson:12, region:"Peach Path", art:"🍑",
 grad:"linear-gradient(135deg,#FFB3A7,#E06C5B)",
 letters:["P"], confuse:["B","D","R"], teach:"the sound p",
 vocab:[{w:"PIG",e:"🐷"},{w:"PEACH",e:"🍑"},{w:"PEAR",e:"🍐"},{w:"PEN",e:"🖊️"},
        {w:"PENCIL",e:"✏️"},{w:"PIE",e:"🥧"},{w:"PLATE",e:"🍽️"},{w:"POTATO",e:"🥔"},
        {w:"PAN",e:"🍳"},{w:"PEANUT",e:"🥜"},{w:"PEA",e:"🫛"}],
 words:[{w:"PAT",e:"🤚",h:"pat the cat"},{w:"PIT",e:"🕳️",h:"a hole"}],
 family:[{w:"PAT",e:"🤚"},{w:"CAT",e:"🐱"},{w:"BAT",e:"🦇"},{w:"HAT",e:"🎩"}],
 hfw:[{w:"AM",s:"I am at the peach tree."}],
 plan:["sound","beginSound","write:l","tapAll","starts","initial","blend","sight","caseMatch","write:u"],
 story:{t:"A Pig on the Peach Path", art:"🍑🐷",
  lines:["The path down the ridge was lined with *peach* trees.",
         "A *pig* was eating a *pear* off a *plate*!",
         "'*Puh*, *puh*, *pig*,' said Sam, and gave it a *pat*.",
         "*P* was in the bag. '*I* *am* quick,' said Zib."]}},

{no:3, lesson:13, region:"Map Market", art:"🗺️",
 grad:"linear-gradient(135deg,#FFD68A,#D9932A)",
 letters:["A","P"], confuse:["T","N","M"], teach:"the -ap family",
 vocab:[{w:"MAP",e:"🗺️"},{w:"CAP",e:"🧢"},{w:"TAP",e:"🚰"},{w:"NAP",e:"😴"},
        {w:"LAP",e:"🦵"},{w:"GAP",e:"🚧"},{w:"ZAP",e:"⚡"}],
 words:[{w:"MAP",e:"🗺️",h:"it shows the way"},{w:"CAP",e:"🧢",h:"a hat you wear"},
        {w:"TAP",e:"🚰",h:"water comes out"},{w:"ZAP",e:"⚡",h:"a flash of lightning"}],
 family:[{w:"CAP",e:"🧢"},{w:"GAP",e:"🚧"},{w:"LAP",e:"🦵"},{w:"MAP",e:"🗺️"},
         {w:"NAP",e:"😴"},{w:"TAP",e:"🚰"},{w:"ZAP",e:"⚡"}],
 hfw:[{w:"A",s:"A map and a cap."}],
 plan:["machine","rhyme","write:l","initial","blend","spell","tapAll","sight","hunt","write:u"],
 story:{t:"The Market of Maps", art:"🗺️🧢",
  lines:["Every stall in the market sold one thing: *maps*.",
         "A man in a red *cap* filled a cup at the *tap*.",
         "'They all end the same,' said Sam. '*-ap*!'",
         "*Cap*, *gap*, *lap*, *map*, *nap*, *tap*, *zap*."]}},

{no:4, lesson:14, region:"Hammer Hill", art:"🔨",
 grad:"linear-gradient(135deg,#9FC7EA,#3E6FA8)",
 letters:["H"], confuse:["N","M","K"], teach:"the sound h",
 vocab:[{w:"HAT",e:"🎩"},{w:"HORSE",e:"🐴"},{w:"HAMMER",e:"🔨"},{w:"HEART",e:"❤️"},
        {w:"HELMET",e:"⛑️"},{w:"HAIR",e:"💇"},{w:"HEAD",e:"🗣️"},{w:"HIVE",e:"🍯"},
        {w:"HOLE",e:"🕳️"},{w:"HAMBURGER",e:"🍔"}],
 words:[{w:"HAT",e:"🎩",h:"it goes on your head"},{w:"HAM",e:"🍖",h:"you eat it"}],
 family:[{w:"HAT",e:"🎩"},{w:"CAT",e:"🐱"},{w:"BAT",e:"🦇"},{w:"MAT",e:"🧶"},{w:"RAT",e:"🐀"}],
 hfw:[{w:"A",s:"A horse in a helmet."}],
 plan:["sound","beginSound","write:l","tapAll","starts","listen","initial","blend","machine","write:u"],
 story:{t:"The Horse on Hammer Hill", art:"🔨🐴",
  lines:["*Hammer* Hill rang all day: tap, tap, tap.",
         "A *horse* in a *helmet* was building a *hive*.",
         "'*Huh*, *huh*, *hat*,' it puffed, and lost its *hat*.",
         "Sam caught it. *H* was theirs."]}},

{no:5, lesson:15, region:"Rope Ridge", art:"🪢",
 grad:"linear-gradient(135deg,#F3A5C0,#C4457C)",
 letters:["R"], confuse:["P","B","N"], teach:"the sound r",
 vocab:[{w:"RING",e:"💍"},{w:"ROBOT",e:"🤖"},{w:"ROSE",e:"🌹"},{w:"RABBIT",e:"🐰"},
        {w:"RICE",e:"🍚"},{w:"RUG",e:"🧿"},{w:"ROPE",e:"🪢"},{w:"RAFT",e:"🛶"},
        {w:"RADIO",e:"📻"},{w:"RULER",e:"📏"},{w:"RASPBERRY",e:"🫐"}],
 words:[{w:"RAT",e:"🐀",h:"a long tail"},{w:"RAN",e:"🏃",h:"the man ran"}],
 family:[{w:"RAT",e:"🐀"},{w:"CAT",e:"🐱"},{w:"BAT",e:"🦇"},{w:"HAT",e:"🎩"},{w:"MAT",e:"🧶"}],
 hfw:[{w:"A",s:"A rabbit on a raft."}],
 plan:["sound","beginSound","write:l","tapAll","starts","listen","initial","blend","rhyme","write:u"],
 story:{t:"A Rope Across the Ridge", art:"🪢🐰",
  lines:["One long *rope* crossed the gap between two cliffs.",
         "A *rabbit* held a *rose*. A *robot* held a *ruler*.",
         "'*Rrr*,' growled the rope as they pulled.",
         "A *rat* *ran* over first. *R* was letter twelve."]}},

{no:6, lesson:16, region:"Van Valley", art:"🚐",
 grad:"linear-gradient(135deg,#A5D6C7,#2E8B78)",
 letters:["A","N"], confuse:["M","T","P"], teach:"the -an family",
 vocab:[{w:"VAN",e:"🚐"},{w:"FAN",e:"🌀"},{w:"MAN",e:"🧍"},{w:"CAN",e:"🥫"},
        {w:"PAN",e:"🍳"},{w:"HAND",e:"✋"},{w:"BAND",e:"🎺"}],
 words:[{w:"RAN",e:"🏃",h:"the man ran"},{w:"FAN",e:"🌀",h:"it keeps you cool"},
        {w:"CAN",e:"🥫",h:"a tin"},{w:"MAN",e:"🧍",h:"a grown-up"},
        {w:"PAN",e:"🍳",h:"you cook in it"},{w:"VAN",e:"🚐",h:"a little truck"}],
 family:[{w:"CAN",e:"🥫"},{w:"FAN",e:"🌀"},{w:"MAN",e:"🧍"},{w:"PAN",e:"🍳"},
         {w:"RAN",e:"🏃"},{w:"TAN",e:"🟤"},{w:"VAN",e:"🚐"}],
 hfw:[{w:"MAN",s:"The man ran."},{w:"CAN",s:"I can see the van."}],
 plan:["machine","rhyme","write:l","initial","blend","spell","sight","pickWord","tapAll","write:u"],
 story:{t:"The Van in the Valley", art:"🚐🌀",
  lines:["Down in the valley an old *van* was stuck in the mud.",
         "A *man* with a *fan* and a *pan* came to help.",
         "'*Can* we?' said Sam. They pushed. The van *ran*!",
         "*Can*, *fan*, *man*, *pan*, *ran*, *tan*, *van*."]}},

{no:7, lesson:17, region:"Zigzag Zoo", art:"🦓",
 grad:"linear-gradient(135deg,#C9B6E4,#6A4C9C)",
 letters:["Z"], confuse:["S","N","X"], teach:"the sound z",
 vocab:[{w:"ZEBRA",e:"🦓"},{w:"ZOO",e:"🎪"},{w:"ZIP",e:"🤐"},{w:"ZERO",e:"0️⃣"},
        {w:"ZUCCHINI",e:"🥒"},{w:"ZIGZAG",e:"⚡"}],
 words:[{w:"ZAP",e:"⚡",h:"a flash of lightning"}],
 family:[{w:"ZAP",e:"⚡"},{w:"CAP",e:"🧢"},{w:"MAP",e:"🗺️"},{w:"TAP",e:"🚰"},{w:"NAP",e:"😴"}],
 hfw:[{w:"CAN",s:"I can see a zebra."}],
 plan:["sound","beginSound","write:l","tapAll","starts","listen","initial","machine","caseMatch","write:u"],
 story:{t:"The Zebra's Zigzag", art:"🦓⚡",
  lines:["The path through the *zoo* went *zigzag*, left and right.",
         "A *zebra* with a *zip* on its coat led the way.",
         "'*Zzz*,' it buzzed. '*Zap*! *Zero*! *Zoo*!'",
         "Sam laughed. *Z* went into the bag."]}},

{no:8, lesson:18, region:"Bee Tree", art:"🐝",
 grad:"linear-gradient(135deg,#FFE39B,#D9A404)",
 letters:["E","EE"], confuse:["A","I","O"], teach:"e, and ee saying its name",
 vocab:[{w:"BEE",e:"🐝"},{w:"TREE",e:"🌳"},{w:"SHEEP",e:"🐑"},{w:"CHEESE",e:"🧀"},
        {w:"QUEEN",e:"👑"},{w:"KNEE",e:"🦵"},{w:"TEEPEE",e:"⛺"},{w:"SEED",e:"🌱"},
        {w:"THREE",e:"3️⃣"},{w:"WEED",e:"🌿"}],
 words:[{w:"BEE",e:"🐝",h:"it makes honey"},{w:"SEE",e:"👀",h:"with your eyes"},
        {w:"TREE",e:"🌳",h:"it has leaves"},{w:"SEED",e:"🌱",h:"a plant starts here"},
        {w:"WEED",e:"🌿",h:"a plant you pull up"}],
 family:[{w:"BEE",e:"🐝"},{w:"SEE",e:"👀"},{w:"TREE",e:"🌳"},{w:"THREE",e:"3️⃣"}],
 hfw:[{w:"SEE",s:"I can see three bees."}],
 plan:["sound","beginSound","write:l","listen","rhyme","blend","spell","sight","pickWord","write:u"],
 story:{t:"Three Bees in the Tree", art:"🐝🌳",
  lines:["One huge *tree* stood alone, humming.",
         "*Three* *bees* flew out. Then a *sheep* and a *queen*!",
         "'*Eee*,' sang the bees. 'That is two e's, together.'",
         "'*I* can *see* it,' said Sam. '*Bee*. *Tree*. *See*.'"]}},

{no:9, lesson:19, region:"Sentence Springs", art:"💧",
 grad:"linear-gradient(135deg,#8FD3E8,#2E7DA8)",
 letters:["A","N","P"], confuse:["M","S","T","H"], teach:"putting words into a sentence",
 vocab:[{w:"CAT",e:"🐱"},{w:"MAN",e:"🧍"},{w:"BEE",e:"🐝"},{w:"HAT",e:"🎩"},{w:"VAN",e:"🚐"}],
 words:[{w:"SAM",e:"👦",h:"a boy"},{w:"CAN",e:"🥫",h:"a tin"},{w:"SEE",e:"👀",h:"with your eyes"},
        {w:"MAN",e:"🧍",h:"a grown-up"},{w:"FAN",e:"🌀",h:"it keeps you cool"},
        {w:"PAN",e:"🍳",h:"you cook in it"},{w:"TAP",e:"🚰",h:"water comes out"},
        {w:"CAP",e:"🧢",h:"a hat you wear"},{w:"HAT",e:"🎩",h:"it goes on your head"},
        {w:"BAT",e:"🦇",h:"it flies at night"},{w:"CAT",e:"🐱",h:"it says meow"}],
 family:[{w:"CAN",e:"🥫"},{w:"FAN",e:"🌀"},{w:"MAN",e:"🧍"},{w:"PAN",e:"🍳"},{w:"RAN",e:"🏃"}],
 hfw:[{w:"SEE",s:"I can see Sam."},{w:"THE",s:"The man ran."},
      {w:"I",s:"I am Sam."},{w:"CAN",s:"I can see the van."},{w:"MAN",s:"The man has a hat."}],
 sentences:[{s:["I","CAN","SEE","A","CAT"], e:"🐱"},
            {s:["SAM","CAN","SEE","THE","MAN"], e:"🧍"},
            {s:["THE","MAN","RAN"], e:"🏃"},
            {s:["I","AM","AT","THE","TREE"], e:"🌳"}],
 plan:["sentence","pickWord","write:l","sight","blend","spell","alphabet","readLine","machine","write:u"],
 story:{t:"Words That Hold Hands", art:"💧✏️",
  lines:["At the springs, the words were floating in the water.",
         "Sam caught three and put them in a row.",
         "*I* *can* *see* *a* *cat*. It was a whole *sentence*!",
         "'Words hold hands,' said Zib. 'That is reading.'"]}},

{no:10, lesson:20, region:"Lantern Lighthouse", art:"🗼",
 grad:"linear-gradient(135deg,#F7B7A3,#B34F3C)",
 letters:["N","P","H","R","Z","E"], confuse:["M","S","T","B","C","F"],
 teach:"every letter of this map",
 vocab:[{w:"NEST",e:"🪺"},{w:"PIG",e:"🐷"},{w:"HORSE",e:"🐴"},{w:"ROBOT",e:"🤖"},
        {w:"ZEBRA",e:"🦓"},{w:"BEE",e:"🐝"},{w:"CAT",e:"🐱"},{w:"BAT",e:"🦇"},{w:"VAN",e:"🚐"}],
 words:[{w:"CAN",e:"🥫",h:"a tin"},{w:"SEE",e:"👀",h:"with your eyes"},
        {w:"HAT",e:"🎩",h:"it goes on your head"},{w:"MAN",e:"🧍",h:"a grown-up"},
        {w:"MAP",e:"🗺️",h:"it shows the way"},{w:"RAN",e:"🏃",h:"the man ran"},
        {w:"ZAP",e:"⚡",h:"a flash of lightning"},{w:"BEE",e:"🐝",h:"it makes honey"}],
 family:[{w:"CAN",e:"🥫"},{w:"FAN",e:"🌀"},{w:"MAN",e:"🧍"},{w:"PAN",e:"🍳"},
         {w:"RAN",e:"🏃"},{w:"VAN",e:"🚐"}],
 hfw:[{w:"SEE",s:"I can see the sea."},{w:"THE",s:"The man ran."},
      {w:"CAN",s:"I can see a bee."},{w:"MAN",s:"The man has a map."}],
 sentences:[{s:["I","CAN","SEE","THE","BEE"], e:"🐝"},
            {s:["THE","MAN","CAN","SEE","A","VAN"], e:"🚐"},
            {s:["SAM","RAN","TO","THE","TREE"], e:"🌳"}],
 plan:["sound","hunt","write:l","machine","blend","spell","sight","sentence","readLine","write:u"],
 story:{t:"The Light at the Top", art:"🗼✨",
  lines:["The lighthouse leaned out over a dark, wide sea.",
         "Zib emptied the bag: *N*, *P*, *H*, *R*, *Z* and *E*.",
         "The lamp lit. Across the water, sentences appeared.",
         "'*The* *man* *ran*,' read Sam — every word, all by himself."]}}
];

/* ════════════════════════════════════════════════════════════
   THE TWELVE MAPS
   ------------------------------------------------------------
   Maps 3–12 carry their real letters from the Reading Eggs
   scope and sequence. Write ten places into `nodes` and drop
   `soon`, and the picker, the trail and the storybook all pick
   the new map up on their own.
   ════════════════════════════════════════════════════════════ */
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
  focus:"v d j o q", extra:"-ad, -is and -on words", soon:true},

 {no:4, name:"The Glass Desert", art:"🏜️", level:"Level 1 · Starting Out",
  lessons:"Lessons 31–40", grad:"linear-gradient(135deg,#E8B04B,#A66F16)",
  focus:"g l k y x w", extra:"-am, -at, -an, -ag, -ad", soon:true},

 {no:5, name:"The Singing Caves", art:"🕳️", level:"Level 2 · Beginning to Read",
  lessons:"Lessons 41–50", grad:"linear-gradient(135deg,#7FB77E,#3D6B3C)",
  focus:"u · the whole alphabet", extra:"-id, -ix, -it, -ig, -ip, -ill, -ing", soon:true},

 {no:6, name:"Frost Harbour", art:"⚓", level:"Level 2 · Beginning to Read",
  lessons:"Lessons 51–60", grad:"linear-gradient(135deg,#6FA8D1,#2F5F82)",
  focus:"short o", extra:"-ot, -og, -op, -od, -ock", soon:true},

 {no:7, name:"The Rumbling Road", art:"🛻", level:"Level 2 · Beginning to Read",
  lessons:"Lessons 61–70", grad:"linear-gradient(135deg,#C88BC4,#7A4276)",
  focus:"short u", extra:"-ut, -up, -un, -ug, -uck, -us", soon:true},

 {no:8, name:"Ember Hollow", art:"🔥", level:"Level 2 · Beginning to Read",
  lessons:"Lessons 71–80", grad:"linear-gradient(135deg,#E07A5F,#98402A)",
  focus:"short e", extra:"-ed, -en, -et, -eg, -ell", soon:true},

 {no:9, name:"The Whispering Wood", art:"🌲", level:"Level 3 · Building Confidence",
  lessons:"Lessons 81–90", grad:"linear-gradient(135deg,#5FA37E,#27604A)",
  focus:"sh ch th · long i", extra:"-ie, -ile, -ine, -ike", soon:true},

 {no:10, name:"The Mirror Lake", art:"🪞", level:"Level 3 · Building Confidence",
  lessons:"Lessons 91–100", grad:"linear-gradient(135deg,#7FC7D9,#2E7A90)",
  focus:"soft c · soft g · long a", extra:"-ice, -ake, -ane, -ace, y on the end", soon:true},

 {no:11, name:"The Deep Blue", art:"🐋", level:"Level 3 · Building Confidence",
  lessons:"Lessons 101–110", grad:"linear-gradient(135deg,#4E7FD1,#22406F)",
  focus:"oo · ea · er · long o and u", extra:"first blends", soon:true},

 {no:12, name:"The Last Lighthouse", art:"🌅", level:"Level 3 · Building Confidence",
  lessons:"Lessons 111–120", grad:"linear-gradient(135deg,#F0A868,#B04A2E)",
  focus:"oa ir igh or ay", extra:"start and end blends", soon:true}
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

/* The alphabet strip, for the "what comes next" activity */
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SOUND, MAPS, ALL_NODES, ALL_PICS, KEYWORD, LETTER_POOL };
}
