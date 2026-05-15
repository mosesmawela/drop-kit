---
name: drop-kit
description: Generate Instagram and TikTok marketing assets for music releases, news drops, tour announcements, and label updates. Hybrid Canva + Remotion pipeline — Canva MCP for static graphics (1:1 feed, 4:5 portrait, story stills, press cards, carousels), Remotion for video (9:16 reels, lyric videos, audio-reactive teasers, motion graphics). Pulls brand presets from existing LVRN artist EPKs (Al Xapo, CIZA, TxC, Chlé, KaygeeRSA, Ggoldie) — swap the preset, keep the system. Use whenever the user asks to "drop graphics", "make IG/TikTok content", "announce a release", "post for [artist]", "make a teaser", "promo card", "tour graphic", "press card", "lyric video", or shares a release date + artist + track and wants a content pack. Routes static work to Canva, video work to Remotion at Anti-Gravity/Claudevinci/marketing-renderer/.
---

# drop-kit — release / news / update content engine

One skill, two engines. Canva MCP handles brand-templated static graphics. Remotion handles motion. The skill decides which one to use, fills in brand tokens from `brand-presets/`, and ships content packs ready to post.

## When this skill kicks in

- "Make a drop kit for [artist]'s new single" / "post pack" / "content pack"
- "We're announcing [release] on [date] — generate the assets"
- "Make an IG carousel about [news]"
- "Tour date graphic for [artist]" / "press card" / "feature announce"
- "Make a 9:16 teaser / reel / lyric video"
- "Audio-reactive visualizer for this snippet"
- User shares: artist name + release/news + date + cover art (or none) and wants posts

## Asset matrix — what to generate and where

| Output | Format | Engine | Trigger |
|---|---|---|---|
| **IG feed (square)** | 1080×1080 | Canva | "feed post", "square", "carousel slide" |
| **IG feed (portrait)** | 1080×1350 (4:5) | Canva | "portrait", "feed", "default feed" |
| **IG / TikTok story still** | 1080×1920 (9:16) | Canva | "story", "static story" |
| **Carousel (multi-slide)** | 1080×1350 × N | Canva | "carousel", "swipe", "slides" |
| **Press card / news drop** | 1080×1080 + 1080×1350 | Canva | "press card", "news", "announce" |
| **Tour date list** | 1080×1350 | Canva | "tour graphic", "dates" |
| **Reel / TikTok video** | 1080×1920, 6–15s | Remotion | "reel", "teaser", "9:16 video" |
| **Lyric video** | 1080×1920, audio-driven | Remotion | "lyric video", "captioned snippet" |
| **Audio-reactive visualizer** | 1080×1920 or 1080×1080 | Remotion | "visualizer", "audio-reactive", "wave bars" |
| **Motion press card** | 1080×1080 / 1080×1350 | Remotion | "animated card", "moving cover reveal" |

**Default pack for a single release:** 1× square feed, 1× 4:5 carousel (3 slides), 1× 9:16 story still, 1× 9:16 reel teaser (6–10s). Confirm before generating if any are unwanted.

## Step 1 — gather the brief

Before touching any tool, get these from the user (ask if missing):

1. **Artist** — Al Xapo / CIZA / TxC / Chlé / KaygeeRSA / Ggoldie / other (other → ask for 2 brand colors)
2. **Drop type** — `single` / `EP/album` / `feature` / `tour-date` / `news` / `press-feature` / `milestone`
3. **Title** — track / release / news headline
4. **Date** — release date or event date (or "out now")
5. **Cover art / hero image URL** — ImageKit URL preferred; placeholder if none
6. **Platforms/DSPs** — Spotify, Apple, YouTube, etc. (for the "stream now" CTAs)
7. **Copy** — taglines, body text. Offer to draft if user passes.
8. **Targets** — which formats from the matrix (default the pack above)

Print the brief back to the user before generating. **Never assume** — confirm.

## Step 2 — load brand preset

Read `brand-presets/<artist-slug>.json`. Has:
- `cool` — primary cool accent (the "teal" slot from EPK)
- `warm` — primary warm accent (the "orange" slot)
- `bg`, `fg`, `fg-dim`, `line` — neutrals (shared across all artists)
- `fonts` — display + body stack
- `tags` — vibe descriptors fed to Canva/Remotion for layout choice

Missing artist? Create a new preset on the fly using the user's two colors.

## Step 3 — route to the engine

### Static work → Canva MCP

Use Canva tools (available after restart + OAuth):
1. Search Canva templates matching `{artist.tags} + {drop-type} + {format}`. Prefer the user's own Canva brand kit if present.
2. Pick a template, clone it into a new design.
3. Inject text fields: title, date, artist name, DSP CTAs.
4. Swap brand colors → preset's `cool` and `warm`.
5. Place cover art via upload or URL.
6. Export → PNG for stills, MP4 for animated.
7. Return the Canva design URL **and** the exported file path.

If no Canva template matches well, fall back to Remotion `templates/still/` and render a PNG locally.

### Video work → Remotion

Project lives at `<skill>/renderer/` (sibling folder to this SKILL.md).

Compositions to build (each parameterised by brand preset + brief):
- `<ReelTeaser />` — 6–10s 9:16. Cover art reveal → title type-in → DSP CTA stack
- `<LyricVideo />` — 9:16, lyrics burned in time-synced (use `template-tiktok` Whisper.cpp pattern)
- `<AudioReactive />` — 9:16 or 1:1, wave bars / pulse driven by track snippet
- `<MotionPressCard />` — 1:1 or 4:5, ~3s loop, animated press quote + artist mark
- `<TourDateMotion />` — 9:16, dates ticker scroll with map glow

Render via `npx remotion render src/index.ts <Composition> out/<artist>/<slug>.mp4 --props='{...}'`.

## Step 4 — package & report

Output to user:
- File paths (local) + Canva design URLs
- Suggested caption (3 variants: hype / cinematic / dry)
- Hashtag stack (artist + genre + region SA + general)
- Best post time window for the artist's timezone

## Brand presets — the only thing that changes between artists

The 6 LVRN artist presets live in `brand-presets/`. Adding a new artist = adding one JSON file. The system has zero per-artist code paths.

| Artist | Cool | Warm | Vibe |
|---|---|---|---|
| Al Xapo | `#0BA5A6` teal | `#F26B2C` orange | Afro-house, ATL × JOZI |
| CIZA | `#1E90FF` electric blue | `#F5A623` sunset gold | Amapiano, 6am sunrise |
| TxC | `#7C3AED` purple | `#EC4899` pink | Female duo, club, gqom-pop |
| Chlé | `#6D28D9` violet | `#FBBF24` amber | Vocal-led, gqom × R&B |
| KaygeeRSA | `#FBBF24` gold | `#DC2626` red | DJ/producer, hard hits |
| Ggoldie | `#06B6D4` cyan | `#FACC15` yellow | Bright, melodic |

Neutrals (shared): `--bg #0a0a0a` · `--bg-2 #141414` · `--fg #f5f5f5` · `--fg-dim #9a9a9a` · `--line #2a2a2a`.

## Pre-flight checklist (run on every job)

- [ ] Brief confirmed back to user
- [ ] Brand preset loaded (or created)
- [ ] Cover art accessible (resolves, not 404)
- [ ] Output formats list locked
- [ ] Canva MCP available? (if static work) — if not, fall back to Remotion still render
- [ ] `marketing-renderer/` deps installed? (if video work)

## Anti-patterns (don't do these)

- **Don't generate the whole pack silently.** Confirm format list first.
- **Don't invent brand colors.** Read the preset or ask the user.
- **Don't use Canva for video unless the user explicitly asks** — Remotion is faster, deterministic, and version-controlled.
- **Don't bake captions into images.** Captions go in the post copy, not the asset (except lyric videos).
- **Don't ship a single asset without DSP CTAs** on release graphics — defeats the point.

## Related skills (load when relevant)

- `remotion-best-practices` — load when writing/editing any Remotion code in `marketing-renderer/`
- `artist-epk-builder` — for EPK decks (different output, same brand presets)
- `hyperframes` / `huashu-design` — HTML alternative if Canva + Remotion both fail
- `firecrawl` — to scrape press coverage URLs for press cards

## Project paths

Everything lives in one repo (`moses-mawela/drop-kit` on GitHub, cloned at `Anti-Gravity/moses_skills/skills/drop-kit/`):

```
drop-kit/                       ← skill root + git repo root
├── SKILL.md                    ← this file
├── README.md                   ← human/GitHub-facing intro
├── brand-presets/              ← per-artist JSON (6 LVRN artists baked in)
├── workflows/                  ← release-announce, news-drop, tour-date, lyric-teaser
└── renderer/                   ← Remotion project (compositions, package.json, node_modules)
    └── src/compositions/       ← ReelTeaser, MotionPressCard, LyricVideo, AudioReactive, TourDateMotion
```

- Brand presets: `<skill>/brand-presets/*.json`
- Render output: `<skill>/renderer/out/<artist-slug>/<drop-slug>.mp4` (gitignored)

## Composition catalog (all in `renderer/src/compositions/`)

| ID | Size | Duration | Notes |
|---|---|---|---|
| `ReelTeaser` | 1080×1920 | 7s | Release announce — cover reveal + title + DSP CTA |
| `MotionPressCard` | 1080×1080 | 3s | News/feature, square feed |
| `MotionPressCardPortrait` | 1080×1350 | 3s | News, IG portrait |
| `LyricVideo` | 1080×1920 | 12s default | Frame-timed captions over blurred cover + outro |
| `AudioReactiveReel` | 1080×1920 | 10s | Spectrum bars + cover pulse (uses `@remotion/media-utils`) |
| `AudioReactiveSquare` | 1080×1080 | 10s | Same engine, square |
| `TourDateMotion` | 1080×1920 | 10s | Staggered date row reveal + CTA |
