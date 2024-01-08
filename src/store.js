// store.js
import Vue from 'vue';
import Vuex from 'vuex';
import tokenModule from './store/token';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        token: tokenModule,
    },
    state: {
        user: null,
        userData: [], // 用户数据
    },
    getters: {
        isUserLoggedIn: state => !!state.user,
        getTokenFromTokenModule: state => state.token.token,
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        updateUserData(state, newData) {
            state.userData = newData;
        },
    },
});
