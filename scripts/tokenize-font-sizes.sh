#!/bin/bash
# Usage: ./scripts/tokenize-font-sizes.sh <path/to/file.css>
# Replaces all mappable raw pixel font-size values with CSS custom property var() calls.
# Edge cases (1-5px, 600px, 680px, .em values) are intentionally skipped.
set -e
FILE="$1"
[[ -z "$FILE" ]] && { echo "Usage: $0 <file.css>"; exit 1; }
[[ ! -f "$FILE" ]] && { echo "Error: file not found: $FILE"; exit 1; }

perl -pi -e '
  # ── Interface tier ──────────────────────────────────
  # Process X.5px before Xpx to avoid partial matches
  s/font-size: *8\.5px/font-size: var(--text-2xs)/g;
  s/font-size: *9\.5px/font-size: var(--text-2xs)/g;
  s/font-size: *7px/font-size: var(--text-2xs)/g;
  s/font-size: *8px/font-size: var(--text-2xs)/g;
  s/font-size: *9px/font-size: var(--text-2xs)/g;

  s/font-size: *10\.5px/font-size: var(--text-xs)/g;
  s/font-size: *10px/font-size: var(--text-xs)/g;

  s/font-size: *11\.5px/font-size: var(--text-sm)/g;
  s/font-size: *11px/font-size: var(--text-sm)/g;

  s/font-size: *12\.5px/font-size: var(--text-base)/g;
  s/font-size: *12px/font-size: var(--text-base)/g;

  s/font-size: *13\.5px/font-size: var(--text-md)/g;
  s/font-size: *13px/font-size: var(--text-md)/g;

  s/font-size: *14\.5px/font-size: var(--text-lg)/g;
  s/font-size: *14px/font-size: var(--text-lg)/g;

  s/font-size: *15px/font-size: var(--text-xl)/g;
  s/font-size: *16\.5px/font-size: var(--text-xl)/g;
  s/font-size: *16px/font-size: var(--text-xl)/g;
  s/font-size: *17\.5px/font-size: var(--text-xl)/g;
  s/font-size: *17px/font-size: var(--text-xl)/g;

  # ── Heading tier ────────────────────────────────────
  s/font-size: *18\.5px/font-size: var(--text-2xl)/g;
  s/font-size: *18px/font-size: var(--text-2xl)/g;
  s/font-size: *19px/font-size: var(--text-2xl)/g;
  s/font-size: *20px/font-size: var(--text-2xl)/g;

  s/font-size: *22px/font-size: var(--text-3xl)/g;
  s/font-size: *24px/font-size: var(--text-3xl)/g;
  s/font-size: *26px/font-size: var(--text-3xl)/g;

  s/font-size: *28px/font-size: var(--text-4xl)/g;
  s/font-size: *30px/font-size: var(--text-4xl)/g;
  s/font-size: *32px/font-size: var(--text-4xl)/g;
  s/font-size: *34px/font-size: var(--text-4xl)/g;
  s/font-size: *36px/font-size: var(--text-4xl)/g;

  s/font-size: *40px/font-size: var(--text-5xl)/g;
  s/font-size: *42px/font-size: var(--text-5xl)/g;
  s/font-size: *44px/font-size: var(--text-5xl)/g;
  s/font-size: *46px/font-size: var(--text-5xl)/g;
  s/font-size: *48px/font-size: var(--text-5xl)/g;
  s/font-size: *52px/font-size: var(--text-5xl)/g;

  s/font-size: *54px/font-size: var(--text-6xl)/g;
  s/font-size: *58px/font-size: var(--text-6xl)/g;
  s/font-size: *60px/font-size: var(--text-6xl)/g;
  s/font-size: *64px/font-size: var(--text-6xl)/g;
  s/font-size: *66px/font-size: var(--text-6xl)/g;
  s/font-size: *68px/font-size: var(--text-6xl)/g;
  s/font-size: *72px/font-size: var(--text-6xl)/g;
  s/font-size: *74px/font-size: var(--text-6xl)/g;

  # ── Fluid tier (clamp) ──────────────────────────────
  s|font-size: *clamp\(22px,2\.4vw,32px\)|font-size: var(--text-fluid-xs)|g;
  s|font-size: *clamp\(26px,3vw,42px\)|font-size: var(--text-fluid-sm)|g;
  s|font-size: *clamp\(26px,3\.2vw,42px\)|font-size: var(--text-fluid-sm-alt)|g;
  s|font-size: *clamp\(34px,4\.4vw,56px\)|font-size: var(--text-fluid-md)|g;
  s|font-size: *clamp\(34px,4\.8vw,60px\)|font-size: var(--text-fluid-md-alt)|g;
  s|font-size: *clamp\(68px,20vw,110px\)|font-size: var(--text-fluid-lg)|g;
  s|font-size: *clamp\(96px,16vw,180px\)|font-size: var(--text-fluid-xl)|g;
  s|font-size: *clamp\(160px,12vw,210px\)|font-size: var(--text-fluid-2xl)|g;
  s|font-size: *clamp\(190px,13vw,240px\)|font-size: var(--text-fluid-3xl)|g;
' "$FILE"

echo "Done: $FILE"
