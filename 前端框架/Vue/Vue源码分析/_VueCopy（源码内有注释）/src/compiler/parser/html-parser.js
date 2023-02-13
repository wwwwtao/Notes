/**
 * Not type-checking this file because it's mostly vendor code.
 */

/*!
 * HTML Parser By John Resig (ejohn.org)
 * Modified by Juriy "kangax" Zaytsev
 * Original code by Erik Arvidsson (MPL-1.1 OR Apache-2.0 OR GPL-2.0-or-later)
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 */

import { makeMap, no } from 'shared/util'
import { isNonPhrasingTag } from 'web/compiler/util'
import { unicodeRegExp } from 'core/util/lang'

// Regular Expressions for parsing tags and attributes 用于分析标记和属性的正则表达式
/**
 * attribute顾名思义，这个正则的作用是用来匹配标签的属性(attributes)的。
    代码: ([^\s"'<>\/=]+)
    需要理解：[^xyz] 反向字符集
    代码: (?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?
    需要理解： (?:"([^"]*)"+ 匹配双引号 例如：id=“app”
    需要理解：'([^']*)'+ 匹配单引号 例如：id=‘app’
    需要理解：([^\s"'=<>`]+ 匹配不跟引号的情况 例： name=name
 */
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/

// 识别合法的xml标签
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`
// 这里通过字符串来拼接正则模式让代码更具有复用性
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
// 匹配开始标签 <div></div>的话会匹配到 <div
const startTagOpen = new RegExp(`^<${qnameCapture}`)
// 检测标签是否为单标签 。 例如：<img / > 此处需结合源码上下文分析。
const startTagClose = /^\s*(\/?)>/
// 匹配结束标签
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
// 匹配<!DOCTYPE> 声明标签
const doctype = /^<!DOCTYPE [^>]+>/i

// #7298: escape - to avoid being passed as HTML comment when inlined in page (escape-避免在页面中内联时作为HTML注释传递)
// 匹配注释
const comment = /^<!\--/
// 匹配条件注释
const conditionalComment = /^<!\[/

// Special Elements (can contain anything)
export const isPlainTextElement = makeMap('script,style,textarea', true)
const reCache = {}

const decodingMap = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&amp;': '&',
  '&#10;': '\n',
  '&#9;': '\t',
  '&#39;': "'"
}
const encodedAttr = /&(?:lt|gt|quot|amp|#39);/g
const encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#39|#10|#9);/g

// #5992
const isIgnoreNewlineTag = makeMap('pre,textarea', true)
const shouldIgnoreFirstNewline = (tag, html) => tag && isIgnoreNewlineTag(tag) && html[0] === '\n'

function decodeAttr (value, shouldDecodeNewlines) {
  const re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr
  return value.replace(re, match => decodingMap[match])
}

/**
 * 
 * @param {*} html  是要被编译的字符串
 * @param {*} options  编译器所需的选项
 */
export function parseHTML (html, options) {

  /**
   * 第一个变量是 stack，它被初始化为一个空数组，在 while 循环中处理 html 字符流的时候每当遇到一个非单标签，都会将该开始标签 push 到该数组。
     它的作用模板中 DOM 结构规范性的检测。
     第二个变量是 expectHTML，它的值被初始化为 options.expectHTML，也就是编译器选项中的 expectHTML。
     第三个常量是 isUnaryTag，用来检测一个标签是否是一元标签。
     第四个常量是 canBeLeftOpenTag，用来检测一个标签是否是可以省略闭合标签的非一元标签。
     index 初始化为 0 ，标识着当前字符流的读入位置。
     last 存储剩余还未编译的 html 字符串。
     lastTag 始终存储着位于 stack 栈顶的元素。
   */
  const stack = []
  const expectHTML = options.expectHTML
  const isUnaryTag = options.isUnaryTag || no
  const canBeLeftOpenTag = options.canBeLeftOpenTag || no
  let index = 0
  let last, lastTag

  // 开启一个 while 循环，循环结束的条件是 html 为空，即 html 被 parse 完毕
  while (html) {
    /*
      首先将在每次循环开始时将 html 的值赋给变量 last 
      为什么这么做？在 while 循环即将结束的时候，有一个对 last 和 html 这两个变量的比较，在此可以找到答案：
      if (html === last) {}
      如果两者相等，则说明html 在经历循环体的代码之后没有任何改变，此时会"Mal-formatted tag at end of template: \"" + html + "\"" 错误信息提示。
    */
    last = html

    // Make sure we're not in a plaintext content element like script/style(确保我们不在像脚本/样式这样的纯文本内容元素中)
    /**
     * lastTag 刚刚讲到它会一直存储 stack 栈顶的元素，但是当编译器刚开始工作时，他只是一个空数组对象，![] == false
       isPlainTextElement(lastTag) 检测 lastTag 是否为纯标签内容。 (检测 lastTag 是否等于 'script','style','textarea')
     */
    if (!lastTag || !isPlainTextElement(lastTag)) {
      let textEnd = html.indexOf('<')
      if (textEnd === 0) { // 第一个字符就是(<)尖括号
        // Comment: 如果是注释节点
        if (comment.test(html)) {
          const commentEnd = html.indexOf('-->')

          if (commentEnd >= 0) {
            if (options.shouldKeepComment) {
              options.comment(html.substring(4, commentEnd), index, index + commentEnd + 3)
            }
            advance(commentEnd + 3)
            continue
          }
        }

        // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
        // 如果是条件注释节点
        if (conditionalComment.test(html)) {
          const conditionalEnd = html.indexOf(']>')

          if (conditionalEnd >= 0) {
            advance(conditionalEnd + 2)
            continue
          }
        }

        // 如果是 Doctyp节点 
        const doctypeMatch = html.match(doctype)
        if (doctypeMatch) {
          advance(doctypeMatch[0].length)
          continue
        }

        // End tag:  结束标签
        /**
         *  首先调用 html 字符串的 match 函数匹配正则 endTag ，将结果保存在常量endTagMatch中。
            正则 endTag 用来匹配结束标签，并且拥有一个捕获组用来捕获标签名字，比如有如下html 字符串：<div></div>
            endTagMatch 输出如下：
            endTagMatch = [
              '</div>',
              'div'
            ]
            第一个元素是整个匹配到的结束标签字符串，第二个元素是对应的标签名字。
         */
        const endTagMatch = html.match(endTag)
        if (endTagMatch) {
          /**
           * 首先使用 curIndex 常量存储当前 index 的值，然后调用 advance 函数，并以 endTagMatch[0].length 作为参数，
           * 接着调用了 parseEndTag 函数对结束标签进行解析，传递给 parseEndTag 函数的三个参数分别是：**标签名**以及**结束标签在 html 字符串中起始和结束的位置**，最后调用 continue 语句结束此次循环。
           */
          const curIndex = index
          advance(endTagMatch[0].length)
          parseEndTag(endTagMatch[1], curIndex, index)
          continue
        }

        // Start tag: 开始标签
        const startTagMatch = parseStartTag()
        if (startTagMatch) { // 如果有返回值，说明开始标签解析成功
          handleStartTag(startTagMatch)
          if (shouldIgnoreFirstNewline(startTagMatch.tagName, html)) {
            advance(1)
          }
          continue
        }
      }

      let text, rest, next
      if (textEnd >= 0) { //第一个字符不是(<)尖括号
        rest = html.slice(textEnd)
        while (
          !endTag.test(rest) &&
          !startTagOpen.test(rest) &&
          !comment.test(rest) &&
          !conditionalComment.test(rest)
        ) {
          // < in plain text, be forgiving and treat it as text
          next = rest.indexOf('<', 1)
          if (next < 0) break
          textEnd += next
          rest = html.slice(textEnd)
        }
        text = html.substring(0, textEnd)
      }

      if (textEnd < 0) { // 第一个字符不是(<)尖括号
        text = html
      }

      if (text) {
        advance(text.length)
      }

      if (options.chars && text) {
        options.chars(text, index - text.length, index)
      }
    } else {  // parse 的内容是在纯文本标签里 (script,style,textarea)
      let endTagLength = 0
      const stackedTag = lastTag.toLowerCase()
      const reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'))
      const rest = html.replace(reStackedTag, function (all, text, endTag) {
        endTagLength = endTag.length
        if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
          text = text
            .replace(/<!\--([\s\S]*?)-->/g, '$1') // #7298
            .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1')
        }
        if (shouldIgnoreFirstNewline(stackedTag, text)) {
          text = text.slice(1)
        }
        if (options.chars) {
          options.chars(text)
        }
        return ''
      })
      index += html.length - rest.length
      html = rest
      parseEndTag(stackedTag, index - endTagLength, index)
    }

    // 如果两者相等，则说明html 在经历循环体的代码之后没有任何改变
    if (html === last) {
      options.chars && options.chars(html)
      if (process.env.NODE_ENV !== 'production' && !stack.length && options.warn) {
        options.warn(`Mal-formatted tag at end of template: "${html}"`, { start: index + html.length })
      }
      break
    }
  }

  // Clean up any remaining tags(清除所有剩余的标签)
  parseEndTag()

  function advance (n) {
    index += n // 当前字符流的读入位置
    html = html.substring(n)
  }
  
  /**
   * parse 开始标签
   * @returns 只有当变量end存在时，即能够确定确实解析到了一个开始标签的时候 parseStartTag 函数才会有返回值，并且返回值是match对象，其他情况下 parseStartTag 全部返回undefined。
   *  
   *  假设有如下html（template）字符串：<div id="box" v-if="watings"></div>
      则 parseStartTag 函数的返回值如下：
      match = {
        tagName: 'div',
        attrs: [
          [
            'id="box"',
            'id',
            '=',
            'box',
            undefined,
            undefined
          ],
          [
            ' v-if="watings"',
            'v-if',
            '=',
            'watings',
            undefined,
            undefined
          ]
        ],
        start: index,
        unarySlash: undefined,
        end: index
      }
   */
  function parseStartTag () {
    /**
     * 如果匹配成功，那么start 将是一个包含两个元素的数组：第一个元素是标签的开始部分(包含< 和 标签名称)；第二个元素是捕获组捕获到的标签名称。
       比如有如下template：<div></div>
       start为：start = ['<div', 'div']
     */
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1], // 它的值为 start[1] 即标签的名称。
        attrs: [], // 这个数组就是用来存储将来被匹配到的属性
        start: index // 初始值为 index，是当前字符流读入位置在整个 html 字符串中的相对位置。
      }
      advance(start[0].length) // 在源字符中截取已经编译完成的字符

      
      let end, attr
      /**
       *  第一个条件是：没有匹配到开始标签的结束部分，这个条件的实现方式主要使用了 startTagClose 正则，并将结果保存到 end 变量中。
          第二个条件是：匹配到了属性，主要使用了attribute正则。
          总结下这个while循环成立要素：没有匹配到开始标签的结束部分，并且匹配到了开始标签中的属性，这个时候循环体将被执行，直到遇到开始标签的结束部分为止。
          接下来在循环体内做了两件事，首先调用advance函数，参数为attr[0].length即整个属性的长度。然后会将此次循环匹配到的结果push到前面定义的match对象的attrs数组中。
       */
      while (!(end = html.match(startTagClose)) && (attr = html.match(dynamicArgAttribute) || html.match(attribute))) {
        attr.start = index
        advance(attr[0].length)
        attr.end = index
        match.attrs.push(attr)
      }
      if (end) {  // 只有当变量end存在，即匹配到了开始标签的结束部分时，才能说明这是一个完整的开始标签
        match.unarySlash = end[1] // 如果end[1]不为undefined，那么说明该标签是一个一元标签（一元斜杠） ‘/’
        advance(end[0].length)
        match.end = index
        return match
      }
    }
  }
  // 处理 parseStartTag 的结果
  function handleStartTag (match) {
    const tagName = match.tagName // div 之类的
    const unarySlash = match.unarySlash // 如果end[1]不为undefined，那么说明该标签是一个一元标签（一元斜杠） ‘/’

    if (expectHTML) {
      /** 
       *  这里想表达的意思是：最近一次遇到的开始标签是 p 标签，并且当前正在解析的开始标签必须不能是段落式内容(Phrasing content)模型，这时候 if 语句块的代码才会执行，即调用parseEndTag(lastTag)。
          首先大家要知道每一个 html 元素都拥有一个或多个内容模型(content model)，其中p 标签本身的内容模型是流式内容(Flow content)，并且 p 标签的特性是只允许包含段落式内容(Phrasing content)。
          所以条件成立的情况如下：<p><h1></h1></p>
          在解析上面这段 html 字符串的时候，首先遇到p标签的开始标签，此时lastTag被设置为 p ，紧接着会遇到 h1 标签的开始标签，由于 h2 标签的内容模型属于非段落式内容(Phrasing content)模型，所以会立即调用 parseEndTag(lastTag) 函数闭合 p 标签，此时由于强行插入了</p> 标签，所以解析后的字符串将变为如下内容：
          <p></p><h2></h2></p>
          接着，继续解析该字符串，会遇到 <h2></h2> 标签并正常解析之，最后解析器会遇到一个单独的p 标签的结束标签，即：</p>。这个时候就回到了我们前面讲过的，当解析器遇到 p 标签或者 br 标签的结束标签时会补全他们，最终<p><h2></h2></p> 这段 html 字符串将被解析为：
          <p></p><h2></h2><p></p>
          而这也就是浏览器的行为，以上是第一个if 分支的意义
       */
      if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
        parseEndTag(lastTag)
      }
      /**
       *  第二个if分支，它的条件如下：
          canBeLeftOpenTag(tagName) && lastTag === tagName
          以上条件成立的意思是：当前正在解析的标签是一个可以省略结束标签的标签，并且与上一次解析到的开始标签相同，如下：
          <p>max
          <p>kaixin
          p 标签是可以省略结束标签的标签，所以当解析到一个p标签的开始标签并且下一次遇到的标签也是p标签的开始标签时，会立即关闭第二个p标签。即调用：parseEndTag(tagName) 函数，然后由于第一个p标签缺少闭合标签所以会Vue会给你一个警告。
       */
      if (canBeLeftOpenTag(tagName) && lastTag === tagName) {
        parseEndTag(tagName)
      }
    }

    // 变量 unary 是一个布尔值，当它为真时代表着标签是一元标签，否则是二元标签。他们通过isUnaryTag来判断，其原理通过传递的标签名判断是否有跟预设标准HTML中规定的那些一元标签一致。
    const unary = isUnaryTag(tagName) || !!unarySlash

    // l 和 attrs
    // 常量 l 的值存储着 match.attrs 数组的长度
    // attrs 常量则是一个与match.attrs数组长度相等的数组。
    const l = match.attrs.length
    const attrs = new Array(l)
    for (let i = 0; i < l; i++) {
      /**
       *  首先定义 args 常量，它的值就是每个属性的解析结果，即match.attrs 数组中的元素对象。
          变量 value 中就保存着最终的属性值，如果第4、5、6 项都没有获取到属性值，那么属性值将被设置为一个空字符串
       */
      const args = match.attrs[i]
      const value = args[3] || args[4] || args[5] || ''
      const shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
        ? options.shouldDecodeNewlinesForHref
        : options.shouldDecodeNewlines
      attrs[i] = {
        name: args[1],
        value: decodeAttr(value, shouldDecodeNewlines) // decodeAttr 函数的作用是对属性值中所包含的 html 实体进行解码，将其转换为实体对应的字符
      }
      if (process.env.NODE_ENV !== 'production' && options.outputSourceRange) {
        attrs[i].start = args.start + args[0].match(/^\s*/).length
        attrs[i].end = args.end
      }
    }

    /**
     * 这个if条件是当开始标签是非一元标签时才会执行，其目的是: 如果开始标签是非一元标签，则将该开始标签的信息入栈，即push到stack数组中，并将lastTag的值设置为该标签名。
       在讲解 parseHTML 函数开头定义的变量和常量的过程中，我们讲解过 stack 常量以及lastTag 变量，其目的是将来判断是否缺少闭合标签，并且现在大家应该知道为什么 lastTag 所存储的标签名字始终保存着 stack 栈顶的元素了。
     */
    if (!unary) {
      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs, start: match.start, end: match.end })
      lastTag = tagName
    }

    /**
     * 如果 parser 选项中包含 options.start 函数，则调用之，并将开始标签的名字 tagName ，格式化后的属性数组 attrs ，是否为一元标签 unary ，以及开始标签在原 html 中的开始和结束位置match.start 和 match.end 作为参数传递。
     */
    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end)
    }
  }
  // parse 结束标签
  /**
   * 
   * @param {*} tagName 标签名
   * @param {*} start   结束标签在 html 字符串中起始位置
   * @param {*} end     结束标签在 html 字符串中结束的位置
   *  parseEndTag函数还会做一件事儿，如果你感兴趣你可以在任何html文件中写下如下内容：
        <body>
          </br>
          </p>
        </body>
      上面的html片段中，我们分别写了</br>、</p>的结束标签，但注意我们并没有写起始标签，然后浏览器是能够正常解析他们的，
      其中 </br> 标签被正常解析为 <br> 标签，而</p>标签被正常解析为 <p></p> 。
      除了 br 与 p 其他任何标签如果你只写了结束标签那么浏览器都将会忽略。所以为了与浏览器的行为相同，parseEndTag 函数也需要专门处理br与p的结束标签，即：</br> 和</p>。

      总结下parseEndTag 函数的作用：
        1. 检测是否缺少闭合标签
        2. 处理 stack 栈中剩余的标签
        3. 解析</br> 与标签，与浏览器的行为相同
      当一个函数拥有两个及以上功能的时候，最常用的技巧就是通过参数进行控制，还记得jQuery中的Access 吗？parseEndTag 函数接收三个参数，这三个参数其实都是可选的，根据传参的不同其功能也不同。
        第一种是处理普通的结束标签，此时三个参数都传递
        第二种是只传递第一个参数
        第三种是不传递参数，处理 stack 栈剩余未处理的标签。
   */
  function parseEndTag (tagName, start, end) {
    /**
     * 定了两个变量：pos和 lowerCasedTagName，其中变量 pos 会在后面用于判断 html 字符串是否缺少结束标签，lowerCasedTagName 变量用来存储 tagName 的小写版。
     * 接着是两句if 语句，当 start 和 end 不存在时，将这两个变量的值设置为当前字符流的读入位置，即index。所以当我们看到这两个 if 语句时，我们就应该能够想到：parseEndTag 函数的第二个参数和第三个参数都是可选的。
     * 其实这种使用 parseEndTag 函数的方式我们在 handleStartTag 函数中见过，当时我们没有对其进行讲解一起来回顾下
     */
    let pos, lowerCasedTagName
    if (start == null) start = index
    if (end == null) end = index

    // Find the closest opened tag of the same type (查找同一类型的最近打开的标记)
    /**
     * 如果tagName存在，lowerCasedTagName 获取的是 tagName 小写之后的值，接下来开启一个 for 循环从后向前遍历 stack 栈，直到找到相应的位置，并且该位置索引会保存到 pos 变量中，如果 tagName 不存在，则直接将 pos 设置为 0 。
     */
    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase()
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          break
        }
      }
    } else {
      // If no tag name is provided, clean shop
      pos = 0
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack (关闭所有打开的元素，向上堆叠)
      /**
       * 首先我们查看 if 语句块，当 pos >= 0 的时候就会走 if 语句块。在 if 语句块内开启一个 for 循环，同样是从后向前遍历 stack 数组，如果发现 stack 数组中存在索引大于 pos 的元素，那么该元素一定是缺少闭合标签的，这个时候如果是在非生产环境那么 Vue 便会打印一句警告，告诉你缺少闭合标签。除了打印一句警告之外，随后会调用 options.end(stack[i].tag, start, end) 立即将其闭合，这是为了保证解析结果的正确性。
       */
      for (let i = stack.length - 1; i >= pos; i--) {
        if (process.env.NODE_ENV !== 'production' &&
          (i > pos || !tagName) &&
          options.warn
        ) {
          options.warn(
            `tag <${stack[i].tag}> has no matching end tag.`, // 标记＜${stack[i].tag｝＞没有匹配的结束标记
            { start: stack[i].start, end: stack[i].end }
          )
        }
        if (options.end) {
          options.end(stack[i].tag, start, end)
        }
      }

      // Remove the open elements from the stack (从堆栈中移除打开的元素)
      // 最后更新 stack 栈以及 lastTag
      stack.length = pos
      lastTag = pos && stack[pos - 1].tag
    } 
    /**
     *  这两个else if 什么情况下成立呢?
         - 当 tagName 没有在 stack 栈中找到对应的开始标签时，pos 为 -1 。
         - tagName为br 、p标签。
        当你写了 br 标签的结束标签：</br> 或 p 标签的结束标签 </p> 时，解析器能够正常解析他们，其中对于 </br> 会将其解析为正常的 <br> 标签，而 </p> 标签也会正常解析为<p></p>。
        可以发现对于 </br> 和 </p> 标签浏览器可以将其正常解析为 <br> 以及<p></p>，Vue 的 parser 与浏览器的行为是一致的。
     */
    else if (lowerCasedTagName === 'br') {
      if (options.start) {
        options.start(tagName, [], true, start, end)
      }
    } 
    else if (lowerCasedTagName === 'p') {
      if (options.start) {
        options.start(tagName, [], false, start, end)
      }
      if (options.end) {
        options.end(tagName, start, end)
      }
    }
  }
}
