# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 在此代码库中工作时提供指导。

## 编码规范

1. **禁止使用 `as` 类型断言和 `any` 类型** - 始终使用正确的类型推断和类型定义
2. 优先使用 TypeScript 的严格类型检查
3. 使用接口和类型定义确保类型安全
4. 類型問題要從錯誤訊息中找到解決方案
5. 總是中文回答我

## 项目概述

NestJS Prisma Starter - 使用 NestJS v11、Prisma v6 和 Apollo Server v5 构建的全栈 GraphQL API。采用 JWT 身份验证配合 Passport、PostgreSQL 数据库和 code-first GraphQL 方式。

**当前分支：master** - 已从 NestJS v10/Prisma v5/Node v16 升级至 NestJS v11/Prisma v6/Apollo Server v5/Node v18+，并启用 SWC 构建器以获得更快的构建速度。


## 开发命令

### 基本命令
```bash
# 带监视模式的开发服务器
pnpm run start:dev

# 普通启动（无监视）
pnpm run start

# 生产环境构建
pnpm run build

# 运行生产环境构建
pnpm run start:prod

# 调试模式（带监视）
pnpm run start:debug
```

**注意：** 项目使用 SWC 构建器（配置在 nest-cli.json），构建速度比传统 TypeScript 编译器快约 20 倍。

### 数据库管理
```bash
# 在开发环境运行迁移（创建 migration.sql、更新 schema、生成客户端）
pnpm run migrate:dev

# 仅创建迁移文件（应用前可自定义）
pnpm run migrate:dev:create

# 部署迁移到生产环境（CI/CD 安全，无提示）
pnpm run migrate:deploy

# 重置数据库（仅开发环境 - 警告：会销毁所有数据）
pnpm run migrate:reset

# 检查迁移状态
pnpm run migrate:status

# 生成 Prisma Client（schema.prisma 更改后运行）
pnpm run prisma:generate

# 监视模式生成 Prisma Client
pnpm run prisma:generate:watch

# 打开 Prisma Studio GUI
pnpm run prisma:studio

# 用示例数据填充数据库
pnpm run seed
```

### 测试
```bash
# 运行一次单元测试
pnpm run test

# 监视模式运行测试
pnpm run test:watch

# 生成覆盖率报告
pnpm run test:cov

# 运行 E2E 测试
pnpm run test:e2e

# 调试测试
pnpm run test:debug
```

**测试文件位置：**
- 单元测试：`src/**/*.spec.ts`
- E2E 测试：`test/**/*.e2e-spec.ts`

### 代码质量
```bash
# 代码检查并自动修复
pnpm run lint

# 使用 Prettier 格式化代码
pnpm run format
```

**注意：** 项目使用 ESLint 9 扁平配置格式（eslint.config.mjs），不再使用传统的 `.eslintrc.js`。

### Docker
```bash
# 仅启动数据库（推荐用于本地开发）
pnpm run docker:db

# 构建并启动全栈（API + 数据库）
pnpm run docker

# 构建 Docker 镜像
pnpm run docker:build

# 在容器中运行迁移
pnpm run docker:migrate

# 在容器中填充数据库
pnpm run docker:seed
```

**Docker 配置文件：**
- `docker-compose.yml` - 完整栈（API + PostgreSQL）
- `docker-compose.db.yml` - 仅数据库
- `docker-compose.migrate.yml` - 仅迁移

## 架构

### 模块结构

应用程序遵循 NestJS 模块化架构与领域驱动设计：

- **AppModule**（根模块）- 引导 ConfigModule、PrismaModule、GraphQLModule 和功能模块
- **AuthModule** - JWT 身份验证（注册、登录、刷新令牌）
- **UsersModule** - 用户配置文件管理（me 查询、updateUser、changePassword）
- **PostsModule** - 内容管理，带游标分页和订阅

### 请求流程

1. GraphQL 客户端向 Apollo Server 发送查询/变更
2. 请求通过 GqlAuthGuard（如果是受保护的路由）
3. JwtStrategy 从 `Authorization: Bearer <token>` 头验证 JWT
4. UserEntity 装饰器从上下文中提取用户
5. Resolver 委托给 service
6. Service 使用 PrismaService 进行数据库操作
7. 响应根据自动生成的 GraphQL schema 格式化

### 数据库模型

位于 `prisma/schema.prisma`：

- **User** - 身份验证和配置文件（email、password、firstname、lastname、role、posts）
- **Post** - 内容（title、content、published、author）
- **Role** 枚举 - ADMIN、USER

关系：User 拥有多个 Posts（一对多）

### GraphQL Schema 生成

Schema 从 TypeScript 装饰器**自动生成**（code-first 方式）。`src/schema.graphql` 文件是自动生成的 - **不要手动编辑**。

修改 schema：
1. 更新 `src/**/*.model.ts` 中的 TypeScript 模型
2. 更新 `src/**/*.resolver.ts` 中的 resolvers
3. 服务器重启时 Schema 会重新生成

### 身份验证模式

基于 JWT 的无状态身份验证，有两种令牌类型：

- **accessToken** - 短期（2 分钟过期��用于 API 调用
- **refreshToken** - 长期（7 天）用于获取新的访问令牌

受保护的 resolvers 使用 `@UseGuards(GqlAuthGuard)` 并通过 `@UserEntity()` 装饰器提取用户。

密码哈希使用 bcrypt，10 个盐轮（可在 config.security.bcryptSaltOrRound 中配置）。

### 分页

Posts 通过 `@devoxa/prisma-relay-cursor-connection` 使用 **Relay 游标分页**：

- 输入：`PaginationArgs`（after、before、first、last）
- 输出：`PostConnection`（edges、pageInfo、totalCount）
- 支持多个字段排序（createdAt、updatedAt、title、content 等）
- 支持按标题文本搜索

### 配置管理

配置位于 `src/common/configs/`：

- **config.ts** - 主配置文件，定义所有应用配置
- **config.interface.ts** - 配置类型定义
- 全局 ConfigModule 在 AppModule 中加载
- 通过 `ConfigService.get<T>(key)` 访问配置
- 环境变量优先级：`.env.local` > `.env`（.env.local 不会提交到 git）

必需的环境变量：
```bash
DATABASE_URL=postgresql://user:password@host:port/db?schema=schema
JWT_ACCESS_SECRET=<secret>
JWT_REFRESH_SECRET=<secret>
PORT=3000 (可选，默认 3000)
```

配置项：
- `nest.port` - 应用端口
- `cors.enabled` - CORS 开关
- `swagger.enabled` - Swagger 文档开关
- `graphql.playgroundEnabled` - GraphQL Playground 开关
- `security.expiresIn` - JWT 访问令牌过期时间（默认 120 秒）
- `security.refreshIn` - JWT 刷新令牌过期时间（默认 7 天）
- `security.bcryptSaltOrRound` - bcrypt 盐轮数（默认 10）

## 常见开发任务

### 添加新的 GraphQL Resolver

1. 在 `src/[module]/models/[name].model.ts` 中创建模型：
```typescript
@ObjectType()
export class MyModel extends BaseModel {
  @Field(() => String)
  name: string;
}
```

2. 在 `src/[module]/dto/[name].input.ts` 中创建输入 DTO：
```typescript
@InputType()
export class CreateMyModelInput {
  @Field()
  name: string;
}
```

3. 在 `src/[module]/[module].resolver.ts` 中添加 resolver 方法：
```typescript
@Query(() => MyModel)
async getMyModel(@Args('id') id: string) {
  return this.myService.findOne(id);
}

@Mutation(() => MyModel)
@UseGuards(GqlAuthGuard)  // 如果需要身份验证
async createMyModel(
  @Args('data') data: CreateMyModelInput,
  @UserEntity() user: User  // 如果需要当前用户
) {
  return this.myService.create(data, user.id);
}
```

### 修改数据库 Schema

1. 更新 `prisma/schema.prisma`
2. 创建迁移：`pnpm run migrate:dev:create -- --name descriptive_migration_name`
3. 在 `prisma/migrations/` 中查看生成的 SQL
4. 应用迁移：`pnpm run migrate:dev`
5. Prisma Client 会自动生成

### 添加受保护的路由

在 resolver 方法上使用 `@UseGuards(GqlAuthGuard)` 和 `@UserEntity()` 装饰器来访问当前用户：

```typescript
@Mutation(() => Post)
@UseGuards(GqlAuthGuard)
async createPost(
  @Args('data') data: CreatePostInput,
  @UserEntity() user: User
) {
  return this.postsService.create(data, user.id);
}
```

### GraphQL 订阅

PostsModule 演示了使用 PubSub 的实时订阅：

```typescript
@Subscription(() => Post)
postCreated() {
  return this.pubSub.asyncIterator('postCreated');
}
```

从 mutation 中触发：
```typescript
this.pubSub.publish('postCreated', { postCreated: newPost });
```

## 测试

- 单元测试：`src/**/*.spec.ts` - 测试 services 和工具
- E2E 测试：`test/**/*.e2e-spec.ts` - 测试完整的请求/响应周期
- 使用 `@nestjs/testing` 创建测试模块
- 使用 `chance` 库生成随机测试数据
- 模式：TestingModule → compile() → get() service → test methods

## 重要注意事项

### 技术栈版本

当前使用的主要技术栈：
- **NestJS**: v11.1.7
- **Prisma**: v6.18.0
- **Apollo Server**: v5.0.0
- **GraphQL**: v16.11.0
- **Node.js**: v18+（推荐 v18 或 v20）
- **PostgreSQL**: 15（Docker 镜像版本）
- **TypeScript**: v5.9.3

### 破坏性变更说明

从 v10/v5 升级到当前版本的重要变更：
- `.eslintrc.js` 已删除，改用 `eslint.config.mjs`（ESLint 9 扁平配置）
- schema.prisma 中的 DBML 生成器已注释掉（版本兼容性问题）
- NestJS 使用 SWC 构建器代替传统 TypeScript 编译器
- Apollo Server 从 v3 升级到 v5，使用新的集成方式 `@as-integrations/express5`

### 使用 Prisma 时

**必须遵循的规则：**
- schema 更改后始终运行 `pnpm run prisma:generate`
- 永远不要手动编辑 `src/schema.graphql`（由 NestJS GraphQL 自动生成）
- 所有 schema 更改都使用迁移（不要在生产环境使用 `prisma db push`）
- 种子数据使用预哈希密码以保持一致性

**工作流程：**
1. 修改 `prisma/schema.prisma`
2. 运行 `pnpm run migrate:dev:create -- --name your_migration_name` 创建迁移
3. 检查生成的 SQL 文件（可手动调整）
4. 运行 `pnpm run migrate:dev` 应用迁移
5. Prisma Client 会自动重新生成

### Docker 注意事项

**本地开发 vs Docker 环境：**

在 Docker 容器中运行时，需要修改 `.env` 中的数据库主机：
```bash
# 本地开发
DB_HOST=localhost

# Docker 环境
DB_HOST=postgres  # 使用容器名称

# 完整的 DATABASE_URL
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${DB_HOST}:${DB_PORT}/${POSTGRES_DB}?schema=${DB_SCHEMA}&sslmode=prefer
```

**常见问题：**
- 如果 API 无法连接数据库，检查 `DB_HOST` 设置
- Docker Compose 中数据库健康检查确保 PostgreSQL 完全启动后才启动 API
- 数据持久化使用 Docker volume `nest-db`

### GraphQL Playground

**访问方式：**
- URL: http://localhost:3000/graphql
- 需要在 `src/common/configs/config.ts` 中设置 `config.graphql.playgroundEnabled = true`

**使用身份验证：**

对于需要身份验证的请求（使用 `@UseGuards(GqlAuthGuard)` 的 resolver），在 HTTP HEADERS 中添加：
```json
{
  "Authorization": "Bearer YOUR_ACCESS_TOKEN"
}
```

**获取 token：**
1. 使用 `signup` mutation 注册用户
2. 或使用 `login` mutation 登录
3. 从响应中获取 `accessToken`
4. 将 token 添加到请求头中

**示例查询文件：**
- `graphql/auth.graphql` - 包含认证相关的查询示例

### Swagger API 文档

**访问方式：**
- URL: http://localhost:3000/api
- 需要在 `src/common/configs/config.ts` 中设置 `config.swagger.enabled = true`

**注意：**
- 本项目主要使用 GraphQL API
- REST API 仅用于健康检查和基本操作
- Swagger 文档通过 `@nestjs/swagger/plugin` 自动从代码装饰器生成

### 延迟字段解析

Resolvers 使用延迟加载模式以避免 N+1 查询：

```typescript
@ResolveField('author', () => User)
async author(@Parent() post: Post) {
  return this.prisma.post.findUnique({ where: { id: post.id } }).author();
}
```

这允许 GraphQL 客户端可选地请求关系，而不总是加载它们。

## 文件位置快速参考

### 核心文件
- **入口点**：`src/main.ts`
- **根模块**：`src/app.module.ts`
- **GraphQL 配置**：`src/gql-config.service.ts`

### 数据库相关
- **数据库 schema**：`prisma/schema.prisma`
- **数据库种子**：`prisma/seed.ts`
- **迁移文件**：`prisma/migrations/`

### GraphQL
- **生成的 GraphQL schema**：`src/schema.graphql`（自动生成，不要手动编辑）
- **示例查询**：`graphql/auth.graphql`

### 配置和工具
- **配置**：`src/common/configs/`
  - `config.ts` - 主配置文件
  - `config.interface.ts` - 配置接口
- **共享装饰器**：`src/common/decorators/`
  - `user.decorator.ts` - `@UserEntity()` 装饰器
- **分页工具**：`src/common/pagination/`
  - `pagination.args.ts` - 分页参数
- **排序工具**：`src/common/order/`
- **通用模型**：`src/common/models/`

### 功能模块
- **认证模块**：`src/auth/`
  - `auth.service.ts` - 认证逻辑
  - `auth.resolver.ts` - GraphQL resolvers
  - `jwt.strategy.ts` - JWT 策略
  - `password.service.ts` - 密码哈希服务
  - `gql-auth.guard.ts` - GraphQL 认证守卫
- **用户模块**：`src/users/`
- **文章模块**：`src/posts/`

### 测试
- **单元测试**：`src/**/*.spec.ts`
- **E2E 测试**：`test/**/*.e2e-spec.ts`
- **Jest 配置**：`test/jest-e2e.json`

### 构建和工具配置
- **NestJS CLI**：`nest-cli.json` - 配置 SWC 构建器和插件
- **TypeScript**：`tsconfig.json`
- **ESLint**：`eslint.config.mjs` - ESLint 9 扁平配置
- **Prettier**：`.prettierrc`
- **Docker**：`Dockerfile`, `docker-compose*.yml`
