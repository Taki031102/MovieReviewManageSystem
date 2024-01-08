<template>
  <div>
    <div id="head">
      <ul>
        <router-link to="/Home"><li>首页</li></router-link>
        <router-link to="/SortMovie"><li>评分榜</li></router-link>
        <router-link to=""><li>电视剧</li></router-link>
        <router-link to=""><li>电影</li></router-link>
      </ul>
    </div>
    <div id="main">
      <div id="login-left">
        <h2 id="user-entrance">用户入口</h2>
      </div>
      <div id="login-right" v-show="!loading" transition="fade">
        <form>
          <table>
            <tr>
              <td colspan="2"><h2>登录</h2></td>
            </tr>
            <tr>
              <td>ID：</td>
              <td><input v-model="loginForm.userId" type="text" name="userId" id="userId"></td>
            </tr>
            <tr>
              <td>密码：</td>
              <td><input v-model="loginForm.password" type="password" name="password" id="password"></td>
            </tr>
            <tr>
              <td><router-link to="/AdminLogin">管理员入口</router-link></td>
              <td><router-link to="/Register">去注册</router-link></td>
            </tr>
            <tr>
              <td colspan="2">
                <button @click.prevent="submitForm" :disabled="loading">登录</button>
                <el-loading v-if="loading" text="登录中..." color="#1890ff"></el-loading>
              </td>
            </tr>
          </table>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "LoginForm",
  data() {
    return {
      loginForm: {
        userId: "",
        password: "",
      },
      loading: false,
    };
  },
  methods: {
    async submitForm() {
      try {
        this.loading = true;
        const { userId, password } = this.loginForm;
        const response = await axios.post('http://localhost:7000/login', {
          userId,
          password,
        });

        if (response.data.code === 1) {
          const token = response.data.data;
          localStorage.setItem('token', token);
          this.$message.success('登录成功');
          console.log('Token successfully obtained and stored:', token);
          this.$router.push('/Home');
        } else {
          this.$message.error('账号或密码错误');
        }
      } catch (error) {
        console.error(error);
        this.$message.error('登录失败');
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
}

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

#main {
  width: 50%;
  height: 120%;
  margin: 0 auto;
  margin-top: 10%;
  overflow: hidden;
  display: flex;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(223, 222, 222, 1);
  box-shadow: inset 0px 2px 16px rgba(6, 0, 1, 0.31);
}

#login-left {
  flex: 1;
  width: 50%;
  background: rgba(26, 212, 131, 1);
  box-sizing: border-box;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

#login-right {
  flex: 1;
  width: 50%;
  height: 100%;
  box-sizing: border-box;
  padding-bottom: 10%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 1;
  transition: opacity 0.5s ease;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

form {
  margin-top: 20px;
  text-align: center;
}

table {
  width: 100%;
}

td {
  padding: 5px;
}

h2 {
  text-align: center;
}

#login-right button {
  margin-top: 20px;
  opacity: 1;
  background: rgba(26, 212, 131, 1);
  color: white;
  border: none;
  font-size: 15px;
  cursor: pointer;
  padding: 10px 15px;
  border-radius: 5px;
  transition: background-color 0.3s, color 0.3s;
  width: 40%;
  text-align: center;
}

#login-right button:hover {
  background: rgb(28, 185, 116);
}

#login-right button:active {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

#user-entrance {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>