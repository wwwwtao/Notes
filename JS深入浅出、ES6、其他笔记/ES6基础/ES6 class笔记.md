************************************ class ********************************
```javascript
class Person{                   //定义了一个名字为Person的类
    //属性写在这
    constructor(name,age){      //constructor是一个构造方法，用来接收参数
        this.name = name;       //this代表的是实例对象
        this.age=age;
    }
    //方法在这呢
    say(){                      //	1.在类中声明方法的时候，千万不要给该方法加上function关键字	2.方法之间不要用逗号分隔，否则会报错
        return "我的名字叫" + this.name+"今年"+this.age+"岁了";
    }
}
```

constructor方法如果没有显式定义，会隐式生成一个constructor方法。所以即使你没有添加构造函数，构造函数也是存在的。
constructor方法默认返回实例对象this，但是也可以指定constructor方法返回一个全新的对象，让返回的实例对象不是该类的实例。
constructor中定义的属性可以称为实例属性（即定义在this对象上），constructor外声明的属性都是定义在原型上的，可以称为原型属性（即定义在class上)。
类的所有实例共享一个原型对象 ，所以proto属性是相等的  由此，也可以通过proto来为类增加方法。使用实例的proto属性改写原型，会改变Class的原始定义，影响到所有实例，所以不推荐使用！


Class 的静态方法
加上static关键字，就表示该方法不会被实例继承，而是直接通过类来调用,如果静态方法包含this关键字，这个this指的是类，而不是实例。
目前没有静态属性 只能类名.属性名创建


类”的内部可以使用get和set关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为和做额外操作
# ES6 getter/setter
```javascript
class Person {
	constructor() {
		this._name = '';
	}
	get name() {
		console.log('正在访问name');
		return `我的名字是${ this._name }`;
	}                                               //不要用逗号哦 和对象字面量不一样哦
	set name(val) {
		console.log('正在修改name');
		this._name = val;
	}
}
```

# ES5 getter/setter
1. 在对象字面量中书写get/set方法
```javascript
const obj = {
	_name: '',          //加_ 用get,set获取和设置name   get,set方法名是name,返回和设置_name
	get name() {
		console.log('123');
		return this._name;
	},
	set name(val) {
		this._name = val;
	}
}
```
2. Object.defineProperty
```javascript
var obj = {
	_name: ''
};
Object.defineProperty(obj, 'name', {
	get: function() {
		console.log('正在访问name');
		return this._name;
	},
	set: function(val) {
		console.log('正在修改name');
		this._name = val;
	}
});
```
# ES6 name属性与new.target属性

函数的name属性，返回该函数的函数名。

new.target属性  指向 !new关键字,后面的类   没有new,值就会等于undefined   在class或者ES5的构造函数中存在
语法糖                                  //校验是不是使用new 来进行调用的
```javascript
function Car() {
	// if (new.target !== Car) {
	// 	throw Error('必须使用new关键字调用Car');
	// }
	if (!(this instanceof Car)) {   //如果this的原型上没有Car 就不是使用new关键字调用的Car()
		throw Error('必须使用new关键字调用Car');
	}
}
```

# 在ES5中模拟类   new和构造函数的原理
```javascript
// (1) 创建一个新对象；
// (2) 将构造函数的作用域赋给新对象（因此 this 就指向了这个新对象） ；
// (3) 执行构造函数中的代码（为这个新对象添加属性） ；
// (4) 返回新对象。
function Constructor(fn, args) {	//传入函数 和函数的参数
 //创建空对象 空对象的原型是函数的prototype
	var _this = Object.create(fn.prototype);
 //this赋值为空对象 并传入参数执行
	var res = fn.apply(_this, args);
 // return 值为对象就返回res 否则返回this(之前的空对象)
	return res ? res : _this;
}
```

# ES6继承 extends关键字
```javascript
class FEEngineer extends Human { 			//继承父类的属性和方法	构造时传入父类的属性 然后用super()可以调用 进行修改
	constructor(name, age, sex, hobby, skill, salary) {	//就算不修改父类的属性也要调用super() 继承父类的属性
		super(name, age, sex, hobby);
		this.skill = skill;
		this.salary = salary;
	}
}
```
# super
 从本质上讲，this是一个指向本对象的指针, 然而super是一个Java关键字 只有在简洁表示法才能用 ！！！！！
 super可以理解为是指向自己超（父）类对象的一个指针，而这个超类指的是离自己最近的一个父类。  可以拿到原型上的属性

在调用super() 父类的this 始终是子类的this
1. 作为父类构造函数调用  在子类构造函数中使用super(),相当于把this传给父类,然后跑一遍
2. 作为对象的方式调用	1. 非静态方法中访问super -> 父类原型		2. 在静态方法中访问super -> 父类

多态:同一个接口 在不同情况下做不一样的事情
