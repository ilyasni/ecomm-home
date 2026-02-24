import { access } from "node:fs/promises";
import path from "node:path";

const requiredRouteFiles = [
  "src/app/catalog/page.tsx",
  "src/app/catalog/[slug]/page.tsx",
  "src/app/cart/page.tsx",
  "src/app/checkout/page.tsx",
  "src/app/checkout/success/page.tsx",
  "src/app/favorites/page.tsx",
  "src/app/search/page.tsx",
];

const missing = [];
for (const routePath of requiredRouteFiles) {
  const absolute = path.resolve(process.cwd(), routePath);
  try {
    await access(absolute);
  } catch {
    missing.push(routePath);
  }
}

if (missing.length > 0) {
  console.error("Smoke E2E check failed. Missing routes:");
  for (const item of missing) {
    console.error(`- ${item}`);
  }
  process.exit(1);
}

console.log("Smoke E2E check passed.");
