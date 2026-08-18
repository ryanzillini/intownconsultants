import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-24 pt-28 sm:px-8">
      <h1 className="font-serif text-4xl tracking-tight text-iron">
        Get a Quote
      </h1>
      <p className="mt-4 text-iron-muted">
        Contact form and details coming next. For now, email{" "}
        <a
          href="mailto:info@intowninc.com"
          className="text-brownstone underline-offset-4 hover:underline"
        >
          info@intowninc.com
        </a>
        .
      </p>
    </div>
  );
}
