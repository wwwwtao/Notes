```XML
<div ref=(div)=>{this.divElem=div}> ref是一个函数 他接受一个参数 这个参数是标签的DOM节点或是JS实例 </div>
```

## ref 写在 html 标签上，获取的是 DOM 节点

## ref 写在组件标签上，获取的是 JS 实例

## setState 是异步的 （解决方法如下 等同 Vue.nextTick)

```javascript
this.setState(()=>{
    return {
        value: newvalue
    }
},()=>{
    console.log("setState里面写函数,那么可以写多个参数. 第一个函数执行完就会执行第二个函数")
})
```
