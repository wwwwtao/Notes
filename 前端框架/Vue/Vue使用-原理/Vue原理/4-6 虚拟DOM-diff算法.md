### vdom 结构

1. 有一个 tag/sel（指标签）
2. 有一个 props/data（指属性 id）
3. 有 children（子元素）

```js
  {
    sel:"div",
    data:{},
    text:"我是一个盒子"
    children:undefined,
    elm:undefined,
    key:undefined,
  }
```

### patch 函数

1. 第一次上树 `oldvnode`是虚拟节点还是 DOM 节点？如是是 DOM 节点将`oldVnode`包装为虚拟节点
2. `oldvnode`和`newVnode`是不是同一个节点？不是的话暴力删除旧的，插入新的 是的话精细化比较走`patchVnode`

```js
return function patch (oldVnode, vnode, hydrating, removeOnly) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
      return
    }

    let isInitialPatch = false
    const insertedVnodeQueue = []

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true
      createElm(vnode, insertedVnodeQueue)
    } else {
      const isRealElement = isDef(oldVnode.nodeType)
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR)
            hydrating = true
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true)
              return oldVnode
            } else if (process.env.NODE_ENV !== 'production') {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              )
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode)
        }

        // replacing existing element
        const oldElm = oldVnode.elm
        const parentElm = nodeOps.parentNode(oldElm)

        // create new node
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm,
          nodeOps.nextSibling(oldElm)
        )

        // update parent placeholder node element, recursively
        if (isDef(vnode.parent)) {
          let ancestor = vnode.parent
          const patchable = isPatchable(vnode)
          while (ancestor) {
            for (let i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor)
            }
            ancestor.elm = vnode.elm
            if (patchable) {
              for (let i = 0; i < cbs.create.length; ++i) {
                cbs.create[i](emptyNode, ancestor)
              }
              // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.
              const insert = ancestor.data.hook.insert
              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (let i = 1; i < insert.fns.length; i++) {
                  insert.fns[i]()
                }
              }
            } else {
              registerRef(ancestor)
            }
            ancestor = ancestor.parent
          }
        }

        // destroy old node
        if (isDef(parentElm)) {
          removeVnodes([oldVnode], 0, 0)
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode)
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
    return vnode.elm
  }
```

### patchVnode 函数

1. 内存中是不是同一个对象 是就什么都不做
2. `newVnode`有`text`且不同
3. `oldVnode`有没有`children` **有就走（代表双方都有）`updateChildren`** 没有就清空 `oldVnode` 中的 `text` 再 `addVnodes`

```js
function patchVnode(
    oldVnode,
    vnode,
    insertedVnodeQueue,
    ownerArray,
    index,
    removeOnly
  ) {

    // 内存中是不是同一个对象 是就什么都不做
    if (oldVnode === vnode) {
      return
    }

    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // clone reused vnode
      vnode = ownerArray[index] = cloneVNode(vnode)
    }

    const elm = vnode.elm = oldVnode.elm

    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue)
      } else {
        vnode.isAsyncPlaceholder = true
      }
      return
    }

    // reuse element for static trees. 为静态树重用元素。
    // note we only do this if the vnode is cloned -注意，只有克隆vnode时，我们才会执行此操作
    // if the new node is not cloned it means the render functions have been 如果未克隆新节点，则表示渲染函数已
    // reset by the hot-reload-api and we need to do a proper re-render. 通过热重载api重置，我们需要进行适当的重新渲染。
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.componentInstance = oldVnode.componentInstance
      return
    }

    let i
    const data = vnode.data
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode)
    }

    const oldCh = oldVnode.children
    const ch = vnode.children
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
      if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        /**
         * 新旧vNode都有Children 调用 updateChildren
         */
        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
      } else if (isDef(ch)) {
        if (process.env.NODE_ENV !== 'production') {
          checkDuplicateKeys(ch)
        }
        if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
      } else if (isDef(oldCh)) {
        removeVnodes(oldCh, 0, oldCh.length - 1)
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '')
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text)
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) i(oldVnode, vnode)
    }
  }
```

### updateChildren 函数

#### 经典的 diff 算法优化策略

四种命中查找：
  ①新前与旧前
  ②新后与旧后
  ③新后与旧前（此种发生了，涉及移动节点，那么新前指向的节点，移动到旧后之后）
  ④新前与旧后（此种发生了，涉及移动节点，那么新前指向的节点，移动到旧前之前）
  命中一种就不再进行命中判断了如果都没有命中，就需要用循环来寻找了。移动到 `oldStartIdx` 之前

```js
// /Users/wwwwtao/Desktop/ 学习 /Notes/ 前端框架 /Vue/Vue 源码分析 /_VueCopy（CopyVue 看源码内自己写的注释）/src/core/vdom/patch.js
  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    let oldStartIdx = 0
    let newStartIdx = 0
    let oldEndIdx = oldCh.length - 1
    let oldStartVnode = oldCh[0]
    let oldEndVnode = oldCh[oldEndIdx]
    let newEndIdx = newCh.length - 1
    let newStartVnode = newCh[0]
    let newEndVnode = newCh[newEndIdx]
    let oldKeyToIdx, idxInOld, vnodeToMove, refElm

    // removeOnly is a special flag used only by <transition-group> removeOnly是一个特殊标志，仅由＜transition group＞使用
    // to ensure removed elements stay in correct relative positions 以确保移除的元件保持在正确的相对位置
    // during leaving transitions 在离开过渡期间
    const canMove = !removeOnly

    if (process.env.NODE_ENV !== 'production') {
      checkDuplicateKeys(newCh)
    }

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      // 首先不是判断1234命中查找 而是要略过已经加undenfined标记的东西
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left Vnode已向左移动
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx]
      }
      // 1. 新前和旧前命中
      else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]
      }
      // 2. 新后和旧后命中
      else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
        oldEndVnode = oldCh[--oldEndIdx]
        newEndVnode = newCh[--newEndIdx]
      }
      // 3. 新后和旧前命中
      else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
        // 新前指向的节点，移动到旧后之后
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
        oldStartVnode = oldCh[++oldStartIdx]
        newEndVnode = newCh[--newEndIdx]
      }
      // 4. 新前和旧后命中
      else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
        /**
         *  var nodeOps = Object.freeze({
              createElement: createElement$1,
              createElementNS: createElementNS,
              createTextNode: createTextNode,
              createComment: createComment,
              insertBefore: insertBefore,
              removeChild: removeChild,
              appendChild: appendChild,
              parentNode: parentNode,
              nextSibling: nextSibling,
              tagName: tagName,
              setTextContent: setTextContent,
              setStyleScope: setStyleScope
            });
         *  function insertBefore (parentNode, newNode, referenceNode) {
              parentNode.insertBefore(newNode, referenceNode);
            }
         */
        // 新前指向的节点，移动到旧前之前
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
        oldEndVnode = oldCh[--oldEndIdx]
        newStartVnode = newCh[++newStartIdx]
      }
      // 5. 四种命中查找都没有找到
      else {
        /**
         * oldKeyToIdx 是一个Map  是oldCh的key和index的map映射
         * {
         *    key(oldCh的key): value(oldCh的index)
         * }
         */
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
        // 寻找当前项(newStartVnode)在oldKeyToIdx中映射的位置序号
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)

        // New element 是 undefined 表示是全新的项 要加项
        if (isUndef(idxInOld)) {
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
        }
        // 不是undefined 不是全新的项 要移动
        else {
          // vnodeToMove 要移动的旧项
          vnodeToMove = oldCh[idxInOld]
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
            oldCh[idxInOld] = undefined
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
          } else {
            // same key but different element. treat as new element 相同的键但不同的元素。视为新元素
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
          }
        }
        // newStartVnode 下移
        newStartVnode = newCh[++newStartIdx]
      }
    }

    // 旧前移到旧后下面了 (反过来说新前还小于新后,newCh还有剩余节点没处理) 执行 addVnodes
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
      /**
       *  function addVnodes(parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
            for (; startIdx <= endIdx; ++startIdx) {
              createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx)
            }
          }
       */
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
    }
    // 新前移到新后下面了 (反过来说旧前还小于旧后,oldCh还有剩余节点没处理) 执行 removeVnodes
    else if (newStartIdx > newEndIdx) {
      /**
       *  function removeVnodes(vnodes, startIdx, endIdx) {
            for (; startIdx <= endIdx; ++startIdx) {
              const ch = vnodes[startIdx]
              if (isDef(ch)) {
                if (isDef(ch.tag)) {
                  removeAndInvokeRemoveHook(ch)
                  invokeDestroyHook(ch)
                } else { // Text node
                  removeNode(ch.elm)
                }
              }
            }
          }
       */
      removeVnodes(oldCh, oldStartIdx, oldEndIdx)
    }
  }
```

### 总结

![Vue源码探秘之虚拟DOM和diff算法](/Users/wwwwtao/Desktop/学习/Notes/前端框架/Vue/Vue源码分析/vue_learn-master (部分源码解析,第三方的)/diff/Vue源码探秘之虚拟DOM和diff算法.pdf)
![diff流程图.png](./img/diff流程图.png)

- patch  ==> patchVnode  <==> updateChildren
- createElm addVnodes removeVnodes nodeOps 等辅助类

1. 只比较同一层级
2. tag 不相同，直接删掉重建，不深度比较
3. tag 和 key 都相同（**源码是用 sameVnode 函数判断，源码如下**），则认为是相同节点，进行 patchNode

```js
function sameVnode(a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}
```
