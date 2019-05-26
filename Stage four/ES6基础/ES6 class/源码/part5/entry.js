class Car {
	static total_car = 0;

	color = '#000';

	constructor(color) {
		Car.total_car += 1;
		this.color = color;
	}
}

new Car();
new Car();
new Car();

console.log(Car.total_car);
