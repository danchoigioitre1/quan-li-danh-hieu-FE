<template>
  <div class="combo-box">
    <div class="combo-box__input">
      <input type="text" class="input--field" v-model="textValue" />
      <button class="drop-menu-btn" @click="showData">
        <i class="bx bxs-chevron-down combo-box--icon"></i>
      </button>
    </div>
    <div v-if="!isFindData" class="text--filter-found">
      {{ fieldText }} không đúng. Vui lòng chọn {{ fieldText }}
      trong danh sách.
    </div>
    <div v-if="isShowList" class="drop-down--data">
      <div
        v-click-outside="onClickOutside"
        v-for="item in dataFilter"
        @click="selectData(item)"
        :key="item.Id"
        class="data--item"
        :style="isActiveRow == item.Id ? 'background:#e0ebff;' : ''"
      >
        {{ item.value }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "ComboBox",
  props: ["dataList", "field", "fieldText"],
  data() {
    return {
      dropDownData: [], // danh sách thả xuống
      dataFilter: [], // danh sách sau khi lọc
      isShowList: false, // show danh sách
      textValue: this.$EmulationResources["VN"].All, // giá trị name
      idValue: 0, // giá trị id
      isActiveRow: 0, // effect khi chọn 1 dòng
      firstOpen: -1,
      isFindData: true, // show lỗi khi không tìm thấy data
    };
  },
  created() {
    /**
     * Hàm lấy filter từ local, nếu ko có thì lấy giá trị măc định
     * CreatedBy: NVA - MF1618
     */
    const filter = JSON.parse(localStorage.getItem("filter")) ?? {
      Object: 0,
      Level: 0,
      Type: 0,
      Status: 0,
    };

    /**
     * Gán giá trị ban đầu cho combobox
     * CreatedBy: NVA - MF1618
     */
    this.idValue = filter[this.field];
    this.isActiveRow = filter[this.field];
    this.textValue = this.dataList[this.idValue].value;
    this.dropDownData = this.dataList;
    this.dataFilter = this.dropDownData;
  },

  beforeUnmount() {},

  methods: {
    /**
     * Hàm show danh sách thả xuống
     * CreatedBy: NVA - MF1618
     */
    showData() {
      if (!this.isShowList) {
        this.dataFilter = this.dropDownData;
        this.isShowList = true;
      } else {
        this.isShowList = false;
      }
    },

    /**
     * Hàm chọn giá trị khi click
     * CreatedBy: NVA - MF1618
     */
    selectData(item) {
      this.textValue = item.value;
      this.idValue = item.Id;
      this.isActiveRow = item.Id;

      /**
       * Gửi đi emit chứa giá trị của dữ liệu vừa chọn
       * CreatedBy: NVA - MF1618
       */
      this.$emit("value", this.idValue, this.field);
    },

    /**
     * Hàm ẩn danh sách thả xuống khi click ra ngoài
     * CreatedBy: NVA - MF1618
     */
    onClickOutside() {
      this.isShowList = false;
    },
  },
  watch: {
    /**
     * Hàm cập nhật lại danh sách thả xuống khi thay đổi giá trị trong input
     * CreatedBy: NVA - MF1618
     */
    textValue: function () {
      this.firstOpen++;
      if (this.firstOpen > 0) {
        this.dataFilter = this.dropDownData.filter((item) =>
          item.value.toLowerCase().includes(this.textValue.toLowerCase())
        );
        if (this.dataFilter.length == 0) {
          // nếu không tìm thấy thì hiểu thị lỗi
          this.isShowList = false;
          this.isFindData = false;
        } else {
          this.isShowList = true;
          this.isFindData = true;
        }
      }
    },
  },
};
</script>
<style>
.text--filter-found {
  font-size: 15px;
  color: red;
  opacity: 0.7;
}
</style>
