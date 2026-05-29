# RVC Design Notes

本文档记录当前代码里的设计系统和页面约定，方便多人协作时保持视觉、交互和信息架构一致。更完整的早期规格可参考 `RVC_Enterprise_Value_Diagnostic_Platform_Vibe_Coding_UI_Spec.md`。

## 产品定位

RVC 是面向企业资本化生命周期的智能诊断平台。界面应传达：

- 机构级、可信、专业
- AI 驱动、数据密集但不压迫
- 面向 IPO、并购、融资、治理和增长路径
- 高端咨询/资本市场工具，而不是消费级营销页

## 信息架构

当前主站包含 5 个页面：

1. `index.html`：建立品牌认知和平台价值主张。
2. `intake.html`：模拟企业数据采集流程。
3. `report.html`：展示 AI 诊断后的机构级报告样例。
4. `modules.html`：展示推荐执行模块及筛选/搜索/详情。
5. `ipo.html`：聚焦 IPO readiness 的专项控制台。

页面之间通过统一头部导航连接。桌面端使用横向导航，移动端使用横向滚动的 pill 导航。

## 视觉语言

### 色彩

核心色彩定义在 `rvc-base.css` 的 `:root` 中：

```css
--blue: #0B6FFB;
--blue-d: #004DD9;
--blue-s: #E8F2FF;
--cyan: #23B7FF;
--navy: #07132B;
--bg: #F4F8FF;
--ok: #16B364;
--warn: #F59E0B;
--danger: #F04438;
```

使用规则：

- 主行动按钮、活跃导航、重点数值使用 `--blue` / `--blue-d`。
- 背景保持浅蓝灰 `--bg`，不要改成纯白大面积页面。
- 成功、警告、风险状态分别使用 `--ok`、`--warn`、`--danger`。
- KPI 或图表可用蓝、青、绿、橙做维度区分，但整体仍需保持资本科技感。

### 字体

- Sans：`Inter` + 中文系统字体，适合标题、正文、按钮。
- Mono：`JetBrains Mono`，用于 KPI、评分、金额、百分比等数字。
- 数字默认使用 tabular nums，保持仪表盘读数稳定。

### 卡片与玻璃质感

当前代码采用轻量 glass/card 风格：

- 卡片背景：`rgba(255,255,255,0.96)`。
- 边框：低透明蓝色边框。
- 阴影：克制、偏蓝，不做厚重投影。
- hover：轻微上移和阴影增强。

注意：`rvc-base.css` 注释中明确偏向 performance-first。不要在大量卡片上叠加强 `backdrop-filter`，避免移动端卡顿。

## 组件约定

### Header / Navigation

每个页面都有同构的 header：

- logo 链接到 `index.html`
- 主导航顺序固定：概览、数据采集、诊断报告、执行模块、IPO就绪
- 当前页添加 `active`
- 移动端导航使用 `.mob-nav`，同样需要同步 active 状态

新增页面时，请同步所有 HTML 的导航，避免页面之间出现断链。

### Buttons

共享按钮类：

- `.btn-primary`：头部主按钮
- `.btn-blue`：页面主 CTA
- `.btn-outline`：次级 CTA
- `.btn-sm`：小型操作按钮

按钮文案应直接描述动作，例如「开始诊断」「查看报告」「打开 IPO 控制台」。

### Cards

共享类：

- `.card`：基础卡片
- `.card-inner-glow`：内层高光
- `.tag` / `.tag-blue` / `.tag-green` / `.tag-orange` / `.tag-red`：状态标签
- `.pbar` / `.pfill`：进度条

卡片适合展示一个业务实体或一个指标组。不要把大页面 section 全部做成浮动卡片。

### Reveal Animation

各页面使用 `.reveal` + `IntersectionObserver`：

- 初始向下偏移和透明
- 进入视口后添加 `.vis`
- 延迟通常按列表顺序轻微错开

新增动态效果时保持短、稳、低干扰，避免影响信息阅读。

## 页面级交互

### `index.html`

- hero 标题有打字机效果。
- AI engine 使用内联 SVG 和 SVG animation 表达扫描/流动/数值增长。
- 成功案例墙使用 marquee 动画。

### `intake.html`

- 7 步采集流程通过 `currentStep` 和 `goToStep` 控制。
- slider、tag、range、checkbox 都是前端演示状态。
- 右侧 AI 面板会随步骤变化展示不同评分、维度和 insight。
- 当前无真实数据提交，提交按钮用于演示完成状态。

### `report.html`

- 展示报告摘要、评分、雷达图和路线图。
- 左侧报告导航目前只切换 active 状态，不滚动到真实分区。

### `modules.html`

- 模块卡片支持按 `data-category` 筛选。
- 搜索基于卡片 `textContent` 前端过滤。
- 详情弹窗内容来自页面内 `detailData` 对象。

### `ipo.html`

- 展示 IPO readiness 评分、阶段时间线、清单和风险。
- 侧边栏导航当前只切换 active 状态。

## 响应式约定

主要断点在 `max-width: 768px`：

- `.wrap` 从 56px padding 缩到 20px。
- 桌面 nav 隐藏，移动 `.mob-nav` 显示为横向滚动。
- 多列 grid 变为单列或两列。
- hero、SVG、卡片需要避免超出 `100vw`。

修改移动端时重点检查：

- 头部和移动导航是否重叠。
- SVG 是否撑破屏幕。
- CTA 按钮文案是否换行后仍美观。
- 固定宽度卡片是否造成横向滚动。

## 内容风格

中文文案保持专业、直接、偏机构业务语气：

- 推荐使用：诊断、就绪、价值维度、资本路径、治理成熟度、执行模块、机构级洞察。
- 避免过度营销：颠覆、革命、神器、秒杀、无敌等。
- 数据口径如 `72小时`、`300+维度`、`$42B`、`320+顾问` 应保持全站一致，变更时全局搜索。

## 资产规范

- `logo.svg` 是主站唯一运行时图片资源。
- 设计稿、PDF、原始图片通过 `.vercelignore` 排除，不进入线上部署包。
- 如需新增线上图片，放在项目根目录或明确的 `assets/` 目录，并同步更新 `.vercelignore`，避免误排除。
- 当前 `index.html` 引用了 `/og-cover.png`，如要启用社交分享卡片，需要补充该文件。

## 升级到组件化时的建议

如果后续改为 React / Next.js / Vite，建议优先抽象：

- `TopNav`
- `MobileNav`
- `Button`
- `Card`
- `Tag`
- `ProgressBar`
- `ScoreGauge`
- `RadarChart`
- `ModuleCard`
- `DetailModal`

数据层可先从页面内硬编码迁移为：

```text
data/
├── nav.json
├── modules.json
├── report-mock.json
├── intake-steps.json
└── ipo-checklist.json
```

这样可以先降低重复代码，再逐步接入真实 API。
