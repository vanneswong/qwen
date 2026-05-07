# 东莞中元华信财税服务有限公司 - 企业网站

## 项目简介
这是一个为东莞中元华信财税服务有限公司打造的现代化企业网站，采用高端黑白灰设计风格，专注于展示外资代表处注册、税务筹划和税务合规服务。

## 技术栈
- **HTML5** - 语义化标记，SEO 友好
- **CSS3** - 自定义变量，响应式设计
- **JavaScript (原生)** - 轻量级交互功能
- **无框架依赖** - 极致性能，快速加载

## 目录结构
```
zh-yh-finance/
├── index.html          # 主页面
├── css/
│   └── style.css       # 样式文件
├── js/
│   └── main.js         # JavaScript 逻辑
├── images/             # 图片资源
├── public/
│   ├── robots.txt      # 搜索引擎爬虫配置
│   └── sitemap.xml     # 站点地图
└── README.md           # 项目说明
```

## SEO 优化特性
1. **语义化 HTML** - 使用正确的标签结构
2. **Meta 标签优化** - Title, Description, Keywords
3. **结构化数据** - Schema.org LocalBusiness 标记
4. **移动端适配** - 响应式设计
5. **快速加载** - 无框架依赖，最小化 HTTP 请求
6. **Sitemap & Robots.txt** - 搜索引擎友好

## 核心功能
- ✅ 响应式导航栏（移动端汉堡菜单）
- ✅ 平滑滚动锚点链接
- ✅ 在线咨询表单
- ✅ 悬浮联系按钮（电话/微信）
- ✅ 表单验证与提交通知
- ✅ 滚动动画效果

## 部署指南

### 方法一：直接上传到服务器
1. 将整个 `zh-yh-finance` 目录内容上传到服务器 web 根目录
2. 确保服务器支持静态文件服务（Nginx/Apache）
3. 访问域名即可看到网站

### 方法二：使用 Nginx 配置
```nginx
server {
    listen 80;
    server_name www.zh-yh-finance.com zh-yh-finance.com;
    
    root /var/www/zh-yh-finance;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    
    # 缓存静态资源
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 方法三：使用 Apache 配置
```apache
<VirtualHost *:80>
    ServerName www.zh-yh-finance.com
    DocumentRoot /var/www/zh-yh-finance
    
    <Directory /var/www/zh-yh-finance>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

## 自定义配置

### 需要修改的内容
在 `index.html` 中搜索并替换以下内容：
- `+86-769-XXXXXXXX` → 实际联系电话
- `广东省东莞市 XXXX 区 XXXX 路 XX 号` → 实际地址
- `info@zh-yh-finance.com` → 实际邮箱
- `粤 ICP 备 XXXXXXXX 号` → 实际备案号
- 微信二维码区域可替换为真实二维码图片

### 添加微信二维码
1. 将二维码图片保存到 `images/wechat-qr.png`
2. 在 `index.html` 中找到 `.qr-placeholder` div
3. 替换为：`<img src="/images/wechat-qr.png" alt="微信二维码" width="150">`

## 浏览器支持
- Chrome (最新)
- Firefox (最新)
- Safari (最新)
- Edge (最新)
- 移动端浏览器 (iOS Safari, Android Chrome)

## 性能优化建议
1. 启用 Gzip 压缩
2. 使用 CDN 加速静态资源
3. 开启浏览器缓存
4. 图片使用 WebP 格式
5. 启用 HTTPS

## 后续扩展
- 添加多语言支持（中英文）
- 集成在线客服系统
- 添加博客/新闻模块
- 接入统计分析工具（百度统计/Google Analytics）

## 联系方式
如有问题或需要技术支持，请联系开发团队。

---
© 2024 东莞中元华信财税服务有限公司
