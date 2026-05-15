import { Composition } from "remotion";
import { ReelTeaser, reelTeaserSchema } from "./compositions/ReelTeaser";
import {
  MotionPressCard,
  motionPressCardSchema,
} from "./compositions/MotionPressCard";
import { LyricVideo, lyricVideoSchema } from "./compositions/LyricVideo";
import {
  AudioReactive,
  audioReactiveSchema,
} from "./compositions/AudioReactive";
import {
  TourDateMotion,
  tourDateMotionSchema,
} from "./compositions/TourDateMotion";

// drop-kit compositions. Render with:
//   npx remotion render src/index.ts <Id> out/<artist>/<slug>.mp4 --props='{...}'
// Brand props come from skill/brand-presets/<artist>.json (sibling folder).

const PLACEHOLDER_COVER =
  "https://ik.imagekit.io/lvrn/al-xapo/cover-placeholder.jpg";
const PLACEHOLDER_AUDIO =
  "https://ik.imagekit.io/lvrn/audio/placeholder-snippet.mp3";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* === 9:16 reel teaser === */}
      <Composition
        id="ReelTeaser"
        component={ReelTeaser}
        durationInFrames={210}
        fps={30}
        width={1080}
        height={1920}
        schema={reelTeaserSchema}
        defaultProps={{
          artistName: "AL XAPO",
          title: "NEW SINGLE",
          date: "OUT NOW",
          coverUrl: PLACEHOLDER_COVER,
          cool: "#0BA5A6",
          warm: "#F26B2C",
          bg: "#0a0a0a",
          fg: "#f5f5f5",
          dspCta: "STREAM NOW",
        }}
      />

      {/* === 1:1 motion press card === */}
      <Composition
        id="MotionPressCard"
        component={MotionPressCard}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1080}
        schema={motionPressCardSchema}
        defaultProps={{
          artistName: "AL XAPO",
          headline: "Featured in Boiler Room",
          source: "Boiler Room",
          coverUrl: PLACEHOLDER_COVER,
          cool: "#0BA5A6",
          warm: "#F26B2C",
          bg: "#0a0a0a",
          fg: "#f5f5f5",
        }}
      />

      {/* === 4:5 motion press card === */}
      <Composition
        id="MotionPressCardPortrait"
        component={MotionPressCard}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1350}
        schema={motionPressCardSchema}
        defaultProps={{
          artistName: "AL XAPO",
          headline: "1 Million streams",
          source: "Spotify",
          coverUrl: PLACEHOLDER_COVER,
          cool: "#0BA5A6",
          warm: "#F26B2C",
          bg: "#0a0a0a",
          fg: "#f5f5f5",
        }}
      />

      {/* === 9:16 lyric video (12s default; overridable per render) === */}
      <Composition
        id="LyricVideo"
        component={LyricVideo}
        durationInFrames={360}
        fps={30}
        width={1080}
        height={1920}
        schema={lyricVideoSchema}
        defaultProps={{
          artistName: "AL XAPO",
          title: "NEW SINGLE",
          coverUrl: PLACEHOLDER_COVER,
          audioUrl: PLACEHOLDER_AUDIO,
          cool: "#0BA5A6",
          warm: "#F26B2C",
          bg: "#0a0a0a",
          fg: "#f5f5f5",
          captions: [
            { text: "Out now", startFrame: 10, endFrame: 60 },
            { text: "On every platform", startFrame: 65, endFrame: 130 },
            { text: "AL XAPO", startFrame: 140, endFrame: 220, accent: true },
            { text: "Stream the link in bio", startFrame: 230, endFrame: 310 },
          ],
          outroDate: "OUT NOW",
        }}
      />

      {/* === 9:16 audio-reactive visualizer === */}
      <Composition
        id="AudioReactiveReel"
        component={AudioReactive}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        schema={audioReactiveSchema}
        defaultProps={{
          artistName: "AL XAPO",
          title: "NEW SINGLE",
          coverUrl: PLACEHOLDER_COVER,
          audioUrl: PLACEHOLDER_AUDIO,
          cool: "#0BA5A6",
          warm: "#F26B2C",
          bg: "#0a0a0a",
          fg: "#f5f5f5",
        }}
      />

      {/* === 1:1 audio-reactive visualizer === */}
      <Composition
        id="AudioReactiveSquare"
        component={AudioReactive}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1080}
        schema={audioReactiveSchema}
        defaultProps={{
          artistName: "AL XAPO",
          title: "NEW SINGLE",
          coverUrl: PLACEHOLDER_COVER,
          audioUrl: PLACEHOLDER_AUDIO,
          cool: "#0BA5A6",
          warm: "#F26B2C",
          bg: "#0a0a0a",
          fg: "#f5f5f5",
        }}
      />

      {/* === 9:16 tour date motion === */}
      <Composition
        id="TourDateMotion"
        component={TourDateMotion}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        schema={tourDateMotionSchema}
        defaultProps={{
          artistName: "AL XAPO",
          tourName: "ATL × JOZI TOUR",
          dates: [
            { day: "FRI", date: "24 MAY", city: "JOHANNESBURG", venue: "Lift Off Studios" },
            { day: "SAT", date: "31 MAY", city: "CAPE TOWN", venue: "Modular" },
            { day: "FRI", date: "07 JUN", city: "ATLANTA", venue: "Aisle 5", soldOut: true },
            { day: "SAT", date: "14 JUN", city: "NEW YORK", venue: "Brooklyn Made" },
          ],
          ticketCta: "TICKETS · LINK IN BIO",
          cool: "#0BA5A6",
          warm: "#F26B2C",
          bg: "#0a0a0a",
          fg: "#f5f5f5",
        }}
      />
    </>
  );
};
