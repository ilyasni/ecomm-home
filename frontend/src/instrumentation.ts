import { validateRuntimeConfig } from "@/lib/runtime-config";

export function register() {
  validateRuntimeConfig();
}
