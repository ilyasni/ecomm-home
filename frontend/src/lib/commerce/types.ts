export interface CommerceProductRef {
  id: string;
  slug?: string;
  title: string;
  description?: string;
  image: string;
  price: string;
  oldPrice?: string;
  badge?: string;
}

export interface CommerceCartItem extends CommerceProductRef {
  quantity: number;
  color?: string;
  size?: string;
  isFavorite?: boolean;
}

export interface CommerceOrder {
  id: string;
  createdAt: string;
  total: string;
  status: string;
  items: CommerceCartItem[];
  customerName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  paymentMethod: string;
  deliveryMethod: string;
}

export interface CommerceSnapshot {
  cartItems: CommerceCartItem[];
  favorites: CommerceProductRef[];
  orders: CommerceOrder[];
}
