// 静态属性与静态方法
//
// 1. 不会被类实例所拥有的属性与方法 只是类自身拥有
// 2. 只能通过类调用

// static 关键字（静态方法）

// class Car {
// 	static totalCar = 0;

// 	constructor() {
// 		Car.totalCar += 1;
// 		this.speed = 0;

// 		this.errors = 0;
// 	}

// 	speedUp() {
// 		this.speed += 1;
// 	}

// 	// 自检程序
// 	checker() {
// 		console.log('开始自检');
// 		// ........
// 		if (this.errors === 0) {
// 			console.log('检测完毕 一切正常');
// 		}
// 	}

// 	// 工厂检察员
// 	static checker() {
// 		console.log('我市检察员 我要开始检查了');
// 	}

// 	// static repair(car) {
// 	// 	if (!car.speed) {
// 	// 		car.speed = 0;
// 	// 	}

// 	// 	console.log(car);
// 	// }
// }

// Car.属性名 = 属性值;
// Car.totalCar = 0;
// Car.config = {
// 	wheel: 4,
// 	color: '#000'
// }

// const car = new Car();

// new Car();
// new Car();
// new Car();
// new Car();
// new Car();
// new Car();
// new Car();
// new Car();
// new Car();
// new Car();
// new Car();
// new Car();
// new Car();
// new Car();
// new Car();
// new Car();

// car.checker();
// Car.checker();

// console.log(Car.totalCar);

// Car.repair('1号车');

// const car = new Car();
// ...fdsa.fd.saf
// { color: '#f00' }

// Car.repair({
// 	color: '#f00'
// });

// class Profession {

// }

// class Character {
// 	constructor(pfs) {
// 		this.pfs = pfs;
// 	}
// }

// Character.config = {
// 	profession: {
// 		'咒术师': 1,
// 		'弓箭手': 2
// 	}
// }

// new Character(Character.config.profession['咒术师']);

class Person {
	static format(programmer) {
		programmer.haveGirlFriend = true;
		programmer.hair = true;
	}
}



class Programmer {
	constructor() {
		this.haveGirlFriend = false;
		this.hair = false;
	}
}

const programmer = new Programmer();

console.log(programmer);

Person.format(programmer);

console.log(programmer);


