<template>
  <div class="confirm-container">
    <div class="confirm-modal">
      <div class="modal--header">
        <h3>{{ this.$EmulationResources["VN"].Notification }}</h3>
        <button @click="closeConfirmModal"><i class="bx bx-x"></i></button>
      </div>
      <div class="modal--content">
        <div>
          {{ this.$EmulationResources["VN"].Delete }}
          <span class="total-delete"
            >{{ `${deleteList.length} danh hiệu` }}
          </span>
          {{ this.$EmulationResources["VN"].Selected }} ?
        </div>
        <div class="cf-modal__div--button">
          <button class="no-cf" @click="closeConfirmModal">
            {{ this.$EmulationResources["VN"].Not }}
          </button>
          <button class="cf" @click="confirmDeleteData">
            {{ this.$EmulationResources["VN"].DeleteEmulation }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "ConfirmModal",
  props: ["deleteList"],
  data() {
    return {};
  },
  created() {},
  methods: {
    /**
     * Hàm gửi emit đóng modal xác nhận xóa
     * CreatedBy: NVA - MF1618
     */
    closeConfirmModal() {
      this.$emitter.emit("closeConfirmModal");
    },

    /**
     * Hàm gửi emit xóa các bản ghi có id nằm trong mảng deleteList
     * CreatedBy: NVA - MF1618
     */
    confirmDeleteData() {
      this.$emitter.emit("deleteDataSelected", this.deleteList);
    },
  },
};
</script>
<style>
.confirm-container {
  font-size: 15px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.381);
  z-index: 100;
}
.confirm-modal {
  padding: 20px;
  width: 480px;
  height: 210px;
  background: white;
  border-radius: 4px;
  box-sizing: border-box;
}
.confirm-modal {
  font-weight: bold;
}
.modal--header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.modal--header button:hover {
  color: rgba(255, 0, 0, 0.616);
}
.modal--content {
  font-weight: 400;
  padding-top: 20px;
}
.total-delete {
  font-weight: bold;
}
.cf-modal__div--button {
  margin-top: 60px;
  display: flex;
  justify-content: flex-end;
  padding-right: 8px;
}
.cf-modal__div--button button {
  background-color: white;
  height: 36px;
  border-radius: 4px;
}
.cf-modal__div--button .no-cf {
  width: 80px;
  border: 1px solid #e0e0e0;
  box-sizing: border-box;
}
.cf-modal__div--button .no-cf:hover {
  background: #e5e5e549;
}
.cf-modal__div--button .cf {
  width: 121px;
  background-color: #ef5350;
  margin-left: 8px;
  color: white;
}
.modal--header i {
  font-size: 25px;
  opacity: 0.7;
}
</style>
