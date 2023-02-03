import { parsePath } from './../utils'

function setValue(vm, expression, value) {
  const keys = expression.split('.')
  let obj = vm.$data
  for (let i = 0; i < keys.length - 1; i++) {
    obj = obj[keys[i]]
  }
  obj[keys.slice(-1)] = value
}

export default {
  model(node, expression, vm) {
    node.addEventListener('input', (e) =>
      setValue(vm, expression, e.target.value)
    )
    const value = parsePath(expression).call(vm, vm)
    return function () {
      node.value = value
    }
  }
}
