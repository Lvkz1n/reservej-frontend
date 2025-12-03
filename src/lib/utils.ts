import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && Array.isArray((value as any).data)) return (value as any).data as T[];
  return [];
}
