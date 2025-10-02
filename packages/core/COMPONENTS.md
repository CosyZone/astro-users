# 组件使用说明

为了提高可重用性和灵活性，我们将用户管理功能拆分成多个独立的组件。用户可以将这些组件集成到他们自己的界面中，而不需要使用我们提供的完整页面。

## 可用组件

### 1. UserList (用户列表组件)
显示用户列表和分页控件。

**Props:**
- `users`: UserQueryResult - 用户数据
- `usernameFilter`: string (可选) - 用户名筛选条件
- `roleFilter`: string (可选) - 角色筛选条件
- `limit`: number - 每页显示的用户数量

**使用示例:**
```astro
---
import { UserList } from '@coffic/astro-users';
import { UsersQuery } from '@coffic/astro-users/lib/users';

const usersQuery = new UsersQuery(Astro.locals);
const users = await usersQuery.getUsers({
  page: 1,
  limit: 10
});
---

<UserList 
  users={users} 
  limit={10} 
/>
```

### 2. UserFilter (用户筛选组件)
提供用户筛选表单。

**Props:**
- `usernameFilter`: string (可选) - 用户名筛选条件
- `roleFilter`: string (可选) - 角色筛选条件
- `limit`: number - 每页显示的用户数量

**使用示例:**
```astro
---
import { UserFilter } from '@coffic/astro-users';
---

<UserFilter 
  usernameFilter="" 
  roleFilter="" 
  limit={10} 
/>
```

### 3. CreateUserForm (创建用户表单组件)
创建新用户的表单。

**Props:**
- `createSuccess`: boolean (可选) - 创建是否成功
- `createError`: string | null (可选) - 创建错误信息

**使用示例:**
```astro
---
import { CreateUserForm } from '@coffic/astro-users';
---

<CreateUserForm />
```

### 4. EditUserForm (编辑用户表单组件)
编辑现有用户信息的表单。

**Props:**
- `user`: UserRecord - 要编辑的用户数据
- `updateSuccess`: boolean (可选) - 更新是否成功
- `updateError`: string | null (可选) - 更新错误信息

**使用示例:**
```astro
---
import { EditUserForm } from '@coffic/astro-users';
import { UsersQuery } from '@coffic/astro-users/lib/users';

const usersQuery = new UsersQuery(Astro.locals);
const user = await usersQuery.getUserById(1);
---

<EditUserForm user={user} />
```

### 5. UserDetail (用户详情组件)
显示用户详细信息。

**Props:**
- `user`: UserRecord - 用户数据

**使用示例:**
```astro
---
import { UserDetail } from '@coffic/astro-users';
import { UsersQuery } from '@coffic/astro-users/lib/users';

const usersQuery = new UsersQuery(Astro.locals);
const user = await usersQuery.getUserById(1);
---

<UserDetail user={user} />
```

### 6. SignupForm (注册表单组件)
用户注册表单。

**Props:**
- `signupSuccess`: boolean (可选) - 注册是否成功
- `signupError`: string | null (可选) - 注册错误信息

**使用示例:**
```astro
---
import { SignupForm } from '@coffic/astro-users';
---

<SignupForm />
```

### 7. LoginForm (登录表单组件)
用户登录表单。

**Props:**
- `loginError`: string | null (可选) - 登录错误信息

**使用示例:**
```astro
---
import { LoginForm } from '@coffic/astro-users';
---

<LoginForm />
```

## 集成示例

以下是一个如何在自定义页面中使用这些组件的示例：

```astro
---
import { UserList, UserFilter } from '@coffic/astro-users';
import { UsersQuery } from '@coffic/astro-users/lib/users';

const usersQuery = new UsersQuery(Astro.locals);
const users = await usersQuery.getUsers({
  page: 1,
  limit: 10
});
---

<div>
  <h1>我的用户管理页面</h1>
  
  <UserFilter 
    usernameFilter="" 
    roleFilter="" 
    limit={10} 
  />
  
  <UserList 
    users={users} 
    limit={10} 
  />
</div>
```

## 注意事项

1. 所有组件都依赖于 `@coffic/cosy-ui` 库，请确保已安装该库。
2. 使用数据查询组件时，需要传入 `Astro.locals` 以正确访问数据库。
3. 组件样式使用了 CSS Grid 和 Flexbox，请确保浏览器兼容性。
4. 表单提交处理需要在使用组件的页面中实现相应的逻辑。