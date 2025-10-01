# @coffic/astro-users

An Astro integration for user management with Cloudflare D1 database.

## Installation

### Using `astro add` command (Recommended)

Astro provides an easy-to-use command to add integrations to your project:

```bash
# Using npm
npx astro add @coffic/astro-users

# Using pnpm
pnpm astro add @coffic/astro-users

# Using yarn
yarn astro add @coffic/astro-users
```

This command will:
1. Install the package and its peer dependencies
2. Automatically add the integration to your `astro.config.mjs` file
3. Add any required configuration
4. Inject user management pages into your project

### Manual Installation

If you prefer to install manually:

1. Install the package:
```bash
# Using npm
npm install @coffic/astro-users

# Using pnpm
pnpm add @coffic/astro-users

# Using yarn
yarn add @coffic/astro-users
```

2. Add the integration to your `astro.config.mjs` file:
```js
import { defineConfig } from 'astro/config';
import astroUsers from '@coffic/astro-users';

export default defineConfig({
  integrations: [
    astroUsers({
      devMode: true, // Set to true for development
    })
  ]
});
```

## Configuration

The integration accepts the following options:

### `devMode`
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Whether to manage users in development mode

```js
astroUsers({
  devMode: true
})
```

## Injected Routes

When the integration is added to your project, the following routes are automatically injected:

- `/users` - User list page
- `/users/create` - Create user page
- `/users/[id]` - User detail page
- `/users/[id]/edit` - Edit user page

These pages provide a complete user management interface out of the box.

## Usage

After installation, you can use the `UsersQuery` class to manage users:

```astro
---
import { UsersQuery } from '@coffic/astro-users';

const usersQuery = new UsersQuery(Astro.locals);

// Get users with pagination
const users = await usersQuery.getUsers({
  page: 1,
  limit: 10,
  sortBy: 'created_at',
  sortOrder: 'desc'
});

// Create a new user
const newUser = await usersQuery.createUser({
  username: 'john_doe',
  email: 'john@example.com',
  password: 'secure_password'
});
---
```

## API Endpoints

The integration also provides RESTful API endpoints:

- `GET /api/users` - Get user list
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/stats` - Get user statistics

## Features

- ✅ User management with Cloudflare D1 database
- ✅ Automatic database schema setup
- ✅ User creation, retrieval, and deletion
- ✅ Pagination and filtering
- ✅ User statistics
- ✅ TypeScript support
- ✅ Automatic route injection
- ✅ Built-in user management UI

## Requirements

- Astro v5.0.0 or higher
- Cloudflare D1 database (when deployed)

## License

MIT