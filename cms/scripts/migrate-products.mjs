/**
 * Миграция товаров из OpenCart SQL-дампа в Strapi 5.
 * Парсит SQL, загружает изображения, создаёт товары.
 *
 * Запуск: node cms/scripts/migrate-products.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const SQL_PATH = path.join(ROOT, "old_site_va_home", "karabcjv_home.sql");
const IMAGES_ROOT = path.join(ROOT, "old_site_va_home", "public_html", "image");

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const TOKEN =
  process.env.STRAPI_API_TOKEN ||
  "445c30fec01628915203e6620693e58679803465cc39de150d7482800760feb193d64d83a4655b5fb94cfffe2949fe74b5fe8c3eb08f7f13d3227f961d9140ce240b47b2842193c17776cc2bfbb2fb82f882d383bbc9d404c0e81b4fa780fc322d6a3b9e8d27dabcf5fc732c32273274d2a41975c565b475688964360a946c58";

const OC_CATEGORY_MAP = {
  138: "bed-linen",
  141: "boudoir",
  139: "pillows",
  140: "blankets",
};

const ATTR_NAMES = {
  4: "Цвет",
  5: "Дизайн",
  6: "Плотность ткани",
  7: "Состав",
  8: "Наполнитель",
  9: "Степень тепла",
  10: "Плотность наполнителя",
  11: "Материал верха",
  13: "Размер (см)",
  14: "Чехол подушки",
  15: "Степень упругости",
  16: "Комплектация",
  17: "В комплект входят",
};

// ─── SQL Parsing ───

function parseInsertValues(sql, tableName) {
  const marker = `INSERT INTO \`${tableName}\` VALUES `;
  const startIdx = sql.indexOf(marker);
  if (startIdx === -1) return [];

  const begin = startIdx + marker.length;
  let pos = begin;
  let inStr = false;
  let escape = false;

  while (pos < sql.length) {
    const ch = sql[pos];
    if (escape) {
      escape = false;
      pos++;
      continue;
    }
    if (ch === "\\") {
      escape = true;
      pos++;
      continue;
    }
    if (ch === "'") {
      inStr = !inStr;
      pos++;
      continue;
    }
    if (!inStr && ch === ";") break;
    pos++;
  }

  const valuesStr = sql.substring(begin, pos);
  const rows = [];
  let current = "";
  let depth = 0;
  inStr = false;
  escape = false;

  for (let i = 0; i < valuesStr.length; i++) {
    const ch = valuesStr[i];
    if (escape) {
      current += ch;
      escape = false;
      continue;
    }
    if (ch === "\\") {
      current += ch;
      escape = true;
      continue;
    }
    if (ch === "'") {
      inStr = !inStr;
      current += ch;
      continue;
    }
    if (inStr) {
      current += ch;
      continue;
    }
    if (ch === "(") {
      if (depth === 0) current = "";
      else current += ch;
      depth++;
      continue;
    }
    if (ch === ")") {
      depth--;
      if (depth === 0) rows.push(parseRow(current));
      else current += ch;
      continue;
    }
    if (depth > 0) current += ch;
  }
  return rows;
}

function parseRow(rowStr) {
  const fields = [];
  let current = "";
  let inStr = false;
  let escape = false;

  for (let i = 0; i < rowStr.length; i++) {
    const ch = rowStr[i];
    if (escape) {
      current += ch;
      escape = false;
      continue;
    }
    if (ch === "\\") {
      escape = true;
      continue;
    }
    if (ch === "'") {
      inStr = !inStr;
      continue;
    }
    if (ch === "," && !inStr) {
      fields.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  fields.push(current);
  return fields.map((f) => (f === "NULL" ? null : f));
}

function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\r\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function transliterate(text) {
  const map = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh",
    з: "z", и: "i", й: "j", к: "k", л: "l", м: "m", н: "n", о: "o",
    п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts",
    ч: "ch", ш: "sh", щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu",
    я: "ya",
  };
  return text
    .toLowerCase()
    .split("")
    .map((ch) => map[ch] || ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 60);
}

// ─── Strapi API ───

async function strapiGet(path, params = {}) {
  const url = new URL(`/api/${path}`, STRAPI_URL);
  Object.entries(params).forEach(([k, v]) =>
    url.searchParams.set(k, String(v))
  );
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return res.ok ? res.json() : null;
}

async function strapiPost(path, data) {
  const res = await fetch(`${STRAPI_URL}/api/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });
  if (!res.ok) {
    const t = await res.text();
    console.error(`  ✗ POST ${path}: ${t.slice(0, 200)}`);
    return null;
  }
  return res.json();
}

async function uploadFile(filePath, altText) {
  if (!fs.existsSync(filePath)) return null;
  const formData = new FormData();
  const buf = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const mime =
    ext === ".png"
      ? "image/png"
      : ext === ".webp"
        ? "image/webp"
        : "image/jpeg";
  formData.append("files", new Blob([buf], { type: mime }), path.basename(filePath));
  formData.append("fileInfo", JSON.stringify({ alternativeText: altText }));

  const res = await fetch(`${STRAPI_URL}/api/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}` },
    body: formData,
  });
  if (!res.ok) {
    console.error(`  ✗ Upload failed: ${(await res.text()).slice(0, 100)}`);
    return null;
  }
  const data = await res.json();
  return Array.isArray(data) ? data[0]?.id : data?.id;
}

// ─── Main ───

async function main() {
  console.log("\n═══ OpenCart → Strapi Migration ═══\n");

  // 1. Read SQL dump
  console.log("1. Parsing SQL dump...");
  const sql = fs.readFileSync(SQL_PATH, "utf-8");

  // oc_product: product_id, model, sku, upc, ean, jan, isbn, mpn, location, quantity, stock_status_id, image, ...price...
  const ocProducts = parseInsertValues(sql, "oc_product");
  // oc_product_description: product_id, language_id, name, description, tag, meta_title, meta_description, meta_keyword, meta_h1
  const ocDescriptions = parseInsertValues(sql, "oc_product_description");
  // oc_product_to_category: product_id, category_id, main_category
  const ocProdCat = parseInsertValues(sql, "oc_product_to_category");
  // oc_product_attribute: product_id, attribute_id, language_id, text
  const ocAttributes = parseInsertValues(sql, "oc_product_attribute");
  // oc_product_image: product_image_id, product_id, image, sort_order
  const ocImages = parseInsertValues(sql, "oc_product_image");
  // oc_product_option_value: product_option_value_id, product_option_id, product_id, option_id, option_value_id, quantity, subtract, price, price_prefix, points, points_prefix, weight, weight_prefix
  const ocOptionValues = parseInsertValues(sql, "oc_product_option_value");
  // oc_option_value_description: option_value_id, language_id, option_id, name
  const ocOptionValueDesc = parseInsertValues(sql, "oc_option_value_description");

  console.log(
    `  Products: ${ocProducts.length}, Descriptions: ${ocDescriptions.length}, ` +
    `Attributes: ${ocAttributes.length}, Images: ${ocImages.length}, ` +
    `Options: ${ocOptionValues.length}`
  );

  // Build lookup maps
  const descMap = new Map();
  for (const d of ocDescriptions) {
    descMap.set(d[0], { name: d[2], description: d[3] });
  }

  const catMap = new Map();
  for (const c of ocProdCat) {
    catMap.set(c[0], c[1]);
  }

  const attrMap = new Map();
  for (const a of ocAttributes) {
    if (!attrMap.has(a[0])) attrMap.set(a[0], []);
    attrMap.get(a[0]).push({ attrId: a[1], text: a[3] });
  }

  const imageMap = new Map();
  for (const img of ocImages) {
    if (!imageMap.has(img[1])) imageMap.set(img[1], []);
    imageMap.get(img[1]).push({ image: img[2], sort: parseInt(img[3]) || 0 });
  }

  const optionValueNames = new Map();
  for (const ov of ocOptionValueDesc) {
    optionValueNames.set(ov[0], ov[3]);
  }

  const sizeMap = new Map();
  for (const ov of ocOptionValues) {
    const productId = ov[2];
    if (!sizeMap.has(productId)) sizeMap.set(productId, []);
    const sizeName = optionValueNames.get(ov[4]) || `Size ${ov[4]}`;
    const priceModifier = parseFloat(ov[7]) || 0;
    const prefix = ov[8] || "+";
    sizeMap.get(productId).push({
      label: sizeName,
      value: priceModifier > 0 ? `${prefix}${priceModifier} ₽` : "—",
    });
  }

  // 2. Get Strapi categories
  console.log("\n2. Fetching Strapi categories...");
  const catRes = await strapiGet("categories", { "pagination[pageSize]": "20" });
  const strapiCategories = {};
  if (catRes?.data) {
    for (const c of catRes.data) {
      strapiCategories[c.slug] = c.documentId;
    }
  }
  console.log(`  Found: ${Object.keys(strapiCategories).join(", ")}`);

  // 3. Build product list
  console.log("\n3. Building product list...");
  const products = [];
  // oc_product columns (32 fields):
  // 0:product_id, 1:model, 2:sku, 3:upc, 4:ean, 5:jan, 6:isbn, 7:mpn,
  // 8:location, 9:quantity, 10:stock_status_id, 11:image, 12:manufacturer_id,
  // 13:shipping, 14:price, 15:points, 16:tax_class_id, 17:date_available,
  // 18:weight, 19:weight_class_id, 20:length, 21:width, 22:height,
  // 23:length_class_id, 24:subtract, 25:minimum, 26:sort_order, 27:status,
  // 28:viewed, 29:date_added, 30:date_modified, 31:noindex
  for (const p of ocProducts) {
    const productId = p[0];
    const model = p[1];
    const quantity = parseInt(p[9]) || 0;
    const imagePath = p[11];
    const price = parseFloat(p[14]) || 0;
    const weight = parseFloat(p[18]) || 0;
    const status = parseInt(p[27]);

    if (productId === "169") continue;
    if (status !== 1) continue;
    if (price <= 1) continue;

    const desc = descMap.get(productId) || { name: model, description: "" };
    const ocCatId = catMap.get(productId);
    const strapiCatSlug = OC_CATEGORY_MAP[ocCatId];
    const strapiCatDocId = strapiCategories[strapiCatSlug];

    const attrs = attrMap.get(productId) || [];
    const extraImages = (imageMap.get(productId) || []).sort(
      (a, b) => a.sort - b.sort
    );
    const sizes = sizeMap.get(productId) || [];

    const specifications = [];
    let composition = "";
    const colors = [];

    for (const attr of attrs) {
      const attrName = ATTR_NAMES[attr.attrId] || `Attr ${attr.attrId}`;
      const text = attr.text?.trim();
      if (!text) continue;

      if (attr.attrId === "7") {
        composition = text;
      }
      if (attr.attrId === "4") {
        text.split(/[,;\/]/).forEach((c) => {
          const color = c.trim();
          if (color) colors.push({ name: color, hex: "#CCCCCC" });
        });
      }
      specifications.push({ key: attrName, value: text });
    }

    const title = desc.name || model;
    const slug = transliterate(title) || `product-${productId}`;
    const cleanDesc = stripHtml(desc.description);
    const sku = model ? `${model}-${productId}` : undefined;

    products.push({
      productId,
      title,
      slug,
      description: cleanDesc || undefined,
      price,
      sku,
      inStock: quantity > 0,
      weight: weight > 0 ? weight : undefined,
      composition: composition || undefined,
      colors: colors.length ? colors : undefined,
      specifications: specifications.length ? specifications : undefined,
      sizes: sizes.length ? sizes : undefined,
      mainImage: imagePath,
      galleryImages: extraImages.map((i) => i.image),
      categoryDocId: strapiCatDocId,
      categorySlug: strapiCatSlug,
    });
  }

  console.log(`  Total products to migrate: ${products.length}`);

  // 4. Upload images and create products
  console.log("\n4. Uploading images and creating products...\n");
  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const prod of products) {
    let slug = prod.slug;
    const existing = await strapiGet("products", {
      "filters[slug][$eq]": slug,
    });
    if (existing?.data?.length) {
      slug = `${slug}-${prod.productId}`;
      const existing2 = await strapiGet("products", {
        "filters[slug][$eq]": slug,
      });
      if (existing2?.data?.length) {
        console.log(`  ⊘ Skip (exists): ${prod.title} [${slug}]`);
        skipped++;
        continue;
      }
    }

    // Upload main image
    let mainImageId = null;
    if (prod.mainImage) {
      const imgPath = path.join(IMAGES_ROOT, prod.mainImage);
      if (fs.existsSync(imgPath)) {
        mainImageId = await uploadFile(imgPath, prod.title);
        if (mainImageId) {
          process.stdout.write(`  ↑ img:${mainImageId}`);
        }
      }
    }

    // Upload gallery (max 5 extra images)
    const galleryIds = [];
    for (const gImg of prod.galleryImages.slice(0, 5)) {
      const gPath = path.join(IMAGES_ROOT, gImg);
      if (fs.existsSync(gPath)) {
        const gId = await uploadFile(gPath, `${prod.title} - фото`);
        if (gId) galleryIds.push(gId);
      }
    }

    // Create product
    const productData = {
      title: prod.title,
      slug,
      description: prod.description,
      price: prod.price,
      sku: prod.sku,
      inStock: prod.inStock,
      weight: prod.weight,
      composition: prod.composition,
      productType: "product",
      image: mainImageId || undefined,
      gallery: galleryIds.length ? galleryIds : undefined,
      colors: prod.colors,
      specifications: prod.specifications,
      sizes: prod.sizes,
    };

    const result = await strapiPost("products", productData);
    if (result?.data) {
      const docId = result.data.documentId;
      console.log(`  ✓ Created: ${prod.title} [${prod.slug}] → ${docId}`);

      // Link to category
      if (prod.categoryDocId) {
        const catRes = await fetch(
          `${STRAPI_URL}/api/products/${docId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: { category: { connect: [prod.categoryDocId] } },
            }),
          }
        );
        if (catRes.ok) {
          process.stdout.write(` [cat:${prod.categorySlug}]`);
        }
      }
      console.log("");
      created++;
    } else {
      errors++;
    }
  }

  console.log(`\n═══ Migration Complete ═══`);
  console.log(`  Created: ${created}, Skipped: ${skipped}, Errors: ${errors}`);
  console.log(`  Total in Strapi: ${created + skipped + 6} (including 6 seed products)\n`);
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
