// store/token.js
const state = {
    token: null,
};

const getters = {
    getToken: state => state.token,
};

const mutations = {
    setToken: (state, token) => {
        state.token = token;
    },
};

export default {
    namespaced: true,  // 添加命名空间
    state,
    getters,
    mutations,
};
