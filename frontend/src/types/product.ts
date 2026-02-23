export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  price: string;
  oldPrice?: string;
  image: string;
  badge?: string;
  rating?: number;
  colors?: ProductColor[];
  sku?: string;
  inStock?: boolean;
  type?: "product" | "giftCertificate";
  subtitle?: string;
  giftCertDescription?: string;
}

export interface SizeOption {
  value: string;
  label: string;
}

export interface SetItem {
  id: string;
  title: string;
  subtitle?: string;
  price: string;
  oldPrice?: string;
  image: string;
  sizes: SizeOption[];
}
