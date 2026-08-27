import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

type Sql = NeonQueryFunction<false, false>;

let sql: Sql | null = null;
let schemaReady = false;

const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS galleries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    neighborhood TEXT,
    description TEXT,
    cover_photo_id UUID,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gallery_id UUID NOT NULL REFERENCES galleries(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    pathname TEXT NOT NULL,
    width INTEGER NOT NULL DEFAULT 0,
    height INTEGER NOT NULL DEFAULT 0,
    alt TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS photos_gallery_sort_idx
    ON photos (gallery_id, sort_order)`,
  `CREATE TABLE IF NOT EXISTS photo_pairs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gallery_id UUID NOT NULL REFERENCES galleries(id) ON DELETE CASCADE,
    before_photo_id UUID NOT NULL UNIQUE REFERENCES photos(id) ON DELETE RESTRICT,
    after_photo_id UUID NOT NULL UNIQUE REFERENCES photos(id) ON DELETE RESTRICT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS photo_pairs_gallery_sort_idx
    ON photo_pairs (gallery_id, sort_order)`,
];

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

export async function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }
  if (!sql) {
    sql = neon(process.env.DATABASE_URL);
  }
  if (!schemaReady) {
    for (const statement of STATEMENTS) {
      await sql.query(statement);
    }
    schemaReady = true;
  }
  return sql;
}
