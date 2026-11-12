#!/usr/bin/env python3
"""Render a short local SHIP-42 preview video with Chrome and ffmpeg. No paid tools."""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SLIDES = ROOT / "slides"
HTML = ROOT / "preview.html"
OUT = ROOT / "shipcontext-ship42-local-preview.mp4"

SCENES = [
    ("title", 6),
    ("problem", 7),
    ("rec", 9),
    ("decided", 8),
    ("owners", 6),
    ("blockers", 9),
    ("end", 7),
]


def run(cmd: list[str]) -> None:
    print("+", " ".join(cmd), file=sys.stderr)
    subprocess.run(cmd, check=True)


def main() -> None:
    SLIDES.mkdir(parents=True, exist_ok=True)
    chrome = "google-chrome"
    for name, _dur in SCENES:
        url = HTML.as_uri() + f"?scene={name}"
        png = SLIDES / f"{name}.png"
        run([
            chrome,
            "--headless=new",
            "--disable-gpu",
            "--no-sandbox",
            "--hide-scrollbars",
            "--window-size=1280,720",
            f"--screenshot={png}",
            url,
        ])
        # Chrome sometimes writes a slightly different size; normalize.
        run([
            "ffmpeg", "-y", "-i", str(png),
            "-vf", "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2",
            str(SLIDES / f"{name}-1280.png"),
        ])

    concat = SLIDES / "concat.txt"
    lines = []
    for name, dur in SCENES:
        path = (SLIDES / f"{name}-1280.png").as_posix().replace("'", r"'\''")
        lines.append(f"file '{path}'")
        lines.append(f"duration {dur}")
    # concat demuxer needs the last file repeated
    last = (SLIDES / f"{SCENES[-1][0]}-1280.png").as_posix().replace("'", r"'\''")
    lines.append(f"file '{last}'")
    concat.write_text("\n".join(lines) + "\n")

    run([
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0", "-i", str(concat),
        "-r", "30",
        "-pix_fmt", "yuv420p",
        "-c:v", "libx264",
        "-movflags", "+faststart",
        str(OUT),
    ])
    print(OUT)
    total = sum(d for _, d in SCENES)
    print(f"duration_seconds={total}", file=sys.stderr)


if __name__ == "__main__":
    main()
