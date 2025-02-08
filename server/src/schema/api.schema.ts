import { z } from "zod";

export const ApiResponseErrorSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  error: z.any(),
  stack: z.string().or(z.undefined()),
});

export const ApiResponseSuccessSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.any(),
});

export type ApiResponseError = z.infer<typeof ApiResponseErrorSchema>;
export type ApiResponseSuccess = z.infer<typeof ApiResponseSuccessSchema>;
