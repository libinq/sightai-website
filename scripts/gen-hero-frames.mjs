// Generates public/media/data/hero-frames.json — a simulated detection stream for the Hero overlay.
// Replace with real model output (same schema) once a real road video is available.
//
// Schema: { fps, width, height, classes, frames: [ [ [id, classIndex, conf, x, y, w, h], ... ], ... ] }
// x/y/w/h are normalized to [0,1] (top-left origin).
import { writeFileSync, mkdirSync } from "node:fs";

const FPS = 30;
const SECONDS = 8;
const SPEED = 8; // m/s — must match ROAD_SPEED in components/demo/hero-detection.tsx
const LOOP = SPEED * SECONDS; // 64 m
const HORIZON = 0.4;
const Z_NEAR = 4;
const LAT = 0.9; // lateral projection scale — must match hero-detection.tsx

const classes = ["crack", "pothole", "rutting", "patch", "marking_wear"];

// [id, class, lateral x (m), z0 (m), sizeX (m), sizeZ (m), base confidence]
const objects = [
  [11, 1, -1.5, 9, 1.3, 1.0, 0.94],
  [12, 0, 1.4, 19, 0.6, 3.2, 0.88],
  [13, 2, -2.2, 30, 0.9, 4.2, 0.81],
  [14, 3, 1.3, 40, 1.7, 1.4, 0.9],
  [15, 0, -0.9, 50, 2.3, 0.6, 0.86],
  [16, 1, 2.0, 60, 1.0, 0.8, 0.92],
  [17, 4, 0.0, 25, 0.35, 3.0, 0.79],
];

const project = (x, z) => ({
  sx: 0.5 + (x * LAT) / z,
  sy: HORIZON + ((1 - HORIZON) * Z_NEAR) / z,
});

const r3 = (n) => Math.round(n * 1000) / 1000;

const frames = [];
for (let f = 0; f < FPS * SECONDS; f++) {
  const t = f / FPS;
  const boxes = [];
  for (const [id, cls, x, z0, w, d, conf] of objects) {
    let z = (((z0 - SPEED * t - Z_NEAR) % LOOP) + LOOP) % LOOP + Z_NEAR;
    if (z < 4.6 || z > 36) continue;
    const near = project(x, z - d / 2);
    const far = project(x, z + d / 2);
    const halfW = (w * LAT) / z / 2;
    const bx = near.sx - halfW;
    const by = far.sy;
    const bw = halfW * 2;
    const bh = near.sy - far.sy;
    if (by + bh > 1) continue;
    // confidence rises as the object gets closer, with slight jitter
    const c = Math.min(0.99, conf - (z - 5) * 0.004 + Math.sin(f * 0.7 + id) * 0.008);
    boxes.push([id, cls, r3(c), r3(bx), r3(by), r3(bw), r3(bh)]);
  }
  frames.push(boxes);
}

mkdirSync("public/media/data", { recursive: true });
writeFileSync(
  "public/media/data/hero-frames.json",
  JSON.stringify({ fps: FPS, width: 1920, height: 1080, classes, frames }),
);
console.log(`wrote ${frames.length} frames`);
