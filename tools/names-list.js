/* ============================================================
   NAMES-LIST  ·  node tools/names-list.js
   ------------------------------------------------------------
   Decides which names you are going to record, and writes two
   files into audio/wordland/:

     names.json              the list, for the grown-ups panel
     NAMES-RECORDING-LIST.md the same list to read while you
                             record, with the filename beside
                             each name

   Where the names come from:

     audio/wordland/names.txt   if it exists — one name per
                                line, # for a comment. Edit
                                this to add the names of your
                                children's friends and cousins.
     the built-in list          otherwise — the common names
                                across Britain, Australia and
                                the United States.

   Filenames come from the name itself, folded down the same
   way the game folds a typed name, so a child who types
   "Zoë", "zoe" or " ZOE " all reach names/zoe.mp3.

   Run it again whenever you edit names.txt, then run
   tools/make-manifest.js and commit both.
   ============================================================ */
const fs = require('fs'), path = require('path');

const ROOT = path.join(__dirname, '..');
const DIR = path.join(ROOT, 'audio', 'wordland');

/* The same folding the game does — keep these two in step.
   (WLAudio.nameSlug in js/wordland-audio.js.) */
function nameSlug(s) {
  return String(s == null ? '' : s)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().trim()
    .replace(/['’`]/g, '')
    .replace(/[\s._]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/* ── the built-in list ────────────────────────────────────
   Common first names across Britain, Australia and the United
   States, plus the ones that turn up often in all three from
   Arabic, South Asian, Chinese, Greek, Italian and Polish
   families. It is a starting point, not a limit — put your own
   list in audio/wordland/names.txt and this is ignored.
   ────────────────────────────────────────────────────────── */
const BUILT_IN = `
Aaliyah Abigail Ada Addison Adeline Agnes Aisha Alana Alba Alexandra Alice Alina
Amaya Amber Amelia Amina Anastasia Anaya Anna Annabelle Antonia Anya Aria Ariana
Arya Ashley Astrid Aurora Autumn Ava Ayla Beatrice Bella Bethany Bianca Blake
Bonnie Brooke Caitlin Camila Cara Carmen Caroline Cassie Catherine Cecilia Chana
Charlie Charlotte Chloe Clara Claudia Constance Cora Daisy Dakota Daniela Daphne
Darcy Delilah Diana Dorothy Eden Edith Eleanor Elena Eliana Elif Elizabeth Ella
Ellie Eloise Elsie Emilia Emily Emma Erin Esme Esther Eva Evelyn Evie Faith
Farah Fatima Fern Fiona Flora Florence Frances Freya Gabriella Georgia Gia
Gianna Grace Gracie Hafsa Hallie Hannah Harper Harriet Hazel Heidi Helena Holly
Hope Imogen India Indie Ines Iris Isabella Isabelle Isla Ivy Jade Jasmine
Jennifer Jessica Joanna Jocelyn Jorja Josephine Julia Juliet Kaia Kate Katherine
Kayla Keira Khadija Kiara Lacey Laila Lara Laura Lauren Layla Leah Leila Lena
Leonie Lexi Lila Lilian Lily Lois Lola Louisa Lucia Lucy Luna Lyla Lyra Mabel
Macy Maddison Madeleine Maeve Maggie Mahi Maisie Manon Margaret Margot Maria
Mariam Marnie Martha Mary Matilda Maya Megan Melody Meredith Mia Mila Millie
Mina Miriam Molly Mya Myla Naomi Natalia Natasha Nadia Nell Niamh Nina Noor Nora
Nova Olive Olivia Ophelia Orla Paisley Paige Paloma Pearl Penelope Peyton
Philippa Phoebe Piper Polly Poppy Priya Quinn Rachel Rania Raya Rebecca Reese
Rhea Riley Rose Rosie Ruby Ruth Sadie Saffron Sahara Sakura Sally Samira Sara
Sarah Sasha Savannah Scarlett Selina Serena Shreya Sienna Simone Skye Sofia
Sophia Sophie Stella Summer Susanna Sydney Tabitha Talia Tara Tessa Thea Tilly
Valentina Vera Veronica Victoria Violet Vivian Willow Winnie Wren Xanthe Yara
Yasmin Zahra Zainab Zara Zoe Zuri

Aaron Abdullah Abel Adam Aditya Adrian Ahmed Aidan Aiden Ajay Alan Albert Alex
Alexander Alfie Ali Alistair Amir Anders Andrew Angus Anthony Antonio Archer
Archie Arlo Armaan Arthur Asher Ashton Atticus Austin Ayaan Bailey Beau Ben
Benjamin Bernard Blake Bobby Bodhi Bradley Brandon Brayden Brody Bruno Bryan
Caleb Callum Cameron Carter Casey Cassius Charles Charlie Chase Christian
Christopher Clark Cody Cole Colin Connor Cooper Corey Craig Curtis Cyrus Daniel
Danny Darius David Dawson Deacon Dean Declan Dennis Derek Desmond Dexter Diego
Dominic Douglas Dylan Eddie Edward Edwin Eli Elias Elijah Elliot Emeka Emmett
Enzo Eric Ethan Ezra Fabian Felix Fergus Finlay Finn Fletcher Florian Francis
Frankie Fraser Freddie Frederick Gabriel Gareth Gary George Gideon Gilbert Grady
Graham Grayson Gregory Gus Hamza Harley Harrison Harry Harvey Hassan Hayden
Henry Hudson Hugh Hugo Hunter Ibrahim Idris Ilias Isaac Isaiah Ismail Ivan Jack
Jackson Jacob Jake James Jamie Jared Jasper Javier Jaxon Jayden Jeremy Jesse
Joel John Jonah Jonathan Jordan Joseph Joshua Josiah Jude Julian Justin Kai
Kaleb Karl Kenji Kevin Khalid Kian Kieran Kingsley Kyle Lachlan Lawrence Leo
Leon Leonard Levi Lewis Liam Lincoln Logan Louis Luca Lucas Luke Malachi Malik
Marcus Mario Mark Marshall Martin Mason Mateo Matthew Max Maxwell Micah Michael
Miles Milo Mohammed Monty Morgan Moses Muhammad Musa Nathan Nathaniel Neil
Nicholas Nikhil Noah Noel Nolan Norman Oliver Omar Orion Orson Oscar Otis Otto
Owen Pablo Patrick Paul Percy Peter Philip Phoenix Quentin Rafael Raheem Rajesh
Ralph Raphael Rayan Reece Reuben Rhys Richard Ridley Riley River Robert Rocco
Roman Ronan Rory Ross Rowan Roy Rudy Rupert Russell Ryan Ryder Sam Samuel
Santiago Saul Sawyer Sebastian Seth Shane Shaun Sidney Silas Simon Solomon
Spencer Stanley Stefan Stephen Stuart Sullivan Tanner Ted Teddy Theo Theodore
Thomas Timothy Tobias Toby Tom Tommy Travis Tristan Tyler Umar Uriel Valentino
Victor Vincent Walter Warren Wesley William Wyatt Xavier Yahya Yusuf Zac Zachary
Zaid Zane Zayn Zion
`;

/* ── read the list ───────────────────────────────────────── */
const SOURCE = path.join(DIR, 'names.txt');
let raw, from;

if (fs.existsSync(SOURCE)) {
  raw = fs.readFileSync(SOURCE, 'utf8')
    .split('\n').map(l => l.replace(/#.*$/, '').trim()).filter(Boolean);
  from = 'audio/wordland/names.txt';
} else {
  raw = BUILT_IN.split(/\s+/).filter(Boolean);
  from = 'the built-in list';
}

/* Tidy the display spelling: leave what was typed alone apart
   from stray whitespace, so the list you read while recording
   says "Mary-Jane", not "mary-jane". */
const seen = new Map();          // slug -> first spelling that produced it
const clashes = [];
const names = [];

raw.forEach(n => {
  const name = n.replace(/\s+/g, ' ').trim();
  const s = nameSlug(name);
  if (!s) return;                                   // nothing usable — emoji, punctuation
  if (seen.has(s)) {
    if (seen.get(s).toLowerCase() !== name.toLowerCase()) clashes.push([seen.get(s), name, s]);
    return;                                         // one recording covers both
  }
  seen.set(s, name);
  names.push(name);
});

names.sort((a, b) => a.localeCompare(b, 'en'));

/* ── write them out ──────────────────────────────────────── */
if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });

fs.writeFileSync(path.join(DIR, 'names.json'), JSON.stringify(names, null, 1) + '\n');

const rows = names.map(n => '- [ ] `names/' + nameSlug(n) + '.mp3` — **' + n + '**');
const md = `# Names to record

${names.length} names, from ${from}.

Record each one **on its own**, said the way you would say it to
the child — warm, unhurried, and *finished*, not trailing off.
They are played straight after a rising line, so:

> praise/hello.mp3 → "Hello," · names/sarah.mp3 → "Sarah."

Save each into the pack you are recording:

    audio/wordland/voices/uk-female/names/sarah.mp3
    audio/wordland/voices/uk-male/names/sarah.mp3
    audio/wordland/voices/us-female/names/sarah.mp3
    audio/wordland/voices/us-male/names/sarah.mp3

A name that isn't here is not a problem: the child still plays,
they just don't hear their name. To add one for a particular
child, record \`players/player2.mp3\` for their seat instead —
that always wins over this list.

To change the list, put your own names one per line in
\`audio/wordland/names.txt\` and run \`node tools/names-list.js\`
again.

---

${rows.join('\n')}
`;
fs.writeFileSync(path.join(DIR, 'NAMES-RECORDING-LIST.md'), md);

console.log('audio/wordland/names.json written — ' + names.length + ' names, from ' + from);
console.log('audio/wordland/NAMES-RECORDING-LIST.md written');
if (clashes.length) {
  console.log('\nThese spellings share one recording, so only the first is listed:');
  clashes.forEach(([a, b, s]) => console.log('  ' + a + ' / ' + b + '  ->  names/' + s + '.mp3'));
}
