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
        <h2 id="user-entrance">管理员入口</h2>
      </div>
      <div id="login-right">
        <form>
          <table>
            <tr>
              <td colspan="2"><h2>登录</h2></td>
            </tr>
            <tr>
              <td>ID：</td>
              <td><input v-model="loginForm.adminId" type="text" name="adminId" id="adminId"></td>
            </tr>
            <tr>
              <td>密码：</td>
              <td><input v-model="loginForm.password" type="password" name="password" id="password"></td>
            </tr>
            <tr>
              <td><router-link to="/Login">用户入口</router-link></td>
            </tr>
            <tr>
              <td colspan="2">
                <button @click.prevent="submitForm" :disabled="loading">
                  <span v-if="loading">登录中...</span>
                  <span v-else>登录</span>
                </button>
              </td>
            </tr>
          </table>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'; // 导入 Axios
export default {
  name: "LoginForm",
  data() {
    return {
      loginForm: {
        adminId: "",
        password: "",
      },
      loading: false, // 添加 loading 状态
      loginRules: {
        adminId: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    async submitForm() {
      try {
        const { adminId, password } = this.loginForm;
        const response = await axios.post('http://localhost:7000/admin', {
          adminId,
          password,
        });

        if (response.data.code === 1) {
          const token = response.data.data;

          // 存储令牌到 localStorage
          localStorage.setItem('token', token);

          // 检查令牌是否成功存储
          if (localStorage.getItem('token')) {
            this.isLoggedIn = true; // 更新本地状态表示用户已登录
            this.$message.success('登录成功');
            console.log('Token successfully obtained and stored:', token);
            this.$router.push('/AdminPage');
          } else {
            this.$message.error('令牌存储失败');
            console.error('Token storage failed');
          }
        } else {
          this.$message.error('账号或密码错误');
        }
      } catch (error) {
        console.error(error);
        this.$message.error('登录失败');
      }
    },
  },
  created() {
    if (localStorage.getItem('token')) {
      this.isLoggedIn = true;
    }
  }
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
  background: rgba(26, 212, 131, 1);; /* 背景颜色 */
  color: white; /* 文字颜色 */
  border: none;
  font-size: 15px;
  cursor: pointer;
  padding: 10px 15px; /* 调整内边距 */
  border-radius: 5px;
  transition: background-color 0.3s, color 0.3s; /* 过渡动画效果 */
  width: 40%;
  text-align: center;
}

#login-right button:hover {
  background: rgb(28, 185, 116);; /* 悬停时的背景颜色 */
}

#login-right button:active {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3); /* 点击时添加阴影效果 */
}
#user-entrance {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>