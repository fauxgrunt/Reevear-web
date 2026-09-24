import type { Metadata } from "next";
import { CollectionView } from "@/components/product/CollectionView";
import { collectionPages } from "@/data/navigation";
import { getProductsByIds } from "@/data/products";
import { notFound, redirect } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return Object.keys(collectionPages)
    .filter((slug) => slug !== "signature-pieces")
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = collectionPages[slug];
  if (!collection) return { title: "Collection | Reevear" };
  return {
    title: `${collection.title} | Reevear`,
    description: collection.description,
  };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  if (slug === "signature-pieces") redirect("/pages/signature-pieces");
  const collection = collectionPages[slug];
  if (!collection) notFound();

  const products = getProductsByIds(collection.productIds);

  return (
    <CollectionView
      title={collection.title}
      description={collection.description}
      products={products}
    />
  );
}
