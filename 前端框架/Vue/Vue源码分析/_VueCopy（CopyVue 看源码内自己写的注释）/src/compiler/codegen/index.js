/* @flow */

import { genHandlers } from './events'
import baseDirectives from '../directives/index'
import { camelize, no, extend } from 'shared/util'
import { baseWarn, pluckModuleFunction } from '../helpers'
import { emptySlotScopeToken } from '../parser/index'

type TransformFunction = (el: ASTElement, code: string) => string;
type DataGenFunction = (el: ASTElement) => string;
type DirectiveFunction = (el: ASTElement, dir: ASTDirective, warn: Function) => boolean;

export class CodegenState {
  options: CompilerOptions;
  warn: Function;
  transforms: Array<TransformFunction>;
  dataGenFns: Array<DataGenFunction>;
  directives: { [key: string]: DirectiveFunction };
  maybeComponent: (el: ASTElement) => boolean;
  onceId: number;
  staticRenderFns: Array<string>;
  pre: boolean;

  constructor (options: CompilerOptions) {
    this.options = options
    this.warn = options.warn || baseWarn
    this.transforms = pluckModuleFunction(options.modules, 'transformCode')
    this.dataGenFns = pluckModuleFunction(options.modules, 'genData')
    // directives属性是一个包括如下字段的对象， v-bind、v-model、v-text、v-html、v-on、内置指令对应 处理函数。
    this.directives = extend(extend({}, baseDirectives), options.directives)
    const isReservedTag = options.isReservedTag || no
    // maybeComponent 检测元素是否为组件。
    this.maybeComponent = (el: ASTElement) => !!el.component || !isReservedTag(el.tag)
    this.onceId = 0
    // staticRenderFns 存放静态根节点的render 函数。
    this.staticRenderFns = []

    // pre 属性是一个布尔值，它的真假代表着标签是否使用了 v-pre 指令默认 false。
    this.pre = false
  }
}

export type CodegenResult = {
  render: string,
  staticRenderFns: Array<string>
};
/**
 * 
 * @param {*} ast 
 * 参数 ast 根据 template 生成的描述对象,假设有如下模板。
    <div id="app">{{message}}</div>
    var vm = new Vue({
      el: "#app",
      data: {
        message: "this is test text"
      }
    })
    所生成的AST如下：
    {
      type: 1,
      tag: "div",
      attrs: [{
        name: "id",
        value: "app",
      }],
      attrsList: [{
        name: "id",
        value: "app"
      }],
      attrsMap: {
        id: "app"
      },
      children: [{
        type: 2,
        expression: "_s(message)",
        token: [{
          "@binding": "message"
        }],
        text: "{{message}}",
        static: false
      }],
      parent: undefined,
      plain: false,
      static: false,
      staticRoot: false
    }
 * @param {*} options 
 * 参数 options 包含编译器在运作的时候所需的配置选项。
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
 * @returns 
 */
export function generate (
  ast: ASTElement | void,
  options: CompilerOptions
): CodegenResult {
  // 接下代码来调用 CodegenState 构造函数，创建实例对象 state 初始化编译的状态。
  const state = new CodegenState(options)
  /**
   * 在此会判断ast是否有值。 有值就调用genElement函数生成渲染函数所需的如下字符串。
  _c('div',{attrs:{"id":"app"}},[_v(_s(message))])
  没有值就把字符串 "_c('div')" 赋值给code，值得注意的是 _c() 是createElement()的别称，见名知义通过它来创建DOM对象。
   */
  const code = ast ? genElement(ast, state) : '_c("div")'
  return {
    /**
     * 在这要跟大家主要解释的是 渲染函数字符串都包裹在一个 with语句当中，这么做的原因是with 的作用域和模板的作用域正好契合，可以极大地简化模板编译过程。
      可能有很多同志会问了, 我看到很多地方说"不推荐"使用with 为什么这里....！接下来我贴一段尤雨溪对于此问题的回答。
      with 没有什么太明显的坏处（经测试性能影响几乎可以忽略），但是 with 的作用域和模板的作用域正好契合，可以极大地简化模板编译过程。Vue 1.x 使用的正则替换 identifier path 是一个本质上 unsound 的方案，不能涵盖所有的 edge case；而走正经的 parse 到 AST 的路线会使得编译器代码量爆炸。虽然 Vue 2 的编译器是可以分离的，但凡是可能跑在浏览器里的部分，还是要考虑到尺寸问题。用 with 代码量可以很少，而且把作用域的处理交给 js 引擎来做也更可靠。
      用 with 的主要副作用是生成的代码不能在 strict mode / ES module 中运行，但直接在浏览器里编译的时候因为用了 new Function()，等同于 eval，不受这一点影响。
     */
    render: `with(this){return ${code}}`,
    staticRenderFns: state.staticRenderFns
  }
}

/**
 * 源码挺简单，但是我们也需要有些上下文的东西来加深理解。假设我们有如下模板：
    <div id ="app">{{ message }}</div>
    通过编译器解析为ast如下：
    {
      type: 1,
      tag: "div",
      attrs: [{
        name: "id",
        value: "app",
      }],
      attrsList: [{
        name: "id",
        value: "app"
      }],
      attrsMap: {
        id: "app"
      },
      children: [{
        type: 2,
        expression: "_s(message)",
        token: [{
          "@binding": "message"
        }],
        text: "{{message}}",
        static: false
      }],
      parent: undefined,
      plain: false,
      static: false,
      staticRoot: false
    }
    那调用genElement 传入的ast 就是上述的对象，genElement 函数体中用 el 参数接收， state 接收 CodegenState 实例对象。
 */
export function genElement (el: ASTElement, state: CodegenState): string {
  // ast 中 parent属性是否有值，有值表示还有父节点。 在此 ast.parent 为undefined。
  if (el.parent) {
    el.pre = el.pre || el.parent.pre
  }

  // ast 中 staticRoot属性是否有值 ，如果为true表示静态根节点。 当静态根节点已经解析过了会给ast 添加 staticProcessed 标记。 
  // 如果满足这两个条件调用 genStatic 函数 返回 生成虚拟dom渲染函数所需对应的参数格式。 此条件在当前ast 中是不成立的。
  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el, state)
  } 
  /**
   * 参考文档 v-once 只渲染元素和组件一次。随后的重新渲染，元素/组件及其所有的子节点将被视为静态内容并跳过，因为没有给模板中的跟元素配置 v-one。
   * 此条件在当前ast 中是不成立的。
    */
  else if (el.once && !el.onceProcessed) {
    return genOnce(el, state)
  } 
  /**
   * 判断标签是否含有v-for属性, 解析v-for指令中的参数 , 调用genFor函数并且返回生成虚拟dom渲染函数所需对应的参数格式。 
   * 此条件在当前ast 中是不成立的。
   */
  else if (el.for && !el.forProcessed) {
    return genFor(el, state)
  } 
  /**
   * 判断标签是否含有if属性, 解析 if指令中的参数 , 调用genIf函数并且返回生成虚拟dom渲染函数所需对应的参数格式。 
   * 此条件在当前ast 中是不成立的。
   */
  else if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } 
  // 标签是模板template,调用genChildren获取虚拟dom子节点。 此条件在当前ast 中是不成立的。
  else if (el.tag === 'template' && !el.slotTarget && !state.pre) {
    return genChildren(el, state) || 'void 0'
  } 
  /**
   * 如果标签是插槽, 调用 genSlot 函数并且返回生成虚拟dom渲染函数所需对应的参数格式。此条件在当前ast 中是不成立的。
   */
  else if (el.tag === 'slot') {
    return genSlot(el, state)
  } 
  
  else {
    // component or element
    let code
    // 当以上条件都不满足进入 else 在此检测当前元素是否为组件，如果是调用 genComponent函数并且返回生成虚拟dom渲染函数所需对应的参数格式。
    if (el.component) {
      code = genComponent(el.component, el, state)
    } else {
      /**
       * 接下来重点就来了。 把目光放在data， children这两个变量上。 
       * data变量存储根节点的vNodeData，什么是vNodeData？在 Vue 中一个 VNode 代表一个虚拟节点，而VNodeData 就是用来描述该虚拟节点的属性信息。
       * children 描述根节点中子级虚拟节点。
       */
      let data

      /**
       * 这里有还有一个有意思的属性需要讲下 el.plain 这个属性会在 processElement 阶段给ast对象扩展，稍后会专门开始一篇文章来讲下processElement ，在这你需要先了解下"如果你标签既没有使用特性key，又没有任何属性，那么该标签的元素描述对象的 plain 属性将始终为true"。
          模板示例代码：
          <span>{{message}}</span>
          在 generate 阶段生成的code如下：
          _c('span',[_v(_s(message))])
          当el.plain 属性为false，标签属性描述对象将会被剔除。
       */
      if (!el.plain || (el.pre && state.maybeComponent(el))) {
        data = genData(el, state)
      }

      const children = el.inlineTemplate ? null : genChildren(el, state, true)

      /**
       * 可以看到code这个变量最终拼接的字符串如下：
        _c("标签名 el.tage","属性对应的数据对象 data","子级虚拟节点 children ");
       */
      code = `_c('${el.tag}'${
        data ? `,${data}` : '' // data
      }${
        children ? `,${children}` : '' // children
      })`
    }
    // module transforms
    for (let i = 0; i < state.transforms.length; i++) {
      code = state.transforms[i](el, code)
    }
    return code
  }
}

// hoist static sub-trees out
function genStatic (el: ASTElement, state: CodegenState): string {
  el.staticProcessed = true
  // Some elements (templates) need to behave differently inside of a v-pre
  // node.  All pre nodes are static roots, so we can use this as a location to
  // wrap a state change and reset it upon exiting the pre node.
  const originalPreState = state.pre
  if (el.pre) {
    state.pre = el.pre
  }
  state.staticRenderFns.push(`with(this){return ${genElement(el, state)}}`)
  state.pre = originalPreState
  return `_m(${
    state.staticRenderFns.length - 1
  }${
    el.staticInFor ? ',true' : ''
  })`
}

// v-once
function genOnce (el: ASTElement, state: CodegenState): string {
  el.onceProcessed = true
  if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.staticInFor) {
    let key = ''
    let parent = el.parent
    while (parent) {
      if (parent.for) {
        key = parent.key
        break
      }
      parent = parent.parent
    }
    if (!key) {
      process.env.NODE_ENV !== 'production' && state.warn(
        `v-once can only be used inside v-for that is keyed. `,
        el.rawAttrsMap['v-once']
      )
      return genElement(el, state)
    }
    return `_o(${genElement(el, state)},${state.onceId++},${key})`
  } else {
    return genStatic(el, state)
  }
}

export function genIf (
  el: any,
  state: CodegenState,
  altGen?: Function,
  altEmpty?: string
): string {
  el.ifProcessed = true // avoid recursion
  return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty)
}

function genIfConditions (
  conditions: ASTIfConditions,
  state: CodegenState,
  altGen?: Function,
  altEmpty?: string
): string {
  if (!conditions.length) {
    return altEmpty || '_e()'
  }

  const condition = conditions.shift()
  if (condition.exp) {
    return `(${condition.exp})?${
      genTernaryExp(condition.block)
    }:${
      genIfConditions(conditions, state, altGen, altEmpty)
    }`
  } else {
    return `${genTernaryExp(condition.block)}`
  }

  // v-if with v-once should generate code like (a)?_m(0):_m(1)
  function genTernaryExp (el) {
    return altGen
      ? altGen(el, state)
      : el.once
        ? genOnce(el, state)
        : genElement(el, state)
  }
}

export function genFor (
  el: any,
  state: CodegenState,
  altGen?: Function,
  altHelper?: string
): string {
  const exp = el.for
  const alias = el.alias
  const iterator1 = el.iterator1 ? `,${el.iterator1}` : ''
  const iterator2 = el.iterator2 ? `,${el.iterator2}` : ''

  if (process.env.NODE_ENV !== 'production' &&
    state.maybeComponent(el) &&
    el.tag !== 'slot' &&
    el.tag !== 'template' &&
    !el.key
  ) {
    state.warn(
      `<${el.tag} v-for="${alias} in ${exp}">: component lists rendered with ` +
      `v-for should have explicit keys. ` +
      `See https://vuejs.org/guide/list.html#key for more info.`,
      el.rawAttrsMap['v-for'],
      true /* tip */
    )
  }

  el.forProcessed = true // avoid recursion
  return `${altHelper || '_l'}((${exp}),` +
    `function(${alias}${iterator1}${iterator2}){` +
      `return ${(altGen || genElement)(el, state)}` +
    '})'
}

/**
 * 
 * 在此之前讲过genData$2 会生成最终的data属性数据对象，通过对genData$2 初步的了解其实在源码内部就是根据一串的 if 判断是否有对应的属性最终来做字符串的拼接。 根据现有的ast 我们对源码做一些删减。
    function genData$2(el, state) {
      var data = '{';
        //... 省略
      // attributes
      if (el.attrs) {
        data += "attrs:{" + (genProps(el.attrs)) + "},";
      }
      data = data.replace(/,$/, '') + '}';
        //... 省略
      return data
    }
    这样就清晰多了，在我们当前元素描述对象ast 中只有attrs属性。
    attrs: [{
      name: "id",
      value: "app",
    }]
    在处理attrs 属性会调用genProps 函数。
    function genProps(props) {
      var res = '';
      for (var i = 0; i < props.length; i++) {
        var prop = props[i];
        {
          res += "\"" + (prop.name) + "\":" + (transformSpecialNewlines(prop.value)) + ",";
        }
      }
      return res.slice(0, -1)
    }
    此函数会把数据格式[{key1:value1, key2: value2}] 转化成 {key1:value1, key2: value2}。

    最终调用genData$2 返回对象数据格式如下：
    {attrs:{id:"app"}}
    现在我们锁定了data 的值在来看下 genChildren 函数。
 */
export function genData (el: ASTElement, state: CodegenState): string {
  let data = '{'

  // directives first.
  // directives may mutate the el's other properties before they are generated.
  const dirs = genDirectives(el, state)
  if (dirs) data += dirs + ','

  // key
  if (el.key) {
    data += `key:${el.key},`
  }
  // ref
  if (el.ref) {
    data += `ref:${el.ref},`
  }
  if (el.refInFor) {
    data += `refInFor:true,`
  }
  // pre
  if (el.pre) {
    data += `pre:true,`
  }
  // record original tag name for components using "is" attribute
  if (el.component) {
    data += `tag:"${el.tag}",`
  }
  // module data generation functions
  for (let i = 0; i < state.dataGenFns.length; i++) {
    data += state.dataGenFns[i](el)
  }
  // attributes
  if (el.attrs) {
    data += `attrs:${genProps(el.attrs)},`
  }
  // DOM props
  if (el.props) {
    data += `domProps:${genProps(el.props)},`
  }
  // event handlers
  if (el.events) {
    data += `${genHandlers(el.events, false)},`
  }
  if (el.nativeEvents) {
    data += `${genHandlers(el.nativeEvents, true)},`
  }
  // slot target
  // only for non-scoped slots
  if (el.slotTarget && !el.slotScope) {
    data += `slot:${el.slotTarget},`
  }
  // scoped slots
  if (el.scopedSlots) {
    data += `${genScopedSlots(el, el.scopedSlots, state)},`
  }
  // component v-model
  if (el.model) {
    data += `model:{value:${
      el.model.value
    },callback:${
      el.model.callback
    },expression:${
      el.model.expression
    }},`
  }
  // inline-template
  if (el.inlineTemplate) {
    const inlineTemplate = genInlineTemplate(el, state)
    if (inlineTemplate) {
      data += `${inlineTemplate},`
    }
  }
  data = data.replace(/,$/, '') + '}'
  // v-bind dynamic argument wrap
  // v-bind with dynamic arguments must be applied using the same v-bind object
  // merge helper so that class/style/mustUseProp attrs are handled correctly.
  if (el.dynamicAttrs) {
    data = `_b(${data},"${el.tag}",${genProps(el.dynamicAttrs)})`
  }
  // v-bind data wrap
  if (el.wrapData) {
    data = el.wrapData(data)
  }
  // v-on data wrap
  if (el.wrapListeners) {
    data = el.wrapListeners(data)
  }
  return data
}

function genDirectives (el: ASTElement, state: CodegenState): string | void {
  const dirs = el.directives
  if (!dirs) return
  let res = 'directives:['
  let hasRuntime = false
  let i, l, dir, needRuntime
  for (i = 0, l = dirs.length; i < l; i++) {
    dir = dirs[i]
    needRuntime = true
    const gen: DirectiveFunction = state.directives[dir.name]
    if (gen) {
      // compile-time directive that manipulates AST.
      // returns true if it also needs a runtime counterpart.
      needRuntime = !!gen(el, dir, state.warn)
    }
    if (needRuntime) {
      hasRuntime = true
      res += `{name:"${dir.name}",rawName:"${dir.rawName}"${
        dir.value ? `,value:(${dir.value}),expression:${JSON.stringify(dir.value)}` : ''
      }${
        dir.arg ? `,arg:${dir.isDynamicArg ? dir.arg : `"${dir.arg}"`}` : ''
      }${
        dir.modifiers ? `,modifiers:${JSON.stringify(dir.modifiers)}` : ''
      }},`
    }
  }
  if (hasRuntime) {
    return res.slice(0, -1) + ']'
  }
}

function genInlineTemplate (el: ASTElement, state: CodegenState): ?string {
  const ast = el.children[0]
  if (process.env.NODE_ENV !== 'production' && (
    el.children.length !== 1 || ast.type !== 1
  )) {
    state.warn(
      'Inline-template components must have exactly one child element.',
      { start: el.start }
    )
  }
  if (ast && ast.type === 1) {
    const inlineRenderFns = generate(ast, state.options)
    return `inlineTemplate:{render:function(){${
      inlineRenderFns.render
    }},staticRenderFns:[${
      inlineRenderFns.staticRenderFns.map(code => `function(){${code}}`).join(',')
    }]}`
  }
}

function genScopedSlots (
  el: ASTElement,
  slots: { [key: string]: ASTElement },
  state: CodegenState
): string {
  // by default scoped slots are considered "stable", this allows child
  // components with only scoped slots to skip forced updates from parent.
  // but in some cases we have to bail-out of this optimization
  // for example if the slot contains dynamic names, has v-if or v-for on them...
  let needsForceUpdate = el.for || Object.keys(slots).some(key => {
    const slot = slots[key]
    return (
      slot.slotTargetDynamic ||
      slot.if ||
      slot.for ||
      containsSlotChild(slot) // is passing down slot from parent which may be dynamic
    )
  })

  // #9534: if a component with scoped slots is inside a conditional branch,
  // it's possible for the same component to be reused but with different
  // compiled slot content. To avoid that, we generate a unique key based on
  // the generated code of all the slot contents.
  let needsKey = !!el.if

  // OR when it is inside another scoped slot or v-for (the reactivity may be
  // disconnected due to the intermediate scope variable)
  // #9438, #9506
  // TODO: this can be further optimized by properly analyzing in-scope bindings
  // and skip force updating ones that do not actually use scope variables.
  if (!needsForceUpdate) {
    let parent = el.parent
    while (parent) {
      if (
        (parent.slotScope && parent.slotScope !== emptySlotScopeToken) ||
        parent.for
      ) {
        needsForceUpdate = true
        break
      }
      if (parent.if) {
        needsKey = true
      }
      parent = parent.parent
    }
  }

  const generatedSlots = Object.keys(slots)
    .map(key => genScopedSlot(slots[key], state))
    .join(',')

  return `scopedSlots:_u([${generatedSlots}]${
    needsForceUpdate ? `,null,true` : ``
  }${
    !needsForceUpdate && needsKey ? `,null,false,${hash(generatedSlots)}` : ``
  })`
}

function hash(str) {
  let hash = 5381
  let i = str.length
  while(i) {
    hash = (hash * 33) ^ str.charCodeAt(--i)
  }
  return hash >>> 0
}

function containsSlotChild (el: ASTNode): boolean {
  if (el.type === 1) {
    if (el.tag === 'slot') {
      return true
    }
    return el.children.some(containsSlotChild)
  }
  return false
}

function genScopedSlot (
  el: ASTElement,
  state: CodegenState
): string {
  const isLegacySyntax = el.attrsMap['slot-scope']
  if (el.if && !el.ifProcessed && !isLegacySyntax) {
    return genIf(el, state, genScopedSlot, `null`)
  }
  if (el.for && !el.forProcessed) {
    return genFor(el, state, genScopedSlot)
  }
  const slotScope = el.slotScope === emptySlotScopeToken
    ? ``
    : String(el.slotScope)
  const fn = `function(${slotScope}){` +
    `return ${el.tag === 'template'
      ? el.if && isLegacySyntax
        ? `(${el.if})?${genChildren(el, state) || 'undefined'}:undefined`
        : genChildren(el, state) || 'undefined'
      : genElement(el, state)
    }}`
  // reverse proxy v-slot without scope on this.$slots
  const reverseProxy = slotScope ? `` : `,proxy:true`
  return `{key:${el.slotTarget || `"default"`},fn:${fn}${reverseProxy}}`
}

/**
 * 
 * @param {*} el 
 * @param {*} state 
 * @param {*} checkSkip 
 * @param {*} altGenElement 
 * @param {*} altGenNode 
 * @returns 
 * 此前我们讲过 genChildren函数会生成字符串描述子级虚拟节点信息。 如何做到的呢？我们来看下最关键的代码。
 */
export function genChildren (
  el: ASTElement,
  state: CodegenState,
  checkSkip?: boolean,
  altGenElement?: Function,
  altGenNode?: Function
): string | void {
  const children = el.children
  if (children.length) {
    const el: any = children[0]
    // optimize single v-for
    if (children.length === 1 &&
      el.for &&
      el.tag !== 'template' &&
      el.tag !== 'slot'
    ) {
      const normalizationType = checkSkip
        ? state.maybeComponent(el) ? `,1` : `,0`
        : ``
      return `${(altGenElement || genElement)(el, state)}${normalizationType}`
    }
    const normalizationType = checkSkip
      ? getNormalizationType(children, state.maybeComponent)
      : 0
    const gen = altGenNode || genNode

    /**
     * 在这会返回一个"[]" ，"字符串格式的数组对象"。 children 是获取模板描述对象中根节点下子级节点的数组对象。 通过数组对象map方法来决定在这个"字符串格式的数组对象"中的成员列表。
      在我们当前元素描述对象ast 中 children属性值如下：
      children: [{
        type: 2,
        expression: "_s(message)",
        token: [{
          "@binding": "message"
        }],
        text: "{{message}}",
        static: false
      }]
      在map方法中调用了gen函数去处理children中的对象成员。gen函数获取genNode的引用。
     */
    return `[${children.map(c => gen(c, state)).join(',')}]${
      normalizationType ? `,${normalizationType}` : ''
    }`
  }
}

// determine the normalization needed for the children array.
// 0: no normalization needed
// 1: simple normalization needed (possible 1-level deep nested array)
// 2: full normalization needed
function getNormalizationType (
  children: Array<ASTNode>,
  maybeComponent: (el: ASTElement) => boolean
): number {
  let res = 0
  for (let i = 0; i < children.length; i++) {
    const el: ASTNode = children[i]
    if (el.type !== 1) {
      continue
    }
    if (needsNormalization(el) ||
        (el.ifConditions && el.ifConditions.some(c => needsNormalization(c.block)))) {
      res = 2
      break
    }
    if (maybeComponent(el) ||
        (el.ifConditions && el.ifConditions.some(c => maybeComponent(c.block)))) {
      res = 1
    }
  }
  return res
}

function needsNormalization (el: ASTElement): boolean {
  return el.for !== undefined || el.tag === 'template' || el.tag === 'slot'
}

/**
 * 
 * @param {*} node 
 * @param {*} state 
 * @returns 
 * 清晰明了，当children中的成员对象子节点是元素时递归调用genElement() 函数，
 * 是注释时调用genComment函数，
 * 在当前元素描述对象ast 中 children 成员对象是文本节点调用 genText 函数。
 */
function genNode (node: ASTNode, state: CodegenState): string {
  if (node.type === 1) {
    return genElement(node, state)
  } else if (node.type === 3 && node.isComment) {
    return genComment(node)
  } else {
    return genText(node)
  }
}

/***
 * genText函数返回字符串："_v(_s(message))"。 
 * 在回顾到genChildren 函数中，
 * 最终genChildren函数返回 "[_v(_s(message))]" 字符串给到 Children 变量。
 */
export function genText (text: ASTText | ASTExpression): string {
  return `_v(${text.type === 2
    ? text.expression // no need for () because already wrapped in _s()
    : transformSpecialNewlines(JSON.stringify(text.text))
  })`
}

export function genComment (comment: ASTText): string {
  return `_e(${JSON.stringify(comment.text)})`
}

function genSlot (el: ASTElement, state: CodegenState): string {
  const slotName = el.slotName || '"default"'
  const children = genChildren(el, state)
  let res = `_t(${slotName}${children ? `,${children}` : ''}`
  const attrs = el.attrs || el.dynamicAttrs
    ? genProps((el.attrs || []).concat(el.dynamicAttrs || []).map(attr => ({
        // slot props are camelized
        name: camelize(attr.name),
        value: attr.value,
        dynamic: attr.dynamic
      })))
    : null
  const bind = el.attrsMap['v-bind']
  if ((attrs || bind) && !children) {
    res += `,null`
  }
  if (attrs) {
    res += `,${attrs}`
  }
  if (bind) {
    res += `${attrs ? '' : ',null'},${bind}`
  }
  return res + ')'
}

// componentName is el.component, take it as argument to shun flow's pessimistic refinement
function genComponent (
  componentName: string,
  el: ASTElement,
  state: CodegenState
): string {
  const children = el.inlineTemplate ? null : genChildren(el, state, true)
  return `_c(${componentName},${genData(el, state)}${
    children ? `,${children}` : ''
  })`
}

function genProps (props: Array<ASTAttr>): string {
  let staticProps = ``
  let dynamicProps = ``
  for (let i = 0; i < props.length; i++) {
    const prop = props[i]
    const value = __WEEX__
      ? generateValue(prop.value)
      : transformSpecialNewlines(prop.value)
    if (prop.dynamic) {
      dynamicProps += `${prop.name},${value},`
    } else {
      staticProps += `"${prop.name}":${value},`
    }
  }
  staticProps = `{${staticProps.slice(0, -1)}}`
  if (dynamicProps) {
    return `_d(${staticProps},[${dynamicProps.slice(0, -1)}])`
  } else {
    return staticProps
  }
}

/* istanbul ignore next */
function generateValue (value) {
  if (typeof value === 'string') {
    return transformSpecialNewlines(value)
  }
  return JSON.stringify(value)
}

// #3895, #4268
function transformSpecialNewlines (text: string): string {
  return text
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}
