const arrayPrototype = Array.prototype

const reactiveMethods = [
  'push',
  'pop',
  'unshift',
  'shift',
  'splice',
  'reverse',
  'sort'
]

export const proxyPrototype = Object.create(arrayPrototype)

reactiveMethods.forEach((method) => {
  const originalMethod = arrayPrototype[method]
  Object.defineProperty(proxyPrototype, method, {
    value: function reactiveMethod(...args) {
      const result = originalMethod.apply(this, args)
      const ob = this.__ob__
      let inserted = null
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args
          break
        case 'splice':
          inserted = args.slice(2)
      }
      if (inserted) ob.observeArray(inserted)
      ob.dep.notify()
      return result
    },
    enumerable: false,
    writable: true,
    configurable: true
  })
})
