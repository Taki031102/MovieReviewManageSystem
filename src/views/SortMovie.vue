<template>
  <div>
    <SearchInput />
    <div class="sort-movie">
      <h1>评分榜</h1>
      <ul>
        <router-link
          v-for="movie in movies"
          :key="movie.movieId"
          :to="{ name: 'SearchResultComment', query: { movieId: movie.movieId } }"
          tag="li"
        >
          <li>
            {{ movie.title }}
            <p>{{ movie.content }}</p>
            <p>评分：{{ movie.score }}</p>
            <!-- Other movie details -->
            <el-image
              style="max-width: 100px; max-height: 150px;"
              :src="require('@/assets/' + movie.img)"
              :alt="movie.title"
              fit="cover"
              :lazy="true"
              placeholder="占位符图片路径"
              error="加载失败时显示的图片路径"
              class="movie-poster"
            ></el-image>
          </li>
        </router-link>
      </ul>
      <!-- 加载状态 -->
      <el-loading v-if="loading" text="加载中..." color="#1890ff"></el-loading>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import SearchInput from "@/views/SearchInput.vue";

export default {
  name: "SortMovie",
  components: { SearchInput },
  data() {
    return {
      movies: [],
      loading: false,
    };
  },
  methods: {
    async fetchData() {
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

        this.loading = true;

        const sortMovieResponse = await axios.get("http://localhost:7000/sortMovie", {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        this.movies = sortMovieResponse.data.data.slice(0, 8);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
body {
  display: flex;
  flex-direction: column;
}

.sort-movie {
  width: 80%;
  margin: 0 auto;
}
</style>
