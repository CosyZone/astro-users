import astroUsersIntegration, { type AstroUsersOptions } from './src/integration/index.ts';

export default astroUsersIntegration;
export type { AstroUsersOptions };

// 导出查询工具和类型
export { UsersQuery } from './src/lib/users';
export { UsersApiClient } from './src/lib/api-client';
export type {
    UserRecord,
    UserQueryOptions,
    UserQueryResult,
    UserStats
} from './src/types/user';

// 导出组件
export * from './src/components/index.ts';