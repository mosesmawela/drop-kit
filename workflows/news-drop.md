# Workflow: news-drop

Use for label/artist news that isn't a release: signing announcement, partnership, milestone (1M streams, chart entry), magazine feature.

## Inputs
- headline (1 line), body (≤3 lines), source URL if external, artist slug or "LVRN" for label-level

## Default pack
1. **1080×1080 press card** — bold headline, source attribution, brand accent bar
2. **1080×1350 quote card** — pull-quote from article, photo of artist, source logo
3. **1080×1920 story** — same content, vertical

## Engine routing
- All static → Canva
- If user asks for "animated" version → Remotion `<MotionPressCard />`

## Notes
- Always cite the source if external (publication name + date)
- For milestones (streaming numbers, chart positions) use the warm accent for the number, cool for surrounding type
