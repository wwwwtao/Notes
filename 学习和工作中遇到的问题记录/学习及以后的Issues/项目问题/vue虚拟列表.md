## 什么是虚拟列表

虚拟列表是一种长列表优化方案，通过数据截取来生成数据，达到优化性能的一种方式，与传统长列表相比性能更高，速度更快，避免了页面卡顿。

### 实现方式：

几个初始值概览：

1. contentHeight：滚动可视区域高度

2. showList：可视区域展示用的列表

3. startIndex：起始数据位置

4. endIndex：结束数据位置

5. scrollTop：卷起高度

6. showNum：当前列表高度可展示个数

7. itemHeight：每项 item 高度

8. top：可视区域距离顶部距离，通过这个值使当前列表始终展示在可视区域内

### 实现步骤

1. 我们给 content-box 类设置了滚动条，高度；并且监听了滚动事件；
2. 给下级元素设置了总高度，总高度计算方式 = 每项 item 高度 * 总数据条数，用于撑起滚动条；
3. 通过监听滚动事件，计算出 showList 当前展示内容；
4. 给元素设置定位，始列表始终出现在可视区域内；

完整代码如下，可复制后查看效果：

```vue
<template>
  <div
    ref="contentBox"
    class="content-box"
    :style="{ height: contentHeight + 'px' }"
    @scroll="scrollListener"
  >
    <div
      :style="{
        position: 'relative',
        height: showBoxHeight,
      }"
    >
      <div
        :style="{
          position: 'absolute',
          top: top + 'px',
        }"
      >
        <div
          class="box-item"
          :style="{
            height: itemHeight + 'px',
            lineHeight: itemHeight + 'px',
          }"
          v-for="(item, index) of showList"
          :key="index"
        >
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "virtualList",
  data() {
    return {
      total: 1000000, // 模拟数据总数
      contentHeight: 400,
      showList: [],
      list: [],
      startIndex: 0,
      endIndex: null,
      itemHeight: 30,
      scrollTop: 0, // 卷起高度
      showNum: 0, // 当前显示列表个数
      top: 0, // 距离顶部距离
    };
  },
  computed: {
    showBoxHeight() {
      return this.itemHeight * this.list.length + "px";
    },
  },
  mounted() {
    this.getList();
    this.scrollListener();
  },
  methods: {
    getList() {
      // 构造虚拟数据
      this.list = Array.from({ length: this.total }).map(
        (_, index) => `第${index + 1}条数据`
      );
    },
    scrollListener() {
      this.scrollTop = this.$refs.contentBox.scrollTop; // 获取距离顶部距离
      this.showNum = Math.ceil(this.contentHeight / this.itemHeight); // 可展示个数
      this.startIndex = Math.floor(this.scrollTop / this.itemHeight); // 起点位置
      this.endIndex = this.startIndex + this.showNum; // 结束位置
      this.showList = this.list.slice(this.startIndex, this.endIndex); // 当前查看数据
      this.top = this.startIndex * this.itemHeight; // 距离顶部的距离，控制内容出现在可视区域
    },
  },
};
</script>

<style scoped>
.content-box {
  margin: 30px auto 0;
  position: relative;
  width: 400px;
  border: 1px solid #e4e7ed;
  overflow-y: auto;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  padding: 10px 0;
}
.box-item {
  padding: 0 32px 0 20px;
  color: #606266;
}
.content-box::-webkit-scrollbar {
  width: 10px;
  height: 1px;
}
.content-box::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: #e5e5e5;
}
.content-box::-webkit-scrollbar-track {
  border-radius: 10px;
  background: #ffffff;
}
</style>
```
