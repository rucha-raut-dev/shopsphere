"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      <div className="flex gap-3 overflow-x-auto no-scrollbar sm:w-20 sm:flex-col sm:overflow-visible">
        {images.map((img, i) => (
          <button
            key={img}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`View image ${i + 1} of ${name}`}
            aria-current={active === i}
            className={cn(
              "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-muted transition-colors sm:h-20 sm:w-20",
              active === i ? "border-primary" : "border-transparent hover:border-border"
            )}
          >
            <Image src={img} alt="" fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>

      <div className="relative aspect-square flex-1 overflow-hidden rounded-2xl bg-muted">
        <Image
          key={active}
          src={images[active]}
          alt={name}
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 90vw"
          className="animate-fade-in object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
    </div>
  );
}
