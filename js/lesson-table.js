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
  30:{kind:"grapheme", teaches:["Q"]},

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
  49:{kind:"family",   rime:"ILL"},
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
  59:{kind:"ending",   suffix:"Y", suffixSound:"eee"},
  60:{kind:"family",   rime:"OCK"},

  /* ── Map 7 ── */
  61:{kind:"sight"},
  62:{kind:"family",   rime:"UT"},
  63:{kind:"family",   rime:"UG"},
  64:{kind:"family",   rime:"UCK"},
  65:{kind:"family",   rime:"UCK"},
  66:{kind:"digraph",  teaches:["TH"], onset:"TH"},
  67:{kind:"sight"},
  68:{kind:"family",   rime:"UN"},
  69:{kind:"family",   rime:"UG"},
  70:{kind:"review"},

  /* ── Map 8 ── */
  71:{kind:"sight"},
  72:{kind:"grapheme", teaches:["NG"], position:"final", rime:"ING"},
  73:{kind:"family",   rime:"ED"},
  74:{kind:"family",   rime:"ET"},
  75:{kind:"family",   rime:"ENT"},
  76:{kind:"family",   rime:"EG"},
  77:{kind:"family",   rime:"EN"},
  78:{kind:"sight"},
  79:{kind:"family",   rime:"ELL"},
  80:{kind:"review"},

  /* ── Map 9 ── */
  81:{kind:"vowels"},
  82:{kind:"family",   rime:"IE"},
  83:{kind:"pattern",  pattern:"magicE", rime:"INE"},
  84:{kind:"pattern",  pattern:"magicE", machine:false, note:"family mixes -ike and -ide"},
  85:{kind:"digraph",  teaches:["SH"], onset:"SH"},
  86:{kind:"digraph",  teaches:[],     onset:"SH"},
  87:{kind:"pattern",  pattern:"magicE", rime:"ITE"},
  88:{kind:"digraph",  teaches:["CH"], onset:"CH"},
  89:{kind:"digraph",  teaches:[],     onset:"TH"},
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
  107:{kind:"pattern", pattern:"vowelTeam", teaches:["EA"], rime:"EACH"},
  108:{kind:"pattern", pattern:"magicE", machine:false, note:"family mixes -ube, -uke, -une"},
  109:{kind:"ending",  suffix:"ER", suffixSound:"er", teaches:["ER"]},
  110:{kind:"review"},

  /* ── Map 12 ── */
  111:{kind:"blend",   rime:"ASH"},
  112:{kind:"blend",   rime:"EED"},
  113:{kind:"blend",   rime:"UMP"},
  114:{kind:"pattern", pattern:"vowelTeam", teaches:["OA"], rime:"OAT"},
  115:{kind:"pattern", pattern:"vowelTeam", teaches:["IR"], machine:false, note:"family mixes -ird, -irt, -irst"},
  116:{kind:"pattern", pattern:"vowelTeam", teaches:["IGH"], rime:"IGHT"},
  117:{kind:"grapheme", teaches:[], position:"final", rime:"ING"},
  118:{kind:"pattern", pattern:"vowelTeam", teaches:["OR"], rime:"ORN"},
  119:{kind:"blend",   rime:"AP"},
  120:{kind:"review",  teaches:["AY"]}
};
