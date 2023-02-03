// 移动开发 用 meta 规定视口
   <meta name="viewport" content="width=device-width,initial-scale=1, user-scalable=no,maximum-scale=1,minimum-scale=1">
    width=device-width // 视口宽度等于屏幕宽  initial-scale=1 // 缩放比例为 1  user-scalable=no // 不允许用户缩放   maximum-scale=1,minimum-scale=1 // 最大最小缩放

    var viewWidth =  document.documentElement.clientWidth || window.innerWidth;  // 视口宽度
                     window.devicePixelRatio    //Dpr

    box-sizing: border-box || content-box  // 宽度从 border 起算  / 宽度从内容区起算

    <--------------------------flex 布局 --------------------->源码中 3.4 容器属性。html 中有详细说明
    项目默认沿主轴排列  不论块元素还是行内元素
    flex：将对象作为弹性伸缩盒显示
    inline-flex：将对象作为内联块级弹性伸缩盒显示   （内容撑开宽度）

    flex-direction: row | row-reverse | column | column-reverse  // 属性决定主轴的方向（即项目的排列方向）
    row-reverse：主轴为水平方向，起点在右端  （注意起点变到了右方）
    column：主轴为垂直方向，起点在上沿
    column-reverse：主轴为垂直方向，起点在下沿

    .box{ flex-wrap: nowrap | wrap | wrap-reverse; } flex-wrap 属性定义，如果一条轴线排不下，如何换行
    wrap：换行，第一行在上方
    wrap-reverse：换行，第一行在下方  （排列方向没换 )

    flex-flow 属性是 flex-direction 属性和 flex-wrap 属性的简写形式，默认值为 row nowrap

    justify-content 属性定义了项目在主轴上的对齐方式
    .box { justify-content: flex-start | flex-end | center | space-between | space-around; }
    flex-end：右对齐
    center： 居中
    space-between：两端对齐，项目之间的间隔都相等
    space-around：每个项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍

    align-items 属性定义项目在交叉轴上如何对齐
    .box { align-items: flex-start | flex-end | center | baseline | stretch; }
    flex-start：交叉轴的起点对齐
    flex-end：交叉轴的终点对齐
    center：交叉轴的中点对齐
    baseline: 项目的第一行文字的基线对齐
    stretch（默认值）：如果项目未设置高度或设为 auto，将占满整个容器的高度

    align-content 属性定义了多根轴线（多行）在交叉轴上的对齐方式
    .box { align-content: flex-start | flex-end | center | space-between | space-around | stretch; }
    flex-start：交叉轴的起点对齐
    flex-end：与交叉轴的终点对齐
    center：与交叉轴的中点对齐
    space-between：与交叉轴两端对齐，轴线之间的间隔平均分布
    space-around：每根轴线两侧的间隔都相等 所以，轴线之间的间隔比轴线与边框的间隔大一倍
    stretch（默认值）：轴线占满整个交叉轴

<-----------------------------------四、flex项目的属性--------------------------->
order 属性定义项目的排列顺序
数值越小，排列越靠前，默认为 0

flex-grow 属性定义项目的放大比例，默认为 0，即如果存在剩余空间，也不放大

如果所有项目的 flex-grow 属性都为 1，则它们将等分剩余空间（如果有的话）
如果一个项目的 flex-grow 属性为 2，其他项目都为 1，则前者占据的剩余空间将比其他项多一倍

flex-shrink 属性定义了项目的缩小比例，默认为 1，即如果空间不足，该项目将缩小   0 则不会缩小

flex-basis 属性定义了在分配多余空间之前，项目占据的主轴空间（main size）
浏览器根据这个属性，计算主轴是否有多余空间
它的默认值为 auto，即项目的本来大小

flex 属性是 flex-grow, flex-shrink 和 flex-basis 的简写，默认值为 0 1 auto
后两个属性可选

.item { align-self: auto | flex-start | flex-end | center | baseline | stretch; }
align-self 属性允许单个项目有与其他项目不一样的对齐方式，可覆盖 align-items 属性
默认值为 auto，表示继承父元素的 align-items 属性，如果没有父元素，则等同于 stretch

Absolution：元素会脱离文档流，定位是相对于离它最近的且不是 static 定位的父元素而言，若该元素没有设置宽度，则宽度由元素里面的内容决定，且宽度不会影响父元素，定位为 absolution 后，原来的位置相当于是空的，下面的的元素会来占据。

Relative：元素仍处于文档流中，定位是相对于原本自身的位置，若没有设置宽度，则宽度为父元素的宽度，该元素的大小会影响父元素的大小。
