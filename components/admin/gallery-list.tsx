"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { GalleryCard } from "@/lib/galleries";

export function GalleryList() {
  const [galleries, setGalleries] = useState<GalleryCard[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/galleries")
      .then(async (response) => {
        const data = (await response.json()) as {
          galleries?: GalleryCard[];
          error?: string;
        };
        if (!response.ok) {
          throw new Error(data.error ?? "Could not load galleries");
        }
        if (!cancelled) setGalleries(data.galleries ?? []);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load galleries");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <p className="text-sm text-red-300">{error}</p>;
  }

  if (!galleries) {
    return <p className="text-sm text-white/60">Loading galleries…</p>;
  }

  if (galleries.length === 0) {
    return (
      <p className="text-sm text-white/70">
        No galleries yet. Create one to start adding photos.
      </p>
    );
  }

  return (
    <ul className="grid gap-5 sm:grid-cols-2">
      {galleries.map((gallery) => (
        <li key={gallery.id}>
          <Link
            href={`/manage/${gallery.id}`}
            className="block overflow-hidden border border-gold/25 bg-ink"
          >
            <div className="relative aspect-[4/3] bg-black">
              {gallery.cover_url ? (
                <Image
                  src={gallery.cover_url}
                  alt={gallery.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-white/40">
                  No photos yet
                </div>
              )}
            </div>
            <div className="px-4 py-4">
              <p className="font-serif text-xl text-gold">{gallery.title}</p>
              <p className="mt-1 text-sm text-white/60">
                {Number(gallery.photo_count)}{" "}
                {Number(gallery.photo_count) === 1 ? "photo" : "photos"}
                {gallery.neighborhood ? ` · ${gallery.neighborhood}` : ""}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
