// 新的方法

// ----------------------------------------
// Array.from

// const obj = {
// 	0: 1,
// 	1: '22',
// 	2: false,
// 	length: 2
// };

// console.log(Array.from(obj, item => item * 2));

// Array.prototype.slice.call();
// [].slice.call();
// [...]

// ----------------------------------------
// Array.of

// console.log(Array.of(1, 2, '123', false));

// ----------------------------------------
// Array#fill

// let arr = new Array(10).fill(0, 0, 3);

// console.log([1, 2, 3].fill(0));

// ----------------------------------------
// Array.includes

// var arr = [1, 2, 3, 4];
// console.log(arr.includes(1));
// console.log(arr.includes(55));

// ----------------------------------------
// keys

// const arr = [1, 2, 3, 444];

// console.log(arr.keys());
// for (let i of arr.keys()) {
// 	console.log(i);
// }

// values
// for (let v of arr.values()) {
// 	console.log(v);
// }

// entries
// for (let [i, v] of arr.entries()) {
// 	console.log(i, v);
// }

// ----------------------------------------
// find 根据条件(回调) 按顺序遍历数组 当回调返回true时 就返回当前遍历到的值
// const res = [1, 7, 6, 3].find((value, index, arr) => value % 2 === 0);

// console.log(res);

// ----------------------------------------
// findIndex 根据条件(回调) 按顺序遍历数组 当回调返回true时 就返回当前遍历到的下标
const res = [1, 7, 6, 3, NaN].findIndex((value, index, arr) => Number.isNaN(value));

console.log(res);
