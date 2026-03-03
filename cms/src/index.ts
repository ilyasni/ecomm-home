import type { Core } from "@strapi/strapi";

const FRONTEND_URL = process.env.FRONTEND_INTERNAL_URL ?? "";
const REINDEX_SECRET = process.env.REINDEX_SECRET ?? "";

/** Fire-and-forget: уведомляем Next.js webhook о изменении продукта */
async function notifySearch(
  event: string,
  entry: Record<string, unknown>
): Promise<void> {
  if (!FRONTEND_URL || !REINDEX_SECRET) return;
  const url = `${FRONTEND_URL}/api/admin/search/webhook?secret=${REINDEX_SECRET}`;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, model: "product", entry }),
    });
  } catch (err) {
    console.warn("[Strapi lifecycle] search webhook failed:", err);
  }
}

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    strapi.db.lifecycles.subscribe({
      models: ["api::product.product"],

      async afterCreate(event) {
        await notifySearch("entry.create", (event.result ?? {}) as Record<string, unknown>);
      },
      async afterUpdate(event) {
        await notifySearch("entry.update", (event.result ?? {}) as Record<string, unknown>);
      },
      async afterDelete(event) {
        await notifySearch("entry.delete", (event.result ?? {}) as Record<string, unknown>);
      },
    });
  },
  bootstrap(/* { strapi } */) {},
  destroy(/* { strapi } */) {},
};
