import MVVM from './MVVM'

// for test
window.vm = new MVVM({
  el: '.app',
  data: {
    obj: {
      a: 1,
      b: 2
    },
    a: 1,
    arr: [
      {
        a: 1
      }
    ]
  }
})
