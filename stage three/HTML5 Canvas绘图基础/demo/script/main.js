
// 创建和设置cardCanvas，该canvas作为离屏canvas
var cardCanvas = document.getElementById('cardCanvas');
var cardCtx = cardCanvas.getContext('2d');
cardCtx.canvas.width = 600;
cardCtx.canvas.height = 100;

// 加载图片
var img = new Image();
img.src = "images/logo.png";
img.onload = function() {
  cardCtx.drawImage(img, 10, 10);
}

var generateBtn = document.getElementById("generateBtn");
generateBtn.onclick = function() {
  cardCtx.clearRect(0, 0, cardCtx.canvas.width, cardCtx.canvas.height);
  // 背景的线性渐变
  var linearGradient = cardCtx.createLinearGradient(0, 0, cardCtx.canvas.width, cardCtx.canvas.height);
  linearGradient.addColorStop(0.5, 'rgb(0,0,0)');
  linearGradient.addColorStop(1, 'rgb(133,133,133)');
  cardCtx.fillStyle = linearGradient;
  cardCtx.fillRect(0, 0, cardCtx.canvas.width, cardCtx.canvas.height);
  // logo图像
  cardCtx.drawImage(img, 10, 10);
  // 获取姓名、地址、职业，绘制，并计算长度
  var name = document.getElementById("name").value || "请输入姓名";
  var address = document.getElementById("address").value || "请输入地址";
  var job = document.getElementById("job").value || "请输入职业";
  var nameWidth, addressWidth, jobWidth, maxWidth = 0;
  cardCtx.font = "bold 30px sans-serif";
  cardCtx.fillStyle = "#fff";
  cardCtx.fillText(name, 105, 35);
  cardCtx.font = "bold 20px sans-serif";
  cardCtx.fillText(address, 105, 60);
  cardCtx.fillText(job, 105, 85);
  nameWidth = cardCtx.measureText(name).width;
  addressWidth = cardCtx.measureText(address).width;
  jobWidth = cardCtx.measureText(job).width;
  if(maxWidth < nameWidth) {
    maxWidth = nameWidth;
  }
  if(maxWidth < addressWidth) {
    maxWidth = addressWidth;
  }
  if(maxWidth < jobWidth) {
    maxWidth = jobWidth;
  }
  // 绘制口号
  var slogan = document.getElementById("slogan").value || "请输入口号";
  cardCtx.save();
  // 做图形变换
  cardCtx.rotate(-0.1);
  cardCtx.translate(0, 50);
  // 阴影
  cardCtx.shadowOffsetX = 10;
  cardCtx.shadowOffsetY = 10;
  cardCtx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  cardCtx.shadowBlur = 1.5;
  cardCtx.fillStyle = "#ddd";
  // 计算口号位置
  var solganWidth;
  var offset = (cardCtx.canvas.width - 115 - maxWidth - solganWidth) / 2;
  cardCtx.fillText(slogan, 115 + maxWidth + offset, 50);
  solganWidth = cardCtx.measureText(slogan).width;
  // 画曲线
  cardCtx.beginPath();
  cardCtx.moveTo(115 + maxWidth + offset, 70);
  cardCtx.quadraticCurveTo(115 + maxWidth + offset, 50, 115 + solganWidth + maxWidth + offset, 60);
  cardCtx.strokeStyle = "#ddd";
  cardCtx.stroke();
  cardCtx.restore();
}
// 触发click事件
generateBtn.click();

// 创建和设置animCanvas，该canvas才是真正的显示
var animCanvas = document.getElementById('animCanvas');
var animCtx = animCanvas.getContext('2d');
animCtx.canvas.width = 600;
animCtx.canvas.height = 100;

var circles = [];
setInterval(function() {
  // 擦出画布
  animCtx.clearRect(0, 0, animCtx.canvas.width, animCtx.canvas.height);
  // 把离屏canvas的内容画进来
  animCtx.drawImage(cardCanvas, 0, 0, animCtx.canvas.width, animCtx.canvas.height,
    0, 0, cardCtx.canvas.width, cardCtx.canvas.height);
  // 绘制下落的圆形
  for(var i=0; i<=10; i++) {
    if(!circles[i]) {   //空数组等于false
      circles[i] = {};
      circles[i].radius = Math.floor(Math.random() * 5) + 1;  //1-6之间的随机整数  作圆的半径
      circles[i].y = - circles[i].radius - Math.floor(Math.random() * 10);// 0-9之间的随机整数
      circles[i].x = i * 60 + Math.floor(Math.random() * 10) - 5;  //-5 - 5 之间的随机整数 每个循环加60
      circles[i].vy = Math.floor(Math.random() * 5) + 1;  //1-6之间的随机整数
    }
    animCtx.beginPath();
    animCtx.arc(circles[i].x, circles[i].y, circles[i].radius, 0, Math.PI * 2);
    animCtx.fillStyle = "rgba(255, 255, 255, 0.5)";
    animCtx.fill();
    circles[i].y = circles[i].y + circles[i].vy;
    if(circles[i].y > animCtx.canvas.height + circles[i].radius * 2) {  //圆落出去清空
      circles[i] = undefined;
    }
  }
}, 100);
