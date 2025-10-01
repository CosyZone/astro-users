# Astro Users Integration

An Astro integration for user management with Cloudflare D1 database.

## Features

- User management including:
  - User registration and authentication
  - Role-based access control
  - User profile management
  - Account activation/deactivation
- Automatically injects user management utilities
- Stores user data in Cloudflare D1 database
- Works with Cloudflare Workers
- Development mode support

## Installation

```bash
npm install @coffic/astro-users
```

## Usage

Add the integration to your Astro config:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import astroUsers from '@coffic/astro-users';

export default defineConfig({
  integrations: [astroUsers({
    binding: 'USERS_DB', // Your D1 database binding name
    devMode: false       // Whether to enable in development mode
  })],
});
```

The integration will automatically:
1. Provide user management utilities
2. Set up database schema for user storage

## Cloudflare Setup

1. Create a D1 database:
   ```bash
   wrangler d1 create users-db
   ```

2. Update your `wrangler.toml`:
   ```toml
   [[ d1_databases ]]
   binding = "USERS_DB"
   database_name = "users-db"
   database_id = "your-database-id"
   ```

3. The integration will automatically create the database schema:
   ```sql
   CREATE TABLE IF NOT EXISTS users (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       username TEXT NOT NULL UNIQUE,
       email TEXT NOT NULL UNIQUE,
       password TEXT NOT NULL,
       first_name TEXT,
       last_name TEXT,
       avatar_url TEXT,
       role TEXT DEFAULT 'user',
       is_active BOOLEAN DEFAULT TRUE,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

## How It Works

The integration provides user management utilities that allow you to create, read, update, and delete users in your Cloudflare D1 database. It includes role-based access control and account activation features.

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `binding` | `string` | `'USERS_DB'` | The Cloudflare D1 database binding name |
| `devMode` | `boolean` | `false` | Whether to enable user management in development mode |

## Development

This project uses a monorepo structure with pnpm workspaces:

```
astro-users/
├── package.json              # Root package.json for workspace management
├── pnpm-workspace.yaml       # pnpm workspace configuration
├── packages/
│   ├── core/                 # The Astro integration package (renamed from astro-visits)
│   │   ├── index.ts          # Integration entry point
│   │   ├── package.json      # Integration package configuration
│   │   ├── integration/      # Integration source code
│   │   │   ├── index.ts      # Main integration implementation
│   │   │   └── schema.sql    # Database schema
│   │   └── src/
│   │       ├── lib/          # User management utilities
│   │       │   └── users.ts  # User query and management class
│   │       ├── types/        # TypeScript types
│   │       │   └── user.ts   # User type definitions
│   │       └── pages/
│   │           └── api/
│   │               └── user.ts  # User management API endpoints
│   └── example/              # Example Astro project using the integration
│       ├── package.json      # Example project configuration
│       ├── astro.config.mjs  # Example project Astro configuration
│       └── src/
│           └── pages/
│               ├── index.astro  # Example home page
│               └── admin.astro  # User management admin page
```

### Install dependencies

```bash
pnpm install
```

### Run the example project

```bash
# From the root directory
pnpm dev

# Or from the example package directory
cd packages/example
pnpm dev
```

This will start the example Astro project on an available port (e.g. http://localhost:4328)

### Build the integration

```bash
# From the root directory
pnpm build

# Or from the integration package directory
cd packages/core
pnpm build
```

## License

MIT