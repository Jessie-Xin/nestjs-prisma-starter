# NestJS-Prisma 启动项目 QWEN.md


1. **禁止使用 `as` 类型断言和 `any` 类型** - 始终使用正确的类型推断和类型定义
2. 优先使用 TypeScript 的严格类型检查
3. 使用接口和类型定义确保类型安全
## 项目概述

这是一个使用 NestJS 和 Prisma 构建应用程序的综合启动模板。该项目提供了使用现代开发实践的现成基础，包括：

- **NestJS v11**: 用于构建高效和可扩展服务器端应用程序的渐进式 Node.js 框架
- **Prisma v6**: 适用于 Node.js 和 TypeScript 的下一代 ORM，提供类型安全的数据库访问
- **GraphQL**: 使用 Apollo Server 和 PlayGround 的代码优先方法
- **JWT 认证**: 使用 passport-jwt 的安全认证
- **PostgreSQL 数据库**: 带有 Docker 设置，便于开发
- **REST API 文档**: 集成 Swagger
- **Docker 支持**: 即用型 Docker 配置

## 架构结构

项目采用模块化架构，为以下模块提供专门的功能：
- `auth/`: 认证和授权功能
- `users/`: 用户管理功能
- `posts/`: 博客文章功能
- `common/`: 共享工具、配置和接口
- `prisma/`: 数据库模式和迁移文件

## 构建和运行

### 前置要求
- Node.js (v16 或更高版本)
- Docker (用于数据库容器)
- PostgreSQL (如果在本地运行而不使用 Docker)

### 安装说明

1. **安装依赖项**
   ```bash
   npm install
   # 或
   yarn install
   ```

2. **环境配置**
   - 将 `.env.example` 复制到 `.env` 并调整数据库配置
   - 设置适当的数据库凭据和安全密钥

3. **使用 Docker 设置数据库**
   ```bash
   # 启动 PostgreSQL 数据库容器
   docker-compose -f docker-compose.db.yml up -d
   # 或
   npm run docker:db
   ```

4. **数据库迁移**
   ```bash
   # 运行 Prisma 迁移
   npx prisma migrate dev
   # 或
   npm run migrate:dev
   ```

5. **生成 Prisma 客户端**
   ```bash
   npx prisma generate
   # 或
   npm run prisma:generate
   ```

6. **种子数据库 (可选)**
   ```bash
   npm run seed
   ```

7. **启动开发服务器**
   ```bash
   # 开发模式，带监视功能
   npm run start:dev
   
   # 常规启动
   npm run start
   
   # 生产构建和启动
   npm run build
   npm run start:prod
   ```

### 使用 Docker Compose 运行

```bash
# 构建 Docker 镜像
docker-compose build
# 或
npm run docker:build

# 启动所有服务
docker-compose up -d
# 或
npm run docker
```

## 主要特性

### GraphQL API
- 可用地址: `http://localhost:3000/graphql` (或配置的端口)
- 默认启用交互式 PlayGround
- 使用装饰器的代码优先方法
- 自动生成的模式文件

### REST API 文档
- Swagger UI 可在: `http://localhost:3000/api`
- 自动 API 文档生成
- 交互式 API 测试界面

### 认证
- 基于 JWT 的认证系统
- Passport 与 JWT 策略集成
- 刷新令牌支持
- 基于角色的访问控制 (ADMIN/USER)

### 数据库模式
项目包含具有以下内容的基本模式：
- **User 模型**: 带有电子邮件、密码、个人信息和角色
- **Post 模型**: 带有标题、内容、发布状态和作者关系
- **Role 枚举**: ADMIN 和 USER 角色

### 配置管理
- 使用 `@nestjs/config` 的集中配置
- 基于环境的配置支持
- CORS、Swagger、GraphQL 和安全配置

## 开发约定

### 代码结构
- 模块应遵循基于功能的方法
- 服务包含业务逻辑
- 控制器处理 HTTP 请求
- 解析器处理 GraphQL 操作
- DTO (数据传输对象) 验证输入/输出

### 测试
- 使用 Jest 进行单元和集成测试
- 测试文件使用 `.spec.ts` 扩展名
- 提供代码覆盖率报告
- E2E 测试支持

### Linting 和格式化
- ESLint 用于代码 linting
- Prettier 用于代码格式化
- TypeScript 类型检查已启用

## Docker 配置

项目包含多个 Docker Compose 文件：
- `docker-compose.yml`: 完整的应用程序设置，包括 NestJS 和数据库
- `docker-compose.db.yml`: 仅数据库容器
- `docker-compose.migrate.yml`: 迁移容器

## 关键依赖项

### 核心依赖项
- `@nestjs/core`, `@nestjs/common`: 核心 NestJS 功能
- `@nestjs/graphql`, `@nestjs/apollo`: GraphQL 集成
- `@nestjs/jwt`, `@nestjs/passport`: 认证
- `@prisma/client`: Prisma 数据库客户端
- `@nestjs/config`: 配置管理
- `@nestjs/swagger`: API 文档

### 开发依赖项
- `@nestjs/cli`: NestJS 命令行界面
- `@nestjs/testing`: 测试工具
- `prisma`: Prisma 模式和迁移工具
- `typescript`: 类型检查
- `jest`: 测试框架

## 常用命令

```bash
# 带热重载的开发服务器
npm run start:dev

# 构建生产版本
npm run build

# 运行测试
npm run test

# 运行测试并生成覆盖率报告
npm run test:cov

# 运行端到端测试
npm run test:e2e

# 生成 Prisma 客户端
npm run prisma:generate

# 监视模式下的 Prisma 生成
npm run prisma:generate:watch

# 重置数据库
npm run migrate:reset

# 打开 Prisma Studio
npm run prisma:studio

# 使用 Prettier 格式化代码
npm run format

# Lint 代码
npm run lint
```

## 安全注意事项

- JWT 令牌有较短的过期时间 (访问令牌为 2 分钟)
- Bcrypt 用于密码哈希 (盐轮数: 10)
- 默认启用 CORS 但可以配置
- 使用 class-validator 进行输入验证

## API 端点

- **GraphQL PlayGround**: `http://localhost:3000/graphql`
- **REST API 文档**: `http://localhost:3000/api`
- **应用程序**: `http://localhost:3000/`

## 环境变量

项目依赖多个环境变量：
- `DATABASE_URL`: 数据库连接字符串
- `JWT_ACCESS_SECRET`: 访问令牌的秘密
- `JWT_REFRESH_SECRET`: 刷新令牌的秘密
- `PORT`: 应用程序端口 (默认: 3000)
- 数据库凭据 (POSTGRES_USER, POSTGRES_PASSWORD, 等)