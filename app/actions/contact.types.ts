export type ContactFormState = {
  status: "idle" | "success" | "error";
  errors: {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  };
  message?: string;
  // Echo the submitted values back so the form can re-render them
  // after a server round-trip without losing what the user typed.
  values: {
    name: string;
    email: string;
    subject: string;
    message: string;
  };
};

export const CONTACT_INITIAL_STATE: ContactFormState = {
  status: "idle",
  errors: {},
  values: { name: "", email: "", subject: "", message: "" },
};
