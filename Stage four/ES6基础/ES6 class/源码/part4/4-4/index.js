// ES5继承的实现

// 原型

// 利用构造函数
// function P() {
// 	this.name = 'parent';
// 	this.gender = 2;
// 	this.say = function() {
// 		console.log('好的好的！我一定到！！咕咕咕');
// 	}
// }

// P.prototype.test = function() {
// 	console.log('我是一个test方法');
// }

// function C() {
// 	P.call(this);
// 	this.name = 'child';
// 	this.age = 11;
// }

// var child = new C();
// child.say();
// child.test();

// prototype
function P() {
	this.name = 'parent';
	this.gender = 2;
	this.say = function() {
		console.log('好的好的！我一定到！！咕咕咕');
	}
}

P.prototype.test = function() {
	console.log('我是一个test方法');
}

function C() {
	P.call(this);
	this.name = 'child';
	this.age = 11;
}

C.prototype = new P();

var child = new C();
child.say();
child.test();
