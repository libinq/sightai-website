# 上线前检查清单 / Launch checklist

所有【待替换】内容与需要真实素材的位置。完成一项勾一项。

## 1. 客户与案例（最高优先级）

- [ ] **具名客户书面授权**：FIFA、中国网球公开赛、亚足联（AFC）、下奥地利州政府、全国运动会、大熊猫国家公园。
      每家需确认：① 同意在官网署名；② 案例文字（`content/cases/{zh,en}/<slug>.mdx`）；③ 使用的产品。
- [ ] 每个具名案例的 **3 个成效数字** → `content/metrics.ts` 的 `CASE_METRICS`（目前为 `null`，页面显示「待替换」）。
- [ ] 每个案例的 **客户引言** → 各 MDX 文件末尾的 `>` 引用块。
- [ ] 确认后把 `content/cases/list.ts` 中对应案例的 `needsReview` 改为 `false`（页面上的「案例内容待客户确认」标记会消失）。
- [ ] 3 个匿名示例案例（auto-parts-plant / petrochem-park / media-studio）：替换为真实匿名案例，或删除。
- [ ] Logo 墙目前是文字标识 → 提供各客户授权的单色 SVG Logo（`components/sections/logo-wall.tsx`）。

## 2. 数字

- [ ] `content/metrics.ts` 中所有值（首页指标、产品徽章、规格表速度、病害分级深度阈值）逐项核实。
- [ ] 全部核实后把 `SHOW_PLACEHOLDER_NOTICE` 设为 `false`。

## 3. 公司信息

- [ ] 邮箱、电话、ICP 备案号 → `lib/site.ts` 的 `CONTACT`。
- [ ] 关于我们：团队、发展历程、办公地址（`messages/*.json` → `about.companyNote`）。
- [ ] 完整隐私政策文本（`about.privacy`）。
- [ ] 技术页认证与资质（`technology.certNote`）。
- [ ] 资源中心新闻（`app/[locale]/resources/page.tsx` 中 3 条占位）。
- [ ] 白皮书 PDF 文件（当前「申请下载」走联系表单）。
- [ ] 数字人可用语种列表（`components/demo/product/avatar.tsx`）。
- [ ] `NEXT_PUBLIC_SITE_URL`（`.env`）。

## 4. 素材

见 `public/media/README.md`。全部画面目前为自绘示意图 / 程序化画面。

## 5. 接入

- [ ] `CONTACT_WEBHOOK_URL`：联系表单转发地址（未设置时为 mock，只打印日志）。
- [ ] GA4 / 百度统计 ID（仅在 Cookie 同意后加载，加载逻辑待接入）。
- [ ] API 示例代码中的接口地址与 SDK 包名（`components/demo/product/architecture.tsx`）以正式 API 为准。
