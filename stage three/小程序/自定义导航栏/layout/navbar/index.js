// components/navbar/index.js
const App = getApp();
 
Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    // pageName:String,
    // showNav:{
    //   type:Boolean,
    //   value:true
    // },
    bgColor: {
      type: String,
      value: ""
    },
    opacity: {
      type: Number,
      value: 1
    }
  },
 
  /**
   * 组件的初始数据
   */
  data: {
    navHeight: '',
    navTop: ''
  },
  lifetimes: {
    attached: function () {
      this.setData({
        navHeight: App.globalData.navHeight,
        // navHeight: 300,
        navTop: App.globalData.navTop
      })
     }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // //回退
    // navBack: function () {
    //     wx.navigateBack({
    //       delta: 1
    //     })      
    // },
    // //回主页
    // toIndex: function () {
    //   wx.navigateTo({
    //     url: '/pages/admin/home/index/index'
    //   })
    // },
  }
})