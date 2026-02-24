export interface StrapiResponse<T> {
  data: T & StrapiBaseFields;
  meta: StrapiMeta;
}

export interface StrapiListResponse<T> {
  data: (T & StrapiBaseFields)[];
  meta: StrapiMeta;
}

export interface StrapiBaseFields {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  locale?: string;
}

export interface StrapiMeta {
  pagination?: StrapiPagination;
}

export interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface StrapiMedia {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string | null;
  name: string;
  width: number;
  height: number;
  formats: {
    thumbnail?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
  } | null;
}

export interface StrapiImageFormat {
  url: string;
  width: number;
  height: number;
}

export type StrapiComponent<T> = T & { id: number };

export type StrapiDynamicZone<T> = T & { id: number; __component: string };
