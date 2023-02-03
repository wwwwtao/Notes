import observe from './MVVM/observe'
import Watcher from './MVVM/Watcher'

// for test
window.obj = {
  a: 1,
  b: {
    m: {
      n: 4
    }
  },
  arr: [
    {
      a: 1
    }
  ]
}

observe(obj)

function render() {
  document.write(JSON.stringify(obj.arr, null, 2)) // 第三个参数：空格数量
}

window.rw = new Watcher(obj, render)
