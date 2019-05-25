// Promise.all方法可以把多个promise实例 包装成一个新的promise实例
// Promise.all([ promise1, promise2 ]) : Promise

// 模拟需要多个请求的数据 才能进行下一步操作的情况

// function getData1() {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       console.log('第一条数据加载成功');
//       resolve('data1');
//     }, 1000);
//   });
// }

// function getData2() {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       console.log('第二条数据加载成功');
//       resolve('data2');
//     }, 1000);
//   });
// }

// function getData3() {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       console.log('第三条数据加载成功');
//       resolve('data3');
//     }, 1000);
//   });
// }

// function getData4() {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       // console.log('第四条数据加载成功');
//       reject('data4 err');
//     }, 500);
//   });
// }

// let p = Promise.all([]);

// p.then(() => {
//   console.log('dfsafd');
// }, e => {
//   console.log(e);
// });


// 不是用Promise.all
// let count = 0;
// let err = false;

// function func() {
//   if (count < 4) return;

//   if (err) {
//     // ....
//   }

//   console.log('全部拿到了 ！');
// }

// function getData1() {
//   setTimeout(() => {
//     console.log('第一条数据加载成功');
//     count ++;
//     func();
//   }, 1000);
// }

// function getData2() {
//   setTimeout(() => {
//     console.log('第二条数据加载成功');
//     count ++;
//     func();
//   }, 1000);
// }

// function getData3() {
//   setTimeout(() => {
//     console.log('第三条数据加载成功');
//     count ++;
//     func();
//   }, 1000);
// }

// function getData4() {
//   setTimeout(() => {
//     console.log('第四条数据加载成功');
//     count ++;
//     func();
//   }, 1000);
// }

// getData1();
// getData2();
// getData3();
// getData4();
