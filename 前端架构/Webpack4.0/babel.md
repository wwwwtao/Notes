```js
//创建一个 .babelr 文件配置
{
    "presets": [
            [
                '@babel/preset-env',
            {
                useBuiltIns: 'usage',   //设置 polyfill 按需转换
                corejs: { version: 3 }, //改变 corejs 参数需要安装不同的npm包 看下面注释
                targets: {              // tagets 根据浏览器打包代码 支持的就不用打包 进一步压缩打包体积
                    chrome: '60',
                    firefox: '50'
                }
            }
        ]
    ],
    // 安装
    // 1. @babel/plugin-trsform-runtime
    // 2. @babel/runtime
    "plugins":[
        [
            "@babel/plugin-trsform-runtime"  // 解决babel-polyfill 污染全局变量的问题 (做第三库的时候 要配置)
            {
                "absoluteRuntime": false,
                "corejs": 3,
                "helpers": true,
                "regenerator": true,
                "useESModules": false,
            }
        ]
    ]
}

    //改变参数需要安装不同的npm包
    corejs option	Install command

    false	npm install --save @babel/runtime

    2	    npm install --save @babel/runtime-corejs2

    3	    npm install --save @babel/runtime-corejs3

```

### babel （转换 es6 的代码 const 之类的）

1. 只处理语法
2. 不处理模块化

### babel-polyfill (core-js 和 regenerator 集合  转换一些 es6 的方法 Promise 之类的）

babel-polyfill 已被弃用，现在推荐直接使用 core-js 和 regenerator
