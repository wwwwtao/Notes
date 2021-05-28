### Redux 中文文档

https://www.redux.org.cn/docs/react-redux/

### redux 基本概念

1. store state
2. action
3. reducer

#### 概述

dispatch(action) -->
reducer => newState -->
subscribe 触发通知

### react-redux 基本概念

1. <Provider>
2. connect
3. mapStateToProps  mapDispatc hToProps

### action 处理异步  (3 个插件）

redux-thunk
redux-promise
redux-saga

```js
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers/index'

// 创建 store 时， 作为中间件引入 redux-thunk
const store = createStore(rootReducer, applyMiddleware(thunk));
```

### 简述 Redux 中间件原理

修改dispatch