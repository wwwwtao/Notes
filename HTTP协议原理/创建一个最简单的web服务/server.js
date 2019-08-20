
//第一行请求（require）Node.js 自带的 http 模块，并且把它赋值给 http 变量。

// 接下来我们调用 http 模块提供的函数： createServer 。这个函数会返回 一个对象，这个对象有一个叫做 listen 的方法，这个方法有一个数值参数， 指定这个 HTTP 服务器监听的端口号。

const http = require('http')

http.createServer(function(request,response){
  console.log('request come',request.url)

  // 发送响应数据 "Hello World"
  response.end('Hello World')
}).listen(8888)

console.log('server listening on 8888')
