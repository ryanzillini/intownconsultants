import Link from "next/link";
import { GalleryCreateForm } from "@/components/admin/gallery-create";

export default function NewGalleryPage() {
  return (
    <div className="mx-auto w-full max-w-xl px-5 py-10">
      <Link href="/manage" className="text-sm text-gold hover:underline">
        Back to galleries
      </Link>
      <h1 className="mt-6 font-serif text-3xl text-gold">New gallery</h1>
      <p className="mt-2 text-sm text-white/70">
        Give it a name first. You can add photos on the next screen.
      </p>
      <div className="mt-8">
        <GalleryCreateForm />
      </div>
    </div>
  );
}
