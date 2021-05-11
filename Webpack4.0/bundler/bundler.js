const fs = require('fs')    //帮助我们获取文件信息
const path = require('path')
const parser = require('@babel/parser')    //帮助我们分析源代码
const traverse = require('@babel/traverse').default    //帮助我们快速找到import节点
const babel = require('@babel/core')    //babel核心模块

// 模块分析器
const moduleAnalyser = (filename) => {
    // content - 文件内容
    const content = fs.readFileSync(filename, 'utf-8')

    // ast - 抽象语法树
    const ast = parser.parse(content, {
        sourceType: 'module'
    });

    // dependencies - 依赖项
    const dependencies = {};
    /**
    * 帮助我们快速找到import节点
    * @param ast: Object 抽象语法树
    * @param function 对抽象语法树进行遍历 找到某种类型的语法
    */
    traverse(ast, {
        ImportDeclaration({ node }) {   //接收节点
            // console.log(node);
            const dirname = path.dirname(filename)
            const newFile = './' + path.join(dirname, node.source.value) //绝对路径
            dependencies[node.source.value] = newFile   // {'./message.js': './src/message.js'}
        }
    });

    /**
    * 把AST抽象语法树转换成浏览器能运行的代码
    * @param ast: Object 抽象语法树
    * @param code?: string 
    * @param options?: Object,
    * @param callback: Function 
    */
    // code - 浏览器能运行的代码
    const { code } = babel.transformFromAst(ast, null, {
        presets: ["@babel/preset-env"]
    })

    return {
        filename,
        dependencies,// dependencies - 依赖项  [{'./message.js': './src/message.js'}]
        code // code - 浏览器能运行的代码
    }
}

/**
* 依赖图谱
* @param entry 入口文件
*/
const makeDependenciesGraph = (entry) => {
    // 入口文件的模块分析结果
    const entryModule = moduleAnalyser(entry);
    // graphArray/依赖数组
    const graphArray = [entryModule];
    for (let i = 0; i < graphArray.length; i++) {
        const item = graphArray[i];// 第一项是入口文件的模块分析结果
        const { dependencies } = item;// dependencies - 依赖项
        if (dependencies) {
            for (let j in dependencies) {
                //把每一个依赖性都循环进行分析，拿到分析结果 
                //再push进graphArray图谱中

                // 先分析index 发现依赖项message 
                // 分析message  又发现message 的依赖项word  知道分析完所有依赖项
                graphArray.push(
                    moduleAnalyser(dependencies[j])
                );
            }
        }
    }

    // 把数组转换成对象
    const graph = {};
    graphArray.forEach(item => {
        graph[item.filename] = {
            dependencies: item.dependencies,
            code: item.code
        }
    });
    return graph;
}

// 代码生成
const generateCode = (entry) => {
    const graph = JSON.stringify(makeDependenciesGraph(entry));
    // 1.首先要在闭包的环境执行 (function(){})(${graph}) 
    // 2.把生成的代码作为参数传递给了闭包的函数
    // 3.生成的代码中 会有一段浏览器报错的代码 会提示缺少exports对象 和 require方法
    // 4.构造require函数和exports对象
    // 5.执行code代码 code代码中会require('./message.js') 此处这里的路径是相对路径，而我们的执行代码要绝对路径
    // 6.构建一个localRequire方法
    // 7.把localRequire方法传进这个闭包里，这样的话eval(code)就会执行我们传进去的require
    // 8.relativePath的值实际上是code代码中require(./message.js)的参数 也就是'./message.js'
    /* 9.创建一个exports对象, 并传进去给code执行 实际上就是个空对象
        Object.defineProerty(exports,"__esModule",{
            value: true
        }) 
     */
    // 10.导出 下一个模块才能拿到导出的结果
    return `
		(function(graph){
			function require(module) {  //module = entry = './src/index.js'
				function localRequire(relativePath) {   // 6.构建一个localRequire方法  用于把require相对路径修改成绝对路径 接收参数为相对路径
					return require(graph[module].dependencies[relativePath]);   // 8.relativePath的值实际上是code代码中require(./message.js)的参数 也就是'./message.js'
				}
				var exports = {};   // 9.创建一个exports 并传进去给code执行 实际上就是个空对象
				(function(require, exports, code){ // 7.把localRequire方法传进这个闭包里，这样的话eval(code)就会执行我们传进去的require
					eval(code)  //5.执行code代码 code代码中会require('./message.js') 此处这里的路径是相对路径，而我们的执行代码要绝对路径
				})(localRequire, exports, graph[module].code);
				return exports; // 10.导出 下一个模块才能拿到导出的结果
			};
			require('${entry}') //entry = './src/index.js'
		})(${graph}); 
	`;
}

const code = generateCode('./src/index.js');
console.log(code);

