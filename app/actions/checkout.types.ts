import type { Order, ShippingAddress } from "@/lib/types";
import type { ShippingFieldErrors } from "@/lib/shipping-validation";

export type CheckoutFormState = {
  status: "idle" | "success" | "error";
  fieldErrors: ShippingFieldErrors;
  // A problem that isn't tied to one field, e.g. "out of stock".
  formError?: string;
  values: ShippingAddress;
  // Only present on success — the authoritative order the server computed.
  order?: Order;
};

export const CHECKOUT_INITIAL_STATE: CheckoutFormState = {
  status: "idle",
  fieldErrors: {},
  values: {
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
  },
};
