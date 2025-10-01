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
      },
    },
  };
}