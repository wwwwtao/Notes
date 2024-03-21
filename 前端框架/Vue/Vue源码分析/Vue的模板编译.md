## Vue 的模板编译『模板 -AST 树 -render- 虚拟 DOM- 真实 DOM』

1. 获取到 template

- 源码入口 /Users/wwwwtao/Desktop/ 学习 /Notes/ 前端框架 /Vue/Vue 源码分析 /_VueCopy（源码内有注释）/src/core/instance/index

2. template -> AST 树
3. AST 抽象语法树 -> render _c _v _s
4. render 函数 -> vnode
5. PATCH（createElement(vnode) 创建真实 DOM 添加到页面上）-> 打补丁到真实 DOM

### AST 和虚拟 DOM 区别

ast 主要是将模板形成树并做优化，虚拟 dom 是对应真实 dom 的数据
ast 主要是为了优化点 vue 的指令和属性，转化成 js 逻辑。虚拟 dom 主要是优化渲染的
v-if  v-for 这些，浏览器是不认识的，在这个环节，这些都是都会优化成 js 逻辑，然后把纯 html 提出来，然后在做虚拟节点集合，因为虚拟节点是对应真实节点的，所以虚拟节点记录的，必须是浏览器认可的信息
