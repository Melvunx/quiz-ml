import {
  handleResponseError,
  handleResponseSuccess,
} from "@/utils/handleResponse";
import { Response } from "express";

class ApiResponse {
  constructor() {}

  private getStatusCode(status: string) {
    const statusCode: Record<string, number> = {
      OK: 200,
      CREATED: 201,
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
      INTERNAL_SERVER_ERROR: 500,
    };

    return statusCode[status] || 500;
  }

  success(
    response: Response,
    status: "OK" | "CREATED",
    data?: any,
    message = "Request succeded"
  ) {
    const code = this.getStatusCode(status);
    response.status(code).json(handleResponseSuccess(data, message));
  }

  error(
    response: Response,
    status:
      | "BAD_REQUEST"
      | "UNAUTHORIZED"
      | "FORBIDDEN"
      | "NOT_FOUND"
      | "INTERNAL_SERVER_ERROR",
    error?: any,
    message = "Request failed"
  ) {
    const code = this.getStatusCode(status);
    response.status(code).json(handleResponseError(error, message));
  }
}

const apiResponse = new ApiResponse();

export default apiResponse;
