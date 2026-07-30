# Recording list · the spoken lines

This is the companion to `RECORDING-LIST.md`. That one covers the letter
sounds, the words and the story chapters. This one covers everything
*else* the games say out loud — the praise, the nudges and the
instructions — plus the letter **names**.

**53 files.** All of them are two or three words long, so the whole lot
is about ten minutes of recording.

| what | where it goes |
|---|---|
| spoken lines | `audio/wordland/phrases/` ← new folder |
| letter names | `audio/wordland/letters/` ← new folder |
| the four extra words | `audio/wordland/words/` |

Anything you haven't recorded is still read by the computer voice, so
record them in any order and drop them in as you go.

> ### ⚠️ One thing to do afterwards
> You have an `audio/wordland/manifest.json`. When that file exists it is
> **trusted completely** — the games never look for anything that isn't
> listed in it. So new recordings stay silent until you regenerate it
> with `tools/make-manifest.sh`. If you'd rather not think about it,
> delete `manifest.json` and the games will find files on their own.

---

## 1 · Spoken lines — 23 files

Warm and quick. These land right after a child has done something, so a
half-second of dead air is very noticeable — start the word almost
immediately and trim the tail tight.

### Word Land · when an answer is wrong

Gentle, never disappointed. The point is *have another go*, not *you got
that wrong*.

| file | say |
|---|---|
| `phrases/try-again.mp3` | Try again |
| `phrases/not-that-one.mp3` | Not that one |
| `phrases/have-another-go.mp3` | Have another go |

### Word Land · when an answer is right

These flash up on screen with an emoji. Bright and short.

| file | say |
|---|---|
| `phrases/yes.mp3` | Yes! |
| `phrases/nice-one.mp3` | Nice one! |
| `phrases/you-got-it.mp3` | You got it! |
| `phrases/brilliant.mp3` | Brilliant! |
| `phrases/well-done.mp3` | Well done! |
| `phrases/superstar.mp3` | Superstar! |

`well-done.mp3` is used twice — for the cheer, and again on the
"place complete" screen when a place is replayed.

### Word Land · finishing a place for the first time

The big one. This is the moment a chapter is won, so it can be a little
slower and a little grander than the others.

| file | say |
|---|---|
| `phrases/you-did-it-a-new-chapter-for-your-storybook.mp3` | You did it! A new chapter for your storybook. |

### Write It

| file | say | when |
|---|---|---|
| `phrases/good.mp3` | Good | after each finished stroke — say it lightly, it comes up a lot |
| `phrases/next-letter.mp3` | Next letter | moving along a word |
| `phrases/you-wrote-it.mp3` | You wrote it! | a letter or word finished |

### Spell It · instructions

Read these as an instruction to a child, not an announcement.

| file | say | note |
|---|---|---|
| `phrases/find-the-words-that-rhyme.mp3` | Find the words that rhyme | |
| `phrases/pop-the-letter.mp3` | Pop the letter | leave it hanging — a letter name follows |
| `phrases/paint-every-letter.mp3` | Paint every letter | leave it hanging |
| `phrases/drive-through-the-letter.mp3` | Drive through the letter | leave it hanging |
| `phrases/you-painted-a.mp3` | You painted a | leave it hanging — a word follows |

Those last four are joined to a second recording as they play, so the
game says "Pop the letter — B" out of two files instead of needing
twenty-six of them. Record them **rising**, as though the sentence is
about to continue, and don't trim so tight that it sounds clipped.

If either half is missing the game speaks the whole line in the computer
voice rather than switching voices halfway through, so a half-finished
set never sounds odd.

### Spell It · when a round is won

| file | say |
|---|---|
| `phrases/wonderful.mp3` | Wonderful! |
| `phrases/great-job.mp3` | Great job! |
| `phrases/you-did-it.mp3` | You did it! |
| `phrases/hooray.mp3` | Hooray! |
| `phrases/amazing.mp3` | Amazing! |

Spell It also uses `superstar.mp3` from the Word Land list above — record
it once, it plays in both.

---

## 2 · Letter names — 26 files

The **name**, not the sound: "ay", "bee", "see" — *not* `aah`, `buh`,
`kuh`. The sounds already live in `audio/wordland/sounds/` and these do
not replace them; the games use one or the other depending on what's
being asked.

Clear and unhurried, with a small pause each side. `pop-the-letter.mp3`
runs straight into these, so keep the level and the tone consistent
across all twenty-six.

| file | say | | file | say |
|---|---|---|---|---|
| `letters/a.mp3` | A | | `letters/n.mp3` | N |
| `letters/b.mp3` | B | | `letters/o.mp3` | O |
| `letters/c.mp3` | C | | `letters/p.mp3` | P |
| `letters/d.mp3` | D | | `letters/q.mp3` | Q |
| `letters/e.mp3` | E | | `letters/r.mp3` | R |
| `letters/f.mp3` | F | | `letters/s.mp3` | S |
| `letters/g.mp3` | G | | `letters/t.mp3` | T |
| `letters/h.mp3` | H | | `letters/u.mp3` | U |
| `letters/i.mp3` | I | | `letters/v.mp3` | V |
| `letters/j.mp3` | J | | `letters/w.mp3` | W |
| `letters/k.mp3` | K | | `letters/x.mp3` | X |
| `letters/l.mp3` | L | | `letters/y.mp3` | Y |
| `letters/m.mp3` | M | | `letters/z.mp3` | Z |

---

## 3 · Four more words — 4 files

Spell It's painting game finishes by naming the picture: "You painted
a — star". These go in the ordinary words folder alongside everything
else, and two of the six are already recorded.

| file | say | |
|---|---|---|
| `words/heart.mp3` | heart | |
| `words/star.mp3` | star | |
| `words/tree.mp3` | tree | |
| `words/house.mp3` | house | |
| `words/fish.mp3` | fish | ✅ already recorded |
| `words/boat.mp3` | boat | ✅ already recorded |

---

## What is *not* on this list

Two kinds of line are made up as the game runs, so they can't be
recorded as single files:

- **Sentences.** Word Land reads sentences aloud by stitching together
  the individual `words/` recordings, so recording the words is enough.
- **"cat rhymes with hat."** Spell It builds this from whichever pair
  came up. It stays in the computer voice.

The definitive list lives in `PHRASE_LINES` at the top of
`js/wordland-audio.js`. Add a line there and it becomes recordable; the
file name is the line in lower case, with punctuation dropped and spaces
turned into dashes.
