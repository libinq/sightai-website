import { SunMedium, Moon, Contrast, Maximize2, Palette, Layers } from "lucide-react";
import type { ProductData } from "./types";

export const colorEnhancement: ProductData = {
  slug: "color-enhancement",
  line: "enhancement",
  demo: "histogram",
  capabilityIcons: [SunMedium, Moon, Contrast, Maximize2, Palette, Layers],
  relatedCases: ["fifa", "afc", "giant-panda-park"],
  zh: {
    valueProp: "统一色彩，救回每一帧",
    intro:
      "自动完成白平衡、曝光与色调映射、HDR 还原、低光去噪与超分辨率，并能把多机位素材匹配到同一色彩风格。适用于赛事转播、内容制作与安防夜间画面，支持实时与批量处理。",
    metricLabels: { speed: "处理速度", upscale: "超分倍率", cameras: "多机位匹配" },
    pains: [
      { before: "多机位色彩不一致，调色师逐条匹配", after: "自动匹配到参考机位色彩" },
      { before: "夜间、室内低光素材噪点大", after: "时域去噪，保留细节" },
      { before: "历史素材分辨率低，无法用于高清播出", after: "超分辨率重建到 4K" },
      { before: "高反差场景过曝或欠曝", after: "HDR 还原与局部色调映射" },
    ],
    capabilities: [
      { title: "自动白平衡", desc: "识别场景光源，校正色温与偏色。" },
      { title: "低光增强", desc: "时域去噪与亮度重建，适用于夜间与室内画面。" },
      { title: "HDR 还原", desc: "恢复高光与暗部细节，输出 SDR / HDR。" },
      { title: "超分辨率", desc: "2× / 4× 重建，提升老素材与远景画面清晰度。" },
      { title: "多机位色彩匹配", desc: "以参考机位为基准统一整场色彩风格。" },
      { title: "风格预设", desc: "可保存品牌或节目专属的色彩风格，批量应用。" },
    ],
    steps: [
      { title: "采集", desc: "导入素材或接入实时信号" },
      { title: "预处理", desc: "色彩空间识别、镜头分析" },
      { title: "推理", desc: "光照估计、去噪与超分模型" },
      { title: "后处理", desc: "色调映射、多机位匹配" },
      { title: "输出 / 集成", desc: "文件输出或信号回送" },
    ],
    specs: [
      { label: "输入格式", cloud: "MP4 / MOV / ProRes / RAW 图片", edge: "SDI / HDMI / SRT 实时信号" },
      { label: "支持分辨率", cloud: "最高 8K", edge: "最高 4K" },
      { label: "处理速度", cloud: "{latencyCloud}", edge: "{latencyEdge}" },
      { label: "硬件要求", cloud: "无（SaaS）", edge: "GPU 工作站或边缘盒子" },
      { label: "部署方式", cloud: "公有云批处理", edge: "转播车 / 演播室本地" },
      { label: "接口", cloud: "REST / SDK / LUT 导出", edge: "SDK / SDI 回送" },
      { label: "输出格式", cloud: "MP4、ProRes、LUT", edge: "SDI / SRT，SDR / HDR" },
    ],
    scenarios: [
      { title: "赛事转播", desc: "多机位色彩统一与夜场画面增强。" },
      { title: "档案修复", desc: "历史赛事与纪录片素材的超分与调色。" },
      { title: "安防夜视", desc: "低光、红外画面增强，提升识别可用性。" },
    ],
    faqs: [
      { q: "会替代调色师吗？", a: "不会。它负责繁重的基础校正与匹配，调色师把时间留给创意调色。" },
      { q: "支持 HDR 输出吗？", a: "支持 HLG 与 PQ 输出，也可输出 SDR。" },
      { q: "超分会产生伪细节吗？", a: "模型针对真实拍摄素材训练，并提供强度调节；档案类素材建议先小样评估。" },
      { q: "能导出 LUT 给现有流程使用吗？", a: "可以导出 3D LUT，在现有调色或转播设备中复用。" },
    ],
  },
  en: {
    valueProp: "Consistent color. Every frame rescued.",
    intro:
      "Automatic white balance, exposure and tone mapping, HDR recovery, low-light denoise and super-resolution — plus matching every camera to one look. Built for sports broadcast, content production and night-time security footage, live or in batch.",
    metricLabels: { speed: "Processing speed", upscale: "Upscale factor", cameras: "Camera matching" },
    pains: [
      { before: "Colorists match cameras shot by shot", after: "Every camera matched to a reference automatically" },
      { before: "Low-light footage is noisy", after: "Temporal denoise that keeps detail" },
      { before: "Archive footage too low-res for HD", after: "Super-resolution up to 4K" },
      { before: "High-contrast scenes clip", after: "HDR recovery and local tone mapping" },
    ],
    capabilities: [
      { title: "Auto white balance", desc: "Estimates the light source and corrects temperature and casts." },
      { title: "Low-light enhancement", desc: "Temporal denoise and brightness reconstruction." },
      { title: "HDR recovery", desc: "Recovers highlights and shadows; outputs SDR or HDR." },
      { title: "Super-resolution", desc: "2× / 4× reconstruction for archive and long shots." },
      { title: "Multi-camera matching", desc: "Unify a whole event to a reference camera." },
      { title: "Look presets", desc: "Save brand or show looks and apply them in bulk." },
    ],
    steps: [
      { title: "Ingest", desc: "Files or live signal" },
      { title: "Pre-process", desc: "Color space detection, shot analysis" },
      { title: "Inference", desc: "Illumination, denoise, upscale" },
      { title: "Post-process", desc: "Tone mapping, camera matching" },
      { title: "Output", desc: "Files or signal return" },
    ],
    specs: [
      { label: "Input", cloud: "MP4 / MOV / ProRes / RAW stills", edge: "SDI / HDMI / SRT live" },
      { label: "Resolution", cloud: "Up to 8K", edge: "Up to 4K" },
      { label: "Processing speed", cloud: "{latencyCloud}", edge: "{latencyEdge}" },
      { label: "Hardware", cloud: "None (SaaS)", edge: "GPU workstation or edge box" },
      { label: "Deployment", cloud: "Cloud batch", edge: "OB van / studio on-prem" },
      { label: "Interfaces", cloud: "REST / SDK / LUT export", edge: "SDK / SDI return" },
      { label: "Output", cloud: "MP4, ProRes, LUT", edge: "SDI / SRT, SDR / HDR" },
    ],
    scenarios: [
      { title: "Sports broadcast", desc: "Unified multi-camera color and better night games." },
      { title: "Archive restoration", desc: "Upscale and grade historic matches and documentaries." },
      { title: "Night-time security", desc: "Enhance low-light and IR footage for better recognition." },
    ],
    faqs: [
      { q: "Does it replace colorists?", a: "No. It handles the heavy base correction and matching so colorists can focus on the creative grade." },
      { q: "Is HDR output supported?", a: "Yes — HLG and PQ, as well as SDR." },
      { q: "Does upscaling invent detail?", a: "Models are trained on real camera footage and strength is adjustable. Test a sample of archive material first." },
      { q: "Can we export LUTs?", a: "Yes. Export 3D LUTs to reuse in your grading or broadcast chain." },
    ],
  },
};
