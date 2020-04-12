## webpack 究竟是什么？

1. import 与 export default 是 <b>ES Moudule</b> 模块引入规范 （浏览器不认识 webpack 认识）

2. Node.js 中用的是 <b>CommonJS</b> 模块引入规范 ( require('./index.js') 与 modules.exports)

3. webpack 是模块打包工具 (import 引入的内容就是模块）

### Webpack 的正确安装方式

1. 先安装 node.js 环境

2. 创建一个 node 项目，在项目目录下执行（会生成 package.json 文件）
    npm init

3. 全局安装 webpack 和 webpack-cli （不推荐，推荐在项目内安装 webpack)
    npm install webpack webpack-cli -g
    npm uninstall webpack webpack-cli -g （全局删除）

4. 项目目录下安装 webpack 和 webpack-cli（使得在命令行中可以使用 webpack 这个打包命令）
    npm install webpack webpack-cli -D
    npx webpack -v 可以查看在当前目录下 webpack 是否在项目中安装好（因为直接 webpack -v 会在全局中使用这个命令是找不到的）

### 使用 Webpack 的配置文件 (webpack.config.js)

1. 在项目目录下创建 webpack.config.js

```js
//1. 最基本的webpack配置
//2. 在项目目录下执行npx webpack就可以打包  (后面使用npm run...代替一系列操作)
//3. 在 package.json 里的 scripts 中配置"build"："webpack"  使用npm run build 就可以实现在第二步了
const path = require('path')

module.exports = {
    mode: 'production', //development开发环境  production生产环境
    entry: './src/index.js',  //打包入口文件
    output: {
        filename: 'bundle.js', //输出文件名
        path: path.resolve(__dirname, 'dist') //输出文件地址  此处表示当前目录下dist文件夹
    }
}
```

## Webpack 的核心概念

### 什么是 loader

1. loader 执行顺序是从右到左  （倒序）

```js
//配置一个loader
//安装loader npm install file-loader -D
module.exports = {
    // entry: './index.js',  //打包入口文件 可配置多个
    module: {
        rules: [{
            test: /\.jpg$/, //打包的文件后缀
            use: {          //打包用到的loader
                loader: 'file-loader'
            }
        }]
    },
    // output: {
        // filename: 'bundle.js',
        // path: path.resolve(__dirname, 'dist')  //打包输出文件地址
    // }
}
```

### 使用 Loader 打包静态资源（图片篇）

```js
//file-loader 或者  url-loader
module.exports = {
    entry: './index.js',
    module: {
        rules: [{
            test: /\.(jpg|png|gif)$/, //打包的文件后缀
            use: {          //打包用到的loader
                loader: 'file-loader', //  url-loader 功能类似于 file-loader，但是在文件大小（单位 byte）低于指定的限制时，可以返回一个 DataURL。
                options:{
                    // limit:20480,  图片小于20KB的时候 把图片打包成base64 节省一个http请求图片的时间
                    name:'[name].[ext]', //使用原图片名和后缀 -- 占位符
                    outputPath: 'images/' //file-loader打包到的地址dist/images
                }
            }
        }]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
}
```

### 使用 Loader 打包静态资源（样式篇）

```js
module.exports = {
    entry: './index.js',
    module: {
        rules: [{
            test: /\.sass$/, //打包的文件后缀
            // loader执行顺序是从右到左  倒序
            // 1. postcss-loader 给 css 属性添加厂商前缀的 loader
            // 2. sass-loader 将 Sass 编译成 CSS (webpack 官网上说明要使用 sass-loader 要安装 sass-loader 和 node-sass 这两个包）
            // 3. css-loader 将 CSS 转化成 CommonJS 模块
            // 4. style-loader 将 JS 字符串生成为 style 节点 挂载到 head 中
            // 要用到这多个loader 所以use可以是个数组 每一项可以是对象
            use: ['style-loader',
            {
                loader:'css-loader',
                options:{
                    importLoaders:2, //在sass中再度引入sass文件时 他会重新走下面2个loader 不然只会直接走css-loader
                    modules: true //开启模块化的css 之后可以给引入的css一个变量名 比如style 然后通过给标签加类名style.className给文件单独设置css
                }
            },
            'sass-loader',
            'postcss-loader']
            },{
            test: /\.(eot|ttf|svg)$/, //打包字体文件后缀
            use: {
                loader:'file-loader'  //其实只需要file-loader 把字体文件从src目录下移到dist目录下就行了
            }]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
}
```

#### postcss-loader 使用方法如下：（给 css 属性添加厂商前缀的 loader)

```js
//    1. 创建一个 postcss.config.js 配置文件
//    2. npm install autoprefixer -D （安装 autoprefixer 插件）
//    3. postcss.config.js 配置如下
    module.exports = {
        plugins:[
            require('autoprefixer')
        ]
    }
```

#### 打包字体文件

```js
module.exports = {
    entry: './index.js',
    module: {
        rules: [{
            test: /\.(eot|ttf|svg)$/, //打包的文件后缀
            use: {
                loader:'file-loader'  //其实只需要file-loader 把字体文件从src目录下移到dist目录下就行了
            }
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
}
```

### 使用 plugins 让打包更便捷 (plugin 可以在 webpack 运行到某个时刻的时候，帮你做一些事情）

#### Html-Webpack-Plugin（自动生成一个 html 文件 --index.html） 和 Clean-Webpack-Plugin（打包之前清除 dist)

##### 基本用法

HtmlWebpackPlugin 插件文档： https://github.com/jantimon/html-webpack-plugin#configuration
npm install --save-dev html-webpack-plugin

npm install clean-webpack-plugin -D

```js
var HtmlWebpackPlugin = require('html-webpack-plugin');  //会在打包结束后，自动生成一个 html 文件，并把生成的 js 文件自动引入到这个 html 文件 中）
var CleanWebpackPlugin（ = require('clean-webpack-plugin');  //会在打包之前，清楚某个文件夹的内容
var path = require('path');

var webpackConfig = {
  entry: 'index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index_bundle.js'
  },
  plugins: [new HtmlWebpackPlugin({
      template: 'src/index.html'    //自动生成一个 html 文件， 以模板中的html为模板 加入生成的js文件script
  })，new CleanWebpackPlugin(['dist'])]
};
```

### Entry 与 Output 的基础配置

#### 多个入口文件 和 publicPath（JS 上传到 CDN 使用）

```js
var path = require('path');

var webpackConfig = {
  entry: {
      //key 键就是文件名
      index: './src/index.js',
      myindex: './src/myindex.js'
  }，
  output: {
      //[name]占位符 打包多个文件上面入口的key作文件名
    filename: '[name].js',
    publicPath: 'http://cdn.com.cn', //打包出来的文件引入的script的src加上这个地址
    path: path.resolve(__dirname, './dist')
  },
};
```

在编译时不知道最终输出文件的 publicPath 的情况下，publicPath 可以留空，并且在入口起点文件运行时动态设置。如果你在编译时不知道 publicPath，你可以先忽略它，并且在入口起点设置__webpack_public_path__

```js
__webpack_public_path__ = myRuntimePublicPath
// 剩余的应用程序入口
```

### Source-Map（映射关系） 的配置 (devtool)

为了更容易地追踪错误和警告，JavaScript 提供了 source map 功能，将编译后的代码映射回原始源代码。如果一个错误来自于 a/b/c.js 其中一个，source map 就会明确的告诉你。

#### devtool 此选项控制是否生成，以及如何生成 source map , 不同的值会明显影响到构建 (build) 和重新构建 (rebuild) 的速度。

https://www.webpackjs.com/configuration/devtool/

开发环境推荐：
cheap-module-eval-source-map

生成环境推荐：
cheap-module-source-map  没有列映射 (column mapping) 的 source map，将 loader source map 简化为每行一个映射 (mapping)

1. 只要有 source-map 就有一个 map 映射文件
2. 加 inline 就会把 map 映射文件合并到输出文件里面去
3. 加 cheap 只提示哪一行出错 不提示那一列 只负责业务代码的错误 loader 的报错不管
4. 加 module 就会负责 loader 的错误
5. 加 eval 会通过 eval 的方式对代码执行 eval() 函数可计算某个字符串，并执行其中的的 JavaScript 代码。

```js
  module.exports = {
    //省略。。。
  devtool: 'cheap-module-eval-source-map'
    //省略。。。
```

### 使用 Webpack-Dev-Server 提升开发效率（可以帮助你在代码发生变化后自动编译代码）

#### 基本使用

https://www.webpackjs.com/configuration/dev-server/
1. npm install webpack-dev-server -D
2. npm scripts 里面写入 start 命令为 webpack-dev-server

```js
var path = require('path');

var webpackConfig = {
  entry: {
      index: './src/index.js',
      myindex: './src/myindex.js'
  }，
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './dist')
  },
  devServer:{  //修改和保存任意源文件，web 服务器就会自动重新加载编译后的代码
      contentBase:'./dist',  //告诉服务器从哪里提供内容。只有在你想要提供静态文件时才需要。devServer.publicPath 将用于确定应该从哪里提供 bundle，并且此选项优先。
      open: true,  //在webpack-dev-server启动时 会自动打开浏览器
    //   port: 8080
  }
};
```
