import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

export const reelTeaserSchema = z.object({
  artistName: z.string(),
  title: z.string(),
  date: z.string(),
  coverUrl: z.string(),
  cool: z.string(),
  warm: z.string(),
  bg: z.string(),
  fg: z.string(),
  dspCta: z.string(),
});

export type ReelTeaserProps = z.infer<typeof reelTeaserSchema>;

export const ReelTeaser: React.FC<ReelTeaserProps> = ({
  artistName,
  title,
  date,
  coverUrl,
  cool,
  warm,
  bg,
  fg,
  dspCta,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Phase 1 (0–60f): cover reveal with zoom + brightness ramp
  const coverScale = interpolate(frame, [0, 30], [1.15, 1], {
    extrapolateRight: "clamp",
  });
  const coverAlpha = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Phase 2 (45–90f): title slides in from bottom + bar wipes
  const titleY = spring({
    frame: frame - 45,
    fps,
    config: { damping: 14, stiffness: 110 },
  });
  const titleTranslate = interpolate(titleY, [0, 1], [120, 0]);
  const titleAlpha = interpolate(frame, [45, 65], [0, 1], {
    extrapolateRight: "clamp",
  });
  const barWidth = interpolate(frame, [55, 80], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 3 (120–end): CTA pop
  const ctaAlpha = interpolate(
    frame,
    [120, 140],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const ctaScale = interpolate(
    frame,
    [120, 145],
    [0.85, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Outro fade tail
  const outFade = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: bg, opacity: outFade }}>
      {/* Blurred cover bg layer */}
      <AbsoluteFill
        style={{
          opacity: coverAlpha * 0.55,
          filter: "blur(28px) saturate(120%)",
          transform: `scale(${coverScale * 1.2})`,
        }}
      >
        <Img src={coverUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>

      {/* Bg dim */}
      <AbsoluteFill style={{ backgroundColor: bg, opacity: 0.45 }} />

      {/* Centered cover card */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 120,
        }}
      >
        <div
          style={{
            width: 720,
            height: 720,
            borderRadius: 28,
            overflow: "hidden",
            boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px ${cool}55`,
            transform: `scale(${coverScale})`,
            opacity: coverAlpha,
          }}
        >
          <Img
            src={coverUrl}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </AbsoluteFill>

      {/* Title + artist block */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          padding: "0 80px 320px",
        }}
      >
        <div
          style={{
            transform: `translateY(${titleTranslate}px)`,
            opacity: titleAlpha,
          }}
        >
          <div
            style={{
              fontFamily: "Anton, Impact, sans-serif",
              fontSize: 36,
              letterSpacing: 6,
              color: cool,
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            {artistName}
          </div>
          <div
            style={{
              fontFamily: "Anton, Impact, sans-serif",
              fontSize: 110,
              lineHeight: 0.95,
              color: fg,
              textTransform: "uppercase",
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 28,
              height: 6,
              width: `${barWidth}%`,
              maxWidth: 720,
              background: `linear-gradient(90deg, ${cool}, ${warm})`,
              borderRadius: 3,
            }}
          />
        </div>
      </AbsoluteFill>

      {/* CTA strip */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 140,
        }}
      >
        <div
          style={{
            opacity: ctaAlpha,
            transform: `scale(${ctaScale})`,
            padding: "22px 44px",
            background: warm,
            color: bg,
            fontFamily: "Anton, Impact, sans-serif",
            fontSize: 42,
            letterSpacing: 4,
            textTransform: "uppercase",
            borderRadius: 999,
          }}
        >
          {dspCta} · {date}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
