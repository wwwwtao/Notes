解决方法把取值方式  由 e.target.dataset.current;  修改为 e.currentTarget.dataset.current 即可

### currentTarget 和 target 的区别：

target 指向的是触发事件的元素

currentTarget 指向的是捕获事件的元素（也就是元素自身）

bind 事件绑定不会阻止冒泡事件向上冒泡，catch 事件绑定可以阻止冒泡事件向上冒泡。
