// @/services/auth.js

// 模拟一个简单的身份验证服务
import axios from 'axios';
export const authService = {
    // 模拟登录验证，实际中可以根据后端接口进行调整
    async login(userId, password) {
        // 这里可以向后端发送登录请求，验证用户身份
        // 假设后端返回一个包含 token 和 userId 的对象
        const response = await axios.post('http://localhost:7000/login', { userId, password });

        if (response.data.code === 1) {
            const { token, userId } = response.data.data;
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);
            return userId;
        } else {
            throw new Error('登录失败');
        }
    },

    // 模拟获取当前登录用户ID的方法
    getCurrentUserId() {
        // 这里可以根据你的实际需求获取当前登录用户ID
        // 假设在 localStorage 中存储了用户ID
        return localStorage.getItem('userId');
    },

    // 模拟登出方法，清除本地存储的 token 和 userId
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
    },
};
