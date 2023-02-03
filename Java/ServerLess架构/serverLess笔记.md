## 无服务架构 Serverless

### Serverless 概述

1. Serverless 是一种后端架构概念 / 思维

2. 后端架构的演进：

  物理机服务器（数据库 应用代码 运行环境在一起）==>
  虚拟机时代（解决了物理服务器的维护的问题，但是要管理服务器集群）==>
  docker（把代码和运行环境打包在一起，摆脱了集群管理和运行环境）==>
  serverLess （为了解决流量洪峰和平时不浪费）（不再关心运行环境和虚拟资源的调配）

### Serverless 基本概念

开发者只需要关注业务逻辑本身，由云平台统一调度管理运维

CNCF（云原生计算基金会）对 serverLess 的定义：
ServerLess 架构应该是采用 Faas（Function as a Server 函数即服务）和 Baas（Backend as a Server 后端即服务）服务来解决问题的一种设计

### Serverless 缺点

1. 严重依赖云平台厂商
2. 开发调试困难
3. 底层硬件不确定性

### 基本应用
https://www.bilibili.com/video/BV1fK4y1P76C?p=4&spm_id_from=pageDriver