import type { APIRoute } from 'astro';
import { UsersQuery } from '../../../lib/users';

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
        const updatedUser = await usersQuery.updateUser(id, userData);

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