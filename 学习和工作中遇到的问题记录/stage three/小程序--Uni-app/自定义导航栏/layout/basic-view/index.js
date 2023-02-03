// components/scrollView-paging/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bgColor: {
      type: String,
      value: ""
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    navHeight: '',
    navTop: '',
  },


  //  组件的生命周期
  lifetimes: {
    attached: function () {
      this.setData({
        navHeight: app.globalData.navHeight,
        navTop: app.globalData.navTop
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
