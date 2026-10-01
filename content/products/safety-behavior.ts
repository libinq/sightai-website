import { HardHat, ShieldAlert, Flame, BellRing, Cpu, EyeOff } from "lucide-react";
import type { ProductData } from "./types";

export const safetyBehavior: ProductData = {
  slug: "safety-behavior",
  line: "inspection",
  demo: "monitor-wall",
  capabilityIcons: [HardHat, ShieldAlert, Flame, BellRing, Cpu, EyeOff],
  relatedCases: ["petrochem-park", "giant-panda-park", "national-games"],
  zh: {
    valueProp: "危险行为，秒级发现",
    intro:
      "接入现有摄像头，实时识别未戴安全帽、未穿反光衣、闯入危险区域、吸烟、跌倒、攀爬与烟火等风险，秒级推送告警。边缘部署，视频不出现场，支持一键人脸模糊保护隐私。",
    metricLabels: { response: "告警响应", behaviors: "行为类型", cameras: "单盒接入路数" },
    pains: [
      { before: "监控室人工盯屏，注意力有限", after: "所有画面 AI 实时巡视" },
      { before: "事后调录像，无法及时干预", after: "秒级告警推送到现场负责人" },
      { before: "视频上云存在合规风险", after: "边缘推理，只回传告警与截图" },
      { before: "违规记录靠人工登记", after: "自动留证，形成 EHS 统计报表" },
    ],
    capabilities: [
      { title: "PPE 识别", desc: "安全帽、反光衣、安全带、防护面罩等穿戴检测。" },
      { title: "区域入侵", desc: "电子围栏、危险区域闯入、越线与徘徊。" },
      { title: "烟火识别", desc: "明火、烟雾早期识别，适配室内外与林区场景。" },
      { title: "实时告警", desc: "现场声光、App、短信、平台多渠道推送。" },
      { title: "边缘部署", desc: "单台边缘盒子接入多路摄像头，弱网可用。" },
      { title: "隐私保护", desc: "人脸自动模糊，告警截图按权限查看。" },
    ],
    steps: [
      { title: "采集", desc: "接入现有 IPC / NVR 视频流" },
      { title: "预处理", desc: "解码、抽帧、区域配置" },
      { title: "推理", desc: "人员检测、姿态与行为识别" },
      { title: "后处理", desc: "多帧确认、去重、隐私模糊" },
      { title: "输出 / 集成", desc: "告警推送、EHS 平台对接" },
    ],
    specs: [
      { label: "输入格式", cloud: "RTSP / GB28181 视频流", edge: "RTSP / ONVIF / GB28181" },
      { label: "支持分辨率", cloud: "720p – 4K", edge: "720p – 4K" },
      { label: "推理速度", cloud: "{latencyCloud}", edge: "{latencyEdge}" },
      { label: "硬件要求", cloud: "无（SaaS）", edge: "边缘盒子（按路数选型）" },
      { label: "部署方式", cloud: "公有云 / 专有云", edge: "现场边缘 + 私有化平台" },
      { label: "接口", cloud: "REST / Webhook / SDK", edge: "REST / Webhook / MQTT" },
      { label: "输出格式", cloud: "告警 JSON、截图、短视频", edge: "告警 JSON、截图、声光联动" },
    ],
    scenarios: [
      { title: "石化与危化园区", desc: "装置区、罐区的 PPE、烟火与入侵监测。" },
      { title: "建筑工地", desc: "安全帽、临边防护、塔吊作业区管理。" },
      { title: "自然保护区与大型场馆", desc: "林区烟火预警、周界入侵与人员密集区域管理。" },
    ],
    faqs: [
      { q: "能否使用现有摄像头？", a: "可以。支持主流品牌 IPC 与 NVR，通过 RTSP、ONVIF 或 GB28181 接入。" },
      { q: "如何降低误报？", a: "多帧确认与区域、时段规则配合，并可按现场反馈持续优化模型。" },
      { q: "隐私如何保护？", a: "推理在现场完成，默认只回传告警截图，人脸可自动模糊，查看原图需授权。" },
      { q: "一台边缘盒子能接多少路？", a: "取决于盒子型号、分辨率与算法组合，PoC 阶段会按实际场景给出配置建议。" },
      { q: "能否和现有安全平台对接？", a: "支持 Webhook、MQTT 与 REST 接口，可推送到园区安全平台或企业 IM。" },
    ],
  },
  en: {
    valueProp: "Unsafe behavior, flagged in seconds.",
    intro:
      "Connect your existing cameras and detect missing hard hats or vests, zone intrusion, smoking, falls, climbing, smoke and fire in real time. Inference runs on site, video stays on site, and faces can be blurred automatically.",
    metricLabels: { response: "Alert latency", behaviors: "Behavior types", cameras: "Streams per box" },
    pains: [
      { before: "Operators can watch only a few screens", after: "AI watches every camera, all the time" },
      { before: "Footage reviewed after the incident", after: "Alerts reach the site lead in seconds" },
      { before: "Streaming video to the cloud raises compliance issues", after: "Edge inference sends only alerts and snapshots" },
      { before: "Violations logged by hand", after: "Automatic evidence and EHS reports" },
    ],
    capabilities: [
      { title: "PPE detection", desc: "Hard hats, hi-vis vests, harnesses, face shields." },
      { title: "Zone intrusion", desc: "Virtual fences, restricted areas, line crossing, loitering." },
      { title: "Smoke & fire", desc: "Early flame and smoke detection, indoors, outdoors and in forests." },
      { title: "Real-time alerts", desc: "On-site beacons, app, SMS and platform notifications." },
      { title: "Edge deployment", desc: "One box handles multiple cameras and tolerates weak links." },
      { title: "Privacy by default", desc: "Automatic face blurring and role-based snapshot access." },
    ],
    steps: [
      { title: "Capture", desc: "Existing IPC / NVR streams" },
      { title: "Pre-process", desc: "Decode, sample, configure zones" },
      { title: "Inference", desc: "People, pose and behavior" },
      { title: "Post-process", desc: "Multi-frame confirm, dedupe, blur" },
      { title: "Output", desc: "Alerts and EHS platform integration" },
    ],
    specs: [
      { label: "Input", cloud: "RTSP / GB28181 streams", edge: "RTSP / ONVIF / GB28181" },
      { label: "Resolution", cloud: "720p – 4K", edge: "720p – 4K" },
      { label: "Inference speed", cloud: "{latencyCloud}", edge: "{latencyEdge}" },
      { label: "Hardware", cloud: "None (SaaS)", edge: "Edge box sized by stream count" },
      { label: "Deployment", cloud: "Public or private cloud", edge: "On-site edge + on-prem platform" },
      { label: "Interfaces", cloud: "REST / Webhook / SDK", edge: "REST / Webhook / MQTT" },
      { label: "Output", cloud: "Alert JSON, snapshots, clips", edge: "Alert JSON, snapshots, beacon triggers" },
    ],
    scenarios: [
      { title: "Petrochemical parks", desc: "PPE, smoke, fire and intrusion around process units and tank farms." },
      { title: "Construction sites", desc: "Hard hats, edge protection and crane work zones." },
      { title: "Nature reserves & venues", desc: "Forest fire warning, perimeter intrusion and crowded areas." },
    ],
    faqs: [
      { q: "Can we use our existing cameras?", a: "Yes. Mainstream IPCs and NVRs connect over RTSP, ONVIF or GB28181." },
      { q: "How do you keep false alarms down?", a: "Multi-frame confirmation plus zone and schedule rules, with continuous tuning from site feedback." },
      { q: "How is privacy protected?", a: "Inference happens on site. By default only alert snapshots leave, with faces blurred; full frames need authorization." },
      { q: "How many cameras per edge box?", a: "It depends on the box model, resolution and detectors. The PoC gives a sizing recommendation." },
      { q: "Does it integrate with our safety platform?", a: "Yes — via Webhook, MQTT and REST, or into your team chat." },
    ],
  },
};
