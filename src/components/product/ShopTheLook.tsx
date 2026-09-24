import { ProductCard } from "@/components/product/ProductCard";
import { ProductMedia } from "@/components/product/ProductMedia";
import { getProductsByIds, type ShopProduct } from "@/data/products";

export function ShopTheLook({ product }: { product: ShopProduct }) {
  const looks = getProductsByIds(product.shopTheLookIds);
  if (looks.length === 0) return null;

  return (
    <section className="home-gutter py-20 md:py-28">
      <h2 className="shop-label">Shop the look</h2>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
        <div className="aspect-[4/5] w-full">
          <ProductMedia
            alt={`${product.name} look`}
            className="h-full w-full"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <ul className="grid grid-cols-2 gap-x-3 gap-y-8">
          {looks.map((item) => (
            <li key={item.id}>
              <ProductCard product={item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
