
const http = require('http')

http.createServer(function(request,response){
  console.log('request come',request.url)

  response.writeHead(200,{
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'X-Test-Cors',
    'Access-Control-Allow-Methods': 'POST,PUT,Delete',
    'Access-Control-Max-Age': '1000',
  })
  response.end("123")
}).listen(2222)

console.log('server listening on 2222')
