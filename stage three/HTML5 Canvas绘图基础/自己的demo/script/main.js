

var cardCanvas = document.getElementById("cardCanvas");
var cardCtx = cardCanvas.getContext("2d");
cardCtx.canvas.width = 600;
cardCtx.canvas.height = 100;

var img = new Image();
img.src = "images/logo.png";
img.onload = function () {  //一定要在图像加载完成后的回调中绘制图像
    //在x，y处绘制图像
    cardCtx.drawImage(img, 10, 10);
}

var linearGradient = cardCtx.createLinearGradient(0, 50, 600, 50);
linearGradient.addColorStop(0.5, 'rgb(0,0,0)');
linearGradient.addColorStop(1, 'rgb(133,133,133)');
cardCtx.fillStyle = linearGradient;
cardCtx.fillRect(0, 0, cardCtx.canvas.width, cardCtx.canvas.height);

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
if (maxWidth < nameWidth) {
    maxWidth = nameWidth;
}
if (maxWidth < addressWidth) {
    maxWidth = addressWidth;
}
if (maxWidth < jobWidth) {
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
solganWidth = cardCtx.measureText(slogan).width;
var offset = (cardCtx.canvas.width - 115 - maxWidth - solganWidth) / 2;
cardCtx.fillText(slogan, 115 + maxWidth + offset, 50);
// 画曲线
cardCtx.beginPath();
cardCtx.moveTo(115 + maxWidth + offset, 70);
cardCtx.quadraticCurveTo(115 + maxWidth + offset, 50, 115 + solganWidth + maxWidth + offset, 60);
cardCtx.strokeStyle = "#ddd";
cardCtx.stroke();
cardCtx.restore();