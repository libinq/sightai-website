import {
  Activity,
  Box,
  Camera,
  Clapperboard,
  Factory,
  Flame,
  GraduationCap,
  HardHat,
  LayoutGrid,
  Map as MapIcon,
  PackageSearch,
  Route,
  ScanLine,
  ShieldAlert,
  ShoppingBag,
  Sparkles,
  Store,
  Trophy,
  UserRound,
  WandSparkles,
  type LucideIcon,
} from "lucide-react";
import type { MediaKey } from "./media";

/**
 * Industry applications = the subscribable SaaS catalog.
 * Each capability is built on one or more technology products (content/products) and is
 * priced per unit. All prices / KPIs are placeholders — TODO: verify before launch 【待替换】
 */

export type IndustryKey = "education" | "retail" | "sports" | "manufacturing";
export const INDUSTRY_KEYS: IndustryKey[] = ["education", "retail", "sports", "manufacturing"];

/** Procedural visual used when no real footage exists yet. */
export type VisualKey = "heatmap" | "highlights" | "perimeter" | "loss" | "ppe" | "assembly" | "enhance";

export type Tier = "starter" | "pro" | "enterprise";

interface Localized<T> {
  zh: T;
  en: T;
}

export interface IndustryCopy {
  name: string;
  tagline: string;
  desc: string;
  pains: string[];
  outcomes: { value: string; label: string }[];
}

export interface Industry extends Localized<IndustryCopy> {
  key: IndustryKey;
  icon: LucideIcon;
  /** chart / accent hue for this industry (validated categorical slot) */
  color: string;
  hero: MediaKey;
}

export interface CapabilityCopy {
  name: string;
  short: string;
  desc: string;
  features: string[];
  /** how the product is billed, e.g. "路摄像头 / 月" */
  unit: string;
}

export interface Capability extends Localized<CapabilityCopy> {
  id: string;
  industry: IndustryKey;
  icon: LucideIcon;
  /** technology products this capability runs on */
  products: string[];
  media?: MediaKey;
  visual?: VisualKey;
  /** minimum plan that includes it */
  tier: Tier;
  /** add-on list price per unit per month — TODO: verify before launch */
  price: { cny: number; usd: number };
  /** event types this capability emits into the console */
  events: string[];
}

export const INDUSTRIES: Industry[] = [
  {
    key: "education",
    icon: GraduationCap,
    color: "var(--viz-1)",
    hero: "bullying",
    zh: {
      name: "智慧教育",
      tagline: "看见每一次异常，守护每一位学生",
      desc: "基于校园现有摄像头，识别霸凌、打架、违禁品携带与危险区域闯入，事件分钟级推送到德育处与安保值班室；所有画面可选人脸脱敏，数据不出校。",
      pains: ["霸凌多发生在监控盲区与课间，事后才被发现", "安保人力有限，数百路画面无人盯看", "违禁品安检依赖人工，入校高峰排队严重", "家校沟通缺少客观证据"],
      outcomes: [
        { value: "< 60 s", label: "异常事件推送时延" },
        { value: "24/7", label: "全时段自动值守" },
        { value: "100%", label: "可选人脸脱敏" },
      ],
    },
    en: {
      name: "Education",
      tagline: "Spot every incident. Protect every student.",
      desc: "Runs on the cameras a campus already has: detects bullying, fights, concealed contraband and danger-zone intrusion, and alerts staff within a minute. Faces can be blurred and footage never leaves the school network.",
      pains: ["Bullying happens in blind spots and between classes", "Hundreds of feeds, too few people watching", "Manual bag checks create gate queues", "Little objective evidence for parent conversations"],
      outcomes: [
        { value: "< 60 s", label: "incident-to-alert time" },
        { value: "24/7", label: "automated watch" },
        { value: "100%", label: "optional face blurring" },
      ],
    },
  },
  {
    key: "retail",
    icon: Store,
    color: "var(--viz-2)",
    hero: "shelf",
    zh: {
      name: "智慧零售",
      tagline: "让门店的每一平米都有数据",
      desc: "把门店摄像头变成经营传感器：客流热力与动线、货架缺货与陈列合规、收银防损，再加一位 7×24 在岗的 AI 数字导购。",
      pains: ["缺货靠人工巡店，发现时已流失销售", "不知道顾客在哪停留、在哪离开", "陈列执行难以跨门店核查", "导购人力成本高、话术不统一"],
      outcomes: [
        { value: "-30%", label: "缺货时长（目标）" },
        { value: "15 min", label: "货架巡检频次" },
        { value: "7×24", label: "数字导购在岗" },
      ],
    },
    en: {
      name: "Retail",
      tagline: "Data on every square metre of the store.",
      desc: "Turn store cameras into business sensors: footfall heatmaps and paths, out-of-stock and planogram checks, checkout loss prevention — plus an AI avatar associate that never clocks off.",
      pains: ["Out-of-stocks found too late by manual walks", "No view of where shoppers dwell or drop off", "Planogram compliance is hard to audit across stores", "Floor staff are costly and inconsistent"],
      outcomes: [
        { value: "-30%", label: "out-of-stock time (target)" },
        { value: "15 min", label: "shelf scan interval" },
        { value: "24/7", label: "avatar associate" },
      ],
    },
  },
  {
    key: "sports",
    icon: Trophy,
    color: "var(--viz-3)",
    hero: "refcam",
    zh: {
      name: "体育赛事",
      tagline: "从裁判视角到全网分发，一条链路完成",
      desc: "为联赛、赛事转播与俱乐部提供 RefCam 裁判第一视角防抖、实时画质增强、高光集锦自动剪辑与多平台分发，以及多语种 AI 数字人主播。",
      pains: ["裁判/运动员第一视角画面抖动剧烈，无法直接播出", "高光剪辑依赖人工，赛后数小时才能发布", "多平台、多语种分发成本高", "低码率与夜场画质影响观赛体验"],
      outcomes: [
        { value: "< 5 min", label: "高光集锦出片" },
        { value: "4K", label: "超分输出" },
        { value: "10+", label: "播报语种" },
      ],
    },
    en: {
      name: "Sports",
      tagline: "From the referee's eye to every screen, in one pipeline.",
      desc: "For leagues, broadcasters and clubs: stabilized RefCam point-of-view, real-time picture enhancement, automatic highlight cutting and multi-platform distribution, and multilingual AI avatar presenters.",
      pains: ["Referee and athlete POV footage is too shaky to air", "Highlights are cut by hand, hours after the whistle", "Distributing to many platforms and languages is costly", "Low bitrate and night games hurt picture quality"],
      outcomes: [
        { value: "< 5 min", label: "highlight turnaround" },
        { value: "4K", label: "super-resolution output" },
        { value: "10+", label: "presenter languages" },
      ],
    },
  },
  {
    key: "manufacturing",
    icon: Factory,
    color: "var(--viz-4)",
    hero: "packaging",
    zh: {
      name: "生产质检",
      tagline: "毫秒级判定，把缺陷挡在出厂前",
      desc: "覆盖产线外观缺陷检测、装配完整性核验、安全生产行为识别，以及道路与基础设施巡检；与 PLC / MES 对接，NG 自动剔除并沉淀质量数据。",
      pains: ["人工目检易疲劳，漏检率随班次波动", "缺陷样本少，传统算法换型成本高", "质量数据分散，难以追溯根因", "道路巡检靠人工步行，周期长"],
      outcomes: [
        { value: "< 30 ms", label: "单件判定（边缘）" },
        { value: "99%+", label: "检出率（目标）" },
        { value: "80 km/h", label: "车载巡检速度" },
      ],
    },
    en: {
      name: "Manufacturing QC",
      tagline: "Millisecond verdicts. Defects stopped before shipping.",
      desc: "Surface defect detection, assembly verification and safety-behavior monitoring on the line, plus road and infrastructure inspection. Integrates with PLC / MES to reject NG parts and build a quality record.",
      pains: ["Human inspectors tire; misses vary by shift", "Few defect samples; re-tooling rule-based vision is slow", "Quality data is scattered and hard to trace", "Road surveys are slow and manual"],
      outcomes: [
        { value: "< 30 ms", label: "per-part verdict (edge)" },
        { value: "99%+", label: "detection rate (target)" },
        { value: "80 km/h", label: "vehicle survey speed" },
      ],
    },
  },
];

export const CAPABILITIES: Capability[] = [
  /* ---------------- Education ---------------- */
  {
    id: "edu-bullying",
    industry: "education",
    icon: ShieldAlert,
    products: ["safety-behavior", "platform"],
    media: "bullying",
    tier: "starter",
    price: { cny: 199, usd: 29 },
    events: ["fight", "push", "crowding"],
    zh: {
      name: "校园霸凌预警",
      short: "识别推搡、殴打、围堵等肢体冲突并实时预警",
      desc: "基于人体姿态与时序动作识别，在教室、走廊、楼梯间、宿舍区识别推搡、殴打、多人围堵、长时间纠缠等行为，按严重度分级推送到值班老师。",
      features: ["姿态 + 时序动作双模型", "多人围堵与异常聚集", "分级告警与值班排班", "事件片段自动留存 30 天", "人脸脱敏模式", "德育处周报"],
      unit: "路摄像头 / 月",
    },
    en: {
      name: "Bullying Prevention",
      short: "Detects pushing, hitting and cornering in real time",
      desc: "Pose and temporal action models watch classrooms, corridors, stairwells and dorms for pushing, hitting, group cornering and prolonged harassment, and route graded alerts to the teacher on duty.",
      features: ["Pose + temporal action models", "Group cornering & abnormal crowding", "Graded alerts with duty rota", "Clips auto-retained for 30 days", "Face-blur mode", "Weekly pastoral report"],
      unit: "camera / month",
    },
  },
  {
    id: "edu-behavior",
    industry: "education",
    icon: Activity,
    products: ["safety-behavior"],
    media: "behavior",
    tier: "starter",
    price: { cny: 149, usd: 22 },
    events: ["fight", "fall", "running", "loitering"],
    zh: {
      name: "学生行为监测",
      short: "打架斗殴、跌倒、追逐、长时间滞留等行为识别",
      desc: "面向走廊、操场、校门口、食堂等公共区域，逐秒识别打架斗殴、跌倒、追逐打闹、攀爬栏杆、长时间滞留与异常聚集，帮助学校把安全隐患前置处理。",
      features: ["打架斗殴逐秒识别", "跌倒 / 奔跑 / 攀爬识别", "区域滞留时长统计", "课间高峰拥挤预警", "低分辨率画面适配", "移动端告警推送"],
      unit: "路摄像头 / 月",
    },
    en: {
      name: "Student Behavior Monitoring",
      short: "Fights, falls, chasing and loitering detection",
      desc: "Covers corridors, playgrounds, school gates and canteens: flags fights second by second, plus falls, chasing, railing climbing, prolonged loitering and crowding so risks are handled before they escalate.",
      features: ["Second-by-second fight detection", "Fall / running / climbing", "Dwell-time by zone", "Break-time crowding alerts", "Works on low-res feeds", "Mobile push alerts"],
      unit: "camera / month",
    },
  },
  {
    id: "edu-contraband",
    industry: "education",
    icon: ScanLine,
    products: ["safety-behavior", "platform"],
    media: "contraband",
    tier: "pro",
    price: { cny: 899, usd: 129 },
    events: ["knife", "lighter", "concealed_object"],
    zh: {
      name: "违禁品安检",
      short: "入校通道无感安检，识别刀具、打火机等隐藏物品",
      desc: "接入太赫兹 / 热成像安检门画面，自动识别人体随身隐藏的管制刀具、打火机、金属物品等，异常人员即时标记，高峰时段不停步通行。",
      features: ["太赫兹 / 热成像画面适配", "刀具、打火机、金属物品", "不停步通行", "原始画面与识别画面双屏", "可疑人员复检流程", "隐私轮廓化显示"],
      unit: "安检通道 / 月",
    },
    en: {
      name: "Contraband Screening",
      short: "Walk-through screening for knives, lighters and concealed items",
      desc: "Connects to terahertz or thermal screening gates and flags concealed knives, lighters and metal objects on the body, so students walk through at peak times without stopping.",
      features: ["Terahertz / thermal input", "Knives, lighters, metal objects", "Walk-through, no stopping", "Raw + annotated dual view", "Secondary-check workflow", "Privacy silhouette display"],
      unit: "lane / month",
    },
  },
  {
    id: "edu-perimeter",
    industry: "education",
    icon: MapIcon,
    products: ["safety-behavior"],
    visual: "perimeter",
    tier: "starter",
    price: { cny: 99, usd: 15 },
    events: ["zone_intrusion", "climbing", "smoke"],
    zh: {
      name: "周界与危险区域",
      short: "翻墙、闯入天台/水域、烟火识别",
      desc: "为围墙、天台、配电房、水域等区域划设电子围栏，识别翻越、闯入、逗留与明火烟雾，夜间支持红外画面。",
      features: ["自定义电子围栏", "翻墙 / 攀爬识别", "明火与烟雾", "夜间红外适配", "联动广播与声光", "分时段布防"],
      unit: "路摄像头 / 月",
    },
    en: {
      name: "Perimeter & Danger Zones",
      short: "Wall climbing, rooftop/water intrusion, fire & smoke",
      desc: "Draw virtual fences around walls, rooftops, plant rooms and water; detects climbing, intrusion, lingering and fire or smoke, including on night-time IR feeds.",
      features: ["Custom virtual fences", "Wall climbing detection", "Fire & smoke", "Night IR support", "Speaker & strobe linkage", "Scheduled arming"],
      unit: "camera / month",
    },
  },

  /* ---------------- Retail ---------------- */
  {
    id: "retail-heatmap",
    industry: "retail",
    icon: Flame,
    products: ["safety-behavior", "platform"],
    visual: "heatmap",
    tier: "starter",
    price: { cny: 299, usd: 45 },
    events: ["queue_long", "zone_hot"],
    zh: {
      name: "店面客流热力图",
      short: "客流计数、停留热力、动线与转化漏斗",
      desc: "匿名化统计进店客流、区域停留时长与行走动线，生成按小时的热力图与“进店→停留→试用→收银”漏斗，指导陈列与排班。",
      features: ["进店客流 / 过店客流", "区域停留热力", "顾客动线还原", "排队长度预警", "多门店对比", "全程匿名化，不识别身份"],
      unit: "门店 / 月",
    },
    en: {
      name: "Store Heatmap",
      short: "Footfall, dwell heatmaps, paths and conversion funnel",
      desc: "Anonymously counts footfall, dwell time by zone and walking paths, producing hourly heatmaps and an enter → dwell → try → checkout funnel to guide layout and staffing.",
      features: ["Entries vs. passers-by", "Dwell heatmap by zone", "Shopper path replay", "Queue-length alerts", "Cross-store comparison", "Fully anonymous, no identification"],
      unit: "store / month",
    },
  },
  {
    id: "retail-shelf",
    industry: "retail",
    icon: PackageSearch,
    products: ["quality-inspection", "platform"],
    media: "shelf",
    tier: "starter",
    price: { cny: 399, usd: 59 },
    events: ["out_of_stock", "misplaced", "price_tag"],
    zh: {
      name: "货架缺货监测",
      short: "缺货、错放、价签异常自动识别与补货提醒",
      desc: "定时巡检货架画面，识别空位、缺货、错放与价签缺失，计算货架满陈率，自动生成补货任务推送到店员手机。",
      features: ["SKU 级商品检测", "空位与缺货识别", "错放 / 陈列合规", "价签缺失检测", "补货任务派发", "满陈率趋势"],
      unit: "货架摄像头 / 月",
    },
    en: {
      name: "Shelf Monitoring",
      short: "Out-of-stock, misplacement and price-tag checks with restock tasks",
      desc: "Scans shelf feeds on a schedule to find gaps, out-of-stocks, misplaced items and missing price tags, scores shelf fullness and pushes restock tasks to staff phones.",
      features: ["SKU-level detection", "Gap & out-of-stock", "Planogram compliance", "Missing price tags", "Restock task dispatch", "Fullness trend"],
      unit: "shelf camera / month",
    },
  },
  {
    id: "retail-avatar",
    industry: "retail",
    icon: UserRound,
    products: ["digital-human"],
    media: "avatar",
    tier: "pro",
    price: { cny: 1999, usd: 289 },
    events: ["session", "handoff"],
    zh: {
      name: "AI Avatar 数字导购",
      short: "门店大屏与直播间的 7×24 数字导购",
      desc: "定制品牌形象数字人，接入商品库与大模型，在门店大屏、小程序与直播间完成导购问答、商品讲解与促销播报，复杂问题一键转人工。",
      features: ["2D / 3D 形象定制", "语音克隆与口型同步", "接入商品知识库", "直播带货脚本生成", "多语种播报", "转人工与会话记录"],
      unit: "数字人 / 月",
    },
    en: {
      name: "AI Avatar Associate",
      short: "A 24/7 digital associate for in-store screens and live commerce",
      desc: "A custom branded avatar connected to your catalog and an LLM. Answers shopper questions, presents products and reads promotions on store screens, mini-apps and live streams, with one-tap handoff to staff.",
      features: ["Custom 2D / 3D look", "Voice clone & lip sync", "Product knowledge base", "Live-commerce scripts", "Multilingual", "Staff handoff & transcripts"],
      unit: "avatar / month",
    },
  },
  {
    id: "retail-loss",
    industry: "retail",
    icon: ShoppingBag,
    products: ["safety-behavior"],
    visual: "loss",
    tier: "pro",
    price: { cny: 349, usd: 49 },
    events: ["skip_scan", "concealment"],
    zh: {
      name: "收银防损",
      short: "漏扫、遮挡扫码与异常离店识别",
      desc: "对照收银画面与 POS 流水，识别自助收银漏扫、遮挡扫码、未结账离店等异常，生成证据片段供防损团队复核。",
      features: ["画面与 POS 流水对齐", "漏扫 / 遮挡扫码", "未结账离店", "证据片段一键导出", "门店损耗排行", "误报复核闭环"],
      unit: "收银台 / 月",
    },
    en: {
      name: "Checkout Loss Prevention",
      short: "Skip-scans, blocked scans and walk-outs",
      desc: "Aligns checkout video with POS logs to flag self-checkout skip-scans, blocked barcodes and walk-outs, with evidence clips for the loss-prevention team to review.",
      features: ["Video ↔ POS alignment", "Skip / blocked scans", "Walk-out detection", "One-click evidence export", "Store shrink ranking", "False-positive review loop"],
      unit: "lane / month",
    },
  },

  /* ---------------- Sports ---------------- */
  {
    id: "sports-refcam",
    industry: "sports",
    icon: Camera,
    products: ["fpv-stabilization", "color-enhancement"],
    media: "refcam",
    tier: "pro",
    price: { cny: 2999, usd: 429 },
    events: ["stream_live", "stream_drop"],
    zh: {
      name: "RefCam 裁判视角",
      short: "裁判第一视角实时防抖，可直接进入转播信号",
      desc: "针对裁判胸挂 / 头戴相机的剧烈抖动，融合陀螺仪与视觉运动估计做实时轨迹平滑与地平线校正，输出可直接进入转播信号的稳定画面。",
      features: ["陀螺仪 + 视觉融合防抖", "地平线校正", "滚动快门修正", "低时延实时输出", "原始 / 防抖对比回放", "转播 SDI / SRT 输出"],
      unit: "机位 / 场次包月",
    },
    en: {
      name: "RefCam",
      short: "Real-time stabilized referee POV, broadcast-ready",
      desc: "Fuses gyro data with visual motion estimation to smooth the violent shake of chest- and head-mounted referee cameras, correcting horizon and rolling shutter for a feed that can go straight to air.",
      features: ["Gyro + vision fusion", "Horizon leveling", "Rolling-shutter correction", "Low-latency live output", "Raw vs. stabilized replay", "SDI / SRT output"],
      unit: "camera / month",
    },
  },
  {
    id: "sports-enhance",
    industry: "sports",
    icon: WandSparkles,
    products: ["color-enhancement"],
    visual: "enhance",
    tier: "starter",
    price: { cny: 999, usd: 149 },
    events: ["job_done"],
    zh: {
      name: "赛事视频增强",
      short: "超分辨率、HDR、夜场去噪与多机位色彩统一",
      desc: "对直播流与回放素材做超分辨率、HDR 还原、低光去噪与多机位色彩匹配，让低码率机位和夜场画面也达到转播级观感。",
      features: ["1080p → 4K 超分", "HDR 还原", "夜场低光去噪", "多机位色彩匹配", "直播流实时处理", "批量回放增强"],
      unit: "处理时长 100 小时 / 月",
    },
    en: {
      name: "Match Video Enhancement",
      short: "Super-resolution, HDR, night denoise and multi-camera matching",
      desc: "Super-resolution, HDR recovery, low-light denoising and multi-camera color matching for live streams and replays, so low-bitrate angles and night games still look broadcast-grade.",
      features: ["1080p → 4K upscaling", "HDR recovery", "Night low-light denoise", "Multi-camera color match", "Live stream processing", "Batch replay enhancement"],
      unit: "100 processing hours / month",
    },
  },
  {
    id: "sports-highlights",
    industry: "sports",
    icon: Clapperboard,
    products: ["safety-behavior", "color-enhancement", "platform"],
    visual: "highlights",
    tier: "pro",
    price: { cny: 1999, usd: 289 },
    events: ["highlight_ready", "published"],
    zh: {
      name: "高光集锦生成与分发",
      short: "进球、扑救、犯规自动剪辑，一键分发到各平台",
      desc: "实时识别进球、射门、扑救、犯规与观众情绪峰值，自动剪辑横竖屏高光集锦并加字幕包装，按规则分发到抖音、YouTube、官网与 App。",
      features: ["关键事件识别", "横屏 / 竖屏自动裁切", "字幕与品牌包装", "球员个人集锦", "多平台定时分发", "播放数据回流"],
      unit: "场次包月",
    },
    en: {
      name: "Auto Highlights & Distribution",
      short: "Goals, saves and fouls auto-cut and published everywhere",
      desc: "Detects goals, shots, saves, fouls and crowd peaks live, cuts landscape and vertical highlight reels with captions and branding, and publishes to social, web and app on your rules.",
      features: ["Key-moment detection", "Auto 16:9 / 9:16 reframing", "Captions & branding", "Per-player reels", "Scheduled multi-platform publishing", "View analytics back-flow"],
      unit: "season / month",
    },
  },
  {
    id: "sports-avatar",
    industry: "sports",
    icon: Sparkles,
    products: ["digital-human"],
    media: "avatar",
    tier: "pro",
    price: { cny: 1999, usd: 289 },
    events: ["session"],
    zh: {
      name: "AI Avatar 赛事主播",
      short: "多语种数字人主播、赛事导览与志愿服务",
      desc: "为赛事打造数字人主播与 AI 志愿者：赛前导览、实时比分播报、赛后集锦解说，支持多语种与大屏/小程序/直播多端部署。",
      features: ["赛事形象定制", "实时比分播报", "多语种解说", "场馆导览问答", "集锦配音", "大屏 / 小程序 / 直播多端"],
      unit: "数字人 / 月",
    },
    en: {
      name: "AI Avatar Presenter",
      short: "Multilingual presenters, venue guides and AI volunteers",
      desc: "Digital presenters and AI volunteers for events: venue guidance, live score updates and highlight commentary in many languages, on big screens, mini-apps and streams.",
      features: ["Event-branded look", "Live score updates", "Multilingual commentary", "Venue Q&A", "Highlight voice-over", "Screen / app / stream"],
      unit: "avatar / month",
    },
  },

  /* ---------------- Manufacturing QC ---------------- */
  {
    id: "mfg-defect",
    industry: "manufacturing",
    icon: Box,
    products: ["quality-inspection", "platform"],
    media: "packaging",
    tier: "starter",
    price: { cny: 1299, usd: 189 },
    events: ["ng_part", "line_stop"],
    zh: {
      name: "外观缺陷检测",
      short: "包装、瓶体、金属件表面缺陷毫秒级判定",
      desc: "对产线工件做划痕、凹坑、污渍、液位、瓶盖、标签等外观缺陷检测，小样本即可训练，NG 信号直连 PLC 剔除，质量数据回写 MES。",
      features: ["小样本训练（< 50 张）", "划痕 / 凹坑 / 污渍", "液位、瓶盖、标签", "PLC 剔除联动", "MES 数据回写", "良率与缺陷帕累托"],
      unit: "检测工位 / 月",
    },
    en: {
      name: "Surface Defect Detection",
      short: "Millisecond verdicts on packaging, bottles and metal parts",
      desc: "Inspects scratches, dents, stains, fill level, caps and labels on the line. Trains from small sample sets, sends NG signals straight to the PLC and writes quality data back to MES.",
      features: ["Few-shot training (< 50 images)", "Scratch / dent / stain", "Fill level, caps, labels", "PLC reject linkage", "MES write-back", "Yield & defect Pareto"],
      unit: "station / month",
    },
  },
  {
    id: "mfg-road",
    industry: "manufacturing",
    icon: Route,
    products: ["road-inspection", "platform"],
    media: "roadDefect",
    tier: "pro",
    price: { cny: 9, usd: 1.5 },
    events: ["pothole", "crack", "rutting"],
    zh: {
      name: "道路病害巡检",
      short: "车载采集，裂缝、坑槽、车辙自动识别与 GIS 定位",
      desc: "普通车辆加装相机即可巡检，识别裂缝、坑槽、车辙、修补与标线磨损，测量深度并分级，自动落图到 GIS 并生成巡检报告。",
      features: ["车载 80 km/h 采集", "裂缝 / 坑槽 / 车辙", "深度测量与分级", "GIS 地图落点", "自动巡检报告", "历史对比与趋势"],
      unit: "公里 / 月",
    },
    en: {
      name: "Road Defect Inspection",
      short: "Vehicle-mounted survey with automatic defect detection and GIS",
      desc: "Any vehicle with a camera becomes a survey unit: detects cracks, potholes, rutting, patches and worn markings, measures and grades depth, and maps everything in GIS with an auto-generated report.",
      features: ["80 km/h capture", "Crack / pothole / rutting", "Depth & severity grading", "GIS mapping", "Auto survey reports", "Historical comparison"],
      unit: "km / month",
    },
  },
  {
    id: "mfg-ppe",
    industry: "manufacturing",
    icon: HardHat,
    products: ["safety-behavior"],
    visual: "ppe",
    tier: "starter",
    price: { cny: 129, usd: 19 },
    events: ["no_helmet", "no_vest", "zone_intrusion"],
    zh: {
      name: "安全生产行为",
      short: "安全帽、反光衣、危险区域闯入、吸烟识别",
      desc: "在车间、仓库、厂区识别未戴安全帽、未穿反光衣、闯入危险区域、吸烟、跌倒等行为，EHS 事件闭环管理。",
      features: ["安全帽 / 反光衣", "危险区域闯入", "吸烟与明火", "人员跌倒", "EHS 闭环工单", "班组安全排行"],
      unit: "路摄像头 / 月",
    },
    en: {
      name: "Safety Compliance",
      short: "Helmets, vests, danger-zone intrusion and smoking",
      desc: "Detects missing helmets and vests, danger-zone intrusion, smoking and falls across workshops, warehouses and yards, with closed-loop EHS case handling.",
      features: ["Helmet / vest", "Danger-zone intrusion", "Smoking & open flame", "Person down", "EHS work orders", "Team safety ranking"],
      unit: "camera / month",
    },
  },
  {
    id: "mfg-assembly",
    industry: "manufacturing",
    icon: LayoutGrid,
    products: ["quality-inspection"],
    visual: "assembly",
    tier: "pro",
    price: { cny: 1499, usd: 219 },
    events: ["missing_part", "wrong_part"],
    zh: {
      name: "装配完整性核验",
      short: "漏装、错装、反装与工序遗漏识别",
      desc: "对 PCB、线束、汽车零部件等装配环节做漏装、错装、反装与螺丝缺失核验，并按工序比对作业顺序，防止不良流入下道工序。",
      features: ["漏装 / 错装 / 反装", "螺丝与卡扣缺失", "工序顺序比对", "多型号快速换型", "追溯到工位与班次", "PLC / MES 对接"],
      unit: "检测工位 / 月",
    },
    en: {
      name: "Assembly Verification",
      short: "Missing, wrong and reversed parts; skipped steps",
      desc: "Verifies PCB, harness and automotive assemblies for missing, wrong or reversed parts and absent screws, and checks the work sequence so defects never reach the next station.",
      features: ["Missing / wrong / reversed", "Screws & clips", "Step-sequence check", "Fast model changeover", "Traceable to station & shift", "PLC / MES integration"],
      unit: "station / month",
    },
  },
];

export const getIndustry = (key: string) => INDUSTRIES.find((i) => i.key === key);
export const getCapability = (id: string) => CAPABILITIES.find((c) => c.id === id);
export const capabilitiesOf = (key: IndustryKey) => CAPABILITIES.filter((c) => c.industry === key);
export const industryHref = (key: IndustryKey) => `/industries/${key}` as const;

export const pick = <T,>(item: Localized<T>, locale: string): T => (locale === "en" ? item.en : item.zh);

export const formatPrice = (price: { cny: number; usd: number }, locale: string) =>
  locale === "en"
    ? `$${price.usd.toLocaleString("en-US")}`
    : `¥${price.cny.toLocaleString("zh-CN")}`;
