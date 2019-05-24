// 函数参数的默认值

// function add(a, b = 999 + b, c = 1) {  
// 	console.log(a, b);
// }

// add(1);

function People({ name, age = 38 } = {name: 1}) {  
	console.log(name, age);
};

People({ name: 3 });
