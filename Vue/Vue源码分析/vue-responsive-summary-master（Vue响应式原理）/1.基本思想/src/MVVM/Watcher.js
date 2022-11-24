import { parsePath } from './utils'
import { pushTarget, popTarget } from './Dep'

export default class Watcher {
  constructor(data, expression, cb) {
    this.data = data
    this.expression = expression
    this.cb = cb
    this.value = this.get()
  }

  get() {
    pushTarget(this)
    const value = parsePath(this.data, this.expression)
    popTarget()
    return value
  }

  update() {
    const oldValue = this.value
    this.value = parsePath(this.data, this.expression)
    this.cb.call(this.data, this.value, oldValue)
  }
}
