# GraphQL Playground 认证测试流程

## 第一步：登录获取 Token

在 GraphQL Playground 左侧编辑器输入：

```graphql
mutation Login {
  login(data: {
    email: "bart@simpson.com",
    password: "secret42"
  }) {
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
```

点击播放按钮 ▶️ 执行。

---

## 第二步：复制 accessToken

从右侧结果中复制 `accessToken` 的值，例如：

```json
{
  "data": {
    "login": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbHkxMjM0NTYiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MTcwMDAwMDEyMH0.abcdefghijklmnopqrstuvwxyz",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "cly123456",
        "email": "bart@simpson.com",
        "firstname": "Bart",
        "lastname": "Simpson",
        "role": "ADMIN"
      }
    }
  }
}
```

**复制整个 accessToken 字符串！**

---

## 第三步：设置 HTTP Headers

1. 在 GraphQL Playground **左下角** 找到两个标签：
   - `QUERY VARIABLES`
   - `HTTP HEADERS` 👈 **点击这个**

2. 在 HTTP HEADERS 区域输入（注意 JSON 格式）：

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbHkxMjM0NTYiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MTcwMDAwMDEyMH0.abcdefghijklmnopqrstuvwxyz"
}
```

**重要提示：**
- ✅ `Bearer` 和 token 之间**必须有空格**
- ✅ 使用**双引号** `"`，不是单引号
- ✅ 复制**完整的** token（通常很长）
- ✅ **不要**修改 token 的任何字符

---

## 第四步：测试认证接口

现在可以调用需要认证的接口了。在左侧编辑器输入：

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
```

点击播放按钮 ▶️，应该能成功获取当前用户信息。

---

## 第五步：测试其他认证接口

### 更新用户信息

```graphql
mutation UpdateUser {
  updateUser(data: {
    firstname: "张",
    lastname: "三"
  }) {
    id
    email
    firstname
    lastname
  }
}
```

### 创建文章

```graphql
mutation CreatePost {
  createPost(data: {
    title: "测试文章标题",
    content: "这是文章的内容..."
  }) {
    id
    title
    content
    published
    createdAt
    author {
      id
      firstname
      lastname
    }
  }
}
```

### 查询自己的文章

```graphql
query MyPosts {
  userPosts(userId: "你的用户ID") {
    id
    title
    content
    published
    createdAt
  }
}
```

---

## 常见错误和解决方法

### ❌ 错误："Unauthorized"

**可能原因：**

1. **没有设置 HTTP Headers**
   - 解决：检查左下角 HTTP HEADERS 标签是否已设置

2. **Token 格式错误**
   ```json
   // ❌ 错误（缺少 Bearer）
   {
     "Authorization": "eyJhbGci..."
   }

   // ❌ 错误（Bearer 和 token 之间没有空格）
   {
     "Authorization": "BearereyJhbGci..."
   }

   // ✅ 正确
   {
     "Authorization": "Bearer eyJhbGci..."
   }
   ```

3. **Token 过期**
   - AccessToken 有效期：**2 分钟**
   - 解决：使用 refreshToken 获取新 token（见下方）

4. **Token 不完整**
   - 确保复制了完整的 token（通常有 200+ 个字符）

### 🔄 Token 过期了怎么办？

使用 refreshToken 获取新的 accessToken：

```graphql
mutation RefreshToken {
  refreshToken(token: "你的refreshToken") {
    accessToken
    refreshToken
  }
}
```

**注意：**
- RefreshToken 有效期：**7 天**
- 获取新 token 后，更新 HTTP HEADERS 中的 Authorization

---

## 可视化位置指南

```
┌────────────────────────────────────────────────────────────────┐
│  🎮 GraphQL Playground - http://localhost:3002/graphql        │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  [左侧：查询编辑区]              [右侧：结果显示区]               │
│  ┌─────────────────────┐        ┌─────────────────────┐       │
│  │ mutation Login {    │        │ {                   │       │
│  │   login(data: {     │        │   "data": {         │       │
│  │     email: "..."    │   ▶️   │     "login": {      │       │
│  │   }) {              │        │       "accessToken" │       │
│  │     accessToken     │        │       ...           │       │
│  │   }                 │        │     }               │       │
│  │ }                   │        │   }                 │       │
│  │                     │        │ }                   │       │
│  └─────────────────────┘        └─────────────────────┘       │
│                                                                │
├──────────────────────────────┬─────────────────────────────────┤
│ 📝 QUERY VARIABLES           │ 🔐 HTTP HEADERS  👈👈👈 点这里  │
├──────────────────────────────┴─────────────────────────────────┤
│  ⬇️ 在这里输入 Authorization                                    │
│  {                                                             │
│    "Authorization": "Bearer YOUR_ACCESS_TOKEN_HERE"            │
│  }                                                             │
└────────────────────────────────────────────────────────────────┘
```

---

## 测试检查清单

- [ ] 已成功登录并获取 accessToken
- [ ] 已复制完整的 token（通常 200+ 个字符）
- [ ] 已在 HTTP HEADERS 标签中设置 Authorization
- [ ] Bearer 和 token 之间有空格
- [ ] 使用双引号包裹键值
- [ ] Token 未过期（2 分钟内）
- [ ] 成功调用 `me` 查询测试认证

---

## 下一步

✅ 认证设置成功后，你可以：

1. 查看 `/使用指南.md` 了解所有 API 操作
2. 浏览 `/graphql/` 目录中的示例查询
3. 点击 Playground 右侧的 **DOCS** 查看完整 Schema

---

**祝你使用愉快！** 🎉

如果仍有问题，请检查：
- Console 是否有错误信息（F12 打开开发者工具）
- Token 是否真的设置在 HTTP HEADERS 中
- 服务器是否正常运行（检查终端日志）
