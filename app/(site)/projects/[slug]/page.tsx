import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectMedia } from "@/components/projects/project-media";
import { hasDatabase } from "@/lib/db";
import {
  getGalleryBySlug,
  listGalleryPhotos,
  listPairs,
} from "@/lib/galleries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!hasDatabase()) return { title: "Project" };
  const gallery = await getGalleryBySlug(slug);
  if (!gallery) return { title: "Project" };
  return {
    title: gallery.title,
    description: gallery.description ?? gallery.neighborhood ?? undefined,
  };
}

export default async function ProjectGalleryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!hasDatabase()) notFound();
  const gallery = await getGalleryBySlug(slug);
  if (!gallery) notFound();
  const [pairs, photos] = await Promise.all([
    listPairs(gallery.id),
    listGalleryPhotos(gallery.id),
  ]);
  const empty = pairs.length === 0 && photos.length === 0;

  return (
    <>
      <section className="bg-ink">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-28 sm:px-8 md:pb-20 md:pt-36">
          <p className="text-xs uppercase tracking-[0.18em] text-gold">
            Projects
          </p>
          <h1 className="mt-3 font-serif text-4xl tracking-tight text-gold sm:text-5xl">
            {gallery.title}
          </h1>
          {gallery.neighborhood ? (
            <p className="mt-3 text-sm text-white/70">{gallery.neighborhood}</p>
          ) : null}
          {gallery.description ? (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
              {gallery.description}
            </p>
          ) : null}
        </div>
      </section>
      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 md:py-16">
          {empty ? (
            <p className="text-muted">Photos for this project are coming soon.</p>
          ) : (
            <ProjectMedia pairs={pairs} photos={photos} title={gallery.title} />
          )}
        </div>
      </section>
    </>
  );
}
