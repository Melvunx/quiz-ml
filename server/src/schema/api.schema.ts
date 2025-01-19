import { z } from "zod";

export default class ApiError extends Error {
  constructor(public status: number, public data: Record<string, unknown>) {
    super();
  }
}

export const ApiResponseSuccessSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.any(),
});

export const ApiResponseErrorSchema = z.object({
  success: z.literal(false),
  error: z.any(),
  stack: z.string().or(z.undefined()),
});

export type ApiResponseSuccess = z.infer<typeof ApiResponseSuccessSchema>;
export type ApiResponseError = z.infer<typeof ApiResponseErrorSchema>;
