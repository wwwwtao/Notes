const regexp1 = /^a/g;

const regexp2 = new RegExp('^a', 'g');
const regexp3 = new RegExp(/a/g);
const regexp4 = new RegExp(/a/);

console.log('aabbcc'.match(regexp1));
console.log('babbcc'.match(regexp1));
console.log('aabbccaabbaa'.match(regexp3));
console.log('aabbccaabbaa'.match(regexp4));

// 构造函数的变化

const regexp5 = new RegExp(/a/giuy, 'ig');