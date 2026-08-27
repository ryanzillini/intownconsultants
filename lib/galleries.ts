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
  pair_count: number;
  cover_url: string | null;
  cover_width: number | null;
  cover_height: number | null;
};

export type PhotoPair = {
  id: string;
  gallery_id: string;
  sort_order: number;
  created_at: string;
  before: Photo;
  after: Photo;
};

type PhotoInput = {
  url: string;
  pathname: string;
  width: number;
  height: number;
  alt?: string;
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
      (
        SELECT count(*)::int FROM photos ph
        WHERE ph.gallery_id = g.id
          AND NOT EXISTS (
            SELECT 1 FROM photo_pairs pp
            WHERE pp.gallery_id = g.id
              AND (pp.before_photo_id = ph.id OR pp.after_photo_id = ph.id)
          )
      ) AS photo_count,
      (SELECT count(*)::int FROM photo_pairs pp WHERE pp.gallery_id = g.id) AS pair_count,
      c.url AS cover_url,
      c.width AS cover_width,
      c.height AS cover_height
    FROM galleries g
    LEFT JOIN LATERAL (
      SELECT p.url, p.width, p.height
      FROM photos p
      WHERE p.gallery_id = g.id
      ORDER BY
        CASE WHEN g.cover_photo_id IS NOT NULL AND p.id = g.cover_photo_id THEN 0 ELSE 1 END,
        CASE WHEN p.id = (
          SELECT pp.after_photo_id FROM photo_pairs pp
          WHERE pp.gallery_id = g.id
          ORDER BY pp.sort_order ASC, pp.created_at ASC
          LIMIT 1
        ) THEN 0 ELSE 1 END,
        CASE WHEN NOT EXISTS (
          SELECT 1 FROM photo_pairs pp
          WHERE pp.gallery_id = g.id
            AND (pp.before_photo_id = p.id OR pp.after_photo_id = p.id)
        ) THEN 0 ELSE 1 END,
        p.sort_order ASC,
        p.created_at ASC
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

export async function listGalleryPhotos(galleryId: string): Promise<Photo[]> {
  const sql = await getSql();
  const rows = await sql`
    SELECT p.* FROM photos p
    WHERE p.gallery_id = ${galleryId}
      AND NOT EXISTS (
        SELECT 1 FROM photo_pairs pp
        WHERE pp.gallery_id = ${galleryId}
          AND (pp.before_photo_id = p.id OR pp.after_photo_id = p.id)
      )
    ORDER BY p.sort_order ASC, p.created_at ASC
  `;
  return rows as Photo[];
}

function rowToPair(row: Record<string, unknown>): PhotoPair {
  return {
    id: String(row.id),
    gallery_id: String(row.gallery_id),
    sort_order: Number(row.sort_order),
    created_at: String(row.created_at),
    before: {
      id: String(row.before_id),
      gallery_id: String(row.gallery_id),
      url: String(row.before_url),
      pathname: String(row.before_pathname),
      width: Number(row.before_width),
      height: Number(row.before_height),
      alt: String(row.before_alt ?? ""),
      sort_order: Number(row.before_sort_order),
      created_at: String(row.before_created_at),
    },
    after: {
      id: String(row.after_id),
      gallery_id: String(row.gallery_id),
      url: String(row.after_url),
      pathname: String(row.after_pathname),
      width: Number(row.after_width),
      height: Number(row.after_height),
      alt: String(row.after_alt ?? ""),
      sort_order: Number(row.after_sort_order),
      created_at: String(row.after_created_at),
    },
  };
}

export async function listPairs(galleryId: string): Promise<PhotoPair[]> {
  const sql = await getSql();
  const rows = await sql`
    SELECT
      pp.id,
      pp.gallery_id,
      pp.sort_order,
      pp.created_at,
      b.id AS before_id,
      b.url AS before_url,
      b.pathname AS before_pathname,
      b.width AS before_width,
      b.height AS before_height,
      b.alt AS before_alt,
      b.sort_order AS before_sort_order,
      b.created_at AS before_created_at,
      a.id AS after_id,
      a.url AS after_url,
      a.pathname AS after_pathname,
      a.width AS after_width,
      a.height AS after_height,
      a.alt AS after_alt,
      a.sort_order AS after_sort_order,
      a.created_at AS after_created_at
    FROM photo_pairs pp
    JOIN photos b ON b.id = pp.before_photo_id
    JOIN photos a ON a.id = pp.after_photo_id
    WHERE pp.gallery_id = ${galleryId}
    ORDER BY pp.sort_order ASC, pp.created_at ASC
  `;
  return (rows as Record<string, unknown>[]).map(rowToPair);
}

export async function getPairById(id: string) {
  const sql = await getSql();
  const rows = await sql`
    SELECT
      pp.id,
      pp.gallery_id,
      pp.sort_order,
      pp.created_at,
      b.id AS before_id,
      b.url AS before_url,
      b.pathname AS before_pathname,
      b.width AS before_width,
      b.height AS before_height,
      b.alt AS before_alt,
      b.sort_order AS before_sort_order,
      b.created_at AS before_created_at,
      a.id AS after_id,
      a.url AS after_url,
      a.pathname AS after_pathname,
      a.width AS after_width,
      a.height AS after_height,
      a.alt AS after_alt,
      a.sort_order AS after_sort_order,
      a.created_at AS after_created_at
    FROM photo_pairs pp
    JOIN photos b ON b.id = pp.before_photo_id
    JOIN photos a ON a.id = pp.after_photo_id
    WHERE pp.id = ${id}
    LIMIT 1
  `;
  const row = rows[0] as Record<string, unknown> | undefined;
  return row ? rowToPair(row) : null;
}

async function insertPhoto(galleryId: string, input: PhotoInput) {
  const sql = await getSql();
  const rows = await sql`
    INSERT INTO photos (gallery_id, url, pathname, width, height, alt, sort_order)
    VALUES (
      ${galleryId},
      ${input.url},
      ${input.pathname},
      ${input.width},
      ${input.height},
      ${input.alt ?? ""},
      (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM photos WHERE gallery_id = ${galleryId})
    )
    RETURNING *
  `;
  return rows[0] as Photo;
}

export async function createPair(
  galleryId: string,
  input: { before: PhotoInput; after: PhotoInput },
) {
  const before = await insertPhoto(galleryId, {
    ...input.before,
    alt: input.before.alt || "Before",
  });
  const after = await insertPhoto(galleryId, {
    ...input.after,
    alt: input.after.alt || "After",
  });
  const sql = await getSql();
  const rows = await sql`
    INSERT INTO photo_pairs (gallery_id, before_photo_id, after_photo_id, sort_order)
    VALUES (
      ${galleryId},
      ${before.id},
      ${after.id},
      (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM photo_pairs WHERE gallery_id = ${galleryId})
    )
    RETURNING id
  `;
  await sql`
    UPDATE galleries
    SET
      cover_photo_id = COALESCE(cover_photo_id, ${after.id}),
      updated_at = now()
    WHERE id = ${galleryId}
  `;
  const pair = await getPairById(String((rows[0] as { id: string }).id));
  if (!pair) throw new Error("Could not load pair");
  return pair;
}

export async function reorderPairs(galleryId: string, pairIds: string[]) {
  const sql = await getSql();
  for (const [index, pairId] of pairIds.entries()) {
    await sql`
      UPDATE photo_pairs
      SET sort_order = ${index}
      WHERE id = ${pairId} AND gallery_id = ${galleryId}
    `;
  }
  await sql`UPDATE galleries SET updated_at = now() WHERE id = ${galleryId}`;
}

export async function deletePair(id: string) {
  const pair = await getPairById(id);
  if (!pair) return null;
  const sql = await getSql();
  await sql`DELETE FROM photo_pairs WHERE id = ${id}`;
  await sql`DELETE FROM photos WHERE id = ${pair.before.id}`;
  await sql`DELETE FROM photos WHERE id = ${pair.after.id}`;
  await sql`
    UPDATE galleries
    SET
      cover_photo_id = CASE
        WHEN cover_photo_id IN (${pair.before.id}, ${pair.after.id}) THEN (
          SELECT COALESCE(
            (
              SELECT pp.after_photo_id FROM photo_pairs pp
              WHERE pp.gallery_id = ${pair.gallery_id}
              ORDER BY pp.sort_order ASC, pp.created_at ASC
              LIMIT 1
            ),
            (
              SELECT p.id FROM photos p
              WHERE p.gallery_id = ${pair.gallery_id}
              ORDER BY p.sort_order ASC, p.created_at ASC
              LIMIT 1
            )
          )
        )
        ELSE cover_photo_id
      END,
      updated_at = now()
    WHERE id = ${pair.gallery_id}
  `;
  return {
    id: pair.id,
    gallery_id: pair.gallery_id,
    pathnames: [pair.before.pathname, pair.after.pathname].filter(Boolean),
  };
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
  const photo = await insertPhoto(input.galleryId, input);
  const sql = await getSql();
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
  const paired = await sql`
    SELECT id FROM photo_pairs
    WHERE before_photo_id = ${id} OR after_photo_id = ${id}
    LIMIT 1
  `;
  if (paired.length > 0) {
    const removed = await deletePair(String((paired[0] as { id: string }).id));
    if (!removed) return null;
    return { id, gallery_id: removed.gallery_id, pathnames: removed.pathnames };
  }
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
          SELECT COALESCE(
            (
              SELECT pp.after_photo_id FROM photo_pairs pp
              WHERE pp.gallery_id = ${deleted.gallery_id}
              ORDER BY pp.sort_order ASC, pp.created_at ASC
              LIMIT 1
            ),
            (
              SELECT p.id FROM photos p
              WHERE p.gallery_id = ${deleted.gallery_id}
              ORDER BY p.sort_order ASC, p.created_at ASC
              LIMIT 1
            )
          )
        )
        ELSE cover_photo_id
      END,
      updated_at = now()
    WHERE id = ${deleted.gallery_id}
  `;
  return {
    id: deleted.id,
    gallery_id: deleted.gallery_id,
    pathnames: [deleted.pathname],
  };
}
