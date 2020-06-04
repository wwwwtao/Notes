< -- let const -- >

    let
        1. 使用 let 声明的变量，只能在当前代码块中访问和使用
        2.let 声明变量，变量不会被提升

    const
        1.const（常量） 除了不能改变物理指针的特性，其他特性和 let 一样。   const 保存的是内存地址，可以给对象或数组添加属性或元素，但是不能重新复写。

        不允许在同一块中重复声明（let,const 一样）
        最后还有一个值得注意的问题：在 ES6 中不存在函数提升，算是修复了 ES5 得一个 bug   只有函数表达式才有函数提升

1. 解构赋值
解构的作用是可以快速取得数组或对象当中的元素或属性，而无需使用 arr[x] 或者 obj[key] 等传统方式进行赋值

数组的解构赋值
let [a, b, c] = [1, 2, 3];
console.log(a);  //1

对象的解构赋值
let { foo, bar } = { foo: "aaa", bar: "bbb" };      // 变量名和属性名要一致
console.log(foo);  //"aaa"

字符串的解构赋值
const [a, b, c, d, e] = 'hello';
a // "h"

2. 扩展运算符
扩展运算符 (spread) 就是我们知道的三个点 (...)，它就好像 rest 参数的逆运算，将一个数组转为用逗号分隔的参数序列。
https://www.jianshu.com/p/41f499fa0e7b  //ES6 之扩展运算符与应用（数组篇）
ES6 提供了新的数据结构 Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。  扩展运算符（...）内部使用 for...of 循环，所以也可以用于 Set 结构。

合并数组
var arr5_ = [...arr1_, ...arr2_, ...arr3_]
console.log(arr5_);  //[1, 2, 3, 4, 5]

数组去重
[...new Set(arr)];

let a = new Set([1,2,3]);
let b = new Set([4,3,2]);
// 并集
let union = new Set([...a,...b]);
// Set {1, 2, 3, 4}
// 交集
let intersect = new Set([...a].filter(x => b.has(x)));   //mySet .has（value）; Set 对象中存在具有指定值的元素 true
// set {2, 3}
// 差集
let difference = new Set([...a].filter(x => !b.has(x)));
// Set {1}
