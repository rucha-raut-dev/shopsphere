"use client";

import { CheckCircle2, Info, XCircle } from "lucide-react";
import type { ToastVariant } from "@/lib/types";
import { cn } from "@/lib/utils";

const ICONS: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle2 className="h-4 w-4 text-success" />,
  info: <Info className="h-4 w-4 text-primary" />,
  error: <XCircle className="h-4 w-4 text-accent" />,
};

export default function Toast({
  message,
  variant,
}: {
  message: string;
  variant: ToastVariant;
}) {
  return (
    <div
      role="status"
      className={cn(
        "pointer-events-auto flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 shadow-lift animate-slide-in-right"
      )}
    >
      {ICONS[variant]}
      <span className="text-sm font-medium text-foreground">{message}</span>
    </div>
  );
}
