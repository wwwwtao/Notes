
#此笔记更多的是记录实现Axios过程中 发现的Axios 功能 使用方法和技巧  而不是Axios实现细节 因为实现细节在电子书上更详细


#Axios 能够接受的参数

```typescript
export interface AxiosRequestConfig {
  url?: string   
  method?: Method /* | 'get'| 'GET'| 'POST'| 'Delete' | 'HEAD' | 'OPTIONS' | 'PUT' | 'PATCH' 大小写都可以  */
  data?: any  /*  data是添加到请求体（body）中   post  put  patch 请求专用*/
  params?: any /* params是添加到url的请求字符串 */
  headers?: any
  responseType?: XMLHttpRequestResponseType /* type XMLHttpRequestResponseType = "" | "arraybuffer" | "blob" | "document" | "json" | "text" */
  timeout?: number
}
```

#axios 函数重载

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

2. Axios拥有 Axios 类的所有原型属性和实例属性

当直接调用 axios 方法就相当于执行了 Axios 类的 request 方法发送请求，当然我们也可以调用 axios.get、axios.post 等方法

#响应数据支持泛型 （定义后端返回数据格式 传入泛型 可 验证和推导 响应数据格式）  具体实现和使用请翻阅电子书

#拦截器

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