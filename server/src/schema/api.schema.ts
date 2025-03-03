import { z } from "zod";

const ApiDataSchema = z
  .record(z.string(), z.unknown())
  .or(z.array(z.record(z.string(), z.unknown())))
  .or(z.null());

const ApiResponseErrorSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  error: z.unknown(),
  stack: z.string().or(z.undefined()),
});

const ApiResponseSuccessSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: ApiDataSchema,
});

export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type ErrorStatus = Extract<
  keyof typeof HttpStatus,
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "INTERNAL_SERVER_ERROR"
>;

export type ApiData = z.infer<typeof ApiDataSchema>;
export type SuccessStatus = Extract<keyof typeof HttpStatus, "OK" | "CREATED">;
export type ApiResponseError = z.infer<typeof ApiResponseErrorSchema>;
export type ApiResponseSuccess = z.infer<typeof ApiResponseSuccessSchema>;
