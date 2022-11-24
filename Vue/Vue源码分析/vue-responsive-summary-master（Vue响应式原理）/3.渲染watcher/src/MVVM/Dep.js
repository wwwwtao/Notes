let uid = 0

export default class Dep {
  constructor() {
    this.subs = []
    this.id = uid++
  }

  depend() {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify() {
    const subs = [...this.subs]
    subs.forEach((s) => s.update())
  }

  addSub(sub) {
    this.subs.push(sub)
  }

  removeSub(sub) {
    remove(this.deps, sub)
  }
}

Dep.target = null

const TargetStack = []

export function pushTarget(_target) {
  TargetStack.push(Dep.target)
  Dep.target = _target
}

export function popTarget() {
  Dep.target = TargetStack.pop()
}

function remove(arr, item) {
  const index = arr.indexOf(item)
  if (index > -1) {
    arr.splice(index, 1)
  }
}
