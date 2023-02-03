## promise

```js
https://www.cnblogs.com/malingyang/p/6535805.html // 彻底理解 Promise 对象——用 es5 语法实现一个自己的 Promise（上篇）

// 方法 用于请求数据（模拟）
function f() {
	return new Promise(resolve => { // 设置 resolve（解决）  reject（拒绝）函数
		setTimeout(function() {
			resolve();                  // 可以设置条件 一般如成功之后执行 resolve()
		}, 1000);
	})
}

f()
	.then(function() {              // 定义 resolve 函数的内容
		console.log(1);
		return f();
	})
	.then(function() {
		console.log(2);
		return f();
	})
```

### 错误处理

```js
//  .then(resolve, reject)
  f(false)
    .then((data) => {
      console.log(data)
    }, e => {
      console.log(e);   then 方法中的第二个回调 失败时候做的事 回调中只能传递一个参数
    })

//  使用实例的 catch 方法 可以捕获错误
  f(true)
    .then(data => {
      console.log(data);
      return f(false);
    })
    .then(() => {
      console.log('我永远不会被输出');     // 如果没有第二个回调 也就是失败的回调就会一直往下找 直到找到失败的回调函数 或者。catch 才会执行
    })
    .catch(e => {
      console.log(e);
      return f(false) ;
    });

//  .finally 不论成功还是失败 finally 中的内容一定会执行
```

### promise 不单单解决了回调一层套一层的写法 还解决了一些信用问题

  1. promise 一但被确定为成功或者失败 就不能再被更改 resolve() 只会被执行一次
  2. 调用的 resolve 全为自己所写书写的流程 很大程度上改善了反转控制的问题

### Promise 的三种状态

pending （进行中）  => fulfilled （成功）
                  => rejected （失败）
状态的改变不可逆 一定决议就不可以再修改

### Promise.all 方法可以把多个 promise 实例 包装成一个新的 promise 实例  案例实现了等所有图片加载完再显示的小 demo

  Promise.all([ promise1, promise2 ]) : Promise
  三种情况：
  1. Promise1,promise2 都决议成功 返回的新的 promise 实例就会决议成功 并且 Promise1,promise2 的 resolve 的参数组合成数组传递给新的 promise 实例
  2. 有一个失败就决议失败 并且把决议失败的 promise 的错误传递出来
  3. all 里面是空数组 会决议为成功

### Promise.race([ promise1, promise2 ]) : Promise

  竞赛（看那个快）只要有一个 promise 决议为成功或者失败 就会返回一个 promise 成功或失败的实例 resolve 或 reject 的参数也会传递过来

### Promise.resolve() 和 Promise.reject()

  常用来生成已经被决议为失败或者成功的 promise 实例

### 把同步的任务转成异步任务

```js
function createAsyncTask(syncTask) {
  return Promise.resolve(syncTask).then(syncTask => syncTask());
}
```

## 理解 async 和 awiat （谈谈对 async 和 awiat 的理解）

我发现很多人理解 async 是直接基于返回 Promise，然后通过 then/catch 等微任务的作用，因此 async 执行栈后续的同步代码内容可以在 async 执行完成前直接被运行。
但这个理解不完全正确。还是要基于 generator 的协程去理解。

实际上，async 是这样运行的，
首先  async 本质上就是 generator 也就是协程运行的语法糖。
假设你现在运行了一个名叫 testFn 的 async 函数，接着发生了：testFn() 的时候执行了一个会递归且自动 iterator 每一次会执行 next 并处理一些额外操作：
每当遇到 await 后的内容直接被 V8 隐式转成一个 Promise，同时暂停此 async 函数协程，把控制权交给调用 async 的父协程，也就是你运行 testFn 的地方或者是全局执行上下文，然后在父协程的位置对 testFn().next() 建立一个 then ，之后不管 await 后的 promise 是否 resolve 都不关键，因为 then 是微任务，所以接着会执行父协程后续的同步代码，执行完毕后，轮到微任务队列，这个微任务里面做两件事，第一件就是恢复 testFn 的执行，第二件事是把第一次 promise 得到的值，用 next() 发回给 testFn 内部，让 testFn 继续执行。
