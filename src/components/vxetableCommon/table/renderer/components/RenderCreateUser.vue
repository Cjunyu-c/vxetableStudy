<template>
  <div>{{ utc2beijing(row.createTime) }} | {{ row.createUser }}</div>
</template>

<script>
export default {
  name: "RenderCreateUser",
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

<style scoped></style>
