'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Car = function Car(color) {
	_classCallCheck(this, Car);

	this.color = '#000';

	Car.total_car += 1;
	this.color = color;
};

Car.total_car = 0;


new Car();
new Car();
new Car();

console.log(Car.total_car);
