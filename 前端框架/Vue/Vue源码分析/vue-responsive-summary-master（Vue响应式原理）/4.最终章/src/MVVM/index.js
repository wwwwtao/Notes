import Compiler from './Compiler'
import { observe, defineReactive } from './observe'

export default class MVVM {
  constructor(options) {
    this.$el = options.el
    this.$data = options.data
    this.proxyData(this.$data)
    observe(this.$data)
    if (this.$el) new Compiler(this.$el, this)
  }

  proxyData(data) {
    Object.keys(data).forEach((key) => {
      Object.defineProperty(this, key, {
        get() {
          return data[key]
        },
        set(newVal) {
          if (data[key] === newVal) return
          data[key] = newVal
        }
      })
    })
  }

  $set(target, key, value) {
    // 对于数组利用splice实现
    if (Array.isArray(target)) {
      target.length = Math.max(target.length, key)
      target.splice(key, 1, value)
      return value
    }
    // 对于对象，如果该属性已经存在，直接赋值
    if (key in target && !(key in Object.prototype)) {
      target[key] = value
      return value
    }
    const ob = target.__ob__
    // 如果不是响应式对象，直接赋值
    if (!ob) {
      target[key] = value
      return value
    }
    // 设置响应式属性
    defineReactive(target, key, value)
    ob.dep.notify()
    return value
  }

  $delete(target, key) {
    if (Array.isArray(target)) {
      target.splice(key, 1)
      return
    }
    const ob = target.__ob__
    if (!target.hasOwnProperty(key)) return
    delete target[key]
    if (!ob) return
    ob.dep.notify()
  }
}
