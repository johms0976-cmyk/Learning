/* ============================================================
   WORD LAND · PICTURES AND FRAMES
   ------------------------------------------------------------
   Loads AFTER wordland-data.js and BEFORE wordland.js.

   wordland-data.js is generated. Nothing here edits it — this
   file sits on top and corrects three separate problems, all of
   which come from the same root cause: an emoji is a picture of
   a THING, and a lot of the words a child has to read are not
   things.

   1. NO_PICTURE
      Words that cannot honestly be drawn. "at", "sat", "is",
      "the", "was". Every one of them currently carries an emoji
      that names a DIFFERENT word — 🎯 is a dartboard, 🪑 is a
      chair, 🟰 is an equals sign. A child shown 🪑 and asked to
      spell it will reach for c-h-a-i-r, and they will be right
      to. These words are barred from every activity where a
      picture has to be identified, and given a sentence frame
      in the activities where the child builds the word.

   2. FRAME
      What replaces the picture. A function word only means
      anything inside a sentence, which is also how it is
      actually taught: "The cat ___ on the mat." The frame is
      read aloud with the word in place, then shown with the
      gap, which is the standard cloze routine.

   3. FIX_EMOJI
      Pictures that name the wrong thing and CAN be fixed.
      🧿 is a nazar amulet, not a rug. 🪞 is a mirror, not a
      step. 🐾 is a paw print, not a vet.

   4. PICTURE
      Where emoji cannot tell two words apart, a drawn picture
      can. BREAD and TOAST are both 🍞; one of them now has an
      SVG. A word listed in PICTURE shows its drawing, a word
      not listed shows its emoji. That is the whole rule, and
      it is what lets the set be filled in twenty-five at a
      time without breaking anything in between.

   Duplicate emoji that are NOT worth a drawing (🟫 for mat,
   muck, dirt and ground) are handled in the engine instead,
   which refuses to put the same picture on two cards in one
   round — a structural fix rather than a hundred judgement
   calls about which word owns 🟫.
   ============================================================ */

/* ── 1. words with no honest picture ─────────────────────────
   Grouped by why, because the reason matters if you ever want
   to argue with one of them.                                  */
const NO_PICTURE = new Set([

  /* determiners, pronouns, auxiliaries — nothing to point at */
  "A","AN","I","THE","THIS","THAT","THESE","THOSE","THEN","THEM","THEY",
  "THERE","HE","HIM","HIS","SHE","HER","WE","US","ME","MY","MINE","YOU",
  "YOUR","OUR","IT","ITS",
  "IS","AS","AM","ARE","WAS","WERE","BE","BEEN","HAS","HAD","HAVE",
  "DO","DOES","DID","WILL","COULD","WOULD","SHOULD",
  /* "can" is left out on purpose: the tin is an honest picture of it,
     and 🥫 is what the data already carries. */

  /* prepositions and connectives — relations, not objects */
  "AT","ON","IN","INTO","TO","TOO","OF","OFF","UP","DOWN","BY","WITH",
  "FOR","OUT","AND","BUT","SO","OR","IF","JUST","AWAY","HERE","OVER",
  "AFTER","ALL","SOME","MORE","VERY","EVERY","LITTLE","NOT","NO","YES",

  /* question words */
  "WHO","WHAT","WHEN","WHERE","WHY","HOW",

  /* verbs whose emoji names the object, not the action */
  "SAT","PAT","SAID","SAY","COME","WENT","GO","GOT","TOOK","TAKE","GET",
  "PUT","SET","LET","TELL","SELL","MAKE","BAKE","NEED","LIKE","WAKE",
  "WOKE","SEE","HEAR","READ","WEAR","FILL","FELL","DIE","LIT","LED",
  "FED","FEED","DINE","SOAK","WET","STIR","GRAB","CLING","STUCK","THINK",
  "CAUGHT","RIP","BIT","STAY","DRANK","AWAKE","BLINK","CREEP",

  /* adjectives and abstractions with a stand-in picture */
  "FAT","MAT","MUCK","TAN","LOT","LOTS","FULL","EMPTY","THIN","THICK",
  "SHORT","WIDE","FINE","DRY","BEST","BETTER","RIGHT","SORT","HIP",
  "WAY","MILE","BOSSY","MESSY","RUSTY","CREEPY","PROP","TUCK","RUG",
  "HIVE","GILL","STEP",

  /* people who are names, not types */
  "DAN","LAD","JILL","BILL",

  /* ── batch 1 ──────────────────────────────────────────────
     RUN and RAN are the same picture in two tenses; TIN and CAN
     are the same object in British English; DIP and WAG are
     actions whose emoji names the thing being dipped or wagged.
     These belong with SAT and PAT.                            */
  "RUN","TIN","DIP","WAG",

  /* ── batch 2 · maps 7 and 8 ───────────────────────────────
     Where the word lists stop being things and start being what
     you DO with things. A picture of a foot beside a ball is a
     picture of a ball; the child says "ball" and is marked wrong
     for reading correctly.                                     */

  /* verbs whose picture names the object or the tense */
  "JOG","POP","PLAY","HOPS","EAT","SLEEP","KICK","TUG","DUG",
  "CRACKING","JUMPING","WED",

  /* adjectives with a stand-in picture */
  "HOT","MUDDY",

  /* words that are a synonym of a word already pictured */
  "LADY",   /* = WOMAN */
  "PUP",    /* = PUPPY */
  "PET",    /* the child says "cat" or "dog", and is right */
  "BET",

  /* ── batch 3 · maps 8 to 10 ───────────────────────────────  */

  /* verbs whose picture names the object */
  "PECK","SMELL","HIDE","SHUT","BITE","BARK","BENT",

  /* adjectives and abstractions */
  "COLD","SITE","TIME","MAGIC","SMILE",

  /* exact synonyms of a word that already owns the picture */
  "CHICKEN",   /* = HEN */
  "BICYCLE",   /* = BIKE */

  /* ── batch 4 · map 11 ─────────────────────────────────────
     Where the adjectives arrive. Every one of them carried the
     emoji of the NOUN it usually describes: ITCHY was 🐜, an
     ant; FLOPPY was 🐰, a rabbit; CRUNCHY was 🥕, a carrot.
     Same root cause as SAT and PAT, one map later.            */

  /* adjectives whose emoji names the noun */
  "ITCHY","FLOPPY","HAIRY","CRUNCHY","PRETTY","BIGGER",

  /* verbs and past tenses */
  "RODE","SLAM","SWAM","FLASH","CRASH",

  /* abstractions */
  "PLACE","LIFE","JOKE","JUNE","NOTE",

  /* exact synonyms of a word that already owns the picture */
  "WOOL",      /* = YARN */
  "STONE",     /* = ROCK */
  "TRASH",     /* = GARBAGE */
  "DUKE",      /* would be the same drawing as KING */
  "CLEANER",   /* a person or a spray? the emoji is a sponge */

  /* ── batch 5 · map 12 ─────────────────────────────────────
     Almost entirely verbs and -ight words.                    */

  /* verbs and sounds */
  "SLIP","THUMP","BUMP","ROAR","CHEW","SWOOP","LEAP","ROLL","SHOUT","SLAP",

  /* adjectives and abstractions */
  "TIGHT","HIGH","SIGHT","SPORT","STARLIGHT","SUNDAY","TODAY",

  /* too close to a word already pictured */
  "LUMP",    /* = ROCK */
  "COAST",   /* = BEACH, drawn in batch 4 */
  "BAY",     /* = BEACH, drawn in batch 4 */
  "DIRT"     /* brown, like GROUND and MUD — a three-way tie no
                drawing wins */
]);

/* ── 2. sentence frames ──────────────────────────────────────
   One line, one gap, marked ___. Kept inside the child's own
   vocabulary and, wherever possible, inside the sound they have
   already been taught. Read aloud whole, shown with the gap.

   A word with no frame here falls back to its `h` hint and the
   speaker button, which is still better than a wrong picture.  */
const FRAME = {
  /* Map 1 — the -at family and the first sight words */
  AM:   "I ___ Sam.",
  AT:   "The cat is ___ the mat.",
  SAT:  "The cat ___ on the mat.",
  FAT:  "The pig is ___ .",
  MAT:  "Wipe your feet on the ___ .",
  PAT:  "Give the dog a ___ .",
  A:    "___ cat sat.",
  I:    "___ am here.",

  /* pronouns and the verb to be */
  IS:   "The sun ___ hot.",
  AS:   "He is ___ big ___ me.",
  IT:   "___ is my hat.",
  HE:   "___ has a red cap.",
  HIM:  "I can see ___ .",
  HIS:  "That is ___ dog.",
  SHE:  "___ has a big hat.",
  HER:  "That is ___ bag.",
  WE:   "___ can run fast.",
  US:   "Come with ___ .",
  ME:   "Look at ___ !",
  MY:   "That is ___ pen.",
  MINE: "That hat is ___ .",
  YOU:  "Can ___ see it?",
  THEY: "___ ran to the tree.",
  THEM: "I can see ___ .",
  BE:   "I will ___ good.",
  ARE:  "You ___ my friend.",
  WAS:  "It ___ hot.",
  HAS:  "The dog ___ a bone.",
  HAD:  "He ___ a red cap.",
  HAVE: "I ___ a dog.",

  /* determiners and connectives */
  THE:  "___ cat sat down.",
  THIS: "___ is my hat.",
  THAT: "___ is your bag.",
  THEN: "We ran, ___ we sat.",
  THERE:"Put it ___ .",
  AND:  "A cat ___ a rat.",
  BUT:  "I ran, ___ I fell.",
  ON:   "The cat is ___ the mat.",
  IN:   "The pen is ___ my bag.",
  INTO: "He ran ___ the tent.",
  TO:   "I ran ___ the tree.",
  UP:   "The sun is ___ .",
  DOWN: "Sit ___ here.",
  BY:   "Sit ___ me.",
  OF:   "A cup ___ milk.",
  OFF:  "Take it ___ .",
  ALL:  "I ate it ___ .",
  NOT:  "It is ___ hot.",
  NO:   "___ , not that one.",
  YES:  "___ , I can do it!",
  AWAY: "The bird flew ___ .",
  HERE: "Come ___ , please.",
  JUST: "I ___ got here.",
  SOME: "Can I have ___ ?",
  VERY: "It is ___ big.",
  LITTLE:"A ___ red hat.",

  /* question words */
  WHO:  "___ is at the door?",
  WHAT: "___ is in the bag?",
  WHEN: "___ can we go?",
  WHERE:"___ is my hat?",
  WHY:  "___ is it wet?",

  /* verbs */
  DO:   "___ you like it?",
  DID:  "___ you see it?",
  GO:   "Let's ___ home.",
  GOT:  "I ___ a new pen.",
  COME: "___ and see this.",
  WENT: "We ___ to the shop.",
  SAID: "'Hello,' ___ Sam.",
  TOOK: "He ___ my hat.",
  TAKE: "___ one, please.",
  GET:  "I will ___ the ball.",
  PUT:  "___ it in the bag.",
  SET:  "___ it down here.",
  LET:  "___ me help you.",
  TELL: "___ me the story.",
  SELL: "They ___ hot buns.",
  MAKE: "I can ___ a hat.",
  BAKE: "We can ___ a cake.",
  NEED: "I ___ my bag.",
  LIKE: "I ___ my dog.",
  WAKE: "___ up, sleepy!",
  WOKE: "The dog ___ me up.",
  SEE:  "I can ___ the moon.",
  HEAR: "I can ___ a bee.",
  READ: "I can ___ this book.",
  WEAR: "I ___ a red cap.",
  FILL: "___ the cup up.",
  FELL: "He ___ off the log.",
  LIT:  "She ___ the lamp.",
  LED:  "He ___ us home.",
  FED:  "I ___ the duck.",
  FEED: "Let's ___ the hen.",
  SOAK: "The rain will ___ us.",
  WET:  "My socks are ___ .",
  STIR: "___ it with a spoon.",
  GRAB: "___ the rope!",
  CLING:"The kid will ___ on.",
  STUCK:"The cat got ___ .",
  THINK:"I ___ it is fun.",
  CAUGHT:"He ___ the ball.",
  RIP:  "Don't ___ the page.",
  BIT:  "The dog ___ the bone.",
  STAY: "___ here with me.",
  DRANK:"He ___ his milk.",
  AWAKE:"The baby is ___ .",
  BLINK:"Don't ___ !",
  CREEP:"The cat will ___ up.",
  DIE:  "The plant will ___ .",
  DINE: "We ___ at six.",

  /* adjectives and abstractions */
  LOT:  "I have a ___ of pens.",
  LOTS: "___ of cats!",
  FULL: "My cup is ___ .",
  EMPTY:"The box is ___ .",
  THIN: "The stick is ___ .",
  THICK:"The book is ___ .",
  SHORT:"My hair is ___ .",
  WIDE: "The road is ___ .",
  FINE: "I feel ___ , thanks.",
  DRY:  "My socks are ___ now.",
  BEST: "You are the ___ !",
  BETTER:"This one is ___ .",
  RIGHT:"You got it ___ !",
  SORT: "Let's ___ the socks.",
  HIP:  "I hurt my ___ .",
  WAY:  "This ___ , please.",
  MILE: "We ran a ___ .",
  BOSSY:"Don't be so ___ .",
  MESSY:"My room is ___ .",
  RUSTY:"The old nail is ___ .",
  CREEPY:"That web is ___ .",
  PROP: "___ up the tent.",
  TUCK: "___ me into bed.",
  TAN:  "The dog is ___ .",
  RUG:  "The cat sat on the ___ .",
  HIVE: "Bees live in a ___ .",
  GILL: "A fish has a ___ .",
  STEP: "Mind the top ___ .",

  /* names */
  WILL: "I ___ help you.",
  MUCK: "The pig sat in the ___ .",

  DAN:  "___ is my friend.",
  LAD:  "The ___ ran fast.",
  JILL: "Jack and ___ ran up.",
  BILL: "___ has a big dog.",

  /* ── batch 1 ─────────────────────────────────────────────  */
  RUN:  "I can ___ very fast.",
  TIN:  "There is a ___ of beans.",
  DIP:  "I ___ my toast in the egg.",
  WAG:  "Dogs ___ their tails.",

  /* ── batch 2 · maps 7 and 8 ──────────────────────────────  */
  JOG:      "We ___ around the park.",
  POP:      "The balloons ___ with a bang.",
  PLAY:     "I ___ with my friends.",
  HOPS:     "The rabbit ___ over the log.",
  EAT:      "We ___ our tea at six.",
  SLEEP:    "I ___ in my bed at night.",
  KICK:     "I ___ the ball to Sam.",
  TUG:      "Do not ___ on the lead.",
  DUG:      "The dog ___ a big hole.",
  CRACKING: "The ice is ___ under my feet.",
  JUMPING:  "The frog is ___ away.",
  WED:      "They will ___ in the summer.",
  HOT:      "The sun is very ___ today.",
  MUDDY:    "My boots are ___ .",
  LADY:     "A kind ___ helped me.",
  PUP:      "Our ___ is only six weeks old.",
  PET:      "I have a ___ at home.",
  BET:      "I ___ you cannot catch me.",

  /* ── batch 3 · maps 8 to 10 ──────────────────────────────  */
  PECK:    "The hen will ___ at the corn.",
  SMELL:   "I can ___ the bread baking.",
  HIDE:    "Let us ___ behind the tree.",
  SHUT:    "Please ___ the gate.",
  BITE:    "Take a big ___ of the apple.",
  BARK:    "The dogs ___ at the postman.",
  BENT:    "The nail is all ___ .",
  COLD:    "My hands are ___ .",
  SITE:    "They are building on that ___ .",
  TIME:    "What ___ is it?",
  MAGIC:   "The trick was pure ___ .",
  SMILE:   "You have a lovely ___ .",
  CHICKEN: "The ___ laid an egg.",
  BICYCLE: "I ride my ___ to school.",

  /* ── batch 4 · map 11 ────────────────────────────────────  */
  ITCHY:   "My jumper is so ___ .",
  FLOPPY:  "The rabbit has ___ ears.",
  HAIRY:   "That dog is very ___ .",
  CRUNCHY: "The carrot is nice and ___ .",
  PRETTY:  "What a ___ flower.",
  BIGGER:  "An elephant is ___ than a mouse.",
  RODE:    "I ___ my bike to the park.",
  SLAM:    "Do not ___ the door.",
  SWAM:    "We ___ all the way across.",
  FLASH:   "I saw a ___ of light.",
  CRASH:   "The bins fell over with a ___ .",
  PLACE:   "This is a good ___ to sit.",
  LIFE:    "A frog has a strange ___ .",
  JOKE:    "Sam told me a funny ___ .",
  JUNE:    "My birthday is in ___ .",
  NOTE:    "She sang one high ___ .",
  WOOL:    "The jumper is made of ___ .",
  STONE:   "I threw a ___ in the pond.",
  TRASH:   "Put the ___ in the bin.",
  DUKE:    "The ___ lives in a castle.",
  CLEANER: "The ___ mopped the floor.",

  /* ── batch 5 · map 12 ────────────────────────────────────  */
  SLIP:      "Do not ___ on the ice.",
  THUMP:     "I heard a loud ___ upstairs.",
  BUMP:      "Mind you do not ___ your head.",
  ROAR:      "Lions ___ when they are cross.",
  CHEW:      "You must ___ your food.",
  SWOOP:     "The birds ___ down to the water.",
  LEAP:      "Watch me ___ over the puddle.",
  ROLL:      "Let the ball ___ down the hill.",
  SHOUT:     "Do not ___ indoors.",
  SLAP:      "That was a hard ___ .",
  TIGHT:     "This knot is very ___ .",
  HIGH:      "The kite went up so ___ .",
  SIGHT:     "My gran has poor ___ .",
  SPORT:     "Football is my best ___ .",
  STARLIGHT: "We walked home by ___ .",
  SUNDAY:    "We have a roast on ___ .",
  TODAY:     "What shall we do ___ ?",
  LUMP:      "There is a ___ in my sock.",
  COAST:     "We drove along the ___ .",
  BAY:       "The boats sit in the ___ .",
  DIRT:      "My hands are covered in ___ ."
};

/* ── 3. pictures that named the wrong thing ──────────────────
   Only where a better emoji genuinely exists. Where one does
   not, the word goes in NO_PICTURE above instead of limping
   along with a picture that lies.                             */
const FIX_EMOJI = {
  STEP: "🪜",   // was 🪞, a mirror
  VET:  "👨‍⚕️",   // was 🐾, a paw print
  HEAD: "👤",   // was 🗣️, a speech bubble
  ZOO:  "🦁",   // was 🎪, a circus tent
  RUG:  "🧶",   // was 🧿, a nazar amulet
  HIVE: "🐝",   // was 🍯, the same jar as JAM
  SEED: "🌰",   // was 🌱, which is a sprout — the thing after
  MOP:  "🧽",   // was 🧹, a broom
  TOY:  "🪀",   // was 🧸, which reads as "bear"
  GILL: "🐠",   // was 🐟, the whole fish
  HAIR: "💇",   // unchanged, kept here as the row it belongs to
  BOSSY:"😤"    // was 🗣️
};

/* ── 4. drawings ─────────────────────────────────────────────
   Where emoji cannot tell two words apart, a drawn picture can.
   The keeper of each shared emoji is named in the comment, so
   it is obvious what the drawing is there to distinguish.

   A word listed here shows its SVG. A word not listed here
   shows its emoji. That is the whole rule.

   Two words may point at the same file — FATHER at dad.svg,
   LACE at shoelace.svg — because they are the same object, and
   drawing a near-duplicate would only make a harder coin toss.
   distinctPics() keys on the file, so a pair like that can
   never turn up on the same row.                              */
const PICTURE = {

  /* batch 1 — the earliest-taught collisions, maps 1 to 6 */
  BREAD:     'img/pics/bread.svg',      // shared 🍞 with TOAST
  BUN:       'img/pics/bun.svg',        // shared 🍞 with TOAST
  PEN:       'img/pics/pen.svg',        // shared 🖊️ with INK
  PEANUT:    'img/pics/peanut.svg',     // shared 🥜 with NUT
  HOLE:      'img/pics/hole.svg',       // shared 🕳️ with PIT
  ZIGZAG:    'img/pics/zigzag.svg',     // shared ⚡ with ZAP
  KNEE:      'img/pics/knee.svg',       // shared 🦵 with LAP
  SHEEP:     'img/pics/sheep.svg',      // shared 🐑 with LAMB
  TEEPEE:    'img/pics/teepee.svg',     // shared ⛺ with TENT
  DAD:       'img/pics/dad.svg',        // shared 👨 with MAN
  LIZARD:    'img/pics/lizard.svg',     // shared 🦎 with IGUANA
  LADYBUG:   'img/pics/ladybug.svg',    // shared 🐞 with INSECT
  KING:      'img/pics/king.svg',       // shared 👑 with QUEEN
  YACHT:     'img/pics/yacht.svg',      // shared ⛵ with BOAT
  YOLK:      'img/pics/yolk.svg',       // shared 🍳 with PAN
  EXIT:      'img/pics/exit.svg',       // shared 🚪 with DOOR
  WOMAN:     'img/pics/woman.svg',      // shared 👩 with MUM
  BIN:       'img/pics/bin.svg',        // shared 🗑️ with GARBAGE
  LID:       'img/pics/lid.svg',        // shared 🫙 with JAR
  FIN:       'img/pics/fin.svg',        // shared 🐬 with DOLPHIN
  DRIP:      'img/pics/drip.svg',       // shared 💧 with WATER
  WING:      'img/pics/wing.svg',       // shared 🪶 with FEATHER
  ICE:       'img/pics/ice.svg',        // shared 🧊 with IGLOO
  COT:       'img/pics/cot.svg',        // shared 🛏️ with QUILT
  MOP:       'img/pics/mop.svg',        // had 🧽, a sponge; before that 🧹, a broom

  /* batch 2 — maps 6 to 8 */
  PINK:      'img/pics/pink.svg',       // shared 🌸 with FLOWER
  DOT:       'img/pics/dot.svg',        // shared ⚫ with BLACK
  DOTS:      'img/pics/dots.svg',       // shared ⚫ with BLACK
  COTS:      'img/pics/cots.svg',       // shared 🛏️ with QUILT
  POTS:      'img/pics/pots.svg',       // shared 🍲 with POT
  TOPS:      'img/pics/tops.svg',       // shared 🔝 with TOP
  SAIL:      'img/pics/sail.svg',       // shared ⛵ with BOAT
  GAME:      'img/pics/game.svg',       // shared 🎲 with DICE
  COD:       'img/pics/cod.svg',        // shared 🐟 with FISH
  POD:       'img/pics/pod.svg',        // shared 🫛 with PEA
  BOXES:     'img/pics/boxes.svg',      // shared 📦 with BOX
  TUB:       'img/pics/tub.svg',        // shared 🛁 with BATH
  PUDDLE:    'img/pics/puddle.svg',     // shared 💧 with WATER
  BRANCH:    'img/pics/branch.svg',     // shared 🌿 with WEED
  MOUNTAIN:  'img/pics/mountain.svg',   // shared ⛰️ with HILL
  MOUTH:     'img/pics/mouth.svg',      // shared 👄 with LIP
  LEG:       'img/pics/leg.svg',        // shared 🦵 with LAP
  LEGS:      'img/pics/legs.svg',       // shared 🦵 with LAP
  PEOPLE:    'img/pics/people.svg',     // shared 🧑‍🤝‍🧑 with QUEUE
  TABLE:     'img/pics/table.svg',      // shared 🪑 with SIT
  FOOD:      'img/pics/food.svg',       // shared 🍲 with POT
  BED:       'img/pics/bed.svg',        // shared 🛏️ with QUILT
  DEN:       'img/pics/den.svg',        // shared 🕳️ with PIT
  ELEPHANT:  'img/pics/elephant.svg',   // shared 🐘 with BIG
  CLIFF:     'img/pics/cliff.svg',      // shared 🧗 with CLIMB

  /* batch 3 — maps 8 to 10 */
  KEG:       'img/pics/keg.svg',        // shared 🛢️ with OIL
  TAIL:      'img/pics/tail.svg',       // shared 🌀 with FAN
  CLAWS:     'img/pics/claws.svg',      // shared 🐾 with VET
  COIN:      'img/pics/coin.svg',       // shared 🪙 with QUARTER
  PARTY:     'img/pics/party.svg',      // shared 🎉 with FUN
  PLUM:      'img/pics/plum.svg',       // shared 🍇 with GRAPE
  MOTHER:    'img/pics/mother.svg',     // shared 👩 with MUM
  BROTHER:   'img/pics/brother.svg',    // shared 👦 with SAM
  PINE:      'img/pics/pine.svg',       // shared 🌲 with FOREST
  SLIDE:     'img/pics/slide.svg',      // shared 🛝 with PLAYGROUND
  SHIRT:     'img/pics/shirt.svg',      // shared 👕 with FIT
  BOOTS:     'img/pics/boots.svg',      // shared 🥾 with HIKE
  CHIMP:     'img/pics/chimp.svg',      // shared 🐒 with MONKEY
  CHICK:     'img/pics/chick.svg',      // shared 🐤 with QUAIL
  CHEST:     'img/pics/chest.svg',      // shared 🧰 with KIT
  CHIP:      'img/pics/chip.svg',       // shared 🍟 with CHIPS
  CUPBOARD:  'img/pics/cupboard.svg',   // shared 🚪 with DOOR
  FRIDGE:    'img/pics/fridge.svg',     // shared 🧊 with IGLOO
  CIRCUS:    'img/pics/circus.svg',     // shared 🎪 with ZOO
  PARK:      'img/pics/park.svg',       // shared 🌳 with TREE
  MICE:      'img/pics/mice.svg',       // shared 🐭 with MOUSE
  SHOELACE:  'img/pics/shoelace.svg',   // shared 🎀 with LACES
  CAGE:      'img/pics/cage.svg',       // shared 🔒 with LOCK
  RAKE:      'img/pics/rake.svg',       // shared 🧹 with MOP
  CAKE:      'img/pics/cake.svg',       // shared 🍰 with SLICE
  FATHER:    'img/pics/dad.svg',        // FATHER is DAD — same man, same drawing

  /* batch 4 — maps 10 to 11 */
  PLANE:     'img/pics/plane.svg',      // shared ✈️ with JET
  BOWL:      'img/pics/bowl.svg',       // shared 🥣 with MIX
  LANE:      'img/pics/lane.svg',       // shared 🛣️ with ROAD
  FACE:      'img/pics/face.svg',       // shared 😀 with HAPPY
  CLOUD:     'img/pics/cloud.svg',      // shared ☁️ with FLUFF
  CLOUDS:    'img/pics/clouds.svg',     // shared ☁️ with FLUFF
  PHOTO:     'img/pics/photo.svg',      // shared 📷 with CAMERA
  CUBE:      'img/pics/cube.svg',       // shared 🧊 with IGLOO
  STRAW:     'img/pics/straw.svg',      // shared 🥤 with SIP
  PRAM:      'img/pics/pram.svg',       // shared 🛒 with WAGON
  PAPER:     'img/pics/paper.svg',      // shared 📄 with PAGE
  CREAM:     'img/pics/cream.svg',      // shared 🍦 with YOGURT
  BABOON:    'img/pics/baboon.svg',     // shared 🐒 with MONKEY
  ROOF:      'img/pics/roof.svg',       // shared 🏠 with KENNEL
  COCOON:    'img/pics/cocoon.svg',     // shared 🐛 with BUG
  POOL:      'img/pics/pool.svg',       // shared 🏊 with SWIM
  WOMBAT:    'img/pics/wombat.svg',     // shared 🐨 with KOALA
  TADPOLE:   'img/pics/tadpole.svg',    // shared 🐸 with FROG
  SEAWEED:   'img/pics/seaweed.svg',    // shared 🌿 with WEED
  SLUG:      'img/pics/slug.svg',       // shared 🐌 with SNAIL
  LUNCH:     'img/pics/lunch.svg',      // shared 🥪 with SANDWICH
  TRUNK:     'img/pics/trunk.svg',      // shared 🪵 with LOG
  BEACH:     'img/pics/beach.svg',      // shared 🏖️ with SAND
  HEDGEHOG:  'img/pics/hedgehog.svg',   // shared 🦔 with MOLE
  GARDEN:    'img/pics/garden.svg',     // shared 🌷 with BUD
  LACE:      'img/pics/shoelace.svg',   // LACE is one of LACES — same object

  /* batch 5 — map 12 */
  CRACK:     'img/pics/crack.svg',      // shared 🥚 with EGG
  DRINK:     'img/pics/drink.svg',      // shared 🥛 with MILK
  HOME:      'img/pics/home.svg',       // shared 🏠 with KENNEL
  CLOTHES:   'img/pics/clothes.svg',    // shared 👕 with FIT
  GOLD:      'img/pics/gold.svg',       // shared 🪙 with QUARTER
  GIFT:      'img/pics/gift.svg',       // shared 🎁 with UNWRAP
  STAMP:     'img/pics/stamp.svg',      // shared 📮 with SENT
  SEEDLING:  'img/pics/seedling.svg',   // shared 🌱 with SEED
  SKIRT:     'img/pics/skirt.svg',      // shared 👗 with DRESS
  GIRL:      'img/pics/girl.svg',       // shared 👧 with SISTER
  WATERFALL: 'img/pics/waterfall.svg',  // shared 🏞️ with LAKE
  NIGHT:     'img/pics/night.svg',      // shared 🌃 with SKY
  SANDPIT:   'img/pics/sandpit.svg',    // shared 🏖️ with SAND
  SWING:     'img/pics/swing.svg',      // shared 🛝 with PLAYGROUND
  LION:      'img/pics/lion.svg',       // shared 🦁 with MANE
  JUMPER:    'img/pics/jumper.svg',     // shared 🧥 with COAT
  STORK:     'img/pics/stork.svg',      // shared 🕊️ with SEAGULL
  CLAY:      'img/pics/clay.svg'        // shared 🏺 with VASE
};

/* ── notes kept from the batches ─────────────────────────────
   The plurals. COTS, DOTS, POTS, TOPS and BOXES are drawn as
   more than one of the thing, and that is the entire point of
   them: the singular keeps the emoji, the plural gets a picture
   with a countable number in it, and the -s is doing visible
   work. CHIP, MICE and SHOELACE run the same convention the
   other way round — whichever of the pair is NOT the earliest
   taught gets the drawing, and the number in the picture is the
   thing the child is being asked to notice.

   The monkey family is three deep. MONKEY keeps 🐒, CHIMP and
   BABOON are drawn. They are told apart the way a book would
   tell them apart — the chimp has big ears and no tail, the
   baboon has the long dog-like muzzle — so a row containing all
   three is a fair question rather than a coin toss.

   What is left is the OTHER half of the original problem: words
   whose emoji is unique but still wrong, like MOP was before
   any of this started. Those were never in the collision queue
   because nothing else was competing for the picture. Running
   an eye down img/pics/index.html beside the game is the way to
   find them, one at a time, as they turn up in play.          */

/* ════════════════════════════════════════════════════════════
   WHAT THE ENGINE ASKS
   ════════════════════════════════════════════════════════════ */

/* Can this word honestly be shown as a picture and identified
   from that picture alone? */
function hasPicture(w){
  return !NO_PICTURE.has(String(w || '').toUpperCase());
}

/* The drawing for a word, or null if it still uses its emoji. */
function pictureFor(w){
  return PICTURE[String(w || '').toUpperCase()] || null;
}

/* What identifies this word's picture, for telling two cards
   apart. distinctPics() keys on this rather than on v.e, so a
   drawn BREAD and an emoji TOAST no longer count as the same
   picture — which they did while both were 🍞.                */
function picKey(v){
  if(!v) return '';
  return pictureFor(v.w) || v.e || '';
}

/* The picture as markup, ready to drop into a card. Everything
   that currently prints v.e should call this instead.

   `cls` is for the odd place a picture sits inside a line of
   text rather than in a box of its own — the "like bread 🍞"
   hint. Pass 'inline' there; leave it off everywhere else.

   The alt is deliberately empty. The child is being asked to
   name the picture; a screen reader announcing "bread" would
   hand them the answer. The word is already on the card or in
   the audio for anyone who needs it.                          */
function pictureHTML(v, cls){
  const extra = cls ? ' ' + cls : '';
  const src = pictureFor(v && v.w);
  if(src) return '<img class="pic-img' + extra + '" src="' + src + '" alt="" draggable="false">';
  return '<span class="pic-emoji' + extra + '">' + ((v && v.e) || '') + '</span>';
}

/* The sentence frame, if there is one. Returns null rather than
   an empty string, so a caller can test it plainly. */
function frameFor(w){
  const W = String(w || '').toUpperCase();
  return FRAME[W] || null;
}

/* The frame with the word put back in, for reading aloud. */
function frameSpoken(w){
  const f = frameFor(w);
  if(!f) return null;
  return f.replace(/_{2,}/g, String(w).toLowerCase()).replace(/\s+([.,!?])/g, '$1');
}

/* Keep only the words that can carry a picture. If that leaves
   too few to build a row, hand back what we started with — a
   weak picture is bad, a round that will not build is worse.  */
function picturable(list, min){
  if(!Array.isArray(list)) return list;
  const ok = list.filter(v => v && hasPicture(v.w));
  return ok.length >= (min || 1) ? ok : list;
}

/* No two cards in one row may show the same picture. 🟫 is mat,
   muck, dirt and ground; 🪑 is sat and sit; 🍯 is jam and hive.
   A child asked to pick "the mat" from two identical brown
   squares is being tested on luck.

   Keyed on picKey(), not on v.e, so a drawn BREAD and an emoji
   TOAST count as two pictures, while FATHER and DAD — which
   share one file — correctly count as one.

   `keep` is the entry that must survive — the right answer.   */
function distinctPics(list, keep){
  const seen = new Set();
  const out = [];
  const take = v => {
    if(!v) return;
    const k = picKey(v);
    if(k && seen.has(k)) return;
    if(k) seen.add(k);
    out.push(v);
  };
  take(keep);
  list.forEach(v => { if(!keep || v.w !== keep.w) take(v) });
  return out;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NO_PICTURE, FRAME, FIX_EMOJI, PICTURE,
                     hasPicture, frameFor, frameSpoken,
                     pictureFor, picKey, pictureHTML,
                     picturable, distinctPics, applyPictureFixes };
}

/* ── apply the emoji corrections in place ────────────────────
   Runs once at load, before the engine reads anything, so the
   rest of the code never has to know this file exists.        */
function applyPictureFixes(){
  if(typeof ALL_NODES === 'undefined') return;
  const fix = v => { const e = FIX_EMOJI[String(v.w).toUpperCase()]; if(e) v.e = e };
  ALL_NODES.forEach(n => {
    [n.vocab, n.words, n.family].forEach(list => (list || []).forEach(fix));
  });
  if(typeof ALL_PICS !== 'undefined') ALL_PICS.forEach(fix);
  if(typeof KEYWORD !== 'undefined')
    Object.keys(KEYWORD).forEach(k => fix(KEYWORD[k]));
}
applyPictureFixes();
