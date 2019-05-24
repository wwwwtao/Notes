let str = 'PROMISE';

/***************************************************************/
// ES6之前遍历字符串的方式
// 使用for循环

// for (var i = 0, len = str.length; i < len; i ++) {
// 	console.log(str[i]);
// 	console.log(str.charAt(i));
// }


/***************************************************************/
// 转成数组后遍历
// var oStr = Array.prototype.slice.call(str);
var oStr = str.split('');
// const oStr = [...str];
// const [...oStr] = str;

// oStr.forEach(function(word) {
// 	console.log(word);
// });

// console.log(oStr);


// 有时候遍历是为了操作字符串
// 对全是英文的字符串中的大写字符加密 A -> 100  B -> 99。。。
const map = {A: '100', B: '99', C: '98', D: '97', E: '96', F: '95', G: '94', H: '93', I: '92', J: '91', K: '90', L: '89', M: '88', N: '87', O: '86', P: '85', Q: '84', R: '83', S: '82', T: '81', U: '80', V: '79',W: '78',X: '77',Y: '76', Z: '75'};
const words = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

oStr.forEach(function(word, index) {
	if (words.includes(word)) oStr[index] = map[word];
});

console.log(oStr.join(''));

/***************************************************************/
// 使用for-of遍历字符串
// for (let word of str) {
// 	console.log(word);
// }

let newStr = '';
for (let word of str) {
	if (words.includes(word)) newStr += map[word];
}
console.log(newStr)

/***************************************************************/
// 🐶 \u1f436 unicode码(点)。emoji

console.log('\u1f436');
console.log('\u{1f436}');

// Unicode是一项标准 包括字符集、编码方案等
// 他是为了解决传统的字符编码方案的局限而产生的，为每种语言中的每个字符设定了统一并且唯一的二进制编码，以满足跨语言、跨平台进行文本转换、处理的要求。

// codePointAt 获取字符串中对应字符的一个码点
// '🐶'.codePointAt(0);

// at 根据下标取字符
// '🐶abc'.at(0)     🐶