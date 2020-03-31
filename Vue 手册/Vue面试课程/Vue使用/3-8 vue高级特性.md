### 生命周期（父子组件）

外 -- 内 -- 外  - 包含关系

创建 挂载 更新 销毁 8 个

### 自定义 v-model

1. 自定义组件内 写一个 model 对象 里面有 prop 对应自定义组件上的 v-model

2. 自定义组件内 写一个 model 对象 里面有 event 的事件通过 $emit 使用

### $nextTick

在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。  2.1.0 起新增：如果没有提供回调且在支持 Promise 的环境中，则返回一个 Promise。
   Vue 在更新 DOM 时是异步执行的
   侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更
   在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 （已去重的） 工作
   https://cn.vuejs.org/v2/guide/reactivity.html#%E5%BC%82%E6%AD%A5%E6%9B%B4%E6%96%B0%E9%98%9F%E5%88%97 异步更新队列

### slot
