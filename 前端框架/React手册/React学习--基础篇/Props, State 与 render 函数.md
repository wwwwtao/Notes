## Props（属性）, State（数据） 与 render 函数

1. 当组件初次创建的时候，render 函数会被执行一次

2. 当 State 数据发生变更的时候，render 函数会被重新执行

3. 当 Props 数据发生变更的时候，render 函数会被重新执行

## setState 是异步的 （解决方法如下 等同 Vue.nextTick)

```javascript
this.setState(()=>{
    return {
        value: newvalue
    }
},()=>{
    console.log("setState里面写函数,那么可以写多个参数. 第一个函数执行完就会执行第二个函数")
})
