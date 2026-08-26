import type { Metadata } from "next";
import Image from "next/image";
import { servicesPage, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description: `Landmark renovation, brownstones, outdoor masonry, interior remodeling, and homeowner inspections from ${siteConfig.shortName}.`,
};

export default function ServicesPage() {
  return (
    <>
      <section className="bg-ink">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-28 sm:px-8 md:grid-cols-[1fr_1.2fr] md:gap-16 md:pb-20 md:pt-36">
          <h1 className="font-serif text-4xl leading-tight tracking-tight text-gold sm:text-5xl">
            Our Services
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
            {servicesPage.intro}
          </p>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
          <h2 className="font-serif text-3xl tracking-tight text-ink sm:text-4xl">
            {servicesPage.niche.heading}
          </h2>
          <ul className="mt-12 grid gap-10 md:grid-cols-2 md:gap-16">
            {servicesPage.niche.items.map((item) => (
              <li key={item.title}>
                <div className="border-t border-gold/50 pt-6">
                  <h3 className="font-serif text-2xl text-ink">{item.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-gold">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
          <h2 className="font-serif text-3xl tracking-tight text-white sm:text-4xl">
            Regulatory &amp; homeowner
          </h2>
          <ul className="mt-12 grid gap-10 md:grid-cols-2 md:gap-16">
            {servicesPage.capabilities.map((item) => (
              <li key={item.title}>
                <h3 className="font-serif text-2xl text-white">{item.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-white/90 sm:text-base">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {servicesPage.offerings.map((offering, index) => (
        <section
          key={offering.id}
          id={offering.id}
          className={index % 2 === 0 ? "bg-paper" : "bg-white"}
        >
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
            <h2 className="font-serif text-3xl tracking-tight text-ink sm:text-4xl">
              {offering.title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
              {offering.body}
            </p>
            <div className="mt-10">
              <Image
                src={offering.image}
                alt={offering.alt}
                width={offering.width}
                height={offering.height}
                sizes="(max-width: 1152px) 100vw, 1152px"
                className="h-auto w-full"
              />
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
