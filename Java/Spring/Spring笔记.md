## Spring

### Spring 配置文件

#### Bean 标签基本配置

* id：Bean 实例在 Spring 容器里的唯一标识
* class： Bean 的全限定名称

#### Bean 标签范围配置

scope：指对象的作用范围

    | 取值范围    | 说明 |
    | singleton | 默认值，单例的 |
    | prototype | 多例的 |
    | request | request 域 |
    | session | session 域 |
    | global session | Portlet 环境 如没有相当于 session 域 |

#### Bean 生命周期配置

* init-method 指定类中初始化方法名称
* destroy-method 指定类中销毁方法名称

#### Bean 实例化的三种方式

* 无参构造方法实例化
* 工厂静态方法实例化
* 工厂实例方法实例化

#### Bean 的依赖注入

用 Spring 管理 Server 层和 Dao 层的关系

<b>怎么注入？</b>
* 构造方法

```java
    private UserDao userDao;
    public UserServiceImpl(UserDao userDao) {
        this.userDao = userDao;
    }
    public UserServiceImpl() {
    }
```

```xml
    <bean id="UserDao" class="com.wwwwtao.impl.UserDaoImpl" ></bean>
    <bean id="UserService" class="com.wwwwtao.impl.UserServiceImpl" >
        <constructor-arg name="userDao" ref="UserDao"></constructor-arg>
    </bean>
```

* set 方法

1. set 方法注入

```java
package com.wwwwtao.impl;

import com.wwwwtao.dao.UserDao;
import com.wwwwtao.dao.UserService;
import com.wwwwtao.domain.User;

import javafx.beans.property.Property;

import java.util.List;
import java.util.Map;
import java.util.Properties;

public class UserServiceImpl implements UserService {

    // 注入普通属性
    private String name;
    public void setName(String name) {
        this.name = name;
    }

    // 注入UserDao
    private UserDao userDao;
    public void setUserDao(UserDao userDao){
        this.userDao = userDao;
    }
    //    public UserServiceImpl(UserDao userDao) {
    //        this.userDao = userDao;
    //    }
    //    public UserServiceImpl() {
    //    }

    // 注入集合类型
    private List<String> strList;
    private Map<String, User> userMap;
    private Properties properties;

    public void setStrList(List<String> strList) {
        this.strList = strList;
    }

    public void setUserMap(Map<String, User> userMap) {
        this.userMap = userMap;
    }

    public void setProperties(Properties properties) {
        this.properties = properties;
    }

    public void say() {
        System.out.println(strList); // [aaa, bbb]
        System.out.println(userMap); // {u1=com.wwwwtao.domain.User@78186a70, u2=com.wwwwtao.domain.User@306279ee}
        System.out.println(properties);  // {p2=prop2, p1=prop1}
        userDao.say("userDao say()");
    }
}

```

```xml
    <!-- userMap中的user1 -->
    <bean id="user1" class="com.wwwwtao.domain.User" >
        <property name="name" value="tom"></property>
        <property name="age" value="0"></property>
    </bean>

    <bean id="UserDao" class="com.wwwwtao.impl.UserDaoImpl" ></bean>
    <bean id="UserService" class="com.wwwwtao.impl.UserServiceImpl" >
       <!--  注入UserDao -->
        <property name="userDao" ref="UserDao"></property>
        <!-- 注入普通属性 -->
        <property name="name" value="wwwwwtao"></property>
        <!-- 注入集合类型 -->
        <property name="strList">
            <list>
                <value>aaa</value>
                <value>bbb</value>
            </list>
        </property>
        <property name="userMap">
            <map>
                <!-- userMap中的user1 -->
                <entry key="u1" value-ref="user1"></entry>
                <entry key="u2" value-ref="user2"></entry>
            </map>
        </property>
        <property name="properties">
            <props>
                <prop key="p1">prop1</prop>
                <prop key="p2">prop2</prop>
            </props>
        </property>

    </bean>
```

2. set 方法注入 --(P 命名空间）

```xml
    <!-- xmlns:p="http://www.springframework.org/schema/p" -->
    <bean id="UserService" class="com.wwwwtao.impl.UserServiceImpl" p:userDao-ref="UserDao">
    </bean>
```

#### Bean 的重点配置总结

![xml重点配置](./images/Spring%E7%9A%84%E9%87%8D%E7%82%B9%E9%85%8D%E7%BD%AE.png)

### Spring 相关 API

![ApplicationContext的继承体系](./images/ApplicationContext%E7%9A%84%E7%BB%A7%E6%89%BF%E4%BD%93%E7%B3%BB.png)
![ApplicationContext的实现类](./images/ApplicationContext%E7%9A%84%E5%AE%9E%E7%8E%B0%E7%B1%BB.png)

![getBean()方法使用](./images/getBean()%E6%96%B9%E6%B3%95%E4%BD%BF%E7%94%A8.png)

### Spring 配置数据源

![抽取JDBC配置文件配置数据源](./images/%E6%8A%BD%E5%8F%96JDBC%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6.png)

### Spring 注解开发

![Spring原始注解](./images/Spring%E5%8E%9F%E5%A7%8B%E6%B3%A8%E8%A7%A3.png)

使用注解进行开发时，需要在 applicationContext.xml 中配置组件扫码，作用是指定那个包及其子包下的 Bean 需要进行扫描以便识别使用注解配置的类，字段和方法

```xml
    <!-- applicationContext.xml -->
    <!--  注解的组件扫描  -->
    <context:component-scan base-package="com.wwwwtao"></context:component-scan>
```
