
const http = require('http')

http.createServer(function(request,response){
  console.log('request come',request.url)

  response.writeHead(200,{
    'Access-Control-Allow-Origin': '*'
  })
  response.end('Hello World')
}).listen(8887)

console.log('server listening on 8887')
