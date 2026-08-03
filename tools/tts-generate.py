#!/usr/bin/env python3
"""
TTS-GENERATE  ·  python3 tools/tts-generate.py

Fills in the missing recordings with the "Ryan GB" voice
(en-GB-RyanNeural) so the games have a consistent British voice
everywhere instead of whatever the tablet happens to provide.

    pip install edge-tts
    node tools/tts-spec.js          # build the spec first
    python3 tools/tts-generate.py --dry-run
    python3 tools/tts-generate.py

It never overwrites a file that already exists, so anything you
have recorded in your own voice is safe. Delete a file to have it
regenerated.

    --dry-run          list what would be made, make nothing
    --only words       just one folder (repeatable)
    --limit 20         stop after N files, for a listening test
    --force            overwrite existing files (off by default)
    --voice NAME       a different voice
"""

import argparse
import asyncio
import json
import os
import sys

VOICE = "en-GB-RyanNeural"          # "Ryan GB"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SPEC = os.path.join(ROOT, "tools", "tts-spec.json")
AUDIO = os.path.join(ROOT, "audio", "wordland")
CONCURRENCY = 4                      # be gentle; this is a free service


def load_spec():
    if not os.path.exists(SPEC):
        sys.exit("tts-spec.json not found — run:  node tools/tts-spec.js")
    with open(SPEC, encoding="utf-8") as f:
        return json.load(f)


def wanted(spec, args):
    out = []
    for s in spec:
        folder = s["path"].split("/")[0]
        if args.only and folder not in args.only:
            continue
        if s.get("skip") and not args.force:
            continue
        if not s.get("text"):
            continue
        dest = os.path.join(AUDIO, s["path"])
        if os.path.exists(dest) and not args.force:
            continue
        out.append(s)
    if args.limit:
        out = out[: args.limit]
    return out


async def synth(sem, s, voice, made, failed):
    import edge_tts

    dest = os.path.join(AUDIO, s["path"])
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    async with sem:
        for attempt in range(3):
            try:
                comm = edge_tts.Communicate(
                    text=s["text"],
                    voice=voice,
                    rate=s.get("rate", "+0%"),
                    pitch=s.get("pitch", "+0Hz"),
                )
                tmp = dest + ".part"
                await comm.save(tmp)
                if os.path.getsize(tmp) < 512:
                    raise RuntimeError("suspiciously small file")
                os.replace(tmp, dest)
                made.append(s["path"])
                print(f"  ok   {s['path']:<44} {s['text'][:44]}")
                return
            except Exception as e:                       # noqa: BLE001
                if attempt == 2:
                    failed.append((s["path"], str(e)))
                    print(f"  FAIL {s['path']:<44} {e}")
                else:
                    await asyncio.sleep(1.5 * (attempt + 1))


async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--only", action="append", default=[])
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--voice", default=VOICE)
    args = ap.parse_args()

    spec = load_spec()
    jobs = wanted(spec, args)

    held = [s for s in spec if s.get("skip")]
    if held and not args.force:
        print(f"Holding back {len(held)} files that should not be synthesised:")
        for reason in sorted({s['skip'] for s in held}):
            n = sum(1 for s in held if s['skip'] == reason)
            print(f"  {n:>4}  {reason}")
        print()

    if not jobs:
        print("Nothing to do.")
        return

    chars = sum(len(s["text"]) for s in jobs)
    print(f"{len(jobs)} files, {chars} characters, voice {args.voice}\n")

    if args.dry_run:
        for s in jobs:
            print(f"  {s['path']:<44} {s['text'][:60]}")
        print(f"\nDry run — nothing written.")
        return

    try:
        import edge_tts  # noqa: F401
    except ImportError:
        sys.exit("edge-tts not installed — run:  pip install edge-tts")

    sem = asyncio.Semaphore(CONCURRENCY)
    made, failed = [], []
    await asyncio.gather(*(synth(sem, s, args.voice, made, failed) for s in jobs))

    print(f"\n{len(made)} written, {len(failed)} failed")
    if failed:
        print("Re-run to retry the failures; finished files are skipped.")
    print("\nNow run:  bash tools/make-manifest.sh   (or the game will not find them)")


if __name__ == "__main__":
    asyncio.run(main())
