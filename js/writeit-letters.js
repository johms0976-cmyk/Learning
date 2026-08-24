/* ============================================================
   LETTER SHAPES
   ------------------------------------------------------------
   Every letter is a list of strokes, in the order a child should
   write them. Each stroke is an SVG path that runs in the
   direction the pencil travels — the arrows in the game are
   drawn from the path, so the direction here IS the direction
   taught on screen.

       { d:"M 50 60 L 50 110" }   a stroke, drawn start → end
       { dot:[50, 44] }           a dot to tap (i and j)

   The box is 100 wide and 150 tall, with four writing lines:

       y =  10   TOP    top of a tall letter (b d f h k l t)
       y =  60   MID    x-height — the top of a small letter
       y = 110   BASE   the line letters sit on
       y = 140   DESC   how far a tail drops (g j p q y)

   If your school teaches a stroke a different way, edit the
   path here and both games follow — nothing else needs to change.
   ============================================================ */

const WI_METRICS = { W:100, TOP:10, MID:60, BASE:110, DESC:140 };

const LETTERFORMS = {

/* ── small letters ──────────────────────────────────────────
   Round letters all start at "two o'clock" and travel
   anticlockwise, which is the habit that later makes joined
   handwriting possible.
   ---------------------------------------------------------- */

a: [{ d:"M 70 73 C 70 63 61 58 50 58 C 35 58 28 70 28 84 C 28 98 35 110 50 110 C 61 110 70 105 70 95" },
    { d:"M 70 58 L 70 110" }],

b: [{ d:"M 30 10 L 30 110" },
    { d:"M 30 73 C 40 61 60 60 69 71 C 76 80 76 93 68 102 C 59 112 40 111 30 100" }],

c: [{ d:"M 71 73 C 65 62 50 57 39 65 C 27 74 27 96 39 105 C 50 113 65 108 71 97" }],

d: [{ d:"M 70 73 C 70 63 61 58 50 58 C 35 58 28 70 28 84 C 28 98 35 110 50 110 C 61 110 70 105 70 95" },
    { d:"M 70 10 L 70 110" }],

e: [{ d:"M 29 87 L 71 87 C 71 68 59 57 47 60 C 32 64 25 82 30 96 C 35 109 52 114 68 103" }],

f: [{ d:"M 70 24 C 60 12 44 15 44 33 L 44 110" },
    { d:"M 30 60 L 62 60" }],

g: [{ d:"M 70 73 C 70 63 61 58 50 58 C 35 58 28 70 28 84 C 28 98 35 110 50 110 C 61 110 70 105 70 95" },
    { d:"M 70 58 L 70 124 C 70 137 58 143 42 138" }],

h: [{ d:"M 30 10 L 30 110" },
    { d:"M 30 78 C 38 64 57 60 66 69 C 71 74 71 83 71 92 L 71 110" }],

i: [{ d:"M 50 60 L 50 110" },
    { dot:[50, 44] }],

j: [{ d:"M 55 60 L 55 124 C 55 137 43 143 30 137" },
    { dot:[55, 44] }],

k: [{ d:"M 30 10 L 30 110" },
    { d:"M 69 62 L 33 89 L 70 110" }],

l: [{ d:"M 50 10 L 50 110" }],

m: [{ d:"M 30 60 L 30 110" },
    { d:"M 30 74 C 34 62 47 59 50 72 L 50 110" },
    { d:"M 50 74 C 54 62 67 59 70 72 L 70 110" }],

n: [{ d:"M 32 60 L 32 110" },
    { d:"M 32 76 C 38 62 57 59 65 69 C 69 75 69 84 69 92 L 69 110" }],

o: [{ d:"M 50 58 C 34 58 26 70 26 84 C 26 98 34 110 50 110 C 66 110 74 98 74 84 C 74 70 66 58 50 58" }],

p: [{ d:"M 30 60 L 30 140" },
    { d:"M 30 73 C 40 61 60 60 69 71 C 76 80 76 93 68 102 C 59 112 40 111 30 100" }],

q: [{ d:"M 70 73 C 70 63 61 58 50 58 C 35 58 28 70 28 84 C 28 98 35 110 50 110 C 61 110 70 105 70 95" },
    { d:"M 70 58 L 70 132 C 70 140 76 143 83 139" }],

r: [{ d:"M 34 60 L 34 110" },
    { d:"M 34 77 C 41 64 55 57 69 62" }],

s: [{ d:"M 69 70 C 62 59 44 56 36 64 C 28 72 34 82 49 87 C 63 91 70 97 66 106 C 61 115 41 114 31 103" }],

t: [{ d:"M 50 26 L 50 97 C 50 108 59 112 67 105" },
    { d:"M 33 60 L 67 60" }],

u: [{ d:"M 31 60 L 31 94 C 31 105 41 112 52 109 C 61 106 66 98 66 89 L 66 60" },
    { d:"M 66 60 L 66 110" }],

v: [{ d:"M 30 60 L 50 110 L 70 60" }],

w: [{ d:"M 25 60 L 37 110 L 50 70 L 63 110 L 75 60" }],

x: [{ d:"M 30 60 L 70 110" },
    { d:"M 70 60 L 30 110" }],

y: [{ d:"M 30 60 L 51 105" },
    { d:"M 70 60 L 44 132 C 40 141 30 143 23 137" }],

z: [{ d:"M 30 62 L 70 62 L 30 108 L 70 108" }],

/* ── capital letters ────────────────────────────────────────
   Every capital is a tall letter: it fills TOP to BASE and
   never drops below the line.
   ---------------------------------------------------------- */

A: [{ d:"M 50 10 L 28 110" },
    { d:"M 50 10 L 72 110" },
    { d:"M 36 80 L 64 80" }],

B: [{ d:"M 30 10 L 30 110" },
    { d:"M 30 10 C 56 10 69 18 69 34 C 69 50 56 59 30 59" },
    { d:"M 30 59 C 60 59 75 68 75 84 C 75 100 60 110 30 110" }],

C: [{ d:"M 74 33 C 66 14 40 7 27 26 C 15 44 15 76 27 94 C 40 113 66 106 74 87" }],

D: [{ d:"M 30 10 L 30 110" },
    { d:"M 30 10 C 62 10 77 31 77 60 C 77 89 62 110 30 110" }],

E: [{ d:"M 30 10 L 30 110" },
    { d:"M 30 10 L 71 10" },
    { d:"M 30 60 L 63 60" },
    { d:"M 30 110 L 71 110" }],

F: [{ d:"M 30 10 L 30 110" },
    { d:"M 30 10 L 71 10" },
    { d:"M 30 58 L 63 58" }],

G: [{ d:"M 74 33 C 66 14 40 7 27 26 C 15 44 15 76 27 94 C 40 113 68 106 73 85 L 73 68" },
    { d:"M 73 68 L 53 68" }],

H: [{ d:"M 30 10 L 30 110" },
    { d:"M 70 10 L 70 110" },
    { d:"M 30 60 L 70 60" }],

I: [{ d:"M 50 10 L 50 110" },
    { d:"M 32 10 L 68 10" },
    { d:"M 32 110 L 68 110" }],

J: [{ d:"M 63 10 L 63 87 C 63 105 46 116 32 105" }],

K: [{ d:"M 30 10 L 30 110" },
    { d:"M 71 10 L 32 61 L 73 110" }],

L: [{ d:"M 30 10 L 30 110" },
    { d:"M 30 110 L 69 110" }],

M: [{ d:"M 26 10 L 26 110" },
    { d:"M 26 10 L 50 72 L 74 10" },
    { d:"M 74 10 L 74 110" }],

N: [{ d:"M 30 10 L 30 110" },
    { d:"M 30 10 L 70 110" },
    { d:"M 70 10 L 70 110" }],

O: [{ d:"M 50 10 C 31 10 22 33 22 60 C 22 87 31 110 50 110 C 69 110 78 87 78 60 C 78 33 69 10 50 10" }],

P: [{ d:"M 30 10 L 30 110" },
    { d:"M 30 10 C 60 10 75 20 75 38 C 75 56 60 66 30 66" }],

Q: [{ d:"M 50 10 C 31 10 22 33 22 60 C 22 87 31 110 50 110 C 69 110 78 87 78 60 C 78 33 69 10 50 10" },
    { d:"M 57 86 L 81 116" }],

R: [{ d:"M 30 10 L 30 110" },
    { d:"M 30 10 C 60 10 75 20 75 38 C 75 56 60 66 30 66" },
    { d:"M 45 66 L 75 110" }],

S: [{ d:"M 75 30 C 67 11 40 6 30 22 C 20 38 33 52 52 58 C 72 65 82 79 74 96 C 65 114 37 112 25 93" }],

T: [{ d:"M 50 10 L 50 110" },
    { d:"M 26 10 L 74 10" }],

U: [{ d:"M 30 10 L 30 82 C 30 100 38 110 50 110 C 62 110 70 100 70 82 L 70 10" }],

V: [{ d:"M 30 10 L 50 110 L 70 10" }],

W: [{ d:"M 24 10 L 36 110 L 50 42 L 64 110 L 76 10" }],

X: [{ d:"M 28 10 L 72 110" },
    { d:"M 72 10 L 28 110" }],

Y: [{ d:"M 30 10 L 50 60 L 50 110" },
    { d:"M 70 10 L 50 60" }],

Z: [{ d:"M 28 10 L 72 10 L 28 110 L 72 110" }],

/* ── the digits ─────────────────────────────────────────────
   Numerals are as tall as a capital: they sit on the BASE line
   and reach the TOP one, so they are drawn in the 10–110 band
   like A–Z rather than the 60–110 band the small letters use.

   Every one of these starts at the top and, where there is a
   choice, travels anticlockwise — the same habit the round
   letters are taught with, so a child is not being asked to
   learn two contradictory rules in the same week.

   The four that get reversed most are 2, 3, 5 and 7, and they
   are reversed because a child has remembered the shape but not
   which way it sets off. That is exactly what the numbered
   starting dot and the arrow are for, so these are worth
   practising more often than the easy ones.
   ---------------------------------------------------------- */

'0': [{ d:"M 50 10 C 31 10 22 33 22 60 C 22 87 31 110 50 110 C 69 110 78 87 78 60 C 78 33 69 10 50 10" }],

/* one stroke, not two: up the little flag, then straight down.
   Lifting the pencil to add the flag afterwards is what produces
   a 1 with the flag floating off the side of the stick. */
'1': [{ d:"M 32 25 L 50 10 L 50 110" }],

/* over the hill, down the slide, along the floor — one stroke,
   and the floor is what stops it turning into a backwards 5 */
'2': [{ d:"M 27 32 C 27 12 50 5 63 15 C 78 26 72 44 58 57 L 26 110 L 76 110" }],

/* two bumps, both facing the same way. Kept as one stroke so
   the middle never drifts apart */
'3': [{ d:"M 28 26 C 36 10 62 8 70 24 C 77 38 64 52 48 54 C 66 52 80 62 79 79 C 78 99 54 116 28 100" }],

/* down, across, then the stick — the corner has to be a corner,
   so it is two strokes and not a curve */
'4': [{ d:"M 63 10 L 24 76 L 80 76" },
      { d:"M 63 10 L 63 110" }],

/* flag first, then down and round. Starting with the flag is
   what keeps the 5 facing forwards */
'5': [{ d:"M 71 12 L 34 12 L 29 55" },
      { d:"M 29 55 C 48 42 74 50 76 74 C 78 97 52 116 27 102" }],

/* one long curve in from the top-left, closing into a loop at
   the bottom — anticlockwise all the way, like c and o */
'6': [{ d:"M 68 18 C 52 8 33 22 27 48 C 22 70 22 96 40 107 C 58 117 76 104 76 84 C 76 66 60 56 44 62 C 34 66 28 74 27 82" }],

/* across, then the slope. The one children most often mirror,
   because the top bar makes it look symmetrical when it is not */
'7': [{ d:"M 25 12 L 76 12 L 44 110" }],

/* a single crossing stroke, up from the bottom-left — drawing
   it as two stacked circles makes a snowman, not an eight */
'8': [{ d:"M 50 58 C 34 50 30 32 40 20 C 51 7 70 12 73 28 C 76 44 58 52 46 60 C 30 70 24 88 36 101 C 50 115 74 108 76 88 C 78 70 62 64 50 58" }],

/* Loop first, anticlockwise from two o'clock like o and a, then
   the tail straight down from where the loop closed. The tail
   has to start ON the loop: begin it any higher and it cuts back
   through the circle, which is the commonest way a hand-drawn 9
   goes wrong. */
'9': [{ d:"M 72 42 C 72 26 62 17 50 17 C 38 17 28 26 28 42 C 28 58 38 67 50 67 C 62 67 72 58 72 42" },
      { d:"M 72 42 L 72 110" }]
};

/* The digits, in the order they are worth teaching: the easy
   round and straight ones first, the four that get reversed
   last, when a child has the habit of starting at the dot. */
const DIGITS = ['1','0','4','7','2','3','5','6','9','8'];

/* Node can use this file too (the recording-list tool reads it). */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LETTERFORMS, WI_METRICS, DIGITS };
}
