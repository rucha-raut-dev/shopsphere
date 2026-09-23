"use server";

// This file only ever runs on the server. Nothing in here — not even the
// validation logic — is sent to the browser as JavaScript.
//
// Important: a "use server" file may only export async functions. A plain
// constant (like an initial-state object) exported from here would silently
// become `undefined` on the client, so shared types/constants live in
// ./contact.types.ts instead and get imported from there.

import type { ContactFormState } from "./contact.types";

function validate(values: ContactFormState["values"]) {
  const errors: ContactFormState["errors"] = {};
  if (values.name.trim().length < 2) {
    errors.name = "Please enter your full name.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (values.subject.trim().length < 3) {
    errors.subject = "Please add a short subject.";
  }
  if (values.message.trim().length < 10) {
    errors.message = "Message should be at least 10 characters.";
  }
  return errors;
}

/**
 * Server Action. Bound directly to <form action={...}> in ContactForm.
 * `prevState` is supplied automatically by useFormState on the client.
 */
export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  const errors = validate(values);
  if (Object.keys(errors).length > 0) {
    return { status: "error", errors, values };
  }

  // Simulate real server work (e.g. sending an email, hitting a CRM API,
  // writing to a database). Replace this with a real integration later.
  await new Promise((resolve) => setTimeout(resolve, 600));
  console.log("[contact] new message received:", values);

  return {
    status: "success",
    errors: {},
    message: "Thanks for reaching out — our team will get back to you within 1-2 business days.",
    values: { name: "", email: "", subject: "", message: "" },
  };
}
