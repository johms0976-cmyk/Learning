/* ============================================================
   PHON  ·  how each grapheme is spoken
   ------------------------------------------------------------
   Three separate things used to be one string, which is why the
   stop consonants ended up with a schwa on them:

     file   the recording's filename. UNCHANGED, so every
            recording already made still resolves.
     tts    what the computer voice says when no recording
            exists. null for the stops, because no speech engine
            can say an unvoiced clipped consonant — it will
            always add "uh". Where this is null the engine falls
            back to the keyword instead.
     say    what the CHILD sees and hears named. "/t/", never
            "tuh".
     type   cont      can be held: mmmm, sssss
            stop      cannot be held: /t/ /b/ /k/. MUST be
                      recorded. Held or schwa'd, blending fails.
            vowel     short vowel
            digraph   two letters, one sound
   ============================================================ */

module.exports = {
  /* ── continuants: safe for the computer voice ───────────── */
  M:{file:"mmm", tts:"mmmm",   say:"/m/", type:"cont"},
  S:{file:"sss", tts:"sssss",  say:"/s/", type:"cont"},
  F:{file:"fff", tts:"ffff",   say:"/f/", type:"cont"},
  N:{file:"nnn", tts:"nnnn",   say:"/n/", type:"cont"},
  R:{file:"rrr", tts:"rrrr",   say:"/r/", type:"cont"},
  L:{file:"lll", tts:"llll",   say:"/l/", type:"cont"},
  V:{file:"vvv", tts:"vvvv",   say:"/v/", type:"cont"},
  Z:{file:"zzz", tts:"zzzz",   say:"/z/", type:"cont"},
  H:{file:"huh", tts:"hhh",    say:"/h/", type:"cont"},
  W:{file:"wuh", tts:"wwww",   say:"/w/", type:"cont"},
  Y:{file:"yuh", tts:"yyyy",   say:"/y/", type:"cont"},

  /* ── stops and affricates: a recording is required ──────── */
  T:{file:"tuh", tts:null, say:"/t/",  type:"stop"},
  B:{file:"buh", tts:null, say:"/b/",  type:"stop"},
  C:{file:"kuh", tts:null, say:"/k/",  type:"stop"},
  K:{file:"kuh", tts:null, say:"/k/",  type:"stop"},
  D:{file:"duh", tts:null, say:"/d/",  type:"stop"},
  G:{file:"guh", tts:null, say:"/g/",  type:"stop"},
  P:{file:"puh", tts:null, say:"/p/",  type:"stop"},
  J:{file:"juh", tts:null, say:"/j/",  type:"stop"},
  Q:{file:"kwuh",tts:null, say:"/kw/", type:"stop"},
  X:{file:"ks",  tts:null, say:"/ks/", type:"stop"},
  CH:{file:"chh",tts:null, say:"/ch/", type:"stop", digraph:true},

  /* ── short vowels ───────────────────────────────────────── */
  A:{file:"aah", tts:"aaa",  say:"/a/", type:"vowel"},
  E:{file:"eh",  tts:"eh",   say:"/e/", type:"vowel"},
  I:{file:"ih",  tts:"ih",   say:"/i/", type:"vowel"},
  O:{file:"oh",  tts:"awe",  say:"/o/", type:"vowel",
     fixed:"was taught as 'oh' — that is LONG o. Short o as in hot."},
  U:{file:"uh",  tts:"uh",   say:"/u/", type:"vowel"},

  /* ── digraphs and vowel teams ───────────────────────────── */
  SH:{file:"shh", tts:"shhh",  say:"/sh/", type:"cont",  digraph:true},
  TH:{file:"thh", tts:"thhh",  say:"/th/", type:"cont",  digraph:true},
  NG:{file:"ing", tts:"nnng",  say:"/ng/", type:"cont",  digraph:true},
  EE:{file:"eee", tts:"eee",   say:"/ee/", type:"vowel", digraph:true},
  OO:{file:"ooo", tts:"oooo",  say:"/oo/", type:"vowel", digraph:true},
  EA:{file:"eee", tts:"eee",   say:"/ea/", type:"vowel", digraph:true},
  ER:{file:"er",  tts:"err",   say:"/er/", type:"vowel", digraph:true},
  IR:{file:"er",  tts:"err",   say:"/ir/", type:"vowel", digraph:true},
  OR:{file:"or",  tts:"or",    say:"/or/", type:"vowel", digraph:true},
  OA:{file:"oh",  tts:"oh",    say:"/oa/", type:"vowel", digraph:true},
  IGH:{file:"eye",tts:"eye",   say:"/igh/",type:"vowel", digraph:true},
  AY:{file:"ay",  tts:"ay",    say:"/ay/", type:"vowel", digraph:true}
};
