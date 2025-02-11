import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
