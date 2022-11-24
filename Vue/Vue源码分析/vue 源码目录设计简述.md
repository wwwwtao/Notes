学习 vue.js 的源码，首先要学习源码目录，vue.js 的源码都在 src 目录下，目录结构如下：

```js
// src
// ├── compiler        # 编译相关
// ├── core            # 核心代码
// ├── platforms       # 不同平台的支持
// ├── server          # 服务端渲染
// ├── sfc             # .vue 文件解析
// ├── shared          # 共享代码
```

1. compiler
compiler 目录中主要存放编译相关的代码，比如说我们 vue 中定义的 template 的语法，浏览器是不识别的，所以在运行我们所写的代码前，需要将 template 模版中的语法解析成为浏览器可识别的代码。而这个过程就叫做编译。

2. core
这里主要放置 vue.js 的核心代码，包括内置组件、全局 API、实例化、观察者、工具函数、虚拟 dom 等相关代码。结构如下图所示：

```js
// core
// ├── components      # 内置组件相关
// ├── global-api      # 全局组件相关
// ├── instance        # 实例化相关
// ├── observer        # 观察者相关
// ├── util            # 工具函数
// ├── vdom            # 虚拟dom
```

这里的代码是 vue 的核心，包括响应式原理、观察者模式、虚拟 dom 等你能听到的 vue 核心理念 基本都囊括在里面。

3. platform
vue.js 是一个跨平台的框架，可以跑在 web 上，也可以配合 weex 跑在 native 客户端上，platform 是 Vue.js 的入口，2 个目录代表 2 个主要入口，分别打包成运行在 web 上和 weex 上的 Vue.js。

```js
// platform
// ├── web             # web端
// ├── weex            # weex端
```

我主要做 web 端开发，重点关注 web 端渲染，也就是 web 菜单，vue 实例化的入口文件也是在这个目录下。

4. server
Vue.js 支持服务端渲染，所有服务端渲染相关的逻辑都在这个目录下。注意：这部分代码是跑在服务端的 Node.js。

服务端渲染主要的工作是把组件渲染为服务器端的 HTML 字符串，将它们直接发送到浏览器，最后将静态标记"混合"为客户端上完全交互的应用程序。

做服务端渲染的话需要多多关注这里面的代码。

5. sfc
通常我们开发 Vue.js 都会借助 webpack 构建， 然后通过。vue 单文件来编写组件。
这个目录下的代码逻辑会把。vue 文件内容解析成一个 JavaScript 的对象。

想了解。vue 文件是如何解析的，需要好好分析这里面的代码。

6. shared
Vue.js 会定义一些工具方法，这里所定义的工具方法与 core 中有所不同，是会被浏览器端和服务端所共享的。

```js
// shared
// ├── constant.js     # 定义了一些全局需要用到的常量
// ├── util.js         # 共用的一些工具方法
```
