import Vue from 'vue';
import App from './App.vue';
import router from './router/router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from './store';  // 引入 Vuex store
import axios from 'axios';
Vue.config.productionTip = false;
Vue.use(ElementUI);

import VTooltip from 'v-tooltip';
Vue.use(VTooltip);

new Vue({
    router,
    store,  // 注入 Vuex store
    render: h => h(App),
}).$mount('#app');

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    config.headers.token = localStorage.getItem('token');
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});