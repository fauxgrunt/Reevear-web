import Image from "next/image";

type BrandLogoProps = {
  variant?: "header" | "footer" | "hero";
  className?: string;
};

/** Bump this when replacing public/logo.png so browsers/Next drop the old cache. */
const LOGO_SRC = "/logo.png?v=3";

const sizes = {
  header: {
    width: 128,
    height: 128,
    className: "h-11 w-auto md:h-[3.25rem]",
  },
  footer: {
    width: 112,
    height: 112,
    className: "h-11 w-auto",
  },
  hero: {
    width: 256,
    height: 256,
    className: "h-auto w-[min(40vw,8.5rem)] md:w-[min(18vw,11rem)]",
  },
} as const;

export function BrandLogo({
  variant = "header",
  className = "",
}: BrandLogoProps) {
  const size = sizes[variant];

  return (
    <Image
      src={LOGO_SRC}
      alt="Reevear"
      width={size.width}
      height={size.height}
      priority
      unoptimized
      className={`object-contain ${size.className} ${className}`.trim()}
    />
  );
}
