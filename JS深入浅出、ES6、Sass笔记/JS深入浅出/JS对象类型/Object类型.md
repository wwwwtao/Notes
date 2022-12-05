```js
// <! -------------- 1. Object类型 ------------------------>

// 属性
// constructor
// prototype

// 实例方法
// 1、toString()

// 功能：返回当前对象的字符串形式，返回值为String类型。

// 2、toLocaleString

// 功能：返回当前对象的"本地化"字符串形式，以便于当前环境的用户辨识和使用，返回值为String类型。

// 3、valueOf()

// 功能：返回指定对象的原始值。
// 给一个对象一元运算符 的时候 先去找valueOf() 然后toString()  是基本类型就返回了 没有就报错了

// 静态方法
// 1、Object.assign(target, ...sources)

// 功能：把一个或多个源对象的可枚举、自有属性值复制到目标对象中，返回值为目标对象。

// 2、Object.create(proto, [propertiesObject])

// 功能：创建一个对象，其原型为proto，同时可添加多个特性。

// propertiesObject参数详解：

// 数据属性

// value：值
// writable：是否可修改属性的值
// configurable：是否可通过delete删除属性，重新定义
// enumerable：是否可for-in枚举
// 访问属性

// get()：访问
// set()：设置

// 3、Object.defineProperty(obj, prop, descriptor)

// 功能：在一个对象上定义一个新属性或修改一个现有属性，并返回该对象。(可以指定configurable writable等等 设置可不可以枚举 )

// 3.1 obj.hasOwnProperty(prop) 方法会返回一个布尔值，指示对象自身属性中是否具有指定的属性 (可以判断对象上的属性是不是原型链中的属性)

// 4、Object.defineProperties(obj, props)

// 功能：在一个对象上定义一个或多个新属性或修改现有属性，并返回该对象。

// 5、Object.seal(obj) / Object.isSealed(obj)
// 功能：密封对象，阻止其修改现有属性的配置特性，即将对象的所有属性的configurable特性设置为false（也就是全部属性都无法重新配置，唯独可以把writable的值由true改为false，即冻结属性），并阻止添加新属性，返回该对象。

// 6、Object.freeze(obj) / Object.isFrozen(obj)

// 功能：完全冻结对象，在seal的基础上，属性值也不可以修改，即每个属性的wirtable也被设为false。

// 7、getOwnPropertyDescriptor(obj, prop)

// 功能：获取目标对象上某自有属性的配置特性（属性描述符），返回值为配置对象。

// 8、Object.getOwnPropertyNames(obj)

// 功能：获取目标对象上的全部自有属性名（包括不可枚举属性）组成的数组。

// 9、Object.getPrototypeOf(obj)

// 功能：获取指定对象的原型，即目标对象的prototype属性的值。

// 10、Object.setPrototypeOf(obj, proto)

// 功能：设置目标对象的原型为另一个对象或null，返回该目标对象

// 11、Object.keys(obj)

// 功能：获取目标对象上所有可枚举属性组成的数组。
// (总结：Object.keys(obj)方法获取的集合和for-in遍历获取的不同在于，Object.keys()只获取目标对象上可枚举的自有属性，而for-in遍历会包含原型链上可枚举属性一并获取。

// Object.keys()和Object.getOwnPropertyNames()的相同之处都是获取目标对象的自有属性，区别在于，后者会连同不可枚举的自有属性也一并获取组成数组并返回。)

// 12、Object.preventExtensions(obj) / Object.isExtensible(obj)

// 功能：使某一对象不可扩展，也就是不能为其添加新属性。

// undefined表示变量声明但未初始化时的值，

// null表示准备用来保存对象，还没有真正保存对象的值。从逻辑角度看，null值表示一个空对象指针。

```
