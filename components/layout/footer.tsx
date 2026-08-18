import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { siteConfig, telHref } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-gold/25 bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.6fr_1fr_1fr] md:items-start md:gap-12">
        <div>
          <Logo imageClassName="h-14 w-auto sm:h-16" />
          <h2 className="mt-6 font-serif text-2xl tracking-tight text-gold sm:text-3xl">
            Ready to restore your brownstone?
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
            Tell us about your project — landmark constraints, interiors,
            masonry, or a full gut. We&apos;ll walk you through what comes next.
          </p>
          <Link
            href="/contact"
            className="mt-5 inline-block bg-gold px-5 py-3 text-sm text-ink transition-colors hover:bg-gold-deep hover:text-paper"
          >
            Get a Quote
          </Link>
        </div>

        <div>
          <p className="font-serif text-sm text-gold">Navigate</p>
          <ul className="mt-4 space-y-2">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-white/80 transition-colors hover:text-gold"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-serif text-sm text-gold">Contact</p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>{siteConfig.address}</li>
            <li>
              <a
                href={`mailto:${siteConfig.email}`}
                className="transition-colors hover:text-gold"
              >
                {siteConfig.email}
              </a>
            </li>
            <li>
              <a
                href={telHref(siteConfig.phone)}
                className="transition-colors hover:text-gold"
              >
                {siteConfig.phone}{" "}
                <span className="text-white/50">({siteConfig.phoneLabel})</span>
              </a>
            </li>
            <li>
              <a
                href={telHref(siteConfig.phoneCell)}
                className="transition-colors hover:text-gold"
              >
                {siteConfig.phoneCell}{" "}
                <span className="text-white/50">
                  ({siteConfig.phoneCellLabel})
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gold/20">
        <p className="mx-auto max-w-6xl px-5 py-5 text-xs text-white/45 sm:px-8">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
