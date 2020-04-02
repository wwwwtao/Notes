### 核心 API - Object.defineProperty (Vue3.0 用 Proxy-- 有兼容性问题且无法用 polyfill)

通过 Object.defineProperty() 来劫持各个属性的 setter,getter，在数据变动时发布消息给订阅者，触发相应的监听回调

### Object.defineProperty 的缺点 为什么用 Proxy

缺点 1. 得递归到底，一次性计算量大（得想办法不一次性监听完）

缺点 2. 无法监听新增 / 删除属性（Vue.set/Vue.delete）

缺点 3. 无法原生监听数组，需要特殊处理

#### 4-4 如何深度监听 data 变化

缺点 1. 得递归到底，一次性计算量大（得想办法不一次性监听完）

#### 4-5 vue 如何监听数组变化

1. 获取数组原型
2. Object.create（'数组原型'）创建新对象 arrProto，原型指向数组原型（不影响数组原型），再扩展新的方法 (push 等）处理视图更新之后调用原型中的方法进行 push 数据
3. observer 判断是不是数组 是的话让隐式原型等于 arrProto
