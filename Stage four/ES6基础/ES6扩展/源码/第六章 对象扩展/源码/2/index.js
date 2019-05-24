// 扩展运算符

// 复制对象 - 浅拷贝

// const obj1 = {
// 	a: 1,
// 	b: 2,
// 	d: {
// 		aa: 1,
// 		bb: 2
// 	}
// };

// const obj2 = {
// 	c: 3,
// 	a: 9
// };

// const cObj1 = { ...obj1 };

// console.log(cObj1.d.aa);

// cObj1.d.aa = 999;

// console.log(cObj1.d.aa);
// console.log(obj1.d.aa);

// 合并对象

// const newObj = {
// 	...obj2,
// 	...obj1
// };

// newObj.d.aa = 22;

// console.log(obj1);

// -----------------------------------

// 部分新的方法和属性

// Object.is
// ===
// +0 -0
// NaN

// console.log(Object.is(+0, -0));
// console.log(+0 === -0);
// console.log(Object.is(NaN, NaN));
// console.log(NaN === NaN);

// console.log(Object.is(true, false));
// console.log(Object.is(true, true));

// --------------------------------------------------

// Object.assign

// const obj = Object.assign({a: 1}, {b: 2}, {c: 3}, {d: 4, e: 5});

// const obj = {
// 	a: 1,
// 	b: {
// 		c: 2
// 	}
// };

// let newObj = Object.assign({a: 3}, obj);

// console.log(newObj.b.c);

// newObj.b.c = 100;

// console.log(obj.b.c);

// --------------------------------------------------

// const obj = {
// 	a: 1,
// 	b: 2,
// 	c: 3,
// 	d: 4
// };

// Object.keys

// console.log(Object.keys(obj));

// // Object.values

// console.log(Object.values(obj));

// // Object.entries

// console.log(Object.entries(obj));

// for - of

// for (let [k, v] of Object.entries(obj)) {
// 	console.log(k, v);
// }

// --------------------------------------------------

// __proto__

// console.log({a: 1});

// --------------------------------------------------

// Object.setPrototypeOf

// const obj1 = {
// 	a: 1
// };

// const obj2 = {
// 	b: 1
// }

// const obj = Object.create(obj1);

// console.log(obj.__proto__);

// Object.setPrototypeOf(obj, obj2);

// console.log(obj.__proto__);

// --------------------------------------------------

// Object.getPrototypeOf

// const obj1 = {a: 1};

// const obj = Object.create(obj1);

// console.log(obj.__proto__);
// console.log(Object.getPrototypeOf(obj));
// console.log(obj.__proto__ === Object.getPrototypeOf(obj));

// --------------------------------------------------

// super

const obj = {name: 'xiaoming'};

const cObj = {
	say() {
		console.log(`My name is ${super.name}`);
	}
}

Object.setPrototypeOf(cObj, obj);

cObj.say();
