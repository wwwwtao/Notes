/* @flow */

`
编译器的技术分为词法分析、语法分析和语义分析三个部分，通常编译器的第一项工作叫做词法分析。就像阅读文章一样，文章是由一个个的中文单词组成的。程序处理也一样，只不过这里不叫单词，而是叫做“词法记号”，英文叫 Token。
<div id="app" v-if="ret">{{ message }}</div>
编译器会识别出 div a span 这些标签，id class style v-if v-for 这样的属性、指令，还有花括号符号这样的插值操作...等。这些都是 Token。
那么，如何写一个程序来识别 Token 呢？
其实，我们可以手写程序制定一些规则来区分每个不同的 Token，这些规则用“正则文法”表达，符合正则文法的表达式称为“正则表达式”。通过他们来完成具体的词法分析工作。
编译器下一个阶段的工作是语法分析。词法分析是识别一个个的单词，而语法分析就是在词法分析的基础上识别出程序的语法结构。这个结构是一个树状结构，是计算机容易理解和执行的。
程序也要定义良好的语法结构，它的语法分析过程，就是构造这么一棵树。一个程序就是一棵树，这棵树叫做抽象语法树（Abstract Syntax Tree，AST）。树的每个节点（子树）是一个语法单元，这个单元的构成规则就叫“语法”。
而我们这里要讲的 parser 就是在编译器对源代码处理的第一步，parser 把某种特定格式的文本（字符串）转换成某种数据结构的程序(对象)，并且这个数据结构是编译器能够理解的，因为编译器的后续步骤，比如上面提到的 句法分析，类型检查/推导，代码优化，代码生成 等等都依赖于该数据结构。
注：parse & parser 这两个单词，不要混淆，parse 是动词，代表“解析”的过程，parser 是名词，代表“解析器”。
Vue 的编译器也不例外, 在词法分析阶段 Vue 会把字符串模板解析成一个个的令牌(token)，该令牌将用于句法分析阶段，在句法分析阶段会根据令牌生成一棵 AST，最后再根据该 AST生成最终的渲染函数，这样就完成了代码的生成。
`

import he from 'he'
import { parseHTML } from './html-parser'
import { parseText } from './text-parser'
import { parseFilters } from './filter-parser'
import { genAssignmentCode } from '../directives/model'
import { extend, cached, no, camelize, hyphenate } from 'shared/util'
import { isIE, isEdge, isServerRendering } from 'core/util/env'

import {
  addProp,
  addAttr,
  baseWarn,
  addHandler,
  addDirective,
  getBindingAttr,
  getAndRemoveAttr,
  getRawBindingAttr,
  pluckModuleFunction,
  getAndRemoveAttrByRegex
} from '../helpers'

// 匹配以字符 @ 或 v-on: 开头的字符串，主要作用是检测标签属性名是否是监听事件的指令。
export const onRE = /^@|^v-on:/ 
// 匹配以字符 v- 或 @ 或 : 开头的字符串，主要作用是检测标签属性名是否是指令。在Vue中所有以 v- 开头的属性都被认为是指令，另外@字符是 v-on 的缩写，: 字符是 v-bind 的缩写。
export const dirRE = process.env.VBIND_PROP_SHORTHAND 
  ? /^v-|^@|^:|^\.|^#/
  : /^v-|^@|^:|^#/
// 匹配 v-for 属性的值，并捕获 in 或 of 前后的字符串。
export const forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/
// 这个也是匹配v-for的属性值，不过比之前要稍微复杂点：列表渲染 v-for（https://cn.vuejs.org/v2/guide/list.html#%E7%94%A8-v-for-%E6%8A%8A%E4%B8%80%E4%B8%AA%E6%95%B0%E7%BB%84%E5%AF%B9%E5%BA%94%E4%B8%BA%E4%B8%80%E7%BB%84%E5%85%83%E7%B4%A0)需要先了解下这个。
export const forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/
/**
 *  这个捕获组用来捕获要么以字符 ( 开头，要么以字符 ) 结尾的字符串，或者两者都满足
    那么这个正则的作用是什么呢？我们在讲解正则 forIteratorRE 时有个细节不知道大家注意到了没有，就是 forIteratorRE 正则所匹配的字符串是 'obj, index' ，而不是 '(obj, index)' ，这两个字符串的区别就在于第二个字符串拥有左右括号，所以在使用 forIteratorRE 正则之前，需要使用 stripParensRE 正则去掉字符串 '(obj, index)' 中的左右括号，实现方式很简单:
    "(obj, index)".replace(stripParensRE, "")
 */
const stripParensRE = /^\(|\)$/g
const dynamicArgRE = /^\[.*\]$/
// argRE正则用来匹配指令编写中的参数，并且拥有一个捕获组，用来捕获参数的名字。 其中 v-on 为指令，click为传递给 v-on 指令的参数，stop 为修饰符。
const argRE = /:(.*)$/
// 该正则用来匹配以字符:或字符串 v-bind: 开头的字符串，主要用来检测一个标签的属性是否是绑定(v-bind)。
export const bindRE = /^:|^\.|^v-bind:/
const propBindRE = /^\./
// 该正则用来匹配修饰符的，但是并没有捕获任何东西,但你可以用match、exec等方法获取与当前正则匹配成功的信息。
const modifierRE = /\.[^.\]]+(?=[^\]]*$)/g

const slotRE = /^v-slot(:|$)|^#/

const lineBreakRE = /[\r\n]/
const whitespaceRE = /\s+/g

const invalidAttributeRE = /[\s"'<>\/=]/

const decodeHTMLCached = cached(he.decode)

export const emptySlotScopeToken = `_empty_`

// configurable state
export let warn: any
let delimiters
let transforms
let preTransforms
let postTransforms
let platformIsPreTag
let platformMustUseProp
let platformGetTagNamespace
let maybeComponent

/**
 * 
 * @param {*} tag 
 * @param {*} attrs 
 * @param {*} parent 
 * @returns 
 * @description 创建一个元素的描述对象。
 */
export function createASTElement (
  tag: string,
  attrs: Array<ASTAttr>,
  parent: ASTElement | void
): ASTElement {
  return {
    type: 1,
    tag,
    attrsList: attrs,
    attrsMap: makeAttrsMap(attrs),
    rawAttrsMap: {},
    parent,
    children: []
  }
}

/**
 * Convert HTML string to AST. （将HTML字符串转换为AST。）
 */
export function parse (
  template: string,
  options: CompilerOptions
): ASTElement | void {
  warn = options.warn || baseWarn // warn$2 函数 毋庸置疑它作用是用来打印警告信息的

  platformIsPreTag = options.isPreTag || no // platformIsPreTag 函数是一个编译器选项，其作用是通过给定的标签名字判断该标签是否是 pre 标签。
  platformMustUseProp = options.mustUseProp || no // platformMustUseProp 该函数也是一个编译器选项，其作用是用来检测一个属性在标签中是否要使用元素对象原生的 prop 进行绑定。
  platformGetTagNamespace = options.getTagNamespace || no // platformGetTagNamespace 该函数是一个编译器选项，其作用是用来获取元素(标签)的命名空间。
  const isReservedTag = options.isReservedTag || no  // 判断一个标签是否是保留标签，我们可以知道，如果一个标签是html标签，或者是svg标签，那么这个标签即是保留标签。
  maybeComponent = (el: ASTElement) => !!el.component || !isReservedTag(el.tag)

  transforms = pluckModuleFunction(options.modules, 'transformNode')
  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode')
  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode')

  delimiters = options.delimiters // delimiters 它的值为 options.delimiters 属性，它的值就是在创建 Vue 实例对象时所传递的 delimiters 选项。

  const stack = []  // stack 初始值是一个空数组，作用在上个章节我们讲到，回退操作为了让子元素描述对象的parent属性能够正确指向其父元素。
  const preserveWhitespace = options.preserveWhitespace !== false // preserveWhitespace 是一个布尔值并且它的值与编译器选项中的options.preserveWhitespace选项有关，只要 options.preserveWhitespace 的值不为false，那么 preserveWhitespace 的值就为真。其中 options.preserveWhitespace 选项用来告诉编译器在编译 html 字符串时是否放弃标签之间的空格，如果为 true 则代表放弃。
  const whitespaceOption = options.whitespace
  let root  // root 存储最终生成的AST。
  let currentParent // currentParent 通过上章节了解到，该变量维护元素描述对象之间的父子关系。
  let inVPre = false  // inVPre 初始值：false。标识当前解析的标签是否在拥有 v-pre (跳过这个元素和它的子元素的编译过程。)的标签之内。
  let inPre = false // inPre 初始值：false。标识当前正在解析的标签是否在 <pre></pre> 标签之内。
  let warned = false  // warned 初始值：false。用来打印警告信息的函数，只不过 warnOnce 函数就如它的名字一样，只会打印一次警告信息，并且 warnOnce 函数也是通过调用 warn 函数来实现的。          

  /**
   * @description warnOnce 函数就如它的名字一样，只会打印一次警告信息，并且 warnOnce 函数也是通过调用 warn 函数来实现的。
   */
  function warnOnce (msg, range) {
    if (!warned) {
      warned = true
      warn(msg, range)
    }
  }

  function closeElement (element) {
    trimEndingWhitespace(element) // 删除尾随空白节点
    if (!inVPre && !element.processed) {
      element = processElement(element, options)
    }
    // tree management
    /**
     * 当 stack 为空的情况下会执行 else if 语句块内的代码, 那stack 什么情况下才为空呢？
     * 前面已经多次提到每当遇到一个非一元标签时就会将该标签的描述对象放进数组，并且每当遇到一个结束标签时都会将该标签的描述对象从 stack 数组中拿掉，那也就是说在只有一个根元素的情况下，正常解析完成一段 html 代码后 stack 数组应该为空，
     * 或者换个说法，即当 stack 数组被清空后则说明整个模板字符串已经解析完毕了，但此时 start 钩子函数仍然被调用了，这说明模板中存在多个根元素，这时 if 语句块内的代码将被执行
     */
    if (!stack.length && element !== root) {
      // allow root elements with v-if, v-else-if and v-else （允许具有v-if、v-else-if和v-else的根元素）
      /**
       *  我们知道在编写 Vue 模板时的约束是必须有且仅有一个被渲染的根元素，但你可以定义多个根元素，只要能够保证最终只渲染其中一个元素即可，能够达到这个目的的方式只有一种，那就是在多个根元素之间使用 v-if 或 v-else-if 或 v-else 。
        root 对象中的 .if 属性、.elseif 属性以及 .else 属性都是哪里来的，它们是在通过 processIf 函数处理元素描述对象时，如果发现元素的属性中有 v-if 或 v-else-if 或 v-else ，则会在元素描述对象上添加相应的属性作为标识。
        上面代码如果第一个根元素上有 .if 的属性，而非第一个根元素 element 有 .elseif 属性或者 .else 属性，这说明根元素都是由 v-if、v-else-if、v-else 指令控制的，同时也保证了被渲染的根元素只有一个。
       */
      if (root.if && (element.elseif || element.else)) {
        if (process.env.NODE_ENV !== 'production') {
          checkRootConstraints(element)
        }
        addIfCondition(root, {
          exp: element.elseif,
          block: element
        })
      } else if (process.env.NODE_ENV !== 'production') {
        warnOnce(
          // 组件模板应仅包含一个根元素。如果在多个元素上使用v-If，使用v-else-if链接它们
          `Component template should contain exactly one root element. ` +
          `If you are using v-if on multiple elements, ` +
          `use v-else-if to chain them instead.`,
          { start: element.start }
        )
      }
    }
    if (currentParent && !element.forbidden) { // 这里的条件要成立，则说明当前元素存在父级( currentParent )，并且当前元素不是被禁止的元素

      /**
       * 如果一个标签使用 v-else-if 或 v-else 指令，那么该元素的描述对象实际上会被添加到对应的v-if 元素描述对象的 ifConditions 数组中，而非作为一个独立的子节点
       */
      if (element.elseif || element.else) {
        processIfConditions(element, currentParent)
      } else {
        
        /**
         * 如果当前元素没有使用 v-else-if 或 v-else 指令，那么还会判断当前元素是否使用了 slot-scope 特性, 
           如果一个元素使用了 slot-scope 特性，那么该元素的描述对象会被添加到父级元素的 scopedSlots 对象下，
           也就是说使用了 slot-scope 特性的元素与使用了v-else-if 或 v-else 指令的元素一样，他们都不会作为父级元素的子节点，
           对于使用了 slot-scope 特性的元素来讲它们将被添加到父级元素描述对象的 scopedSlots 对象下。
         */
        if (element.slotScope) {
          // scoped slot
          // keep it in the children list so that v-else(-if) conditions can (将其保留在子列表中，以便v-else（-if）条件可以)
          // find it as the prev node. (找到它作为prev节点)
          const name = element.slotTarget || '"default"'
          ;(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element
        }

        /**
         * 在 else 语句块内，会把当前元素描述对象添加到父级元素描述对象 ( currentParent ) 的children 数组中，
           同时将当前元素对象的 parent 属性指向父级元素对象，这样就建立了元素描述对象间的父子级关系
         */
        currentParent.children.push(element)
        element.parent = currentParent
      }
    }

    // final children cleanup （最终子项清理）
    // filter out scoped slots （筛选出作用域插槽）
    element.children = element.children.filter(c => !(c: any).slotScope)
    // remove trailing whitespace node again （再次删除尾随空白节点）
    trimEndingWhitespace(element)

    // check pre state （检查预状态）
    if (element.pre) {
      inVPre = false
    }
    if (platformIsPreTag(element.tag)) {
      inPre = false
    }
    // apply post-transforms （应用后变换）
    for (let i = 0; i < postTransforms.length; i++) {
      postTransforms[i](element, options)
    }
  }

  function trimEndingWhitespace (el) {
    // remove trailing whitespace node（删除尾随空白节点）
    if (!inPre) {
      let lastNode
      while (
        (lastNode = el.children[el.children.length - 1]) &&
        lastNode.type === 3 &&
        lastNode.text === ' '
      ) {
        el.children.pop()
      }
    }
  }

  // 检查根元素符合约束 - 检查当前元素是否符合作为根元素的要求
  function checkRootConstraints (el) {
    if (el.tag === 'slot' || el.tag === 'template') {
      warnOnce(
        `Cannot use <${el.tag}> as component root element because it may ` + // 不能将＜$｛el.tag｝＞用作组件根元素，因为它可能`
        'contain multiple nodes.',                                           // '包含多个节点。'
        { start: el.start }
      )
    }
    if (el.attrsMap.hasOwnProperty('v-for')) {
      warnOnce(
        'Cannot use v-for on stateful component root element because ' + // '无法在有状态组件根元素上使用v-for，因为'
        'it renders multiple elements.',                                 //  '它呈现多个元素。'
        el.rawAttrsMap['v-for']
      )
    }
  }

  parseHTML(template, {
    warn,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
    shouldKeepComment: options.comments,
    outputSourceRange: options.outputSourceRange,

    /**
     * 
     * @param {*} tag 标签名字 tag
     * @param {*} attrs 该标签的属性数组attrs
     * @param {*} unary 是否是一元标签的标识
     * @param {*} start 
     * @param {*} end 
     */
    start (tag, attrs, unary, start, end) {
      // check namespace.（检查命名空间。）
      // inherit parent ns if there is one（继承父ns（如果有））
      /**
       * 开头定义了 ns 变量，它的值为标签的命名空间，如何获取当前元素的命名空间呢？首先检测currentParent 变量是否存在，我们知道 currentParent 变量为当前元素的父级元素描述对象，如果当前元素存在父级并且父级元素存在命名空间，则使用父级的命名空间作为当前元素的命名空间。
        如果父级元素不存在或父级元素没有命名空间那么会调用platformGetTagNamespace函数，platformGetTagNamespace 函数只会获取 svg 和 math 这两个标签的命名空间，但这两个标签的所有子标签都会继承它们两个的命名空间。
       */
      const ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag)

      // handle IE svg bug （处理IE SVG相关bug）
      /* istanbul ignore if */
      /**
       * 这里通过isIE来判断宿主环境是不是IE浏览器，并且前元素的命名空间为svg， 如果是通过guardIESVGBug处理当前元素的属性数组attrs，并使用处理后的结果重新赋值给attrs变量。为什么要这么做？大家可以访问[IE 11]( http://osgeo-org.1560.x6.nabble.com/WFS-and-IE-11-td5090636.html )了解这个 bug的详情，该问题是svg标签中渲染多余的属性，如下svg标签：
          <svg xmlns:feature="http://www.openplans.org/topp"></svg>
          被渲染为：
          <svg xmlns:NS1="" NS1:xmlns:feature="http://www.openplans.org/topp"></svg>
          标签中多了 'xmlns:NS1="" NS1:' 这段字符串，解决办法也很简单，将整个多余的字符串去掉即可。而 guardIESVGBug 函数就是用来修改NS1:xmlns:feature属性并移除xmlns:NS1="" 属性的。
       */
      if (isIE && ns === 'svg') {
        attrs = guardIESVGBug(attrs)
      }

      // 在start 钩子函数中首先定义了 element 变量，它就是元素节点的描述对象，接着判断root 是否存在，如果不存在则直接将 element 赋值给 root 。
      let element: ASTElement = createASTElement(tag, attrs, currentParent)
      if (ns) {
        element.ns = ns // 在元素对象上添加 ns 属性，其值为命名空间的值
      }

      if (process.env.NODE_ENV !== 'production') {
        if (options.outputSourceRange) {
          element.start = start
          element.end = end
          element.rawAttrsMap = element.attrsList.reduce((cumulated, attr) => {
            cumulated[attr.name] = attr
            return cumulated
          }, {})
        }
        attrs.forEach(attr => {
          if (invalidAttributeRE.test(attr.name)) {
            warn(
              `Invalid dynamic argument expression: attribute names cannot contain ` + // 无效的动态参数表达式：属性名称不能包含`
              `spaces, quotes, <, >, / or =.`,                                         // `空格、引号、<、>、/或=.`，
              {
                start: attr.start + attr.name.indexOf(`[`),
                end: attr.start + attr.name.length
              }
            )
          }
        })
      }

      /**
       * 这里的作用就是判断在非服务端渲染情况下，当前解析的开始标签是否是禁止在模板中使用的标签。哪些是禁止的呢？
        看 isForbiddenTag 函数：
       */
      if (isForbiddenTag(element) && !isServerRendering()) {
        element.forbidden = true // 在当前元素的描述对象上添加 element.forbidden 属性，并将其值设置为true。 (表示为被禁止的)
        process.env.NODE_ENV !== 'production' && warn( // 模板应仅负责将状态映射到用户界面。避免在模板中放置带有副作用的标记，例如＜$｛tag｝＞“+”，因为它们不会被解析
          'Templates should only be responsible for mapping the state to the ' + 
          'UI. Avoid placing tags with side-effects in your templates, such as ' +
          `<${tag}>` + ', as they will not be parsed.',  
          { start: element.start }
        )
      }

      // apply pre-transforms （应用预变换）
      /**
       * 如上代码中使用 for 循环遍历了preTransforms 数组，preTransforms 是通过pluckModuleFunction 函数从options.modules 选项中筛选出名字为preTransformNode 函数所组成的数组。
        实际上 preTransforms 数组中只有一个 preTransformNode 函数该函数只用来处理 input 标签
       */
      for (let i = 0; i < preTransforms.length; i++) {
        element = preTransforms[i](element, options) || element
      }

      /**
       * 可以看到这里会有大量的process*的函数，这些函数是做什么用的呢？实际上process* 系列函数的作用就是对元素描述对象做进一步处理，
         比如其中一个函数叫做 processPre，这个函数的作用就是用来检测元素是否拥有v-pre 属性，如果有v-pre 属性则会在 element 描述对象上添加一个 pre 属性，如下：
          {
            type: 1,
            tag,
            attrsList: attrs,
            attrsMap: makeAttrsMap(attrs),
            parent,
            children: [],
            pre: true
          }
         总结：所有process* 系列函数的作用都是为了让一个元素的描述对象更加充实，使这个对象能更加详细地描述一个元素
       */
      if (!inVPre) {
        processPre(element)
        if (element.pre) {
          inVPre = true
        }
      }
      if (platformIsPreTag(element.tag)) {
        inPre = true
      }
      if (inVPre) {
        processRawAttrs(element)
      } else if (!element.processed) {
        // structural directives （结构指令）
        processFor(element)
        processIf(element)
        processOnce(element)
      }
      
      // 判断root 是否存在，如果不存在则直接将 element 赋值给 root
      if (!root) {
        /**
         * {
            type: 1,
            tag,  // div
            attrsList: attrs,
            attrsMap: makeAttrsMap(attrs),
            rawAttrsMap: {},
            parent, // null
            children: []
          }
         */
        root = element
        if (process.env.NODE_ENV !== 'production') {
          checkRootConstraints(root) // 检查根元素符合约束
        }
      }

      /**
       * 当一个元素为非一元标签时，会设置 currentParent 为该元素的描述对象，所以此时currentParent也是
          {
          type: 1,
          tag,  // div
          attrsList: attrs,
          attrsMap: makeAttrsMap(attrs),
          rawAttrsMap: {},
          parent, // null
          children: []
          }
         老生常谈的总结：每当遇到一个非一元标签都会将该元素的描述对象添加到stack数组，并且currentParent 始终存储的是 stack 栈顶的元素，即当前解析元素的父级。
       */
      if (!unary) {
        currentParent = element
        stack.push(element)
      } else {
        closeElement(element)
      }
    },

    /**
     * @describe 
     */
    end (tag, start, end) {
      const element = stack[stack.length - 1]
      // pop stack
      stack.length -= 1
      currentParent = stack[stack.length - 1]
      if (process.env.NODE_ENV !== 'production' && options.outputSourceRange) {
        element.end = end
      }
      closeElement(element)
    },

    /**
     * 
     * @param {*} text 
     * @param {*} start 
     * @param {*} end 
     * @returns 
     * @description 当解析器遇到文本节点时，如上代码中的 chars 钩子函数就会被调用，并且接收该文本节点的文本内容作为参数
     */
    chars (text: string, start: number, end: number) {
      /**
       * 首先判断了 currentParent 变量是否存在，我们知道 currentParent 变量指向的是当前节点的父节点:。
         如果 currentParent 变量不存在说明什么问题？
            1：没有根元素，只有文本。
            2: 文本在根元素之外。
         当遇到第一种情况打印警告信息:"模板必须要有根元素"，第二种情况打印警告信息:" 根元素外的文本将会被忽略"。
       */
      if (!currentParent) {
        if (process.env.NODE_ENV !== 'production') {
          if (text === template) {
            warnOnce(
              'Component template requires a root element, rather than just text.', // 模板必须要有根元素
              { start }
            )
          } else if ((text = text.trim())) {
            warnOnce(
              `text "${text}" outside root element will be ignored.`, // 根元素外的文本将会被忽略
              { start }
            )
          }
        }
        return
      }

      // IE textarea placeholder bug
      // 这段代码是用来解决 IE 浏览器中渲染 <textarea> 标签的 placeholder 属性时存在的 bug 的。具体的问题大家可以查看这个 issue(https://link.zhihu.com/?target=https%3A//github.com/vuejs/vue/issues/4098) 
      /* istanbul ignore if */
      if (isIE && currentParent.tag === 'textarea' && currentParent.attrsMap.placeholder === text) {
        return
      }

      const children = currentParent.children
      // 判断了条件 inPre || text.trim() 的真假，如果为 true，检测了当前文本节点的父节点是否是文本标签，如果是文本标签则直接使用原始文本，否则使用decodeHTMLCached 函数对文本进行解码
      if (inPre || text.trim()) {
        text = isTextTag(currentParent) ? text : decodeHTMLCached(text)
      } else if (!children.length) {
        // remove the whitespace-only node right after an opening tag(删除开头标记后的仅空白节点)
        // inPre || text.trim() 如果为 false，检测当前节点的父节点有没有子元素,如果当前节点的父节点没有子元素则也不会保留空格
        text = ''
      } else if (whitespaceOption) { // 如果有whitespaceOption（空白选项）
        if (whitespaceOption === 'condense') {
          // in condense mode, remove the whitespace node if it contains （在压缩模式下，如果空白节点包含换行符）
          // line break, otherwise condense to a single space （否则压缩为单个空格）
          text = lineBreakRE.test(text) ? '' : ' '
        } else {
          text = ' '
        }
      } else {
        // inPre || text.trim() 如果为 false，检测 preserveWhitespace 是否为 true 。
        // preserveWhitespace 是一个布尔值代表着是否保留空格，只有它为真的情况下才会保留空格。
        // 但即使 preserveWhitespace 常量的值为真，如果当前节点的父节点没有子元素则也不会保留空格.(此处源码已经改动到了第一个else if)
        // 换句话说，编译器只会保留那些 不存在于开始标签之后的空格。
        text = preserveWhitespace ? ' ' : ''
      }
      if (text) {
        if (!inPre && whitespaceOption === 'condense') {
          // condense consecutive whitespaces into single space （将连续空白空间压缩为单个空间）
          text = text.replace(whitespaceRE, ' ')
        }
        let res
        let child: ?ASTNode
        /**
         *  判断当前元素未使用v-pre 指令，text不为空，使用 parseText 函数成功解析当前文本节点的内容 
         *  1. 当前解析的元素使用v-pre 指令
            2. text 为空
            3. parseText 解析失败
            只要以上三种情况中，有一种情况出现则代码会来到else...if 分支的判断
         */
        if (!inVPre && text !== ' ' && (res = parseText(text, delimiters))) { // 如果文本节点包含了 Vue 语法中的字面量表达式，parseText 函数的作用就是用来解析这段包含了字面量表达式的文本的。
          child = {
            type: 2,
            expression: res.expression,
            tokens: res.tokens,
            text
          }
        } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
          /**
           *  1. 文本内容不是空格
              2. 文本内容是空格，但是该文本节点的父节点还没有子节点(即 !children.length )
              3. 文本内容是空格，并且该文本节点的父节点有子节点，但最后一个子节点不是空格
           */
          child = {
            type: 3,
            text
          }
        }
        if (child) {
          if (process.env.NODE_ENV !== 'production' && options.outputSourceRange) {
            child.start = start
            child.end = end
          }
          children.push(child)
        }
      }
    },

    comment (text: string, start, end) {
      // adding anything as a sibling to the root node is forbidden
      // comments should still be allowed, but ignored
      if (currentParent) {
        const child: ASTText = {
          type: 3,
          text,
          isComment: true
        }
        if (process.env.NODE_ENV !== 'production' && options.outputSourceRange) {
          child.start = start
          child.end = end
        }
        currentParent.children.push(child)
      }
    }
  })
  return root
	`
	需要注意到在 parse 函数内部主要通过调用 parseHTML 函数对模板字符串进行解析,实际上 parseHTML 函数的作用就是用来做词法分析的,
	而 parse 函数的作用则是在词法分析的基础上做句法分析从而生成一棵AST。
	`
	`
	接下来我们章节会分为两个方向
		一:parseHTML 函数源码解析 https://zhuanlan.zhihu.com/p/88955215
		二:Vue编译器token解析规则-正则分析 https://zhuanlan.zhihu.com/p/88954572
	`
}

function processPre (el) {
  if (getAndRemoveAttr(el, 'v-pre') != null) {
    el.pre = true
  }
}

function processRawAttrs (el) {
  const list = el.attrsList
  const len = list.length
  if (len) {
    const attrs: Array<ASTAttr> = el.attrs = new Array(len)
    for (let i = 0; i < len; i++) {
      attrs[i] = {
        name: list[i].name,
        value: JSON.stringify(list[i].value)
      }
      if (list[i].start != null) {
        attrs[i].start = list[i].start
        attrs[i].end = list[i].end
      }
    }
  } else if (!el.pre) {
    // non root node in pre blocks with no attributes
    el.plain = true
  }
}

export function processElement (
  element: ASTElement,
  options: CompilerOptions
) {
  processKey(element)

  // determine whether this is a plain element after （确定这是否是一个普通元素）
  // removing structural attributes（删除结构属性）
  element.plain = (
    !element.key &&
    !element.scopedSlots &&
    !element.attrsList.length
  )

  processRef(element)
  processSlotContent(element)
  processSlotOutlet(element)
  processComponent(element)
  for (let i = 0; i < transforms.length; i++) {
    element = transforms[i](element, options) || element
  }
  processAttrs(element)
  return element
}

function processKey (el) {
  const exp = getBindingAttr(el, 'key')
  if (exp) {
    if (process.env.NODE_ENV !== 'production') {
      if (el.tag === 'template') {
        warn(
          `<template> cannot be keyed. Place the key on real elements instead.`,
          getRawBindingAttr(el, 'key')
        )
      }
      if (el.for) {
        const iterator = el.iterator2 || el.iterator1
        const parent = el.parent
        if (iterator && iterator === exp && parent && parent.tag === 'transition-group') {
          warn(
            `Do not use v-for index as key on <transition-group> children, ` +
            `this is the same as not using keys.`,
            getRawBindingAttr(el, 'key'),
            true /* tip */
          )
        }
      }
    }
    el.key = exp
  }
}

function processRef (el) {
  const ref = getBindingAttr(el, 'ref')
  if (ref) {
    el.ref = ref
    el.refInFor = checkInFor(el)
  }
}

export function processFor (el: ASTElement) {
  let exp
  if ((exp = getAndRemoveAttr(el, 'v-for'))) {
    const res = parseFor(exp)
    if (res) {
      extend(el, res)
    } else if (process.env.NODE_ENV !== 'production') {
      warn(
        `Invalid v-for expression: ${exp}`,
        el.rawAttrsMap['v-for']
      )
    }
  }
}

type ForParseResult = {
  for: string;
  alias: string;
  iterator1?: string;
  iterator2?: string;
};

export function parseFor (exp: string): ?ForParseResult {
  const inMatch = exp.match(forAliasRE)
  if (!inMatch) return
  const res = {}
  res.for = inMatch[2].trim()
  const alias = inMatch[1].trim().replace(stripParensRE, '')
  const iteratorMatch = alias.match(forIteratorRE)
  if (iteratorMatch) {
    res.alias = alias.replace(forIteratorRE, '').trim()
    res.iterator1 = iteratorMatch[1].trim()
    if (iteratorMatch[2]) {
      res.iterator2 = iteratorMatch[2].trim()
    }
  } else {
    res.alias = alias
  }
  return res
}

function processIf (el) {
  const exp = getAndRemoveAttr(el, 'v-if')
  if (exp) {
    el.if = exp
    addIfCondition(el, {
      exp: exp,
      block: el
    })
  } else {
    if (getAndRemoveAttr(el, 'v-else') != null) {
      el.else = true
    }
    const elseif = getAndRemoveAttr(el, 'v-else-if')
    if (elseif) {
      el.elseif = elseif
    }
  }
}

/**
 * 
 * @param {*} el 当前元素描述对象 element 
 * @param {*} parent 父级元素的描述对象 currentParent
 * @description
 */
function processIfConditions (el, parent) {
  const prev = findPrevElement(parent.children) // findPrevElement 函数是去查找到当前元素的前一个元素描述对象，并将其赋值给 prev 常量
  if (prev && prev.if) {
    // addIfCondition 不用多说如果prev 、prev.if 存在，调用 addIfCondition 函数在当前元素描述对象添加 ifConditions 属性，传入的对象存储相关信息
    addIfCondition(prev, {  
      exp: el.elseif,
      block: el
    })
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      // V-${el.elseif？（'else-if='+el.elseif+'）：'else'}在元素<${el.tag}>上使用，没有相应的V-IF
      `v-${el.elseif ? ('else-if="' + el.elseif + '"') : 'else'} ` +
      `used on element <${el.tag}> without corresponding v-if.`,
      el.rawAttrsMap[el.elseif ? 'v-else-if' : 'v-else']
    )
  }
}

function findPrevElement (children: Array<any>): ASTElement | void {
  let i = children.length
  while (i--) {
    if (children[i].type === 1) {
      return children[i]
    } else {
      if (process.env.NODE_ENV !== 'production' && children[i].text !== ' ') {
        warn(
          // v-if和v-else（-if）之间的文本“${children[i].text.trim（）}”将被忽略
          `text "${children[i].text.trim()}" between v-if and v-else(-if) ` +
          `will be ignored.`,
          children[i]
        )
      }
      children.pop()
    }
  }
}

/**
 * 
 * @param {*} el 
 * @param {*} condition 
 */
export function addIfCondition (el: ASTElement, condition: ASTIfCondition) {
  if (!el.ifConditions) {
    el.ifConditions = []
  }
  el.ifConditions.push(condition) // 具有 v-else-if 或 v-else 属性的元素的描述对象会被添加到具有 v-if 属性的元素描述对象的 .ifConnditions 数组中
}

function processOnce (el) {
  const once = getAndRemoveAttr(el, 'v-once')
  if (once != null) {
    el.once = true
  }
}

// handle content being passed to a component as slot,
// e.g. <template slot="xxx">, <div slot-scope="xxx">
function processSlotContent (el) {
  let slotScope
  if (el.tag === 'template') {
    slotScope = getAndRemoveAttr(el, 'scope')
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && slotScope) {
      warn(
        `the "scope" attribute for scoped slots have been deprecated and ` +
        `replaced by "slot-scope" since 2.5. The new "slot-scope" attribute ` +
        `can also be used on plain elements in addition to <template> to ` +
        `denote scoped slots.`,
        el.rawAttrsMap['scope'],
        true
      )
    }
    el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope')
  } else if ((slotScope = getAndRemoveAttr(el, 'slot-scope'))) {
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && el.attrsMap['v-for']) {
      warn(
        `Ambiguous combined usage of slot-scope and v-for on <${el.tag}> ` +
        `(v-for takes higher priority). Use a wrapper <template> for the ` +
        `scoped slot to make it clearer.`,
        el.rawAttrsMap['slot-scope'],
        true
      )
    }
    el.slotScope = slotScope
  }

  // slot="xxx"
  const slotTarget = getBindingAttr(el, 'slot')
  if (slotTarget) {
    el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget
    el.slotTargetDynamic = !!(el.attrsMap[':slot'] || el.attrsMap['v-bind:slot'])
    // preserve slot as an attribute for native shadow DOM compat
    // only for non-scoped slots.
    if (el.tag !== 'template' && !el.slotScope) {
      addAttr(el, 'slot', slotTarget, getRawBindingAttr(el, 'slot'))
    }
  }

  // 2.6 v-slot syntax
  if (process.env.NEW_SLOT_SYNTAX) {
    if (el.tag === 'template') {
      // v-slot on <template>
      const slotBinding = getAndRemoveAttrByRegex(el, slotRE)
      if (slotBinding) {
        if (process.env.NODE_ENV !== 'production') {
          if (el.slotTarget || el.slotScope) {
            warn(
              `Unexpected mixed usage of different slot syntaxes.`,
              el
            )
          }
          if (el.parent && !maybeComponent(el.parent)) {
            warn(
              `<template v-slot> can only appear at the root level inside ` +
              `the receiving component`,
              el
            )
          }
        }
        const { name, dynamic } = getSlotName(slotBinding)
        el.slotTarget = name
        el.slotTargetDynamic = dynamic
        el.slotScope = slotBinding.value || emptySlotScopeToken // force it into a scoped slot for perf
      }
    } else {
      // v-slot on component, denotes default slot
      const slotBinding = getAndRemoveAttrByRegex(el, slotRE)
      if (slotBinding) {
        if (process.env.NODE_ENV !== 'production') {
          if (!maybeComponent(el)) {
            warn(
              `v-slot can only be used on components or <template>.`,
              slotBinding
            )
          }
          if (el.slotScope || el.slotTarget) {
            warn(
              `Unexpected mixed usage of different slot syntaxes.`,
              el
            )
          }
          if (el.scopedSlots) {
            warn(
              `To avoid scope ambiguity, the default slot should also use ` +
              `<template> syntax when there are other named slots.`,
              slotBinding
            )
          }
        }
        // add the component's children to its default slot
        const slots = el.scopedSlots || (el.scopedSlots = {})
        const { name, dynamic } = getSlotName(slotBinding)
        const slotContainer = slots[name] = createASTElement('template', [], el)
        slotContainer.slotTarget = name
        slotContainer.slotTargetDynamic = dynamic
        slotContainer.children = el.children.filter((c: any) => {
          if (!c.slotScope) {
            c.parent = slotContainer
            return true
          }
        })
        slotContainer.slotScope = slotBinding.value || emptySlotScopeToken
        // remove children as they are returned from scopedSlots now
        el.children = []
        // mark el non-plain so data gets generated
        el.plain = false
      }
    }
  }
}

function getSlotName (binding) {
  let name = binding.name.replace(slotRE, '')
  if (!name) {
    if (binding.name[0] !== '#') {
      name = 'default'
    } else if (process.env.NODE_ENV !== 'production') {
      warn(
        `v-slot shorthand syntax requires a slot name.`,
        binding
      )
    }
  }
  return dynamicArgRE.test(name)
    // dynamic [name]
    ? { name: name.slice(1, -1), dynamic: true }
    // static name
    : { name: `"${name}"`, dynamic: false }
}

// handle <slot/> outlets
function processSlotOutlet (el) {
  if (el.tag === 'slot') {
    el.slotName = getBindingAttr(el, 'name')
    if (process.env.NODE_ENV !== 'production' && el.key) {
      warn(
        `\`key\` does not work on <slot> because slots are abstract outlets ` +
        `and can possibly expand into multiple elements. ` +
        `Use the key on a wrapping element instead.`,
        getRawBindingAttr(el, 'key')
      )
    }
  }
}

function processComponent (el) {
  let binding
  if ((binding = getBindingAttr(el, 'is'))) {
    el.component = binding
  }
  if (getAndRemoveAttr(el, 'inline-template') != null) {
    el.inlineTemplate = true
  }
}

function processAttrs (el) {
  const list = el.attrsList
  let i, l, name, rawName, value, modifiers, syncGen, isDynamic
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name
    value = list[i].value
    if (dirRE.test(name)) {
      // mark element as dynamic
      el.hasBindings = true
      // modifiers
      modifiers = parseModifiers(name.replace(dirRE, ''))
      // support .foo shorthand syntax for the .prop modifier
      if (process.env.VBIND_PROP_SHORTHAND && propBindRE.test(name)) {
        (modifiers || (modifiers = {})).prop = true
        name = `.` + name.slice(1).replace(modifierRE, '')
      } else if (modifiers) {
        name = name.replace(modifierRE, '')
      }
      if (bindRE.test(name)) { // v-bind
        name = name.replace(bindRE, '')
        value = parseFilters(value)
        isDynamic = dynamicArgRE.test(name)
        if (isDynamic) {
          name = name.slice(1, -1)
        }
        if (
          process.env.NODE_ENV !== 'production' &&
          value.trim().length === 0
        ) {
          warn(
            `The value for a v-bind expression cannot be empty. Found in "v-bind:${name}"`
          )
        }
        if (modifiers) {
          if (modifiers.prop && !isDynamic) {
            name = camelize(name)
            if (name === 'innerHtml') name = 'innerHTML'
          }
          if (modifiers.camel && !isDynamic) {
            name = camelize(name)
          }
          if (modifiers.sync) {
            syncGen = genAssignmentCode(value, `$event`)
            if (!isDynamic) {
              addHandler(
                el,
                `update:${camelize(name)}`,
                syncGen,
                null,
                false,
                warn,
                list[i]
              )
              if (hyphenate(name) !== camelize(name)) {
                addHandler(
                  el,
                  `update:${hyphenate(name)}`,
                  syncGen,
                  null,
                  false,
                  warn,
                  list[i]
                )
              }
            } else {
              // handler w/ dynamic event name
              addHandler(
                el,
                `"update:"+(${name})`,
                syncGen,
                null,
                false,
                warn,
                list[i],
                true // dynamic
              )
            }
          }
        }
        if ((modifiers && modifiers.prop) || (
          !el.component && platformMustUseProp(el.tag, el.attrsMap.type, name)
        )) {
          addProp(el, name, value, list[i], isDynamic)
        } else {
          addAttr(el, name, value, list[i], isDynamic)
        }
      } else if (onRE.test(name)) { // v-on
        name = name.replace(onRE, '')
        isDynamic = dynamicArgRE.test(name)
        if (isDynamic) {
          name = name.slice(1, -1)
        }
        addHandler(el, name, value, modifiers, false, warn, list[i], isDynamic)
      } else { // normal directives
        name = name.replace(dirRE, '')
        // parse arg
        const argMatch = name.match(argRE)
        let arg = argMatch && argMatch[1]
        isDynamic = false
        if (arg) {
          name = name.slice(0, -(arg.length + 1))
          if (dynamicArgRE.test(arg)) {
            arg = arg.slice(1, -1)
            isDynamic = true
          }
        }
        addDirective(el, name, rawName, value, arg, isDynamic, modifiers, list[i])
        if (process.env.NODE_ENV !== 'production' && name === 'model') {
          checkForAliasModel(el, value)
        }
      }
    } else {
      // literal attribute
      if (process.env.NODE_ENV !== 'production') {
        const res = parseText(value, delimiters)
        if (res) {
          warn(
            `${name}="${value}": ` +
            'Interpolation inside attributes has been removed. ' +
            'Use v-bind or the colon shorthand instead. For example, ' +
            'instead of <div id="{{ val }}">, use <div :id="val">.',
            list[i]
          )
        }
      }
      addAttr(el, name, JSON.stringify(value), list[i])
      // #6887 firefox doesn't update muted state if set via attribute
      // even immediately after element creation
      if (!el.component &&
          name === 'muted' &&
          platformMustUseProp(el.tag, el.attrsMap.type, name)) {
        addProp(el, name, 'true', list[i])
      }
    }
  }
}

function checkInFor (el: ASTElement): boolean {
  let parent = el
  while (parent) {
    if (parent.for !== undefined) {
      return true
    }
    parent = parent.parent
  }
  return false
}

function parseModifiers (name: string): Object | void {
  const match = name.match(modifierRE)
  if (match) {
    const ret = {}
    match.forEach(m => { ret[m.slice(1)] = true })
    return ret
  }
}

function makeAttrsMap (attrs: Array<Object>): Object {
  const map = {}
  for (let i = 0, l = attrs.length; i < l; i++) {
    if (
      process.env.NODE_ENV !== 'production' &&
      map[attrs[i].name] && !isIE && !isEdge
    ) {
      warn('duplicate attribute: ' + attrs[i].name, attrs[i])
    }
    map[attrs[i].name] = attrs[i].value
  }
  return map
}

// for script (e.g. type="x/template") or style, do not decode content (对于脚本（例如type=“x/template”）或样式，不解码内容)
function isTextTag (el): boolean {
  return el.tag === 'script' || el.tag === 'style'
}

/**
 * 
 * @description style，script 都是在禁止名单中,但通过isForbiddenTag 也发现一个彩蛋。
    <script type="text/x-template" id="hello-world-template">
      <p>Hello hello hello</p>
    </script>
    当定义模板的方式如上，在 <script> 元素上添加 type="text/x-template" 属性。 此时的script不会被禁止。
 */
function isForbiddenTag (el): boolean {
  return (
    el.tag === 'style' ||
    (el.tag === 'script' && (
      !el.attrsMap.type ||
      el.attrsMap.type === 'text/javascript'
    ))
  )
}

const ieNSBug = /^xmlns:NS\d+/
const ieNSPrefix = /^NS\d+:/

// 处理IE SVG相关bug,修改NS1:xmlns:feature属性并移除xmlns:NS1="" 属性的
/* istanbul ignore next */
function guardIESVGBug (attrs) {
  const res = []
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i]
    if (!ieNSBug.test(attr.name)) {
      attr.name = attr.name.replace(ieNSPrefix, '')
      res.push(attr)
    }
  }
  return res
}

function checkForAliasModel (el, value) {
  let _el = el
  while (_el) {
    if (_el.for && _el.alias === value) {
      warn(
        `<${el.tag} v-model="${value}">: ` +
        `You are binding v-model directly to a v-for iteration alias. ` +
        `This will not be able to modify the v-for source array because ` +
        `writing to the alias is like modifying a function local variable. ` +
        `Consider using an array of objects and use v-model on an object property instead.`,
        el.rawAttrsMap['v-model']
      )
    }
    _el = _el.parent
  }
}
