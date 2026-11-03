import type { CapabilityDetail } from "./types";

// KPI values are placeholders — TODO: verify before launch 【待替换】
export const MANUFACTURING: Record<string, CapabilityDetail> = {
  "mfg-defect": {
    zh: {
      overview: "外观缺陷检测在产线上对瓶体、包装、金属件等工件做划痕、凹坑、污渍、液位、瓶盖、标签等缺陷判定，小样本即可训练，单件判定毫秒级完成，NG 信号直连 PLC 剔除，质量数据自动回写 MES。",
      benefits: [
        ["不再长时间盯看高速产线", "只需复核 AI 拿不准的少量样本"],
        ["漏检率稳定，不随班次波动", "缺陷帕累托实时可见，快速定位根因"],
        ["出厂一致性更高，客诉与召回更少", "每批次都有可追溯的检测记录"],
      ],
      features: [
        { title: "小样本训练", desc: "每类缺陷 50 张左右样本即可上线，换型当天完成。" },
        { title: "划痕 / 凹坑 / 污渍", desc: "识别细微表面缺陷，支持反光与曲面工件。" },
        { title: "液位、瓶盖、标签", desc: "灌装与包装线的液位、旋盖、贴标质量检测。" },
        { title: "PLC 剔除联动", desc: "NG 信号毫秒级输出到 PLC，驱动剔除机构。" },
        { title: "MES 数据回写", desc: "检测结果与图片按批次、工位回写 MES。" },
        { title: "良率与缺陷帕累托", desc: "实时良率曲线与缺陷类型占比，支持按班次对比。" },
      ],
      workflow: [
        { title: "工位采集", desc: "工业相机 + 光源在工位采集每个工件图像。" },
        { title: "边缘推理", desc: "边缘工控机上毫秒级完成缺陷判定。" },
        { title: "剔除与记录", desc: "NG 信号联动 PLC 剔除，结果回写 MES。" },
        { title: "持续优化", desc: "复核样本回流训练，模型精度持续提升。" },
      ],
      kpis: [
        { value: "< 30 ms", label: "单件判定（边缘）" },
        { value: "99%+", label: "缺陷检出率（目标）" },
        { value: "~50 张", label: "每类缺陷所需样本" },
      ],
      scenarios: [
        { title: "饮料与日化灌装线", desc: "瓶体、液位、瓶盖与标签检测。" },
        { title: "包装与印刷", desc: "破损、污渍、印刷错误检测。" },
        { title: "金属与注塑件", desc: "划痕、凹坑、缺料与飞边检测。" },
      ],
      specs: [
        { label: "相机", value: "工业面阵 / 线阵相机，支持 GigE / USB3" },
        { label: "判定时延", value: "< 30 ms / 件（边缘）" },
        { label: "部署", value: "产线边缘工控机 / 私有化" },
        { label: "集成", value: "PLC（Modbus / Profinet）、MES（API）" },
        { label: "训练", value: "小样本训练，控制台内完成标注与发布" },
      ],
      faqs: [
        { q: "缺陷样本很少怎么办？", a: "小样本训练每类约 50 张即可，配合合成数据进一步扩充。" },
        { q: "能跟上高速产线吗？", a: "边缘推理单件 < 30 ms，可满足大多数高速灌装与包装线。" },
        { q: "需要更换现有相机吗？", a: "已有工业相机可直接接入；新产线我们可协助选型相机与光源。" },
      ],
    },
    en: {
      overview: "Surface defect detection inspects bottles, packaging and metal parts on the line for scratches, dents, stains, fill level, caps and labels. It trains from small sample sets, delivers a verdict per part in milliseconds, sends NG signals straight to the PLC and writes quality data back to MES.",
      benefits: [
        ["No more staring at fast lines for hours", "Only the few uncertain cases need human review"],
        ["Stable miss rate regardless of shift", "Live defect Pareto to find root causes fast"],
        ["More consistent output, fewer complaints and recalls", "Traceable inspection records per batch"],
      ],
      features: [
        { title: "Few-shot training", desc: "About 50 samples per defect type — live on changeover day." },
        { title: "Scratch / dent / stain", desc: "Fine surface defects, including reflective and curved parts." },
        { title: "Fill level, caps, labels", desc: "Filling and packaging line quality checks." },
        { title: "PLC rejection", desc: "NG signals in milliseconds to drive the rejector." },
        { title: "MES write-back", desc: "Results and images per batch and station into MES." },
        { title: "Yield & Pareto", desc: "Live yield and defect mix, compared by shift." },
      ],
      workflow: [
        { title: "Capture at station", desc: "Industrial camera and lighting image every part." },
        { title: "Edge inference", desc: "Verdict in milliseconds on an edge IPC." },
        { title: "Reject & record", desc: "PLC rejects NG parts; results go to MES." },
        { title: "Improve", desc: "Reviewed samples flow back into training." },
      ],
      kpis: [
        { value: "< 30 ms", label: "per-part verdict (edge)" },
        { value: "99%+", label: "detection rate (target)" },
        { value: "~50", label: "samples per defect type" },
      ],
      scenarios: [
        { title: "Beverage & personal-care filling", desc: "Bottles, fill level, caps and labels." },
        { title: "Packaging & print", desc: "Damage, stains and print errors." },
        { title: "Metal & molded parts", desc: "Scratches, dents, short shots and flash." },
      ],
      specs: [
        { label: "Cameras", value: "Industrial area / line scan, GigE / USB3" },
        { label: "Latency", value: "< 30 ms per part (edge)" },
        { label: "Deployment", value: "Line-side edge IPC / on-prem" },
        { label: "Integration", value: "PLC (Modbus / Profinet), MES (API)" },
        { label: "Training", value: "Few-shot, labeled and released in the console" },
      ],
      faqs: [
        { q: "What if we have few defect samples?", a: "About 50 per type is enough, extended with synthetic data." },
        { q: "Can it keep up with high-speed lines?", a: "Under 30 ms per part at the edge suits most filling and packaging lines." },
        { q: "Do we need new cameras?", a: "Existing industrial cameras connect directly; we can help spec cameras and lighting for new lines." },
      ],
    },
  },

  "mfg-road": {
    zh: {
      overview: "道路病害巡检让普通车辆加装相机即成为巡检车，以正常车速采集路面，自动识别裂缝、坑槽、车辙、修补与标线磨损，测量深度并分级，结合 GPS 落到 GIS 地图，自动生成巡检报告，把人工步行巡检变成每周甚至每天的数字化巡检。",
      benefits: [
        ["从步行巡检变成车载巡检，更安全", "报告自动生成，不再手工整理照片"],
        ["巡检频次提升，病害早发现早修复", "养护资金投向最需要的路段"],
        ["道路更平整，行车更安全", "坑槽导致的事故与车辆损坏减少"],
      ],
      features: [
        { title: "车载 80 km/h 采集", desc: "以正常车速采集，不影响交通，无需封路。" },
        { title: "裂缝 / 坑槽 / 车辙", desc: "识别多类路面病害，以及修补与标线磨损。" },
        { title: "深度测量与分级", desc: "估算病害面积与深度，按轻 / 中 / 重分级。" },
        { title: "GIS 地图落点", desc: "每个病害附 GPS 坐标与截图，在地图上分层查看。" },
        { title: "自动巡检报告", desc: "按路段生成病害统计与养护建议报告。" },
        { title: "历史对比", desc: "对比多次巡检结果，追踪病害发展趋势。" },
      ],
      workflow: [
        { title: "车载采集", desc: "车辆加装相机与 GPS，按计划路线行驶采集。" },
        { title: "自动识别", desc: "上传后自动识别病害、测量与分级。" },
        { title: "地图落点", desc: "病害按坐标落到 GIS，支持筛选与导出。" },
        { title: "报告与派单", desc: "生成巡检报告，派发养护工单并跟踪修复。" },
      ],
      kpis: [
        { value: "80 km/h", label: "采集车速" },
        { value: "3 级", label: "病害严重度分级" },
        { value: "10×", label: "巡检效率提升（目标）" },
      ],
      scenarios: [
        { title: "城市道路养护", desc: "每周巡检主干道与次干道。" },
        { title: "高速公路与国省道", desc: "长距离路网的定期病害普查。" },
        { title: "园区与机场道路", desc: "封闭区域内的日常巡检。" },
      ],
      specs: [
        { label: "采集设备", value: "车载相机（1080p+）+ GNSS" },
        { label: "识别类别", value: "裂缝、坑槽、车辙、修补、标线磨损" },
        { label: "输出", value: "GIS 图层（GeoJSON / Shapefile）、PDF / Excel 报告" },
        { label: "部署", value: "云端处理 / 私有化" },
        { label: "计费", value: "按车载摄像头路数计费" },
      ],
      faqs: [
        { q: "需要专业检测车吗？", a: "不需要，普通车辆加装相机与 GPS 即可。" },
        { q: "可以导入我们的 GIS 系统吗？", a: "支持导出 GeoJSON、Shapefile，或通过 API 推送。" },
        { q: "夜间或雨天能采集吗？", a: "建议白天干燥路面采集以保证精度，夜间需补光。" },
      ],
    },
    en: {
      overview: "Road defect inspection turns any vehicle with a camera into a survey unit. It captures at normal driving speed, detects cracks, potholes, rutting, patches and worn markings, measures and grades depth, maps each defect in GIS with GPS and generates the survey report — turning walking surveys into weekly or even daily digital ones.",
      benefits: [
        ["Survey from a vehicle instead of on foot — safer", "Reports generated automatically, no sorting photos"],
        ["More frequent surveys catch defects early", "Maintenance money goes where it's needed most"],
        ["Smoother, safer roads", "Fewer pothole accidents and vehicle damage"],
      ],
      features: [
        { title: "80 km/h capture", desc: "Normal driving speed, no lane closures." },
        { title: "Crack / pothole / rutting", desc: "Multiple defect classes plus patches and worn markings." },
        { title: "Depth & grading", desc: "Estimates area and depth, graded light / medium / severe." },
        { title: "GIS mapping", desc: "Every defect with GPS and snapshot, layered on a map." },
        { title: "Auto reports", desc: "Defect statistics and maintenance advice per section." },
        { title: "Historical comparison", desc: "Track how defects develop across surveys." },
      ],
      workflow: [
        { title: "Drive & capture", desc: "Camera and GPS on a vehicle along planned routes." },
        { title: "Detect", desc: "Upload; defects are detected, measured and graded." },
        { title: "Map", desc: "Defects placed in GIS for filtering and export." },
        { title: "Report & dispatch", desc: "Reports and maintenance work orders, tracked to repair." },
      ],
      kpis: [
        { value: "80 km/h", label: "capture speed" },
        { value: "3", label: "severity grades" },
        { value: "10×", label: "survey efficiency (target)" },
      ],
      scenarios: [
        { title: "City road maintenance", desc: "Weekly surveys of arterial and secondary roads." },
        { title: "Highways & national roads", desc: "Regular network-wide defect surveys." },
        { title: "Campuses & airports", desc: "Routine inspection on private roads." },
      ],
      specs: [
        { label: "Capture", value: "Vehicle camera (1080p+) + GNSS" },
        { label: "Classes", value: "Cracks, potholes, rutting, patches, worn markings" },
        { label: "Output", value: "GIS layers (GeoJSON / Shapefile), PDF / Excel reports" },
        { label: "Deployment", value: "Cloud / on-prem" },
        { label: "Billing", value: "Per vehicle camera" },
      ],
      faqs: [
        { q: "Do we need a specialist survey vehicle?", a: "No — any vehicle with a camera and GPS." },
        { q: "Can results go into our GIS?", a: "Export GeoJSON or Shapefile, or push via API." },
        { q: "Night or rain?", a: "Daytime on dry roads gives the best accuracy; night needs extra lighting." },
      ],
    },
  },

  "mfg-ppe": {
    zh: {
      overview: "安全生产行为在车间、仓库和厂区识别未戴安全帽、未穿反光衣、闯入危险区域、吸烟和人员跌倒等行为，实时提醒并生成 EHS 工单，把安全管理从“人盯人”变成“系统盯、人处置”。",
      benefits: [
        ["违规行为被及时提醒，事故风险更低", "跌倒等意外第一时间获得救援"],
        ["EHS 巡查从全天盯看变成按告警处置", "事件有片段有工单，闭环可追溯"],
        ["班组安全数据透明，便于考核改进", "满足安全生产检查与审计要求"],
      ],
      features: [
        { title: "安全帽 / 反光衣", desc: "识别未佩戴或未正确佩戴防护装备的人员。" },
        { title: "危险区域闯入", desc: "为机械臂、行车下方等区域设置电子围栏。" },
        { title: "吸烟与明火", desc: "识别厂区吸烟与明火，防范火灾风险。" },
        { title: "人员跌倒", desc: "识别跌倒与长时间倒地不起，立即告警。" },
        { title: "EHS 闭环工单", desc: "告警自动生成工单，指派、整改、复核全流程记录。" },
        { title: "班组安全排行", desc: "按班组、区域统计违规次数与整改时效。" },
      ],
      workflow: [
        { title: "接入厂区摄像头", desc: "接入车间、仓库与厂区现有摄像头。" },
        { title: "规则配置", desc: "按区域配置需佩戴的防护装备与禁入区域。" },
        { title: "实时告警", desc: "违规即时推送，可联动现场广播提醒。" },
        { title: "工单闭环", desc: "EHS 人员整改复核，数据进入安全报表。" },
      ],
      kpis: [
        { value: "< 3 s", label: "违规识别到告警" },
        { value: "24/7", label: "全天候值守" },
        { value: "-50%", label: "违规行为发生率（目标）" },
      ],
      scenarios: [
        { title: "生产车间", desc: "防护装备与机械危险区域管理。" },
        { title: "仓储物流", desc: "叉车作业区闯入与人员跌倒。" },
        { title: "化工与能源厂区", desc: "吸烟、明火与危险区域管控。" },
      ],
      specs: [
        { label: "识别事件", value: "未戴安全帽、未穿反光衣、区域闯入、吸烟、跌倒" },
        { label: "视频输入", value: "RTSP / ONVIF / GB28181，720p 及以上" },
        { label: "部署", value: "厂区边缘盒子 / 私有化 / 云端" },
        { label: "联动", value: "IP 广播、声光报警、EHS 系统" },
        { label: "接口", value: "REST API、Webhook" },
      ],
      faqs: [
        { q: "能识别不同颜色的安全帽吗？", a: "可以，并可按颜色区分工种或访客。" },
        { q: "能对接我们的 EHS 系统吗？", a: "可以，通过 Webhook / API 把事件与工单同步到现有系统。" },
        { q: "光线很暗的仓库能用吗？", a: "支持低照度与红外画面，建议关键区域保证基本照明。" },
      ],
    },
    en: {
      overview: "Safety compliance detects missing helmets and vests, danger-zone intrusion, smoking and falls across workshops, warehouses and yards, alerts in real time and opens EHS work orders — from “people watching people” to “the system watches, people act”.",
      benefits: [
        ["Violations are flagged in time, lowering accident risk", "Falls get help immediately"],
        ["EHS patrols respond to alerts instead of watching all day", "Every event has a clip and a work order"],
        ["Transparent safety data by team", "Meets safety inspection and audit requirements"],
      ],
      features: [
        { title: "Helmet / vest", desc: "People without, or wrongly wearing, PPE." },
        { title: "Danger-zone intrusion", desc: "Virtual fences around robot cells and under cranes." },
        { title: "Smoking & open flame", desc: "Smoking and flames on site, to prevent fires." },
        { title: "Person down", desc: "Falls and people lying still trigger instant alerts." },
        { title: "EHS work orders", desc: "Alerts open tickets: assign, fix and verify, all recorded." },
        { title: "Team safety ranking", desc: "Violations and fix times by team and zone." },
      ],
      workflow: [
        { title: "Connect site cameras", desc: "Existing cameras in workshops, warehouses and yards." },
        { title: "Configure rules", desc: "Required PPE and no-go zones per area." },
        { title: "Alert live", desc: "Violations pushed instantly, optionally with PA warnings." },
        { title: "Close the loop", desc: "EHS fixes and verifies; data rolls into safety reports." },
      ],
      kpis: [
        { value: "< 3 s", label: "violation to alert" },
        { value: "24/7", label: "continuous coverage" },
        { value: "-50%", label: "violation rate (target)" },
      ],
      scenarios: [
        { title: "Production floors", desc: "PPE and machine danger zones." },
        { title: "Warehousing & logistics", desc: "Forklift zone intrusion and falls." },
        { title: "Chemical & energy sites", desc: "Smoking, flames and restricted areas." },
      ],
      specs: [
        { label: "Events", value: "No helmet, no vest, intrusion, smoking, falls" },
        { label: "Video input", value: "RTSP / ONVIF / GB28181, 720p+" },
        { label: "Deployment", value: "Site edge box / on-prem / cloud" },
        { label: "Linkage", value: "IP PA, strobes, EHS systems" },
        { label: "Interfaces", value: "REST API, webhooks" },
      ],
      faqs: [
        { q: "Can it tell helmet colors apart?", a: "Yes, and colors can distinguish trades or visitors." },
        { q: "Can it feed our EHS system?", a: "Yes, events and tickets sync via webhook / API." },
        { q: "Does it work in dim warehouses?", a: "Low-light and IR are supported; keep basic lighting in key zones." },
      ],
    },
  },

  "mfg-assembly": {
    zh: {
      overview: "装配完整性核验对 PCB、线束、汽车零部件等装配环节做漏装、错装、反装与螺丝缺失核验，并按工序比对作业顺序，在工位上就把不良拦下，防止流入下道工序和客户手中。",
      benefits: [
        ["工位即时提示漏装错装，返工更少", "新员工上手更快，不怕记错工序"],
        ["不良在工位拦截，下道工序与终检压力更小", "每一件都可追溯到工位与班次"],
        ["交付产品装配一致性更高", "减少因装配问题导致的客诉与召回"],
      ],
      features: [
        { title: "漏装 / 错装 / 反装", desc: "比对标准装配图，识别缺件、错件与方向错误。" },
        { title: "螺丝与卡扣缺失", desc: "识别螺丝未打、卡扣未扣到位等细节问题。" },
        { title: "工序顺序比对", desc: "识别操作动作，核对是否按标准作业顺序完成。" },
        { title: "多型号快速换型", desc: "上传新型号标准图即可切换，无需重新部署。" },
        { title: "追溯到工位与班次", desc: "每件产品的检测结果与图片按序列号存档。" },
        { title: "PLC / MES 对接", desc: "NG 时锁定工位或流转至返修，结果回写 MES。" },
      ],
      workflow: [
        { title: "工位采集", desc: "在装配工位上方安装相机，采集装配结果与动作。" },
        { title: "比对标准", desc: "与该型号标准装配图和作业顺序逐项比对。" },
        { title: "即时提示", desc: "发现问题在工位屏幕提示，NG 联动 PLC。" },
        { title: "追溯分析", desc: "按序列号存档，统计不良类型与工位分布。" },
      ],
      kpis: [
        { value: "< 100 ms", label: "单次核验（边缘）" },
        { value: "99%+", label: "漏装错装检出率（目标）" },
        { value: "分钟级", label: "新型号换型" },
      ],
      scenarios: [
        { title: "PCB 插件与组装", desc: "元件漏插、反插与焊接前核验。" },
        { title: "汽车零部件", desc: "线束、卡扣、螺栓装配核验。" },
        { title: "家电与 3C 组装", desc: "多型号混线的装配完整性检查。" },
      ],
      specs: [
        { label: "识别内容", value: "漏装、错装、反装、螺丝 / 卡扣缺失、工序顺序" },
        { label: "相机", value: "工位上方工业相机或高清网络摄像头" },
        { label: "部署", value: "产线边缘工控机 / 私有化" },
        { label: "集成", value: "PLC、MES、工位终端" },
        { label: "换型", value: "上传标准图即可切换型号" },
      ],
      faqs: [
        { q: "型号很多怎么办？", a: "每个型号上传标准装配图即可，支持扫码自动切换型号。" },
        { q: "能识别操作顺序是否正确吗？", a: "可以，基于动作识别比对标准作业顺序。" },
        { q: "和外观缺陷检测有什么区别？", a: "外观缺陷关注表面质量；装配核验关注零件是否齐全、正确、到位，两者可组合使用。" },
      ],
    },
    en: {
      overview: "Assembly verification checks PCB, harness and automotive assemblies for missing, wrong or reversed parts and absent screws, and compares the work sequence against the standard — stopping defects at the station before they reach the next step or the customer.",
      benefits: [
        ["Instant prompts at the station mean less rework", "New operators ramp up faster without memorizing steps"],
        ["Defects stopped at the station, less load on final QC", "Every unit traceable to station and shift"],
        ["More consistent assemblies delivered", "Fewer complaints and recalls from assembly faults"],
      ],
      features: [
        { title: "Missing / wrong / reversed", desc: "Compares to the reference assembly for missing parts, wrong parts and orientation." },
        { title: "Screws & clips", desc: "Missing screws and clips not fully seated." },
        { title: "Step-sequence check", desc: "Recognizes operator actions and checks the standard sequence." },
        { title: "Fast changeover", desc: "Upload a new model's reference image — no redeploy." },
        { title: "Traceability", desc: "Results and images archived by serial number." },
        { title: "PLC / MES integration", desc: "Lock the station or route to rework on NG; results to MES." },
      ],
      workflow: [
        { title: "Capture at station", desc: "Overhead camera records the assembly and actions." },
        { title: "Compare to standard", desc: "Checked item by item against the model's reference and sequence." },
        { title: "Prompt instantly", desc: "Issues shown on the station screen; NG signals the PLC." },
        { title: "Trace & analyze", desc: "Archived by serial; defect types and stations analyzed." },
      ],
      kpis: [
        { value: "< 100 ms", label: "per check (edge)" },
        { value: "99%+", label: "missing/wrong part detection (target)" },
        { value: "minutes", label: "new model changeover" },
      ],
      scenarios: [
        { title: "PCB insertion & assembly", desc: "Missing or reversed components before soldering." },
        { title: "Automotive parts", desc: "Harnesses, clips and bolts." },
        { title: "Appliance & electronics", desc: "Mixed-model assembly completeness." },
      ],
      specs: [
        { label: "Checks", value: "Missing, wrong, reversed parts; screws / clips; sequence" },
        { label: "Cameras", value: "Overhead industrial or HD network camera" },
        { label: "Deployment", value: "Line-side edge IPC / on-prem" },
        { label: "Integration", value: "PLC, MES, station terminals" },
        { label: "Changeover", value: "Upload a reference image to switch models" },
      ],
      faqs: [
        { q: "We have many models — is that a problem?", a: "Upload a reference per model; barcode scans can switch models automatically." },
        { q: "Can it check the operation sequence?", a: "Yes, action recognition compares against the standard sequence." },
        { q: "How does it differ from surface defect detection?", a: "Surface detection checks finish quality; assembly verification checks parts are present, correct and seated. They combine well." },
      ],
    },
  },
};
