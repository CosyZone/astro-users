import type { APIRoute } from 'astro';
import { UsersQuery } from '../../../lib/users';

// 获取用户统计数据
export const GET: APIRoute = async ({ locals }) => {
    try {
        const usersQuery = new UsersQuery(locals);
        const stats = await usersQuery.getStats();

        return new Response(JSON.stringify(stats), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch user stats' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};