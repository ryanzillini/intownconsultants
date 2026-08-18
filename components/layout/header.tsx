"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background,border-color,backdrop-filter] duration-300",
        scrolled || open
          ? "border-b border-border bg-plaster/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-20 sm:px-8">
        <Link
          href="/"
          className="font-serif text-lg tracking-tight text-iron sm:text-xl"
        >
          Intown Consultants
        </Link>

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
                    ? "text-iron"
                    : "text-iron-muted hover:text-iron",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            className="bg-iron px-4 py-2 text-sm text-plaster transition-colors hover:bg-brownstone-deep"
          >
            Get a Quote
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center p-2 text-iron md:hidden"
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
          "border-t border-border bg-plaster md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="flex flex-col gap-1 px-5 py-4" aria-label="Mobile">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="py-3 text-base text-iron"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="mt-2 bg-iron px-4 py-3 text-center text-sm text-plaster"
          >
            Get a Quote
          </Link>
        </nav>
      </div>
    </header>
  );
}
