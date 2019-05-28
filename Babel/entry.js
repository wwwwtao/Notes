const add = (a, b) => a + b;

class person {
    static A() {
        alert("b");
    }
    constructor() {

    }
}

/** 1、从同学的截图上来看，以下命令书写错误，正确应该是


2、建议同学重新建一个文件夹，重新安装命令，步骤参考：

①下载安装node.js（node.js需要安装在C盘）

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
书写script.js代码：

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
⑧创建.babelrc文件

touch .babelrc
http://img.mukewang.com/climg/5cb83d9f000183b305940375.jpg

⑨配置.babelrc文件

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