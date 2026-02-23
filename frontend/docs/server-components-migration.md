# План миграции на Server Components

## Принцип

Текущий проект использует `"use client"` во всех компонентах. Для интеграции со Strapi
нужно разделить компоненты на:

- **Server Components** — страницы (`page.tsx`), которые fetch-ат данные из Strapi
- **Client Components** — интерактивные UI-компоненты (формы, модалки, карусели)

## Приоритет миграции

### Фаза 1 — HIGH (каталог и контент, влияет на SEO)

#### 1. Главная страница `/`

**Файл:** `src/app/page.tsx`

```typescript
// До: "use client" + статические моки
// После:
import { getHomePage, getHomeNews } from "@/lib/queries";
import { Hero } from "@/components/home/Hero";        // остаётся client (Swiper)
import { Categories } from "@/components/home/Categories"; // можно server
// ...

export default async function HomePage() {
  const [homePage, news] = await Promise.all([
    getHomePage(),
    getHomeNews(),
  ]);

  return (
    <>
      <Header variant="transparent" />
      <main>
        <Hero slides={homePage.data.attributes.heroSlides} />
        <Categories categories={homePage.data.attributes.categories.data} />
        {/* ... */}
      </main>
      <Footer />
    </>
  );
}

export async function generateMetadata() {
  return {
    title: "Vita Brava Home — премиальный домашний текстиль",
    description: "Интернет-магазин премиального постельного белья, подушек и пледов",
  };
}
```

#### 2. Каталог `/catalog`

**Файл:** `src/app/catalog/page.tsx`

```typescript
import { getCategories } from "@/lib/queries";
import { CategoriesGrid } from "@/components/catalog/CategoriesGrid";

export default async function CatalogPage() {
  const { data: categories } = await getCategories();
  return (
    <>
      <Header variant="solid" />
      <main>
        <CategoriesGrid categories={categories} />
      </main>
      <Footer />
    </>
  );
}
```

#### 3. Каталог товаров `/catalog/sets`

**Файл:** `src/app/catalog/sets/page.tsx`

```typescript
import { getSetProducts } from "@/lib/queries";
import { CatalogGrid } from "@/components/catalog/CatalogGrid";    // client (фильтры)
import { CatalogFilters } from "@/components/catalog/CatalogFilters"; // client

export default async function SetsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const { data: products, meta } = await getSetProducts({
    page: Number(params.page) || 1,
    sort: params.sort,
  });

  return (
    <>
      <Header variant="solid" />
      <main>
        <CatalogFilters />
        <CatalogGrid products={products} pagination={meta.pagination} />
      </main>
      <Footer />
    </>
  );
}
```

#### 4. Карточка товара `/catalog/[slug]`

**Файл:** `src/app/catalog/[slug]/page.tsx`

```typescript
import { getProductBySlug, getProducts } from "@/lib/queries";
import { ProductGallery } from "@/components/product/ProductGallery"; // client
import { ProductInfo } from "@/components/product/ProductInfo";       // client

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: product } = await getProductBySlug(slug);
  const { data: recommended } = await getProducts({ pageSize: 4 });

  return (
    <>
      <Header variant="solid" />
      <main>
        <ProductGallery images={product.attributes.gallery?.data ?? []} />
        <ProductInfo product={product} />
        <RecommendationsSlider products={recommended} />
      </main>
      <Footer />
    </>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: product } = await getProductBySlug(slug);
  return {
    title: `${product.attributes.title} — Vita Brava Home`,
    description: product.attributes.description,
  };
}
```

#### 5. Коллекция `/collections/[slug]`

**Файл:** `src/app/collections/[slug]/page.tsx`

```typescript
import { getCollectionBySlug } from "@/lib/queries";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: collection } = await getCollectionBySlug(slug);

  return (
    <>
      <Header variant="transparent" />
      <main>
        <CollectionHero collection={collection} />
        <CollectionDescription collection={collection} />
        <CollectionProducts products={collection.attributes.products.data} />
      </main>
      <Footer />
    </>
  );
}
```

### Фаза 2 — MEDIUM (контентные страницы)

#### 6. Новости `/news`

```typescript
import { getArticles } from "@/lib/queries";

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const { data: articles } = await getArticles({ category: params.category });
  return <NewsPageClient articles={articles} />;
}
```

#### 7. Статья `/news/[slug]`

```typescript
import { getArticleBySlug } from "@/lib/queries";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: article } = await getArticleBySlug(slug);

  return (
    <>
      <Header variant="solid" />
      <main>
        <ArticleTOC toc={article.attributes.toc} />
        <ArticleBody sections={article.attributes.sections} />
      </main>
      <Footer />
    </>
  );
}
```

#### 8. О бренде `/about`

```typescript
import { getAboutPage } from "@/lib/queries";

export default async function AboutPage() {
  const { data: about } = await getAboutPage();
  // Все секции About* рендерятся как server components
  return (
    <>
      <Header variant="transparent" />
      <main>
        <AboutHero hero={about.attributes.hero} />
        <AboutIntro text={about.attributes.intro} />
        {/* ... */}
      </main>
      <Footer />
    </>
  );
}
```

### Фаза 3 — LOW (редко меняющиеся страницы)

Контакты, сотрудничество, лояльность, покупателям, юридические страницы —
аналогично Фазе 2, через соответствующие query-функции.

## Компоненты, НЕ подлежащие миграции

Следующие компоненты остаются `"use client"` навсегда:

- **Header** — scroll-listener, menu toggle, dropdowns
- **Footer** — collapsible sections
- **Hero / Feedback / News** — Swiper carousel
- **ProductCard** — hover effects, favorites toggle, quick view
- **CatalogFilters / FiltersPanel / CatalogSort** — interactive filters
- **ProductGallery** — Swiper, zoom
- **ProductInfo** — size/color selection, add-to-cart
- **CartPage, CheckoutPage** — cart state management
- **Auth modals** — form state
- **Account forms** — form state
- **All design-system components** — interactive UI primitives

## Контрольный список перед миграцией каждой страницы

- [ ] Убрать `"use client"` из `page.tsx`
- [ ] Заменить импорт из `@/data/*` на вызов query-функции
- [ ] Сделать `page.tsx` async
- [ ] Передать данные в client-компоненты через props
- [ ] Добавить `generateMetadata()` для SEO
- [ ] Добавить error boundary (`error.tsx`)
- [ ] Добавить loading state (`loading.tsx`)
- [ ] Проверить работу с Strapi develop и production
- [ ] Обновить типы если структура данных из Strapi отличается от моков
