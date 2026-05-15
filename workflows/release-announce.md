# Workflow: release-announce

Use when an artist is dropping a new single, EP, or album.

## Inputs
- artist slug, title, release date, cover art URL, DSPs (Spotify/Apple/YouTube/etc.)
- pre-save? `out-now`? `coming-soon` countdown?

## Default pack
1. **1080×1080 feed** — cover-forward, artist name lockup, "OUT NOW" or "[DATE]" tag, DSP icon row at bottom
2. **1080×1350 carousel (3 slides)** — (a) cover + title, (b) tracklist or pull-quote, (c) "Stream now → [link in bio]"
3. **1080×1920 story still** — vertical crop of cover + swipe-up CTA
4. **1080×1920 reel teaser, 6–10s** — cover reveal → title type-in → DSP CTA

## Engine routing
- 1, 2, 3 → Canva (template fill + brand swap)
- 4 → Remotion `<ReelTeaser />` at `marketing-renderer/`

## Copy variants (offer all 3)
- **Hype:** "OUT NOW 🔥 [TITLE] — link in bio"
- **Cinematic:** "[TITLE]. A new chapter. [DATE]."
- **Dry:** "[ARTIST] — [TITLE]. Available everywhere."
