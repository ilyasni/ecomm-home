// Medusa v2 Store API types
// Used by customer auth and account pages

export interface MedusaAddress {
  id: string;
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  address_1: string | null;
  address_2: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  country_code: string | null;
  phone: string | null;
  is_default_shipping: boolean;
  is_default_billing: boolean;
}

export interface MedusaCustomer {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  company_name: string | null;
  addresses: MedusaAddress[];
  created_at: string;
  updated_at: string;
  metadata?: Record<string, unknown>;
}

export interface MedusaLineItem {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
  total: number;
  thumbnail: string | null;
}

export interface MedusaOrder {
  id: string;
  display_id: number;
  status: string;
  created_at: string;
  total: number;
  currency_code: string;
  email: string | null;
  items: MedusaLineItem[];
  shipping_address: MedusaAddress | null;
}
