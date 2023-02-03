/* @flow */

import { parse } from './parser/index'
import { optimize } from './optimizer'
import { generate } from './codegen/index'
import { createCompilerCreator } from './create-compiler'

// `createCompilerCreator` allows creating compilers that use alternative
// `createCompilerCreator`允许创建使用

// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// 解析器/优化器/代码生成器，例如SSR优化编译器。

// Here we just export a default compiler using the default parts.
// 这里我们只使用默认部分导出默认编译器。


// createCompiler -- 创建编译器
// createCompilerCreator -- 创建编译器创建者
// baseCompile -- 基本编译
export const createCompiler = createCompilerCreator(function baseCompile(
  template: string,
  options: CompilerOptions
): CompiledResult {
  const ast = parse(template.trim(), options)
  if (options.optimize !== false) {
    optimize(ast, options)
  }
  const code = generate(ast, options)
  return {
    ast, // 抽象语法树( ast )
    render: code.render, // 渲染函数( render )
    staticRenderFns: code.staticRenderFns // 静态渲染函数( staticRenderFns )
  }
})

`
var ast =parse(template.trim(), options); 
parse 会用正则等方式解析 template 模板中的指令、class、style等数据，形成AST。

optimize(ast, options); 
optimize 的主要作用是标记 static 静态节点，这是 Vue 在编译过程中的一处优化，后面当 update 更新界面时，会有一个 patch 的过程， diff 算法会直接跳过静态节点，
从而减少了比较的过程，优化了 patch 的性能。

var code =generate(ast, options); 
生成目标平台所需的代码，将 AST 转化成 render function 字符串的过程，得到结果是 render 的字符串以及 staticRenderFns 字符串。
`