let uid = 0

export default class Dep {
  constructor() {
    this.subs = []
    this.id = uid++
  }
  addSub(sub) {
    this.subs.push(sub)
  }
  removeSub(sub) {
    remove(this.subs, sub)
  }
  depend() {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }
  notify() {
    const subs = [...this.subs]
    subs.forEach((w) => w.update())
  }
}

Dep.target = null
const targetStack = []

export function pushTarget(_target) {
  targetStack.push(Dep.target)
  Dep.target = _target
}

export function popTarget() {
  Dep.target = targetStack.pop()
}

function remove(arr, item) {
  if (!arr.length) return
  const index = arr.indexOf(item)
  if (index > -1) {
    return arr.splice(index, 1)
  }
}
