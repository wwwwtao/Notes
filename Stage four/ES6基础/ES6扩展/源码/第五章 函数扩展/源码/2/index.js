// 结合扩展运算符(剩余参数...)

// function sum(...args) {
// 	// let args = Array.prototype.slice.call(arguments);
// 	// let args = [...arguments];
// 	// let [...args] = arguments;
// 	console.log(args);
// }

// sum(1, 2, 321, 4354, 'fdafsd');


// function op(type, b, ...nums) {
// 	console.log(type);
// 	console.log(nums);
// }

// op('sum', 1, 23, 454, 3, 67, 234);

function sum(...numbers) {
	return numbers.reduce(function(a, b) {
		return a + b;
	}, 0);
}

console.log(sum(1, 2, 3, 4));
