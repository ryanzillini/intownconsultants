import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-limestone">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-serif text-2xl tracking-tight text-iron">
            Intown Consultants
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-iron-muted">
            {siteConfig.tagline}. Licensed landmark renovation and general
            contracting across Brooklyn.
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-iron-muted">
            Navigate
          </p>
          <ul className="mt-4 space-y-2">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-iron transition-colors hover:text-brownstone"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-iron-muted">
            Contact
          </p>
          <ul className="mt-4 space-y-2 text-sm text-iron">
            <li>{siteConfig.address}</li>
            <li>
              <a
                href={`mailto:${siteConfig.email}`}
                className="transition-colors hover:text-brownstone"
              >
                {siteConfig.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
                className="transition-colors hover:text-brownstone"
              >
                {siteConfig.phone}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-5 py-5 text-xs text-iron-muted sm:px-8">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
