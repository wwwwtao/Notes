
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