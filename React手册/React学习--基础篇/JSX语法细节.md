1. 事件的 bind(this) 放到 constructor 中去写

2. map 之类的语法放到了函数中去管理 而不是 render() 中 使页面渲染部分的函数更简洁明了

3. 标签的 class 要用 className  for 要用 htmlFor

4. dangerouslySetInnerHTML={{ __html: value }} 用来把后端传来的 html 直接渲染出来
