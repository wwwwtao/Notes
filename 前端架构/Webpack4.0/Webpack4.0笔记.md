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
    mode:'development',   //开发环境打包 打包的代码不会被压缩
    entry: './index.js',  //打包入口文件 可配置多个
    module: {
        rules: [{
            test: /\.jpg$/, //打包的文件后缀
            use: {          //打包用到的loader
                loader: 'file-loader'
            }
        }]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')  //打包输出文件地址
    }
}
```

### 使用 Loader 打包静态资源（图片篇）

image-compressor---https://www.jianshu.com/p/3ce3e3865ae2

一个简单的 JavaScript 图像压缩器。使用浏览器的原生 canvas.toBlob API 做的压缩工作。一般使用此压缩是在客户端图像文件上传之前。

1. npm install image-compressor.js // 注意是 image-compressor.js 不是 image-compressor 那是另一个包

```js
//file-loader 或者 url-loader
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

```js
//某些框架的 webpack.config.js在 build文件夹里，CleanWebpackPlugin会认为 build文件夹 是项目根目录，而他只能清除根目录下的文件夹)
//root参数可以 可设置CleanWebpackPlugin认为的根目录  达到清除根目录下dist的效果（输出的文件也要../dist）
new CleanWebpackPlugin(['dist'],{
    root: path: path.resolve(__dirname, '../'),
})]
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
    //...
  devtool: 'cheap-module-eval-source-map'
    //...
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

### Hot Module Replacement 热模块更新

#### 基本使用

```js
const webpack = require('webpack');

  module.exports = {
    //...
   devServer:{  //修改和保存任意源文件，web 服务器就会自动重新加载编译后的代码
      hot:true, //开启HMR热更新
      hotOnly: true //即使热更新失效也不让浏览器刷新
  },
   plugins: [
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        title: 'Hot Module Replacement'
      }),
      new webpack.NamedModulesPlugin(), //更容易查看要修补(patch)的依赖
      new webpack.HotModuleReplacementPlugin()
    ],
    //...
  }
```

#### module.hot.accept

```js
//js文件HMR 需要自己写HMR函数 比如热更新的时候重新渲染组件
//css-loader vue-loader集成了这个功能  所以不需要自己写HMR这部分代码
  if (module.hot) {
    module.hot.accept('./print.js', function() {
      console.log('Accepting the updated printMe module!');
      document.body.removeChild(element); //清除element 组件
      element = component(); // 重新渲染页面后，component 更新 click 事件处理
      document.body.appendChild(element); //添加新的element组件
    })
  }
```

### 使用 Babel 处理 ES6 语法

#### 基本使用

https://www.babeljs.cn/setup#installation

1. npm install --save-dev babel-loader @babel/core （连接 webpack 和 js 文件）

2. npm install @babel/preset-env --save-dev （转换 es6 的代码 const 之类的）

3. npm install --save @babel/polyfill （转换一些 es6 的方法 Promise 之类的）

4. 在入口文件引入 import "@babel/polyfill"; （会让包变得很大 需要配置按需引入 polyfill 看第 5 条 )

5. 配置 useBuiltIns 设置 polyfill 只转换用到的方法 代码如下 （配置按需引入 polyfill)

6. Babel 的 options 太繁长，可以不写 去创建一个 .babelr 文件写入配置选项

```js
module.exports = {
    //...
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,  //不转换此文件夹中的
            loader: "babel-loader",   //连接 webpack 和 js 文件
            options:{
                "presets": [["@babel/preset-env",{ //转换 es6 的代码 const 之类的
                    useBuiltIns: 'usage',  //设置polyfill按需转换
                    tagets:{               //tagets根据浏览器打包代码 支持的就不用打包 进一步压缩打包体积
                        chorme: '67'
                    }
                }]]
                },
                // 开启babel缓存
                // 第二次构建时，会读取之前的缓存
            cacheDirectory: true
            }]
        }
    }
    //...
```

#### polyfill 其他注意事项 （写库 第三方组件时 polyfill 的配置）transform-runtime

https://www.babeljs.cn/docs/babel-plugin-transform-runtime

1. polyfill 可能会产生全局变量，污染全局的代码，如果写 ui 组件库之类的第三方模块就要用其他的方法打包

2. npm install --save-dev @babel/plugin-transform-runtime

3. npm install --save @babel/runtime

```js
module.exports = {
    //...
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,  //不转换此文件夹中的
            loader: "babel-loader",   //连接 webpack 和 js 文件
            options:{
                    "plugins": [["@babel/plugin-transform-runtime",  //不会全局污染 闭包或间接的引入
                        {
                            "absoluteRuntime": false,
                            "corejs": 2,  //改变corejs参数需要安装不同的npm包 看下面注释
                            "helpers": true,
                            "regenerator": true,
                            "useESModules": false,
                            "version": "7.0.0-beta.0"
                        }
                    ]]
                }
            }]
        }
    }
    //...

    //改变参数需要安装不同的npm包
    corejs option	Install command

    false	npm install --save @babel/runtime

    2	    npm install --save @babel/runtime-corejs2

    3	    npm install --save @babel/runtime-corejs3
```

### Webpack 实现对 React 框架代码的打包

#### 基本使用

https://www.babeljs.cn/docs/babel-preset-react

1. npm install --save-dev @babel/preset-react

2. 配置代码到。babelr 文件

```js
//.babelr 文件
    //presets执行顺序也是从下往上 从右往左的倒序 (和loader一样)
    {
    "presets": [["@babel/preset-env",{ //转换 es6 的代码 const 之类的
        useBuiltIns: 'usage',  //设置polyfill只转换用到的方法
    }
],
    "@babel/preset-react"      //转换React代码
]
}
```

## Webpack 的高级概念

### Tree Shaking （移除 JavaScript 上下文中的未引用代码 (export 了却并未 import 的代码）)

你可以将应用程序想象成一棵树。绿色表示实际用到的源码和 library，是树上活的树叶。灰色表示无用的代码，是秋天树上枯萎的树叶。为了除去死去的树叶，你必须摇动这棵树，使它们落下。

实际上 Tree Shaking 发现引入了一个模块就会去看这个模块导出了什么，引入了什么。没引用的就会被删除

https://www.webpackjs.com/guides/tree-shaking/

#### 基本使用

为了学会使用 tree shaking，你必须……

1. 使用 ES2015 模块语法（即 import 和 export）。  只支持 ES 语法 CommonJS 引入是不支持的

2. 在项目 package.json 文件中，添加一个 "sideEffects" 入口。（请看注意事项 -- 副作用举例）

3. 引入一个能够删除未引用代码 (dead code) 的压缩工具 (minifier)（例如 UglifyJSPlugin,BabelMinifyWebpackPlugin,ClosureCompilerPlugin）

```js
// package.json文件下的配置
{
  "name": "your-project",
  "sideEffects": false //没有副作用的时候简单地将该属性标记为 false，来告知 webpack，它可以安全地删除未用到的 export 导出
}
//注意事项--副作用举例
//任何导入的文件都会受到 tree shaking 的影响。这意味着，如果在项目中使用类似 css-loader(polyfill) 并导入 CSS 文件，则需要将其添加到 side effect 列表中，以免在生产模式中无意中将它删除：
//polyfill 会给全局对象绑定 promise 之类的方法 但不会 export  所以一般要设置"sideEffects": ["@babel/polly-fill","*.css"]
```

```js
// development开发环境下 webpack.config.js 配置文件

// production生产环境下他已经默认写好了 也会默认压缩输出
module.exports = {
    //...
        optimization: {  //优化
            usedExports: true
        }
    }
    //...
```

### Develoment 和 Production 模式的区分打包 （遵循逻辑分离，我们通常建议为每个环境编写彼此独立的 webpack 配置。)

1. 把 webpack.config.js 分为 webpack.common.js 和 webpack.dev.js 和 webpack.prod.js

2. 遵循不重复原则 (Don't repeat yourself - DRY)，保留一个“通用”配置。 为了将这些配置合并在一起，我们将使用一个名为 webpack-merge（配置合并）的工具。

3. npm scripts 里面把 strat 指令加上指定 webpack 配置文件语句 (--config webpack.dev.js)   npm run build 同理

#### webpack-merge（配置合并）的使用

npm install --save-dev webpack-merge

```js
// + |- webpack.common.js -- “通用”配置
// + |- webpack.dev.js --开发环境配置 (实时重新加载(live reloading)和热模块替换(hot module replacement)能力的 source map 和 localhost server)
// + |- webpack.prod.js --生产环境配置 (关注更小的 bundle，更轻量的 source map，以及更优化的资源)


//开发环境配置merge示例
 const merge = require('webpack-merge');
 const common = require('./webpack.common.js');

 module.exports = merge(common, {
   devtool: 'cheap-module-eval-source-map',
   devServer: {
     contentBase: './dist'
   }
 });

```

#### DefinePlugin （指定环境）

https://www.webpackjs.com/guides/production/#%E6%8C%87%E5%AE%9A%E7%8E%AF%E5%A2%83

```js
//生产环境配置merge＋指定环境示例
  const webpack = require('webpack');
  const merge = require('webpack-merge');
  const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
  const common = require('./webpack.common.js');

  module.exports = merge(common, {
    devtool: 'source-map',
    plugins: [
      new UglifyJSPlugin({
        sourceMap: true
     }),
     new webpack.DefinePlugin({  //指定process.env.NODE_ENV为production ,因为许多 library（库，例如react） 将通过与 process.env.NODE_ENV 环境变量关联，以决定 library 中应该引用哪些内容
       'process.env.NODE_ENV': JSON.stringify('production')
     })
    ]
  });
```

### Webpack 和 Code Splitting（代码拆分）

有三种常用的代码分离方法：

1. 入口起点：使用 entry 配置手动地分离代码。

2. 防止重复：使用 CommonsChunkPlugin 去重和分离 chunk。

3. 动态导入：通过模块的内联函数调用来分离代码。

#### 防止重复 (prevent duplication) CommonsChunkPlugin 已被替代

webpack 作代码分割，异步代码不用管，同步代码只要配置 optimization 即可

```js
//异步代码  webpack会自动的作代码分割  babel-plugin-dynamic-import-webpack（这个babel插件可以让webpack使用预案写法import('异步组件')）
//同步代码  以下配置写到公共的webpack.common.js配置文件里  webpack会自动的作代码分割
module.exports = {
    //...
        optimization: {
            splitChunks: {
                chunks: 'all'  //webpack会自动的作代码分割
            }
        }
    }
    //...
```

ExtractTextPlugin: 用于将 CSS 从主应用程序中分离。

bundle-loader: 用于分离代码和延迟加载生成的 bundle。

promise-loader: 类似于 bundle-loader ，但是使用的是 promises。

CommonsChunkPlugin 插件还可以通过使用显式的 vendor chunks 功能，从应用程序代码中分离 vendor 模块。

### SplitChunksPlugin 配置参数详解

```js
module.exports = {
    //...
    //SplitChunksPlugin 默认配置详解
        optimization: {
            splitChunks: {
                chunks: "async",            // 作代码分割的时候 只对异步代码生效
                minSize: 30000,             // 新的 chunk 体积在压缩之前是否大于 30kb
                minChunks: 1,               // 被用了至少多少次才分割
                maxAsyncRequests: 5,        // 按需加载 chunk 的并发请求数量小于等于 5 个（太多了就不分了 不然 http 请求次数太多）
                maxInitialRequests: 3,      // 页面初始加载时的并发请求数量小于等于 3 个（太多了就不分了 不然 http 请求次数太多）
                automaticNameDelimiter: '~',// 自动名称分隔符
                name: true,                 // 让 cacheGroups 起的名有效
                cacheGroups: {              // cacheGroups-缓存分组 打包同步代码符合上述条件后会走这里(也就是必须符合这里规则的同步代码才打包出来)
                    vendors: {              // vendors-供应商 供应商配置组
                        test: /[\\/]node_modules[\\/]/,     // 是从node_modules引入的 就单独打包出来  新的 chunk 是否被共享或者是来自 node_modules 的模块
                        priority: -10，                     // priority-优先权
                        filename: 'vendors.js'              // 指定打包出来的文件名(默认名字是vendors~main.js )
                    },
                    default: {              // 默认配置组 不属于上面的同步代码(不属于node_modules)走这里打包(默认名字是default~main.js )
                        minChunks: 2,                       // 最小共用次数
                        priority: -20,                      // 小于 vendors 会被打包进 vendors 或者 app
                        reuseExistingChunk: true            // reuseExistingChunk-重用现有块  会复用之前已经打包过的模块 不会重新打包进default~main.js
                    }
                }
            }
        }
    }
    //...
```

### Lazy Loading 懒加载，Chunk 是什么？

每个打包的 JS 文件都是一个 Chunk (minChunks)

### 打包分析 -Preloading, Prefetching

(analyse/ 分析） https://github.com/webpack/analyse

```js
// 指令变量
const instructions = "webpack --profile --json > stats.json" //（打包过程中把 json 格式的项目描述文件放到 stats.json)
```

1. 首先要生成打包过程的描述文件 通过 script--dev-- 添加 instructions 指令，打包之后就会把 json 格式的项目描述文件放到 stats.json

2. http://webpack.github.com/analyse 进入这个工具网站可以把描述文件上传进行工具化分析（官方的比较简单，下面也有一些 webpack 官方推荐的插件，功能比较全）

如果我们以分离代码作为开始，那么就以检查模块作为结束，分析输出结果是很有用处的。官方分析工具 是一个好的初始选择。下面是一些社区支持 (community-supported) 的可选工具：

https://www.webpackjs.com/guides/code-splitting/#bundle-%E5%88%86%E6%9E%90-bundle-analysis-

1. webpack-chart: webpack 数据交互饼图。

2. webpack-visualizer: 可视化并分析你的 bundle，检查哪些模块占用空间，哪些可能是重复使用的。（常用！!!）

3. webpack-bundle-analyzer: 一款分析 bundle 内容的插件及 CLI 工具，以便捷的、交互式、可缩放的树状图形式展现给用户。

### css 文件的代码分割

1. 注意 tree shaking
所以一般要设置"sideEffects": ["*.css"]

### Webpack 与浏览器缓存 ( Caching )

[contenthash]  -- 根据 content 内容产生的一个哈希字符串 content 不变哈希值不变

```js
module.exports = {
    //...
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist')  //打包输出文件地址
    }
}
```

webpack 把 业务代码 和 引用库的关联代码  叫 manifest
老版本 webpack 中 业务代码和库的 js 中都有 manifest （所以哪怕代码内容不变 关联可能变了哈希值也会变），加一个 runtimeChunk 就会把关联代码单独拿出来放在 runtime.js 中

### Shimming（垫片）

```js
module.exports = {
    //...
    plugins:[
        new webpack.ProvidePlugin({
            $: 'jquery' //模块有$这个字符串 就会自动在模块中引入jquery 然后把jquery赋值给$
        })
    ],
    module:{
        rules:[{
            use:[{
                loader:'imports-loader'?this=>window //把模块中的this指向window
            }]
        }]
    }
}
```

### 环境变量的使用方法

利用全局变量 了解概念即可

## Webpack 实战配置案例讲解

### Library（组件库 库的打包） 的打包

```js
const path = require('path')

module.exports = {
    // ...
    externals: ["lodash"], //打包过程中  如果遇到了lodash就忽略
    externals: "lodash",   //不管在任何环境下 引入的lodash都取名叫lodash
    externals: {           //不仅可以是数组,字符串 也可以是个对象
        lodash: {
            root: '_', //如果是通过script标签引入进来的 那么我要求script标签必须在页面上注入一个名字叫'_'的全局变量
            commonjs: 'lodash'  //如果在commonjs的环境下被使用 我要求lodash加载的时候必须叫lodash
        }
    },
    output: {
        filename: 'bundle.js', //输出文件名
        path: path.resolve(__dirname, 'dist'), //输出文件地址  此处表示当前目录下dist文件夹
        library:'library', //可以通过script标签引入library
        libraryTarget: 'umd' //通过任何形式引入我们的库  都可以引入的到 //也可以填写this，window，global 挂载在他们底下
    }
}
```

#### 怎么给别人用

1. 注册一个 npm 账号
2. npm publish（库的名字是不能相同的）
3. 别人 npm install library 就可以使用了

### PWA（渐进式 Web APP） 的打包配置

其目的是通过各种 Web 技术实现与原生 App 相近的用户体验

1. webpack 安装插件 WorkboxPlugin
2. 在业务代码中应用 serviceWorker

### TypeScript 的打包配置

1.  npm install ts-loader

2.  配置一个 tsconfig.json

```js
module.exports = {
    entry: './src/index.tsx',
    module: {
        rules: [{
            test: /\.tsx?$/, //打包的文件后缀
            use: {          //打包用到的loader
                loader: 'ts-loader',
                exclude: /node_modules/
            }
        }]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
}
```

#### 我们引入一个库 希望这个库的方法能够也拥有类型检查

1. npm install @type/lodash  // 安装之后就可以识别 lodash 的函数要用那些参数

##### 怎么搜索安装 库对应的类型文件 （其他类型文件）

1. 打开 github 搜索 DefinitelyTyped
2. 找到 TypeSearch-🔗链接 可以在里面搜索
https://www.typescriptlang.org/dt/search/

### 使用 WebpackDevServer 实现请求转发

https://webpack.js.org/configuration/dev-server/#root

```js
module.exports = {
  //...
  devServer: {   //只有开发环境下才有作用
    proxy: {
      '/api': {
        // index: '', // 启用根代理
        // context: ['/auth', '/api'],  //如果要代理到同一目标的多个特定路径
        target: 'http://localhost:3000',
        pathRewrite: { '^/api': '' },   //把请求地址中的/api替换成''
        secure: false,  //实现对https网址的请求转发
        changeOrigin: true,  // 有些对Origin(起源)做了限制   建议始终加上
        headers: {  //HTTP响应中注入一些HTTP响应头
            host: 'wt.com',
            'X-Custom-Foo': 'bar',
            cookie: 'cookie'
        },
        // 有时您不想代理所有内容。可以基于函数的返回值绕过代理。
        // 在该功能中，您可以访问请求，响应和代理选项。
        // 返回 null 或 undefined 继续使用代理处理请求。
        // 返回 false 以为请求产生 404 错误。
        // 返回提供服务的路径，而不是继续代理请求。
        // 例如，对于浏览器请求，您想要提供 HTML 页面，但是对于 API 请求，您想要代理它。您可以执行以下操作：
        bypass: function (req, res, proxyOptions) { //拦截的作用
          if (req.headers.accept.indexOf('html') !== -1) {
            console.log('跳过浏览器请求的代理.');
            return '/index.html';
          }
        },
      },
    },
  },
};
```

### WebpackDevServer 解决单页面应用路由问题

```js
module.exports = {
    //...
    // historyApiFallback: true,   //对路径的请求转化到对根路径的请求 等价于任何路径转化到index.html
    // 如果需要路由的history模式 后端需要去aginx或者阿帕奇服务器配置
    historyApiFallback: {
      rewrites: [
        { from: /^\/$/, to: '/views/landing.html' },
        { from: /^\/subpage/, to: '/views/subpage.html' },
        { from: /./, to: '/views/404.html' },
      ],
    },
    //...
}
```

### EsLint 在 Webpack 中的配置

#### 使用 EsLint

1. npx eslint --init    // 安装 EsLint

2. EsLint 配置文件：.eslintrc.js

```js
//.eslintrc.js
module.exports = {
    "extends": "airbnb",
    "parser": "babel-eslint",
    "rules": {
        "把ESLint提示的规范复制到这里,赋值为0就可以不遵守这个规范": 0,
    },
    globals: {
        document: false // document全局变量不允许进行覆盖
    }
}
```

3. VSCode 安装 ESLint 插件 根据错误提示手动修改代码规范

#### 把 ESLint 结合在 Webpack 中

1. npm install eslint-loader --save-dev

```js
//webpack.config.js
module.exports = {
    //...
    module: {
        devServer: {
            overlay: true,  //当我们打包报错的时候 它会直接在浏览器弹出层报错
        },
        rules: [{
                test: /\.js$/,
                exclude: /node_modules/,  //不转换此文件夹中的
                use: ['babel-loader','eslint-loader'],   //连接 webpack 和 js 文件
                options: {
                    // eslint选项（如有必要）
                },
            }]
        }
    }
    //...
```

##### eslint-loader 已不推荐使用。请使用 eslint-webpack-plugin

https://github.com/webpack-contrib/eslint-webpack-plugin

1. npm install eslint-webpack-plugin --save-dev

```js
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  // ...
  plugins: [new ESLintPlugin(options)],
  // ...
};
```

### webpack 性能优化

#### 打包速度

##### 1. 跟上技术的迭代 （Node，Npm，Yarn）

##### 2. 在尽可能少的模块上应用 Loader （比如 include：path.resolve(__dirname,'../src') 只在 src 下应用 babel-loaders）

##### 3. Plugin 尽可能精简并确保可靠

##### 4. resolve 参数合理配置

```js
//webpack.config.js
module.exports = {
    //...
        resolve: {
            extensions: ['.js','.jsx']  //引入一个文件的时候 我会去找以 .js 后缀的文件 然后再去找 .jsx
            // mainFiles: ['index','child']    //引入某个目录下的文件 默认index 然后再去找child
            alias: {    //别名
                '@': path.resolve(__dirname,'src'),
                '_c': path.resolve(__dirname, "src/components"),
            }
        }
    }
    //...
```

##### 5. 使用 DIIPlugin 提高打包速度 （第三方模块只打包一次） （你是否需要 webpack dll https://zhuanlan.zhihu.com/p/84595664）

```js

1.
// webpack.dll.js
const paht = require('paht')
const webapck = require('webapck')
module.exports = {
    mode:'production',
    entry: {
        vendors: ['react', 'react-dom', 'lodash']
    },
    output: {
        filename: '[name].dll.js',  //打包上面的第三方模块 到dll文件中 名称就是 vendors.dll.js
        path: path.resolve(__dirname,'../dll'),
        library: '[name]'
    },
    plugins: [
        new webapck.DllPlugin({ //第三方模块映射到mainfest.json中
            name: '[name]',
            path: path.resolve(__dirname,'../dll/[name].mainfest.json')
        })
    ]
}

2.
// webpack.common.js
//npm install add-asset-html-webpack-plugin  给html页面上添加script
module.exports = {
    plugins: [
        new AddAssetHtmlWebpackPlugin({ // 给html页面上添加script
            filepath: path.resolve(__dirname,'../dll/vendors.dll.js')
        }),
        new webapck.DllReferencePlugin({    //打包index.js引入打三方模块的时候 会到vendors.mainfest.json 去找映射关系 找到了就直接去dll文件 去全局变量里去拿第三方模块
            manifest: path.resolve(__dirname,'../dll/vendors.mainfest.json')
        })
    ]
}

3.
// webpack.common.js
// 使用node 自动添加plugins 不用重复在 plugins 中添加new AddAssetHtmlWebpackPlugin 和 new webapck.DllReferencePlugin

const fs = require('fs')

const files = fs.readdirSync(path.resolve('../dll'))
files.forEach(file =>{
    if(/.*\.dll.js/.test(file)){
        plugins.push(
            new AddAssetHtmlWebpackPlugin({ // 给html页面上添加script
            filepath: path.resolve(__dirname,'../dll/',file)
        })
        )
    }
    if(/.*\.mainfest.json/.test(file)){
        plugins.push(
            new webapck.DllReferencePlugin({    //打包index.js引入打三方模块的时候 会到vendors.mainfest.json 去找映射关系 找到了就直接去dll文件 去全局变量里去拿第三方模块
            manifest: path.resolve(__dirname,'../dll/',file)
        })
        })
        )
    }
})
```

##### 6. 控制包文件大小

##### 7. thread-loader,padrallel-webpack,happypack 多进程打包

项目变的庞大，文件很多的情况下，采取多进程打包
如果小项目，文件不多，无需开启多进程打包，反而会变慢，因为开启进程是需要花费时间的

多进程打包：
1. 安装 thread-loader
npm i thread-loader -D

```js
  module.exports = {
      entry: './src/js/index.js',
      output: {
        filename: 'js/built.[contenthash:10].js',
        path: resolve(__dirname, 'build')
      },
      module: {
        rules: [
              {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                  /*
                    开启多进程打包。
                    进程启动大概为600ms，进程通信也有开销。
                    只有工作消耗时间比较长，才需要多进程打包
                  */
                  {
                    loader: 'thread-loader',
                    options: {
                      workers: 2 // 进程2个
                    }
                  },
                  {
                    loader: 'babel-loader',
                    options: {
                      presets: [
                        [
                          '@babel/preset-env',
                          {
                            useBuiltIns: 'usage',
                            corejs: { version: 3 },
                            targets: {
                              chrome: '60',
                              firefox: '50'
                            }
                          }
                        ]
                      ],
                      // 开启babel缓存
                      // 第二次构建时，会读取之前的缓存
                      cacheDirectory: true
                    }
                  }
                ]
              }
        ]
      }
```

##### 8. 合理使用 sourceMap

##### 9. 结合 stats 分析打包结果

##### 10. 开发环境内存编译 无用插件剔除

##### 11. 使用 ParallelUglifyPlugin 多进程并行压缩 JS 代码

```js
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
// 使用 ParallelUglifyPlugin 并行压缩输出的 JS 代码
        new ParallelUglifyPlugin({
            // 传递给 UglifyJS 的参数
            // （还是使用 UglifyJS 压缩，只不过帮助开启了多进程）
            uglifyJS: {
                output: {
                    beautify: false, // 最紧凑的输出
                    comments: false, // 删除所有的注释
                },
                compress: {
                    // 删除所有的 `console` 语句，可以兼容ie浏览器
                    drop_console: true,
                    // 内嵌定义了但是只用到一次的变量
                    collapse_vars: true,
                    // 提取出出现多次但是没有定义成变量去引用的静态值
                    reduce_vars: true,
                }
            }
        })
```

#### 总结~小技巧：

手摸手 webpack 性能优化技巧：
https://juejin.cn/post/6844903652956569608#heading-14
https://juejin.im/post/5b5d6d6f6fb9a04fea58aabc

它内置的代码分割策略是这样的：
1. 新的 chunk 是否被共享或者是来自 node_modules 的模块
2. 新的 chunk 体积在压缩之前是否大于 30kb
3. 按需加载 chunk 的并发请求数量小于等于 5 个（太多了就不分了 不然 http 请求次数太多）
4. 页面初始加载时的并发请求数量小于等于 3 个（太多了就不分了 不然 http 请求次数太多）
它内置的代码分割策略很好很不错，但有些场景下这些规则可能就显得不怎么合理了。比如我有一个管理后台，它大部分的页面都是表单和 Table，我使用了一个第三方 table 组件（比如 element table），几乎后台每个页面都需要它，但它的体积也就 15kb，不具备单独拆包的标准，它就这样被打包到每个页面的 bundle 中了，这就很浪费资源了。这种情况下建议把大部分页面能共用的组件单独抽出来，合并成一个 component-vendor.js 的包（后面会介绍）

- 拆包策略：
	基础类库 chunk-libs
	UI 组件库 chunk-elementUI
	自定义共用组件 / 函数 chunk-commons
	低频组件 chunk-eachrts/chunk-xlsx 等
	业务代码 lazy-loading xxxx.js

- 持久化缓存：
	使用 runtimeChunk 提取 manifest，使用 script-ext-html-webpack-plugin 等插件内联到 index.html 减少请求
	使用 HashedModuleIdsPlugin 固定 moduleId
	使用 NamedChunkPlugin 结合自定义 nameResolver 来固定 chunkId

 CDN，组件库的按需引入，减小第三方依赖的体积，Gzip 压缩

### 多页面打包配置

```js
//webpack.config.js
module.exports = {
    //...
        entry: {
            main:'./src/index.js',
            list:'./src/list.js'
        },
        plugins: [
            new HtmlWebpackPlugin({
            template: 'src/index.html',    //自动生成一个 html 文件， 以模板中的html为模板 加入生成的js文件script
            filename: 'index.html',
            chunks: ['runtime','vendors','main']
            }),
            new HtmlWebpackPlugin({
            template: 'src/index.html',
            filename: 'list.html',
            chunks: ['runtime','vendors','list']
            }),
        ]
    //...
}

const makePlugins = (configs) =>{
    let plugins = [
        new CleanWebpackPlugin(['dist',{
            root: path.resolve(__dirname,'../')
        }])
    ]

    Object.keys(config.entry).forEach(item=>{
        plugins.push(
            new HtmlWebpackPlugin({
                template: 'src/index.html',
                filename: `${item}.html`,
                chunks: ['runtime','vendors',item]
            })
        )
    })
}
```

## Webpack 底层原理及脚手架工具分析

### 如何编写一个 Loader

https://www.webpackjs.com/api/loaders/
创建一个文件夹 loaders -- 创建一个 replaceLoader.js 文件

```js
// loaders/replaceLoader.js

const loaderUtils = require('loader-utils')
/* source 接受的参数 --源代码*/
module.exports = function(source) {
    const Options = loaderUtils.getOptions(this)
    const result = source.replace('lee',Options.name')

    /*  无论是 return 还是 this.callback 都可以同步地返回转换后的 content 内容  */
    // return source.replace('lee',this.query.name)
    // this.callback( null,result,SourceMap,meta)

    /*  对于异步 loader，使用 this.async 来获取 callback 函数   */
    const callback = this.async();
    someAsyncOperation(content, function(err, result) {
        if (err) b return callback(err);
        callback(null, result, SourceMap, meta);
    });
}


// 使用loader
module.exports = {
    mode:'development',   //开发环境打包 打包的代码不会被压缩
    entry: './index.js',  //打包入口文件 可配置多个
    module: {
        rules: [{
            test: /\.js/, //打包的文件后缀
            use: [
                {
                    loader: path.resolve(__dirname, './loaders/replaceLoader.js'),
                    options: {
                        name: 'wt' //在loader代码中可以通过this.query 拿到options
                                    //https://www.webpackjs.com/api/loaders/#this-query
                                    // 官方推荐使用loader-utils
                                    // const loaderUtils = require('loader-utils')  const Options = loaderUtils.getOptions(this)

                    }
                }
            ]
        }]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')  //打包输出文件地址
    }
}
```

#### webpack 中 loader 在哪个 hook 触发的？

在 webpack 中，loader 的执行是在构建过程的 module 阶段触发的。具体来说，loader 的执行是在 webpack 的  `normalModuleLoader`  阶段进行的。

 `normalModuleLoader`  是 webpack 构建过程中的一个关键阶段，它在  `beforeCompile`  钩子之后、 `afterCompile`  钩子之前执行。在这个阶段，webpack 会根据配置中的 loader 规则，对模块进行匹配和处理，并将模块转换为可执行的 JavaScript 代码。

在  `normalModuleLoader`  阶段，webpack 会按照配置中的 loader 规则，依次调用匹配的 loader 来处理模块。每个 loader 接收模块的内容作为输入，并根据配置的转换规则对其进行处理，最终输出转换后的代码。

通过 loader 的执行，我们可以对模块进行各种转换和处理，例如转换 ES6 语法、处理 CSS、压缩代码等。loader 的执行顺序是根据配置中的 loader 规则的顺序来确定的，可以通过配置文件中的  `module.rules`  字段来指定 loader 的执行顺序。

总结来说，webpack 中的 loader 是在构建过程的 module 阶段触发的，具体是在  `normalModuleLoader`  阶段进行的。在这个阶段，webpack 会根据 loader 规则对模块进行匹配和处理，以完成代码的转换和处理。

### 如何编写一个 Plugin

https://www.webpackjs.com/api/plugins/
创建一个文件夹 plugins -- 创建一个 copyright-webapck-plugin.js 文件

```js

// plugins/copyright-webapck-plugin.js
class CopyrightWebpackPlugin {
    /**
    * 类的构造函数
    * @param options webpack配置文件中定义并传递过来的参数
    */
    constructor(options){}
    /**
    * 调用插件会执行此方法
    * @param compiler webpack实例
    */
    apply(compiler){
        compiler.hooks.compile.tap('CopyrightWebpackPlugin',(compilation)=>{
            console.log('compile');
        })

        /**
        * 取决于不同的钩子类型，也可以在某些钩子上访问 tapAsync 和 tapPromise。
        * @param 'CopyrightWebpackPlugin' 插件名字
        * @param compilation function函数--第一个参数是跟这次打包相关的所有内容
        */
        compiler.hooks.emit.tapAsync('CopyrightWebpackPlugin',(compilation,Callback)=>{
            // console.log('emit');
            compilation.assets['copyright.txt'] = { //打包会生成一个copyright.txt文件
                source: function(){ //内容
                    return 'copyright by wt'
                },
                size: function(){   //文件大概有多大
                    return 15   //15个字符长度
                }
            }
            Callback();
        })
    }
}
module.exports = CopyrightWebpackPlugin

//  使用plugin -- webpack.config.js
//  1. 引入
const CopyrightWebpackPlugin = require('./plugins/copyright-webapck-plugin.js')

module.exports = {
    mode:'development',
    entry: {
        main: './index.js',
    },
    plguins: [  //2. 使用
        new CopyrightWebpackPlugin({
            name:'wt'   //会被  constructor 构造函数接收
        })
    ],
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    }
}
```

#### 快速查看 compilation 参数的内容

```js
1.
//package.json
"scripts": {
    "debug":"node --inspect --inspect-brk node_modules/webpack/bin/webpack.js"  //执行webpack 传递inspect和inspect-brk参数 表示开启调试模式 和 第一行打断点
}

2. 在插件运行代码中打断点 写debugger
```

### Bundler 源码编写  看 bundler/bundler.js 文件 ![源码打包机 包含模块分析器,依赖图谱,代码生成](./bundler/bundler.js)

1. 创建一个文件夹 bundler
创建 bundler/src/index.js bundler/src/message.js bundler/src/word.js 文件

2. 创建一个 bundler/bundler.js 文件 并安装 node.js

3. npm install cli-highlight    （高亮显示代码的工具 打包出来的代码在控制台中可以高亮查看）

4. npm install @babel/parser    （帮助我们分析源代码）

5. npm install @babel/traverse  （帮助我们快速找到 import 节点）

6. npm install @babel/core  (babel 核心模块）

7. npm install --save-dev @babel/preset-env

### loader 和 plugin 本质区别是啥？

loader 和 plugin 是 webpack 中两个不同的概念，用于实现不同的功能。

1. Loader（加载器）：Loader 是 webpack 的一个核心概念，用于对模块的源代码进行转换。它可以将非 JavaScript 资源（如 CSS、图片、字体等）转换为 JavaScript 可以处理的模块。Loader 在 webpack 的构建过程中作为转换器的角色，负责将不同类型的文件转换为模块。Loader 可以通过配置文件中的  `module.rules`  字段进行配置和使用。

2. Plugin（插件）：Plugin 是 webpack 的扩展机制，用于在构建过程中执行更广泛的任务。它可以在整个构建过程中的不同阶段执行自定义的操作，如优化资源、注入变量、生成额外的文件等。Plugin 可以通过配置文件中的  `plugins`  字段进行配置和使用。它们是通过调用 webpack 提供的钩子函数来实现的，可以在构建过程的不同阶段插入自定义的逻辑。

因此，loader 和 plugin 在 webpack 中的本质区别在于它们的功能和作用。Loader 主要用于模块转换，将非 JavaScript 资源转换为 JavaScript 可以处理的模块；而 Plugin 则用于执行更广泛的任务，可以在构建过程中的不同阶段插入自定义的逻辑。它们共同构成了 webpack 的灵活和可扩展的构建系统。

## Create-React-App 和 Vue-Cli 3.0 脚手架工具配置分析

### 通过 CreateReactApp 深入学习 Webpack 配置

### Vue CLI 3 的配置方法及课程总结

Vue CLI 官方配置参考
https://cli.vuejs.org/zh/config/#%E5%85%A8%E5%B1%80-cli-%E9%85%8D%E7%BD%AE

### webpack 常见的 loader 和 plugin

webpack 是一个现代的前端构建工具，它可以将多个模块打包成一个或多个静态资源文件。在 webpack 中，常见的 loader 和 plugin 用于处理和优化不同类型的资源。

常见的 loader 包括：

1. Babel-loader：用于将 ES6+ 的 JavaScript 代码转换为浏览器兼容的 JavaScript 代码。 <!-- esbuild-loader 和 swc-loader 优化 -->
2. CSS-loader：用于解析处理 CSS 文件，支持导入和处理 CSS 文件中的 URL 路径。
3. Style-loader：将 CSS 代码以 style 标签的形式插入到 HTML 页面中。
4. File-loader：用于处理文件资源，例如图片、字体等，将它们复制到输出目录，并返回最终的 URL 路径。
5. URL-loader：类似于 File-loader，但可以将小文件转换为 DataURL，减少 HTTP 请求。
6. Sass-loader：用于解析处理 Sass/SCSS 文件，将其转换为 CSS。
7. Less-loader：用于解析处理 Less 文件，将其转换为 CSS。
8. PostCSS-loader：用于处理 CSS 代码，可以进行自动添加前缀、压缩等操作。

常见的 plugin 包括：

1. HtmlWebpackPlugin：用于生成 HTML 文件，并自动将打包后的资源文件（如 CSS、JavaScript）引入 HTML 中。
2. MiniCssExtractPlugin：将 CSS 代码从打包后的 JavaScript 文件中提取出来，生成单独的 CSS 文件。
3. CleanWebpackPlugin：用于每次构建前清理输出目录。
4. DefinePlugin：用于定义全局变量，在编译过程中进行替换。
5. CopyWebpackPlugin：用于复制静态资源文件到输出目录。
6. UglifyJsPlugin：用于压缩混淆 JavaScript 代码。
7. OptimizeCSSAssetsPlugin：用于压缩 CSS 代码。

这些是 webpack 中常见的 loader 和 plugin，它们可以根据项目的需求来选择和配置，以实现对不同类型资源的处理和优化。
