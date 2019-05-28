//形变类
class Transform {
    constructor(selector) {
        //执行动画的元素 传入选择器
        this.el = document.querySelector(selector);

        //存放动画的队列
        this._queue = [];
        //动画默认的时间
        this.defaultTime = Transform.config.defaultTime;
        //动画执行的属性 
        this._transform = {
            translate: "",
            rotate: "",
            scale: ""
        };
    }

    // 位移
    translate(value, time) {
        return this._add('translate', value, time);
    }

    // 缩放
    scale(value, time) {
        return this._add('scale', value, time);
    }

    // 形变
    rotate(value, time) {
        return this._add('rotate', value, time);
    }

    // 添加动画  类型 执行内容 时间 入栈
    _add(type, value, time = this.defaultTime) {
        this._queue.push({ type, value, time });
        return this;
    }

    // 添加完成 开始进行动画
    done() {
        this._start();
    }

    // 执行动画
    _start() {
        if (!this._queue.length) return;
        // 动画的异步开始
        requestAnimationFrame(() => {
            // 先进先出
            const info = this._queue.shift();
            //设置动画时间
            this.el.style.transition = `all ${info.time}ms`;
            //设置动画  设置css时要特别注意 下次设置时是否会覆盖之前的效果
            this.el.style.transform = this._getTransform(info);
            setTimeout(() => {
                this._start();
            }, info.time)
        }, 0)

    }


    _getTransform({ type, value }) {
        switch (type) {
            case 'translate':
                this._transform.translate = `translate(${value})`
                break;
            case 'rotate':
                this._transform.rotate = `rotate(${value}deg)`
                break;
            case 'scale':
                this._transform.scale = `scale(${value})`
                break;
        }
        return `${this._transform.translate} ${this._transform.rotate} ${this._transform.scale}`;
    }

}
Transform.config = {
    defaultTime: 300
}

// 继承
class MultiTransform extends Transform {
    multi(value, time) {
        return this._add('multi', value, time);
    }

    sleep(time){
        return this._add('sleep',  '', time);
    }

    _getTransform({ type, value }) {
        switch (type) {
            case 'translate':
                this._transform.translate = `translate(${value})`
                break;
            case 'rotate':
                this._transform.rotate = `rotate(${value}deg)`
                break;
            case 'scale':
                this._transform.scale = `scale(${value})`
                break;
            case 'sleep':
                break;
            case 'multi':
                value.forEach((item) => {
                    this._getTransform(item);
                })
                break;
        }
        return `${this._transform.translate} ${this._transform.rotate} ${this._transform.scale}`;
    }
}







const tf = new MultiTransform('.ball');
tf
    .translate('200px, 200px')
    .scale(1.5)
    .sleep(500)
    .rotate(180, 1000)
    .multi([
        {
            type: 'translate',
            value: '0, 0'
        },
        {
            type: 'scale',
            value: 2
        }
    ],2000)
    .done();