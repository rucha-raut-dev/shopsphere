import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the ShopSphere team for support, questions or feedback.",
};

const INFO = [
  {
    icon: Mail,
    title: "Email Us",
    lines: ["support@shopsphere.example", "We reply within 24 hours"],
  },
  {
    icon: Phone,
    title: "Call Us",
    lines: ["+1 (555) 010-2024", "Mon–Fri, 9am–6pm EST"],
  },
  {
    icon: MapPin,
    title: "Visit Us",
    lines: ["148 Market Street", "San Francisco, CA 94103"],
  },
  {
    icon: Clock,
    title: "Support Hours",
    lines: ["Monday – Friday: 9am – 6pm", "Saturday: 10am – 4pm"],
  },
];

export default function ContactPage() {
  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mb-10 max-w-xl">
        <h1 className="font-serif text-3xl font-medium text-foreground sm:text-4xl">
          Get in Touch
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Have a question about an order, a product, or anything else?
          Send us a message and our team will get back to you shortly.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {INFO.map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
              {item.lines.map((line) => (
                <p key={line} className="mt-0.5 text-sm text-muted-foreground">
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
