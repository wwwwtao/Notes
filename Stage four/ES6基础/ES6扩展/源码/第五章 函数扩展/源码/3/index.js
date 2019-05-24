// 箭头函数

// const add1 = (a, b) => {
// 	a += 1;
// 	return a + b;
// };

// const add2 = function(a, b) {
// 	a += 1;
// 	return a + b;
// }

// console.log(add1(2, 2));
// console.log(add2(2, 2));

// const pop = arr => void arr.pop();

// console.log(pop([1, 2, 3]));

// const log = () => {
// 	console.log(arguments);
// };

// log(1, 2, 3);



// const xiaoming = {
// 	name: '小明',
// 	say1: function() {
// 		console.log(this);
// 	},
// 	say2: () => {
// 		console.log(this);
// 	}
// }

// xiaoming.say1();
// xiaoming.say2();
 


// const xiaoming = {
// 	name: 'xiaoming',
// 	age: null,
// 	getAge: function() {
// 		let _this = this;
// 		// ...ajax
// 		setTimeout(function() {
// 			_this.age = 14;
// 			console.log(_this);
// 		}, 1000);

// 	}
// }; 

// xiaoming.getAge();
  
const xiaoming = {
	name: 'xiaoming',
	age: null,
	getAge: function() {


		// ...ajax
		setTimeout(() => {
			this.age = 14;
			console.log(this);
		}, 1000);

	}
};

xiaoming.getAge();
