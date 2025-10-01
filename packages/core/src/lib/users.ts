import type { UserQueryOptions, UserQueryResult, UserRecord, UserStats } from '../types/user';
import schemaSql from '../integration/schema.sql?raw';

/**
 * 用户数据查询工具类
 * 接收 Astro.locals，内部自动获取正确的数据库绑定
 */
export class UsersQuery {
    private db: any;

    constructor(locals: any) {
        // 从环境变量获取绑定名称（由集成设置）
        const bindingName = process.env.ASTRO_USERS_BINDING || 'USERS_DB';
        this.db = locals?.runtime?.env?.[bindingName];

        if (!this.db) {
            throw new Error(`Database binding '${bindingName}' not available. Make sure you have configured the astro-users integration with the correct binding name.`);
        }

        // 初始化时检查并创建表
        this.ensureTableExists();
    }

    /**
     * 确保用户表存在，如果不存在则创建
     */
    private async ensureTableExists(): Promise<void> {
        try {
            // 检查表是否存在
            const tableCheck = await this.db.prepare(`
                SELECT name FROM sqlite_master WHERE type='table' AND name='users'
            `).first();

            // 如果表不存在，则执行迁移脚本
            if (!tableCheck) {
                await this.runMigration();
            }
        } catch (error) {
            console.error('Error checking table existence:', error);
            // 即使检查失败，也尝试运行迁移以防万一
            await this.runMigration();
        }
    }

    /**
     * 执行数据库迁移
     */
    private async runMigration(): Promise<void> {
        try {
            // 去除注释与空行，按分号切分后逐条执行，规避首行注释导致的 D1_EXEC_ERROR
            const sanitized = schemaSql
                .split('\n')
                .map((line) => line.trim())
                .filter((line) => line.length > 0 && !line.startsWith('--'))
                .join('\n');
            const statements = sanitized
                .split(';')
                .map((s) => s.trim())
                .filter((s) => s.length > 0);
            for (const stmt of statements) {
                await this.db.prepare(stmt).run();
            }
            console.log('Database migration completed successfully');
        } catch (migrationError) {
            console.error('Database migration error:', migrationError);
            throw new Error(`Failed to migrate database: ${migrationError instanceof Error ? migrationError.message : 'Unknown error'}`);
        }
    }

    /**
     * 查询用户记录
     */
    async getUsers(options: UserQueryOptions = {}): Promise<UserQueryResult> {
        const {
            page = 1,
            limit = 20,
            sortBy = 'created_at',
            sortOrder = 'desc',
            filters = {}
        } = options;

        // 构建 WHERE 条件
        const whereConditions: string[] = [];
        const bindValues: any[] = [];

        if (filters.username) {
            whereConditions.push('username LIKE ?');
            bindValues.push(`%${filters.username}%`);
        }

        if (filters.email) {
            whereConditions.push('email = ?');
            bindValues.push(filters.email);
        }

        if (filters.role) {
            whereConditions.push('role = ?');
            bindValues.push(filters.role);
        }

        if (filters.isActive !== undefined) {
            whereConditions.push('is_active = ?');
            bindValues.push(filters.isActive ? 1 : 0);
        }

        const whereClause = whereConditions.length > 0
            ? `WHERE ${whereConditions.join(' AND ')}`
            : '';

        // 获取总数
        const countQuery = `SELECT COUNT(*) as total FROM users ${whereClause}`;
        const countResult = await this.db.prepare(countQuery).bind(...bindValues).first();
        const total = countResult?.total || 0;

        // 计算分页
        const offset = (page - 1) * limit;
        const totalPages = Math.ceil(total / limit);

        // 查询数据
        const dataQuery = `
      SELECT * FROM users 
      ${whereClause}
      ORDER BY ${sortBy} ${sortOrder.toUpperCase()}
      LIMIT ? OFFSET ?
    `;

        const dataResult = await this.db.prepare(dataQuery)
            .bind(...bindValues, limit, offset)
            .all();

        return {
            data: dataResult.results || [],
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        };
    }

    /**
     * 获取用户统计
     */
    async getStats(): Promise<UserStats> {
        // 总用户数
        const totalUsersResult = await this.db.prepare('SELECT COUNT(*) as total FROM users').first();
        const totalUsers = totalUsersResult?.total || 0;

        // 活跃用户数
        const activeUsersResult = await this.db.prepare('SELECT COUNT(*) as active_count FROM users WHERE is_active = 1').first();
        const activeUsers = activeUsersResult?.active_count || 0;

        // 今日新增用户数
        const today = new Date().toISOString().split('T')[0];
        const todayUsersResult = await this.db.prepare(
            'SELECT COUNT(*) as today FROM users WHERE DATE(created_at) = ?'
        ).bind(today).first();
        const todayUsers = todayUsersResult?.today || 0;

        // 用户角色统计
        const rolesResult = await this.db.prepare(`
      SELECT role, COUNT(*) as count 
      FROM users 
      GROUP BY role 
      ORDER BY count DESC 
      LIMIT 10
    `).all();
        const roles = rolesResult.results || [];

        return {
            totalUsers,
            activeUsers,
            todayUsers,
            roles
        };
    }

    /**
     * 删除用户记录
     */
    async deleteUser(id: number): Promise<boolean> {
        try {
            const result = await this.db.prepare('DELETE FROM users WHERE id = ?').bind(id).run();
            return result.changes > 0;
        } catch (error) {
            console.error('Delete user error:', error);
            return false;
        }
    }

    /**
     * 批量删除用户记录
     */
    async deleteUsers(ids: number[]): Promise<number> {
        if (ids.length === 0) return 0;

        try {
            const placeholders = ids.map(() => '?').join(',');
            const result = await this.db.prepare(`DELETE FROM users WHERE id IN (${placeholders})`)
                .bind(...ids).run();
            return result.changes;
        } catch (error) {
            console.error('Batch delete users error:', error);
            return 0;
        }
    }

    /**
     * 获取指定角色的用户
     */
    async getUsersByRole(role: string, options: Omit<UserQueryOptions, 'filters'> = {}): Promise<UserQueryResult> {
        return this.getUsers({
            ...options,
            filters: {
                role
            }
        });
    }

    /**
     * 获取活跃/非活跃用户
     */
    async getUsersByStatus(isActive: boolean, options: Omit<UserQueryOptions, 'filters'> = {}): Promise<UserQueryResult> {
        return this.getUsers({
            ...options,
            filters: {
                isActive
            }
        });
    }

    /**
     * 根据用户名搜索用户
     */
    async getUsersByUsername(username: string, options: Omit<UserQueryOptions, 'filters'> = {}): Promise<UserQueryResult> {
        return this.getUsers({
            ...options,
            filters: {
                username
            }
        });
    }

    /**
     * 根据邮箱搜索用户
     */
    async getUsersByEmail(email: string, options: Omit<UserQueryOptions, 'filters'> = {}): Promise<UserQueryResult> {
        return this.getUsers({
            ...options,
            filters: {
                email
            }
        });
    }

    /**
     * 获取最近 N 天的用户注册统计
     */
    async getRecentStats(days: number = 7): Promise<Array<{ date: string; count: number }>> {
        const result = await this.db.prepare(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM users 
      WHERE created_at >= datetime('now', '-${days} days')
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `).all();

        return result.results || [];
    }

    /**
     * 根据ID获取用户
     */
    async getUserById(id: number): Promise<UserRecord | null> {
        const result = await this.db.prepare('SELECT * FROM users WHERE id = ?').bind(id).first();
        return result || null;
    }

    /**
     * 根据用户名获取用户
     */
    async getUserByUsername(username: string): Promise<UserRecord | null> {
        const result = await this.db.prepare('SELECT * FROM users WHERE username = ?').bind(username).first();
        return result || null;
    }

    /**
     * 根据邮箱获取用户
     */
    async getUserByEmail(email: string): Promise<UserRecord | null> {
        const result = await this.db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
        return result || null;
    }

    /**
     * 创建新用户
     */
    async createUser(userData: Omit<UserRecord, 'id' | 'created_at' | 'updated_at'>): Promise<UserRecord | null> {
        try {
            const result = await this.db.prepare(`
        INSERT INTO users (username, email, password, first_name, last_name, avatar_url, role, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING *
      `).bind(
                userData.username,
                userData.email,
                userData.password,
                userData.first_name || null,
                userData.last_name || null,
                userData.avatar_url || null,
                userData.role || 'user',
                userData.is_active !== undefined ? (userData.is_active ? 1 : 0) : 1
            ).run();

            return result.success ? result.results[0] : null;
        } catch (error) {
            console.error('Create user error:', error);
            return null;
        }
    }

    /**
     * 更新用户信息
     */
    async updateUser(id: number, userData: Partial<Omit<UserRecord, 'id' | 'created_at' | 'updated_at'>>): Promise<UserRecord | null> {
        try {
            // 构建 SET 子句
            const setFields: string[] = [];
            const bindValues: any[] = [];

            Object.entries(userData).forEach(([key, value]) => {
                if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
                    setFields.push(`${key} = ?`);
                    // 特殊处理布尔值字段
                    if (key === 'is_active' && typeof value === 'boolean') {
                        bindValues.push(value ? 1 : 0);
                    } else {
                        bindValues.push(value);
                    }
                }
            });

            if (setFields.length === 0) {
                return null;
            }

            // 添加更新时间
            setFields.push('updated_at = CURRENT_TIMESTAMP');

            const query = `
        UPDATE users 
        SET ${setFields.join(', ')}
        WHERE id = ?
        RETURNING *
      `;

            const result = await this.db.prepare(query)
                .bind(...bindValues, id)
                .run();

            return result.success ? result.results[0] : null;
        } catch (error) {
            console.error('Update user error:', error);
            return null;
        }
    }
}