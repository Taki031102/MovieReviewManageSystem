// 导入Vue和VueRouter
import Vue from 'vue';
import VueRouter from 'vue-router';


Vue.use(VueRouter);
// 导入各个组件
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import AdminLogin from '@/views/AdminLogin.vue';
import SortMovie from '@/views/SortMovie.vue';
import SearchResult from '@/views/SearchResult.vue';
import SearchInput from '@/views/SearchInput.vue';
import Register from '@/views/Register.vue';
import Pagination from '@/views/Pagination.vue';
import AdminPage from '@/views/AdminPage.vue';
import AdminLog from '@/views/AdminLog.vue';
import AdminMovie from '@/views/AdminMovie.vue';

// 配置路由
const routes = [
    { path: '/', component: Home },
    { path: '/Home', component: Home },
    { path: '/Login', component: Login },
    { path: '/AdminLogin', component: AdminLogin },
    { path: '/SortMovie', component: SortMovie },
    { path: '/SearchResult', component: SearchResult,props: true },
    {
        path: '/SearchResultComment/:movieId',
        name: 'SearchResultComment',
        component: () => import('@/views/SearchResultComment.vue'), // 替换为实际的组件路径
        props: true
    },
    { path: '/Register', component: Register },
    { path: '/Pagination', component: Pagination },
    { path: '/AdminPage', component: AdminPage },
    { path: '/AdminLog', component: AdminLog },
    { path: '/AdminMovie', component: AdminMovie },
    { path: '/SearchInput', component: SearchInput },
];

// 创建VueRouter实例
const router = new VueRouter({
    routes,  // 路由配置
});

// 导出路由实例
export default router;