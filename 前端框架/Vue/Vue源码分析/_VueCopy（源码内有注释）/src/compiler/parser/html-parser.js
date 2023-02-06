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
        const endTagMatch = html.match(endTag)
        if (endTagMatch) {
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
  // parse 开始标签
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
      while (!(end = html.match(startTagClose)) && (attr = html.match(dynamicArgAttribute) || html.match(attribute))) {
        attr.start = index
        advance(attr[0].length)
        attr.end = index
        match.attrs.push(attr)
      }
      if (end) {
        match.unarySlash = end[1]
        advance(end[0].length)
        match.end = index
        return match
      }
    }
  }
  // 处理 parseStartTag 的结果
  function handleStartTag (match) {
    const tagName = match.tagName
    const unarySlash = match.unarySlash

    if (expectHTML) {
      if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
        parseEndTag(lastTag)
      }
      if (canBeLeftOpenTag(tagName) && lastTag === tagName) {
        parseEndTag(tagName)
      }
    }

    const unary = isUnaryTag(tagName) || !!unarySlash

    const l = match.attrs.length
    const attrs = new Array(l)
    for (let i = 0; i < l; i++) {
      const args = match.attrs[i]
      const value = args[3] || args[4] || args[5] || ''
      const shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
        ? options.shouldDecodeNewlinesForHref
        : options.shouldDecodeNewlines
      attrs[i] = {
        name: args[1],
        value: decodeAttr(value, shouldDecodeNewlines)
      }
      if (process.env.NODE_ENV !== 'production' && options.outputSourceRange) {
        attrs[i].start = args.start + args[0].match(/^\s*/).length
        attrs[i].end = args.end
      }
    }

    if (!unary) {
      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs, start: match.start, end: match.end })
      lastTag = tagName
    }

    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end)
    }
  }
  // parse 结束标签
  function parseEndTag (tagName, start, end) {
    let pos, lowerCasedTagName
    if (start == null) start = index
    if (end == null) end = index

    // Find the closest opened tag of the same type
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
      // Close all the open elements, up the stack
      for (let i = stack.length - 1; i >= pos; i--) {
        if (process.env.NODE_ENV !== 'production' &&
          (i > pos || !tagName) &&
          options.warn
        ) {
          options.warn(
            `tag <${stack[i].tag}> has no matching end tag.`,
            { start: stack[i].start, end: stack[i].end }
          )
        }
        if (options.end) {
          options.end(stack[i].tag, start, end)
        }
      }

      // Remove the open elements from the stack
      stack.length = pos
      lastTag = pos && stack[pos - 1].tag
    } else if (lowerCasedTagName === 'br') {
      if (options.start) {
        options.start(tagName, [], true, start, end)
      }
    } else if (lowerCasedTagName === 'p') {
      if (options.start) {
        options.start(tagName, [], false, start, end)
      }
      if (options.end) {
        options.end(tagName, start, end)
      }
    }
  }
}
