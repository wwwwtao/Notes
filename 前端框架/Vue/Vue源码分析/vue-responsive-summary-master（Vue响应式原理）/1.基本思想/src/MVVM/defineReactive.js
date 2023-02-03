import Dep from './Dep'
import observe from './observe'

export default function defineReactive(data, key, value = data[key]) {
  const dep = new Dep()
  observe(value)
  Object.defineProperty(data, key, {
    get: function reactiveGetter() {
      dep.depend()
      return value
    },
    set: function reactiveSetter(newValue) {
      if (newValue === value) return
      value = newValue
      observe(newValue)
      dep.notify()
    }
  })
}
