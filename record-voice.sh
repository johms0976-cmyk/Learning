#!/usr/bin/env bash
# ============================================================
#  RECORD-VOICE  ·  double-click this file
# ------------------------------------------------------------
#  Fills in the missing audio with the Ryan GB voice, then
#  rebuilds the manifest so the games can find it.
#
#  Mac: right-click > Open the first time (macOS blocks
#  downloaded scripts until you do). After that, double-click.
#
#  If it has never been run:  chmod +x record-voice.command
# ============================================================

cd "$(dirname "$0")" || exit 1

echo ""
echo "  Word Land — voice generator"
echo "  ==========================="
echo ""

fail() { echo ""; echo "  ✗ $1"; echo ""; read -r -p "  Press Return to close."; exit 1; }

# ── 1. is Node here? ────────────────────────────────────────
if ! command -v node >/dev/null 2>&1; then
  fail "Node is not installed. Get it from https://nodejs.org then run this again."
fi

# ── 2. is Python here? ──────────────────────────────────────
PY=""
for c in python3 python; do
  if command -v "$c" >/dev/null 2>&1; then PY="$c"; break; fi
done
[ -n "$PY" ] || fail "Python is not installed. Get it from https://python.org then run this again."

echo "  node $(node --version)   $($PY --version)"

# ── 3. are we in the right folder? ──────────────────────────
[ -f index.html ] || fail "This file must sit in the same folder as index.html."
[ -f tools/tts-spec.js ] || fail "tools/tts-spec.js is missing. Check it is in the tools folder."
[ -f tools/tts-generate.py ] || fail "tools/tts-generate.py is missing. Check it is in the tools folder."

# ── 4. edge-tts ─────────────────────────────────────────────
if ! $PY -c "import edge_tts" >/dev/null 2>&1; then
  echo ""
  echo "  Installing edge-tts (one time only)..."
  $PY -m pip install edge-tts --quiet || $PY -m pip install edge-tts --quiet --break-system-packages \
    || fail "Could not install edge-tts. Try running:  $PY -m pip install edge-tts"
fi

# ── 5. build the spec ───────────────────────────────────────
echo ""
echo "  Working out what to say..."
node tools/tts-spec.js || fail "tools/tts-spec.js failed — see the message above."

# ── 6. how much? ────────────────────────────────────────────
echo ""
$PY tools/tts-generate.py --dry-run 2>/dev/null | head -6

echo ""
echo "  ------------------------------------------------------"
echo "  1) Make 10 files first, so you can listen  [recommended]"
echo "  2) Make all of them (about 10 minutes)"
echo "  3) Just rebuild the manifest"
echo "  4) Quit"
echo "  ------------------------------------------------------"
read -r -p "  Choose 1-4: " choice
echo ""

case "$choice" in
  1) $PY tools/tts-generate.py --only phrases --limit 10 ;;
  2) $PY tools/tts-generate.py ;;
  3) : ;;
  *) echo "  Nothing done."; read -r -p "  Press Return to close."; exit 0 ;;
esac

# ── 7. always rebuild the manifest ──────────────────────────
echo ""
node tools/make-manifest.js

echo ""
echo "  Done. The new files are in audio/wordland/"
echo "  Commit and push them, then reload the app on the iPad."
echo ""
read -r -p "  Press Return to close."
