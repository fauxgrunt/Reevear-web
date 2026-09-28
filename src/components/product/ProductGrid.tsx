import { ProductCard } from "@/components/product/ProductCard";
import type { ShopProduct } from "@/data/products";

export function ProductGrid({
  products,
  columns,
}: {
  products: readonly ShopProduct[];
  columns?: 2 | 3 | 4;
}) {
  return (
    <ul className="shop-grid" data-columns={columns}>
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
