## Spring

### Spring 配置文件

1. Bean 标签基本配置

* id：Bean 实例在 Spring 容器里的唯一标识
* class： Bean 的全限定名称

2. Bean 标签范围配置

scope：指对象的作用范围

    | 取值范围    | 说明 |
    | singleton | 默认值，单例的 |
    | prototype | 多例的 |
    | request | request 域 |
    | session | session 域 |
    | global session | Portlet 环境 如没有相当于 session 域 |

3. Bean 生命周期配置

* init-method 指定类中初始化方法名称
* destroy-method 指定类中销毁方法名称

4. Bean 实例化的三种方式

* 无参构造方法实例化
* 工厂静态方法实例化
* 工厂实例方法实例化
