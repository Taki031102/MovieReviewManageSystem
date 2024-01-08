<!-- SearchResult.vue -->
<template>
  <div>
    <SearchInput />
    <h1>搜索结果</h1>
    <div v-if="searchResult.length > 0">
      <div v-for="movie in sortedSearchResult" :key="movie.movieId" class="movie-info">
        <div class="movie-img">
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
        </div>
        <div class="movie-details">
          <h2 v-tooltip="{
              class: 'v-tooltip',
              content: '点击查看评论',
              style: {
                  'background-color': '#333',
                  'color': '#fff',
                  'padding': '8px 12px',
                  'border-radius': '4px',
                  'box-shadow': '0 2px 4px rgba(0, 0, 0, 0.1)',
                  'font-size': '14px',
                  'position': 'absolute',
                  'bottom': '125%',
                  'left': '50%',
                  'transform': 'translateX(-50%)',
              }
          }"
            class="movie-title" @click="fetchComments(movie.movieId)">
            {{ movie.title }}
          </h2>
          <p>简介: {{ movie.content }}</p>
          <p>评分: {{ movie.score }}</p>
          <div v-if="showComments && selectedMovieId === movie.movieId">
            <CommentSection
              v-if="showComments && selectedMovieId === movie.movieId"
              :movieId="selectedMovieId"
              ref="commentSection"
              @post-comment="handlePostComment"
              @post-rating="handlePostRating"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>无搜索结果</p>
    </div>
  </div>
</template>

<script>
import SearchInput from "@/views/SearchInput.vue";
import CommentSection from "@/views/CommentSection.vue";
import VTooltip from 'v-tooltip';

export default {
  components: {
    SearchInput,
    CommentSection
  },
  directives: {
    'tooltip': VTooltip,
  },
  data() {
    return {
      searchResult: [],
      showComments: false,
      selectedMovieId: null,
    };
  },
  computed: {
    sortedSearchResult() {
      return this.searchResult.slice().sort((a, b) => b.score - a.score);
    },
  },
  methods: {
    fetchComments(movieId) {
      this.selectedMovieId = movieId;
      this.showComments = true;
      if (this.$refs.commentSection) {
        this.$refs.commentSection.fetchComments();
      }
    },
    handlePostComment({ movieId, comment }) {
      console.log(`发布评论 '${comment}'，电影ID为 ${movieId}`);
      // 这里可以添加逻辑，比如将评论添加到数组或发送到服务器
    },
    handlePostRating({ movieId, rating }) {
      console.log(`发布评分 '${rating}'，电影ID为 ${movieId}`);
      // 这里可以添加逻辑，比如更新数据中的电影评分
    }
  },
  mounted() {
    const resultFromRoute = this.$route.query.result;
    this.searchResult = Array.isArray(resultFromRoute) ? resultFromRoute : [];
  },
};
</script>

<style scoped>
body {
  display: flex;
  flex-direction: column;
}
.movie-info {
  display: flex;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  padding: 10px;
}
.movie-img {
  width: 30%;
  margin-right: 10px;
}
.movie-details {
  flex: 1;
}
.movie-title {
  cursor: pointer;
  position: relative;
}
</style>