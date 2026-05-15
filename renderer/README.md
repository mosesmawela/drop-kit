# marketing-renderer

Remotion project for the **drop-kit** skill. Renders motion graphics for music releases, news drops, tour announcements, and label updates.

Driven by `moses_skills/skills/drop-kit/` — that skill picks the composition, loads the artist brand preset, and calls render.

## Compositions

| ID | Size | Duration | Use |
|---|---|---|---|
| `ReelTeaser` | 1080×1920 | 7s | Release announce reel — cover reveal + title + DSP CTA |
| `MotionPressCard` | 1080×1080 | 3s | News/feature drops, square feed |
| `MotionPressCardPortrait` | 1080×1350 | 3s | News drops, IG portrait |

Planned (add when needed): `LyricVideo`, `AudioReactive`, `TourDateMotion`.

## Render

```bash
# Studio (visual editor)
npx remotion studio

# Headless render
npx remotion render src/index.ts ReelTeaser out/al-xapo/new-single.mp4 \
  --props='{"artistName":"AL XAPO","title":"NEW SINGLE","date":"OUT 24 MAY","coverUrl":"https://...","cool":"#0BA5A6","warm":"#F26B2C","bg":"#0a0a0a","fg":"#f5f5f5","dspCta":"STREAM NOW"}'
```

Brand props (cool/warm/bg/fg) come from `moses_skills/skills/drop-kit/brand-presets/<artist>.json`.

## Outputs

`out/<artist-slug>/<drop-slug>.mp4` — gitignored.
