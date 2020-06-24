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

## 2020.0608

1. 出入库增加仓库选择操作，更改的字段用红色标记出来了 （后端相关）------------- 已完成

2. 新建发货单，增加选择仓库及发货商品类别操作 （等设计稿）------------- 已完成

3. 新增调拨清单（先画 copy 发货清单） 新建调拨单套娃新建发货单 等设计稿

4. 新增代发货清单（先画）

## 2020.06.09

1. 库存清单中增加原材料及根据仓库查看库存数量的页面（等设计稿） ------------- 已完成

2. 增加原材料详情页（商品详情修改 添加库存信息）------------- 已完成

3. 增加联系人页面，新建配送和代发货单可添加联系人（先画）  ------------- 已完成 （还差返回上一个页面的逻辑）

## receiving 配送清单被删除（暂时先留着）

# 接口

## 仓储接口

### 公共方法

	GET 获取小程序菜单 /wx/storage/getMenu

	GET 小程序 - 商品类别列表 /wx/storage/productCategory

	GET 小程序 - 选择联系人 /wx/storage/chooseContact  入参（contactType( 0. 公司员工 1. 供应商 2. 经销商 3. 加工厂）） 111

    GET 小程序 - 新建产品数据源 /wx/storage/addProxyOrderProductList  入参（productType（商品类型）, productCategoryId（类别 ID)， productName（商品名字）, warehouseId（仓库 ID)）（update）

	GET 小程序 - 商品仓库及库存 /wx/storage/getProductStockAndCount  入参（productId（商品 ID)）

	GET 小程序 - 获取仓库 list /wx/storage/getWarehouseList

	GET 枚举 /common/xcxGetEnum?name=?
		代发货 status name = ProxyOrderStatus
		产品类型 name = ProductType
		调拨状态 name = TransferOrderStatus (add)

### 微信小程序仓储 - 代发货清单 / 发货清单

	GET 小程序 - 代发货清单 / 发货清单列表 /wx/shipping/orderList  入参（productName（商品名字）, status（单状态）, isProxyOrder（是否是代发货）） 111

	GET 小程序 - 代发货清单 / 发货清单详情 /wx/shipping/shippingOrderDetail  入参（shippingOrderId（货单 ID)） 111

	POST 小程序 - 代发货清单详情修改状态 /wx/shipping/shippingOrderChangeStatus  入参（shippingOrderId（货单 ID)， status（要修改的状态）） 111

	POST 小程序 - 代发货清单 保存 /wx/shipping/saveProxyOrder  入参（ShippingOrderDTO dto（对象接收数据）） 111
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

### 微信小程序仓储 - 调拨单

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

### 微信小程序仓储 - 批次清单 (add)

	GET 小程序 - 批次清单列表 /wx/stockIn/orderList  入参（orderNo（单号）） 111

	GET 小程序 - 批次清单详情 /wx/stockIn/stockInDetail  入参（stockInId（入库单 id)）

### 微信小程序仓储 - 收货 (add)

	GET 小程序 - 操作管理 - 收货单列表 （包含调拨，采购数据） /wx/receiving/transferAndShippingList
