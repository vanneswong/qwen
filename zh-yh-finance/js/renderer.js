/**
 * 动态渲染器
 * 根据JSON数据动态渲染页面内容
 */

class Renderer {
  constructor() {
    this.config = null;
    this.services = null;
    this.blog = null;
    this.initialized = false;
  }

  /**
   * 初始化渲染器
   */
  async init() {
    try {
      await this.loadData();
      this.initialized = true;
      console.log('Renderer initialized');
    } catch (error) {
      console.error('Renderer initialization error:', error);
    }
  }

  /**
   * 加载所有数据文件
   */
  async loadData() {
    try {
      const [configRes, servicesRes, blogRes] = await Promise.all([
        fetch('/data/config.json'),
        fetch('/data/services.json'),
        fetch('/data/blog.json')
      ]);

      this.config = await configRes.json();
      this.services = await servicesRes.json();
      this.blog = await blogRes.json();
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  /**
   * 渲染导航栏
   */
  renderNav() {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu || !this.config) return;

    const navItems = this.config.nav.items || [];
    navMenu.innerHTML = navItems.map(item => {
      const label = i18n.getBilingual(item, 'label');
      return `<li><a href="${item.href}">${label}</a></li>`;
    }).join('');
  }

  /**
   * 渲染Hero区域
   */
  renderHero() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroStats = document.querySelector('.hero-stats');

    if (!this.config) return;

    if (heroTitle) {
      heroTitle.innerHTML = `${i18n.getBilingual(this.config.hero, 'title')}<br><span class="highlight">${i18n.getBilingual(this.config.hero, 'titleLine2')}</span>`;
    }

    if (heroSubtitle) {
      heroSubtitle.textContent = i18n.getBilingual(this.config.hero, 'subtitle');
    }

    if (heroStats && this.config.about.stats) {
      heroStats.innerHTML = this.config.about.stats.map(stat => `
        <div class="stat-item">
          <div class="stat-value">${stat.value}</div>
          <div class="stat-label">${i18n.getBilingual(stat, 'label')}</div>
        </div>
      `).join('');
    }
  }

  /**
   * 渲染服务卡片
   */
  renderServices() {
    const servicesGrid = document.querySelector('.services-grid');
    if (!servicesGrid || !this.services) return;

    const services = this.services.services || [];
    servicesGrid.innerHTML = services.map(service => `
      <div class="service-card" data-service-id="${service.id}">
        <div class="service-icon">
          ${this.getIconHTML(service.icon)}
        </div>
        <h3>${i18n.getBilingual(service, 'title')}</h3>
        <p class="summary">${i18n.getBilingual(service, 'summary')}</p>
        <ul class="service-features">
          ${(service.features || []).slice(0, 4).map((feature, index) => `
            <li>${i18n.getBilingual({ feature, featureEn: service.featuresEn[index] }, 'feature')}</li>
          `).join('')}
        </ul>
        <div class="service-meta">
          <div class="service-meta-item">
            <span class="icon">💰</span>
            <span>¥${service.priceRange}</span>
          </div>
          <div class="service-meta-item">
            <span class="icon">⏱</span>
            <span>${service.duration} ${i18n.getBilingual({ durationUnit: service.durationUnit, durationUnitEn: service.durationUnitEn }, 'durationUnit')}</span>
          </div>
        </div>
        <a href="/service-${service.id}.html" class="btn btn-secondary btn-sm" data-i18n="labels.viewDetails">${i18n.getText('labels.viewDetails')}</a>
      </div>
    `).join('');
  }

  /**
   * 渲染关于我们区域
   */
  renderAbout() {
    const aboutFeatures = document.querySelector('.about-features');
    const aboutIntro = document.querySelector('.about-intro');

    if (!this.config) return;

    if (aboutIntro) {
      aboutIntro.textContent = i18n.getBilingual(this.config.about, 'intro');
    }

    if (aboutFeatures && this.config.about.features) {
      aboutFeatures.innerHTML = this.config.about.features.map(feature => `
        <div class="feature-item">
          <div class="feature-icon">
            ${this.getIconHTML(feature.icon)}
          </div>
          <div class="feature-text">
            <h4>${i18n.getBilingual(feature, 'title')}</h4>
            <p>${i18n.getBilingual(feature, 'desc')}</p>
          </div>
        </div>
      `).join('');
    }
  }

  /**
   * 渲染CTA区域
   */
  renderCTA() {
    const ctaTitle = document.querySelector('.cta-content h2');
    const ctaSubtitle = document.querySelector('.cta-content p');

    if (!this.config) return;

    if (ctaTitle) {
      ctaTitle.textContent = i18n.getBilingual(this.config.cta, 'title');
    }

    if (ctaSubtitle) {
      ctaSubtitle.textContent = i18n.getBilingual(this.config.cta, 'subtitle');
    }
  }

  /**
   * 渲染联系信息
   */
  renderContact() {
    const contactInfo = document.querySelector('.contact-info');
    if (!contactInfo || !this.config) return;

    const contact = this.config.contact;
    contactInfo.innerHTML = `
      <div class="contact-item">
        <div class="contact-icon">📍</div>
        <div class="contact-detail">
          <h4 data-i18n="labels.materialsRequired">公司地址</h4>
          <p>${i18n.getBilingual(contact, 'address')}</p>
        </div>
      </div>
      <div class="contact-item">
        <div class="contact-icon">📞</div>
        <div class="contact-detail">
          <h4>联系电话</h4>
          <p><a href="tel:${contact.phone}">${contact.phone}</a></p>
        </div>
      </div>
      <div class="contact-item">
        <div class="contact-icon">💬</div>
        <div class="contact-detail">
          <h4>微信咨询</h4>
          <p>${i18n.getBilingual(contact, 'wechat')}</p>
          <div class="wechat-qr">
            <div class="qr-placeholder">
              <span>微信二维码</span>
            </div>
          </div>
        </div>
      </div>
      <div class="contact-item">
        <div class="contact-icon">✉️</div>
        <div class="contact-detail">
          <h4>电子邮箱</h4>
          <p><a href="mailto:${contact.email}">${contact.email}</a></p>
        </div>
      </div>
    `;
  }

  /**
   * 渲染页脚
   */
  renderFooter() {
    const footerContent = document.querySelector('.footer-content');
    const footerBottom = document.querySelector('.footer-bottom');

    if (!this.config) return;

    if (footerContent) {
      const footer = this.config.footer;
      const navItems = this.config.nav.items || [];
      const services = this.services.services || [];

      footerContent.innerHTML = `
        <div class="footer-section footer-brand">
          <div class="logo">
            <div class="logo-icon">ZH</div>
            <div class="logo-text">${this.config.site.name}</div>
          </div>
          <p>${footer.brand.desc}<br>${footer.brand.descLine2}</p>
        </div>
        <div class="footer-section">
          <h4>${i18n.getBilingual(footer.quickLinks, 'title')}</h4>
          <ul>
            ${navItems.map(item => `<li><a href="${item.href}">${i18n.getBilingual(item, 'label')}</a></li>`).join('')}
          </ul>
        </div>
        <div class="footer-section">
          <h4>${i18n.getBilingual(footer.services, 'title')}</h4>
          <ul>
            ${services.map(s => `<li><a href="/service-${s.id}.html">${i18n.getBilingual(s, 'title')}</a></li>`).join('')}
          </ul>
        </div>
        <div class="footer-section">
          <h4>${i18n.getBilingual(footer.contact, 'title')}</h4>
          <p>电话：${this.config.contact.phone}</p>
          <p>邮箱：${this.config.contact.email}</p>
        </div>
      `;
    }

    if (footerBottom) {
      footerBottom.innerHTML = `
        <p>&copy; 2024 ${this.config.site.fullName} ${i18n.getText('labels.footer.copyright')}</p>
        <p><a href="#">${this.config.contact.icp}</a></p>
      `;
    }
  }

  /**
   * 渲染博客卡片（首页用）
   */
  renderBlogCards(limit = 3) {
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid || !this.blog) return;

    const articles = this.blog.articles.slice(0, limit);
    blogGrid.innerHTML = articles.map(article => `
      <div class="blog-card" data-article-id="${article.id}">
        <div class="blog-card-image">
          ${this.getCategoryIcon(article.category)}
        </div>
        <div class="blog-card-content">
          <span class="blog-card-category">${this.getCategoryName(article.category)}</span>
          <h4>${i18n.getBilingual(article, 'title')}</h4>
          <p>${i18n.getBilingual(article, 'summary')}</p>
          <div class="blog-card-meta">
            <span>${article.date}</span>
            <span>${i18n.getBilingual(article, 'author')}</span>
          </div>
        </div>
      </div>
    `).join('');

    // 添加点击事件
    blogGrid.querySelectorAll('.blog-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-article-id');
        window.location.href = `/blog-detail.html?id=${id}`;
      });
    });
  }

  /**
   * 获取图标HTML
   */
  getIconHTML(iconName) {
    const icons = {
      'building': '🏢',
      'chart': '📊',
      'check': '✅',
      'specialist': '🌐',
      'team': '👥',
      'service': '🎯',
      'compliance': '🔒',
      'fast': '⚡',
      'accurate': '🎯',
      'transparent': '💰',
      'secure': '🔒',
      'legal': '⚖️',
      'expert': '👨‍💼',
      'custom': '📋',
      'update': '🔄',
      'thorough': '🔍',
      'preventive': '🛡️',
      'documented': '📝',
      'support': '🤝'
    };
    return icons[iconName] || '📌';
  }

  /**
   * 获取分类图标
   */
  getCategoryIcon(category) {
    const icons = {
      'policy': '📜',
      'guide': '📖',
      'foreign': '🌐',
      'startup': '🚀',
      'case': '📊'
    };
    return icons[category] || '📰';
  }

  /**
   * 获取分类名称
   */
  getCategoryName(category) {
    const cat = this.blog.categories.find(c => c.id === category);
    return cat ? i18n.getBilingual(cat, 'name') : '';
  }

  /**
   * 渲染所有内容
   */
  renderAll() {
    this.renderNav();
    this.renderHero();
    this.renderServices();
    this.renderAbout();
    this.renderCTA();
    this.renderContact();
    this.renderFooter();
    this.renderBlogCards();
  }

  /**
   * 获取服务数据
   */
  getServiceData(serviceId) {
    return this.services.services.find(s => s.id === serviceId);
  }

  /**
   * 获取所有服务数据
   */
  getAllServices() {
    return this.services.services;
  }

  /**
   * 获取博客数据
   */
  getBlogData() {
    return this.blog;
  }
}

// 创建全局实例
const renderer = new Renderer();

// 导出
window.renderer = renderer;