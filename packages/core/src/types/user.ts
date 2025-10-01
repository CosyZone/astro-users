export interface UserRecord {
    id: number;
    username: string;
    email: string;
    password: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    role: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface UserQueryOptions {
    /** 页码，从 1 开始 */
    page?: number;
    /** 每页数量，默认 20 */
    limit?: number;
    /** 排序字段 */
    sortBy?: 'id' | 'username' | 'email' | 'created_at' | 'updated_at';
    /** 排序方向 */
    sortOrder?: 'asc' | 'desc';
    /** 筛选条件 */
    filters?: {
        /** 用户名包含关键词 */
        username?: string;
        /** 邮箱 */
        email?: string;
        /** 角色 */
        role?: string;
        /** 是否激活 */
        isActive?: boolean;
    };
}

export interface UserQueryResult {
    /** 用户记录列表 */
    data: UserRecord[];
    /** 分页信息 */
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface UserStats {
    /** 总用户数 */
    totalUsers: number;
    /** 活跃用户数 */
    activeUsers: number;
    /** 今日新增用户数 */
    todayUsers: number;
    /** 用户角色统计 */
    roles: Array<{ role: string; count: number }>;
}