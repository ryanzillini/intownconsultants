import type { Metadata } from "next";
import Image from "next/image";
import { aboutCopy, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: aboutCopy.body,
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-ink">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-28 sm:px-8 md:pb-20 md:pt-36">
          <p className="text-xs uppercase tracking-[0.22em] text-gold">
            {siteConfig.shortName}
          </p>
          <h1 className="mt-3 font-serif text-4xl tracking-tight text-gold sm:text-5xl">
            {aboutCopy.heading}
          </h1>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 md:py-24">
          <p className="text-base leading-relaxed text-muted sm:text-lg">
            {aboutCopy.body}
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="relative aspect-[3/2] overflow-hidden">
              <Image
                src="/images/work/playroom.png"
                alt="Renovated playroom with exposed wood beams"
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[3/2] overflow-hidden">
              <Image
                src="/images/work/rustic-bathroom.png"
                alt="Bathroom renovation with clawfoot tub and wood-framed windows"
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="mt-12 grid gap-10 border-t border-gold/40 pt-10 md:grid-cols-2">
            <div>
              <h2 className="font-serif text-2xl text-ink">Landmark work</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                Landmarks come with challenges and regulations that differ from
                a typical renovation. Lucio&apos;s 30+ years of landmark
                experience gives our team the confidence to take on work that
                protects historical architecture — and still delivers a home
                that works for how you live.
              </p>
            </div>
            <div>
              <h2 className="font-serif text-2xl text-ink">Brownstones</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                From brownstone façades in Carroll Gardens to interiors in
                Williamsburg and Downtown Brooklyn, we specialize in quality
                renovation that preserves what makes these buildings worth
                keeping.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
