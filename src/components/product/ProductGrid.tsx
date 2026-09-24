import { ProductCard } from "@/components/product/ProductCard";
import type { ShopProduct } from "@/data/products";

export function ProductGrid({ products }: { products: readonly ShopProduct[] }) {
  return (
    <ul className="shop-grid">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
