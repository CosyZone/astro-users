import { defineConfig } from "drizzle-kit";
import DBConfig from "./config.db";

const driver = DBConfig.getDBDriver();
const dbCredentials = DBConfig.getDBCredentials();

const config: any = {
	dialect: "sqlite",
	schema: DBConfig.schemaPath,
	out: DBConfig.migrationsPath,
	dbCredentials,
};

// 只有当 driver 不是 undefined 时才添加 driver 字段
if (driver) {
	config.driver = driver;
}

export default defineConfig(config);
