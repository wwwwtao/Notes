(function (window, document) {

  /**
   * 暴露出去的构造函数
   * @param {*} options 
   */
  let Msg = function (options) {
    this._init(options);
  }

  /**
   * 初始化传入的配置后创建元素 并显示
   * @param {*} param0 
   */
  Msg.prototype._init = function ({ 
    content = '', 
    type = 'info', 
    useHTML = false, 
    showIcon = true, 
    confirm = null, 
    cancel = null, 
    footer = true,
    header = true,
    title = '提示', 
    contentStyle = {}, 
    contentFontSize = '1.5em', 
    btnName = ['确定', '取消']
  }) {
    this.content = content;
    this.type = type;
    this.useHTML = useHTML;
    this.showIcon = showIcon;
    this.confirm = confirm;
    this.cancel = cancel;
    this.footer = footer;
    this.contentStyle = contentStyle;
    this.contentFontSize = contentFontSize;
    this.title = title;
    this.btnName = btnName;
    this.header = header;

    this._createElement();
    // 给dom上的按钮们和遮罩层绑定事件
    this._bind({ el: this._el, overlay: this._overlay });
    this._show({ el: this._el, overlay: this._overlay });
  }

  /**
   * 创建弹出框
   */
  Msg.prototype._createElement = function () {

    let wrap = document.createElement('div');
    wrap.className = 'msg__wrap';

    const [ confirmBtnName, cancelBtnName ] = this.btnName;

    // 判断是否显示图标
    const iconHTML = this.showIcon 
      ? '<div class="msg-body-icon">\
          <div class="msg-body-icon-' + this.type + '"></div>\
        </div>' 
      : '';

    // 判断是否显示弹出框底部按钮
    const footerHTML = this.footer 
      ? '<div class="msg-footer">\
          <button class="msg-footer-btn msg-footer-cancel-button">' + cancelBtnName + '</button>\
          <button class="msg-footer-btn msg-footer-confirm-button">' + confirmBtnName + '</button>\
        </div>' : '';

    const headerHTML = this.header
      ? '<div class="msg-header">\
          <span>' + this.title + '</span>\
          <span class="msg-header-close-button">×</span>\
        </div>'
      : '';

    // 拼成完整html
    const innerHTML = headerHTML +
                      '<div class="msg-body">' 
                        + iconHTML + 
                        '<div class="msg-body-content"></div>\
                      </div>'
                      + footerHTML;

    // 将容器内的html替换成弹出框内容
    wrap.innerHTML = innerHTML;

    // 生成合并自定义的内容样式
    const contentStyle = {
      fontSize: this.contentFontSize,
      ...this.contentStyle
    }

    // 获取内容dom
    let content = wrap.querySelector('.msg-body .msg-body-content');

    // 给内容容器加上自定义样式
    for (let key in contentStyle) {
      content.style[key] = contentStyle[key];
    }

    // 给弹出框内容赋值
    if (this.useHTML) {
      content.innerHTML = this.content;
    } else {
      content.innerText = this.content;
    }

    // 创建遮罩层
    let overlay = document.createElement('div');
    overlay.className = 'msg__overlay';

    // 把dom挂到当前实例上
    this._overlay = overlay;
    this._el = wrap;
  }

  /**
   * 显示弹出框
   * @param {*} param0 
   */
  Msg.prototype._show = function ({ el, overlay }) {

    // 把遮罩和弹出框插到页面中
    document.body.appendChild(el);
    document.body.appendChild(overlay);

    // 显示
    setTimeout(function () {
      el.style.transform = 'translate(-50%, -50%) scale(1, 1)';
      overlay.style.opacity = '1';
      console.log(1);
    });
    console.log(2);
  }

  /**
   * 绑定事件
   * @param {*} param0 
   */
  Msg.prototype._bind = function ({ el, overlay }) {
    // 保留this
    const _this = this;

    // 隐藏弹出框
    const hideMsg = function () {
      _this._el.style.transform = 'translate(-50%, -50%) scale(0, 0)';
      _this._overlay.style.opacity = '0';

      setTimeout(function () {
        document.body.removeChild(_this._el);
        document.body.removeChild(_this._overlay);
      }, 300);
    }

    // 取消事件
    const close = function (e) {
      _this.cancel && _this.cancel.call(_this, e);
      hideMsg();
    }

    // 确定事件
    const confirm = function (e) {
      _this.confirm && _this.confirm.call(_this, e);
      hideMsg();
    }

    overlay.addEventListener('click', close);

    if (this.header) {
      el.querySelector('.msg-header .msg-header-close-button').addEventListener('click', close);    
    }

    if (this.footer) {
      el.querySelector('.msg-footer .msg-footer-cancel-button').addEventListener('click', close);
      el.querySelector('.msg-footer .msg-footer-confirm-button').addEventListener('click', confirm);
    }
  }

  // 注册到全局对象
  window.$Msg = Msg;

})(window, document);
