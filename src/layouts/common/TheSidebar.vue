<template>
  <div class="sidebar" ref="sidebar">
    <div class="sidebar--item">
      <i class="bx bx-pie-chart-alt"></i>
      <div v-if="!isCloseSideBar">
        <span>{{ this.$EmulationResources["VN"].Summary }}</span>
        <i class="bx bxs-chevron-right dropdown-icon"></i>
      </div>
    </div>

    <router-link to="/customer" class="sidebar--item">
      <i class="bx bx-pie-chart-alt"></i>
      <div v-if="!isCloseSideBar">
        <span>{{ this.$EmulationResources["VN"].Customer }}</span>
        <i class="bx bxs-chevron-right dropdown-icon"></i>
      </div>
    </router-link>
    <a class="sidebar--item">
      <i class="bx bx-pie-chart-alt"></i>
      <div v-if="!isCloseSideBar">
        <span>{{ this.$EmulationResources["VN"].Summary }}</span>
        <i class="bx bxs-chevron-right dropdown-icon"></i>
      </div>
    </a>
    <a class="sidebar--item">
      <i class="bx bx-pie-chart-alt"></i>
      <div v-if="!isCloseSideBar">
        <span>{{ this.$EmulationResources["VN"].Summary }}</span>
        <i class="bx bxs-chevron-right dropdown-icon"></i>
      </div>
    </a>
    <a class="sidebar--item">
      <i class="bx bx-pie-chart-alt"></i>
      <div v-if="!isCloseSideBar">
        <span>{{ this.$EmulationResources["VN"].Summary }}</span>
        <i class="bx bxs-chevron-right dropdown-icon"></i>
      </div>
    </a>
    <a class="sidebar--item">
      <i class="bx bx-pie-chart-alt"></i>
      <div v-if="!isCloseSideBar">
        <span>{{ this.$EmulationResources["VN"].Summary }}</span>
        <i class="bx bxs-chevron-right dropdown-icon"></i>
      </div>
    </a>
    <a class="sidebar--item">
      <i class="bx bx-pie-chart-alt"></i>
      <div v-if="!isCloseSideBar">
        <span>{{ this.$EmulationResources["VN"].Summary }}</span>
      </div>
    </a>
    <div class="sidebar--line"></div>
    <router-link to="/emulation" class="sidebar--item">
      <i class="bx bx-pie-chart-alt"></i>
      <span v-if="!isCloseSideBar">Danh mục</span>
    </router-link>

    <div class="sidebar--item">
      <i class="bx bx-pie-chart-alt"></i>
      <div v-if="!isCloseSideBar">
        <span>{{ this.$EmulationResources["VN"].Summary }}</span>
        <i class="bx bxs-chevron-right dropdown-icon"></i>
      </div>
    </div>
    <div class="sidebar--line"></div>
    <div class="sidebar--item">
      <i class="bx bx-pie-chart-alt"></i>
      <div v-if="!isCloseSideBar">
        <span>Hướng dẫn</span>
        <i class="bx bxs-chevron-right dropdown-icon"></i>
      </div>
    </div>
    <button class="collapse sidebar--item" @click="changeWidthSidebar">
      <div ref="collapseIcon" class="collapse-div--icon">
        <i class="bx bxs-chevron-left"></i>
        <i class="bx bxs-chevron-left sub-icon"></i>
      </div>

      <span v-if="!isCloseSideBar">{{
        this.$EmulationResources["VN"].Minimize
      }}</span>
    </button>
  </div>
</template>
<script>
export default {
  name: "TheSidebar",
  data() {
    return {
      closeWidth: 63, // Chiểu dài khi đóng
      openWidth: 204, // Chiều dài khi mở
      isCloseSideBar: false,
    };
  },
  methods: {
    // Thay đổi trạng thái đóng/mở của sidebar
    changeWidthSidebar() {
      this.isCloseSideBar = !this.isCloseSideBar;
    },
  },
  watch: {
    // Thay đổi chiều dài sidebar khi trạng thái thay đổi
    isCloseSideBar: function () {
      this.$refs.sidebar.style.width =
        this.isCloseSideBar == true
          ? this.closeWidth + "px"
          : this.openWidth + "px";
      this.$refs.collapseIcon.style.transform =
        this.isCloseSideBar == true ? "rotate(180deg)" : "rotate(0deg)";
      this.$refs.collapseIcon.style.left =
        this.isCloseSideBar == true ? "10px" : "0px";
    },
  },
};
</script>
<style>
@import url("../../css/main.css");
</style>
