import type { Metadata } from "next";
import { siteConfig, telHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get a quote from ${siteConfig.shortName}. ${siteConfig.address}`,
};

const contacts = [
  {
    label: siteConfig.phoneLabel,
    value: siteConfig.phone,
    href: telHref(siteConfig.phone),
  },
  {
    label: siteConfig.phoneCellLabel,
    value: siteConfig.phoneCell,
    href: telHref(siteConfig.phoneCell),
  },
  {
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
  },
] as const;

export default function ContactPage() {
  return (
    <>
      <section className="bg-gold">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-28 sm:px-8 md:pb-20 md:pt-36">
          <h1 className="font-serif text-4xl tracking-tight text-white sm:text-5xl">
            Contact Us
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/90 sm:text-base">
            Tell us about your project. We&apos;ll walk you through what comes
            next.
          </p>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 md:py-24">
          <h2 className="font-serif text-2xl text-ink">Get a Quote</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
            A contact form is coming next. Reach us directly in the meantime:
          </p>

          <ul className="mt-10 space-y-6">
            {contacts.map((item) => (
              <li key={item.label}>
                <p className="text-xs uppercase tracking-[0.18em] text-gold-deep">
                  {item.label}
                </p>
                <a
                  href={item.href}
                  className="mt-1 inline-block text-lg text-ink transition-colors hover:text-gold-deep"
                >
                  {item.value}
                </a>
              </li>
            ))}
            <li>
              <p className="text-xs uppercase tracking-[0.18em] text-gold-deep">
                Address
              </p>
              <p className="mt-1 text-lg text-ink">{siteConfig.address}</p>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
