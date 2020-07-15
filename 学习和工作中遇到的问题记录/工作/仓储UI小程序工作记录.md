# 项目写法

1. 小程序请求封装（根据传参使用取消请求） 默认 config

2. 首页判断

3. 选择联系人 返回上一页 并设置 动态参数的值

# 账号密码

15173468345
123456

192.168.0.26

## 豪哥

18175112351
123456

192.168.0.63

测试环境：http://skateboard.test.yongxinxue.com/

# 修改记录

## 7.11  1. 扫码接口修改    2. 清单管理 --- 分页功能（已完成） 库存 批次没做分页处理

1. 扫码接口返回值不是一个标准的 JSON 格式  wx.scanCode({

2. 清单管理 --- 分页功能 ---- 返回值第一项与列表渲染值最后一项匹配  日期相同就合并他们 然后把之后的返回值 concat 上去
收货清单  ---  返回的数据 date 没有排序
调拨清单  ---  返回的数据 date 没有排序
代发货清单   ---  返回的数据 最后一项没有 date

# 仓储接口

## 公共方法

 GET 获取小程序菜单 /wx/storage/getMenu

 GET 小程序 - 商品类别列表 /wx/storage/productCategory

 GET 小程序 - 选择联系人 /wx/storage/chooseContact  入参（contactType( 0. 公司员工 1. 供应商 2. 经销商 3. 加工厂））

GET 小程序 - 新建产品数据源 /wx/storage/addProxyOrderProductList  入参（productType（商品类型）, categoryId（类别 ID)， productName（商品名字）, warehouseId（仓库 ID)）

 GET 小程序 - 商品仓库及库存 /wx/storage/getProductStockAndCount  入参（productId（商品 ID)）

 GET 小程序 - 获取仓库 list /wx/storage/getWarehouseList

 GET 小程序 - 商品 / 原材料 详情 /wx/storage/getProductDetail 入参（productId（商品 ID)）

 GET 枚举 /common/xcxGetEnum?name=?
  代发货 status name = ProxyOrderStatus
  产品类型 name = ProductType
  调拨状态 name = TransferOrderStatus (add)

## 微信小程序仓储 - 代发货清单 / 发货清单

 GET 小程序 - 代发货清单 / 发货清单列表 /wx/shipping/orderList  入参（productName（商品名字）, status（单状态）, isProxyOrder（是否是代发货））

 GET 小程序 - 代发货清单 / 发货清单详情 /wx/shipping/shippingOrderDetail  入参（shippingOrderId（货单 ID)）

 POST 小程序 - 代发货清单详情修改状态 /wx/shipping/shippingOrderChangeStatus  入参（shippingOrderId（货单 ID)， status（要修改的状态））

 POST 小程序 - 代发货清单 保存 /wx/shipping/saveProxyOrder  入参（ShippingOrderDTO dto（对象接收数据））
 {
  sendFactoryId（发货方 ID）
  operatorEmployeeId（操作人 ID)
  detailProductString（商品数组字符串）：
  {
   [
   id
   deliverCount（数量）
   ],
   [
   id
   deliverCount（数量）
   ]
  }
 }

 POST 小程序 - 发货清单 保存 /wx/shipping/saveShippingOrder  入参（ShippingOrderDTO dto（对象接收数据））
 {
  productType
  dealerId （经销商 ID)
  factoryId （加工厂 ID)
  detailProductString（商品数组字符串）：
  {
   [
   id
   deliverCount（数量）
   wareHouseId （仓库 id)
   ],
   [
   id
   deliverCount（数量）
   wareHouseId （仓库 id)
   ]
  }
 }

## 微信小程序仓储 - 调拨单

	GET 小程序 - 调拨单列表 /wx/transfer/orderList  入参（productName（商品名字）, status（单状态）） 111

	GET 小程序 - 调拨单详情 /wx/transfer/transferOrderDetail  入参（transferOrderId（调拨单 ID)） 111

	POST 小程序 - 调拨单 保存 /wx/transfer/saveTransferOrder  入参（TransferOrderDTO dto（对象接收数据） 111

	{
		fromEmployeeId（调出方操作人 ID）
		toEmployeeId（接收方收货人 ID）
		productType （产品类型）
		fromWarehouseId （调出方仓库）
		toWarehouseId（接收方仓库）
		detailProductString（商品数组字符串）：
		{
			[
			id
			deliverCount（数量）
			],
			[
			id
			deliverCount（数量）
			]
		}
	}

## 微信小程序仓储 - 收货

 GET 小程序 - 操作管理 - 收货单列表 （包含调拨，采购数据） /wx/receiving/transferAndShippingList

 GET 小程序 - 操作管理 - 收货单详情 （包含调拨，采购数据） /wx/receiving/transferOrShippingDetail 入参（id, receivingOrderType（数据类型）)

 POST 小程序 - 收货 保存 /wx/receiving/saveReceivingOrder 入参（ReceivingOrderDTO dto)
 {
  type（收货类型，无收货单时传 3)
  orderId（列表单号 id 无收货单时传不传）
  detailProductString
   [
   productId
   amount（数量）
   orderDetailId（相关详情 id)
   ],
   [
   productId
   amount（数量）
   orderDetailId（相关详情 id)
   ]
 }

## 微信小程序仓储 - 产品

 GET 小程序 - 根据二维 ID 码获取商品信息 /wx/product/getProductByQrCodeId  入参（qrCodeId（二维码 ID)， orderId（列表单号 id）， type（收货类型））

 GET 小程序 - 根据名字获取产品列表 /wx/product/getProductBypProductName  入参（productName（产品名字））

 GET 小程序 - 根据 id 获取产品信息 /wx/product/getProductById  入参（productId（产品 id)）

 GET 小程序 - 库存清单列表 /wx/product/productStockList  入参（productName, productType（类型）, warehouseId（仓库 id）, categoryId（类别 ID)）

 GET 小程序 - 商品详情 /wx/product/productStockDetail  入参（productId(id)）

## 微信小程序仓储 - 入库

 GET 小程序 - 操作管理 - 入库 - 列表 /wx/stockIn/receivingOrderList

 GET 小程序 - 操作管理 - 入库 - 详情 /wx/stockIn/receivingOrderDetail 入参（orderId）

 GET 小程序 - 操作管理 - 入库 - 原材料信息 /wx/stockIn/materialsDetail 入参（orderDetailId）

 POST 小程序 - 操作管理 - 入库 保存 /wx/stockIn/saveStockIn  入参（ReceivingOrderDTO dto）
  {
   id （入库单 ID）
   warehouseId（入库 id）
   detailProductString
    [
    orderDetailId
    actualCount（数量）
    ],
    [
    orderDetailId
    actualCount（数量）
    ]
  }

## 微信小程序仓储 - 出库

 GET 小程序 - 出库 - 列表 /wx/stockOut/shippingOrderList

 GET 小程序 - 出库 - 详情 /wx/stockOut/shippingOrderDetail 入参（shippingOrderId）

 POST 小程序 - 出库 - 保存 /wx/stockOut/saveStockOut  入参（StockOutDTO dto）
  {
   id （入库单 ID）
   shippingOrderId
   detailProductString
    [
    productId
    orderDetailId
    actualCount（实出数量）
    ],
    [
    productId
    orderDetailId
    actualCount（实出数量）
    ]
  }

## 微信小程序仓储 - 出货

 GET 小程序 - 出货 - 列表 /wx/stockOut/stockOutList

 GET 小程序 - 出货 - 详情 /wx/stockOut/stockOutDetail 入参（orderId）

 POST 小程序 - 出货 - 保存 /wx/stockOut/updateStockOut  入参（StockOutDTO dto）
 {
  id(orderId)
  detailProductString
   [
    stockOutDetailId
    actualCount（实出数量）
    ],
    [
    stockOutDetailId
    actualCount（实出数量）
    ]
 }

## 微信小程序仓储 - 批次清单

  GET 小程序 - 批次清单列表 /wx/stockIn/orderList  入参（orderNo（单号））

  GET 小程序 - 批次清单列表 /wx/product/batchList  入参（name（查询条件））

  GET 小程序 - 批次清单详情 /wx/stockIn/stockInDetail  入参（stockInId（入库单 id)）

## 微信小程序仓储 - 收货清单

 GET 小程序 - 清单管理 - 收货单列表 /wx/receiving/receivingOrderList  入参（status）

 GET 小程序 - 清单管理 - 完成的详情 /wx/receiving/finishList  入参（orderId）
