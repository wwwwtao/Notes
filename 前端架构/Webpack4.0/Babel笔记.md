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

### babel 的相关包及其作用

<table>
<thead>
<tr>
<th>包名</th>
<th>作用</th>
<th>备注</th>
</tr>
</thead>
<tbody>
<tr>
<td>babel-loader</td>
<td>webpack的插件，在webpack打包时用来加载代码</td>
<td>webpack使用</td>
</tr>
<tr>
<td>@babel/core</td>
<td>babel的核心包，包含语法转换的API，主要用转化es6+的语法</td>
<td>用于语法转换</td>
</tr>
<tr>
<td>@babel/polyfill</td>
<td>babel垫片，主要作用是兼容es6+新特性（如promise，set等），本质是由 core-js 和 regenerator-runtime 组成的。</td>
<td>babel7.4 以后官方以不推荐使用 用core-js3代替</td>
</tr>
<tr>
<td>core-js</td>
<td>给低版本浏览器提供es6+新特性接口的库。分为 core-js@2和@core-js@3</td>
<td></td>
</tr>
<tr>
<td>regenerator-runtime</td>
<td>regenerator-runtime模块来自facebook的regenerator模块,主要作用是生成器函数、async、await函数经babel编译后，regenerator-runtime模块用于提供功能实现</td>
<td></td>
</tr>
<tr>
<td>@babel/helpers</td>
<td>用来把@babel/core处理的代码中插入的帮助函数当做一个模块引入，减小代码的体积</td>
<td></td>
</tr>
<tr>
<td>@babel/plugin-transform-runtime</td>
<td>用来引入垫片的插件，</td>
<td></td>
</tr>
<tr>
<td>@babel/runtime</td>
<td>包含@babel/helpers 和 regenerator-runtime</td>
<td></td>
</tr>
<tr>
<td>@babel/runtime-corejs2</td>
<td>由 core-js@2、@babel/helpers 和 regenerator-runtime 组成</td>
<td>@babel/runtime-corejs2不能转化对象实例的方法</td>
</tr>
<tr>
<td>@babel/runtime-corejs3</td>
<td>由 core-js@3、@babel/helpers 和regenerator-runtime 组成</td>
<td>@babel/runtime-corejs3可以转化对象实例的方法</td>
</tr>
</tbody>
</table>

### babel （转换 es6 的代码 const 之类的）

babel 到底是用来做什么的？简单来讲，babel 就是用来做语法编译的，它可以将一些 es6+ 的高级语法编译为浏览器可以识别的 es5。
通常，我们可以在通过配置 presets 和 plugins 来规定 babel 要怎么编译你的代码。
presets 其实是一系列 plugin 的集合，是预先设置好的一系列编译规则。
babel 配置中 plugin 和 presets 的执行顺序，先执行 plugin 的配置项，在执行 presets 的配置项，plugin 配置项是按照声明顺序执行，presets 配置项按照证明逆序执行。
1. 只处理语法
2. 不处理模块化

### 对于 babel 的几点理解 https://juejin.cn/post/6844904090816741384

### babel/preset-env 使用简介 https://www.cnblogs.com/chyingp/p/understanding-babel-preset-env.html

### babel 的原理

  babel 的转移过程分为三个阶段，这三个步骤分别是：
  1. **解析 parse**: 将代码解析生成抽象语法树（AST）, 即词法分析和语法分析的过程。
  2. **转换 Transform**: 对于 AST 进行变换的一些列的操作，babel 接收得到的 AST 并通过 babel-traverse 对其进行遍历，在此过程中进行添加，更新以及移除等操作。
  3. **生成 Generate**: 将变换后的 AST 再转换为 JS 代码，使用到的模块是 babel-generator。
  ![babel原理图](../images/babel%E5%8E%9F%E7%90%86.png)
