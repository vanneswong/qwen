/**
 * 博客模块
 * 博客列表、详情、分类筛选功能
 */

class BlogManager {
  constructor() {
    this.blogData = null;
    this.currentCategory = 'all';
    this.currentPage = 1;
    this.perPage = 6;
  }

  /**
   * 初始化博客模块
   */
  async init() {
    try {
      await this.loadData();
      this.setupFilterButtons();
      this.renderBlogList();
      console.log('BlogManager initialized');
    } catch (error) {
      console.error('BlogManager initialization error:', error);
    }
  }

  /**
   * 加载博客数据
   */
  async loadData() {
    try {
      const res = await fetch('/data/blog.json');
      this.blogData = await res.json();
      this.perPage = this.blogData.perPage || 6;
    } catch (error) {
      console.error('Error loading blog data:', error);
    }
  }

  /**
   * 设置筛选按钮
   */
  setupFilterButtons() {
    const filterContainer = document.querySelector('.blog-filter');
    if (!filterContainer || !this.blogData) return;

    // 添加"全部"按钮
    filterContainer.innerHTML = `
      <button class="filter-btn active" data-category="all">${i18n.getText('labels.allCategories')}</button>
      ${this.blogData.categories.map(cat => `
        <button class="filter-btn" data-category="${cat.id}">${i18n.getBilingual(cat, 'name')}</button>
      `).join('')}
    `;

    // 添加点击事件
    filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.filterByCategory(btn.getAttribute('data-category'));
      });
    });
  }

  /**
   * 按分类筛选
   * @param {string} category - 分类ID或'all'
   */
  filterByCategory(category) {
    this.currentCategory = category;
    this.currentPage = 1;

    // 更新按钮状态
    document.querySelectorAll('.filter-btn').forEach(btn => {
      if (btn.getAttribute('data-category') === category) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    this.renderBlogList();
  }

  /**
   * 渲染博客列表
   */
  renderBlogList() {
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid || !this.blogData) return;

    let articles = this.blogData.articles;

    // 按分类筛选
    if (this.currentCategory !== 'all') {
      articles = articles.filter(a => a.category === this.currentCategory);
    }

    // 分页
    const start = (this.currentPage - 1) * this.perPage;
    const end = start + this.perPage;
    articles = articles.slice(start, end);

    if (articles.length === 0) {
      blogGrid.innerHTML = `<div class="blog-empty">${i18n.getText('labels.blog.noArticles')}</div>`;
      return;
    }

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

    // 渲染分页
    this.renderPagination();
  }

  /**
   * 渲染分页
   */
  renderPagination() {
    const paginationContainer = document.querySelector('.blog-pagination');
    if (!paginationContainer || !this.blogData) return;

    let totalArticles = this.blogData.articles.length;
    if (this.currentCategory !== 'all') {
      totalArticles = this.blogData.articles.filter(a => a.category === this.currentCategory).length;
    }

    const totalPages = Math.ceil(totalArticles / this.perPage);

    if (totalPages <= 1) {
      paginationContainer.innerHTML = '';
      return;
    }

    paginationContainer.innerHTML = `
      <button class="page-btn prev" ${this.currentPage === 1 ? 'disabled' : ''}>上一页</button>
      <div class="page-numbers">
        ${Array.from({ length: totalPages }, (_, i) => i + 1).map(page => `
          <button class="page-num ${page === this.currentPage ? 'active' : ''}">${page}</button>
        `).join('')}
      </div>
      <button class="page-btn next" ${this.currentPage === totalPages ? 'disabled' : ''}>下一页</button>
    `;

    // 添加事件
    paginationContainer.querySelector('.prev')?.addEventListener('click', () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.renderBlogList();
      }
    });

    paginationContainer.querySelector('.next')?.addEventListener('click', () => {
      if (this.currentPage < totalPages) {
        this.currentPage++;
        this.renderBlogList();
      }
    });

    paginationContainer.querySelectorAll('.page-num').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentPage = parseInt(btn.textContent);
        this.renderBlogList();
      });
    });
  }

  /**
   * 渲染博客详情页
   * @param {number} articleId - 文章ID
   */
  renderBlogDetail(articleId) {
    const article = this.blogData.articles.find(a => a.id === articleId);
    if (!article) {
      console.error('Article not found:', articleId);
      return;
    }

    // 更新页面标题
    document.title = `${i18n.getBilingual(article, 'title')} - ${i18n.getConfig('site.name')}`;

    // 渲染头部
    const header = document.querySelector('.blog-detail-header');
    if (header) {
      header.innerHTML = `
        <span class="blog-card-category">${this.getCategoryName(article.category)}</span>
        <h1 class="page-title">${i18n.getBilingual(article, 'title')}</h1>
        <p class="page-subtitle">${article.date} | ${i18n.getBilingual(article, 'author')}</p>
        <div class="breadcrumb">
          <a href="/index.html">${i18n.getText('labels.backHome')}</a> >
          <a href="/blog.html">${i18n.getText('labels.blog.pageTitle')}</a> >
          <span>${i18n.getBilingual(article, 'title')}</span>
        </div>
      `;
    }

    // 渲染内容
    const content = document.querySelector('.blog-detail-content');
    if (content) {
      content.innerHTML = `
        <p>${i18n.getBilingual(article, 'content')}</p>
      `;
    }

    // 渲染相关文章
    this.renderRelatedArticles(article);
  }

  /**
   * 渲染相关文章
   * @param {object} currentArticle - 当前文章
   */
  renderRelatedArticles(currentArticle) {
    const relatedContainer = document.querySelector('.related-articles');
    if (!relatedContainer || !this.blogData) return;

    // 找同分类或同标签的文章
    const related = this.blogData.articles
      .filter(a => a.id !== currentArticle.id && a.category === currentArticle.category)
      .slice(0, 3);

    if (related.length === 0) {
      relatedContainer.innerHTML = '';
      return;
    }

    relatedContainer.innerHTML = `
      <h3>${i18n.getText('labels.relatedArticles')}</h3>
      <div class="blog-grid">
        ${related.map(article => `
          <div class="blog-card" data-article-id="${article.id}">
            <div class="blog-card-image">
              ${this.getCategoryIcon(article.category)}
            </div>
            <div class="blog-card-content">
              <span class="blog-card-category">${this.getCategoryName(article.category)}</span>
              <h4>${i18n.getBilingual(article, 'title')}</h4>
              <p>${i18n.getBilingual(article, 'summary')}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;
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
    const cat = this.blogData.categories.find(c => c.id === category);
    return cat ? i18n.getBilingual(cat, 'name') : '';
  }
}

// 创建全局实例
const blogManager = new BlogManager();

// 导出
window.blogManager = blogManager;