# 账号密码

15173468345
123456

# 修改记录

## 2020.0608

1. 出入库增加仓库选择操作，更改的字段用红色标记出来了 （后端相关）

2. 新建发货单，增加选择仓库及发货商品类别操作 （等设计稿）

3. 新增调拨清单（先画 copy 发货清单） 新建调拨单套娃新建发货单 等设计稿

4. 新增代发货清单（先画）

## 2020.06.09

1. 库存清单中增加原材料及根据仓库查看库存数量的页面（等设计稿）

2. 增加原材料详情页（先画 商品详情修改 添加库存信息）商品详情等设计稿 然后套娃

3. 增加联系人页面，新建配送和代发货单可添加联系人（先画）  建好 -- 等图中

## receiving 配送清单被删除（暂时先留着）

# 接口

### <!-- 登录 -->

1. 登录
URL：/wx/login/wxLogin
参数：mobile, password, code, openType（小程序类型，仓储小程序为 2)
返回： 用户的 token

2. 忘记密码
URL：/wx/login/forgetPassword
参数：mobile, validateCode（验证码）, code, openType（小程序类型，仓储小程序为 2)
返回：用户的 token

3. 获取用户的 token
URL：/wx/login/getUserByCode
参数：code， openType（小程序类型，仓储小程序为 2)
返回：用户的 token

4. 重置密码
URL：/wx/user/resetPassword
参数：password
返回：操作成功

5. 获取验证码              验证码默认 888888  获取验证码的接口有个 type    1 注册 2 登录 3 找回密码
URL：/wx/register/sendValidateCode
参数：mobile, type, openType
返回：ok()

6. 注册
URL：/wx/register/register
参数：mobile, validateCode（验证码）, password,openType（小程序类型，仓储小程序为 2)
返回：ok()

7. 完善个人信息
URL：/wx/user/updatePersonalInfo
参数： email（邮箱）, gender(1 男，2 女），nickName（名称）
返回：ok()

8. 1

/wx/user/getPersonalInfo
获取用户信息，不用传东西（请求头带 token 就行）

### <!-- 库存清单 -->

1. 获取商品类别
URL：wx/storage/getCategory
入参：无
返回：{
    "msg": "操作成功",
    "data": [
        {
            "name": "配饰",
            "id": 5
        },
        {
            "name": "轮子",
            "id": 4
        },
        {
            "name": "板面",
            "id": 3
        },
        {
            "name": "支架",
            "id": 2
        },
        {
            "name": "滑板",
            "id": 1
        }
    ],
    "success": true
}

1. 根据商品类别获取商品
URL：wx/storage/getProductsByCategory
入参：类别 id
返回：
{
    "msg": "操作成功",
    "data": [
        {
            "unit": "个",                    // 单位
            "code": "AS123",          // 商品代码
            "name": "长滑板十代",
            "id": 4,
            "stock": 123                // 商品库存
        },
        {
            "unit": "个",
            "code": "AS123",
            "name": "长滑板九代",
            "id": 3,
            "stock": 242
        },
        {
            "unit": "个",
            "code": "AS123",
            "name": "长滑板八代",
            "id": 2,
            "stock": 23
        },
        {
            "unit": "个",
            "code": "AS123",
            "name": "长滑板一代",
            "id": 1,
            "stock": 12
        }
    ],
    "success": true
}

### <!-- 扫码收货 -->

1. 获取当前登录用户的收货单
URL：wx/storage/receiptList
入参：无    （需要登录之后带 token）
返回：发货单列表

2. 根据收货单 ID 获取收货单详情
URL：wx/storage/receiptDetail
入参：id （收货单的 ID)
返回：
{
    "msg": "操作成功",
    "data": {
        "receiverName": "章三",        		 // 收货人
        "receiverMobile": "12345678910",    	  // 收货人电话
        "products": [
            {
                "unit": "个",     			 // 单位
                "count": 11,     			// 数量
                "id": 11,         			 // 商品 ID
                "productName": "长滑板八代"
            },
            {
                "unit": "个",
                "count": 10,
                "id": 10,
                "productName": "长滑板一代"
            }
        ]
    },
    "success": true
}

3. 收货时验证商品
URL：wx/storage/checkProduct
入参：orderDetailId（发货单 ID)  productId（商品 ID)
返回：  若返回为空代表该商品不在收货单中
{
    "msg": "操作成功",
    "data": {
        "count": 10,
        "id": 10,
        "productId": 1,
        "productName": "长滑板一代",
        "received": true,                                 // 是否已收货   true 是
        "shippingOrderDetailId": 1                        // 订单详情 ID
    },
    "success": true
}

4. 收货时保存收货信息 （确认收货）
URL：wx/storage/saveShipmentDetail
入参：productArray（将商品列表的商品数据转为 json 数组字符串提交）actualCount
返回：
{
    "msg": "操作成功",
    "data": {
        isAllReceived":true,                                     //true 全部收货， false 还有货物未完成
    },
    "success": true
}
