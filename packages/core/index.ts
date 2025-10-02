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
export { default as UserList } from './src/components/UserList.astro';
export { default as UserFilter } from './src/components/UserFilter.astro';
export { default as CreateUserForm } from './src/components/CreateUserForm.astro';
export { default as EditUserForm } from './src/components/EditUserForm.astro';
export { default as UserDetail } from './src/components/UserDetail.astro';
export { default as SignupForm } from './src/components/SignupForm.astro';
export { default as LoginForm } from './src/components/LoginForm.astro';