"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { CheckCircle2 } from "lucide-react";
import { submitContactForm } from "@/app/actions/contact";
import { CONTACT_INITIAL_STATE } from "@/app/actions/contact.types";

function SubmitButton() {
  // useFormStatus reads the pending state of the nearest parent <form>
  // automatically — no manual isSubmitting state needed.
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto sm:px-8"
    >
      {pending ? "Sending..." : "Send Message"}
    </button>
  );
}

export default function ContactForm() {
  // useFormState wires the <form>'s action to our Server Action and gives
  // back whatever that action returns, re-rendered after each submission.
  const [state, formAction] = useFormState(submitContactForm, CONTACT_INITIAL_STATE);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card px-6 py-16 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-6 w-6 text-success" />
        </div>
        <h3 className="font-serif text-lg font-medium text-foreground">
          Message sent successfully
        </h3>
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
          {state.message}
        </p>
        <a
          href="/contact"
          className="mt-6 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
        >
          Send Another Message
        </a>
      </div>
    );
  }

  const errors = state.errors;

  return (
    <form
      ref={formRef}
      action={formAction}
      noValidate
      className="space-y-5 rounded-2xl border border-border bg-card p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={state.values.name}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary"
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-xs text-accent">{errors.name}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={state.values.email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary"
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-xs text-accent">{errors.email}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-foreground">
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          defaultValue={state.values.subject}
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? "subject-error" : undefined}
          className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary"
        />
        {errors.subject && (
          <p id="subject-error" className="mt-1 text-xs text-accent">{errors.subject}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          defaultValue={state.values.message}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="w-full resize-none rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary"
        />
        {errors.message && (
          <p id="message-error" className="mt-1 text-xs text-accent">{errors.message}</p>
        )}
      </div>

      <SubmitButton />
    </form>
  );
}
