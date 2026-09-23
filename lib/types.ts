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
