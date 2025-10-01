# 示例应用用户管理功能使用指南

## 简介

本指南介绍了如何在示例应用中使用用户管理功能。通过 [@coffic/astro-users](file:///Users/angel/Code/Coffic/astro-users/packages/core/src/integration/index.ts#L8-L8) 集成，我们已经自动注入了完整的用户管理界面和API端点。

## 导航菜单

示例应用的导航菜单已更新，包含以下用户管理相关链接：

1. **首页** - `/` - 应用主页
2. **管理** - `/admin` - 原始管理界面
3. **用户** - `/users` - 用户列表页面
4. **创建用户** - `/users/create` - 创建新用户页面
5. **测试用户** - `/test-users` - 用户管理功能测试页面

## 用户管理页面

### 用户列表页面 (/users)

访问 `/users` 可以查看所有用户列表，支持以下功能：
- 分页浏览用户
- 按用户名和角色筛选用户
- 查看用户详细信息
- 编辑或删除用户
- 查看用户统计信息

### 创建用户页面 (/users/create)

访问 `/users/create` 可以创建新用户，表单包含以下字段：
- 用户名（必填）
- 邮箱（必填）
- 密码（必填）
- 名字（可选）
- 姓氏（可选）
- 头像URL（可选）
- 角色选择（普通用户、管理员、版主）
- 账户激活状态

### 用户详情页面 (/users/[id])

访问 `/users/[id]` 可以查看特定用户的详细信息：
- 用户基本信息展示
- 账户状态显示
- 注册和更新时间
- 删除用户功能
- 编辑用户链接

### 编辑用户页面 (/users/[id]/edit)

访问 `/users/[id]/edit` 可以编辑用户信息：
- 预填充的用户信息表单
- 更新用户数据
- 修改用户角色和状态

## API 端点

用户管理功能还提供以下 RESTful API 端点：

- `GET /api/users` - 获取用户列表
- `POST /api/users` - 创建新用户
- `GET /api/users/:id` - 获取单个用户
- `PUT /api/users/:id` - 更新用户信息
- `DELETE /api/users/:id` - 删除用户
- `GET /api/users/stats` - 获取用户统计数据

## 测试页面

### 用户管理测试页面 (/test-users)

访问 `/test-users` 可以测试用户管理功能：
- 创建测试用户
- 查询用户列表
- 获取统计信息
- 验证功能是否正常工作

## 多语言支持

导航菜单支持中英文切换：
- 中文环境下显示中文菜单项
- 英文环境下显示英文菜单项

## 开发模式

示例应用已启用开发模式 (`devMode: true`)，这意味着：
- 用户数据存储在本地开发数据库中
- 可以在不部署到 Cloudflare 的情况下测试功能
- 数据库表会自动创建和迁移

## 使用示例

### 创建用户（通过页面）

1. 访问 `/users/create`
2. 填写用户信息表单
3. 点击"创建用户"按钮
4. 成功后会重定向到用户列表页面

### 查询用户（通过API）

```bash
# 获取用户列表
curl http://localhost:4322/api/users

# 获取特定用户
curl http://localhost:4322/api/users/1

# 获取用户统计
curl http://localhost:4322/api/users/stats
```

### 创建用户（通过API）

```bash
curl -X POST http://localhost:4322/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "apiuser",
    "email": "api@example.com",
    "password": "apipassword",
    "first_name": "API",
    "last_name": "User",
    "role": "user",
    "is_active": true
  }'
```

## 注意事项

1. 在开发环境中，用户数据存储在本地数据库中
2. 部署到 Cloudflare 时，数据将存储在 D1 数据库中
3. 密码应进行加密存储（集成已处理）
4. 所有页面都支持响应式设计
5. 错误处理和用户反馈已内置

## 故障排除

如果遇到问题，请检查：

1. 确保 Astro 开发服务器正在运行
2. 检查浏览器控制台是否有错误信息
3. 确认所有依赖包已正确安装
4. 查看终端输出的日志信息