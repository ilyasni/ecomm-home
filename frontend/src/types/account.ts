export interface AccountUser {
  firstName: string;
  lastName: string;
  initials: string;
  email: string;
  phone: string;
  birthDate: string;
  bonuses: number;
  city: string;
  region: string;
}

export interface BonusOperation {
  id: string;
  date: string;
  description: string;
  amount: number;
}

export interface OrderProduct {
  id: string;
  title: string;
  description: string;
  price: string;
  oldPrice?: string;
  image: string;
  badge?: string;
  colors?: { name: string; hex: string }[];
}

export type OrderStatus = "Получен" | "Отменён" | "В доставке" | "Обработка";

export interface Order {
  id: string;
  number: string;
  status: OrderStatus;
  date: string;
  deliveryType: string;
  deliveryAddress: string;
  deliveryDate: string;
  paymentMethod: string;
  total: string;
  products: OrderProduct[];
}

export interface Address {
  id: string;
  label: string;
  region: string;
  city: string;
  street: string;
  isPrimary: boolean;
}

export interface NotificationSetting {
  id: string;
  label: string;
  email: boolean;
  sms: boolean;
}

export interface CartItem {
  id: string;
  title: string;
  description: string;
  size?: string;
  color: string;
  price: string;
  oldPrice?: string;
  total: string;
  image: string;
  quantity: number;
  bonusReturn: number;
  isFavorite: boolean;
}
