
# 菜鸟教程 -- JavaScript Array 对象 https://m.runoob.com/jsref/jsref-obj-array.html

# Array 对象属性
## length 设置或返回数组中元素的数目。

## constructor 返回对创建此对象的数组函数的引用。

## prototype 使您有能力向对象添加属性和方法。



# Array 对象方法
## 汇总
concat()	连接两个或更多的数组，并返回结果。
copyWithin()	从数组的指定位置拷贝元素到数组的另一个指定位置中。
entries()	返回数组的可迭代对象。
every()	检测数值元素的每个元素是否都符合条件。
fill()	使用一个固定值来填充数组。
filter()	检测数值元素，并返回符合条件所有元素的数组。
find()	返回符合传入测试（函数）条件的数组元素。
findIndex()	返回符合传入测试（函数）条件的数组元素索引。
forEach()	数组每个元素都执行一次回调函数。
from()	通过给定的对象中创建一个数组。
includes()	判断一个数组是否包含一个指定的值。
indexOf()	搜索数组中的元素，并返回它所在的位置。
isArray()	判断对象是否为数组。
join()	把数组的所有元素放入一个字符串。
keys()	返回数组的可迭代对象，包含原始数组的键(key)。
lastIndexOf()	搜索数组中的元素，并返回它最后出现的位置。
map()	通过指定函数处理数组的每个元素，并返回处理后的数组。
pop()	删除数组的最后一个元素并返回删除的元素。
push()	向数组的末尾添加一个或更多元素，并返回新的长度。
reduce()	将数组元素计算为一个值（从左到右）。
reduceRight()	将数组元素计算为一个值（从右到左）。
reverse()	反转数组的元素顺序。
shift()	删除并返回数组的第一个元素。
slice()	选取数组的一部分，并返回一个新数组。
some()	检测数组元素中是否有元素符合指定条件。
sort()	对数组的元素进行排序。
splice()	从数组中添加或删除元素。
toString()	把数组转换为字符串，并返回结果。
unshift()	向数组的开头添加一个或更多元素，并返回新的长度。
valueOf()	返回数组对象的原始值。

## concat() 如果要进行 concat() 操作的参数是数组，那么添加的是数组中的元素，而不是数组。

## copyWithin()	从数组的指定位置拷贝元素到数组的另一个指定位置中。

## entries()	返回数组的可迭代对象。

## keys()	返回数组的可迭代对象，包含原始数组的键(key)。

## valueOf() 返回数组对象的原始值。

## fill()	使用一个固定值来填充数组。

## join() 把数组中的所有元素放入一个字符串，元素是通过指定的分隔符进行分隔的。 若省略了分隔符参数，则使用逗号作为分隔符。

## push() 向数组的末尾添加一个或多个元素，并返回新的数组长度。

## pop() 用于删除数组的最后一个元素，把数组长度减 1，并返回被删除元素。 如果数组已经为空，则 pop() 不改变数组，并返回 undefined。

## shift() 用于把数组的第一个元素从其中删除，并返回被移除的这个元素。 如果数组是空的，那么 shift() 方法将不进行任何操作，返回 undefined。 该方法是直接修改原数组。

## unshift() 向数组的开头添加一个或更多元素，并返回新的数组长度。 该方法是直接修改原数组。

## reverse() 用于颠倒数组中元素的顺序。 该方法会直接修改原数组，而不会创建新数组。

## sort() 用于对数组的元素进行排序。 该排序直接修改原数组，不生成副本。

```js
若 a 小于 b，排序后 a 应该在 b 之前，则返回一个小于 0 的值。  function(a,b){ return a - b} 小的在前面（升序） a 比 b 小，a 在前面，也就是返回负值 a 继续在前面
若 a 等于 b，则返回 0。
若 a 大于 b，则返回一个大于 0 的值。

* 使用例子：newArray.sort(sortBy('number',false)) //表示根据number属性降序排列;若第二个参数不传递，默认表示升序排序
     * @param attr 排序的属性 如number属性
     * @param rev true表示升序排列，false降序排序
     * */
    sortBy: function(attr,rev){
        //第二个参数没有传递 默认升序排列
        if(rev ==  undefined){
            rev = 1;
        }else{
            rev = (rev) ? 1 : -1;
        }
        
        return function(a,b){
            a = a[attr];
            b = b[attr];
            if(a < b){
                return rev * -1;
            }
            if(a > b){
                return rev * 1;
            }
            return 0;
        }
    }
```

## slice(start [,end])   
截取原数组从 start 到 end 位置（不包含它）元素组成的子数组。 左闭右开区间 不包括右-1是右最后一位. 若未指定 end 参数，那么截取尾巴直到原数组最后一个元素（包含它）. 该方法返回一个新数组，不会修改原数组。    原数组没有被修改  

## splice(index,howmany [,item1,item2...])  

删除从 index 处开始的 hownamy 个元素，并且用可选参数列表中声明的一个或多个值来替换那些被删除的元素。
该方法返回的是含有被删除的元素组成的数组，若无被删元素，则返回空数组。
若参数只有 index，那么原数组将从 index 开始删除直至结尾。
该方法直接修改原数组。  !!!!!   可删除 插入 替换

## map(): 返回一个新的 Array，每个元素为调用 func 的结果

## filter(): 返回一个符合 func 条件的元素数组 var new_arrary = arr.filter(callback[, thisArg])

## Array.includes() 函数判断 Array 是否包含某一元素 它直接返回 true 或者 false 可以判断 NaN  indexOf 不能判断是否有 NaN, 但是可以定位

## find() 方法返回 数组中 满足提供的测试函数 的第一个元素的值。否则返回 undefined。 （查找出数组中符合条件比如 id 相同的一项）

## findIndex()	返回符合传入测试（函数）条件的数组元素索引。

## some(): 返回一个 boolean，判断是否有元素是否符合 func 条件
array.some(function(currentValue,index,arr),thisValue)
#### 参数
```js
function(currentValue, index,arr)
  // currentValue	必须。当前元素的值
  // index	可选。当前元素的索引值
  // arr	可选。当前元素属于的数组对象

thisValue	// 可选。对象作为该执行回调时使用，传递给函数，用作 "this" 的值。 如果省略了 thisValue ，"this" 的值为 "undefined"
```

## every(): 返回一个 boolean，判断每个元素是否符合 func 条件

## forEach(): 没有返回值，只是针对每个元素调用 func   输出每个元素

#### 参数
```js
function(currentValue, index, arr)
  // currentValue	必需。当前元素
  // index	可选。当前元素的索引值。
  // arr	可选。当前元素所属的数组对象。

thisValue	// 可选。传递给函数的值一般用 "this" 值。 如果这个参数为空， "undefined" 会传递给 "this" 值
```


## reduce()

reduce 方法有两个参数，第一个参数是一个 callback，用于针对数组项的操作；第二个参数则是传入的初始值，这个初始值用于单个数组项的操作。需要注意的是，reduce 方法返回值并不是数组，而是形如初始值的经过叠加处理后的操作。   原数组没有被修改

reduce() 方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值。
reduce() 可以作为一个高阶函数，用于函数的 compose。
注意: reduce() 对于空数组是不会执行回调函数的。
可以找出数组中最大的值  或者让全部加起来   或者去重 去重还有 ...set 方法

#### 参数
```js
function(total,currentValue, currentIndex,arr)
  // total	必需。初始值, 或者计算结束后的返回值。
  // currentValue	必需。当前元素
  // currentIndex	可选。当前元素的索引
  // arr	可选。当前元素所属的数组对象。

initialValue	// 可选。传递给函数的初始值
```


## reduceRight() 将数组元素计算为一个值（从右到左）。

## indexOf()
  arr.indexOf(2);
  arr.indexOf(2,1);
  arr.indexOf(2,-1);
查找值在数组中的位置 返回索引 查不到返回 -1
第一个参数是要查找的值 第二个参数是开始查找的位置

## lastIndexOf()
  arr.lastIndexOf(2);
从右往左找

## isArray()
判断是否是数组
Array.isArray([]);  //true
[] instanceof Array;  //true
({}).toString.apply([]) === '[object Array]';  //true

## flat()
Array.flat(depth) 
flat() 方法会按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。
flat() 方法会移除数组中的空项
#### 参数
```js
depth // 可选 指定要提取嵌套数组的结构深度，默认值为 1。
```

## from() 
Array.from(object, mapFunction, thisValue)
from() 方法用于通过拥有 length 属性的对象或可迭代的对象来返回一个数组。 如果对象是数组返回 true，否则返回 false。

　1、该类数组对象必须具有length属性，用于指定数组的长度。如果没有length属性，那么转换后的数组是一个空数组。
　2、该类数组对象的属性名必须为数值型或字符串型的数字
　ps: 该类数组对象的属性名可以加引号，也可以不加引号
#### 参数
```js
// object	必需，要转换为数组的对象。
// mapFunction	可选，数组中每个元素要调用的函数。
// thisValue	可选，映射函数(mapFunction)中的 this 对象。
```

#### 使用场景
```js
// 我需要创建一个共81项的数组，有9行，每行9个数（从1-9），在页面上进行展示
let arr = Array.from({ length: 810 }, (item, index) => ({
  id: index,
  number: index % 9 + 1
  }))
// Array.from()适用于将非数组对象转换为数组的场景，它的初衷就是为了解决将非数组对象转换为数组的问题。
// 原生具备 Iterator 接口的数据结构如下。
//             Array
//             Map
//             Set
//             String
//             TypedArray
//             函数的 arguments 对象
//             NodeList 对象

// 因为它们的原型对象都拥有一个 Symbol.iterator 方法。

```