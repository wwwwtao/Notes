### 路由模式

1. hash
2. H5 history

### 动态路由

```js
// 动态路径参数 以冒号开头
routes:[
 {path:'/',component: mtindex,},
 {path:'/mtindex/:id',component: mtindex,}
]
```

### 懒加载

```js
routes:[
 {path:'/',component: ()=>import('../../components/mtin1dex'),},
 {path:'/mtin1dex/:id',component: ()=>import('../../components/mtin1dex'),}
]
```
