// 类表达式

// 函数表达式
// const a = function() {

// }
// 函数声明
// function a() {
// }

// const Person1 = class P {
// 	constructor() {
// 		P.a = 1;
// 		console.log('我是鸽手!!咕咕咕!!');
// 	}
// }

// new Person();

// console.log(P);

const Person1 = new class P {
	constructor() {
		P.a = 1;
		console.log('我是鸽手!!咕咕咕!!');
	}
}();
