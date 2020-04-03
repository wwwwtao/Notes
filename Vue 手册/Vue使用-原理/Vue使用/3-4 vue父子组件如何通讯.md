1. props 和 $emit

2. $children $children 用来访问子组件实例，要知道一个组件的子组件可能是不唯一的，所以它的返回值是数组。

3. $refs 调用 helloworld 子组件的时候直接定义一个 ref，这样就可以通过 this.$refs.hello. 属性 获取所需要的的数据。

4. $parent $parent 用来访问父组件实例，通常父组件都是唯一确定的，跟 $children 类似

5. inheritAttrs  inheritAttrs 属性控制子组件 html 属性上是否显示父组件的提供的属性。

6. $attrs 可以获取到没有使用的注册属性，如果需要，我们在这也可以往下继续传递。

7. .sync
