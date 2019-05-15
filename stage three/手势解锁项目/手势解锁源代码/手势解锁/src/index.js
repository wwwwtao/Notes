(function () {
    /**
     * 实现画圆和划线：
     * 1、添加事件touchstart、touchmove、touchend
     * 2、touchstart判断是否点击的位置处于圆内getPosition，处于则初始化
     * lastpoint、restPoint
     * 3、touchmove做的就是：画圆drawPoint和画线drawLine
     *
     * 实现自动画圆的效果
     * 1、检测手势移动的位置是否处于圆内
     * 2、圆内的话则画圆 drawPoint
     * 3、已经画过实心圆的圆，无需重复检测
     *
     * 实现解锁成功：
     * 1、检测路径是否是对的
     * 2、如果是对的就重置，圆圈变绿
     * 3、不对也重置，圆圈变红
     * 4、重置
     */

    window.canvasLock = function (obj) {
        this.height = obj.height;
        this.width = obj.width;
        this.chooseType = obj.chooseType;
    };

    // js方式动态生成dom
    canvasLock.prototype.initDom = function () {
        var wrap = document.createElement('div');
        var str = '<h4 id="title" class="title">绘制解锁图案</h4>';
        wrap.setAttribute('style', 'position: absolute;top:0;left:0;right:0;bottom:0;');


        var canvas = document.createElement('canvas');
        canvas.setAttribute('id', 'canvas');
        canvas.style.cssText = 'background-color: #305066;display: inline-block;margin-top: 15px;';

        wrap.innerHTML = str;
        wrap.appendChild(canvas);

        var width = this.width || 300;
        var height = this.height || 300;

        document.body.appendChild(wrap);

        // 高清屏锁放
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";

        canvas.width = width;
        canvas.height = height;

    }
    canvasLock.prototype.drawCle = function (x, y) { // 初始化解锁密码面板
        this.ctx.strokeStyle = '#CFE6FF';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.r, 0, Math.PI * 2, true);
        this.ctx.closePath();
        this.ctx.stroke();
    }
    canvasLock.prototype.createCircle = function () {// 创建解锁点的坐标，根据canvas的大小来平均分配半径

        var n = this.chooseType;
        var count = 0;
        this.r = this.ctx.canvas.width / (2 + 4 * n);// 公式计算
        this.lastPoint = [];
        this.arr = [];
        this.restPoint = [];
        var r = this.r;
        for (var i = 0; i < n; i++) {
            for (var j = 0; j < n; j++) {
                count++;
                var obj = {
                    x: j * 4 * r + 3 * r,
                    y: i * 4 * r + 3 * r,
                    index: count
                };
                this.arr.push(obj);
                this.restPoint.push(obj);
            }
        }

        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        for (var i = 0; i < this.arr.length; i++) {
            // 画圆函数
            this.drawCle(this.arr[i].x, this.arr[i].y);
        }
        //return arr;
    }

    // 程序初始化
    canvasLock.prototype.init = function () {
        this.initDom();
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.touchFlag = false;
        // 1、确定半径
        // 2、确定每一个圆的中心坐标点
        // 3、一行3个圆14个半径，一行4个圆有18个半径
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

            // touchmove做的就是：画圆drawPoint和划线drawLine
            if (self.touchFlag) {
                self.update(self.getPosition(e));
            }
        }, false);

        this.canvas.addEventListener("touchend", function (e) {
            if (self.touchFlag) {
                self.storePass(self.lastPoint);
                setTimeout(function () {
                    self.reset();
                }, 300);
            }
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


    canvasLock.prototype.update = function (po) {// 核心变换方法在touchmove时候调用
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // 重新画9个圆圈
        for (var i = 0; i < this.arr.length; i++) { // 每帧先把面板画出来
            this.drawCle(this.arr[i].x, this.arr[i].y);
        }

        this.drawPoint();// 画圆
        this.drawLine(po);// 画线

        // 1、检测手势移动的位置是否处于下一个圆内
        // 2、圆内的话则画圆 drawPoint
        // 3、已经画过实心圆的圆，无需重复检测
        for (var i = 0; i < this.restPoint.length; i++) {
            if (Math.abs(po.x - this.restPoint[i].x) < this.r && Math.abs(po.y - this.restPoint[i].y) < this.r) {
                this.drawPoint();
                this.lastPoint.push(this.restPoint[i]);
                this.restPoint.splice(i, 1);
                break;
            }
        }

        // console.log(this.lastPoint)

    }
    canvasLock.prototype.drawLine = function (po) {// 解锁轨迹
        this.ctx.beginPath();
        this.ctx.lineWidth = 3;
        this.ctx.moveTo(this.lastPoint[0].x, this.lastPoint[0].y);
        for (var i = 1; i < this.lastPoint.length; i++) {
            this.ctx.lineTo(this.lastPoint[i].x, this.lastPoint[i].y);
        }
        this.ctx.lineTo(po.x, po.y);
        this.ctx.stroke();
        this.ctx.closePath();
    }
    canvasLock.prototype.drawPoint = function () { // 初始化圆心 
        for (var i = 0; i < this.lastPoint.length; i++) {
            this.ctx.fillStyle = '#CFE6FF';
            this.ctx.beginPath();
            this.ctx.arc(this.lastPoint[i].x, this.lastPoint[i].y, this.r / 2, 0, Math.PI * 2, true);
            this.ctx.closePath();
            this.ctx.fill();
        }
    }

    // 1、检测路径是否是对的
    // 2、如果是对的就重置，圆圈变绿
    // 3、不对也重置，圆圈变红
    // 4、重置
    canvasLock.prototype.storePass = function () {
        if (this.checkPass()) {
            document.getElementById('title').innerHTML = '解锁成功';
            this.drawStatusPoint('#2CFF26');
        } else {
            document.getElementById('title').innerHTML = '解锁失败';
            this.drawStatusPoint('red');
        }
    }
    canvasLock.prototype.checkPass = function () {
        var p1 = '123',
            p2 = '';
        for (var i = 0; i < this.lastPoint.length; i++) {
            p2 += this.lastPoint[i].index;
        }
        return p1 === p2;
    }
    canvasLock.prototype.drawStatusPoint = function (type) {
        for (var i = 0; i < this.lastPoint.length; i++) {
            this.ctx.strokeStyle = type;
            this.ctx.beginPath();
            this.ctx.arc(this.lastPoint[i].x, this.lastPoint[i].y, this.r, 0, Math.PI * 2, true);
            this.ctx.closePath();
            this.ctx.stroke();
        }
    }
    canvasLock.prototype.reset = function () {
        this.createCircle();
    }
})();
