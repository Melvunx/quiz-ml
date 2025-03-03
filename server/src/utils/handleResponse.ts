import { Response } from "express";
import {
  ApiData,
  ApiResponseError,
  ApiResponseSuccess,
  ErrorStatus,
} from "../schema/api.schema";
import colors from "../schema/colors.schema";
import apiResponse from "../services/api.response";

export function handleResponseSuccess(
  data: ApiData,
  message = "Request succeded"
): ApiResponseSuccess {
  return {
    success: true,
    message,
    data,
  };
}

export function handleResponseError(
  error?: unknown,
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

export const loggedResponseSuccess = (
  data: Record<string, unknown> | null,
  message?: string
) => console.log(colors.success(handleResponseSuccess(data, message)));

export const loggedResponseError = (error?: unknown) =>
  console.log(colors.error(handleResponseError(error)));

export function handleError(
  response: Response,
  status: ErrorStatus,
  message = `Request failed with the status${response.status}`
) {
  const errorMessage = new Error(message);
  const responseError = handleResponseError(errorMessage);
  loggedResponseError(responseError.error);
  return apiResponse.error(response, status, errorMessage);
}
