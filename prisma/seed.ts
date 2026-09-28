import { PrismaClient } from "@prisma/client";
import { products } from "../data/products";
import { categories } from "../data/categories";

const prisma = new PrismaClient();

async function main() {
  for (const c of categories) {
    const data = { name: c.name, slug: c.slug, label: c.label, image: c.image };
    await prisma.category.upsert({
      where: { id: c.id },
      update: data,
      create: { id: c.id, ...data },
    });
  }

  for (const p of products) {
    const { category, reviews, ...rest } = p;
    const data = { ...rest, reviewCount: reviews, categorySlug: category };
    await prisma.product.upsert({
      where: { id: p.id },
      update: data,
      create: data,
    });
  }

  console.log(`Seeded ${categories.length} categories, ${products.length} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());