"use client";

import { upload } from "@vercel/blob/client";
import { useRef, useState } from "react";
import { prepareImage, safeFilename } from "@/lib/prepare-image";

type Pending = {
  name: string;
  preview: string;
  blob: Blob;
  width: number;
  height: number;
};

async function readShot(file: File): Promise<Pending> {
  const prepared = await prepareImage(file);
  return {
    name: file.name,
    preview: URL.createObjectURL(prepared.blob),
    blob: prepared.blob,
    width: prepared.width,
    height: prepared.height,
  };
}

async function uploadShot(
  galleryId: string,
  role: "before" | "after",
  shot: Pending,
) {
  return upload(
    `galleries/${galleryId}/pairs/${role}-${safeFilename(shot.name)}`,
    shot.blob,
    {
      access: "public",
      handleUploadUrl: "/api/admin/upload",
      contentType: "image/jpeg",
      multipart: shot.blob.size > 4 * 1024 * 1024,
    },
  );
}

export function PairWizard({
  galleryId,
  onSaved,
}: {
  galleryId: string;
  onSaved: () => Promise<void>;
}) {
  const beforeRef = useRef<HTMLInputElement>(null);
  const afterRef = useRef<HTMLInputElement>(null);
  const [before, setBefore] = useState<Pending | null>(null);
  const [after, setAfter] = useState<Pending | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function replaceShot(
    current: Pending | null,
    next: Pending,
    setter: (value: Pending | null) => void,
  ) {
    if (current) URL.revokeObjectURL(current.preview);
    setter(next);
  }

  async function onPick(
    file: File | undefined,
    setter: (value: Pending | null) => void,
    current: Pending | null,
  ) {
    if (!file) return;
    setError("");
    try {
      const shot = await readShot(file);
      replaceShot(current, shot, setter);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not read this photo — try JPEG or PNG",
      );
    }
  }

  function reset() {
    if (before) URL.revokeObjectURL(before.preview);
    if (after) URL.revokeObjectURL(after.preview);
    setBefore(null);
    setAfter(null);
    setStatus("");
    if (beforeRef.current) beforeRef.current.value = "";
    if (afterRef.current) afterRef.current.value = "";
  }

  async function savePair() {
    if (!before || !after) return;
    setSaving(true);
    setError("");
    setStatus("Uploading before…");
    let beforePath = "";
    try {
      const beforeBlob = await uploadShot(galleryId, "before", before);
      beforePath = beforeBlob.pathname;
      setStatus("Uploading after…");
      let afterBlob;
      try {
        afterBlob = await uploadShot(galleryId, "after", after);
      } catch (err) {
        await fetch("/api/admin/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pathname: beforePath }),
        });
        throw err;
      }
      setStatus("Saving pair…");
      const response = await fetch(`/api/admin/galleries/${galleryId}/pairs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          before: {
            url: beforeBlob.url,
            pathname: beforeBlob.pathname,
            width: before.width,
            height: before.height,
            alt: "Before",
          },
          after: {
            url: afterBlob.url,
            pathname: afterBlob.pathname,
            width: after.width,
            height: after.height,
            alt: "After",
          },
        }),
      });
      if (!response.ok) {
        await fetch("/api/admin/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pathname: beforeBlob.pathname }),
        });
        await fetch("/api/admin/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pathname: afterBlob.pathname }),
        });
        throw new Error("Could not save this before and after");
      }
      reset();
      await onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save pair");
    }
    setSaving(false);
    setStatus("");
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-white/55">
        Pick from your camera roll. Choose the before photo first, then the
        after.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-gold">Before</p>
          <button
            type="button"
            onClick={() => beforeRef.current?.click()}
            className="mt-2 min-h-12 w-full border border-gold/30 px-3 text-sm text-white"
          >
            {before ? "Change before" : "Choose before"}
          </button>
          <input
            ref={beforeRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) =>
              void onPick(event.target.files?.[0], setBefore, before)
            }
          />
          {before ? (
            // Local blob preview — not a remote Next/Image host.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={before.preview}
              alt="Before preview"
              className="mt-3 aspect-[4/3] w-full object-cover"
            />
          ) : null}
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-gold">After</p>
          <button
            type="button"
            onClick={() => afterRef.current?.click()}
            className="mt-2 min-h-12 w-full border border-gold/30 px-3 text-sm text-white"
          >
            {after ? "Change after" : "Choose after"}
          </button>
          <input
            ref={afterRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) =>
              void onPick(event.target.files?.[0], setAfter, after)
            }
          />
          {after ? (
            // Local blob preview — not a remote Next/Image host.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={after.preview}
              alt="After preview"
              className="mt-3 aspect-[4/3] w-full object-cover"
            />
          ) : null}
        </div>
      </div>
      {status ? <p className="text-sm text-white/70">{status}</p> : null}
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      <button
        type="button"
        disabled={!before || !after || saving}
        onClick={() => void savePair()}
        className="min-h-12 w-full bg-gold px-5 text-sm text-ink disabled:opacity-60 sm:w-auto"
      >
        {saving ? "Saving pair…" : "Save pair"}
      </button>
    </div>
  );
}
