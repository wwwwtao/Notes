### hash

1. window.onhashchange （监听浏览器前进 后退）

### history（需要后端支持 不管访问什么页面都返回主页面 index.html 前端自己做路由跳转）

1. history.pushState （路由的切换）

2. window.onpopstate （监听浏览器前进 后退）

### 两者如何选择

1. to B 的系统推荐用 hash，简单易用，对 url 规范不敏感

2. to C 的系统可以考虑用 history，但需要服务端支持 (SEO 优化）

3. 能用简单的，就行 成本
