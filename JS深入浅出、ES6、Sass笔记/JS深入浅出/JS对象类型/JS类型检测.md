## JS类型检测

```js
    Object.prototype.toString.apply([1,2])
    return  a === null ? '[object Null]':Object.prototype.toString.apply(a); //hack ie678
    //缺点 ： IE6/7/8 判断 null 会返回"[object Object]"  判断不了NaN(NaN属于Number 用isNaN())


    function.apply(obj,args)方法能接收两个参数   可以指定function 的this
    obj：这个对象将代替Function类里this对象
    args：这个是数组，它将作为参数传给Function（args-->arguments）

    typeof  只能判断基本类型
    数组 和 null 都会返回"object"  function会返回 function

    instanceof
    obj instanceof Object  判断类型 返回true  或者 false
    但是不同window  或 iframe 间不能用


    Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。
```

