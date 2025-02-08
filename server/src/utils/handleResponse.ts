import { ApiResponseError, ApiResponseSuccess } from "@/schema/api.schema";
import colors from "@/schema/colors.schema";
import apiResponse from "@/services/api.response";
import { Response } from "express";

export function handleResponseSuccess(
  data?: any,
  message = "Request succeded"
): ApiResponseSuccess {
  return {
    success: true,
    message,
    data: data ?? null,
  };
}

export function handleResponseError(
  error?: any,
  message = "Request failed"
): ApiResponseError {
  const isErrorObject = error instanceof Error;
  return {
    success: false,
    message,
    error: isErrorObject
      ? error.message
      : error
      ? error
      : "An error occurred !",
    stack: isErrorObject ? error.stack : undefined,
  };
}

export const loggedResponseSuccess = (data?: any, message?: string) =>
  console.log(colors.success(handleResponseSuccess(data, message)));

export const loggedResponseError = (error?: any) =>
  console.log(colors.error(handleResponseError(error)));

export function handleError(
  response: Response,
  status:
    | "BAD_REQUEST"
    | "UNAUTHORIZED"
    | "FORBIDDEN"
    | "NOT_FOUND"
    | "INTERNAL_SERVER_ERROR",
  message = `Request failed with the status${response.status}`
) {
  const errorMessage = new Error(message);
  const responseError = handleResponseError(errorMessage);
  loggedResponseError(responseError.error);
  return apiResponse.error(response, status, errorMessage);
}
