# Joely Portfolio

这是一个纯静态个人网站，可以直接部署到 GitHub Pages、Vercel 或 Netlify。

## 页面

- `index.html`：首页
- `about.html`：个人信息
- `projects.html`：能力作品
- `works.html`：落地作品
- `play.html`：趣味实验
- `ai-signal.html`：AI 高精资讯筛选助手文本原型
- `product-teardown/index.html`：AI 产品拆解卡片生成器

## GitHub Pages 发布步骤

1. 在 GitHub 新建一个公开仓库，例如 `joely-portfolio`。
2. 把本文件夹里的所有文件上传到仓库根目录。
3. 打开仓库的 `Settings`。
4. 进入 `Pages`。
5. `Build and deployment` 选择：
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
6. 保存后等待 1-3 分钟，GitHub 会生成一个公开网址。

公开网址通常类似：

```text
https://你的GitHub用户名.github.io/joely-portfolio/
```

## 后续修改

修改本地 HTML、CSS、图片或 GIF 后，再上传覆盖 GitHub 仓库里的对应文件即可。GitHub Pages 会自动更新公开网页。
