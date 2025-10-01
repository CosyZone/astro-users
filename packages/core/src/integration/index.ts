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
          entrypoint: '@coffic/astro-users/src/pages/users.astro'
        });

        injectRoute({
          pattern: '/users/create',
          entrypoint: '@coffic/astro-users/src/pages/users/create.astro'
        });

        injectRoute({
          pattern: '/users/[id]',
          entrypoint: '@coffic/astro-users/src/pages/users/[id]/index.astro'
        });

        injectRoute({
          pattern: '/users/[id]/edit',
          entrypoint: '@coffic/astro-users/src/pages/users/[id]/edit.astro'
        });
      },
    },
  };
}