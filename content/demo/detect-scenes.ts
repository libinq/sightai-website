/**
 * "See what SightAI sees" — illustrated scenes + simulated detections.
 * Coordinates are in the scene's 800×500 viewBox. Displayed pixel coords are scaled to 1920×1200.
 * Replace with real images + model output (same shape) when assets are available.
 */
export type Severity = "low" | "medium" | "high";

export interface Detection {
  id: string;
  cls: string; // key in messages `classes`
  conf: number;
  box: [x: number, y: number, w: number, h: number];
  severity: Severity;
}

export interface DetectScene {
  key: "road" | "line" | "site";
  inferenceMs: number; // TODO: verify before launch
  detections: Detection[];
}

export const SCENE_W = 800;
export const SCENE_H = 500;
export const DISPLAY_SCALE = 2.4;

export const DETECT_SCENES: DetectScene[] = [
  {
    key: "road",
    inferenceMs: 27,
    detections: [
      { id: "r1", cls: "pothole", conf: 0.96, box: [150, 300, 120, 80], severity: "high" },
      { id: "r2", cls: "crack", conf: 0.91, box: [430, 70, 70, 250], severity: "medium" },
      { id: "r3", cls: "pothole", conf: 0.88, box: [560, 360, 70, 50], severity: "medium" },
      { id: "r4", cls: "crack", conf: 0.84, box: [70, 110, 230, 60], severity: "low" },
      { id: "r5", cls: "patch", conf: 0.8, box: [600, 140, 120, 90], severity: "low" },
    ],
  },
  {
    key: "line",
    inferenceMs: 12,
    detections: [
      { id: "l1", cls: "scratch", conf: 0.94, box: [262, 190, 90, 40], severity: "medium" },
      { id: "l2", cls: "dent", conf: 0.9, box: [470, 230, 50, 46], severity: "high" },
      { id: "l3", cls: "missing_part", conf: 0.97, box: [650, 170, 44, 44], severity: "high" },
      { id: "l4", cls: "stain", conf: 0.78, box: [92, 240, 60, 40], severity: "low" },
    ],
  },
  {
    key: "site",
    inferenceMs: 31,
    detections: [
      { id: "s1", cls: "no_helmet", conf: 0.93, box: [168, 168, 70, 190], severity: "high" },
      { id: "s2", cls: "zone_intrusion", conf: 0.89, box: [500, 200, 72, 200], severity: "high" },
      { id: "s3", cls: "no_vest", conf: 0.86, box: [330, 180, 68, 190], severity: "medium" },
      { id: "s4", cls: "smoke", conf: 0.81, box: [640, 40, 120, 130], severity: "medium" },
      { id: "s5", cls: "person", conf: 0.95, box: [60, 200, 64, 170], severity: "low" },
    ],
  },
];
