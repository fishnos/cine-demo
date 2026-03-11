import { twMerge } from "tailwind-merge";

export function cx(...args) {
  return twMerge(args.filter(Boolean).join(" "));
}
