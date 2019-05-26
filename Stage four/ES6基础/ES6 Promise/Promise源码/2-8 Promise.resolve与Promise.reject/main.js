// Promise.resolve() 和 Promise.reject()
// 常用来生成已经被决议为失败或者成功的promise实例

// Promise.resolve
// ---------------------------------------
// 传递一个普通的值
// let p1 = new Promise(resolve => {
//   resolve('成功!');
// });

// let p2 = Promise.resolve('成功!');

// // ---------------------------------------
// // 传递一个promise实例
// let poruomiesi = new Promise(resolve => {
//   resolve('耶!')
// });

// // 直接返回传递进去的promise  p===poruomiesi
// let p = Promise.resolve(poruomiesi);

// p.then(data => void console.log(data));

// console.log(p === poruomiesi);   //true

// // ---------------------------------------
// // 传递一个thenable
// // 如果传递的是个thenable
// let obj = {
//   then(cb) {
//     console.log('我被执行了');
//     cb('哼！');
//   },
//   oth() {
//     console.log('我被抛弃了');
//   }
// }

// // 立即执行then方法
// Promise.resolve(obj).then(data => {
//   console.log(data);
// });

// // Promise.reject 

// Promise.reject({ then() { console.log(1) } })
//   .then(() => {
//     console.log('我不会被执行');
//   }, e => {
//     console.log(e);
//   });

// console.log(1);

// let p = new Promise(resolve => {
//   console.log(2);
//   resolve();
//   console.log(3);
// });

// console.log(4);

// p.then(() => {
//   console.log(5);
// });

// console.log(6);


// 把同步的任务转成异步任务

function createAsyncTask(syncTask) {
  return Promise.resolve(syncTask).then(syncTask => syncTask());
}

createAsyncTask(() => {
  console.log('我变成了异步任务！！！');
  return 1 + 1;
}).then(res => {
  console.log(res);
});

console.log('我是同步任务!');
