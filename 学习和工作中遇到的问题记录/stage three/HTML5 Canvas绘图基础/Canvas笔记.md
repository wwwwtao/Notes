Canvas 默认宽高 300 X 150

要在脚本中对画布进行操作
Canvas.getContext(contextID)
参数 contextID 指定了您想要在画布上绘制的类型。当前唯一的合法值是 "2d"，它指定了二维绘图，并且导致这个方法返回一个环境对象，该对象导出一个二维绘图 API。

改变 canvas 宽高只能在 html 标签中 或者在 js 中书写    （画布大小）
在 css 中书写宽高不会改变 canvas 的宽高只会使画布缩放成 css 中宽高的大小  （画布被拉伸后的大小）

var Canvas = Canvas 的 dom 对象
var ctx = Canvas.getContext("2d")

                                            第 3 章 canvas 画直线、矩形、圆
ctx.beginPath();        // 重新规划路径
ctx.moveTo(0,0);        // 画笔起始的位置
ctx.lineTo(100,100);    // 画笔将动到的位置
ctx.lineTo(100,200);    // 画笔将动到的位置 从上一个位置
ctx.stroke();           //  绘画（描边） !!!   ctx.strokeStyle = "red";               // 描边的样式
ctx.fill();             //  填充 !!!         ctx.fillStyle = "rgba(0,0,255,0.5)";   // 填充的样式  还有填充的矩形 ctx.fillRect();

ctx.closePath()         // 闭合路径（起点到终点）
ctx.lineWidth = 10;     // 设置描边的线条宽度

画矩形
ctx.strokeRect(x,y,width,height);
//  x,y 就是左上角坐标  w，h 矩形的宽高  此方法封装了 stroke() 可以直接绘制
画圆
ctx.arc(x,y,r,sAngle,eAngle,counterclockwise);
//  x,y 就是圆心的坐标 r 是圆的半径
//  sAngle	起始角，以弧度计。（弧的圆形的三点钟位置是 0 度）。 （Math.PI 是 180 度）!!!!!
//  eAngle	结束角，以弧度计。
//  counterclockwise	可选。规定应该逆时针还是顺时针绘图。False = 顺时针，true = 逆时针。

                                      第 4 章 canvas 图形变换
ctx.translate(x,y);     // 平移后的原点位置

context.scale(scalewidth,scaleheight)   // 缩放  缩放当前的宽高 (1=100%, 0.5=50%, 2=200%, 依次类推）
注意：缩放的是整个画布，缩放后，继续绘制的图形会被放大或缩小

context.rotate(angle);  // 方法旋转当前的绘图
注意参数是弧度（PI），如需将角度转换为弧度，请使用 degrees*Math.PI/180 公式进行计算

ctx.save() 和 restore() 方法
保存了上下文的环境，包括图形变换和样式

                                      第 5 章 canvas 中的渐变
createLinearGradient(x,y,x1,y1) - 创建线条渐变

createRadialGradient(x0,y0,r0,x1,y1,r1)  径向渐变  返回 CanvasGradient
六个参数分别是
        起点圆心坐标（x0,y0）       起点圆心半径（r0）
        终点圆心坐标（x1,y1）       终点圆心​半径（r1）

addColorStop(index,color) 方法指定颜色停止，参数使用 index 来描述，index 范围在 0-1 之间，0.5 即给定横纵坐标的 50%，color 给定当前渐变点 index 出的颜色。其中，当我们使用渐变对象，必须使用两种或两种以上的停止颜色。
使用渐变，设置 fillStyle 或 strokeStyle 的值为渐变。  ②二

                                        第 6 章 canvas 中文字和图片的绘制

var str = "hello world";        // 文字

ctx.fillText(str,300,0);        // 填充文本
ctx.strokeText(str,0,300);      // 描边文本

ctx.font = "50px sans-serif";   // 设置文字样式
/*
     * font 参数的值分为
     * font-style: normal（正常）, italic（斜体字）, oblique（倾斜字体） 后两种在网页端一般没什么区别
     * font-variant: normal（正常）, small-caps（英文小写字母变成小的大写）
     * font-weight: normal（正常）, bold（加粗） 100-900（一般不用）
     * font-size: 文字大小
     * font-family: 字体样式
     */

ctx.textAlign = "center";       // 设置文字水平对齐 left center right （那个方向在坐标点上）

ctx.textBaseline = "";          // 设置垂直对齐 top middle bottom

ctx.measureText(str).width;     // 获取文本宽度

var img;                        // 图像
img.onload = function() {       // 一定要在图像加载完成后的回调中绘制图像
    // 在 x，y 处绘制图像
    ctx.drawImage(img,x,y);
    // 在画布上定位图像，并规定图像的宽度和高度：
    context.drawImage(img,x,y,width,height);
    // 获取 img 图像的 (0,0) 点处的 40X40 区域 , 绘制在 (100,100) 点处，缩放成 80X80
    context.drawImage(img,0,0,40,40,100,100,80,80);
    context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);  sx: 可选。开始剪切的 x 坐标位置。
}

// 创建图形画刷
var pattern  =  ctx.createPattern(img,"参数");  // 参数有 repeat no-repeat  repeat-x repeat-y
ctx.fillStyle = pattern;   ③三

                                            第 7 章 canvas 中剪辑、阴影以及曲线的绘制

// 区域剪辑
clip() 方法从原始画布中剪切任意形状和尺寸。

提示：一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内（不能访问画布上的其他区域）。您也可以在使用 clip() 方法前通过使用 save() 方法对当前画布区域进行保存，并在以后的任意时间对其进行恢复（通过 restore() 方法）。

// 阴影
// 阴影的 X 偏移
ctx.shadowOffsetX = X 轴的偏移；
// 阴影的 Y 偏移
ctx.shadowOffsetY = Y 轴的偏移；
// 阴影的颜色
shadowColor
// 阴影的模糊值  越大越模糊
shadowBlur
ctx.save() 和 restore() 方法
保存了上下文的环境，包括图形变换和样式

// 绘制二次样条曲线
ctx.beginPath();
ctx.moveTo(x,y);
ctx.quadraticCurveTo(x,y,x1,y1);
ctx.fill();

// 绘制贝塞尔曲线
ctx.beginPath();
ctx.moveTo(x,y);
ctx.bezierCurveTo(x,y,x1,y1,x2,y2);
ctx.fill();

                                                第 8 章 canvas 中的动画

ctx.clearRect(x,y,width,height);        // 清空画布的一个矩形区域

                                                第 9 章 canvas 离屏技术

drawImage;
