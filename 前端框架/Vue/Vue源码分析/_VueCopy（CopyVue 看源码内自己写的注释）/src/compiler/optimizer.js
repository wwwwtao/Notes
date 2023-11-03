/* @flow */

import {
  makeMap,
  isBuiltInTag,
  cached,
  no

} from 'shared/util'

let isStaticKey
let isPlatformReservedTag

const genStaticKeysCached = cached(genStaticKeys)

/**
 * Goal of the optimizer: walk the generated template AST tree 
 * and detect sub-trees that are purely static, i.e. parts of 
 * the DOM that never needs to change. 
 *
 * Once we detect these sub-trees, we can:
 *
 * 1. Hoist them into constants, so that we no longer need to
 *    create fresh nodes for them on each re-render;
 * 2. Completely skip them in the patching process.
 */
/**
 *优化器的目标：遍历生成的模板AST树
 *并检测纯静态的子树，即
 *无需更改的DOM。
 *
 *一旦我们检测到这些子树，我们就可以：
 *
 * 1. 将它们提升为常量，这样我们就不再需要
 *在每次重新渲染时为它们创建新节点；
 * 2. 在修补过程中完全跳过它们。
 */

export function optimize(root: ? ASTElement, options : CompilerOptions) {

  if (!root) return
  // isStaticKey 获取 genStaticKeysCached函数返回值, 获取 makeMap (点此查看) 函数返回值引用
  isStaticKey = genStaticKeysCached(options.staticKeys || '')

  // isPlatformReservedTag 获取编译器选项 isReservedTag 的引用，检查给定的字符是否是保留的标签。
  isPlatformReservedTag = options.isReservedTag || no

  // first pass: mark all non-static nodes. 第一遍：标记静态节点？ 标记非静态节点？
  markStatic(root)
  // second pass: mark static roots. 第二遍：标注静态根节点
  markStaticRoots(root, false)
}
// 经过optimize后，AST 树变成了如下
// 我们发现每一个 AST 元素节点都多了 staic 属性，并且type为 1 的普通元素 AST 节点多了staticRoot属性
ast = {
  'type': 1,
  'tag': 'ul',
  'attrsList': [],
  'attrsMap': {
    ':class': 'bindCls',
    'class': 'list',
    'v-if': 'isShow'
  },
  'if': 'isShow',
  'ifConditions': [{
    'exp': 'isShow',
    'block': // ul ast element
  }],
  'parent': undefined,
  'plain': false,
  'staticClass': 'list',
  'classBinding': 'bindCls',
  'static': false,
  'staticRoot': false,
  'children': [{
    'type': 1,
    'tag': 'li',
    'attrsList': [{
      'name': '@click',
      'value': 'clickItem(index)'
    }],
    'attrsMap': {
      '@click': 'clickItem(index)',
      'v-for': '(item,index) in data'
    },
    'parent': // ul ast element
      'plain': false,
    'events': {
      'click': {
        'value': 'clickItem(index)'
      }
    },
    'hasBindings': true,
    'for': 'data',
    'alias': 'item',
    'iterator1': 'index',
    'static': false,
    'staticRoot': false,
    'children': ['type': 2, 'expression': '_s(item)+":"+_s(index)'
      'text': '{{item}}:{{index}}', 'tokens': [{
        '@binding': 'item'
      }, ':', {
        '@binding': 'index'
      }], 'static': false
    ]
  }]
}

function genStaticKeys(keys: string): Function {
  return makeMap(
    'type,tag,attrsList,attrsMap,plain,parent,children,attrs,start,end,rawAttrsMap' +
    (keys ? ',' + keys : '')
  )
}

/**
 * 
 * @param {*} node
 * @description  标记静态节点
 * @returns 
 */
function markStatic(node: ASTNode) {
  node.static = isStatic(node) // 在这给元素描述对象(AST) 扩展了static属性，通过isStatic方法调用后返回值，确认哪些节点是静态的，哪些是动态的。
  if (node.type === 1) { // 判断node.type值为1，对标签节点进行处理。

    /**
     * 如果遇到特殊情况会直接退出去。
     * 当遇到了非平台保留标签 isPlatformReservedTag(node.tag)， 
     * 并且标签节点是 slot，
     * 并且节点中有inline-template（内联模板）三者都满足此时会终止函数的执行。
     *  */
    // do not make component slot content static. this avoids 不要使component slot内容静态。这样可以避免
    // 1. components not able to mutate slot nodes 1. 组件无法更改插槽节点
    // 2. static slot content fails for hot-reloading 2. 静态插槽内容无法进行热重新加载
    if (
      !isPlatformReservedTag(node.tag) &&
      node.tag !== 'slot' &&
      node.attrsMap['inline-template'] == null
    ) {
      return
    }

    // 通过 node.children 找到子节点，递归子节点。
    for (let i = 0, l = node.children.length; i < l; i++) {
      const child = node.children[i]
      markStatic(child)

      // 子节点非静态，该节点也标注非静态。这块设计的不太合理有更多好的优化方案，在Vue3.0中增加了"动静分离的策略" 尤大称之为 Block tree 后续在跟大家掰扯。
      if (!child.static) {
        node.static = false
      }
    }

    /**
     * 如果节点的ifConditions不为空，则遍历ifConditions拿到所有条件中的block，也就是它们对应的 AST 节点，递归执行markStatic。
     * 在这些递归过程中，一旦子节点有不是static的情况，则它的父节点的static均变成 false。
     */
    if (node.ifConditions) {
      for (let i = 1, l = node.ifConditions.length; i < l; i++) {
        const block = node.ifConditions[i].block
        markStatic(block)
        if (!block.static) {
          node.static = false
        }
      }
    }
  }
}

/**
 * 
 * @param {*} node 
 * @param {*} isInFor 
 * @description  标记静态根
 * @returns 
 */
function markStaticRoots(node: ASTNode, isInFor: boolean) {
  if (node.type === 1) {
    if (node.static || node.once) {
      node.staticInFor = isInFor // 对于已经是static的节点或者是v-once指令的节点，node.staticInFor = isInFor
    }
    // For a node to qualify as a static root, it should have children that 一个节点要成为根节点，那么要满足以下条件：
    // are not just static text. Otherwise the cost of hoisting out will 1、静态节点，并且有子节点
    // outweigh the benefits and it's better off to just always render it fresh. 2、子节点不能仅为一个文本节点
    if (node.static && node.children.length && !(
        node.children.length === 1 &&
        node.children[0].type === 3
      )) {
      node.staticRoot = true
      return
    } else {
      node.staticRoot = false
    }

    // 接下来递归循环其子节点，循环标记
    if (node.children) {
      for (let i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for)
      }
    }
    if (node.ifConditions) {
      for (let i = 1, l = node.ifConditions.length; i < l; i++) {
        markStaticRoots(node.ifConditions[i].block, isInFor)
      }
    }
  }
}

/**
 * 
 * isStatic 是对一个 AST 元素节点是否是静态的判断，如果是表达式，就是非静态；
 * 如果是纯文本，就是静态；
 * 
 * 对于一个普通元素，如果有 pre 属性，那么它使用了v-pre指令，是静态，
 * 否则要同时满足以下条件：没有使用v-if、v-for，没有使用其它指令（不包括v-once），非内置组件，是平台保留的标签，非带有v-for的template标签的直接子节点，节点的所有属性的key都满足静态 key；
 * 这些都满足则这个 AST 节点是一个静态节点。
 */
function isStatic(node: ASTNode): boolean {
  // 如果是表达式，就是非静态；
  if (node.type === 2) { // expression 表达式
    return false
  }
  // 如果是纯文本，就是静态；
  if (node.type === 3) { // text
    return true
  }

  // 这些都满足则这个 AST 节点是一个静态节点。 
  return !!(node.pre || (
    !node.hasBindings && // no dynamic bindings 无动态绑定
    !node.if && !node.for && // not v-if or v-for or v-else 没有 v-if 和 v-for 指令
    !isBuiltInTag(node.tag) && // not a built-in 不是内置的标签
    isPlatformReservedTag(node.tag) && // not a component 是平台保留标签(html和svg标签)
    !isDirectChildOfTemplateFor(node) && // 不是 template 标签的直接子元素并且没有包含在 for 循环中
    Object.keys(node).every(isStaticKey) // 结点包含的属性只能有isStaticKey中指定的几个
  ))
}

function isDirectChildOfTemplateFor(node: ASTElement): boolean {
  while (node.parent) {
    node = node.parent
    if (node.tag !== 'template') {
      return false
    }
    if (node.for) {
      return true
    }
  }
  return false
}