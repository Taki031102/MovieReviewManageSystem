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
          <div class="h_user" v-if="currentUser">当前用户：{{ currentUser.name }} , 身份：{{ currentUser.role }}</div>
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
          <p>您当前所在位置：首页 > 后台中心 > 影片管理</p>
        </div>
        <!-- end r_location -->
        <!-- r_message start -->
        <div id="page">
          <!-- 影片信息管理 -->
          <h1>影片信息管理</h1>
          <br />
          <table id="table" class="reponsetable">
            <!-- Table Content Goes Here -->
          </table>

          <div class="btn-container">
            <button class="layui-btn" @click="handleShowInputFields('add')">新增影片信息</button>
            <button class="layui-btn" @click="handleShowInputFields('update')">修改影片信息</button>
            <button class="layui-btn" @click="handleShowInputFields('delete')">删除影片信息</button>
            <button class="layui-btn" @click="handleShowInputFields('query')">查询影片信息</button>
          </div>
          <div v-if="showInputFields">
            <el-dialog :visible.sync="dialogVisible" :title="getDialogTitle()">
              <!-- 弹窗中的内容 -->
              <div v-if="dialogType === 'add'">
                <!-- 新增影片信息的输入框 -->
                <div class="input-group">
                  <label>ID：</label>
                  <input v-model="newMovieInfo.movieId" placeholder="">
                </div>
                <div class="input-group">
                  <label>片名：</label>
                  <input v-model="newMovieInfo.title" placeholder="">
                </div>
                <div class="input-group">
                  <label>简介：</label>
                  <input v-model="newMovieInfo.information" placeholder="">
                </div>
                <div class="input-group">
                  <label>海报：</label>
                  <!-- 添加文件输入框 -->
                  <input type="file" @change="handleFileChange">
                </div>
                <!-- 添加其他新增影片信息的输入框 -->
                <button @click="submitAddMovie" class="submit-button">提交</button>
              </div>

              <div v-else-if="dialogType === 'update'">
                <!-- 修改影片信息的输入框 -->
                <div class="input-group">
                  <label>ID：</label>
                  <input v-model="updateMovieInfo.movieId" placeholder="">
                </div>
                <div class="input-group">
                  <label>片名：</label>
                  <input v-model="updateMovieInfo.title" placeholder="">
                </div>
                <div class="input-group">
                  <label>简介：</label>
                  <input v-model="updateMovieInfo.information" placeholder="">
                </div>
                <div class="input-group">
                  <label>海报：</label>
                  <!-- 添加文件输入框 -->
                  <input type="file" @change="handleFileChange">
                </div>
                <!-- 添加其他修改影片信息的输入框 -->
                <button @click="submitUpdateMovie" class="submit-button">提交</button>
              </div>

              <div v-else-if="dialogType === 'delete'">
                <!-- 删除影片信息的输入框 -->
                <div class="input-group">
                  <label>ID：</label>
                  <input v-model="deleteMovieInfo.movieId" placeholder="">
                </div>
                <!-- 添加其他删除影片信息的输入框 -->
                <button @click="submitDeleteMovie" class="submit-button">提交</button>
              </div>

              <div v-else-if="dialogType === 'query'">
                <!-- 查询影片信息的输入框 -->
                <div class="input-group">
                  <label>片名：</label>
                  <input v-model="queryMovieInfo.title" placeholder="">
                </div>
                <!-- 添加其他查询影片信息的输入框 -->
                <button @click="submitQueryMovie" class="submit-button">提交</button>
              </div>
            </el-dialog>
          </div>
          <table id="movieTable" class="reponsetable">
            <!-- 加载动画 -->
            <div v-if="loading" class="loading-overlay">
              <div class="loading-spinner"></div>
            </div>
            <!-- 表头 -->
            <thead>
            <tr>
              <th>ID</th>
              <th>片名</th>
              <th>简介</th>
              <th>海报</th>
              <th>评分</th>
              <th>操作</th>
            </tr>
            </thead>
            <!-- 表内容 -->
            <tbody>
            <tr v-for="(movie, index) in moviesList" :key="'movie-' + index" v-show="movie.showDetails">
              <td>{{ movie.movieId }}</td>
              <td>{{ movie.title }}</td>
              <td>{{ movie.content }}</td>
              <td>
                <el-image
                    style="max-width: 100px; max-height: 150px;"
                    :src="require('@/assets/' + movie.img)"
                    fit="cover"
                    :lazy="true"
                    placeholder="占位符图片路径"
                    error="加载失败时显示的图片路径"
                ></el-image>
              </td>
              <td>{{ movie.score }}</td>
              <td>
<!--                <button @click="editMovie(movie.movieId, index)">编辑</button>-->
                <button @click="deleteMovie(movie.movieId, index)">删除</button>
                <button @click="queryComments(movie.movieId, index)">查询评论</button>
                <button @click="goBack">返回</button>
              </td>
            </tr>
            </tbody>
          </table>
          <!-- 添加一个标记用于显示评论区域 -->
          <div v-if="showCommentsSection">
            <h2>电影评论</h2>
            <!-- 加载动画 -->
            <div v-if="loading" class="loading-overlay">
              <div class="loading-spinner"></div>
            </div>
            <table>
              <thead>
              <tr>
                <th>用户ID</th>
                <th>电影ID</th>
                <th>评论内容</th>
                <th>评分</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(comment, index) in commentsList" :key="'comment-' + index">
                <td>{{ comment.userId }}</td>
                <td>{{ comment.movieId }}</td>
                <td>{{ comment.comment }}</td>
                <td>{{ comment.score }}</td>
                <td>{{ comment.createTime }}</td>
                <td>
                  <!-- 在每一行的操作列中添加删除评论按钮 -->
                  <button @click="deleteComment(comment.commentId, index)">删除评论</button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- end r_message -->
      </div>
      <!-- end t_right -->
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { Message } from 'element-ui';

const apiBaseUrl = 'http://localhost:7000';
const loading = ref(false);

const currentUser = ref({
  name: '管理员',
  role: '系统管理员',
});

const dialogVisible = ref(false);
const dialogType = ref('');
const newMovieInfo = ref({
  movieId: '',
  title: '',
  information: '',
  poster: '',
});
const updateMovieInfo = ref({
  movieId: '',
  title: '',
  information: '',
  poster: '',
});
const deleteMovieInfo = ref({
  movieId: '',
});
const queryMovieInfo = ref({
  title: '',
});
const moviesList = ref([]);
const showCommentsSection = ref(false);
const commentsList = ref([]);
const showInputFields = ref(false);
const activeTab = ref(1);

// 获取本地存储的令牌的方法
const getToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    // 没有有效令牌，跳转到登录页面
    this.$router.push('/AdminLogin');
    this.$message({
      message: '请先登录',
      type: 'error',
      center: true,
    });
    return Promise.reject('没有可用的令牌');
  } else {
    return Promise.resolve(token);
  }
};

const handleShowInputFields = (type) => {
  showInputFields.value = type === 'add' || type === 'update' || type === 'delete' || type === 'query';
  dialogType.value = type;
  dialogVisible.value = true;
};

// 提交电影信息
const submitAddMovie = async () => {
  try {
    console.log('电影 ID:', newMovieInfo.value.movieId);

    // 检查电影ID是否为空
    if (!newMovieInfo.value.movieId) {
      alert('电影ID不能为空');
      return;
    }

    const token = await getToken();
    // 创建符合后端期望的 Movie 对象
    const newMovie = {
      movieId: newMovieInfo.value.movieId,
      title: newMovieInfo.value.title,
      content: newMovieInfo.value.information,
      score: 0,
      img: newMovieInfo.poster,
    };

    // 添加其他字段的简单检查
    if (!newMovie.title || !newMovie.content || !newMovie.img) {
      alert('请填写完整的电影信息');
      return;
    }

    const response = await axios.post(`${apiBaseUrl}/addMovie`, newMovie, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('电影添加成功:', response.data);
    Message.success('电影添加成功');
    // 关闭弹窗
    dialogVisible.value = false;

    // 重新加载电影数据
    fetchMoviesData();
  } catch (error) {
    handleError('添加电影时出错:', error);
  }
};


// 提交更新电影信息
const submitUpdateMovie = async () => {
  try {
    // 检查电影ID是否为空
    if (!updateMovieInfo.value.movieId) {
      alert('电影ID不能为空');
      return;
    }
    const token = await getToken();

    // 创建符合后端期望的 Movie 对象
    const updatedMovie = {
      movieId: updateMovieInfo.value.movieId,
      title: updateMovieInfo.value.title,
      content: updateMovieInfo.value.information, // 假设前端的 information 对应后端的 content
      score: 0, // 假设前端提供评分，默认设置为 0
      img: updateMovieInfo.value.poster, // 假设前端的 poster 对应后端的 img
    };

    const response = await axios.put(`${apiBaseUrl}/updateMovie`, updatedMovie, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    Message.success('电影更新成功:', response.data);
    // 关闭弹窗
    dialogVisible.value = false;

    // 重新加载电影数据
    fetchMoviesData();
  } catch (error) {
    handleError('更新电影时出错:', error);
  }
};



// 提交删除电影信息
const submitDeleteMovie = async () => {
  try {
    const token = await getToken();

    // 确保有要删除的电影ID
    if (!deleteMovieInfo.value.movieId) {
      Message.error('请输入要删除的电影ID');
      return;
    }
    const response = await axios.delete(`${apiBaseUrl}/delete/${deleteMovieInfo.value.movieId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // 请根据后端返回的实际情况进行调整
    if (response.data && response.data.success) {
      Message.success('电影删除成功');
    } else {
      Message.error('电影删除失败');
    }

    // 关闭弹窗
    dialogVisible.value = false;

    // 重新加载电影数据
    fetchMoviesData();
  } catch (error) {
    handleError('删除电影时出错:', error);
  }
};
// 提交查询电影信息
const submitQueryMovie = async () => {
  try {
    const token = await getToken();
    const response = await axios.get(`${apiBaseUrl}/searchMovie/${queryMovieInfo.value.title}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // 根据接口响应的数据结构，更新moviesList
    if (response.data && response.data.code === 1) {
      const movieData = response.data.data;
      moviesList.value = movieData.map(movie => {
        return {
          title: movie.title,
          movieId: movie.movieId,
          content: movie.content,
          score: movie.score,
          img: movie.img,
        };
      });
      Message.success('查询电影成功');
    } else {
      Message.error('查询电影失败');
    }

    // 关闭弹窗
    dialogVisible.value = false;
    moviesList.value = response.data.data.map(movie => ({ ...movie, showDetails: true }));
  } catch (error) {
    Message.error('查询电影时出错:', error.response ? error.response.data : error.message);
  }
};

// 操作框删除按钮
const deleteMovie = async (id, index) => {
  try {
    const token = getToken();
    const response = await axios.delete(`${apiBaseUrl}/delete/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // 根据后端返回的实际情况进行调整
    if (response.data && response.data.code === 1) {
      Message.success('电影删除成功');
    } else {
      Message.error(response.data.msg || '电影删除失败');
    }

    // 从前端列表中移除删除的电影
    moviesList.value.splice(index, 1);

    // 重新加载电影数据
    fetchMoviesData();
  } catch (error) {
    Message.error('删除电影时出错:', error.response ? error.response.data : error.message);
  }
};


const handleUserManagement = (tab) => {
  activeTab.value = tab;
  if (tab === 2) {
    fetchMoviesData();
  }
};

const handleFileChange = async (event) => {
  const file = event.target.files[0];

  if (file) {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const token = getToken();
      const response = await axios.post(`${apiBaseUrl}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      const posterUrl = response.data.data;
      newMovieInfo.poster = posterUrl;

      Message.success('上传海报成功:' + posterUrl);
    } catch (error) {
      Message.error('上传海报时出错:' + (error.response ? error.response.data : error.message));
    }
  }
};

const getDialogTitle = () => {
  switch (dialogType.value) {
    case 'add':
      return '新增影片信息';
    case 'update':
      return '修改影片信息';
    case 'delete':
      return '删除影片信息';
    case 'query':
      return '查询影片信息';
    default:
      return '';
  }
};

const queryComments = async (movieid, index) => {
  try {
    moviesList.value.forEach((movie, i) => {
      movie.showDetails = i === index;
    });

    const token = getToken();
    loading.value = true;
    const response = await axios.get(`${apiBaseUrl}/comment/${movieid}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    Message.success('电影评论:', response.data.data);
    commentsList.value = response.data.data;
    showCommentsSection.value = true;
  } catch (error) {
    Message.error('查询评论时出错:', error.response ? error.response.data : error.message);
  }finally {
    loading.value = false;
  }
};

const deleteComment = async (commentId, index) => {
  try {
    const token = getToken();
    const movieId = " ";
    const response = await axios.delete(`${apiBaseUrl}/delete`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      data: {
        commentId: commentId,
        movieId: movieId,
      },
    });

    if (response.data && response.data.code === 1) {
      Message.success('评论删除成功:', response.data.msg);
      commentsList.value.splice(index, 1);
    } else {
      Message.error('删除评论失败:', response.data ? response.data.msg : '未知错误');
    }

  } catch (error) {
    Message.error('删除评论时出错:', error.response ? error.response.data : error.message);
  }
};


const goBack = () => {
  showInputFields.value = false;
  showCommentsSection.value = false;
  fetchMoviesData();
};

// 在fetchMoviesData中设置loading状态
const fetchMoviesData = async () => {
  try {
    loading.value = true; // 显示加载动画
    const token = getToken();
    const response = await axios.get(`${apiBaseUrl}/getMovie`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    Message.success('电影信息:', response.data.data);
    moviesList.value = response.data.data.map(movie => ({ ...movie, showDetails: true }));
  } catch (error) {
    Message.error('获取电影信息时出错:', error.response ? error.response.data : error.message);
  } finally {
    loading.value = false; // 隐藏加载动画
  }
};
// 通用错误处理函数
const handleError = (message, error) => {
  Message.error(`${message} ${error.response ? error.response.data : error.message}`);
};
onMounted(fetchMoviesData);
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



/*头部导航和消息提示小于1360的时候 用下边的样式*/
@media screen and (max-width:1360px) {

  /*h_nav start*/
  .tz_content .t_header .h_nav {
    margin-left: 200px;
  }

  .tz_content .t_header .h_nav ul li {
    width: 80px;
  }

  /*end h_nav*/

}

/*头部导航和左侧导航小于1024的时候 用下边的样式*/
@media screen and (max-width:1024px) {

  /*t_left start*/
  .tz_content .t_left {
    width: 50px;
  }

  .tz_content .t_left .l_logo {
    height: 54px;
  }

  .tz_content .t_left .l_nav ul li a {
    padding-left: 16px;
    height: 52px;
  }

  .tz_content .t_left .l_nav ul li a span {
    display: none;
  }

  /*end t_left*/

  /*h_nav start*/
  .tz_content .t_header .h_nav {
    margin-left: 50px;
  }

  .tz_content .t_header .h_nav ul li {
    width: 60px;
  }

  .tz_content .t_header .h_nav ul li a span {
    display: none;
  }

  .tz_content .t_header .h_nav ul li a i {
    margin: 14px auto;
  }

  /*end h_nav*/

  .tz_content .t_header .h_info .h_user {
    display: none;
  }

  .tz_content .t_right {
    margin-left: 0;
  }

  .tz_content .t_right .r_location {
    margin-left: 50px;
  }

}


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

.layui-btn {
  display: inline-block;
  vertical-align: middle;
  height: 38px;
  line-height: 38px;
  padding: 0 18px;
  margin-right: 10px;
  background-color: #179cc3;
  color: #fff;
  white-space: nowrap;
  text-align: center;
  font-size: 14px;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  -moz-user-select: none;
  -webkit-user-select: none;
}

#page{
  margin-left: 4%;
  margin-top: 30px;
}

.input-group {
  margin-bottom: 10px;
  text-align: center;
}

label {
  display: inline-block;
  width: 80px;
  font-weight: bold;
}

input {
  width: 200px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.submit-button {
  padding: 8px 16px;
  background-color: #28b779;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  text-align: center;
  display: block;
  margin: 0 auto; /* 让按钮水平居中显示 */
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

</style>
