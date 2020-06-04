# 开始 & 安装

## Node (CommonJS)

```js
# 安装
npm install mockjs      //mock.js
cnpm install json5      //解决json文件，无法添加注释问题
// 使用 Mock
var Mock = require('mockjs')
var data = Mock.mock({
    // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
    'list|1-10': [{
        // 属性 id 是一个自增数，起始值为 1，每次增 1
        'id|+1': 1
    }]
})
// 输出结果
console.log(JSON.stringify(data, null, 4))
```

# 数据模板定义规范 DTD

## 数据模板中的每个属性由 3 部分构成：属性名、生成规则、属性值：

```js
// 属性名   name
// 生成规则 rule
// 属性值   value
'name|rule': value
```

# 通过 devServer 配置监听 mock 请求

```js
//vue-config.js
module.exports = {
  //...
  devServer: {
    before: require('./mock/index.js')      //引入mock.js
  }
};

//mock.js
const fs = require('fs')
const path = require('path')
const Mock = require('mock.js')
const JSON5 = require('json5')

//读取json文件
function getJsonFile(filepath){
    var json = fs.readFileSync(path.resolve(_dirname,filePath),'utf-8');
    return JSON5.parse(json);
}

//返回一个函数给devServer
module.exports = function(app){
    if(process.env.MOCK == 'true'){  //创建.env.[mode]文件   MOCK=true
    //监听http请求地址
    app.get('/user/userinfo',function(req,res){
        //每次请求读取mock data的json文件
        var json = getJsonFile('./userinfo.json5')
        //将json传入Mock.mock方法中，生成的数据返回给浏览器
        res.json(Mock.mock(json))
    })
    }
}
```
