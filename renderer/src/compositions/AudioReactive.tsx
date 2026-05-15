import {
  AbsoluteFill,
  Audio,
  Img,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useAudioData, visualizeAudio } from "@remotion/media-utils";
import { z } from "zod";

export const audioReactiveSchema = z.object({
  artistName: z.string(),
  title: z.string(),
  coverUrl: z.string(),
  audioUrl: z.string(),
  cool: z.string(),
  warm: z.string(),
  bg: z.string(),
  fg: z.string(),
});

export type AudioReactiveProps = z.infer<typeof audioReactiveSchema>;

const BAR_COUNT = 48;

export const AudioReactive: React.FC<AudioReactiveProps> = ({
  artistName,
  title,
  coverUrl,
  audioUrl,
  cool,
  warm,
  bg,
  fg,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const audioData = useAudioData(audioUrl);

  if (!audioData) {
    return <AbsoluteFill style={{ backgroundColor: bg }} />;
  }

  const spectrum = visualizeAudio({
    fps,
    frame,
    audioData,
    numberOfSamples: 64,
  });

  // Average low-end energy for cover pulse
  const lowEnergy =
    spectrum.slice(0, 8).reduce((a, b) => a + b, 0) / 8;
  const coverScale = 1 + lowEnergy * 0.4;
  const glowAlpha = 0.4 + lowEnergy * 0.6;

  const isPortrait = height > width;
  const coverSize = isPortrait ? width * 0.72 : Math.min(width, height) * 0.55;
  const barAreaWidth = isPortrait ? width - 80 : width * 0.7;
  const barAreaHeight = isPortrait ? 180 : 220;
  const barWidth = barAreaWidth / BAR_COUNT - 4;

  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      <Audio src={audioUrl} />

      {/* Pulsing glow */}
      <AbsoluteFill
        style={{
          opacity: 0.35 * glowAlpha,
          filter: "blur(80px)",
          transform: `scale(${coverScale * 1.3})`,
        }}
      >
        <Img
          src={coverUrl}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: bg, opacity: 0.45 }} />

      {/* Centered cover, reactive scale */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingTop: isPortrait ? -180 : 0,
        }}
      >
        <div
          style={{
            width: coverSize,
            height: coverSize,
            borderRadius: 24,
            overflow: "hidden",
            transform: `scale(${coverScale})`,
            boxShadow: `0 0 ${60 + lowEnergy * 120}px ${cool}${Math.floor(glowAlpha * 255).toString(16).padStart(2, "0")}, 0 30px 80px rgba(0,0,0,0.6)`,
          }}
        >
          <Img
            src={coverUrl}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </AbsoluteFill>

      {/* Spectrum bars */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: isPortrait ? 280 : 120,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 4,
            alignItems: "flex-end",
            height: barAreaHeight,
            width: barAreaWidth,
            justifyContent: "center",
          }}
        >
          {Array.from({ length: BAR_COUNT }).map((_, i) => {
            const sampleIdx = Math.floor((i / BAR_COUNT) * spectrum.length);
            const v = spectrum[sampleIdx] || 0;
            const h = Math.max(6, v * barAreaHeight * 1.8);
            return (
              <div
                key={i}
                style={{
                  width: barWidth,
                  height: h,
                  background: `linear-gradient(180deg, ${warm}, ${cool})`,
                  borderRadius: 4,
                  boxShadow: `0 0 12px ${warm}88`,
                }}
              />
            );
          })}
        </div>
      </AbsoluteFill>

      {/* Title overlay */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: isPortrait ? 140 : 60,
        }}
      >
        <div
          style={{
            fontFamily: "Anton, Impact, sans-serif",
            fontSize: 24,
            letterSpacing: 6,
            color: cool,
            textTransform: "uppercase",
          }}
        >
          {artistName}
        </div>
        <div
          style={{
            fontFamily: "Anton, Impact, sans-serif",
            fontSize: 64,
            color: fg,
            textTransform: "uppercase",
            letterSpacing: 2,
            marginTop: 6,
          }}
        >
          {title}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
