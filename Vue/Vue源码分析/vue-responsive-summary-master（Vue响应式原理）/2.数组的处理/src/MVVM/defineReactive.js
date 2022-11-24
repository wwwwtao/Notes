import Dep from './Dep'
import observe from './observe'

export default function defineReactive(data, key, val) {
  const dep = new Dep()
  let childOb = observe(val)
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(val)) {
            dependArray(val)
          }
        }
      }
      return val
    },
    set: function reactiveSetter(newVal) {
      if (val === newVal) return
      val = newVal
      childOb = observe(newVal)
      dep.notify()
    }
  })
}

function dependArray(array) {
  for (let e of array) {
    e && e.__ob__ && e.__ob__.dep.depend()
    if (Array.isArray(e)) {
      dependArray(e)
    }
  }
}
