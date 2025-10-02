import type { APIRoute } from 'astro';
import { UsersQuery } from '../../../lib/users';

export const prerender = false

// 用户注册 API 端点
export const POST: APIRoute = async ({ locals, request }) => {
    try {
        const usersQuery = new UsersQuery(locals);
        const userData = await request.json();

        // 验证必需字段
        if (!userData.username || !userData.email || !userData.password) {
            return new Response(JSON.stringify({ error: '用户名、邮箱和密码是必填项' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // 检查用户名是否已存在
        const existingUserByUsername = await usersQuery.getUserByUsername(userData.username);
        if (existingUserByUsername) {
            return new Response(JSON.stringify({ error: '用户名已存在' }), {
                status: 409,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // 检查邮箱是否已存在
        const existingUserByEmail = await usersQuery.getUserByEmail(userData.email);
        if (existingUserByEmail) {
            return new Response(JSON.stringify({ error: '邮箱已被注册' }), {
                status: 409,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // 创建新用户（注册用户默认为普通用户角色）
        const newUser = await usersQuery.createUser({
            username: userData.username,
            email: userData.email,
            password: userData.password, // UsersQuery.createUser 会自动进行哈希处理
            first_name: userData.first_name || null,
            last_name: userData.last_name || null,
            avatar_url: userData.avatar_url || null,
            role: 'user', // 注册用户默认为普通用户
            is_active: true // 新注册用户默认激活
        });

        if (newUser) {
            return new Response(JSON.stringify(newUser), {
                status: 201,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } else {
            return new Response(JSON.stringify({ error: '注册失败' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    } catch (error) {
        console.error('用户注册错误:', error);
        return new Response(JSON.stringify({ error: '注册过程中发生错误: ' + (error as Error).message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};