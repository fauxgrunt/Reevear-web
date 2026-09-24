import { HomeArrivals } from "@/components/home/HomeArrivals";
import { HomeCampaign } from "@/components/home/HomeCampaign";
import { HomeDepartments } from "@/components/home/HomeDepartments";
import { HomeFooter } from "@/components/home/HomeFooter";
import { HomeHeader } from "@/components/home/HomeHeader";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeSale } from "@/components/home/HomeSale";
import { HomeShelf } from "@/components/home/HomeShelf";

export default function HomePage() {
  return (
    <div className="home-root">
      <HomeHeader />
      <main>
        <HomeHero />
        <HomeArrivals />
        <HomeCampaign />
        <HomeShelf />
        <HomeDepartments />
        <HomeSale />
      </main>
      <HomeFooter />
    </div>
  );
}
