import { defineConfig } from "astro/config";
import path from "path";
import mdx from "@astrojs/mdx";
import vue from "@astrojs/vue";
import pagefind from "astro-pagefind";
import playformCompress from "@playform/compress";
import cloudflare from "@astrojs/cloudflare";
import users from "@coffic/astro-users"

// https://astro.build/config
export default defineConfig({
    site: "https://ui.coffic.cn",
    srcDir: "src",
    outDir: "dist",

    prefetch: {
        enabled: false,
    },

    i18n: {
        locales: ["zh-cn", "en"],
        defaultLocale: "zh-cn",
        routing: {
            prefixDefaultLocale: true,
            redirectToDefaultLocale: true
        },
    },

    vite: {
        resolve: {
            alias: {
                "@": path.resolve("./src"),
            },
        },
    },

    integrations: [
        mdx(),
        vue(),
        users(),
        pagefind(),
        playformCompress({
            HTML: {
                "html-minifier-terser": {
                    removeAttributeQuotes: true,
                    removeComments: true,
                },
            },
        }),
    ],

    adapter: cloudflare({
        // 启用平台代理，在本地模拟 Cloudflare 的环境，数据存在 .wrangler/ 目录下
        platformProxy: {
            enabled: true,
        },
        // 'compile' 会在构建时处理图片，导致构建时间过长
        // 'passthrough' 则会跳过构建时的图片处理，将任务交给 Cloudflare 的运行时服务
        imageService: 'compile',
    }),
});
