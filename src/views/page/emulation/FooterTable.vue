<template>
  <div class="footer">
    <div class="left-content__footer">
      <span class="sub-text"
        >{{ this.$EmulationResources["VN"].Total }}:
        <span class="main-text">{{ dataLength }}</span>
        {{ this.$EmulationResources["VN"].Data }}</span
      >
    </div>
    <div class="right-content__footer">
      <div>
        <span class="sub-text"
          >{{ this.$EmulationResources["VN"].DataPerPage }}
        </span>
        <select name="" id="" class="pagination__select" v-model="itemPerPage">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
      <div class="footer-change-page-div">
        <span class="main-text"
          >{{ from }} - {{ to }}
          <span class="sub-text"
            >{{ this.$EmulationResources["VN"].Data }}
          </span>
        </span>
        <div class="footer-button-div">
          <button
            class="footer__button"
            @click="goToPrevPage"
            :style="!isValidGoToPrevPage ? 'color:  grey' : 'black'"
          >
            <i class="bx bx-chevron-left"></i>
          </button>
          <button
            class="footer__button"
            @click="goToNextPage"
            :style="!isValidGoToNextPage ? 'color:  grey' : 'black'"
          >
            <i class="bx bx-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FooterTable",
  created() {
    // Nhận emit xác nhận có thể đi đến trang kế tiếp hay ko
    this.$emitter.on("isCanGotoNextPage", (bool) => {
      this.isValidGoToNextPage = bool;
    });

    // Nhận emit xác nhận có thể đi về trang trước hay ko
    this.$emitter.on("isCanGotoPrevPage", (bool) => {
      this.isValidGoToPrevPage = bool;
    });

    // Nhận emit và gán giá trị vị trí hiện tại của trang
    this.$emitter.on("setPage", (from, to) => {
      this.from = from;
      this.to = to;
    });
  },

  props: ["dataLength"],
  data() {
    return {
      from: 1,
      to: 50,
      isValidGoToNextPage: true,
      isValidGoToPrevPage: false,
      itemPerPage: 50,
    };
  },
  methods: {
    // Gửi emit đi đến trang kế tiếp
    goToNextPage() {
      this.$emitter.emit("goToNextPage");
    },

    // Gửi emit về trang trước
    goToPrevPage() {
      this.$emitter.emit("goToPrevPage");
    },
  },
  watch: {
    // Gửi emit mỗi lần thay đổi số phần tử 1 trang
    itemPerPage: function () {
      this.$emitter.emit("changeItemPerPage", Number(this.itemPerPage));
    },
  },
  beforeUnmount() {
    // Xóa các emit trước khi unmount
    this.$emitter.off("cannotGotoNextPage");
    this.$emitter.off("canGotoNextPage");
    this.$emitter.off("canGotoPrevPage");
    this.$emitter.off("setPage");
  },
};
</script>
<style>
@import url("../../../css/main.css");
</style>
