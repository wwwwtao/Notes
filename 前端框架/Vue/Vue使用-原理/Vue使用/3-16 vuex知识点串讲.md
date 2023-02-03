### Vuex 官方教程电子书

https://vuex.vuejs.org/zh/guide/state.html

### Vuex 基本概念

1. state
2. mutations（改变）
3. actions（行动）   !!! 这里面才能作异步操作
4. getters

### 用于 Vue 组件

1. dispatch（派遣）
2. commit（委任）
3. mapState
4. mapGetters
5. mapActions
6. mapMutations

<img width="100%" src="https://raw.githubusercontent.com/wwwwtao/Notes/master/Vue%20手册/Vue使用与原理/Vue使用/img/Vuex流程图.png">

### 项目结构

Vuex 并不限制你的代码结构。但是，它规定了一些需要遵守的规则：

1. 应用层级的状态应该集中到单个 store 对象中。

2. 提交 mutation 是更改状态的唯一方法，并且这个过程是同步的。

3. 异步逻辑都应该封装到 action 里面。

只要你遵守以上规则，如何组织代码随你便。如果你的 store 文件太大，只需将 action、mutation 和 getter 分割到单独的文件。

对于大型应用，我们会希望把 Vuex 相关代码分割到模块中。下面是项目结构示例：

```js
├── index.html
├── main.js
├── api
│   └── ... # 抽取出 API 请求
├── components
│   ├── App.vue
│   └── ...
└── store
    ├── index.js          # 我们组装模块并导出 store 的地方
    ├── actions.js        # 根级别的 action
    ├── mutations.js      # 根级别的 mutation
    └── modules
        ├── cart.js       # 购物车模块
        └── products.js   # 产品模块
```
