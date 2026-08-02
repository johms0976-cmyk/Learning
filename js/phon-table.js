/* ============================================================
   PHON  ·  how each grapheme is spoken
   ------------------------------------------------------------
   Three separate things used to be one string, which is why the
   stop consonants ended up with a schwa on them:

     file   the recording's filename. UNCHANGED for everything
            that already existed, so every recording already
            made still resolves.
     tts    what the computer voice says when no recording
            exists. null for the stops, because no speech engine
            can say an unvoiced clipped consonant — it will
            always add "uh". Where this is null the engine falls
            back to the keyword instead.
     say    what the CHILD sees and hears named. "/t/", never
            "tuh".
     name   the LETTER NAME. "bee" for b, "double-u" for w.
            Letter-name knowledge is the strongest single
            predictor of later decoding (NELP 2008), and for
            most letters the name contains the sound, which is
            what makes the sound learnable. Null where the
            grapheme has no name of its own (sh, igh, ck).
     type   cont      can be held: mmmm, sssss
            stop      cannot be held: /t/ /b/ /k/. MUST be
                      recorded. Held or schwa'd, blending fails.
            vowel     short vowel
            digraph   two letters, one sound

   ── what changed, and why ──────────────────────────────────

   TH was one entry doing two jobs. It is two phonemes:
     /ð/  voiced    the, this, that, there, then, they
     /θ/  unvoiced  thin, thick, thumb, thanks, thud, path
   One recording cannot serve both, and a child told that "thin"
   begins like "the" has been taught something false. TH is now
   the surface grapheme; TH_V and TH_U carry the two sounds, and
   TH_VOICED lists the words that take the voiced one.

   Short O said "awe". That is /ɔː/ (THOUGHT), not /ɒ/ (LOT).
   It is also dialect-fragile: acceptable under the American
   cot-caught merger, wrong in New Zealand and Australian
   English. There is no honest text string for /ɒ/, so tts is
   now null and the engine falls back to the keyword, exactly
   as it does for the stops. RECORD IT.

   OA no longer shares the "oh" file with short O. They are
   different sounds and sharing a file guaranteed one of them
   was wrong.

   Added, because rimes and word lists in the program already
   use them and a child cannot decode a grapheme nobody taught:
     CK QU WH AR UR AI OU OW OY OI AW ALL LL SS FF ZZ TCH PH
     EA_E (bread, head)  Y_E (happy)  Y_I (my, why)
   ============================================================ */

module.exports = {
  /* ── continuants: safe for the computer voice ───────────── */
  M:{file:"mmm", tts:"mmmm",   say:"/m/", name:"em",   type:"cont"},
  S:{file:"sss", tts:"sssss",  say:"/s/", name:"ess",  type:"cont"},
  F:{file:"fff", tts:"ffff",   say:"/f/", name:"eff",  type:"cont"},
  N:{file:"nnn", tts:"nnnn",   say:"/n/", name:"en",   type:"cont"},
  R:{file:"rrr", tts:"rrrr",   say:"/r/", name:"ar",   type:"cont"},
  L:{file:"lll", tts:"llll",   say:"/l/", name:"el",   type:"cont"},
  V:{file:"vvv", tts:"vvvv",   say:"/v/", name:"vee",  type:"cont"},
  Z:{file:"zzz", tts:"zzzz",   say:"/z/", name:"zed",  type:"cont",
     nameAlt:"zee"},
  H:{file:"huh", tts:"hhh",    say:"/h/", name:"aitch",type:"cont"},
  W:{file:"wuh", tts:"wwww",   say:"/w/", name:"double-u", type:"cont"},
  Y:{file:"yuh", tts:"yyyy",   say:"/y/", name:"why",  type:"cont",
     alts:["Y_E","Y_I"]},

  /* ── stops and affricates: a recording is required ──────── */
  T:{file:"tuh", tts:null, say:"/t/",  name:"tee",  type:"stop"},
  B:{file:"buh", tts:null, say:"/b/",  name:"bee",  type:"stop"},
  C:{file:"kuh", tts:null, say:"/k/",  name:"see",  type:"stop"},
  K:{file:"kuh", tts:null, say:"/k/",  name:"kay",  type:"stop"},
  D:{file:"duh", tts:null, say:"/d/",  name:"dee",  type:"stop"},
  G:{file:"guh", tts:null, say:"/g/",  name:"jee",  type:"stop"},
  P:{file:"puh", tts:null, say:"/p/",  name:"pee",  type:"stop"},
  J:{file:"juh", tts:null, say:"/j/",  name:"jay",  type:"stop"},
  Q:{file:"kwuh",tts:null, say:"/kw/", name:"cue",  type:"stop",
     note:"the letter. The GRAPHEME in English words is QU."},
  X:{file:"ks",  tts:null, say:"/ks/", name:"ex",   type:"stop",
     twoPhonemes:true,
     note:"/k/+/s/. A sound box for 'box' holds three letters but four sounds."},
  CH:{file:"chh",tts:null, say:"/ch/", name:null, type:"stop", digraph:true,
      note:"an affricate. Behaves like a stop for blending, so it must be recorded."},

  /* CK — one sound, two letters, at the end of a short word.
     -ock and -uck are taught as rimes at Lessons 60/64/65, so
     the child meets CK long before this table admitted it. */
  CK:{file:"kuh", tts:null, say:"/k/", name:null, type:"stop", digraph:true},

  /* QU — the real grapheme. Q alone almost never occurs. */
  QU:{file:"kwuh", tts:null, say:"/kw/", name:null, type:"stop", digraph:true,
      twoPhonemes:true},

  TCH:{file:"chh", tts:null, say:"/ch/", name:null, type:"stop", digraph:true},

  /* ── short vowels ───────────────────────────────────────── */
  A:{file:"aah", tts:"aaa",  say:"/a/", name:"ay",  type:"vowel"},
  E:{file:"eh",  tts:"eh",   say:"/e/", name:"ee",  type:"vowel"},
  I:{file:"ih",  tts:"ih",   say:"/i/", name:"eye", type:"vowel"},
  O:{file:"short-o", tts:null, say:"/o/", name:"oh", type:"vowel",
     fixed:"tts was 'awe' — that is the THOUGHT vowel, not the LOT " +
           "vowel. No text string gets short o right across dialects. " +
           "RECORD short-o (the vowel in 'hot'). Until then the engine " +
           "says the keyword, octopus, exactly as it does for the stops."},
  U:{file:"uh",  tts:"uh",   say:"/u/", name:"you", type:"vowel"},

  /* ── consonant digraphs ─────────────────────────────────── */
  SH:{file:"shh", tts:"shhh",  say:"/sh/", name:null, type:"cont", digraph:true},
  NG:{file:"ing", tts:"nnng",  say:"/ng/", name:null, type:"cont", digraph:true},
  WH:{file:"wuh", tts:"wwww",  say:"/w/",  name:null, type:"cont", digraph:true,
      note:"/w/ for almost every child now. Kept separate from W so " +
           "'when' splits as WH-E-N and the initial-sound games stay honest."},
  PH:{file:"fff", tts:"ffff",  say:"/f/",  name:null, type:"cont", digraph:true},

  /* TH — the surface grapheme. Which sound it makes depends on
     the word, so the engine asks phonFor(word) and gets one of
     the two below. Never play the generic TH file inside a word. */
  TH:{file:"thh", tts:null, say:"/th/", name:null, type:"cont", digraph:true,
      twoSounds:["TH_V","TH_U"],
      note:"ambiguous by design. Use TH_V / TH_U in words."},
  TH_V:{file:"thh_voiced",   tts:null, say:"/th/", name:null, type:"cont",
        digraph:true, surface:"TH",
        note:"voiced — the, this, that, there, then, they, them, mother"},
  TH_U:{file:"thh_unvoiced", tts:"thhh", say:"/th/", name:null, type:"cont",
        digraph:true, surface:"TH",
        note:"unvoiced — thin, thick, thumb, thanks, thud, path, bath"},

  /* ── doubles: two letters, one sound ────────────────────── */
  LL:{file:"lll", tts:"llll",  say:"/l/", name:null, type:"cont", digraph:true},
  SS:{file:"sss", tts:"sssss", say:"/s/", name:null, type:"cont", digraph:true},
  FF:{file:"fff", tts:"ffff",  say:"/f/", name:null, type:"cont", digraph:true},
  ZZ:{file:"zzz", tts:"zzzz",  say:"/z/", name:null, type:"cont", digraph:true},

  /* ── vowel teams and r-controlled vowels ────────────────── */
  EE:{file:"eee", tts:"eee",   say:"/ee/", name:null, type:"vowel", digraph:true},
  OO:{file:"ooo", tts:"oooo",  say:"/oo/", name:null, type:"vowel", digraph:true,
      note:"long oo (moon). Short oo (book) is the same spelling — " +
           "set-for-variability: try one, then the other."},
  EA:{file:"eee", tts:"eee",   say:"/ea/", name:null, type:"vowel", digraph:true,
      alts:["EA_E"]},
  EA_E:{file:"eh", tts:"eh",   say:"/e/",  name:null, type:"vowel", digraph:true,
        surface:"EA", note:"bread, head, feather — EA's second sound"},
  ER:{file:"er",  tts:"err",   say:"/er/", name:null, type:"vowel", digraph:true},
  IR:{file:"er",  tts:"err",   say:"/ir/", name:null, type:"vowel", digraph:true},
  UR:{file:"er",  tts:"err",   say:"/ur/", name:null, type:"vowel", digraph:true},
  OR:{file:"or",  tts:"or",    say:"/or/", name:null, type:"vowel", digraph:true},
  AR:{file:"ar",  tts:"aar",   say:"/ar/", name:null, type:"vowel", digraph:true},
  OA:{file:"long-o", tts:"oh", say:"/oa/", name:null, type:"vowel", digraph:true,
      fixed:"was sharing the 'oh' file with short O. Two different " +
            "sounds cannot share one recording."},
  IGH:{file:"eye",tts:"eye",   say:"/igh/",name:null, type:"vowel", digraph:true},
  AY:{file:"ay",  tts:"ay",    say:"/ay/", name:null, type:"vowel", digraph:true},
  AI:{file:"ay",  tts:"ay",    say:"/ai/", name:null, type:"vowel", digraph:true},
  OU:{file:"ow",  tts:"ow",    say:"/ou/", name:null, type:"vowel", digraph:true},
  OW:{file:"ow",  tts:"ow",    say:"/ow/", name:null, type:"vowel", digraph:true,
      note:"cow, flower. OW is also /oa/ (snow, blow) — set-for-variability."},
  OY:{file:"oy",  tts:"oy",    say:"/oy/", name:null, type:"vowel", digraph:true},
  OI:{file:"oy",  tts:"oy",    say:"/oi/", name:null, type:"vowel", digraph:true},
  AW:{file:"awe", tts:"awe",   say:"/aw/", name:null, type:"vowel", digraph:true},
  ALL:{file:"all",tts:"all",   say:"/all/",name:null, type:"vowel", digraph:true},

  /* Y's other two jobs. Taught as /y/ at Lesson 36, but it is
     /ee/ at the end of happy (Lessons 59, 99) and /igh/ at the
     end of my and why. One entry could not hold all three. */
  Y_E:{file:"eee", tts:"eee", say:"/ee/",  name:null, type:"vowel", surface:"Y",
       note:"happy, muddy, silly — final y in a two-syllable word"},
  Y_I:{file:"eye", tts:"eye", say:"/igh/", name:null, type:"vowel", surface:"Y",
       note:"my, why, sky, fly — final y in a one-syllable word"}
};

/* ── which words take the voiced TH ──────────────────────────
   Short, closed, and checked by the curriculum checker: any TH
   word in the program that is not in here is treated as /θ/. */
module.exports.TH_VOICED = [
  "THE","THIS","THAT","THESE","THOSE","THERE","THEIR","THEY","THEM","THEN",
  "THAN","THOUGH","THUS","MOTHER","FATHER","BROTHER","ANOTHER","OTHER",
  "TOGETHER","WEATHER","FEATHER","LEATHER","BATHE","BREATHE","CLOTHES",
  "SMOOTH","WITH","WITHOUT"
];

/* ── sounds a phone or tablet voice cannot say honestly ──────
   Everything with tts:null. The grown-ups' dashboard lists
   these first, because until they are recorded the child hears
   a keyword instead of the sound. */
module.exports.MUST_RECORD_NOTE =
  "T B C K D G P J Q QU X CH CK TCH O TH TH_V — record these first. " +
  "Short O is new to this list and is the most urgent: it is a vowel, " +
  "it appears in every -ot -op -og -ock family, and the string it used " +
  "to fall back on was the wrong sound.";
