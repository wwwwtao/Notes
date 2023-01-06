原型链与继承
        https://www.imooc.com/video/7054;

        foo.prototype {
            construvtor:foo,
            _proto_:Object.prototype
        }

        Object.create() 方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。   好方法 但是 ES5 之后才支持

        模拟 create()
        if(!Object.create) {
            Object.create = function(proto) {
                function F() {}
                f.prototype = proto;
                return new F;
            }
        }

        动态修改 prototype 的属性 会影响所有已创建或新创建的实例
        如果修改整个 prototype 赋值为新的对象 对已经创建的实例不会修改 只会影响后续创建的实例！！！！ 坑

        instanceof （右边的 prototype 属性 是否出现在左边的原型链上）
                   （右边必须是函数 得有 prototype 属性  左边要是对象 不然会返回 false, 基本类型）
        [1,2] instanceof Array === true

## _proto_和 prototype 的区别和关系

![_proto_和prototype的区别和关系](./_proto_%E5%92%8Cprototype%E7%9A%84%E5%8C%BA%E5%88%AB%E5%92%8C%E5%85%B3%E7%B3%BB.png)

1. 在 JS 里，万物皆对象。方法（Function）是对象，方法的原型 (Function.prototype) 是对象。因此，它们都会具有对象共有的特点。即：对象具有属性__proto__，可称为隐式原型，一个对象的隐式原型指向构造该对象的构造函数的原型，这也保证了实例能够访问在构造函数原型中定义的属性和方法。

2. 方法 (Function) 方法这个特殊的对象，除了和其他对象一样有上述_proto_属性之外，还有自己特有的属性——原型属性（prototype），这个属性是一个指针，指向一个对象，这个对象的用途就是包含所有实例共享的属性和方法（我们把这个对象叫做原型对象）。原型对象也有一个属性，叫做 constructor，这个属性包含了一个指针，指回原构造函数。好啦，知道了这两个基本点，我们来看看上面这副图。1. 构造函数 Foo() 构造函数的原型属性 Foo.prototype 指向了原型对象，在原型对象里有共有的方法，所有构造函数声明的实例（这里是 f1，f2）都可以共享这个方法。2. 原型对象 Foo.prototypeFoo.prototype 保存着实例共享的方法，有一个指针 constructor 指回构造函数。

3. 实例 f1 和 f2 是 Foo 这个对象的两个实例，这两个对象也有属性__proto__，指向构造函数的原型对象，这样子就可以像上面 1 所说的访问原型对象的所有方法啦。另外：构造函数 Foo() 除了是方法，也是对象啊，它也有__proto__属性，指向谁呢？指向它的构造函数的原型对象呗。函数的构造函数不就是 Function 嘛，因此这里的__proto__指向了 Function.prototype。其实除了 Foo()，Function(), Object() 也是一样的道理。原型对象也是对象啊，它的__proto__属性，又指向谁呢？同理，指向它的构造函数的原型对象呗。这里是 Object.prototype. 最后，Object.prototype 的__proto__属性指向 null。

总结：
1. 对象有属性__proto__, 指向该对象的构造函数的原型对象。
2. 方法除了有属性__proto__, 还有属性 prototype，prototype 指向该方法的原型对象
