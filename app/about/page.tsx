import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-24 pt-28 sm:px-8">
      <h1 className="font-serif text-4xl tracking-tight text-iron">About</h1>
      <p className="mt-4 text-iron-muted">
        Lucio&apos;s story, licensing, and 30+ years of landmark experience —
        coming next.
      </p>
    </div>
  );
}
