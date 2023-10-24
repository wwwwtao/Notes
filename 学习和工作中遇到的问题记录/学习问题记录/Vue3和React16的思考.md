## **Vue 对比 React**

作者：Lucas HC
链接：https://www.zhihu.com/question/301860721/answer/724759264
来源：知乎

### 1. Vue 和 React 的核心差异，以及核心差异对后续设计产生的“不可逆”影响

第一点，首先我想明确一下：用 Evan you 的话说：**双向绑定是对表单来说的，表单的双向绑定，说到底不过是 value 的单向绑定 + onChange** **事件侦听的一个语法糖。这个并不是 React 和 Vue** **在理念上真正的差别体现。**同时，**单向数据流不是 Vue 或者 React 的差别，而是 Vue 和 React 的共同**默契**选择。**单向数据流核心是在于避免组件的自身（未来可复用）状态设计，它强调把 state hoist 出来进行集中管理。

而**真正我认为 React 和 Vue 在理念上的差别，且对后续设计实现产生不可逆影响的是：**Vue 进行数据拦截/代理，它对侦测数据的变化更敏感、更精确，也间接对一些后续实现（比如 hooks，function based API）提供了很大的便利。这个我们后面会提到；React 推崇函数式，它直接进行**局部重新刷新（或者重新渲染）**，这样更粗暴，但是更简单，让我们的开发回到了上古时代，就是刷新呗，前端开发非常简单。**但是 React 并不知道什么时候“应该去刷新”，触发局部重新变化是由开发者手动调用 setState** **完成。**

React setState 引起局部重新刷新。为了达到更好的性能，React 暴漏给开发者 shouldComponentUpdate 这个生命周期 hook，来避免不需要的重新渲染（**相比之下，Vue 由于采用依赖追踪，默认就是优化状态：你动了多少数据，就触发多少更新，不多也不少，而 React 对数据变化毫无感知，它就提供 React.createElement 调用已生成 virtual dom**）。
另外 **React 为了弥补不必要的更新，会对 setState** **的行为进行合并操作**。因此 setState 有时候会是异步更新，但并不是总是“异步”，具体可见我之前的回答：

[问一个react更新State的问题？324 赞同 · 29 评论回答![img](https://pic1.zhimg.com/v2-fa6a58770b478806afec2ac7f3230050_180x120.jpg)](https://www.zhihu.com/question/66749082/answer/246217812)

在设计上，这给开发者带来了额外的“心智负担”，也引出了一些潜在问题（我把它叫做 React-helmet 门（我编的），有机会再展开）。再次赘述，Vue 的响应式理念，进行数据拦截和代理中不存在类似问题（当然也有 batch 的操作）。

**这个设计上的差别，直接影响了 hooks 的实现和表现。**

React hook 底层是基于链表（Array）实现，每次组件被 render 的时候都会顺序执行所有的 hooks，因为底层是链表，每一个 hook 的 next 是指向下一个 hook 的，所以要求开发者不能在不同 hooks 调用中使用判断条件，因为 if 会导致顺序不正确，从而导致报错。如下代码会报错：

![React Hook--链表](./images/React%20Hook--%E9%93%BE%E8%A1%A8.jpeg)!

相反，vue hook 只会被注册调用一次**，vue 之所以能避开这些麻烦的问题，根本原因在于它对数据的响应是基于响应式的，是对数据进行了代理的。他不需要链表进行 hooks 记录，它对数据直接代理观察。**

**但是 Vue 这种响应式的方案，也有自己的困扰。**比如 useState() （实际上 evan 命名为 value()）返回的是一个 value wrapper （包装对象）。一个包装对象只有一个属性：.value ，该属性指向内部被包装的值。**我们知道在 JavaScript 中，原始值类型如 string 和 number 是只有值，没有引用的。不管是使用 Object.defineProperty 还是 Proxy，我们无法追踪原始变量后续的变化。**因此 Vue 不得不返回一个包装对象，不然对于基本类型，它无法做到数据的代理和拦截。这算是因为设计理念带来的一个非常非常微小的  side effect。从 Evan you 的截图中，我圈了出来：

![vue .value](./images/vue%20.value.jpeg)

简单说一下我个人的看法：事实上，**Mobx** **在 React 社区很流行，Mobx** **采用了响应式的思想，**实际上 Vue 也采用了几乎相同的反应系统。在一定程度上，**React + Mobx** **也可以被认为是更繁琐的 Vue。所以开发者习惯组合使用它们，那么（也许）选择 Vue 会更合理。**

**再来思考，Mobx 的流行也许也从侧面说明到底什么样的设计可能是更现代化的设计。**


### 2. Vue 和 React 在 API 设计风格和哲学理念（甚至作者个人魅力）上的不同

第二点，在设计哲学上。我认为 Evan you 很好地体现了中国人 humble 和 modest 的优良品质（开玩笑～），我选取了比较具有代表性的事件系统：

• React 事件系统庞大而复杂。其中，它暴漏给开发者的事件不是原生事件，是 React 包装过合成事件，并且**非常重要的一点是，合成事件是池化**的。也就是说不同的事件，可能会共享一个合成事件对象。另外一个细节是，React 对所有事件都进行了代理，将所有事件都绑定 document 上。请读者**仔细体会**下面的代码：

![React事件系统1](./images/React%E4%BA%8B%E4%BB%B6%E7%B3%BB%E7%BB%9F1.jpeg)

![React事件系统2](./images/React%E4%BA%8B%E4%BB%B6%E7%B3%BB%E7%BB%9F2.jpeg)

![React事件系统3](./images/React%E4%BA%8B%E4%BB%B6%E7%B3%BB%E7%BB%9F3.jpeg)
**你告诉我他们的输出值好不好？**

- 另外，React 中事件处理函数中**的 this 默认不指向组件实例。**我就懒得再细说这个了。
- Vue 事件系统我不多讲，大家看图：

![React事件系统4](./images//React%E4%BA%8B%E4%BB%B6%E7%B3%BB%E7%BB%9F4.jpeg)

- 当然 Vue 事件处理函数中**的 this 默认指向组件实例。**连源码都写的那么“清晰易懂”

![Vue事件系统1](./images/Vue%20%E4%BA%8B%E4%BB%B6%E7%B3%BB%E7%BB%9F1.jpeg)

简单说一下我个人的看法，**从事件 API** **上我们就能看出前端框架在设计的一个不同思路： React 设计是改变开发者，提供强大而复杂的机制，开发者按照我的来；Vue 是适应开发者，让开发者怎么爽怎么来。**

### 3. Vue 和 React 在工程化预编译构建阶段，AOT 和 JIT 优化的本质差异和设计

第三点，预编译优化问题。这个非常值得深挖，但是回答内容已然这么长了，我简单来讲吧。

Vue3.0 提出的动静结合的 DOM diff 思想，**我个人认为是 Vue 近几年在“创新”上的一个很好体现。**之所以能够做到动静结合的 DOM diff，或者把这个问题放的更大：之所以能够做到预编译优化，是因为 Vue core 可以静态分析 template，在解析模版时，整个 parse 的过程是利用正则表达式顺序解析模板，当解析到开始标签、闭合标签、文本的时候都会分别执行对应的回调函数，来达到构造 AST 树的目的。

![Vue编译](./images/Vue%E7%BC%96%E8%AF%91.webp)

![Vue编译1](./images//Vue%E7%BC%96%E8%AF%911.jpeg)



**我关心的是：React 能否像 Vue 那样进行预编译优化？？？**

Vue 需要做数据双向绑定，需要进行数据拦截或代理，那它就需要在预编译阶段静态分析模版，分析出视图依赖了哪些数据，进行响应式处理。而 React 就是局部重新渲染，React 拿到的或者说掌管的，**所负责的就是一堆递归 React.createElement** **的执行调用，它无法从模版层面进行静态分析。**

**因此 React JSX 过度的灵活性导致运行时可以用于优化的信息不足。**

但是，**在 React 框架之外，我们作为开发者还是可以通过[工程化](https://www.zhihu.com/search?q=工程化&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A724759264})手段达到类似的目的，**因为我们能够接触到 JSX 编译成 React.createElement 的整个过程。开发者在项目中开发 babel 插件，实现 JSX 编译成 React.createElement，那么优化手段就是是从编写 babel 插件开始：

![React编译](./images/React%E7%BC%96%E8%AF%91.jpeg)

**（这里我不再展开优化的原理和代码实现了，不增加额外的“心智负担”，感兴趣的同学可以关注我，或者关注 GIAC 全球互联网架构大会我的分享）**

**当然 React 并不是没有意识到这个问题，他们在积极的同 prepack 合作。力求弥补构建优化的先天不足。**

Prepack 同样是 FaceBook 团队的作品。**它让你编写普通的 JavaScript 代码，它在构建阶段就试图了解代码将做什么，然后生成等价的代码，减少了运行时的计算量，就相当于 JavaScript 的部分求值器。**

我就用 Prepack 结合 React 尝了个鲜：

![img](https://pica.zhimg.com/50/v2-e760599d64ff8b34a37cc4dd8adf9578_720w.jpg?source=1940ef5c)

对比：

![img](https://pica.zhimg.com/50/v2-d6eab0819908ada6a9b1c11f2ec731af_720w.jpg?source=1940ef5c)

**这不正是 React 梦寐以求的吗？**

另外一个 React 的方向就是 fiber 时间分片了， 

[@尤雨溪](http://www.zhihu.com/people/cfdec6226ece879d2571fbc274372e9f)

 说过（可能也是玩笑，说者无意，也可能是我没有幽默感，认真解读了）：“**React 是伤害已经造成，无法自身在预编译阶段做到更多，时间分片这样的优化只是在弥补伤害**”。其实作为 React 的粉丝，这里吹了这么久 Vue，我发表一下我的想法：这反倒算是 React 多管齐下的一个做法。

最后，上一个借助 Babel plugin AST 实现一个类似预编译优化：remove inline functions 的小例子。

![预编译优化：remove inline functions 的小例子前](./images/%E9%A2%84%E7%BC%96%E8%AF%91%E4%BC%98%E5%8C%96%EF%BC%9Aremove%20inline%20functions%20%E7%9A%84%E5%B0%8F%E4%BE%8B%E5%AD%90%20%E5%89%8D.jpeg)

预编译后：

![预编译优化：remove inline functions 的小例子后](./images/%E9%A2%84%E7%BC%96%E8%AF%91%E4%BC%98%E5%8C%96%EF%BC%9Aremove%20inline%20functions%20%E7%9A%84%E5%B0%8F%E4%BE%8B%E5%AD%90%E5%90%8E.webp)


**考量和设计一个前端解决方案的时候，向上扩展和向下兼容是非常重要的。Vue** **向上扩展就是 React，Vue** **向下兼容后就类似于 jQuery，[渐进式](https://www.zhihu.com/search?q=渐进式&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A724759264})有时候比革命性更符合时代的要求。**

比如这个文稿页使用 React 渲染富文本生成的完整页面：

![img](https://pica.zhimg.com/50/v2-7aba71f7bb2c30adbdd26d33148a39fe_720w.jpg?source=1940ef5c)

![img](https://pic3.zhimg.com/50/v2-6bba02d9feb3730a28c2b1b03ed46cb3_720w.jpg?source=1940ef5c)

后端返回了富文本内容，过了几天产品的需求是实现：

![img](https://pic2.zhimg.com/50/v2-57b72d01c3177eb31e3be320ccd4f5cd_720w.jpg?source=1940ef5c)

添加笔记，且在划线高亮当前行后添加笔记内容，以及点击弹出动态 tooltip 等等。。。想想用 React 该怎么做，且做的符合 React 思想？
