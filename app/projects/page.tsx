import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return (
    <>
      <section className="bg-ink">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-28 sm:px-8 md:pb-20 md:pt-36">
          <h1 className="font-serif text-4xl tracking-tight text-gold sm:text-5xl">
            Projects
          </h1>
        </div>
      </section>
      <section className="bg-paper">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 md:py-24">
          <p className="text-muted">
            Portfolio coming soon — filterable project gallery powered by Sanity.
          </p>
        </div>
      </section>
    </>
  );
}
