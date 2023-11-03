/* @flow */

import { parseText } from 'compiler/parser/text-parser'
import {
  getAndRemoveAttr,
  getBindingAttr,
  baseWarn
} from 'compiler/helpers'

// 打包后的transformNode 其中添加源码注释 位于 ![](前端框架/Vue/Vue源码分析/_VueCopy（CopyVue 看源码内自己写的注释）/dist/vue.js) 9123行
function transformNode (el: ASTElement, options: CompilerOptions) {
  const warn = options.warn || baseWarn
  const staticClass = getAndRemoveAttr(el, 'class')
  if (process.env.NODE_ENV !== 'production' && staticClass) {
    const res = parseText(staticClass, options.delimiters)
    if (res) {
      warn(
        `class="${staticClass}": ` +
        'Interpolation inside attributes has been removed. ' +
        'Use v-bind or the colon shorthand instead. For example, ' +
        'instead of <div class="{{ val }}">, use <div :class="val">.',
        el.rawAttrsMap['class']
      )
    }
  }
  if (staticClass) {
    el.staticClass = JSON.stringify(staticClass)
  }
  const classBinding = getBindingAttr(el, 'class', false /* getStatic */)
  if (classBinding) {
    el.classBinding = classBinding
  }
}

// 下面为打包后的transformNode 其中添加源码注释 位于 ![](前端框架/Vue/Vue源码分析/_VueCopy（CopyVue 看源码内自己写的注释）/dist/vue.js) 9123行
// function transformNode (el, options) {
//   // 定义 warn 常量，它是一个函数，用来打印警告信息。
//   var warn = options.warn || baseWarn;

//   // 接着使用 getAndRemoveAttr 函数从元素描述对象上获取绑定的 class 属性的值，并将其保存在 staticClass 常量中。
//   var staticClass = getAndRemoveAttr(el, 'class');

//   // 接着进入一段if条件语句：
//   if (staticClass) {
//     /**
//      * 这里使用 parseText 函数解析该值，如果解析成功则说明你在非绑定的class属性中使用了字面量表达式，例如：
//         <div class="{{ message ? 'message' : '' }}"></div>
//         这时 Vue 会打印警告信息，提示你使用如下这种方式替代：
//         <div :class="{ 'message': message }"></div>
//      */
//     var res = parseText(staticClass, options.delimiters);
//     if (res) {
//       warn(
//         "class=\"" + staticClass + "\": " +
//         'Interpolation inside attributes has been removed. ' +
//         'Use v-bind or the colon shorthand instead. For example, ' +
//         'instead of <div class="{{ val }}">, use <div :class="val">.',
//         el.rawAttrsMap['class']
//       );
//     }
//   }

//   // 再往下是这样一段代码：
//   if (staticClass) {
//     // 如果非绑定的 class 属性值存在，则将该值保存在元素描述对象的 el.staticClass 属性中。
//     el.staticClass = JSON.stringify(staticClass);
//   }

//   // 或者使用 getBindingAttr 函数获取绑定的class属性的值，
//   var classBinding = getBindingAttr(el, 'class', false /* getStatic */);
//   // 如果绑定的 class 属性的值存在，则将该值保存在 el.classBinding 属性中。
//   if (classBinding) {
//     el.classBinding = classBinding;
//   }

// /**
//  * 
//   做一个简短的总结:

//   非绑定的class属性值保存在元素描述对象的el.staticClass属性中，假设有如下模板：
//   <div class="box"></div>
//   则该标签元素描述对象的 el.staticClass 属性值为：
//   el.staticClass = JSON.stringify("box")

//   绑定的 class 属性值保存在元素描述对象的 el.classBinding 属性中假设我们有如下模板：
//   <div :class="{ 'message': message }"></div>
//   则该标签元素描述对象的el.classBinding属性值为：
//   el.classBinding = "{ 'message': message }"

//   对于 style 属性的处理与对 class 属性的处理类似 ，它在 transformNode$1 中完成。
//  */

// }

function genData (el: ASTElement): string {
  let data = ''
  if (el.staticClass) {
    data += `staticClass:${el.staticClass},`
  }
  if (el.classBinding) {
    data += `class:${el.classBinding},`
  }
  return data
}

export default {
  staticKeys: ['staticClass'],
  transformNode,
  genData
}
