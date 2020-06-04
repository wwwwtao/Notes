【配置路径别名】：
在 webpack.base.config 中
resolve 下的 alias 里配置
extention 表示可以省略的文件后缀名

.babelrc  文件写配置项
{
    "presets": [
        [
            "env",
            {
                "targets":
                {
                    "browsers": ["last 1 version"]
                }
            }
        ]
    ],
    "plugins": ["transform-class-properties"]           //plugins 插件
}

package.json
{
  "name": "Babel",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "babel entry.js -o index.js -w"       //-o 编译之后生成为 index.js    -w 监听文件改变就自动重新编译
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "babel-cli": "^6.26.0",
    "babel-preset-env": "^1.7.0"
  }
}

安装可以转换还在提案中的写法的插件
npm i -D babel-plugin-transform-class-properties

/** 1、从同学的截图上来看，以下命令书写错误，正确应该是

2、建议同学重新建一个文件夹，重新安装命令，步骤参考：

①下载安装 node.js（node.js 需要安装在 C 盘）

②npm init

③npm install --save-dev babel-cli（出现版本号则证明安装成功）

④touch script.js

⑤配置文件

package.json

{
  "name": "coder",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "babel script.js"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "babel-cli": "^6.26.0",
    "babel-preset-env": "^1.7.0"
  }
}
书写 script.js 代码：

const add = (a,b) => a + b;
class Person{
    static A(){
        alert("b");
    }
    constructor(){

    }
}
⑥执行编译

npm run dev
⑦安装

npm i -D babel-preset-env
⑧创建。babelrc 文件

touch .babelrc
http://img.mukewang.com/climg/5cb83d9f000183b305940375.jpg

⑨配置。babelrc 文件

{
    "presets":[
        "env"
    ]
}
或者配置详细信息

{
    "presets": [
        [
            "env",
            {
                "targets":
                {
                    "browsers": ["last 1 version"]
                }
            }
        ]
    ]
}
⑩执行编译

npm run build
希望可以帮到你！

 */
