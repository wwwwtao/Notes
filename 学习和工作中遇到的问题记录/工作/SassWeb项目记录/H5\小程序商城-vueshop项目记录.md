### 入口 main.js

```js
// vue 相关
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 通用组件全局注册
import { Toast, Dialog, Button, Icon, Row, Col, lazyload, Loading, Image, Cell } from 'vant'

// 一些静态资源
import './assets/styles/iconfont.css' // 字体图标
import './assets/styles/latofonts.css' // Lato字体文件
import './assets/styles/common.less' //


// 把css中的 rpx 替换成 自适应的 px  原理是通过基于lib-flexible包进行修改win.document.documentElement.style.fontSize 拿到 CSSStyleDeclaration 接口表示一个对象,它是一个 CSS 声明块,CSS 属性键值对的集合。它暴露了样式信息和各种与样式相关的方法和属性
// window.devicePixelRatio 能够返回当前显示设备的物理像素分辨率与CSS像素分辨率的比率
// docEl.style.fontSize = scaleFactor * rem + 'px'
import '@/utils/lib-flexible'   // 定义基础的rem

// 全局过滤器 用来处理style上的rpx 替换 成 rem
import * as filters from './assets/filter/fliter' // 引入全局filter

// eventHub VUE推荐在APP中使用依赖注入的方式 provide 暴露 然后 在子组件中通过 inject 使用
import eventbus from '@/assets/eventbus/eventbus.js'

// 封装了van-button
import xkdButton from '@/components/xkd/xkd-button'

// 工具类 和 utils 的区别应该是这个工具类是 H5 和 小程序 通用的
import wxutils from './utils/WxUtils'

//模拟了wepy对象 定义了静态属性 $instance 和 $vue 和 一些方法
// this.$instance.globalData = Vm.$globalData  |  this.$vue = Vm
// 至于 VUEX 中的 全局方法和属性 有些应该是只做和H5相关的一些操作的(未确认)  VUEX 中的一些操作 在小程序项目中 放在了 /utlis/WxUtils.js 中  具体 VUEX 如何使用什么情况下使用 后期再看
import wepy from './utils/wepy'

//PC 上模拟 Touch 事件
import '@vant/touch-emulator'

Vue.component('xkdButton', xkdButton) // ...

// 注入 eventHub
Vue.prototype.$eventbus = eventbus
// 全局注册filter
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.use(Button).use(Icon).use(Toast).use(Dialog).use(Row).use(Col).use(Loading).use(lazyload).use(Image).use(Cell) // ...注册一些Vant组件 (use是VUE提供的 内部使用了组件本身的 install 方法...

router.beforeEach(async (to, from, next) => {
  if (store.state.errorPageShow) {
    store.commit('changeError', { flag: false, text: '页面异常' }) // 初始化页面错误标识
  }
// 判断链接是否为预览链接(isPreview) 和 是否开启了端口(storeActive) 默认是开启的 不会进去 notSupport 页面 在非法不支持的端口进行一些操作就可以了
  if (!Vue.prototype.$globalData.storeActive && to.path != '/pages/home/notSupport' && !wxutils.isPreview(to.fullPath)) {
    // 当前端口未开启
    next('/pages/home/notSupport')
    return
  }
  const res = await wxutils.awaitAppInit()  // 等待20次 200毫秒 等待 wepy 是否初始化
  if (!res) return
    // anyone -- 路由中定义的 表示无需用户登录   // isLogin -- 当前用户是否登录
  if (!to.meta.anyone && !wepy.$instance.globalData.isLogin) {
      // 是否可以使用微信API
    if (wepy.$instance.globalData.CanUseWxApi) {
      wxutils.wxAuthLogin(1, to)  // 表示在微信端 通过 window.location.href = url  跳转授权url
    } else {                       // shopId=' + Vm.$globalData.VisitShopId  shopId在这里被添加入url中
      wxutils.goToLoginPage(to)   // 通过 navigateTo 跳转
    }
    return
  }
  // 自定义配置 接口请求 循环遍历 if(to.fullpath==ele.path){to.meta=ele.meta break}
  // 修改头部标题
  if (to.meta.title && to.meta.title != '') {
    document.title = to.meta.title
  }

  // 是否有navBar(头部导航)
  if (to.meta.navBar) {
    store.commit('changeNavBar', true)
  } else {
    store.commit('changeNavBar', false)
  }
  if (from.path == '/pkgvshop/home/login' || from.fullPath.indexOf('closeBack=true') > -1 || to.fullPath.indexOf('closeBack=true') > -1) {
    store.commit('changeCloseBack', true)  // 是否显示头部返回
  } else {
    store.commit('changeCloseBack', false)
  }
  // 是否有shareShow(分享)
  if (to.meta.shareShow) {
    store.commit('changeShareShow', true)
  } else {
    store.commit('changeShareShow', false)
  }
  // 默认关闭下拉刷新
  store.commit('changePullDownRefresh', false)
  // 是否有tabBar(底部导航)
  if (to.meta.tabBar) {
    store.commit('changeTabBar', true)
  } else {
    store.commit('changeTabBar', false)
  }
  // 根据tabbar处理数据
  if (store.state.tabbar) {
    const routeArr = store.state.tabbar
    for (let i = 0; i < routeArr.length; i++) {
      const ele = routeArr[i]
      const pathArr = ele.pagePath.split('?')
      if (pathArr.length == 1) {
        const toPathArr = to.fullPath.split('?')
        if (pathArr[0] == to.fullPath || (pathArr[0] == toPathArr[0] && toPathArr[1].indexOf('shopId') > -1)) {
          store.commit('changeTabBar', true)
          routeArr[i].selectedFlag = true
        } else {
          routeArr[i].selectedFlag = false
        }
      } else {
        if (pathArr[0] == to.path && pathArr[1] && decodeURIComponent(to.fullPath).indexOf(pathArr[1]) > -1) {
          store.commit('changeTabBar', true)
          routeArr[i].selectedFlag = true
        } else {
          routeArr[i].selectedFlag = false
        }
      }
    }
    store.commit('changeTabbarConfig', routeArr)
  }
  next()
})
router.afterEach(to => {
  // 是否开启下拉刷新
  if (to.meta.isPullDownRefresh) {
    store.commit('changePullDownRefresh', true)
  } else {
    store.commit('changePullDownRefresh', false)
  }
})
// 设置数据
Vue.prototype.setData = function (obj) {
  for (const k in obj) {
    this[k] = obj[k]
  }
}

// 修改props  需要修改的值 父组件加上 .sync   !!!!!!
Vue.prototype.setProps = function (obj) {
  for (const k in obj) {
    if (obj[k] instanceof Object) {
      // 数组或者对象
      this.$emit('update:' + k, JSON.parse(JSON.stringify(obj[k])))
    } else {
      this.$emit('update:' + k, obj[k])
    }
  }
}

// Tost
// 文本提示
Vue.prototype.$text = (message, duration = 2000, mask = false, onOpened = '', onClose = '', forbidClick = true) => Toast({
  message, // 提示信息
  duration, // 延迟
  mask, // 是否显示遮罩层
  forbidClick, // 是否禁止点击背景
  onOpened, // 调用刚开始时触发的回调函数
  onClose // 调用结束后触发的回调函数
})
// 加载状态提示
Vue.prototype.$loading = (message = '', duration = 0, mask = false, onOpened = '', onClose = '', forbidClick = true) => Toast.loading({
  message, // 提示信息
  duration, // 延迟
  mask, // 是否显示遮罩层
  forbidClick, // 是否禁止点击背景
  onOpened, // 调用刚开始时触发的回调函数
  onClose // 调用结束后触发的回调函数
})
// 关闭任何提示
Vue.prototype.$clearToast = () => Toast.clear()
// 成功提示
Vue.prototype.showSuccess = (message, duration = 2000, mask = false, onOpened = '', onClose = '', forbidClick = true) => Toast.success({
  message, // 提示信息
  duration, // 延迟
  mask, // 是否显示遮罩层
  forbidClick, // 是否禁止点击背景
  onOpened, // 调用刚开始时触发的回调函数
  onClose // 调用结束后触发的回调函数
})
// 失败提示
Vue.prototype.showErrorMsg = (message, duration = 2000, mask = false, onOpened = '', onClose = '', forbidClick = true) => Toast({
  message, // 提示信息
  duration, // 延迟
  mask, // 是否显示遮罩层
  forbidClick, // 是否禁止点击背景
  onOpened, // 调用刚开始时触发的回调函数
  onClose // 调用结束后触发的回调函数
})
// Dialog 模态框
// 单确认提示 后.then()进行回调函数处理
Vue.prototype.$alert = (title = '', message = '', confirmButtonText = '确定', overlay = true, closeOnClickOverlay = true, lockScroll = true, confirmButtonColor = '#1989fa') => Dialog.alert({
  title,
  message,
  closeOnClickOverlay, // 是否在点击遮罩层后关闭弹窗
  overlay,
  lockScroll,
  confirmButtonColor,
  confirmButtonText
})
// 确认取消提示 .then确定 .catch取消
Vue.prototype.$confirm = (title = '', message = '', confirmButtonText = '确定', cancelButtonText = '取消', overlay = true, closeOnClickOverlay = true, lockScroll = true, confirmButtonColor = '#1989fa', cancelButtonColor = '#000') => Dialog.alert({
  title,
  message,
  closeOnClickOverlay, // 是否在点击遮罩层后关闭弹窗
  overlay, // 是否显示遮罩层
  lockScroll, // 是否锁定屏幕滚动
  confirmButtonColor, // 确认按钮颜色
  confirmButtonText, // 确认按钮文案
  cancelButtonText, // 取消按钮文案
  cancelButtonColor// 取消按钮颜色
})

Vue.prototype.$globalData = {
  xkdApiDomians: {},
  reqHost: '',
  storeId: 0,
  fundMetaData: null, // /fundebug携带数据
  isInit: false, // /小程序是否初始化成功
  initFail: false, // /小程序是否初始化成功
  isLogin: false, // /当前用户是否登录
  stopReq: false, // /是否阻止其它业务请求，当正在登录中的时候，其它接口都停止业务请求处理
  userId: 0, // /当前用户信息
  wxaOpenId: '',
  oemInfo: null, // /OEM产商信息
  storeInfo: null, // /当前店铺信息
  tabBarConfig: null, // /当前Tabar信息
  tabApiPages: [], // /API端获取的tab页数据
  navstyleconfig: {
    PrimaryColor: '#fff',
    PlainColor: '#fff'
  }, // /店铺风格信息
  textstyleconfig: {
    PrimaryColor: '#fff',
    PlainColor: '#fff'
  },
  TabBarSelectedColor: '', // tabbar选中颜色
  extConfig: null, // /ext配置信息
  jwtToken: '', // /用户JWT令牌，
  activeNavIndex: -1, // /当前tab选中索引
  closeCopyright: true, // /版本是否关闭
  copyrightText: '', // 版权信息显示的店铺名
  copyrightLogo: '', // 版权信息显示的LOGO
  StoreExpired: true, // /店铺是否已经过期
  IsTrialStore: true, // /是否试用店铺
  shopCartNumber: 0, // /购物车商品数量
  pixelRatio: 2,
  windowWidth: 0,
  windowHeight: 0,
  lastFormIdTime: null,
  AmapKey: '1d04b61fa7b756d5d5084424c0c38a7d',
  isIphoneX: false,
  MemberShopId: 0, // 当前会员归属的店铺Id，推客是他自己的Id,分享时需要
  VisitShopId: 0, // 当前会员访问的店铺，
  AuthList: [], // 当前店铺的授权权限
  IsTwitter: false, // 是否为推客
  PointName: '积分', // 个人中心积分重名
  IsBuy: false, // 点击的是加入购物车还是购买
  TwitterAlias: '推客', // 7.5 补充 推客别名
  PartnerAlias: '', // 2020.2.13 合伙人别名
  TwitterName: '', // 推客中心名字,
  screenSize: 720, // 几倍屏
  searchKey: '', // 搜索热词
  WxConfigPass: 0, // 0初始化，1准备验证 2验证通过 3验证失败
  CanWxShare: false, // /是否可以微信分享
  CanUseWxApi: false, // /是否可以使用微信API
  GzhAppId: '', // 公众号AppId
  WxOpenAppId: '', // 公众号授权的开放平台AppId
  WxAuthDomain: '',
  isMobile: true, // 是否为移动端
  storeActive: true, // 店铺是否开启当前端口
  isWeiXin: true, // 当前是否为微信
  isPreview: false, // 当前是否为预览模式
  NeedLogVisit: false
}

// /es6 class to vueOptions
Vue.ClassToVueOptions = function (source, prototype) {
  const target = {}
  const protoMapDirect = {
    create: true,
    mounted: true,
    activated: true,
    beforeCreate: true,
    beforeUpdate: true,
    beforeRouteUpdate: true,
    updated: true,
    beforeDestroy: true,
    destroyed: true
  }
  const noMapKeys = {
    config: true
  }
  Object.keys(source).forEach(key => {
    if (source[key]) {
      if (key === 'data') {
        target[key] = () => {
          // 将data对象进行深拷贝，阻止组件实例修改组件原型
          return JSON.parse(JSON.stringify(source[key]))
        }
      } else if (noMapKeys[key]) {
        // 不需map的属性
      } else {
        target[key] = source[key]
      }
    }
  })

  const o = Object.getOwnPropertyNames(prototype)
  for (const pkey in o) {
    if (o[pkey] !== 'constructor') {
      if (protoMapDirect[o[pkey]]) {
        // 生命周期函数方法
        target[o[pkey]] = source[o[pkey]]
      } else {
        if (!target['methods']) {
          target['methods'] = {}
        }
        target['methods'][o[pkey]] = source[o[pkey]]
      }
    }
  }
  // console.log('prototype', target)
  return target
}

// 初始化实例
const Vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

export default Vm

```

### 请求相关

#### axios 封装在了 utlis/http.js 中 ==> api/base.js 作为基类引入了 http 并把 http 中请求方法作为静态属性

#### 'Authorization' 请求头验证身份

```js
// 手机号登录
static async TelLogin(params) {
wepy.setVm() // 初始化wepy
const res = await this.postForm(
    'vshop',
    'Login/PhoneLogin',
    params
)
return res
}

// 1. 登陆之后会返回jwt
wepy.$instance.globalData.jwtToken = res.Data.JwtToken // 用户JWT令牌
wepy.setStorageSync('jwtToken', res.Data.JwtToken)

// 2. 每次进入应用会验证jwtType
this.$globalData.jwtToken = wepy.getStorageSync('jwtToken')
if (this.$globalData.jwtToken) {
    try {
        const jwtType = JSON.parse(window.atob(this.$globalData.jwtToken.split('.')[1])).jty
        if (jwtType !== this.$globalData.clientType) {
        wepy.setStorageSync('jwtToken', '')
        this.$globalData.jwtToken = ''
        }
    } catch (err) {
        wepy.setStorageSync('jwtToken', '')
        this.$globalData.jwtToken = ''
    }
}

// 3. 在http中 每个请求头 和 公共请求头 都定义了 'Authorization': 'Bearer ' + Vm.$globalData.jwtToken

// 4. 之后通过 app.js  中  onLaunch()/created() 中有一个 tryLogin/Auth.getInitConfig 接口会验证登陆 ，是通过 jwt 的有效时间来验证的

```
