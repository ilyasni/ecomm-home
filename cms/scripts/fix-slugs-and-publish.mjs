/**
 * 1. Публикация всех draft-товаров
 * 2. Исправление slug'ов категорий: throws→plaids, home→home-textile
 * 3. Обновление Navigation single type
 */

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const TOKEN =
  process.env.STRAPI_API_TOKEN ||
  "445c30fec01628915203e6620693e58679803465cc39de150d7482800760feb193d64d83a4655b5fb94cfffe2949fe74b5fe8c3eb08f7f13d3227f961d9140ce240b47b2842193c17776cc2bfbb2fb82f882d383bbc9d404c0e81b4fa780fc322d6a3b9e8d27dabcf5fc732c32273274d2a41975c565b475688964360a946c58";

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
};

async function apiGet(path) {
  const res = await fetch(`${STRAPI_URL}/api/${path}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return res.ok ? res.json() : null;
}

async function apiPut(path, data) {
  const res = await fetch(`${STRAPI_URL}/api/${path}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ data }),
  });
  if (!res.ok) {
    console.error(`  ✗ PUT ${path}:`, (await res.text()).slice(0, 200));
    return null;
  }
  return res.json();
}

async function main() {
  // ── 1. Публикация товаров ──
  console.log("\n═══ Publishing products ═══\n");
  let page = 1;
  let published = 0;
  while (true) {
    const res = await apiGet(
      `products?status=draft&pagination[page]=${page}&pagination[pageSize]=25`
    );
    if (!res?.data?.length) break;
    for (const p of res.data) {
      const pubRes = await fetch(
        `${STRAPI_URL}/api/products/${p.documentId}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify({ data: { title: p.title, slug: p.slug, price: p.price, publishedAt: new Date().toISOString() } }),
        }
      );
      if (pubRes.ok) {
        published++;
        process.stdout.write(`  ✓ ${p.title}\n`);
      } else {
        console.error(`  ✗ ${p.title}: ${(await pubRes.text()).slice(0, 100)}`);
      }
    }
    page++;
  }
  console.log(`\n  Published: ${published}\n`);

  // ── 2. Исправление slug'ов категорий ──
  console.log("═══ Fixing category slugs ═══\n");
  const cats = await apiGet("categories?pagination[pageSize]=20");
  if (cats?.data) {
    for (const cat of cats.data) {
      if (cat.slug === "throws") {
        const r = await apiPut(`categories/${cat.documentId}`, { slug: "plaids" });
        console.log(r ? "  ✓ throws → plaids" : "  ✗ throws → plaids failed");
      }
      if (cat.slug === "home") {
        const r = await apiPut(`categories/${cat.documentId}`, { slug: "home-textile" });
        console.log(r ? "  ✓ home → home-textile" : "  ✗ home → home-textile failed");
      }
    }
  }

  // ── 3. Обновление Navigation ──
  console.log("\n═══ Updating Navigation ═══\n");
  const nav = await apiGet("navigation?populate=*");
  if (nav?.data) {
    const catalogCats = nav.data.catalogCategories;
    if (catalogCats?.length) {
      const updated = catalogCats.map((c) => {
        const item = { title: c.title, href: c.href };
        if (c.href === "/catalog/throws") item.href = "/catalog/plaids";
        if (c.href === "/catalog/home") item.href = "/catalog/home-textile";
        return item;
      });
      const r = await apiPut("navigation", { catalogCategories: updated });
      console.log(r ? "  ✓ Navigation updated" : "  ✗ Navigation update failed");
    } else {
      console.log("  ⊘ No catalogCategories found in navigation");
    }
  }

  console.log("\n═══ Done ═══\n");
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
