"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [navPath, setNavPath] = useState(pathname);

  if (navPath !== pathname) {
    setNavPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gold/25 bg-ink">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-20 sm:px-8">
        <Logo priority />

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {siteConfig.nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm tracking-wide transition-colors",
                  active
                    ? "text-gold"
                    : "text-white/75 hover:text-gold",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            className="bg-gold px-4 py-2 text-sm text-ink transition-colors hover:bg-gold-deep hover:text-paper"
          >
            Get a Quote
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center p-2 text-gold md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          "border-t border-gold/25 bg-ink md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="flex flex-col gap-1 px-5 py-4" aria-label="Mobile">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="py-3 text-base text-white/90"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="mt-2 bg-gold px-4 py-3 text-center text-sm text-ink"
          >
            Get a Quote
          </Link>
        </nav>
      </div>
    </header>
  );
}
