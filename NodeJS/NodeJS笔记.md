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

### http 概述

DNS 解析（根据域名知道 ip 地址），建立 TCP 链接（三次握手），发送 http 请求
serer 接收到 http 请求，处理，并返回
客户端接收到返回数据，处理数据

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

### 开发接口

看项目文件夹

### 开发路由

看项目文件夹

### 补充：路由 和 API

API：
前端和后端，不同端之间对接的一个术语
url（路由） `api/blog/list`

路由：
API 的一部分
后端系统内部的一个定义

## 数据存储

### 建库

### 建表

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

### node 连接 mysql

npm install mysql

```js
// index.js
const mysql = require('mysql')

// 创建连接对象
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'wen19980714',
    port: '3306',
    database: 'myblog'
})

// 开始连接
con.connect()

// 执行sql语句
const sql = 'select * from users;'
con.query(sql, (err, result) => {
    if (err) {
        console.error(err);
        return
    }
    console.log(result);
})

// 关闭连接
con.end()
```

根据 NODE_ENV 区分配置

封装 exec 函数，API 使用 exec 操作数据库

### 总结

安装 Mysql 和 workbench

创建 库 表 SQL 语句的语法和使用

nodejs 连接 mysql， 应用到 API

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

1. web server 最常用的缓存数据库，数据放在内存中
2. 相比于 mysql，访问速度快（内存和硬盘不是一个数量级的）
3. 但是成本更高，可存储的数据量更小（内存的硬伤）

相当于将 web server 和 redis 拆分成两个单独的服务
双方都是独立的，都是可扩展的

为什么 session 不放在 mysql 中？
1. 因为 session 访问频繁，对性能要求极高
2. session 可不考虑断电丢失数据的问题（数据不是很重要，大不了重新登陆 同时也是内存的硬伤，做配置也可以断电不丢失）
3. session 数据量不会太大（相比与 mysql 中存储的数据）
