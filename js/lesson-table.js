/* ============================================================
   LESSON TABLE  ·  the curriculum spine, one row per lesson
   ------------------------------------------------------------
   kind      what this lesson actually teaches. The engine uses
             this to decide which activities are allowed.
               grapheme  a new letter and its sound
               digraph   two letters, one sound (sh ch th ng…)
               family    a rime:  -at, -op, -uck
               blend     a rime whose onsets are blends: cl- fl-
               pattern   magic e, soft c, soft g, vowel teams
               vowels    telling the short vowels apart
               ending    a suffix:  -y, -er, -s
               sight     high-frequency words and sentences
               skill     the alphabet, sentence conventions
               review    everything so far
   teaches   the grapheme(s) genuinely NEW here. Empty for the
             lessons that apply what is already known.
   rime      the shared ending the word-family machine swaps
             onsets onto. Onsets are whatever is left, so a
             two-letter onset (cl-, spl-) works correctly.
   onset     for onset families: sh + ed/ell/ip/op
   suffix    for ending lessons: -y, -er
   position  "final" where the sound is taught at the END of a
             word (x, ng). Initial-sound games are wrong there.
   machine   false where the word list is not a rime family, so
             the engine substitutes a valid activity instead.

   ── the missing graphemes ───────────────────────────────────
   The rimes below already used CK (-ock, -uck), LL (-ill,
   -ell), QU (queen) and ALL, and the vocabulary used AR, AI,
   OU, OW and UR — but none of them were ever in anybody's
   `teaches`, so graphemesUpTo() never knew about them and no
   word containing them could ever count as decodable. Each one
   is now attached to the lesson where the child first genuinely
   meets it. Nothing has been moved; things have been named.

     LL SS FF ZZ  L49   the doubles, at the -ill family
     ALL          L79   "all" is in this lesson's own word list
     CK           L60   the -ock family
     QU           L30   the q lesson — QU is the real grapheme
     WH           L75   where, when
     IR UR        L115  the r-controlled group
     OR AR AW     L118  the rest of the r-controlled group
     OU OW OI OY  L110  flower, ground, cloud, brown
     AI           L120  the same sound as AY, a proper pair
     TH_V TH_U    L66 / L89   the two th sounds, separated
     Y_E          L59   happy, muddy — final y saying /ee/
     Y_I          L116  my, why, sky — final y saying /igh/
     EA_E         L107  bread, head — EA's second sound
   ============================================================ */

module.exports = {
  /* ── Map 1 ── */
  1:{kind:"grapheme", teaches:["M"]},
  2:{kind:"grapheme", teaches:["S"]},
  3:{kind:"grapheme", teaches:["A","I"]},
  4:{kind:"grapheme", teaches:["T"]},
  5:{kind:"family",   rime:"AT"},
  6:{kind:"grapheme", teaches:["B"]},
  7:{kind:"grapheme", teaches:["C"]},
  8:{kind:"grapheme", teaches:["F"]},
  9:{kind:"family",   rime:"AT"},
  10:{kind:"review"},

  /* ── Map 2 ── */
  11:{kind:"grapheme", teaches:["N"]},
  12:{kind:"grapheme", teaches:["P"]},
  13:{kind:"family",   rime:"AP"},
  14:{kind:"grapheme", teaches:["H"]},
  15:{kind:"grapheme", teaches:["R"]},
  16:{kind:"family",   rime:"AN"},
  17:{kind:"grapheme", teaches:["Z"]},
  18:{kind:"grapheme", teaches:["E","EE"]},
  19:{kind:"skill",    skill:"sentence"},
  20:{kind:"review"},

  /* ── Map 3 ── */
  21:{kind:"grapheme", teaches:["V"]},
  22:{kind:"family",   rime:"AND"},
  23:{kind:"grapheme", teaches:["D"]},
  24:{kind:"sight"},
  25:{kind:"grapheme", teaches:["J"]},
  26:{kind:"family",   rime:"AD"},
  27:{kind:"grapheme", teaches:["O"]},
  28:{kind:"sight"},
  29:{kind:"sight"},
  /* QU, not Q. "queen" is qu-ee-n; splitting it q-u-ee-n gives
     the child a short u that is not there. */
  30:{kind:"grapheme", teaches:["Q","QU"]},

  /* ── Map 4 ── */
  31:{kind:"grapheme", teaches:["G"]},
  32:{kind:"grapheme", teaches:["L"]},
  33:{kind:"sight"},
  34:{kind:"grapheme", teaches:["K"]},
  35:{kind:"family",   rime:"AG"},
  36:{kind:"grapheme", teaches:["Y"]},
  37:{kind:"sight"},
  38:{kind:"grapheme", teaches:["X"], position:"final"},
  39:{kind:"grapheme", teaches:["W"]},
  40:{kind:"review"},

  /* ── Map 5 ── */
  41:{kind:"grapheme", teaches:["U"]},
  42:{kind:"skill",    skill:"alphabet"},
  43:{kind:"family",   rime:"ID"},
  44:{kind:"family",   rime:"IN"},
  45:{kind:"family",   rime:"IT"},
  46:{kind:"family",   rime:"IG"},
  47:{kind:"sight"},
  48:{kind:"family",   rime:"IP"},
  /* The floss rule. -ill is the first rime built on a double,
     and ff, ss and zz behave the same way, so they are named
     together here rather than never. */
  49:{kind:"family",   rime:"ILL", teaches:["LL","SS","FF","ZZ"],
      note:"the doubles: two letters, one sound"},
  50:{kind:"family",   rime:"ING"},

  /* ── Map 6 ── */
  51:{kind:"review"},
  52:{kind:"family",   rime:"OT"},
  53:{kind:"family",   rime:"OG"},
  54:{kind:"family",   rime:"OP"},
  55:{kind:"family",   rime:"OTS"},
  56:{kind:"sight"},
  57:{kind:"sight"},
  58:{kind:"family",   rime:"OD"},
  59:{kind:"ending",   suffix:"Y", suffixSound:"eee", teaches:["Y_E"]},
  60:{kind:"family",   rime:"OCK", teaches:["CK"],
      note:"ck — one sound, two letters, after a short vowel"},

  /* ── Map 7 ── */
  61:{kind:"sight"},
  62:{kind:"family",   rime:"UT"},
  63:{kind:"family",   rime:"UG"},
  64:{kind:"family",   rime:"UCK"},
  65:{kind:"family",   rime:"UCK"},
  /* there / that / this are all voiced th, which is why this
     lesson teaches the sound rather than three sight words. */
  66:{kind:"digraph",  teaches:["TH","TH_V"], onset:"TH"},
  67:{kind:"sight"},
  68:{kind:"family",   rime:"UN"},
  69:{kind:"family",   rime:"UG"},
  70:{kind:"review"},

  /* ── Map 8 ── */
  71:{kind:"sight"},
  72:{kind:"grapheme", teaches:["NG"], position:"final", rime:"ING"},
  73:{kind:"family",   rime:"ED"},
  74:{kind:"family",   rime:"ET"},
  75:{kind:"family",   rime:"ENT", teaches:["WH"],
      note:"where, when — wh, so the initial-sound games stay honest"},
  76:{kind:"family",   rime:"EG"},
  77:{kind:"family",   rime:"EN"},
  78:{kind:"sight"},
  79:{kind:"family",   rime:"ELL", teaches:["ALL"],
      note:"'all' is in this lesson's own word list"},
  80:{kind:"review"},

  /* ── Map 9 ── */
  81:{kind:"vowels"},
  82:{kind:"family",   rime:"IE"},
  83:{kind:"pattern",  pattern:"magicE", rime:"INE"},
  84:{kind:"pattern",  pattern:"magicE", machine:false, note:"family mixes -ike and -ide"},
  85:{kind:"digraph",  teaches:["SH"], onset:"SH"},
  86:{kind:"digraph",  teaches:[],     onset:"SH"},
  87:{kind:"pattern",  pattern:"magicE", rime:"ITE"},
  /* tch is the same sound after a short vowel: catch, match, itch.
     It was in the word lists and in nobody's teaches. */
  88:{kind:"digraph",  teaches:["CH","TCH"], onset:"CH"},
  /* thin, thanks, thud — the OTHER th. A child taught that this
     is the same sound as "the" has been taught something false. */
  89:{kind:"digraph",  teaches:["TH_U"], onset:"TH",
      note:"unvoiced th, against the voiced th of Lesson 66"},
  90:{kind:"review",  onset:"CH"},

  /* ── Map 10 ── */
  91:{kind:"pattern",  pattern:"softC", machine:false, sortTwo:{a:"kuh", b:"sss", letter:"C"}},
  92:{kind:"pattern",  pattern:"magicE", rime:"ICE"},
  93:{kind:"pattern",  pattern:"softG", rime:"AGE", sortTwo:{a:"guh", b:"juh", letter:"G"}},
  94:{kind:"pattern",  pattern:"magicE", rime:"AKE"},
  95:{kind:"pattern",  pattern:"magicE", rime:"ANE"},
  96:{kind:"pattern",  pattern:"magicE", rime:"ACE"},
  97:{kind:"pattern",  pattern:"magicE", machine:false, note:"one word per long vowel — a comparison set"},
  98:{kind:"pattern",  pattern:"magicE", rime:"APE"},
  99:{kind:"ending",   suffix:"Y", suffixSound:"eee"},
  100:{kind:"review"},

  /* ── Map 11 ── */
  101:{kind:"pattern", pattern:"vowelTeam", teaches:["OO"], rime:"OOK"},
  102:{kind:"pattern", pattern:"vowelTeam", teaches:[],     rime:"OON"},
  103:{kind:"pattern", pattern:"magicE", rime:"OLE"},
  104:{kind:"pattern", pattern:"magicE", machine:false, note:"family mixes -ode, -ote and -ose"},
  105:{kind:"blend",   rime:"AM"},
  106:{kind:"blend",   rime:"ASH"},
  107:{kind:"pattern", pattern:"vowelTeam", teaches:["EA","EA_E"], rime:"EACH",
       note:"ea says /ee/ in each and /e/ in bread — both, together"},
  108:{kind:"pattern", pattern:"magicE", machine:false, note:"family mixes -ube, -uke, -une"},
  109:{kind:"ending",  suffix:"ER", suffixSound:"er", teaches:["ER"]},
  110:{kind:"review",  teaches:["OU","OW","OI","OY"],
       note:"cloud, flower, ground, brown — the /ow/ and /oy/ spellings"},

  /* ── Map 12 ── */
  111:{kind:"blend",   rime:"ASH"},
  112:{kind:"blend",   rime:"EED"},
  113:{kind:"blend",   rime:"UMP"},
  114:{kind:"pattern", pattern:"vowelTeam", teaches:["OA"], rime:"OAT"},
  115:{kind:"pattern", pattern:"vowelTeam", teaches:["IR","UR"], machine:false,
       note:"family mixes -ird, -irt, -irst; ur is the same sound"},
  116:{kind:"pattern", pattern:"vowelTeam", teaches:["IGH","Y_I"], rime:"IGHT",
       note:"my, why and sky end with the same sound as light"},
  117:{kind:"grapheme", teaches:[], position:"final", rime:"ING"},
  118:{kind:"pattern", pattern:"vowelTeam", teaches:["OR","AR","AW"], rime:"ORN",
       note:"the r-controlled set finished: corn, car, saw"},
  119:{kind:"blend",   rime:"AP"},
  120:{kind:"review",  teaches:["AY","AI"],
       note:"ay and ai — one sound, two spellings, a proper pair"}
};
