

const http = require('http')
const fs = require('fs')

http.createServer(function (request, response) {
  console.log('request come', request.url)

  if (request.url === '/') {
    const html = fs.readFileSync('test.html', 'utf-8')
    response.writeHead(200, {
      'Content-type': 'text/html'
    })
    response.end(html)
  }

  if (request.url === '/script.js') {
    // const html = fs.readFileSync('test.html', 'utf-8')
    const etag = request.headers['if-none-match']
    if (etag === '777') {
      response.writeHead(304, {
        'Content-type': 'text/javascript',
        'Cache-Control': 'max-age=20000000,no-store',
        'Last-Modified': '123',
        'Etag': '777'
      })
      response.end('') //无效的 Chrome会返回你命中的缓存的值
    } else {
      response.writeHead(200, {
        'Content-type': 'text/javascript',
        'Cache-Control': 'max-age=20000000,no-store',
        'Last-Modified': '123',
        'Etag': '777'
      })
      response.end('console.log("script loaded twice")')
    }
  }

}).listen(1111)

console.log('server listening on 1111')
