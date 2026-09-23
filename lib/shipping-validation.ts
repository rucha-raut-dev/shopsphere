import type { ShippingAddress } from "@/lib/types";

export type ShippingFieldErrors = Partial<Record<keyof ShippingAddress, string>>;

// Order matters: on a failed submit the UI focuses the first invalid field
// in this order.
export const SHIPPING_FIELD_ORDER: Array<keyof ShippingAddress> = [
  "fullName",
  "email",
  "phone",
  "address",
  "city",
  "state",
  "postalCode",
  "country",
];

export function validateShippingAddress(form: ShippingAddress): ShippingFieldErrors {
  const errors: ShippingFieldErrors = {};
  const phoneDigits = form.phone.replace(/\D/g, "");

  if (form.fullName.trim().length < 2) errors.fullName = "Please enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
    errors.email = "Enter a valid email address.";
  if (!/^[+\d\s\-()]+$/.test(form.phone) || phoneDigits.length < 7 || phoneDigits.length > 15)
    errors.phone = "Enter a valid phone number (7 to 15 digits).";
  if (form.address.trim().length < 5) errors.address = "Please enter your street address.";
  if (form.city.trim().length < 2) errors.city = "Please enter your city.";
  if (form.state.trim().length < 2) errors.state = "Please enter your state or region.";
  if (!/^[A-Za-z0-9][A-Za-z0-9\s-]{2,9}$/.test(form.postalCode.trim()))
    errors.postalCode = "Enter a valid postal code.";
  if (!form.country) errors.country = "Please choose a country.";

  return errors;
}
