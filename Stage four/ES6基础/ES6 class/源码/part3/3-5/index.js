// 在es5中模拟类

// 构造函数

// class Car {
// 	constructor() {
// 	}
// }

// function Car() {
// }

// new Car();

// function Person(name, age) {
// 	this.name = name;
// 	this.age = age;
// }

// console.log(new Person('张三', 11));

// 当用new关键字调用函数的时候 发生了什么 为什么会获得一个新的对象

// 1. 创建一个空的对象
// 2. 把构造函数的prototype属性 作为空对象的原型
// 3. this赋值为这个空对象
// 4. 执行函数
// 5. 如果函数没有返回值 则返回this[返回之前那个空对象]

function Constructor(fn, args) {
	var _this = Object.create(fn.prototype);

	var res = fn.apply(_this, args);

	return res ? res : _this;
}

function Person(name, age) {
	this.name = name;
	this.age = age;
}

Person.prototype.say = function() {
	console.log('我叫' + this.name);
}

var person = Constructor(Person, ['张三', 12]);

console.log(person);








