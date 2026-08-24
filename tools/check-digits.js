/* Check the digit strokes are real paths, start where the game
   says they start, and sit in the band a numeral belongs in.
       node tools/check-digits.js                                */
const { LETTERFORMS, WI_METRICS, DIGITS } = require('../js/writeit-letters.js');
const { TOP, BASE, W } = WI_METRICS;

let bad = 0;
const fail = (d, msg) => { bad++; console.log('  ✗ ' + d + ': ' + msg) };

/* Walk a path and return points that are actually ON it.

   Measuring the raw numbers in the `d` string is wrong: the
   control points of a bezier sit well outside the curve they
   bend, so a perfectly good 6 looks like it drops through the
   base line by seven units when it does not. So flatten the
   curves properly and sample them. */
function points(d) {
  const toks = d.match(/[MLCmlc]|-?\d+(?:\.\d+)?/g) || [];
  const pts = [];
  let i = 0, cx = 0, cy = 0, cmd = 'M';
  const num = () => Number(toks[i++]);

  const cubic = (x1, y1, x2, y2, x3, y3, x4, y4) => {
    for (let t = 0; t <= 1.0001; t += 1 / 24) {
      const u = 1 - t;
      pts.push([
        u*u*u*x1 + 3*u*u*t*x2 + 3*u*t*t*x3 + t*t*t*x4,
        u*u*u*y1 + 3*u*u*t*y2 + 3*u*t*t*y3 + t*t*t*y4
      ]);
    }
  };

  while (i < toks.length) {
    if (/[MLCmlc]/.test(toks[i])) { cmd = toks[i++]; }
    const rel = cmd === cmd.toLowerCase();
    const ox = rel ? cx : 0, oy = rel ? cy : 0;
    if (cmd.toUpperCase() === 'M' || cmd.toUpperCase() === 'L') {
      cx = num() + ox; cy = num() + oy;
      pts.push([cx, cy]);
    } else {                                   // C
      const x2 = num() + ox, y2 = num() + oy;
      const x3 = num() + ox, y3 = num() + oy;
      const x4 = num() + ox, y4 = num() + oy;
      cubic(cx, cy, x2, y2, x3, y3, x4, y4);
      cx = x4; cy = y4;
    }
  }
  return pts;
}

console.log('Digit strokes\n');

DIGITS.forEach(d => {
  const strokes = LETTERFORMS[d];
  if (!strokes || !strokes.length) return fail(d, 'no strokes at all');

  let minY = Infinity, maxY = -Infinity, minX = Infinity, maxX = -Infinity;

  strokes.forEach((s, i) => {
    if (!s.d) return fail(d, 'stroke ' + (i + 1) + ' has no path');
    if (!/^M\s/.test(s.d)) return fail(d, 'stroke ' + (i + 1) + ' does not start with a moveto');
    // every command letter must be one the pad understands
    const cmds = s.d.match(/[A-Za-z]/g) || [];
    const okCmds = cmds.every(c => 'MLCmlc'.includes(c));
    if (!okCmds) fail(d, 'uses a path command the pad cannot follow: ' + cmds.join(''));
    // C curves need 3 points each
    points(s.d).forEach(([x, y]) => {
      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    });
  });

  /* a numeral is capital height: top line to base line */
  const r = n => Math.round(n * 10) / 10;
  if (minY < TOP - 2) fail(d, 'reaches above the top line (y=' + r(minY) + ', top is ' + TOP + ')');
  if (maxY > BASE + 2) fail(d, 'drops below the base line (y=' + r(maxY) + ', base is ' + BASE + ')');
  if (maxY < BASE - 14) fail(d, 'does not reach the base line (lowest y=' + maxY + ')');
  if (minY > TOP + 14) fail(d, 'does not reach the top line (highest y=' + minY + ')');
  if (minX < 4 || maxX > W - 4) fail(d, 'runs outside the box (x ' + minX + '–' + maxX + ')');

  const rr = n => Math.round(n);
  console.log('  ' + d + '  ' + strokes.length + ' stroke' + (strokes.length > 1 ? 's' : '') +
              '   x ' + rr(minX) + '–' + rr(maxX) + '   y ' + rr(minY) + '–' + rr(maxY));
});

/* the game looks digits up by character, so they must be keyed as strings */
'0123456789'.split('').forEach(c => {
  if (!LETTERFORMS[c]) fail(c, 'not reachable as LETTERFORMS["' + c + '"]');
});

console.log('\n' + (bad ? '✗ ' + bad + ' problems' : '✓ all ten digits look right'));
process.exit(bad ? 1 : 0);
