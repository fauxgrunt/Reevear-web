import { ProductMedia } from "@/components/product/ProductMedia";
import type { ShopProduct } from "@/data/products";

export function ProductGallery({ product }: { product: ShopProduct }) {
  const slots = product.media.gallery?.length
    ? product.media.gallery
    : [product.media.primary, undefined, undefined];

  return (
    <div className="flex flex-col gap-2 md:gap-3">
      {slots.slice(0, 5).map((src, index) => (
        <div key={`${product.id}-media-${index}`} className={`aspect-[4/5] w-full ${index > 1 ? "hidden md:block" : ""}`}>
          <ProductMedia
            src={src}
            alt={`${product.name} ${index + 1}`}
            className="h-full w-full"
            sizes="(max-width: 1024px) 100vw, 54vw"
          />
        </div>
      ))}
    </div>
  );
}
