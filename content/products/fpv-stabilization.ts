import { Move3d, Spline, Compass, ScanLine, Crop, Zap } from "lucide-react";
import type { ProductData } from "./types";

export const fpvStabilization: ProductData = {
  slug: "fpv-stabilization",
  line: "enhancement",
  demo: "trajectory",
  capabilityIcons: [Move3d, Spline, Compass, ScanLine, Crop, Zap],
  relatedCases: ["china-open", "media-studio"],
  zh: {
    valueProp: "稳住画面，留住临场感",
    intro:
      "针对头戴、胸挂、运动相机与无人机 FPV 的剧烈抖动，基于运动估计与轨迹平滑重建稳定画面，同时保留第一视角的运动感。支持地平线校正与滚动快门修正，可批量处理或实时输出。",
    metricLabels: { speed: "处理速度", crop: "平均裁切", res: "最高分辨率" },
    pains: [
      { before: "第一视角素材抖动严重，大量废片", after: "剧烈抖动素材也能稳定可用" },
      { before: "通用防抖把画面“锁死”，失去运动感", after: "可调平滑强度，保留主观视角节奏" },
      { before: "滚动快门导致果冻效应", after: "逐行运动补偿，修正画面形变" },
      { before: "后期逐段手动稳定，耗时耗力", after: "批量处理，一次提交整场素材" },
    ],
    capabilities: [
      { title: "运动估计", desc: "结合光流与特征跟踪估计相机六自由度运动，可融合陀螺仪数据。" },
      { title: "轨迹平滑", desc: "平滑强度可调，在稳定性与临场感之间取舍。" },
      { title: "地平线校正", desc: "自动识别地平线，修正画面倾斜。" },
      { title: "滚动快门修正", desc: "逐行运动补偿，消除果冻效应。" },
      { title: "智能裁切", desc: "按内容自适应裁切与边缘补全，减少画面损失。" },
      { title: "实时与批量", desc: "支持直播实时输出与离线批量处理。" },
    ],
    steps: [
      { title: "采集", desc: "导入视频，可附带 IMU / 陀螺仪数据" },
      { title: "预处理", desc: "镜头畸变校正、关键点提取" },
      { title: "推理", desc: "相机运动估计" },
      { title: "后处理", desc: "轨迹平滑、地平线与卷帘修正" },
      { title: "输出 / 集成", desc: "重渲染输出或推流" },
    ],
    specs: [
      { label: "输入格式", cloud: "MP4 / MOV / H.264 / H.265 / ProRes", edge: "SDI / HDMI / RTMP 实时流" },
      { label: "支持分辨率", cloud: "最高 8K", edge: "最高 4K" },
      { label: "处理速度", cloud: "{latencyCloud}", edge: "{latencyEdge}" },
      { label: "硬件要求", cloud: "无（SaaS）", edge: "带 GPU 的边缘盒子或工作站" },
      { label: "部署方式", cloud: "公有云批处理", edge: "转播车 / 演播室本地" },
      { label: "接口", cloud: "REST / SDK / 剪辑软件插件", edge: "SDK / SDI 输出" },
      { label: "输出格式", cloud: "MP4、MOV、ProRes", edge: "SDI / RTMP / SRT" },
    ],
    scenarios: [
      { title: "体育赛事第一视角", desc: "运动员、裁判与球童视角素材的实时稳定。" },
      { title: "户外与极限运动内容", desc: "骑行、滑雪、攀岩等头戴与胸挂素材后期处理。" },
      { title: "无人机 FPV", desc: "穿越机高速飞行画面的稳定与地平线校正。" },
    ],
    faqs: [
      { q: "和相机内置防抖有什么区别？", a: "内置防抖受限于硬件与实时性，SightAI 基于完整轨迹做全局平滑，可处理更剧烈的抖动，并可调节强度。" },
      { q: "会裁掉很多画面吗？", a: "裁切比例随平滑强度变化，配合边缘补全尽量减少损失，可在预览中实时查看。" },
      { q: "能用于直播吗？", a: "可以。边缘版本支持 SDI / RTMP / SRT 实时输入输出。" },
      { q: "需要陀螺仪数据吗？", a: "不是必需的。有 IMU 数据时可进一步提升精度。" },
    ],
  },
  en: {
    valueProp: "Steady footage. Same sense of motion.",
    intro:
      "Built for violent shake from head, chest, action and FPV drone cameras. Motion estimation and trajectory smoothing rebuild a stable shot while keeping the first-person feel. Includes horizon leveling and rolling-shutter correction, in batch or live.",
    metricLabels: { speed: "Processing speed", crop: "Average crop", res: "Max resolution" },
    pains: [
      { before: "Shaky POV footage ends up unusable", after: "Even violent shake becomes usable" },
      { before: "Generic stabilizers lock the frame and kill motion", after: "Adjustable smoothing keeps the POV rhythm" },
      { before: "Rolling shutter causes jello", after: "Per-row motion compensation fixes distortion" },
      { before: "Editors stabilize clip by clip", after: "Submit a whole event in one batch" },
    ],
    capabilities: [
      { title: "Motion estimation", desc: "6-DoF camera motion from optical flow and feature tracks, with optional gyro fusion." },
      { title: "Trajectory smoothing", desc: "Tune the balance between stability and immersion." },
      { title: "Horizon leveling", desc: "Detects the horizon and corrects tilt automatically." },
      { title: "Rolling-shutter fix", desc: "Per-row compensation removes jello." },
      { title: "Smart crop", desc: "Content-aware crop with edge fill to keep more of the frame." },
      { title: "Live and batch", desc: "Real-time output for broadcast, or offline batch processing." },
    ],
    steps: [
      { title: "Ingest", desc: "Video plus optional IMU data" },
      { title: "Pre-process", desc: "Lens correction, keypoints" },
      { title: "Inference", desc: "Camera motion estimation" },
      { title: "Post-process", desc: "Smoothing, horizon, rolling shutter" },
      { title: "Output", desc: "Re-render or stream out" },
    ],
    specs: [
      { label: "Input", cloud: "MP4 / MOV / H.264 / H.265 / ProRes", edge: "SDI / HDMI / RTMP live" },
      { label: "Resolution", cloud: "Up to 8K", edge: "Up to 4K" },
      { label: "Processing speed", cloud: "{latencyCloud}", edge: "{latencyEdge}" },
      { label: "Hardware", cloud: "None (SaaS)", edge: "GPU edge box or workstation" },
      { label: "Deployment", cloud: "Cloud batch", edge: "OB van / studio on-prem" },
      { label: "Interfaces", cloud: "REST / SDK / NLE plug-ins", edge: "SDK / SDI out" },
      { label: "Output", cloud: "MP4, MOV, ProRes", edge: "SDI / RTMP / SRT" },
    ],
    scenarios: [
      { title: "Sports POV", desc: "Live stabilization for athlete, referee and ball-kid cameras." },
      { title: "Outdoor & action content", desc: "Cycling, skiing and climbing footage in post." },
      { title: "FPV drones", desc: "Stable, level shots from high-speed FPV flights." },
    ],
    faqs: [
      { q: "How is this different from in-camera stabilization?", a: "In-camera stabilization is limited by hardware and latency. SightAI smooths the full trajectory, handles heavier shake, and lets you tune strength." },
      { q: "How much of the frame is cropped?", a: "Crop scales with smoothing strength, and edge fill reduces loss. You see it live in the preview." },
      { q: "Does it work live?", a: "Yes. The edge version accepts and outputs SDI, RTMP and SRT." },
      { q: "Do we need gyro data?", a: "No. IMU data improves accuracy when available." },
    ],
  },
};
