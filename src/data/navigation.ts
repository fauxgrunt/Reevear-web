export type NavLink = {
  label: string;
  href: string;
};

export type ShopMenuGroup = {
  label: string;
  href: string;
  links: NavLink[];
};

export type NavTile = {
  label: string;
  href: string;
  mediaSrc?: string;
  mediaAlt?: string;
  objectPosition?: string;
};

export const collectionPages: Record<
  string,
  { title: string; description: string; productIds: string[] }
> = {
  mens: {
    title: "Men",
    description: "Considered pieces for the week.",
    productIds: ["1", "2", "4", "5", "7", "8", "9", "10", "11", "12", "13", "14"],
  },
  womens: {
    title: "Womens",
    description: "Dresses, sets, and elevated essentials.",
    productIds: ["3", "6"],
  },
  "new-in": {
    title: "New In",
    description: "Recently considered pieces.",
    productIds: ["7", "10", "11", "12", "1", "4", "5"],
  },
  all: {
    title: "All",
    description: "The current collection.",
    productIds: ["1", "2", "4", "5", "7", "8", "9", "10", "11", "12", "13", "14"],
  },
  everyday: {
    title: "Everyday",
    description: "Pieces made to be worn again and again.",
    productIds: ["1", "4", "2", "14", "12", "13"],
  },
  outerwear: {
    title: "Outerwear",
    description: "Jackets and layers made for everyday wear.",
    productIds: ["11", "5"],
  },
  "denim-trousers": {
    title: "Denim & Trousers",
    description: "Everyday denim and trousers, made to be worn again and again.",
    productIds: ["7", "8", "9", "10", "12", "13"],
  },
  activewear: {
    title: "Activewear",
    description: "Performance pieces made for training and everyday movement.",
    productIds: ["2"],
  },
  "signature-pieces": {
    title: "Signature Pieces",
    description: "A selection of pieces that define Reevear.",
    productIds: ["11", "1", "2", "12", "7", "4"],
  },
  jeans: {
    title: "Jeans",
    description: "Denim, cut with ease.",
    productIds: ["7", "8", "9", "10"],
  },
  jackets: {
    title: "Jackets",
    description: "Outer layers for the week.",
    productIds: ["5", "11"],
  },
  shirts: {
    title: "Shirts",
    description: "Shirts and polos from the current line.",
    productIds: ["1", "4", "14"],
  },
  trousers: {
    title: "Trousers",
    description: "Easy trousers with a clean line.",
    productIds: ["12", "13"],
  },
  sale: {
    title: "Sale",
    description: "Selected pieces at reduced prices.",
    productIds: ["2", "5", "8", "9", "13", "4"],
  },
  "mens-t-shirts": {
    title: "Mens T-Shirts",
    description: "Relaxed tees built for everyday.",
    productIds: [],
  },
  "mens-shirts-polos": {
    title: "Mens Shirts & Polos",
    description: "Rugbys, camps, and polished casual shirts.",
    productIds: ["1", "4", "14"],
  },
  "mens-hoodies": {
    title: "Mens Hoodies",
    description: "Soft fleece layers with clean lines.",
    productIds: ["2"],
  },
  "mens-shorts": {
    title: "Mens Shorts",
    description: "Warm-weather fits with an easy, clean cut.",
    productIds: [],
  },
  "mens-trousers": {
    title: "Mens Trousers",
    description: "Tailored casual trousers for everyday wear.",
    productIds: ["12", "13"],
  },
  "womens-dresses": {
    title: "Womens Dresses",
    description: "Everyday and elevated dresses with easy structure.",
    productIds: [],
  },
  "womens-coords": {
    title: "Womens Co-ord Sets",
    description: "Matching sets designed to wear together.",
    productIds: ["3", "6"],
  },
  "womens-tops": {
    title: "Womens Tops & Shirts",
    description: "Shirts and tops with clean structure.",
    productIds: ["4"],
  },
  "womens-hoodies": {
    title: "Womens Hoodies",
    description: "Relaxed layers, shared from the core line.",
    productIds: ["2"],
  },
  "womens-trousers": {
    title: "Womens Trousers",
    description: "Wide and tailored trousers.",
    productIds: ["6"],
  },
  "womens-shorts": {
    title: "Womens Shorts",
    description: "Easy warm-weather shorts with a clean finish.",
    productIds: [],
  },
};

export const shopMenuGroups: ShopMenuGroup[] = [
  {
    label: "Everyday",
    href: "/collections/everyday",
    links: [
      { label: "Hoodies & Sweatshirts", href: "/collections/mens-hoodies" },
      { label: "Shirts & Polos", href: "/collections/shirts" },
    ],
  },
  {
    label: "Outerwear",
    href: "/collections/outerwear",
    links: [{ label: "Jackets", href: "/collections/jackets" }],
  },
  {
    label: "Denim & Trousers",
    href: "/collections/denim-trousers",
    links: [
      { label: "Jeans", href: "/collections/jeans" },
      { label: "Trousers", href: "/collections/trousers" },
    ],
  },
  {
    label: "Activewear",
    href: "/collections/activewear",
    links: [],
  },
];

export const shopAllLink: NavLink = {
  label: "Shop All",
  href: "/collections/all",
};

export const shopFeatureTiles: NavTile[] = [
  {
    label: "Everyday",
    href: "/collections/everyday",
    mediaSrc: "/tiles/Everyday.jpeg",
    mediaAlt: "Man in an olive shirt over a white t-shirt",
  },
  {
    label: "Outerwear",
    href: "/collections/outerwear",
    mediaSrc: "/tiles/Outerwear.jpeg",
    mediaAlt: "Olive field jacket worn on a city street",
  },
  {
    label: "Activewear",
    href: "/collections/activewear",
    mediaSrc: "/tiles/Activewear.jpeg",
    mediaAlt: "Man in a black performance shirt and training shorts in a gym",
    objectPosition: "center 18%",
  },
];

export const exploreMenuLinks: NavLink[] = [
  { label: "Our Story", href: "/pages/our-story" },
  { label: "Made to Move", href: "/pages/made-to-move" },
  { label: "Signature Pieces", href: "/pages/signature-pieces" },
  { label: "Contact", href: "/pages/contact" },
];

export const exploreFeatureTiles: NavTile[] = [
  {
    label: "Made to Move",
    href: "/pages/made-to-move",
    mediaSrc: "/Made to move/Made to move.jpeg",
    mediaAlt: "Man in a black performance shirt training in a gym",
    objectPosition: "center 30%",
  },
  {
    label: "Signature Pieces",
    href: "/pages/signature-pieces",
    mediaSrc: "/Menu/Signature.jpeg",
    mediaAlt: "Man in an olive field jacket over a white t-shirt",
    objectPosition: "center 30%",
  },
  {
    label: "Our Story",
    href: "/pages/our-story",
    mediaSrc: "/Menu/Our story.jpeg",
    mediaAlt: "Man stepping out of a doorway onto a city street",
    objectPosition: "center 40%",
  },
];

export const mobileShopLinks: NavLink[] = [
  { label: "Everyday", href: "/collections/everyday" },
  { label: "Outerwear", href: "/collections/outerwear" },
  { label: "Denim & Trousers", href: "/collections/denim-trousers" },
  { label: "Activewear", href: "/collections/activewear" },
  { label: "Shop All", href: "/collections/all" },
];

export const searchCollections: NavLink[] = [
  { label: "New In", href: "/collections/new-in" },
  { label: "Everyday", href: "/collections/everyday" },
  { label: "Outerwear", href: "/collections/outerwear" },
  { label: "Denim & Trousers", href: "/collections/denim-trousers" },
  { label: "Activewear", href: "/collections/activewear" },
  { label: "Sale", href: "/collections/sale" },
];

export const searchPopular: NavLink[] = [
  { label: "Jeans", href: "/collections/jeans" },
  { label: "Jacket", href: "/collections/jackets" },
  { label: "Hoodie", href: "/collections/mens-hoodies" },
];

export const mobileMenuFoot: NavLink[] = [
  { label: "Account", href: "/pages/account" },
  { label: "Contact us", href: "/pages/contact" },
  { label: "Delivery & Returns", href: "/pages/shipping" },
];
