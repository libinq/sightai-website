/**
 * Real demo footage (public/media/videos + posters). Source clips live outside the repo;
 * these are web-compressed H.264 loops (muted, faststart). See public/media/README.md.
 */
export interface DemoMedia {
  kind: "video" | "image";
  src: string;
  poster?: string;
  /** natural aspect ratio, used to size the frame */
  aspect: string;
}

export const MEDIA = {
  roadDefect: {
    kind: "video",
    src: "/media/videos/road-defect.mp4",
    poster: "/media/posters/road-defect.jpg",
    aspect: "16/9",
  },
  packaging: {
    kind: "video",
    src: "/media/videos/mfg-packaging.mp4",
    poster: "/media/posters/mfg-packaging.jpg",
    aspect: "2064/1266",
  },
  bullying: {
    kind: "video",
    src: "/media/videos/edu-bullying.mp4",
    poster: "/media/posters/edu-bullying.jpg",
    aspect: "16/9",
  },
  behavior: {
    kind: "video",
    src: "/media/videos/edu-behavior.mp4",
    poster: "/media/posters/edu-behavior.jpg",
    aspect: "4/3",
  },
  contraband: {
    kind: "video",
    src: "/media/videos/edu-contraband.mp4",
    poster: "/media/posters/edu-contraband.jpg",
    aspect: "1876/766",
  },
  shelf: {
    kind: "video",
    src: "/media/videos/retail-shelf.mp4",
    poster: "/media/posters/retail-shelf.jpg",
    aspect: "16/9",
  },
  refcam: {
    kind: "video",
    src: "/media/videos/sports-refcam.mp4",
    poster: "/media/posters/sports-refcam.jpg",
    aspect: "1280/448",
  },
  avatar: {
    kind: "image",
    src: "/media/ai-avatar.gif",
    aspect: "464/828",
  },
} satisfies Record<string, DemoMedia>;

export type MediaKey = keyof typeof MEDIA;

/** Real footage shown on each technology (product) page. */
export const PRODUCT_MEDIA: Record<string, MediaKey[]> = {
  "road-inspection": ["roadDefect"],
  "quality-inspection": ["packaging"],
  "safety-behavior": ["bullying", "contraband", "behavior"],
  "fpv-stabilization": ["refcam"],
  "color-enhancement": [],
  "digital-human": ["avatar"],
  platform: ["shelf"],
};
