# GraphQL 自动生成代码指南

本指南介绍如何使用 **GraphQL Code Generator** 自动生成类型安全的查询、变更和类型定义。

---

## 📋 目录

- [方法 1: GraphQL Code Generator（前端使用）](#方法-1-graphql-code-generator前端使用)
- [方法 2: 使用 GraphQL Playground 导出](#方法-2-使用-graphql-playground-导出)
- [方法 3: 使用 Prisma Client（后端使用）](#方法-3-使用-prisma-client后端使用)

---

## 方法 1: GraphQL Code Generator（前端使用）

### 适用场景

如果你要构建**前端应用**（React、Vue、Angular 等），使用 GraphQL Code Generator 可以：

- ✅ 从 GraphQL Schema 自动生成 TypeScript 类型
- ✅ 生成类型安全的 React Hooks / Vue Composables
- ✅ 自动补全和类型检查
- ✅ 避免手写类型定义

### 1. 安装依赖

在你的**前端项目**中安装：

```bash
npm install -D @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations @graphql-codegen/typescript-react-apollo
# 或
pnpm add -D @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations @graphql-codegen/typescript-react-apollo
```

**根据你的框架选择：**

```bash
# React (使用 Apollo Client)
npm install -D @graphql-codegen/typescript-react-apollo

# Vue (使用 Vue Apollo)
npm install -D @graphql-codegen/typescript-vue-apollo

# Angular
npm install -D @graphql-codegen/typescript-apollo-angular

# 通用 TypeScript（不依赖特定框架）
npm install -D @graphql-codegen/typescript-generic-sdk
```

### 2. 创建配置文件

在**前端项目根目录**创建 `codegen.ts` 或 `codegen.yml`：

#### 配置文件 `codegen.ts`

```typescript
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  // GraphQL Schema 来源（指向你的 NestJS API）
  schema: 'http://localhost:3000/graphql',

  // GraphQL 查询文件位置
  documents: ['src/**/*.graphql', 'src/**/*.gql'],

  // 生成的代码输出位置
  generates: {
    './src/generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo', // 如果使用 React
      ],
      config: {
        withHooks: true, // 生成 React Hooks
        withHOC: false,
        withComponent: false,
      },
    },

    // 生成 GraphQL Schema 文档
    './src/generated/schema.graphql': {
      plugins: ['schema-ast'],
    },
  },
};

export default config;
```

#### 或使用 YAML 格式 `codegen.yml`

```yaml
schema: http://localhost:3000/graphql
documents:
  - 'src/**/*.graphql'
  - 'src/**/*.gql'
generates:
  ./src/generated/graphql.ts:
    plugins:
      - typescript
      - typescript-operations
      - typescript-react-apollo
    config:
      withHooks: true
      withHOC: false
      withComponent: false
  ./src/generated/schema.graphql:
    plugins:
      - schema-ast
```

### 3. 创建 GraphQL 查询文件

在前端项目的 `src/graphql/` 目录创建查询文件：

#### `src/graphql/auth.graphql`

```graphql
mutation Login($email: String!, $password: String!) {
  login(data: { email: $email, password: $password }) {
    accessToken
    refreshToken
    user {
      id
      email
      firstname
      lastname
      role
    }
  }
}

mutation Signup($email: String!, $password: String!) {
  signup(data: { email: $email, password: $password }) {
    accessToken
    refreshToken
    user {
      id
      email
    }
  }
}
```

#### `src/graphql/user.graphql`

```graphql
query Me {
  me {
    id
    email
    firstname
    lastname
    role
    createdAt
    updatedAt
  }
}

mutation UpdateUser($firstname: String, $lastname: String) {
  updateUser(data: { firstname: $firstname, lastname: $lastname }) {
    id
    email
    firstname
    lastname
  }
}
```

#### `src/graphql/posts.graphql`

```graphql
query PublishedPosts($first: Int!, $after: String, $orderBy: PostOrder) {
  publishedPosts(first: $first, after: $after, orderBy: $orderBy) {
    totalCount
    edges {
      cursor
      node {
        id
        title
        content
        createdAt
        author {
          id
          firstname
          lastname
        }
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}

mutation CreatePost($title: String!, $content: String!) {
  createPost(data: { title: $title, content: $content }) {
    id
    title
    content
    published
    createdAt
  }
}
```

### 4. 添加 npm 脚本

在前端项目的 `package.json` 中添加：

```json
{
  "scripts": {
    "codegen": "graphql-codegen --config codegen.ts",
    "codegen:watch": "graphql-codegen --config codegen.ts --watch"
  }
}
```

### 5. 生成代码

```bash
# 确保 NestJS API 正在运行
npm run start:dev  # 在 NestJS 项目中

# 在前端项目中生成代码
npm run codegen

# 或监视模式（文件改变时自动生成）
npm run codegen:watch
```

### 6. 使用生成的代码

生成后，你可以在前端代码中使用类型安全的 Hooks：

#### React 示例

```typescript
import React from 'react';
import { useLoginMutation, useMeQuery } from './generated/graphql';

function LoginComponent() {
  const [login, { data, loading, error }] = useLoginMutation();

  const handleLogin = async () => {
    try {
      const result = await login({
        variables: {
          email: 'bart@simpson.com',
          password: 'secret42',
        },
      });

      // 完全类型安全！
      console.log(result.data?.login.accessToken);
      console.log(result.data?.login.user.email);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button onClick={handleLogin}>
      {loading ? '登录中...' : '登录'}
    </button>
  );
}

function UserProfile() {
  const { data, loading, error } = useMeQuery();

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error.message}</div>;

  return (
    <div>
      <h1>{data?.me.firstname} {data?.me.lastname}</h1>
      <p>{data?.me.email}</p>
      <p>角色: {data?.me.role}</p>
    </div>
  );
}
```

---

## 方法 2: 使用 GraphQL Playground 导出

### 适用场景

适合快速测试和生成单个查询。

### 步骤

1. **在 GraphQL Playground 中编写查询**
   ```graphql
   query Me {
     me {
       id
       email
     }
   }
   ```

2. **点击右侧的 "COPY CURL"**
   - 可以导出为 curl 命令
   - 可以导出为各种编程语言的代码

3. **使用工具转换**
   - 使用 [transform.tools](https://transform.tools/graphql-to-typescript) 将 GraphQL 转换为 TypeScript
   - 使用 [Apollo Studio](https://studio.apollographql.com/) 的代码生成功能

---

## 方法 3: 使用 Prisma Client（后端使用）

### 适用场景

如果你在**后端 NestJS 项目**中需要类型，Prisma 已经自动生成：

```typescript
import { PrismaService } from 'nestjs-prisma';

export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    // Prisma 自动生成的类型！
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        posts: true, // 自动补全和类型检查
      },
    });
  }
}
```

**Prisma 类型已经自动生成在：**
- `node_modules/.prisma/client/index.d.ts`

---

## 完整前端项目示例

### 项目结构

```
my-frontend-app/
├── src/
│   ├── graphql/           # 手写的 GraphQL 查询
│   │   ├── auth.graphql
│   │   ├── user.graphql
│   │   └── posts.graphql
│   ├── generated/         # 自动生成的代码（不要手动编辑）
│   │   ├── graphql.ts
│   │   └── schema.graphql
│   ├── components/
│   │   ├── Login.tsx
│   │   └── UserProfile.tsx
│   └── App.tsx
├── codegen.ts            # Code Generator 配置
└── package.json
```

### Apollo Client 配置

```typescript
// src/apollo-client.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
```

### App 入口

```typescript
// src/App.tsx
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo-client';
import LoginComponent from './components/Login';

function App() {
  return (
    <ApolloProvider client={client}>
      <LoginComponent />
    </ApolloProvider>
  );
}

export default App;
```

---

## 常见问题

### Q: 生成的代码在哪里？

A: 默认在 `src/generated/graphql.ts`，可以在 `codegen.ts` 中配置。

### Q: 什么时候需要重新生成？

A: 当以下情况发生时：
- 后端 GraphQL Schema 改变
- 添加新的 `.graphql` 查询文件
- 修改现有查询

### Q: 生成的文件要提交到 Git 吗？

A: **推荐提交**，这样团队成员不需要每次都生成。但也可以添加到 `.gitignore`，在 CI/CD 中自动生成。

### Q: 如何处理认证？

A: 使用 Apollo Client 的 `setContext` link（见上面的 Apollo Client 配置示例）。

---

## 推荐的开发流程

1. **后端开发者**：
   - 在 NestJS 中定义 GraphQL Schema
   - 启动 API：`npm run start:dev`

2. **前端开发者**：
   - 在 `src/graphql/` 中编写查询
   - 运行生成器：`npm run codegen`
   - 使用生成的 Hooks/类型
   - 享受完全的类型安全！

---

## 相关资源

- [GraphQL Code Generator 文档](https://the-guild.dev/graphql/codegen)
- [Apollo Client 文档](https://www.apollographql.com/docs/react/)
- [TypeScript GraphQL 最佳实践](https://www.apollographql.com/docs/react/development-testing/static-typing/)

---

**总结：** 使用 GraphQL Code Generator 可以让你的前端代码享受完全的类型安全，减少运行时错误，提高开发效率！ 🎉
