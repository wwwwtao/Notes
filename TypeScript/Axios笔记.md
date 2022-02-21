

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
axios.interceptors.request.use(function (req) {
  // 在发送请求之前可以做一些事情 必须要返回req
  // 加入token
  req.headers.Authorization = sessionStorage.getItem('token')

  //判断非权限范围内的请求
  //1. 判断当前请求的行为（restful请求风格） 如果不是就只能用url中的字符串 反正要有规矩
  // get请求 view
  // post请求 add
  // put请求 edit
  // delete请求 delete
  const action = actionMapping[req.method]
  const currentRight = router.currentRoute.meta
  if(currentRight && currentRight.indexOf(action)===-1){
    //没有权限
    return Promise.reject('没有权限');
  }
  return req;
}, function (error) {
  // 处理请求错误
  return Promise.reject(error);
});

// 添加一个响应拦截器
axios.interceptors.response.use(function (response) {
  // 处理响应数据
  // 响应控制 比如token失效返回登录页面401 没有操作权限403
  if(res.data.meta.status === 401){
    router.push('/login')
    sessionStorage.clear()
    window.location.reload() //刷新页面 情况vuex的数据
  }
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

在访问页面的时候，服务端通过 set-cookie 往客户端种了 key 为 XSRF-TOKEN，值为 1234abc 的 cookie，作为 xsrf 的 token 值。

然后我们在前端发送请求的时候，就能从 cookie 中读出 key 为 XSRF-TOKEN 的值，然后把它添加到 key 为 X-XSRF-TOKEN 的请求 headers 中。

```typescript
axios.get('/more/get',{
  xsrfCookieName: 'XSRF-TOKEN', // default
  xsrfHeaderName: 'X-XSRF-TOKEN' // default
}).then(res => {
  console.log(res)
})
```

## 上传和下载的进度监控

我们希望给 axios 的请求配置提供 onDownloadProgress 和 onUploadProgress 2 个函数属性，用户可以通过这俩函数实现对下载进度和上传进度的监控。
xhr 对象提供了一个 progress 事件，我们可以监听此事件对数据的下载进度做监控；另外，xhr.uplaod 对象也提供了 progress 事件，我们可以基于此对上传进度做监控

## HTTP 授权

HTTP 协议中的 Authorization 请求 header 会包含服务器用于验证用户代理身份的凭证，通常会在服务器返回 401 Unauthorized 状态码以及 WWW-Authenticate 消息头之后在后续请求中发送此消息头。

axios 库也允许你在请求配置中配置 auth 属性，auth 是一个对象结构，包含 username 和 password 2 个属性。一旦用户在请求的时候配置这俩属性，我们就会自动往 HTTP 的 请求 header 中添加 Authorization 属性，它的值为 Basic 加密串。 这里的加密串是 username:password base64 加密后 (btoa()) 的结果。

## 自定义合法状态码

通过在请求配置中配置一个 validateStatus 函数，它可以根据参数 status 来自定义合法状态码的规则。

```typescript
axios.get('/more/304', {
  validateStatus(status) {
    return status >= 200 && status < 400
  }
}).then(res => {
  console.log(res)
}).catch((e: AxiosError) => {
  console.log(e.message)
})
```

## 自定义参数序列化

我们对请求的 url 参数做了处理，我们会解析传入的 params 对象，根据一定的规则把它解析成字符串，然后添加在 url 后面。在解析的过程中，我们会对字符串 encode，但是对于一些特殊字符比如 @、+ 等却不转义，这是 axios 库的默认解析规则。

当然，我们也希望自己定义解析规则，于是我们希望 ts-axios 能在请求配置中允许我们配置一个 `<b>`paramsSerializer `</b>` 函数来自定义参数的解析规则，该函数接受 params 参数，返回值作为解析后的结果

```typescript
axios.get('/more/get', {
  params: {
    a: 1,
    b: 2,
    c: ['a', 'b', 'c']
  },
  paramsSerializer(params) {
    return qs.stringify(params, { arrayFormat: 'brackets' })
  }
}).then(res => {
  console.log(res)
})
```

## baseURL（默认的基础 URL api.host）

有些时候，我们会请求某个域名下的多个接口，我们不希望每次发送请求都填写完整的 url，希望可以配置一个 baseURL，之后都可以传相对路径。如下：

```typescript
const instance = axios.create({
  baseURL: 'https://some-domain.com/api'
})

instance.get('/get')

instance.post('/post')
```

我们一旦配置了 baseURL，之后请求传入的 url 都会和我们的 baseURL 拼接成完整的绝对地址，除非请求传入的 url 已经是绝对地址

## 静态方法扩展

官方 axios 库实现了 axios.all、axios.spread 等方法

官方 axios 库也通过 axios.Axios 对外暴露了 Axios 类

另外对于 axios 实例，官网还提供了 getUri 方法在不发送请求的前提下根据传入的配置返回一个 url
