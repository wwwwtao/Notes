// 新的方法与安全数
// ---------------------------------------------------

// Number.parseInt Number.parseFloat

// console.log(window.parseInt('1.23'));
// console.log(parseFloat('1.23'));

// console.log(Number.parseInt(1.23));
// console.log(Number.parseFloat(1.23));

// ---------------------------------------------------

// Number.isNaN Number.isFinite

// isNaN
// console.log(Number.isNaN(NaN));
// console.log(Number.isNaN(-NaN));
// console.log(Number.isNaN(1));
// console.log(Number.isNaN('1'));
// console.log(Number.isNaN(true));

// function isNaN(value) {
// 	return value !== value;
// }

// console.log(isNaN(NaN));
// console.log(isNaN(-NaN));
// console.log(isNaN(1));
// console.log(isNaN('1'));
// console.log(isNaN(true));

// isFinite
// console.log(Number.isFinite(Infinity));
// console.log(Number.isFinite(2 / 0));
// console.log(Number.isFinite(2 / 4));
// console.log(Number.isFinite(1234));
// console.log(Number.isFinite('1234'));
// console.log(Number.isFinite(true));
// console.log(Number.isFinite(NaN));

// ---------------------------------------------------

// Number.MAX_SAFE_INTEGER Number.MIN_SAFE_INTEGER
// Number.isSafeInteger();

// console.log(Number.MAX_SAFE_INTEGER);
// console.log(Number.MIN_SAFE_INTEGER);

// console.log(Number.isSafeInteger(Number.MAX_SAFE_INTEGER - 1));
// console.log(Number.isSafeInteger(Number.MAX_SAFE_INTEGER + 1));

// ---------------------------------------------------

// 幂运算

// let a = (2 ** 10) ** 0;
// console.log(a);

// Math
