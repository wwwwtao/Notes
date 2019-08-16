#------------------------------电子书------------------------------ !!!!!!!!!!!!!!!!!

进入 `ts-axios-doc` 目录后安装项目依赖：
安装依赖后运行电子书：
浏览器打开 `http://localhost:8080/ts-axios/` 即可。


#------------------------------在vscode中用使用TS------------------------------

①在项目目录终端中 tsc --init 生成 tsconfig.json  改 "outDir": "./js",
②终端 - 运行任务 - 监视tsconfig.json

```typescript
interface Clo {
    cut: Date
}

class clo implements Clo {
    cut: Date
    constructor(h: number, m: number) {

    }
}
```

网络错误 failed
超时 canceled(已取消)
404 找不到页面

#1. 类型不同

类型不同Accept属于请求头， Content-Type属于实体头。

Http报头分为通用报头，请求报头，响应报头和实体报头。

请求方的HTTP报头结构：通用报头|请求报头|实体报头
响应方的HTTP报头结构：通用报头|响应报头|实体报头

#2. 作用不同

Accept代表发送端（客户端）希望接受的数据类型。 比如：Accept：text/xml; 代表客户端希望接受的数据类型是xml类型。

Content-Type代表发送端（客户端|服务器）发送的实体数据的数据类型。 比如：Content-Type：text/html; 代表发送端发送的数据格式是html。

二者合起来， Accept:text/xml； Content-Type:text/html ，即代表希望接受的数据类型是xml格式，本次请求发送的数据的数据格式是html。
