// 简洁表示法

// const getUserInfo = (id = 1) => {
// 	// AJAX ....

// 	const name = 'xiaoming';
// 	const age = 10;

// 	return {
// 		name: name,
// 		age: age,
// 		say: function() {
// 			console.log(this.name + this.age);
// 		}
// 	};
// }; 

// const xiaoming = getUserInfo();

// ------------------------------------------

// const getUserInfo = (id = 1) => {
// 	// AJAX ....

// 	const name = 'xiaoming';
// 	const age = 10;

// 	return {
// 		name,
// 		age,
// 		say() {
// 			console.log(this.name + this.age);
// 		}
// 	};
// };

// const xiaoming = getUserInfo();

// ------------------------------------------

// 属性名表达式

// const obj = {
// 	a: 1,
// 	$abc: 2,
// 	'FDASFHGFgfdsgsd$#$%^&*%$#': 3
// };

const key = 'age';

const xiaoming = {
	name: 'xiaoming',
	[`${key}123`]: 14
};
