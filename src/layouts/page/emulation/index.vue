<template>
  <!--Header-->
  <div class="main__container">
    <!--modal confirm trc khi xoa-->
    <ConfirmModal
      v-if="showConfirmDeleteModal"
      :deleteList="deleteData"
    ></ConfirmModal>

    <DeleteModal
      v-if="showModalDeleteUser"
      :deleteUser="deleteUser"
    ></DeleteModal>

    <CancelModal
      :changedUser="changedUser"
      v-if="showCancelModal"
    ></CancelModal>

    <div class="header--title">
      {{ this.$EmulationResources["VN"].EmulationTitle }}
    </div>
    <div class="sub-header">
      <div class="sub-header__filter">
        <i class="bx bx-search-alt"></i>
        <input
          @input="onFilterEmulation($event)"
          v-model.lazy="findEmulation"
          class="sub-header__filter--input"
          type="text"
          :placeholder="inputPlaceholder"
        />
        <button
          @click="handleChangeModalFilter"
          class="sub-header__filter--button"
        >
          <div v-if="isShowClearFilterButton" class="effect-filter"></div>
          <i class="bx bx-filter-alt"></i>
          <span>{{ this.$EmulationResources["VN"].Filter }}</span>
        </button>
        <button
          v-if="isShowClearFilterButton"
          class="button--clear-filter"
          @click="clearFilter"
        >
          Bỏ lọc
        </button>
      </div>

      <!--modal filter-->
      <FilterModal v-if="showFilterModal"></FilterModal>

      <!--Modal add emulation-->
      <div class="sub-header__button">
        <button
          v-if="mode === 1"
          class="sub-header__button--add"
          @click="openModalAddTitle"
        >
          <i class="bx bx-plus"></i>
          <span>{{ this.$EmulationResources["VN"].AddEmulation }}</span>
        </button>
        <button
          v-if="mode === 1"
          class="sub-header__button--excel"
          @click="openExtend"
        >
          <i class="bx bx-dots-horizontal-rounded"></i>
        </button>

        <div
          class="extend--div"
          v-if="isOpenExtend"
          v-click-outside="closeExtend"
        >
          <button @click="openImportModal" class="import">
            <span>Nhập khẩu</span>
          </button>
          <button @click="exportExcel" class="export">
            <span>Xuất khẩu</span>
          </button>
        </div>

        <AddTitleModal
          @keydown.esc="handleEscKeyPress"
          :emulationSelected="selectedEmulation"
          :editMode="modalMode"
          :showAddModal="onCloseAddModal"
          v-if="showAddModal"
        ></AddTitleModal>

        <div class="container__delete--mode" v-else-if="mode == 2">
          <span class="sub-text"
            >{{ this.$EmulationResources["VN"].Selected }}
            <strong>{{
              deleteData.length < 10
                ? `0${deleteData.length}`
                : deleteData.length
            }}</strong>
          </span>
          <button @click="deleteSelectList" class="button--delete-select">
            {{ this.$EmulationResources["VN"].Uncheck }}
          </button>
          <button @click="onChangeStatusUse" class="button button--change-use">
            {{ this.$EmulationResources["VN"].Use }}
          </button>
          <button
            @click="onChangeStatusNotUse"
            class="button button--change-not-use"
          >
            {{ this.$EmulationResources["VN"].NotUse }}
          </button>
          <button @click="onDeleteData" class="button button--delete">
            {{ this.$EmulationResources["VN"].Delete }}
          </button>
        </div>
      </div>
    </div>
    <div class="main-content-table">
      <!--Content-->
      <TitleTable />

      <!--Footer-->
      <FooterTable :dataLength="total" />
      <ImportModal v-if="isOpenImportModal"></ImportModal>
    </div>
  </div>
</template>
<script>
import FilterModal from "../../../views/page/emulation/FilterModal.vue";
import FooterTable from "../../../views/page/emulation/FooterTable.vue";
import TitleTable from "../../../views/page/emulation/TitleTable.vue";
import AddTitleModal from "../../../views/page/emulation/AddModal.vue";
import ConfirmModal from "@/components/modal/VConfirm.vue";
import DeleteModal from "@/components/modal/VDeleteModal.vue";
import CancelModal from "@/components/modal/VCancelModal";
import ImportModal from "@/components/modal/VImportModal.vue";
export default {
  name: "EmployeeHome",
  created() {
    document.title = "MISA";
    /**
     * Nhận emit đóng import form
     * CreatedBy: NVA - MF1618
     */
    this.$emitter.on("CloseImportModal", () => {
      this.isOpenImportModal = false;
    });
    /**
     * Nhận emit hiển thị nut bỏ lọc
     * CreatedBy: NVA - MF1618
     */
    this.$emitter.on("showClearFilterButton", () => {
      this.isShowClearFilterButton = true;
    });

    /**
     * Nhận emit đóng form sửa và modal xác nhận
     * CreatedBy: NVA - MF1618
     */
    this.$emitter.on("closeAllModal", () => {
      this.showAddModal = false;
      this.showCancelModal = false;
    });

    /**
     * Nhận emit đóng form xác nhận
     * CreatedBy: NVA - MF1618
     */
    this.$emitter.on("closeCancelModal", () => {
      this.showCancelModal = false;
    });

    /**
     * Nhận emit mở form xác nhận và truyền giá trị mới cho form
     * CreatedBy: NVA - MF1618
     */
    this.$emitter.on("showCancelModal", (changedUser) => {
      this.showCancelModal = true;
      this.changedUser = changedUser;
    });

    /**
     * Nhận emit đóng modal xóa
     * CreatedBy: NVA - MF1618
     */
    this.$emitter.on("deleteData", () => {
      this.showModalDeleteUser = false;
    });

    this.$emitter.on("closeModal", () => {
      this.showModalDeleteUser = false;
    });

    /**
     * Nhận emit từ ngoài vào và gán giá trị deleteUser để truyền qua props cho modal
     */
    this.$emitter.on("deleteUser", (user) => {
      this.deleteUser = user;
      this.showModalDeleteUser = true;
    });

    // đóng modal confirm
    this.$emitter.on("closeConfirmModal", () => {
      this.showConfirmDeleteModal = false;
    });

    this.$emitter.on("deleteDataSelected", () => {
      this.showConfirmDeleteModal = false;
    });

    // đóng form Thêm/Sửa bản ghi
    this.$emitter.on("onSaveChangeData", () => {
      this.showAddModal = false;
    });

    this.$emitter.on("closeAndAddEmulation", () => {
      this.showAddModal = false;
    });

    // Gửi dữ liệu cho footer
    this.$emitter.on("TotalData", (totalData) => {
      this.total = totalData;
    });

    // Nhận emit để đóng filter form
    this.$emitter.on("onclose", () => {
      this.showFilterModal = !this.showFilterModal;
    });

    /**
     *xác định danh sách đã check để ẩn/ hiện button div khi check trong checkbox
     */
    this.$emitter.on("deleteEmulation", (deleteEmulationList) => {
      this.mode = deleteEmulationList.length == 0 ? 1 : 2;
      this.deleteData = deleteEmulationList;
      this.changeStatusData = deleteEmulationList;
    });

    /**
     * Nhân emit và Mở form ở mode:sửa
     */
    this.$emitter.on("onSelectRow", (emulationId, mode) => {
      this.showAddModal = true;
      this.selectedEmulation = emulationId;
      this.modalMode = mode;
    });
  },
  beforeUnmount() {
    // Đóng các emit khi component unmount
    this.$emitter.off("TotalData");
    this.$emitter.off("deleteEmulation");
    this.$emitter.off("onSelectRow");
    this.$emitter.off("onclose");
    this.$emitter.off("closeAndAddEmulation");
    this.$emitter.off("addNewEmulation");
    this.$emitter.off("onSaveChangData");
    this.$emitter.off("closeConfirmModal");
    this.$emitter.off("deleteData");
    this.$emitter.off("closeModal");
    this.$emitter.off("deleteUser");
    this.$emitter.off("deleteDataSelected");
    this.$emitter.off("showClearFilterButton");
    this.$emitter.off("onSaveChangeData");
    this.$emitter.off("CloseImportModal");
    // Xóa obj filter đc lưu ở local
    localStorage.removeItem("filter");
  },
  data() {
    return {
      inputPlaceholder: this.$EmulationResources["VN"].EnterCodeOrTitle,
      isShowClearFilterButton: false,
      changedUser: {},
      showCancelModal: false,
      deleteUser: {},
      showModalDeleteUser: false,
      filter: { Object: 0, Level: 0, Type: 0, Status: 0 },
      selectedEmulation: {},
      modalMode: this.$EmulationEnum["Mode"].Add,
      status: {
        Use: this.$EmulationEnum["Status"].Enable,
        NotUse: this.$EmulationEnum["Status"].Disable,
      },
      total: 0,
      changeStatusData: [],
      deleteData: [],
      mode: 1, // mode hiển thị các nút phía bên phải filter
      showFilterModal: false,
      showAddModal: false,
      findEmulation: "",
      showConfirmDeleteModal: false,
      isOpenExtend: false,
      isOpenImportModal: false,
    };
  },
  components: {
    FooterTable,
    TitleTable,
    FilterModal,
    AddTitleModal,
    ConfirmModal,
    DeleteModal,
    CancelModal,
    ImportModal,
  },
  methods: {
    openImportModal() {
      this.isOpenImportModal = !this.isOpenImportModal;
    },
    closeExtend() {
      this.isOpenExtend = false;
    },
    openExtend() {
      this.isOpenExtend = !this.isOpenExtend;
    },
    //test
    exportExcelFile() {
      fetch("https://localhost:7158/api/v1/Emulations/export", {
        method: "POST",
      })
        .then((response) => response.blob())
        .then((blob) => {
          // Tạo một đường dẫn tới file Excel và tải xuống
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "output.xlsx";
          a.click();
          window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
          console.error("Lỗi: ", error);
        });
    },

    // Đóng form khi ấn esc
    handleEscKeyPress(event) {
      if (event.key === "Escape") {
        // Xử lý khi ấn nút Esc ở đây
        this.showAddModal = false;
      }
    },

    // Gửi emit xuất file excel
    exportExcel() {
      this.$emitter.emit("exportExcel");
    },

    // Gửi emit để bỏ lọc
    clearFilter() {
      this.$emitter.emit("clearFilter", {});
      this.isShowClearFilterButton = false;
    },

    /**
     * truyền đi event để uncheck checkbox của table header
     */
    resetCheckAll() {
      this.$emitter.emit("resetCheckAll", false);
    },

    /**
     * Mở form xác nhận xóa
     */
    onDeleteData() {
      this.showConfirmDeleteModal = true;
    },

    /**
     * Gửi emit thay đổi trạng thái của dữ liệu (sử dụng/ ko sử dụng)
     */
    onChangeStatusUse() {
      this.$emitter.emit(
        "changeStatusData",
        this.changeStatusData,
        this.status.Use
      );
      this.resetCheckAll();
    },
    onChangeStatusNotUse() {
      this.$emitter.emit(
        "changeStatusData",
        this.changeStatusData,
        this.status.NotUse
      );
      this.resetCheckAll();
    },

    /**
     * Xóa hết danh sách đã chọn
     */
    deleteSelectList() {
      this.$emitter.emit("deleteSelectedList", []);
      this.deleteData = [];
      this.resetCheckAll();
    },

    /*
     * Hàm để mở filter modal
     */
    handleChangeModalFilter() {
      this.showFilterModal = true;
    },

    /*
     * Hàm để đóng modal thêm danh hiệu
     */
    onCloseAddModal() {
      this.showAddModal = !this.showAddModal;
    },
    /*
     * Hàm để mở modal thêm danh hiệu
     */
    openModalAddTitle() {
      this.modalMode = this.$EmulationEnum["Mode"].Add;
      this.showAddModal = true;
    },

    /**
     * Gửi emit kèm dữ liệu đến table để lọc
     */
    onFilterEmulation(e) {
      // clear settimeout cũ khi nhập dữ liệu mới
      const timeoutId = window.setTimeout(() => {}, 0);
      for (let id = timeoutId; id >= 0; id -= 1) {
        window.clearTimeout(id);
      }
      // gửi đi emit
      setTimeout(() => {
        this.$emitter.emit("onFilterEmulation", e.target.value);
        console.log(e);
      }, 500);
    },
  },
};
</script>
<style>
@import url("../../../css/main.css");
.container__delete--mode {
  display: flex;
  column-gap: 8px;
  align-items: center;
}
.button {
  cursor: pointer;
  border-radius: 4px;
  height: 36px;
  padding: 8px 17px;
  background: inherit;
  font-size: 14px;
}
.button--delete-select {
  border: none;
  color: #2979ff;
}
.button--delete-select:hover {
  text-decoration: underline;
}
.button--change-use {
  border: 1px solid #2979ff;
  color: #2979ff;
  background-color: white;
}
.button--change-use:hover,
.button--change-not-use:hover {
  background-color: #cdd3d6b0;
}
.button--change-not-use {
  border: 1px solid var(--border-color);
  background-color: white;
}
.button--delete {
  border: 1px solid #ef5350;
  color: #ef5350;
  background-color: white;
}
.button--delete:hover {
  background-color: #ef535033;
}
.bx-search-alt {
  transform: scale(1.2);
  opacity: 0.5;
}
.extend--div {
  width: 200px;
  background-color: white;
  position: absolute;
  top: 165px;
  display: flex;
  flex-direction: column;
  z-index: 10;
  right: 10px;
  border-radius: 4px;
  justify-content: center;
  padding: 3px;
  box-shadow: 0px 0px 10px -3px rgba(0, 0, 0, 0.75);
}
.import,
.export {
  display: flex;
  align-items: center;
  padding-left: 15px;
  height: 36px;
}
.import:hover,
.export:hover {
  background: #2978ff61;
}
</style>
