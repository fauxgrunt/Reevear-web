import Link from "next/link";
import { collectionPages } from "@/data/navigation";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getProductsByIds } from "@/data/products";

export function SignaturePiecesView() {
  const collection = collectionPages["signature-pieces"];
  const products = getProductsByIds(collection.productIds);

  return (
    <article className="foundation-page editorial-page">
      <header className="foundation-intro">
        <h1>{collection.title}</h1>
        <p>{collection.description}</p>
      </header>

      <div className="editorial-media" role="img" aria-label="Reevear signature pieces" />

      <div className="collection-grid-wrap">
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <p className="collection-empty">Pieces for this selection will appear here.</p>
        )}
      </div>

      <div className="editorial-close">
        <Link href="/collections/all" className="foundation-cta">
          Shop all
          <span aria-hidden="true"> →</span>
        </Link>
      </div>
    </article>
  );
}
