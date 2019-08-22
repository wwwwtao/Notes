
const http = require('http')

http.createServer(function(request,response){
  console.log('request come',request.url)

  response.writeHead(200,{
    'Access-Control-Allow-Origin': 'http://127.0.0.1:8888'
  })
  response.end("123")
}).listen(8887)

console.log('server listening on 8887')
