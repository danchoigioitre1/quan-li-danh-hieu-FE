<template>
  <TheHeader />
  <div class="container">
    <TheSidebar class="menu" />
    <TheMain class="main" />
  </div>
</template>

<script>
import TheHeader from "./layouts/common/TheHeader.vue";
import TheSidebar from "./layouts/common/TheSidebar.vue";
import TheMain from "./layouts/common/TheMain.vue";
export default {
  name: "App",
  components: {
    TheMain,
    TheHeader,
    TheSidebar,
  },
};
</script>

<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
.main {
  /* width: 86%; */
  padding: 15px 16px;
  padding-bottom: 0;
  padding-right: 0px;
}
.container {
  display: flex;
}
</style>
