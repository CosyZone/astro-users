# astro-users 使用示例

## 基本使用

### 1. 在 Astro 页面中查询用户数据

```typescript
// pages/admin.astro
---
import { UsersQuery } from '@coffic/astro-users';

// 创建查询实例（直接传递 Astro.locals）
const usersQuery = new UsersQuery(Astro.locals);

// 获取用户记录（分页）
const users = await usersQuery.getUsers({
  page: 1,
  limit: 20,
  sortBy: 'created_at',
  sortOrder: 'desc'
});

// 获取统计数据
const stats = await usersQuery.getStats();
---

<div>
  <h1>用户统计</h1>
  <p>总用户数：{stats.totalUsers}</p>
  <p>活跃用户：{stats.activeUsers}</p>
  <p>今日新增：{stats.todayUsers}</p>
</div>

<div>
  <h2>用户列表</h2>
  {users.data.map(user => (
    <div key={user.id}>
      <p>用户名：{user.username}</p>
      <p>邮箱：{user.email}</p>
      <p>角色：{user.role}</p>
      <p>状态：{user.is_active ? '激活' : '未激活'}</p>
    </div>
  ))}
</div>
```

### 2. 创建 API 路由（带身份验证）

```typescript
// pages/api/admin/users.ts
---
import type { APIRoute } from 'astro';
import { UsersQuery } from '@coffic/astro-users';

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
  // 身份验证（示例：检查 session）
  const session = locals.session;
  if (!session?.user?.isAdmin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const usernameFilter = url.searchParams.get('username') || undefined;

    const db = locals.runtime?.env?.USERS_DB;
    const usersQuery = new UsersQuery(db);

    const result = await usersQuery.getUsers({
      page,
      limit,
      filters: {
        username: usernameFilter
      }
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
---
```

### 3. 使用 Astro 中间件进行身份验证

```typescript
// middleware.ts
import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { url, locals } = context;

  // 只对管理页面进行身份验证
  if (url.pathname.startsWith('/admin')) {
    // 检查 session 或 token
    const session = locals.session;
    if (!session?.user?.isAdmin) {
      return new Response('Unauthorized', { status: 401 });
    }
  }

  return next();
};
```

### 4. 在 React 组件中使用

```tsx
// components/UserDashboard.tsx
import { useState, useEffect } from 'react';
import {
  UsersQuery,
  type UserQueryOptions,
  type UserStats,
} from '@coffic/astro-users';

interface Props {
  db: any; // D1 数据库实例
}

export function UserDashboard({ db }: Props) {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      try {
        const usersQuery = new UsersQuery(db);

        const [usersData, statsData] = await Promise.all([
          usersQuery.getUsers({ page, limit: 20 }),
          usersQuery.getStats(),
        ]);

        setUsers(usersData.data);
        setStats(statsData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [page]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>用户统计</h1>
      <p>总用户数：{stats?.totalUsers}</p>
      <p>活跃用户：{stats?.activeUsers}</p>

      <h2>用户列表</h2>
      {users.map((user: any) => (
        <div key={user.id}>
          <p>
            {user.username} - {user.email}
          </p>
          <p>角色：{user.role} | 状态：{user.is_active ? '激活' : '未激活'}</p>
        </div>
      ))}

      <button onClick={() => setPage(page + 1)}>下一页</button>
    </div>
  );
}
```

## 高级查询示例

### 1. 角色和状态查询

```typescript
// 获取管理员用户
const adminUsers = await usersQuery.getUsersByRole('admin', {
  limit: 100
});

// 获取非活跃用户
const inactiveUsers = await usersQuery.getUsersByStatus(false, {
  sortBy: 'created_at',
  sortOrder: 'desc',
});

// 获取最近 7 天注册的用户
const recentUsers = await usersQuery.getRecentStats(7);
```

### 2. 用户搜索和管理

```typescript
// 根据用户名搜索用户
const userSearch = await usersQuery.getUsersByUsername('john', {
  sortBy: 'created_at',
  sortOrder: 'desc',
});

// 根据邮箱查找用户
const userByEmail = await usersQuery.getUserByEmail('john@example.com');

// 创建新用户
const newUser = await usersQuery.createUser({
  username: 'jane',
  email: 'jane@example.com',
  password: 'securepassword',
  first_name: 'Jane',
  last_name: 'Doe',
  role: 'user'
});

// 更新用户信息
const updatedUser = await usersQuery.updateUser(123, {
  is_active: false,
  role: 'moderator'
});
```

### 3. 用户数据管理

```typescript
// 删除特定用户
const deleted = await usersQuery.deleteUser(123);

// 批量删除用户
const userIds = [1, 2, 3, 4, 5];
const deletedCount = await usersQuery.deleteUsers(userIds);
```

## 与不同框架集成

### 1. Next.js API 路由

```typescript
// pages/api/users.ts
import { UsersQuery } from '@coffic/astro-users';

export default async function handler(req, res) {
  // 身份验证
  if (!req.session?.user?.isAdmin) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const db = getD1Database(); // 你的 D1 数据库获取方法
  const usersQuery = new UsersQuery(db);

  const users = await usersQuery.getUsers({
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 20,
  });

  res.json(users);
}
```

### 2. SvelteKit 页面

```typescript
// src/routes/admin/+page.server.ts
import { UsersQuery } from '@coffic/astro-users';

export async function load({ locals, url }) {
  // 身份验证
  if (!locals.user?.isAdmin) {
    throw error(401, 'Unauthorized');
  }

  const db = locals.runtime?.env?.USERS_DB;
  const usersQuery = new UsersQuery(db);

  const page = parseInt(url.searchParams.get('page') || '1');
  const users = await usersQuery.getUsers({ page, limit: 20 });
  const stats = await usersQuery.getStats();

  return {
    users,
    stats,
  };
}
```

## 注意事项

1. **数据库权限**：确保你的应用有权限访问 D1 数据库
2. **错误处理**：始终包装数据库操作在 try-catch 中
3. **性能优化**：大量数据时使用分页，避免一次性加载过多记录
4. **安全性**：在生产环境中实施适当的身份验证和授权
5. **类型安全**：使用 TypeScript 类型定义确保类型安全
6. **密码安全**：在实际应用中，确保密码经过适当加密处理

现在你可以完全控制用户数据、身份验证和管理界面了！🎉