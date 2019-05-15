                                                            JSON对象
我们常说的对象字面量其实不是JSON对象，但是有真正的JSON对象。

两者完全不一样概念，在新版的浏览器里JSON对象已经被原生的内置对象了，目前有2个静态方法：JSON.parse用来将JSON字符串反序列化成对象，JSON.stringify用来将对象序列化成JSON字符串。

老版本的浏览器不支持这个对象，但你可以通过json2.js来实现同样的功能。

1、JSON.parse()

功能：将字符串反序列化成对象
参数：JSON字符串
返回值：对象
示例：
var jsonString = '{"name":"ryan"}'; //JSON字符串（比如从AJAX获取字符串信息）
var obj = JSON.parse(jsonString); //将字符串反序列化成对象
console.log(obj); //{ name: 'ryan' }
console.log(obj.name == 'ryan'); //true

2、JSON.stringify()

功能：将一个对象解析为JSON字符串
参数：对象
返回值：JSON字符串
示例：

var obj = {name:'ryan',age:23};
var jsonString = JSON.stringify(obj);
console.log(jsonString); //'{"name":"ryan","age":23}'

