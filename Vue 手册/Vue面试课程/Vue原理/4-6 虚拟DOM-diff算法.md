### vdom 结构

1. 有一个 tag（指标签）
2. 有一个 props（指属性 id）
3. 有 children（子元素）

patch(elem,vnode) 和 patch(vnode,newVnode)   补丁

### diff 算法

1. 只比较同一层级
2. tag 不相同，直接删掉重建，不深度比较
3. tag 和 key 都相同，则认为是相同节点，不深度比较

### 4-11 深入 diff 算法源码 -patchVnode 函数

1. 都有 children 就对比
2. 新的 children 有 旧的 children 没有 就增加 addVnodes 反之移除 removeVnodes

### 4-12 深入 diff 算法源码 -updateChildren 函数

### 总结

1. patchVnode
2. addVnodes  removeVnodes
3. updateChildren(key)
