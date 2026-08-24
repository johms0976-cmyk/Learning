/* ============================================================
   NUMBER LAND — the content
   ------------------------------------------------------------
   This is the file to edit. Everything a child sees is here:
   the places, what each one teaches, the ten activities it
   runs, the things that get counted and the story won at the
   end. js/numberland.js only knows how to play it.

   THE SEQUENCE
   ------------------------------------------------------------
   The order is not arbitrary and should not be shuffled. It
   follows the way counting actually develops:

     1  say the numbers in order            (rote)
     2  touch one thing per number          (one-to-one)
     3  the last number said is how many    (cardinality)
     4  see small amounts without counting  (subitising)
     5  amounts can be split and rejoined   (part-whole)
     6  start from a number, not from one   (counting on)

   A child who is still counting from one every time is not
   ready for Bond Bridge, and a child who cannot yet see three
   without counting is not ready to count on from it. Each map
   holds the stage below it in place before adding to it.

   AND THE SEQUENCE IS ENFORCED, NOT JUST SUGGESTED
   ------------------------------------------------------------
   Two stars on a place opens the next one. Some places also
   name the skill they stand on:

     needs:{skill:'subitize', min:.65, why:'…'}

   and stay shut until that skill is going well, however many
   stars have been collected elsewhere. Without this the order
   above is only a recommendation, and a child can walk the
   whole trail having secured none of it — which is the exact
   thing the sequence exists to prevent.
   ============================================================ */

const NLData = (() => {

/* ── how each number is said ────────────────────────────────
   Also the audio filename. Number Land speaks through Word
   Land's audio layer rather than having one of its own, so 7 is
   heard from audio/wordland/words/seven.mp3 — the same file the
   reading games use — and from the matching folder inside
   whichever voice pack is chosen. */
const WORD = ['zero','one','two','three','four','five','six','seven','eight',
              'nine','ten','eleven','twelve','thirteen','fourteen','fifteen',
              'sixteen','seventeen','eighteen','nineteen','twenty'];

/* ── the things that get counted ───────────────────────────
   Grouped so each place counts its own world. Keep every set
   to things a four-year-old can name, and keep the emoji ones
   visually separable — two shades of the same fish at 30px is
   a counting error waiting to happen. */
/* TWO RULES, BOTH LEARNT THE HARD WAY
   ------------------------------------------------------------
   1. Nothing whose picture contains a countable number of
      anything. A spider has eight legs, and asking a child how
      many spiders there are while teaching the number eight is
      a genuinely confusing thing to do — at that age "how many?"
      does not yet come with an unspoken "…of the thing I mean".
      Same for 🐙 and 🪺. They are gone.

   2. Nothing so detailed that it stops reading as one thing.
      🐿️ and 🗿 at 30px are a smudge with internal parts; a
      child counting them is doing visual work that has nothing
      to do with number. Simple, solid, one-shape things count
      best. */
const THINGS = {
  hill  : ['🌳','🍄','🍏','🪨'],
  pond  : ['🐢','🦆','🪷','🐸'],
  log   : ['🐸','🦋','🍃','🌰'],
  farm  : ['🐑','🐄','🐔','🥕'],
  beach : ['🐚','⭐','🦀','🪣'],
  sky   : ['🎈','☁️','🪁','🐦'],
  marsh : ['🦆','🐟','🌾','🍃'],
  cove  : ['🐠','🫧','🐚','⭐'],
  wood  : ['🪵','🍁','🌰','🍄'],
  stone : ['🪨','🔵','🕯️','🟠'],
  cave  : ['🦇','💎','🍄','🪨'],
  nest  : ['🥚','🪶','🐣','🌿'],
  tree  : ['🍎','🍐','🌸','🍋'],
  hoard : ['💎','👑','🪙','🔔']
};

/* ── the ten steps of a place ───────────────────────────────
   Written as "activity:top number" — sometimes with a third
   part that chooses how the amount is drawn.

     subitize:5:dice     flash a pattern, tap how many (1–5 only)
     seeGroups:8         flash a full frame, tap how you saw it
     fingers:7           hands held up, tap how many
     count:5             touch each thing once, then say how many
     howMany:5:frame     see an amount, tap the numeral
     showMe:5            see a numeral, put that many in the frame
     match:5             pair three numerals with three amounts
     compare:5:more      which group has more / fewer / the same
     order:5             tap the numerals in order
     beforeAfter:10      fill the gap in the number line
     bond:5              five and how many more make eight
     addAll:5            two groups, count them all
     countOn:10          the first group is hidden — count on
     takeAway:5          some leave, how many are left
     missing:10          three and how many more make seven
     double:10           two of the same
     story:5:add         a word problem — the answer is the end
     story:5:take        one where things leave
     story:5:change      the gap is in the middle: had 3, some
                         came, now 7 — how many came?
     story:5:compare     two lots side by side, how many more?

   The draw styles for subitize and howMany:
     dice    the pattern on a die, up to six
     frame   a ten frame
     scatter thrown about — the hardest, count them
     row     a neat line
   ------------------------------------------------------------
   Ten steps is about eight minutes. If that is long for your
   child, cut each plan to six — nothing else needs changing. */

const NODES = [

/* ══════════════════════════════════════════════════════════
   MAP 1 · COUNTING COAST — the numbers to five
   Everything here is a number a child can learn to see whole.
   Nothing is added or taken away until place 8, because a
   child who cannot yet hold "four" in their head has nothing
   to add four to.
   ══════════════════════════════════════════════════════════ */
{
  map:1, name:'One Tree Hill', emoji:'🌳', set:'hill',
  teaches:'1 and 2', top:2,
  plan:['count:1','howMany:1:row','subitize:2:dice','count:2','showMe:2',
        'fingers:2','compare:2:more','count:2','subitize:2:dice','order:2'],
  story:['*One* tree stood on the hill.','Then Zib saw *two* birds in it.']
},
{
  map:1, name:'Turtle Pond', emoji:'🐢', set:'pond',
  teaches:'3', top:3,
  plan:['subitize:3:dice','count:3','howMany:3:row','showMe:3','fingers:3',
        'match:3','compare:3:more','subitize:3:dice','count:3','order:3'],
  story:['*Three* turtles sat on a log.','One slid off. Two stayed.']
},
{
  map:1, name:'Froggy Log', emoji:'🐸', set:'log',
  teaches:'4', top:4,
  plan:['subitize:4:dice','count:4','howMany:4:scatter','showMe:4','fingers:4',
        'compare:4:fewer','match:4','order:4','subitize:4:dice','beforeAfter:4'],
  story:['*Four* frogs found the log.','They hopped on, one at a time.']
},
{
  map:1, name:'High Five Beach', emoji:'🐚', set:'beach',
  teaches:'5 — and the full row', top:5,
  plan:['subitize:5:dice','count:5','fingers:5','showMe:5','howMany:5:scatter',
        'fingers:5','match:5','compare:5:same','subitize:5:dice','order:5'],
  story:['*Five* shells filled Zib\'s hand.','A whole row. A high five!']
},
{
  /* Conservation: five is still five when you move it about.
     Children who have counted confidently for months will
     still say the spread-out row has more, so this place
     shows the same amount three ways and asks every time. */
  map:1, name:'Muddle Meadow', emoji:'🍄', set:'hill',
  teaches:'the same number, moved about', top:5,
  plan:['compare:4:same','howMany:4:scatter','compare:5:same','howMany:5:frame',
        'match:5','compare:5:same','howMany:5:row','match:4','compare:5:same','count:5'],
  story:['Zib moved the *five* mushrooms.','Still *five*. Moving them changes nothing.']
},
{
  map:1, name:'Numeral Nook', emoji:'🔢', set:'sky',
  teaches:'the written numbers 1–5', top:5,
  plan:['match:5','howMany:5:frame','showMe:4','howMany:3:scatter','match:5',
        'order:5','beforeAfter:5','showMe:5','howMany:4:row','order:5'],
  story:['Every number has a shape.','Zib drew all *five* in the sand.']
},
{
  map:1, name:'More or Less Marsh', emoji:'🦆', set:'marsh',
  teaches:'more, fewer, the same', top:5,
  plan:['compare:4:more','compare:4:fewer','compare:5:more','compare:5:same',
        'howMany:5:scatter','compare:5:fewer','compare:5:more','order:5',
        'compare:5:same','beforeAfter:5'],
  story:['Two nests. One had more.','Zib counted both to be sure.']
},
{
  map:1, name:'Shell Cove', emoji:'🐠', set:'cove',
  teaches:'putting together, up to 5', top:5,
  /* Nothing is added until a child can hold an amount in their
     head — there is nothing to add four to otherwise. */
  needs:{skill:'count', min:.7,
         why:'Counting and saying how many opens this'},
  plan:['addAll:3','addAll:4','bond:4','addAll:5','bond:5','story:5:compare',
        'bond:5','story:5:add','addAll:5','bond:5'],
  story:['*Two* fish and *three* fish.','All together — *five* fish!']
},
{
  map:1, name:'Splash Rock', emoji:'💧', set:'cove',
  teaches:'taking away, within 5', top:5,
  plan:['takeAway:3','takeAway:4','takeAway:5','missing:4','story:5:change',
        'story:5:take','missing:5','takeAway:5','bond:5','missing:5'],
  story:['*Five* fish by the rock.','*Two* swam off. *Three* left.']
},
{
  map:1, name:'The Counting Castle', emoji:'🏰', set:'hoard',
  teaches:'everything to 5', top:5,
  plan:['subitize:5:dice','count:5','fingers:5','match:5','compare:5:more',
        'addAll:5','takeAway:5','bond:5','story:5:compare','story:5:add'],
  story:['The castle door had *five* locks.','Zib counted every one.']
},

/* ══════════════════════════════════════════════════════════
   MAP 2 · TEN FRAME TERRITORY — the numbers to ten
   Six to ten are taught as five and some more, never as a
   fresh set of dots to be counted from one. That is what the
   ten frame is doing, and it is why the frame never changes
   shape between places.
   ══════════════════════════════════════════════════════════ */
{
  map:2, name:'Six Stick Wood', emoji:'🪵', set:'wood',
  teaches:'6 — five and one', top:6,
  plan:['howMany:6:frame','seeGroups:6','fingers:6','showMe:6','bond:6',
        'howMany:6:scatter','compare:6:more','seeGroups:6','order:6','beforeAfter:6'],
  story:['*Six* sticks made Zib a raft.','*Five* across, and *one* more.']
},
{
  map:2, name:'Seven Stone Circle', emoji:'🪨', set:'stone',
  teaches:'7 — five and two', top:7,
  plan:['howMany:7:frame','showMe:7','seeGroups:7','fingers:7','bond:7',
        'howMany:7:scatter','compare:7:fewer','seeGroups:7','beforeAfter:7','match:7'],
  story:['*Seven* stones in a ring.','Zib walked round them all.']
},
{
  map:2, name:'Eight Leg Cave', emoji:'🕷️', set:'cave',
  teaches:'8 — and double four', top:8,
  plan:['howMany:8:frame','showMe:8','seeGroups:8','double:8','bond:8',
        'fingers:8','compare:8:more','addAll:8','seeGroups:8','beforeAfter:8'],
  story:['A spider with *eight* legs.','*Four* on each side, said Zib.']
},
{
  map:2, name:'Nine Nest Cliff', emoji:'🥚', set:'nest',
  teaches:'9 — one short of ten', top:9,
  plan:['howMany:9:frame','showMe:9','seeGroups:9','bond:9','fingers:9',
        'compare:9:more','missing:9','seeGroups:9','beforeAfter:9','match:9'],
  story:['*Nine* eggs in the nest.','One space left, said Zib.']
},
{
  map:2, name:'Ten Tree Top', emoji:'🍎', set:'tree',
  teaches:'10 — the frame full', top:10,
  plan:['howMany:10:frame','showMe:10','bond:10','fingers:10','double:10',
        'bond:10','compare:10:same','seeGroups:10','bond:10','beforeAfter:10'],
  story:['*Ten* apples. The frame was full.','Not one space anywhere.']
},
{
  map:2, name:'Number Line Ridge', emoji:'🧗', set:'wood',
  teaches:'order, before and after', top:10,
  plan:['order:10','beforeAfter:10','order:10','beforeAfter:10','compare:10:more',
        'beforeAfter:10','order:10','howMany:10:frame','beforeAfter:10','order:10'],
  story:['The path went *one* to *ten*.','Zib climbed it step by step.']
},
{
  map:2, name:'Bond Bridge', emoji:'🌉', set:'stone',
  teaches:'the pairs that make ten', top:10,
  /* The pairs that make ten are a part-whole fact. Seeing eight
     as five and three is the same idea one step earlier, so it
     comes first. */
  needs:{skill:'seeGroups', min:.6,
         why:'Seeing five and some more opens this'},
  plan:['bond:10','bond:10','missing:10','bond:10','story:10:change','bond:10',
        'addAll:10','missing:10','bond:10','story:10:add'],
  story:['The bridge took *ten* planks.','*Six* were down. *Four* to go.']
},
{
  map:2, name:'Count-On Cliff', emoji:'🪜', set:'nest',
  teaches:'starting from the bigger number', top:10,
  /* The one gate that matters most. Counting on from six means
     holding six in your head without counting it — so a child
     who cannot yet see small amounts at a glance has nothing to
     count on FROM, and will simply count all of it in their
     head instead, slowly, and learn that maths is hard. */
  needs:{skill:'subitize', min:.65,
         why:'Seeing small amounts at a glance opens this'},
  plan:['countOn:7','countOn:8','countOn:9','addAll:9','countOn:10','countOn:10',
        'story:10:change','countOn:10','story:10:add','countOn:10'],
  story:['*Six* eggs in the basket.','Three more — Zib did not start again.']
},
{
  map:2, name:'Take-Away Tunnel', emoji:'🚇', set:'cave',
  teaches:'taking away, within 10', top:10,
  plan:['takeAway:7','takeAway:8','missing:8','story:9:compare','story:9:take',
        'takeAway:10','missing:10','takeAway:10','bond:10','story:10:compare'],
  story:['*Ten* bats in the tunnel.','*Four* flew out. *Six* hung on.']
},
{
  map:2, name:'The Dragon\'s Hoard', emoji:'🐉', set:'hoard',
  teaches:'everything to 10', top:10,
  plan:['seeGroups:9','count:10','howMany:10:scatter','bond:10','countOn:10',
        'takeAway:10','story:10:compare','double:10','order:10','story:10:take'],
  story:['*Ten* coins in the hoard.','Zib counted them. The dragon smiled.']
}
];

/* ── the word problems ──────────────────────────────────────
   Two shapes only: things arrive, things leave. Both are read
   aloud, and both draw the picture underneath, because a five-
   year-old solving a word problem is solving a picture. */
const STORIES = {
  /* result unknown — the easiest shape. The story runs forwards
     and a child can act it out in order. */
  add: [
    ['{a} {things} were here.', '{b} more came.', 'How many now?'],
    ['Zib found {a} {things}.', 'Then {b} more.', 'How many altogether?'],
    ['{a} {things} on the path.', '{b} {things} joined them.', 'How many now?']
  ],
  take: [
    ['There were {a} {things}.', '{b} went away.', 'How many are left?'],
    ['Zib had {a} {things}.', 'He gave {b} to a friend.', 'How many now?'],
    ['{a} {things} sat here.', '{b} ran off.', 'How many stayed?']
  ],

  /* change unknown — the gap is in the middle of the story, so
     it cannot be acted out forwards. The child has to hold the
     start and the end and work out the middle, which is the
     first properly algebraic thing they will do. */
  change: [
    ['Zib had {a} {things}.', 'Some more came.', 'Now there are {total}. How many came?'],
    ['{a} {things} were on the path.', 'More arrived.', 'Now there are {total}. How many arrived?'],
    ['Zib counted {a} {things}.', 'Then he found some more.', 'Now he has {total}. How many did he find?']
  ],

  /* compare — the answer is a difference, and a difference is
     not sitting in either group waiting to be counted. Hardest
     of the four, almost always left out, and the one that
     builds the most number sense. */
  compare: [
    ['Zib has {a} {things}.', 'Ana has {b}.', 'How many more does Zib have?'],
    ['Zib found {a} {things}.', 'Ana found {b}.', 'How many more did Zib find?'],
    ['There are {a} {things} here.', 'And {b} over there.', 'How many more are here?']
  ]
};

/* Plural names for the things, for the word problems only.
   Anything not listed falls back to the emoji itself. */
const NAMES = {
  '🌳':'trees','🍄':'mushrooms','🐿️':'squirrels','🪨':'rocks','🐢':'turtles',
  '🦆':'ducks','🪷':'lilies','🐸':'frogs','🦋':'butterflies','🐌':'snails',
  '🍃':'leaves','🐑':'sheep','🐄':'cows','🐔':'hens','🥕':'carrots',
  '🐚':'shells','⭐':'stars','🦀':'crabs','🪣':'buckets','🎈':'balloons',
  '☁️':'clouds','🪁':'kites','🐦':'birds','🪺':'nests','🐟':'fish',
  '🌾':'reeds','🐠':'fish','🐙':'octopuses','🦑':'squid','🫧':'bubbles',
  '🪵':'sticks','🍁':'leaves','🦉':'owls','🌰':'nuts','🔮':'orbs',
  '🕯️':'candles','🗿':'statues','🕷️':'spiders','🦇':'bats','💎':'gems',
  '🥚':'eggs','🪶':'feathers','🐣':'chicks','🌿':'ferns','🍎':'apples',
  '🍐':'pears','🌸':'flowers','🐛':'caterpillars','💰':'bags','👑':'crowns',
  '🪙':'coins'
};

/* ── what Zib says ─────────────────────────────────────────
   Praise is deliberately about the effort and the method, not
   about the child: "you counted them all" rather than "clever
   girl". Recorded twice, as every praise line is: rising in
   audio/wordland/praise/<slug>.mp3 so it can run into the
   child's name, and finished in phrases/<slug>.mp3 for when no
   name is recorded. */
const PRAISE = ['Yes!','You got it','That\'s it','Well counted','Good looking',
                'Right every time','You saw it','Nice work'];

const NUDGE  = ['Have another go','Try again','Nearly — one more try','Look again'];

return { WORD, THINGS, NODES, STORIES, NAMES, PRAISE, NUDGE,
         MAPS: [...new Set(NODES.map(n => n.map))] };
})();

if(typeof module !== 'undefined') module.exports = NLData;
