export default class Dep {
  constructor() {
    this.subs = []
  }

  depend() {
    if (Dep.target) {
      this.addSub(Dep.target)
    }
  }

  notify() {
    const subs = [...this.subs]
    subs.forEach((s) => s.update())
  }

  addSub(sub) {
    this.subs.push(sub)
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
