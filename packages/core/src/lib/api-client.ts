/**
 * 用户管理API客户端
 * 提供与用户管理API交互的便捷方法
 */

export interface ApiClientOptions {
    baseUrl?: string;
}

export class UsersApiClient {
    private baseUrl: string;

    constructor(options: ApiClientOptions = {}) {
        this.baseUrl = options.baseUrl || '/api';
    }

    /**
     * 获取用户列表
     */
    async getUsers(params: {
        page?: number;
        limit?: number;
        username?: string;
        email?: string;
        role?: string;
        isActive?: boolean;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    } = {}) {
        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, String(value));
            }
        });

        const response = await fetch(`${this.baseUrl}/users?${queryParams.toString()}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch users: ${response.statusText}`);
        }

        return response.json();
    }

    /**
     * 创建新用户
     */
    async createUser(userData: any) {
        const response = await fetch(`${this.baseUrl}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error(`Failed to create user: ${response.statusText}`);
        }

        return response.json();
    }

    /**
     * 获取单个用户
     */
    async getUser(id: number) {
        const response = await fetch(`${this.baseUrl}/users/${id}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch user: ${response.statusText}`);
        }

        return response.json();
    }

    /**
     * 更新用户信息
     */
    async updateUser(id: number, userData: any) {
        const response = await fetch(`${this.baseUrl}/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error(`Failed to update user: ${response.statusText}`);
        }

        return response.json();
    }

    /**
     * 删除用户
     */
    async deleteUser(id: number) {
        const response = await fetch(`${this.baseUrl}/users/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Failed to delete user: ${response.statusText}`);
        }

        return response.json();
    }

    /**
     * 获取用户统计数据
     */
    async getUserStats() {
        const response = await fetch(`${this.baseUrl}/users/stats`);
        if (!response.ok) {
            throw new Error(`Failed to fetch user stats: ${response.statusText}`);
        }

        return response.json();
    }
}

// 默认导出一个实例
export default new UsersApiClient();