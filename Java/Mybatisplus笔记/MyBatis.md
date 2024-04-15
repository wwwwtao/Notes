## MyBatis

#### 使用步骤

##### 步骤 1: 添加 mybatis 依赖

```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>5.1.46</version>
</dependency>
<dependency>
    <groupId>com.mybatis</groupId>
    <artifactId>mybatis</artifactId>
</dependency>
```

##### 步骤 2: 创建 user 数据表

##### 步骤 3: 编写 User 实体类

##### 步骤 4: 编写映射文件 UserMapper.xml

```xml
<!-- UserMapper.xml -->

<!-- ...省略约束头 -->
<mapper namespcace="userMapper">
  <select id="findAll" resultType="com.wwwwtao.domain.User">
    select * from user
  </select>
</mapper>
```

##### 步骤 5: 编写核心文件 SqlMapConfig.xml

![MyBatis核心文件](./assets/MyBatis%E6%A0%B8%E5%BF%83%E6%96%87%E4%BB%B6.png)

##### 步骤 6: 编写测试代码

![Mybatis测试代码1](./assets/Mybatis%E6%B5%8B%E8%AF%95%E4%BB%A3%E7%A0%811.png)

### MyBatis 映射文件

![MyBatis 映射文件概述](./assets/MyBatis%20%E6%98%A0%E5%B0%84%E6%96%87%E4%BB%B6%E6%A6%82%E8%BF%B0.png)

![sql片段抽取](./assets/sql%E7%89%87%E6%AE%B5%E6%8A%BD%E5%8F%96.png)

![动态SQL之<if>](./assets/动态SQL之if.png)

![动态SQL之<foreach>](./assets/动态SQL之foreach.png)

### MyBatis 增删改查

![MyBatis的插入数据操作](./assets/MyBatis%E7%9A%84%E6%8F%92%E5%85%A5%E6%95%B0%E6%8D%AE%E6%93%8D%E4%BD%9C.png)

![增删改查映射配置与API](./assets/%E5%A2%9E%E5%88%A0%E6%94%B9%E6%9F%A5%E6%98%A0%E5%B0%84%E9%85%8D%E7%BD%AE%E4%B8%8EAPI.png)

### MyBatis 核心配置文件

* configuration 配置
  * properties 属性
  * settings 设置
  * typeAliases 类型别名
  * typeHandlers 类型处理器
  * objectFactory 对象工厂
  * plugins 插件
  * environments 环境
    * environment 环境变量
      * transactionManager 事务管理器
      * dataSource 数据源
  * databaseIdProvider 数据库厂商标识
  * mappers 映射器

![environments标签](./assets/environments%E6%A0%87%E7%AD%BE.png)
![environments标签1](./assets/environments%E6%A0%87%E7%AD%BE1.png)

![mapper标签](./assets/mapper%E6%A0%87%E7%AD%BE.png)

![typeAliases](./assets/typeAliases.png)

![plugins标签](./assets/plugins%E6%A0%87%E7%AD%BE.png)
![plugins标签2](./assets/plugins%E6%A0%87%E7%AD%BE2.png)

### MyBatis API

![SqlSession工厂构建器SqlSessionFactoryBuilder](./assets/SqlSession%E5%B7%A5%E5%8E%82%E6%9E%84%E5%BB%BA%E5%99%A8SqlSessionFactoryBuilder.png)

![SqlSession工厂对象SqlSessionFactory](./assets/SqlSession%E5%B7%A5%E5%8E%82%E5%AF%B9%E8%B1%A1SqlSessionFactory.png)

![SqlSession实例对象](./assets/SqlSession%E5%AE%9E%E4%BE%8B%E5%AF%B9%E8%B1%A1.png)

### MyBatis 的 DAO 层的开发方式

![MyBatis的DAO层代理开发方式](./assets/MyBatis%E7%9A%84DAO%E5%B1%82%E4%BB%A3%E7%90%86%E5%BC%80%E5%8F%91%E6%96%B9%E5%BC%8F.png)

### MyBatis 多表操作

![MyBatis多表配置方式](./assets/Mybatis%20%E5%A4%9A%E8%A1%A8%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F.png)

![Mybatis的常用注解](./assets/Mybatis%E7%9A%84%E5%B8%B8%E7%94%A8%E6%B3%A8%E8%A7%A3.png)
![Mybatis的注解1](./assets/Mybatis%E6%B3%A8%E8%A7%A31.png)
![Mybatis的注解2](./assets/Mybatis%E6%B3%A8%E8%A7%A32.png)
![Mybatis一对一的注解开发.png](./assets/Mybatis%E4%B8%80%E5%AF%B9%E4%B8%80%E7%9A%84%E6%B3%A8%E8%A7%A3%E5%BC%80%E5%8F%91.png)
![Mybatis一对多的注解开发.png](./assets/Mybatis%E4%B8%80%E5%AF%B9%E5%A4%9A%E7%9A%84%E6%B3%A8%E8%A7%A3%E5%BC%80%E5%8F%91.png)