// 结合扩展运算符使用

// function foo(a, b, c) {
// 	console.log(a);
// 	console.log(b);
// 	console.log(c);
// }

// foo(...[1, 3, 2]);

// const user = ['小明', 14, ['吃饭', '打游戏'], '我没有女朋友'];

// function say(name, age, hobby, desc) {
// 	console.log(`我叫${ name }, 我今年${ age } 岁, 我喜欢${ hobby.join('和') }, ${ desc }`);
// }

// say(user[0], user[1], user[2], user[3]);

// say(...user);

// apply

// say.apply(null, user);

// const arr = [1, 2, 233, 3, 4, 5];

// // Math.max();

// console.log(Math.max(...arr));
// console.log(Math.max.apply(null, arr));

// console.log(Math.min(...arr));
// console.log(Math.min.apply(null, arr));

// --------------------------------------------

// const arr1 = [1, 2, 3, 4];
// const arr2 = [4, 2, 2, 1];
// const arr3 = [2.2, '123', false];

// const cArr1 = [1, 2, 3, ...arr3];

// const cArr2 = [...arr1];
// const [...cArr3] = arr3;

// const cArr4 = [...arr1, ...arr2, ...arr3];


// function *g() {
// 	console.log(1);
// 	yield 'hi~';
// 	console.log(2);
// 	yield 'imooc~';
// }

// // const arr = [...g()];

// const gg = g();

// gg.next();

// setTimeout(function() {
// 	gg.next();
// }, 1000);

let set = new Set([1, 2, 2, 3]);

console.log([...set]);
