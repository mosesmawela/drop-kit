# drop-kit

Hybrid **Canva + Remotion** content engine for music releases, news drops, tour announcements, and label updates. Built for the LVRN roster (Al Xapo, CIZA, TxC, Chlé, KaygeeRSA, Ggoldie) but works for any artist — just add a brand preset.

This is both:
- A **Claude Code Agent Skill** (read by Claude when you ask for marketing assets — see [`SKILL.md`](./SKILL.md))
- A **Remotion project** for video rendering — see [`renderer/`](./renderer)

---

## What this is for

You're dropping a single, announcing a tour, or got featured in a magazine. You need:
- A 1:1 Instagram feed post
- A 4:5 carousel
- A 9:16 story / TikTok teaser
- An audio-reactive visualizer or lyric video
- All matching the artist's brand palette

**drop-kit** picks the right engine for each (Canva for static, Remotion for motion), loads the artist's brand preset, and spits out a content pack.

---

## Layout

```
drop-kit/
├── SKILL.md                  Claude-facing instructions (engine routing, brief gathering)
├── README.md                 you are here
├── brand-presets/
│   ├── al-xapo.json
│   ├── ciza.json
│   ├── chle.json
│   ├── ggoldie.json
│   ├── kaygeersa.json
│   └── txc.json
├── workflows/
│   ├── release-announce.md
│   ├── news-drop.md
│   ├── tour-date.md
│   └── lyric-teaser.md
└── renderer/                 Remotion project
    ├── package.json
    ├── src/
    │   ├── Root.tsx          composition registry
    │   ├── index.ts
    │   └── compositions/
    │       ├── ReelTeaser.tsx           1080×1920 release teaser
    │       ├── MotionPressCard.tsx      1080×1080 + 1080×1350 news cards
    │       ├── LyricVideo.tsx           1080×1920 captioned video
    │       ├── AudioReactive.tsx        spectrum visualizer (9:16 & 1:1)
    │       └── TourDateMotion.tsx       1080×1920 date list animation
    └── out/                  rendered MP4s (gitignored)
```

---

## Compositions

| ID | Size | Duration | Use |
|---|---|---|---|
| `ReelTeaser` | 1080×1920 | 7s | Release announce reel — cover reveal + title + DSP CTA |
| `MotionPressCard` | 1080×1080 | 3s | News/feature drops, square feed |
| `MotionPressCardPortrait` | 1080×1350 | 3s | News drops, IG portrait |
| `LyricVideo` | 1080×1920 | 12s | Caption-driven snippet teaser |
| `AudioReactiveReel` | 1080×1920 | 10s | Spectrum bars + cover pulse |
| `AudioReactiveSquare` | 1080×1080 | 10s | Square visualizer for feed |
| `TourDateMotion` | 1080×1920 | 10s | Staggered tour date list + CTA |

---

## Quick start

### Render a reel

```bash
cd renderer
npx remotion studio                  # visual editor
# or headless:
npx remotion render src/index.ts ReelTeaser out/ciza/new-single.mp4 \
  --props='{"artistName":"CIZA","title":"6AM","date":"OUT 24 MAY","coverUrl":"https://...","cool":"#1E90FF","warm":"#F5A623","bg":"#0a0a0a","fg":"#f5f5f5","dspCta":"STREAM NOW"}'
```

### Use through Claude Code

The skill auto-loads when you say things like:
- "Make a drop kit for [artist]'s new single, out [date]"
- "Generate IG + TikTok content for [news]"
- "Tour date graphic for [artist] — [dates]"
- "Lyric teaser for [track]"

Claude reads `SKILL.md`, gathers the brief, loads the brand preset, routes static work to Canva MCP and video to the Remotion compositions here.

---

## Brand presets

Each artist preset has 2 accents (cool + warm), shared neutrals, fonts, and vibe tags. Adding a new artist = one JSON file. No code changes.

| Artist | Cool | Warm | Vibe |
|---|---|---|---|
| Al Xapo | `#0BA5A6` teal | `#F26B2C` orange | Afro-house, ATL × JOZI |
| CIZA | `#1E90FF` electric blue | `#F5A623` sunset gold | Amapiano, 6am sunrise |
| TxC | `#7C3AED` purple | `#EC4899` pink | Female duo, club, gqom-pop |
| Chlé | `#6D28D9` violet | `#FBBF24` amber | Vocal-led, gqom × R&B |
| KaygeeRSA | `#FBBF24` gold | `#DC2626` red | DJ/producer, hard hits |
| Ggoldie | `#06B6D4` cyan | `#FACC15` yellow | Bright, melodic |

---

## Dependencies

- Node 18+
- Remotion 4.x
- `@remotion/media-utils` (for audio-reactive compositions)
- Canva MCP server (configured in `~/.claude/settings.json` — restart Claude Code + OAuth on first use)

---

## License

MIT. Built by [Moses Mawela](https://github.com/mosesmawela) for LVRN.
