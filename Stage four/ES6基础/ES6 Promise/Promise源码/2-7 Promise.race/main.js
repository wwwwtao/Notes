// Promise.race([ promise1, promise2 ]) : Promise

// function getData1() {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       console.log('第一条数据加载成功');
//       reject('err');
//     }, 500);
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

// let p = Promise.race([]);

// p.then(data => {
// 	console.log(data);
// }, e => {
// 	console.log(e);
// })

// 不使用pormise.race

let flag = false;
function func(data) {
  if (flag) return;
  flag = true;

  console.log(data);
}

function getData1() {
  setTimeout(() => {
    console.log('第一条数据加载成功');
    func({name: 'xiaoming'});
  }, 500);
}

function getData2() {
  setTimeout(() => {
    console.log('第二条数据加载成功');
    func({name: 'xiaohong'});
  }, 600);
}

getData1();
getData2();
