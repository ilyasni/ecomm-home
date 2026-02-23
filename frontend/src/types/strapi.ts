export interface StrapiResponse<T> {
  data: StrapiEntity<T>;
  meta: StrapiMeta;
}

export interface StrapiListResponse<T> {
  data: StrapiEntity<T>[];
  meta: StrapiMeta;
}

export interface StrapiEntity<T> {
  id: number;
  attributes: T;
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
  attributes: {
    url: string;
    alternativeText: string | null;
    width: number;
    height: number;
    formats: {
      thumbnail?: StrapiImageFormat;
      small?: StrapiImageFormat;
      medium?: StrapiImageFormat;
      large?: StrapiImageFormat;
    } | null;
  };
}

export interface StrapiImageFormat {
  url: string;
  width: number;
  height: number;
}

export type StrapiRelation<T> = {
  data: StrapiEntity<T> | null;
};

export type StrapiRelationMany<T> = {
  data: StrapiEntity<T>[];
};
