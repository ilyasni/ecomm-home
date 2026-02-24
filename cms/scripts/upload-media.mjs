/**
 * Скрипт загрузки изображений в Strapi 5 и привязки к контенту.
 * Strapi v5 best practice: upload first, then link to entry.
 *
 * Запуск: node cms/scripts/upload-media.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const TOKEN = process.env.STRAPI_API_TOKEN || "445c30fec01628915203e6620693e58679803465cc39de150d7482800760feb193d64d83a4655b5fb94cfffe2949fe74b5fe8c3eb08f7f13d3227f961d9140ce240b47b2842193c17776cc2bfbb2fb82f882d383bbc9d404c0e81b4fa780fc322d6a3b9e8d27dabcf5fc732c32273274d2a41975c565b475688964360a946c58";
const IMAGES_DIR = path.join(__dirname, "images");

const headers = { Authorization: `Bearer ${TOKEN}` };

// ─── helpers ───

async function uploadFile(filePath, altText) {
  const formData = new FormData();
  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath);
  const mime = ext === ".png" ? "image/png" : "image/jpeg";
  const blob = new Blob([fileBuffer], { type: mime });
  formData.append("files", blob, path.basename(filePath));
  formData.append("fileInfo", JSON.stringify({ alternativeText: altText }));

  const res = await fetch(`${STRAPI_URL}/api/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}` },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed ${res.status}: ${text}`);
  }

  const data = await res.json();
  const file = Array.isArray(data) ? data[0] : data;
  console.log(`  ✓ Uploaded: ${path.basename(filePath)} → id=${file.id}`);
  return file.id;
}

async function updateSingleType(apiId, data) {
  const res = await fetch(`${STRAPI_URL}/api/${apiId}`, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`  ✗ Update ${apiId} failed ${res.status}: ${text}`);
    return null;
  }
  console.log(`  ✓ Updated single type: ${apiId}`);
  return res.json();
}

async function updateEntry(apiId, documentId, data) {
  const res = await fetch(`${STRAPI_URL}/api/${apiId}/${documentId}`, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`  ✗ Update ${apiId}/${documentId} failed ${res.status}: ${text}`);
    return null;
  }
  console.log(`  ✓ Updated: ${apiId}/${documentId}`);
  return res.json();
}

async function getEntries(apiId, params = {}) {
  const url = new URL(`/api/${apiId}`, STRAPI_URL);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), { headers });
  if (!res.ok) return null;
  return res.json();
}

function img(name) {
  return path.join(IMAGES_DIR, name);
}

// ─── main ───

async function main() {
  console.log("\n═══ Strapi Media Upload ═══\n");

  // 1. Upload all images first
  console.log("1. Uploading images...\n");
  const ids = {};

  const uploads = [
    ["hero-slide-1.jpg", "Hero баннер - постельное белье"],
    ["hero-slide-2.jpg", "Hero баннер - коллекция"],
    ["hero-slide-3.jpg", "Hero баннер - сертификаты"],
    ["advantage-1.jpg", "Преимущество 1"],
    ["advantage-2.jpg", "Преимущество 2"],
    ["advantage-3.jpg", "Преимущество 3"],
    ["cat-bed-linen.jpg", "Категория - постельное белье"],
    ["cat-home-textile.jpg", "Категория - домашний текстиль"],
    ["cat-blankets.jpg", "Категория - одеяла"],
    ["cat-pillows.jpg", "Категория - подушки"],
    ["cat-plaids.jpg", "Категория - пледы"],
    ["cat-towels.jpg", "Категория - полотенца"],
    ["cat-boudoir.jpg", "Категория - будуарные наряды"],
    ["product-bed-spb.png", "Товар - КПБ Петербург"],
    ["product-pillow.png", "Товар - подушка"],
    ["product-blanket.png", "Товар - одеяло"],
    ["product-plaid.jpg", "Товар - плед"],
    ["product-towel.jpg", "Товар - полотенце"],
    ["product-cert.jpg", "Товар - подарочный сертификат"],
    ["about-hero.jpg", "О бренде - hero"],
    ["about-creating-1.jpg", "О бренде - создаем 1"],
    ["about-creating-2.jpg", "О бренде - создаем 2"],
    ["collection-light.jpg", "Коллекция Light"],
    ["collection-medium.jpg", "Коллекция Medium"],
    ["collection-premium.jpg", "Коллекция Premium"],
    ["cooperation-hero.jpg", "Сотрудничество - hero"],
    ["partnership.jpg", "Партнёрство"],
    ["contact-image.jpg", "Контакты"],
    ["boutique-1.jpg", "Бутик 1"],
    ["boutique-2.jpg", "Бутик 2"],
    ["certificate.jpg", "Подарочный сертификат"],
    ["loyalty-hero.jpg", "Программа лояльности"],
    ["article-1.jpg", "Статья 1"],
    ["article-2.jpg", "Статья 2"],
    ["article-3.jpg", "Статья 3"],
    ["article-4.jpg", "Статья 4"],
    ["offer-1.jpg", "Спецпредложение 1"],
    ["offer-2.jpg", "Спецпредложение 2"],
  ];

  for (const [filename, alt] of uploads) {
    const filePath = img(filename);
    if (!fs.existsSync(filePath)) {
      console.log(`  ⊘ Skipping (not found): ${filename}`);
      continue;
    }
    try {
      ids[filename.replace(/\.[^.]+$/, "")] = await uploadFile(filePath, alt);
    } catch (e) {
      console.error(`  ✗ Error uploading ${filename}: ${e.message}`);
    }
  }

  console.log(`\nUploaded ${Object.keys(ids).length} files\n`);

  // 2. Link images to Home Page
  console.log("2. Linking to Home Page...\n");
  const homeRes = await getEntries("home-page", { "populate[heroSlides]": "true", "populate[budgetCollections]": "true" });
  if (homeRes?.data) {
    const heroSlides = homeRes.data.heroSlides || [];
    const budgetColls = homeRes.data.budgetCollections || [];

    await updateSingleType("home-page", {
      certificateImage: ids["certificate"] || null,
      partnershipImage: ids["partnership"] || null,
      advantageImages: [ids["advantage-1"], ids["advantage-2"], ids["advantage-3"]].filter(Boolean),
      boutiquePhotos: [ids["boutique-1"], ids["boutique-2"]].filter(Boolean),
      heroSlides: heroSlides.map((slide, i) => ({
        ...slide,
        desktopImage: ids[`hero-slide-${i + 1}`] || null,
        mobileImage: ids[`hero-slide-${i + 1}`] || null,
      })),
      budgetCollections: budgetColls.map((coll, i) => {
        const collImages = [ids["collection-light"], ids["collection-medium"], ids["collection-premium"]];
        return { ...coll, image: collImages[i] || null };
      }),
    });
  }

  // 3. Link images to About Page
  console.log("\n3. Linking to About Page...\n");
  const aboutRes = await getEntries("about-page", {
    "populate[differenceItems]": "true",
    "populate[collectionPreviews]": "true",
    "populate[productionSteps]": "true",
    "populate[creatingBlocks]": "true",
  });
  if (aboutRes?.data) {
    const diffItems = aboutRes.data.differenceItems || [];
    const collPreviews = aboutRes.data.collectionPreviews || [];
    const prodSteps = aboutRes.data.productionSteps || [];
    const creatBlocks = aboutRes.data.creatingBlocks || [];
    const advImgs = [ids["advantage-1"], ids["advantage-2"], ids["advantage-3"]].filter(Boolean);
    const collImgs = [ids["collection-light"], ids["collection-medium"], ids["collection-premium"]];

    await updateSingleType("about-page", {
      heroDesktopImage: ids["about-hero"] || null,
      heroMobileImage: ids["about-hero"] || null,
      advantageImages: advImgs,
      differenceItems: diffItems.map((item, i) => ({
        ...item,
        image: advImgs[i] || null,
      })),
      collectionPreviews: collPreviews.map((item, i) => ({
        ...item,
        image: collImgs[i] || null,
      })),
      creatingBlocks: creatBlocks.map((block, i) => ({
        ...block,
        image: i === 0 ? (ids["about-creating-1"] || null) : (ids["about-creating-2"] || null),
      })),
    });
  }

  // 4. Link images to Cooperation Page
  console.log("\n4. Linking to Cooperation Page...\n");
  await updateSingleType("cooperation-page", {
    heroDesktopImage: ids["cooperation-hero"] || null,
    heroMobileImage: ids["cooperation-hero"] || null,
    advantageImages: [ids["advantage-1"], ids["advantage-2"], ids["advantage-3"]].filter(Boolean),
    partnershipFormImage: ids["partnership"] || null,
  });

  // 5. Link images to Contacts Page
  console.log("\n5. Linking to Contacts Page...\n");
  await updateSingleType("contacts-page", {
    image: ids["contact-image"] || null,
  });

  // 6. Link images to Loyalty Page
  console.log("\n6. Linking to Loyalty Page...\n");
  const loyaltyRes = await getEntries("loyalty-page", { "populate[balanceCheck]": "true" });
  if (loyaltyRes?.data) {
    const balanceCheck = loyaltyRes.data.balanceCheck;
    await updateSingleType("loyalty-page", {
      heroImage: ids["loyalty-hero"] || null,
      ...(balanceCheck ? {
        balanceCheck: { ...balanceCheck, image: ids["certificate"] || null },
      } : {}),
    });
  }

  // 7. Link images to Categories
  console.log("\n7. Linking to Categories...\n");
  const catRes = await getEntries("categories", { "pagination[pageSize]": "20" });
  if (catRes?.data) {
    const catImageMap = {
      "bed-linen": "cat-bed-linen",
      "home-textile": "cat-home-textile",
      blankets: "cat-blankets",
      pillows: "cat-pillows",
      plaids: "cat-plaids",
      towels: "cat-towels",
      boudoir: "cat-boudoir",
    };
    for (const cat of catRes.data) {
      const slug = cat.slug;
      const imageKey = catImageMap[slug];
      if (imageKey && ids[imageKey]) {
        await updateEntry("categories", cat.documentId, { image: ids[imageKey] });
      }
    }
  }

  // 8. Link images to Products
  console.log("\n8. Linking to Products...\n");
  const prodRes = await getEntries("products", { "pagination[pageSize]": "20" });
  if (prodRes?.data) {
    const prodImageMap = {
      "kpb-petersburg": "product-bed-spb",
      "podushka-classik": "product-pillow",
      "odeyalo-premium": "product-blanket",
      "pled-kashmir": "product-plaid",
      "polotentse-premium": "product-towel",
      "podarochnyj-sertifikat": "product-cert",
    };
    for (const prod of prodRes.data) {
      const imageKey = prodImageMap[prod.slug];
      if (imageKey && ids[imageKey]) {
        await updateEntry("products", prod.documentId, { image: ids[imageKey] });
      }
    }
  }

  // 9. Link images to Collections
  console.log("\n9. Linking to Collections...\n");
  const collRes = await getEntries("collections", { "pagination[pageSize]": "10" });
  if (collRes?.data) {
    const collImageMap = { light: "collection-light", medium: "collection-medium", premium: "collection-premium" };
    for (const coll of collRes.data) {
      const imageKey = collImageMap[coll.slug];
      if (imageKey && ids[imageKey]) {
        await updateEntry("collections", coll.documentId, {
          image: ids[imageKey],
          mediaImage: ids[imageKey],
          bannerImage: ids[imageKey],
          heroImages: [ids[imageKey]],
        });
      }
    }
  }

  // 10. Link images to Articles
  console.log("\n10. Linking to Articles...\n");
  const artRes = await getEntries("articles", { "pagination[pageSize]": "10" });
  if (artRes?.data) {
    for (let i = 0; i < artRes.data.length; i++) {
      const articleImageId = ids[`article-${i + 1}`];
      if (articleImageId) {
        await updateEntry("articles", artRes.data[i].documentId, { image: articleImageId });
      }
    }
  }

  // 11. Link images to Special Offers
  console.log("\n11. Linking to Special Offers...\n");
  const offersRes = await getEntries("special-offers-page", { "populate[offers]": "true", "populate[bonusSection]": "true" });
  if (offersRes?.data) {
    const offers = offersRes.data.offers || [];
    const bonusSection = offersRes.data.bonusSection;
    const offerImages = [ids["offer-1"], ids["offer-2"], ids["advantage-1"], ids["advantage-2"]];

    await updateSingleType("special-offers-page", {
      offers: offers.map((offer, i) => ({
        ...offer,
        image: offerImages[i % offerImages.length] || null,
      })),
      ...(bonusSection ? {
        bonusSection: { ...bonusSection, image: ids["certificate"] || null },
      } : {}),
    });
  }

  // 12. Link boutiques to contacts page
  console.log("\n12. Linking boutiques to Contacts Page...\n");
  const boutiquesRes = await getEntries("boutiques", { "pagination[pageSize]": "10" });
  if (boutiquesRes?.data?.length) {
    const boutiqueDocIds = boutiquesRes.data.map((b) => b.documentId);
    for (const b of boutiquesRes.data) {
      await updateEntry("boutiques", b.documentId, {
        mapImage: ids["boutique-1"] || null,
      });
    }
  }

  // 13. Link products to collections
  console.log("\n13. Linking products to Collections...\n");
  if (collRes?.data && prodRes?.data) {
    const productDocIds = prodRes.data.map((p) => p.documentId);
    for (const coll of collRes.data) {
      const prodSlice = productDocIds.slice(0, 2);
      await updateEntry("collections", coll.documentId, {
        products: prodSlice.map((id) => ({ documentId: id })),
      });
    }
  }

  // 14. Fill missing hitProducts on home page
  console.log("\n14. Filling hitProducts on Home Page...\n");
  if (prodRes?.data?.length) {
    const hitProducts = prodRes.data
      .filter((p) => p.slug !== "podarochnyj-sertifikat")
      .slice(0, 4)
      .map((p) => p.documentId);

    await updateSingleType("home-page", {
      hitProducts: hitProducts.map((id) => ({ documentId: id })),
      featuredProduct: { documentId: prodRes.data[0].documentId },
    });
  }

  console.log("\n═══ Done! ═══\n");
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
