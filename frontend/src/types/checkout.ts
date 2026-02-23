export type PaymentMethodType = "card" | "certificate" | "on-delivery";
export type DeliveryMethodType = "courier" | "pickup" | "cdek";

export interface PaymentMethod {
  id: PaymentMethodType;
  label: string;
  description?: string;
}

export interface DeliveryMethod {
  id: DeliveryMethodType;
  label: string;
  price: string;
  duration: string;
}

export interface DeliveryCity {
  id: string;
  name: string;
  region: string;
}

export interface Boutique {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  workingHours: string;
}

export interface BoutiqueAddress {
  id: string;
  city: string;
  address: string;
  metro: string;
  metroDetail: string;
  schedule: string;
  scheduleTime: string;
  phone: string;
  email: string;
  mapImage: string;
}

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  isLegalEntity: boolean;
  companyName: string;
  inn: string;
  kpp: string;
  paymentMethod: PaymentMethodType;
  deliveryMethod: DeliveryMethodType;
  deliveryCity: string;
  deliveryAddress: string;
  boutiqueId: string;
  promoCode: string;
  bonusesToSpend: number;
  comment: string;
}

export interface SuccessOrderData {
  orderNumber: string;
  total: string;
  paymentLabel: string;
  status: string;
  statusDescription: string;
  deliveryAddress: string;
  deliveryDate: string;
  recipient: string;
  recipientPhone: string;
  products: { id: string; title: string; image: string; quantity: number }[];
}
