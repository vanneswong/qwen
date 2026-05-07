/**
 * 东莞中元华信财税服务有限公司
 * 主 JavaScript 文件
 * 整合所有模块，初始化页面功能
 */

document.addEventListener('DOMContentLoaded', async function() {
  console.log('%c东莞中元华信财税服务有限公司', 'font-size: 20px; font-weight: bold; color: #1E3A5F;');
  console.log('%c专注外资代表处注册与税务合规', 'font-size: 14px; color: #4A90D9;');

  // 初始化国际化
  await i18n.init();

  // 初始化渲染器
  await renderer.init();

  // 渲染页面内容
  renderer.renderAll();

  // 设置移动端菜单
  setupMobileMenu();

  // 设置滚动效果
  setupScrollEffects();

  // 设置平滑滚动
  setupSmoothScroll();

  // 设置联系表单
  setupContactForm();

  // 设置悬浮联系按钮
  setupFloatingContact();

  // 检测页面类型，初始化特定模块
  const currentPage = getCurrentPage();

  if (currentPage === 'blog') {
    await blogManager.init();
  } else if (currentPage === 'blog-detail') {
    await blogManager.loadData();
    const articleId = getQueryParam('id');
    if (articleId) {
      blogManager.renderBlogDetail(parseInt(articleId));
    }
  } else if (currentPage === 'service-detail') {
    await serviceFlow.loadData();
    renderServiceDetail();
  } else if (currentPage === 'index') {
    await serviceFlow.init();
  }

  // 语言变更监听
  i18n.addListener((lang) => {
    renderer.renderAll();
    if (currentPage === 'blog') {
      blogManager.renderBlogList();
    }
  });
});

/**
 * 获取当前页面类型
 */
function getCurrentPage() {
  const path = window.location.pathname;
  if (path.includes('blog.html')) return 'blog';
  if (path.includes('blog-detail.html')) return 'blog-detail';
  if (path.includes('service-')) return 'service-detail';
  return 'index';
}

/**
 * 获取URL查询参数
 */
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

/**
 * 设置移动端菜单
 */
function setupMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      navMenu.classList.toggle('active');

      const spans = mobileMenuBtn.querySelectorAll('span');
      if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        const spans = mobileMenuBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }
}

/**
 * 设置滚动效果
 */
function setupScrollEffects() {
  const header = document.querySelector('.header');

  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // 导航高亮
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', function() {
    const scrollPosition = window.pageYOffset + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-menu a').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/**
 * 设置平滑滚动
 */
function setupSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerHeight = 72;
          const targetPosition = target.offsetTop - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

/**
 * 设置联系表单
 */
function setupContactForm() {
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      if (!data.name || !data.phone) {
        showNotification(i18n.getText('labels.notifications.error'), 'error');
        return;
      }

      console.log('Form submitted:', data);
      showNotification(i18n.getText('labels.notifications.success'), 'success');
      contactForm.reset();
    });
  }
}

/**
 * 设置悬浮联系按钮
 */
function setupFloatingContact() {
  const floatWechat = document.querySelector('.float-wechat');

  if (floatWechat) {
    floatWechat.addEventListener('click', function(e) {
      e.preventDefault();
      const contactSection = document.querySelector('#contact');
      if (contactSection) {
        const headerHeight = 72;
        window.scrollTo({
          top: contactSection.offsetTop - headerHeight,
          behavior: 'smooth'
        });
      }
    });
  }
}

/**
 * 显示通知
 */
function showNotification(message, type = 'info') {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '1rem 2rem',
    borderRadius: '8px',
    color: '#fff',
    fontWeight: '500',
    zIndex: '9999',
    boxShadow: '0 4px 12px rgba(30, 58, 95, 0.15)',
    animation: 'slideIn 0.3s ease'
  });

  if (type === 'success') {
    notification.style.backgroundColor = '#10B981';
  } else if (type === 'error') {
    notification.style.backgroundColor = '#EF4444';
  } else {
    notification.style.backgroundColor = '#4A90D9';
  }

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/**
 * 渲染服务详情页
 */
async function renderServiceDetail() {
  const serviceId = getServiceIdFromUrl();
  if (!serviceId) return;

  const service = renderer.getServiceData(serviceId);
  if (!service) return;

  // 更新页面标题
  document.title = `${i18n.getBilingual(service, 'title')} - ${i18n.getConfig('site.name')}`;

  // 渲染Hero
  const pageHero = document.querySelector('.page-hero-content');
  if (pageHero) {
    pageHero.innerHTML = `
      <h1 class="page-title">${serviceFlow.getIconHTML(service.icon)} ${i18n.getBilingual(service, 'title')}</h1>
      <p class="page-subtitle">${i18n.getBilingual(service, 'summary')}</p>
      <div class="breadcrumb">
        <a href="/index.html">${i18n.getText('labels.backHome')}</a> >
        <a href="/index.html#services">${i18n.getText('labels.selectService')}</a> >
        <span>${i18n.getBilingual(service, 'title')}</span>
      </div>
    `;
  }

  // 渲染简介
  const serviceIntro = document.querySelector('.service-intro');
  if (serviceIntro && service.detail) {
    serviceIntro.innerHTML = `
      <h2>${i18n.getText('labels.about.title') || '服务概述'}</h2>
      <p>${i18n.getBilingual(service.detail, 'intro')}</p>
    `;
  }

  // 渲染优势
  renderServiceAdvantages(service.detail?.advantages);

  // 渲染服务内容
  renderServiceSections(service.detail?.sections);

  // 渲染流程
  renderServiceProcess(service.detail?.process);

  // 渲染FAQ
  renderServiceFAQ(service.detail?.faqs);
}

/**
 * 从URL获取服务ID
 */
function getServiceIdFromUrl() {
  const path = window.location.pathname;
  const match = path.match(/service-(.+)\.html/);
  return match ? match[1] : null;
}

/**
 * 渲染服务优势
 */
function renderServiceAdvantages(advantages) {
  const featuresGrid = document.querySelector('.features-grid');
  if (!featuresGrid || !advantages) return;

  featuresGrid.innerHTML = advantages.map(adv => `
    <div class="feature-box">
      <div class="feature-box-icon">${serviceFlow.getIconHTML(adv.icon)}</div>
      <h4>${i18n.getBilingual(adv, 'title')}</h4>
      <p>${i18n.getBilingual(adv, 'desc')}</p>
    </div>
  `).join('');
}

/**
 * 渲染服务内容区块
 */
function renderServiceSections(sections) {
  const contentBlocks = document.querySelector('.content-blocks');
  if (!contentBlocks || !sections) return;

  contentBlocks.innerHTML = sections.map(section => `
    <div class="content-block">
      <h3>${i18n.getBilingual(section, 'title')}</h3>
      <p>${i18n.getBilingual(section, 'desc')}</p>
      <ul>
        ${section.items.map((item, index) => `
          <li>${i18n.getBilingual({ item, itemEn: section.itemsEn[index] }, 'item')}</li>
        `).join('')}
      </ul>
    </div>
  `).join('');
}

/**
 * 渲染服务流程
 */
function renderServiceProcess(process) {
  const processSteps = document.querySelector('.process-steps-grid');
  if (!processSteps || !process) return;

  processSteps.innerHTML = process.map(step => `
    <div class="step-card">
      <div class="step-number">${step.step}</div>
      <h4>${i18n.getBilingual(step, 'title')}</h4>
      <p>${i18n.getBilingual(step, 'desc')}</p>
    </div>
  `).join('');
}

/**
 * 渲染FAQ
 */
function renderServiceFAQ(faqs) {
  const faqList = document.querySelector('.faq-list');
  if (!faqList || !faqs) return;

  faqList.innerHTML = faqs.map(faq => `
    <div class="faq-item">
      <h4>Q: ${i18n.getBilingual(faq, 'q')}</h4>
      <p>A: ${i18n.getBilingual(faq, 'a')}</p>
    </div>
  `).join('');
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);