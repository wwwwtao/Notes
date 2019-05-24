// 初始化一个弹出框
// 生成dom元素
// 插到页面中
// 显示

(function(window, document) {

  let Msg = function(options) {
    // console.log(this);
    this._init(options);
  }

  Msg.prototype._init = function({ content = '', cancel = null, confirm = null, useHTML = false, contentStyle = {}, contentFontSize = '1.5em' }) {
    this.content = content;
    this.cancel = cancel;
    this.confirm = confirm;
    this.useHTML = useHTML;
    this.contentStyle = contentStyle;
    this.contentFontSize = contentFontSize;

    this._createElement();
    this._bind([this._el, this._overlay]);
    this._show([this._el, this._overlay]);
  }

  Msg.prototype._createElement = function() {
    let wrap = document.createElement('div');
    wrap.className = 'msg__wrap';

    wrap.innerHTML = '\
    <div class="msg-header">\
      <span>确认删除</span>\
      <span class="msg-header-close-button">×</span>\
    </div>\
    <div class="msg-body">\
      <div class="msg-body-icon">\
        <div class="msg-body-icon-info"></div>\
      </div>\
      <div class="msg-body-content"></div>\
    </div>\
    <div class="msg-footer">\
      <button class="msg-footer-btn msg-footer-cancel-button">算了吧</button>\
      <button class="msg-footer-btn msg-footer-confirm-button">好的</button>\
    </div>';

    let contentDOM = wrap.querySelector('.msg-body .msg-body-content');

    const contentStyle = {
      fontSize: this.contentFontSize,
      ...this.contentStyle
    }

    for (let i in contentStyle) {
      if (contentStyle.hasOwnProperty(i)) {
        contentDOM.style[i] = contentStyle[i];
      }
    }

    if (this.useHTML) {
      contentDOM.innerHTML = this.content;
    } else {
      contentDOM.innerText = this.content;
    }

    let overlay = document.createElement('div');
    overlay.className = 'msg__overlay';

    this._el = wrap;
    this._overlay = overlay;
  }

  Msg.prototype._bind = function([el, overlay]) {
    const _this = this;

    const hideMsg = function() {
      el.style.transform = 'translate(-50%, -50%) scale(0, 0)';
      overlay.style.opacity = '0';

      setTimeout(function() {
        document.body.removeChild(el);
        document.body.removeChild(overlay);
      }, 300);
    }

    const cancel = function(e) {
      _this.cancel && _this.cancel.call(_this, e);  //有自己的方法 就调用自己的方法 然后再隐藏
      hideMsg();
    }

    const confirm = function(e) {
      _this.confirm && _this.confirm.call(_this, e);
      hideMsg();
    }

    overlay.addEventListener('click', cancel);

    el.querySelector('.msg-header .msg-header-close-button').addEventListener('click', cancel);

    el.querySelector('.msg-footer .msg-footer-cancel-button').addEventListener('click', cancel);

    el.querySelector('.msg-footer .msg-footer-confirm-button').addEventListener('click', confirm);
  }

  Msg.prototype._show = function([el, overlay]) {
    document.body.appendChild(el);
    document.body.appendChild(overlay);

    setTimeout(function() {
      el.style.transform = 'translate(-50%, -50%) scale(1, 1)';
      overlay.style.opacity = '1';
    });
  }

  window.$Msg = Msg;

})(window, document);
