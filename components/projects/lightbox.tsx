"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { Photo } from "@/lib/galleries";

export function ProjectLightbox({
  photos,
  title,
}: {
  photos: Photo[];
  title: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(() => {
    setActive((current) =>
      current === null ? current : (current + photos.length - 1) % photos.length,
    );
  }, [photos.length]);
  const next = useCallback(() => {
    setActive((current) =>
      current === null ? current : (current + 1) % photos.length,
    );
  }, [photos.length]);

  useEffect(() => {
    if (active === null) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") prev();
      if (event.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close, next, prev]);

  return (
    <>
      <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo, index) => (
          <li key={photo.id}>
            <button
              type="button"
              onClick={() => setActive(index)}
              className="relative block aspect-[4/3] w-full overflow-hidden bg-ink"
            >
              <Image
                src={photo.url}
                alt={photo.alt || title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </button>
          </li>
        ))}
      </ul>

      {active !== null ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/95 p-4"
          onClick={close}
          onTouchStart={(event) => setTouchStart(event.changedTouches[0]?.clientX ?? null)}
          onTouchEnd={(event) => {
            if (touchStart === null) return;
            const delta = (event.changedTouches[0]?.clientX ?? touchStart) - touchStart;
            if (delta > 50) prev();
            if (delta < -50) next();
            setTouchStart(null);
          }}
        >
          <button
            type="button"
            className="absolute right-4 top-4 min-h-11 px-3 text-sm text-gold"
            onClick={close}
          >
            Close
          </button>
          <button
            type="button"
            className="absolute left-2 min-h-12 px-3 text-white sm:left-6"
            onClick={(event) => {
              event.stopPropagation();
              prev();
            }}
          >
            Prev
          </button>
          <div
            className="relative h-[80vh] w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={photos[active].url}
              alt={photos[active].alt || title}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
          <button
            type="button"
            className="absolute right-2 min-h-12 px-3 text-white sm:right-6"
            onClick={(event) => {
              event.stopPropagation();
              next();
            }}
          >
            Next
          </button>
        </div>
      ) : null}
    </>
  );
}
