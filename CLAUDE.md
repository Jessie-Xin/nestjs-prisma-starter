# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 在此代码库中工作时提供指导。

## 编码规范

1. **禁止使用 `as` 类型断言和 `any` 类型** - 始终使用正确的类型推断和类型定义
2. 优先使用 TypeScript 的严格类型检查
3. 使用接口和类型定义确保类型安全

## 项目概述

NestJS Prisma Starter - 使用 NestJS v11、Prisma v6 和 Apollo Server v5 构建的全栈 GraphQL API。采用 JWT 身份验证配合 Passport、PostgreSQL 数据库和 code-first GraphQL 方式。

当前分支 `upgrade-dependencies` 正在从 NestJS v10/Prisma v5/Node v16 升级到最新版本。

## 开发命令

### 基本命令
```bash
# 带监视模式的开发服务器
npm run start:dev

# 生产环境构建
npm run build

# 运行生产环境构建
npm run start:prod

# 调试模式
npm run start:debug
```

### 数据库管理
```bash
# 在开发环境运行迁移（创建 migration.sql、更新 schema、生成客户端）
npm run migrate:dev

# 仅创建迁移文件（应用前可自定义）
npm run migrate:dev:create

# 部署迁移到生产环境（CI/CD 安全，无提示）
npm run migrate:deploy

# 重置数据库（仅开发环境 - 警告：会销毁所有数据）
npm run migrate:reset

# 检查迁移状态
npm run migrate:status

# 生成 Prisma Client（schema.prisma 更改后运行）
npm run prisma:generate

# 监视模式生成 Prisma Client
npm run prisma:generate:watch

# 打开 Prisma Studio GUI
npm run prisma:studio

# 用示例数据填充数据库
npm run seed
```

### 测试
```bash
# 运行一次单元测试
npm run test

# 监视模式运行测试
npm run test:watch

# 生成覆盖率报告
npm run test:cov

# 运行 E2E ���试
npm run test:e2e

# 调试测试
npm run test:debug
```

### 代码质量
```bash
# 代码检查并自动修复
npm run lint

# 使用 Prettier 格式化代码
npm run format
```

### Docker
```bash
# 仅启动数据库
npm run docker:db

# 构建并启动全栈（API + 数据库）
npm run docker

# 构建 Docker 镜像
npm run docker:build

# 在容器中运行迁移
npm run docker:migrate

# 在容器中填充数据库
npm run docker:seed
```

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

- 全局 ConfigModule 在 AppModule 中加载
- 通过 `ConfigService.get<T>(key)` 访问
- 环境变量在 `.env` 中（从 `.env.example` 复制）

必需的环境变量：
```bash
DATABASE_URL=postgresql://user:password@host:port/db?schema=schema
JWT_ACCESS_SECRET=<secret>
JWT_REFRESH_SECRET=<secret>
PORT=3000 (可选)
```

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
2. 创建迁移：`npm run migrate:dev:create -- --name descriptive_migration_name`
3. 在 `prisma/migrations/` 中查看生成的 SQL
4. 应用迁移：`npm run migrate:dev`
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

### 当前迁移（upgrade-dependencies 分支）

此分支正在升级：
- NestJS v10.1.0 → v11.1.7
- Prisma v5.0.0 → v6.18.0
- Node.js v16 → v18+
- ESLint 转为扁平配置格式（eslint.config.mjs）
- 启用 SWC 构建器以加快构建速度

### 需要注意的破坏性变更

- `.eslintrc.js` 已删除，改用 `eslint.config.mjs`（扁平配置）
- schema.prisma 中的 DBML 生成器已注释掉，因为存在兼容性问题
- 某些已弃用的 API 可能需要更新

### 使用 Prisma 时

- schema 更改后始终运行 `npm run prisma:generate`
- 永远不要手动编辑 `src/schema.graphql`（自动生成）
- 所有 schema 更改都使用迁移（不要在生产环境使用 `prisma db push`）
- 种子数据使用预哈希密码以保持一致性

### Docker 注意事项

在 Docker 容器��运行时，更新 `.env`：
```bash
DB_HOST=postgres  # 而不是 localhost
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${DB_HOST}:${DB_PORT}/${POSTGRES_DB}?schema=${DB_SCHEMA}&sslmode=prefer
```

### GraphQL Playground

当 `config.graphql.playgroundEnabled = true` 时，访问 http://localhost:3000/graphql

对于需要身份验证的请求，添加到 HTTP HEADERS：
```json
{
  "Authorization": "Bearer YOUR_ACCESS_TOKEN"
}
```

### Swagger API 文档

当 `config.swagger.enabled = true` 时，REST API 文档可在 http://localhost:3000/api 访问

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

- **入口点**��`src/main.ts`
- **根模块**：`src/app.module.ts`
- **数据库 schema**：`prisma/schema.prisma`
- **数据库种子**：`prisma/seed.ts`
- **生成的 GraphQL schema**：`src/schema.graphql`（自动生成）
- **配置**：`src/common/configs/`
- **共享装饰器**：`src/common/decorators/`
- **分页工具**：`src/common/pagination/`
- **认证逻辑**：`src/auth/auth.service.ts`
- **JWT 策略**：`src/auth/jwt.strategy.ts`
- **示例查询**：`graphql/auth.graphql`
