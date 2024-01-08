<template>
  <div>
    <!-- 头部导航栏 -->
    <div id="head">
      <ul>
        <!-- 路由链接 -->
        <router-link to="/Home"><li>首页</li></router-link>
        <router-link to="/SortMovie"><li>评分榜</li></router-link>
        <router-link to="/TVShows"><li>电视剧</li></router-link>
        <router-link to="/Movies"><li>电影</li></router-link>
      </ul>
    </div>

    <!-- 搜索栏 -->
    <div id="search-container">
      <div id="search">
        <!-- 搜索输入框和按钮 -->
        <input v-model="searchKeyword" type="text" placeholder="请输入查找内容">
        <button @click="search" id="searchButton" :disabled="loading">
          <i class="iconfont icon-sousuo"></i>
        </button>
        <!-- Loading 组件 -->
        <el-loading :text="loadingText" :visible="loading" class="search-loading"></el-loading>
      </div>

      <!-- 登录按钮或用户信息 -->
      <div>
        <button v-if="!isLoggedIn" @click="redirectToLogin" id="Login_button">登录</button>
        <div v-if="isLoggedIn" class="user-dropdown" @mouseenter="toggleDropdown" @mouseleave="toggleDropdown">
          <button class="user-button">您已登录</button>
          <ul v-show="showDropdown">
            <li @click="logout" class="user-button">登出</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { Message, Loading } from "element-ui";

export default {
  data() {
    return {
      searchKeyword: '',
      loading: false,
      isLoggedIn: false,
      showDropdown: false,
    };
  },
  computed: {
    loadingText() {
      return this.loading ? '搜索中...' : ''; // Loading 组件的文本
    },
  },
  methods: {
    async search() {
      const trimmedKeyword = this.searchKeyword.trim();
      if (!trimmedKeyword) {
        Message.error('请输入搜索关键字');
        return;
      }

      try {
        this.loading = true;
        // 显示 Loading 组件
        const loadingInstance = Loading.service({
          text: '搜索中...',
        });
        const token = localStorage.getItem('token');
        if (!token) {
          this.$router.push('/Login');
          this.$message({
            message: '请先登录',
            type: 'error',
            center: true,
          });
          return;
        }

        const response = await axios.get(`http://localhost:7000/searchMovie/${encodeURIComponent(trimmedKeyword)}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const searchResult = response.data.data || [];
        this.$router.push({
          path: '/SearchResult',
          query: { keyword: trimmedKeyword, result: searchResult },
        });
        // 隐藏 Loading 组件
        loadingInstance.close();
      } catch (error) {
        console.error('搜索电影时出错:', error);
      } finally {
        this.loading = false;
      }
    },
    redirectToLogin() {
      this.$router.push('/Login');
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    logout() {
      localStorage.removeItem('token');
      this.isLoggedIn = false;
      this.showDropdown = false;
      this.$message.success('登出成功');
    },
  },
  mounted() {
    const token = localStorage.getItem('token');
    if (token) {
      this.isLoggedIn = true;
    }
  },
};
</script>
<style scoped>
#head {
  width: 100%;
  height: 80px;
  background: rgba(26, 212, 131, 1);
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

#head a {
  text-decoration: none;
  color: white;
}

#head ul {
  list-style: none;
  display: flex;
}

#head li {
  padding: 10px;
  margin-right: 10px;
}

#search-container {
  align-items: center;
  margin-top: 10px;
  height: 100%;
  display: flex;
  justify-content: space-between;
}

#search {
  position: relative;
  width: 40%;
  margin: 0 auto;
}

#search input {
  width: 100%;
  height: 20px;
  border-radius: 23px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(223, 222, 222, 1);
  padding: 10px;
  box-shadow: inset 0 2px 16px rgba(6, 0, 1, 0.31);
  display: flex;
  align-items: center;
  justify-content: center;
}

#searchButton {
  background: transparent;
  border: none;
  cursor: pointer;
}

#searchButton i {
  position: absolute;
  right: 0;
  top: 25%;
}

#Login_button {
  position: absolute;
  right: 5%;
  top: 17%;
  opacity: 1;
  background: rgba(26, 212, 131, 1);
  color: white;
  border: none;
  font-size: 14px;
  cursor: pointer;
  padding: 8px 20px;
  border-radius: 5px;
  transition: background-color 0.3s, color 0.3s;
}

#Login_button:hover {
  background: rgb(28, 185, 116);
}

#Login_button:active {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

.user-button {
  opacity: 1;
  background: rgba(26, 212, 131, 1);
  color: white;
  border: none;
  font-size: 14px;
  cursor: pointer;
  padding: 8px 20px;
  border-radius: 5px;
  transition: background-color 0.3s, color 0.3s;
}

.user-button:hover {
  background: rgb(28, 185, 116);
}

#Login_button:hover {
  background: rgb(28, 185, 116);
}

#Login_button:active {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

.user-dropdown:hover ul {
  display: block;
}

.user-dropdown ul {
  list-style: none;
  padding: 0;
  position: relative;
  top: -14px; /* 将 top 设为 100%，使下拉列表显示在按钮下方 */
  right: 0;
  background-color: rgba(26, 212, 131, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: none;
}


.user-dropdown ul li {
  padding: 8px;
  cursor: pointer;
}

.user-dropdown button {
  opacity: 1;
  background: rgba(26, 212, 131, 1);
  color: white;
  border: none;
  font-size: 14px;
  cursor: pointer;
  padding: 8px 20px;
  border-radius: 5px;
  transition: background-color 0.3s, color 0.3s;
}

.user-dropdown:hover button {
  background: rgb(28, 185, 116);
}

</style>
