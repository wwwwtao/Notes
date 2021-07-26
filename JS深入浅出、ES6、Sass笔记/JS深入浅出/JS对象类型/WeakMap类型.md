# WeakMap 弱映射

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap
https://segmentfault.com/a/1190000015774465

1. 该 WeakMap 对象是键 / 值对的集合，其中键被弱引用。键必须是对象，值可以是任意值
2. WeakMap 的键名所引用的对象是弱引用 ( WeakMaps 保持了对键名所引用的对象的弱引用 )

```js
const wm1 = new WeakMap(),
      wm2 = new WeakMap(),
const o1 = {},
      o2 = function() {},
      o3 = window;

wm1.set(o1, 37);
wm1.set(o2, 'azerty');

wm1.get(o2); // "azerty"
wm1.has(o2); // true

wm1.has(o1); // true
wm1.delete(o1);
wm1.has(o1); // false

wm2.set(o1, o2);//值可以是任何东西，包括对象或函数
wm2.set(o3, undefined);
wm2.set(wm1, wm2); //键和值可以是任何对象。 包括 WeakMaps

wm2.get(o2); // undefined, because there is no key for o2 on wm2  因为wm2上没有o2的key
wm2.get(o3); // undefined, because that is the set value          因为这是设定值

wm2.has(o2); // false
wm2.has(o3); // true  即使值本身“undefined”


```

## WeakMap 与 Map 与 Object 的区别

1. Map 可以使用任意类型的 key 值，不限字符串，对象等。

2. Object 只能用基本类型作为 key 值。

3. WeakMap 只能使用对象作为 key 值，是弱引用，当从 WeakMap 中移除时，会自动垃圾回收

```js
/**
  WeakMaps 保持了对键名所引用的对象的弱引用
*/

正常情况下，我们举个例子：
const key = new Array(5 * 1024 * 1024);
const arr = [
  [key, 1]
];
使用这种方式，我们其实建立了 arr 对 key 所引用的对象(我们假设这个真正的对象叫 Obj)的强引用。
所以当你设置 key = null 时，只是去掉了 key 对 Obj 的强引用，并没有去除 arr 对 Obj 的强引用，所以 Obj 还是不会被回收掉。

const wm = new WeakMap();
let key = new Array(5 * 1024 * 1024);
wm.set(key, 1);
key = null;

当我们设置 wm.set(key, 1) 时，其实建立了 wm 对 key 所引用的对象的弱引用，
但因为 let key = new Array(5 * 1024 * 1024) 建立了 key 对所引用对象的强引用，被引用的对象并不会被回收，
但是当我们设置 key = null 的时候，就只有 wm 对所引用对象的弱引用，下次垃圾回收机制执行的时候，该引用对象就会被回收掉。
```

## 应用场景

### 利用 WeakMap 深拷贝 （避免对象深拷贝中出现环引用，导致爆栈。）

```js
cloneDeep = (target, hash = new WeakMap()) => { //hash 作为一个检查器，避免对象深拷贝中出现环引用，导致爆栈。
        // 对于传入参数处理
        if (typeof target !== 'object' || target === null) {
          return target;
        }
        // 哈希表中存在直接返回
        if (hash.has(target)) return hash.get(target);

        const cloneTarget = Array.isArray(target) ? [] : {};
        hash.set(target, cloneTarget);

        // 针对Symbol属性
        const symKeys = Object.getOwnPropertySymbols(target);
        if (symKeys.length) {
          symKeys.forEach(symKey => {
            if (typeof target[symKey] === 'object' && target[symKey] !== null) {
              cloneTarget[symKey] = this.cloneDeep(target[symKey]);
            } else {
              cloneTarget[symKey] = target[symKey];
            }
          });
        }

        for (const i in target) {
          if (Object.prototype.hasOwnProperty.call(target, i)) {
            cloneTarget[i] =
              typeof target[i] === 'object' && target[i] !== null
                ? this.cloneDeep(target[i], hash)
                : target[i];
          }
        }
        return cloneTarget;
      };


function checktype(obj){ //检查对象类型
  return Object.prototype.toString.call(obj).slice(8,-1)
}
function depCopy(target,hash=new WeakMap()){ //hash 作为一个检查器，避免对象深拷贝中出现环引用，导致爆栈。
  let type = checktype(target)
  let result = null
  if(type=="Object"){
      result = {}
  }else if(type=="Array"){
        result = []
  }else{
      return target
  }
  if(hash.has(target)){ //检查是有存在相同的对象在之前拷贝过，有则返回之前拷贝后存于hash中的对象
      return hash.get(target)
  }
  hash.set(target,result) //备份存在hash中，result目前是空对象、数组。后面会对属性进行追加，这里存的值是对象的栈
  for(let i in target){
      if(checktype(target[i])=="Object"||checktype(target[i])=="Array"){
            result[i]= depCopy(target[i],hash)//属性值是对象，进行递归深拷贝
      }else{
            result[i]= target[i]//其他类型直接拷贝
      }

  }
  return result
}
```


### 私有属性

WeakMap 也可以被用于实现私有变量，不过在 ES6 中实现私有变量的方式有很多种，这只是其中一种：
可以触发垃圾回收机制
```js
const privateData = new WeakMap();

class Person {
    constructor(name, age) {
        privateData.set(this, { name: name, age: age });
    }

    getName() {
        return privateData.get(this).name;
    }

    getAge() {
        return privateData.get(this).age;
    }
}

export default Person;
```