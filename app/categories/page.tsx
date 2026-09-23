import type { Metadata } from "next";
import CategoryCard from "@/components/CategoryCard";
import { categories } from "@/data/categories";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse ShopSphere by category — fashion, footwear, accessories, home and beauty.",
};

export default function CategoriesPage() {
  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-medium text-foreground sm:text-4xl">
          Categories
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Shop by category to find exactly what you need, from wardrobe
          staples to home essentials.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
}
