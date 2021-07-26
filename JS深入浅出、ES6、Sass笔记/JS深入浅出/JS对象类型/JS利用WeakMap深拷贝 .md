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