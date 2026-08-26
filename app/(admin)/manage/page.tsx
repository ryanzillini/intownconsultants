import Link from "next/link";
import { GalleryList } from "@/components/admin/gallery-list";

export default function ManagePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl text-gold sm:text-4xl">
            Galleries
          </h1>
          <p className="mt-2 text-sm text-white/70">
            Add a new job or open an existing one to drop in photos.
          </p>
        </div>
        <Link
          href="/manage/new"
          className="inline-flex min-h-12 items-center justify-center bg-gold px-5 text-sm text-ink"
        >
          New gallery
        </Link>
      </div>
      <div className="mt-10">
        <GalleryList />
      </div>
    </div>
  );
}
