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
      <div id="register-left">
        <form>
          <table>
            <tr>
              <td colspan="2"><h2>注册</h2></td>
            </tr>
            <tr>
              <td>ID：</td>
              <td><input v-model="id" type="text" name="userId" id="userId"></td>
            </tr>
            <tr>
              <td>用户名：</td>
              <td><input v-model="username" type="text" name="userName" id="userName"></td>
            </tr>
            <tr>
              <td>密码：</td>
              <td><input v-model="password" type="password" name="password" id="password"></td>
            </tr>
            <tr>
              <td></td>
              <td><router-link to="/Login">去登录</router-link></td>
            </tr>
            <tr>
              <td colspan="2">
                <!-- 修改这里，使用@click.prevent替代type="submit"，并调用新的register方法 -->
                <button @click.prevent="register">注册</button>
              </td>
            </tr>
          </table>
        </form>
      </div>
      <div id="register-right"></div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "RegisterForm",
  data() {
    return {
      id: "",
      username: "",
      password: ""
    };
  },
  methods: {
    register() {
      axios
          .post("http://localhost:7000/addUser", {
            userId: this.id,
            userName: this.username,
            password: this.password
          })
          .then(response => {
            console.log(response.data);
            alert("注册成功，请登录！");
            this.$router.push('/Login');
          })
          .catch(error => {
            console.error("注册失败", error);
            alert("注册失败，请检查用户名和密码！");
          });
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

#register-left {
  flex: 1;
  width: 50%;

  box-sizing: border-box;
  border-radius: 10px;
  padding-bottom: 10%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#register-right {
  flex: 1;
  width: 50%;
  box-sizing: border-box;
  background: rgba(26, 212, 131, 1);
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

#register-left button {
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
#register-left button:hover {
  background: rgb(28, 185, 116);; /* 悬停时的背景颜色 */
}

#register-left button:active {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3); /* 点击时添加阴影效果 */
}
</style>