import type { CapabilityDetail } from "./types";

// KPI values are placeholders — TODO: verify before launch 【待替换】
export const EDUCATION: Record<string, CapabilityDetail> = {
  "edu-bullying": {
    zh: {
      overview: "校园霸凌往往发生在课间、走廊和监控无人盯看的角落。SightAI 在学校现有摄像头上运行姿态与时序动作模型，识别推搡、殴打、多人围堵和长时间纠缠，按严重度把告警推送给值班老师，并自动保存事件片段，让每一次干预都及时、有据。",
      benefits: [
        ["冲突在升级为伤害之前就被发现", "受欺负的学生不必自己开口求助"],
        ["告警直达手机，附 10 秒事件片段", "与家长沟通时有客观证据可依"],
        ["德育周报自动生成，掌握霸凌高发时段与区域", "满足主管部门对校园安全的检查要求"],
      ],
      features: [
        { title: "姿态 + 时序动作双模型", desc: "同时分析人体关键点和连续动作，区分打闹与真实冲突，降低误报。" },
        { title: "多人围堵与异常聚集", desc: "识别多人包围一人、长时间堵在角落等霸凌常见形态。" },
        { title: "分级告警与值班排班", desc: "按严重度分为提醒、警告、紧急三级，按排班推送给对应老师。" },
        { title: "事件片段自动留存", desc: "每次告警自动截取前后片段，默认保存 30 天，可导出用于复盘。" },
        { title: "人脸脱敏模式", desc: "画面中人脸默认模糊处理，只有授权人员在调查时可查看原始画面。" },
        { title: "德育处周报", desc: "按年级、区域、时段统计事件，帮助学校提前开展心理疏导。" },
      ],
      workflow: [
        { title: "接入现有摄像头", desc: "通过 RTSP / ONVIF / GB28181 接入教室、走廊、楼梯间摄像头，无需更换设备。" },
        { title: "实时识别", desc: "在校内边缘盒子或云端实时分析画面，逐秒输出冲突概率。" },
        { title: "分级推送", desc: "超过阈值即推送到值班老师手机和控制台，紧急事件可联动广播。" },
        { title: "处置与复盘", desc: "老师确认、处置并记录结果，系统沉淀事件档案与趋势报表。" },
      ],
      kpis: [
        { value: "< 60 s", label: "从冲突发生到老师收到告警" },
        { value: "90%+", label: "肢体冲突检出率（目标）" },
        { value: "30 天", label: "事件片段默认留存" },
      ],
      scenarios: [
        { title: "课间走廊与楼梯间", desc: "人流密集、老师难以兼顾的区域，自动识别推搡与围堵。" },
        { title: "宿舍区与晚自习", desc: "夜间值守人力少，告警按排班推送给宿管与值班老师。" },
        { title: "操场与校园角落", desc: "覆盖视线死角，及时发现隐蔽的欺凌行为。" },
      ],
      specs: [
        { label: "视频输入", value: "RTSP / ONVIF / GB28181，720p 及以上" },
        { label: "部署方式", value: "云端 / 校内私有化 / 边缘盒子" },
        { label: "告警时延", value: "< 3 s（边缘），< 60 s 端到端推送" },
        { label: "推送渠道", value: "控制台、短信、企业微信 / 钉钉、Webhook" },
        { label: "隐私", value: "人脸脱敏，数据可完全留存在校内" },
      ],
      faqs: [
        { q: "学生正常打闹会不会频繁误报？", a: "模型结合动作持续时间、力度和人数综合判断，并可按区域调整灵敏度；上线初期会根据学校反馈做一次校准。" },
        { q: "需要更换学校的摄像头吗？", a: "不需要。720p 及以上、能输出标准视频流的摄像头均可接入。" },
        { q: "视频会上传到外部吗？", a: "可选择校内私有化或边缘盒子部署，原始视频不出校园网络。" },
      ],
    },
    en: {
      overview: "Bullying tends to happen between classes, in corridors and in corners nobody is watching. SightAI runs pose and temporal action models on the cameras a school already has, detects pushing, hitting, cornering and prolonged harassment, routes graded alerts to the teacher on duty and keeps the clip — so every intervention is fast and backed by evidence.",
      benefits: [
        ["Conflicts are spotted before they turn into harm", "Victims don't have to ask for help themselves"],
        ["Alerts reach their phone with a 10-second clip", "Objective evidence for conversations with parents"],
        ["Automatic weekly pastoral reports show when and where bullying happens", "Meets regulator expectations for campus safety"],
      ],
      features: [
        { title: "Pose + temporal action models", desc: "Analyzes body keypoints and motion over time to tell play-fighting from real conflict." },
        { title: "Cornering & abnormal crowding", desc: "Recognizes groups surrounding one student or holding them in a corner." },
        { title: "Graded alerts & duty rota", desc: "Notice, warning and urgent levels, routed to whoever is on duty." },
        { title: "Automatic clip retention", desc: "Each alert saves the clip before and after, kept 30 days by default and exportable." },
        { title: "Face-blur mode", desc: "Faces are blurred by default; only authorized staff can view originals during an investigation." },
        { title: "Weekly pastoral report", desc: "Incidents by grade, zone and hour help schools plan early support." },
      ],
      workflow: [
        { title: "Connect existing cameras", desc: "RTSP / ONVIF / GB28181 from classrooms, corridors and stairwells — no new hardware." },
        { title: "Real-time analysis", desc: "On an on-campus edge box or in the cloud, scoring conflict probability every second." },
        { title: "Graded routing", desc: "Above threshold, alerts reach the duty teacher's phone and the console; urgent events can trigger PA." },
        { title: "Resolve & review", desc: "Teachers acknowledge, act and record the outcome; the system builds case files and trends." },
      ],
      kpis: [
        { value: "< 60 s", label: "from incident to teacher alert" },
        { value: "90%+", label: "physical conflict detection (target)" },
        { value: "30 days", label: "default clip retention" },
      ],
      scenarios: [
        { title: "Corridors & stairwells", desc: "Crowded spots teachers can't watch at once — pushing and cornering are flagged." },
        { title: "Dorms & evening study", desc: "Few staff at night; alerts follow the dorm and duty rota." },
        { title: "Playgrounds & corners", desc: "Covers blind spots where hidden bullying happens." },
      ],
      specs: [
        { label: "Video input", value: "RTSP / ONVIF / GB28181, 720p+" },
        { label: "Deployment", value: "Cloud / on-campus / edge appliance" },
        { label: "Alert latency", value: "< 3 s (edge), < 60 s end-to-end" },
        { label: "Channels", value: "Console, SMS, Teams / WeCom / DingTalk, webhook" },
        { label: "Privacy", value: "Face blurring; data can stay entirely on campus" },
      ],
      faqs: [
        { q: "Will normal horseplay cause false alarms?", a: "The model weighs duration, force and group size, and sensitivity can be tuned per zone; we calibrate once with the school after go-live." },
        { q: "Do we need new cameras?", a: "No. Any camera at 720p or above with a standard stream works." },
        { q: "Does video leave the school?", a: "With on-campus or edge deployment, raw video never leaves the school network." },
      ],
    },
  },

  "edu-behavior": {
    zh: {
      overview: "学生行为监测面向走廊、操场、校门口和食堂等公共区域，逐秒识别打架斗殴、跌倒、追逐打闹、攀爬栏杆和长时间滞留，把安全隐患从“事后调监控”变成“事中及时处置”。",
      benefits: [
        ["跌倒、受伤能第一时间得到救助", "危险的追逐打闹会被及时制止"],
        ["课间高峰的拥挤风险提前提醒", "不用再翻几个小时的录像找事件"],
        ["行为热力帮助优化值守与动线设计", "以数据评估安全管理措施的效果"],
      ],
      features: [
        { title: "打架斗殴逐秒识别", desc: "对每一秒画面输出行为类别与置信度，冲突开始即可告警。" },
        { title: "跌倒 / 奔跑 / 攀爬", desc: "覆盖楼梯跌倒、走廊奔跑、攀爬栏杆与围墙等常见风险行为。" },
        { title: "区域滞留时长", desc: "统计学生在天台、器材室等区域的停留时间，超时提醒。" },
        { title: "课间拥挤预警", desc: "楼梯口、走廊人员密度超过阈值时提前预警，防止踩踏。" },
        { title: "低分辨率适配", desc: "针对老旧的 320p / 480p 摄像头做了专门优化，利旧即可上线。" },
        { title: "移动端告警", desc: "告警推送到值班老师手机，一键查看现场片段与位置。" },
      ],
      workflow: [
        { title: "划定区域", desc: "在控制台为每路摄像头设置关注区域与行为类型。" },
        { title: "逐秒识别", desc: "模型对画面逐秒打分，输出行为类别与置信度。" },
        { title: "告警推送", desc: "超过阈值的行为按严重度推送给对应负责人。" },
        { title: "统计分析", desc: "按区域、时段汇总行为数据，生成安全热力与周报。" },
      ],
      kpis: [
        { value: "1 s", label: "行为识别粒度" },
        { value: "320p+", label: "最低支持分辨率" },
        { value: "-40%", label: "人工巡查时长（目标）" },
      ],
      scenarios: [
        { title: "校门口与上下学时段", desc: "人流集中、车辆混行，识别冲突与跌倒。" },
        { title: "操场与体育课", desc: "及时发现运动中的跌倒与受伤。" },
        { title: "食堂与公共区域", desc: "识别拥挤、推搡与长时间滞留。" },
      ],
      specs: [
        { label: "识别行为", value: "打架、跌倒、奔跑、攀爬、滞留、聚集" },
        { label: "视频输入", value: "RTSP / ONVIF / GB28181，320p 及以上" },
        { label: "部署方式", value: "云端 / 私有化 / 边缘盒子" },
        { label: "识别粒度", value: "逐秒输出类别与置信度" },
        { label: "接口", value: "REST API、Webhook 事件推送" },
      ],
      faqs: [
        { q: "和“校园霸凌预警”有什么区别？", a: "霸凌预警专注于欺凌形态（围堵、长时间纠缠等）；学生行为监测覆盖更广的安全行为，两者可叠加订阅。" },
        { q: "老旧摄像头画质很差能用吗？", a: "可以。模型专门针对低分辨率画面优化，320p 以上即可使用。" },
        { q: "可以只在特定时段启用吗？", a: "可以按摄像头设置布防时段，例如只在课间和放学时段启用。" },
      ],
    },
    en: {
      overview: "Student behavior monitoring covers corridors, playgrounds, school gates and canteens, flagging fights, falls, chasing, railing climbing and loitering second by second — turning “check the footage afterwards” into “act while it's happening”.",
      benefits: [
        ["Falls and injuries get help immediately", "Dangerous chasing is stopped in time"],
        ["Break-time crowding risks flagged in advance", "No more hours of scrubbing through recordings"],
        ["Behavior heatmaps inform duty coverage and layout", "Measure whether safety measures actually work"],
      ],
      features: [
        { title: "Second-by-second fight detection", desc: "Every second gets a behavior class and confidence, so alerts fire as a fight starts." },
        { title: "Falls / running / climbing", desc: "Stair falls, corridor running and climbing railings or walls." },
        { title: "Dwell time by zone", desc: "Tracks time spent on rooftops or in equipment rooms and alerts on overstays." },
        { title: "Break-time crowding", desc: "Warns when stairwell or corridor density passes a threshold, to prevent crushes." },
        { title: "Low-resolution ready", desc: "Optimized for older 320p / 480p cameras so existing hardware works." },
        { title: "Mobile alerts", desc: "Duty teachers get alerts on their phone with the clip and location." },
      ],
      workflow: [
        { title: "Define zones", desc: "Set areas and behavior types per camera in the console." },
        { title: "Score every second", desc: "The model outputs a behavior class and confidence each second." },
        { title: "Route alerts", desc: "Events above threshold go to the right person by severity." },
        { title: "Analyze", desc: "Behavior data rolls up by zone and hour into heatmaps and weekly reports." },
      ],
      kpis: [
        { value: "1 s", label: "detection granularity" },
        { value: "320p+", label: "minimum resolution" },
        { value: "-40%", label: "manual patrol time (target)" },
      ],
      scenarios: [
        { title: "School gates at drop-off", desc: "Dense crowds and traffic — conflicts and falls flagged." },
        { title: "Playgrounds & PE", desc: "Falls and injuries during sport spotted fast." },
        { title: "Canteens & shared spaces", desc: "Crowding, pushing and loitering detected." },
      ],
      specs: [
        { label: "Behaviors", value: "Fights, falls, running, climbing, loitering, crowding" },
        { label: "Video input", value: "RTSP / ONVIF / GB28181, 320p+" },
        { label: "Deployment", value: "Cloud / on-prem / edge appliance" },
        { label: "Granularity", value: "Class + confidence every second" },
        { label: "Interfaces", value: "REST API, webhook events" },
      ],
      faqs: [
        { q: "How is this different from Bullying Prevention?", a: "Bullying Prevention focuses on bullying patterns (cornering, prolonged harassment); behavior monitoring covers broader safety behaviors. They can be combined." },
        { q: "Our cameras are old and low quality — will it work?", a: "Yes. The model is tuned for low-resolution footage from 320p up." },
        { q: "Can it run only at certain times?", a: "Yes — set armed schedules per camera, e.g. breaks and dismissal only." },
      ],
    },
  },

  "edu-contraband": {
    zh: {
      overview: "违禁品安检在入校通道接入太赫兹或热成像安检门画面，自动识别身上隐藏的管制刀具、打火机和金属物品，学生无需停步、无需开包，高峰时段也能快速通过，可疑人员即时标记供安保复检。",
      benefits: [
        ["入校不排长队，不用当众开包", "隐私轮廓化显示，不暴露身体细节"],
        ["安保只需关注被标记的人员", "原始画面与识别画面双屏，判断更直观"],
        ["危险物品被挡在校门之外", "每次检出都有记录，可追溯可审计"],
      ],
      features: [
        { title: "太赫兹 / 热成像适配", desc: "支持主流被动式太赫兹与热成像安检设备的视频输出。" },
        { title: "刀具、打火机、金属物品", desc: "识别藏于衣物下的管制刀具、打火机、金属块等危险物品。" },
        { title: "不停步通行", desc: "边走边检，单通道每分钟可通过数十人。" },
        { title: "双屏对照", desc: "原始成像与识别结果并排显示，便于安保快速判断。" },
        { title: "复检流程", desc: "可疑人员自动截图、编号，引导至人工复检区并记录结果。" },
        { title: "隐私轮廓化", desc: "人体以轮廓或伪彩显示，不呈现身体细节。" },
      ],
      workflow: [
        { title: "接入安检设备", desc: "采集太赫兹或热成像安检门的视频输出。" },
        { title: "实时识别", desc: "逐帧检测人体区域内的异常物体轮廓。" },
        { title: "标记可疑", desc: "可疑人员高亮并推送给安保，现场声光提示。" },
        { title: "复检记录", desc: "人工复检后登记结果，形成可审计的安检档案。" },
      ],
      kpis: [
        { value: "30+ 人/分钟", label: "单通道通行能力（目标）" },
        { value: "0 停步", label: "学生无需停留开包" },
        { value: "100%", label: "检出事件留档" },
      ],
      scenarios: [
        { title: "校门早高峰", desc: "数千名学生集中入校，不停步快速安检。" },
        { title: "大型活动与考试", desc: "运动会、考试等场景的临时安检通道。" },
        { title: "宿舍楼与图书馆入口", desc: "重点区域的二次安检。" },
      ],
      specs: [
        { label: "适配设备", value: "被动式太赫兹、热成像安检门" },
        { label: "识别类别", value: "刀具、打火机、金属物品、隐藏物体" },
        { label: "部署方式", value: "边缘盒子（推荐）/ 私有化" },
        { label: "响应时延", value: "< 1 s" },
        { label: "隐私", value: "轮廓化 / 伪彩显示，不存储原始体表画面" },
      ],
      faqs: [
        { q: "需要购买新的安检门吗？", a: "如果学校已有太赫兹或热成像安检设备，可直接接入；没有的话我们可推荐兼容设备。" },
        { q: "会不会暴露学生的隐私？", a: "画面以轮廓或伪彩显示，不呈现身体细节，原始体表图像不做存储。" },
        { q: "检出可疑后怎么处理？", a: "系统自动截图编号并提示安保，引导到复检区人工确认，结果登记入档。" },
      ],
    },
    en: {
      overview: "Contraband screening connects to terahertz or thermal walk-through gates and flags concealed knives, lighters and metal objects. Students don't stop or open bags, peak-hour entry stays fast, and anyone flagged is marked for a secondary check.",
      benefits: [
        ["No queue and no public bag searches", "Privacy silhouettes reveal no body detail"],
        ["Security only needs to look at flagged people", "Raw and annotated views side by side"],
        ["Dangerous items stopped at the gate", "Every detection is recorded and auditable"],
      ],
      features: [
        { title: "Terahertz / thermal input", desc: "Works with video from mainstream passive terahertz and thermal screening gates." },
        { title: "Knives, lighters, metal", desc: "Detects knives, lighters and metal objects hidden under clothing." },
        { title: "Walk-through screening", desc: "Screen while walking — dozens of people per minute per lane." },
        { title: "Dual view", desc: "Raw imaging and detections shown side by side for quick judgement." },
        { title: "Secondary-check workflow", desc: "Flagged people are captured, numbered and guided to manual checks." },
        { title: "Privacy silhouettes", desc: "Bodies shown as outline or false color, never body detail." },
      ],
      workflow: [
        { title: "Connect the gate", desc: "Ingest video from the terahertz or thermal gate." },
        { title: "Detect in real time", desc: "Frame-by-frame detection of anomalous objects on the body." },
        { title: "Flag", desc: "Suspects are highlighted for security with an on-site light and sound cue." },
        { title: "Record", desc: "Manual check outcomes are logged into an auditable screening record." },
      ],
      kpis: [
        { value: "30+/min", label: "people per lane (target)" },
        { value: "0 stops", label: "no stopping or bag opening" },
        { value: "100%", label: "detections logged" },
      ],
      scenarios: [
        { title: "Morning gate rush", desc: "Thousands of students screened without stopping." },
        { title: "Events & exams", desc: "Temporary lanes for sports days and exams." },
        { title: "Dorm & library entrances", desc: "Secondary screening at sensitive areas." },
      ],
      specs: [
        { label: "Devices", value: "Passive terahertz, thermal screening gates" },
        { label: "Classes", value: "Knives, lighters, metal objects, concealed items" },
        { label: "Deployment", value: "Edge appliance (recommended) / on-prem" },
        { label: "Latency", value: "< 1 s" },
        { label: "Privacy", value: "Silhouette / false color; no raw body imagery stored" },
      ],
      faqs: [
        { q: "Do we need new gates?", a: "Existing terahertz or thermal gates can be connected directly; otherwise we can recommend compatible devices." },
        { q: "Does it expose students' privacy?", a: "Images are shown as outlines or false color and raw body imagery isn't stored." },
        { q: "What happens when someone is flagged?", a: "They're captured and numbered, security is alerted and guides them to a manual check, and the outcome is logged." },
      ],
    },
  },

  "edu-perimeter": {
    zh: {
      overview: "周界与危险区域为围墙、天台、配电房、水域等区域划设电子围栏，识别翻越、闯入、逗留和明火烟雾，夜间支持红外画面，并可联动广播与声光，让危险在发生前被阻止。",
      benefits: [
        ["靠近天台、水域等危险区域时被及时劝离", "校外人员翻墙闯入被第一时间发现"],
        ["不必夜间频繁巡逻，告警才出动", "火情、烟雾在初期就被发现"],
        ["周界安防 7×24 无死角", "分时段布防，兼顾日常活动与夜间安全"],
      ],
      features: [
        { title: "自定义电子围栏", desc: "在画面中绘制任意多边形区域，设置进入、越线、逗留规则。" },
        { title: "翻墙 / 攀爬识别", desc: "识别翻越围墙、攀爬栏杆与外墙等行为。" },
        { title: "明火与烟雾", desc: "识别早期火焰与烟雾，配合消防联动。" },
        { title: "夜间红外适配", desc: "在红外黑白画面中同样保持识别效果。" },
        { title: "联动广播与声光", desc: "触发后现场自动播放语音劝离，开启声光报警。" },
        { title: "分时段布防", desc: "按工作日、节假日和时段设置不同的布防策略。" },
      ],
      workflow: [
        { title: "绘制围栏", desc: "在控制台为摄像头绘制危险区域与越线规则。" },
        { title: "持续监测", desc: "全天候识别人员进入、越线、攀爬与烟火。" },
        { title: "现场联动", desc: "触发语音劝离与声光报警，同时推送安保。" },
        { title: "事件归档", desc: "记录事件片段与处置结果，生成周界安全报告。" },
      ],
      kpis: [
        { value: "24/7", label: "全天候值守" },
        { value: "< 5 s", label: "越界到现场联动" },
        { value: "-60%", label: "夜间巡逻频次（目标）" },
      ],
      scenarios: [
        { title: "围墙与校门周界", desc: "防止校外人员翻墙闯入。" },
        { title: "天台、水域、配电房", desc: "学生进入危险区域时现场劝离。" },
        { title: "实验室与仓库", desc: "明火、烟雾早期发现。" },
      ],
      specs: [
        { label: "识别事件", value: "区域闯入、越线、攀爬、逗留、烟火" },
        { label: "视频输入", value: "可见光 / 红外摄像头，720p 及以上" },
        { label: "联动", value: "IP 广播、声光报警器、门禁" },
        { label: "部署方式", value: "云端 / 私有化 / 边缘盒子" },
        { label: "接口", value: "REST API、Webhook、GB28181 报警上报" },
      ],
      faqs: [
        { q: "小动物或树影会触发误报吗？", a: "模型只对人体和烟火响应，并可设置最小目标尺寸与持续时间，过滤动物与光影变化。" },
        { q: "能联动学校已有的广播系统吗？", a: "支持主流 IP 广播与声光报警器，也可通过 Webhook 对接自有系统。" },
        { q: "白天师生正常经过会不会报警？", a: "可设置分时段布防，例如只在夜间和节假日启用。" },
      ],
    },
    en: {
      overview: "Perimeter & danger zones draws virtual fences around walls, rooftops, plant rooms and water, detects climbing, intrusion, lingering and fire or smoke — including on night-time IR — and can trigger speakers and strobes so danger is stopped before it happens.",
      benefits: [
        ["Students near rooftops or water are warned away in time", "Outsiders climbing in are spotted immediately"],
        ["No frequent night patrols — respond only on alerts", "Fire and smoke caught early"],
        ["24/7 perimeter coverage with no blind spots", "Schedules balance daytime activity and night security"],
      ],
      features: [
        { title: "Custom virtual fences", desc: "Draw any polygon and set enter, cross-line and loiter rules." },
        { title: "Wall climbing", desc: "Detects climbing walls, railings and facades." },
        { title: "Fire & smoke", desc: "Early flame and smoke detection with fire-system linkage." },
        { title: "Night IR", desc: "Keeps working on monochrome infrared footage." },
        { title: "Speaker & strobe linkage", desc: "Plays a voice warning and triggers lights and sirens on site." },
        { title: "Scheduled arming", desc: "Different rules for weekdays, holidays and times of day." },
      ],
      workflow: [
        { title: "Draw fences", desc: "Define danger zones and cross-line rules per camera." },
        { title: "Monitor continuously", desc: "Around the clock: entry, crossing, climbing, fire and smoke." },
        { title: "Act on site", desc: "Voice warning and strobe, plus an alert to security." },
        { title: "Archive", desc: "Clips and outcomes recorded into a perimeter safety report." },
      ],
      kpis: [
        { value: "24/7", label: "continuous coverage" },
        { value: "< 5 s", label: "breach to on-site response" },
        { value: "-60%", label: "night patrols (target)" },
      ],
      scenarios: [
        { title: "Walls & gates", desc: "Stop outsiders climbing in." },
        { title: "Rooftops, water, plant rooms", desc: "Warn students away on site." },
        { title: "Labs & storage", desc: "Catch fire and smoke early." },
      ],
      specs: [
        { label: "Events", value: "Intrusion, line crossing, climbing, loitering, fire/smoke" },
        { label: "Video input", value: "Visible / IR cameras, 720p+" },
        { label: "Linkage", value: "IP PA, strobes, access control" },
        { label: "Deployment", value: "Cloud / on-prem / edge appliance" },
        { label: "Interfaces", value: "REST API, webhooks, GB28181 alarms" },
      ],
      faqs: [
        { q: "Will animals or tree shadows trigger it?", a: "It only responds to people and fire/smoke, with minimum size and duration filters for animals and lighting changes." },
        { q: "Can it use our existing PA system?", a: "Mainstream IP PA and strobes are supported, or connect your own via webhook." },
        { q: "Will people walking by in the day trigger alarms?", a: "Use scheduled arming, e.g. nights and holidays only." },
      ],
    },
  },
};
