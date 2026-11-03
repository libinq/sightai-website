import type { Tier } from "./industries";

/**
 * Subscription plans, billed per camera (video source) per year, in USD.
 * Basic = $500 / camera / year (confirmed). Pro price is a placeholder — TODO: verify before launch 【待替换】
 */
export type PlanId = "trial" | Tier;

export interface Plan {
  id: PlanId;
  /** USD per camera per year; 0 = free trial; null = quoted by sales */
  perCamera: number | null;
  quota: { cameras: number | null; seats: number | null; retentionDays: number };
  highlight?: boolean;
  zh: { name: string; desc: string; features: string[] };
  en: { name: string; desc: string; features: string[] };
}

export const PLANS: Plan[] = [
  {
    id: "trial",
    perCamera: 0,
    quota: { cameras: 4, seats: 2, retentionDays: 7 },
    zh: {
      name: "免费试用",
      desc: "14 天，最多 4 路摄像头",
      features: ["最多 4 路摄像头", "全部基础版能力", "2 个成员席位", "事件留存 7 天", "社区支持"],
    },
    en: {
      name: "Free trial",
      desc: "14 days, up to 4 cameras",
      features: ["Up to 4 cameras", "Every Basic capability", "2 seats", "7-day event retention", "Community support"],
    },
  },
  {
    id: "starter",
    perCamera: 500,
    quota: { cameras: null, seats: 20, retentionDays: 30 },
    zh: {
      name: "基础版",
      desc: "按摄像头计费，开箱即用",
      features: ["每路摄像头可订阅全部基础版能力", "事件留存 30 天", "20 个成员席位", "REST API 与 Webhook", "工单支持（工作日）"],
    },
    en: {
      name: "Basic",
      desc: "Per-camera pricing, ready out of the box",
      features: ["Every Basic capability on each camera", "30-day event retention", "20 seats", "REST API & webhooks", "Ticket support (business days)"],
    },
  },
  {
    id: "pro",
    perCamera: 800, // TODO: verify before launch
    highlight: true,
    quota: { cameras: null, seats: 100, retentionDays: 90 },
    zh: {
      name: "专业版",
      desc: "高级能力与多站点运营",
      features: ["包含基础版全部内容", "专业版能力（RefCam、AI Avatar、违禁品安检…）", "事件留存 90 天", "100 个成员席位", "自定义模型微调", "7×24 告警值守支持"],
    },
    en: {
      name: "Pro",
      desc: "Advanced capabilities, multi-site operations",
      features: ["Everything in Basic", "Pro capabilities (RefCam, AI Avatar, screening…)", "90-day event retention", "100 seats", "Custom model fine-tuning", "24/7 alert support"],
    },
  },
  {
    id: "enterprise",
    perCamera: null,
    quota: { cameras: null, seats: null, retentionDays: 365 },
    zh: {
      name: "企业版",
      desc: "私有化 / 边缘部署与批量折扣",
      features: ["包含专业版全部内容", "私有化 / 边缘盒子部署", "大规模摄像头批量价格", "SSO 与审计日志", "SLA 99.95%", "专属客户成功经理"],
    },
    en: {
      name: "Enterprise",
      desc: "On-prem / edge deployment and volume pricing",
      features: ["Everything in Pro", "On-prem / edge appliance", "Volume pricing for large fleets", "SSO & audit log", "99.95% SLA", "Named customer success manager"],
    },
  },
];

const TIER_RANK: Record<PlanId, number> = { trial: 0, starter: 1, pro: 2, enterprise: 3 };

/** Whether a plan can subscribe to a capability of the given minimum tier. Trial = Basic capabilities. */
export const planAllows = (plan: PlanId, tier: Tier) => Math.max(TIER_RANK[plan], 1) >= TIER_RANK[tier];

export const getPlan = (id: string) => PLANS.find((p) => p.id === id) ?? PLANS[0];

export const usd = (n: number) => `$${n.toLocaleString("en-US")}`;
