<template>
  <div class="comment-section">
    <h2 class="section-title">评论区</h2>
    <transition name="fade">
      <div>
        <!-- 加载动画 -->
        <div v-if="loading" class="loading-overlay">
          <div class="loading-spinner"></div>
        </div>
        <div v-else>
          <div v-if="comments.length === 0" class="empty-comments">
            <p>暂时没有评论</p>
          </div>
          <ul v-else class="comment-list">
            <li v-for="comment in paginatedComments" :key="comment.commentId" class="comment-item">
              <div class="comment-header">
                <p class="comment-user-time">{{ comment.userId }} 于 {{ comment.createTime }} 发表</p>
                <p class="comment-score" v-if="comment.score !== null">评分: {{ comment.score }}</p>
              </div>
              <div class="comment-content">
                <strong>{{ comment.userId }}:</strong>
                <span v-html="comment.comment || '没有评论内容'"></span>
              </div>
            </li>
          </ul>
          <div class="pagination">
            <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
            <span>第 {{ currentPage }} 页</span>
            <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
          </div>
        </div>
      </div>
    </transition>
    <div class="comment-input">
      <textarea v-model="newComment" placeholder="输入您的评论" @focus="showRatingInput = true"></textarea>
      <div class="comment-rating-input" v-if="showRatingInput">
        <label>评分：</label>
        <input v-model="newRating" type="number" min="1" max="10" />
      </div>
      <button @click="submitComment" class="toggle-rating-button">发布</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { Message } from "element-ui";

export default {
  props: {
    movieId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      comments: [],
      paginatedComments: [],
      newComment: "",
      newRating: 5,
      showRatingInput: false,
      pageSize: 5,
      currentPage: 1,
      loading: false,
      userId: "", // 新增用户ID字段
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.comments.length / this.pageSize);
    },
  },
  watch: {
    comments: {
      handler() {
        this.updatePaginatedComments();
      },
      deep: true,
    },
  },
  methods: {
    // 获取本地存储的令牌的方法
    getToken() {
      const token = localStorage.getItem('token');
      if (!token) {
        // 没有有效令牌，跳转到登录页面
        window.location.href = '/Login';
        console.log('没有有效令牌，跳转到登录界面');
        return Promise.reject('没有可用的令牌');
      } else {
        return Promise.resolve(token);
      }
    },
    // 获取用户的id
    async fetchUserId() {
      try {
        const token = await this.getToken();
        this.loading = true;

        const apiUrl = "http://localhost:7000/getUserId";
        const response = await axios.get(apiUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        this.userId = response.data.data;
      } catch (error) {
        console.error('获取用户ID失败', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchComments() {
      try {
        const token = await this.getToken();
        this.loading = true;

        const apiUrl = `http://localhost:7000/comment/${this.movieId}`;
        const response = await axios.get(apiUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        this.comments = response.data.data;
      } catch (error) {
        console.error('获取评论数据失败', error);
      } finally {
        this.loading = false;
      }
    },
    async submitComment() {
  try {
    const token = await this.getToken();
    this.loading = true;

    const apiUrl = `http://localhost:7000/addComment`;
    const payload = {
      comment: this.newComment,
      score: this.showRatingInput ? this.newRating : null,
      movieId: this.movieId, // 确保 movieId 被正确传递
      userId: this.userId, // 假设这是从 fetchUserId() 中获取的 userId
    };

    await axios.post(apiUrl, payload, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // 清空输入框内容
    this.newComment = "";
    this.newRating = 5;
    this.showRatingInput = false;
    Message.success('发布评分成功');
  } catch (error) {
    Message.error('发布评论失败', error);
  } finally {
    this.loading = false;
  }
},

    async fetchData() {
      // 获取评论数据
      await this.fetchComments();
    },
    toggleRatingInput() {
      this.showRatingInput = !this.showRatingInput;
    },
    updatePaginatedComments() {
      if (Array.isArray(this.comments)) {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.paginatedComments = this.comments.slice(startIndex, endIndex);
      } else {
        console.error('评论数据不是一个数组');
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.updatePaginatedComments();
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.updatePaginatedComments();
      }
    },
  },
  mounted() {
    this.fetchUserId().then(() => {
      this.fetchComments();
    });
  },
};
</script>


<style scoped>
.section-title {
  font-size: 1.5em;
  color: #333;
}

.empty-comments {
  margin-top: 10px;
  text-align: center;
  color: #777;
}

.comment-list {
  list-style: none;
  padding: 0;
}

.comment-item {
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
  padding-bottom: 20px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 10px;
}

.comment-user-time {
  font-weight: bold;
  margin: 0;
}

.comment-score {
  color: #007aa7;
  margin: 0;
}

.comment-content {
  margin-top: 10px;
}

.comment-content p {
  margin: 0;
}

.pagination {
  margin-top: 10px;
}

.pagination button {
  margin-right: 10px;
  cursor: pointer;
  background-color: #007aa7;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
}

.pagination button:hover {
  background-color: #005580;
}

.toggle-rating-button:hover {
  background-color: #005580;
}

.comment-input {
  margin-top: 15px;
}

textarea {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 8px;
}

.submit-button {
  background-color: #007aa7;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #005580;
}

.comment-rating-input {
  display: flex;
  flex-direction: column;
}

.toggle-rating-button {
  background-color: #007aa7;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  float: left;
  width: 77.33px;
}

.toggle-rating-button:hover {
  background-color: #005580;
}

.comment-input,
.rating-input {
  margin-top: 15px;
}
/* 样式部分 */
.toggle-rating-button {
  background-color: #007aa7;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  width: 100px; /* 修改按钮宽度 */
}

.toggle-rating-button:hover {
  background-color: #005580;
}
.rating-input input {
  width: 60px;
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
