/* ============================================================
   LETTER PAD
   ------------------------------------------------------------
   The writing pad from Write It, on its own so Word Land can
   use the same one. A child sees the letter in grey, a numbered
   yellow dot showing where to begin, and arrows showing which
   way to travel. Each stroke has to be followed from its start
   to its end before the next one unlocks.

   Needs writeit-letters.js (LETTERFORMS + WI_METRICS).

       const pad = LetterPad.create({
         canvas: document.getElementById('pad'),
         ch: 'a',
         onTip:  (text, kind) => ...,
         onStroke: (done, total) => ...,
         onDone: () => ...
       });
       pad.demo();       show me how
       pad.clear();      wipe the child's ink
       pad.destroy();    unbind before the screen changes

   Nothing in here knows about Word Land or Write It, so it can
   be dropped into any page that loads the letter shapes.
   ============================================================ */

const LetterPad = (function () {

  const M = (typeof WI_METRICS !== 'undefined')
    ? WI_METRICS : { W:100, TOP:10, MID:60, BASE:110, DESC:140 };
  const BOX_H = 150;      // design height of one letter cell
  const TOL   = 11;       // how far off the line is still fine (design units)
  const AHEAD = 0.13;     // how far ahead of yourself you may jump

  const C = { line:'#E3DAF3', mid:'#EFE9F9', base:'#C9BCE6',
              ghost:'#E2D8F4', dots:'#C6B2EC', done:'#7C5CD6',
              ink:'#2E2A55', badge:'#F0B429', badgeOff:'#D6CBEE' };

  /* ── geometry: turn a path into points we can follow ────── */
  let mathPath = null;
  function measurer(){
    if(mathPath) return mathPath;
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('width','0'); svg.setAttribute('height','0');
    svg.setAttribute('aria-hidden','true');
    svg.style.cssText = 'position:absolute;left:-9999px;top:0';
    mathPath = document.createElementNS('http://www.w3.org/2000/svg','path');
    svg.appendChild(mathPath);
    document.body.appendChild(svg);
    return mathPath;
  }
  function samplePath(d){
    const p = measurer();
    p.setAttribute('d', d);
    let len = 0;
    try { len = p.getTotalLength() } catch(e) { len = 0 }
    if(!len) return [];
    const step = 2.2, n = Math.max(2, Math.ceil(len / step));
    const pts = [];
    for(let i = 0; i <= n; i++){
      const q = p.getPointAtLength(len * i / n);
      pts.push({ x:q.x, y:q.y });
    }
    return pts;
  }
  function tangent(pts, i, back){
    const a = pts[Math.max(0, i - (back ? 0 : 1))];
    const b = pts[Math.min(pts.length - 1, i + (back ? 1 : 0))];
    const dx = b.x - a.x, dy = b.y - a.y, m = Math.hypot(dx, dy) || 1;
    return { x:dx/m, y:dy/m };
  }
  function dist(a, b){ return Math.hypot(a.x - b.x, a.y - b.y) }
  function circled(n){ return ['','①','②','③','④','⑤'][n] || ('#' + n) }

  /* Where do the stroke numbers go? Try each side of the stroke and the
     space just before it, keep whichever sits in the most white space,
     then push apart any that still landed on each other (B, E, P and
     friends start two strokes from the same corner). */
  function badgeSpots(strokes){
    const all = [];
    strokes.forEach(s => s.pts.forEach(p => all.push(p)));
    const clamp = v => ({ x:Math.max(8, Math.min(M.W - 8, v.x)),
                          y:Math.max(8, Math.min(BOX_H - 8, v.y)) });
    const nearest = (q, list) => {
      let n = 1e9;
      for(const a of list){ const d = Math.hypot(a.x - q.x, a.y - q.y); if(d < n) n = d }
      return n;
    };
    const placed = [];
    return strokes.map(s => {
      if(s.dot){ const q = clamp({ x:s.dot.x, y:s.dot.y - 11 }); placed.push(q); return q }
      const n = s.pts.length, cands = [];
      [0.04, 0.12, 0.26].forEach(f => {
        const k = Math.min(n - 1, Math.max(1, Math.round(n * f)));
        const p = s.pts[k], t = tangent(s.pts, k, false);
        [11, 15].forEach(r => {
          cands.push({ x:p.x - t.y * r, y:p.y + t.x * r });
          cands.push({ x:p.x + t.y * r, y:p.y - t.x * r });
        });
      });
      const t0 = tangent(s.pts, Math.min(1, n - 1), false);
      cands.push({ x:s.pts[0].x - t0.x * 12, y:s.pts[0].y - t0.y * 12 });

      let best = null, bestScore = -1e9;
      cands.forEach(c => {
        const q = clamp(c);
        const pulled = Math.abs(q.x - c.x) + Math.abs(q.y - c.y);
        const score = Math.min(nearest(q, all), 16)
                    + (placed.length ? Math.min(nearest(q, placed), 16) * 1.3 : 6)
                    - pulled * 0.6;
        if(score > bestScore){ bestScore = score; best = q }
      });
      placed.push(best);
      return best;
    });
  }

  /* ── one live pad ───────────────────────────────────────── */
  function create(opt){
    const canvas = opt.canvas;
    if(!canvas) return null;
    const noop = () => {};
    const onTip = opt.onTip || noop, onStroke = opt.onStroke || noop, onDone = opt.onDone || noop;

    if(typeof LETTERFORMS === 'undefined' || !LETTERFORMS){
      onTip('The letter shapes did not load. Check that writeit-letters.js sits in the js folder.', 'oops');
      return null;
    }
    const ch = opt.ch;
    const glyph = LETTERFORMS[ch] || LETTERFORMS[ch.toLowerCase()] || LETTERFORMS[ch.toUpperCase()];
    if(!glyph){ onTip('That letter is not in the book yet.', 'oops'); return null }

    const size = opt.size || sizeFor(opt.maxWidth);
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.style.width = size.w + 'px';
    canvas.style.height = size.h + 'px';
    canvas.width = Math.round(size.w * dpr);
    canvas.height = Math.round(size.h * dpr);
    const ctx = canvas.getContext('2d');
    if(!ctx){ onTip('This screen cannot draw. Try another browser.', 'oops'); return null }
    const scale = size.w / M.W;
    ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);

    const strokes = glyph.map(st => st.dot
      ? { dot:{ x:st.dot[0], y:st.dot[1] }, pts:[{ x:st.dot[0], y:st.dot[1] }], done:false }
      : { d:st.d, pts:samplePath(st.d), done:false });

    const P = {
      ch, ctx, canvas, size, strokes, badges:badgeSpots(strokes),
      mode: opt.mode === 'free' ? 'free' : 'trace',
      cur: opt.mode === 'free' ? -1 : 0,
      reach:0, drawing:false, ink:[], poly:null,
      showModel:false, demoT:null, demoAt:null, finished:false
    };

    /* ── painting ─────────────────────────────────────────── */
    function hline(y){ ctx.beginPath(); ctx.moveTo(5, y); ctx.lineTo(M.W - 5, y); ctx.stroke() }
    function roundRect(x, y, w, h, r){
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);         ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }
    function badge(s, at, n, active){
      ctx.beginPath(); ctx.arc(at.x, at.y, 6.4, 0, 7);
      ctx.fillStyle = active ? C.badge : C.badgeOff; ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = '700 8px Fredoka, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(String(n), at.x, at.y + 0.4);
      if(active){
        const p0 = s.pts[0];
        ctx.beginPath(); ctx.arc(p0.x, p0.y, 4.4, 0, 7);
        ctx.fillStyle = C.badge; ctx.fill();
        ctx.lineWidth = 1.4; ctx.strokeStyle = '#fff'; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(at.x, at.y); ctx.lineTo(p0.x, p0.y);
        ctx.lineWidth = 0.9; ctx.strokeStyle = C.badge; ctx.setLineDash([1.6, 2]);
        ctx.stroke(); ctx.setLineDash([]);
      }
    }
    function arrows(s){
      if(s.dot || s.pts.length < 4) return;
      const at = [s.pts.length - 1];
      if(s.pts.length > 22) at.unshift(Math.round(s.pts.length * 0.55));
      at.forEach(i => {
        const p = s.pts[i], t = tangent(s.pts, i, false);
        const a = Math.atan2(t.y, t.x), L = 6.2, spread = 0.42;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - L * Math.cos(a - spread), p.y - L * Math.sin(a - spread));
        ctx.lineTo(p.x - L * 0.55 * Math.cos(a), p.y - L * 0.55 * Math.sin(a));
        ctx.lineTo(p.x - L * Math.cos(a + spread), p.y - L * Math.sin(a + spread));
        ctx.closePath();
        ctx.fillStyle = C.badge; ctx.fill();
      });
    }

    function paint(){
      ctx.clearRect(0, 0, M.W, BOX_H);
      ctx.fillStyle = '#FDFCFF';
      roundRect(1, 1, M.W - 2, BOX_H - 2, 7); ctx.fill();

      ctx.lineWidth = 0.8; ctx.strokeStyle = C.line;  hline(M.TOP);
      ctx.lineWidth = 1.6; ctx.strokeStyle = C.base;  hline(M.BASE);
      ctx.lineWidth = 0.9; ctx.strokeStyle = C.mid;
      ctx.setLineDash([3, 3.5]); hline(M.MID); ctx.setLineDash([]);
      ctx.lineWidth = 0.7; ctx.strokeStyle = C.mid;
      ctx.setLineDash([2, 4]); hline(M.DESC); ctx.setLineDash([]);

      if(P.mode === 'trace' || P.showModel){
        P.strokes.forEach(s => {
          if(s.dot){
            ctx.beginPath(); ctx.arc(s.dot.x, s.dot.y, 4.5, 0, 7);
            ctx.fillStyle = s.done ? C.done : C.ghost; ctx.fill();
            return;
          }
          const path = new Path2D(s.d);
          ctx.lineCap = 'round'; ctx.lineJoin = 'round';
          if(s.done){
            ctx.lineWidth = 8; ctx.strokeStyle = C.done; ctx.setLineDash([]);
            ctx.stroke(path);
          } else {
            ctx.lineWidth = 8.5; ctx.strokeStyle = C.ghost; ctx.setLineDash([]);
            ctx.stroke(path);
            ctx.lineWidth = 1.6; ctx.strokeStyle = C.dots; ctx.setLineDash([2.6, 3.4]);
            ctx.stroke(path); ctx.setLineDash([]);
          }
        });
      }

      /* the child's own ink */
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.lineWidth = 6.5; ctx.strokeStyle = C.ink; ctx.setLineDash([]);
      P.ink.forEach(poly => {
        if(poly.length < 2){
          if(poly.length === 1){
            ctx.beginPath(); ctx.arc(poly[0].x, poly[0].y, 3.2, 0, 7);
            ctx.fillStyle = C.ink; ctx.fill();
          }
          return;
        }
        ctx.beginPath(); ctx.moveTo(poly[0].x, poly[0].y);
        for(let i = 1; i < poly.length; i++) ctx.lineTo(poly[i].x, poly[i].y);
        ctx.stroke();
      });

      if(P.mode === 'trace'){
        P.strokes.forEach((s, i) => { if(!s.done) badge(s, P.badges[i], i + 1, i === P.cur) });
        const s = P.strokes[P.cur];
        if(s && !s.done) arrows(s);
      }

      if(P.demoAt){
        ctx.beginPath(); ctx.arc(P.demoAt.x, P.demoAt.y, 5, 0, 7);
        ctx.fillStyle = C.badge; ctx.fill();
        ctx.lineWidth = 1.6; ctx.strokeStyle = '#fff'; ctx.stroke();
      }
    }

    /* ── following the finger ─────────────────────────────── */
    function at(e){
      const r = canvas.getBoundingClientRect();
      const p = e.touches ? e.touches[0] : e;
      return { x:(p.clientX - r.left) / r.width * M.W,
               y:(p.clientY - r.top) / r.height * BOX_H };
    }
    function startCheck(p){
      const s = P.strokes[P.cur];
      if(!s || s.done) return;
      if(s.dot){
        if(dist(p, s.dot) < TOL * 1.7) strokeDone();
        else onTip('Tap the little dot above the letter.', 'oops');
        return;
      }
      if(dist(p, s.pts[0]) <= TOL * 1.5){ P.reach = 0; onTip('') }
      else { P.reach = -1; onTip('Start on the yellow dot ' + circled(P.cur + 1) + '.', 'oops') }
    }
    function follow(p){
      const s = P.strokes[P.cur];
      if(!s || s.done || s.dot) return;
      if(P.reach < 0){                        // began in the wrong place — let them re-start
        if(dist(p, s.pts[0]) <= TOL * 1.5){ P.reach = 0; onTip('') }
        return;
      }
      const n = s.pts.length;
      const win = Math.max(3, Math.round(n * AHEAD));
      for(let i = P.reach; i <= Math.min(n - 1, P.reach + win); i++){
        if(dist(p, s.pts[i]) <= TOL) P.reach = Math.max(P.reach, i);
      }
      if(P.reach >= n - 2) strokeDone();
    }
    function strokeDone(){
      P.strokes[P.cur].done = true;
      P.ink = [];                             // the neat stroke replaces the wobbly one
      P.reach = 0;
      const left = P.strokes.filter(x => !x.done).length;
      onStroke(P.strokes.length - left, P.strokes.length);
      if(left){
        P.cur = P.strokes.findIndex(x => !x.done);
        onTip(['Good. Now stroke ' + circled(P.cur + 1) + '.', 'Nice! Next one.',
               'That\'s it — keep going.'][P.cur % 3], 'good');
        paint();
      } else {
        P.finished = true;
        paint();
        onDone();
      }
    }

    const onDown = e => {
      e.preventDefault();
      if(P.finished) return;
      stopDemo();
      const p = at(e);
      P.drawing = true;
      P.poly = [p]; P.ink.push(P.poly);
      if(P.mode === 'trace') startCheck(p);
      paint();
    };
    const onMove = e => {
      if(!P.drawing) return;
      e.preventDefault();
      const p = at(e);
      P.poly.push(p);
      if(P.mode === 'trace') follow(p);
      paint();
    };
    const onUp = () => {
      if(!P.drawing) return;
      P.drawing = false; P.poly = null;
      const cs = P.strokes[P.cur];
      if(P.mode === 'trace' && cs && !cs.done && P.reach > 2)
        onTip('Keep going — follow the arrow to the end.');
    };

    let bound;
    if(window.PointerEvent){
      canvas.addEventListener('pointerdown', onDown, { passive:false });
      canvas.addEventListener('pointermove', onMove, { passive:false });
      canvas.addEventListener('pointercancel', onUp);
      window.addEventListener('pointerup', onUp);
      bound = 'pointer';
    } else {
      canvas.addEventListener('touchstart', onDown, { passive:false });
      canvas.addEventListener('touchmove', onMove, { passive:false });
      window.addEventListener('touchend', onUp);
      bound = 'touch';
    }

    /* ── show me how ──────────────────────────────────────── */
    function stopDemo(){
      if(P.demoT){ cancelAnimationFrame(P.demoT); P.demoT = null; P.demoAt = null }
    }
    function demo(){
      stopDemo();
      const s = P.strokes[P.cur] || P.strokes[0];
      if(!s) return;
      if(s.dot){ P.demoAt = s.dot; paint(); setTimeout(() => { P.demoAt = null; paint() }, 700); return }
      const t0 = performance.now(), ms = 260 + s.pts.length * 22;
      const step = now => {
        const u = Math.min(1, (now - t0) / ms);
        P.demoAt = s.pts[Math.round(u * (s.pts.length - 1))];
        paint();
        if(u < 1) P.demoT = requestAnimationFrame(step);
        else { P.demoT = null; setTimeout(() => { P.demoAt = null; paint() }, 380) }
      };
      P.demoT = requestAnimationFrame(step);
      onTip('Watch the dot, then you try.');
    }

    paint();
    onStroke(0, P.strokes.length);

    return {
      strokes: P.strokes,
      get done(){ return P.finished },
      get current(){ return P.cur },
      paint,
      demo,
      clear(){
        stopDemo();
        P.ink = [];
        if(P.mode === 'trace'){ P.strokes.forEach(s => s.done = false); P.cur = 0; P.reach = 0 }
        P.finished = false;
        paint(); onStroke(0, P.strokes.length);
      },
      reveal(v){ P.showModel = v !== false; paint() },
      /* Let the child move on even if a stroke will not register —
         a wobbly finger should never end the journey. */
      giveUp(){ P.finished = true; P.strokes.forEach(s => s.done = true); paint() },
      destroy(){
        stopDemo();
        if(bound === 'pointer'){
          canvas.removeEventListener('pointerdown', onDown);
          canvas.removeEventListener('pointermove', onMove);
          canvas.removeEventListener('pointercancel', onUp);
          window.removeEventListener('pointerup', onUp);
        } else {
          canvas.removeEventListener('touchstart', onDown);
          canvas.removeEventListener('touchmove', onMove);
          window.removeEventListener('touchend', onUp);
        }
      }
    };
  }

  /* A pad as big as the screen allows, never taller than it is wide-ish */
  function sizeFor(maxWidth){
    const scr = document.querySelector('.screen.active');
    const avail = Math.min((scr ? scr.clientWidth : window.innerWidth) - 26, maxWidth || 430);
    const chrome = window.innerWidth > window.innerHeight ? 250 : 312;
    const byHeight = Math.floor((window.innerHeight - chrome) * (M.W / BOX_H));
    const w = Math.max(180, Math.min(avail, byHeight));
    return { w, h: Math.round(w * BOX_H / M.W) };
  }

  return { create, sizeFor, METRICS:M, BOX_H, TOL };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = { LetterPad };
