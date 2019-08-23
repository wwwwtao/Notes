******************************* promise *************************************
https://www.cnblogs.com/malingyang/p/6535805.html //彻底理解Promise对象——用es5语法实现一个自己的Promise(上篇)

// 方法 用于请求数据(模拟)
function f() {
	return new Promise(resolve => {         //设置resolve(解决)  reject(拒绝)函数
		setTimeout(function() {
			resolve();                      //可以设置条件 一般如成功之后执行resolve()
		}, 1000);
	})
}

f()
	.then(function() {                      //定义resolve函数的内容
		console.log(1);
		return f();
	})
	.then(function() {
		console.log(2);
		return f();
	})
	
*************************************
2.错误处理
 (1) .then(resolve, reject) 
 f(false)
  .then((data) => {
    console.log(data)
  }, e => {
    console.log(e);   then方法中的第二个回调 失败时候做的事 回调中只能传递一个参数
  })   

 (2) 使用实例的catch方法 可以捕获错误
 f(true)
  .then(data => {
    console.log(data);
    return f(false);
  })
  .then(() => {
    console.log('我永远不会被输出');     //如果没有第二个回调 也就是失败的回调就会一直往下找 直到找到失败的回调函数 或者.catch 才会执行
  })
  .catch(e => {
    console.log(e);
    return f(false) ;
  });   

  (3) .finally 不论成功还是失败 finally中的内容一定会执行

  *************************************
  3.promise不单单解决了回调一层套一层的写法 还解决了一些信用问题
    (1).promise一但被确定为成功或者失败 就不能再被更改 resolve()只会被执行一次
    (2).调用的resolve全为自己所写书写的流程 很大程度上改善了反转控制的问题  
  4.Promise的三种状态  
  pending (进行中)  => fulfilled (成功)
                   => rejected (失败)
  状态的改变不可逆 一定决议就不可以再修改 

  *************************************
  5.Promise.all方法可以把多个promise实例 包装成一个新的promise实例  案例实现了等所有图片加载完再显示的小demo
  Promise.all([ promise1, promise2 ]) : Promise  
  三种情况:
  (1).Promise1,promise2都决议成功 返回的新的promise实例就会决议成功 并且Promise1,promise2 的resolve的参数组合成数组传递给新的promise实例
  (2).有一个失败就决议失败 并且把决议失败的promise的错误传递出来
  (3).all里面是空数组 会决议为成功
 
  *************************************
  6.Promise.race([ promise1, promise2 ]) : Promise  
 竞赛 看那个快 只要有一个promise决议为成功或者失败 就会返回一个promise成功或失败的实例 resolve或reject的参数也会传递过来  

  *************************************
  7.Promise.resolve() 和 Promise.reject()
  常用来生成已经被决议为失败或者成功的promise实例

  8.把同步的任务转成异步任务
function createAsyncTask(syncTask) {
  return Promise.resolve(syncTask).then(syncTask => syncTask());
}