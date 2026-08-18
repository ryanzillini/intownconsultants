import { HomeCta } from "@/components/home/cta";
import { HomeHero } from "@/components/home/hero";
import { HomeNiche } from "@/components/home/niche";
import { HomeServices } from "@/components/home/services";
import { HomeTestimonials } from "@/components/home/testimonials";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeNiche />
      <HomeServices />
      <HomeTestimonials />
      <HomeCta />
    </>
  );
}
