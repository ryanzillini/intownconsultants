import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { hasDatabase } from "@/lib/db";
import { listGalleries } from "@/lib/galleries";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Projects",
  description: `Completed residential renovations by ${siteConfig.shortName}.`,
};

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const galleries = hasDatabase() ? await listGalleries() : [];

  return (
    <>
      <section className="bg-ink">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-28 sm:px-8 md:pb-20 md:pt-36">
          <h1 className="font-serif text-4xl tracking-tight text-gold sm:text-5xl">
            Projects
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
            A selection of finished work. Open a gallery to see the full set of
            photos.
          </p>
        </div>
      </section>
      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
          {galleries.length === 0 ? (
            <p className="text-muted">
              Project galleries will appear here as they are added.
            </p>
          ) : (
            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {galleries.map((gallery) => (
                <li key={gallery.id}>
                  <Link href={`/projects/${gallery.slug}`} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden bg-ink">
                      {gallery.cover_url ? (
                        <Image
                          src={gallery.cover_url}
                          alt={gallery.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : null}
                    </div>
                    <h2 className="mt-4 font-serif text-2xl text-ink">
                      {gallery.title}
                    </h2>
                    {gallery.neighborhood ? (
                      <p className="mt-1 text-sm text-muted">
                        {gallery.neighborhood}
                      </p>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
