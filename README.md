# RVC Capital 企业价值智能诊断平台

RVC 是一个静态前端原型站点，用于展示「企业价值智能诊断平台」的核心体验：企业数据采集、诊断报告、执行模块推荐和 IPO 就绪评估。

线上地址：https://rvc-chi.vercel.app/

## 当前技术形态

- 主站：纯静态 HTML + CSS + 原生 JavaScript
- 样式：共享基础样式 `rvc-base.css`，页面级样式内联在各 HTML 文件中
- 部署：Vercel 静态站点，入口为 `index.html`
- 视频演示：`demo-video/` 是独立 Remotion 工程，不参与主站运行时部署

主站目前没有打包、编译、后端 API 或数据库依赖。直接打开 HTML 文件即可预览，部署时由 Vercel 按 `vercel.json` 的路由规则提供页面。

## 页面结构

| 文件 | 线上路径 | 说明 |
| --- | --- | --- |
| `index.html` | `/`, `/index` | 首页概览，包含价值主张、AI 诊断引擎动效、服务模块、KPI 与成功案例墙 |
| `intake.html` | `/intake` | 企业信息采集台，包含 7 步表单、滑块、选项切换和右侧 AI 扫描面板 |
| `report.html` | `/report` | 企业诊断报告样例，展示综合评分、雷达图、推荐路径和路线图 |
| `modules.html` | `/modules` | 智能执行套件，包含筛选、搜索和模块详情弹窗 |
| `ipo.html` | `/ipo` | IPO 就绪控制台，展示成熟度评分、时间线、清单和风险面板 |

## 目录说明

```text
rvc/
├── index.html
├── intake.html
├── report.html
├── modules.html
├── ipo.html
├── rvc-base.css
├── logo.svg
├── vercel.json
├── .vercelignore
├── .gitignore
├── README.md
├── DESIGN.md
├── DEPLOYMENT.md
├── RVC_Enterprise_Value_Diagnostic_Platform_Vibe_Coding_UI_Spec.md
├── RVC_2.0_AI升级战略方案_V2 05-26-26.docx
├── RVC_AI企业价值提升平台_UI设计2.docx
├── RVC_AI企业价值提升平台_UI设计2.pdf
├── image*.png
└── demo-video/
    ├── package.json
    ├── src/
    ├── public/
    ├── renders/
    └── hyperframes/
```

### 关键文件职责

- `rvc-base.css`：全局 tokens、字体、布局、头部导航、按钮、卡片、标签、滚动 reveal、移动端导航和响应式基础规则。
- 各页面 HTML：包含本页结构、页面级 CSS、少量原生 JS 交互。
- `vercel.json`：定义静态路由 rewrite、HTML/CSS/SVG 缓存策略和基础安全响应头。
- `.vercelignore`：排除设计稿、PDF、原图等非运行时文件，保持部署包轻量。
- `RVC_Enterprise_Value_Diagnostic_Platform_Vibe_Coding_UI_Spec.md`：早期完整 UI 规格文档，可作为升级 React/组件化时的参考。
- `demo-video/`：Remotion 视频演示工程，需单独安装依赖和渲染。

## 本地预览

方式一：直接打开文件。

```bash
open index.html
```

方式二：启动一个本地静态服务器，更接近线上路径行为。

```bash
python3 -m http.server 3000
```

然后访问：

```text
http://localhost:3000/
http://localhost:3000/intake.html
http://localhost:3000/report.html
http://localhost:3000/modules.html
http://localhost:3000/ipo.html
```

注意：Vercel 上的短路径 `/intake`、`/report`、`/modules`、`/ipo` 来自 `vercel.json` rewrites；本地简单静态服务器默认访问 `.html` 文件名。

## 协作开发流程

1. 修改页面内容时，优先在对应 HTML 文件中处理结构和页面级样式。
2. 多页面共用的样式、按钮、导航、卡片、移动端规则放到 `rvc-base.css`。
3. 新增页面时，同步更新所有页面的桌面导航和移动端导航，并在 `vercel.json` 增加 rewrite。
4. 修改 `rvc-base.css` 后，更新 HTML 中的查询参数版本号，例如 `rvc-base.css?v=20260527-3`，避免线上缓存残留。
5. 提交前至少检查桌面和移动端宽度下的页面是否无横向溢出、文字重叠、导航错位。

## 部署

详细步骤见 `DEPLOYMENT.md`。当前项目已关联 Vercel 项目 `rvc`，生产地址为：

```text
https://rvc-chi.vercel.app/
```

常用命令：

```bash
vercel --prod
```

如果团队使用 Git 集成部署，也可以将代码推送到 GitHub 仓库后由 Vercel 自动构建。当前 remote：

```text
https://github.com/nicksnowz/rvcai_ui.git
```

## 已知注意事项

- `index.html` 中引用了 `/og-cover.png`，当前仓库根目录未看到该文件。如需完整社交分享图，应补充该资源或更新 meta。
- `demo-video/` 在 git 状态中目前是未跟踪目录；如果视频源文件需要多人协作，请确认是否纳入版本管理。
- 主站没有表单提交后端，`intake.html` 的「提交采集」目前是前端演示交互。
- 当前页面重复了 header/nav 代码；后续升级为 React/Vite/Next.js 时可抽成共享组件。

## 未来升级方向

- 组件化：将 Header、MobileNav、Card、Button、ScoreGauge、ModuleCard 等抽为可复用组件。
- 数据化：把模块、报告指标、IPO 清单等 mock data 移入 JSON 或 API。
- 表单能力：为 intake 建立真实提交、草稿保存、校验和权限控制。
- 性能：减少页面内联 CSS，按页面拆分资源并补齐图片尺寸、预加载策略。
- 可访问性：补齐按钮 aria、键盘可达、弹窗 focus trap 和 reduced-motion 支持。
