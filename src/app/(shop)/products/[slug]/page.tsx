import type { Metadata } from "next";
import { ProductView } from "@/components/product/ProductView";
import { getProductBySlug, products } from "@/data/products";
import { readProductStock } from "@/lib/stock";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product | Reevear" };
  return {
    title: `${product.name} | Reevear`,
    description: product.descriptor ?? product.name,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  const stock = await readProductStock(product.id);

  return <ProductView product={product} stock={stock} />;
}
