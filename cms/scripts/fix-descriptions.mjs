/**
 * Исправление описаний товаров: декодирование HTML entities → удаление тегов.
 * Также проверка и исправление навигации.
 */

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const TOKEN =
  process.env.STRAPI_API_TOKEN ||
  "445c30fec01628915203e6620693e58679803465cc39de150d7482800760feb193d64d83a4655b5fb94cfffe2949fe74b5fe8c3eb08f7f13d3227f961d9140ce240b47b2842193c17776cc2bfbb2fb82f882d383bbc9d404c0e81b4fa780fc322d6a3b9e8d27dabcf5fc732c32273274d2a41975c565b475688964360a946c58";

function cleanDescription(raw) {
  if (!raw) return "";
  let text = raw
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
  text = text.replace(/<[^>]*>/g, "");
  text = text
    .replace(/\r\n/g, " ")
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text;
}

async function main() {
  console.log("\n═══ Fixing product descriptions ═══\n");

  let page = 1;
  let fixed = 0;
  while (true) {
    const res = await fetch(
      `${STRAPI_URL}/api/products?pagination[page]=${page}&pagination[pageSize]=25`,
      { headers: { Authorization: `Bearer ${TOKEN}` } }
    );
    const data = await res.json();
    if (!data.data?.length) break;

    for (const p of data.data) {
      const desc = p.description || "";
      if (desc.includes("<") || desc.includes("&lt;") || desc.includes("&gt;")) {
        const cleaned = cleanDescription(desc);
        const r = await fetch(
          `${STRAPI_URL}/api/products/${p.documentId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ data: { description: cleaned } }),
          }
        );
        if (r.ok) {
          console.log(`  ✓ ${p.title}: "${cleaned.slice(0, 60)}..."`);
          fixed++;
        } else {
          console.error(`  ✗ ${p.title}: ${(await r.text()).slice(0, 100)}`);
        }
      }
    }
    page++;
  }

  console.log(`\n  Fixed: ${fixed} descriptions\n`);
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
