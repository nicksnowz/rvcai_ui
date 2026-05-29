# Deployment Guide

本文档说明 RVC 静态站点的部署方式。当前生产地址：

```text
https://rvc-chi.vercel.app/
```

## 部署平台

当前项目使用 Vercel。仓库中的 `.vercel/project.json` 显示已关联：

```text
projectName: rvc
```

主站是纯静态文件，不需要 build command、install command 或 Node runtime。

## Vercel 路由

`vercel.json` 使用 rewrites 将短路径映射到 HTML 文件：

| URL | 文件 |
| --- | --- |
| `/` | `/index.html` |
| `/index` | `/index.html` |
| `/intake` | `/intake.html` |
| `/report` | `/report.html` |
| `/modules` | `/modules.html` |
| `/ipo` | `/ipo.html` |

新增页面时需要在 `vercel.json` 中增加对应 rewrite。

## 缓存策略

当前 `vercel.json` 定义：

- HTML：`public, max-age=0, must-revalidate`
- CSS：`public, max-age=31536000, immutable`
- SVG：`public, max-age=86400`

因为 CSS 是长缓存，修改 `rvc-base.css` 后必须更新 HTML 引用中的版本参数：

```html
<link rel="stylesheet" href="rvc-base.css?v=20260527-2">
```

例如改为：

```html
<link rel="stylesheet" href="rvc-base.css?v=20260529-1">
```

需要全局更新所有 HTML 页面，确保样式版本一致。

## 部署忽略文件

`.vercelignore` 当前会排除：

- `.DS_Store`
- `.claude/`
- `.git/`
- `*.log`
- `.~*`
- `*.docx`
- `*.pdf`
- `image*`

这些文件不会进入 Vercel 部署包。新增运行时图片时，不要命名为 `image...`，否则会被排除。

## 手动部署

在项目根目录执行：

```bash
cd /Users/zihaozhang/Downloads/UIdesign/rvc
vercel --prod
```

部署完成后检查：

```text
https://rvc-chi.vercel.app/
https://rvc-chi.vercel.app/intake
https://rvc-chi.vercel.app/report
https://rvc-chi.vercel.app/modules
https://rvc-chi.vercel.app/ipo
```

## Git 集成部署

当前 Git remote：

```text
https://github.com/nicksnowz/rvcai_ui.git
```

如果 Vercel 已开启 GitHub 自动部署，推荐流程：

```bash
git status
git add README.md DESIGN.md DEPLOYMENT.md
git commit -m "Add project documentation"
git push origin main
```

实际分支名以团队仓库为准。推送后在 Vercel 控制台查看 Production Deployment 状态。

## 发布前检查清单

- 所有页面能在本地打开，无明显控制台错误。
- 桌面端导航 active 状态正确。
- 移动端横向 nav 可滚动且不遮挡内容。
- `/intake`、`/report`、`/modules`、`/ipo` 短路径在 Vercel 可访问。
- 修改共享 CSS 后已更新所有 HTML 的 `rvc-base.css?v=...`。
- 运行时需要的图片没有被 `.vercelignore` 排除。
- `index.html` 的 `/og-cover.png` 如继续保留，应确认文件存在并已部署。

## 常见问题

### 页面在 Vercel 上 404

检查 `vercel.json` 是否包含对应 rewrite。静态文件名路径如 `/intake.html` 通常可直接访问，短路径 `/intake` 依赖 rewrite。

### 样式线上没有更新

CSS 设置了 immutable 长缓存。更新 `rvc-base.css` 后，需要同步更新 HTML 中的版本查询参数。

### 图片本地有、线上没有

检查 `.vercelignore`。当前 `image*` 会被排除，适合设计稿原图，但不适合运行时图片。

### Remotion 视频是否会部署

主站不依赖 `demo-video/`。该目录不是线上主站运行必需资源。若后续要把视频嵌入网站，建议只部署压缩后的最终 mp4，并在 HTML 中显式引用。
