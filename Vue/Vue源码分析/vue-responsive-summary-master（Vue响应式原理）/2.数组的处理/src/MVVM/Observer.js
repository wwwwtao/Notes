import defineReactive from './defineReactive'
import { proxyPrototype } from './array'
import Dep from './Dep'
import { def } from './utils'
import observe from './observe'

// 为对象对每个属性设置响应式
export default class Observer {
  constructor(value) {
    this.value = value
    this.dep = new Dep()
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      Object.setPrototypeOf(value, proxyPrototype)
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  walk(obj) {
    Object.keys(obj).forEach((key) => defineReactive(obj, key, obj[key]))
  }

  observeArray(arr) {
    arr.forEach((i) => observe(i))
  }
}
