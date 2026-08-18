import { HomeHero } from "@/components/home/hero";
import { HomeHomeowner } from "@/components/home/homeowner";
import { HomeNiche } from "@/components/home/niche";
import { HomeServices } from "@/components/home/services";
import { HomeTestimonials } from "@/components/home/testimonials";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeNiche />
      <HomeServices />
      <HomeHomeowner />
      <HomeTestimonials />
    </>
  );
}
