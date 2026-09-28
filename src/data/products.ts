export type ProductSize = {
  id: string;
  label: string;
  available: boolean;
};

export type ProductColour = {
  id: string;
  name: string;
  hex: string;
  image?: string;
};

export type ProductMeasurement = {
  name: string;
  unit?: string;
  bySize: Record<string, string>;
};

export type ProductMediaSources = {
  primary?: string;
  hover?: string;
  gallery?: string[];
};

export type ShopProduct = {
  id: string;
  slug: string;
  name: string;
  colour: string;
  colours: number;
  price: string;
  priceValue: number;
  compareAtPrice?: string;
  currency: "GBP";
  featured: boolean;
  swatches: string[];
  media: ProductMediaSources;
  category: string;
  subcategory?: string;
  fit?: string;
  colourVariants: ProductColour[];
  sizes: ProductSize[];
  descriptor?: string;
  description?: string;
  fitNotes?: string;
  fabric?: string;
  composition?: string;
  care?: string;
  construction?: string;
  countryOfManufacture?: string;
  measurements?: ProductMeasurement[];
  relatedProductIds: string[];
  shopTheLookIds: string[];
  group?: string;
  isNew?: boolean;
  isSale?: boolean;
  status: "active" | "sold-out";
};

const denimSizes = (unavailable: string[] = []): ProductSize[] =>
  ["28", "30", "32", "34", "36", "38"].map((label) => ({
    id: label,
    label,
    available: !unavailable.includes(label),
  }));

const letterSizes = (unavailable: string[] = []): ProductSize[] =>
  ["XS", "S", "M", "L", "XL"].map((label) => ({
    id: label,
    label,
    available: !unavailable.includes(label),
  }));

const colour = (
  id: string,
  name: string,
  hex: string,
  image?: string,
): ProductColour => ({
  id,
  name,
  hex,
  image,
});

function colourwayFamily(spec: {
  group: string;
  name: string;
  price: string;
  priceValue: number;
  category: string;
  fit: string;
  descriptor: string;
  variants: ProductColour[];
  relatedProductIds: string[];
  shopTheLookIds: string[];
}): ShopProduct[] {
  const pictured = spec.variants.filter((entry) => entry.image);
  return pictured.map((entry) => ({
    id: `${spec.group}-${entry.id}`,
    slug: `${spec.group}-${entry.id}`,
    group: spec.group,
    name: spec.name,
    colour: entry.name,
    colours: pictured.length,
    price: spec.price,
    priceValue: spec.priceValue,
    currency: "GBP",
    featured: true,
    swatches: pictured.map((item) => item.hex),
    media: { primary: entry.image },
    category: spec.category,
    fit: spec.fit,
    colourVariants: pictured,
    sizes: letterSizes(),
    descriptor: spec.descriptor,
    relatedProductIds: spec.relatedProductIds,
    shopTheLookIds: spec.shopTheLookIds,
    isNew: true,
    status: "active",
  }));
}

const catalog: ShopProduct[] = [
  {
    id: "1",
    slug: "reevear-stripe-rugby",
    name: "Reevear Stripe Rugby",
    colour: "Mist Sage",
    colours: 3,
    price: "£49",
    priceValue: 49,
    currency: "GBP",
    featured: true,
    swatches: ["#9CAF9A", "#1a1a1a", "#e8e4dc"],
    media: {},
    category: "shirts",
    subcategory: "rugby",
    colourVariants: [
      colour("mist-sage", "Mist Sage", "#9CAF9A"),
      colour("ink", "Ink", "#1a1a1a"),
      colour("bone", "Bone", "#e8e4dc"),
    ],
    sizes: letterSizes(),
    descriptor: "Striped rugby shirt.",
    relatedProductIds: ["4", "11", "2"],
    shopTheLookIds: ["12", "8"],
    isNew: true,
    status: "active",
  },
  {
    id: "2",
    slug: "apex-fleece-hoodie",
    name: "Apex Fleece Hoodie",
    colour: "Olive",
    colours: 5,
    price: "£59",
    priceValue: 59,
    compareAtPrice: "£75",
    currency: "GBP",
    featured: false,
    swatches: ["#3d4a32", "#1a1a1a", "#5c5c5c", "#e8e4dc", "#2c3a48"],
    media: {},
    category: "hoodies",
    colourVariants: [
      colour("olive", "Olive", "#3d4a32"),
      colour("ink", "Ink", "#1a1a1a"),
      colour("stone", "Stone", "#5c5c5c"),
      colour("bone", "Bone", "#e8e4dc"),
      colour("navy", "Navy", "#2c3a48"),
    ],
    sizes: letterSizes(["XS"]),
    descriptor: "Fleece hoodie.",
    relatedProductIds: ["5", "11", "1"],
    shopTheLookIds: ["12", "8"],
    isSale: true,
    status: "active",
  },
  {
    id: "4",
    slug: "drift-camp-shirt",
    name: "Drift Camp Shirt",
    colour: "Soft Stripe",
    colours: 3,
    price: "£44",
    priceValue: 44,
    compareAtPrice: "£55",
    currency: "GBP",
    featured: true,
    swatches: ["#e8e4dc", "#2c3a48", "#c4a882"],
    media: {},
    category: "shirts",
    colourVariants: [
      colour("soft-stripe", "Soft Stripe", "#e8e4dc"),
      colour("navy", "Navy", "#2c3a48"),
      colour("sand", "Sand", "#c4a882"),
    ],
    sizes: letterSizes(),
    descriptor: "Camp-collar shirt.",
    relatedProductIds: ["1", "14", "12"],
    shopTheLookIds: ["12", "7"],
    isNew: true,
    isSale: true,
    status: "active",
  },
  {
    id: "5",
    slug: "quilt-lock-jacket",
    name: "Quilt Lock Jacket",
    colour: "Bone",
    colours: 3,
    price: "£89",
    priceValue: 89,
    compareAtPrice: "£110",
    currency: "GBP",
    featured: true,
    swatches: ["#e8e4dc", "#1a1a1a", "#2c3a48"],
    media: {},
    category: "jackets",
    colourVariants: [
      colour("bone", "Bone", "#e8e4dc"),
      colour("ink", "Ink", "#1a1a1a"),
      colour("navy", "Navy", "#2c3a48"),
    ],
    sizes: letterSizes(),
    descriptor: "Quilted jacket.",
    relatedProductIds: ["11", "2", "12"],
    shopTheLookIds: ["12", "8"],
    isNew: true,
    isSale: true,
    status: "active",
  },
  {
    id: "7",
    slug: "reevear-dark-wash-loose-fit-jeans",
    name: "Dark Wash Loose Fit Jeans",
    colour: "Dark Wash",
    colours: 1,
    price: "£120",
    priceValue: 120,
    currency: "GBP",
    featured: true,
    swatches: ["#2c3340"],
    media: {},
    category: "jeans",
    fit: "Loose Fit",
    colourVariants: [colour("dark-wash", "Dark Wash", "#2c3340")],
    sizes: denimSizes(["38"]),
    descriptor: "Loose-fit jean.",
    relatedProductIds: ["8", "9", "10"],
    shopTheLookIds: ["1", "11"],
    isNew: true,
    status: "active",
  },
  {
    id: "8",
    slug: "reevear-mid-wash-straight-fit-jeans",
    name: "Mid Wash Straight Fit Jeans",
    colour: "Mid Wash",
    colours: 1,
    price: "£115",
    priceValue: 115,
    compareAtPrice: "£140",
    currency: "GBP",
    featured: false,
    swatches: ["#4a5a6e"],
    media: {},
    category: "jeans",
    fit: "Straight Fit",
    colourVariants: [colour("mid-wash", "Mid Wash", "#4a5a6e")],
    sizes: denimSizes(),
    descriptor: "Straight-fit jean.",
    relatedProductIds: ["7", "9", "10"],
    shopTheLookIds: ["4", "5"],
    isSale: true,
    status: "active",
  },
  {
    id: "9",
    slug: "reevear-black-relaxed-fit-jeans",
    name: "Black Relaxed Fit Jeans",
    colour: "Black",
    colours: 1,
    price: "£120",
    priceValue: 120,
    compareAtPrice: "£145",
    currency: "GBP",
    featured: false,
    swatches: ["#171715"],
    media: {},
    category: "jeans",
    fit: "Relaxed Fit",
    colourVariants: [colour("black", "Black", "#171715")],
    sizes: denimSizes(["28"]),
    descriptor: "Relaxed-fit jean.",
    relatedProductIds: ["7", "8", "10"],
    shopTheLookIds: ["11", "2"],
    isSale: true,
    status: "active",
  },
  {
    id: "10",
    slug: "reevear-indigo-loose-fit-jeans",
    name: "Indigo Loose Fit Jeans",
    colour: "Indigo",
    colours: 1,
    price: "£125",
    priceValue: 125,
    currency: "GBP",
    featured: false,
    swatches: ["#1c2a4a"],
    media: {},
    category: "jeans",
    fit: "Loose Fit",
    colourVariants: [colour("indigo", "Indigo", "#1c2a4a")],
    sizes: denimSizes(),
    descriptor: "Loose-fit jean.",
    relatedProductIds: ["7", "8", "9"],
    shopTheLookIds: ["14", "11"],
    isNew: true,
    status: "active",
  },
  {
    id: "11",
    slug: "reevear-olive-field-jacket",
    name: "Olive Field Jacket",
    colour: "Olive",
    colours: 2,
    price: "£165",
    priceValue: 165,
    currency: "GBP",
    featured: true,
    swatches: ["#3d4a32", "#cfc6b8"],
    media: {},
    category: "jackets",
    colourVariants: [
      colour("olive", "Olive", "#3d4a32"),
      colour("sand", "Sand", "#cfc6b8"),
    ],
    sizes: letterSizes(),
    descriptor: "Field jacket.",
    relatedProductIds: ["5", "12", "7"],
    shopTheLookIds: ["7", "1"],
    isNew: true,
    status: "active",
  },
  {
    id: "12",
    slug: "reevear-relaxed-cotton-trouser",
    name: "Relaxed Cotton Trouser",
    colour: "Stone",
    colours: 2,
    price: "£98",
    priceValue: 98,
    currency: "GBP",
    featured: false,
    swatches: ["#c4b7a2", "#2c3331"],
    media: {},
    category: "trousers",
    fit: "Relaxed Fit",
    colourVariants: [
      colour("stone", "Stone", "#c4b7a2"),
      colour("ink", "Ink", "#2c3331"),
    ],
    sizes: denimSizes(),
    descriptor: "Relaxed cotton trouser.",
    relatedProductIds: ["13", "7", "4"],
    shopTheLookIds: ["4", "5"],
    isNew: true,
    status: "active",
  },
  {
    id: "13",
    slug: "reevear-stone-straight-trouser",
    name: "Stone Straight Trouser",
    colour: "Sand",
    colours: 1,
    price: "£98",
    priceValue: 98,
    compareAtPrice: "£120",
    currency: "GBP",
    featured: false,
    swatches: ["#d4c4a8"],
    media: {},
    category: "trousers",
    fit: "Straight Fit",
    colourVariants: [colour("sand", "Sand", "#d4c4a8")],
    sizes: denimSizes(["36"]),
    descriptor: "Straight cotton trouser.",
    relatedProductIds: ["12", "8", "11"],
    shopTheLookIds: ["14", "11"],
    isSale: true,
    status: "active",
  },
  {
    id: "14",
    slug: "reevear-white-oxford-shirt",
    name: "White Oxford Shirt",
    colour: "White",
    colours: 1,
    price: "£79",
    priceValue: 79,
    currency: "GBP",
    featured: false,
    swatches: ["#f4f1ea"],
    media: {},
    category: "shirts",
    colourVariants: [colour("white", "White", "#f4f1ea")],
    sizes: letterSizes(),
    descriptor: "Oxford shirt.",
    relatedProductIds: ["4", "1", "12"],
    shopTheLookIds: ["12", "8"],
    status: "active",
  },
  ...colourwayFamily({
    group: "relaxed-tee",
    name: "Relaxed Tee",
    price: "£45",
    priceValue: 45,
    category: "t-shirts",
    fit: "Relaxed",
    descriptor: "A relaxed tee in heavyweight cotton, for the week.",
    variants: [
      colour("mineral-cream", "Mineral Cream", "#e4d8c8", "/Everyday/Tshirts/Tee/1.png"),
      colour("deep-black", "Deep Black", "#161616", "/Everyday/Tshirts/Tee/2.png"),
    ],
    relatedProductIds: [
      "boxy-tee-mineral-cream",
      "long-sleeve-tee-mineral-cream",
      "hoodie-mineral-cream",
    ],
    shopTheLookIds: ["hoodie-mineral-cream"],
  }),
  ...colourwayFamily({
    group: "boxy-tee",
    name: "Boxy Tee",
    price: "£55",
    priceValue: 55,
    category: "t-shirts",
    fit: "Boxy",
    descriptor: "A boxier tee in compact cotton. More structure, the same length.",
    variants: [
      colour("mineral-cream", "Mineral Cream", "#e6e2d8", "/Everyday/Tshirts/Tee/4.png"),
      colour("deep-black", "Deep Black", "#141414", "/Everyday/Tshirts/Tee/3.png"),
    ],
    relatedProductIds: [
      "relaxed-tee-mineral-cream",
      "sweatshirt-mineral-cream",
      "long-sleeve-tee-mineral-cream",
    ],
    shopTheLookIds: ["sweatshirt-mineral-cream"],
  }),
  ...colourwayFamily({
    group: "long-sleeve-tee",
    name: "Long Sleeve Tee",
    price: "£65",
    priceValue: 65,
    category: "t-shirts",
    fit: "Long Sleeve",
    descriptor: "A long-sleeve tee in heavyweight jersey, for cooler days.",
    variants: [
      colour("mineral-cream", "Mineral Cream", "#d9d3c4", "/Everyday/Tshirts/Long Sleeve/1.png"),
      colour("deep-black", "Deep Black", "#121820", "/Everyday/Tshirts/Long Sleeve/2.png"),
      colour("washed-charcoal", "Washed Charcoal", "#4a4e53", "/Everyday/Tshirts/Long Sleeve/3.png"),
    ],
    relatedProductIds: [
      "relaxed-tee-mineral-cream",
      "hoodie-mineral-cream",
      "sweatshirt-mineral-cream",
    ],
    shopTheLookIds: ["relaxed-tee-mineral-cream"],
  }),
  ...colourwayFamily({
    group: "hoodie",
    name: "Hoodie",
    price: "£95",
    priceValue: 95,
    category: "hoodies",
    fit: "Relaxed",
    descriptor: "A fleece hoodie. Hood down, kangaroo pocket, no branding.",
    variants: [
      colour("mineral-cream", "Mineral Cream", "#e6dccb", "/Everyday/Hoodies/1.png"),
      colour("washed-charcoal", "Washed Charcoal", "#5c615f", "/Everyday/Hoodies/2.png"),
    ],
    relatedProductIds: [
      "relaxed-tee-mineral-cream",
      "sweatshirt-mineral-cream",
      "long-sleeve-tee-mineral-cream",
    ],
    shopTheLookIds: ["relaxed-tee-mineral-cream"],
  }),
  ...colourwayFamily({
    group: "sweatshirt",
    name: "Heavyweight Sweatshirt",
    price: "£110",
    priceValue: 110,
    category: "sweatshirts",
    fit: "Boxy",
    descriptor: "A heavy sweatshirt. Dropped shoulder, hem at the hip.",
    variants: [
      colour("mineral-cream", "Mineral Cream", "#e7e0d4", "/Everyday/Sweatshirts/1.png"),
      colour("washed-charcoal", "Washed Charcoal", "#5a5c5e", "/Everyday/Sweatshirts/2.png"),
    ],
    relatedProductIds: [
      "boxy-tee-mineral-cream",
      "hoodie-mineral-cream",
      "relaxed-tee-mineral-cream",
    ],
    shopTheLookIds: ["boxy-tee-mineral-cream"],
  }),
];

export const products: ShopProduct[] = catalog;

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getColourways(group: string) {
  return products.filter((product) => product.group === group);
}

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}

export function getProductsByIds(ids: readonly string[]) {
  return ids
    .map((id) => getProductById(id))
    .filter((product): product is ShopProduct => Boolean(product));
}

export function getProductsByCategory(category: string) {
  return products.filter((product) => product.category === category);
}
