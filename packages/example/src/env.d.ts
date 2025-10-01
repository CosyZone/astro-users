/// <reference types="astro/client" />
/// <reference types="astro/actions" />

declare module "*.vue" {
	import type { DefineComponent } from "vue";
	const component: DefineComponent;
	export default component;
}

type Models = import("node-appwrite").Models;

declare namespace App {
	interface Locals {
		user?: Models.User<Models.Preferences>;
		runtime?: {
			env: {
				KV: KVNamespace;
				BUCKET: R2Bucket;
				DB: D1Database;
			};
		};
	}
}

interface ImportMetaEnv {
	readonly PUBLIC_APPWRITE_ENDPOINT: string;
	readonly PUBLIC_APPWRITE_PROJECT: string;
	readonly APPWRITE_KEY: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}