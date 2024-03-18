<template>
  <router-view></router-view>
</template>
<script>
export default {
  name: "TheMain",
  components: {},
  data() {
    return {};
  },
};
</script>
<style>
@import url("../../css/main.css");
.main__container {
  height: calc(100vh - 62px);
}
</style>
