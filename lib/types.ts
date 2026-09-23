export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  images: string[];
  description: string;
  details?: string[];
  colors?: string[];
  sizes?: string[];
  featured?: boolean;
  newArrival?: boolean;
  bestseller?: boolean;
  stock?: number;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  label: string;
  image: string;
  itemCount: number;
};

export type CartLine = {
  productId: string;
  quantity: number;
  color?: string;
  size?: string;
};

export type WishlistLine = {
  productId: string;
};

export type SortOption =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating";

export type ToastVariant = "success" | "info" | "error";

export type ToastMessage = {
  id: string;
  message: string;
  variant: ToastVariant;
};

export type PaymentMethod = "cod" | "card";

export type ShippingAddress = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

// A snapshot of a cart line taken at purchase time, so an order keeps showing
// the price/name it was bought at even if the catalog changes later.
export type OrderLine = {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
};

export type Order = {
  id: string;
  createdAt: string; // ISO date string
  lines: OrderLine[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: ShippingAddress;
  paymentMethod: PaymentMethod;
};