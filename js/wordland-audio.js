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

   ── VOICES ─────────────────────────────────────────────────
   The same tree can exist several times over, once per voice:

     audio/wordland/voices/uk-male/words/monkey.mp3
     audio/wordland/voices/us-female/words/monkey.mp3

   The grown-up picks one in Grown-ups settings (see
   js/wordland-voices.js). Every lookup tries the chosen pack
   first, then the plain folders above it, then the computer
   voice — so a half-recorded pack still plays, and the
   recordings you already have keep working untouched.

   A line built out of several files never mixes packs: either
   the whole sentence comes from the chosen voice, or the whole
   sentence comes from the originals.

   ── NAMES ──────────────────────────────────────────────────
   A child's name is a recording like any other:

     names/sarah.mp3      one of the hundreds recorded up front
     players/player2.mp3  recorded for this seat, for a name
                          the library doesn't have

   players/ wins when it exists, then names/. If neither is
   there the game says the line without a name — "Hello" on its
   own — and never reads the name in the computer voice.
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
  /* A name is typed by a child, so it needs a gentler slug than a
     line of script does: accents folded down, apostrophes and
     spaces dropped, hyphens kept.
       "Zoë" → zoe   "Mary-Jane" → mary-jane   "O'Brien" → obrien */
  function nameSlug(s) {
    let t = String(s == null ? '' : s);
    try { t = t.normalize('NFD').replace(/[\u0300-\u036f]/g, '') } catch (e) {}
    return t.toLowerCase().trim()
      .replace(/['’`]/g, '')
      .replace(/[\s._]+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /* Which voice pack is chosen. Voices is optional in exactly the
     same way Profiles is — a page opened without it just uses the
     plain folders, which is what everything did before packs. */
  function voice() {
    try { return (typeof WLVoices !== 'undefined' && WLVoices.current()) || '' } catch (e) { return '' }
  }
  function packs() {
    try { return (typeof WLVoices !== 'undefined' && WLVoices.order()) || [''] } catch (e) { return [''] }
  }
  /* Zib's pack first, then the reading voice, then the plain
     folders. With no mascot chosen this is the reading order and
     nothing below can tell the difference. */
  function mascotPacks() {
    try { return (typeof WLVoices !== 'undefined' && WLVoices.mascotOrder()) || packs() } catch (e) { return packs() }
  }

  /* ── who is speaking ──────────────────────────────────────
     Two channels, and every line belongs to one of them.

       'mascot'  everything Zib says — instructions, praise,
                 the child's name on the end of a cheer
       'teach'   the letters, the sounds, the words, the story

     A kind of file decides its own channel: phrases/ and praise/
     are Zib by definition, because they are the script he is
     reading. names/ and players/ have no channel of their own —
     they follow whoever is saying the line they are part of, so
     a cheer never changes voice halfway through a name.
     ────────────────────────────────────────────────────────── */
  const MASCOT_KINDS = new Set(['phrases', 'praise']);
  function who(kind, chan) {
    return chan || (MASCOT_KINDS.has(kind) ? 'mascot' : 'teach');
  }
  function packsFor(chan) { return chan === 'mascot' ? mascotPacks() : packs(); }
  function prefix(v) { return v ? 'voices/' + v + '/' : '' }

  /* One file, in one named pack. */
  function pathIn(v, kind, name) {
    return BASE + prefix(v) + kind + '/' + slug(name) + '.mp3';
  }
  /* Where this file would live for the voice chosen right now. */
  function url(kind, name) { return pathIn(voice(), kind, name); }
  /* Everywhere it might be, best first. */
  function candidates(kind, name, chan) {
    return packsFor(who(kind, chan)).map(v => pathIn(v, kind, name));
  }
  function rel(u) { return u.slice(BASE.length); }

  /* The lines above, as file names, so line() can tell in one
     lookup whether a piece of text is something you may have
     recorded or just something said on the spot. */
  const PRAISE_SLUGS = new Set(PRAISE_LINES.map(slug));

  /* Every praise line is worth recording twice: rising in praise/
     for when it runs into a name, and finished in phrases/ for
     when it doesn't. A child whose name isn't in the library
     hears "Hello!" rather than "Hello," left hanging. Listing
     them here is what makes the phrases/ half get looked for. */
  const PHRASE_SLUGS = new Set([...PHRASE_LINES, ...PRAISE_LINES].map(slug));

  /* Who is playing, if the hub has been through. Profiles is
     optional — a game opened on its own still works, it just
     never says a name. */
  function playerSlot() {
    try { return (typeof Profiles !== 'undefined' && Profiles.slot()) || 0 } catch (e) { return 0 }
  }
  function playerName() {
    try { return (typeof Profiles !== 'undefined' && Profiles.name()) || '' } catch (e) { return '' }
  }

  /* ── is this child's name recorded, and where? ────────────
     Two places, in order:

       players/player2.mp3   made for this seat — always wins,
                             so an unusual name can be added
                             without touching the library
       names/sarah.mp3       one of the hundreds recorded up front

     Returns a part ready for seqFiles(), e.g. ['names','sarah'],
     or null when the name simply isn't recorded — and null is a
     perfectly good answer. The game then says the line on its
     own rather than reading the name in the computer voice.
     ────────────────────────────────────────────────────────── */
  async function namePart(seat, person, chan) {
    const list = packsFor(chan || 'teach');
    const one = (kind, name) => list.map(v => pathIn(v, kind, name));
    const i = seat || playerSlot();
    if (i && await firstAvailableSoon(one('players', 'player' + i))) {
      return ['players', 'player' + i];
    }
    const n = nameSlug(person == null ? playerName() : person);
    if (n && await firstAvailableSoon(one('names', n))) {
      return ['names', n];
    }
    return null;
  }

  /* For the hub, while a grown-up is typing: can we say this one
     out loud? Uses the patient lookup, not the racing one — a
     wrong answer here would send somebody off to record a file
     they already have. */
  async function hasName(person) {
    const n = nameSlug(person);
    if (!n) return false;
    return !!(await firstAvailable(candidates('names', n)));
  }

  /* Every name in the library, if a manifest has been built.
     null means we can't know without asking for files one by one,
     which is not worth doing for several hundred names. */
  function namesRecorded() {
    if (!manifest) return null;
    const v = voice(), out = new Set();
    manifest.forEach(p => {
      const m = /^(?:voices\/([^/]+)\/)?names\/(.+)\.mp3$/.exec(p);
      if (m && (!m[1] || m[1] === v)) out.add(m[2]);
    });
    return [...out].sort();
  }

  /* How much of each pack has been recorded, straight out of the
     manifest — instant, and enough for the grown-ups panel to
     show progress without asking for a thousand files. null when
     there is no manifest to read. */
  function packCounts() {
    if (!manifest) return null;
    const out = {};
    manifest.forEach(p => {
      const m = /^(?:voices\/([^/]+)\/)?([^/]+)\//.exec(p);
      if (!m || m[2] === 'voices') return;
      const v = m[1] || '';
      const o = out[v] || (out[v] = { total: 0, names: 0 });
      o.total++;
      if (m[2] === 'names') o.names++;
    });
    return out;
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

  /* Word Land's letter tables live in wordland-data.js. Spell It
     and Write It can be opened without it, so never assume it is
     there.

     There are two different questions here and they need two
     different tables. Asking SOUND for both was the bug:

       soundFile('M')  ->  'mmm'     which FILE to look for
       soundSay('M')   ->  'mmmm'    what the computer voice says

     SOUND is written for the speech engine — 'mmmm' with four m's
     so the synthesiser holds it, and for a stop consonant, where
     there is no honest answer, the whole phrase 'the first sound
     in ball'. Neither of those is a filename. SOUND_FILE is the
     filename table, and it is the one RECORDING-LIST.md and
     tools/list-audio.js have always used. */
  function soundFile(letter) {
    const up = String(letter).toUpperCase();
    if (typeof SOUND_FILE !== 'undefined' && SOUND_FILE && SOUND_FILE[up]) return SOUND_FILE[up];
    return up;
  }
  function soundSay(letter) {
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

  /* The first of these that exists, or null. With a manifest this
     costs nothing at all; without one it is at most one extra
     probe, and the answer is remembered either way. */
  async function firstAvailable(list) {
    for (const u of list) if (await available(u)) return u;
    return null;
  }
  async function firstAvailableSoon(list) {
    for (const u of list) if (await availableSoon(u)) return u;
    return null;
  }

  /* ── the computer voice, used when a recording is missing ── */
  function speak(text, rate, pitch, chan) {
    const t = plainText(text);
    if (!t || muted) return Promise.resolve();
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) return Promise.resolve();
    try {
      return new Promise(res => {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(t);
        u.rate = rate || VOICE.rate;
        u.pitch = pitch || VOICE.pitch;
        /* Most of a pack is missing while it is being recorded, so
           the stand-in voice should at least be from the right
           country. Setting lang alone already fixes the accent on
           any device with more than one English voice. */
        try {
          if (typeof WLVoices !== 'undefined') {
            u.lang = WLVoices.lang(chan);
            const sv = WLVoices.speechVoice(chan);
            if (sv) u.voice = sv;
          }
        } catch (e) {}
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
  /* Whoever is waiting on the file that is playing right now.
     A caller that waits for a line to finish — Word Land waits
     for the praise before it moves on — must be let go the
     moment the line stops, however it stops. Being cut off by
     the next sound is a finish too; without this it looks like
     a file that is still playing and the game sits there. */
  let playing = null;
  function endPlaying(ok) {
    const r = playing; playing = null;
    if (r) r(!!ok);
  }

  function playFile(u) {
    const a = element();
    endPlaying(false);                 // one file at a time, on one element
    return new Promise(resolve => {
      playing = resolve;
      const clean = () => { a.onended = null; a.onerror = null };
      a.onended = () => { clean(); endPlaying(true) };
      a.onerror = () => { known.set(u, false); clean(); endPlaying(false) };
      a.src = u;
      const p = a.play();
      if (p && p.catch) p.catch(err => {
        // A blocked autoplay is not a missing file — don't blame the recording.
        if (!err || err.name !== 'NotAllowedError') known.set(u, false);
        clean(); endPlaying(false);
      });
    });
  }

  async function say(kind, name, fallbackText, rate, pitch, chan) {
    if (muted) return;
    const c = who(kind, chan);
    stop();                    // silence whatever is playing FIRST — stop() bumps the token
    const mine = ++token;      // ...then claim this turn, so our number is the current one
    const u = await firstAvailableSoon(candidates(kind, name, c));
    if (u) {
      if (mine !== token) return;                 // something newer took over
      if (await playFile(u)) return;
    }
    if (mine !== token) return;
    return speak(fallbackText == null ? name : fallbackText, rate, pitch, c);
  }

  /* ── several recordings, one after another ───────────────
     Used for lines built out of parts, e.g. "Pop the letter"
     plus the letter A. It is all or nothing: if any part is
     missing we speak the whole line in the computer voice
     rather than switch voices halfway through a sentence.

       WLAudio.seq([['phrases','Pop the letter'], ['letters','A']],
                   'Pop the letter A');
     ────────────────────────────────────────────────────────── */
  /* Plays the whole line from files, or plays nothing and says so.
     Each pack is tried as a unit — all of it or none of it —
     because half a sentence in a British voice and half in an
     American one is worse than no recording at all.

     Returns true when the line was played. */
  async function seqFiles(parts, mine, list) {
    if (!parts || !parts.length) return false;
    for (const v of (list || packs())) {
      const urls = parts.map(p => pathIn(v, p[0], p[1]));
      const found = await Promise.all(urls.map(availableSoon));
      if (mine !== token) return true;            // something newer took over; don't speak over it
      if (!found.every(Boolean)) continue;
      let ok = true;
      for (const u of urls) {
        if (mine !== token) return true;
        if (!await playFile(u)) { ok = false; break }   // a file went missing mid-line
      }
      if (ok) return true;
    }
    return false;
  }

  async function seq(parts, fallbackText, rate, pitch, chan) {
    if (muted) return;
    stop();
    const mine = ++token;
    if (await seqFiles(parts, mine, packsFor(chan || 'teach'))) return;
    if (mine !== token) return;
    return speak(fallbackText, rate, pitch, chan);
  }

  function stop() {
    token++;
    if (el) { try { el.pause(); el.currentTime = 0 } catch (e) {} }
    endPlaying(false);                 // pausing fires nothing — let the waiter go
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
    const sentinels = [
      ...candidates('phrases', 'Well done!'),
      ...candidates('letters', 'a')
    ];
    if (haveNodes()) {
      const first = ALL_NODES[0];
      sentinels.push(url('sounds', soundFile(first.letters[0])));
      sentinels.push(url('words', first.vocab[0].w));
      sentinels.push(url('story', chapterName(first.map, first.no)));
    } else {
      sentinels.push(url('words', 'cat'));
    }
    const found = await Promise.all([...new Set(sentinels)].map(available));
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
    node.letters.forEach(l => jobs.push(url('sounds', soundFile(l))));
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
      spokenLetters().forEach(l => out.sounds.add(slug(soundFile(l))));
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

  /* The report is about the pack that is chosen right now, so a
     grown-up recording the British man sees what is still missing
     from HIS folder — not what the originals already cover.
     Pass '' to ask about the plain folders instead. */
  async function report(which) {
    const v = which == null ? voice() : which;
    const want = expected(), jobs = [];
    /* Zib never reads a word list or a chapter, so counting those
       against his pack would show a grown-up hundreds of files
       that are not his to record. */
    let kinds = ['sounds', 'letters', 'words', 'story', 'phrases', 'praise', 'players'];
    try { if (typeof WLVoices !== 'undefined' && WLVoices.isMascot(v)) kinds = ['phrases', 'praise', 'players'] } catch (e) {}
    for (const kind of kinds) {
      for (const name of want[kind]) {
        const u = BASE + prefix(v) + kind + '/' + name + '.mp3';
        jobs.push(
          mode === 'none'
            ? Promise.resolve({ kind, name, path: rel(u), found: false })
            : available(u).then(found => ({ kind, name, path: rel(u), found }))
        );
      }
    }
    const rows = await Promise.all(jobs);
    return {
      rows, voice: v,
      found: rows.filter(r => r.found).length,
      total: rows.length,
      source: mode === 'manifest' ? 'from manifest.json'
            : mode === 'none' ? 'no recordings yet — using the computer voice'
            : 'checked file by file'
    };
  }

  /* The name library, checked against audio/wordland/names.json —
     the list of names you set out to record. Without that file we
     fall back to whatever the manifest happens to contain, which
     tells you how many you have but not which ones are still to
     do. Build both with tools/names-list.js. */
  async function namesReport(which) {
    const v = which == null ? voice() : which;
    let wanted = null;
    try {
      const r = await fetch(BASE + 'names.json', { cache: 'no-cache' });
      if (r.ok) {
        const list = await r.json();
        if (Array.isArray(list) && list.length) wanted = list;
      }
    } catch (e) {}

    if (!wanted) {
      const have = namesRecorded();
      return { rows: have ? have.map(n => ({ name: n, found: true })) : [],
               found: have ? have.length : 0, total: null, voice: v,
               source: have ? 'from manifest.json' : 'add names.json to see what is left' };
    }

    const rows = await Promise.all(wanted.map(async n => {
      const s = nameSlug(n);
      const found = mode === 'none' ? false
                  : await available(BASE + prefix(v) + 'names/' + s + '.mp3');
      return { name: n, slug: s, found };
    }));
    return { rows, voice: v, found: rows.filter(r => r.found).length, total: rows.length,
             source: mode === 'manifest' ? 'from manifest.json' : 'checked file by file' };
  }

  return {
    init, rescan, unlock, stop, seq, preloadNode, preloadMap, expected, report,
    mode: () => mode,

    /* the sound a letter makes — sounds/mmm.mp3 */
    sound: (letter, fallbackText) =>
      say('sounds', soundFile(letter), fallbackText == null ? soundSay(letter) : fallbackText, VOICE.soundRate),

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
    /* line() carries two different jobs and always has: a line
       from Zib's script, and a bit of the child's content being
       read out — a word on a card, a sentence off the page.

       Which one it is decides who says it. A line in the list at
       the top of this file is Zib's, and goes to his pack. Text
       that isn't in the list is content, and content is the
       reading voice's job, because that is the voice chosen for
       being clear about words. Getting this backwards would have
       Zib reading the whole curriculum. */
    line: (text, rate, pitch) => {
      const s = slug(text);
      return PHRASE_SLUGS.has(s)
        ? say('phrases', s, text, rate || 0.8, pitch || 1.15, 'mascot')
        : speak(text, rate, pitch, 'teach');
    },

    /* force a phrase lookup even for a line not in the list */
    phrase: (text, rate, pitch) => say('phrases', text, text, rate || 0.8, pitch || 1.15),

    /* the child's name, in your voice — names/sarah.mp3, or
       players/player1.mp3 if one was recorded for this seat.
       Says nothing at all when the name isn't recorded. */
    player: async function (n, person, chan) {
      const c = chan || 'mascot';
      const part = await namePart(n, person, c);
      if (!part) return;
      return say(part[0], part[1], '', 0.8, 1.15, c);
    },

    /* praise with the child's name on the end:
         cheer('Well done')  →  "Well done, Sarah"

       When the name isn't recorded this becomes the plain line —
       "Well done" on its own, from phrases/ if you have recorded
       it there and from the computer voice if you haven't. The
       name itself is never read by the computer voice, so a
       child never hears a robot say it wrong. */
    /* Each pack is finished with before the next one is tried,
       and that order is the whole point. Zib saying "Well done!"
       plainly beats the reading voice saying "Well done, Sarah"
       — the child should always be able to tell who is talking,
       and their name is the part that can wait for the day it
       gets recorded.

       Returns when the sound has actually stopped, so a caller
       can wait for the praise to finish before moving on. */
    cheer: async function (text, rate, pitch) {
      if (muted) return;
      const s = slug(text);
      stop();
      const mine = ++token;

      for (const v of mascotPacks()) {
        /* the name, in THIS pack. A cheer that runs into a name
           read by somebody else is two people in one sentence. */
        let part = null;
        const seat = playerSlot();
        if (seat && await availableSoon(pathIn(v, 'players', 'player' + seat))) {
          part = ['players', 'player' + seat];
        } else {
          const n = nameSlug(playerName());
          if (n && await availableSoon(pathIn(v, 'names', n))) part = ['names', n];
        }
        if (mine !== token) return;

        if (part && await seqFiles([['praise', s], part], mine, [v])) return;
        if (mine !== token) return;

        /* No name here, or no rising half to run into it — the
           finished line on its own, still in this voice. */
        if (await availableSoon(pathIn(v, 'phrases', s))) {
          if (mine !== token) return;
          if (await playFile(pathIn(v, 'phrases', s))) return;
        }
        if (mine !== token) return;
      }
      return speak(text, rate || 0.8, pitch || 1.15, 'mascot');
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

    /* names */
    hasName, namesRecorded, nameSlug, namePart, namesReport, packCounts,

    /* voices */
    voice, candidates, pathIn, packs, mascotPacks,
    mascotVoice: () => { try { return (typeof WLVoices !== 'undefined' && WLVoices.mascot()) || '' } catch (e) { return '' } },

    setMuted: (v) => { muted = !!v; if (muted) stop() },
    isMuted: () => muted,
    urlFor: url,
    slug,
    chapterName,
    soundFile, soundSay,
    PHRASE_LINES,
    PRAISE_LINES,
    BASE
  };
})();

/* Switching voice can change the answer to "is anything recorded
   at all?", so work it out again. Nothing else needs clearing —
   what we remember is remembered per file path, and a pack's
   paths are its own. */
try {
  if (typeof WLVoices !== 'undefined') {
    WLVoices.onChange(() => { try { WLAudio.stop(); WLAudio.init() } catch (e) {} });
  }
} catch (e) {}
