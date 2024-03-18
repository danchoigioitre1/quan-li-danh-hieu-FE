import axios from "axios";

export const BASEURL = "https://localhost:7158/api/v1/Emulations";
export const BASE_EXPORT = "https://localhost:7158/api/v1/EmulationExports";
export const BASE_IMPORT = "https://localhost:7158/api/v1/EmulationImports";

export function multipleDelete(listId) {
  var response = axios.post(`${BASEURL}/MultipleDelete`, listId);
  return response;
}

export function getData(
  pageSize,
  pageNumber,
  searchCode,
  searchName,
  EmulationLevel,
  EmulationStatus,
  EmulationTarget,
  EmulationType
) {
  var response = axios.get(BASEURL, {
    params: {
      pageSize,
      pageNumber,
      searchCode,
      searchName,
      EmulationLevel,
      EmulationStatus,
      EmulationTarget,
      EmulationType,
    },
  });
  return response;
}

export function getTotal(
  searchCode,
  searchName,
  EmulationLevel,
  EmulationStatus,
  EmulationTarget,
  EmulationType
) {
  var response = axios.get(`${BASEURL}/Total`, {
    params: {
      searchCode,
      searchName,
      EmulationLevel,
      EmulationStatus,
      EmulationTarget,
      EmulationType,
    },
  });
  return response;
}

export function multipleChange(status, listId) {
  var response = axios.post(
    `${BASEURL}/MultipleChangeStatus?status=${status}`,
    listId
  );
  return response;
}

export function getDataById(Id) {
  var response = axios.get(`${BASEURL}/${Id}`);
  return response;
}

export function checkCode(code, id) {
  var response = axios.get(`${BASEURL}/check/${code}`, {
    params: id == null ? {} : { id },
  });
  return response;
}

export function updateData(id, data) {
  var response = axios.put(`${BASEURL}/${id}`, data);
  return response;
}

export function createData(newData) {
  var response = axios.post(BASEURL, {
    EmulationStatus: 1,
    ...newData,
  });
  return response;
}

export function checkFileType(file) {
  const formData = new FormData();
  formData.append("file", file);

  var response = axios.post(`${BASE_IMPORT}/checkFileType`, formData);
  return response;
}

export function checkFileSize(file) {
  const formData = new FormData();
  formData.append("file", file);

  var response = axios.post(`${BASE_IMPORT}/checkFileSize`, formData);
  return response;
}

export function exportExcelFile(fileName, title, data, subSystemCode) {
  return axios
    .post(
      `${BASE_EXPORT}/exportExcel/?title=${title}&workbookName=${fileName}&subSystemCode=${subSystemCode}`,
      data,
      {
        responseType: "blob", // Đặt kiểu phản hồi là blob
      }
    )
    .then((response) => {
      // Lấy dữ liệu từ phản hồi
      const fileData = response.data;

      // Tạo URL đến dữ liệu file Excel
      const fileUrl = window.URL.createObjectURL(new Blob([fileData]));

      // Tạo một thẻ a để tạo và tải về file Excel
      const link = document.createElement("a");
      link.href = fileUrl;
      link.setAttribute("download", `${fileName}.xlsx`); // Đặt tên file Excel tại đây
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch((error) => {
      console.error("Có lỗi khi tải về file Excel:", error);
    });
}

export function getSheetList(file) {
  const formData = new FormData();
  formData.append("file", file);

  var response = axios.post(`${BASE_IMPORT}/getSheetList`, formData);
  return response;
}

export function checkHeaderList(file, subSystemCode, headerIndex, sheetIndex) {
  const formData = new FormData();
  formData.append("file", file);

  var response = axios.post(
    `${BASE_IMPORT}/checkHeaderList?subSystemCode=${subSystemCode}&headerIndex=${headerIndex}&sheetIndex=${sheetIndex}`,
    formData
  );
  return response;
}

export function statisticalEmulation(
  file,
  subSystemCode,
  headerIndex,
  sheetIndex
) {
  const formData = new FormData();
  formData.append("file", file);

  var response = axios.post(
    `${BASE_IMPORT}/statisticalEmulation?subSystemCode=${subSystemCode}&headerIndex=${headerIndex}&sheetIndex=${sheetIndex}`,
    formData
  );
  return response;
}

export function exportErrorExcel(file, subSystemCode, headerIndex) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = axios.post(
      `${BASE_IMPORT}/exportErrorExcel?subSystemCode=${subSystemCode}&headerIndex=${headerIndex}`,
      formData,
      {
        responseType: "blob",
      }
    );

    const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", "Báo cáo lỗi.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Xử lý thành công
    console.log("Xuất file Excel thành công");
  } catch (error) {
    console.error("Xuất file Excel thất bại:", error);
  }
}

export function getValidData(file, subSystemCode, headerIndex, sheetIndex) {
  const formData = new FormData();
  formData.append("file", file);

  var response = axios.post(
    `${BASE_IMPORT}/getValidData?subSystemCode=${subSystemCode}&headerIndex=${headerIndex}&sheetIndex=${sheetIndex}`,
    formData
  );
  return response;
}

export function multipleAddEmulation(list) {
  var response = axios.post(`${BASE_IMPORT}/multipleAddEmulation`, list);
  return response;
}
