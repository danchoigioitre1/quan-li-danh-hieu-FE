<template>
  <div class="combo-box">
    <div class="combo-box__input">
      <input type="text" class="input--field" v-model="textValue" />
      <button class="drop-menu-btn" @click="showData">
        <i class="bx bxs-chevron-down combo-box--icon"></i>
      </button>
    </div>
    <div v-if="isShowList" class="drop-down--data select">
      <div
        v-click-outside="onClickOutside"
        v-for="item in dataFilter"
        @click="selectData(item)"
        :key="item.Id"
        class="data--item menu-content"
        :style="isActiveRow == item.Id ? 'background:#e0ebff;' : ''"
      >
        <span>{{ item.value }}</span>
        <i v-if="isActiveRow == item.Id" class="bx bx-check"></i>
      </div>
    </div>
  </div>
</template>
<script>
import { LevelList } from "@/js/constant/emulation-const";
export default {
  name: "SelectOption",
  created() {
    /**
     * Hàm nhận emit từ ngoài để set giá trị mặc định cho select ở mode edit
     * CreatedBy: NVA - MF1618
     */
    this.$emitter.on("setDefaultValue", (EmulationLevel) => {
      this.idValue = EmulationLevel;
      this.isActiveRow = this.idValue;
      this.textValue =
        this.dropDownData[
          this.dropDownData.findIndex((item) => item.Id == this.idValue)
        ].value;
    });

    /**
     * Hàm nhận emit từ ngoài để set về giá trị mặc định
     * CreatedBy: NVA - MF1618
     */
    this.$emitter.on("resetSelect", () => {
      this.isShowList = false;
      this.textValue = LevelList[0].value;
      this.idValue = LevelList[0].Id;
      this.isActiveRow = LevelList[0].Id;
      this.firstOpen = -2;
    });
  },
  data() {
    return {
      dropDownData: LevelList,
      dataFilter: [],
      isShowList: false,
      textValue: LevelList[0].value,
      idValue: LevelList[0].Id,
      isActiveRow: LevelList[0].Id,
      firstOpen: -2,
    };
  },
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
      // set giá trị vừa chọn
      this.textValue = item.value;
      this.idValue = item.Id;
      this.isActiveRow = item.Id;
      // gửi emit kèm id của giá trị vừa chọn
      this.$emitter.emit("selectLevel", this.idValue);
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
      if (this.firstOpen >= 0) {
        this.dataFilter = this.dropDownData.filter((item) =>
          item.value.toLowerCase().includes(this.textValue.toLowerCase())
        );
        if (this.dataFilter.length == 0) {
          this.isShowList = false;
        } else {
          this.isShowList = true;
        }
      }
    },
  },
};
</script>
<style>
.select {
  width: 275px;
}
.menu-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.bx-check {
  font-size: 30px;
  color: rgba(0, 128, 0, 0.573);
}
</style>
