<template>
  <div id="modal-add-title" class="container__modal">
    <div class="add-title__modal">
      <div class="add-title__modal--header">
        <h3>
          {{
            mode == $EmulationEnum["Mode"].Edit
              ? `${this.$EmulationResources["VN"].EditEmulation}`
              : `${this.$EmulationResources["VN"].AddNewEmulation}`
          }}
        </h3>
        <div class="add-title__div--button">
          <button @click="goToDetailPage">
            <div class="tooltip--div">
              <span class="tooltip--close">{{
                this.$EmulationResources["VN"].Instruct
              }}</span>
              <i class="bx bxs-down-arrow tooltip-icon"></i>
            </div>
            <i class="bx bx-help-circle"></i>
          </button>
          <button @click="closeModalAddTitle">
            <div class="tooltip--div">
              <span class="tooltip--close">{{
                this.$EmulationResources["VN"].Close
              }}</span>
              <i class="bx bxs-down-arrow tooltip-icon"></i>
            </div>
            <span class="close-btn"><i class="bx bx-x"></i></span>
          </button>
        </div>
      </div>
      <div class="modal__form">
        <div class="modal__form--title">
          <label for="title"
            >{{ this.$EmulationResources["VN"].NameEmulation }}
            <span class="require">*</span></label
          >

          <input
            @input="autoRenderCode"
            v-model="emulation.Name"
            ref="inputEmulationName"
            id="title"
            type="text"
            placeholder="Nhập tên danh hiệu thi đua"
            require
            property-name="Name"
          />
          <span class="error">{{
            this.$EmulationResources["VN"].RequireName
          }}</span>
        </div>

        <div class="modal__form--add-code">
          <div class="modal__form--code">
            <label for="code">
              {{ this.$EmulationResources["VN"].CodeEmulation }}
              <span class="require">*</span>
            </label>
            <input
              @input="isAutoRenderCode = false"
              v-model="emulation.Code"
              style="text-transform: uppercase"
              type="text"
              id="code"
              require
              property-name="Code"
              placeholder="Nhập mã danh hiệu"
            />
            <span class="error">{{
              this.$EmulationResources["VN"].RequireCode
            }}</span>
            <span id="hasBeenCode" class="error">{{
              this.$EmulationResources["VN"].AlreadyExistCode
            }}</span>
          </div>
          <div class="code--object">
            <label for=""
              >{{ this.$EmulationResources["VN"].ObjectEmulation }}
              <span class="require">*</span></label
            >
            <div class="form--checkbox-div" id="object">
              <div class="input--checkbox">
                <input
                  type="checkbox"
                  value="3"
                  id="3"
                  class="object"
                  v-model="emulation.Object"
                />
                <label for="3">{{
                  this.$EmulationResources["VN"].Individual
                }}</label>
              </div>
              <div class="input--checkbox">
                <input
                  type="checkbox"
                  value="2"
                  id="2"
                  class="object"
                  v-model="emulation.Object"
                />
                <label for="2">{{
                  this.$EmulationResources["VN"].Collective
                }}</label>
              </div>
            </div>
            <span class="error">{{
              this.$EmulationResources["VN"].Require
            }}</span>
          </div>
        </div>

        <div class="modal__form--add-code">
          <div class="modal__form--code">
            <label for="code">
              {{ this.$EmulationResources["VN"].LevelEmulation }}
              <span class="require">*</span>
            </label>

            <SelectOption></SelectOption>

            <span class="error">
              {{ this.$EmulationResources["VN"].RequireLevel }}</span
            >
          </div>
          <div class="code--object">
            <label for="">
              {{ this.$EmulationResources["VN"].Type }}
              <span class="require">*</span>
            </label>
            <div class="form--checkbox-div" id="type">
              <div class="input--checkbox">
                <input
                  id="permanent"
                  type="checkbox"
                  value="1"
                  class="type"
                  v-model="emulation.Type"
                />
                <label for="permanent">{{
                  this.$EmulationResources["VN"].Permanent
                }}</label>
              </div>
              <div class="input--checkbox">
                <input
                  id="batches"
                  type="checkbox"
                  value="2"
                  class="type"
                  v-model="emulation.Type"
                />
                <label for="batches">{{
                  this.$EmulationResources["VN"].Batches
                }}</label>
              </div>
            </div>
            <span class="error">{{
              this.$EmulationResources["VN"].Require
            }}</span>
          </div>
        </div>
        <div class="form--text-note">
          <label for="note">{{ this.$EmulationResources["VN"].Note }}</label>
          <textarea
            id="note"
            placeholder="Nhập ghi chú"
            v-model="emulation.Note"
          ></textarea>

          <div v-if="mode == 1" class="status__div">
            <label for="">{{ this.$EmulationResources["VN"].Status }}</label>
            <div class="status__div--content">
              <input
                type="radio"
                id="use"
                value="1"
                v-model="emulation.Status"
              />
              <label for="use" class="status--label">{{
                this.$EmulationResources["VN"].Use
              }}</label>
              <input
                type="radio"
                id="not-use"
                value="2"
                v-model="emulation.Status"
              />
              <label class="status--label" for="not-use">{{
                this.$EmulationResources["VN"].NotUse
              }}</label>
            </div>
          </div>
        </div>
        <hr />
        <!--nút khi mode = add-->
        <div
          v-if="mode == this.$EmulationEnum.Mode.Add"
          class="modal__div--button"
        >
          <button class="button--save" @click="addNewEmulation">
            {{ this.$EmulationResources["VN"].Save }}
          </button>
          <button class="button--save--create" @click="saveAndAddNewEmulation">
            {{ this.$EmulationResources["VN"].SaveAdd }}
          </button>
          <button
            @keydown.tab="handleTabKeyPress"
            class="button--cancel"
            @click="closeModalAddTitle"
          >
            {{ this.$EmulationResources["VN"].Cancel }}
          </button>
        </div>
        <!--nút khi mode = edit-->
        <div
          v-if="mode == this.$EmulationEnum.Mode.Edit"
          class="modal__div--button"
        >
          <button class="button--save" @click="saveChangeData" tabindex="0">
            {{ this.$EmulationResources["VN"].SaveChange }}
          </button>
          <button
            class="button--cancel"
            tabindex="2"
            @click="cancelModalAddTitle"
          >
            {{ this.$EmulationResources["VN"].Cancel }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getDataById,
  checkCode,
  updateData,
  createData,
} from "@/js/service/api";
import { handleError } from "@/js/service/handle-error";
import SelectOption from "@/components/VSelect.vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
export default {
  name: "AddTitleModal",
  props: ["showAddModal", "emulationSelected", "editMode"],
  components: { SelectOption },
  data() {
    return {
      isAutoRenderCode: true,
      mode: 0, // Xác đinh loại form thêm hay sửa
      emulation: {
        Name: "",
        Level: 1,
        Object: [],
        Code: "",
        Type: [],
        Note: "",
      },
      isValidCode: true,
    };
  },
  created() {
    /**
     * Set up mode Add/Edit để hiển thị
     * CreatedBy: NVA - MF1618
     */
    this.mode = this.editMode;

    /**
     * Nhận emit update để cập nhật lại dữ liệu
     * CreatedBy: NVA - MF1618
     */
    this.$emitter.on("updateData", () => {
      this.apiUpdateEmulation(this.emulationSelected, this.emulation);
    });

    /**
     * Set mode: Edit => gọi api lấy thông tin bản ghi và hiển thị
     * CreatedBy: NVA - MF1618
     */
    if (this.editMode == this.$EmulationEnum["Mode"].Edit) {
      this.isAutoRenderCode = false;
      getDataById(this.emulationSelected)
        .then((response) => {
          const data = response.data;
          this.emulation = {
            Id: data.EmulationId,
            Name: data.EmulationName,
            Code: data.EmulationCode,
            Type: this.transFormType(data.EmulationType),
            Object: this.transFormTarget(data.EmulationTarget),
            Level: data.EmulationLevel,
            Status: data.EmulationStatus.toString(),
          };
          // Set giá trị level của bản ghi làm default
          this.$emitter.emit("setDefaultValue", data.EmulationLevel);
        })
        .catch((err) => {
          this.showToastError(err);
        });
    }

    /**
     * Nhận emit kèm levelId để gán cho bản ghi hiện tại
     * CreatedBy: NVA - MF1618
     */
    this.$emitter.on("selectLevel", (id) => {
      this.emulation.Level = id;
    });
  },
  beforeUnmount() {
    // Loại bỏ emit trước khi unmount
    this.$emitter.off("updateData");
    this.$emitter.off("closeConfirmModal");
    this.$emitter.off("closeAndCancelConfirmModal");
    this.$emitter.off("selectLevel");
  },
  beforeMount() {
    /**
     * Tự động focus và input đầu tiên khi mở form
     * CreatedBy: NVA - MF1618
     */
    this.$nextTick(() => {
      this.$refs.inputEmulationName.focus();
    });
  },

  methods: {
    /**
     * Show toast khi xảy ra lỗi
     */
    showToastError(error) {
      var response = handleError(error);
      toast[response.type](response.message, {
        autoClose: 2000,
        position: "top-center",
      });
    },

    /**
     * Tự động focus lại vào input khi đang ở nút hủy
     * CreatedBy: NVA - MF1618
     */
    handleTabKeyPress() {
      this.$nextTick(() => {
        this.$refs.inputEmulationName.focus();
      });
    },

    /**
     * Các hàm chuyển đổi từ id sang mảng để hiển thị dữ liệu (input checkbox)
     * CreatedBy: NVA - MF1618
     */
    transFormTarget(target) {
      if (target == 4) {
        return ["2", "3"];
      } else {
        return [`${target}`];
      }
    },
    transFormType(type) {
      if (type == 0) {
        return ["2", "1"];
      } else {
        return [`${type}`];
      }
    },

    /**
     * goi api them moi 1 ban ghi
     * CreatedBy: NVA - MF1618
     */
    apiAddNewEmulation(createEmulation) {
      createData(createEmulation)
        .then((response) => {
          console.log(response.data);
        })
        .catch(function (err) {
          this.showToastError(err);
        });
    },

    /**
     * goi api để check trùng mã code
     * CreatedBy: NVA - MF1618
     */
    async apiCheckEmulationCode(code, id) {
      await checkCode(code, id)
        .then((response) => {
          this.isValidCode = response.data;
        })
        .catch(function (err) {
          this.showToastError(err);
        });
    },

    /**
     * goi api cập nhật bản ghi
     * CreatedBy: NVA - MF1618
     */
    apiUpdateEmulation(id, emulation) {
      var updatedEmulation = {
        EmulationStatus: Number(emulation.Status),
        EmulationName: emulation.Name,
        EmulationCode: emulation.Code.toUpperCase(),
        EmulationTarget:
          emulation.Object.length == 2 ? 4 : Number(emulation.Object[0]),
        EmulationLevel: emulation.Level,
        EmulationType:
          emulation.Type.length == 2 ? 0 : Number(emulation.Type[0]),
      };

      updateData(id, updatedEmulation)
        .then((response) => {
          // gửi emit tải lại bảng sau khi cập nhật
          this.$emitter.emit("reloadTable");
          console.log("response: ", response);
        })
        .catch(function (err) {
          this.showToastError(err);
        });
    },

    /**
     * sự kiện khi ấn nút hủy trong form sửa
     */
    cancelModalAddTitle() {
      this.$emitter.emit("showCancelModal", this.emulation);
    },
    /**
     * gửi đi dữ liệu vừa thay đổi
     */

    async saveChangeData() {
      this.checkData();

      if (this.emulation.Code != "") {
        await this.apiCheckEmulationCode(
          this.emulation.Code,
          this.emulation.Id
        );
        document.getElementById("hasBeenCode").style.display =
          this.isValidCode >= 1 ? "block" : "none";
      }

      if (
        this.emulation.Name != "" &&
        this.emulation.Code != "" &&
        this.emulation.Object.length != 0 &&
        this.emulation.Type.length != 0 &&
        this.isValidCode == 0
      ) {
        this.apiUpdateEmulation(this.emulationSelected, this.emulation);

        this.$emitter.emit("onSaveChangeData");

        toast.success("Sửa dữ liệu thành công !", {
          autoClose: 2000,
          position: "top-center",
        });
      } else {
        toast.warn("Vui lòng kiểm tra lại dữ liệu !", {
          autoClose: 2000,
          position: "top-right",
        });
      }
    },

    /**
     *Tự động sinh mã code
     */
    autoRenderCode() {
      if (this.isAutoRenderCode) {
        this.autoCode();
      }
    },
    autoCode() {
      var name = this.emulation.Name;
      var code = name
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase();
      this.emulation.Code = code;
    },

    /**
     *Sự kiện khi bấm nút ?
     */
    goToDetailPage() {
      window.open(
        "https://helpcegov.misa.vn/kb/khai-bao-danh-hieu-thi-dua/",
        "_blank"
      );
    },

    /**
     * Đóng, mở form
     */
    closeModalAddTitle() {
      this.showAddModal();
    },
    openModalAddTitle() {
      this.showAddModal();
    },
    /*
     * Hàm để hiện lỗi validate
     */
    showError(value) {
      return value.length !== 0 ? "none" : "block";
    },
    checkData() {
      //validate input và select
      let inputReq = document.querySelectorAll("[require]");

      for (const input of inputReq) {
        const inputLabel = input.getAttribute("property-name");
        const errorTitle = document.querySelector("#title + span");
        const errorCode = document.querySelector("#code + span");
        // const errorLevel = document.querySelector("#level + span");
        const value = input.value;
        input.style.borderColor = value !== "" ? "rgb(193, 193, 193)" : "red";
        switch (inputLabel) {
          case "Name":
            errorTitle.style.display = this.showError(this.emulation.Name);
            break;
          case "Code":
            errorCode.style.display = this.showError(this.emulation.Code);
            break;
        }
      }

      //validate 'Loại phong trào'

      const errorType = document.querySelector("#type + span");
      errorType.style.display = this.showError(this.emulation.Type);

      //validate 'Đối tượng khen thưởng'

      const errorObject = document.querySelector("#object + span");
      errorObject.style.display = this.showError(this.emulation.Object);
    },
    /**
     * validate dữ liệu nhập
     */
    async validateData(isCloseForm) {
      this.checkData();
      if (this.emulation.Code != "") {
        await this.apiCheckEmulationCode(this.emulation.Code, null);
        document.getElementById("hasBeenCode").style.display = !(
          this.isValidCode == 0
        )
          ? "block"
          : "none";
      }

      if (
        this.emulation.Name != "" &&
        this.emulation.Code != "" &&
        this.emulation.Object.length != 0 &&
        this.emulation.Type.length != 0 &&
        this.isValidCode == 0
      ) {
        const createEmulation = {
          EmulationLevel: this.emulation.Level,
          EmulationName: this.emulation.Name,
          EmulationCode: this.emulation.Code.toUpperCase(),
          EmulationTarget:
            this.emulation.Object.length == 2
              ? 4
              : Number(this.emulation.Object[0]),

          EmulationType:
            this.emulation.Type.length == 2
              ? 0
              : Number(this.emulation.Type[0]),
        };

        // this.$emitter.emit("addNewEmulation", createEmulation);
        this.apiAddNewEmulation(createEmulation);
        this.$emitter.emit("resetSelect");
        toast.success("Thêm dữ liệu thành công !", {
          autoClose: 2000,
          position: "top-center",
        });
        if (!isCloseForm) {
          this.$emitter.emit("closeAndAddEmulation");
        } else {
          this.$emitter.emit("saveAndAddEmulation");
        }

        this.emulation = {
          Level: 1,
          Object: [],
          Type: [],
          Code: "",
          Name: "",
          Note: "",
        };
      }
    },
    saveAndAddNewEmulation() {
      this.validateData(true);
    },
    addNewEmulation() {
      this.validateData(false);
    },
  },
};
</script>
<style>
@import url("../../../css/main.css");
.container__modal {
  z-index: 2;
}
#code::placeholder {
  text-transform: initial;
}
</style>
