import type { APIRoute } from 'astro';
import { UsersQuery } from '../../../lib/users';
import type { UserRecord } from 'src/types/user';

// 根据ID获取单个用户
export const GET: APIRoute = async ({ locals, params }) => {
    try {
        const usersQuery = new UsersQuery(locals);
        const id = parseInt(params.id || '0');

        if (isNaN(id)) {
            return new Response(JSON.stringify({ error: 'Invalid user ID' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const user = await usersQuery.getUserById(id);

        if (user) {
            return new Response(JSON.stringify(user), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } else {
            return new Response(JSON.stringify({ error: 'User not found' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch user' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};

// 更新用户信息
export const PUT: APIRoute = async ({ locals, params, request }) => {
    try {
        const usersQuery = new UsersQuery(locals);
        const id = parseInt(params.id || '0');

        if (isNaN(id)) {
            return new Response(JSON.stringify({ error: 'Invalid user ID' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const userData = await request.json();

        // 准备更新数据
        const updateData: Partial<Omit<UserRecord, 'id' | 'created_at' | 'updated_at'>> = {};

        // 只添加提供的字段
        if (userData.username !== undefined) updateData.username = userData.username;
        if (userData.email !== undefined) updateData.email = userData.email;
        if (userData.first_name !== undefined) updateData.first_name = userData.first_name;
        if (userData.last_name !== undefined) updateData.last_name = userData.last_name;
        if (userData.avatar_url !== undefined) updateData.avatar_url = userData.avatar_url;
        if (userData.role !== undefined) updateData.role = userData.role;
        if (userData.is_active !== undefined) updateData.is_active = userData.is_active;
        if (userData.password !== undefined) updateData.password = userData.password; // UsersQuery.updateUser 会自动进行哈希处理

        const updatedUser = await usersQuery.updateUser(id, updateData);

        if (updatedUser) {
            return new Response(JSON.stringify(updatedUser), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } else {
            return new Response(JSON.stringify({ error: 'Failed to update user' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        return new Response(JSON.stringify({ error: 'Failed to update user: ' + (error as Error).message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};

// 删除用户
export const DELETE: APIRoute = async ({ locals, params }) => {
    try {
        const usersQuery = new UsersQuery(locals);
        const id = parseInt(params.id || '0');

        if (isNaN(id)) {
            return new Response(JSON.stringify({ error: 'Invalid user ID' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const result = await usersQuery.deleteUser(id);

        if (result) {
            return new Response(JSON.stringify({ message: 'User deleted successfully' }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } else {
            return new Response(JSON.stringify({ error: 'Failed to delete user' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete user: ' + (error as Error).message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};