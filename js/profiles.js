/* ============================================================
   PROFILES — who is playing
   ------------------------------------------------------------
   One small file shared by the hub and all three games.

   Each child gets a **number** (1, 2, 3, 4) as well as a name.
   The number is what the recording is called:

       audio/wordland/players/player1.mp3   ← you saying "Sarah"
       audio/wordland/players/player2.mp3   ← you saying "Tom"

   so the games can say "Well done, Sarah" in your voice by
   playing praise/well-done.mp3 and then player1.mp3, without
   knowing anything about the name itself.

   Each child also gets their own progress in every game. The
   games keep saving exactly as they did before — this file just
   puts the child's number on the end of the key:

       wordLand3        →  wordLand3:p1
       spellIt3         →  spellIt3:p1
       writeIt1         →  writeIt1:p1

   If nobody has been chosen — someone opened a game directly
   instead of coming through the hub — the keys stay bare and
   everything behaves the way it did before profiles existed.
   ============================================================ */

const Profiles = (function () {

  const KEY = 'readinggames-profiles';
  const MAX = 4;                        // four children, four recordings

  /* The games whose saved data belongs to a child. Used to move a
     single-child save into a profile, to clear up after a deleted
     profile, and to build the grown-ups dashboard. */
  /* `byId` marks a game that files its save under the profile's id
     rather than the seat number. Number Land was written to stand
     alone as well as sit in the hub, so it names its own save
     `numberland-<id>` and keeps it through a change of seat. */
  const GAMES = [
    { id: 'wordland',   name: 'Word Land',   emoji: '🗺️', key: 'wordLand3',   sum: sumWordLand },
    { id: 'spellit',    name: 'Spell It',    emoji: '✨',  key: 'spellIt3',    sum: sumSpellIt  },
    { id: 'writeit',    name: 'Write It',    emoji: '✏️',  key: 'writeIt1',    sum: sumWriteIt  },
    { id: 'numberland', name: 'Number Land', emoji: '🔢', key: 'numberland-', sum: sumNumberLand, byId: true }
  ];

  const FACES = ['🦊', '🐼', '🐧', '🦁', '🐸', '🦉', '🐙', '🦄', '🐝', '🐢', '🦕', '🐨'];

  /* ── storage that never throws ───────────────────────────
     localStorage is blocked in some private-browsing modes, so
     fall back to memory. A child who plays in that mode simply
     starts fresh next time rather than seeing an error. */
  const mem = {};
  let hasLS = false;
  try { localStorage.setItem('__t', '1'); localStorage.removeItem('__t'); hasLS = true } catch (e) {}

  function get(k) {
    if (hasLS) { try { return localStorage.getItem(k) } catch (e) {} }
    return k in mem ? mem[k] : null;
  }
  function set(k, v) {
    mem[k] = v;
    if (hasLS) { try { localStorage.setItem(k, v) } catch (e) {} }
  }
  function drop(k) {
    delete mem[k];
    if (hasLS) { try { localStorage.removeItem(k) } catch (e) {} }
  }

  /* ── the file itself ─────────────────────────────────────
     { v:1, list:[ {id, slot, name, face, made, played} ], active:id } */
  let DB = { v: 1, list: [], active: null };

  function read() {
    try {
      const raw = get(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d && Array.isArray(d.list)) DB = { v: 1, list: d.list, active: d.active || null };
      }
    } catch (e) {}
    return DB;
  }
  function write() { set(KEY, JSON.stringify(DB)) }

  /* If there is progress from before profiles existed it belongs to
     somebody — but nobody knows who, so it waits under the old key
     rather than conjuring a player up. The first person actually
     added takes it with them; until then no profile exists and the
     title screen is honest about that. */
  function adoptInto(p) {
    GAMES.forEach(g => {
      const v = get(g.key);
      if (v != null && get(g.key + suffixFor(p)) == null) set(g.key + suffixFor(p), v);
    });
  }

  function blank(name, slot) {
    return {
      id: 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      slot: slot,
      name: String(name || '').trim() || ('Player ' + slot),
      face: FACES[(slot - 1) % FACES.length],
      made: Date.now(),
      played: 0
    };
  }

  /* Numbers are handed out lowest-first, and a deleted child's
     number becomes free again — so if you remove Player 2 and add
     somebody else, they become Player 2 and you re-record
     player2.mp3 for them. */
  function freeSlot() {
    const taken = new Set(DB.list.map(p => p.slot));
    for (let i = 1; i <= MAX; i++) if (!taken.has(i)) return i;
    return 0;
  }

  const suffixFor = p => (p && p.slot) ? ':p' + p.slot : '';

  /* ── who is playing ──────────────────────────────────── */
  function active() { return DB.list.find(p => p.id === DB.active) || null }

  function setActive(id) {
    const p = DB.list.find(x => x.id === id);
    if (!p) return null;
    DB.active = p.id;
    p.played = Date.now();
    write();
    return p;
  }

  function add(name, face) {
    const slot = freeSlot();
    if (!slot) return null;                       // four is the limit
    const first = DB.list.length === 0;
    const p = blank(name, slot);
    if (face) p.face = face;
    DB.list.push(p);
    DB.active = p.id;
    if (first) adoptInto(p);                      // inherit any pre-profile progress
    write();
    return p;
  }

  function rename(id, name) {
    const p = DB.list.find(x => x.id === id);
    if (!p) return null;
    p.name = String(name || '').trim() || p.name;
    write();
    return p;
  }

  function setFace(id, face) {
    const p = DB.list.find(x => x.id === id);
    if (!p) return null;
    p.face = face; write(); return p;
  }

  /* Removing somebody takes their progress with them, otherwise it
     would quietly reattach itself to whoever gets that number next. */
  function remove(id) {
    const p = DB.list.find(x => x.id === id);
    if (!p) return false;
    GAMES.forEach(g => drop(g.key + suffixFor(p)));
    DB.list = DB.list.filter(x => x.id !== id);
    if (DB.active === id) DB.active = DB.list.length ? DB.list[0].id : null;
    write();
    return true;
  }

  function signOut() { DB.active = null; write() }

  /* ── the bit the games call ──────────────────────────── */
  const suffix = () => suffixFor(active());
  const key = base => base + suffix();
  const name = () => { const p = active(); return p ? p.name : '' };
  const slot = () => { const p = active(); return p ? p.slot : 0 };

  /* ── reading a child's progress, for the dashboard ───── */
  function raw(profile, game) {
    /* Called with a game object, but older code passed a bare key
       string — accept both so nothing that already works breaks. */
    const g = typeof game === 'string' ? { key: game } : (game || {});
    try {
      const v = get(g.key + (g.byId ? (profile && profile.id) || '' : suffixFor(profile)));
      return v ? JSON.parse(v) : null;
    } catch (e) { return null }
  }

  function sumWordLand(d) {
    if (!d || !d.maps) return null;
    let places = 0, stars = 0, correct = 0, wrong = 0, ms = 0;
    Object.values(d.maps).forEach(m => Object.values(m.nodes || {}).forEach(n => {
      if (n.stars > 0) places++;
      stars += n.stars || 0; correct += n.correct || 0; wrong += n.wrong || 0; ms += n.timeMs || 0;
    }));
    return { lines: [[places, 'place finished', 'places finished'], [stars, 'star', 'stars']],
             correct, wrong, ms };
  }

  function sumSpellIt(d) {
    if (!d || !d.levels) return null;
    let done = 0, stars = 0;
    Object.values(d.levels).forEach(l => { if (l.bestStars > 0) done++; stars += l.bestStars || 0 });
    const t = d.totals || {};
    return {
      lines: [[done, 'game finished', 'games finished'], [stars, 'star', 'stars'],
              [Object.keys(d.words || {}).length, 'word met', 'words met']],
      correct: t.correct || 0, wrong: t.wrong || 0, ms: d.totalTimeMs || 0
    };
  }

  /* Number Land saves { places:{index:stars}, right, asked, ms,
     skills:{activity:{asked,right,near}} } — one flat record,
     because its places run in a single line rather than being
     grouped into maps the way Word Land's are.

     `near` is wrong-by-one, counted separately because in early
     counting it means something quite different from wrong-by-a
     lot: the child is counting but losing their place, rather
     than not counting at all. It is worth a line of its own on
     the dashboard for that reason. */
  function sumNumberLand(d) {
    if (!d || !d.places) return null;
    const stars = Object.values(d.places).reduce((a, b) => a + (b || 0), 0);
    const places = Object.values(d.places).filter(s => s > 0).length;
    const right = d.right || 0, asked = d.asked || 0;
    const near = Object.values(d.skills || {}).reduce((a, s) => a + (s.near || 0), 0);
    const lines = [[places, 'place finished', 'places finished'], [stars, 'star', 'stars']];
    if (near) lines.push([near, 'answer out by one', 'answers out by one']);
    return { lines, correct: right, wrong: Math.max(0, asked - right), ms: d.ms || 0 };
  }

  function sumWriteIt(d) {
    if (!d) return null;
    const letters = Object.keys(d.letters || {}).length;
    const words = Object.keys(d.words || {}).length;
    const tries = Object.values(d.letters || {}).reduce((a, b) => a + (b || 0), 0);
    return { lines: [[letters, 'letter formed', 'letters formed'],
                     [words, 'word written', 'words written'],
                     [tries, 'time traced', 'times traced']],
             correct: 0, wrong: 0, ms: 0 };
  }

  /* One child, all three games. */
  function progress(profile) {
    return GAMES.map(g => {
      const s = g.sum(raw(profile, g));
      return { id: g.id, name: g.name, emoji: g.emoji, started: !!s, stats: s };
    });
  }

  /* Every child, for the grown-ups panel. */
  function report() {
    return DB.list.slice().sort((a, b) => a.slot - b.slot)
      .map(p => ({ profile: p, recording: 'players/player' + p.slot + '.mp3', games: progress(p) }));
  }

  read();

  return {
    all: () => DB.list.slice().sort((a, b) => a.slot - b.slot),
    active, setActive, add, rename, setFace, remove, signOut,
    suffix, key, name, slot,
    progress, report, reload: read,
    room: () => freeSlot() > 0,
    MAX, FACES, GAMES
  };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = { Profiles };
