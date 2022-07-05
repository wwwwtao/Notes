<!--
 * @Description  : 
 * @Autor        : WenTao
 * @Date         : 2022-05-10 09:55:52
 * @LastEditors  : WenTao
 * @LastEditTime : 2022-05-10 10:23:07
 * @FilePath     : \zhjc-admin-app\src\views\choice\README.md
-->

### choice/choiceXXX  所有公共的选择XXX(比如：选择任务单)页面

### 使用方式

1. 跳转至页面 并传递 searchFromData（可选） 作为默认值
```js
// parent.vue
this.$Router.push({
    path: '/views/choice/choiceTaskList',
    query: {
        searchFromData: {
            statusList:['1001','1002','1003'],
        }
    }
})
```

<!-- 内部逻辑与使用无关 -->
<!-- 
2. 合并传入的 searchFromData 并搜索
```js
  mounted() {
    this.searchFromData = this.initSearchFromData()
    this._getTaskList()
  },
  methods: {
    // 搜索表单类
    initSearchFromData() {
      let searchFromData = {
        searchWord: '',
        // statusList:['1001','1002','1003'], // 默认已取消的任务单不能选择
      }

      // 不同页面使用此组件时想要修改默认的搜索参数 可以传入一个searchFromData 然后可自行修改扩展此处代码
      if(this.$Route.query.searchFromData) {
        searchFromData = Object.assign(searchFromData,this.$Route.query.searchFromData)
      }
      return searchFromData
    }
  }
```

3. 页面会在点击选中某条数据（Item）后返回上一页并抛出 updateXxxx事件  
```js
updateSuper(item) {
    uni.$emit('updateTask', item)
    uni.navigateBack({
        delta: 1
    })
}
``` 
-->

4. 在上一表单页监听/移除 updateXxxx事件
```js
// parent.vue
onShow() {
    // 监听事件
    uni.$on('updateTask',(item)=>{this.updateTask(item)})
},
onUnload() {    
    // 移除监听事件   
    uni.$off('updateTask',(item)=>{this.updateTask(item)})
},
```


### 属性说明
| 属性名 | 类型 | 默认值 | 说明 |
| ---------- | -------------------- | --------- | -------------- | 
| searchFromData |	Object |   {}   |	默认搜索参数 |

### 事件说明
| 事件名 |	说明 |	返回值 |
| ---------- | -------------------- | --------- | 
| updateXxxx	| 点击选中某条数据（Item）后触发-返回上一页并抛出Item |	- |

### 新建一个新的选择XXX页面

1. 修改 initSearchFromData() 中 searchFromData 默认参数
2. 修改接口地址和名字 _getTaskList()
3. 修改抛出的事件名 updateTask
4. 修改样式--页面逻辑等



```vue
<!-- choiceTaskList.vue -->
<template>
  <movable-area class="move-area">
    <view class="pump-list">
      <view class="search-area">
        <zv-search
          class="search"
          radius="100"
          placeholder="任务单编号"
          clearButton="auto"
          cancelButton="none"
          bgColor="transparent"
          @confirm="search"
          @cancel="cancel"
        />
          <!-- placeholder="任务单编号/客户/合同名称" -->
      </view>
      <zv-scroll
        :fixed="false"
        :pullDown="onPullingDown"
        :pullUp="onPullingUp"
        ref="pullScroll"
        class="main"
        v-if="listData.length !== 0"
      >
        <view class="list">
          <view class="card" v-for="(item, index) in listData" :key="index">
            <view class="content" @click="updateSuper(item)">
              <view class="content-header">
                <view class="left" style="font-weight: bold;">任务单编号：{{ item.orderCode || '--' }}</view>
              </view>
              <view class="flex-columns text-with-space">
                <view class="column-item" style="font-size: 14px;">
                  {{ `产品名称:  ${item.productName || '--'}` }}
                </view>
                <view class="column-item margin" style="font-size: 14px;">
                  <div>
                    方量:
                    <text style="color:#70b913;margin:0 6rpx;">{{ `${item.demandNum || '0'}` }}m³</text>
                  </div>
                </view>
                <view class="column-item margin" style="font-size: 14px;">
                  {{ `施工方式:   ${ item && item.constructionMethod && constructionMethod.find(other=>{ if(other.value === item.constructionMethod) { return other } }).label || '--' }` }}
                </view>
              </view>
              <view class="detail">
                <view class="detail-item">到场时间：{{ item.deliverTime && item.deliverTime.slice(0, 16) || '--' }}</view>
                <view class="detail-item">供货方：{{ item.supplierName || '' }}</view>
                <view class="detail-item">收货项目：{{ item.workProjectName	 || '--' }}</view>
              </view>
            </view>
          </view>
        </view>
      </zv-scroll>
      <zv-nodata class="no-data-box" :translateY="true" v-else>
        <template v-slot:text>
          <view class="no-data__text">
            {{ `暂无数据` }}
          </view>
        </template>
      </zv-nodata>

    </view>
  </movable-area>
</template>

<script>

import { getTaskList } from '@/api/choice'
import { categoryOptions } from '@/api/tools'

// 分页类
function initPageObject() {
  return {
    pageNo: 1,
    pageSize: 10,
  }
}

// 排序类
function initOrderBy() {
  return {
    field: 'created_at',
    sortType: 'desc',
  }
}

export default {
  name: 'choice-task-list',
  data() {
    return {
      // 列表数据
      listData: [],
      // 分页对象
      pageObject: initPageObject(),
      // 排序对象
      orderBy: initOrderBy(),
      // 搜索表单对象
      searchFromData: {},

      // 数据是否加载完毕
      isFinish: false,

      // 筛选--施工方式字典
      constructionMethod: [],
      // colorMap: {
      //   已完成: '#70B913',
      //   准备中: '#FFB300',
      //   执行中: '#1890FF'
      // },
    }
  },
  methods: {
    // 搜索表单类
    initSearchFromData() {
      let searchFromData = {
        searchWord: '',
        // statusList:['1001','1002','1003'], // 默认已取消的任务单不能选择
      }

      // 不同页面使用此组件时想要修改默认的搜索参数 可以传入一个searchFromData 然后可自行修改扩展此处代码
      if(this.$Route.query.searchFromData) {
        searchFromData = Object.assign(searchFromData,this.$Route.query.searchFromData)
      }
      return searchFromData
    },
    initListData() {
      this.pageObject.pageNo = 1
      this.listData = []
      this.isFinish = false
    },
    async _getTaskList() {
      if(this.isFinish){
        return 
      }
      const data = {
        ...this.pageObject,
        orderBy: this.orderBy,
        example: {
          ...this.searchFromData
        }
      }
      const res = await getTaskList(data)
      if (res && res.data && res.data.data) {
        this.listData = this.listData.concat(res.data.data)
        this.pageObject.pageNo+=1
        setTimeout(() => {
          if (!this.$refs['pullScroll']) {
            return
          }
          const totalPage = Math.ceil(res.data.total / this.pageObject.pageSize)
          if (this.pageObject.pageNo - 1 >= totalPage) {
            /* 全部数据加载完毕 */
            this.$refs['pullScroll'].finish(true)
            this.isFinish = true
          } else {
            // 分页还没加载完
            this.$refs['pullScroll'].showUpLoading()
            this.$refs['pullScroll'].success()
          }
        }, 100)
      }
    },
    search(e) {
      this.searchFromData.searchWord = e.value
      this.initListData()
      this._getTaskList()
    },
    cancel() {
      this.searchFromData.searchWord = ''
      this.initListData()
      this._getTaskList()
    },
    onPullingDown() {
      this.initListData()
      this._getTaskList()
    },
    onPullingUp() {
      this.$refs['pullScroll'].showUpLoading()
      this._getTaskList()
    },
    updateSuper(item) {
      uni.$emit('updateTask', item)
      uni.navigateBack({
        delta: 1
      })
    },
    // 初始化字典
    initDict() {
      let pumpOrderConstructionMethods =  categoryOptions({ code: "constructionMethods" }).then((res) => {
        const data = res.data.map((d) => ({
          label: d.text,
          value: d.value,
        }));
        this.constructionMethod = data;
      });
    

      return Promise.all([pumpOrderConstructionMethods])
    },
  },
  async mounted() {
    await this.initDict()
    this.searchFromData = this.initSearchFromData()
    this._getTaskList()
  }
}
</script>

<style lang="scss" scoped>
.move-area {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background-color: #fff;
  .move-view {
    width: 96px;
    height: 96px;
    z-index: 9;
  }

  .move-icon {
    position: relative;
    width: 96px;
    height: 96px;
    background-color: $color-primary;
    border-radius: 50%;
    z-index: 9;

    .add-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
.pump-list {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background-color: #fafafa;
  position: relative;

  .search-area {
    position: relative;
    display: flex;
    align-items: center;
    z-index: 2;

    .search {
      flex: 1;

      ::v-deep .zv-search {
        // padding-right: 0;
      }
    }

    .img-icon {
      width: 60rpx;
      height: 60rpx;

      image {
        width: 100%;
        height: 100%;
      }
    }
  }

  .main {
    flex: 1;
    padding-bottom: 32rpx;

    &.no-data {
      position: relative;
      z-index: 2;
      background-color: transparent;

      ::v-deep .zv-tip-wrap {
        display: none;
      }
    }

    @extend .scroll-no-bar;

    .card {
      margin-top: 16rpx;
      background-color: #fff;
      color: #212121;

      .content {
        padding: 0 32rpx 32rpx 32rpx;
        border-bottom: 1rpx solid #eee;

        &-header {
          display: flex;
          justify-content: space-between;
          padding: 20rpx 0;
          font-size: 28rpx;
          border-bottom: 1rpx solid #eee;

          .left {
            flex: 1;
          }

          .right {
            // color: #ffb300;
          }
        }

        .flex-columns {
          display: flex;
          align-items: center;
          padding: 16rpx 0;

          .column-item {
            flex: 1;
            display: flex;

            &.margin {
              margin: 0 24rpx;
            }
          }
        }

        .detail {
          &-item {
            color: #8b8b8b;
            font-size: 24rpx;
            padding: 8rpx 0;
          }
        }
      }

      .card-btns {
        display: flex;
        justify-content: flex-end;
        padding: 12rpx 36rpx;


        .card-btn {
          padding: 12rpx 36rpx;
          font-size: 24rpx;
          color: #fff;
          background-color: #70b913;
          border-radius: 34rpx;
          margin-left: 24rpx;
          color: #70b913;
          border: 1rpx solid #70b913;
          background-color: #fff;
          &.plain {
            }
        }
        :last-child {
          background: #70b913;
          color: #fff;
        }
      }
    }
  }

  .no-data-box {
    position: absolute;
    height: 100vh;
    width: 100vw;
    top: 0;
    left: 0;
    z-index: 1;
  }

  .screen-group {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 12rpx 0;
    padding-left: 32rpx;
    position: relative;
    z-index: 100000;

    .plain-btn {
      flex: 1;
      color: #212121;
      font-size: 28rpx;
      padding: 12rpx 24rpx;
      border-radius: 24rpx;
      margin: 0 12rpx;
      text-align: center;
    }

    .center-text {
      margin: 0 24rpx;
    }
  }
  .pump-drawer {
    position: relative;
    z-index: 999999;

    .screen-area {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 600rpx;
      height: 100vh;
      background-color: #fff;

      .screen-main {
        flex: 1;
        @extend .scroll-no-bar;

        .status-btn-group {
          display: flex;
          flex-wrap: wrap;

          .status-btn {
            width: 33.3%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 24rpx;

            .normal-btn {
              width: 200rpx;
              border: 1rpx solid #eee;
              color: #212121;
              background-color: #eee;
              font-size: 28rpx;
              padding: 12rpx 24rpx;
              border-radius: 60rpx;
              margin: 0 12rpx;
              text-align: center;

              &.btn-active {
                border: 1rpx solid #70b913;
                background-color: #70b913;
                color: #fff;
              }
            }
          }
        }
      }

      .btn-area {
        display: flex;
        padding-bottom: 44rpx;

        ::v-deep .zv-button--plain {
          color: #70b913;
        }
      }
    }
  }
}

.more-cars {
  position: absolute;
  top: 200rpx;
  left: 50%;
  width: 65vw;
  transform: translateX(-50%);
  padding: 0 28rpx;
  border-radius: 28rpx;
  background-color: #fff;
  box-shadow: 2rpx 6rpx 18rpx 2rpx rgba(0, 0, 0, 0.3);
  z-index: 99;

  .header {
    text-align: center;
    padding: 32rpx;
    font-size: 32rpx;
  }

  .cars-container {
    width: 100%;
    max-height: 45vh;
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 12rpx;
    .qrimg {
      display: flex;
      justify-content: center;
      margin-left: 15rrpx;
    }
    @extend .scroll-no-bar;

    .cars-item {
      margin-right: 16rpx;
      margin-bottom: 16rpx;
      padding: 12rpx;
      color: #70b913;
      border: 1rpx solid #70b913;
      font-size: 24rpx;
      border-radius: 8rpx;

      &.green {
        border: 1rpx solid #70b913;
        color: #70b913;
      }

      &.red {
        border: 1rpx solid #e53935;
        color: #e53935;
      }

      &.gray {
        border: 1rpx solid #8b8b8b;
        color: #8b8b8b;
      }
    }
  }

  .footer {
    margin-top: 12rpx;
    border-top: 1rpx solid #eee;
    text-align: center;
    padding: 30rpx;
  }
}


.more_pop{
  background: #eee;
  border-radius: 20px 20px 0 0;
  .more_popBtn {
    background: #fff;
    text-align: center;
    padding: 24px;
  }
  .more_popTop {
    border-radius: 20rpx 20rpx 0 0;
  }
}
</style>
                
             
```