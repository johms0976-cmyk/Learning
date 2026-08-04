#!/usr/bin/env bash
# ============================================================
#  RECORD-VOICE  ·  double-click this file
# ------------------------------------------------------------
#  Builds the four voice packs — British woman, British man,
#  American woman, American man — then rebuilds the manifest so
#  the games can find them.
#
#  Each pack is a folder under audio/wordland/voices/ holding the
#  same tree as the plain folders. A grown-up picks one in
#  Grown-ups settings; anything a pack is missing falls back to
#  the plain folders, then to the tablet's own voice.
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
bye()  { echo ""; read -r -p "  Press Return to close."; exit 0; }

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
[ -f tools/names-list.js ] || fail "tools/names-list.js is missing. Check it is in the tools folder."

# ── 4. edge-tts ─────────────────────────────────────────────
if ! $PY -c "import edge_tts" >/dev/null 2>&1; then
  echo ""
  echo "  Installing edge-tts (one time only)..."
  $PY -m pip install edge-tts --quiet || $PY -m pip install edge-tts --quiet --break-system-packages \
    || fail "Could not install edge-tts. Try running:  $PY -m pip install edge-tts"
fi

# ── 5. the names, then the spec ─────────────────────────────
if [ ! -f audio/wordland/names.json ]; then
  echo ""
  echo "  Choosing which names to say..."
  node tools/names-list.js || fail "tools/names-list.js failed — see the message above."
fi

echo ""
echo "  Working out what to say..."
node tools/tts-spec.js || fail "tools/tts-spec.js failed — see the message above."

# ── 6. how much, per voice? ─────────────────────────────────
echo ""
$PY tools/tts-generate.py --pack uk-male --dry-run 2>/dev/null | grep -E "files, [0-9]+ characters" | head -1

# ── 7. which voice? ─────────────────────────────────────────
echo ""
echo "  ------------------------------------------------------"
echo "  Which voice?"
echo ""
echo "  1) British woman     uk-female"
echo "  2) British man       uk-male"
echo "  3) American woman    us-female"
echo "  4) American man      us-male"
echo "  5) All four          (longest — leave it running)"
echo "  6) The plain folders (top up what was there before)"
echo ""
echo "  7) Just rebuild the manifest"
echo "  8) Show me the voices edge-tts offers"
echo "  9) Quit"
echo "  ------------------------------------------------------"
read -r -p "  Choose 1-9: " pick
echo ""

case "$pick" in
  1) PACK="uk-female" ;;
  2) PACK="uk-male" ;;
  3) PACK="us-female" ;;
  4) PACK="us-male" ;;
  5) PACK="all" ;;
  6) PACK="original" ;;
  7) PACK="" ;;
  8) $PY tools/tts-generate.py --list-voices; bye ;;
  *) echo "  Nothing done."; bye ;;
esac

# ── 8. how much of it? ──────────────────────────────────────
if [ -n "$PACK" ]; then
  echo "  ------------------------------------------------------"
  echo "  How much?"
  echo ""
  echo "  1) 10 files first, so you can listen     [recommended]"
  echo "  2) Just the names"
  echo "  3) Everything"
  echo "  4) List it without making anything"
  echo "  ------------------------------------------------------"
  read -r -p "  Choose 1-4: " how
  echo ""

  case "$how" in
    1) $PY tools/tts-generate.py --pack "$PACK" --only phrases --limit 10 ;;
    2) $PY tools/tts-generate.py --pack "$PACK" --only names ;;
    3) $PY tools/tts-generate.py --pack "$PACK" ;;
    4) $PY tools/tts-generate.py --pack "$PACK" --dry-run; bye ;;
    *) echo "  Nothing done."; bye ;;
  esac
fi

# ── 9. always rebuild the manifest ──────────────────────────
echo ""
node tools/make-manifest.js

# ── 10. where things stand ──────────────────────────────────
echo ""
echo "  Where each voice stands:"
echo ""
for p in uk-female uk-male us-female us-male; do
  n=$(find "audio/wordland/voices/$p" -name '*.mp3' 2>/dev/null | wc -l | tr -d ' ')
  printf "    %-12s %s files\n" "$p" "$n"
done
n=$(find audio/wordland -name '*.mp3' -not -path 'audio/wordland/voices/*' 2>/dev/null | wc -l | tr -d ' ')
printf "    %-12s %s files\n" "original" "$n"

echo ""
echo "  Done. Commit and push, then reload the app on the iPad."
echo "  Pick the voice in Grown-ups settings."
bye
