"use client";

import { upload } from "@vercel/blob/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Gallery, Photo } from "@/lib/galleries";
import { prepareImage, safeFilename } from "@/lib/prepare-image";
import { cn } from "@/lib/utils";

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
  const [title, setTitle] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [description, setDescription] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const response = await fetch(`/api/admin/galleries/${galleryId}`);
    const data = (await response.json()) as {
      gallery?: Gallery;
      photos?: Photo[];
      error?: string;
    };
    if (!response.ok || !data.gallery) {
      throw new Error(data.error ?? "Could not load gallery");
    }
    setGallery(data.gallery);
    setPhotos(data.photos ?? []);
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

  async function persistOrder(next: Photo[]) {
    setPhotos(next);
    await fetch(`/api/admin/galleries/${galleryId}/photos`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photoIds: next.map((photo) => photo.id) }),
    });
  }

  function movePhoto(id: string, direction: -1 | 1) {
    const index = photos.findIndex((photo) => photo.id === id);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= photos.length) return;
    const next = [...photos];
    const [item] = next.splice(index, 1);
    next.splice(nextIndex, 0, item);
    void persistOrder(next);
  }

  function onDrop(targetId: string) {
    if (!draggingId || draggingId === targetId) return;
    const from = photos.findIndex((photo) => photo.id === draggingId);
    const to = photos.findIndex((photo) => photo.id === targetId);
    if (from < 0 || to < 0) return;
    const next = [...photos];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setDraggingId(null);
    void persistOrder(next);
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
    if (response.ok) {
      setPhotos((current) => current.filter((photo) => photo.id !== photoId));
    }
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
                    err instanceof Error ? err.message : "Upload failed",
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
    <div className="space-y-10">
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-serif text-2xl text-gold">
            Photos ({photos.length})
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
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
            multiple
            className="hidden"
            onChange={(event) => void onFiles(event.target.files)}
          />
        </div>
        <p className="mt-2 text-sm text-white/55">
          You can pick several photos at once from your camera roll. They are
          resized before upload so the site stays fast.
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
          <p className="mt-6 text-sm text-white/60">No photos in this gallery yet.</p>
        ) : (
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.map((photo, index) => (
              <li
                key={photo.id}
                draggable
                onDragStart={() => setDraggingId(photo.id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => onDrop(photo.id)}
                className={cn(
                  "overflow-hidden border border-gold/20 bg-black",
                  draggingId === photo.id && "opacity-60",
                )}
              >
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
                    className="min-h-11 flex-1 border border-gold/30 px-2 text-xs text-white"
                    onClick={() => movePhoto(photo.id, -1)}
                    disabled={index === 0}
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    className="min-h-11 flex-1 border border-gold/30 px-2 text-xs text-white"
                    onClick={() => movePhoto(photo.id, 1)}
                    disabled={index === photos.length - 1}
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    className="min-h-11 flex-1 border border-gold/30 px-2 text-xs text-gold"
                    onClick={() => void setCover(photo.id)}
                  >
                    {gallery.cover_photo_id === photo.id ? "Cover" : "Set cover"}
                  </button>
                  <button
                    type="button"
                    className="min-h-11 flex-1 border border-red-400/40 px-2 text-xs text-red-200"
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
