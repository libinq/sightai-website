import { Tags, BrainCircuit, ClipboardCheck, Rocket, Activity, Code2 } from "lucide-react";
import type { ProductData } from "./types";

export const platform: ProductData = {
  slug: "platform",
  line: "platform",
  demo: "architecture",
  capabilityIcons: [Tags, BrainCircuit, ClipboardCheck, Rocket, Activity, Code2],
  relatedCases: ["lower-austria", "auto-parts-plant"],
  zh: {
    valueProp: "从数据到上线，一个平台",
    intro:
      "覆盖数据标注、模型训练、评测、部署与监控的视觉 AI 一体化平台。同一模型可发布到云端、私有化服务器或边缘盒子，上线后持续回流难例数据，形成闭环迭代，并通过 API / SDK 接入业务系统。",
    metricLabels: { targets: "部署目标", sdks: "SDK 语言", models: "预置模型" },
    pains: [
      { before: "标注、训练、部署分散在多套工具", after: "一个平台完成全流程" },
      { before: "模型效果靠感觉，缺少统一评测", after: "标准评测集与版本对比" },
      { before: "云与边缘需要分别适配", after: "一次训练，多端发布" },
      { before: "上线后效果衰减无人察觉", after: "线上监控与难例自动回流" },
    ],
    capabilities: [
      { title: "数据标注", desc: "检测框、分割、关键点标注，支持模型预标注与多人协作。" },
      { title: "模型训练", desc: "预置行业模型微调，支持小样本与增量训练。" },
      { title: "评测", desc: "统一评测集、指标看板与版本对比。" },
      { title: "多端部署", desc: "一键发布到云端、私有化服务器与边缘盒子。" },
      { title: "线上监控", desc: "推理性能、数据漂移与难例监控。" },
      { title: "API / SDK", desc: "REST、gRPC 与 Python / JS / C++ SDK。" },
    ],
    steps: [
      { title: "数据", desc: "接入图片、视频与业务数据" },
      { title: "标注", desc: "预标注 + 人工校验" },
      { title: "训练", desc: "行业模型微调" },
      { title: "评测", desc: "指标对比与验收" },
      { title: "部署 / 监控", desc: "多端发布与持续回流" },
    ],
    specs: [
      { label: "数据格式", cloud: "图片、视频、COCO / VOC / YOLO", edge: "同左，支持离线导入" },
      { label: "标注类型", cloud: "检测框、分割、关键点、分类", edge: "同左" },
      { label: "推理服务", cloud: "{latencyCloud}", edge: "{latencyEdge}" },
      { label: "硬件要求", cloud: "无（SaaS）", edge: "GPU 服务器（私有化）" },
      { label: "部署方式", cloud: "公有云", edge: "私有化 / 信创环境" },
      { label: "接口", cloud: "REST / gRPC / SDK", edge: "REST / gRPC / SDK" },
      { label: "权限与审计", cloud: "多租户、角色权限", edge: "对接企业 SSO / LDAP，操作审计" },
    ],
    scenarios: [
      { title: "行业模型定制", desc: "在预置模型基础上快速适配客户场景。" },
      { title: "集成商与渠道伙伴", desc: "基于 API / SDK 构建自有解决方案。" },
      { title: "多站点统一运维", desc: "集中管理分布在多地的边缘设备与模型版本。" },
    ],
    faqs: [
      { q: "可以只用平台的一部分吗？", a: "可以。标注、训练、部署等模块可单独使用，也可对接现有工具。" },
      { q: "支持私有化与信创环境吗？", a: "支持私有化部署，并可适配国产化软硬件环境，具体以项目评估为准。" },
      { q: "模型归谁所有？", a: "基于客户数据训练的模型与数据归属按合同约定，默认归客户所有。" },
      { q: "如何管理大量边缘设备？", a: "平台提供设备注册、远程升级、健康监控与灰度发布。" },
      { q: "有开发文档吗？", a: "有。API 参考与 SDK 示例可在资源中心获取，私有化版本随交付提供。" },
    ],
  },
  en: {
    valueProp: "From data to production, one platform.",
    intro:
      "One vision AI platform for labeling, training, evaluation, deployment and monitoring. Publish the same model to cloud, on-prem servers or edge boxes, feed hard cases back for continuous improvement, and integrate through APIs and SDKs.",
    metricLabels: { targets: "Deploy targets", sdks: "SDK languages", models: "Pre-built models" },
    pains: [
      { before: "Labeling, training and deployment in separate tools", after: "One platform, end to end" },
      { before: "Model quality judged by gut feel", after: "Standard benchmarks and version comparison" },
      { before: "Cloud and edge need separate builds", after: "Train once, deploy anywhere" },
      { before: "Accuracy decays unnoticed in production", after: "Live monitoring with hard-case feedback" },
    ],
    capabilities: [
      { title: "Labeling", desc: "Boxes, masks and keypoints with model pre-labeling and team workflows." },
      { title: "Training", desc: "Fine-tune industry models, with few-shot and incremental training." },
      { title: "Evaluation", desc: "Shared test sets, metric dashboards and version diffs." },
      { title: "Multi-target deploy", desc: "One click to cloud, on-prem servers or edge boxes." },
      { title: "Monitoring", desc: "Latency, data drift and hard-case tracking." },
      { title: "API / SDK", desc: "REST, gRPC and Python / JS / C++ SDKs." },
    ],
    steps: [
      { title: "Data", desc: "Images, video and business data" },
      { title: "Label", desc: "Pre-label + human review" },
      { title: "Train", desc: "Fine-tune industry models" },
      { title: "Evaluate", desc: "Compare metrics, sign off" },
      { title: "Deploy & monitor", desc: "Publish and feed back" },
    ],
    specs: [
      { label: "Data formats", cloud: "Images, video, COCO / VOC / YOLO", edge: "Same, with offline import" },
      { label: "Label types", cloud: "Boxes, masks, keypoints, classes", edge: "Same" },
      { label: "Inference service", cloud: "{latencyCloud}", edge: "{latencyEdge}" },
      { label: "Hardware", cloud: "None (SaaS)", edge: "GPU servers (on-prem)" },
      { label: "Deployment", cloud: "Public cloud", edge: "On-prem / air-gapped" },
      { label: "Interfaces", cloud: "REST / gRPC / SDK", edge: "REST / gRPC / SDK" },
      { label: "Access & audit", cloud: "Multi-tenant, role-based", edge: "Enterprise SSO / LDAP, audit logs" },
    ],
    scenarios: [
      { title: "Custom industry models", desc: "Adapt pre-built models to each customer site quickly." },
      { title: "Integrators & partners", desc: "Build your own solutions on our APIs and SDKs." },
      { title: "Multi-site operations", desc: "Manage edge devices and model versions across locations." },
    ],
    faqs: [
      { q: "Can we use only part of the platform?", a: "Yes. Labeling, training and deployment work standalone or alongside your existing tools." },
      { q: "Is on-prem supported?", a: "Yes, including air-gapped environments, subject to a project assessment." },
      { q: "Who owns the models?", a: "Ownership follows the contract; by default models trained on your data are yours." },
      { q: "How do we manage many edge devices?", a: "Device registry, remote updates, health monitoring and staged rollouts." },
      { q: "Is there developer documentation?", a: "Yes. API reference and SDK samples are in the Resources center; on-prem docs ship with delivery." },
    ],
  },
};
