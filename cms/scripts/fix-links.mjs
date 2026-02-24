/**
 * Исправление привязок: компоненты без id, связи через connect.
 * Strapi v5: компоненты не принимают id, связи через connect/set.
 */

const STRAPI_URL = "http://localhost:1337";
const TOKEN = "445c30fec01628915203e6620693e58679803465cc39de150d7482800760feb193d64d83a4655b5fb94cfffe2949fe74b5fe8c3eb08f7f13d3227f961d9140ce240b47b2842193c17776cc2bfbb2fb82f882d383bbc9d404c0e81b4fa780fc322d6a3b9e8d27dabcf5fc732c32273274d2a41975c565b475688964360a946c58";
const headers = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };

function stripIds(obj) {
  if (Array.isArray(obj)) return obj.map(stripIds);
  if (obj && typeof obj === "object") {
    const { id, ...rest } = obj;
    return Object.fromEntries(Object.entries(rest).map(([k, v]) => [k, stripIds(v)]));
  }
  return obj;
}

async function get(path, params = {}) {
  const url = new URL(`/api/${path}`, STRAPI_URL);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${TOKEN}` } });
  return res.ok ? res.json() : null;
}

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
  console.log("\n═══ Fix Strapi Links ═══\n");

  // --- Home Page ---
  console.log("Home Page...");
  const home = await get("home-page", {
    "populate[heroSlides][populate]": "*",
    "populate[budgetCollections][populate]": "*",
    "populate[advantages]": "true",
    "populate[feedbacks]": "true",
  });
  if (home?.data) {
    const d = home.data;
    const heroSlides = (d.heroSlides || []).map((s, i) => {
      const { id, desktopImage, mobileImage, ...rest } = s;
      return { ...rest, desktopImage: i + 1, mobileImage: i + 1 };
    });
    const budgetCollections = (d.budgetCollections || []).map((c, i) => {
      const { id, image, ...rest } = c;
      return { ...rest, image: 23 + i };
    });
    const advantages = (d.advantages || []).map((a) => {
      const { id, ...rest } = a;
      return rest;
    });
    const feedbacks = (d.feedbacks || []).map((f) => {
      const { id, ...rest } = f;
      return rest;
    });

    await put("home-page", {
      heroSlides,
      budgetCollections,
      advantages,
      feedbacks,
      certificateImage: 31,
      partnershipImage: 27,
      advantageImages: [4, 5, 6],
      boutiquePhotos: [29, 30],
    });
  }

  // --- About Page ---
  console.log("\nAbout Page...");
  const about = await get("about-page", {
    "populate[advantages]": "true",
    "populate[differenceItems][populate]": "*",
    "populate[collectionPreviews][populate]": "*",
    "populate[productionSteps]": "true",
    "populate[creatingBlocks][populate]": "*",
  });
  if (about?.data) {
    const d = about.data;
    await put("about-page", {
      heroDesktopImage: 20,
      heroMobileImage: 20,
      advantageImages: [4, 5, 6],
      advantages: (d.advantages || []).map(({ id, ...r }) => r),
      differenceItems: (d.differenceItems || []).map(({ id, image, ...r }, i) => ({
        ...r,
        image: 4 + i,
      })),
      collectionPreviews: (d.collectionPreviews || []).map(({ id, image, ...r }, i) => ({
        ...r,
        image: 23 + i,
      })),
      productionSteps: (d.productionSteps || []).map(({ id, icon, ...r }) => r),
      creatingBlocks: (d.creatingBlocks || []).map(({ id, image, ...r }, i) => ({
        ...r,
        image: i === 0 ? 21 : 22,
      })),
    });
  }

  // --- Special Offers Page ---
  console.log("\nSpecial Offers Page...");
  const offers = await get("special-offers-page", {
    "populate[offers][populate]": "*",
    "populate[bonusSection][populate]": "*",
  });
  if (offers?.data) {
    const d = offers.data;
    const offerImgs = [37, 38, 4, 5];
    await put("special-offers-page", {
      offers: (d.offers || []).map(({ id, image, ...r }, i) => ({
        ...r,
        image: offerImgs[i % offerImgs.length],
      })),
      ...(d.bonusSection ? {
        bonusSection: (() => {
          const { id, image, ...r } = d.bonusSection;
          return { ...r, image: 31 };
        })(),
      } : {}),
    });
  }

  // --- Loyalty Page ---
  console.log("\nLoyalty Page...");
  const loyalty = await get("loyalty-page", {
    "populate[balanceCheck][populate]": "*",
    "populate[steps]": "true",
    "populate[faq]": "true",
  });
  if (loyalty?.data) {
    const d = loyalty.data;
    const updateData = {
      heroImage: 32,
      steps: (d.steps || []).map(({ id, ...r }) => r),
      faq: (d.faq || []).map(({ id, ...r }) => r),
    };
    if (d.balanceCheck) {
      const { id, image, ...r } = d.balanceCheck;
      updateData.balanceCheck = { ...r, image: 31 };
    }
    await put("loyalty-page", updateData);
  }

  // --- Collections: link products via connect ---
  console.log("\nCollections - linking products...");
  const prods = await get("products", { "pagination[pageSize]": "20" });
  const colls = await get("collections", { "pagination[pageSize]": "10" });
  if (prods?.data && colls?.data) {
    const prodIds = prods.data.filter((p) => p.slug !== "podarochnyj-sertifikat").map((p) => p.documentId);
    for (const coll of colls.data) {
      await put(`collections/${coll.documentId}`, {
        products: { connect: prodIds },
      });
    }
  }

  // --- Home Page: link hitProducts ---
  console.log("\nHome Page - hitProducts...");
  if (prods?.data) {
    const hitIds = prods.data
      .filter((p) => p.slug !== "podarochnyj-sertifikat")
      .slice(0, 4)
      .map((p) => p.documentId);
    const featuredId = prods.data[0]?.documentId;
    await put("home-page", {
      hitProducts: { connect: hitIds },
      ...(featuredId ? { featuredProduct: { connect: [featuredId] } } : {}),
    });
  }

  // --- Contacts: link boutiques ---
  console.log("\nContacts Page - boutiques...");
  const bouts = await get("boutiques", { "pagination[pageSize]": "10" });
  if (bouts?.data) {
    const boutIds = bouts.data.map((b) => b.documentId);
    await put("contacts-page", {
      boutiques: { connect: boutIds },
    });
  }

  // --- Search config: link featured products ---
  console.log("\nSearch Config - featured products...");
  if (prods?.data) {
    const featuredIds = prods.data.slice(0, 3).map((p) => p.documentId);
    await put("search-config", {
      featuredProducts: { connect: featuredIds },
    });
  }

  console.log("\n═══ Done! ═══\n");
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
