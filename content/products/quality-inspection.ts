import { ScanSearch, Layers, Timer, PlugZap, BarChart3, ShieldCheck } from "lucide-react";
import type { ProductData } from "./types";

export const qualityInspection: ProductData = {
  slug: "quality-inspection",
  line: "inspection",
  demo: "conveyor",
  capabilityIcons: [ScanSearch, Layers, Timer, PlugZap, BarChart3, ShieldCheck],
  relatedCases: ["auto-parts-plant"],
  zh: {
    valueProp: "毫秒判定，缺陷不出产线",
    intro:
      "面向金属件、PCB、注塑件等产线的表面缺陷检测。少量样本即可训练上线，毫秒级给出 OK / NG 判定，与 PLC、MES 联动完成剔除和追溯，持续输出良率与缺陷分布数据。",
    metricLabels: { cycle: "单件判定", samples: "起训样本", classes: "缺陷类型" },
    pains: [
      { before: "人工目检易疲劳，漏检率随班次波动", after: "7×24 小时稳定判定，标准一致" },
      { before: "传统规则算法换型即需重新调参", after: "小样本训练，换型数小时内完成" },
      { before: "NG 件靠人工分拣，追溯困难", after: "联动 PLC 自动剔除，结果写入 MES" },
      { before: "缺陷原因只能事后抽样分析", after: "实时缺陷分布看板，定位工艺问题" },
    ],
    capabilities: [
      { title: "表面缺陷检测", desc: "划痕、凹坑、污渍、毛刺、裂纹、色差等常见表面缺陷。" },
      { title: "装配完整性校验", desc: "漏装、错装、反装、螺丝缺失等装配类问题。" },
      { title: "毫秒级判定", desc: "边缘推理，满足高节拍产线的实时剔除要求。" },
      { title: "PLC / MES 对接", desc: "支持 Modbus、OPC UA、Profinet 信号与 MES 数据回写。" },
      { title: "良率分析", desc: "按班次、批次、工位统计良率与缺陷分布。" },
      { title: "小样本训练", desc: "少量缺陷样本即可起训，配合平台持续迭代。" },
    ],
    steps: [
      { title: "采集", desc: "工业相机 + 光源在工位定点成像" },
      { title: "预处理", desc: "定位、ROI 裁剪、亮度归一" },
      { title: "推理", desc: "缺陷检测与分割" },
      { title: "后处理", desc: "尺寸过滤、OK / NG 判定" },
      { title: "输出 / 集成", desc: "PLC 剔除信号、MES 回写、看板" },
    ],
    specs: [
      { label: "输入格式", cloud: "图片批量上传（JPG / PNG / BMP）", edge: "GigE / USB3 工业相机" },
      { label: "支持分辨率", cloud: "最高 25 MP", edge: "最高 25 MP" },
      { label: "推理速度", cloud: "{latencyCloud}", edge: "{latencyEdge}" },
      { label: "硬件要求", cloud: "无（SaaS）", edge: "工控机 + GPU 或边缘盒子" },
      { label: "部署方式", cloud: "公有云（离线复检）", edge: "产线边缘 + 私有化平台" },
      { label: "接口", cloud: "REST / SDK", edge: "Modbus / OPC UA / Profinet / REST" },
      { label: "输出格式", cloud: "JSON、缺陷图", edge: "OK/NG 信号、JSON、MES 回写" },
    ],
    scenarios: [
      { title: "汽车零部件", desc: "冲压件、压铸件表面缺陷与装配校验。" },
      { title: "3C 电子", desc: "PCB 焊点、元件缺失与外壳外观检测。" },
      { title: "注塑与包装", desc: "缺料、飞边、污点与印刷缺陷。" },
    ],
    faqs: [
      { q: "需要多少缺陷样本？", a: "通常每类缺陷少量样本即可起训，具体数量取决于缺陷差异度，PoC 阶段会评估。" },
      { q: "能否适配现有相机和光源？", a: "可以先评估现有成像条件；如成像不足，我们会给出相机与光源选型建议。" },
      { q: "如何与产线 PLC 联动？", a: "支持 Modbus、OPC UA、Profinet 等协议输出剔除信号，也可通过 IO 模块直接触发。" },
      { q: "误判了怎么办？", a: "复检界面可人工确认，确认结果回流平台用于下一轮训练。" },
      { q: "换型需要多久？", a: "新产品采集样本后在平台上训练与评测，通常数小时内即可上线。" },
    ],
  },
  en: {
    valueProp: "Millisecond calls. No defect leaves the line.",
    intro:
      "Surface-defect inspection for metal parts, PCBs and molded plastics. Train with a handful of samples, get OK/NG decisions in milliseconds, and let PLC and MES integration handle rejection and traceability — with live yield and defect data.",
    metricLabels: { cycle: "Per-part decision", samples: "Samples to start", classes: "Defect types" },
    pains: [
      { before: "Manual inspection drifts with fatigue and shifts", after: "Consistent calls, 24/7" },
      { before: "Rule-based vision needs retuning for every changeover", after: "Few-shot training; changeovers in hours" },
      { before: "NG parts sorted by hand, hard to trace", after: "PLC auto-reject with results written to MES" },
      { before: "Root causes found only by after-the-fact sampling", after: "Live defect maps point to process issues" },
    ],
    capabilities: [
      { title: "Surface defects", desc: "Scratches, dents, stains, burrs, cracks, color variation." },
      { title: "Assembly checks", desc: "Missing, wrong, reversed parts and missing screws." },
      { title: "Millisecond decisions", desc: "Edge inference keeps up with high-takt lines." },
      { title: "PLC / MES integration", desc: "Modbus, OPC UA, Profinet signals plus MES write-back." },
      { title: "Yield analytics", desc: "Yield and defect distribution by shift, batch and station." },
      { title: "Few-shot training", desc: "Start with a few samples, keep improving on the platform." },
    ],
    steps: [
      { title: "Capture", desc: "Industrial camera + lighting at the station" },
      { title: "Pre-process", desc: "Locate, crop ROI, normalize" },
      { title: "Inference", desc: "Defect detection and segmentation" },
      { title: "Post-process", desc: "Size filters, OK/NG decision" },
      { title: "Output", desc: "PLC reject, MES write-back, dashboard" },
    ],
    specs: [
      { label: "Input", cloud: "Image batches (JPG / PNG / BMP)", edge: "GigE / USB3 industrial cameras" },
      { label: "Resolution", cloud: "Up to 25 MP", edge: "Up to 25 MP" },
      { label: "Inference speed", cloud: "{latencyCloud}", edge: "{latencyEdge}" },
      { label: "Hardware", cloud: "None (SaaS)", edge: "IPC with GPU, or edge box" },
      { label: "Deployment", cloud: "Public cloud (offline re-inspection)", edge: "Line-side edge + on-prem platform" },
      { label: "Interfaces", cloud: "REST / SDK", edge: "Modbus / OPC UA / Profinet / REST" },
      { label: "Output", cloud: "JSON, defect images", edge: "OK/NG signal, JSON, MES write-back" },
    ],
    scenarios: [
      { title: "Automotive parts", desc: "Stamped and die-cast surfaces, assembly verification." },
      { title: "Electronics", desc: "Solder joints, missing components, housing cosmetics." },
      { title: "Molding & packaging", desc: "Short shots, flash, spots and print defects." },
    ],
    faqs: [
      { q: "How many defect samples do we need?", a: "Usually a handful per class to start. The PoC assesses the exact number for your parts." },
      { q: "Can we keep our cameras and lighting?", a: "We assess your current imaging first and recommend upgrades only if needed." },
      { q: "How does it talk to our PLC?", a: "Reject signals over Modbus, OPC UA or Profinet, or directly via an IO module." },
      { q: "What about false calls?", a: "Operators confirm in the review UI; confirmed results feed the next training round." },
      { q: "How long does a changeover take?", a: "Collect samples, train and evaluate on the platform — typically live within hours." },
    ],
  },
};
