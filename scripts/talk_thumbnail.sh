#!/usr/bin/env bash
# Make a talk thumbnail from the first page of a slide PDF (or from an image).
#
#   scripts/talk_thumbnail.sh assets/pdf/my_talk_slides.pdf my-talk
#
# Writes assets/img/talks/thumbs/<name>.jpg (800px wide). Then add
# `thumbnail: <name>.jpg` to the talk's entry in _data/talks.yml.
# Needs pdftoppm (poppler) and ImageMagick: brew install poppler imagemagick
set -euo pipefail

if [ "$#" -ne 2 ]; then
  echo "usage: $0 <slides.pdf|image> <name>" >&2
  exit 1
fi

src="$1"
name="$2"
root="$(cd "$(dirname "$0")/.." && pwd)"
out_dir="$root/assets/img/talks/thumbs"
out="$out_dir/$name.jpg"
mkdir -p "$out_dir"

case "$src" in
  *.pdf | *.PDF)
    tmp="$(mktemp -d)"
    trap 'rm -rf "$tmp"' EXIT
    pdftoppm -f 1 -l 1 -r 150 -png "$src" "$tmp/page"
    magick "$tmp"/page*.png -resize '800x>' -background white -flatten -quality 85 "$out"
    ;;
  *)
    magick "$src" -resize '800x>' -background white -flatten -quality 85 "$out"
    ;;
esac

echo "wrote ${out#"$root"/}"
