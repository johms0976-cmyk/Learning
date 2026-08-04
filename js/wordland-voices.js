/* ============================================================
   WORD LAND · VOICES
   ------------------------------------------------------------
   Which voice the games speak in. One grown-up setting, shared
   by the hub and all three games.

   Every recording lives twice over: once in the plain folders
   that were there before, and once inside a voice pack.

       audio/wordland/words/cat.mp3                ← the original
       audio/wordland/voices/uk-male/words/cat.mp3 ← British man
       audio/wordland/voices/us-female/words/cat.mp3

   The folders inside a pack are exactly the ones outside it —
   letters, sounds, words, story, phrases, praise, players,
   names — so a pack is a straight copy of the tree in a
   different voice, and nothing has to be renamed.

   When a file is missing from the chosen pack the game falls
   back to the original folder, and then to the computer voice.
   That means you can record a pack a handful of files at a
   time and the games never break in the middle.

   Adding a fifth voice is one line in VOICES below plus a
   folder of the same name.
   ============================================================ */

const WLVoices = (function () {

  const KEY = 'readinggames-voice';

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

  const IDS = new Set(VOICES.map(v => v.id));

  /* Which voice a brand-new install starts on. '' keeps today's
     behaviour exactly as it is until somebody chooses otherwise. */
  const DEFAULT = 'uk-male';

  /* ── storage that never throws ──────────────────────────
     Same reason as profiles.js: localStorage is blocked in some
     private-browsing modes, and a blocked setting should mean
     "back to the default", not an error on a child's screen. */
  let mem = null, hasLS = false;
  try { localStorage.setItem('__v', '1'); localStorage.removeItem('__v'); hasLS = true } catch (e) {}

  function read() {
    if (hasLS) { try { const v = localStorage.getItem(KEY); if (v != null) return v } catch (e) {} }
    return mem == null ? DEFAULT : mem;
  }
  function write(v) {
    mem = v;
    if (hasLS) { try { localStorage.setItem(KEY, v) } catch (e) {} }
  }

  let chosen = read();
  if (!IDS.has(chosen)) chosen = DEFAULT;

  const listeners = [];

  /* ── the computer voice should match ────────────────────
     Most of the pack will be missing while it is being
     recorded, so the stand-in voice matters. Ask the browser
     for one in the right country, and prefer one of the names
     it is known to ship for that sex. If nothing matches we
     set the language alone, which still fixes the accent on
     every device that has more than one English voice. */
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

  let cachedFor = null, cachedVoice = null;

  function speechVoice() {
    const v = def();
    if (!window.speechSynthesis || !v.lang) return null;
    if (cachedFor === v.id && cachedVoice) return cachedVoice;

    let all = [];
    try { all = speechSynthesis.getVoices() || [] } catch (e) { return null }
    if (!all.length) return null;                     // not loaded yet — try again next time

    const tag = v.lang.toLowerCase();
    const sameLang = all.filter(x => String(x.lang || '').toLowerCase().replace('_', '-').startsWith(tag));
    const pool = sameLang.length ? sameLang : all;

    const wanted = (KNOWN[v.lang] && KNOWN[v.lang][v.sex]) || [];
    let pick = pool.find(x => wanted.some(n => String(x.name || '').indexOf(n) === 0))
            || pool.find(x => wanted.some(n => String(x.name || '').indexOf(n) >= 0))
            || sameLang[0]
            || null;

    cachedFor = v.id; cachedVoice = pick;
    return pick;
  }

  /* Voices arrive late on some browsers, so clear the cache when
     the list changes and let the next line pick again. */
  try {
    if (window.speechSynthesis && 'onvoiceschanged' in speechSynthesis) {
      speechSynthesis.onvoiceschanged = () => { cachedFor = null; cachedVoice = null };
    }
  } catch (e) {}

  function def(id) {
    const want = id == null ? chosen : id;
    return VOICES.find(v => v.id === want) || VOICES[0];
  }

  return {
    /* the id, which is also the folder name: '' | 'uk-male' | … */
    current: () => chosen,

    /* everything known about the chosen voice (or another one) */
    def,

    /* the list, for drawing the chooser */
    all: () => VOICES.slice(),

    /* 'voices/uk-male/' or '' — what goes in front of a path */
    prefix: id => { const v = (id == null ? chosen : id); return v ? 'voices/' + v + '/' : '' },

    /* every pack a file may be looked for in, best first.
       The chosen pack, then the originals. */
    order: () => (chosen ? [chosen, ''] : ['']),

    set(id) {
      if (!IDS.has(id) || id === chosen) return chosen;
      chosen = id;
      write(id);
      cachedFor = null; cachedVoice = null;
      listeners.forEach(fn => { try { fn(id) } catch (e) {} });
      return chosen;
    },

    onChange(fn) { if (typeof fn === 'function') listeners.push(fn) },

    /* the language tag and the SpeechSynthesisVoice to stand in
       with while a pack is still being recorded */
    lang: () => def().lang,
    speechVoice,

    /* a friendly name for a pack, for the grown-ups panel */
    label: id => def(id).label,

    KEY, DEFAULT
  };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = { WLVoices };
