import { isObject, parsePath } from './../utils'

export default function (node, vm) {
  const text = node.textContent
  return function () {
    const content = text.replace(/\{\{(.+?)\}\}/g, (...args) => {
      const path = args[1].trim()
      const val = parsePath(path).call(vm, vm)
      if (isObject(val)) {
        return JSON.stringify(val, null, 1) // 第三个参数：空格数量
      }
      return val
    })
    node.textContent = content
  }
}
