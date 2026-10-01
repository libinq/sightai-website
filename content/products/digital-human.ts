import { UserRound, AudioLines, Languages, MessagesSquare, Radio, Clapperboard } from "lucide-react";
import type { ProductData } from "./types";

export const digitalHuman: ProductData = {
  slug: "digital-human",
  line: "human",
  demo: "avatar",
  capabilityIcons: [UserRound, AudioLines, Languages, MessagesSquare, Radio, Clapperboard],
  relatedCases: ["fifa", "national-games", "afc"],
  zh: {
    valueProp: "3 分钟素材，定制数字人",
    intro:
      "拍摄约 3 分钟真人素材即可定制 2D / 3D 数字人形象与声音，口型与表情自然同步，支持多语种播报。接入大模型后可实时问答，用于直播、企业宣传、客服导览与培训讲解。",
    metricLabels: { footage: "定制素材时长", languages: "播报语种", latency: "实时交互延迟" },
    pains: [
      { before: "真人出镜排期难、成本高", after: "数字人 7×24 小时随时出镜" },
      { before: "多语种内容需要多位主播", after: "同一形象多语种播报" },
      { before: "导览、客服重复回答相同问题", after: "接入大模型，实时问答" },
      { before: "内容更新要重新拍摄", after: "修改文本即可重新生成视频" },
    ],
    capabilities: [
      { title: "形象定制", desc: "2D 真人形象与 3D 形象，服装与场景可替换。" },
      { title: "语音克隆", desc: "少量录音即可复刻音色，支持情感与语速控制。" },
      { title: "多语种播报", desc: "中、英等多语种播报，口型按语种同步。" },
      { title: "实时交互", desc: "接入大模型与知识库，实现低延迟问答。" },
      { title: "直播推流", desc: "支持主流直播平台推流与弹幕互动。" },
      { title: "视频批量生成", desc: "文本或 PPT 一键生成讲解视频。" },
    ],
    steps: [
      { title: "采集", desc: "拍摄约 3 分钟真人素材与录音" },
      { title: "预处理", desc: "人像分割、关键点与音素对齐" },
      { title: "推理", desc: "形象、声音与口型模型训练" },
      { title: "后处理", desc: "审核、调优与场景搭建" },
      { title: "输出 / 集成", desc: "视频、直播或 API 交付" },
    ],
    specs: [
      { label: "输入格式", cloud: "文本 / 音频 / PPT", edge: "文本 / 语音实时输入" },
      { label: "支持分辨率", cloud: "1080p / 4K", edge: "1080p" },
      { label: "响应速度", cloud: "{latencyCloud}", edge: "{latencyEdge}" },
      { label: "硬件要求", cloud: "无（SaaS）", edge: "带 GPU 的一体机或大屏终端" },
      { label: "部署方式", cloud: "公有云", edge: "私有化 / 展厅一体机" },
      { label: "接口", cloud: "REST / WebRTC / SDK", edge: "SDK / WebRTC" },
      { label: "输出格式", cloud: "MP4、直播流", edge: "实时音视频流" },
    ],
    scenarios: [
      { title: "赛事与活动", desc: "多语种赛事资讯播报、场馆导览与观众服务。" },
      { title: "直播与营销", desc: "电商直播、品牌宣传视频批量生产。" },
      { title: "客服与培训", desc: "政务、金融大厅导览与员工培训讲解。" },
    ],
    faqs: [
      { q: "定制需要多长素材？", a: "约 3 分钟清晰正面视频与对应录音即可起训，具体要求我们会提供拍摄指引。" },
      { q: "支持哪些语种？", a: "中文、英文等常用语种，具体语种列表以项目实际为准。" },
      { q: "肖像与声音授权如何处理？", a: "定制前需签署肖像与声音授权，模型仅用于授权范围，可按合同约定删除。" },
      { q: "能接入我们自己的大模型吗？", a: "可以。支持对接私有化大模型与企业知识库。" },
      { q: "生成内容如何标识？", a: "支持按法规要求添加 AI 生成内容标识。" },
    ],
  },
  en: {
    valueProp: "Your presenter, from three minutes of footage.",
    intro:
      "Record about three minutes of a real presenter to build a 2D or 3D digital human with a cloned voice, natural lip sync and multilingual delivery. Connect an LLM for real-time Q&A in live commerce, brand content, service desks and training.",
    metricLabels: { footage: "Footage needed", languages: "Languages", latency: "Live response" },
    pains: [
      { before: "On-camera talent is hard to schedule", after: "A presenter available 24/7" },
      { before: "Each language needs its own host", after: "One presenter, many languages" },
      { before: "Guides answer the same questions all day", after: "LLM-powered live Q&A" },
      { before: "Updating content means reshooting", after: "Edit the script, regenerate the video" },
    ],
    capabilities: [
      { title: "Custom avatars", desc: "2D photoreal or 3D, with swappable outfits and sets." },
      { title: "Voice cloning", desc: "Clone a voice from short recordings, with emotion and pace control." },
      { title: "Multilingual delivery", desc: "Language-aware lip sync across Chinese, English and more." },
      { title: "Real-time interaction", desc: "Low-latency Q&A grounded in your LLM and knowledge base." },
      { title: "Live streaming", desc: "Stream to major platforms and respond to chat." },
      { title: "Batch video", desc: "Turn a script or slide deck into a narrated video." },
    ],
    steps: [
      { title: "Record", desc: "~3 min of footage and audio" },
      { title: "Pre-process", desc: "Segmentation, landmarks, phoneme alignment" },
      { title: "Train", desc: "Appearance, voice and lip-sync models" },
      { title: "Review", desc: "QA, tuning and set design" },
      { title: "Deliver", desc: "Video, live stream or API" },
    ],
    specs: [
      { label: "Input", cloud: "Text / audio / slides", edge: "Live text / speech" },
      { label: "Resolution", cloud: "1080p / 4K", edge: "1080p" },
      { label: "Response time", cloud: "{latencyCloud}", edge: "{latencyEdge}" },
      { label: "Hardware", cloud: "None (SaaS)", edge: "GPU kiosk or display terminal" },
      { label: "Deployment", cloud: "Public cloud", edge: "On-prem / showroom kiosk" },
      { label: "Interfaces", cloud: "REST / WebRTC / SDK", edge: "SDK / WebRTC" },
      { label: "Output", cloud: "MP4, live stream", edge: "Real-time A/V stream" },
    ],
    scenarios: [
      { title: "Sports & events", desc: "Multilingual match news, venue guidance and fan services." },
      { title: "Live commerce & marketing", desc: "Live selling and brand videos at scale." },
      { title: "Service & training", desc: "Lobby guides for public services and banks, staff training." },
    ],
    faqs: [
      { q: "How much footage do we need?", a: "About three minutes of clear, front-facing video with audio. We provide a shooting guide." },
      { q: "Which languages are supported?", a: "Chinese, English and other common languages; the exact list depends on the project." },
      { q: "How are likeness and voice rights handled?", a: "The presenter signs a likeness and voice release. Models are used only within that scope and can be deleted per contract." },
      { q: "Can we use our own LLM?", a: "Yes — including on-prem LLMs and your knowledge base." },
      { q: "Is generated content labeled?", a: "Yes. AI-generated content labels can be applied as regulations require." },
    ],
  },
};
