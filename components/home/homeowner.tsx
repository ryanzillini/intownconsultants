import Link from "next/link";
import { homeownerService } from "@/lib/site";

export function HomeHomeowner() {
  return (
    <section className="bg-gold">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-20 sm:px-8 md:flex-row md:items-end md:justify-between md:py-24">
        <div className="max-w-2xl">
          <h2 className="font-serif text-3xl tracking-tight text-white sm:text-4xl md:text-5xl">
            {homeownerService.heading}
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-white/90 sm:text-base">
            {homeownerService.body}
          </p>
        </div>
        <Link
          href="/services"
          className="shrink-0 bg-ink px-5 py-3 text-sm text-gold transition-colors hover:bg-ink/80"
        >
          Our services
        </Link>
      </div>
    </section>
  );
}
