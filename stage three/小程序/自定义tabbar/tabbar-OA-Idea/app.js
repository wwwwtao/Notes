//app.js
App({
  onLaunch: function () {
    //隐藏系统tabbar
    wx.hideTabBar();
    //获取设备信息
    this.getSystemInfo();

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    wx.getSystemInfo({
      success: res => {
        //导航高度
        let statusBarHeight = res.statusBarHeight,
          navTop = menuButtonObject.top,
          // 导航栏高度 =  状态栏高度 + 胶囊按钮高度 + 状态栏到胶囊按钮间距 * 2 
          // 由于胶囊按钮是原生组件，为表现一致，其单位在各种手机中都为 px，所以我们自定义导航栏的单位都必需是 px（切记不能用 rpx），才能完美适配。
          navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2,
          windowright = res.windowWidth - menuButtonObject.right;
        this.globalData.navHeight = navHeight;
        this.globalData.navTop = navTop;        //navTop
        this.globalData.windowright = windowright;
      },
      fail(err) {
        console.log(err);
      }
    })


    let screenHeight = wx.getSystemInfoSync().screenHeight
    let bottom = wx.getSystemInfoSync().safeArea.bottom
    const isIpX = screenHeight !== bottom
    this.globalData.isIpX = isIpX
    if (isIpX) {
      this.globalData.bottomHeight = screenHeight - bottom
    }
  },
  onShow: function () {
    //隐藏系统tabbar
    wx.hideTabBar();
  },
  getSystemInfo: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.systemInfo = res;
      }
    });
  },
  editTabbar: function () {
    var tabbar = this.globalData.tabBar;
    var currentPages = getCurrentPages();
    var that = currentPages[currentPages.length - 1];
    var pagePath = that.route;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (var i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    that.setData({
      tabbar: tabbar
    });
  },
  globalData: {
    systemInfo: null,//客户端设备信息
    userInfo: null,
    appId: '',
    openId: '',
    requestTasks: [], //一些需要取消请求的接口
    navHeight: '', //整个导航栏高度
    navTop: '',    //胶囊按钮与顶部的距离 
    windowright: '', //胶囊按钮与右侧的距离
    isIpX: '',  //是否是ipx
    bottomHeight: '', //ipx等全面屏手机 底部适配
    tabBar: {
      "backgroundColor": "#ffffff",
      "color": "#979795",
      "selectedColor": "#1c1c1b",
      "list": [
        {
          "pagePath": "/pages/index/index",
          "iconPath": "icon/icon_home.png",
          "selectedIconPath": "icon/icon_home_HL.png",
          "text": "首页"
        },
        {
          "pagePath": "/pages/classify/classify",
          "iconPath": "icon/icon_home.png",
          "selectedIconPath": "icon/icon_home_HL.png",
          "text": "分类"
        },
        {
          "pagePath": "/pages/middle/middle",
          "iconPath": "icon/icon_release.png",
          "isSpecial": true,
          "text": "发布"
        },
        {
          "pagePath": "/pages/car/car",
          "iconPath": "icon/icon_mine.png",
          "selectedIconPath": "icon/icon_mine_HL.png",
          "text": "购物车"
        },
        {
          "pagePath": "/pages/mine/mine",
          "iconPath": "icon/icon_mine.png",
          "selectedIconPath": "icon/icon_mine_HL.png",
          "text": "我的"
        }
      ]
    }
  }
})