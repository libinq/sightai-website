import type { Tier } from "./industries";

/** Subscription plans. Prices & quotas are placeholders — TODO: verify before launch 【待替换】 */
export type PlanId = "trial" | Tier;

export interface Plan {
  id: PlanId;
  /** monthly price; null = contact sales */
  price: { cny: number; usd: number } | null;
  quota: { streams: number | null; apiCalls: number | null; seats: number | null; retentionDays: number };
  highlight?: boolean;
  zh: { name: string; desc: string; features: string[] };
  en: { name: string; desc: string; features: string[] };
}

export const PLANS: Plan[] = [
  {
    id: "trial",
    price: { cny: 0, usd: 0 },
    quota: { streams: 4, apiCalls: 10_000, seats: 2, retentionDays: 7 },
    zh: {
      name: "免费试用",
      desc: "14 天体验全部 Starter 能力",
      features: ["4 路视频源", "1 万次 API 调用", "2 个成员席位", "事件留存 7 天", "社区支持"],
    },
    en: {
      name: "Free trial",
      desc: "14 days of every Starter capability",
      features: ["4 video sources", "10k API calls", "2 seats", "7-day event retention", "Community support"],
    },
  },
  {
    id: "starter",
    price: { cny: 1999, usd: 299 },
    quota: { streams: 32, apiCalls: 500_000, seats: 10, retentionDays: 30 },
    zh: {
      name: "Starter",
      desc: "单园区 / 单门店 / 单产线起步",
      features: ["32 路视频源", "50 万次 API 调用 / 月", "10 个成员席位", "事件留存 30 天", "Starter 级能力全部可订阅", "工单支持（工作日）"],
    },
    en: {
      name: "Starter",
      desc: "One campus, store or production line",
      features: ["32 video sources", "500k API calls / mo", "10 seats", "30-day retention", "All Starter capabilities", "Ticket support (business days)"],
    },
  },
  {
    id: "pro",
    price: { cny: 6999, usd: 999 },
    highlight: true,
    quota: { streams: 256, apiCalls: 5_000_000, seats: 50, retentionDays: 90 },
    zh: {
      name: "Pro",
      desc: "多站点运营与跨行业组合",
      features: ["256 路视频源", "500 万次 API 调用 / 月", "50 个成员席位", "事件留存 90 天", "Pro 级能力（RefCam、数字人、违禁品安检…）", "自定义模型微调", "7×24 告警值守支持"],
    },
    en: {
      name: "Pro",
      desc: "Multi-site operations across industries",
      features: ["256 video sources", "5M API calls / mo", "50 seats", "90-day retention", "Pro capabilities (RefCam, avatars, screening…)", "Custom model fine-tuning", "24/7 alert support"],
    },
  },
  {
    id: "enterprise",
    price: null,
    quota: { streams: null, apiCalls: null, seats: null, retentionDays: 365 },
    zh: {
      name: "Enterprise",
      desc: "私有化 / 边缘部署与专属服务",
      features: ["不限视频源与调用", "私有化 / 边缘盒子部署", "SSO 与审计日志", "专属模型训练", "SLA 99.95%", "专属客户成功经理"],
    },
    en: {
      name: "Enterprise",
      desc: "On-prem / edge deployment and dedicated service",
      features: ["Unlimited sources & calls", "On-prem / edge appliance", "SSO & audit log", "Dedicated model training", "99.95% SLA", "Named customer success manager"],
    },
  },
];

const TIER_RANK: Record<PlanId, number> = { trial: 0, starter: 1, pro: 2, enterprise: 3 };

/** Whether a plan can subscribe to a capability of the given minimum tier. Trial = Starter capabilities. */
export const planAllows = (plan: PlanId, tier: Tier) => Math.max(TIER_RANK[plan], 1) >= TIER_RANK[tier];

export const getPlan = (id: string) => PLANS.find((p) => p.id === id) ?? PLANS[0];
