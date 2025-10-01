# @coffic/astro-users

一个用于 Cloudflare D1 数据库用户管理的 Astro 集成。

## 安装

### 使用 `astro add` 命令（推荐）

Astro 提供了一个易于使用的命令来向项目添加集成：

```bash
# 使用 npm
npx astro add @coffic/astro-users

# 使用 pnpm
pnpm astro add @coffic/astro-users

# 使用 yarn
yarn astro add @coffic/astro-users
```

该命令将：
1. 安装包及其对等依赖
2. 自动将集成添加到您的 `astro.config.mjs` 文件中
3. 添加任何所需的配置
4. 向项目中注入用户管理页面

### 手动安装

如果您更喜欢手动安装：

1. 安装包：
```bash
# 使用 npm
npm install @coffic/astro-users

# 使用 pnpm
pnpm add @coffic/astro-users

# 使用 yarn
yarn add @coffic/astro-users
```

2. 将集成添加到您的 `astro.config.mjs` 文件中：
```js
import { defineConfig } from 'astro/config';
import astroUsers from '@coffic/astro-users';

export default defineConfig({
  integrations: [
    astroUsers({
      devMode: true, // 开发模式下设为 true
    })
  ]
});
```

## 配置

该集成接受以下选项：

### `devMode`
- **类型:** `boolean`
- **默认值:** `false`
- **描述:** 是否在开发模式下管理用户

```js
astroUsers({
  devMode: true
})
```

## 注入的路由

当集成添加到您的项目中时，以下路由会自动注入：

- `/users` - 用户列表页面
- `/users/create` - 创建用户页面
- `/users/[id]` - 用户详情页面
- `/users/[id]/edit` - 编辑用户页面

这些页面提供了一个完整的用户管理界面，开箱即用。

## 使用

安装后，您可以使用 `UsersQuery` 类来管理用户：

```astro
---
import { UsersQuery } from '@coffic/astro-users';

const usersQuery = new UsersQuery(Astro.locals);

// 获取带分页的用户
const users = await usersQuery.getUsers({
  page: 1,
  limit: 10,
  sortBy: 'created_at',
  sortOrder: 'desc'
});

// 创建新用户
const newUser = await usersQuery.createUser({
  username: 'john_doe',
  email: 'john@example.com',
  password: 'secure_password'
});
---
```

## API 端点

该集成还提供 RESTful API 端点：

- `GET /api/users` - 获取用户列表
- `POST /api/users` - 创建新用户
- `GET /api/users/:id` - 获取单个用户
- `PUT /api/users/:id` - 更新用户
- `DELETE /api/users/:id` - 删除用户
- `GET /api/users/stats` - 获取用户统计数据

## 功能

- ✅ 使用 Cloudflare D1 数据库进行用户管理
- ✅ 自动数据库模式设置
- ✅ 用户创建、检索和删除
- ✅ 分页和筛选
- ✅ 用户统计
- ✅ TypeScript 支持
- ✅ 自动路由注入
- ✅ 内置用户管理界面

## 要求

- Astro v5.0.0 或更高版本
- Cloudflare D1 数据库（部署时）

## 许可证

MIT