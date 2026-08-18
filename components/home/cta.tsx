import Link from "next/link";

export function HomeCta() {
  return (
    <section className="relative overflow-hidden bg-brownstone-deep">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 0%, #7d6f55 0%, transparent 55%), radial-gradient(ellipse at 90% 100%, #5e4638 0%, transparent 45%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 py-20 sm:px-8 md:flex-row md:items-end md:justify-between md:py-24">
        <div className="max-w-xl">
          <h2 className="font-serif text-3xl tracking-tight text-plaster sm:text-4xl">
            Ready to restore your brownstone?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-plaster/75 sm:text-base">
            Tell us about your project — landmark constraints, interiors,
            masonry, or a full gut. We&apos;ll walk you through what comes next.
          </p>
        </div>
        <Link
          href="/contact"
          className="shrink-0 bg-plaster px-5 py-3 text-sm text-iron transition-colors hover:bg-limestone-light"
        >
          Get a Quote
        </Link>
      </div>
    </section>
  );
}
