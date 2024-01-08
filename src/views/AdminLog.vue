<template>
  <div>
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
          <p>您当前所在位置：首页 > 后台中心 > 日志管理</p>
        </div>
        <!-- end r_location -->
        <!-- r_message start -->
        <div id="page">
          <h1>日志信息管理</h1>
          <br />
          <div class="table-container">
            <table id="adminLogsTable" class="reponsetable" >
              <!-- 加载动画 -->
              <div v-if="loading" class="loading-overlay">
                <div class="loading-spinner"></div>
              </div>
              <thead>
              <tr>
                <th>ID</th>
                <th>操作用户</th>
                <th>操作类名</th>
                <th>操作方法名</th>
                <th>操作时间</th>
                <th>操作方法参数</th>
                <!-- <th>返回值</th> -->
                <th>花费时间(ms)</th>
              </tr>
              </thead>
              <tbody>
              <!-- 表格中的 v-for 循环使用 paginatedAdminLogs -->
              <tr v-for="(log, index) in paginatedAdminLogs" :key="log.id">
                <td>{{ index + 1 }}</td>
                <td>{{ log.operateUser }}</td>
                <td>{{ log.className }}</td>
                <td>{{ log.methodName }}</td>
                <td>{{ log.operateTime }}</td>
                <td>{{ log.methodParams }}</td>
                <!-- <td>{{ log.returnValue }}</td> -->
                <td>{{ log.costTime }}</td>
              </tr>
              </tbody>
            </table>
            <!-- 分页组件 -->
            <pagination :current-page="currentPage" :total-pages="totalPages" @page-change="handlePageChange" />
          </div>
        </div>
        <!-- end r_message -->
      </div>
      <!-- end t_right -->
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import Pagination from "@/views/Pagination.vue"; // 路径根据实际情况调整

export default {
  components: {Pagination},
  data() {
    return {
      currentUser: {
        name: '管理员',
        role: '系统管理员',
      },
      adminLogs: [],
      activeTab: 1,
      loading: false,
      currentPage: 1,
      itemsPerPage: 5, // 每页显示的日志条目数
      totalPagesCount: 1, // 重命名以避免重复
    };
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      this.isLoggedIn = false;
      this.showDropdown = false;
    },
    async fetchData() {
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
        const response = await axios.get('http://localhost:7000/getLog',{
          headers: {
            'Authorization': `Bearer ${token}`, // 将 token 添加到请求头中
          },
        });
        this.adminLogs = response.data.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        this.loading = false; // 隐藏加载动画
      }
    },
    handleUserManagement(tab) {
      this.activeTab = tab;
    },
    // 处理分页变化
    handlePageChange(page) {
      this.currentPage = page;
      this.fetchData();
    },
  },
  computed: {
    // 计算总页数
    totalPages() {
      return Math.ceil(this.adminLogs.length / this.itemsPerPage);
    },

    // 根据当前页和每页显示数计算当前显示的日志
    paginatedAdminLogs() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.adminLogs.slice(startIndex, endIndex);
    },
  },
  mounted() {
    // 调用 fetchData 初始加载数据
    this.fetchData();
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
/* 加载动画样式 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left: 4px solid #28b779;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.tz_content .t_right {
  height: 1500px;
  background: #f3f4f5;
  margin-left: 200px;
  overflow-x: auto; /* 添加横向滚动条 */
}

.table-container  {
  max-width: 90%; /* 表格容器最大宽度 */
  overflow-x: auto; /* 横向滚动条 */
}
</style>