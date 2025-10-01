# Astro 集成路由注入说明

## 简介

[@coffic/astro-users](file:///Users/angel/Code/Coffic/astro-users/packages/core/src/integration/index.ts#L8-L8) 集成通过 Astro 的 `injectRoute()` API 自动注入用户管理相关的页面路由。当集成被添加到 Astro 项目时，以下路由会自动可用：

## 注入的路由

1. **用户列表页面**
   - 路由模式: `/users`
   - 入口文件: `src/pages/users.astro`

2. **创建用户页面**
   - 路由模式: `/users/create`
   - 入口文件: `src/pages/users/create.astro`

3. **用户详情页面**
   - 路由模式: `/users/[id]`
   - 入口文件: `src/pages/users/[id]/index.astro`

4. **编辑用户页面**
   - 路由模式: `/users/[id]/edit`
   - 入口文件: `src/pages/users/[id]/edit.astro`

## 实现原理

在集成的 `astro:config:setup` 钩子中，我们使用 `injectRoute()` 方法来注册这些路由：

```typescript
injectRoute({
  pattern: '/users',
  entrypoint: '@coffic/astro-users/src/pages/users.astro'
});
```

## 使用方式

### 自动注入（推荐）

当用户通过 `astro add` 命令安装集成时，路由会自动注入：

```bash
# 使用 pnpm
pnpm astro add @coffic/astro-users

# 使用 npm
npx astro add @coffic/astro-users

# 使用 yarn
yarn astro add @coffic/astro-users
```

安装完成后，用户可以直接访问以下URL：
- `/users` - 用户列表
- `/users/create` - 创建用户
- `/users/1` - ID为1的用户详情
- `/users/1/edit` - 编辑ID为1的用户

### 手动配置

如果需要手动配置，可以在 `astro.config.mjs` 中添加集成：

```javascript
import { defineConfig } from 'astro/config';
import astroUsers from '@coffic/astro-users';

export default defineConfig({
  integrations: [
    astroUsers()
  ]
});
```

## 路由功能

### 用户列表页面 (/users)
- 显示所有用户列表
- 支持分页
- 支持筛选（按用户名、角色等）
- 显示用户统计信息

### 创建用户页面 (/users/create)
- 提供创建新用户的表单
- 表单验证
- 创建成功后重定向到用户列表

### 用户详情页面 (/users/[id])
- 显示用户的详细信息
- 提供删除用户功能
- 提供编辑用户链接

### 编辑用户页面 (/users/[id]/edit)
- 提供编辑用户信息的表单
- 表单预填充用户当前信息
- 更新成功后重定向到用户详情

## API 端点

除了页面路由，集成还提供以下 API 端点：

- `GET /api/users` - 获取用户列表
- `POST /api/users` - 创建新用户
- `GET /api/users/:id` - 获取单个用户
- `PUT /api/users/:id` - 更新用户信息
- `DELETE /api/users/:id` - 删除用户
- `GET /api/users/stats` - 获取用户统计数据

## 自定义配置

可以通过传递选项来自定义集成行为：

```javascript
export default defineConfig({
  integrations: [
    astroUsers({
      devMode: true // 在开发模式下启用用户管理
    })
  ]
});
```

## 注意事项

1. 集成需要 Astro v5.0.0 或更高版本
2. 集成会自动处理数据库迁移
3. 用户数据存储在 Cloudflare D1 数据库中（部署时）
4. 在开发环境中，集成会使用 Astro 的本地开发数据库