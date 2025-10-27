# 仓库指南

## 项目结构与模块组织
- `src/` 聚合 NestJS 模块；在 `src/app.module.ts` 注册新模块，并将 DTO 与解析器与各自功能模块放在一起。
- `prisma/` 存放 `schema.prisma`、迁移与 `seed.ts`；修改数据模型前先更新此处的 schema。
- `graphql/` 保存由解析器生成的参考 SDL；契约变化时同步更新。
- `test/` 包含 Jest 单元测试以及位于 `test/jest-e2e.json` 的 e2e 配置。
- 根目录的 docker 文件（`docker-compose*.yml`、`Dockerfile*`）用于启动 Postgres 与 API 容器。

## 构建、测试与开发命令
- `npm run start:dev` 启动带热重载的开发服务器；`npm run start:prod` 使用编译产物运行。
- `npm run build` 输出 `dist/`，供生产或容器镜像使用。
- `npm run lint` 与 `npm run format` 结合 ESLint 和 Prettier；提交前应确保通过。
- `npm run test`、`npm run test:watch`、`npm run test:cov` 与 `npm run test:e2e` 覆盖单测、监听、覆盖率与 e2e 流程。
- `npm run migrate:dev` 或 `npm run migrate:reset` 应用 Prisma 数据迁移；结构变化后执行 `npm run prisma:generate`。
- `docker compose up -d`（或 `npm run docker`）启动本地栈；`npm run docker:db` 仅启动数据库容器。

## 代码风格与命名约定
- TypeScript 目标 ES2022，使用 2 空格缩进、单引号；依赖 Prettier 保持格式一致。
- 类与 GraphQL 类型采用 `PascalCase`，提供者同样使用 `PascalCase`，变量与函数使用 `camelCase`。
- DTO 文件以 `.dto.ts` 结尾，输入对象以 `.input.ts` 结尾；测试替身放在 `__mocks__/`。
- GraphQL SDL 与 Prisma schema 应与解析器装饰器保持一致，避免偏差。

## 测试指南
- Jest 在实现文件旁查找 `.spec.ts`；e2e 用例位于 `test/`，针对编译后的应用运行。
- 合并前运行 `npm run test:cov`，并关注 `coverage/` 中的覆盖率变化。
- 种子数据位于 `prisma/seed.ts`；新增实体时扩展种子，并用 e2e 断言覆盖。

## 提交与拉取请求规范
- 提交信息保持简短、祈使语（如 `Add post filters`、`Fix prisma seed`），并将迁移与 schema 变更组合提交。
- 通过 `(#123)` 引用相关 issue 或 PR，便于追踪。
- PR 描述应包含范围说明、测试证明（`npm run test`、`npm run test:e2e` 输出）、迁移或 schema 备注，以及必要的 GraphQL 查询截图。

## 数据库与环境提示
- 复制 `.env.example` 为 `.env`；运行迁移前确认 `DATABASE_URL` 指向 docker Postgres（默认 `postgres://postgres:postgres@localhost:5432/nest`）。
- 使用 `npm run prisma:studio` 进行数据调试，迁移前关闭 Studio 释放连接。
