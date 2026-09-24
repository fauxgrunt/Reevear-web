import { CartProvider } from "@/components/cart/CartProvider";
import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit, Syne } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Reevear | Premium Clothing for UK & International",
  description:
    "Contemporary mens and womens clothing designed for everyday wear. Shipping across the UK and internationally.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${outfit.variable} ${syne.variable} ${cormorant.variable} h-full`}
    >
      <body className="min-h-full bg-ink text-mist antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
