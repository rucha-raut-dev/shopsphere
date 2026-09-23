import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/lib/types";

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative block aspect-square overflow-hidden rounded-2xl bg-muted"
    >
      <Image
        src={category.image}
        alt={category.name}
        fill
        sizes="(min-width: 1024px) 18vw, 40vw"
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0 transition-opacity duration-300 group-hover:from-black/70" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
        <div>
          <p className="font-serif text-base font-medium text-white">{category.name}</p>
          <p className="text-xs text-white/75">{category.itemCount}+ items</p>
        </div>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <ArrowUpRight className="h-4 w-4 text-white" />
        </span>
      </div>
    </Link>
  );
}
