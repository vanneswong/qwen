/**
 * 服务流程交互模块
 * 服务选择器、材料清单生成、费用估算、流程进度条
 */

class ServiceFlow {
  constructor() {
    this.services = [];
    this.selectedServices = [];
    this.baseFee = 500;
  }

  /**
   * 初始化服务流程
   */
  async init() {
    try {
      await this.loadData();
      this.renderServiceSelector();
      this.setupEventListeners();
      console.log('ServiceFlow initialized');
    } catch (error) {
      console.error('ServiceFlow initialization error:', error);
    }
  }

  /**
   * 加载服务数据
   */
  async loadData() {
    try {
      const res = await fetch('/data/services.json');
      const data = await res.json();
      this.services = data.services || [];
      this.baseFee = data.pricing?.baseFee || 500;
    } catch (error) {
      console.error('Error loading services data:', error);
    }
  }

  /**
   * 渲染服务选择器
   */
  renderServiceSelector() {
    const selectorOptions = document.querySelector('.selector-options');
    if (!selectorOptions) return;

    selectorOptions.innerHTML = this.services.map(service => `
      <div class="selector-option" data-service-id="${service.id}">
        <div class="selector-checkbox">✓</div>
        <div class="selector-info">
          <h4>${i18n.getBilingual(service, 'title')}</h4>
          <p>${i18n.getBilingual(service, 'summary')}</p>
        </div>
        <div class="selector-price">¥${service.priceRange}</div>
      </div>
    `).join('');
  }

  /**
   * 设置事件监听
   */
  setupEventListeners() {
    // 服务选择
    document.querySelectorAll('.selector-option').forEach(option => {
      option.addEventListener('click', () => {
        this.toggleService(option);
      });
    });

    // 计算按钮
    const calculateBtn = document.querySelector('.calculate-btn');
    if (calculateBtn) {
      calculateBtn.addEventListener('click', () => {
        this.calculateResult();
      });
    }
  }

  /**
   * 切换服务选择状态
   * @param {HTMLElement} option - 选项元素
   */
  toggleService(option) {
    const serviceId = option.getAttribute('data-service-id');
    const isSelected = option.classList.contains('selected');

    if (isSelected) {
      option.classList.remove('selected');
      this.selectedServices = this.selectedServices.filter(s => s.id !== serviceId);
    } else {
      option.classList.add('selected');
      const service = this.services.find(s => s.id === serviceId);
      if (service) {
        this.selectedServices.push(service);
      }
    }

    this.updateSelectedCount();
  }

  /**
   * 更新已选数量显示
   */
  updateSelectedCount() {
    const countEl = document.querySelector('.result-count');
    if (countEl) {
      const count = this.selectedServices.length;
      countEl.textContent = count > 0
        ? `${count} ${i18n.getBilingual({ item: '项服务', itemEn: 'services selected' }, 'item')}`
        : i18n.getText('labels.serviceSelector.noneSelected');
    }
  }

  /**
   * 计算并显示结果
   */
  calculateResult() {
    if (this.selectedServices.length === 0) {
      this.showNotification(i18n.getText('labels.serviceSelector.noneSelected'), 'error');
      return;
    }

    // 渲染已选服务列表
    this.renderSelectedList();

    // 渲染材料清单
    this.renderMaterialsList();

    // 渲染费用估算
    this.renderFeeEstimate();

    // 渲染流程进度
    this.renderProcessFlow();
  }

  /**
   * 渲染已选服务列表
   */
  renderSelectedList() {
    const summaryEl = document.querySelector('.result-summary');
    if (!summaryEl) return;

    summaryEl.innerHTML = this.selectedServices.map(service => `
      <div class="result-item">
        <span>${i18n.getBilingual(service, 'title')}</span>
        <span>¥${service.priceRange.split('-')[0]} - ¥${service.priceRange.split('-')[1]}</span>
      </div>
    `).join('');
  }

  /**
   * 渲染材料清单
   */
  renderMaterialsList() {
    const materialsEl = document.querySelector('.materials-list');
    if (!materialsEl) return;

    // 合并所有服务的材料
    const allMaterials = [];
    this.selectedServices.forEach(service => {
      if (service.detail?.materials) {
        service.detail.materials.forEach(mat => {
          // 检查是否已存在
          const exists = allMaterials.find(m => m.name === mat.name);
          if (!exists) {
            allMaterials.push(mat);
          }
        });
      }
    });

    if (allMaterials.length === 0) {
      materialsEl.innerHTML = '';
      return;
    }

    materialsEl.innerHTML = `
      <h4 class="materials-header">${i18n.getText('labels.materialsRequired')}</h4>
      ${allMaterials.map(mat => `
        <div class="material-item ${mat.required ? 'required' : 'optional'}">
          <span class="material-name">${i18n.getBilingual(mat, 'name')}</span>
          <span class="material-desc">${i18n.getBilingual(mat, 'desc')}</span>
        </div>
      `).join('')}
    `;
  }

  /**
   * 渲染费用估算
   */
  renderFeeEstimate() {
    const totalEl = document.querySelector('.result-total');
    if (!totalEl) return;

    // 计算费用范围
    let minFee = this.baseFee;
    let maxFee = this.baseFee;

    this.selectedServices.forEach(service => {
      const [min, max] = service.priceRange.split('-').map(Number);
      minFee += min;
      maxFee += max;
    });

    totalEl.innerHTML = `
      <span>${i18n.getText('labels.feeRange')}</span>
      <span class="result-total-value">¥${minFee} - ¥${maxFee}</span>
    `;
  }

  /**
   * 渲染流程进度
   */
  renderProcessFlow() {
    const processEl = document.querySelector('.process-flow');
    if (!processEl) return;

    // 使用第一个服务的流程作为基础
    const process = this.selectedServices[0]?.detail?.process || [];

    if (process.length === 0) {
      processEl.innerHTML = '';
      return;
    }

    processEl.innerHTML = `
      <h4>${i18n.getText('labels.serviceProcess')}</h4>
      <div class="process-steps">
        ${process.map((step, index) => `
          <div class="process-step ${index === 0 ? 'current' : ''}">
            <div class="step-circle">${step.step}</div>
            <span class="step-label">${i18n.getBilingual(step, 'title')}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  /**
   * 显示通知
   * @param {string} message - 消息内容
   * @param {string} type - 类型 'success' | 'error' | 'info'
   */
  showNotification(message, type = 'info') {
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
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
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
}

// 创建全局实例
const serviceFlow = new ServiceFlow();

// 导出
window.serviceFlow = serviceFlow;