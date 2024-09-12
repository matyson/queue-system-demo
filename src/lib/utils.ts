import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Sample } from "@/components/sample";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSampleColor(type: Sample["type"]) {
  switch (type) {
    case "A":
      return "bg-red-500";
    case "B":
      return "bg-blue-500";
    case "C":
      return "bg-green-500";
    case "D":
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
}
