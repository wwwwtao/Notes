## MySQL 基础

- 概述
- SQL
- 函数
- 约束
- 多表查询
- 事务

### SQL

#### DDL（操作表结构，表中字段）

##### DDL 数据库操作

```SQL
-- 查询所有数据库
SHOW DATABASES;

-- 查询当前数据库
SELECT DATABASE();

-- 创建
CREATE DATABASE [IF NOT EXISTS] 数据库名 [DEFAULT CHARSET 字符集] [COLLATE 排序规则];

-- 删除
DROP DATABASE [IF EXISTS] 数据库名;

-- 使用
USE 数据库名;
```

##### DDL 表操作查询

```SQL
-- 查询当前数据库所有表
SHOW TABLES;

-- 查询表结构
DESC 表名;

-- 查询指定表的建表语句
SHOW CREATE TABLE 表名;
```

##### DDL 表操作创建

```SQL
CREATE 表名(
  字段1 字段1类型[COMMENT 字段1注释],
  字段2 字段2类型[COMMENT 字段2注释],
  ...
)[COMMENT 表注释]
```

##### DDL 表操作数据类型

1. ![数据库数值类型](./assets/数据库数值类型.jpg)
2. ![字符串类型](./assets/字符串类型.jpg)
3. ![日期时间类型](./assets/日期时间类型.jpg)

##### DDL 表操作修改

```SQL
-- 添加字段
ALTER TABLE 表名 ADD 字段名 类型(长度) [COMMENT注释] [约束];

-- 修改字段类型
ALTER TABLE 表名 MODIFY 字段名 新数据类型(长度);

-- 修改字段名和字段类型
ALTER TABLE 表名 CHANGE 旧字段名 新字段名 类型(长度) [COMMENT注释] [约束];

-- 删除字段
ALTER TABLE 表名 DROP 字段名;

-- 修改表名
ALTER TABLE 表名 RENAME TO 新表名;
```

##### DDL 表操作删除

```SQL
-- 删除表
DROP TABLE [IF EXISTS] 表名;

-- 删除指定表，并重新创建该表
TRUNCATE TABLE 表名;
```

#### DML（数据增删改）

##### INSERT 添加数据

```SQL
-- 给指定字段添加数据
INSERT INTO 表名(字段名1，字段名2, ...) VALUES (值1, 值2, ...);

-- 给全部字段添加数据
INSERT INTO 表名 VALUES (值1, 值2, ...);

-- 批量添加数据
INSERT INTO 表名(字段名1，字段名2, ...) VALUES (值1, 值2, ...),(值1, 值2, ...),(值1, 值2, ...);
INSERT INTO 表名 VALUES (值1, 2值, ...),(值1, 值2, ...),(值1, 值2, ...);
```

注意：
1. 插入数据时，指定的字段顺序与值的顺序是一一对应的
2. 字符串和日期型数据应该包含在引号中
3. 插入的数据大小，应该在字段的规定范围内

##### UPDATE 修改数据

```SQL
UPDATE 表名 SET 字段名1 = 值1, 字段名2 = 值2, ... [WHERE 条件];
```

注意：
1. 没有条件则会修改整张表

##### DELETE 删除数据

```SQL
DELETE FROM 表名 [WHERE 条件];
```

注意：
1. 没有条件则会删除整张表
2. DELETE 语句不能删除某个字段的值（可以使用 update）

#### DQL（数据查询）

```SQL
-- 编写顺序
SELECT
  字段列表
FROM
  表名列表
WHERE
  条件列表
GROUP BY
  分组字段列表
HAVING
  分组后条件列表
ORDER BY
  排序字段列表
LIMIT
  分页参数
```

1. ![SQL-DQL执行顺序](./assets/SQL-DQL执行顺序.png)
1. ![SQL-DQL语法小结.png](./assets/SQL-DQL语法小结.png)

##### DQL - 基本查询

```sql
-- 查询多个字段
SELECT 字段1,字段2,字段3... FROM 表名;
SELECT * FROM 表名;

-- 设置别名
SELECT 字段1[AS 别名1], 字段2[AS 别名2] ... FROM 表名;

-- 去除重复记录
SELECT DISTINCT 字段列表 FROM 表名;
```

##### DQL - 条件查询

```sql
SELECT 字段1,字段2,字段3... FROM 表名 WHERE 条件列表;
```

1. ![SQL-DQL条件查询](./assets/SQL-DQL条件查询.png)

##### DQL - 聚合函数

```sql
SELECT 聚合函数(字段列表) FROM 表名 WHERE 条件列表;
```

1. ![SQL-DQL聚合函数](./assets/SQL-DQL聚合函数.png)

##### DQL - 分组查询

```sql
SELECT 字段, 聚合函数(字段列表) [别名] FROM 表名 [WHERE 条件列表] GROUP BY 分组字段名 [HAVING 分组后过滤条件];
```

1. ![SQL-DQL分组查询](./assets/SQL-DQL分组查询.png)

##### DQL - 排序查询

```sql
SELECT 字段 [别名] FROM 表名 [WHERE 条件列表] ORDER BY 字段1 排序方式1, 字段2 排序方式2;
```

1. ![SQL-DQL排序查询](./assets/SQL-DQL排序查询.png)

##### DQL - 分页查询

```sql
SELECT 字段 [别名] FROM 表名 LIMIT 起始索引,查询记录数;
```

1. ![SQL-DQL分页查询](./assets/SQL-DQL分页查询.png)

#### DCL（数据控制语言，用来管理数据库用户，控制数据库的访问权限）

##### DCL - 管理用户

1. ![SQL-DCL管理用户](./assets/SQL-DCL管理用户.jpg)

##### DCL - 权限控制

1. ![SQL-DCL权限控制1](./assets/SQL-DCL权限控制1.jpg)
1. ![SQL-DCL权限控制2](./assets/SQL-DCL权限控制2.jpg)

### 函数

#### 字符串函数

1. ![字符串函数](./assets/字符串函数.jpg)

#### 数值函数

1. ![数值函数](./assets/数值函数.jpg)

#### 日期函数

1. ![日期函数](./assets/日期函数.jpg)

#### 流程函数

1. ![流程函数](./assets/流程函数.jpg)

### 约束

#### 约束概念和分类

1. ![约束概念和分类](./assets/约束概念和分类.jpg)

2. ![外键约束](./assets/外键约束.jpg)

2. ![外键的删除更新行为](./assets/外键的删除更新行为.jpg)

### 多表查询

#### 多表关系

1. 一对多：从表（多的一方）添加外键 绑定 主表（一的一方）主键
2. 多对多：添加中间表，中间表的两个外键关联两张表的主键
3. 一对一：任意表添加外键（唯一约束 UNIQUE 的外键）绑定另一张表主键

#### 多表查询 - 连接查询

1. ![多表查询概述和分类](./assets/多表查询分类.jpg)

2. ![内连接语法](./assets/内连接语法.jpg)

3. ![外连接语法](./assets/外连接语法.jpg)

4. ![自连接语法](./assets/自连接语法.jpg)

5. ![联合查询](./assets/联合查询.jpg)

#### 多表查询 - 子查询

1. ![子查询的概念和分类](./assets/子查询的概念和分类.jpg)

2. ![标量子查询](./assets/标量子查询.jpg)

3. ![列子查询 常用操作符:IN,NOT IN, ANY, SOME, All](./assets/列子查询操作符.jpg)
3.1 ![列子查询](./assets/列子查询.jpg)

4. ![行子查询 常用操作符:=, <>, IN,NOT IN](./assets/行子查询.jpg)

5. ![表子查询 常用操作符:IN](./assets/表子查询.jpg)

### 事务

## MySQL 进阶

- 存储引擎
- 索引
- SQL 优化
- 视图 / 存储过程 / 触发器
- 锁
- InnoDB 核心
- MySQL 管理

## 运维篇

- 日志
- 主从复制
- 分库分表
- 读写分离
