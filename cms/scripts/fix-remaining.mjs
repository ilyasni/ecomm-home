/**
 * Привязка изображений к оставшимся категориям и продуктам.
 */

const STRAPI_URL = "http://localhost:1337";
const TOKEN = "445c30fec01628915203e6620693e58679803465cc39de150d7482800760feb193d64d83a4655b5fb94cfffe2949fe74b5fe8c3eb08f7f13d3227f961d9140ce240b47b2842193c17776cc2bfbb2fb82f882d383bbc9d404c0e81b4fa780fc322d6a3b9e8d27dabcf5fc732c32273274d2a41975c565b475688964360a946c58";
const headers = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };

async function put(path, data) {
  const res = await fetch(`${STRAPI_URL}/api/${path}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ data }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`  ✗ ${path}: ${text.slice(0, 200)}`);
    return null;
  }
  console.log(`  ✓ ${path}`);
  return res.json();
}

async function main() {
  console.log("\n═══ Fix Remaining ═══\n");

  // Категории без изображений
  // throws (Пледы) → use image 11 (cat-plaids)
  // home (Для дома) → use image 8 (cat-home-textile)
  console.log("Categories...");
  await put("categories/awmx79eea02zhpzvghuoc7yh", { image: 11 });
  await put("categories/krvvlrobhjvs668b7cnsbrd7", { image: 8 });

  // Продукты — все без изображений
  // Используем загруженные фото продуктов
  console.log("\nProducts...");
  const prodMap = {
    "wx8up55cjll5ujb7da3c3gzw": 14,  // filigran-bed-set → product-bed-spb
    "y5ffc2ipka1ynka4ryqk6o6z": 15,  // premium-fitted-sheet → product-pillow
    "ava3a43zgu72wv49py9523o7": 16,   // comfort-pillow → product-blanket
    "lzrsn1ocfcz098hczdvqmw67": 17,   // elegance-silk-blanket → product-plaid
    "n1ovqojymlf5a9lybhg7oicx": 18,   // classic-cashmere-throw → product-towel
    "f4c7aj60el1banwq9jzvn5ti": 19,    // gift-certificate → product-cert
  };
  for (const [docId, imageId] of Object.entries(prodMap)) {
    await put(`products/${docId}`, { image: imageId });
  }

  console.log("\n═══ Done! ═══\n");
}

main().catch(console.error);
