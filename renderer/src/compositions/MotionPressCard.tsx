import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

export const motionPressCardSchema = z.object({
  artistName: z.string(),
  headline: z.string(),
  source: z.string(),
  coverUrl: z.string(),
  cool: z.string(),
  warm: z.string(),
  bg: z.string(),
  fg: z.string(),
});

export type MotionPressCardProps = z.infer<typeof motionPressCardSchema>;

export const MotionPressCard: React.FC<MotionPressCardProps> = ({
  artistName,
  headline,
  source,
  coverUrl,
  cool,
  warm,
  bg,
  fg,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 16, stiffness: 90 } });
  const headlineY = interpolate(enter, [0, 1], [40, 0]);
  const headlineAlpha = interpolate(frame, [10, 30], [0, 1], {
    extrapolateRight: "clamp",
  });
  const accentBar = interpolate(frame, [20, 50], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      <AbsoluteFill style={{ opacity: 0.25 }}>
        <Img src={coverUrl} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(40px)" }} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
        }}
      >
        <div
          style={{
            fontFamily: "Anton, Impact, sans-serif",
            fontSize: 26,
            letterSpacing: 6,
            color: cool,
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          {artistName} · NEWS
        </div>
        <div
          style={{
            height: 6,
            width: `${accentBar * 280}px`,
            background: `linear-gradient(90deg, ${cool}, ${warm})`,
            marginBottom: 32,
            borderRadius: 3,
          }}
        />
        <div
          style={{
            transform: `translateY(${headlineY}px)`,
            opacity: headlineAlpha,
            fontFamily: "Anton, Impact, sans-serif",
            fontSize: 92,
            lineHeight: 1.05,
            color: fg,
            textTransform: "uppercase",
            maxWidth: 900,
          }}
        >
          {headline}
        </div>
        <div
          style={{
            marginTop: 36,
            opacity: headlineAlpha,
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 22,
            color: warm,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          via {source}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
