<template>
  <div>
    <SearchInput />
    <div class="searchcomment">
      <div class="movie-info-container">
        <div v-if="movie">
          <div class="movie-content">
            <div class="movie-img">
              <el-image
                :src="require('@/assets/' + movie.img)"
                :alt="movie.title"
                fit="cover"
                :lazy="true"
                placeholder="占位符图片路径"
                error="加载失败时显示的图片路径"
                class="movie-img"
              ></el-image>
            </div>
            <div class="text-content">
              <h2>{{ movie.title }}</h2>
              <p class="movie-detail"><b>简介: </b>{{ movie.content }}</p>
              <p class="movie-detail"><b>评分: </b> {{ movie.score }}</p>
            </div>
          </div>
        </div>
        <div v-else>
          <p v-if="loading" class="loading-message">加载中...</p>
          <p v-else class="error-message">加载失败，请稍后再试。</p>
        </div>
      </div>
      <CommentSection
        ref="commentSection"
        :movieId="this.$route.query.movieId"
        :comments="comments"
        @post-comment="handlePostComment"
        @post-rating="handlePostRating"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import SearchInput from "./SearchInput.vue";
import CommentSection from "./CommentSection.vue";

export default {
  name: "SearchResultComment",
  components: { SearchInput, CommentSection },
  data() {
    return {
      movie: [], // 存储电影数据
      comments: [], // 存储评论数据
      loading: false,
    };
  },
  methods: {
    async created() {
      try {
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

        const movieId = this.$route.query.movieId;

        const movieResponse = await axios.get(`http://localhost:7000/getMovieById/${movieId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        // 将获取的电影数据赋值给 'movie' 属性
        this.movie = movieResponse.data.data;

        
      } catch (error) {
        console.error('获取电影数据时出错：', error);
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

        // 将获取的评论数据赋值给 'comments' 属性
        this.comments = response.data.data;
      } catch (error) {
        console.error('获取评论数据失败', error);
      } finally {
        this.loading = false;
      }
    },
    handlePostComment({ movieId, comment }) {
      console.log(`发布评论 '${comment}'，电影ID为 ${movieId}`);
      // 这里可以添加逻辑，比如将评论添加到数组或发送到服务器
    },
    handlePostRating({ movieId, rating }) {
      console.log(`发布评分 '${rating}'，电影ID为 ${movieId}`);
      // 这里可以添加逻辑，比如更新数据中的电影评分
    },
  },
  mounted() {
    // 获取电影对应的评论信息
    this.fetchComments();
    this.created();
 
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.searchcomment {
  width: 80%;
  margin: 0 auto;
}

.movie-info-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.movie-content {
  display: flex;
  align-items: center;
}

.movie-img {
  width: auto; /* 修改图片宽度 */
  height: auto;
  opacity: 1;
  margin-right: 5%;
  border-radius: 8px;
  overflow: hidden;
}

.movie-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.movie-detail {
  margin-bottom: 5px;
}

.text-content h2 {
  font-size: 1.2em;
  margin-bottom: 10px;
}

.loading-message,
.error-message {
  text-align: center;
  padding: 20px;
  font-size: 18px;
}

.error-message {
  color: #ff0000;
}
</style>