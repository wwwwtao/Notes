### node 项目初始化

命令行模式下，在要创建项目的文件夹下，执行：npm init

#### vscode node.js 智能提示功能插件 typings 安装

```js
// 下载 rypings 包
cnpm install -g typings
// 查看是否安装
typings -v
// 进入项目文件下安装
typings init
// 安装 node 插件
typings install dt~node --global --save
```

### node 的模块

#### 全局模块：不需要引用，直接可使用的模块

    如：process

        process.env 查看环境变量

        process.argv 参数数组

#### 系统模块：node 自带的模块，不需要单独下载，但是在使用时，需要 require()，而全局模块不用 require ，直接使用

    如：path 用于处理文件路径和目录路径的模块

        fs 文件读写模块

#### 自定义模块

    定义：require 自己封装的模块

## node 如何处理 http 请求示例

### GET 请求

什么是 GET 请求？主要就是获取数据

数据是放在 url 里面进行传输（请求头）

容量小：<32k

```js
//最简单的GET请求示例

const http = require('http')
const querystring = require('querystring')

const server = http.createServer((req, res) => {
    console.log("method:", req.method) //method: GET

    const url = req.url
    console.log('url:', url) //url: /api/blog?user=wentao&pass=123

    req.query = querystring.parse(url.split("?")[1]) //问好分割成数组2项 后面哪项
    console.log('query:', req.query) //query: [Object: null prototype] { user: 'wentao', pass: '123' }

    res.end(
        JSON.stringify(req.query) //{"user":"wentao","pass":"123"}
    )
})

server.listen(8000)
```

### POST 请求

什么是 GET 请求？主要就是传递数据

数据是放在 body 里面进行传输

容量大： <2G

```js
//最简单的POST请求示例
const http = require('http')

const server = http.createServer((req, res) => {
    if (req.method === 'post') {
        console.log('req content-type:', req.headers['content-type']) //数据格式 比如application/json
        //接受数据
        let postData = ''
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        req.on('end', () => {
            console.log('postData:', postData) //JSON的字符串
            res.end('hello world')
        })

    }
})

server.listen(8000)
```

### node 处理路由

```js

const http = require('http')

const server = http.createServer((req, res) => {
    const url = req.url
    const path = url.split("?")[0]
    res.end(path) //返回路由
})

server.listen(8000)
```

### 处理 http 请求的综合示例

```js


//4-4 处理http请求的综合示例
const http = require('http')
const querystring = require('querystring')

const server = http.createServer((req, res) => {
    const method = req.method
    const url = req.url
    const path = url.split('?')[0]
    const query = querystring.parse(url.split("?")[1])

    //设置返回格式为 JSON
    res.setHeader('Content-type', 'application/json')

    //定义返回的数据
    const resData = {
        method,
        url,
        path,
        query
    }

    //返回
    if (method === 'GET') {
        res.end(JSON.stringify(resData))
    }

    if (method === 'POST') {
        let postData = ''
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        req.on('end', () => {
            res.resData = postData
            res.end(JSON.stringify(resData))
        })
    }
})

server.listen(8000)
```
