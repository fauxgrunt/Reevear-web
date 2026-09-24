import Link from "next/link";
import { ProductMedia } from "@/components/product/ProductMedia";
import type { ShopProduct } from "@/data/products";

export function ProductCard({ product }: { product: ShopProduct }) {
  const sizes = product.sizes.filter((entry) => entry.available);

  return (
    <article className="collection-card">
      <Link href={`/products/${product.slug}`} className="collection-card-link">
        <div className="collection-card-media">
          <ProductMedia
            src={product.media.primary}
            hoverSrc={product.media.hover}
            alt={product.name}
            className="absolute inset-0"
          />
          {sizes.length > 0 ? (
            <div className="collection-card-sizes" aria-hidden="true">
              {sizes.map((entry) => (
                <span key={entry.id}>{entry.label}</span>
              ))}
            </div>
          ) : null}
        </div>
        <div className="collection-card-meta">
          <h2>{product.name}</h2>
          <p className="collection-card-price">
            {product.compareAtPrice ? (
              <>
                <span className="collection-card-was">{product.compareAtPrice}</span>
                {product.price}
              </>
            ) : (
              product.price
            )}
          </p>
          {product.colours > 1 ? (
            <p className="collection-card-colour">{product.colours} colours</p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
