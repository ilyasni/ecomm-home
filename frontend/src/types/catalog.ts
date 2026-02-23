export interface CategoryCard {
  id: string;
  title: string;
  count: number;
  image: string;
  isWide?: boolean;
}

export interface CatalogSubcategory {
  label: string;
  href: string;
}

export interface FilterOption {
  label: string;
  href: string;
}

export interface CatalogFilter {
  title: string;
  options: FilterOption[];
}

export interface CatalogCategory {
  id: string;
  label: string;
  icon?: string;
  href: string;
  subcategories?: CatalogSubcategory[];
  filters?: CatalogFilter[];
}
