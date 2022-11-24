import Watcher from '../observe/Watcher'
import directiveCompiler from './directiveCompiler'
import textCompiler from './textCompiler'

function node2Fragment(node) {
  let fragment = document.createDocumentFragment()
  let firstChild = node.firstChild
  while (firstChild) {
    fragment.appendChild(firstChild)
    firstChild = node.firstChild
  }
  return fragment
}

function isElementNode(node) {
  return node.nodeType === 1
}

function isDirective(str) {
  return str.startsWith('v-')
}

export default class Compiler {
  constructor(el, vm) {
    this.el = isElementNode(el) ? el : document.querySelector(el)
    this.vm = vm
    let fragment = node2Fragment(this.el)
    this.compile(fragment)
    this.el.appendChild(fragment)
  }

  compile(node) {
    let childNodes = Array.from(node.childNodes)
    childNodes.forEach((c) => {
      if (isElementNode(c)) {
        this.compileElementNode(c)
      } else {
        this.compileTextNode(c)
      }
    })
  }

  compileElementNode(node) {
    Array.from(node.attributes).forEach(({ name, value: expression }) => {
      if (isDirective(name)) {
        const directive = name.split('-')[1]
        new Watcher(
          this.vm,
          directiveCompiler[directive](node, expression, this.vm)
        )
      }
    })
    this.compile(node)
  }

  compileTextNode(node) {
    if (/\{\{(.+?)\}\}/g.test(node.textContent)) {
      new Watcher(this.vm, textCompiler(node, this.vm))
    }
  }
}
