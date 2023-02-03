#### 组件 data 为何是函数

因为一个 vue 组件实际上转换成 js 是一个 class 类

一个组件 / 类进行多个实例化后 data 如果不是一个函数，那么多个组件会共享 data 的数据

#### V-model 原理

1. 模板编译绑定 input 事件 this.'v-model 绑定的变量'=$event.target.value
2. data 更新触发 re-render

#### ajax 请求应该放在哪个生命周期里

mounted

js 是单线程的 ajax 是异步的放在 mounted 之前没有用
