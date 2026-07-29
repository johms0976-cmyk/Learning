#!/usr/bin/env bash
# Lists the mp3 files you have actually recorded so the game can trust
# that list instead of asking the browser for each file one at a time.
#
#   bash tools/make-manifest.sh
#
# Run it every time you add or remove a recording, then commit the result.

set -e
cd "$(dirname "$0")/.."
OUT="audio/wordland/manifest.json"

{
  echo "["
  find audio/wordland -name '*.mp3' -type f \
    | sed 's|^audio/wordland/||' \
    | sort \
    | awk 'NR>1{printf ",\n"} {printf "  \"%s\"", $0}'
  echo ""
  echo "]"
} > "$OUT"

COUNT=$(grep -c '\.mp3' "$OUT" || true)
echo "$OUT written — $COUNT recordings listed"
