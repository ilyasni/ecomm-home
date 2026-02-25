import type { StrapiResponse, StrapiListResponse } from "@/types/strapi";

const STRAPI_URL =
  process.env.STRAPI_INTERNAL_URL ?? process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export class StrapiHttpError extends Error {
  readonly status: number;
  readonly statusText: string;
  readonly path: string;

  constructor(status: number, statusText: string, path: string) {
    super(`Strapi API error: ${status} ${statusText} [${path}]`);
    this.name = "StrapiHttpError";
    this.status = status;
    this.statusText = statusText;
    this.path = path;
  }
}

interface FetchOptions {
  revalidate?: number | false;
  cache?: RequestCache;
  tags?: string[];
}

export function isPlaceholderToken(token: string | undefined): boolean {
  if (!token) return false;
  return token.includes("placeholder") || token.includes("replace-after");
}

export function getStrapiBaseUrl(): string {
  return STRAPI_URL;
}

export function hasUsableStrapiToken(): boolean {
  return Boolean(STRAPI_TOKEN && !isPlaceholderToken(STRAPI_TOKEN));
}

function buildHeaders(): HeadersInit {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (STRAPI_TOKEN && !isPlaceholderToken(STRAPI_TOKEN)) {
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

  const hasAuthHeader = Boolean((fetchOptions.headers as Record<string, string>).Authorization);
  let res = await fetch(url.toString(), fetchOptions);

  if (res.status === 401 && hasAuthHeader) {
    const retryHeaders = { ...(fetchOptions.headers as Record<string, string>) };
    delete retryHeaders.Authorization;
    res = await fetch(url.toString(), { ...fetchOptions, headers: retryHeaders });
  }

  if (!res.ok) {
    throw new StrapiHttpError(res.status, res.statusText, path);
  }

  return res.json();
}

export async function strapiPost<T = Record<string, unknown>>(
  path: string,
  body: Record<string, unknown>
): Promise<T> {
  const url = new URL(`/api${path}`, STRAPI_URL);
  const res = await fetch(url.toString(), {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Strapi API error: ${res.status} ${res.statusText} [${path}]`);
  }
  return res.json();
}

export async function strapiFind<T = Record<string, unknown>>(
  contentType: string,
  params?: Record<string, string>,
  options?: FetchOptions
): Promise<StrapiListResponse<T>> {
  return strapiGet<StrapiListResponse<T>>(`/${contentType}`, params, options);
}

export async function strapiFindOne<T = Record<string, unknown>>(
  contentType: string,
  documentId: string,
  params?: Record<string, string>,
  options?: FetchOptions
): Promise<StrapiResponse<T>> {
  return strapiGet<StrapiResponse<T>>(`/${contentType}/${documentId}`, params, options);
}

export async function strapiFindBySlug<T = Record<string, unknown>>(
  contentType: string,
  slug: string,
  params?: Record<string, string>,
  options?: FetchOptions
): Promise<StrapiResponse<T>> {
  const filterParams = {
    "filters[slug][$eq]": slug,
    ...params,
  };
  const response = await strapiGet<StrapiListResponse<T>>(`/${contentType}`, filterParams, options);

  if (!response.data || response.data.length === 0) {
    throw new Error(`Not found: ${contentType} with slug "${slug}"`);
  }

  return { data: response.data[0], meta: response.meta };
}

export async function strapiSingleType<T = Record<string, unknown>>(
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
