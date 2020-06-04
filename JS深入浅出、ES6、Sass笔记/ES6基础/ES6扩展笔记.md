### 第二章 字符串扩展

1. 模版字符串

最大区别不用用 + 号连接：console.log(`我叫${ this.name }, 我今年${ this.age }岁!`);

用来定义模板字符串很方便  可以直接换行 嵌套 还可以用方法

```js
    arr.push(
        `
            <li>
                <span>${ `课程名: ${ title }` }</span>
                <span>${ foo(date) }</span>
            </li>
        `
    );
```

2. 部分新方法

```js
// padStart() padEnd()   ! 代码补全
let str = 'i';
let str1 = str.padStart(6, 'mooc');  //moocmi  用来补全的字符串与原字符串，两者的长度之和超过了指定的最小长度，则会截去超出位数的补全字符串。

// repeat()   ! 重复
str.repeat(10);     //iiiiiiiiii

// startsWith() endsWith()  ! 判断字符串以什么字符开头或结尾 返回 true 和 false
str.startsWith('字符串')

// includes()     ! 判断字符串是否存在 返回 true 和 false
str.includes('a promise')  //str 中存在'a promise 返回 true 不存在返回 false

// 转成数组
var oStr = Array.prototype.slice.call(str);
var oStr = str.split('');
const oStr = [...str];
const [...oStr] = str;

// 🐶 \u1f436 unicode 码（点）。emoji
// Unicode 是一项标准 包括字符集、编码方案等
// 他是为了解决传统的字符编码方案的局限而产生的，为每种语言中的每个字符设定了统一并且唯一的二进制编码，以满足跨语言、跨平台进行文本转换、处理的要求。
console.log('\u1f436');
console.log('\u{1f436}'); //🐶

// codePointAt 获取字符串中对应字符的一个码点
'🐶'.codePointAt(0).toString(16);  //1f436

// at 根据下标取字符
'🐶abc'.at(0)     // 取出第 0 位字符🐶
```

### 第三章 正则扩展

// uy 修饰符     // u.  unicode      // y 粘连修饰符   sticky
y 修饰符的作用与 g 修饰符类似，也是全局匹配，后一次匹配都从上一次匹配成功的下一个位置开始。不同之处在于，g 修饰符只要剩余位置中存在匹配就可，而 y 修饰符确保匹配必须从剩余的第一个位置开始，这也就是“粘连”的涵义。

### 第四章 数值扩展

```js
Number.isNaN()                //判断是不是 NaN  NaN 不等于 NaN
Number.isFinite()             //判断数值是否是有限的
Number.isSafeInteger();       //判断整数是否在最大 最小范围之内
Number.MAX_SAFE_INTEGER Number.MIN_SAFE_INTEGER  //JS 能表示的最大 最小范围

//幂运算  !右结合的
let a = 2 ** 3;         //8  2的3次方
let b = (2 ** 3) ** 0;  //1  2的3次方的0次方
```

### 第五章 函数扩展

```js
// 函数参数的默认值
function third({x = 1 ,y = 2} = {}) {} //以后再进行封装函数时应改用默认值设置，特别是某些多参数的函数

// 结合扩展运算符（剩余参数。..)
function sum(...args) {
	console.log(args);
}

// < -- 箭头函数 -- >   !!!! 不绑定 this，arguments（可以用扩展运算符代替）
const add1 = (a, b) => a + b;                   //  单行写法 默认有返回值  单行可以省略花括号和 return 哦~~
const add2 = function(a, b) { return a + b; }   //  结果一样
const pop = arr => void arr.pop();              //  单行没有返回值的写法 void 关键字

const add1 = (a, b) => {                        // 多行写法  不加 return 就不会有返回值
   a+=1;
   return a + b;
}
```

### 第六章 对象扩展

1. 简洁表示法

```js
const getUserInfo = (id = 1) => {
	const name = 'xiaoming';
	const age = 10;
	return {
		name,
		age,
		say() {
			console.log(this.name + this.age);
		}
	};
};
```

2. 属性名表达式 / 计算属性命名

```js
const key = 'age';
const xiaoming = {
	name: 'xiaoming',
	[`${key}123`]: 14       //[] 中间可以放 变量 或 表达式 作为属性名
};
```

3. 扩展运算符  复制对象，合并对象 - 浅拷贝  复制了引用

4. 部分新的方法和属性

```js
 Object.is()            // 等价全等 ===  接受两个参数    区别在于：+0 -0 会返回 false, NaN 会返回 true  , 这两个和 === 返回的结果是相反的
 Object.assign()        // 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。 和扩展运算符一样是浅拷贝
 Object.keys()          // 把所有可枚举的 key 放入数组
 Object.values()        // 把所有可枚举的 values 放入数组
 Object.entries()       // 把所有可枚举的 key values 对 变成数组 放入数组
                        // 供 for...of 循环使用  遍历对象的 key value  for...of 循环读取键值

 Object.setPrototypeOf(obj,obj1)  obj: 要修改的对象 obj1: 修改对象的新原型
 Object.getPrototypeOf()

 super      从本质上讲，this 是一个指向本对象的指针，然而 super 是一个 Java 关键字 只有在简洁表示法才能用 ！！！！！
 super      可以理解为是指向自己超（父）类对象的一个指针，而这个超类指的是离自己最近的一个父类。  可以拿到原型上的属性
```

### 第七章 数组扩展

1. 结合扩展运算符使用
Math.max(...arr);
Math.max.apply(null, arr);
合并数组

2. 生成器函数
http://file.mukewang.com/class/assist/639/4698985/skha2iw5lo/%E7%94%9F%E6%88%90%E5%99%A8%E5%87%BD%E6%95%B0.pdf
写法：

一。function 关键字与函数名之间有一个 * 号

二。函数体内部使用 yield 表达式 定义不同的内部状态

调用生成器对象时会返回一个生成器的迭代器

3. Set
ES6 提供了新的数据结构 Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。
结合 Set 可以 数组去重  并集 交集 差集

4. 新的方法

```js
4.1. 类数组转换
// 类数组：如果一个对象的所有键名都是正整数或零，并且有 length 属性
//Array.from 方法可以把一个类数组转换为一个真正的数组 length 属性决定转换后的数组长度 arguments 就是类数组
//mapFn: 可选参数，每一项执行的回调函数
Array.from(arrayLike, mapFn)

Array.of(v1, v2, v3) //将一系列值转换成数组

Array.fill(value[, start[, end]]) //value: 用来填充数组元素的值。 填充数组 可以设置位置

Array.keys()      //keys() 返回一个由对象或数组的索引值组成的数组
Array.values()    //values() 返回一个由对象或数组的值组成的数组
Array.entries()   //[key,value] 应用了解构赋值，`${key}`,`${value}`, 使用了字符串模板。

// 迭代器（Iterator）遍历器（Iterator）是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署 Iterator 接口，就可以完成遍历操作（即依次处理该数据结构的所有成员）。在 ES6 中，有三类数据结构原生具备 Iterator 接口：数组、某些类似数组的对象、Set 和 Map 结构。

const arr1 = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k']
for (let index of arr1.keys()) {
  console.log(index);
}
//一个迭代器对象  用 for-of 取出数组索引值

4.2. 筛选数组
Array.includes() //函数判断是否包含某一元素 它直接返回 true 或者 false 可以判断 NaN  indexOf 不能判断是否有 NaN, 但是可以定位

find(function(value, index, arr))      //根据条件（回调） 按顺序遍历数组 当回调返回 true 时 就返回当前遍历到的值    !!!
const res = [1, 7, 6, 3].find((value, index, arr) => value % 2 === 0);                 // 返回值 res=6

findIndex(function(value, index, arr)) //根据条件（回调） 按顺序遍历数组 当回调返回 true 时 就返回当前遍历到的下标  !!!
const res = [1, 7, 6, 3, NaN].findIndex((value, index, arr) => Number.isNaN(value));   // 找到 NaN 的下标


// some() 方法用于检测数组中的元素是否满足指定条件（函数提供）。
// 如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测。
// 如果没有满足条件的元素，则返回false。
Array.some(function(currentValue,index,arr),thisValue)
// currentValue	必须。当前元素的值
// thisValue	可选。对象作为该执行回调时使用，传递给函数，用作 "this" 的值。如果省略了 thisValue ，"this" 的值为 "undefined"

```
