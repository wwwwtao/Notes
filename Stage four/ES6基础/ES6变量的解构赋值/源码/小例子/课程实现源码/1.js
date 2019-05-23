// 块级作用域
// eval作用域
// 全局作用域
// 函数作用域

(function(window, document) {
	const FINGERS = 10;
	const HEAD = 1;

	function Person() {
		// ...
		// ...
		// ...
	}

	window.Person2 = Person;
})(window, document);
