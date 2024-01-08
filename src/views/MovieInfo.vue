<template>
  <div class="movie-info-container">
    <div v-if="loading" class="loading-message">加载中...</div>
    <div v-else>
      <div v-if="error" class="error-message">{{ error }}</div>
      <div v-else>
        <div class="movie-img">
          <img :src="movie.imgUrl" alt="电影图片">
        </div>
        <div class="movie-details">
          <p>名称: {{ movie.name }}</p>
          <p>简介: {{ movie.description }}</p>
          <p>评分: {{ movie.rating }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    searchWord: {
      type: String,
      required: true,
    },
    movieId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      movie: {},
      loading: true,
      error: null,
    };
  },
  mounted() {
    this.fetchMovieData();
  },
  methods: {
    async fetchMovieData() {
      this.loading = true;
      this.error = null;
      try {
        const response = await this.axios.get(`http://localhost:7000/movies/${this.movieId}`);
        this.movie = response.data;
      } catch (error) {
        console.error('Error fetching movie data:', error);
        this.error = '加载电影数据时出错，请刷新页面重试。';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.movie-info-container {
  width: 80%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.movie-img {
  width: 50%;
  height: 100%;
  opacity: 1;
  margin-right: 5%;
  background: rgba(0, 0, 0, 1);
  border: 1px solid rgba(111, 166, 207, 1);
  border-radius: 8px;
  overflow: hidden;
}

.movie-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.movie-details {
  width: 50%;
  background: rgba(255, 255, 255, 0.9);
  padding: 10px;
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