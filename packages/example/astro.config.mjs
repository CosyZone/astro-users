import { defineConfig } from 'astro/config';
import path from 'path';
import astroUsers from '@coffic/astro-users';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  vite: {
    build: {
      minify: false,
    },
    server: {
      hmr: {
        overlay: false,
      },
    },

    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },

    plugins: [],
  },

  integrations: [
    astroUsers({
      devMode: true,
    }),
  ],

  adapter: cloudflare({
    platformProxy: true,
  }),
});