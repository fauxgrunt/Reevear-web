import Image from "next/image";

type ProductMediaProps = {
  src?: string;
  hoverSrc?: string;
  alt: string;
  className?: string;
  sizes?: string;
};

export function ProductMedia({
  src,
  hoverSrc,
  alt,
  className = "",
  sizes = "(max-width: 768px) 50vw, 25vw",
}: ProductMediaProps) {
  const canHover = Boolean(src && hoverSrc);

  if (!src) {
    return (
      <div
        className={`product-media bg-black ${className}`.trim()}
        role="img"
        aria-label={alt}
      />
    );
  }

  return (
    <div className={`product-media relative overflow-hidden bg-black ${className}`.trim()}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={`object-cover ${canHover ? "transition-opacity duration-500 group-hover:opacity-0" : ""}`}
      />
      {canHover ? (
        <Image
          src={hoverSrc!}
          alt=""
          fill
          sizes={sizes}
          className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      ) : null}
    </div>
  );
}
