import Link from "next/link";
import { GalleryEditor } from "@/components/admin/gallery-editor";

export default async function ManageGalleryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10">
      <Link href="/manage" className="text-sm text-gold hover:underline">
        Back to galleries
      </Link>
      <h1 className="mt-6 font-serif text-3xl text-gold">Edit gallery</h1>
      <div className="mt-8">
        <GalleryEditor galleryId={id} />
      </div>
    </div>
  );
}
