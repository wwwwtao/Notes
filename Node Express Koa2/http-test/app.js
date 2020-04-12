

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