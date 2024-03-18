<template>
  <div
    v-click-outside="handleCloseModalFilter"
    id="modal-filter"
    class="modal-filter"
  >
    <i class="bx bxs-up-arrow"></i>
    <div class="header">
      <h3 class="filter--title">
        {{ this.$EmulationResources["VN"].FilterEmulation }}
      </h3>
      <button @click="handleCloseModalFilter" class="header__button--close">
        <i class="bx bx-x"></i>
      </button>
    </div>

    <div class="modal-filter__content">
      <label for="object">{{
        this.$EmulationResources["VN"].ObjectEmulation
      }}</label>
      <ComboBox
        :dataList="objectList"
        field="Object"
        :filter="filterObject"
        @value="setValue"
        fieldText="Đối tượng khen thưởng"
      ></ComboBox>
    </div>
    <div class="modal-filter__content">
      <label for="level">{{
        this.$EmulationResources["VN"].LevelEmulation
      }}</label>
      <ComboBox
        :dataList="levelList"
        field="Level"
        @value="setValue"
        fieldText="Cấp khen thưởng"
      ></ComboBox>
    </div>
    <div class="modal-filter__content">
      <label for="type">{{ this.$EmulationResources["VN"].Type }}</label>

      <ComboBox
        :dataList="typeList"
        field="Type"
        @value="setValue"
        fieldText="Loại phong trào"
      ></ComboBox>
    </div>
    <div class="modal-filter__content">
      <label for="status">{{ this.$EmulationResources["VN"].Status }}</label>

      <ComboBox
        :dataList="statusList"
        field="Status"
        @value="setValue"
        :fieldText="this.$EmulationResources.VN.Status"
      ></ComboBox>
    </div>
    <div class="modal-button-div">
      <button @click="handleCloseModalFilter" class="modal__button--cancel">
        {{ this.$EmulationResources["VN"].Cancel }}
      </button>
      <button class="modal__button--apply" @click="onFilterData">
        {{ this.$EmulationResources["VN"].Apply }}
      </button>
    </div>
  </div>
</template>
<script>
import ComboBox from "@/components/VCombobox.vue";
export default {
  name: "FilterModal",
  components: { ComboBox },
  created() {
    this.filterObject = JSON.parse(localStorage.getItem("filter")) ?? {
      Object: 0,
      Level: 0,
      Type: 0,
      Status: 0,
    };
  },
  data() {
    return {
      objectList: [
        { value: "Tất cả", Id: 0 },
        { value: "Gia đình", Id: 1 },
        { value: "Tập thể", Id: 2 },
        { value: "Cá nhân", Id: 3 },
        { value: "Cá nhân và tập thể", Id: 4 },
      ],
      levelList: [
        { Id: 0, value: "Tất cả" },
        { Id: 1, value: "Cấp nhà nước" },
        { Id: 2, value: "Cấp tỉnh" },
        { Id: 3, value: "Cấp huyện" },
        { Id: 4, value: "Cấp xã" },
      ],
      typeList: [
        { Id: 0, value: "Tất cả" },
        { Id: 1, value: "Thường xuyên" },
        { Id: 2, value: "Theo đợt" },
      ],
      statusList: [
        { Id: 0, value: "Tất cả" },
        { Id: 1, value: "Sử dụng" },
        { Id: 2, value: "Ngừng sử dụng" },
      ],
      filterObject: {
        Object: 0,
        Level: 0,
        Type: 0,
        Status: 0,
      },
    };
  },
  emits: ["onclose"],
  methods: {
    setValue(id, field) {
      this.filterObject[field] = id;
    },
    handleCloseModalFilter() {
      this.$emitter.emit("onclose");
    },
    onFilterData() {
      this.handleCloseModalFilter();
      this.$emitter.emit("filterData", this.filterObject);
      localStorage.setItem("filter", JSON.stringify(this.filterObject));
      this.$emitter.emit("showClearFilterButton");
    },
  },
};
</script>
<style>
@import url("../../../css/main.css");
</style>
