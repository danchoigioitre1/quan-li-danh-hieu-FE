<template>
  <div class="importModalContainer">
    <div class="import-modal--content">
      <div class="import-modal--header">
        <h2>{{ this.$EmulationResources["VN"].Import }}</h2>
        <button @click="CloseImportModal">
          <i class="bx bx-x import--icon"></i>
        </button>
      </div>

      <div class="import-modal--process">
        <div class="first_process">
          <div
            class="icon-container"
            :style="process == 1 ? 'border-color:red' : 'border-color:blue'"
          >
            <div
              class="icon"
              :style="
                process == 1 ? 'background-color:red' : 'background-color:blue'
              "
            ></div>
          </div>
          <div>
            <span :style="process == 1 ? 'color:red' : 'color:blue'">{{
              this.$EmulationResources["VN"].ChooseFileImport
            }}</span>
          </div>
        </div>

        <div
          class="process--line"
          :style="process == 1 ? 'border-color:red' : 'border-color:blue'"
        ></div>

        <div class="second_process">
          <div
            class="icon-container"
            :style="process == 1 ? 'border-color:grey' : 'border-color:red'"
          >
            <div
              class="icon"
              :style="
                process == 1 ? 'background-color:grey' : 'background-color:red'
              "
            ></div>
          </div>
          <div>
            <span :style="process == 1 ? 'color:grey' : 'color:red'">{{
              this.$EmulationResources["VN"].Import
            }}</span>
          </div>
        </div>
      </div>

      <!--  Hiển thị khi process = 1 -->
      <div class="import-modal--file" v-if="process == 1">
        <div v-if="isShowSelectedFile" class="selected-file">
          <i class="bx bx-file-blank"></i>
          <span class="import-file--name">{{ importFile.name }}</span>
          <span class="import-file--size">{{ fileSizeInMB }}KB</span>
          <div class="valid--div">
            <div class="icon-contain" v-if="isValidSize && isValidType">
              <i class="bx bx-check"></i>
            </div>
            <span v-if="isValidSize && isValidType">Hợp lệ</span>

            <div
              class="icon-contain"
              v-if="!isValidSize || !isValidType"
              style="background-color: red"
            >
              <i class="bx bx-x"></i>
            </div>
            <span v-if="!isValidSize || !isValidType">Không hợp lệ</span>
          </div>
          <button class="change-file_button">
            <span>Đổi tệp khác</span>
          </button>
        </div>

        <input
          type="file"
          @change="onFileSelected"
          id="file-input"
          class="import--input"
        />
        <div class="support--text">
          <i class="bx bxs-file-import"></i>
          <span>{{ this.$EmulationResources["VN"].ChooseFile }}</span>
          <span>{{ this.$EmulationResources["VN"].SupportFile }}</span>
        </div>
      </div>

      <div v-if="showSheetList && process == 1" class="div--sheet-list">
        <div class="sheet">
          <label for="sheet-import">Sheet nhập khẩu <span>*</span></label>
          <select
            id="sheet-import"
            class="sheet--name-list"
            v-model="sheetSelected"
          >
            <option v-for="item in sheetList" :key="item.Id" :value="item.Id">
              {{ item.value }}
            </option>
          </select>
        </div>

        <div class="sheet">
          <label for="header-index">Dòng tiêu đề <span>*</span></label>
          <input
            type="number"
            id="header-index"
            class="sheet-header"
            v-model="headerIndex"
          />
        </div>
      </div>

      <!--  Hiển thị khi process = 2 -->
      <div v-if="process == 2">
        <div class="div--show-valid-data">
          <div class="total-data div--data">
            <div class="title--div">
              <span>Số bản ghi</span>
            </div>
            <span class="number-data">{{ statisticEmulation.Total }}</span>
          </div>
          <div class="valid-data div--data">
            <div class="title--div">
              <span>Hợp lệ</span>
            </div>
            <span class="number-data">{{ statisticEmulation.Valid }}</span>
          </div>
          <div class="invalid-data div--data">
            <div class="title--div">
              <span>Không hợp lệ</span>
            </div>
            <span class="number-data">{{ statisticEmulation.Invalid }}</span>
          </div>
        </div>
        <div class="more-import">
          <div class="div--import-valid-data">
            <span class="import-text"
              >Có {{ statisticEmulation.Valid }} bản ghi hợp lệ, bạn có muốn
              nhập khẩu không?
            </span>
            <br />
            <button class="button--import-valid-data" @click="multipleAdd">
              Nhập khẩu bản ghi hợp lệ
            </button>
          </div>

          <div class="div--import-valid-data">
            <span class="error-text"
              >Bạn muốn xem lỗi và bản ghi không hợp lệ không?
            </span>
            <br />
            <button class="button--error-data" @click="exportErrorExcelFile">
              Xuất file lỗi
            </button>
          </div>
        </div>
      </div>

      <div class="solid-line"></div>
      <div class="import-modal_div--button">
        <button class="download-button" @click="exportTemplate">
          {{ this.$EmulationResources["VN"].DowloadEx }}
        </button>
        <div class="button-import--div">
          <button class="cancel-button button" @click="CloseImportModal">
            {{ this.$EmulationResources["VN"].Cancel }}
          </button>
          <button
            v-if="process == 2"
            class="cancel-button button"
            @click="returnProcess"
          >
            {{ this.$EmulationResources["VN"].Return }}
          </button>
          <button
            class="button continue-button"
            @click="checkData"
            :disabled="!isCanNextStep"
            :style="!isCanNextStep ? 'cursor:not-allowed' : 'cursor:pointer'"
          >
            {{ this.$EmulationResources["VN"].Continue }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  checkFileType,
  checkFileSize,
  getSheetList,
  checkHeaderList,
  statisticalEmulation,
  exportExcelFile,
  exportErrorExcel,
  getValidData,
  multipleAddEmulation,
} from "@/js/service/api";
import "vue3-toastify/dist/index.css";
import { toast } from "vue3-toastify";
export default {
  name: "ImportModal",
  components: {},
  data() {
    return {
      process: 1,
      importFile: {},
      isShowSelectedFile: false,
      allowedExtensions: ["xls", "xlsx"],
      isValidType: true,
      isValidSize: true,
      fileSizeInMB: 0,
      isCanNextStep: false,
      sheetList: [],
      showSheetList: false,
      sheetSelected: {},
      headerIndex: 4,
      statisticEmulation: {},
      validDatalist: [],
    };
  },
  methods: {
    multipleAdd() {
      multipleAddEmulation(this.validDatalist)
        .then((res) => {
          toast.success("Nhập khẩu dữ liệu thành công !", {
            autoClose: 2000,
            position: "top-center",
          });
          console.log(res.data);
        })
        .catch((e) => console.log(e));
      this.CloseImportModal();
    },
    getValidDataList() {
      getValidData(
        this.importFile,
        "EmulationImport",
        this.headerIndex,
        this.sheetSelected
      )
        .then((res) => (this.validDatalist = res.data))
        .catch((e) => console.log(e));
    },
    exportErrorExcelFile() {
      exportErrorExcel(this.importFile, "EmulationImport", this.headerIndex);
    },
    returnProcess() {
      this.process = 1;
    },
    exportTemplate() {
      exportExcelFile(
        "TEMPLATE DANHHIEUTHIDUA",
        "Bảng danh hiệu thi đua",
        [],
        "EmulationExport"
      );
    },
    CloseImportModal() {
      this.$emitter.emit("CloseImportModal");
    },
    statistical() {
      statisticalEmulation(
        this.importFile,
        "EmulationImport",
        this.headerIndex,
        this.sheetSelected
      )
        .then((res) => (this.statisticEmulation = res.data))
        .catch((e) => console.log(e));
    },

    checkData() {
      // chưa check thanh công header
      checkHeaderList(
        this.importFile,
        "EmulationImport",
        this.headerIndex,
        this.sheetSelected
      )
        .then((res) => console.log("valid header: ", res.data))
        .catch((e) => console.log(e));

      this.process = 2;
      this.statistical();
      this.getValidDataList();
    },
    onFileSelected(event) {
      const selectedFile = event.target.files[0];

      this.importFile = selectedFile;
      this.isShowSelectedFile = true;
    },
    // Hàm check kiểu của file
    checkValidFileType(file) {
      checkFileType(file)
        .then((res) => {
          this.isValidType = res.data;
          console.log("type: ", res.data);
        })
        .catch((e) => console.log(e));
    },

    // Hàm check kích thước của file
    checkValidFileSize(file) {
      checkFileSize(file)
        .then((res) => {
          this.isValidSize = res.data;
          console.log("size: ", res.data);
        })
        .catch((e) => console.log(e));
    },

    // Hàm Hiển thị kích thước file
    showFileSizeInKB(file) {
      const fileSizeInBytes = file.size;
      const fileSizeInMB = fileSizeInBytes / 1024;
      return fileSizeInMB.toFixed(2);
    },

    // Hàm lấy danh sách sheet trong file đc upload
    getSheetsList(file) {
      getSheetList(file)
        .then((res) => {
          if (this.isValidType && this.isValidSize) {
            this.sheetList = res.data.map((item, index) => {
              return { value: item, Id: index };
            });
            console.log(this.sheetList);
          }
        })
        .catch((e) => console.log(e));
    }
  },
  watch: {
    isValidSize: function () {
      // Disable nut tiếp tục
      this.isCanNextStep = this.isValidType && this.isValidSize;
    },
    isValidType: function () {
      // Disable nut tiếp tục
      this.isCanNextStep = this.isValidType && this.isValidSize;
    },

    importFile: function () {
      // Check định dạng file
      this.checkValidFileType(this.importFile);

      // Check kích thước file
      this.checkValidFileSize(this.importFile);

      // Hiển thị kích thước file
      this.fileSizeInMB = this.showFileSizeInKB(this.importFile);

      // Lấy danh sách sheet
      this.getSheetsList(this.importFile);

      // Disable nut tiếp tục
      this.isCanNextStep = this.isValidType && this.isValidSize;
      // if (this.isValidType && this.isValidSize) {
      //   this.sheetSelected = 0;
      // } else {
      //   this.sheetList = [];
      //   this.sheetSelected = null;
      // }

      this.showSheetList = true;
      this.sheetSelected = 0;
    },
  },
};
</script>
<style></style>
