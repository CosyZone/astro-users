import type { APIRoute } from 'astro';
import { UsersQuery } from '../../../lib/users';

// 用户登录 API 端点
export const POST: APIRoute = async ({ locals, request }) => {
    try {
        const usersQuery = new UsersQuery(locals);
        const { username, password } = await request.json();

        // 验证必需字段
        if (!username || !password) {
            return new Response(JSON.stringify({ error: '用户名和密码是必填项' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // 验证用户凭据
        const user = await usersQuery.validateUserCredentials(username, password);

        if (user) {
            return new Response(JSON.stringify({
                message: '登录成功',
                user: user
            }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } else {
            return new Response(JSON.stringify({ error: '用户名或密码错误' }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    } catch (error) {
        console.error('用户登录错误:', error);
        return new Response(JSON.stringify({ error: '登录过程中发生错误: ' + (error as Error).message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};