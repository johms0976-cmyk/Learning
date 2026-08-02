/* ============================================================
   WORD LAND · READING
   ------------------------------------------------------------
   Loads AFTER wordland-data.js and BEFORE wordland.js.

   Everything here exists because of one number: the story
   chapters were 64% decodable. A chapter that says "tap any
   coloured word to hear it" is a listening text with a lookup
   button, and a child who taps every word is not reading. What
   turns taught sounds into reading is the child's own successful
   decoding of running text — that is where orthographic
   representations get built (Share's self-teaching hypothesis),
   and no amount of isolated word work substitutes for it.

   So this file adds a SECOND text per lesson: a short page,
   built at run time from exactly the graphemes and exactly the
   high-frequency words the child has already been taught. It is
   100% decodable by construction — it cannot drift out of step
   with the sequence, because it is generated from the sequence.

   The narrative chapter stays exactly as it is. The two texts
   do different jobs and should never have been the same object:
     chapter   language comprehension, read TO the child
     page      decoding practice, read BY the child

   Also here, because they are all about sounds rather than
   screens:
     phonFor()          which th is this, which y is this
     sayWordBlended()   continuous phonation: mmmaaat, not m-a-t
     reviewFor()        distributed retrieval of older material
     ARTIC              what to say when a child confuses b/d/p
   ============================================================ */

/* ── splitting a word into graphemes, not letters ────────────
   Moved here from wordland.js so the decodable-page builder and
   the engine can never disagree about what a grapheme is.
   Longest match first: IGH before I, CK before C.              */
const MULTI = ['IGH','TCH','SH','CH','TH','NG','CK','QU','WH','PH',
               'EE','OO','EA','ER','IR','UR','OR','AR','OA','OU','OW',
               'AY','AI','OI','OY','AW','LL','SS','FF','ZZ'];
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

/* ── which sound does an ambiguous grapheme make HERE? ───────
   TH is two phonemes. Y is three. Playing one recording for
   both jobs teaches the child that "thin" begins like "the",
   which is false. Given the grapheme and the word it sits in,
   return the entry that should actually be played.            */
const VOICED_TH = new Set(
  (typeof TH_VOICED !== 'undefined' && TH_VOICED) ||
  (typeof PHON !== 'undefined' && PHON.TH_VOICED) || [
  "THE","THIS","THAT","THESE","THOSE","THERE","THEIR","THEY","THEM","THEN",
  "THAN","THOUGH","THUS","MOTHER","FATHER","BROTHER","ANOTHER","OTHER",
  "TOGETHER","WEATHER","FEATHER","LEATHER","BATHE","BREATHE","CLOTHES",
  "SMOOTH","WITH","WITHOUT"]);

function phonFor(g, word, i, units){
  const W = String(word || '').toUpperCase();
  if(g === 'TH') return VOICED_TH.has(W) ? 'TH_V' : 'TH_U';
  if(g === 'Y'){
    /* y is a consonant at the front and a vowel at the end */
    if(i === 0) return 'Y';
    if(i === (units ? units.length - 1 : -1)){
      /* one beat of a word -> /igh/ (my, why, sky)
         more than one     -> /ee/  (happy, muddy)          */
      const beats = (units || splitGraphemes(W)).filter(u => /^(A|E|I|O|U|EE|OO|EA|OA|AI|AY|OU|OW|OI|OY|AR|OR|ER|IR|UR|AW|IGH|ALL)$/.test(u)).length;
      return beats >= 1 ? 'Y_E' : 'Y_I';
    }
    return 'Y';
  }
  if(g === 'EA'){
    const SHORT = ['BREAD','HEAD','FEATHER','WEATHER','LEATHER','DEAD','READY',
                   'HEAVY','MEADOW','SWEAT','BREATH','HEALTH','DEATH','INSTEAD'];
    return SHORT.includes(W) ? 'EA_E' : 'EA';
  }
  return g;
}
/* the entry to actually use, with the surface spelling intact */
function phonEntry(g, word, i, units){
  const key = phonFor(g, word, i, units);
  return (typeof PHON !== 'undefined' && (PHON[key] || PHON[g])) || null;
}

/* ── continuous phonation ────────────────────────────────────
   Gonzalez-Frey & Ehri (2021) compared segmented blending
   (/m/ … /a/ … /t/, then push together) with connected
   phonation (mmmaaat, never letting the sound drop). Connected
   phonation produced significantly better word reading. The
   difference costs nothing here: we already know from PHON
   which sounds can be held.

   Where every sound in the word is a continuant we run them
   together with no gap. Where a stop is involved we cannot —
   a stop cannot be held — so we shorten the gap instead and
   let the stop land on the vowel that follows it.             */
function blendPlan(word){
  const units = splitGraphemes(word);
  const kinds = units.map((u,i) => {
    const p = phonEntry(u, word, i, units);
    return p ? p.type : 'cont';
  });
  const allCont = kinds.every(k => k === 'cont' || k === 'vowel');
  return { units, kinds, allCont,
           gap: allCont ? 0 : 90,          // ms between sounds
           hold: allCont ? 420 : 260 };    // ms each sound is held
}
function sayWordBlended(word, done){
  const { units, gap, hold } = blendPlan(word);
  let i = 0;
  const step = () => {
    if(i >= units.length){
      /* say the whole word once, so the child hears what the
         stretched version was aiming at */
      setTimeout(() => { WLAudio.word(word); done && done() }, 240);
      return;
    }
    const k = phonFor(units[i], word, i, units);
    if(typeof saySound === 'function') saySound(k); else WLAudio.sound(k);
    i++;
    setTimeout(step, hold + gap);
  };
  step();
}

/* ── what to say when a child confuses two letters ───────────
   Second miss on the same item is the moment that matters. A
   glowing box teaches a child to wait for the glow. Telling
   them where their mouth goes teaches them the difference.
   These follow the Reading Eggs teacher notes.                */
const ARTIC = {
  B:"Lips together, then open — <b>/b/</b>. Your voice is on: feel your throat buzz.",
  P:"Lips together, then a puff — <b>/p/</b>. No buzz, just air.",
  D:"Tongue behind your top teeth, then down — <b>/d/</b>.",
  T:"Tongue behind your top teeth, then a tap — <b>/t/</b>. No buzz.",
  M:"Lips closed, hum it — <b>/mmm/</b>. You can hold it as long as you like.",
  N:"Tongue up, hum it — <b>/nnn/</b>.",
  F:"Top teeth on your bottom lip — <b>/fff/</b>.",
  V:"Top teeth on your bottom lip, and buzz — <b>/vvv/</b>.",
  S:"Teeth almost closed, like a snake — <b>/sss/</b>.",
  Z:"Like <b>/sss/</b>, but buzzing — <b>/zzz/</b>.",
  C:"Back of your tongue up — <b>/k/</b>.",
  K:"Back of your tongue up — <b>/k/</b>.",
  G:"Back of your tongue up, and buzz — <b>/g/</b>.",
  TH_V:"Tongue between your teeth, and buzz — the <b>th</b> in <i>the</i>.",
  TH_U:"Tongue between your teeth, just air — the <b>th</b> in <i>thin</i>.",
  A:"Open your mouth wide — <b>/a/</b> as in <i>cat</i>.",
  E:"A small smile — <b>/e/</b> as in <i>egg</i>.",
  I:"A tiny sound — <b>/i/</b> as in <i>ink</i>.",
  O:"Round lips — <b>/o/</b> as in <i>hot</i>.",
  U:"Relaxed mouth — <b>/u/</b> as in <i>up</i>."
};
/* the pairs children actually mix up, so a re-teach can contrast
   the two rather than just repeating the right one */
const CONFUSABLE = { B:'D', D:'B', P:'Q', Q:'P', M:'N', N:'M', F:'V', V:'F',
                     S:'Z', Z:'S', C:'K', K:'C', E:'I', I:'E', A:'U', U:'A',
                     O:'A', TH_V:'TH_U', TH_U:'TH_V' };

/* ════════════════════════════════════════════════════════════
   THE DECODABLE PAGE
   ════════════════════════════════════════════════════════════ */

/* Words that are learned whole, and must never be sounded out
   or counted as decodable on the strength of their letters. */
const HOLD_WHOLE = new Set(["THE","A","I","TO","DO","OF","IS","AS","HAS","WAS",
  "ARE","SAID","COME","SOME","HAVE","HERE","THERE","WHERE","WHO","WHAT","WHEN",
  "WHY","ONE","TWO","THREE","EIGHT","THEY","YOU","YOUR","MY","BE","ME","WE",
  "SHE","HE","GOES","DOES","LIVES","LIKE","LITTLE","VERY","WOULD","COULD",
  "SHOULD","ANOTHER","TOGETHER","THROUGH","BEHIND","ABOUT","ABOVE","WATER",
  "MOTHER","BROTHER","FRIENDS","PEOPLE","ONCE","LOVE","DONE","GONE","MOVE",
  "EYE","BUY","SAYS","ASKED","TRIED","OUR","PUT","PULL","FULL"]);

/* ── knowing what a word IS, not just how it is spelled ──────
   A page can be 100% decodable and still say "a away", "the pit
   sat" or "the pen can swim". Decodability is a property of
   letters; sense is a property of words, and a first reading
   page needs both. Guessing does not work — an emoji is not a
   part of speech, and the rime families are full of decodable
   verbs (zap, fit, tan) and obscure nouns (gill, keg, cog).

   So these are whitelists, reviewed by hand against the 751
   words the program actually uses. A word that is not in one of
   them never lands in a slot. Nothing here reaches the child
   until every grapheme in it has been taught, so the lists can
   be complete without being early.                            */

/* things you can count and point at: "a cat", "two cats" */
const NOUN = ["ANT","APE","APPLE","ARROW","BABOON","BABY","BADGER","BAG","BALL",
"BALLOON","BAND","BAT","BATH","BEAR","BED","BEE","BELL","BICYCLE","BIKE","BIN",
"BIRD","BOAT","BONE","BOOK","BOWL","BOX","BRANCH","BUD","BUG","BUILDER","BUN",
"BUS","CAGE","CAKE","CAMEL","CAMERA","CAP","CAPE","CAR","CARROT","CASTLE","CAT",
"CHICK","CHICKEN","CHIMP","CHIN","CHIP","CIRCLE","CLIFF","CLOCK","CLOUD","COAT",
"COCOON","COD","COG","COIN","COOK","COP","COT","COW","CRAB","CUBE","CUP","DAD",
"DAM","DEN","DOCK","DOCTOR","DOG","DOLL","DOLPHIN","DOOR","DOT","DRAGON","DRESS",
"DUCK","DUKE","EGG","FAN","FIN","FISH","FLAG","FLOWER","FLUTE","FORK","FOX",
"FRIDGE","FROG","GARDEN","GEM","GHOST","GIFT","GIRAFFE","GIRL","GLOVE","GOAT",
"GRAPE","GUITAR","HAMMER","HAND","HAT","HEN","HILL","HIVE","HOG","HOLE","HOOK",
"HORN","HORSE","HUT","IGLOO","IGUANA","INSECT","JAR","JET","JIGSAW","JUG",
"JUMPER","KEG","KENNEL","KEY","KID","KING","KITE","KITTEN","KNEE","KNIGHT",
"KOALA","LADDER","LADY","LADYBUG","LAKE","LAMB","LAMP","LANE","LAP","LEAF","LEG",
"LEMON","LETTER","LID","LION","LIP","LIZARD","LOAF","LOCK","LOG","MAN","MAP",
"MAT","MERMAID","MILL","MOLE","MONKEY","MOON","MOOSE","MOP","MOUSE","MOUTH",
"MUG","MUM","NAIL","NEEDLE","NEST","NET","NOSE","NURSE","NUT","OCTOPUS","OTTER",
"OX","PAN","PARK","PEA","PEACH","PEANUT","PEAR","PEG","PEN","PENCIL","PET",
"PHONE","PHOTO","PIE","PIER","PIG","PIN","PLANE","PLATE","PLUG","PLUM","PLUMBER",
"POD","POLE","POOL","POT","POTATO","PRAM","PRINCE","PUCK","PUDDLE","PUP",
"PUPPET","PUPPY","QUAIL","QUEEN","QUILT","RABBIT","RACCOON","RADIO","RAFT","RAG",
"RAKE","RAM","RAMP","RAT","RIG","RING","ROAD","ROBOT","ROCK","ROD","ROOF",
"ROOSTER","ROPE","ROSE","RUG","RULER","SEAGULL","SEAL","SEED","SHARK","SHED",
"SHEEP","SHELL","SHIP","SHIRT","SHOE","SHOP","SKIRT","SLED","SLUG","SNAIL",
"SNAKE","SOCK","SPIDER","SPOON","STAMP","STEP","STONE","STORK","STORM","SUN",
"TABLE","TADPOLE","TAIL","TAP","TAPE","TAXI","TEEPEE","TENT","THORN","TICKET",
"TIGER","TIN","TOMATO","TOY","TRACTOR","TRAIN","TRAM","TRAP","TRAY","TREE",
"TRUCK","TRUNK","TUB","TUBE","TURTLE","VAN","VASE","VEST","VET","VIOLIN",
"VOLCANO","VULTURE","WAGON","WAND","WEB","WEED","WHALE","WHEEL","WIG","WING",
"WOMAN","WOMBAT","WORM","YACHT","YAM","YOYO","ZEBRA","ZOO"];

/* the ones that can DO something. "The pen can swim" is
   decodable, grammatical, and nonsense; only an animate noun
   may take a verb.                                            */
const ANIMATE = ["ANT","APE","BABOON","BABY","BADGER","BAT","BEAR","BEE","BIRD",
"BUG","BUILDER","CAMEL","CAT","CHICK","CHICKEN","CHIMP","COOK","COP","COW",
"CRAB","DAD","DOCTOR","DOG","DOLPHIN","DRAGON","DUCK","DUKE","FISH","FOX","FROG",
"GHOST","GIRAFFE","GIRL","GOAT","HEN","HOG","HORSE","IGUANA","INSECT","KID",
"KING","KITTEN","KNIGHT","KOALA","LADY","LADYBUG","LAMB","LION","LIZARD","MAN",
"MERMAID","MOLE","MONKEY","MOOSE","MOUSE","MUM","NURSE","OCTOPUS","OTTER","OX",
"PET","PIG","PLUMBER","PRINCE","PUP","PUPPY","QUAIL","QUEEN","RABBIT","RACCOON",
"RAM","RAT","ROBOT","ROOSTER","SEAGULL","SEAL","SHARK","SHEEP","SLUG","SNAIL",
"SNAKE","SPIDER","STORK","TADPOLE","TIGER","TURTLE","VET","VULTURE","WHALE",
"WOMAN","WOMBAT","WORM","ZEBRA"];

/* "the jam", never "a jam" */
const MASS = ["JAM","HAM","MILK","MUD","SAND","BREAD","WATER","POPCORN","ICE",
"TOAST","RAIN","SNOW","HAIR","GRASS","CORN","SOAP","WOOL","YARN","JUICE","JELLY",
"GLUE","CHEESE","CREAM","FOAM","FOOD","GOLD","MUCK","MUSIC","PAINT","PAPER",
"STRAW","TRASH","WAX","YOGURT","CLAY","DIRT","SOIL","OIL","MEAT","FOG","HAY"];

/* names take no article: "I am Sam", never "I am a Sam".
   Only names that actually occur in the program's own words. */
const NAMES = ["SAM","DAN","JILL","ZIB"];

const ADJ = ["BIG","FAT","SAD","MAD","HOT","WET","RED","THIN","SICK","SOFT",
"LOST","QUICK","LONG","STRONG","MUDDY","SILLY","BOSSY","MESSY","HAPPY","GREEN",
"BLACK","PINK","SHINY","SHORT","TALL","COLD","DARK","EMPTY","FULL","HAIRY",
"NICE","PRETTY","RUSTY","THICK","TIGHT","WIDE","YELLOW","CREEPY","CRUNCHY",
"FLOPPY","BRIGHT","GOOD","QUIET","WHITE","BLUE"];

/* after "can" — bare infinitive */
const VERB_BASE = ["RUN","SIT","HOP","JUMP","SPIN","STOP","SWIM","DIG","GRIN",
"NAP","FLAP","SING","SKIP","JOG","HUM","CLAP","SHOP","YELL","WAG","NOD","ROLL",
"CREEP","STOMP","SLIP","TRIP","REST","HIDE","SMILE","DANCE","SHOUT","YAWN"];

/* on its own — past tense, so "the cat sat" and never "the cat sit".
   Intransitive only: "the zebra hit" is grammatical and unfinished,
   and an unfinished sentence is not something to hand a beginner. */
const VERB_PAST = ["SAT","RAN","HID","DUG","FELL","WENT","SWAM","WOKE",
"HOPPED","JUMPED","SLEPT","GRINNED","YELLED","NODDED"];

/* "a apple" is wrong, and a first reader should not be where a
   child meets the a/an rule. Skip the template instead. */
const startsVowel = w => /^[AEIOU]/.test(w);

/* ── words that do not begin with the sound they look like ───
   "alien" looks like an a-word and is not one: it begins with
   the letter's NAME. These must never appear in an initial-
   sound activity for that letter — which is exactly the
   confusion those activities exist to resolve. They stay in the
   vocabulary, because they are good words and good pictures;
   they are barred from one kind of round, not deleted.        */
const INITIAL_TRAP = {
  A:["ALIEN","APRON","ACORN","APE","ACE","AGE","AIM","AIR","ALL","ALSO","AUTUMN",
     "AWAY","AGO","ABOUT","ABOVE","ALONE","AROUND","AGAIN","ANY","ARE","AUNT",
     "ARM","ART","APRIL","ACE"],
  E:["EAGLE","EVEN","EQUAL","EMU","EWE","EAR","EARS","EARTH","EIGHT","EACH","EAT",
     "EASY","EVENING","EMAIL","ERASER","EVERY","EXIT","EYES"],
  I:["ICE","IRON","ISLAND","IDEA","ITEM","IVY","ICING","IGLOO","INTO"],
  O:["OPEN","OVER","OCEAN","OAR","OAT","OATS","ONE","ONLY","OWL","OWN","OTHER",
     "OIL","OINK","ONION","ORBIT","OBOE","OVAL","OAK","OUR","OUT"],
  U:["UNICORN","UNIFORM","USE","UNITED","UNIT","UKULELE","UTENSIL","UNIVERSE",
     "URN","URGE","UFO","USUAL","UKE"],
  /* the consonant traps the old checker already knew about */
  T:["THE","THIS","THAT","THEN","THEY","THEM","THERE","THIN","THICK","THUMP",
     "THUD","THORN","THREE","THREAD","THROW","THINK","THIRD"],
  C:["CHAT","CHEESE","CHEST","CHEW","CHICK","CHICKEN","CHILLI","CHIMP","CHIN",
     "CHIP","CHIPS","CHOMP","CHOP","CIRCLE","CIRCUS","CITY","CELERY","CEMENT"],
  S:["SHARK","SHE","SHED","SHEEP","SHELL","SHINY","SHIP","SHIRT","SHOE","SHOES",
     "SHOP","SHORT","SHORTS","SHOUT","SHUT"],
  W:["WHALE","WHAT","WHEEL","WHEN","WHERE","WHITE","WHO","WRAP","WRITE"],
  P:["PHONE","PHOTO"],
  G:["GHOST","GIANT","GEM","GELATO","GIRAFFE"],
  K:["KNEE","KNIGHT","KNOW"],
  Q:["QUEUE"]
};
/* dialect-dependent rather than plainly wrong. Reported, not failed. */
const INITIAL_DIALECT = { O:["ORANGE","OFF","OFTEN","ORANGES"], A:["ASK","ANT","ASKED"] };

function initialTrapped(letter, word){
  const W = String(word).toUpperCase(), L = String(letter).toUpperCase();
  return (INITIAL_TRAP[L] || []).includes(W);
}
function initialDialect(letter, word){
  const W = String(word).toUpperCase(), L = String(letter).toUpperCase();
  return (INITIAL_DIALECT[L] || []).includes(W);
}

/* Is this word one the child can actually get through? */
function wordIsDecodable(w, known, hf){
  const W = String(w).toUpperCase();
  if(hf && hf.has(W)) return true;              // taught by sight, fair game
  if(HOLD_WHOLE.has(W)) return false;           // not taught yet -> not usable
  return splitGraphemes(W).every(g => known.has(g));
}

/* Everything the child could read, at this point in the journey,
   sorted by what the word can be used FOR. */
function readableBank(mapNo, nodeNo){
  const known = new Set(graphemesUpTo(mapNo, nodeNo));
  const hf    = new Set(hfwUpTo(mapNo, nodeNo).map(h => h.w));
  const ok    = w => wordIsDecodable(w, known, hf);
  const pics  = new Map();
  ALL_NODES.forEach(n => {
    if(n.map > mapNo || (n.map === mapNo && n.no > nodeNo)) return;
    [...n.words, ...n.family, ...n.vocab].forEach(v => {
      const W = v.w.toUpperCase();
      if(!pics.has(W) && v.e) pics.set(W, v.e);
      else if(!pics.has(W)) pics.set(W, '');
    });
  });
  const met  = w => pics.has(w) && ok(w);          // taught AND decodable
  const make = list => list.filter(met).map(w => ({ w, e:pics.get(w) || '' }));

  const count = make(NOUN), mass = make(MASS);
  return {
    known, hf, ok,
    count, mass,
    names:   make(NAMES),
    animate: make(ANIMATE),
    /* anything that can follow "the" */
    any:   [...count, ...mass],
    adj:   ADJ.filter(ok),
    vBase: VERB_BASE.filter(ok),
    vPast: VERB_PAST.filter(ok)
  };
}

/* The templates. Every slot is either a high-frequency word the
   child has been TAUGHT (need) or a word from the bank above.
   A template that needs a word this child has not met yet is
   simply not available — which is why the page starts as two
   words and grows into sentences without anybody tuning it. */
/* {c} count noun   {C} a second one   {t} anything after "the"
   {n} an ANIMATE noun — only these may take a verb
   {a} adjective     {b} bare verb     {p} past-tense verb
   {m} a name                                                    */
const TEMPLATES = [
  { need:["I","AM"],       want:["names"],         slots:["I","AM","{m}"] },
  { need:["IT","IS","A"],  want:["count"],         slots:["IT","IS","A","{c}"] },
  { need:["I","CAN","SEE","A"], want:["count"],    slots:["I","CAN","SEE","A","{c}"] },
  { need:["I","CAN","SEE","THE"], want:["any"],    slots:["I","CAN","SEE","THE","{t}"] },
  { need:["THE","IS"],     want:["any","adj"],     slots:["THE","{t}","IS","{a}"] },
  { need:["A","AND"],      want:["count2"],        slots:["A","{c}","AND","A","{C}"] },
  { need:["THE","AND"],    want:["any2"],          slots:["THE","{t}","AND","THE","{T}"] },
  { need:["THE"],          want:["animate","vPast"],slots:["THE","{n}","{p}"] },
  { need:["THE","CAN"],    want:["animate","vBase"],slots:["THE","{n}","CAN","{b}"] },
  { need:["A","IS","AT","THE"], want:["count","any"],slots:["A","{c}","IS","AT","THE","{T}"] },
  { need:["LOOK","AT","THE"], want:["any"],        slots:["LOOK","AT","THE","{t}"] },
  { need:["HERE","IS","A"],   want:["count"],      slots:["HERE","IS","A","{c}"] },
  { need:["MY","IS"],      want:["any","adj"],     slots:["MY","{t}","IS","{a}"] },
  { need:["WE","CAN","SEE","THE"], want:["any"],   slots:["WE","CAN","SEE","THE","{t}"] },
  { need:["I","LIKE","THE"],  want:["any"],        slots:["I","LIKE","THE","{t}"] },
  { need:["I","LIKE","MY"],   want:["any"],        slots:["I","LIKE","MY","{t}"] }
];

/* deterministic shuffle, so the same lesson gives the same page
   twice running — a child re-reading a familiar page is doing
   exactly the right thing, and a page that changes underneath
   them is not a page. */
function seeded(seed){
  let s = seed * 2654435761 % 2147483647;
  return () => (s = s * 16807 % 2147483647) / 2147483647;
}

function decodablePage(node, maxLines){
  const mapNo = node.map || (typeof CURRENT_MAP !== 'undefined' ? CURRENT_MAP.no : 1);
  const bank = readableBank(mapNo, node.no);
  const lesson = (mapNo - 1) * 10 + node.no;
  const rand = seeded(lesson);
  const pick = a => a && a.length ? a[Math.floor(rand() * a.length)] : null;

  /* Prefer the words THIS lesson is about, so the page is practice
     of today's work rather than a general quiz. Only words that
     pass the same class test, or the page stops making sense. */
  const todays = w => [...node.family, ...node.words]
      .some(v => v.w.toUpperCase() === w);
  const front = list => [...list].sort((a,b) => todays(b.w) - todays(a.w));
  const COUNT = front(bank.count), ANY = front(bank.any), ANIM = front(bank.animate);

  const has = w => bank.hf.has(w);
  const enough = {
    count:   COUNT.length >= 1,
    count2:  COUNT.filter(v => !startsVowel(v.w)).length >= 2,
    any:     ANY.length >= 1,
    any2:    ANY.length >= 2,
    animate: ANIM.length >= 1,
    names:   bank.names.length >= 1,
    adj:     bank.adj.length >= 1,
    vBase:   bank.vBase.length >= 1,
    vPast:   bank.vPast.length >= 1
  };
  const usable = TEMPLATES.filter(t =>
       t.need.every(has)
    && (t.want || []).every(w => enough[w])
    /* "a apple" is wrong; skip rather than teach the exception */
    && (!/\{c\}|\{C\}/.test(t.slots.join(' ')) || COUNT.some(v => !startsVowel(v.w))));
  if(!usable.length) return null;

  const want = maxLines || 3;
  const lines = [], usedWords = [], usedTpl = [];
  let guard = 0;
  while(lines.length < want && guard++ < 60){
    const fresh = usable.filter(x => !usedTpl.includes(x));
    const t = pick(fresh.length ? fresh : usable);
    usedTpl.push(t);

    const notUsed = a => { const f = a.filter(v => !usedWords.includes(v.w)); return f.length ? f : a };
    const c1 = pick(notUsed(COUNT.filter(v => !startsVowel(v.w)))) || pick(COUNT);
    const c2 = pick(COUNT.filter(v => !startsVowel(v.w) && (!c1 || v.w !== c1.w))) || c1;
    const t1 = pick(notUsed(ANY)) || c1;
    const t2 = pick(ANY.filter(v => !t1 || v.w !== t1.w)) || t1;
    const a1 = pick(notUsed(ANIM));
    const m1 = pick(bank.names);
    let pic = '';
    const words = t.slots.map(s => {
      switch(s){
        case '{c}': pic = pic || (c1 && c1.e); usedWords.push(c1.w); return c1.w;
        case '{C}': return c2.w;
        case '{t}': pic = pic || (t1 && t1.e); usedWords.push(t1.w); return t1.w;
        case '{T}': return t2.w;
        case '{n}': pic = pic || (a1 && a1.e); usedWords.push(a1.w); return a1.w;
        case '{m}': return m1.w;
        case '{a}': return pick(bank.adj);
        case '{b}': return pick(bank.vBase);
        case '{p}': return pick(bank.vPast);
        default:    return s;
      }
    });
    const key = words.join(' ');
    if(lines.some(l => l.words.join(' ') === key)) continue;
    lines.push({ words, pic: pic || '' });
  }
  if(!lines.length) return null;

  /* Measure what we built with the same test the checker uses,
     rather than trusting that we built it correctly. */
  const all = lines.flatMap(l => l.words);
  const ok = all.filter(w => wordIsDecodable(w, bank.known, bank.hf));
  return {
    lines,
    words: all,
    pct: Math.round(ok.length / all.length * 100),
    sightUsed: [...new Set(all.filter(w => bank.hf.has(w)))],
    lesson
  };
}

/* ════════════════════════════════════════════════════════════
   DISTRIBUTED RETRIEVAL
   ------------------------------------------------------------
   Review sat in massed blocks at Lessons 10, 20, 40, 51, 70, 80,
   100, 110 and 120, which is the least effective place to put
   it. Two items in every ten, drawn from material taught at
   least five lessons ago, costs two slots and buys spacing.
   ════════════════════════════════════════════════════════════ */
function reviewFor(node, gapLessons){
  const mapNo = node.map || (typeof CURRENT_MAP !== 'undefined' ? CURRENT_MAP.no : 1);
  const here  = (mapNo - 1) * 10 + node.no;
  const cut   = here - (gapLessons == null ? 5 : gapLessons);
  const graphemes = [], hfw = [], words = [];
  ALL_NODES.forEach(n => {
    const L = (n.map - 1) * 10 + n.no;
    if(L > cut) return;
    (n.teaches || []).forEach(g => { if(!graphemes.includes(g) && !/_/.test(g)) graphemes.push(g) });
    (n.hfw || []).forEach(h => { if(!hfw.some(x => x.w === h.w)) hfw.push(h) });
    [...n.words, ...n.family].forEach(v => { if(!words.some(x => x.w === v.w)) words.push(v) });
  });
  const known = new Set(graphemesUpTo(mapNo, node.no));
  const hf = new Set(hfwUpTo(mapNo, node.no).map(h => h.w));
  return {
    graphemes,
    hfw,
    /* only words the child can decode, so a review item is
       retrieval and not a fresh puzzle */
    words: words.filter(v => v.e && wordIsDecodable(v.w, known, hf))
  };
}

/* ── a distractor a child could actually mistake for the answer ──
   "little" offered against "at" and "am" teaches nothing: the
   child picks the long one and is right for the wrong reason.
   Score by the things that get confused in real reading — same
   first letter, same shape, same length, same ending.          */
function nearness(a, b){
  a = String(a).toUpperCase(); b = String(b).toUpperCase();
  return (a[0] === b[0] ? 3 : 0)
       + (a.length === b.length ? 3 : 0)
       + (Math.abs(a.length - b.length) <= 1 ? 2 : 0)
       + (Math.abs(a.length - b.length) <= 2 ? 1 : 0)
       + (a[a.length-1] === b[b.length-1] ? 1 : 0)
       + (a.slice(0,2) === b.slice(0,2) ? 2 : 0);
}
function confusableWith(answer, pool, k){
  const ranked = [...new Set(pool.map(w => String(w).toUpperCase()))]
    .filter(w => w !== String(answer).toUpperCase())
    .sort((x,y) => nearness(answer,y) - nearness(answer,x));
  /* take from the top handful rather than the single best, so the
     same word is not always offered against the same two */
  const close = ranked.slice(0, Math.max(k + 3, 6));
  for(let i = close.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i+1)); [close[i],close[j]] = [close[j],close[i]];
  }
  return close.slice(0, k);
}

/* Node-level export for the checker and any build tooling. */
if(typeof module !== 'undefined' && module.exports){
  module.exports = { MULTI, splitGraphemes, phonFor, phonEntry, blendPlan,
                     initialTrapped, initialDialect, INITIAL_TRAP, NOUN, ANIMATE,
                     nearness, confusableWith,
                     decodablePage, readableBank, reviewFor, wordIsDecodable,
                     ARTIC, CONFUSABLE, HOLD_WHOLE, TEMPLATES };
}
