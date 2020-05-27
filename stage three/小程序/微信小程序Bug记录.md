## 微信小程序 bug 记录

**textarea**

1. textarea 在模拟器上没有 padding，可是在真机上会自带 padding，而且在外部改不了，并且在安卓和 IOS 上 padding 还不一样
第一张图是在开发工具上的，第二张图是在 IOS 真机上的。从上图可以看出来，在开发工具上显示很正常，而且没有 padding，可是在真机上左上角就出现了 padding，并且无论你在外部对 textarea 的 padding 做任何处理，都无法覆盖。
目前有一种解决方式是根据 ios 和 android 的不同平台来给 teaxarea 设置不同的样式。
解决方法：通过 wx.getSystemInfo 来获取当前设备的平台（IOS or Android), 然后根据不同的平台来设置不同的偏移样式来兼容（可以通过 margin: 负值）。

2. textarea 层级最高，而且还没办法使用 z-index 来修改，使得自制 modal 等组件出现问题。这个问题同样在开发工具上没问题，在真机上才出现问题。
   目前的解决方法：在 modal 弹起的时候，将 textarea 隐藏掉，具体隐藏方法看**3**

3. textarea 使用 display:none;visibility: hidden; opacity: 0 都隐藏不了。
   目前的解决方法：

   ```css
   textarea.hidden {
       position: relative;
       left: -1000%;
   }
   ```

   ```html
   <textarea hidden={{isHide}} />
   ```

   查阅了官方文档后发现，官方提供了一个 hidden 这个 api，我们可以通过这个 api 来隐藏掉 textarea
