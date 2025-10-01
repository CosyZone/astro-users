import type { APIRoute } from 'astro';
import { UsersQuery } from '../../lib/users';

// 获取用户列表
export const GET: APIRoute = async ({ locals, url }) => {
    try {
        const usersQuery = new UsersQuery(locals);

        // 从查询参数获取分页和筛选条件
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '20');
        const username = url.searchParams.get('username') || undefined;
        const email = url.searchParams.get('email') || undefined;
        const role = url.searchParams.get('role') || undefined;
        const isActive = url.searchParams.get('is_active') !== null ? url.searchParams.get('is_active') === 'true' : undefined;

        const sortBy = (url.searchParams.get('sortBy') || 'created_at') as any;
        const sortOrder = (url.searchParams.get('sortOrder') || 'desc') as any;

        const users = await usersQuery.getUsers({
            page,
            limit,
            sortBy,
            sortOrder,
            filters: {
                username,
                email,
                role,
                isActive
            }
        });

        return new Response(JSON.stringify(users), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};

// 创建新用户
export const POST: APIRoute = async ({ locals, request }) => {
    try {
        const usersQuery = new UsersQuery(locals);
        const userData = await request.json();

        // 验证必需字段
        if (!userData.username || !userData.email || !userData.password) {
            return new Response(JSON.stringify({ error: 'Username, email, and password are required' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const newUser = await usersQuery.createUser(userData);

        if (newUser) {
            return new Response(JSON.stringify(newUser), {
                status: 201,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } else {
            return new Response(JSON.stringify({ error: 'Failed to create user' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    } catch (error) {
        console.error('Error creating user:', error);
        return new Response(JSON.stringify({ error: 'Failed to create user: ' + (error as Error).message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};