export type MarketCode = "US" | "AU" | "CA" | "GB" | "NZ";

export type Money = {
  amount: number;
  currency: string;
};

export type ProductComponent = {
  id: string;
  name: string;
  rrp: Money;
  quantity: number;
  description: string;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  subtitle: string;
  description: string;
  images: string[];
  components: ProductComponent[];
  price: Money;
  compareAtPrice: Money;
  shippingIncluded: boolean;
  shippingNote: string;
  tags: string[];
  status: "active" | "draft" | "archived";
  inventory: number;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type ShippingAddress = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: MarketCode;
};

export type OrderStatus =
  | "pending"
  | "paid"
  | "fulfilled"
  | "cancelled"
  | "refunded";

export type Order = {
  id: string;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  market: MarketCode;
  items: Array<{
    productId: string;
    title: string;
    quantity: number;
    unitPrice: Money;
  }>;
  subtotal: Money;
  shipping: Money;
  total: Money;
  shippingAddress: ShippingAddress;
  notes?: string;
};

export type Market = {
  code: MarketCode;
  name: string;
  currency: string;
  locale: string;
  flag: string;
  shippingLabel: string;
  enabled: boolean;
  default?: boolean;
};
