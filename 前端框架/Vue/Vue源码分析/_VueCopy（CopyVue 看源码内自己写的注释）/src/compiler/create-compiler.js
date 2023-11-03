/* @flow */

import { extend } from 'shared/util'
import { detectErrors } from './error-detector'
import { createCompileToFunctionFn } from './to-function'

export function createCompilerCreator (baseCompile: Function): Function {

  /**
   */
  return function createCompiler (baseOptions: CompilerOptions) {
    /**
     * 
     * @param { string } template 
     * @param { CompilerOptions } options 
     * @returns { CompiledResult } compiled
     * 这里传递过去的options(CompilerOptions)如下
        {
          shouldDecodeNewlines,
          shouldDecodeNewlinesForHref,
          delimiters,
          comments,
          warn 
        }
    */
    function compile (
      template: string,
      options?: CompilerOptions
    ): CompiledResult {
      // finalOptions 所有的配置选项最终都会挂载在这个对象上,baseOptions包含编译器在运作的时候所需的配置选项。
      const finalOptions = Object.create(baseOptions)
      ```js
        var baseOptions = {
          expectHTML: true,
          modules: modules$1,
          directives: directives$1,
          isPreTag: isPreTag,
          isUnaryTag: isUnaryTag,
          mustUseProp: mustUseProp,
          canBeLeftOpenTag: canBeLeftOpenTag,
          isReservedTag: isReservedTag,
          getTagNamespace: getTagNamespace,
          staticKeys: genStaticKeys(modules$1)
        };

        分别解析下:

        第一个属性: expectHTML 被设置为 true 。
        第二个属性:modules
        var modules$1 = [
          klass$1,
          style$1,
          model$1
        ];

        var klass$1 = {
          staticKeys: ['staticClass'],
          transformNode: transformNode,
          genData: genData
        };

        var style$1 = {
          staticKeys: ['staticStyle'],
          transformNode: transformNode$1,
          genData: genData$1
        };

        var model$1 = {
          preTransformNode: preTransformNode
        };

        可以看到 klass$1、style$1、model$1 都是对象，且 klass$1、style$1 输出基本相同，只有staticKeys字段有所区别。而 model$1 对象只包含 preTransformNode 属性。

        我们用到了在细讲。

        第三个属性:directives 值是三个属性 (model、text、html) 的对象,且属性的值都是函数。
        第四个属性:isPreTag 它是一个函数,其作用是通过给定的标签名字检查标签是否是 'pre' 标签。
        第五个属性:isUnaryTag 是一个通过makeMap生成的函数,该函数的作用是检测给定的标签是否是一元标签。
        第六个属性:mustUseProp 它是一个函数,其作用是用来检测一个属性在标签中是否要使用props进行绑定。
        第七个属性:canBeLeftOpenTag 一个使用makeMap生成的函数,它的作用是检测非一元标签,但却可以自己补全并闭合的标签。比如 div 标签是一个双标签,你需要这样使用<div> text </div>,但是你依然可以省略闭合标签,直接这样写:<div> text ,且浏览器会自动补全。但是有些标签你不可以这样用,它们是严格的双标签。
        第八个属性:isReservedTag 它是一个函数,其作用是检查给定的标签是否是保留的标签。
        第九个属性:getTagNamespace 它也是一个函数,其作用是获取元素(标签)的命名空间。
        第十个属性:staticKeys 它的值是通过以 modules 为参数调用 genStaticKeys 函数的返回值得到的。 其作用是根据编译器选项的 modules 选项生成一个静态键字符串。
        现在我们粗略的介绍了下baseOptions 中各个属性的作用,当我们用到时候再来详细讲解他们的源码。
      ```
      const errors = []
      const tips = []

      let warn = (msg, range, tip) => {
        (tip ? tips : errors).push(msg)
      }
      ```js
      在 finalOptions上添加了 warn 方法,该方法接收两个参数:
      msg 错误或提示的信息
      tip 用来标示 msg 是错误还是提示。
      warn选项主要用在编译过程中的错误和提示收集,如果收集的信息是错误信息就将错误信息添加到前面定义的errors数组里,如果是提示信息就将其添加到 tips 数组里。
      ```

      if (options) {
        if (process.env.NODE_ENV !== 'production' && options.outputSourceRange) {
          // $flow-disable-line
          const leadingSpaceLength = template.match(/^\s*/)[0].length

          warn = (msg, range, tip) => {
            const data: WarningMessage = { msg }
            if (range) {
              if (range.start != null) {
                data.start = range.start + leadingSpaceLength
              }
              if (range.end != null) {
                data.end = range.end + leadingSpaceLength
              }
            }
            (tip ? tips : errors).push(data)
          }
        }
        // merge custom modules 合并自定义模块
        if (options.modules) {
          finalOptions.modules =
            (baseOptions.modules || []).concat(options.modules)
        }
        // merge custom directives 合并自定义指令
        if (options.directives) {
          finalOptions.directives = extend(
            Object.create(baseOptions.directives || null),
            options.directives
          )
        }
        // copy other options 复制options
        for (const key in options) {
          if (key !== 'modules' && key !== 'directives') {
            finalOptions[key] = options[key]
          }
        }
      }
      ```js
      这段代码检查 options 是否存在,这里的 options 就是使用编译器编译模板时传递的选项参数,或者可以简单理解为调用 compileToFunctions 函数时传递的选项参数。

      而baseOptions理解为编译器的默认选项或者基本选项,options 是用来提供定制能力的扩展选项。而上面这段代码的作用,就是将 options 对象混合到 finalOptions 中。

      两个特殊的属性处理:

      modules: 如果 options.modules 存在,就在 finalOptions 对象上添加 modules 属性,其值为 baseOptions.modules 和 options.modules 这两个数组合并后的新数组。
      directives: 对于directives 采用原型链的原理实现扩展属性对基本属性的覆盖。
      ```

      finalOptions.warn = warn

      const compiled = baseCompile(template.trim(), finalOptions)
      if (process.env.NODE_ENV !== 'production') {
        // detectErrors检测模板中有问题的表达式
        detectErrors(compiled.ast, warn)
      }
      compiled.errors = errors
      compiled.tips = tips
      return compiled
      ```js
      上面的代码调用了 baseCompile 函数,并分别将字符串模板(template),以及最终的编译器选项(finalOptions)传递了过去。
      compiled 是 baseCompile 对模板的编译结果,所以上面这段代码的作用是用来通过抽象语法树来检查模板中是否存在错误表达式的,通过 detectErrors 函数实现,将compiled.ast 作为参数传递给 detectErrors 函数,该函数最终返回一个数组,该数组中包含了所有错误的收集,最终通过这句代码将错误添加到errors。
      将收集到的错误(errors)和提示(tips)添加到compiled上并返回。
      baseCompile 函数是在 createCompilerCreator 函数调用时传递的实参。
      ```
    }

    return {
      compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    }
  }
}
