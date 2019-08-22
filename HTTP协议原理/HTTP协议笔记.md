 ## HTTP/0.9

 只有一个命令get ，   没有Header ,   服务器发送完毕就关闭TCP连接

 ## HTTP/1.0or1.1

 增加了很多命令，   增加了status code 和 header

 持久连接 ，   pipeline ,   增加host

 ## HTTP/2

 所有数据以二进制传输

 同一个连接发送多个请求不再需要按顺序来(现在是并发发送请求 但是服务器响应请求要一个一个来)

 头信息压缩以及推送等提高效率的功能（请求html同时 推送js，css到客户端  并行下载html，css，js）

## 为什么使用三次握手？ HTTP三次握手连接示例 https://www.jianshu.com/p/ae3715d0cf80

  为了防止已失效的连接请求报文段突然又传送到了服务端，因而产生错误 ——谢希仁著《计算机网络》第四版
  谢希仁版《计算机网络》中的例子是这样的，“已失效的连接请求报文段”的产生在这样一种情况下：client发出的第一个连接请求报文段并没有丢失，而是在某个网络结点长时间的滞留了，以致延误到连接释放以后的某个时间才到达server。本来这是一个早已失效的报文段。但server收到此失效的连接请求报文段后，就误认为是client再次发出的一个新的连接请求。于是就向client发出确认报文段，同意建立连接。假设不采用“三次握手”，那么只要server发出确认，新的连接就建立了。由于现在client并没有发出建立连接的请求，因此不会理睬server的确认，也不会向server发送数据。但server却以为新的运输连接已经建立，并一直等待client发来数据。这样，server的很多资源就白白浪费掉了。采用“三次握手”的办法可以防止上述现象发生。例如刚才那种情况，client不会向server的确认发出确认。server由于收不到确认，就知道client并没有要求建立连接。”

  主要目的防止server端一直等待，浪费资源。

## 自己的理解：

  第一次 客户端-服务端 Seq=0(我不知道有没有被成功接收的数据)

  第二次 服务端-客户端 Seq=0(我不知道有没有被成功接收的数据)  Ack=1(但是我接收了一个数据)

  第三次 客户端-服务端 Seq=1(我此时知道了一个被成功接收的数据)  Ack=1(我也接收了一个数据)  准备好建立连接发给服务端 之后连接建立

  观察 SYN 的含义：同部字段。如果客户端和服务器端都需要使用 SYN-ACK 机制同步一下的话，最少是需要 3 次握手的。另一方面服务器资源相对于客户端资源是更加重要一点。

  序号 seq ：发送了多少被成功接受的数据。

  确认号 ack：接受了多少数据

  发送端的 seq 字段需要接收到服务器段的 ack 才会变化，这个时候 服务器 ack = 客户端 seq


 ## 应用层协议(HTTP协议)    ==>传输层（TCP）==>网络层==>数据链路层==>物理层：

 只要能够保证，一端发送时构造的数据，另一端能够正确的解析，就是ok的，这种约定就是应用层协议

1. 认识URL

! [URL结构图](https://raw.githubusercontent.com/wwwwtao/Notes/master/HTTP协议原理/images/认识URL.png)

2. HTTP协议格式

（1）HTTP请求

主要分为四部分：

    1）请求行：在HTTP请求报文中第一行即为请求行，以空格为界，分为三个区域：【请求方法，常为GET/POST】+【想请求的资源url】+【HTTP协议版本，常为1.0/1.1】；

    2）请求报头Header：在HTTP请求报文中从第二行到空行之前的即为请求报头，是请求属性，均以冒号分割的键值对形式呈现，每组属性间用 \n 分隔；

    3）空行：表示报头已完，不能省略

    4）请求正文Body：空行以后的均是请求正文，表示要提交给浏览器看的消息，允许为空字符串。若Body存在，在Header中有一个Content-Length属性来表标识Body的长度；若服务器返回一个html页面，那么html页面内容就是在Body中

其中：

    1）GET方法：请求消息在正文中

    2）POST方法：请求消息在报文中

主要格式如下图：（请求报文）

! [HTTP协议格式图](https://github.com/wwwwtao/Notes/blob/master/HTTP协议原理/images/HTTP协议格式.png)

（2）响应报文 response

主要分四部分：

    1）响应行：在HTTP请求报文中第一行即为请求行，以空格为界，分为三个区域：【协议版本号】+【状态码】+【状态码解释】；

    2）响应报头Header：在HTTP请求报文中从第二行到空行之前的即为请求报头，表示请求的属性；

    3）空行：表示报头已完，不能省略；

    4）响应正文Body：空行以后的均是请求正文，允许为空字符串；若Body存在，在Header中有一个Content-Length属性来表标识Body的长度；若服务器返回一个html页面，那么html页面内容就是在Body中。

具体响应报文如下图（其中一部分，响应正文没有截完）：

! [响应报文图](https://github.com/wwwwtao/Notes/blob/master/HTTP协议原理/images/响应报文.png)

3. HTTP的方法

具体方法见下表，常用方法有GET与POST方法：

! [HTTP的方法图](https://github.com/wwwwtao/Notes/blob/master/HTTP协议原理/images/HTTP的方法.png)

4. HTTP的状态码

HTTP的状态码有以下几种，其中重定向状态码又分为永久性重定向、临时性重定向两种。

! [HTTP的状态码图](https://github.com/wwwwtao/Notes/blob/master/HTTP协议原理/images/HTTP的状态码.png)

5. HTTP常见Header（报头）

（1）Content-Type：数据类型（text/html等）

（2）Content-Length：请求正文的长度（字节为单位）

（3）Host：客户端告知服务器，所请求的资源是在哪台主机的哪个端口上

（4）User-Agent：声明用户的操作系统和浏览器版本信息

（5）referer：表明当前页面是从哪个页面跳转过来的

（6）location：跳转重定向，告诉客户端接下来要去哪访问，要搭配状态码3xx使用

（7）Cookie：是一个本地文件，用于在客户端存储少量信息，通常用于实现会话的功能。比如，在登录某个账号以及密码时，计算机允许在信息输入后，保存到本地上，以实现下次不用输入，这些信息会在，这样产生的文件就叫做Cookie。但是Cookie有安全隐患，因为保存的信息当中可能会有密码等。

Cookie的具体工作原理为：当用户访问某个带Cookie的网站时，该网站的服务器该用户产生一个标识符，并将该标识符作为索引在后台的数据库中生成一个项目。然后在响应报文中添加一个“Set-Cookie：标识符”的键值对。当浏览器收到响应之后，会将“服务器的主机名和标识符”添加在它管理的Cookie文件中。当用户继续浏览该网站时，浏览器会将在请求报文中添加“Cookie:标识符”的键值对，发送给服务器，这样服务器便可以根据标识符知道用户之前的活动状态了。

## 创建一个最简单的web服务（node.js版）

```javascript
//第一行请求（require）Node.js 自带的 http 模块，并且把它赋值给 http 变量。

// 接下来我们调用 http 模块提供的函数： createServer 。这个函数会返回 一个对象，这个对象有一个叫做 listen 的方法，这个方法有一个数值参数， 指定这个 HTTP 服务器监听的端口号。

const http = require('http')

http.createServer(function(request,response){
  console.log('request come',request.url)

  // 发送响应数据 "Hello World"
  response.end('Hello World')
}).listen(8888)

console.log('server listening on 8888')
```

## CORS跨域请求的限制与解决

### 什么是跨域：
协议、端口号、域名 都相同才是同一个域。

需要注意的是：协议不同（eg:https和http）或者端口号不同造成的跨域，前端是无法解决的。

在命令行 curl 发送请求是不会有限制的。

跨域是 浏览器 CORS 做出的同源限制

### 跨域请求的解决

1. 请求服务器的 响应头 设置 'Access-Control-Allow-Origin'
```javascript
response.writeHead(200,{
    /* 'Access-Control-Allow-Origin': '*'  //这样是不安全的 所有人都可以访问我们的内容 */
    'Access-Control-Allow-Origin': 'http://127.0.0.1:8888'
  })

  /* 如果想添加多个域 可以做判断（在服务端） 判断是允许的域就写入到 Access-Control-Allow-Origin 中 */
```

2. JSONP  浏览器允许 link img script 这类在标签上写 src路径加载内容 是跨域的
```javascript
<script src="http://127.0.0.1:8887/"></script>
```


