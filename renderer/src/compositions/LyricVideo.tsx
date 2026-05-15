import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

export const lyricVideoSchema = z.object({
  artistName: z.string(),
  title: z.string(),
  coverUrl: z.string(),
  audioUrl: z.string(),
  cool: z.string(),
  warm: z.string(),
  bg: z.string(),
  fg: z.string(),
  // Each caption: { text, startFrame, endFrame, accent? }
  captions: z.array(
    z.object({
      text: z.string(),
      startFrame: z.number(),
      endFrame: z.number(),
      accent: z.boolean().optional(),
    }),
  ),
  outroDate: z.string(),
});

export type LyricVideoProps = z.infer<typeof lyricVideoSchema>;

const Caption: React.FC<{
  text: string;
  start: number;
  end: number;
  accent?: boolean;
  cool: string;
  warm: string;
  fg: string;
}> = ({ text, start, end, accent, cool, warm, fg }) => {
  const frame = useCurrentFrame();
  if (frame < start || frame > end) return null;

  const local = frame - start;
  const span = end - start;
  const alpha = interpolate(local, [0, 5, span - 6, span], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const y = interpolate(local, [0, 8], [40, 0], { extrapolateRight: "clamp" });
  const scale = interpolate(local, [0, 8], [0.94, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: "0 80px",
      }}
    >
      <div
        style={{
          opacity: alpha,
          transform: `translateY(${y}px) scale(${scale})`,
          fontFamily: "Anton, Impact, sans-serif",
          fontSize: accent ? 124 : 96,
          lineHeight: 1.02,
          textAlign: "center",
          textTransform: "uppercase",
          color: accent ? warm : fg,
          textShadow: accent
            ? `0 0 40px ${warm}66, 0 6px 24px rgba(0,0,0,0.7)`
            : `0 6px 24px rgba(0,0,0,0.8)`,
          letterSpacing: 2,
          maxWidth: 940,
          background: accent
            ? `linear-gradient(90deg, ${warm} 0%, ${cool} 100%)`
            : undefined,
          WebkitBackgroundClip: accent ? "text" : undefined,
          WebkitTextFillColor: accent ? "transparent" : undefined,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

export const LyricVideo: React.FC<LyricVideoProps> = ({
  artistName,
  title,
  coverUrl,
  audioUrl,
  cool,
  warm,
  bg,
  fg,
  captions,
  outroDate,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Outro starts in the last 45 frames (~1.5s @30fps)
  const outroStart = durationInFrames - 45;
  const inOutro = frame >= outroStart;
  const outroProgress = inOutro
    ? interpolate(frame, [outroStart, outroStart + 20], [0, 1], {
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      <Audio src={audioUrl} />

      {/* Blurred cover background pulse */}
      <AbsoluteFill
        style={{
          opacity: 0.5,
          filter: "blur(34px) saturate(140%)",
          transform: `scale(${1.15 + Math.sin(frame * 0.06) * 0.02})`,
        }}
      >
        <Img
          src={coverUrl}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: bg, opacity: 0.55 }} />

      {/* Persistent corner mark */}
      <AbsoluteFill
        style={{
          padding: 40,
          justifyContent: "flex-start",
          alignItems: "flex-start",
          opacity: inOutro ? 0 : 1,
        }}
      >
        <div
          style={{
            fontFamily: "Anton, Impact, sans-serif",
            fontSize: 24,
            letterSpacing: 4,
            color: cool,
            textTransform: "uppercase",
          }}
        >
          {artistName}
        </div>
        <div
          style={{
            fontFamily: "Anton, Impact, sans-serif",
            fontSize: 32,
            color: fg,
            textTransform: "uppercase",
            marginTop: 4,
          }}
        >
          {title}
        </div>
      </AbsoluteFill>

      {/* Captions */}
      {!inOutro &&
        captions.map((c, i) => (
          <Caption
            key={i}
            text={c.text}
            start={c.startFrame}
            end={c.endFrame}
            accent={c.accent}
            cool={cool}
            warm={warm}
            fg={fg}
          />
        ))}

      {/* Outro CTA */}
      {inOutro && (
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            opacity: outroProgress,
          }}
        >
          <div
            style={{
              fontFamily: "Anton, Impact, sans-serif",
              fontSize: 56,
              letterSpacing: 8,
              color: cool,
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            {artistName}
          </div>
          <div
            style={{
              fontFamily: "Anton, Impact, sans-serif",
              fontSize: 160,
              lineHeight: 0.95,
              color: fg,
              textTransform: "uppercase",
              textAlign: "center",
              maxWidth: 940,
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 36,
              padding: "20px 48px",
              background: warm,
              color: bg,
              fontFamily: "Anton, Impact, sans-serif",
              fontSize: 48,
              letterSpacing: 6,
              textTransform: "uppercase",
              borderRadius: 999,
            }}
          >
            {outroDate}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
