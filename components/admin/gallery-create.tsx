"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function GalleryCreateForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    const response = await fetch("/api/admin/galleries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, neighborhood, description }),
    });
    const data = (await response.json().catch(() => null)) as
      | { gallery?: { id: string }; error?: string }
      | null;
    setPending(false);
    if (!response.ok || !data?.gallery) {
      setError(data?.error ?? "Could not create gallery");
      return;
    }
    router.replace(`/manage/${data.gallery.id}`);
  }

  return (
    <form onSubmit={(event) => void onSubmit(event)} className="space-y-5">
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
          rows={4}
          className="mt-2 w-full border border-gold/30 bg-ink px-4 py-3 text-base text-white outline-none focus:border-gold"
        />
      </label>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="min-h-12 w-full bg-gold text-sm text-ink disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {pending ? "Creating…" : "Create gallery"}
      </button>
    </form>
  );
}
