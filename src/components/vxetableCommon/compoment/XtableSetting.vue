<template>
    <div>
      <el-drawer
        title="自定义表格列"
        :visible.sync="drawer"
        direction="rtl"
        :before-close="handleClose"
        modal
        size="200px"
        :close-on-press-escape="false"
        :wrapperClosable="false"
        :append-to-body="true"
      >
        <ul class="tableTitle" id="tableTitle">
          <li v-for="(item, index) in title" :key="index" class="item">
            <el-checkbox :disabled="item.disabled" v-model="item.visible" @change="changItem(item)">{{ item.title }}</el-checkbox>
          </li>
        </ul>
        <div style="text-align: center" class="mt20">
          <el-button type="primary" @click="sumbit">保存</el-button>
        </div>
      </el-drawer>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      tableTitle: {
        type: Array,
        default: () => [],
      },
    },
    watch: {
      tableTitle: {
        immediate: true,
        deep: true,
        handler(value) {
          let obj = JSON.stringify(value);
          this.title = JSON.parse(obj);
        },
      },
    },
    data() {
      return {
        drawer: false,
        title: [],
        key: "",
        changTitle: [],
        index: "",
      };
    },
    mounted() {},
    updated() {},
  
    methods: {
      handleClose() {
        this.drawer = false;
      },
      isopen() {
        this.drawer = true;
        this.index = "";
      },
      changItem(value) {
        // this.index = value
      },
      sumbit() {
        console.log(345, this.title);
        this.$emit("getData", this.title);
        this.drawer = false;
      },
    },
  };
  </script>
  
  <style scoped>
  .tableTitle {
    list-style: none;
    height: calc(100vh - 110px);
    overflow-y: scroll;
  }
  .drag {
    background: #000 !important;
    background-image: linear-gradient(#333, #999) !important;
  }
  </style>
  