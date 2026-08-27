"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { Photo, PhotoPair } from "@/lib/galleries";

export function ProjectMedia({
  pairs,
  photos,
  title,
}: {
  pairs: PhotoPair[];
  photos: Photo[];
  title: string;
}) {
  const sequence = [...pairs.flatMap((pair) => [pair.before, pair.after]), ...photos];
  const [active, setActive] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(() => {
    setActive((current) =>
      current === null || sequence.length === 0
        ? current
        : (current + sequence.length - 1) % sequence.length,
    );
  }, [sequence.length]);
  const next = useCallback(() => {
    setActive((current) =>
      current === null || sequence.length === 0
        ? current
        : (current + 1) % sequence.length,
    );
  }, [sequence.length]);

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

  function openPhoto(photoId: string) {
    const index = sequence.findIndex((photo) => photo.id === photoId);
    if (index >= 0) setActive(index);
  }

  const current = active !== null ? sequence[active] : null;

  return (
    <>
      {pairs.length > 0 ? (
        <div>
          <h2 className="font-serif text-2xl text-ink sm:text-3xl">
            Before & after
          </h2>
          <ul className="mt-6 space-y-8">
            {pairs.map((pair) => (
              <li key={pair.id}>
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => openPhoto(pair.before.id)}
                    className="text-left"
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-muted">
                      Before
                    </p>
                    <div className="relative mt-2 aspect-[4/3] overflow-hidden bg-ink">
                      <Image
                        src={pair.before.url}
                        alt={pair.before.alt || `${title} before`}
                        fill
                        sizes="50vw"
                        className="object-cover"
                      />
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => openPhoto(pair.after.id)}
                    className="text-left"
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-muted">
                      After
                    </p>
                    <div className="relative mt-2 aspect-[4/3] overflow-hidden bg-ink">
                      <Image
                        src={pair.after.url}
                        alt={pair.after.alt || `${title} after`}
                        fill
                        sizes="50vw"
                        className="object-cover"
                      />
                    </div>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {photos.length > 0 ? (
        <div className={pairs.length > 0 ? "mt-14" : undefined}>
          {pairs.length > 0 ? (
            <h2 className="font-serif text-2xl text-ink sm:text-3xl">Gallery</h2>
          ) : null}
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <li key={photo.id}>
                <button
                  type="button"
                  onClick={() => openPhoto(photo.id)}
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
        </div>
      ) : null}

      {current ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/95 px-4 pb-[max(4rem,env(safe-area-inset-bottom))] pt-16"
          onClick={close}
          onTouchStart={(event) =>
            setTouchStart(event.changedTouches[0]?.clientX ?? null)
          }
          onTouchEnd={(event) => {
            if (touchStart === null) return;
            const delta =
              (event.changedTouches[0]?.clientX ?? touchStart) - touchStart;
            if (delta > 50) prev();
            if (delta < -50) next();
            setTouchStart(null);
          }}
        >
          <button
            type="button"
            className="absolute right-4 top-4 min-h-12 px-3 text-sm text-gold"
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
            className="relative h-[70vh] w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={current.url}
              alt={current.alt || title}
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
