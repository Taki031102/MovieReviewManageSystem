<template>
  <div id="app">
    <SearchInput />
    <div class="content">
      <div class="banner">
        <el-carousel :interval="4000" arrow="always" >
          <el-carousel-item v-for="item in images" :key="item.id">
            <img :src="item.imageUrl" :alt="item.title" class="carousel-image" style="width: 100%; height: 100%;" />
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="movie-list">
        <h2>电影列表</h2>
        <!-- 加载动画 -->
        <div v-if="loading" class="loading-overlay">
          <div class="loading-spinner"></div>
        </div>

        <div v-else>
          <div class="movie-item" v-for="(movie, index) in movies" :key="index">
            <!-- 电影海报 -->
            <el-image
                :src="require('@/assets/' + movie.img)"
                :alt="movie.title"
                :fit="'cover'"
                :lazy="true"
                placeholder="占位符图片路径"
                error="加载失败时显示的图片路径"
                class="movie-poster"
            />
            <div class="movie-details">
              <!-- 电影标题 -->
              <p class="movie-title">{{ movie.title }}</p>
              <!-- 电影评分 -->
              <p class="movie-rating">{{ movie.score }} 分</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import SearchInput from "@/views/SearchInput.vue";

export default {
  name: "HomePage",
  components: { SearchInput },
  data() {
    return {
      images: [
        { id: 1, imageUrl: require('@/assets/1.jpg'), alt: 'Image 1' },
        { id: 2, imageUrl: require('@/assets/2.jpg'), alt: 'Image 2' },
        { id: 3, imageUrl: require('@/assets/3.jpg'), alt: 'Image 3' },
        { id: 4, imageUrl: require('@/assets/4.jpg'), alt: 'Image 4' },
        { id: 5, imageUrl: require('@/assets/5.jpg'), alt: 'Image 5' },
      ],
      currentIndex: 0,
      movies: [],
      loading: true, // 添加加载状态
      spinnerOptions: {
        target: '.loading-container', // 设置加载动画的目标元素
      },
    };
  },
  methods: {
    fetchMovieData() {
      // 模拟加载延时
      setTimeout(() => {
        axios
            .get('http://localhost:7000/getMovie')
            .then(response => {
              this.movies = response.data.data;
              this.loading = false; // 加载完成后设置为false
            })
            .catch(error => {
              console.error('Error fetching movie data:', error);
              this.loading = false; // 处理加载失败的情况
            });
      }); // 1秒延时示例
    },
  },
  mounted() {
    console.log('Component mounted');
    this.fetchMovieData();
  },
};
</script>

<style scoped>
@import url('//at.alicdn.com/t/c/font_4389651_ayfjfcntckg.css');

body {
  margin: 0;
  padding: 0;
  font-family: 'Arial', sans-serif;
}

#app {
  text-align: center;
}

.content {
  max-width: 800px;
  margin: auto;
}

.banner {
  margin-top: 10px;
  margin-bottom: 20px;
  max-width: 800px;
  max-height: 600px;
  margin: auto;
}

.el-carousel__item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}


.movie-list {
  text-align: left;
}

.movie-item {
  display: inline-block;
  max-width: 48%; /* 修改为最大宽度为40% */
  height: auto;
  margin: 1%;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  break-inside: avoid;
}

.movie-poster {
  border-radius: 8px 8px 0 0;
  height: 80%; /* 自适应高度 */
  break-inside: avoid;
  box-sizing: border-box;
}

.movie-details {
  padding: 10px;
}

.movie-title {
  font-size: 16px;
  margin: 8px 0;
}

.movie-rating {
  font-size: 14px;
  color: #f90;
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