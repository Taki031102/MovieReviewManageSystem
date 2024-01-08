<!-- Pagination.vue -->

<template>
  <div class="pagination">
    <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">上一页</button>
    <span>{{ currentPage }}</span>
    <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">下一页</button>
  </div>
</template>

<script>
export default {
  name: 'CustomPagination', // 为了符合多个单词的命名规范而重命名
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
  },
  methods: {
    changePage(page) {
      this.$emit('page-change', page);
    },
  },
};
</script>

<style scoped>
/* 样式可根据需要自行调整 */
.pagination {
  width: 100%;
  margin-top: 10px;
  text-align: center;
  display: inline-block;
}

.pagination button {
  margin: 0 5px;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
