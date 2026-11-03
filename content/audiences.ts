import { Building, Clapperboard, Eye, GraduationCap, HardHat, Heart, ShoppingBag, Store, Trophy, Users, UserRound, type LucideIcon } from "lucide-react";
import type { IndustryKey } from "./industries";

/**
 * Who benefits in each industry. Capability pages list benefits in the same audience order
 * (content/capability-details/*.ts → `benefits[i]` belongs to `AUDIENCES[industry][i]`).
 */
export interface Audience {
  icon: LucideIcon;
  zh: { name: string; summary: string; benefits: string[] };
  en: { name: string; summary: string; benefits: string[] };
}

export const AUDIENCES: Record<IndustryKey, Audience[]> = {
  education: [
    {
      icon: GraduationCap,
      zh: {
        name: "学生",
        summary: "在更安全、更被关注的环境里学习和成长",
        benefits: ["霸凌、冲突在升级前就被发现和干预", "跌倒、受伤等意外能第一时间得到救助", "人脸可脱敏处理，个人隐私受到保护", "危险区域与违禁品被挡在校园之外"],
      },
      en: {
        name: "Students",
        summary: "Learn and grow somewhere safer, where someone is always looking out",
        benefits: ["Bullying and fights are caught before they escalate", "Falls and injuries get help right away", "Faces can be blurred to protect privacy", "Danger zones and contraband stay out of school"],
      },
    },
    {
      icon: Users,
      zh: {
        name: "教师",
        summary: "从盯监控中解放出来，把精力还给教学",
        benefits: ["不再需要轮流盯看几十路画面，异常自动推送", "告警附带事件片段，处理和沟通有据可查", "按班级、区域查看行为趋势，提前做心理疏导", "值班排班与告警分级，夜间也不漏事件"],
      },
      en: {
        name: "Teachers",
        summary: "Stop watching monitors and get back to teaching",
        benefits: ["No more rota for dozens of feeds — incidents come to you", "Every alert carries a clip, so follow-up has evidence", "Behavior trends by class and zone inform early support", "Duty rotas and graded alerts cover nights too"],
      },
    },
    {
      icon: Building,
      zh: {
        name: "学校管理者",
        summary: "以客观数据支撑安全管理与家校沟通",
        benefits: ["全校安全态势一屏可见，周报自动生成", "利旧现有摄像头，无需大规模改造", "事件可追溯，满足教育主管部门的检查要求", "数据不出校，符合个人信息保护要求"],
      },
      en: {
        name: "School leadership",
        summary: "Objective data behind safety decisions and parent conversations",
        benefits: ["Campus-wide safety on one screen, weekly reports built for you", "Runs on existing cameras — no big retrofit", "Traceable incidents for regulator inspections", "Footage stays on campus, privacy-compliant"],
      },
    },
  ],
  retail: [
    {
      icon: ShoppingBag,
      zh: {
        name: "顾客",
        summary: "想买的有货，问题有人答，结账不排长队",
        benefits: ["货架缺货更少，想买的商品随时在架", "数字导购 7×24 在线解答商品问题", "排队过长自动预警，及时加开收银台", "全程匿名统计，不识别个人身份"],
      },
      en: {
        name: "Shoppers",
        summary: "What they want is in stock, questions get answered, queues stay short",
        benefits: ["Fewer empty shelves — products are there when wanted", "A digital associate answers questions 24/7", "Long queues trigger alerts to open more lanes", "Fully anonymous counting — no identification"],
      },
    },
    {
      icon: Store,
      zh: {
        name: "门店团队",
        summary: "少跑腿、少盘点，把时间花在服务顾客上",
        benefits: ["补货任务直接推到手机，不必反复巡店", "知道哪个区域、哪个时段最忙，排班更合理", "收银异常自动标记，防损复核有证据", "数字人分担重复问答与促销播报"],
      },
      en: {
        name: "Store teams",
        summary: "Less walking and counting, more time with customers",
        benefits: ["Restock tasks land on phones — no repeated floor walks", "Know which zones and hours peak, staff accordingly", "Checkout anomalies are flagged with evidence", "The avatar handles repetitive Q&A and promotions"],
      },
    },
    {
      icon: Building,
      zh: {
        name: "品牌总部",
        summary: "跨门店的统一数据，驱动陈列、选品与运营决策",
        benefits: ["多门店客流、转化、缺货指标统一对比", "陈列合规可远程核查，执行情况一目了然", "损耗按门店排行，精准定位问题门店", "形象统一的品牌数字人，快速复制到所有门店"],
      },
      en: {
        name: "Brand HQ",
        summary: "One dataset across stores to drive layout, range and operations",
        benefits: ["Compare footfall, conversion and out-of-stocks across stores", "Audit planogram compliance remotely", "Rank shrink by store to target the right sites", "One on-brand avatar, rolled out to every store"],
      },
    },
  ],
  sports: [
    {
      icon: Clapperboard,
      zh: {
        name: "媒体与转播方",
        summary: "更多可播素材、更快出片、更低制作成本",
        benefits: ["裁判与运动员第一视角画面可直接进入转播信号", "进球、扑救等高光分钟级自动剪辑", "低码率机位与夜场画面增强到转播级", "横竖屏多版本自动生成，适配各平台"],
      },
      en: {
        name: "Media & broadcasters",
        summary: "More airable footage, faster turnaround, lower production cost",
        benefits: ["Referee and athlete POV feeds go straight to air", "Goals and saves are cut automatically within minutes", "Low-bitrate angles and night games enhanced to broadcast grade", "Landscape and vertical versions generated for every platform"],
      },
    },
    {
      icon: Heart,
      zh: {
        name: "粉丝",
        summary: "前所未有的视角，更快看到想看的瞬间",
        benefits: ["身临其境的裁判视角，像站在球场中央", "赛后几分钟就能在社交平台刷到集锦", "按球员、球队订阅个人化集锦", "多语种数字人解说与场馆导览"],
      },
      en: {
        name: "Fans",
        summary: "Views they've never had, and the moments they want, sooner",
        benefits: ["An immersive referee's-eye view from mid-pitch", "Highlights on social minutes after the whistle", "Personal reels by player or team", "Multilingual avatar commentary and venue guidance"],
      },
    },
    {
      icon: Trophy,
      zh: {
        name: "赛事组织方",
        summary: "放大赛事内容价值，提升商业化与运营效率",
        benefits: ["内容产量成倍提升，赞助曝光机会更多", "多平台分发数据统一回流，衡量传播效果", "数字人志愿者与导览，降低现场人力成本", "裁判视角提升判罚透明度与公信力"],
      },
      en: {
        name: "Organizers",
        summary: "More value from every match, better monetization and operations",
        benefits: ["Multiply content output and sponsor exposure", "Distribution analytics from every platform in one place", "Avatar volunteers and guides cut on-site staffing", "Referee POV improves transparency and trust in decisions"],
      },
    },
  ],
  manufacturing: [
    {
      icon: HardHat,
      zh: {
        name: "一线员工与质检员",
        summary: "从重复目检中解放，工作更安全",
        benefits: ["不再长时间盯看产线，AI 承担重复判定", "疑难样本才交给人工复核，判断更专注", "未戴安全帽、闯入危险区等实时提醒", "缺陷图片与标注自动沉淀，培训新人更快"],
      },
      en: {
        name: "Line workers & inspectors",
        summary: "Free from repetitive visual checks, and safer at work",
        benefits: ["AI takes over repetitive verdicts on the line", "Only hard cases reach human review", "Real-time reminders for helmets and danger zones", "Defect images and labels build a training library"],
      },
    },
    {
      icon: Eye,
      zh: {
        name: "工厂与质量负责人",
        summary: "稳定的良率、可追溯的质量数据",
        benefits: ["漏检率不随班次与疲劳波动", "缺陷帕累托与产线良率实时可见，快速定位根因", "NG 件自动剔除，PLC / MES 无缝对接", "小样本训练，产品换型当天就能上线"],
      },
      en: {
        name: "Plant & quality leads",
        summary: "Stable yield and traceable quality data",
        benefits: ["Miss rates no longer drift with shifts and fatigue", "Live defect Pareto and yield to find root causes fast", "NG parts rejected automatically via PLC / MES", "Few-shot training — new models live on changeover day"],
      },
    },
    {
      icon: UserRound,
      zh: {
        name: "客户与公众",
        summary: "更可靠的产品，更安全的道路",
        benefits: ["出厂产品一致性更高，客诉与召回更少", "每批次可提供检测记录，增强客户信任", "道路病害更早发现、更快修复", "养护资金投向最需要的路段"],
      },
      en: {
        name: "Customers & the public",
        summary: "More reliable products, safer roads",
        benefits: ["More consistent output, fewer complaints and recalls", "Inspection records per batch build customer trust", "Road defects found earlier and fixed faster", "Maintenance budgets go where they're needed most"],
      },
    },
  ],
};
