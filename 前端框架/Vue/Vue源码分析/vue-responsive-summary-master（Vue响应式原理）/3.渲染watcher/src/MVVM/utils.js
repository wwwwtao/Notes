export function parsePath(path) {
  const segments = path.split('.')
  return function (obj) {
    for (let key of segments) {
      if (!obj) return
      obj = obj[key]
    }
    return obj
  }
}

export function def(obj, key, value, enumerable = false) {
  Object.defineProperty(obj, key, {
    value,
    enumerable,
    writable: true,
    configurable: true
  })
}

export function isObject(target) {
  return typeof target === 'object' && target !== null
}
