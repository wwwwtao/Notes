import Compile from "./Compile";
import observe from "./observe";
import Watcher from "./Watcher";

export default class Vue {
  constructor(options) {
    // 把参数options对象为$options
    this.$options = options || {};
    // 数据
    this._data = options.data || undefined;
    observe(this._data);
    // 数据变成响应式的，这里类似于生命周期
    this._initData();
    // this._initComputed()
    // 调用默认的watch
    this._initWatch();
    // 模板编译
    new Compile(options.el, this);
  }
  _initData() {
    let self = this;
    Object.keys(this._data).forEach((key) => {
      Object.defineProperty(self, key, {
        get() {
          return self._data[key];
        },
        set(newVal) {
          self._data[key] = newVal;
        },
      });
    });
  }
  _initWatch() {
    let self = this;
    let watch = this.$options.watch;
    Object.keys(watch).forEach((key) => {
      new Watcher(self, key, watch[key]);
    });
  }
}
