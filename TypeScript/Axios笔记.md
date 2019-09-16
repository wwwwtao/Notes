# 此笔记更多的是记录实现 Axios 过程中 发现的 Axios 功能 使用方法和技巧  而不是 Axios 实现细节 因为实现细节在电子书上更详细

## Axios 能够接受的参数

```typescript
export interface AxiosRequestConfig {
  url?: string
  method?: Method /* | 'get'| 'GET'| 'POST'| 'Delete' | 'HEAD' | 'OPTIONS' | 'PUT' | 'PATCH' 大小写都可以  */
  data?: any  /*  data是添加到请求体（body）中   post  put  patch 请求专用*/
  params?: any /* params是添加到url的请求字符串 */
  headers?: any
  responseType?: XMLHttpRequestResponseType /* type XMLHttpRequestResponseType = "" | "arraybuffer" | "blob" | "document" | "json" | "text" */
  timeout?: number

  [propName: string]: any

  transformRequest?: AxiosTransformer | AxiosTransformer[]
  transformResponse?: AxiosTransformer | AxiosTransformer[]
}
```

## axios 函数重载

1. Axios 本身是一个函数 可传入两个参数

```typescript
axios({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: 'hi'
  }
})

axios('/extend/post', {
  method: 'post',
  data: {
    msg: 'hello'
  }
})
```

2. Axios 拥有 Axios 类的所有原型属性和实例属性

当直接调用 axios 方法就相当于执行了 Axios 类的 request 方法发送请求，当然我们也可以调用 axios.get、axios.post 等方法

## 响应数据支持泛型 （定义后端返回数据格式 传入泛型 可 验证和推导 响应数据格式）  具体实现和使用请翻阅电子书

## 拦截器

```typescript
// 添加一个请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前可以做一些事情
  return config;
}, function (error) {
  // 处理请求错误
  return Promise.reject(error);
});
// 添加一个响应拦截器
axios.interceptors.response.use(function (response) {
  // 处理响应数据
  return response;
}, function (error) {
  // 处理响应错误
  return Promise.reject(error);
});

/* 在 axios 对象上有一个 interceptors 对象属性，
该属性又有 request 和 response 2 个属性，
它们都有一个 use 方法，use 方法支持 2 个参数，第一个参数类似 Promise 的 resolve 函数，第二个参数类似 Promise 的 reject 函数。
我们可以在 resolve 函数和 reject 函数中执行同步代码或者是异步代码逻辑。

并且我们是可以添加多个拦截器的，拦截器的执行顺序是链式依次执行的方式。
对于 request 拦截器，后添加的拦截器会在请求前的过程中先执行；
对于 response 拦截器，先添加的拦截器会在响应后先执行。 */

// 此外，我们也可以支持删除某个拦截器，如下：  eject()
const myInterceptor = axios.interceptors.request.use(function () {/*...*/})
axios.interceptors.request.eject(myInterceptor)
```

## 默认配置，定义一些默认的行为

```typescript
axios.defaults.headers.common['test'] = 123
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.timeout = 2000
```

## transformRequest 和 transformResponse 两个默认字段，它们的值是一个数组或者是一个函数

其中 transformRequest 允许你在将请求数据发送到服务器之前对其进行修改，这只适用于请求方法 put、post 和 patch, 如果值是数组，则数组中的最后一个函数必须返回一个字符串或 FormData、URLSearchParams、Blob 等类型作为 xhr.send 方法的参数，而且在 transform 过程中可以修改 headers 对象。

而 transformResponse 允许你在把响应数据传递给 then 或者 catch 之前对它们进行修改。

当值为数组的时候，数组的每一个函数都是一个转换函数，数组中的函数就像管道一样依次执行，前者的输出作为后者的输入。

使用方法如下：

```typescript
  transformRequest: [(function(data) {
    return qs.stringify(data)   //要有返回值
  }), ...(axios.defaults.transformRequest as AxiosTransformer[])],
  transformResponse: [...(axios.defaults.transformResponse as AxiosTransformer[]), function(data) {
    if (typeof data === 'object') {
      data.b = 2
    }
    return data
  }],
```

## axios.create

允许我们传入新的配置和默认配置合并，并做为新的默认配置。

## 取消功能的实现

```typescript
// 方式一
const CancelToken = axios.CancelToken
const source = CancelToken.source()

axios.get('/cancel/get', {
  cancelToken: source.token
}).catch(function(e) {
  if (axios.isCancel(e)) {
    console.log('Request canceled', e.message)
  }
})

source.cancel('Operation canceled by the user.')

//方式二
let cancel: Canceler

axios.get('/cancel/get', {
  cancelToken: new CancelToken(c => {
    cancel = c
  })
}).catch(function(e) {
  if (axios.isCancel(e)) {
    console.log('Request canceled')
  }
})

cancel()

```

## withCredentials（跨域请求携带 Cookie)

在同域的情况下，我们发送请求会默认携带当前域下的 cookie，但是在跨域的情况下，默认是不会携带请求域下的 cookie 的，比如 http://domain-a.com 站点发送一个 http://api.domain-b.com/get 的请求，默认是不会携带 api.domain-b.com 域下的 cookie，如果我们想携带（很多情况下是需要的），只需要设置请求的 xhr 对象的 withCredentials 为 true 即可。

```typescript
axios.post('http://127.0.0.1:8088/more/server2', { }, {
  withCredentials: true
}).then(res => {
  console.log(res)
})
```

## XSRF 防御

我们允许用户配置 xsrfCookieName 和 xsrfHeaderName，其中 xsrfCookieName 表示存储 token 的 cookie 名称，xsrfHeaderName 表示请求 headers 中 token 对应的 header 名称

```typescript
axios.get('/more/get',{
  xsrfCookieName: 'XSRF-TOKEN', // default
  xsrfHeaderName: 'X-XSRF-TOKEN' // default
}).then(res => {
  console.log(res)
})
```
