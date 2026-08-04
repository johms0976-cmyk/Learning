#!/usr/bin/env python3
"""
TTS-GENERATE  ·  python3 tools/tts-generate.py --pack uk-male

Fills in missing recordings with a synthesised voice, so the games
have a consistent voice everywhere instead of whatever the tablet
happens to provide.

    pip install edge-tts
    node tools/names-list.js         # choose the names to say
    node tools/tts-spec.js           # build the spec first
    python3 tools/tts-generate.py --pack uk-male --dry-run
    python3 tools/tts-generate.py --pack uk-male

── VOICE PACKS ─────────────────────────────────────────────────
The spec holds pack-neutral paths — 'words/cat.mp3'. This script
puts the pack folder in front, so one spec builds every voice:

    --pack uk-male    ->  audio/wordland/voices/uk-male/words/cat.mp3
    --pack original   ->  audio/wordland/words/cat.mp3

    --pack all        ->  all four, one after another

It never overwrites a file that already exists, in any pack, so
anything you have recorded in your own voice is safe. Delete a
file to have it regenerated, or pass --force.

    --pack NAME        uk-female | uk-male | us-female | us-male
                       | original | all        (repeatable)
    --dry-run          list what would be made, make nothing
    --only words       just one folder (repeatable)
    --limit 20         stop after N files, for a listening test
    --force            overwrite existing files (off by default)
    --voice NAME       override the pack's voice for one run
    --pitch-shift N    nudge every pitch by N Hz, for one run
    --list-voices      show the voices edge-tts can actually use
"""

import argparse
import asyncio
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SPEC = os.path.join(ROOT, "tools", "tts-spec.json")
AUDIO = os.path.join(ROOT, "audio", "wordland")
CONCURRENCY = 4                      # be gentle; this is a free service

# ── the packs ───────────────────────────────────────────────────
# `voice` is an edge-tts voice name. Run --list-voices to see what
# your installed version actually offers; the list does change, and
# a name that has gone away fails with "no audio received".
#
# `pitch_shift` nudges every pitch in the spec, in Hz. The spec was
# tuned against Ryan, who sits low; the female voices start higher,
# so they get a little taken off. Adjust these by ear — make ten
# files, listen, change the number, delete them and make them again.
PACKS = {
    "uk-female": {"voice": "en-GB-SoniaNeural", "pitch_shift": -6,
                  "label": "British woman",
                  "alts": ["en-GB-LibbyNeural", "en-GB-OliviaNeural"]},
    "uk-male":   {"voice": "en-GB-RyanNeural",  "pitch_shift": 0,
                  "label": "British man",
                  "alts": ["en-GB-ThomasNeural"]},
    "us-female": {"voice": "en-US-JennyNeural", "pitch_shift": -6,
                  "label": "American woman",
                  "alts": ["en-US-AriaNeural", "en-US-MichelleNeural"]},
    "us-male":   {"voice": "en-US-GuyNeural",   "pitch_shift": 0,
                  "label": "American man",
                  "alts": ["en-US-AndrewNeural", "en-US-EricNeural"]},
    # the plain folders, for topping up what was there before packs
    "original":  {"voice": "en-GB-RyanNeural",  "pitch_shift": 0,
                  "label": "the original folders", "alts": []},
}

ORDER = ["uk-female", "uk-male", "us-female", "us-male"]


def folder(pack):
    """Where this pack's files live, under audio/wordland/."""
    return "" if pack == "original" else os.path.join("voices", pack)


def load_spec():
    if not os.path.exists(SPEC):
        sys.exit("tts-spec.json not found — run:  node tools/tts-spec.js")
    with open(SPEC, encoding="utf-8") as f:
        return json.load(f)


def shift_pitch(value, hz):
    """'+12Hz' shifted by -6 -> '+6Hz'. Left alone if it isn't Hz."""
    if not hz:
        return value
    m = re.fullmatch(r"([+-]?)(\d+)Hz", str(value or "+0Hz"))
    if not m:
        return value
    n = int(m.group(2)) * (-1 if m.group(1) == "-" else 1)
    n += hz
    return f"{'+' if n >= 0 else '-'}{abs(n)}Hz"


def wanted(spec, pack, args):
    out = []
    base = os.path.join(AUDIO, folder(pack))
    for s in spec:
        kind = s["path"].split("/")[0]
        if args.only and kind not in args.only:
            continue
        if s.get("skip") and not args.force:
            continue
        if not s.get("text"):
            continue
        if os.path.exists(os.path.join(base, s["path"])) and not args.force:
            continue
        out.append(s)
    if args.limit:
        out = out[: args.limit]
    return out


async def synth(sem, s, pack, voice, shift, made, failed):
    import edge_tts

    dest = os.path.join(AUDIO, folder(pack), s["path"])
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    async with sem:
        for attempt in range(3):
            try:
                comm = edge_tts.Communicate(
                    text=s["text"],
                    voice=voice,
                    rate=s.get("rate", "+0%"),
                    pitch=shift_pitch(s.get("pitch", "+0Hz"), shift),
                )
                tmp = dest + ".part"
                await comm.save(tmp)
                if os.path.getsize(tmp) < 512:
                    raise RuntimeError("suspiciously small file")
                os.replace(tmp, dest)
                made.append(s["path"])
                print(f"  ok   {s['path']:<42} {s['text'][:38]}")
                return
            except Exception as e:                       # noqa: BLE001
                if attempt == 2:
                    failed.append((s["path"], str(e)))
                    print(f"  FAIL {s['path']:<42} {e}")
                else:
                    await asyncio.sleep(1.5 * (attempt + 1))


def list_voices():
    """Ask edge-tts what it can actually do, filtered to English.

    Worth doing before a long run: the voice list changes over time,
    and a name that has gone away fails on every single file."""
    lines = []
    try:
        r = subprocess.run(["edge-tts", "--list-voices"],
                           capture_output=True, text=True, timeout=60)
        lines = [l for l in r.stdout.splitlines() if l.strip().startswith("en-")]
    except Exception:                                    # noqa: BLE001
        pass
    if not lines:
        print("Could not ask edge-tts for its voice list. Try:\n"
              "  edge-tts --list-voices | grep '^en-'")
        return
    print("English voices edge-tts offers:\n")
    for l in lines:
        print("  " + l)
    print("\nPut the one you want in PACKS at the top of this file.")


async def run_pack(pack, spec, args):
    cfg = PACKS[pack]
    voice = args.voice or cfg["voice"]
    shift = cfg["pitch_shift"] if args.pitch_shift is None else args.pitch_shift
    jobs = wanted(spec, pack, args)

    where = "audio/wordland/" + (folder(pack) + "/" if folder(pack) else "")
    print("=" * 62)
    print(f"  {pack}  ·  {cfg['label']}")
    print(f"  voice {voice}   pitch {shift:+d}Hz   into {where}")
    print("=" * 62)

    if not jobs:
        print("  Nothing to do — this voice is complete.\n")
        return 0, 0

    chars = sum(len(s["text"]) for s in jobs)
    print(f"  {len(jobs)} files, {chars} characters\n")

    if args.dry_run:
        for s in jobs[:40]:
            print(f"  {s['path']:<42} {s['text'][:38]}")
        if len(jobs) > 40:
            print(f"  … and {len(jobs) - 40} more")
        print()
        return 0, 0

    sem = asyncio.Semaphore(CONCURRENCY)
    made, failed = [], []
    await asyncio.gather(*(synth(sem, s, pack, voice, shift, made, failed) for s in jobs))
    print(f"\n  {len(made)} written, {len(failed)} failed\n")
    return len(made), len(failed)


async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--pack", action="append", default=[])
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--only", action="append", default=[])
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--voice", default=None)
    ap.add_argument("--pitch-shift", type=int, default=None)
    ap.add_argument("--list-voices", action="store_true")
    args = ap.parse_args()

    if args.list_voices:
        list_voices()
        return

    # which packs?
    picked = []
    for p in (args.pack or ["uk-male"]):
        if p == "all":
            picked += ORDER
        elif p in PACKS:
            picked.append(p)
        else:
            sys.exit(f"Unknown pack '{p}'. Choose from: "
                     + ", ".join(list(PACKS) + ["all"]))
    picked = list(dict.fromkeys(picked))          # keep order, drop repeats

    if args.voice and len(picked) > 1:
        sys.exit("--voice applies to one pack at a time. Pick a single --pack.")

    spec = load_spec()

    held = [s for s in spec if s.get("skip")]
    if held and not args.force:
        print(f"Holding back {len(held)} files that should not be synthesised:")
        for reason in sorted({s["skip"] for s in held}):
            n = sum(1 for s in held if s["skip"] == reason)
            print(f"  {n:>4}  {reason}")
        print("A pack without these falls back to the plain folders, then to")
        print("the tablet's own voice — nothing breaks, they just aren't yours.\n")

    if not args.dry_run:
        try:
            import edge_tts  # noqa: F401
        except ImportError:
            sys.exit("edge-tts not installed — run:  pip install edge-tts")

    total_made = total_failed = 0
    for pack in picked:
        m, f = await run_pack(pack, spec, args)
        total_made += m
        total_failed += f

    if args.dry_run:
        print("Dry run — nothing written.")
        return

    print("=" * 62)
    print(f"  {total_made} written, {total_failed} failed across "
          f"{len(picked)} voice{'' if len(picked) == 1 else 's'}")
    if total_failed:
        print("  Re-run to retry the failures; finished files are skipped.")
    print("\n  Now run:  node tools/make-manifest.js")
    print("  (without it the games will not find the new files)")


if __name__ == "__main__":
    asyncio.run(main())
