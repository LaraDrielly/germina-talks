-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "ContentStatus" AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- AlterTable albums: moderation columns
ALTER TABLE "albums" ADD COLUMN IF NOT EXISTS "status" "ContentStatus";
UPDATE "albums" SET "status" = 'approved' WHERE "status" IS NULL;
ALTER TABLE "albums" ALTER COLUMN "status" SET NOT NULL;
ALTER TABLE "albums" ALTER COLUMN "status" SET DEFAULT 'pending';
ALTER TABLE "albums" ADD COLUMN IF NOT EXISTS "moderated_by" UUID;
ALTER TABLE "albums" ADD COLUMN IF NOT EXISTS "moderated_at" TIMESTAMP(3);

-- Photos: move from bytea storage to URL + moderation
ALTER TABLE "photos" ADD COLUMN IF NOT EXISTS "url" VARCHAR(512);
UPDATE "photos" SET "url" = '/uploads/placeholder.jpg' WHERE "url" IS NULL;
ALTER TABLE "photos" ALTER COLUMN "url" SET NOT NULL;

ALTER TABLE "photos" ADD COLUMN IF NOT EXISTS "status" "ContentStatus";
UPDATE "photos" SET "status" = 'approved' WHERE "status" IS NULL;
ALTER TABLE "photos" ALTER COLUMN "status" SET NOT NULL;
ALTER TABLE "photos" ALTER COLUMN "status" SET DEFAULT 'pending';

ALTER TABLE "photos" ADD COLUMN IF NOT EXISTS "moderated_by" UUID;
ALTER TABLE "photos" ADD COLUMN IF NOT EXISTS "moderated_at" TIMESTAMP(3);

ALTER TABLE "photos" DROP COLUMN IF EXISTS "bytes";
ALTER TABLE "photos" DROP COLUMN IF EXISTS "content_type";
ALTER TABLE "photos" DROP COLUMN IF EXISTS "updated_at";
ALTER TABLE "photos" DROP COLUMN IF EXISTS "deleted_at";

-- Indexes
CREATE INDEX IF NOT EXISTS "albums_status_created_at_idx" ON "albums"("status", "created_at" DESC);
CREATE INDEX IF NOT EXISTS "photos_album_id_created_at_idx" ON "photos"("album_id", "created_at" DESC);
CREATE INDEX IF NOT EXISTS "photos_status_created_at_idx" ON "photos"("status", "created_at" DESC);

-- Foreign keys (ignore if already exist)
DO $$ BEGIN
  ALTER TABLE "albums" ADD CONSTRAINT "albums_moderated_by_fkey" FOREIGN KEY ("moderated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "photos" ADD CONSTRAINT "photos_moderated_by_fkey" FOREIGN KEY ("moderated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
