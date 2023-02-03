(function () {
    window.canvasLock = function (obj) {
        this.width = obj.width;
        this.height = obj.height;
        this.chooseType = obj.chooseType;
    }

    canvasLock.prototype.initDom = function () {
        var warp = document.createElement('div');   //创建一个div元素节点
        var str = "<h4 id='title' class='title'>绘制解锁图案</h4>"
        warp.setAttribute('style', 'position:absolute; top:0; left:0; right:0; bottom :0;')   //设置部分属性

        var canvas = document.createElement('canvas');
        canvas.setAttribute('id', 'canvas');
        canvas.style.cssText = 'style', 'background-color: #305066; display:inline-block; margin-top: 15px';

        warp.innerHTML = str;
        warp.appendChild(canvas);
        document.body.appendChild(warp);

        var width = this.width || 300;
        var height = this.height || 300;

        canvas.style.width = width + "px";
        canvas.style.height = height + "px";

        canvas.width = 300;
        canvas.height = 300;
    }

    canvasLock.prototype.drawCle = function (x, y) {
        this.ctx.strokeStyle = '#CFE6FF';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.r, 0, 2 * Math.PI, true);
        this.ctx.closePath();
        this.ctx.stroke();
    }

    canvasLock.prototype.createCircle = function () {
        var n = this.chooseType;  //一行多少个
        var r = this.r = this.ctx.canvas.width / (2 + 4 * n);  //半径
        var count = 0;


        this.lastPoint = [];
        this.restPoint = [];

        this.arr = [];        //放圆对象的中心点坐标
        for (var i = 0; i < n; i++) {
            for (var j = 0; j < n; j++) {
                var obj = {
                    x: j * 4 * r + 3 * r,
                    y: i * 4 * r + 3 * r, 
                    index: count
                };
                this.arr.push(obj);
            }
        }


        for (var i = 0; i < this.arr.length; i++) {
            this.drawCle(this.arr[i].x, this.arr[i].y);    //画圆函数
        }

    }




    canvasLock.prototype.init = function () {
        this.initDom();
        this.canvas = document.getElementById("canvas");
        this.ctx = canvas.getContext('2d');
        this.touchFlag = false;
        this.createCircle();
        this.bindEvent();
    }

    canvasLock.prototype.bindEvent = function () {
        var self = this;

        this.canvas.addEventListener("touchstart", function (e) {
            // 2、touchstart判断是否点击的位置处于圆内getPosition，处于则初始化
            //          * lastpoint、restPoint

            // po有x和y，并且是相较于canvas边距
            var po = self.getPosition(e);
            // console.log(po.x)
            // 判断是否在圆内的原理：多出来的这条 x/y < r 在圆内
            for (var i = 0; i < self.arr.length; i++) {
                if (Math.abs(po.x - self.arr[i].x) < self.r && Math.abs(po.y - self.arr[i].y) < self.r) {

                    self.touchFlag = true;
                    // lastPoint存放的就是选中的圆圈的x/y坐标值
                    self.lastPoint.push(self.arr[i]);
                    self.restPoint.splice(i, 1);
                    break;
                }
            }
        }, false);

        this.canvas.addEventListener("touchmove", function (e) {

        }, false);

        this.canvas.addEventListener("touchend", function (e) {

        }, false);
    }

    canvasLock.prototype.getPosition = function (e) {// 获取touch点相对于canvas的坐标
        var rect = e.currentTarget.getBoundingClientRect();
        var po = {
            x: (e.touches[0].clientX - rect.left),
            y: (e.touches[0].clientY - rect.top)
        };
        return po;
    }


})()
