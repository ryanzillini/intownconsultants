import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services",
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-24 pt-28 sm:px-8">
      <h1 className="font-serif text-4xl tracking-tight text-iron">Services</h1>
      <p className="mt-4 text-iron-muted">
        Full services page coming next — landmark renovation, brownstones, and
        full-service contracting.
      </p>
      <Link
        href="/contact"
        className="mt-8 inline-block text-sm text-brownstone underline-offset-4 hover:underline"
      >
        Get a Quote
      </Link>
    </div>
  );
}
