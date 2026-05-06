# 东莞中元华信财税服务有限公司 - 网站开发实施计划

## 一、技术栈确认
- **框架**: Nuxt.js 3 (Vue 3) - 服务端渲染 (SSR) 确保 SEO 友好
- **样式**: Tailwind CSS - 原子化 CSS，快速构建黑白灰高端风格
- **图标**: Heroicons / SVG
- **部署**: 静态生成 (SSG) 或 服务端渲染 (SSR)，适配现有服务器
- **内容管理**: 初期硬编码 (易于 SEO 控制)，后期可接入 Headless CMS

## 二、开发步骤规划

### 第一阶段：项目初始化与环境搭建 (预计 2 小时)
1. 初始化 Nuxt 3 项目
2. 配置 Tailwind CSS
3. 配置 SEO 模块 (@nuxtjs/seo)
4. 建立基础目录结构 (components, pages, assets, public)

### 第二阶段：核心组件开发 (预计 4 小时)
1. **Header**: 响应式导航，包含电话/微信入口
2. **Footer**: 版权信息，快速链接，备案号
3. **Hero Section**: 首屏展示，突出"外资代表处"与"税务合规"
4. **Service Cards**: 服务展示组件 (注册/筹划/合规)
5. **Contact Floating**: 悬浮联系栏 (电话/微信)
6. **SEO Meta**: 全局 Meta 标签配置组件

### 第三阶段：页面开发与内容填充 (预计 4 小时)
1. **首页 (index.vue)**: 
   - 核心价值主张
   - 三大核心服务
   - 为什么选择我们 (外资专长)
   - 行动号召 (CTA)
2. **关于我们 (about.vue)**: 公司简介，专注初创与外资
3. **服务项目 (services.vue)**: 详细服务列表
4. **联系我们 (contact.vue)**: 地图，表单，联系方式

### 第四阶段：SEO 深度优化 (预计 2 小时)
1. 配置 `nuxt.config.ts` 中的 SEO 元数据
2. 为每个页面设置独特的 Title, Description, Keywords
3. 添加 Schema.org 结构化数据 (LocalBusiness)
4. 生成 sitemap.xml 和 robots.txt
5. 图片懒加载与 Alt 标签优化

### 第五阶段：测试与构建 (预计 2 小时)
1. 移动端适配测试
2. 性能测试 (Lighthouse)
3. 生产环境构建 (`npm run build`)
4. 部署指南编写

## 三、文件结构预览
```
/workspace
├── nuxt.config.ts          # 核心配置 (SEO, 站点信息)
├── tailwind.config.js      # 样式配置 (黑白灰主题)
├── app.vue                 # 根组件
├── components/
│   ├── AppHeader.vue       # 顶部导航
│   ├── AppFooter.vue       # 底部信息
│   ├── HeroSection.vue     # 首屏海报
│   ├── ServiceCard.vue     # 服务卡片
│   └── ContactFloat.vue    # 悬浮联系
├── pages/
│   ├── index.vue           # 首页
│   ├── about.vue           # 关于
│   ├── services.vue        # 服务
│   └── contact.vue         # 联系
├── assets/
│   └── css/
│       └── main.css        # 全局样式
└── public/
    ├── robots.txt
    └── favicon.ico
```

## 四、项目交付

网站已完成开发，文件位于 `/workspace/zh-yh-finance/` 目录。

### 已交付文件
- `index.html` - 主页面（包含完整 SEO 优化）
- `css/style.css` - 高端黑白灰样式
- `js/main.js` - 交互功能脚本
- `public/robots.txt` - 搜索引擎爬虫配置
- `public/sitemap.xml` - 站点地图
- `README.md` - 详细部署文档

### 下一步操作
1. **替换联系信息**：在 index.html 中搜索 "XXXXXXXX" 替换为真实电话和地址
2. **添加微信二维码**：将二维码图片放入 images 文件夹并更新 HTML
3. **上传到服务器**：将所有文件上传到已有服务器
4. **配置域名解析**：确保域名指向服务器 IP
5. **启用 HTTPS**：安装 SSL 证书（推荐使用 Let's Encrypt）
6. **提交搜索引擎**：向百度和 Google 提交 sitemap

### 测试建议
- 在 Chrome、Firefox、Safari 和移动端浏览器测试
- 使用 Google PageSpeed Insights 测试性能
- 使用百度搜索资源平台验证 SEO 效果
