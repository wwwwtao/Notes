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

    <!-- context命名空间 -->
    <beans
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="
       http://www.springframework.org/schema/context
       http://www.springframework.org/schema/context/spring-context.xsd">

    <!--  注解的组件扫描  -->
    <context:component-scan base-package="com.wwwwtao"></context:component-scan>

    <context:component-scan base-package="com.wwwwtao">
        <context:include-filter type="annotation" expression="org.springframework.stereotype.Controller"/>
    </context:component-scan>
```

![还需使用注解替代的配置](./images/%E8%BF%98%E9%9C%80%E4%BD%BF%E7%94%A8%E6%B3%A8%E8%A7%A3%E6%9B%BF%E4%BB%A3%E7%9A%84%E9%85%8D%E7%BD%AE.png)

![Spring新注解](./images/Spring%E6%96%B0%E6%B3%A8%E8%A7%A3.png)

### Spring 集成 Junit

![Spring集成Junit步骤](./images/Spring%E9%9B%86%E6%88%90Junit%E6%AD%A5%E9%AA%A4.png)

```xml
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-test</artifactI d>
        <version>5.0.6.RELEASE</version>
    </dependency>
```

```java
    @RunWith(SpringJUnit4ClassRunner.class)
    @ContextConfiguration("classpath:applicationContext.xml")
    public class SpringJunitTest {

        @Autowired
        private UserService userService;

        @Test
        public void test1(){
            userService.say();
        }
    }
```

### Spring 集成 web 环境

![ApplicationContext应用上下文获取方式](./images/ApplicationContext%E5%BA%94%E7%94%A8%E4%B8%8A%E4%B8%8B%E6%96%87%E8%8E%B7%E5%8F%96%E6%96%B9%E5%BC%8F.png)

![Spring提供获取应用上下文的工具](./images/Spring%E6%8F%90%E4%BE%9B%E8%8E%B7%E5%8F%96%E5%BA%94%E7%94%A8%E4%B8%8A%E4%B8%8B%E6%96%87%E7%9A%84%E5%B7%A5%E5%85%B7.png)

1. 导入 Spring 集成 web 的坐标

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-web</artifactId>
    <version>5.0.6.RELEASE</version>
</dependency>
```

2. 配置 ContextLoaderListener 监听器

```xml
<!-- 全局参数 -->
<context-param>
    <param-name>contextConfigLocation</param-name>
    <param-value>classpath:applicationContext.xml</param-value>
</context-param>
<!-- Spring的监听器 -->
<listener>
    <listener-class>
        org.springframework.web.context.ContextLoaderListener
    </listener-class>
</listener>
```

## SpringMVC

### SpringMVC 简介及开发步骤

![SpringMVC简介及开发步骤](./images/SpringMVC%E7%AE%80%E4%BB%8B%E5%8F%8A%E5%BC%80%E5%8F%91%E6%AD%A5%E9%AA%A4.png)

### SpringMVC 组件解析

![SpringMCVC执行流程0](./images/SpringMCVC%E6%89%A7%E8%A1%8C%E6%B5%81%E7%A8%8B0.png)

![SpringMCVC执行流程1](./images/SpringMCVC%E6%89%A7%E8%A1%8C%E6%B5%81%E7%A8%8B1.png)

### SpringMVC 注解解析

![@RequestMapping - 注解解析](./images/%40RequestMapping%E6%B3%A8%E8%A7%A3%E8%A7%A3%E6%9E%90.png)

### SpringMVC XML 配置解析

![视图解析器默认配置](./images/%E8%A7%86%E5%9B%BE%E8%A7%A3%E6%9E%90%E5%99%A8%E9%BB%98%E8%AE%A4%E9%85%8D%E7%BD%AE.png)

![SpringMVC相关组件](./images/SpringMVC%E7%9B%B8%E5%85%B3%E7%BB%84%E4%BB%B6.png)

### SpringMVC 数据响应

![页面跳转-返回字符串](./images/%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%AC-%E8%BF%94%E5%9B%9E%E5%AD%97%E7%AC%A6%E4%B8%B2.png)

![页面跳转-返回ModelAndView](./images/%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%AC-%E8%BF%94%E5%9B%9EModelAndView.png)

![回写数据-返回字符串](./images/%E5%9B%9E%E5%86%99%E6%95%B0%E6%8D%AE-%E8%BF%94%E5%9B%9E%E5%AD%97%E7%AC%A6%E4%B8%B2.png)

##### 回写数据 - 回写 Json

```xml
    <!-- 依赖 -->
    <!-- 回写数据-回写Json -->
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-core</artifactId>
        <version>2.9.5</version>
    </dependency>
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
        <version>2.9.5</version>
    </dependency>
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-annotations</artifactId>
        <version>2.9.0</version>
    </dependency>
```

```java
    @RequestMapping(value="/quick9")
    @ResponseBody
    public String save9() {
        User user = new User();
        user.setName("wwwwtao");
        user.setAge(18);
        // 使用JSON转换工具将对象转换成json格式字符串
        ObjectMapper objecctMapper = new ObjectMapper();
        String json = objecctMapper.writeValueAsString(user);
        return json;
    }
```

![回写数据-返回对象或集合(可被下面的注解驱动代替)](./images/%E5%9B%9E%E5%86%99%E6%95%B0%E6%8D%AE-%E8%BF%94%E5%9B%9E%E5%AF%B9%E8%B1%A1%E6%88%96%E9%9B%86%E5%90%88.png)

```xml
    <!-- applicationContext.xml -->
    <!-- mvc命名空间 -->
    <beans
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xsi:schemaLocation="
       http://www.springframework.org/schema/mvc
       http://www.springframework.org/schema/mvc/spring-mvc.xsd">

    <!--  mvc的注解驱动  -->
    <mvc:annotation-driven/>
```

### SpringMVC 获得请求数据

**@RequestBody 注解**
* 在方法上指定 @RequestBody 代表返回数据而非页面
* contentType 为 application/json;charset=UTF-8 时，在形参数里指定 @RequestBody 可直接接收集合数据而无需使用 POJO 进行包装
![请求数据乱码问题](./images/%E8%AF%B7%E6%B1%82%E6%95%B0%E6%8D%AE%E4%B9%B1%E7%A0%81%E9%97%AE%E9%A2%98.png)

![@RequestParam注解](./images/%40requestParam%E6%B3%A8%E8%A7%A3.png)

![自定义类型转换器](./images/%E8%87%AA%E5%AE%9A%E4%B9%89%E7%B1%BB%E5%9E%8B%E8%BD%AC%E6%8D%A2%E5%99%A8.png)

![@RequestHeader获取请求头和@CookieValue获取Cookie](./images/%40RequestHeader%E8%8E%B7%E5%8F%96%E8%AF%B7%E6%B1%82%E5%A4%B4%E5%92%8C%40CookieValue%E8%8E%B7%E5%8F%96Cookie.png)

#### SpringMVC 访问静态资源

```xml
<mvc:resourcess mapping="/js/**" location="/js/" />
<mvc:default-servlet-handler/>
```

#### SpringMVC 文件上传

![文件上传原理](./images/%E6%96%87%E4%BB%B6%E4%B8%8A%E4%BC%A0%E5%8E%9F%E7%90%86.png)

**文件上传步骤**
* 导入 filepload 和 io 坐标
* 配置文件上传解析器
* 编写文件上传编码

```xml
<!-- pom.xml -->
<!-- * 导入filepload和io坐标 -->
 <dependency>
    <groupId>commons-fileupload</groupId>
    <artifactId>commons-fileupload</artifactId>
    <version>1.3.3</version>
</dependency>
<dependency>
    <groupId>commons-io</groupId>
    <artifactId>commons-io</artifactId>
    <version>2.6</version>
</dependency>
```

```xml
<!-- spring-mvc.xml -->
<!-- * 配置文件上传解析器 -->
<bean id="multipartResolver" class="org.springframework.web.multipart.commons.CommonsMultipartResolver">
    <!-- 上传文件总大小 -->
    <property name="maxInMemorySize" value="5242800" />
    <!-- 上传单个文件大小 -->
    <property name="maxUploadSizePerFile" value="5242800" />
    <!-- 上传文件的编码类型 -->
    <property name="defaultEncoding" value="UTF-8" />
</bean>
```

```java
// * 编写文件上传编码
@RequestMapping(value="/quick20")
@ResponseBody
public void save20(String name, MultipartFile uploadFile) throws IOException {
    // 获取文件名称
    String originalFilename = uploadFile.getOriginalFilename();
    // 保存文件
    uploadFile.transferTo(new File("C:\\upload\\"+originalFilename));
}
```

### Spring JdbcTemplate 开发步骤

1. 导入 spring-jdbc 和 spring-tx 坐标
2. 创建数据库表和实体
3. 创建 JdbcTemplate 对象
4. 执行数据库操作
![Spring管理JdbcTemplate对象](./images/Spring%E7%AE%A1%E7%90%86JdbcTemplate%E5%AF%B9%E8%B1%A1.png)
![JdbcTemplate基本使用](./images/JdbcTemplate%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8.png)