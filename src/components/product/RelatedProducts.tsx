import { ProductGrid } from "@/components/product/ProductGrid";
import { getProductsByIds, type ShopProduct } from "@/data/products";

export function RelatedProducts({ product }: { product: ShopProduct }) {
  const related = getProductsByIds(product.relatedProductIds);
  if (related.length === 0) return null;

  return (
    <section className="home-gutter pb-24 md:pb-32">
      <h2 className="shop-label">You may also like</h2>
      <div className="mt-8">
        <ProductGrid products={related} />
      </div>
    </section>
  );
}
