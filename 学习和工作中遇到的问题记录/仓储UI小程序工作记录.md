扫码入库时 （1. 扫码之后 2. 把参数带入库信息页（enter 里）去 3. 点入库信息页的确定时候做对比）

扫码出库时时 1. 扫完 2. 就对比

对比成功之后放入 入库 or 出库列表页     enterList  outList

# outConfirm

	<!-- 确认入库完成之后跳转到入库完成页面了 -->

	<!-- 确认出库之后 应该也是跳转到出库完成页面 原型暂时没写 先空着 -->

获取验证码的接口有个 type    1 注册 2 登录 3 找回密码

15173468345
123456


# 接口
<!-- 登录 -->

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

5. 获取验证码              验证码默认 888888
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

8.

/wx/user/getPersonalInfo
获取用户信息，不用传东西（请求头带 token 就行）

<!-- 库存清单 -->

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
