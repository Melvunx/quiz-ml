import { ApiResponseError, ApiResponseSuccess } from "@/schema/api.schema";
import colors from "@/schema/colors.schma";

export function HandleResponseSuccess(
  data?: any,
  message = "Request succeded !"
): ApiResponseSuccess {
  return {
    success: true,
    message,
    data: data ?? null,
  };
}

export function HandleResponseError(error?: any): ApiResponseError {
  const isErrorObject = error instanceof Error;
  return {
    success: false,
    error: isErrorObject
      ? error.message
      : error
      ? error
      : "An error occurred !",
    stack: isErrorObject ? error.stack : undefined,
  };
}

export const LoggedResponseSuccess = (data?: any, message?: string) =>
  console.log(colors.success(HandleResponseSuccess(data, message)));

export const LoggedResponseError = (error?: any) =>
  console.log(colors.success(HandleResponseError(error)));
