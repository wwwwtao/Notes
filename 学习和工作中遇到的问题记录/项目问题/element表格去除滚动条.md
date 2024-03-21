```scss
//隐藏滚动条
::v-deep .content::-webkit-scrollbar {
  display: none;
}

::v-deep .el-table__body-wrapper {
  // 整个滚动条
  &::-webkit-scrollbar {
    width: 0px; // 纵向滚动条的宽度
    background: rgba(213, 215, 220, 0.3);
    border: none;
    display: none;
  }
  // 滚动条轨道
  &::-webkit-scrollbar-track {
    border: none;
    display: none;
  }
}
// --------------------隐藏table gutter列和内容区右侧的空白 start
::v-deep .el-table th.gutter {
  display: none;
  width: 0;
}
::v-deep .el-table colgroup col[name="gutter"] {
  display: none;
  width: 0;
}
// 这个样式不加的话内容哪里会缺一点，估计是因为滚动条哪里缺的没有补上
::v-deep .el-table__body {
  width: 100% !important;
}
// --------------------隐藏table gutter列和内容区右侧的空白 end
```
