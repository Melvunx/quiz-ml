import { Response } from "express";
import {
  ApiData,
  ErrorStatus,
  HttpStatus,
  SuccessStatus,
} from "../schema/api.schema";
import {
  handleResponseError,
  handleResponseSuccess,
} from "../utils/handleResponse";

export class ApiResponse {
  constructor() {}

  private getStatusCode(status: keyof typeof HttpStatus): number {
    return HttpStatus[status];
  }

  success(
    response: Response,
    status: SuccessStatus,
    data: ApiData,
    message = "Request succeeded"
  ) {
    const code = this.getStatusCode(status);
    response.status(code).json(handleResponseSuccess(data, message));
  }

  error(
    response: Response,
    status: ErrorStatus,
    error?: unknown,
    message = "Request failed"
  ) {
    const code = this.getStatusCode(status);
    response.status(code).json(handleResponseError(error, message));
  }
}

const apiResponse = new ApiResponse();

export default apiResponse;
