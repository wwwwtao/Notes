// 动画

// function moveTo(el, x, y, cb) {
// 	el.style.transform = `translate(${x}px, ${y}px)`;
// 	setTimeout(function() {
// 		cb && cb();
// 	}, 1000);
// }

// let el = document.querySelector('div');

// document.querySelector('button').addEventListener('click', e => {
// 	moveTo(el, 100, 100, function() {
// 		moveTo(el, 200, 200, function() {
// 			moveTo(el, 30, 20, function() {
// 				moveTo(el, 100, 300, function() {
// 					moveTo(el, 130,20, function() {
// 						moveTo(el, 0, 0, function() {
// 							console.log('移动结束!');
// 						});
// 					});
// 				});
// 			});
// 		});
// 	});
// });

// promise

function moveTo(el, x, y) {
	return new Promise(resolve => {
		el.style.transform = `translate(${x}px, ${y}px)`;
		setTimeout(function() {
			resolve();
		}, 1000);
	});
}


let el = document.querySelector('div');

document.querySelector('button').addEventListener('click', e => {
	moveTo(el, 100, 100)
		.then(function() {
			console.log('第一次移动');
			return moveTo(el, 200, 200);
		})
		.then(function() {
			console.log('第二次移动');
		})
		.then(function() {
			console.log('第二次移动');
		});
});