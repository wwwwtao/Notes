// 比较传统的回调方式与promise

// -------------------------------------------------------
// 回调

// 方法 用于请求数据(模拟)
// function f(cb) {
// 	setTimeout(function() {
// 		cb && cb();
// 	}, 1000);
// }

// f(function() {
// 	console.log(1);

// 	f(function() {
// 		console.log(2);

// 		f(function() {
// 			console.log(3);

// 			f(function() {
// 				console.log(4);

// 				f(function() {
// 					console.log(5);

// 					f(function() {
// 						console.log(6);
// 					});
// 				});
// 			});
// 		});
// 	});
// });

// -------------------------------------------------------
// promise

// 方法 用于请求数据(模拟)
function f() {
	return new Promise(resolve => {
		setTimeout(function() {
			resolve();
		}, 1000);
	})
}

f()
	.then(function() {
		console.log(1);
		return f();
	})
	.then(function() {
		console.log(2);
		return f();
	})
	.then(function() {
		console.log(4);
		return f();
	})
	.then(function() {
		console.log(3);
		return f();
	})
	.then(function() {
		console.log(5);
		return f();
	})
	.then(function() {
		console.log(6);
	});
