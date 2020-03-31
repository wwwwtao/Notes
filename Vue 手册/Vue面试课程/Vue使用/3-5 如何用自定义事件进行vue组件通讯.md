## 通过一个 Vue 实例绑定一个自定义事件

## 需要通过 $once 解绑自定义事件

```javascript
mounted(){
 const timer = setInterval(()=>{
    console.log(1)
 },1000)
 this.$once('hook:beforeDestroy',()=>{
  clearInterval(timer)
 })
}
```
