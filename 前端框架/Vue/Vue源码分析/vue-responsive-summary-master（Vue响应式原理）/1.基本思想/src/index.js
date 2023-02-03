import observe from './MVVM/observe'
import Watcher from './MVVM/Watcher'

// for test
window.obj = {
  a: 1,
  b: {
    m: {
      n: 4
    }
  }
}

observe(obj)

window.w1 = new Watcher(obj, 'a', (val, oldVal) => {
  console.log(`obj.a 从 ${oldVal}(oldVal) 变成了 ${val}(newVal)`)
})

window.w2 = new Watcher(obj, 'b.m.n', (val, oldVal) => {
  console.log(`obj.b.m.n 从 ${oldVal}(oldVal) 变成了 ${val}(newVal)`)
})
