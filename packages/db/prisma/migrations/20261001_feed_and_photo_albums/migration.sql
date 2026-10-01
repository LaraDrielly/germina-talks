CREATE TABLE "posts" (
  "id" UUID NOT NULL,
  "author_id" UUID NOT NULL,
  "content" VARCHAR(280) NOT NULL,
  "scope_type" "ScopeType" NOT NULL,
  "classroom_id" UUID,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deleted_at" TIMESTAMPTZ(3),
  CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "photo_albums" (
  "id" UUID NOT NULL,
  "creator_id" UUID NOT NULL,
  "title" VARCHAR(120) NOT NULL,
  "description" VARCHAR(500),
  "scope_type" "ScopeType" NOT NULL,
  "classroom_id" UUID,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deleted_at" TIMESTAMPTZ(3),
  CONSTRAINT "photo_albums_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "photos" (
  "id" UUID NOT NULL,
  "album_id" UUID NOT NULL,
  "uploader_id" UUID NOT NULL,
  "object_key" TEXT NOT NULL,
  "content_type" VARCHAR(32) NOT NULL,
  "size_bytes" INTEGER NOT NULL,
  "caption" VARCHAR(200),
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "photos_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "photos_object_key_key" ON "photos"("object_key");
CREATE INDEX "posts_scope_type_classroom_id_created_at_id_idx" ON "posts"("scope_type", "classroom_id", "created_at", "id");
CREATE INDEX "posts_author_id_created_at_idx" ON "posts"("author_id", "created_at");
CREATE INDEX "photo_albums_scope_type_classroom_id_created_at_idx" ON "photo_albums"("scope_type", "classroom_id", "created_at");
CREATE INDEX "photos_album_id_created_at_id_idx" ON "photos"("album_id", "created_at", "id");

ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "posts" ADD CONSTRAINT "posts_classroom_id_fkey" FOREIGN KEY ("classroom_id") REFERENCES "classrooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "photo_albums" ADD CONSTRAINT "photo_albums_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "photo_albums" ADD CONSTRAINT "photo_albums_classroom_id_fkey" FOREIGN KEY ("classroom_id") REFERENCES "classrooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "photos" ADD CONSTRAINT "photos_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "photo_albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "photos" ADD CONSTRAINT "photos_uploader_id_fkey" FOREIGN KEY ("uploader_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "posts" ADD CONSTRAINT "posts_scope_classroom_consistency" CHECK (("scope_type" = 'global' AND "classroom_id" IS NULL) OR ("scope_type" = 'classroom' AND "classroom_id" IS NOT NULL));
ALTER TABLE "photo_albums" ADD CONSTRAINT "photo_albums_scope_classroom_consistency" CHECK (("scope_type" = 'global' AND "classroom_id" IS NULL) OR ("scope_type" = 'classroom' AND "classroom_id" IS NOT NULL));
