"use client";

import { upload } from "@vercel/blob/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { PairWizard } from "@/components/admin/pair-wizard";
import type { Gallery, Photo, PhotoPair } from "@/lib/galleries";
import { prepareImage, safeFilename } from "@/lib/prepare-image";

type Job = {
  id: string;
  name: string;
  status: "preparing" | "uploading" | "done" | "error";
  percent: number;
  error?: string;
};

export function GalleryEditor({ galleryId }: { galleryId: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [pairs, setPairs] = useState<PhotoPair[]>([]);
  const [title, setTitle] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [description, setDescription] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const response = await fetch(`/api/admin/galleries/${galleryId}`);
    const data = (await response.json()) as {
      gallery?: Gallery;
      photos?: Photo[];
      pairs?: PhotoPair[];
      error?: string;
    };
    if (!response.ok || !data.gallery) {
      throw new Error(data.error ?? "Could not load gallery");
    }
    setGallery(data.gallery);
    setPhotos(data.photos ?? []);
    setPairs(data.pairs ?? []);
    setTitle(data.gallery.title);
    setNeighborhood(data.gallery.neighborhood ?? "");
    setDescription(data.gallery.description ?? "");
  }, [galleryId]);

  useEffect(() => {
    load().catch((err: unknown) => {
      setError(err instanceof Error ? err.message : "Could not load gallery");
    });
  }, [load]);

  async function saveDetails() {
    setSaving(true);
    setError("");
    const response = await fetch(`/api/admin/galleries/${galleryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, neighborhood, description }),
    });
    const data = (await response.json().catch(() => null)) as
      | { gallery?: Gallery; error?: string }
      | null;
    setSaving(false);
    if (!response.ok || !data?.gallery) {
      setError(data?.error ?? "Could not save");
      return;
    }
    setGallery(data.gallery);
  }

  async function persistPhotoOrder(next: Photo[]) {
    setPhotos(next);
    await fetch(`/api/admin/galleries/${galleryId}/photos`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photoIds: next.map((photo) => photo.id) }),
    });
  }

  async function persistPairOrder(next: PhotoPair[]) {
    setPairs(next);
    await fetch(`/api/admin/galleries/${galleryId}/pairs`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pairIds: next.map((pair) => pair.id) }),
    });
  }

  function movePhoto(id: string, direction: -1 | 1) {
    const index = photos.findIndex((photo) => photo.id === id);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= photos.length) return;
    const next = [...photos];
    const [item] = next.splice(index, 1);
    next.splice(nextIndex, 0, item);
    void persistPhotoOrder(next);
  }

  function movePair(id: string, direction: -1 | 1) {
    const index = pairs.findIndex((pair) => pair.id === id);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= pairs.length) return;
    const next = [...pairs];
    const [item] = next.splice(index, 1);
    next.splice(nextIndex, 0, item);
    void persistPairOrder(next);
  }

  async function setCover(photoId: string) {
    const response = await fetch(`/api/admin/galleries/${galleryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cover_photo_id: photoId }),
    });
    if (response.ok) {
      setGallery((current) =>
        current ? { ...current, cover_photo_id: photoId } : current,
      );
    }
  }

  async function removePhoto(photoId: string) {
    if (!confirm("Remove this photo from the gallery?")) return;
    const response = await fetch(`/api/admin/photos/${photoId}`, {
      method: "DELETE",
    });
    if (response.ok) await load();
  }

  async function removePair(pairId: string) {
    if (!confirm("Remove this before and after pair?")) return;
    const response = await fetch(`/api/admin/pairs/${pairId}`, {
      method: "DELETE",
    });
    if (response.ok) await load();
  }

  async function removeGallery() {
    if (!confirm("Delete this whole gallery and its photos?")) return;
    const response = await fetch(`/api/admin/galleries/${galleryId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      router.replace("/manage");
    }
  }

  async function onFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);
    for (const file of files) {
      const jobId = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`;
      setJobs((current) => [
        ...current,
        { id: jobId, name: file.name, status: "preparing", percent: 0 },
      ]);
      try {
        const prepared = await prepareImage(file);
        setJobs((current) =>
          current.map((job) =>
            job.id === jobId ? { ...job, status: "uploading", percent: 5 } : job,
          ),
        );
        const blob = await upload(
          `galleries/${galleryId}/${safeFilename(file.name)}`,
          prepared.blob,
          {
            access: "public",
            handleUploadUrl: "/api/admin/upload",
            contentType: "image/jpeg",
            multipart: prepared.blob.size > 4 * 1024 * 1024,
            onUploadProgress: ({ percentage }) => {
              setJobs((current) =>
                current.map((job) =>
                  job.id === jobId
                    ? { ...job, percent: Math.max(5, Math.round(percentage)) }
                    : job,
                ),
              );
            },
          },
        );
        const response = await fetch(`/api/admin/galleries/${galleryId}/photos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: blob.url,
            pathname: blob.pathname,
            width: prepared.width,
            height: prepared.height,
            alt: gallery?.title ?? "",
          }),
        });
        if (!response.ok) {
          await fetch("/api/admin/upload", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pathname: blob.pathname }),
          });
          throw new Error("Saved the file but could not add it to the gallery");
        }
        setJobs((current) =>
          current.map((job) =>
            job.id === jobId ? { ...job, status: "done", percent: 100 } : job,
          ),
        );
        await load();
      } catch (err) {
        setJobs((current) =>
          current.map((job) =>
            job.id === jobId
              ? {
                  ...job,
                  status: "error",
                  error:
                    err instanceof Error
                      ? err.message
                      : "Could not read this photo — try JPEG or PNG",
                }
              : job,
          ),
        );
      }
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  if (error && !gallery) {
    return <p className="text-sm text-red-300">{error}</p>;
  }

  if (!gallery) {
    return <p className="text-sm text-white/60">Loading gallery…</p>;
  }

  return (
    <div className="space-y-12">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void saveDetails();
        }}
        className="space-y-4"
      >
        <label className="block">
          <span className="text-xs uppercase tracking-[0.18em] text-gold">
            Title
          </span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-2 min-h-12 w-full border border-gold/30 bg-ink px-4 text-base text-white outline-none focus:border-gold"
            required
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-[0.18em] text-gold">
            Neighborhood
          </span>
          <input
            value={neighborhood}
            onChange={(event) => setNeighborhood(event.target.value)}
            className="mt-2 min-h-12 w-full border border-gold/30 bg-ink px-4 text-base text-white outline-none focus:border-gold"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-[0.18em] text-gold">
            Description
          </span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            className="mt-2 w-full border border-gold/30 bg-ink px-4 py-3 text-base text-white outline-none focus:border-gold"
          />
        </label>
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        <button
          type="submit"
          disabled={saving}
          className="min-h-12 bg-gold px-6 text-sm text-ink disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save details"}
        </button>
      </form>

      <section>
        <h2 className="font-serif text-2xl text-gold">
          Before & after ({pairs.length})
        </h2>
        <div className="mt-4">
          <PairWizard galleryId={galleryId} onSaved={load} />
        </div>
        {pairs.length === 0 ? (
          <p className="mt-6 text-sm text-white/60">No before and after pairs yet.</p>
        ) : (
          <ul className="mt-6 space-y-4">
            {pairs.map((pair, index) => (
              <li key={pair.id} className="border border-gold/20 bg-black p-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-gold">
                      Before
                    </p>
                    <div className="relative mt-2 aspect-[4/3]">
                      <Image
                        src={pair.before.url}
                        alt={pair.before.alt || "Before"}
                        fill
                        sizes="50vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-gold">
                      After
                    </p>
                    <div className="relative mt-2 aspect-[4/3]">
                      <Image
                        src={pair.after.url}
                        alt={pair.after.alt || "After"}
                        fill
                        sizes="50vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="min-h-12 flex-1 border border-gold/30 px-2 text-xs text-white"
                    onClick={() => movePair(pair.id, -1)}
                    disabled={index === 0}
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    className="min-h-12 flex-1 border border-gold/30 px-2 text-xs text-white"
                    onClick={() => movePair(pair.id, 1)}
                    disabled={index === pairs.length - 1}
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    className="min-h-12 flex-1 border border-gold/30 px-2 text-xs text-gold"
                    onClick={() => void setCover(pair.after.id)}
                  >
                    {gallery.cover_photo_id === pair.after.id
                      ? "Cover"
                      : "Set cover"}
                  </button>
                  <button
                    type="button"
                    className="min-h-12 flex-1 border border-red-400/40 px-2 text-xs text-red-200"
                    onClick={() => void removePair(pair.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-serif text-2xl text-gold">
            Gallery ({photos.length})
          </h2>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="min-h-12 bg-gold px-5 text-sm text-ink"
          >
            Add photos
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(event) => void onFiles(event.target.files)}
          />
        </div>
        <p className="mt-2 text-sm text-white/55">
          Pick one or several photos from your camera roll. They are resized
          before upload so the site stays fast.
        </p>

        {jobs.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {jobs.map((job) => (
              <li key={job.id} className="text-sm text-white/70">
                {job.name}:{" "}
                {job.status === "error"
                  ? job.error
                  : job.status === "done"
                    ? "Added"
                    : `${job.status} ${job.percent}%`}
              </li>
            ))}
          </ul>
        ) : null}

        {photos.length === 0 ? (
          <p className="mt-6 text-sm text-white/60">No gallery photos yet.</p>
        ) : (
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.map((photo, index) => (
              <li key={photo.id} className="overflow-hidden border border-gold/20 bg-black">
                <div className="relative aspect-square">
                  <Image
                    src={photo.url}
                    alt={photo.alt || gallery.title}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-wrap gap-2 p-2">
                  <button
                    type="button"
                    className="min-h-12 flex-1 border border-gold/30 px-2 text-xs text-white"
                    onClick={() => movePhoto(photo.id, -1)}
                    disabled={index === 0}
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    className="min-h-12 flex-1 border border-gold/30 px-2 text-xs text-white"
                    onClick={() => movePhoto(photo.id, 1)}
                    disabled={index === photos.length - 1}
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    className="min-h-12 flex-1 border border-gold/30 px-2 text-xs text-gold"
                    onClick={() => void setCover(photo.id)}
                  >
                    {gallery.cover_photo_id === photo.id ? "Cover" : "Set cover"}
                  </button>
                  <button
                    type="button"
                    className="min-h-12 flex-1 border border-red-400/40 px-2 text-xs text-red-200"
                    onClick={() => void removePhoto(photo.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <button
        type="button"
        onClick={() => void removeGallery()}
        className="min-h-12 text-sm text-red-300 underline-offset-4 hover:underline"
      >
        Delete gallery
      </button>
    </div>
  );
}
