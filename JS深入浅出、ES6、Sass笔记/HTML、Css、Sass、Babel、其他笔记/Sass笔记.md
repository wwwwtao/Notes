### 慕课网 Scss 文档

https://class.imooc.com/course/824

1. 变量
    Sass 中定义变量的语法是：美元符号、变量名、冒号、变量值。$name: value;
    变量支持块级作用域，嵌套内定义的变量成为局部变量，只能在当前嵌套内使用，在顶层定义的变量成为全局变量，可以在所有地方使用
    !global 可以将局部变量转换为全局变量，用于结尾  !default 默认变量，不会重新赋值已经赋值的变量，但是没有赋值的变量会赋予值

     A. 普通变量 $variable-name: value;
     B. 默认变量 $variable-name: value !default;
     C. 多值变量 $variable-name: value1 value2 value3;
       Sass 可以定义多值变量， 多值变量可以分为 list 类型和 map 类型，对应于 JavaScript 的数组和对象。
        list 类型变量，是以空格，逗号或者括号来分割多个值，
        可用 nth($list, n) 函数来取值。
        可用 index($list, value) : 找出指定元素的数组下标
        map 类型变量，是以 key-value 成对定义的，格式为：$map(key1: value1, key2: value2, key3: value3)，其中 value 值又可以为普通变量或者 list 变量。
        可用 map-get($map, $key) 来取值。

    /* 加减乘除 */
    font: (10px/8);  带括号！ 有一个带单位
    /*颜色运算*/
    mix($color1, $color2);   sass 中取混合色的方法  rgb(red($color3),green($color3),blue($color3)); sass 三原色的方法 0-255 拼起来就是 rgba 颜色

    scss 的 @import 规则在生成 css 文件时就把相关文件导入进来。这意味着所有相关的样式被归纳到了同一个 css 文件中，而无需发起额外的下载

    通过#{} 插值语句可以在选择器或属性名中使用变量 在字符串中使用，用#{}包含变量

    2. 嵌套
    （1）普通嵌套  scss 允许将一套 css 样式套进另一套样式中，内层的样式为外层样式的子选择器
    （2）父选择器  scss 用 & 符号代表嵌套规则外层的父选择器
    （3）属性嵌套  sass 允许同一个属性嵌套在命名空间中
    （4）@import 嵌套样式

    7. 控制指令
    （1）@if,@else if
    （2）@for   $variable from startNum to endNum   (to 循环时不包括 endNum 这个数，through 循环时包括 endNum 这个数）
    （3）@each  @each $variable in list/map
            @each $key , $value in $map {#{$key}:$value;}

    8. 混合指令
    混合指令用于定义可重复使用的样式，避免了使用无语意的 class
    （1）定义混合样式 @mixin
    （2）引用混合样式 @include
    （3）混合样式带参数     普通参数    默认参数    参数变量
    （4）在混合指令中导入内容 @content

    9. 占位符与继承
    %div
    @extend %div;

    10. 函数
    @function 命令定义函数，@return 定义函数返回值。
        @function func() {
            @return 13px;
        }
        font-size: func();

    11. 内置函数
    看慕课网笔记
    random( value )  value: 可选 不写就是 0-1 之间随机数 写了就是 0-value 之间的整数随机数

    数组类：
    length($list): 获取数组长度；
    nth($list,$n): 获取指定词表的元素，下标从 1 开始；
    set-nth($list,$n,$value): 替换指定下标的元素；
    join($list1,$list2): 拼接数组；
    append($list,$val,[$separator]): 从数组尾部添加元素；
    index($list,$value): 返回指定元素在数组中的位置；
