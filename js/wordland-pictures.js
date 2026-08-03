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

   Duplicate emoji across different words (🟫 for mat, muck,
   dirt and ground) are NOT fixed here. They are handled in the
   engine instead, which now refuses to put the same picture on
   two cards in one round — a structural fix rather than a
   hundred judgement calls about which word owns 🟫.
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
  "DAN","LAD","JILL","BILL"
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
  BILL: "___ has a big dog."
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

/* ════════════════════════════════════════════════════════════
   WHAT THE ENGINE ASKS
   ════════════════════════════════════════════════════════════ */

/* Can this word honestly be shown as a picture and identified
   from that picture alone? */
function hasPicture(w){
  return !NO_PICTURE.has(String(w || '').toUpperCase());
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

/* No two cards in one row may show the same emoji. 🟫 is mat,
   muck, dirt and ground; 🪑 is sat and sit; 🍯 is jam and hive.
   A child asked to pick "the mat" from two identical brown
   squares is being tested on luck.

   `keep` is the entry that must survive — the right answer.   */
function distinctPics(list, keep){
  const seen = new Set();
  const out = [];
  const take = v => {
    if(!v) return;
    const e = v.e || '';
    if(e && seen.has(e)) return;
    if(e) seen.add(e);
    out.push(v);
  };
  take(keep);
  list.forEach(v => { if(!keep || v.w !== keep.w) take(v) });
  return out;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NO_PICTURE, FRAME, FIX_EMOJI,
                     hasPicture, frameFor, frameSpoken,
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
