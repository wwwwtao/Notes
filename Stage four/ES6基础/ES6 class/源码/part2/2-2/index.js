// 车类
class Car {
	// 构造函数 - (工厂中接头人)
	// 实例化 - (造车的过程) => 类创建对象(实例)的过程

	// whell = 4;

	constructor(wheel, color, length, width) {
		this.whell = wheel;
		this.color = color;
		this.length = length;
		this.width = width;

		this.speed = 0;
	}

	// 加速
	speedUp() {
		this.speed += 1;
	}
}

const car1 = new Car(3, '#f00', 20, 40);
const car2 = new Car(33, '#ff0', 88, 99);

console.log(car1, car2);

// console.log(car.color);
// console.log(car.speed);

// car.speedUp(); //加速

// console.log(car.speed);
// console.log(car);

// 属性
// - 轮子的个数
// - 颜色
// - 长
// - 宽

// 方法
// - 加速
// - 刹车
// - 鸣喇叭
