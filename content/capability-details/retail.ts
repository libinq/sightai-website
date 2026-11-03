import type { CapabilityDetail } from "./types";

// KPI values are placeholders — TODO: verify before launch 【待替换】
export const RETAIL: Record<string, CapabilityDetail> = {
  "retail-heatmap": {
    zh: {
      overview: "店面客流热力图把门店摄像头变成经营传感器：匿名统计进店与过店客流、各区域停留时长和行走动线，生成按小时的热力图和“过店 → 进店 → 停留 → 拿取 → 收银”转化漏斗，用数据指导陈列、促销与排班。",
      benefits: [
        ["高峰时段收银台更充足，排队更短", "热门商品摆在更顺手的位置"],
        ["按客流曲线排班，忙闲分配更合理", "促销效果当天就能看到"],
        ["多门店客流与转化统一对比", "用数据评估新店选址与改造效果"],
      ],
      features: [
        { title: "进店 / 过店客流", desc: "区分进店顾客与门前路过人数，计算进店率。" },
        { title: "区域停留热力", desc: "按区域统计平均停留时长，生成小时 × 区域热力图。" },
        { title: "顾客动线还原", desc: "匿名还原典型行走路径，发现动线断点和冷区。" },
        { title: "排队长度预警", desc: "收银排队超过设定人数时推送店长加开收银台。" },
        { title: "多门店对比", desc: "跨门店对比客流、停留、转化，找出最佳实践。" },
        { title: "全程匿名化", desc: "只统计人数与轨迹，不做人脸识别，不存储个人身份信息。" },
      ],
      workflow: [
        { title: "接入门店摄像头", desc: "利用入口与卖场现有摄像头，绘制区域与计数线。" },
        { title: "匿名检测与跟踪", desc: "检测人体并分配临时匿名 ID，统计进出与停留。" },
        { title: "指标汇总", desc: "按小时汇总客流、停留、转化等指标。" },
        { title: "看板与提醒", desc: "在行业看板查看热力与漏斗，排队过长实时提醒。" },
      ],
      kpis: [
        { value: "95%+", label: "客流计数准确率（目标）" },
        { value: "1 h", label: "热力统计粒度" },
        { value: "0", label: "存储的个人身份信息" },
      ],
      scenarios: [
        { title: "陈列与动线优化", desc: "找出冷区，调整货架与促销堆头位置。" },
        { title: "排班与收银管理", desc: "按客流曲线排班，排队过长自动提醒。" },
        { title: "活动效果评估", desc: "对比活动前后的进店率与停留时长。" },
      ],
      specs: [
        { label: "指标", value: "进店 / 过店客流、停留时长、动线、排队、转化" },
        { label: "视频输入", value: "门店现有摄像头，720p 及以上" },
        { label: "统计粒度", value: "按小时，支持自定义区域" },
        { label: "隐私", value: "匿名统计，不做人脸识别" },
        { label: "接口", value: "REST API、BI 数据导出" },
      ],
      faqs: [
        { q: "会识别顾客身份吗？", a: "不会。系统只做匿名人体检测与计数，不进行人脸识别，也不存储可识别个人的信息。" },
        { q: "需要专门的客流计数相机吗？", a: "不需要。入口与卖场的普通监控摄像头即可，安装角度建议俯视。" },
        { q: "能和 POS 数据结合算转化率吗？", a: "可以。通过 API 导入小票数，即可计算“进店 → 成交”的转化率。" },
      ],
    },
    en: {
      overview: "Store heatmap turns store cameras into business sensors: anonymous counts of entries and passers-by, dwell time by zone and walking paths, rolled into hourly heatmaps and a passers-by → entered → dwelled → picked up → checkout funnel that guides layout, promotions and staffing.",
      benefits: [
        ["More lanes open at peak, shorter queues", "Popular products placed where they're easy to reach"],
        ["Staff schedules follow real footfall", "See promotion results the same day"],
        ["Footfall and conversion compared across stores", "Data behind site selection and refits"],
      ],
      features: [
        { title: "Entries vs. passers-by", desc: "Separates shoppers who enter from people walking past to compute capture rate." },
        { title: "Dwell heatmap", desc: "Average dwell per zone as an hour × zone heatmap." },
        { title: "Path replay", desc: "Anonymous typical paths reveal broken flows and cold zones." },
        { title: "Queue alerts", desc: "Managers are told to open lanes when queues pass a set length." },
        { title: "Cross-store comparison", desc: "Compare footfall, dwell and conversion to spread best practice." },
        { title: "Fully anonymous", desc: "Counts and paths only — no face recognition, no personal identifiers stored." },
      ],
      workflow: [
        { title: "Connect store cameras", desc: "Use existing entrance and floor cameras; draw zones and count lines." },
        { title: "Anonymous detection & tracking", desc: "People get temporary anonymous IDs for entries and dwell." },
        { title: "Roll up metrics", desc: "Footfall, dwell and conversion aggregated by hour." },
        { title: "Dashboards & alerts", desc: "Heatmaps and funnels in the dashboard; live queue alerts." },
      ],
      kpis: [
        { value: "95%+", label: "counting accuracy (target)" },
        { value: "1 h", label: "heatmap granularity" },
        { value: "0", label: "personal identifiers stored" },
      ],
      scenarios: [
        { title: "Layout & flow", desc: "Find cold zones and move fixtures and promo stands." },
        { title: "Staffing & checkouts", desc: "Roster to the footfall curve, with queue alerts." },
        { title: "Campaign evaluation", desc: "Compare capture rate and dwell before and after." },
      ],
      specs: [
        { label: "Metrics", value: "Entries, passers-by, dwell, paths, queues, conversion" },
        { label: "Video input", value: "Existing store cameras, 720p+" },
        { label: "Granularity", value: "Hourly, custom zones" },
        { label: "Privacy", value: "Anonymous; no face recognition" },
        { label: "Interfaces", value: "REST API, BI export" },
      ],
      faqs: [
        { q: "Does it identify shoppers?", a: "No. It only detects and counts people anonymously — no face recognition and nothing that identifies individuals is stored." },
        { q: "Do we need special counting cameras?", a: "No. Regular entrance and floor cameras work; a top-down angle is recommended." },
        { q: "Can it combine with POS data?", a: "Yes. Import transaction counts via the API to get entry-to-sale conversion." },
      ],
    },
  },

  "retail-shelf": {
    zh: {
      overview: "货架缺货监测定时巡检货架画面，在 SKU 级识别空位、缺货、错放和价签缺失，计算货架满陈率，自动生成补货任务推送到店员手机，让“缺货才发现”变成“快缺货就补上”。",
      benefits: [
        ["想买的商品更少缺货", "价签清晰准确，不再找不到价格"],
        ["补货任务直接推送，不用反复巡店", "按优先级补货，先补最畅销的"],
        ["各门店满陈率与缺货时长统一追踪", "远程核查陈列执行情况"],
      ],
      features: [
        { title: "SKU 级商品检测", desc: "识别货架上的每一个商品与空位，支持快速新增 SKU。" },
        { title: "空位与缺货识别", desc: "定时巡检，发现空位立即标记位置与缺失商品。" },
        { title: "陈列合规", desc: "对照陈列图识别错放、混放与排面不足。" },
        { title: "价签缺失检测", desc: "识别价签缺失、遮挡与位置错误。" },
        { title: "补货任务派发", desc: "按缺货紧急程度生成任务，推送到店员手机并追踪完成。" },
        { title: "满陈率趋势", desc: "统计每个货架、每个门店的满陈率与缺货时长变化。" },
      ],
      workflow: [
        { title: "接入货架摄像头", desc: "接入现有货架摄像头或加装小型定焦相机。" },
        { title: "定时巡检", desc: "按设定频率（如每 15 分钟）抓帧分析货架状态。" },
        { title: "生成任务", desc: "识别到缺货、错放后自动生成补货 / 整理任务。" },
        { title: "闭环追踪", desc: "店员完成后系统再次巡检确认，统计处理时长。" },
      ],
      kpis: [
        { value: "15 min", label: "货架巡检频次" },
        { value: "-30%", label: "缺货时长（目标）" },
        { value: "95%+", label: "空位识别准确率（目标）" },
      ],
      scenarios: [
        { title: "商超日化与饮料区", desc: "高周转品类及时补货。" },
        { title: "便利店连锁", desc: "人手少，靠任务推送管理补货。" },
        { title: "品牌陈列核查", desc: "品牌方远程检查门店陈列执行。" },
      ],
      specs: [
        { label: "识别内容", value: "空位、缺货、错放、价签缺失" },
        { label: "巡检频次", value: "5–60 分钟可配置" },
        { label: "视频输入", value: "货架摄像头 / 抓拍相机，1080p 推荐" },
        { label: "任务推送", value: "店员 App、企业微信 / 钉钉、Webhook" },
        { label: "接口", value: "REST API，可对接 ERP / 补货系统" },
      ],
      faqs: [
        { q: "新增商品需要重新训练吗？", a: "新增 SKU 只需上传少量商品图片，系统即可识别，无需完整重新训练。" },
        { q: "需要每个货架都装摄像头吗？", a: "建议重点品类覆盖；一台广角摄像头通常可覆盖 2–3 组货架。" },
        { q: "能对接我们的补货系统吗？", a: "可以，通过 API / Webhook 将缺货事件推送到 ERP 或补货系统。" },
      ],
    },
    en: {
      overview: "Shelf monitoring scans shelf feeds on a schedule to find gaps, out-of-stocks, misplaced items and missing price tags at SKU level, scores shelf fullness and pushes restock tasks to staff phones — turning “found empty” into “refilled before it ran out”.",
      benefits: [
        ["Fewer empty shelves for the things they want", "Clear, correct price tags"],
        ["Restock tasks pushed to phones — no repeated floor walks", "Restock by priority, best-sellers first"],
        ["Fullness and out-of-stock time tracked across stores", "Planogram execution audited remotely"],
      ],
      features: [
        { title: "SKU-level detection", desc: "Every product and gap on the shelf; add new SKUs quickly." },
        { title: "Gap & out-of-stock", desc: "Scheduled scans mark gaps with location and missing product." },
        { title: "Planogram compliance", desc: "Detects misplaced or mixed products and thin facings." },
        { title: "Price-tag checks", desc: "Missing, blocked or misplaced tags." },
        { title: "Restock tasks", desc: "Prioritized tasks on staff phones, tracked to completion." },
        { title: "Fullness trend", desc: "Fullness and out-of-stock duration per shelf and store." },
      ],
      workflow: [
        { title: "Connect shelf cameras", desc: "Use existing cameras or add small fixed-focus units." },
        { title: "Scheduled scans", desc: "Analyze shelf state every 15 minutes (configurable)." },
        { title: "Create tasks", desc: "Gaps and misplacements become restock or tidy tasks." },
        { title: "Close the loop", desc: "A follow-up scan confirms completion and logs time to fix." },
      ],
      kpis: [
        { value: "15 min", label: "scan interval" },
        { value: "-30%", label: "out-of-stock time (target)" },
        { value: "95%+", label: "gap detection accuracy (target)" },
      ],
      scenarios: [
        { title: "Household & drinks aisles", desc: "Fast movers refilled on time." },
        { title: "Convenience chains", desc: "Lean teams managed through task pushes." },
        { title: "Brand audits", desc: "Brands check in-store execution remotely." },
      ],
      specs: [
        { label: "Detects", value: "Gaps, out-of-stock, misplaced items, missing tags" },
        { label: "Scan interval", value: "5–60 min, configurable" },
        { label: "Video input", value: "Shelf cameras, 1080p recommended" },
        { label: "Task delivery", value: "Staff app, Teams / WeCom / DingTalk, webhook" },
        { label: "Interfaces", value: "REST API; ERP / replenishment integration" },
      ],
      faqs: [
        { q: "Do new products need retraining?", a: "Upload a few product photos and the new SKU is recognized — no full retraining." },
        { q: "Does every shelf need a camera?", a: "Cover key categories first; one wide camera usually covers 2–3 bays." },
        { q: "Can it feed our replenishment system?", a: "Yes, via API / webhook to your ERP or replenishment tool." },
      ],
    },
  },

  "retail-avatar": {
    zh: {
      overview: "AI Avatar 数字导购为品牌定制专属形象与声音，接入商品库和大模型，在门店大屏、小程序与直播间完成导购问答、商品讲解与促销播报，复杂问题一键转人工，让每家门店都有一位 7×24 在岗、话术统一的金牌导购。",
      benefits: [
        ["随时有人解答商品问题，不必等店员", "多语种服务外籍顾客"],
        ["重复问答与促销播报交给数字人", "复杂问题带上下文转人工，接待更高效"],
        ["品牌形象与话术在所有门店统一", "直播带货不再受主播档期限制"],
      ],
      features: [
        { title: "2D / 3D 形象定制", desc: "基于 3 分钟真人素材或品牌 IP 定制专属数字人形象。" },
        { title: "语音克隆与口型同步", desc: "克隆指定声音，口型与语音精确同步。" },
        { title: "接入商品知识库", desc: "同步商品参数、价格与库存，回答准确且实时。" },
        { title: "直播带货脚本", desc: "根据商品卖点自动生成直播脚本并 7×24 播出。" },
        { title: "多语种播报", desc: "支持中、英、日、马来等多语种问答与播报。" },
        { title: "转人工与会话记录", desc: "复杂问题一键转店员，所有会话留档可分析。" },
      ],
      workflow: [
        { title: "形象与声音定制", desc: "拍摄 3 分钟素材，约 1–2 周完成训练与交付。" },
        { title: "接入知识库", desc: "导入商品信息、FAQ 与品牌话术。" },
        { title: "多端部署", desc: "部署到门店大屏、小程序、直播间或官网。" },
        { title: "运营分析", desc: "统计会话量、热门问题与转人工率，持续优化。" },
      ],
      kpis: [
        { value: "7×24", label: "在岗时长" },
        { value: "10+", label: "支持语种" },
        { value: "3 min", label: "定制所需真人素材" },
      ],
      scenarios: [
        { title: "门店导购大屏", desc: "商品咨询、导航与促销播报。" },
        { title: "电商直播间", desc: "数字人主播 7×24 带货。" },
        { title: "会员小程序", desc: "一对一导购与售后答疑。" },
      ],
      specs: [
        { label: "形象", value: "2D 真人 / 3D 卡通 / 品牌 IP" },
        { label: "交互", value: "语音 / 文字问答，接入大模型" },
        { label: "部署终端", value: "门店大屏、小程序、直播推流、Web" },
        { label: "响应时延", value: "首句 < 1.5 s" },
        { label: "接口", value: "SDK、REST API、RTMP 推流" },
      ],
      faqs: [
        { q: "定制一个数字人要多久？", a: "拍摄约 3 分钟素材后，通常 1–2 周完成训练与交付。" },
        { q: "回答会不会出错或乱说？", a: "回答以品牌商品库与 FAQ 为准，可设置不回答的话题，超出范围自动转人工。" },
        { q: "能用在抖音、淘宝直播吗？", a: "可以，通过 RTMP 推流接入主流直播平台。" },
      ],
    },
    en: {
      overview: "AI Avatar Associate gives your brand a custom look and voice, connected to your catalog and an LLM. It answers shopper questions, presents products and reads promotions on store screens, mini-apps and live streams, handing complex questions to staff — a consistent, always-on star associate in every store.",
      benefits: [
        ["Questions answered any time, no waiting for staff", "Service in several languages"],
        ["Repetitive Q&A and promotions handled by the avatar", "Complex cases handed over with context"],
        ["One brand look and script in every store", "Live commerce no longer depends on presenter schedules"],
      ],
      features: [
        { title: "Custom 2D / 3D look", desc: "Built from 3 minutes of footage or your brand IP." },
        { title: "Voice clone & lip sync", desc: "Cloned voice with precise lip synchronization." },
        { title: "Product knowledge base", desc: "Specs, prices and stock synced for accurate answers." },
        { title: "Live-commerce scripts", desc: "Scripts generated from selling points and streamed 24/7." },
        { title: "Multilingual", desc: "Chinese, English, Japanese, Malay and more." },
        { title: "Handoff & transcripts", desc: "One-tap handoff to staff; every conversation logged." },
      ],
      workflow: [
        { title: "Look & voice", desc: "Shoot 3 minutes of footage; delivery in about 1–2 weeks." },
        { title: "Connect knowledge", desc: "Import product info, FAQs and brand tone." },
        { title: "Deploy anywhere", desc: "Store screens, mini-apps, live streams or web." },
        { title: "Improve", desc: "Track sessions, top questions and handoff rate." },
      ],
      kpis: [
        { value: "24/7", label: "on duty" },
        { value: "10+", label: "languages" },
        { value: "3 min", label: "footage needed" },
      ],
      scenarios: [
        { title: "In-store screens", desc: "Product questions, wayfinding and promotions." },
        { title: "Live commerce", desc: "An avatar presenter selling around the clock." },
        { title: "Member mini-apps", desc: "One-to-one shopping help and after-sales." },
      ],
      specs: [
        { label: "Look", value: "2D photoreal / 3D character / brand IP" },
        { label: "Interaction", value: "Voice / text Q&A with LLM" },
        { label: "Endpoints", value: "Store screens, mini-apps, RTMP streaming, web" },
        { label: "Latency", value: "First sentence < 1.5 s" },
        { label: "Interfaces", value: "SDK, REST API, RTMP" },
      ],
      faqs: [
        { q: "How long does a custom avatar take?", a: "After about 3 minutes of footage, typically 1–2 weeks to train and deliver." },
        { q: "Could it give wrong answers?", a: "Answers are grounded in your catalog and FAQs, off-limits topics can be set, and out-of-scope questions go to staff." },
        { q: "Can it stream on TikTok or Taobao Live?", a: "Yes, via RTMP to mainstream live platforms." },
      ],
    },
  },

  "retail-loss": {
    zh: {
      overview: "收银防损对照收银画面与 POS 流水，识别自助收银漏扫、遮挡扫码和未结账离店等异常，自动生成证据片段供防损团队复核，在不打扰正常顾客的前提下降低损耗。",
      benefits: [
        ["正常顾客结账不受打扰", "自助收银体验保持顺畅"],
        ["异常自动标记，防损复核有视频证据", "不用逐段回看录像"],
        ["损耗按门店、收银台排行", "降低损耗率，提升利润"],
      ],
      features: [
        { title: "画面与 POS 对齐", desc: "将商品经过扫码区的画面与 POS 流水逐条比对。" },
        { title: "漏扫 / 遮挡扫码", desc: "识别商品未扫码直接装袋、遮挡条码等行为。" },
        { title: "未结账离店", desc: "识别携带商品绕过收银离店的情况。" },
        { title: "证据片段导出", desc: "一键导出包含画面与小票的证据包。" },
        { title: "门店损耗排行", desc: "按门店、收银台、时段统计异常与损耗。" },
        { title: "误报复核闭环", desc: "防损人员复核结果回流，持续降低误报。" },
      ],
      workflow: [
        { title: "接入收银画面与 POS", desc: "接入收银台俯视摄像头与 POS 交易数据。" },
        { title: "逐笔比对", desc: "识别商品动作并与扫码记录逐条对齐。" },
        { title: "异常标记", desc: "疑似漏扫生成事件，附画面与小票。" },
        { title: "复核处置", desc: "防损团队复核并记录，结果用于模型迭代。" },
      ],
      kpis: [
        { value: "-20%", label: "收银损耗（目标）" },
        { value: "< 5 s", label: "异常标记时延" },
        { value: "100%", label: "事件附证据片段" },
      ],
      scenarios: [
        { title: "自助收银区", desc: "识别漏扫与遮挡扫码。" },
        { title: "人工收银台", desc: "识别跳扫、低价替换等异常。" },
        { title: "出入口", desc: "识别未结账离店。" },
      ],
      specs: [
        { label: "识别事件", value: "漏扫、遮挡扫码、未结账离店" },
        { label: "数据输入", value: "收银俯视摄像头 + POS 交易流水" },
        { label: "部署方式", value: "门店边缘盒子 / 云端" },
        { label: "输出", value: "事件、证据片段、损耗报表" },
        { label: "接口", value: "POS 对接 SDK、REST API" },
      ],
      faqs: [
        { q: "需要改造 POS 系统吗？", a: "不需要改造，只需开放交易流水接口或日志，我们提供对接 SDK。" },
        { q: "会不会冤枉正常顾客？", a: "系统只标记疑似事件，最终由防损人员结合证据复核，不会自动拦截顾客。" },
        { q: "支持哪些自助收银机？", a: "与收银机品牌无关，只要有俯视摄像头和交易数据即可。" },
      ],
    },
    en: {
      overview: "Checkout loss prevention aligns checkout video with POS logs to flag self-checkout skip-scans, blocked barcodes and walk-outs, generating evidence clips for the loss-prevention team — cutting shrink without bothering honest shoppers.",
      benefits: [
        ["Honest shoppers check out undisturbed", "Self-checkout stays smooth"],
        ["Anomalies flagged with video evidence", "No more scrubbing through recordings"],
        ["Shrink ranked by store and lane", "Lower loss rate, better margins"],
      ],
      features: [
        { title: "Video ↔ POS alignment", desc: "Items passing the scan area matched line by line with POS records." },
        { title: "Skip / blocked scans", desc: "Items bagged without scanning or with barcodes covered." },
        { title: "Walk-outs", desc: "Goods carried past the checkout without paying." },
        { title: "Evidence export", desc: "One-click evidence packs with video and receipt." },
        { title: "Shrink ranking", desc: "Anomalies and shrink by store, lane and hour." },
        { title: "Review loop", desc: "Reviewer verdicts feed back to keep false positives falling." },
      ],
      workflow: [
        { title: "Connect video & POS", desc: "Overhead checkout cameras plus POS transaction data." },
        { title: "Match each item", desc: "Item movements aligned with scan records." },
        { title: "Flag", desc: "Suspected skip-scans become events with clip and receipt." },
        { title: "Review", desc: "LP team reviews and records outcomes for model improvement." },
      ],
      kpis: [
        { value: "-20%", label: "checkout shrink (target)" },
        { value: "< 5 s", label: "time to flag" },
        { value: "100%", label: "events with evidence" },
      ],
      scenarios: [
        { title: "Self-checkout", desc: "Skip-scans and blocked barcodes." },
        { title: "Staffed lanes", desc: "Sweethearting and ticket switching." },
        { title: "Exits", desc: "Walk-outs without paying." },
      ],
      specs: [
        { label: "Events", value: "Skip-scan, blocked scan, walk-out" },
        { label: "Inputs", value: "Overhead checkout cameras + POS logs" },
        { label: "Deployment", value: "In-store edge box / cloud" },
        { label: "Output", value: "Events, evidence clips, shrink reports" },
        { label: "Interfaces", value: "POS integration SDK, REST API" },
      ],
      faqs: [
        { q: "Do we need to modify our POS?", a: "No — expose the transaction feed or logs and use our integration SDK." },
        { q: "Could honest shoppers be accused?", a: "The system only flags suspected events; LP staff review the evidence and nobody is stopped automatically." },
        { q: "Which self-checkouts are supported?", a: "Any brand, as long as there's an overhead camera and transaction data." },
      ],
    },
  },
};
