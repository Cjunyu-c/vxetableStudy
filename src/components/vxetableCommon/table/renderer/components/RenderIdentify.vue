<template>
  <div>
    <span v-if="row.isDeleted" class="el-icon-error mr5" style="color: #f56c6c"></span>
    <span v-else class="el-icon-success mr5" style="color: #67c23a"></span>
    <span>{{ row.id }}</span>
  </div>
</template>

<script>
export default {
  name: "RenderContStatus",
  props: {
    params: Object,
  },

  data() {
    return {
      column: null,
      row: null,
    };
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      const { row, column } = this.params;
      this.column = column;
      this.row = row;
    },
  },
};
</script>

<style scoped>
.my-filter-input {
  padding: 10px;
}
.statusColor {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  background: #ddd;
}
</style>
