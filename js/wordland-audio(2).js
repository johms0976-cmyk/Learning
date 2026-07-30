/* ============================================================
   WORD LAND · AUDIO
   ------------------------------------------------------------
   Plays your recordings when they exist and falls back to the
   computer voice when they don't, so the game always works —
   before, during and after you finish recording.

     audio/wordland/sounds/sss.mp3        WLAudio.sound('S')
     audio/wordland/words/monkey.mp3      WLAudio.word('MONKEY')
     audio/wordland/story/chapter1.mp3    WLAudio.chapter(1, text)

   Optional: audio/wordland/manifest.json — a JSON array of the
   files you have recorded, e.g.
     ["sounds/sss.mp3","words/monkey.mp3","story/chapter1.mp3"]
   When present it is trusted completely, which avoids the
   browser asking for files that aren't there. Generate it with
   tools/make-manifest.sh.
   ============================================================ */

const WLAudio = (function () {

  const BASE = 'audio/wordland/';
  const PROBE_TIMEOUT = 1800;   // ms before we stop waiting for a file
  const PATIENCE = 350;         // ms a child will wait before we just speak
  const VOICE = { rate: 0.62, pitch: 1.12, soundRate: 0.55, storyRate: 0.62 };

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
      .replace(/[^a-z0-9_-]/g, '');
  }
  function url(kind, name) { return BASE + kind + '/' + slug(name) + '.mp3'; }
  function rel(u) { return u.slice(BASE.length); }

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
    if (!text || muted) return Promise.resolve();
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) return Promise.resolve();
    try {
      return new Promise(res => {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(String(text));
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

  async function say(kind, name, fallbackText, rate) {
    if (muted) return;
    stop();                    // silence whatever is playing FIRST — stop() bumps the token
    const mine = ++token;      // ...then claim this turn, so our number is the current one
    const u = url(kind, name);
    if (await availableSoon(u)) {
      if (mine !== token) return;                 // something newer took over
      if (await playFile(u)) return;
    }
    if (mine !== token) return;
    return speak(fallbackText == null ? name : fallbackText, rate);
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
    // Three probes tell us whether recording has started at all.
    const first = NODES[0];
    const sentinels = [
      url('sounds', SOUND[first.letters[0]] || first.letters[0]),
      url('words', first.vocab[0].w),
      url('story', 'chapter1')
    ];
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
  function preloadNode(node) {
    if (mode === 'none') return Promise.resolve([]);
    const jobs = [];
    node.letters.forEach(l => jobs.push(url('sounds', SOUND[l] || l)));
    node.vocab.forEach(v => jobs.push(url('words', v.w)));
    node.words.forEach(v => jobs.push(url('words', v.w)));
    node.family.forEach(v => jobs.push(url('words', v.w)));
    node.hfw.forEach(h => jobs.push(url('words', h.w)));
    jobs.push(url('story', 'chapter' + node.no));
    return Promise.all([...new Set(jobs)].map(available));
  }

  /* ── which recordings have landed? (grown-ups panel) ──── */
  function expected() {
    const out = { sounds: new Set(), words: new Set(), story: new Set() };
    spokenLetters().forEach(l => out.sounds.add(slug(SOUND[l] || l)));
    NODES.forEach(n => {
      [...n.vocab, ...n.words, ...n.family].forEach(v => out.words.add(slug(v.w)));
      n.hfw.forEach(h => out.words.add(slug(h.w)));
      out.story.add('chapter' + n.no);
    });
    return {
      sounds: [...out.sounds].sort(),
      words: [...out.words].sort(),
      story: [...out.story].sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
    };
  }
  async function report() {
    const want = expected(), jobs = [];
    for (const kind of ['sounds', 'words', 'story']) {
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
    init, rescan, unlock, stop, preloadNode, expected, report,
    mode: () => mode,
    sound: (letter) => say('sounds', SOUND[letter] || letter, SOUND[letter] || letter, VOICE.soundRate),
    word:  (w)      => say('words', w, String(w).toLowerCase(), VOICE.rate),
    chapter:(n,text)=> say('story', 'chapter' + n, text, VOICE.storyRate),
    line:  (text, rate, pitch) => speak(text, rate, pitch),   // praise + instructions
    setMuted: (v) => { muted = !!v; if (muted) stop() },
    isMuted: () => muted,
    urlFor: url,
    BASE
  };
})();
