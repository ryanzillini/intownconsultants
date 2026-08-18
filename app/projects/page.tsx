import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-24 pt-28 sm:px-8">
      <h1 className="font-serif text-4xl tracking-tight text-iron">Projects</h1>
      <p className="mt-4 text-iron-muted">
        Portfolio coming soon — filterable project gallery powered by Sanity.
      </p>
    </div>
  );
}
