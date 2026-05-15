# Workflow: lyric-teaser

Use for short captioned video teasers from an unreleased or just-released track.

## Inputs
- artist slug, track title, audio file (mp3/wav, 8–20s snippet), lyrics for the snippet (or "transcribe from audio")
- cover art for background

## Pipeline
1. Drop audio at `marketing-renderer/public/audio/<artist>/<slug>.mp3`
2. If lyrics not provided: run Whisper.cpp transcription (template-tiktok pattern) → `out/captions.json`
3. Render `<LyricVideo />` composition with cover blurred bg + animated captions + brand accent highlights on key words
4. Output: `out/<artist>/<slug>-lyric.mp4` (1080×1920)

## Engine
- 100% Remotion. Canva can't do tight audio-synced caption timing.

## Notes
- Keep snippets ≤15s for IG/TikTok algorithm
- Burn the track title + artist mark in corner the whole time
- Last 1.5s: full-screen "OUT [DATE]" or "STREAM NOW" with DSP icons
