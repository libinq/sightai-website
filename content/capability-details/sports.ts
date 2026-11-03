import type { CapabilityDetail } from "./types";

// KPI values are placeholders — TODO: verify before launch 【待替换】
export const SPORTS: Record<string, CapabilityDetail> = {
  "sports-refcam": {
    zh: {
      overview: "RefCam 把裁判胸挂或头戴相机的画面变成可直接播出的转播信号。SightAI 融合陀螺仪数据与视觉运动估计，实时平滑剧烈抖动、校正地平线与滚动快门，在保留临场感的同时让画面稳定清晰，已在国际足球赛事中应用。",
      benefits: [
        ["多一个独家机位，可直接切入转播", "回放与集锦有了全新视角"],
        ["站在裁判身边看比赛的沉浸感", "关键判罚从裁判视角看得清清楚楚"],
        ["提升判罚透明度与赛事公信力", "为赞助商带来新的曝光位置"],
      ],
      features: [
        { title: "陀螺仪 + 视觉融合防抖", desc: "结合 IMU 数据与画面运动估计，即使剧烈奔跑也能稳定输出。" },
        { title: "地平线校正", desc: "实时校正镜头倾斜，保持草坪与看台水平。" },
        { title: "滚动快门修正", desc: "消除快速转头时的果冻效应与画面扭曲。" },
        { title: "低时延实时输出", desc: "端到端时延满足直播切换要求。" },
        { title: "原始 / 防抖对比回放", desc: "并排回放原始与处理后画面，便于复盘与展示。" },
        { title: "转播级输出", desc: "支持 SDI / SRT / NDI 输出，直接接入转播车与云制作。" },
      ],
      workflow: [
        { title: "佩戴采集", desc: "裁判佩戴胸挂 / 头戴相机，同步记录陀螺仪数据。" },
        { title: "无线回传", desc: "通过 5G / 专用无线链路回传到场边处理节点。" },
        { title: "实时防抖", desc: "运动估计、轨迹平滑与地平线校正实时完成。" },
        { title: "信号输出", desc: "以 SDI / SRT 输出到转播切换台或云端制作平台。" },
      ],
      kpis: [
        { value: "< 200 ms", label: "端到端处理时延（目标）" },
        { value: "-90%", label: "画面抖动幅度（陀螺仪曲线）" },
        { value: "1080p50", label: "直播输出规格" },
      ],
      scenarios: [
        { title: "职业联赛直播", desc: "裁判视角作为独家机位切入转播。" },
        { title: "赛后回放与集锦", desc: "关键判罚的第一视角回放。" },
        { title: "裁判培训", desc: "用稳定的第一视角画面复盘跑位与判罚。" },
      ],
      specs: [
        { label: "输入", value: "胸挂 / 头戴运动相机 + IMU 数据" },
        { label: "输出", value: "SDI / SRT / NDI，1080p50" },
        { label: "处理", value: "陀螺仪融合防抖、地平线校正、滚动快门修正" },
        { label: "部署", value: "场边边缘服务器 / 云端制作" },
        { label: "时延", value: "< 200 ms（目标）" },
      ],
      faqs: [
        { q: "没有陀螺仪数据能用吗？", a: "可以，纯视觉模式同样可用；有陀螺仪数据时稳定效果更好。" },
        { q: "能用于直播还是只能后期？", a: "两者都支持，直播模式端到端时延满足切换要求。" },
        { q: "除了足球还能用于哪些运动？", a: "橄榄球、篮球、冰球等裁判或运动员第一视角都适用。" },
      ],
    },
    en: {
      overview: "RefCam turns chest- or head-mounted referee cameras into a broadcast-ready feed. SightAI fuses gyro data with visual motion estimation to smooth violent shake and correct horizon and rolling shutter in real time — keeping the immersion while making the picture steady. It has been used at international football matches.",
      benefits: [
        ["An exclusive angle that can cut straight to air", "A fresh perspective for replays and highlights"],
        ["The feeling of running alongside the referee", "Key decisions seen clearly from the referee's eyes"],
        ["More transparency and trust in officiating", "New exposure inventory for sponsors"],
      ],
      features: [
        { title: "Gyro + vision fusion", desc: "IMU data plus image motion estimation keeps output steady even at full sprint." },
        { title: "Horizon leveling", desc: "Corrects tilt in real time so pitch and stands stay level." },
        { title: "Rolling-shutter correction", desc: "Removes jello and warping on fast head turns." },
        { title: "Low-latency live output", desc: "End-to-end latency fit for live switching." },
        { title: "Raw vs. stabilized replay", desc: "Side-by-side playback for review and showcase." },
        { title: "Broadcast outputs", desc: "SDI / SRT / NDI straight into the OB van or cloud production." },
      ],
      workflow: [
        { title: "Wear & capture", desc: "The referee wears the camera; gyro data is recorded in sync." },
        { title: "Wireless return", desc: "5G or dedicated RF back to a pitch-side processing node." },
        { title: "Stabilize live", desc: "Motion estimation, path smoothing and leveling in real time." },
        { title: "Output", desc: "SDI / SRT to the vision mixer or cloud production." },
      ],
      kpis: [
        { value: "< 200 ms", label: "end-to-end latency (target)" },
        { value: "-90%", label: "shake amplitude (gyro trace)" },
        { value: "1080p50", label: "live output" },
      ],
      scenarios: [
        { title: "Pro league broadcasts", desc: "Referee POV as an exclusive live angle." },
        { title: "Replays & highlights", desc: "First-person replays of key decisions." },
        { title: "Referee training", desc: "Review positioning and calls from a steady POV." },
      ],
      specs: [
        { label: "Input", value: "Chest / head action camera + IMU" },
        { label: "Output", value: "SDI / SRT / NDI, 1080p50" },
        { label: "Processing", value: "Gyro-fused stabilization, leveling, rolling-shutter fix" },
        { label: "Deployment", value: "Pitch-side edge server / cloud production" },
        { label: "Latency", value: "< 200 ms (target)" },
      ],
      faqs: [
        { q: "Does it work without gyro data?", a: "Yes, vision-only mode works; gyro data makes it steadier." },
        { q: "Live or post-production only?", a: "Both — live mode meets switching latency requirements." },
        { q: "Which sports besides football?", a: "Rugby, basketball, ice hockey and any referee or athlete POV." },
      ],
    },
  },

  "sports-enhance": {
    zh: {
      overview: "赛事视频增强对直播流与回放素材做超分辨率、HDR 还原、低光去噪和多机位色彩统一，让低码率机位、夜场比赛和老旧素材也达到转播级观感，同时降低高规格设备与制作的投入。",
      benefits: [
        ["低成本机位也能输出转播级画面", "多机位色彩一致，切换不跳色"],
        ["夜场与雨天比赛画面更清晰", "4K 超分让大屏观赛更细腻"],
        ["用更少的高端设备完成高规格制作", "历史赛事素材翻新再利用"],
      ],
      features: [
        { title: "1080p → 4K 超分", desc: "基于深度学习的超分辨率，细节自然不过锐。" },
        { title: "HDR 还原", desc: "从 SDR 素材恢复高光与暗部细节，输出 HDR 信号。" },
        { title: "夜场低光去噪", desc: "去除夜间与室内场馆的高 ISO 噪点，保留运动细节。" },
        { title: "多机位色彩匹配", desc: "自动统一不同品牌、不同位置摄像机的色彩风格。" },
        { title: "直播流实时处理", desc: "以帧级时延处理直播信号，不影响现场切换。" },
        { title: "批量回放增强", desc: "对历史素材与回放片段进行批量增强。" },
      ],
      workflow: [
        { title: "接入信号", desc: "接入直播流（SRT / RTMP）或上传素材文件。" },
        { title: "选择增强项", desc: "按需开启超分、HDR、去噪与色彩匹配。" },
        { title: "实时 / 批量处理", desc: "直播实时处理，回放素材批量排队处理。" },
        { title: "输出分发", desc: "输出到转播系统、OTT 平台或媒资库。" },
      ],
      kpis: [
        { value: "4K", label: "超分输出" },
        { value: "< 2 帧", label: "直播处理时延（目标）" },
        { value: "100 h", label: "基础版每路每月处理时长" },
      ],
      scenarios: [
        { title: "次级联赛与青少年赛事", desc: "低成本机位输出转播级画面。" },
        { title: "夜场与室内场馆", desc: "去噪与亮度还原。" },
        { title: "经典赛事翻新", desc: "历史素材超分修复后重新上线。" },
      ],
      specs: [
        { label: "输入", value: "SRT / RTMP / 文件（MP4、MOV、ProRes）" },
        { label: "输出", value: "最高 4K HDR10" },
        { label: "处理项", value: "超分、HDR、去噪、色彩匹配" },
        { label: "部署", value: "云端 GPU / 场馆边缘服务器" },
        { label: "接口", value: "REST API 批处理、直播流转码" },
      ],
      faqs: [
        { q: "超分会不会让画面看起来很“假”？", a: "模型针对体育画面训练，保留真实纹理并抑制过锐和伪影。" },
        { q: "直播能用吗？", a: "可以，直播模式处理时延控制在约 2 帧以内。" },
        { q: "只处理回放素材可以吗？", a: "可以，支持文件批量上传处理。" },
      ],
    },
    en: {
      overview: "Match video enhancement applies super-resolution, HDR recovery, low-light denoising and multi-camera color matching to live streams and replays, so low-bitrate angles, night games and archive footage look broadcast-grade — with less spent on high-end cameras and production.",
      benefits: [
        ["Low-cost angles produce broadcast-grade pictures", "Consistent color across cameras — no jumps on cuts"],
        ["Night and rain games look clearer", "4K upscaling for big screens"],
        ["High-end production with less high-end kit", "Archive matches restored for reuse"],
      ],
      features: [
        { title: "1080p → 4K upscaling", desc: "Deep-learning super-resolution with natural detail, no over-sharpening." },
        { title: "HDR recovery", desc: "Recovers highlights and shadows from SDR and outputs HDR." },
        { title: "Night denoise", desc: "Removes high-ISO noise in night and indoor venues while keeping motion detail." },
        { title: "Multi-camera matching", desc: "Aligns color across camera brands and positions automatically." },
        { title: "Live processing", desc: "Frame-level latency on live signals." },
        { title: "Batch replay enhancement", desc: "Enhance archive footage and replay clips in bulk." },
      ],
      workflow: [
        { title: "Ingest", desc: "Live stream (SRT / RTMP) or file upload." },
        { title: "Choose enhancements", desc: "Toggle upscaling, HDR, denoise and color matching." },
        { title: "Process live or in batch", desc: "Live in real time; replays queued in batch." },
        { title: "Deliver", desc: "To broadcast, OTT platforms or the media library." },
      ],
      kpis: [
        { value: "4K", label: "upscaled output" },
        { value: "< 2 frames", label: "live latency (target)" },
        { value: "100 h", label: "processing per camera per month (Basic)" },
      ],
      scenarios: [
        { title: "Lower leagues & youth sport", desc: "Broadcast quality from budget cameras." },
        { title: "Night & indoor venues", desc: "Denoise and brightness recovery." },
        { title: "Classic match restoration", desc: "Archive footage upscaled and republished." },
      ],
      specs: [
        { label: "Input", value: "SRT / RTMP / files (MP4, MOV, ProRes)" },
        { label: "Output", value: "Up to 4K HDR10" },
        { label: "Processing", value: "Upscaling, HDR, denoise, color matching" },
        { label: "Deployment", value: "Cloud GPU / venue edge server" },
        { label: "Interfaces", value: "REST batch API, live transcoding" },
      ],
      faqs: [
        { q: "Will upscaling look fake?", a: "The model is trained on sports footage, keeping real texture and suppressing artifacts." },
        { q: "Can it run live?", a: "Yes, live mode adds about two frames of latency." },
        { q: "Can we use it on replays only?", a: "Yes, batch file processing is supported." },
      ],
    },
  },

  "sports-highlights": {
    zh: {
      overview: "高光集锦生成与分发实时识别进球、射门、扑救、犯规和观众情绪峰值，自动剪辑横屏与竖屏集锦并加上字幕与品牌包装，按规则分发到社交平台、官网与 App，比赛结束几分钟内即可上线。",
      benefits: [
        ["集锦产出从数小时缩短到几分钟", "横竖屏多版本自动生成，适配各平台"],
        ["赛后几分钟就能刷到精彩瞬间", "按喜欢的球员、球队订阅个人集锦"],
        ["内容产量成倍提升，赞助曝光更多", "各平台播放数据统一回流"],
      ],
      features: [
        { title: "关键事件识别", desc: "识别进球、射门、扑救、犯规、角球等关键事件。" },
        { title: "横竖屏自动裁切", desc: "跟随球与主体自动重构图，输出 16:9、9:16、1:1。" },
        { title: "字幕与品牌包装", desc: "自动叠加比分、球员名、赞助商角标与片头片尾。" },
        { title: "球员个人集锦", desc: "按球员自动汇总其全场精彩表现。" },
        { title: "多平台定时分发", desc: "按规则发布到抖音、YouTube、微博、官网与 App。" },
        { title: "播放数据回流", desc: "汇总各平台播放、互动数据，评估传播效果。" },
      ],
      workflow: [
        { title: "接入比赛信号", desc: "接入主转播信号或多机位直播流。" },
        { title: "事件识别", desc: "画面、音频与比分数据联合判断关键时刻。" },
        { title: "自动剪辑包装", desc: "生成多比例、带字幕与品牌包装的集锦。" },
        { title: "审核与分发", desc: "可选人工审核后，一键分发到各平台。" },
      ],
      kpis: [
        { value: "< 5 min", label: "赛后集锦上线" },
        { value: "3 种", label: "画幅比例自动输出" },
        { value: "10×", label: "内容产量提升（目标）" },
      ],
      scenarios: [
        { title: "联赛官方社媒", desc: "每场比赛自动产出集锦与短视频。" },
        { title: "转播与 OTT 平台", desc: "为点播频道快速提供精彩片段。" },
        { title: "俱乐部与球员", desc: "球员个人集锦用于粉丝运营与商务。" },
      ],
      specs: [
        { label: "输入", value: "转播信号 / 多机位直播流 + 比分数据" },
        { label: "识别事件", value: "进球、射门、扑救、犯规、角球、情绪峰值" },
        { label: "输出", value: "16:9 / 9:16 / 1:1 MP4，带字幕与包装" },
        { label: "分发", value: "抖音、YouTube、微博、官网、App（API）" },
        { label: "部署", value: "云端" },
      ],
      faqs: [
        { q: "需要人工审核吗？", a: "可选。可以设置自动发布，也可以先进入审核队列由编辑确认。" },
        { q: "支持哪些运动？", a: "目前支持足球、篮球，其它项目可按需训练。" },
        { q: "包装模板能自定义吗？", a: "可以，上传品牌字体、角标与片头片尾即可。" },
      ],
    },
    en: {
      overview: "Auto highlights & distribution detects goals, shots, saves, fouls and crowd peaks in real time, cuts landscape and vertical reels with captions and branding, and publishes them to social, web and app on your rules — live within minutes of the final whistle.",
      benefits: [
        ["Highlights in minutes, not hours", "Landscape and vertical versions for every platform"],
        ["Big moments on social minutes after the whistle", "Personal reels for favorite players and teams"],
        ["Multiply content output and sponsor exposure", "Distribution analytics in one place"],
      ],
      features: [
        { title: "Key-moment detection", desc: "Goals, shots, saves, fouls, corners and more." },
        { title: "Auto reframing", desc: "Follows the ball and players to output 16:9, 9:16 and 1:1." },
        { title: "Captions & branding", desc: "Score, player names, sponsor bugs, intros and outros." },
        { title: "Per-player reels", desc: "Every standout moment of a player compiled automatically." },
        { title: "Scheduled publishing", desc: "To TikTok, YouTube, X, web and app by rule." },
        { title: "Analytics back-flow", desc: "Views and engagement from every platform combined." },
      ],
      workflow: [
        { title: "Ingest the match", desc: "Main broadcast feed or multi-camera streams." },
        { title: "Detect moments", desc: "Video, audio and score data combined to find key moments." },
        { title: "Cut & package", desc: "Multi-ratio reels with captions and branding." },
        { title: "Review & publish", desc: "Optional editor review, then one-click distribution." },
      ],
      kpis: [
        { value: "< 5 min", label: "post-match highlights live" },
        { value: "3", label: "aspect ratios generated" },
        { value: "10×", label: "content output (target)" },
      ],
      scenarios: [
        { title: "League social channels", desc: "Highlights and shorts for every match." },
        { title: "Broadcast & OTT", desc: "Clips for on-demand channels, fast." },
        { title: "Clubs & players", desc: "Personal reels for fan engagement and commercial use." },
      ],
      specs: [
        { label: "Input", value: "Broadcast feed / multi-camera streams + score data" },
        { label: "Moments", value: "Goals, shots, saves, fouls, corners, crowd peaks" },
        { label: "Output", value: "16:9 / 9:16 / 1:1 MP4 with captions and branding" },
        { label: "Distribution", value: "TikTok, YouTube, X, web, app (API)" },
        { label: "Deployment", value: "Cloud" },
      ],
      faqs: [
        { q: "Is human review required?", a: "Optional — publish automatically or route to an editor queue first." },
        { q: "Which sports?", a: "Football and basketball today; others trained on request." },
        { q: "Can we customize the packaging?", a: "Yes — upload brand fonts, bugs, intros and outros." },
      ],
    },
  },

  "sports-avatar": {
    zh: {
      overview: "AI Avatar 赛事主播为赛事打造专属数字人主播与 AI 志愿者：赛前导览、实时比分播报、赛后集锦解说与场馆问答，支持多语种，可部署在场馆大屏、小程序与直播间，已应用于全国性综合运动会的数字志愿服务。",
      benefits: [
        ["多语种播报，覆盖国际观众", "集锦解说与比分播报几乎零等待"],
        ["随时向数字志愿者问路、问赛程", "互动形式更新颖、更有记忆点"],
        ["降低现场志愿者与主持人力成本", "赛事 IP 形象统一、可长期运营"],
      ],
      features: [
        { title: "赛事形象定制", desc: "根据赛事吉祥物或真人定制专属数字人形象。" },
        { title: "实时比分播报", desc: "接入比分数据，自动生成并播报赛况。" },
        { title: "多语种解说", desc: "支持中、英、日等多语种解说与问答。" },
        { title: "场馆导览问答", desc: "回答场馆、交通、赛程、餐饮等问题。" },
        { title: "集锦配音", desc: "为自动生成的集锦配上解说。" },
        { title: "多端部署", desc: "场馆大屏、小程序、直播间、官网同步上线。" },
      ],
      workflow: [
        { title: "形象定制", desc: "基于吉祥物或真人素材完成形象与声音定制。" },
        { title: "接入赛事数据", desc: "接入赛程、比分与场馆信息知识库。" },
        { title: "多端上线", desc: "部署到大屏、小程序与直播间。" },
        { title: "运营优化", desc: "根据热门问题和互动数据持续优化。" },
      ],
      kpis: [
        { value: "10+", label: "支持语种" },
        { value: "7×24", label: "在线服务" },
        { value: "< 1.5 s", label: "首句响应" },
      ],
      scenarios: [
        { title: "综合运动会数字志愿者", desc: "场馆导览、赛程咨询与文明引导。" },
        { title: "联赛数字主播", desc: "比分播报与集锦解说。" },
        { title: "赛事官方小程序", desc: "一对一问答与票务指引。" },
      ],
      specs: [
        { label: "形象", value: "2D 真人 / 3D 吉祥物" },
        { label: "数据接入", value: "赛程、比分、场馆知识库" },
        { label: "终端", value: "大屏、小程序、直播推流、Web" },
        { label: "语种", value: "中 / 英 / 日 / 马来等 10+" },
        { label: "接口", value: "SDK、REST API、RTMP" },
      ],
      faqs: [
        { q: "可以用赛事吉祥物做形象吗？", a: "可以，支持基于吉祥物设计稿制作 3D 数字人。" },
        { q: "比分播报是实时的吗？", a: "接入官方比分数据后，比分变化时自动生成播报。" },
        { q: "赛事结束后还能继续用吗？", a: "可以，数字人形象归赛事所有，可用于后续赛事与品牌运营。" },
      ],
    },
    en: {
      overview: "AI Avatar Presenter gives an event its own digital presenter and AI volunteers: venue guidance, live score updates, highlight commentary and Q&A in many languages, on big screens, mini-apps and live streams. It has served as a digital volunteer at a national multi-sport games.",
      benefits: [
        ["Multilingual coverage for international audiences", "Commentary and score updates with almost no wait"],
        ["Ask a digital volunteer about routes and schedules any time", "A memorable, novel way to interact"],
        ["Fewer on-site volunteers and presenters needed", "A consistent event character for long-term use"],
      ],
      features: [
        { title: "Event character", desc: "Built from the mascot or a real presenter." },
        { title: "Live score updates", desc: "Score data turned into spoken updates automatically." },
        { title: "Multilingual commentary", desc: "Chinese, English, Japanese and more." },
        { title: "Venue Q&A", desc: "Venues, transport, schedules and food." },
        { title: "Highlight voice-over", desc: "Commentary for auto-generated highlights." },
        { title: "Every endpoint", desc: "Big screens, mini-apps, streams and web at once." },
      ],
      workflow: [
        { title: "Create the character", desc: "Look and voice from the mascot or footage." },
        { title: "Connect event data", desc: "Schedule, scores and venue knowledge base." },
        { title: "Go live everywhere", desc: "Screens, mini-apps and live streams." },
        { title: "Improve", desc: "Tune with top questions and engagement data." },
      ],
      kpis: [
        { value: "10+", label: "languages" },
        { value: "24/7", label: "available" },
        { value: "< 1.5 s", label: "first response" },
      ],
      scenarios: [
        { title: "Multi-sport games volunteers", desc: "Wayfinding, schedules and visitor guidance." },
        { title: "League presenters", desc: "Score updates and highlight commentary." },
        { title: "Official event apps", desc: "One-to-one Q&A and ticketing help." },
      ],
      specs: [
        { label: "Look", value: "2D photoreal / 3D mascot" },
        { label: "Data", value: "Schedule, scores, venue knowledge" },
        { label: "Endpoints", value: "Screens, mini-apps, RTMP, web" },
        { label: "Languages", value: "10+ incl. Chinese, English, Japanese, Malay" },
        { label: "Interfaces", value: "SDK, REST API, RTMP" },
      ],
      faqs: [
        { q: "Can the mascot be the avatar?", a: "Yes, we build a 3D avatar from the mascot design." },
        { q: "Are score updates live?", a: "With the official score feed connected, updates are generated as the score changes." },
        { q: "Can we keep using it after the event?", a: "Yes, the character belongs to the event and can be reused." },
      ],
    },
  },
};
