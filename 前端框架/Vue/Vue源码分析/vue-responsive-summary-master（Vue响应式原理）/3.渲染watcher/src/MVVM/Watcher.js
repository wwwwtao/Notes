import { parsePath, isObject } from './utils'
import { pushTarget, popTarget } from './Dep'

export default class Watcher {
  constructor(data, expOrFn, cb) {
    this.data = data
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
    }
    this.cb = cb
    this.deps = []
    this.depIds = new Set()
    this.newDeps = []
    this.newDepIds = new Set()
    this.value = this.get()
  }

  get() {
    pushTarget(this)
    const data = this.data
    const value = this.getter.call(data, data)
    popTarget()
    this.clearUpDeps()
    return value
  }

  update() {
    const value = this.get()
    if (value !== this.value || isObject(value)) {
      const oldValue = this.value
      this.value = value
      this.cb.call(this.vm, value, oldValue)
    }
  }

  addDep(dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }

  clearUpDeps() {
    let i = this.deps.length
    while (i--) {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    let temp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = temp
    this.newDepIds.clear()
    temp = this.deps
    this.deps = this.newDeps
    this.newDeps = temp
    this.newDeps.length = 0
  }
}
