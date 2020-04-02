### 生命周期（父子组件）

外 -- 内 -- 外  - 包含关系

创建 (created) 挂载 (mounted) 更新 (updated) 销毁 (destroyed) 8 个

### 自定义 v-model（自定义组件上的 v-model)

1. 自定义组件内 写一个 model 对象 里面有 prop 对应  自定义组件上的 v-model

2. 自定义组件内 写一个 model 对象 里面有 event 的事件通过 $emit 使用

### $nextTick

在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。  2.1.0 起新增：如果没有提供回调且在支持 Promise 的环境中，则返回一个 Promise。
   Vue 在更新 DOM 时是异步执行的
   侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更
   在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 （已去重的） 工作
   https://cn.vuejs.org/v2/guide/reactivity.html#%E5%BC%82%E6%AD%A5%E6%9B%B4%E6%96%B0%E9%98%9F%E5%88%97 异步更新队列

### slot

```js
// 绑定在 <slot> 元素上的 attribute 被称为插槽 prop
<span>
  <slot v-bind:user="user">
    {{ user.lastName }}
  </slot>
</span>
```

```js
// 在父级作用域中，我们可以使用带值的 v-slot 来定义我们提供的插槽 prop 的名字
<current-user>
  <template v-slot:default="slotProps">
    {{ slotProps.user.firstName }}
  </template>
</current-user>
```

### 动态组件

```js
<component v-bind:is="component-name"></component>
```

### 异步组件

1. import() 函数

2. 异步加载组件

```js
components:{
  component: () => import('./my-async-component')
}
```

### 如何缓存组件 (keep-alive 其中一种）

注意这个 <keep-alive> 要求被切换到的组件都有自己的名字，不论是通过组件的 name 选项还是局部 / 全局注册。

### mixin

```js
var mixin = {
  data () {
    return {
      message: 'hello',
      foo: 'abc'
    }
  }
}

// 发生冲突时以组件数据优先
new Vue({
  mixins: [mixin]
})
```
