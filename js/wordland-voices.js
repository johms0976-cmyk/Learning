/* ============================================================
   WORD LAND · VOICES
   ------------------------------------------------------------
   Which voice the games speak in. There are TWO settings here,
   and they are deliberately independent of each other:

     the reading voice   letters, sounds, words, the story
     Zib's voice         everything the mascot says — every
                         instruction, every cheer, every praise

   The reading voice is a teacher: it has to say *sss* cleanly
   and read a chapter without acting. Zib is a friend, and a
   child should be able to tell the two apart the moment they
   speak. So Zib gets his own pack, chosen separately, and a mum
   and a dad version to pick from.

   Every recording lives inside a voice pack:

       audio/wordland/voices/uk-male/words/cat.mp3       reading
       audio/wordland/voices/mascot-female/praise/well-done.mp3   Zib

   The folders inside a pack are exactly the ones outside it —
   letters, sounds, words, story, phrases, praise, players,
   names — so a pack is a straight copy of the tree in a
   different voice, and nothing has to be renamed.

   A mascot pack only ever needs four of them:

       phrases/   every line Zib says, finished
       praise/    the same cheers recorded RISING, to run into
                  a name — "Well done," not "Well done!"
       names/     the child's name, in Zib's voice
       players/   a name recorded for one seat

   When a file is missing from Zib's pack the game falls back to
   the reading pack, then to the plain folders, then to the
   computer voice. That means you can record Zib a handful of
   files at a time and the games never break in the middle — the
   day before you record him he sounds exactly as he does today.

   Adding another voice is one line in VOICES or MASCOTS below
   plus a folder of the same name.
   ============================================================ */

const WLVoices = (function () {

  const KEY        = 'readinggames-voice';
  const MASCOT_KEY = 'readinggames-mascot-voice';

  /* id ''  is the plain audio/wordland/ folders — everything
     recorded before packs existed. Keeping it in the list means
     a grown-up can always get back to what they already have. */
  const VOICES = [
    { id: '',          label: 'Original recordings', where: '',       lang: 'en-GB',
      note: 'The files already in audio/wordland/' },
    { id: 'uk-female', label: 'British woman',  where: 'Britain', lang: 'en-GB', sex: 'f', flag: '🇬🇧' },
    { id: 'uk-male',   label: 'British man',    where: 'Britain', lang: 'en-GB', sex: 'm', flag: '🇬🇧' },
    { id: 'us-female', label: 'American woman', where: 'America', lang: 'en-US', sex: 'f', flag: '🇺🇸' },
    { id: 'us-male',   label: 'American man',   where: 'America', lang: 'en-US', sex: 'm', flag: '🇺🇸' }
  ];

  /* ── Zib's own voice ──────────────────────────────────────
     Nothing here overlaps with the list above, on purpose: the
     whole point is that Zib is a different person from the one
     reading the words. Two of them, because in most houses
     there are two grown-ups and a child should get to pick.

     id '' means "don't use a separate voice" — Zib falls in
     with the reading voice, which is what the games did before
     this setting existed.                                    */
  const MASCOTS = [
    { id: '',              label: 'Same as the reading voice', flag: '🔁',
      note: 'Zib speaks in whichever voice is chosen above' },
    { id: 'mascot-female', label: 'Zib — a mum', where: 'home', lang: 'en-GB', sex: 'f', flag: '👩',
      note: 'audio/wordland/voices/mascot-female/' },
    { id: 'mascot-male',   label: 'Zib — a dad', where: 'home', lang: 'en-GB', sex: 'm', flag: '👨',
      note: 'audio/wordland/voices/mascot-male/' }
  ];

  const IDS  = new Set(VOICES.map(v => v.id));
  const MIDS = new Set(MASCOTS.map(v => v.id));

  const ALL = VOICES.concat(MASCOTS.filter(m => m.id));

  /* Which voice a brand-new install starts on. */
  const DEFAULT = 'uk-male';

  /* Zib starts as a mum. Safe even before a single file exists:
     an empty pack falls straight through to the reading voice,
     so this changes nothing until you record him. */
  const MASCOT_DEFAULT = 'mascot-female';

  /* ── storage that never throws ──────────────────────────
     Same reason as profiles.js: localStorage is blocked in some
     private-browsing modes, and a blocked setting should mean
     "back to the default", not an error on a child's screen. */
  const mem = {};
  let hasLS = false;
  try { localStorage.setItem('__v', '1'); localStorage.removeItem('__v'); hasLS = true } catch (e) {}

  function read(key, fallback) {
    if (hasLS) { try { const v = localStorage.getItem(key); if (v != null) return v } catch (e) {} }
    return mem[key] == null ? fallback : mem[key];
  }
  function write(key, v) {
    mem[key] = v;
    if (hasLS) { try { localStorage.setItem(key, v) } catch (e) {} }
  }

  let chosen = read(KEY, DEFAULT);
  if (!IDS.has(chosen)) chosen = DEFAULT;

  let mascot = read(MASCOT_KEY, MASCOT_DEFAULT);
  if (!MIDS.has(mascot)) mascot = MASCOT_DEFAULT;

  const listeners = [];
  function tell(which, id) {
    listeners.forEach(fn => { try { fn(id, which) } catch (e) {} });
  }

  /* ── the computer voice should match ────────────────────
     Most of a pack will be missing while it is being recorded,
     so the stand-in voice matters. Ask the browser for one in
     the right country, and prefer one of the names it is known
     to ship for that sex. If nothing matches we set the
     language alone, which still fixes the accent on every
     device that has more than one English voice.

     Zib gets the same treatment with one extra rule: never the
     same synthesised voice as the reading one. Two characters
     that sound identical is the thing this whole file exists to
     avoid, and it should hold before the recordings land as
     well as after.                                            */
  const KNOWN = {
    'en-GB': {
      f: ['Kate', 'Serena', 'Stephanie', 'Martha', 'Libby', 'Sonia', 'Hazel', 'Google UK English Female'],
      m: ['Daniel', 'Oliver', 'Arthur', 'Ryan', 'George', 'Google UK English Male']
    },
    'en-US': {
      f: ['Samantha', 'Ava', 'Allison', 'Susan', 'Zira', 'Jenny', 'Aria', 'Google US English'],
      m: ['Alex', 'Tom', 'Aaron', 'Fred', 'David', 'Guy', 'Nathan']
    }
  };

  const cache = {};        // id -> SpeechSynthesisVoice | null
  let cacheKey = null;     // the pair the cache was built for

  function pickVoice(v, avoid) {
    if (!window.speechSynthesis || !v || !v.lang) return null;

    let all = [];
    try { all = speechSynthesis.getVoices() || [] } catch (e) { return null }
    if (!all.length) return null;                     // not loaded yet — try again next time

    const tag = v.lang.toLowerCase();
    const sameLang = all.filter(x => String(x.lang || '').toLowerCase().replace('_', '-').startsWith(tag));
    let pool = sameLang.length ? sameLang : all;

    /* Keep Zib off the reading voice if there is anything else
       at all. If the device only ships one English voice we let
       them share it rather than say nothing. */
    if (avoid) {
      const other = pool.filter(x => x !== avoid);
      if (other.length) pool = other;
    }

    const wanted = (KNOWN[v.lang] && KNOWN[v.lang][v.sex]) || [];
    return pool.find(x => wanted.some(n => String(x.name || '').indexOf(n) === 0))
        || pool.find(x => wanted.some(n => String(x.name || '').indexOf(n) >= 0))
        || pool[0]
        || null;
  }

  function build() {
    const k = chosen + '|' + mascot;
    if (cacheKey === k) return;
    cacheKey = k;
    cache[''] = null;
    const readV = pickVoice(def(chosen), null);
    cache.read = readV;
    cache.mascot = mascot ? pickVoice(defMascot(mascot), readV) : readV;
  }

  /* who: 'mascot' for anything Zib says, anything else for the
     reading voice. */
  function speechVoice(who) {
    if (!window.speechSynthesis) return null;
    build();
    return (who === 'mascot' ? cache.mascot : cache.read) || null;
  }

  /* Voices arrive late on some browsers, so clear the cache when
     the list changes and let the next line pick again. */
  try {
    if (window.speechSynthesis && 'onvoiceschanged' in speechSynthesis) {
      speechSynthesis.onvoiceschanged = () => { cacheKey = null };
    }
  } catch (e) {}

  function def(id) {
    const want = id == null ? chosen : id;
    return ALL.find(v => v.id === want) || VOICES[0];
  }
  function defMascot(id) {
    const want = id == null ? mascot : id;
    return MASCOTS.find(v => v.id === want) || MASCOTS[0];
  }

  /* The pack a mascot line falls back through. Zib first, then
     whatever the reading voice is, then the plain folders. With
     no mascot chosen this is exactly the reading order, so the
     setting can be turned off and nothing else has to know. */
  function mascotOrder() {
    const out = [];
    if (mascot) out.push(mascot);
    if (chosen) out.push(chosen);
    out.push('');
    return out.filter((v, i) => out.indexOf(v) === i);
  }

  return {
    /* the id, which is also the folder name: '' | 'uk-male' | … */
    current: () => chosen,

    /* Zib's pack: '' | 'mascot-female' | 'mascot-male' */
    mascot: () => mascot,

    /* everything known about a voice (or the chosen one) */
    def, defMascot,

    /* the lists, for drawing the choosers */
    all: () => VOICES.slice(),
    mascots: () => MASCOTS.slice(),

    /* is this pack one of Zib's? — the grown-ups panel only asks
       a mascot pack about the folders a mascot pack has */
    isMascot: id => MIDS.has(id) && !!id,

    /* 'voices/uk-male/' or '' — what goes in front of a path */
    prefix: id => { const v = (id == null ? chosen : id); return v ? 'voices/' + v + '/' : '' },

    /* every pack a file may be looked for in, best first */
    order: () => (chosen ? [chosen, ''] : ['']),
    mascotOrder,

    set(id) {
      if (!IDS.has(id) || id === chosen) return chosen;
      chosen = id;
      write(KEY, id);
      cacheKey = null;
      tell('reading', id);
      return chosen;
    },

    setMascot(id) {
      if (!MIDS.has(id) || id === mascot) return mascot;
      mascot = id;
      write(MASCOT_KEY, id);
      cacheKey = null;
      tell('mascot', id);
      return mascot;
    },

    onChange(fn) { if (typeof fn === 'function') listeners.push(fn) },

    /* the language tag and the SpeechSynthesisVoice to stand in
       with while a pack is still being recorded */
    lang: who => (who === 'mascot' && mascot ? defMascot().lang : def().lang) || 'en-GB',
    speechVoice,

    /* a friendly name for a pack, for the grown-ups panel */
    label: id => (MIDS.has(id) && id ? defMascot(id) : def(id)).label,

    KEY, DEFAULT, MASCOT_KEY, MASCOT_DEFAULT
  };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = { WLVoices };
