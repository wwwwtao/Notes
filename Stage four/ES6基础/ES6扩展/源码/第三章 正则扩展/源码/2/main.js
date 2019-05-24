// uy修饰符

// u.  unicode

console.log(/^\ud83d/.test('\ud83d\udc36'))
console.log(/^\ud83d/u.test('\ud83d\udc36'))

// '\ud83d\udc36'

// y 粘连修饰符   sticky

const r1 = /imooc/g;
const r2 = /imooc/y;

const str = 'imoocimooc-imooc';

console.log(r1.exec(str));
console.log(r1.exec(str));
console.log(r1.exec(str));
console.log(r1.exec(str));

console.log('-----------------');

console.log(r2.exec(str));
console.log(r2.exec(str));
console.log(r2.exec(str));
