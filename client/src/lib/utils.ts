import { ApiError } from "@/api/fetch";
import Confirmation from "@ui/confirm";
import { clsx, type ClassValue } from "clsx";
import { confirmable, createConfirmation } from "react-confirm";
import { twMerge } from "tailwind-merge";

export type ApiErrorResponse = {
  name: string;
  success: false;
  message: string;
  error: string;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toastParams(title: string, description: string) {
  return {
    title,
    description,
  };
}

export function dateFormater(date: Date) {
  const dateFormated = date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return dateFormated;
}

export function apiErrorHandler(error: unknown): ApiErrorResponse {
  if (process.env.NODE_ENV === "development") console.error(error);

  if (error instanceof ApiError) {
    const { data } = error;

    return {
      name: error.name,
      success: data.success,
      message: data.message,
      error: data.error,
    };
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      success: false,
      message: error.message,
      error: "Unexpected error occurred",
    };
  }

  return {
    name: "UnknownError",
    success: false,
    message: "An unknown error occurred",
    error: "Unknown error",
  };
}

export function showError(errors: string[], filter: string) {
  const errorList = errors.filter((error) => {
    return error.includes(filter);
  });

  return errorList[0];
}

const Confirmable = confirmable(Confirmation);

export const confirm = createConfirmation(Confirmable);

export const CHARACTER = {
  LOWERS: "azertyuiopmlkjhgfdsqwxcvbn",
  SYMBOLS: ",?;./:!§£*µù%^\"'éèàç([)@){=}]#~&",
  NUMBERS: "0473291586",
} as const;
