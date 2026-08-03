# Reading Games

Is a tool to help 4-6 year olds read.

* **Word Land** — an adventure through ten places, one per lesson, with ten
  activities in each and a chapter of story to win. Built for an iPad held
  **landscape**.
* **Spell It** — the earlier free-play game, sixteen mini-games in any order.
* **Write It** — teaches children who to write.

---

## Running it

Everything is plain HTML, CSS and JavaScript. No build step, no dependencies.

* **GitHub Pages** — push the repo, turn Pages on, done.
* **Locally** — open a terminal in the folder and run a small server, then
  visit `http://localhost:8000`:

  ```bash
  python3 -m http.server 8000
  ```

Opening `index.html` straight off the disk mostly works, but Safari blocks
`manifest.json` on `file://`, so use a server if you want the audio manifest.

**On the iPad:** open the page in Safari, then Share → *Add to Home Screen*.
It launches full screen with no browser chrome, which is what you want with a
five-year-old and a drawing canvas.

---

## Folders

```
index.html               the front door — pick a game
wordland.html            Word Land
spelling-game.html       Spell It (free play)

css/hub.css              the front door
css/wordland.css         Word Land — landscape-first, portrait underneath

js/wordland-data.js      ← the content. Words, stories, lesson plans.
js/wordland-audio.js     recordings, with fallback to the computer voice
js/wordland.js           the game engine and the fourteen activities

audio/wordland/sounds/   letter sounds     e.g. sss.mp3
audio/wordland/words/    single words      e.g. monkey.mp3
audio/wordland/story/    story chapters    e.g. chapter1.mp3
audio/wordland/RECORDING-LIST.md   every file to record, and the story text
audio/wordland/manifest.json       optional, generated — see below

tools/list-audio.js      rebuilds the recording list from the content
tools/make-manifest.sh   lists the recordings you have actually made
```

---

## Recording your voice

Open **`audio/wordland/RECORDING-LIST.md`**. It lists all 104 files, grouped,
with the story text laid out ready to read. It is generated from the content
file, so if you change a word or a story line, run:

```bash
node tools/list-audio.js
```

### Naming

The filename is the thing being said, lower case, `.mp3`:

| you record | save it as |
|---|---|
| the sound *sss* | `audio/wordland/sounds/sss.mp3` |
| the word *monkey* | `audio/wordland/words/monkey.mp3` |
| chapter 1 of the story | `audio/wordland/story/chapter1.mp3` |

Sound filenames come from the `SOUND` table at the top of
`js/wordland-data.js` — `M` is `mmm`, `S` is `sss`, `T` is `tuh`, and so on.
Change a spelling there and the filename changes with it.

### You can record in any order

Every missing file falls back to the computer voice, so the game is fully
playable from day one and improves as recordings land. Nothing breaks, nothing
needs switching on.

Under the ⚙️ button (behind a small sum) there's a **Your recordings** panel:
a count, and a tick beside every file that has been found. Drop new files in,
tap **Check for new recordings**, and the ticks appear.

### After adding recordings

```bash
bash tools/make-manifest.sh
```

This writes `audio/wordland/manifest.json` — the list of recordings that
actually exist. When it's there the game trusts it and never has to go looking
for files one at a time, which makes the first tap of every round instant.
Re-run it whenever you add or remove a recording, and commit the result.

### A note on recording letter sounds

Say the **sound**, not the letter name — `mmm`, not "em". The ones that can be
stretched (`mmm`, `sss`, `fff`) should be held for about a second. The stopped
ones (`b`, `t`, `k`) should stay crisp, without an "uh" on the end: "b", not
"buh". That "uh" is what makes children read *cat* as "cuh-a-tuh".

---

## The ten places

| # | Place | Lesson | Learns |
|---|---|---|---|
| 1 | Mossy Meadow | 1 | **m** |
| 2 | Silver Sands | 2 | **s** |
| 3 | Apple Hollow | 3 | **a, i** · *am, Sam* · *I, am* |
| 4 | Tall Tree Trail | 4 | **t** |
| 5 | Cat Cave | 5 | the **-at** family · *at, a* |
| 6 | Bumble Bridge | 6 | **b** |
| 7 | Cloud Cove | 7 | **c** |
| 8 | Fox Forest | 8 | **f** + *-at* words |
| 9 | Sam's Camp | 9 | review |
| 10 | Wizard's Tower | 10 | everything |

Places unlock in order, so the phonics sequence holds.

---

## The fourteen activities

Each place runs ten of these, chosen in `plan` on that place's entry in
`js/wordland-data.js`.

| name | what the child does | comes from |
|---|---|---|
| `sound` | hears a sound, taps the letter | Hear |
| `beginSound` | sees a picture, taps its first letter | Worksheet 4 |
| `starts` | sees a letter, taps the matching picture | Worksheet 3 |
| `tapAll` | taps **every** picture starting with the letter | Worksheet 1 |
| `listen` | hears a word, taps the picture | Vocabulary |
| `match` | joins three letters to three pictures | Worksheet 1 |
| `hunt` | finds the letter in mixed fonts, big and small | Find |
| `caseMatch` | pairs the small letter with the big one | Find |
| `trace:l` / `trace:u` | writes the letter with a finger | Write |
| `initial` | adds the missing first letter and reads the word | Worksheet 3 |
| `blend` | sounds a word out, then picks it | Read |
| `spell` | builds a word from letter tiles | Write |
| `rhyme` | picks the word that rhymes | ESL/ELL notes |
| `sight` | finds a high-frequency word | Read |

Tracing is scored on two things: how much of the letter got covered, and how
much of the drawing stayed on it. Both are deliberately forgiving, and a second
wobbly attempt is always accepted — a five-year-old should never be stuck on a
letter shape.

Letters are set in **Andika**, a typeface made for early literacy: a
single-storey **a**, and a **b** that can't be mistaken for a **d**.

---

## Changing the content

Everything the child sees lives in `js/wordland-data.js`. To add a word, add
`{w:"BOAT", e:"⛵"}` to that place's `vocab`. To reorder a lesson, edit its
`plan`. To rewrite a story, edit `story.lines` — words wrapped in `*asterisks*`
become tappable and play that word's recording.

Then re-run `node tools/list-audio.js` so the recording list keeps up.

## Adding Map 2

Lessons 11–20 (**n, p, h, r, z, ee**, and the first real sentences) are the
next map. Add ten more entries to `NODES` with the same shape and the engine
picks them up — the trail, the storybook and the recording list all grow
automatically. The activities that don't exist yet for that map are sentence
building and reading a whole line, which will want two new engines.
