import { Product } from "@/lib/types";

export const products: Product[] = [
  {
    id: "p-01",
    name: "Linen Blend Shirt",
    slug: "linen-blend-shirt",
    category: "fashion",
    price: 49,
    originalPrice: 65,
    rating: 4.6,
    reviews: 128,
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=900&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1602810319428-019690571b5b?w=1200&q=80&auto=format&fit=crop",
    ],
    description:
      "A breathable linen-cotton blend shirt cut for a relaxed, everyday fit. Garment-dyed for a soft, lived-in feel from the first wear.",
    details: [
      "55% linen, 45% cotton",
      "Relaxed fit, mid-weight fabric",
      "Machine washable, cold",
      "Made in Portugal",
    ],
    colors: ["Sage", "Sand", "Charcoal"],
    sizes: ["S", "M", "L", "XL"],
    featured: true,
    bestseller: true,
    stock: 24,
  },
  {
    id: "p-02",
    name: "Minimal Leather Sneakers",
    slug: "minimal-leather-sneakers",
    category: "footwear",
    price: 79,
    rating: 4.8,
    reviews: 204,
    image:
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=900&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=1200&q=80&auto=format&fit=crop",
    ],
    description:
      "Clean-lined leather sneakers with a cushioned footbed built for all-day wear. A wardrobe staple that pairs with everything.",
    details: [
      "Full-grain leather upper",
      "Cushioned rubber outsole",
      "Padded collar for comfort",
      "True to size",
    ],
    colors: ["White", "Off-White"],
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
    featured: true,
    newArrival: true,
    stock: 40,
  },
  {
    id: "p-03",
    name: "Hand-Poured Scented Candle",
    slug: "hand-poured-scented-candle",
    category: "home-living",
    price: 26,
    rating: 4.7,
    reviews: 96,
    image:
      "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=900&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1200&q=80&auto=format&fit=crop",
    ],
    description:
      "A slow-burning soy candle with notes of cedar, amber and sandalwood. Poured by hand in small batches into a reusable ceramic vessel.",
    details: [
      "100% natural soy wax",
      "40+ hour burn time",
      "Reusable ceramic vessel",
      "Cotton wick, no lead",
    ],
    featured: true,
    stock: 60,
  },
  {
    id: "p-04",
    name: "Woven Straw Hat",
    slug: "woven-straw-hat",
    category: "accessories",
    price: 35,
    originalPrice: 45,
    rating: 4.4,
    reviews: 58,
    image:
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=900&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1612965292639-cd322db5ff9e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8V292ZW4lMjBTdHJhdyUyMEhhdHxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aGF0fGVufDB8fDB8fHww%3D%3D",
    ],
    description:
      "A wide-brim straw hat woven from natural fibers, finished with a grosgrain band. Lightweight structure that holds its shape.",
    details: [
      "Natural straw weave",
      "Grosgrain ribbon trim",
      "One size, adjustable inner band",
      "Spot clean only",
    ],
    colors: ["Natural"],
    stock: 30,
  },
  {
    id: "p-05",
    name: "Gold Hoop Earrings",
    slug: "gold-hoop-earrings",
    category: "accessories",
    price: 19,
    rating: 4.5,
    reviews: 142,
    image:
      "https://images.unsplash.com/photo-1723802205505-2f88b2227718?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZWFycmluZ3xlbnwwfHwwfHx8MA%3D%3D",
    images: [
      "https://images.unsplash.com/photo-1723802205505-2f88b2227718?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZWFycmluZ3xlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1786052336915-b0bb483f746e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjZ8fGdvbGQlMjBob29wJTIwZWFycmluZ3xlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1765560172744-dcc030763771?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTh8fGdvbGQlMjBob29wJTIwZWFycmluZ3xlbnwwfHwwfHx8MA%3D%3D",
    ],
    description:
      "Lightweight 14k gold-plated hoops with a polished finish. Small enough for daily wear, bold enough to notice.",
    details: [
      "14k gold plated brass",
      "Hypoallergenic posts",
      "Diameter: 3cm",
      "Tarnish resistant",
    ],
    newArrival: true,
    stock: 75,
  },
  {
    id: "p-06",
    name: "Structured Canvas Tote",
    slug: "structured-canvas-tote",
    category: "accessories",
    price: 59,
    rating: 4.6,
    reviews: 87,
    image:
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=900&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1606522754091-a3bbf9ad4cb3?q=80&w=542&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1683921590274-a83862cb11c3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aGFuZCUyMGJhZ3N8ZW58MHx8MHx8fDA%3D%3D",
    ],
    description:
      "A structured tote in heavyweight canvas with leather handles. Roomy enough for daily essentials, tidy enough for the office.",
    details: [
      "Heavyweight cotton canvas",
      "Vegetable-tanned leather handles",
      "Interior zip pocket",
      "H30 x W40 x D12 cm",
    ],
    colors: ["Sage", "Black", "Natural"],
    bestseller: true,
    stock: 22,
  },
  {
    id: "p-07",
    name: "Ceramic Table Vase",
    slug: "ceramic-table-vase",
    category: "home-living",
    price: 42,
    rating: 4.3,
    reviews: 41,
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1587310141549-3b6c2b8d3f4f?w=1200&q=80&auto=format&fit=crop",
    ],
    description:
      "A stoneware vase with a matte glaze and subtle organic curve. Equally at home with a single stem or a full arrangement.",
    details: [
      "Hand-finished stoneware",
      "Matte glaze finish",
      "Height: 28cm",
      "Water-safe interior",
    ],
    newArrival: true,
    stock: 18,
  },
  {
    id: "p-08",
    name: "Everyday Skincare Duo",
    slug: "everyday-skincare-duo",
    category: "beauty",
    price: 38,
    originalPrice: 48,
    rating: 4.7,
    reviews: 163,
    image:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=900&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&q=80&auto=format&fit=crop",
    ],
    description:
      "A cleanser and moisturizer duo formulated with ceramides and niacinamide to support the skin barrier, for all skin types.",
    details: [
      "Fragrance-free formula",
      "Ceramides + niacinamide",
      "Dermatologist tested",
      "Cruelty-free",
    ],
    featured: true,
    stock: 50,
  },
  {
    id: "p-09",
    name: "Chunky Knit Cardigan",
    slug: "chunky-knit-cardigan",
    category: "fashion",
    price: 89,
    rating: 4.8,
    reviews: 76,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80&auto=format&fit=crop",
    ],
    description:
      "An oversized cardigan in a chunky wool blend knit. Deep patch pockets and horn-style buttons finish the look.",
    details: [
      "70% wool, 30% acrylic blend",
      "Oversized fit",
      "Horn-style button closure",
      "Hand wash cold",
    ],
    colors: ["Oatmeal", "Charcoal", "Terracotta"],
    sizes: ["S", "M", "L"],
    newArrival: true,
    bestseller: true,
    stock: 15,
  },
  {
    id: "p-10",
    name: "Suede Ankle Boots",
    slug: "suede-ankle-boots",
    category: "footwear",
    price: 118,
    originalPrice: 140,
    rating: 4.5,
    reviews: 63,
    image:
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=900&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=1200&q=80&auto=format&fit=crop",
    ],
    description:
      "Classic ankle boots in soft suede with a stacked block heel. A versatile pair that transitions easily from day to evening.",
    details: [
      "Genuine suede upper",
      "Stacked block heel, 4cm",
      "Side zip closure",
      "Cushioned insole",
    ],
    colors: ["Cognac", "Black"],
    sizes: ["36", "37", "38", "39", "40", "41"],
    stock: 20,
  },
  {
    id: "p-11",
    name: "Merino Wool Scarf",
    slug: "merino-wool-scarf",
    category: "accessories",
    price: 45,
    rating: 4.6,
    reviews: 34,
    image:
      "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=900&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1609803384069-19f3e5a70e75?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TWVyaW5vJTIwV29vbCUyMFNjYXJmfGVufDB8fDB8fHww%3D%3D",
      "https://images.unsplash.com/photo-1667583920371-24af045b965e?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    description:
      "A featherweight merino wool scarf, soft against the skin and warm without the bulk. Finished with hand-tied fringe.",
    details: [
      "100% merino wool",
      "Hand-tied fringe edge",
      "W30 x L180 cm",
      "Dry clean recommended",
    ],
    colors: ["Camel", "Forest", "Grey"],
    stock: 28,
  },
  {
    id: "p-12",
    name: "Linen Throw Pillow Cover",
    slug: "linen-throw-pillow-cover",
    category: "home-living",
    price: 24,
    rating: 4.4,
    reviews: 52,
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=1200&q=80&auto=format&fit=crop",
    ],
    description:
      "Stonewashed linen pillow cover with a hidden zip closure. Softens with every wash for an effortlessly lived-in look.",
    details: [
      "100% stonewashed linen",
      "Hidden zip closure",
      "Fits 45x45cm insert",
      "Machine washable",
    ],
    colors: ["Sand", "Sage", "White"],
    stock: 45,
  },
  {
    id: "p-13",
    name: "Botanical Hand Cream Set",
    slug: "botanical-hand-cream-set",
    category: "beauty",
    price: 22,
    rating: 4.5,
    reviews: 71,
    image:
      "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=900&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=1200&q=80&auto=format&fit=crop",
    ],
    description:
      "A trio of fast-absorbing hand creams infused with shea butter and botanical extracts, in a travel-friendly set.",
    details: [
      "Shea butter + botanical extracts",
      "Set of 3, 30ml each",
      "Non-greasy, fast-absorbing",
      "Cruelty-free",
    ],
    newArrival: true,
    stock: 55,
  },
  {
    id: "p-14",
    name: "Tailored Wide-Leg Trousers",
    slug: "tailored-wide-leg-trousers",
    category: "fashion",
    price: 69,
    originalPrice: 85,
    rating: 4.6,
    reviews: 47,
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=900&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=80&auto=format&fit=crop",
    ],
    description:
      "Wide-leg trousers with a high waist and clean tailoring. Cut from a fluid fabric that drapes beautifully and moves with you.",
    details: [
      "97% viscose, 3% elastane",
      "High-rise, wide-leg fit",
      "Concealed side zip",
      "Machine washable",
    ],
    colors: ["Black", "Sand"],
    sizes: ["XS", "S", "M", "L"],
    bestseller: true,
    stock: 26,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug || p.id === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.category === categorySlug);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}
