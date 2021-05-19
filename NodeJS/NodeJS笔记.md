## nodejs 介绍

### 使用 nvm 下载和安装

brew install nvm 安装 nvm

nvm list 查看当前所有的 node 版本

nvm install v10.13.0 安装指定的版本

nvm use --delete-prefix 10.13.0 切换到指定的版本

### nodejs 和 js 的区别

es 语法规范

js 使用 es 语法规范 外加 WebAPi  DOM 操作，BOM 操作，事件绑定，Ajax 完成浏览器端任何操作

nodejs 使用 es 语法规范 外加 NodejsAPI 处理 http 请求，处理文件 完成 server 端任何操作

### commonjs 模块

```js
// a.js
function add(a,b){
    return a+b
}
module.exports = add

// b.js
const add = require('./a')
const sun = add(1,2)
console.log(sun)    //node b.js -- 3

```

### debugge 方式

使用 VsCode 进行 debugge

### server 端和前端的区别

1. 服务稳定性
（server 端可能会遭受恶意攻击和误操作）
（不能意外挂掉）
（PM2 做进程守候）
2. 考虑内存和 cpu（优化，扩展）
（使用 stream 写日志，使用 redis 存 session）
3. 日志记录
4. 安全
5. 集群和服务拆分

## 项目介绍（项目在根目录下 NodejsWebServerBlog）

### 目标

1. 博客系统，具有博客的基本功能
2. 只开发 server 端

### 需求

1. 首页，作者主页，博客详情页
2. 登陆页
3. 管理中心，新建页，编辑页

### 技术方案

#### 数据存储

1. 博客

    | id        | title    |  content  |  createtime    |  author  |
    | ------    | -----:   | :----:    |  :----:        ｜ :----:  ｜
    | 1         | 标题 1    |  内容 1   |  1542312323232  |   wt     |

2. 用户

    | id        | username    |  password  |  realname   |
    | ------    | -----:      | :----:      |  :----:    |
    | 1         |   wt        |  123       |  文涛        |

#### 接口设计

    | 描述        | 接口            |  方法   |  url 参数                       |      备注        ｜
    | ------      | -----:         | :----: |  :----:                         |    :----:   ｜
    | 获取博客列表 |   /api/blog/list |  get  |  author 作者，keyword 搜索关键字  | 参数为空的话，则不进行查询过滤 |

#### 关于登陆

1. 业界有统一的解决方法，一般不用再重新设计
2. 实现起来比较复杂，课程后面会讲解

## 接口（不用任何框架）

### nodejs 处理 http 请求

#### nodejs 处理 get 请求

```js
const http = require('http')
const querystring = require('querystring')

const server = http.createServer((req,res)=>{
    console.log(req.method) //GET
    const url = req.url //获取请求的完整url
    req.query = querystring.parse(url.split('?')[1])    //解析querystring
    res.end(JSON.stringify(req.query))
})

server.listen(8000)

```

#### nodejs 处理 post 请求

```js
const http = require('http')

const server = http.createServer((req,res)=>{
    if(req.method === 'POST'){
        // 数据格式
        console.log('content-type',req.headers['content-type'])
        // 接收数据
        let postData = ""
        req.on('data',chunk =>{
            postData += chunk.toString()
        })
        req.on('end',() =>{
            console.log('postData',postData)
            res.end("hello world")  //在这里返回，因为是异步
        })
    }
})

server.listen(8000)

```

#### nodejs 处理路由

```js
const http = require('http')
const querystring = require('querystring')

const server = http.createServer((req,res)=>{
    const url = req.url //获取请求的完整url
    const path = url.split('?')[0]
    res.end(path)   //返回路由
})

server.listen(8000)

```

#### 处理 http 请求的综合示例

```js
const http = require('http')
const querystring = require('querystring')

const server = http.createServer((req, res) => {
    const method = req.method
    const url = req.url
    const path = url.split('?')[0]
    const query = querystring.parse(url.split('?')[1])

    // 设置返回格式为 JSON
    res.setHeader('Content-type', 'application/json')

    // 返回的数据
    const resData = {
        method,
        url,
        path,
        query
    }

    // 返回
    if (method === 'GET') {
        res.end(
            JSON.stringify(resData) //返回的都是字符串 字符串是JSON格式的  也有text/html格式的
        )
    }
    if (method === 'POST') {
        let postData = ''
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        res.on('end', () => {
            resData.postData = postData
            res.end(
                JSON.stringify(resData)
            )
        })
    }
})

server.listen(8000)
```

### 搭建开发环境

使用 nodemon 监测文件变化，自动重启 node
使用 cross-env 设置环境变量，兼容 mac linux 和 windows

### 开发接口，路由（看项目文件夹）

### 补充：路由 和 API

API：
前端和后端，不同端之间对接的一个术语
url（路由） `api/blog/list`

路由：
API 的一部分
后端系统内部的一个定义

# 原生开发

## 数据存储

### 表操作

```sql
-- insert into users (username,`password`,realname) values('lisi','123','李四');

-- select * from users;
-- select * from users where username like '%w%';
-- select * from users where password like '%1%' order by id desc;

-- SET SQL_SAFE_UPDATES=0;
-- update users set username='wentao' where username='wt';

-- delete from users where username='lisi';
-- select * from users where state <> '0';
-- update users set state = '1' where username='wentao'; -- 软删除

-- insert into blogs(title,content,createtime,author) values('标题B', '内容B',1546874444444,'lisi');
-- delete from blogs where author='list';
-- select * from users;
-- select * from blogs order by createtime desc;
```

经典 SQL 语句大全
https://blog.csdn.net/znyyjk/article/details/52717336

```sql
选择：select * from table1 where 范围
插入：insert into table1(field1,field2) values(value1,value2)
删除：delete from table1 where 范围
更新：update table1 set field1=value1 where 范围
查找：select * from table1 where field1 like ’%value1%’ ---like 的语法很精妙，查资料！
排序：select * from table1 order by field1,field2 [desc]
总数：select count as totalcount from table1
求和：select sum(field1) as sumvalue from table1
平均：select avg(field1) as avgvalue from table1
最大：select max(field1) as maxvalue from table1
最小：select min(field1) as minvalue from table1

UNION 运算符通过组合其他两个结果表（例如 TABLE1 和 TABLE2）并消去表中任何重复行而派生出一个结果表。当 ALL 随 UNION 一起使用时（即 UNION ALL），不消除重复行。两种情况下，派生表的每一行不是来自 TABLE1 就是来自 TABLE2。

EXCEPT 运算符通过包括所有在 TABLE1 中但不在 TABLE2 中的行并消除所有重复行而派生出一个结果表。当 ALL 随 EXCEPT 一起使用时 (EXCEPT ALL)，不消除重复行。

INTERSECT 运算符通过只包括 TABLE1 和 TABLE2 中都有的行并消除所有重复行而派生出一个结果表。当 ALL 随 INTERSECT 一起使用时 (INTERSECT ALL)，不消除重复行。
```

### nodejs 连接 mysql

npm install mysql

```js
// index.js

// // 创建连接对象
// const con = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'wen19980714',
//     port: '3306',
//     database: 'myblog'
// })

const mysql = require('mysql')
// 根据 NODE_ENV 区分配置
const { MYSQL_CONF } = require('../conf/db')

// 创建连接对象
const con = mysql.createConnection(MYSQL_CONF)

// 开始连接
con.connect()

// 统一执行sql语句
function exec(sql) {
    const promise = new Promise((reslove, reject) => {
        con.query(sql, (err, result) => {
            if (err) {
                reject(err)
                return
            }
            reslove(result)
        })
    })
    return promise
}

module.exports = {
    exec    //封装 exec 函数，API 使用 exec 操作数据库
}

// // 关闭连接
// con.end()
```

## 登陆

核心： 登陆校验 & 登陆信息存储

cookie 和 session

session 写入 redis（内存数据库）

### cookie

1. 存储再浏览器的一段字符串（最大 5kb）
2. 跨域不共享
3. 格式如 k1=v1；
4. 每次发送 http 请求，会将请求域（要访问的页面）的 cookie 一起发送给 server
5. server 可以修改 cookie 并返回给浏览器
6. 浏览器也可以通过 js 修改 cookie（有限制）

#### server 端 nodejs 操作 cookie

res.setHeader('Set-Cookie', `username=${data.username}; path=/; httpOnly; expires=${getCookieExpires()}`)

### session

上一节的问题：用 cookie 会暴露 username
如何解决：cookie 中存储 userid，server 端对应 username
解决方案：session 即 server 端存储用户信息

```js
 // 解析 session
    let needSetCookie = false
    let userId = req.cookie.userid
    if (userId) {
        if (!SESSION_DATA[userId]) {
            SESSION_DATA[userId] = {}
        }
    } else {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        SESSION_DATA[userId] = {}
    }
    req.session = SESSION_DATA[userId]
    // cookie + session 登陆部分个人理解笔记：
    // 1. 每次都从请求cookier中拿userID
    // 2. 判断拿到没有 没有就设一个userID并Set-Cookie
    // 3. 根据SESSION_DATA查userID的值 并赋值给req.session
    // 4. 然后在每个请求里面判断req.session(在登陆时要设置好的 看步骤5) 有且没过期就是已登陆 否则就是没登陆

    // 5. 登陆了！！！在登陆时设置好req.session 是重点!!! 登陆的时候设置的req.session 会同步设置存到SESSION_DATA中!!!
```

#### cookie 和 session 的区别：

1、cookie 数据存放在客户的浏览器上，session 数据放在服务器上。
2、cookie 不是很安全，别人可以分析存放在本地的 COOKIE 并进行 COOKIE 欺骗 考虑到安全应当使用         session。
3、session 会在一定时间内保存在服务器上。当访问增多，会比较占用你服务器的性能考虑到减轻服务器性能方面，应当使用 COOKIE。
4、单个 cookie 保存的数据不能超过 4K，很多浏览器都限制一个站点最多保存 20 个 cookie。
5、所以个人建议：
   将登陆信息等重要信息存放为 SESSION
   其他信息如果需要保留，可以放在 COOKIE 中

session 和 cookie 的生命周期
    Session 存储在服务器端，一般放在服务器的内存中（为了高速存取），Sessinon 在用户访问第一次访问服务器时创建，需要注意只有访问 JSP、Servlet 等程序时才会创建 Session，只访问 HTML、IMAGE 等静态资源并不会创建 Session，可调用 request.getSession(true) 强制生成 Session。

#### session 的问题

目前 session 直接是 js 变量  也就是 SESSION_DATA 是一个对象，放在 nodejs 进程内存中

1. 进程内存有限，访问量过大，内存暴增怎么办
2. 正式线上运行是多线程，进程之间内存无法共享

解决方案：redis

### redis

#### 介绍

1. web server 最常用的缓存数据库，数据放在内存中
2. 相比于 mysql，访问速度快（内存和硬盘不是一个数量级的）
3. 但是成本更高，可存储的数据量更小（内存的硬伤）

相当于将 web server 和 redis 拆分成两个单独的服务
双方都是独立的，都是可扩展的

为什么 session 不放在 mysql 中？
1. 因为 session 访问频繁，对性能要求极高
2. session 可不考虑断电丢失数据的问题（数据不是很重要，大不了重新登陆 同时也是内存的硬伤，做配置也可以断电不丢失）
3. session 数据量不会太大（相比与 mysql 中存储的数据）

#### 安装

MAC 使用 brew install redis
用 2 个终端执行
执行 redis-server
执行 redis-cli

#### nodejs 连接 redis

npm install redis

```js
// index.js
const redis = require('redis')
const { REDIS_CONF } = require('../conf/db')

// 创建客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)
redisClient.on('error', err => {
    console.log(err);
})

function set(key, val) {
    if (typeof val === 'object') {
        val = JSON.stringify(val)
    }
    redisClient.set(key, val, redis.print)
}
function get(key) {
    const promise = new Promise((reslove, reject) => {
        redisClient.get(key, (err, val) => {
            if (err) {
                reject(err)
                return
            }
            if (val == null) {
                reslove(null)
                return
            }

            try {
                reslove(
                    JSON.parse(val)
                )
            } catch (error) {
                reslove(val)
            }
        })
    })
    return promise
}

module.exports = {
    set,
    get
}
// // 退出
// redisClient.quit()
```

### nginx

高性能 web 服务器 开源免费
一般用于做静态服务，负载均衡
反向代理

#### 安装

brew install nginx

打开配置文件
Mac： sudo vim /usr/local/etc/nginx/nginx.conf
nginx -t    // 测试配置文件格式是否正确
nginx // 启动
nginx -s reload // 重启
nginx -s stop   // 停止

## 日志

1. 访问日志（access log）
2. 自定义日志（自定义事件，错误记录）
3. nodejs 文件操作，nodejs stream（性能）
4. 日志功能开发和使用
5. 日志文件拆分，日志内容分析

### stream（IO 操作的性能瓶颈）（项目在根目录下 NodejsWebServerBlog/stream-test）

#### 日志拆分

实现方式：linux 的 crontab 命令，即定时任务
设置格式： *****command （5 课星号分别代表：分钟 小时 日期 月份 星期几 ）
将 access 拷贝并重命名 2021.5.17.access.log
清空 access.log 文件 继续积累日志

主要是运维用 shell 脚本

#### 日志分析

<!-- readline.js -->

使用 nodejs 的 readline （基于 stream，效率高）

## 安全

server 端攻击方式多 预防方式也多
本课只讲常用的 web server 层面的
有些需要硬件和服务支持（OP 支持），如 DDOS

1. sql 注入：窃取数据库内容
攻击方式：输入一个 sql 片段 ，最终拼接成一段攻击代码
预防措施：使用 mysql 的 escape 函数输入内容即可

2. xss 攻击：窃取前端的 cookie
攻击方式：输入 js 代码让浏览器执行
预防措施：
防范 XSS 是需要后端 RD 和前端 RD 共同参与的系统工程
转义应该在输出 HTML 时进行，而不是在提交用户输入时。
不同的上下文，如 HTML 属性、HTML 文字内容、HTML 注释、跳转链接、内联 JavaScript 字符串、内联 CSS 样式表等，所需要的转义规则不一致。
业务 RD 需要选取合适的转义库，并针对不同的上下文调用不同的转义规则。
其他安全措施：
HTTP-only Cookie: 禁止 JavaScript 读取某些敏感 Cookie，攻击者完成 XSS 注入后也无法窃取此 Cookie。
验证码：防止脚本冒充用户提交危险操作。
npm i xss --save // 预防 xss 攻击的 npm 包
给可能会被 xss 攻击的参数用 xss 方法包一下

3. 密码加密：保护用户信息
万一数据库被攻破，用户信息是不应该泄露的

```js
//NodejsWebServerBlog/blog1/src/utils/cryp.js
const crypto = require('crypto')

// 密匙
const SECRET_KEY = 'WJiol_8776#'

// md5 加密
function md5(content) {
    let md5 = crypto.createHash('md5')
    return md5.update(content).digest('hex')
}

// 加密函数
function genPassword(password) {
    const str = `password=${password}&key=${SECRET_KEY}`
    return md5(str)
}

module.exports = {
    genPassword
}
```

# express 框架开发

## 安装 express-generator 脚手架

1. npm install express-generator -g
2. express 文件夹名字

## 介绍 app.js

```js
var createError = require('http-errors');   //处理错误提示
var express = require('express');   // express框架
var path = require('path');         // nodejs的path模块 处理路径
var cookieParser = require('cookie-parser');    //解析cookie
var logger = require('morgan');     // 记录日志log
const session = require('express-session')  // 处理session插件
const RedisStore = require('connect-redis')(session) // connect-redis 插件

var indexRouter = require('./routes/index');    // 路由
var usersRouter = require('./routes/users');    // 路由

var app = express();    // 初始化一个app 本次http请求的实例

// view engine setup //试图引擎相关 纯后端不管
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

const ENV = process.env.NODE_ENV
if (ENV !== 'production') {  // 记录日志log
  // 开发环境
  app.use(logger('dev'));
} else {
  // 线上环境
  const fullFileName = path.join(__dirname, 'logs', 'access.log')
  const writeStream = fs.createWriteStream(fullFileName, {
    flags: 'a'
  })
  app.use(logger('combined', {
    stream: writeStream
  }));
}

app.use(express.json());    // 处理 post请求数据 执行这步之后 req.body 可以拿到postData
app.use(express.urlencoded({ extended: false }));   // 设置Content-type 让POST请求兼容所有的Content-type
app.use(cookieParser());    // 经过这步之后可以在路由中 req.cookies拿到cookie
// app.use(express.static(path.join(__dirname, 'public')));    // 可以通过这个注册 让访问静态文件的时候 返回静态文件 也是前端的 不管

const redisClient = require('./db/redis') //redis 连接对象
let sessionStore = new RedisStore({
  client: redisClient //client-客户端
})
app.use(session({ //注册之后 可在 req.session 中取到session
  secret: 'WJiol#23123_',
  cookie: {
    // path: '/',   // 默认配置
    // httpOnly: true,  // 默认配置
    maxAge: 24 * 60 * 60 * 1000
  },
  store: sessionStore
}))

app.use('/', indexRouter); // 注册路由 第一个参数是路由文件对应的（父路径）根路径  相当于可以给路由设置2个路径
app.use('/users', usersRouter); // 注册路由

// catch 404 and forward to error handler //处理错误提示
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

```

## express 中间件机制 / app.use 和 next

## 登陆

使用 express-session 和 connect-redis

```js
npm i express-session
const session = require('express-session')
app.use(session({
  secret: 'WJiol#23123_',
  cookie: {
    // path: '/',  //默认
    // httpOnly: true, //默认
    maxAge: 24 * 60 * 60 * 1000
  }
}));
```

```js
npm i redis connect-redis --save
const RedisStore = require('connect-redis')(session) // connect-redis 插件
const redisClient = require('./db/redis') //redis 连接对象
let sessionStore = new RedisStore({
  client: redisClient //client-客户端
})
app.use(session({ //注册之后 可在 req.session 中取到session
  secret: 'WJiol#23123_',
  cookie: {
    // path: '/',   // 默认配置
    // httpOnly: true,  // 默认配置
    maxAge: 24 * 60 * 60 * 1000
  },
  store: sessionStore
}))
```

## 日志

access log 记录 使用脚手架推荐的 morgan

自定义日志使用 console.log 和 console.error 即可

```js
var path = require('path');
const fs = require('fs')
var logger = require('morgan');

const ENV = process.env.NODE_ENV
if (ENV !== 'production') {
  // 开发环境
  app.use(logger('dev'));
} else {
  // 线上环境
  const fullFileName = path.join(__dirname, 'logs', 'access.log')
  const writeStream = fs.createWriteStream(fullFileName, {
    flags: 'a'
  })
  app.use(logger('combined', {
    stream: writeStream
  }));
}
```

## 中间件原理 (NodejsWebServerBlog/lib/express/like-express.js）

# Koa2 框架开发

## 安装 koa-generator 脚手架

1. npm install koa-generator -g
2. koa2 文件夹名字

## 介绍 app.js

```js
const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')  // 前端相关的 对应views文件夹里的
const json = require('koa-json')    // 处理postdata JSON格式处理的
const onerror = require('koa-onerror')  // 错误监测
const bodyparser = require('koa-bodyparser') // postdata req.body 相关
const logger = require('koa-logger')  //日志相关
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const path = require('path')
const fs = require('fs')
const morgan = require('koa-morgan')

const { REDIS_CONF } = require('./conf/db')

const index = require('./routes/index')
const users = require('./routes/users')
const user = require('./routes/user')
const blog = require('./routes/blog')

// error handler
onerror(app)

// middlewares

// 处理post上传的数据 enableTypes:接收的格式 把post字符串 变成 json格式
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())

app.use(logger()) //日志相关
app.use(require('koa-static')(__dirname + '/public')) //前端相关

app.use(views(__dirname + '/views', { //前端相关
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => { //日志相关
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`) //打印请求耗时
})
const ENV = process.env.NODE_ENV
if (ENV !== 'production') {
  // 开发环境
  app.use(morgan('dev'));
} else {
  // 线上环境
  const fullFileName = path.join(__dirname, 'logs', 'access.log')
  const writeStream = fs.createWriteStream(fullFileName, {
    flags: 'a'
  })
  app.use(morgan('combined', {
    stream: writeStream
  }));
}

// session 配置
app.keys = ['WJiol#23123_']
app.use(session({
  // 配置 cookie
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  },
  // 配置 redis
  store: redisStore({
    all: `${REDIS_CONF.host}:${REDIS_CONF.port}`
  })
}))

// routes
app.use(index.routes(), index.allowedMethods()) //allowedMethods  就是当前接口运行的method。 比如，一个提供数据的接口，就可以设置为GET， 当客户端发送POST请求时，就会直接返回失败。
app.use(users.routes(), users.allowedMethods())
app.use(user.routes(), user.allowedMethods())
app.use(blog.routes(), blog.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app

```

## 登陆

使用 koa-generic-session 和 koa-redis

```js
// npm i koa-generic-session koa-redis redis
// session 配置
app.keys = ['WJiol#23123_']
app.use(session({
  // 配置 cookie
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  },
  // 配置 redis
  store: redisStore({
    all: `${REDIS_CONF.host}:${REDIS_CONF.port}`
  })
}))
```

## 日志

access log 记录 使用 morgan (morgan 仅支持 express 所以要安装 koa-morgan 兼容实现）

自定义日志使用 console.log 和 console.error 即可

```js
// npm i koa-morgan
var path = require('path');
const fs = require('fs')
var logger = require('koa-morgan');

const ENV = process.env.NODE_ENV
if (ENV !== 'production') {
  // 开发环境
  app.use(logger('dev'));
} else {
  // 线上环境
  const fullFileName = path.join(__dirname, 'logs', 'access.log')
  const writeStream = fs.createWriteStream(fullFileName, {
    flags: 'a'
  })
  app.use(logger('combined', {
    stream: writeStream
  }));
}
```

## 中间件原理 (NodejsWebServerBlog/lib/koa2/like-koa2.js）

# 上线与配置 PM2

### PM2 介绍 也是 PM2 的核心价值

1. 进程守护，系统崩溃自动重启
2. 多进程，充分利用 cpu 和内存
3. 自带日志记录功能

### 下载安装

npm install pm2 -g

### 常用命令

pm2 start ... （可以接配置文件）
pm2 list  （看启动的服务列表）
pm2 restart<AppName>/<id> （重启）
pm2 stop<AppName>/<id> ,pm2 delete<AppName>/<id>
pm2 info<AppName>/<id> （看服务的基本信息）
pm2 log<AppName>/<id> （看进程的日志）
pm2 monit<AppName>/<id> （看进程的 cpu 和内存信息）

### 进程守护

pm2 遇到进程崩溃，会自动重启

### 配置

新建 PM2 配置文件 （包括进程数量，日志文件目录等）

```json
// pm2.conf.json 配置文件
{
    "apps": {
        "name": "pm2-test-server", // 服务进程的名字
        "script": "app.js", //启动的文件
        "watch": true,  //监听文件变化 自动重启 （开发需要，线上不一定）
        "ignore_watch": [   //不需要监听的
            "node_modules",
            "logs"
        ],
        "instances": 4, // 设置多进程
        "error_file": "logs/err.log", // 错误日志
        "out_file": "logs/out.log",   // console.log 打印的日志
        "log_date_format": "YYYY-MM-DD HH:mm:ss"  // 日志日期格式
    }
}
```

修改 PM2 启动命令，重启

```json
// package.json
{
    "scripts": {
        "prd": "cross-env NODE_ENV=production pm2 start pm2.conf.json    "
    }
}
```

### 多进程

为何使用？：操作系统会限制一个进程的最大可用内存
无法利用机器全部内存和多核 cpu 的优势

#### 关于运维

一般由专业的 OP 人员和部门来处理
中小型推荐使用云服务 如 阿里云的 node 平台
