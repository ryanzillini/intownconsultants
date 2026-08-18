import type { Metadata } from "next";
import Image from "next/image";
import { HomeCta } from "@/components/home/cta";
import { servicesPage, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description: `Landmark renovation, brownstones, outdoor masonry, and interior remodeling from ${siteConfig.shortName}.`,
};

export default function ServicesPage() {
  return (
    <>
      <section className="bg-plaster">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-28 sm:px-8 md:grid-cols-[1fr_1.2fr] md:gap-16 md:pb-20 md:pt-36">
          <h1 className="font-serif text-4xl leading-tight tracking-tight text-iron sm:text-5xl">
            Our Services
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-iron-muted sm:text-lg">
            {servicesPage.intro}
          </p>
        </div>
      </section>

      <section className="bg-limestone-light">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
          <h2 className="font-serif text-3xl tracking-tight text-iron sm:text-4xl">
            {servicesPage.niche.heading}
          </h2>
          <ul className="mt-12 grid gap-10 md:grid-cols-2 md:gap-16">
            {servicesPage.niche.items.map((item) => (
              <li key={item.title}>
                <div className="border-t border-brownstone/40 pt-6">
                  <h3 className="font-serif text-2xl text-iron">{item.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-iron-muted sm:text-base">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {servicesPage.offerings.map((offering, index) => (
        <section
          key={offering.id}
          id={offering.id}
          className={index % 2 === 0 ? "bg-plaster" : "bg-limestone-light"}
        >
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
            <h2 className="font-serif text-3xl tracking-tight text-iron sm:text-4xl">
              {offering.title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-iron-muted sm:text-base">
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

      <HomeCta />
    </>
  );
}
