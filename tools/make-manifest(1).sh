#!/usr/bin/env bash
# Lists every recording you have actually made into
# audio/wordland/manifest.json, so the game stops guessing.
# Run it after adding or removing any .mp3:   bash tools/make-manifest.sh
set -euo pipefail
cd "$(dirname "$0")/.."
DIR=audio/wordland
[ -d "$DIR" ] || { echo "No $DIR folder yet — nothing to list."; exit 0; }
{
  echo "["
  find "$DIR" -type f -name '*.mp3' \
    | sed "s|^$DIR/||" | LC_ALL=C sort \
    | sed 's|.*|  "&",|' | sed '$ s|,$||'
  echo "]"
} > "$DIR/manifest.json"
N=$(grep -c '\.mp3' "$DIR/manifest.json" || true)
echo "$DIR/manifest.json written — $N recordings listed"
