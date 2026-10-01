import { FileText, MapPin, Ruler, ScanSearch, Gauge, Truck } from "lucide-react";
import type { ProductData } from "./types";

// Numeric values (latency, depth thresholds, accuracy) live in content/metrics.ts.
export const roadInspection: ProductData = {
  slug: "road-inspection",
  line: "inspection",
  demo: "road-map",
  capabilityIcons: [ScanSearch, Ruler, Gauge, MapPin, FileText, Truck],
  relatedCases: ["lower-austria"],
  zh: {
    valueProp: "车载巡检，病害自动成报告",
    intro:
      "普通车辆加装相机即可正常车速采集路面影像，系统自动识别裂缝、坑槽、车辙等病害，测量深度并分级，叠加 GIS 定位后生成可直接用于养护决策的巡检报告。",
    metricLabels: { classes: "病害类别", speed: "采集车速", depth: "深度测量精度" },
    pains: [
      { before: "人工步行巡查，覆盖慢、频次低", after: "车载采集，正常车速完成全路网覆盖" },
      { before: "病害判断依赖个人经验，标准不一", after: "统一模型与分级标准，结果可复核" },
      { before: "纸质记录，位置描述模糊", after: "每处病害带 GPS 坐标与原始截图" },
      { before: "报告整理耗时数天", after: "采集结束即自动生成巡检报告" },
    ],
    capabilities: [
      { title: "多类病害识别", desc: "裂缝（横向、纵向、龟裂）、坑槽、车辙、修补、标线磨损等。" },
      { title: "深度测量", desc: "基于单目深度估计与车辆姿态补偿，输出坑槽、车辙深度（mm）。" },
      { title: "严重度分级", desc: "按面积、深度与位置自动分为轻、中、重三级，阈值可按地方标准配置。" },
      { title: "GIS 定位", desc: "GNSS + 里程推算，病害落图到路段与桩号，支持导出 GeoJSON / Shapefile。" },
      { title: "自动巡检报告", desc: "按路段汇总病害数量、面积与等级，一键导出 PDF / Excel。" },
      { title: "普通车辆即可采集", desc: "车顶或挡风玻璃安装工业相机，无需专用检测车。" },
    ],
    steps: [
      { title: "采集", desc: "车载相机 + GNSS 以正常车速采集路面视频" },
      { title: "预处理", desc: "去畸变、曝光均衡、按里程抽帧" },
      { title: "推理", desc: "病害检测、分割与深度估计" },
      { title: "后处理", desc: "跨帧去重、面积计算、严重度分级" },
      { title: "输出 / 集成", desc: "地图、报告与养护工单系统对接" },
    ],
    specs: [
      { label: "输入格式", cloud: "MP4 / H.264 / H.265 视频 + GNSS 轨迹", edge: "RTSP / USB3 工业相机实时流" },
      { label: "支持分辨率", cloud: "最高 4K", edge: "1080p – 4K" },
      { label: "推理速度", cloud: "{latencyCloud}", edge: "{latencyEdge}" },
      { label: "硬件要求", cloud: "无（SaaS）", edge: "车载边缘盒子（GPU ≥ 20 TOPS）" },
      { label: "部署方式", cloud: "公有云 / 专有云", edge: "车载边缘 + 私有化后台" },
      { label: "接口", cloud: "REST / gRPC / SDK", edge: "REST / SDK / 本地文件同步" },
      { label: "输出格式", cloud: "JSON、GeoJSON、PDF、Excel", edge: "JSON、GeoJSON（断网缓存续传）" },
    ],
    scenarios: [
      { title: "城市道路日常巡检", desc: "市政养护部门按周巡检主次干道，病害直接派单。" },
      { title: "公路网年度普查", desc: "省级路网年度路况评定，输出路段级统计。" },
      { title: "养护效果复核", desc: "修补前后对比，验证施工质量与工程量。" },
    ],
    faqs: [
      { q: "需要专门的检测车吗？", a: "不需要。普通巡逻车或公务车加装相机与边缘盒子即可，安装约半天。" },
      { q: "车速多快仍能保证识别效果？", a: "常规路况下按正常巡逻车速采集即可，具体上限取决于相机帧率与曝光设置，PoC 阶段会给出实测数据。" },
      { q: "深度测量依据什么？", a: "基于单目深度估计结合车辆姿态补偿，用于养护分级参考；需要计量级精度时可选配激光测距模块。" },
      { q: "严重度分级标准能否按地方规范调整？", a: "可以。面积、深度阈值与等级名称均可配置，以适配不同国家和地区的养护规范。" },
      { q: "数据能否不出本地？", a: "支持私有化部署，影像与结果全部保存在客户机房或专有云。" },
    ],
  },
  en: {
    valueProp: "Drive the network. Get the defect report.",
    intro:
      "Mount a camera on any patrol vehicle and survey at normal traffic speed. SightAI finds cracks, potholes and rutting, measures their depth, grades severity and pins every defect to the map — producing a report your maintenance team can act on.",
    metricLabels: { classes: "Defect classes", speed: "Survey speed", depth: "Depth accuracy" },
    pains: [
      { before: "Walking surveys cover little ground, rarely", after: "Vehicle surveys cover the full network at traffic speed" },
      { before: "Ratings depend on who inspected", after: "One model, one grading standard, fully auditable" },
      { before: "Paper notes and vague locations", after: "Every defect has GPS coordinates and an image" },
      { before: "Days to compile a report", after: "Report ready when the drive ends" },
    ],
    capabilities: [
      { title: "Multi-class detection", desc: "Longitudinal, transverse and alligator cracks, potholes, rutting, patches, worn markings." },
      { title: "Depth measurement", desc: "Monocular depth with vehicle-pose compensation outputs pothole and rut depth in mm." },
      { title: "Severity grading", desc: "Low / medium / high from area, depth and position. Thresholds follow your local standard." },
      { title: "GIS positioning", desc: "GNSS plus odometry places defects on segments and chainage. Export GeoJSON or Shapefile." },
      { title: "Automatic reports", desc: "Per-segment counts, areas and grades. One-click PDF or Excel." },
      { title: "Any vehicle", desc: "Roof or windshield-mounted industrial camera. No dedicated survey truck." },
    ],
    steps: [
      { title: "Capture", desc: "Vehicle camera + GNSS at traffic speed" },
      { title: "Pre-process", desc: "Undistort, balance exposure, sample by distance" },
      { title: "Inference", desc: "Detection, segmentation and depth" },
      { title: "Post-process", desc: "Cross-frame dedupe, area, severity" },
      { title: "Output", desc: "Map, report and work-order integration" },
    ],
    specs: [
      { label: "Input", cloud: "MP4 / H.264 / H.265 video + GNSS track", edge: "RTSP / USB3 industrial camera stream" },
      { label: "Resolution", cloud: "Up to 4K", edge: "1080p – 4K" },
      { label: "Inference speed", cloud: "{latencyCloud}", edge: "{latencyEdge}" },
      { label: "Hardware", cloud: "None (SaaS)", edge: "In-vehicle edge box (GPU ≥ 20 TOPS)" },
      { label: "Deployment", cloud: "Public or private cloud", edge: "In-vehicle edge + on-prem back end" },
      { label: "Interfaces", cloud: "REST / gRPC / SDK", edge: "REST / SDK / local file sync" },
      { label: "Output", cloud: "JSON, GeoJSON, PDF, Excel", edge: "JSON, GeoJSON (store-and-forward)" },
    ],
    scenarios: [
      { title: "Routine city surveys", desc: "Weekly patrols of arterial roads, with defects dispatched as work orders." },
      { title: "Annual network assessment", desc: "Regional pavement condition ratings with per-segment statistics." },
      { title: "Repair verification", desc: "Compare before and after to verify workmanship and quantities." },
    ],
    faqs: [
      { q: "Do we need a special survey vehicle?", a: "No. Any patrol or fleet vehicle works with a camera and edge box. Installation takes about half a day." },
      { q: "How fast can we drive?", a: "Normal patrol speed on regular roads. The exact limit depends on camera frame rate and exposure; the PoC reports measured figures." },
      { q: "How is depth measured?", a: "Monocular depth estimation with vehicle-pose compensation, suitable for maintenance grading. Add a laser module when you need metrology-grade accuracy." },
      { q: "Can grading follow our national standard?", a: "Yes. Area and depth thresholds and grade names are all configurable." },
      { q: "Can data stay on-premises?", a: "Yes. With on-prem deployment, footage and results never leave your data center or private cloud." },
    ],
  },
};
