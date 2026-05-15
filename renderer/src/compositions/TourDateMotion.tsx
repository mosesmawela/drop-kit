import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

export const tourDateMotionSchema = z.object({
  artistName: z.string(),
  tourName: z.string(),
  dates: z.array(
    z.object({
      day: z.string(), // "FRI"
      date: z.string(), // "24 MAY"
      city: z.string(),
      venue: z.string(),
      soldOut: z.boolean().optional(),
    }),
  ),
  ticketCta: z.string(),
  cool: z.string(),
  warm: z.string(),
  bg: z.string(),
  fg: z.string(),
});

export type TourDateMotionProps = z.infer<typeof tourDateMotionSchema>;

export const TourDateMotion: React.FC<TourDateMotionProps> = ({
  artistName,
  tourName,
  dates,
  ticketCta,
  cool,
  warm,
  bg,
  fg,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Header reveal (frames 0–25)
  const headerY = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110 },
  });

  // Stagger each date row in (rows enter at 15, 30, 45, 60... frames)
  const rowStart = (i: number) => 20 + i * 12;

  // CTA fades in last 35 frames
  const ctaStart = durationInFrames - 35;
  const ctaAlpha = interpolate(frame, [ctaStart, ctaStart + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bg,
        backgroundImage: `radial-gradient(ellipse at top, ${cool}22 0%, transparent 60%), radial-gradient(ellipse at bottom, ${warm}22 0%, transparent 60%)`,
      }}
    >
      {/* Header */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          paddingTop: 140,
        }}
      >
        <div
          style={{
            transform: `translateY(${interpolate(headerY, [0, 1], [-60, 0])}px)`,
            opacity: interpolate(headerY, [0, 1], [0, 1]),
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "Anton, Impact, sans-serif",
              fontSize: 28,
              letterSpacing: 8,
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
              fontSize: 96,
              lineHeight: 0.95,
              color: fg,
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            {tourName}
          </div>
          <div
            style={{
              height: 4,
              width: 160,
              background: `linear-gradient(90deg, ${cool}, ${warm})`,
              margin: "0 auto",
              borderRadius: 2,
            }}
          />
        </div>
      </AbsoluteFill>

      {/* Date list */}
      <AbsoluteFill
        style={{
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 80px",
          paddingTop: 140,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {dates.map((d, i) => {
            const s = spring({
              frame: frame - rowStart(i),
              fps,
              config: { damping: 16, stiffness: 120 },
            });
            const tx = interpolate(s, [0, 1], [-80, 0]);
            const a = interpolate(s, [0, 1], [0, 1]);
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 28,
                  padding: "20px 28px",
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: 14,
                  border: `1px solid ${d.soldOut ? warm + "55" : cool + "33"}`,
                  transform: `translateX(${tx}px)`,
                  opacity: a,
                }}
              >
                <div
                  style={{
                    fontFamily: "Anton, Impact, sans-serif",
                    fontSize: 36,
                    color: cool,
                    minWidth: 90,
                    textTransform: "uppercase",
                  }}
                >
                  {d.day}
                </div>
                <div
                  style={{
                    fontFamily: "Anton, Impact, sans-serif",
                    fontSize: 36,
                    color: fg,
                    minWidth: 180,
                    textTransform: "uppercase",
                  }}
                >
                  {d.date}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "Anton, Impact, sans-serif",
                      fontSize: 42,
                      color: d.soldOut ? "#666" : fg,
                      textTransform: "uppercase",
                      textDecoration: d.soldOut ? "line-through" : "none",
                      lineHeight: 1,
                    }}
                  >
                    {d.city}
                  </div>
                  <div
                    style={{
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontSize: 18,
                      color: "#9a9a9a",
                      marginTop: 4,
                    }}
                  >
                    {d.venue}
                  </div>
                </div>
                {d.soldOut && (
                  <div
                    style={{
                      padding: "8px 16px",
                      background: warm,
                      color: bg,
                      fontFamily: "Anton, Impact, sans-serif",
                      fontSize: 18,
                      letterSpacing: 2,
                      borderRadius: 6,
                      textTransform: "uppercase",
                    }}
                  >
                    Sold Out
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* CTA */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: 100,
        }}
      >
        <div
          style={{
            opacity: ctaAlpha,
            padding: "22px 48px",
            background: warm,
            color: bg,
            fontFamily: "Anton, Impact, sans-serif",
            fontSize: 40,
            letterSpacing: 5,
            textTransform: "uppercase",
            borderRadius: 999,
          }}
        >
          {ticketCta}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
