<template>
  <VLoading v-if="isLoading" />
  <div class="container-table">
    <table id="root">
      <tr class="table-header">
        <th class="table__input--checkbox">
          <input type="checkbox" v-model="isSelectAll" value="true" />
        </th>
        <th class="first-header">
          {{ this.$EmulationResources["VN"].NameEmulation }}
        </th>
        <th class="second-header">
          {{ this.$EmulationResources["VN"].CodeEmulation }}
        </th>
        <th class="third-header">
          {{ this.$EmulationResources["VN"].ObjectEmulation }}
        </th>
        <th class="fourth-header">
          {{ this.$EmulationResources["VN"].LevelEmulation }}
        </th>
        <th class="fifth-header">{{ this.$EmulationResources["VN"].Type }}</th>
        <th>
          {{ this.$EmulationResources["VN"].Status }}
        </th>
      </tr>

      <tr
        @mouseleave="onLeave"
        @mouseover="onHover(user.EmulationId)"
        v-for="user in dataRender"
        :key="user.EmulationId"
        :style="isActiveRow === user.Id ? 'background:#e0ebff;' : ''"
        :title="user.EmulationName"
        @click="changeActiveRow(user.EmulationId)"
      >
        <td class="table__input--checkbox">
          <input
            type="checkbox"
            :value="user.EmulationId"
            v-model="deleteEmulation"
          />
        </td>
        <td
          @dblclick="rowOnDbClick(user, editMode.Edit)"
          class="table__content--name"
        >
          {{ user.EmulationName }}
        </td>
        <td @dblclick="rowOnDbClick(user, editMode.Edit)">
          {{ user.EmulationCode }}
        </td>
        <td @dblclick="rowOnDbClick(user, editMode.Edit)">
          {{ renderObject(user.EmulationTarget) }}
        </td>
        <td @dblclick="rowOnDbClick(user, editMode.Edit)">
          {{ renderLevel(user.EmulationLevel) }}
        </td>
        <td @dblclick="rowOnDbClick(user, editMode.Edit)">
          {{ renderType(user.EmulationType) }}
        </td>
        <td
          class="table__data--status"
          @dblclick="rowOnDbClick(user, editMode.Edit)"
        >
          <div v-if="user.EmulationStatus === 1" class="status-success"></div>
          <div v-else class="status-fail"></div>
          <div class="content-status">
            {{
              user.EmulationStatus === $EmulationEnum["Status"].Enable
                ? `${this.$EmulationResources["VN"].Use}`
                : `${this.$EmulationResources["VN"].NotUse}`
            }}
          </div>

          <div style="position: relative">
            <div v-if="user.EmulationId == hoverRow" class="hover-div">
              <button class="button" @click="rowOnDbClick(user, editMode.Edit)">
                <i class="bx bx-pencil"></i>
              </button>
              <button class="button" @click="showMore(user.EmulationId)">
                <i class="bx bx-dots-horizontal-rounded"></i>
              </button>
              <div class="more-update" v-if="isShowMore">
                <button
                  @click="
                    ChangeUserStatus(this.$EmulationEnum['Status'].Enable, user)
                  "
                  :disabled="
                    user.EmulationStatus == this.$EmulationEnum['Status'].Enable
                  "
                >
                  {{ this.$EmulationResources["VN"].Use }}
                </button>
                <button
                  @click="
                    ChangeUserStatus(
                      this.$EmulationEnum['Status'].Disable,
                      user
                    )
                  "
                  :disabled="
                    user.EmulationStatus ==
                    this.$EmulationEnum['Status'].Disable
                  "
                >
                  {{ this.$EmulationResources["VN"].NotUse }}
                </button>
                <button style="color: red" @click="deleteUser(user)">
                  {{ this.$EmulationResources["VN"].Delete }}
                </button>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </table>
    <h2 v-if="dataRender.length == 0" class="text--not-found">
      {{ this.$EmulationResources["VN"].NotDataFount }}
    </h2>
  </div>
</template>
<script>
import { handleError } from "@/js/service/handle-error";
import {
  multipleDelete,
  getData,
  getTotal,
  multipleChange,
  exportExcelFile,
} from "@/js/service/api";
import ExcelJS from "exceljs";
import { toast } from "vue3-toastify";
import { saveAs } from "file-saver";
import VLoading from "../../../components/VLoading.vue";
export default {
  name: "TitleTable",
  components: { VLoading },
  created() {
    // Render dữ liệu lần đầu tiên
    this.renderData("", "", 0, 0, 0, 0);

    // Nhận emit khi ấn nút bỏ lọc
    this.$emitter.on("clearFilter", () => {
      this.filterData = { Target: 0, Level: 0, Type: 0, Status: 0 };
      // Render lại data
      this.renderData("", "", 0, 0, 0, 0);
      // Xóa filter ở localStorage
      localStorage.removeItem("filter");
    });

    // Nhận emit để tải lại bảng
    this.$emitter.on("reloadTable", () => {
      this.reloadTable();
    });

    /**
     * Nhận dữ liệu từ ngoài vào và gán filter
     */
    this.$emitter.on("filterData", (filterData) => {
      this.filterData = {
        Target: filterData.Object,
        Level: filterData.Level,
        Type: filterData.Type,
        Status: filterData.Status,
      };
    });

    this.$emitter.on("onFilterEmulation", (value) => {
      this.findInputData = value;
    });

    /**
     * xóa các mục đã chọn
     */
    this.$emitter.on("deleteSelectedList", (emptyList) => {
      this.deleteEmulation = emptyList;
    });

    /**
     * chỉnh sửa trạng thái thành sử dụng cho các item đã check
     */
    this.$emitter.on("changeStatusData", (listId, status) => {
      this.multipleChangeStatus(status, listId);
      this.deleteEmulation = [];
    });

    /**
     * Xóa các bản ghi đã chọn
     */
    this.$emitter.on("deleteDataSelected", (dataSelected) => {
      toast.success(`Đã xóa ${dataSelected.length} bản ghi`, {
        autoClose: 2000,
        position: "top-center",
      });
      this.multipleDeleteEmulation(dataSelected);
      this.deleteEmulation = [];
      this.isSelectAll = false;
    });

    /**
     * Bỏ chọn checkbox trên table header khi đã xóa hết dữ liệu
     */
    this.$emitter.on("resetCheckAll", (truly) => {
      this.isSelectAll = truly;
    });

    /**
     * Pagination
     */
    this.$emitter.on("goToNextPage", () => {
      if (this.pagination.CurrentPage < this.pagination.TotalPage) {
        this.pagination.CurrentPage++;
        this.reloadTable();
        this.$emitter.emit(
          "isCanGotoNextPage",
          this.pagination.CurrentPage < this.pagination.TotalPage
        );
        this.$emitter.emit("isCanGotoPrevPage", true);
      }
    });
    this.$emitter.on("goToPrevPage", () => {
      if (this.pagination.CurrentPage > 1) {
        this.pagination.CurrentPage--;
        this.$emitter.emit("isCanGotoNextPage", true);
        if (this.pagination.CurrentPage == 1) {
          this.$emitter.emit("isCanGotoPrevPage", false);
        }
        this.reloadTable();
      }
    });

    this.$emitter.on("changeItemPerPage", (ItemPerPage) => {
      this.pagination.ItemPerPage = ItemPerPage;
      this.pagination.CurrentPage = 1;
      this.pagination.TotalPage = Math.ceil(
        this.totalDataFound / this.pagination.ItemPerPage
      );
      this.reloadTable();
      this.setOrderData(1, ItemPerPage);
    });

    this.$emitter.on("deleteData", (user) => {
      this.multipleDeleteEmulation([`${user.EmulationId}`]);
    });

    /**
     * Xuat ra file excel
     */
    this.$emitter.on("exportExcel", () => {
      exportExcelFile(
        "BANGDANHHIEU",
        "Bảng danh hiệu thi đua",
        this.dataRender,
        "EmulationExport"
      );

      // const header = [
      //   "STT",
      //   "Tên danh hiệu",
      //   "Mã danh hiệu",
      //   "Đối tượng khen thưởng",
      //   "Cấp khen thưởng",
      //   "Loại khen thưởng",
      //   "Trạng thái",
      // ];
      // this.reportExcel(
      //   "BANGDANHHIEU",
      //   "Bảng danh hiệu",
      //   "Danh sách danh hiệu",
      //   header,
      //   [
      //     { width: 10 },
      //     { width: 25 },
      //     { width: 25 },
      //     { width: 25 },
      //     { width: 25 },
      //     { width: 25 },
      //     { width: 25 },
      //   ]
      // );
    });
  },
  beforeUnmount() {
    this.$emitter.off("filterData");
    this.$emitter.off("onFilterEmulation");
    this.$emitter.off("deleteSelectedList");
    this.$emitter.off("changeStatusData");
    this.$emitter.off("deleteDataSelected");
    this.$emitter.off("resetCheckAll");
    this.$emitter.off("saveAndAddEmulation");
    this.$emitter.off("saveChangData");
    this.$emitter.off("goToNextPage");
    this.$emitter.off("goToPrevPage");
    this.$emitter.off("deleteData");
    this.$emitter.off("reloadTable");
    this.$emitter.off("clearFilter");
  },
  watch: {
    /**
     * Gửi lại data để footer lấy tổng số bản ghi
     */
    dataRender: function () {
      if (this.dataRender.length > 0) {
        this.setOrderData(
          (this.pagination.CurrentPage - 1) * this.pagination.ItemPerPage + 1,
          (this.pagination.CurrentPage - 1) * this.pagination.ItemPerPage +
            this.dataRender.length
        );
      } else {
        this.setOrderData(0, 0);
      }

      if (this.dataRender.length < this.pagination.ItemPerPage) {
        this.$emitter.emit("isCanGotoNextPage", false);
      }
    },
    totalDataFound: function () {
      this.$emitter.emit("TotalData", this.totalDataFound);
    },

    /**
     * theo dõi biến chọn tất cả: nếu hủy chọn tất cả thì đưa anh sách đã chọn thánh trống
     */
    isSelectAll: function () {
      if (this.isSelectAll) {
        this.deleteEmulation = this.dataRender.map((item) => item.EmulationId);
      } else {
        this.deleteEmulation = [];
      }
    },
    deleteEmulation: function () {
      this.$emitter.emit("deleteEmulation", this.deleteEmulation);
    },

    /**
     * lọc danh sách khi thay đổi input
     */
    findInputData: function () {
      this.reloadTable();
    },

    /**
     * lọc danh sách theo các mục đã chọn của modal filter
     */
    filterData: function () {
      this.reloadTable();
    },
  },
  methods: {
    /**
     * Show Toast Error khi gặp lỗi
     */
    showToastError(error) {
      var response = handleError(error);
      toast[response.type](response.message, {
        autoClose: 2000,
        position: "top-center",
      });
    },

    // Hàm xuất ra file excel
    async reportExcel(fileName, sheetName, report, headerList, widths) {
      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet(sheetName);
      const columns = headerList.length;
      const title = {
        name: "title",
        border: true,
        height: 30,
        font: { size: 20, bold: false, color: { argb: "000000" } },
        alignment: {
          vertical: "middle", // Căn giữa theo chiều dọc
          horizontal: "center", // Căn giữa theo chiều ngang
        },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: "FFFFFF",
          },
        },
      };

      const header = {
        name: "header",
        border: true,
        height: 30,
        font: { size: 14, bold: false, color: { argb: "000000" } },
        alignment: { horizontal: "center", vertical: "middle" },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: "e5e8ec",
          },
        },
      };

      const data = {
        name: "data",
        border: true,
        height: 0,
        font: { size: 12, bold: false, color: { argb: "000000" } },
        alignment: null,
        fill: null,
      };

      if (widths && widths.length > 0) {
        ws.columns = widths;
      }

      let row = this.addRow(ws, [report], title);
      this.mergeCells(ws, row, 1, columns);

      let emptyRow = this.addRow(ws, [], "");
      this.mergeCells(ws, emptyRow, 1, columns);

      this.addRow(ws, headerList, header);

      const convertData = this.dataRender.map((item, index) => {
        return {
          index: index + 1,
          name: item.EmulationName,
          code: item.EmulationCode,
          target: this.renderObject(item.EmulationTarget),
          level: this.renderLevel(item.EmulationLevel),
          type: this.renderType(item.EmulationType),
          status: item.EmulationStatus === 1 ? "Sử dụng" : "Ngừng sử dụng",
        };
      });
      convertData.forEach((row) => {
        this.addRow(ws, Object.values(row), data);
      });
      const buf = await wb.xlsx.writeBuffer();
      saveAs(new Blob([buf]), `${fileName}.xlsx`);
    },

    // Hàm để thêm dòng trong file excel
    addRow(ws, data, section) {
      const borderStyles = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };

      const row = ws.addRow(data);
      row.eachCell({ includeEmpty: true }, (cell) => {
        if (section?.border) {
          cell.border = borderStyles;
        }
        if (section?.font) {
          cell.font = section.font;
        }
        if (section?.fill) {
          cell.fill = section.fill;
        }
        if (typeof cell.value == "number") {
          cell.alignment = {
            vertical: "middle", // Căn giữa theo chiều dọc
            horizontal: "center", // Căn giữa theo chiều ngang
          };
        }
        if (section?.alignment) {
          cell.alignment = section.alignment;
        }
      });
      if (section?.height > 0) {
        row.height = section.height;
      }

      return row;
    },

    // Hàm gộp cột trong file excel
    mergeCells(ws, row, from, to) {
      ws.mergeCells(
        `${row.getCell(from)._address}:${row.getCell(to)._address}:`
      );
    },

    // hàm để tải lại bảng
    reloadTable() {
      this.renderData(
        this.findInputData,
        this.findInputData,
        this.filterData.Level,
        this.filterData.Type,
        this.filterData.Target,
        this.filterData.Status
      );
    },

    renderData(
      searchName,
      searchCode,
      EmulationLevel,
      EmulationType,
      EmulationTarget,
      EmulationStatus
    ) {
      // Gọi Api trả về danh sách các bản ghi được tìm thấy và phân trang
      getData(
        this.pagination.ItemPerPage,
        this.pagination.CurrentPage,
        searchCode,
        searchName,
        EmulationLevel,
        EmulationStatus,
        EmulationTarget,
        EmulationType
      )
        .then((response) => {
          this.dataRender = response.data;
          this.isLoading = false;
        })
        .catch(function (err) {
          this.showToastError(err);
        });

      // Gọi api để lấy về tổng số bản ghi
      getTotal(
        searchCode,
        searchName,
        EmulationLevel,
        EmulationStatus,
        EmulationTarget,
        EmulationType
      )
        .then((response) => {
          this.totalDataFound = response.data;
          this.pagination.TotalPage = Math.ceil(
            this.totalDataFound / this.pagination.ItemPerPage
          );
          console.log(response.data);
        })
        .catch(function (err) {
          this.showToastError(err);
        });
    },

    // Gửi emit vị trí hiện tại cảu trang
    setOrderData(from, to) {
      this.$emitter.emit("setPage", from, to);
    },

    // Gọi api thay đổi trạng tại nhiều bản ghi
    multipleChangeStatus(status, listId) {
      multipleChange(status, listId)
        .then((response) => {
          console.log(response);
          this.reloadTable();
        })
        .catch((err) => {
          this.showToastError(err);
        });
    },

    // Gọi api xóa nhiều bản ghi
    multipleDeleteEmulation(listId) {
      multipleDelete(listId)
        .then((response) => {
          console.log(response);
          this.reloadTable();
        })
        .catch((err) => {
          this.showToastError(err);
        });
    },

    // Gửi emit để Xác nhận xóa
    deleteUser(user) {
      this.$emitter.emit("deleteUser", user);
    },

    // Thay đổi trạng thái 1 bản ghi
    ChangeUserStatus(status, user) {
      this.multipleChangeStatus(status, [`${user.EmulationId}`]);
      this.isShowMore = false;
    },

    // Hiển thị mở rộng
    showMore(id) {
      console.log(id);
      this.isShowMore = !this.isShowMore;
    },

    // Đóng mở rộng khi rời chuột đi
    onLeave() {
      this.hoverRow = -1;
      this.isShowMore = false;
    },

    // Hiển thị nút khi hover
    onHover(id) {
      this.hoverRow = id;
    },

    /**
     * Kiểm tra dữ liệu trong biến this.filterData xem có trùng data hay ko
     */
    checkFilter(object, field) {
      if (this.filterData[field] == 0) {
        return true;
      } else {
        return object[field] == this.filterData[field];
      }
    },

    /**
     * Gán cho biến isActiveRow để xác định dòng nào vừa đc click để đổi màu bg
     */
    changeActiveRow(id) {
      this.isActiveRow = id;
    },

    /**
     *Gửi đi obj muốn sửa và mode:Edit
     */
    rowOnDbClick(emulation, editMode) {
      // const emulationSelected = this.getEmulationById(emulation.EmulationId);
      this.$emitter.emit("onSelectRow", emulation.EmulationId, editMode);
    },

    /**
     * render ra đối tượng khen thưởng dựa vào id của đổi tượng
     */
    renderObject(id) {
      switch (Number(id)) {
        case 1:
          return "Gia đình";
        case 2:
          return "Tập thể";
        case 3:
          return "Cá nhân";
        case 4:
          return "Cá nhân và tập thể";
      }
    },

    /**
     * render ra cấp khen thưởng dựa vào id của đổi tượng
     */
    renderLevel(id) {
      switch (Number(id)) {
        case 1:
          return "Cấp nhà nước";
        case 2:
          return "Cấp tỉnh/Tương đương";
        case 3:
          return "Cấp huyện/Tương đương";
        case 4:
          return "Cấp xã/Tương đương";
      }
    },

    /**
     * render ra loại khen thưởng dựa vào id của đổi tượng
     */
    renderType(id) {
      switch (Number(id)) {
        case 0:
          return "Thường xuyên/ theo đợt";
        case 1:
          return "Thường xuyên";
        case 2:
          return "Theo đợt";
      }
    },
  },

  data() {
    return {
      totalDataFound: 0,
      isShowMore: false,
      hoverRow: -1,
      editMode: {
        Add: 0,
        Edit: 1,
      },
      isSelectAll: false,
      findInputData: "",
      deleteEmulation: [],
      isActiveRow: 0,
      isLoading: true,
      filterData: { Target: "0", Level: "0", Type: "0", Status: "0" },
      dataRender: [],
      pagination: {
        CurrentPage: 1,
        ItemPerPage: 50,
        TotalPage: 0,
      },
    };
  },
};
</script>
<style>
@import url("../../../css/main.css");
td {
  padding-left: 15px;
}
.table__status2 {
  padding-right: 30px;
}
.text--not-found {
  opacity: 0.5;
  font-size: 14px;
  font-weight: 500;
  margin: 15px;
}
</style>
