import type { Metadata } from "next";
import { ProductView } from "@/components/product/ProductView";
import { getProductBySlug, products } from "@/data/products";
import { notFound } from "next/navigation";

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

  return <ProductView product={product} />;
}
