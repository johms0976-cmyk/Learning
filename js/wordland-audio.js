/* ============================================================
   WORD LAND · AUDIO   (shared by all three games)
   ------------------------------------------------------------
   Plays your recordings when they exist and falls back to the
   computer voice when they don't, so the games always work —
   before, during and after you finish recording.

     audio/wordland/sounds/sss.mp3       WLAudio.sound('S')
     audio/wordland/letters/a.mp3        WLAudio.letter('A')   ← the NAME "ay"
     audio/wordland/words/monkey.mp3     WLAudio.word('MONKEY')
     audio/wordland/story/chapter1.mp3   WLAudio.chapter(1, 1, text)
     audio/wordland/phrases/well-done.mp3        WLAudio.line('Well done!')

   Word Land, Spell It and Write It all load this one file, so a
   recording dropped into audio/wordland/ is heard in all three.

   Map 1's chapter files keep their original names, so anything
   already recorded still plays. Later maps are prefixed:
   story/map2-chapter1.mp3.

   Optional: audio/wordland/manifest.json — a JSON array of the
   files you have recorded, e.g.
     ["sounds/sss.mp3","words/monkey.mp3","phrases/well-done.mp3"]
   When present it is trusted completely, which avoids the
   browser asking for files that aren't there. Generate it with
   tools/make-manifest.sh.
   ============================================================ */

const WLAudio = (function () {

  const BASE = 'audio/wordland/';
  const PROBE_TIMEOUT = 1800;   // ms before we stop waiting for a file
  const PATIENCE = 350;         // ms a child will wait before we just speak
  const VOICE = { rate: 0.62, pitch: 1.12, soundRate: 0.55, storyRate: 0.62 };

  /* ── the spoken lines you can record ──────────────────────
     Every fixed thing the games say out loud. A line listed
     here is looked for in phrases/ first; anything not listed
     (a sentence made up on the spot, a child's own word) goes
     straight to the computer voice with no delay.

     Add a line here and it becomes recordable. The file name is
     the line, lower case, punctuation dropped, spaces turned
     into dashes — "Well done!" becomes phrases/well-done.mp3.
     ────────────────────────────────────────────────────────── */
  const PHRASE_LINES = [
    /* Word Land — when an answer is wrong */
    'Try again', 'Not that one', 'Have another go',
    /* Word Land — when an answer is right */
    'Yes!', 'Nice one!', 'You got it!', 'Brilliant!', 'Well done!', 'Superstar!',
    /* Word Land — finishing a place */
    'You did it! A new chapter for your storybook.',
    /* Write It */
    'You wrote it!', 'Next letter', 'Good',
    /* Spell It — instructions */
    'Find the words that rhyme',
    'Pop the letter', 'Paint every letter', 'Drive through the letter',
    'You painted a',
    /* Spell It — when a round is won */
    'Wonderful!', 'Great job!', 'You did it!', 'Hooray!', 'Amazing!',
    /* the hub — a new child */
    'Welcome to your learning journey!', 'What is your name?'
  ];

  /* ── praise with the child's name on the end ──────────────
     These live in their own folder because they are said
     differently: each one runs straight into a name, so record
     them RISING, as though the sentence has not finished —
     "Well done," not "Well done!".

         praise/well-done.mp3  +  players/player1.mp3
         →  "Well done, Sarah"

     If either half is missing the whole line is spoken by the
     computer voice instead, so the two voices never meet in the
     middle of a sentence.
     ────────────────────────────────────────────────────────── */
  const PRAISE_LINES = [
    'Hello',      'Yes',        'Nice one',   'You got it',
    'Brilliant',  'Well done',  'Superstar',  'Wonderful',
    'Great job',  'You did it', 'Hooray',     'Amazing',
    'Keep going', 'Off you go'
  ];

  /* How often a cheer carries the child's name. Every single time
     wears thin fast; roughly one in three still feels personal. */
  const NAME_CHANCE = 0.34;

  // a short, valid, silent mp3 — used only to wake the audio up on first tap
  const SILENT_MP3 = 'data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjYwLjE2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAABAAAAfgAkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKStra2tra2tra2tra2tra2tra2tra2tra2ttvb29vb29vb29vb29vb29vb29vb29vb29v/////////////////////////////////AAAAAExhdmM2MC4zMQAAAAAAAAAAAAAAACQDAAAAAAAAAAH4QRp1GwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxDsAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxHYAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxLEAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';

  const known = new Map();      // url -> true/false (does the file exist?)
  let manifest = null;          // Set of relative paths, or null if none
  let el = null;                // one reusable element, so iOS stays unlocked
  let unlocked = false;
  let muted = false;
  let token = 0;                // lets a new sound cancel the one before it
  let mode = 'unknown';         // 'manifest' | 'files' | 'none'

  /* ── file naming ─────────────────────────────────────── */
  function slug(s) {
    return String(s).toLowerCase().trim()
      .replace(/['’.,!?]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9_-]/g, '')   // drops emoji and anything else odd
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  function url(kind, name) { return BASE + kind + '/' + slug(name) + '.mp3'; }
  function rel(u) { return u.slice(BASE.length); }

  /* The lines above, as file names, so line() can tell in one
     lookup whether a piece of text is something you may have
     recorded or just something said on the spot. */
  const PHRASE_SLUGS = new Set(PHRASE_LINES.map(slug));
  const PRAISE_SLUGS = new Set(PRAISE_LINES.map(slug));

  /* Who is playing, if the hub has been through. Profiles is
     optional — a game opened on its own still works, it just
     never says a name. */
  function playerSlot() {
    try { return (typeof Profiles !== 'undefined' && Profiles.slot()) || 0 } catch (e) { return 0 }
  }
  function playerName() {
    try { return (typeof Profiles !== 'undefined' && Profiles.name()) || '' } catch (e) { return '' }
  }

  /* Speech reads emoji aloud on some devices, so strip them. */
  function plainText(s) {
    return String(s == null ? '' : s)
      .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{2190}-\u{21FF}]/gu, '')
      .replace(/\s+/g, ' ').trim();
  }

  /* Map 1 keeps chapter1…chapter10 so old recordings still match. */
  function chapterName(mapNo, no) {
    return (Number(mapNo) === 1 ? '' : 'map' + mapNo + '-') + 'chapter' + no;
  }

  /* Word Land's letter→sound table lives in wordland-data.js.
     Spell It and Write It can be opened without it, so never
     assume it is there. */
  function soundName(letter) {
    const up = String(letter).toUpperCase();
    if (typeof SOUND !== 'undefined' && SOUND && SOUND[up]) return SOUND[up];
    return up;
  }

  /* ── does this file exist? ───────────────────────────── */
  function available(u) {
    if (manifest) return Promise.resolve(manifest.has(rel(u)));
    if (known.has(u)) return Promise.resolve(known.get(u));
    return headProbe(u).then(found => {
      if (found === null) return audioProbe(u);     // couldn't ask — listen instead
      known.set(u, found);
      return found;
    });
  }

  /* Just asking the server is far more reliable than loading the audio —
     iPad Safari ignores preload, so an audio probe never reports back and
     every file looks missing. Returns null when we can't ask at all
     (opened from a file:// path, offline, blocked), and then we fall back
     to the old way. */
  function headProbe(u) {
    if (!window.fetch || location.protocol === 'file:') return Promise.resolve(null);
    return fetch(u, { method: 'HEAD', cache: 'no-store' })
      .then(r => r.ok ? true : (r.status === 404 || r.status === 403) ? false : null)
      .catch(() => null);
  }

  function audioProbe(u) {
    return new Promise(resolve => {
      let settled = false;
      const probe = new Audio();
      const finish = (found, remember) => {
        if (settled) return;
        settled = true;
        if (remember !== false) known.set(u, found);
        probe.removeAttribute('src');
        try { probe.load() } catch (e) {}
        resolve(found);
      };
      probe.preload = 'auto';
      probe.addEventListener('loadedmetadata', () => finish(true), { once: true });
      probe.addEventListener('canplaythrough', () => finish(true), { once: true });
      probe.addEventListener('error', () => finish(false), { once: true });
      setTimeout(() => finish(false, false), PROBE_TIMEOUT);  // slow, not missing
      probe.src = u;
    });
  }

  /* Waiting on a missing file is worse than speaking straight away, so we
     give the lookup a moment and move on. The lookup finishes in the
     background and is remembered, so the next time that word comes up the
     recording is already known and plays instantly. */
  function availableSoon(u) {
    if (mode === 'none') return Promise.resolve(false);
    if (manifest || known.has(u)) return available(u);
    return Promise.race([
      available(u),
      new Promise(res => setTimeout(() => res(false), PATIENCE))
    ]);
  }

  /* ── the computer voice, used when a recording is missing ── */
  function speak(text, rate, pitch) {
    const t = plainText(text);
    if (!t || muted) return Promise.resolve();
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) return Promise.resolve();
    try {
      return new Promise(res => {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(t);
        u.rate = rate || VOICE.rate;
        u.pitch = pitch || VOICE.pitch;
        u.onend = res; u.onerror = res;
        speechSynthesis.speak(u);
      });
    } catch (e) { return Promise.resolve() }
  }

  /* ── playing a file ──────────────────────────────────── */
  function element() {
    if (!el) { el = new Audio(); el.preload = 'auto'; }
    return el;
  }
  function playFile(u) {
    const a = element();
    return new Promise(resolve => {
      const clean = () => { a.onended = null; a.onerror = null };
      a.onended = () => { clean(); resolve(true) };
      a.onerror = () => { known.set(u, false); clean(); resolve(false) };
      a.src = u;
      const p = a.play();
      if (p && p.catch) p.catch(err => {
        // A blocked autoplay is not a missing file — don't blame the recording.
        if (!err || err.name !== 'NotAllowedError') known.set(u, false);
        clean(); resolve(false);
      });
    });
  }

  async function say(kind, name, fallbackText, rate, pitch) {
    if (muted) return;
    stop();                    // silence whatever is playing FIRST — stop() bumps the token
    const mine = ++token;      // ...then claim this turn, so our number is the current one
    const u = url(kind, name);
    if (await availableSoon(u)) {
      if (mine !== token) return;                 // something newer took over
      if (await playFile(u)) return;
    }
    if (mine !== token) return;
    return speak(fallbackText == null ? name : fallbackText, rate, pitch);
  }

  /* ── several recordings, one after another ───────────────
     Used for lines built out of parts, e.g. "Pop the letter"
     plus the letter A. It is all or nothing: if any part is
     missing we speak the whole line in the computer voice
     rather than switch voices halfway through a sentence.

       WLAudio.seq([['phrases','Pop the letter'], ['letters','A']],
                   'Pop the letter A');
     ────────────────────────────────────────────────────────── */
  async function seq(parts, fallbackText, rate, pitch) {
    if (muted) return;
    const urls = (parts || []).map(p => url(p[0], p[1]));
    stop();
    const mine = ++token;
    if (urls.length) {
      const found = await Promise.all(urls.map(availableSoon));
      if (mine !== token) return;
      if (found.every(Boolean)) {
        for (const u of urls) {
          if (mine !== token) return;
          if (!await playFile(u)) break;          // a file went missing mid-line
        }
        if (mine === token) return;
      }
    }
    if (mine !== token) return;
    return speak(fallbackText, rate, pitch);
  }

  function stop() {
    token++;
    if (el) { try { el.pause(); el.currentTime = 0 } catch (e) {} }
    if (window.speechSynthesis) { try { speechSynthesis.cancel() } catch (e) {} }
  }

  /* ── iPad needs the first sound to come from a real tap ── */
  function unlock() {
    if (unlocked) return;
    unlocked = true;
    // A real, complete (silent) mp3 — a truncated one fails to decode and
    // leaves the element locked on iPad.
    const a = element();
    a.src = SILENT_MP3;
    const p = a.play();
    if (p && p.catch) p.catch(() => {});
    try { a.pause(); a.currentTime = 0 } catch (e) {}

    // The computer voice needs the same blessing, and it has to happen
    // inside the tap — not in a setTimeout a moment later.
    try {
      if (window.speechSynthesis && window.SpeechSynthesisUtterance) {
        const w = new SpeechSynthesisUtterance(' ');
        w.volume = 0;
        speechSynthesis.speak(w);
      }
    } catch (e) {}
  }

  /* ── what have we got? ───────────────────────────────── */
  function haveNodes() { return typeof ALL_NODES !== 'undefined' && Array.isArray(ALL_NODES) && ALL_NODES.length }

  async function init() {
    try {
      const r = await fetch(BASE + 'manifest.json', { cache: 'no-cache' });
      if (r.ok) {
        const list = await r.json();
        if (Array.isArray(list) && list.length) {
          manifest = new Set(list.map(p => String(p).replace(/^\.?\//, '')));
          mode = 'manifest';
          return mode;
        }
      }
    } catch (e) { /* no manifest — we'll look for files ourselves */ }

    // Before the first recording exists, asking for every file is pure delay.
    // A few probes tell us whether recording has started at all. Spell It and
    // Write It can run without wordland-data.js, so pick sentinels that exist
    // either way.
    const sentinels = [url('phrases', 'Well done!'), url('letters', 'a')];
    if (haveNodes()) {
      const first = ALL_NODES[0];
      sentinels.push(url('sounds', soundName(first.letters[0])));
      sentinels.push(url('words', first.vocab[0].w));
      sentinels.push(url('story', chapterName(first.map, first.no)));
    } else {
      sentinels.push(url('words', 'cat'));
    }
    const found = await Promise.all(sentinels.map(available));
    mode = found.some(Boolean) ? 'files' : 'none';
    return mode;
  }

  /* Call after dropping new recordings in without reloading the page. */
  async function rescan() {
    known.clear(); manifest = null; mode = 'unknown';
    return init();
  }

  /* ── warm up everything a place needs, before it starts ── */
  function filesFor(node, mapNo) {
    const jobs = [];
    node.letters.forEach(l => jobs.push(url('sounds', soundName(l))));
    node.vocab.forEach(v => jobs.push(url('words', v.w)));
    node.words.forEach(v => jobs.push(url('words', v.w)));
    node.family.forEach(v => jobs.push(url('words', v.w)));
    node.hfw.forEach(h => jobs.push(url('words', h.w)));
    (node.sentences || []).forEach(s => s.s.forEach(w => jobs.push(url('words', w))));
    jobs.push(url('story', chapterName(mapNo == null ? currentMapNo() : mapNo, node.no)));
    return jobs;
  }
  function currentMapNo(){ return (typeof CURRENT_MAP !== 'undefined' && CURRENT_MAP) ? CURRENT_MAP.no : 1 }

  function preloadNode(node, mapNo) {
    if (mode === 'none') return Promise.resolve([]);
    return Promise.all([...new Set(filesFor(node, mapNo))].map(available));
  }
  /* Just the first place of a map — enough to feel instant, not enough to stall. */
  function preloadMap(map) {
    if (mode === 'none' || !map || !map.nodes || !map.nodes.length) return Promise.resolve([]);
    return preloadNode(map.nodes[0], map.no);
  }

  /* ── which recordings have landed? (grown-ups panel) ──── */
  function expected() {
    const out = { sounds: new Set(), letters: new Set(), words: new Set(),
                  story: new Set(), phrases: new Set(), praise: new Set(), players: new Set() };

    PHRASE_LINES.forEach(p => out.phrases.add(slug(p)));
    PRAISE_LINES.forEach(p => out.praise.add(slug(p)));
    // one per child the hub can hold
    const seats = (typeof Profiles !== 'undefined' && Profiles.MAX) ? Profiles.MAX : 4;
    for (let i = 1; i <= seats; i++) out.players.add('player' + i);
    'abcdefghijklmnopqrstuvwxyz'.split('').forEach(c => out.letters.add(c));

    if (typeof spokenLetters === 'function') {
      spokenLetters().forEach(l => out.sounds.add(slug(soundName(l))));
    }
    if (haveNodes()) {
      ALL_NODES.forEach(n => {
        [...n.vocab, ...n.words, ...n.family].forEach(v => out.words.add(slug(v.w)));
        n.hfw.forEach(h => out.words.add(slug(h.w)));
        (n.sentences || []).forEach(s => s.s.forEach(w => out.words.add(slug(w))));
        out.story.add(chapterName(n.map, n.no));
      });
    }
    // the six shapes Spell It paints, said after "You painted a…"
    ['heart', 'star', 'tree', 'house', 'fish', 'boat'].forEach(w => out.words.add(w));

    const sorted = k => [...out[k]].sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
    return { sounds: sorted('sounds'), letters: sorted('letters'), words: sorted('words'),
             story: sorted('story'), phrases: sorted('phrases'),
             praise: sorted('praise'), players: sorted('players') };
  }

  async function report() {
    const want = expected(), jobs = [];
    for (const kind of ['sounds', 'letters', 'words', 'story', 'phrases', 'praise', 'players']) {
      for (const name of want[kind]) {
        const u = BASE + kind + '/' + name + '.mp3';
        jobs.push(
          mode === 'none'
            ? Promise.resolve({ kind, name, found: false })
            : available(u).then(found => ({ kind, name, found }))
        );
      }
    }
    const rows = await Promise.all(jobs);
    return {
      rows,
      found: rows.filter(r => r.found).length,
      total: rows.length,
      source: mode === 'manifest' ? 'from manifest.json'
            : mode === 'none' ? 'no recordings yet — using the computer voice'
            : 'checked file by file'
    };
  }

  return {
    init, rescan, unlock, stop, seq, preloadNode, preloadMap, expected, report,
    mode: () => mode,

    /* the sound a letter makes — sounds/mmm.mp3 */
    sound: (letter, fallbackText) =>
      say('sounds', soundName(letter), fallbackText == null ? soundName(letter) : fallbackText, VOICE.soundRate),

    /* the NAME of a letter — letters/m.mp3, said "em" */
    letter: (ch) => say('letters', ch, String(ch).toUpperCase(), 0.8, 1.15),

    /* a whole word — words/monkey.mp3 */
    word:  (w) => say('words', w, String(w).toLowerCase(), VOICE.rate),

    /* a story chapter — story/chapter1.mp3 */
    chapter: (mapNo, n, text) => say('story', chapterName(mapNo, n), text, VOICE.storyRate),

    /* anything the game says out loud. If the line is one of the
       fixed ones listed at the top it is looked for in phrases/
       first; anything else goes straight to the computer voice,
       with no waiting. */
    line: (text, rate, pitch) => {
      const s = slug(text);
      return PHRASE_SLUGS.has(s)
        ? say('phrases', s, text, rate || 0.8, pitch || 1.15)
        : speak(text, rate, pitch);
    },

    /* force a phrase lookup even for a line not in the list */
    phrase: (text, rate, pitch) => say('phrases', text, text, rate || 0.8, pitch || 1.15),

    /* the child's name, in your voice — players/player1.mp3 */
    player: (n, fallbackText) => {
      const i = n || playerSlot();
      if (!i) return Promise.resolve();
      return say('players', 'player' + i, fallbackText == null ? playerName() : fallbackText, 0.8, 1.15);
    },

    /* praise with the child's name on the end:
         cheer('Well done')  →  "Well done, Sarah"
       With nobody chosen, or no recordings yet, it still says
       something sensible — it just drops back to the plain line. */
    cheer: (text, rate, pitch) => {
      const s = slug(text), i = playerSlot(), who = playerName();
      if (!i || !who || !PRAISE_SLUGS.has(s)) {
        return PHRASE_SLUGS.has(s)
          ? say('phrases', s, text, rate || 0.8, pitch || 1.15)
          : speak(text, rate, pitch);
      }
      return seq([['praise', s], ['players', 'player' + i]],
                 text + ', ' + who, rate || 0.8, pitch || 1.15);
    },

    /* Like cheer(), but only uses the name now and then. This is the
       one to call for the little cheers that come up every round. */
    praise: function (text, rate, pitch) {
      return (Math.random() < NAME_CHANCE)
        ? this.cheer(text, rate, pitch)
        : this.line(text, rate, pitch);
    },

    /* Is this one of the lines that can carry a name? */
    canCheer: (text) => PRAISE_SLUGS.has(slug(text)),

    /* Who is playing, for anything that wants to show it. */
    playerName, playerSlot,

    setMuted: (v) => { muted = !!v; if (muted) stop() },
    isMuted: () => muted,
    urlFor: url,
    slug,
    chapterName,
    PHRASE_LINES,
    PRAISE_LINES,
    BASE
  };
})();
