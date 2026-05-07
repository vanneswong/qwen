/**
 * 国际化模块 (Internationalization)
 * 多语言切换功能
 */

class I18n {
  constructor() {
    this.currentLang = 'zh';
    this.config = null;
    this.content = null;
    this.loaded = false;
    this.listeners = [];
  }

  /**
   * 初始化国际化
   */
  async init() {
    try {
      // 从localStorage获取保存的语言设置
      const savedLang = localStorage.getItem('lang');
      this.currentLang = savedLang || 'zh';

      // 加载配置和内容
      await this.loadData();

      // 应用语言
      this.applyLanguage();

      // 设置语言切换按钮事件
      this.setupLanguageSwitch();

      this.loaded = true;
      console.log('i18n initialized:', this.currentLang);
    } catch (error) {
      console.error('i18n initialization error:', error);
    }
  }

  /**
   * 加载数据文件
   */
  async loadData() {
    try {
      const [configRes, contentRes] = await Promise.all([
        fetch('/data/config.json'),
        fetch(`/data/content-${this.currentLang}.json`)
      ]);

      this.config = await configRes.json();
      this.content = await contentRes.json();
    } catch (error) {
      console.error('Error loading i18n data:', error);
    }
  }

  /**
   * 获取文本
   * @param {string} path - 文本路径，如 'labels.phoneConsult'
   * @returns {string} 翻译文本
   */
  getText(path) {
    if (!this.content) return '';

    const parts = path.split('.');
    let result = this.content;

    for (const part of parts) {
      if (result && result[part]) {
        result = result[part];
      } else {
        return '';
      }
    }

    return result;
  }

  /**
   * 获取配置数据
   * @param {string} path - 配置路径
   * @returns {*} 配置值
   */
  getConfig(path) {
    if (!this.config) return null;

    const parts = path.split('.');
    let result = this.config;

    for (const part of parts) {
      if (result && result[part]) {
        result = result[part];
      } else {
        return null;
      }
    }

    return result;
  }

  /**
   * 获取双语字段
   * @param {object} obj - 包含双语字段的对象
   * @param {string} field - 字段名（不带语言后缀）
   * @returns {string} 当前语言的值
   */
  getBilingual(obj, field) {
    if (!obj) return '';
    const suffix = this.currentLang === 'en' ? 'En' : '';
    return obj[field + suffix] || obj[field] || '';
  }

  /**
   * 切换语言
   * @param {string} lang - 目标语言 'zh' 或 'en'
   */
  async switchLanguage(lang) {
    if (lang === this.currentLang) return;

    this.currentLang = lang;
    localStorage.setItem('lang', lang);

    // 重新加载内容
    try {
      const contentRes = await fetch(`/data/content-${lang}.json`);
      this.content = await contentRes.json();
    } catch (error) {
      console.error('Error loading content:', error);
      return;
    }

    // 更新页面文本
    this.applyLanguage();

    // 更新语言切换按钮状态
    this.updateLanguageSwitch();

    // 触发语言变更事件
    this.notifyListeners();

    console.log('Language switched to:', lang);
  }

  /**
   * 应用语言到页面
   */
  applyLanguage() {
    // 更新页面标题
    const seoTitle = this.getText('seo.index.title');
    if (seoTitle) {
      document.title = seoTitle;
    }

    // 更新所有带有 data-i18n 属性的元素
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const path = el.getAttribute('data-i18n');
      const text = this.getText(path);
      if (text) {
        el.textContent = text;
      }
    });

    // 更新所有带有 data-i18n-placeholder 属性的元素
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const path = el.getAttribute('data-i18n-placeholder');
      const text = this.getText(path);
      if (text) {
        el.placeholder = text;
      }
    });

    // 更新所有带有 data-i18n-title 属性的元素
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const path = el.getAttribute('data-i18n-title');
      const text = this.getText(path);
      if (text) {
        el.title = text;
      }
    });
  }

  /**
   * 设置语言切换按钮
   */
  setupLanguageSwitch() {
    const switchBtn = document.querySelector('.language-switch');
    if (!switchBtn) return;

    const langOptions = switchBtn.querySelectorAll('.lang-option');
    langOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = option.getAttribute('data-lang');
        if (lang) {
          this.switchLanguage(lang);
        }
      });
    });

    this.updateLanguageSwitch();
  }

  /**
   * 更新语言切换按钮状态
   */
  updateLanguageSwitch() {
    const switchBtn = document.querySelector('.language-switch');
    if (!switchBtn) return;

    const langOptions = switchBtn.querySelectorAll('.lang-option');
    langOptions.forEach(option => {
      const lang = option.getAttribute('data-lang');
      if (lang === this.currentLang) {
        option.classList.add('active');
      } else {
        option.classList.remove('active');
      }
    });
  }

  /**
   * 添加语言变更监听器
   * @param {function} callback - 回调函数
   */
  addListener(callback) {
    this.listeners.push(callback);
  }

  /**
   * 通知所有监听器
   */
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.currentLang));
  }

  /**
   * 获取当前语言
   * @returns {string} 当前语言代码
   */
  getCurrentLang() {
    return this.currentLang;
  }
}

// 创建全局实例
const i18n = new I18n();

// 导出
window.i18n = i18n;