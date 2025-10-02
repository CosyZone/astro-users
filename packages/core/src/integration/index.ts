import type { AstroIntegration } from 'astro';

export interface AstroUsersOptions {
  /**
   * Whether to manage users in development mode
   * @default false
   */
  devMode?: boolean;
}

export default function astroUsersIntegration(options: AstroUsersOptions = {}): AstroIntegration {
  const { devMode = false } = options;

  return {
    name: '@coffic/astro-users',
    hooks: {
      'astro:config:setup': ({ injectScript, injectRoute, logger }) => {
        logger.info(`✅ User management integration setup complete`);

        // 注入用户管理页面路由
        injectRoute({
          pattern: '/users',
          entrypoint: '@coffic/astro-users/pages/users.astro'
        });

        injectRoute({
          pattern: '/users/create',
          entrypoint: '@coffic/astro-users/pages/users/create.astro'
        });

        injectRoute({
          pattern: '/users/[id]',
          entrypoint: '@coffic/astro-users/pages/users/[id]/index.astro'
        });

        injectRoute({
          pattern: '/users/[id]/edit',
          entrypoint: '@coffic/astro-users/pages/users/[id]/edit.astro'
        });

        // 注入用户认证路由
        injectRoute({
          pattern: '/signup',
          entrypoint: '@coffic/astro-users/pages/signup.astro'
        });

        injectRoute({
          pattern: '/login',
          entrypoint: '@coffic/astro-users/pages/login.astro'
        });
      },
    },
  };
}