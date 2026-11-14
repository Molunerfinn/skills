#!/usr/bin/env bash
# Symlink every skill in skills/ into a skills directory (default: ~/.claude/skills).
set -euo pipefail

repo="$(cd "$(dirname "$0")" && pwd)"
target="${1:-$HOME/.claude/skills}"
mkdir -p "$target"

for dir in "$repo"/skills/*/; do
  name="$(basename "$dir")"
  link="$target/$name"
  if [ -L "$link" ]; then
    ln -sfn "${dir%/}" "$link"
  elif [ -e "$link" ]; then
    echo "skip $name: $link exists and is not a symlink" >&2
    continue
  else
    ln -s "${dir%/}" "$link"
  fi
  echo "linked $name -> ${dir%/}"
done
