import { existsSync, mkdirSync } from "fs";
import { dirname, resolve } from "path";
import EnvHelper from "@/utils/env-helper";

class DBConfig {
	static schemaPath = "./src/db/schema/schema.ts";
	static migrationsPath = "./src/db/migrations";

	static getDBCredentials() {
		// 开发环境，返回本地数据库的配置
		if (EnvHelper.isDev()) {
			console.log("开发环境，返回本地数据库的配置");

			const dbPath = "./temp/db.sqlite";
			const fullPath = resolve(dbPath);
			const dirPath = dirname(fullPath);

			// 确保目录存在
			if (!existsSync(dirPath)) {
				console.log(`创建数据库目录: ${dirPath}`);
				mkdirSync(dirPath, { recursive: true });
			}

			// 检查数据库文件是否存在，如果不存在则创建
			if (!existsSync(fullPath)) {
				console.log(`数据库文件不存在，将在首次连接时自动创建: ${fullPath}`);
			}

			return {
				url: dbPath,
			};
		}

		console.log("生产环境，返回云端数据库的配置");

		const accountId = EnvHelper.getEnv("CLOUDFLARE_ACCOUNT_ID");
		const databaseId = EnvHelper.getEnv("CLOUDFLARE_DATABASE_ID");
		const token = EnvHelper.getEnv("CLOUDFLARE_API_TOKEN");

		if (!accountId) {
			throw new Error("请在.env文件中配置CLOUDFLARE_ACCOUNT_ID");
		}

		if (!databaseId) {
			throw new Error("请在.env文件中配置CLOUDFLARE_DATABASE_ID");
		}

		if (!token) {
			throw new Error("请在.env文件中配置CLOUDFLARE_API_TOKEN");
		}

		return {
			accountId: accountId,
			databaseId: databaseId,
			token: token,
		};
	}

	static getDBDriver(): "d1-http" | undefined {
		if (EnvHelper.isDev()) {
			return undefined;
		}

		return "d1-http";
	}
}

export default DBConfig;
