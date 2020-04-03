### diff 算法 O(n)

1. 只比较同一层级
2. tag 不相同，直接删掉重建，不深度比较
3. tag 和 key 都相同，则认为是相同节点，不深度比较

### diff 算法过程总结

1. patchVnode
2. addVnodes  removeVnodes
3. updateChildren(key)
 