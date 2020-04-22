### 脚手架创建项目

1. npm install -g @vue/cli（全局安装 vue-cli 脚手架）

2. vue create -p dcloudio/uni-preset-vue my-project（创建 uni-app 项目 选择模板）

3. npm run dev:mp-weixin（启动微信小程序项目，开发环境的微信小程序打包）

4. 微信开发者工具导入即可（之后便可在 vscode 中用 vue 写微信小程序）

#### 样式和 Scss

1. 支持 'rpx' 小程序中的单位 750rpx = 屏幕的宽度

2. 支持 'vw' 'vh' H5 单位 100vw = 屏幕的宽度  100vh = 屏幕的宽度

3. 内置了 sass 的配置了 安装 sass-loader node-sass, 然后 vue 组件中 style 设置 "<style lang='scss'>" 即可
