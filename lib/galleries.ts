import { getSql } from "@/lib/db";
import { slugify } from "@/lib/slug";

export type Gallery = {
  id: string;
  slug: string;
  title: string;
  neighborhood: string | null;
  description: string | null;
  cover_photo_id: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Photo = {
  id: string;
  gallery_id: string;
  url: string;
  pathname: string;
  width: number;
  height: number;
  alt: string;
  sort_order: number;
  created_at: string;
};

export type GalleryCard = Gallery & {
  photo_count: number;
  cover_url: string | null;
  cover_width: number | null;
  cover_height: number | null;
};

export async function listGalleries(): Promise<GalleryCard[]> {
  const sql = await getSql();
  const rows = await sql`
    SELECT
      g.id,
      g.slug,
      g.title,
      g.neighborhood,
      g.description,
      g.cover_photo_id,
      g.sort_order,
      g.created_at,
      g.updated_at,
      (SELECT count(*)::int FROM photos ph WHERE ph.gallery_id = g.id) AS photo_count,
      c.url AS cover_url,
      c.width AS cover_width,
      c.height AS cover_height
    FROM galleries g
    LEFT JOIN LATERAL (
      SELECT p.url, p.width, p.height
      FROM photos p
      WHERE p.gallery_id = g.id
      ORDER BY CASE WHEN p.id = g.cover_photo_id THEN 0 ELSE 1 END, p.sort_order ASC
      LIMIT 1
    ) c ON true
    ORDER BY g.sort_order ASC, g.created_at DESC
  `;
  return rows as GalleryCard[];
}

export async function getGalleryBySlug(slug: string) {
  const sql = await getSql();
  const rows = await sql`
    SELECT * FROM galleries WHERE slug = ${slug} LIMIT 1
  `;
  return (rows[0] as Gallery | undefined) ?? null;
}

export async function getGalleryById(id: string) {
  const sql = await getSql();
  const rows = await sql`
    SELECT * FROM galleries WHERE id = ${id} LIMIT 1
  `;
  return (rows[0] as Gallery | undefined) ?? null;
}

export async function listPhotos(galleryId: string): Promise<Photo[]> {
  const sql = await getSql();
  const rows = await sql`
    SELECT * FROM photos
    WHERE gallery_id = ${galleryId}
    ORDER BY sort_order ASC, created_at ASC
  `;
  return rows as Photo[];
}

async function uniqueSlug(base: string, excludeId?: string) {
  const sql = await getSql();
  let slug = base;
  let n = 2;
  for (;;) {
    const rows = excludeId
      ? await sql`SELECT id FROM galleries WHERE slug = ${slug} AND id <> ${excludeId} LIMIT 1`
      : await sql`SELECT id FROM galleries WHERE slug = ${slug} LIMIT 1`;
    if (rows.length === 0) return slug;
    slug = `${base}-${n++}`;
  }
}

export async function createGallery(input: {
  title: string;
  neighborhood?: string;
  description?: string;
}) {
  const sql = await getSql();
  const title = input.title.trim();
  const slug = await uniqueSlug(slugify(title));
  const neighborhood = input.neighborhood?.trim() || null;
  const description = input.description?.trim() || null;
  const rows = await sql`
    INSERT INTO galleries (slug, title, neighborhood, description, sort_order)
    VALUES (
      ${slug},
      ${title},
      ${neighborhood},
      ${description},
      (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM galleries)
    )
    RETURNING *
  `;
  return rows[0] as Gallery;
}

export async function updateGallery(
  id: string,
  input: {
    title?: string;
    neighborhood?: string | null;
    description?: string | null;
    cover_photo_id?: string | null;
  },
) {
  const existing = await getGalleryById(id);
  if (!existing) return null;
  const title = input.title?.trim() ?? existing.title;
  const slug =
    input.title !== undefined ? await uniqueSlug(slugify(title), id) : existing.slug;
  const neighborhood =
    input.neighborhood === undefined
      ? existing.neighborhood
      : input.neighborhood?.trim() || null;
  const description =
    input.description === undefined
      ? existing.description
      : input.description?.trim() || null;
  const cover =
    input.cover_photo_id === undefined
      ? existing.cover_photo_id
      : input.cover_photo_id;
  const sql = await getSql();
  const rows = await sql`
    UPDATE galleries
    SET
      title = ${title},
      slug = ${slug},
      neighborhood = ${neighborhood},
      description = ${description},
      cover_photo_id = ${cover},
      updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `;
  return (rows[0] as Gallery | undefined) ?? null;
}

export async function deleteGallery(id: string) {
  const sql = await getSql();
  const rows = await sql`
    DELETE FROM galleries WHERE id = ${id} RETURNING id
  `;
  return rows.length > 0;
}

export async function addPhoto(input: {
  galleryId: string;
  url: string;
  pathname: string;
  width: number;
  height: number;
  alt?: string;
}) {
  const sql = await getSql();
  const rows = await sql`
    INSERT INTO photos (gallery_id, url, pathname, width, height, alt, sort_order)
    VALUES (
      ${input.galleryId},
      ${input.url},
      ${input.pathname},
      ${input.width},
      ${input.height},
      ${input.alt ?? ""},
      (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM photos WHERE gallery_id = ${input.galleryId})
    )
    RETURNING *
  `;
  const photo = rows[0] as Photo;
  await sql`
    UPDATE galleries
    SET
      cover_photo_id = COALESCE(cover_photo_id, ${photo.id}),
      updated_at = now()
    WHERE id = ${input.galleryId}
  `;
  return photo;
}

export async function reorderPhotos(galleryId: string, photoIds: string[]) {
  const sql = await getSql();
  for (const [index, photoId] of photoIds.entries()) {
    await sql`
      UPDATE photos
      SET sort_order = ${index}
      WHERE id = ${photoId} AND gallery_id = ${galleryId}
    `;
  }
  await sql`UPDATE galleries SET updated_at = now() WHERE id = ${galleryId}`;
}

export async function deletePhoto(id: string) {
  const sql = await getSql();
  const rows = await sql`
    DELETE FROM photos WHERE id = ${id} RETURNING id, gallery_id, pathname
  `;
  const deleted = rows[0] as
    | { id: string; gallery_id: string; pathname: string }
    | undefined;
  if (!deleted) return null;
  await sql`
    UPDATE galleries
    SET
      cover_photo_id = CASE
        WHEN cover_photo_id = ${id} THEN (
          SELECT p.id FROM photos p
          WHERE p.gallery_id = ${deleted.gallery_id}
          ORDER BY p.sort_order ASC
          LIMIT 1
        )
        ELSE cover_photo_id
      END,
      updated_at = now()
    WHERE id = ${deleted.gallery_id}
  `;
  return deleted;
}
