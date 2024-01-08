<template>
  <div id="app">
    <XGridTable />
  </div>
</template>

<script>
import XGridTable from "./components/XGridTable.vue";

export default {
  name: "App",
  components: {
    XGridTable,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
