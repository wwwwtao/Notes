        原型链与继承
        https://www.imooc.com/video/7054; 

        foo.prototype {
            construvtor:foo,
            _proto_:Object.prototype
        }

        Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。   好方法 但是ES5之后才支持

        模拟create()
        if(!Object.create) {
            Object.create = function(proto) {
                function F() {}
                f.prototype = proto;
                return new F;
            }
        }

        动态修改prototype的属性 会影响所有已创建或新创建的实例
        如果修改整个prototype 赋值为新的对象 对已经创建的实例不会修改 只会影响后续创建的实例！！！！ 坑 

        instanceof (右边的prototype属性 是否出现在左边的原型链上)
                   (右边必须是函数 得有prototype属性  左边要是对象 不然会返回false,基本类型) 
        [1,2] instanceof Array === true