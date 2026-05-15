# Workflow: tour-date

Use for a single show announcement OR a multi-date tour list.

## Inputs
- artist slug, date(s), city/venue, ticket URL, support acts (optional)

## Default pack
1. **1080×1350 feed** — date + city as hero, venue + support smaller, ticket CTA
2. **1080×1920 story** — same content, vertical, with countdown sticker zone reserved
3. (Multi-date only) **1080×1350 list card** — all dates stacked, "TICKETS → bio" footer

## Engine routing
- Static → Canva
- Animated date ticker / map glow → Remotion `<TourDateMotion />`

## Notes
- City names always uppercase, large
- Date format: "FRI · 24 MAY" not "5/24/2026"
- Sold-out shows: strikethrough city + "SOLD OUT" in warm accent
