import { HomeFooter } from "@/components/home/HomeFooter";
import { HomeHeader } from "@/components/home/HomeHeader";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="home-root">
      <HomeHeader />
      <main>{children}</main>
      <HomeFooter />
    </div>
  );
}
