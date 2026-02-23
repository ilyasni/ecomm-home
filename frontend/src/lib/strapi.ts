import type { StrapiResponse, StrapiListResponse } from "@/types/strapi";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

interface FetchOptions {
  revalidate?: number | false;
  cache?: RequestCache;
  tags?: string[];
}

function buildHeaders(): HeadersInit {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (STRAPI_TOKEN) {
    headers["Authorization"] = `Bearer ${STRAPI_TOKEN}`;
  }
  return headers;
}

export async function strapiGet<T>(
  path: string,
  params?: Record<string, string>,
  options: FetchOptions = {}
): Promise<T> {
  const url = new URL(`/api${path}`, STRAPI_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const fetchOptions: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } } = {
    headers: buildHeaders(),
  };

  if (options.cache) {
    fetchOptions.cache = options.cache;
  } else if (options.revalidate !== undefined) {
    fetchOptions.next = { revalidate: options.revalidate };
  } else {
    fetchOptions.next = { revalidate: 60 };
  }

  if (options.tags) {
    fetchOptions.next = { ...fetchOptions.next, tags: options.tags };
  }

  const res = await fetch(url.toString(), fetchOptions);

  if (!res.ok) {
    throw new Error(`Strapi API error: ${res.status} ${res.statusText} [${path}]`);
  }

  return res.json();
}

export async function strapiFind<T>(
  contentType: string,
  params?: Record<string, string>,
  options?: FetchOptions
): Promise<StrapiListResponse<T>> {
  return strapiGet<StrapiListResponse<T>>(`/${contentType}`, params, options);
}

export async function strapiFindOne<T>(
  contentType: string,
  id: string | number,
  params?: Record<string, string>,
  options?: FetchOptions
): Promise<StrapiResponse<T>> {
  return strapiGet<StrapiResponse<T>>(`/${contentType}/${id}`, params, options);
}

export async function strapiFindBySlug<T>(
  contentType: string,
  slug: string,
  params?: Record<string, string>,
  options?: FetchOptions
): Promise<StrapiResponse<T>> {
  const filterParams = {
    "filters[slug][$eq]": slug,
    ...params,
  };
  const response = await strapiGet<StrapiListResponse<T>>(
    `/${contentType}`,
    filterParams,
    options
  );

  if (!response.data || response.data.length === 0) {
    throw new Error(`Not found: ${contentType} with slug "${slug}"`);
  }

  return { data: response.data[0], meta: response.meta };
}

export async function strapiSingleType<T>(
  contentType: string,
  params?: Record<string, string>,
  options?: FetchOptions
): Promise<StrapiResponse<T>> {
  return strapiGet<StrapiResponse<T>>(`/${contentType}`, params, options);
}

export function getStrapiMediaUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const base = process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL ?? STRAPI_URL;
  return `${base}${path}`;
}
