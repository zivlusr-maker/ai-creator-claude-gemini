# ✦ AI 电商创作工作台

一个专为服装电商设计师打造的 **AI 全功能创作工具平台**，包含 12 大核心功能模块。

在线预览：<https://ai-creator-claude-gemini-fix.vercel.app>

![预览](https://img.shields.io/badge/版本-v1.0.0-gold) ![框架](https://img.shields.io/badge/框架-原生HTML/CSS/JS-blue) ![授权](https://img.shields.io/badge/授权-MIT-green)

---

## 🚀 功能模块

| # | 功能 | 描述 |
|---|------|------|
| 1 | 🖼 **图片生成** | 上传服装图，选择提示词，AI 生成模特展示图 |
| 2 | 🎬 **视频生成** | 静态图片转动态展示视频 |
| 3 | 🔍 **反推提示词** | 上传图片，自动分析并生成提示词 |
| 4 | 📐 **视频高清放大** | AI 超分辨率，最高支持 4K 输出 |
| 5 | 🕺 **动作模版/人物替换** | 选动作模板或替换视频中的人物 |
| 6 | 🧑‍💻 **数字人** | 创建 AI 品牌代言人，生成讲解视频 |
| 7 | 💬 **AI 对话** | 与 AI 助手对话，获取创作建议 |
| 8 | 🗑 **图片去水印** | AI 智能去除图片水印 |
| 9 | ✂️ **视频去水印** | 去除视频中的水印、台标等 |
| 10 | ⚡ **批量生成** | 批量导入，一键生成所有展示图 |
| 11 | 🗺 **无限画布** | 可视化工作流拖拽编排 |
| 12 | 🛒 **电商详情页生成** | 一键生成完整电商产品详情页 |

---

## 📚 提示词词库

内置完整的女装 & 男装提示词词库，按分类组织：

**女装词库**：模特风格、服装品类、材质面料、颜色风格、场景氛围、光线效果、姿势动态、细节展示、图像质量

**男装词库**：模特风格、服装品类、材质面料、颜色风格、场景氛围、光线效果、姿势动态、细节展示、图像质量

---

## 🛠 技术栈

- **前端框架**：原生 HTML5 + CSS3 + Vanilla JavaScript（无依赖）
- **字体**：Google Fonts（Noto Serif SC + Noto Sans SC）
- **设计风格**：深色主题，东方现代美学，金色强调色

---

## 📦 快速开始

### 方法一：直接打开（推荐）
```bash
# 克隆项目
git clone https://github.com/zivlusr-maker/ai-creator-claude-gemini.git
cd ai-creator-claude-gemini

# 直接用浏览器打开
open index.html
```

### 方法二：本地服务器
```bash
# Python 3
python3 -m http.server 8080

# Node.js（需要 npx）
npx serve .
```
然后访问 `http://localhost:8080`

---

## 📁 项目结构

```
ai-fashion-studio/
├── index.html          # 主入口文件
├── css/
│   └── main.css        # 全局样式
├── js/
│   ├── prompts.js      # 提示词词库（女装+男装）
│   └── app.js          # 主应用逻辑（12个功能页面）
└── README.md
```

---

## 🔗 Gemini API

当前版本已经接入真实 Google Gemini API：

- 图片生成：Gemini 3.1 Flash Image
- 视频生成与编辑：Gemini Omni 1.1 Flash
- 对话、图片分析和电商详情文案：Gemini 3.8 Flash

在页面的“API 设置”中填写 Google Gemini API Key。Key 仅保存在当前浏览器的 `localStorage`，不会提交到本仓库。请勿把真实 Key 写进代码或公开提交。

---

## 🎨 自定义

### 修改配色主题
编辑 `css/main.css` 顶部的 CSS 变量：
```css
:root {
  --accent-gold:  #c9a84c;  /* 主强调色 */
  --bg-base:      #0d0d0f;  /* 背景色 */
  /* ... */
}
```

### 添加提示词
编辑 `js/prompts.js`，在对应分类下添加新标签：
```javascript
window.PROMPTS.women.category.tags.push('新品类名称');
```

---

## 📄 License

MIT License — 自由使用，欢迎贡献！

