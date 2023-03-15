## Element Plus 源码分析——构建与代码风格（https://zhuanlan.zhihu.com/p/484016976）

### 目录结构

#### 源码

internal/build
├── build.config.ts         # unbuild 配置文件
├── dist                    # 构建产物
├── gulpfile.ts             # 构建脚本
├── package.json
├── src
│   ├── build-info.ts       # 构建信息
│   ├── constants.ts        # 一些常量
│   ├── index.ts            # 入口文件
│   ├── plugins             # 插件
│   │   └── element-plus-alias.ts  # 导入别名
│   ├── tasks
│   │   ├── full-bundle.ts  # 构建完整产物
│   │   ├── helper.ts       # 生成 WebStorm 提示文件
│   │   ├── index.ts
│   │   ├── modules.ts      # 构建 bundleless 产物
│   │   └── types-definitions.ts # 生成 d.ts 文件
│   ├── type-safe.json      # 「类型安全」列表
│   └── utils               # 工具函数
│       ├── gulp.ts
│       ├── index.ts
│       ├── log.ts
│       ├── paths.ts
│       ├── pkg.ts
│       ├── process.ts
│       └── rollup.ts
├── tsconfig.json
└── vue-jest-transformer.js

#### 构建产物

dist/
├── element-plus         # 最终构建产物
│   ├── README.md
│   ├── attributes.json
│   ├── dist             # 完整构建产物
│   ├── es               # bundleless 构建产物，ESM 格式
│   ├── global.d.ts      # 供 Volar 使用的全局组件类型
│   ├── lib              # bundleless 构建产物，CJS 格式
│   ├── package.json
│   ├── tags.json
│   ├── theme-chalk      # 样式产物
│   └── web-types.json
└── types                # 类型声明产物
