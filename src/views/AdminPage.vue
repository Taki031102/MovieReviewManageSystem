<template>
  <div id="app">
    <div class="tz_content">
      <!-- t_left start -->
      <div class="t_left">
        <div class="l_logo"></div>
        <div class="l_nav">
          <ul>
            <li @click="handleUserManagement(1)">
              <router-link to="/AdminPage">
                <span>用户管理</span>
              </router-link>
            </li>
            <li  @click="handleUserManagement(2)">
              <router-link to="/AdminMovie">
                <span>影片管理</span>
              </router-link>
            </li>
            <li @click="handleUserManagement(3)">
              <router-link to="/AdminLog">
                <span>日志管理</span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
      <!-- t_left end -->
      <!-- t_header start -->
      <div class="t_header">
        <!-- h_nav start -->
        <div class="h_nav"></div>
        <!-- end h_nav -->
        <!-- h_info start -->
        <div class="h_info">
          <div class="h_user">当前用户：{{ currentUser.name }} , 身份：{{ currentUser.role }}</div>
          <div class="h_out">
            <router-link to="/Home" @click="logout">
              <span>退出后台</span>
            </router-link>
          </div>
        </div>
        <!-- end h_info -->
      </div>
      <!-- end t_header -->
      <!-- t_right start -->
      <div class="t_right">
        <!-- r_location start -->
        <div class="r_location">
          <i></i>
          <p>您当前所在位置：首页 > 后台中心 > 用户管理</p>
        </div>
        <!-- end r_location -->
        <!-- r_message start -->
        <el-loading :text="loadingText" :visible="loading" :fullscreen="false" />
        <div id="page">
          <h1>用户信息管理</h1>
          <br />
          <table id="table" class="reponsetable">
            <!-- Table Content Goes Here -->
          </table>
          <table id="studentTable">
            <thead>
            <tr>
              <th>ID</th>
              <th>用户名</th>
              <th>
                <select v-model="auditFilter" @change="filterUsers">
                  <option value="" disabled selected hidden>审核状态</option>
                  <option value="">全部</option>
                  <option value="0">未审核</option>
                  <option value="1">已通过</option>
                </select>
              </th>
            </tr>
            </thead>
            <tbody>
          <tr v-for="(user, index) in filteredUsers" :key="user.userId">
            <td>{{ user.userId }}</td>
            <td>{{ user.userName }}</td>
            <td>
              <span v-if="user.status === 0" @click="toggleAuditDropdown(user, index)">
                未审核
                <button @click="performSingleAuditAction(user.userId, index, 'approve')">通过</button>
                <button @click="performSingleAuditAction(user.userId, index, 'reject')">拒绝</button>
              </span>
              <span v-else>
                {{ user.status === 1 ? '已通过' : '已拒绝' }}
              </span>
            </td>
      </tr>
    </tbody>
          </table>
        </div>
        <!-- end r_message -->
      </div>
      <!-- end t_right -->
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {Message,Loading} from "element-ui";
export default {
  name: 'AdminPage',
  components: {
    'el-loading': Loading
  },
  data() {
    return {
      activeTab: 1,
      currentUser: {
        name: '管理员',
        role: '系统管理员',
      },
      usersList: [], // 初始化为空数组
      auditFilter: '',
      auditActions: [],
      loading: false, // 控制 Loading 显示隐藏
      loadingText: '加载中...', // 加载信息
    };
  },
  computed: { 
    filteredUsers() {
      // 根据审核状态过滤用
      if (this.auditFilter === '') {
        return this.usersList;
      }
      const filterStatus = parseInt(this.auditFilter, 10);
      return this.usersList.filter(user => user.status === filterStatus);
    },
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      this.isLoggedIn = false;
      this.showDropdown = false;
    },
    toggleAuditDropdown(user, index) {
      this.$set(this.auditActions, index, !this.auditActions[index]);
    },
    // 在组件挂载时从后端获取用户信息
    async handleUserManagement(index) {
      this.activeTab = index;
      if (index === 1) {
        await this.fetchUserData(); // 当点击“用户管理”选项卡时加载用户数据
      }
    },

    async fetchUserData() {
      try {
        this.loading = true; // 开始搜索，设置 loading 状态为 true

        // 获取本地存储的令牌
        const token = localStorage.getItem('token');
        if (!token) {
          // 没有有效令牌，跳转到登录界面
          this.$router.push('/AdminLogin');
          this.$message({
            message: '请先登录',
            type: 'error',
            center: true,
          });
          return;
        }

        const response = await axios.get('http://localhost:7000/getUsers',{
          headers: {
            'Authorization': `Bearer ${token}`, // 将 token 添加到请求头中
          },
        });
        if (response.data && response.data.code === 1) {
          this.usersList = response.data.data; // 更新 usersList
          Message.success('用户信息加载成功');
        } else {
          Message.error('用户信息加载失败');
        }
      } catch (error) {
        console.error('获取用户数据时出错：', error);
        Message.error('获取用户数据时出错');
      }finally {
        this.loading = false; // 隐藏加载动画
      }
    },
    // 根据审核状态过滤用户
    filterUsers() {
      // 如果需要，可以执行其他操作
    },
    // 对单个用户执行审核操作
    async performSingleAuditAction(userId, index, action) {
      let newStatus;

      // 判断操作类型
      if (action === 'approve') {
        // 执行通过操作
        await this.auditUser(userId, 1);
        newStatus = 1;
      } else if (action === 'reject') {
        // 执行拒绝操作
        await this.auditUser(userId, 2);
        newStatus = 2;
      }

      // 更新用户状态
      const updatedUser = { ...this.usersList[index], status: newStatus };
      this.$set(this.usersList, index, updatedUser);

      // 隐藏操作按钮
      this.$set(this.auditActions, index, '');

      // 提示用户审核结果
      Message.success(`${action === 'approve' ? '通过' : '拒绝'}用户 ${userId} 成功`);
    },

    // 审核用户
    async auditUser(userId, status) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.put('http://localhost:7000/status', {
          userId: userId,
          status: status,
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        // 判断响应是否成功
        if (response.data && response.data.code === 1) {
          // 根据审核结果设置用户状态
          const newStatus = status === 1 ? 1 : (status === 2 ? 2 : 0);
          const updatedUser = { ...this.usersList.find(user => user.userId === userId), status: newStatus };

          // 更新用户列表中的用户状态
          const index = this.usersList.findIndex(user => user.userId === userId);
          this.$set(this.usersList, index, updatedUser);

          Message.success(`${status === 1 ? '通过' : '拒绝'}用户 ${userId} 成功`);
        } else {
          Message.error(`${status === 1 ? '通过' : '拒绝'}用户 ${userId} 失败: ${response.data.msg}`);
        }
      } catch (error) {
        Message.error(`${status === 1 ? '通过' : '拒绝'}用户 ${userId} 失败:`, error);
      }
    },

    // 在组件挂载时调用 fetchUserData
    mounted() {
      if (this.activeTab === 1) {
        this.fetchUserData(); // 在组件挂载时加载用户数据
      }
    },
  },
};
</script>



<style scoped>
* {
  margin: 0;
  padding: 0;
}

body {
  font-size: 12px;
  color: #666;
}

a {
  text-decoration: none;
}

ul li {
  list-style: none;
}

.tz_content {
  width: 100%;
  background: #282828;
}

/*t_left start*/
.tz_content .t_left {
  width: 200px;
  height: 800px;
  background: #282828;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 2;
}

.tz_content .t_left .l_logo {
  width: 100%;
  height: 108px;
  border-bottom: 1px solid #000000;
}


.tz_content .t_left .l_nav {
  width: 100%;
  border-bottom: 1px solid #414141;
}

.tz_content .t_left .l_nav ul li {
  border-bottom: 1px solid #000000;
  line-height: 52px;
  border-top: 1px solid #414141;
}

.tz_content .t_left .l_nav ul li a {
  display: block;
  padding-left: 30px;
}

.tz_content .t_left .l_nav ul li a:hover {
  background: #28b779;
}

.tz_content .t_left .l_nav ul .active a {
  background: #28b779;
}

.tz_content .t_left .l_nav ul li a i {
  width: 16px;
  height: 16px;
  display: block;
  float: left;
  margin-top: 20px;
}

.tz_content .t_left .l_nav ul li a span {
  font-size: 14px;
  color: #fff;
  padding-left: 10px;
}

/*end t_left*/

/*t_header start*/
.tz_content .t_header {
  width: 100%;
  height: 56px;
  background: #2f3437;
  position: relative;
  z-index: 1;
}

/*h_nav start*/
.tz_content .t_header .h_nav {
  height: 56px;
  margin-left: 200px;
  float: left;
}

.tz_content .t_header .h_nav ul li {
  float: left;
  width: 110px;
  height: 56px;
  border-left: 1px solid #414141;
  border-right: 1px solid #000;
}

.tz_content .t_header .h_nav ul li a {
  display: block;
  color: #838383;
  text-align: center;
  padding-top: 8px;
}

.tz_content .t_header .h_nav ul li a:hover {
  color: #fff;
}

.tz_content .t_header .h_nav ul li a i {
  display: block;
  width: 18px;
  height: 17px;
  margin: 3px auto;
}
/*end h_nav*/

/*h_info start*/
.tz_content .t_header .h_info {
  height: 56px;
  position: absolute;
  top: 0;
  right: 10px;
}

.tz_content .t_header .h_info .h_user {
  line-height: 56px;
  color: #fff;
  float: left;
}

.tz_content .t_header .h_info .h_out {
  width: 65px;
  height: 30px;
  background: #28b779;
  margin: 13px 5px 0 10px;
  float: right;
}

.tz_content .t_header .h_info .h_out a {
  display: block;
  line-height: 30px;
  font-size: 12px;
  color: #fff;
  padding-left: 10px;
}

.tz_content .t_header .h_info .h_out a span {
  float: left;
}

.tz_content .t_header .h_info .h_out a i {
  width: 14px;
  height: 14px;
  display: block;
  float: left;
  margin: 6px 8px;
}

/*end h_info*/

/*end header*/

.tz_content .t_right {
  height: 1500px;
  background: #f3f4f5;
  margin-left: 200px;
}

/*r_location start*/
.tz_content .t_right .r_location {
  height: 51px;
  background: #e5e5e5;
  border-bottom: 1px solid #ccc;
  line-height: 51px;
}

.tz_content .t_right .r_location i {
  width: 14px;
  height: 18px;
  display: block;
  float: left;
  margin: 16px 20px 0 20px;
}

/*end r_location*/

/*r_message start*/

.tz_content .t_right .r_message .m_list .m_desc span {
  font-size: 20px;
}
/*end r_message*/

/*r_table start*/
.tz_content .t_right .r_table .r_title i {
  width: 16px;
  height: 14px;
  display: block;
  float: left;
  margin: 12px;
}

.tz_content .t_right .r_table .r_title p {
  height: 40px;
  line-height: 40px;
  border-left: 1px solid #ccc;
  float: left;
  padding-left: 5px;
  color: #000;
}

.tz_content .t_right .r_table .r_label ul li {
  list-style: none;
  float: left;
  background: #999;
  margin: 10px 10px 0 10px;
}

.tz_content .t_right .r_table .r_label ul li a {
  display: block;
  padding: 8px 20px;
  color: #fff;
}

.tz_content .t_right .r_table .r_label ul li a:hover {
  background: #28b779;
}

.tz_content .t_right .r_table .r_label ul .select a {
  background: #28b779;
}

.tz_content .t_right .r_table .r_label ul li a i {
  width: 15px;
  height: 14px;
  display: block;
  float: left;
  margin-right: 10px;
}

/*end r_table*/

/*r_table_list start*/

.tz_content .t_right .r_table .r_table_list tr th {
  line-height: 40px;
  background: #eee;
}

.tz_content .t_right .r_table .r_table_list tr td {
  border: 1px solid #ddd;
  line-height: 40px;
}

.tz_content .t_right .r_table .r_table_list .t_tab thead {
  border: 1px solid #ddd;
}

.tz_content .t_right .r_table .r_table_list .t_tab tbody tr:hover {
  background: #EAEAEA;
}

.tz_content .t_right .r_table .r_table_list .t_tab tbody tr td .t_action a {
  width: 24px;
  height: 24px;
  display: block;
  float: left;
  margin-right: 2px;
}

.tz_content .t_right .r_table .r_table_list .t_tab tbody tr td .t_action a:hover {
  background-color: #2f3437;
}


/*end r_table_list*/
table{
  width: 90%;
  border-collapse: collapse;
}

table caption{
  font-size: 2em;
  font-weight: bold;
  margin: 1em 0;
}

th,td{
  border: 1px solid #999;
  text-align: center;
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 10px;
  padding-bottom: 10px;
}

table thead tr{
  background-color: #008c8c;
  color: #fff;
}

table tbody tr:nth-child(odd){
  background-color: #eee;
}

table tbody tr:hover{
  background-color: #ccc;
}

table tbody tr td:first-child{
  color: #f40;
}

table tfoot tr td{
  text-align: right;
  padding-right: 20px;
}


.reponsetable thead {
  background: #f2f2f2;
}

.reponsetable th,
.reponsetable td {
  position: relative;
  padding: 9px 15px;
  min-height: 20px;
  line-height: 20px;
  font-size: 12px;
}

.reponsetable tr:nth-child(even) {
  background: #f3f3f3;
}

.btn-container button {
  margin-bottom: 10px;
}

#page{
  margin-left: 4%;
  margin-top: 30px;
}

.tz_content .t_right #studentTable th select {
  position: relative;
  padding: 9px 15px;
  font-size: 16px;
  font-weight: bold;
  background-color: #008c8c;
  color: #fff;
  line-height: 40px;
  border: none; /* 移除边框 */
}
.tz_content .t_right #studentTable th select option {
  background-color: #fff;
  color: #333;
  text-align: center;
}
.tz_content .t_right #studentTable th select:hover {
  border-color: #666;
}

.tz_content .t_right #studentTable th select:focus {
  outline: none;
  border-color: #28b779;
  box-shadow: 0 0 5px rgba(40, 183, 121, 0.5);
}


/* 在原有样式的基础上添加以下样式 */
.tz_content .t_right #studentTable {
  width: 90%; /* 设置表格宽度 */
  table-layout: fixed; /* 固定表格布局 */
}

.tz_content .t_right #studentTable th,
.tz_content .t_right #studentTable td {
  width: 33.33%; /* 设置单元格宽度 */
}

.tz_content .t_right #studentTable th select {
  width: 33%; /* 使下拉按钮宽度占满 th 元素 */
  box-sizing: border-box;
  padding: 5px; /* 调整下拉按钮内边距 */
  font-size: 14px; /* 调整字体大小 */
}

.tz_content .t_right #studentTable th {
  text-align: center; /* 水平居中表头文本 */
}

.tz_content .t_right #studentTable td {
  text-align: center; /* 水平居中单元格文本 */
}

</style>
