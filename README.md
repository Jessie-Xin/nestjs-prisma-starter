# NestJS Prisma 启动模板

😻 [NestJS](https://nestjs.com/) 和 [Prisma](https://www.prisma.io/) 的启动模板。

> 查看 [NestJS Prisma Schematics](https://github.com/marcjulian/nestjs-prisma) 以自动为你的 Nest 应用程序添加 Prisma 支持。

## 版本

| 分支                                                                                                       | Nest  | Prisma                                          | GraphQL                                                               | Apollo Server | Node.js |
| ------------------------------------------------------------------------------------------------------------ | ----- | ----------------------------------------------- | --------------------------------------------------------------------- | ------------- | ------- |
| upgrade-dependencies (当前分支)                                                                               | v11   | [v6](https://github.com/prisma/prisma)          | [Code-first](https://docs.nestjs.com/graphql/quick-start#code-first) | v5            | v18+    |
| main                                                                                                         | v9    | [v4](https://github.com/prisma/prisma)          | [Code-first](https://docs.nestjs.com/graphql/quick-start#code-first) | v3            | v16     |
| [nest-8-prisma-3](https://github.com/fivethree-team/nestjs-prisma-starter/tree/nest-8-prisma-3)             | v8    | [v3](https://github.com/prisma/prisma)          | [Code-first](https://docs.nestjs.com/graphql/quick-start#code-first) | -             | -       |
| [nest-7](https://github.com/fivethree-team/nestjs-prisma-starter/tree/nest-7)                               | v7    | [v2](https://github.com/prisma/prisma2)         | [Code-first](https://docs.nestjs.com/graphql/quick-start#code-first) | -             | -       |
| [nest-6-prisma2-code-first](https://github.com/fivethree-team/nestjs-prisma-starter/tree/nest-6-prisma2-code-first) | v6    | [v2-preview](https://github.com/prisma/prisma2) | [Code-first](https://github.com/19majkel94/type-graphql)             | -             | -       |
| [nest-6-code-first](https://github.com/fivethree-team/nestjs-prisma-starter/tree/nest-6-code-first)         | v6    | [v1](https://github.com/prisma/prisma)          | [Code-first](https://github.com/19majkel94/type-graphql)             | -             | -       |
| [nest-6-sdl-first](https://github.com/fivethree-team/nestjs-prisma-starter/tree/nest-6-sdl-first)           | v6    | [v1](https://github.com/prisma/prisma)          | [SDL First](https://docs.nestjs.com/graphql/quick-start#schema-first)| -             | -       |
| [nest-5](https://github.com/fivethree-team/nestjs-prisma-starter/tree/nest-5)                               | v5    | [v1](https://github.com/prisma/prisma)          | [SDL First](https://docs.nestjs.com/graphql/quick-start#schema-first)| -             | -       |

> **注意**：当前 `upgrade-dependencies` 分支已从 NestJS v10/Prisma v5/Node v16 升级至 **NestJS v11/Prisma v6/Apollo Server v5/Node v18+**，并启用 SWC 构建器以获得更快的构建速度。

## 功能特性

- 🚀 GraphQL，使用 [Apollo Server v5](https://www.apollographql.com/docs/apollo-server/) 和 [playground](https://github.com/prisma/graphql-playground)
- 📝 Code-First 方式，使用 [装饰器](https://docs.nestjs.com/graphql/quick-start#code-first) - schema 自动从 TypeScript 类生成
- 🗄️ [Prisma v6](https://www.prisma.io/) 用于数据库建模、迁移和类型安全访问（支持 PostgreSQL、MySQL 和 MongoDB）
- 🔐 JWT 身份认证，使用 [passport-jwt](https://github.com/mikenicholson/passport-jwt)
- ✨ REST API 文档，使用 [Swagger](https://swagger.io/)
- 🔄 GraphQL Subscriptions 实时更新支持
- 📄 游标分页，使用 [Relay cursor connections](https://relay.dev/graphql/connections.htm)
- ⚡ SWC 构建器加快编译速度
- 🐳 Docker 和 Docker Compose 支持
- ✅ 使用 Jest 进行单元测试和 E2E 测试
- 📏 ESLint 9 扁平配置格式
- 💅 Prettier 代码格式化

## 目录

- [NestJS Prisma 启动模板](#nestjs-prisma-启动模板)
  - [版本](#版本)
  - [功能特性](#功能特性)
  - [目录](#目录)
  - [Prisma 设置](#prisma-设置)
    - [1. 安装依赖](#1-安装依赖)
    - [2. 使用 Docker 配置 PostgreSQL](#2-使用-docker-配置-postgresql)
    - [3. Prisma 迁移](#3-prisma-迁移)
    - [4. Prisma Client JS](#4-prisma-client-js)
    - [5. 数据库种子数据](#5-数据库种子数据)
    - [6. 启动 NestJS 服务器](#6-启动-nestjs-服务器)
  - [GraphQL Playground](#graphql-playground)
  - [Rest Api](#rest-api)
  - [Docker](#docker)
    - [Docker Compose](#docker-compose)
  - [Schema 开发](#schema-开发)
  - [NestJS - Api Schema](#nestjs---api-schema)
    - [Resolver](#resolver)
  - [GraphQL 客户端](#graphql-客户端)
    - [Angular](#angular)
      - [设置](#设置)
      - [查询](#查询)
      - [变更](#变更)
      - [订阅](#订阅)
      - [身份验证](#身份验证)

## Prisma 设置

### 1. 安装依赖

安装 [Nestjs CLI](https://docs.nestjs.com/cli/usages) 以启动和[生成 CRUD 资源](https://trilon.io/blog/introducing-cli-generators-crud-api-in-1-minute)

```bash
# npm
npm i -g @nestjs/cli
# yarn
yarn global add @nestjs/cli
# pnpm
pnpm add -g @nestjs/cli
```

安装 Nest 应用程序的依赖项：

```bash
# npm
npm install
# yarn
yarn install
# pnpm
pnpm install
```

### 2. 使用 Docker 配置 PostgreSQL

使用 Docker 设置开发环境的 PostgreSQL。复制 [.env.example](./.env.example) 并重命名为 `.env` - `cp .env.example .env` - 这将设置 PostgreSQL 所需的环境变量，如 `POSTGRES_USER`、`POSTGRES_PASSWORD` 和 `POSTGRES_DB`。根据需要更新变量并选择一个强密码。

启动 PostgreSQL 数据库

```bash
docker compose -f docker-compose.db.yml up -d
# 或
npm run docker:db
```

### 3. Prisma 迁移

[Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate) 用于管理数据库的 schema 和迁移。Prisma 数据源需要环境变量 `DATABASE_URL` 来连接 PostgreSQL 数据库。Prisma 从根目录的 [.env](./.env) 文件读取 `DATABASE_URL`。

在[开发环境](https://www.prisma.io/docs/guides/migrate/developing-with-prisma-migrate)使用 Prisma Migrate：

1. 创建 `migration.sql` 文件
2. 更新数据库 Schema
3. 生成 Prisma Client

```bash
npx prisma migrate dev
# 或
npm run migrate:dev
```

如果你想自定义 `migration.sql` 文件，运行以下命令。自定义后运行 `npx prisma migrate dev` 应用它。

```bash
npx prisma migrate dev --create-only
# 或
npm run migrate:dev:create
```

如果你对数据库更改满意，想要将这些更改部署到[生产数据库](https://www.prisma.io/docs/guides/migrate/production-troubleshooting)。使用 `prisma migrate deploy` 应用所有待处理的迁移，也可在 CI/CD 管道中使用，因为它无需提示即可工作。

```bash
npx prisma migrate deploy
# 或
npm run migrate:deploy
```

### 4. Prisma Client JS

[Prisma Client JS](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/api) 是一个基于数据模型自动生成的类型安全数据库客户端。

运行以下命令生成 Prisma Client JS

> **注意**：每次更新 [schema.prisma](prisma/schema.prisma) 后都需要重新生成 Prisma Client JS

```bash
npx prisma generate
# 或
npm run prisma:generate
```

### 5. 数据库种子数据

使用此脚本为数据库填充种子数据：

```bash
npm run seed
```

### 6. 启动 NestJS 服务器

在开发模式下运行 Nest Server：

```bash
npm run start

# 监视模式
npm run start:dev
```

在生产模式下运行 Nest Server：

```bash
npm run start:prod
```

NestJS Server 的 GraphQL Playground 可在此访问：http://localhost:3000/graphql

**[⬆ 返回顶部](#目录)**

## GraphQL Playground

打开[示例 GraphQL 查询](graphql/auth.graphql)并将它们复制到 GraphQL Playground。某些查询和变更由身份验证守卫保护。你必须从 `signup` 或 `login` 获取 JWT token。将 `accessToken` 添加到 Playground 的 **HTTP HEADERS** 中，如下所示，并将 `YOURTOKEN` 替换为实际 token：

```json
{
  "Authorization": "Bearer YOURTOKEN"
}
```

## Rest Api

使用 Swagger 提供的 [RESTful API](http://localhost:3000/api) 文档。

## Docker

Nest server 是一个 Node.js 应用程序，很容易[容器化](https://nodejs.org/de/docs/guides/nodejs-docker-webapp/)。

查看 [Dockerfile](./Dockerfile) 了解如何构建 Nest server 的 Docker 镜像。

现在构建你自己的 Nest server 的 Docker 镜像：

```bash
# 给你的 docker 镜像命名
docker build -t <your username>/nest-prisma-server .
# 例如
docker build -t nest-prisma-server .
```

Docker 构建完镜像后，你就可以启动运行 nest server 的 docker 容器了：

```bash
docker run -d -t -p 3000:3000 --env-file .env nest-prisma-server
```

现在打开 [localhost:3000](http://localhost:3000) 验证你的 nest server 是否正在运行。

当你在 Docker 容器中运行 NestJS 应用程序时，更新你的 [.env](.env) 文件

```diff
- DB_HOST=localhost
# 替换为数据库容器的名称
+ DB_HOST=postgres

# Prisma 数据库连接
+ DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${DB_HOST}:${DB_PORT}/${POSTGRES_DB}?schema=${DB_SCHEMA}&sslmode=prefer
```

如果根目录的 `.env` 文件（被加载到 Docker 容器中）缺少 `DATABASE_URL`，NestJS 应用程序将退出并显示以下错误：

```bash
(node:19) UnhandledPromiseRejectionWarning: Error: error: Environment variable not found: DATABASE_URL.
  -->  schema.prisma:3
   |
 2 |   provider = "postgresql"
 3 |   url      = env("DATABASE_URL")
```

### Docker Compose

你也可以使用 docker-compose 设置数据库和 Nest 应用程序

```bash
# 构建新的 NestJS docker 镜像
docker compose build
# 或
npm run docker:build

# 启动 docker-compose
docker compose up -d
# 或
npm run docker
```

## Schema 开发

更新 Prisma schema `prisma/schema.prisma`，然后运行以下两个命令：

```bash
npx prisma generate
# 或监视模式
npx prisma generate --watch
# 或
npm run prisma:generate
npm run prisma:generate:watch
```

**[⬆ 返回顶部](#目录)**

## NestJS - Api Schema

[schema.graphql](./src/schema.graphql) 使用 [code first 方式](https://docs.nestjs.com/graphql/quick-start#code-first)从模型、resolver 和输入类生成。

你可以使用 [class-validator](https://docs.nestjs.com/techniques/validation) 验证你的输入和参数。

### Resolver

要实现新查询，需要在 resolver 文件中添加新的 resolver 函数。

```ts
@Query(() => User)
async getUser(@Args('id') id: string): Promise<User> {
  return this.usersService.findOne(id);
}
```

重启 NestJS server，这次获取 `user` 的查询应该可以工作了。

**[⬆ 返回顶部](#目录)**

## GraphQL 客户端

需要 GraphQL 客户端来使用 NestJS Server 提供的 GraphQL api。

查看 [Apollo](https://www.apollographql.com/) - 一个流行的 GraphQL 客户端，为 React、Angular、Vue.js、Native iOS、Native Android 等提供多个客户端。

### Angular

#### 设置

要开始在 Angular 和 Ionic 项目中使用 [Apollo Angular](https://www.apollographql.com/docs/angular/basics/setup.html)，只需运行：

```bash
ng add apollo-angular
```

`apollo-angular` 的 `HttpLink` 需要 `HttpClient`。因此，你需要将 `HttpClientModule` 添加到 `AppModule`：

```ts
imports: [BrowserModule,
    HttpClientModule,
    ...,
    GraphQLModule],
```

你还可以在 `AppModule` 中添加 `GraphQLModule`，使 `Apollo` 在你的 Angular App 中可用。

你需要设置 NestJS GraphQL Api 的 URL。打开文件 `src/app/graphql.module.ts` 并更新 `uri`：

```ts
const uri = 'http://localhost:3000/graphql';
```

要使用 Apollo-Angular，你可以将 `private apollo: Apollo` 注入到页面、组件或服务的构造函数中。

**[⬆ 返回顶部](#目录)**

#### 查询

要执行查询，你可以使用：

```ts
this.apollo.query({query: YOUR_QUERY});

# 或

this.apollo.watchQuery({
  query: YOUR_QUERY
}).valueChanges;
```

这是一个如何从 NestJS GraphQL Api 获取你的个人资料的示例：

```ts
const CurrentUserProfile = gql`
  query CurrentUserProfile {
    me {
      id
      email
      name
    }
  }
`;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  data: Observable<any>;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.data = this.apollo.watchQuery({
      query: CurrentUserProfile,
    }).valueChanges;
  }
}
```

在模板中使用 `AsyncPipe` 和 [SelectPipe](https://www.apollographql.com/docs/angular/basics/queries.html#select-pipe) 解包 data Observable：

```html
<div *ngIf="data | async | select: 'me' as me">
  <p>我的 id: {{me.id}}</p>
  <p>我的 email: {{me.email}}</p>
  <p>我的 name: {{me.name}}</p>
</div>
```

或使用 [RxJs](https://www.apollographql.com/docs/angular/basics/queries.html#rxjs) 解包数据。

这将导致 `GraphQL error`，因为 `Me` 受到 `@UseGuards(GqlAuthGuard)` 的保护并需要 `Bearer TOKEN`。
请参阅[身份验证](#身份验证)部分。

**[⬆ 返回顶部](#目录)**

#### 变更

要执行变更，你可以使用：

```ts
this.apollo.mutate({
  mutation: YOUR_MUTATION,
});
```

这是一个如何使用 `login` Mutation 登录到你的个人资料的示例：

```ts
const Login = gql`
  mutation Login {
    login(email: "test@example.com", password: "pizzaHawaii") {
      accessToken
      refreshToken
      user {
        id
        email
        firstname
        lastname
      }
    }
  }
`;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  data: Observable<any>;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.data = this.apollo.mutate({
      mutation: Login,
    });
  }
}
```

**[⬆ 返回顶部](#目录)**

#### 订阅

要执行订阅，你可以使用：

```ts
this.apollo.subscribe({
  query: YOUR_SUBSCRIPTION_QUERY,
});
```

**[⬆ 返回顶部](#目录)**

#### 身份验证

要验证你的请求，你必须将在 `signup` 和 `login` [变更](#变更)上收到的 `TOKEN` 添加到每个受 `@UseGuards(GqlAuthGuard)` 保护的请求中。

因为 apollo 客户端在底层使用 `HttpClient`，你可以简单地使用 `Interceptor` 将你的 token 添加到请求中。

创建以下类：

```ts
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = 'YOUR_TOKEN'; // 从本地存储获取
    if (token !== undefined) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(req);
  }
}
```

将 Interceptor 添加到 `AppModule` providers 中，如下所示：

```ts
providers: [
    ...
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    ...
  ]
```

配置 Interceptor 并从存储中检索 `TOKEN` 后，你的请求将在使用 `@UseGuards(GqlAuthGuard)` 的 resolver 上成功。

**[⬆ 返回顶部](#目录)**
