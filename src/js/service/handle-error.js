export function handleError(error) {
  if (error.code && error.response.data.ErrorCode == 500) {
    return { message: error.response.data.UserMessage, type: "error" };
  }
  if (error.code && error.response.data.ErrorCode == 400) {
    return { message: error.response.data.UserMessage, type: "warning" };
  }
}
