CREATE TYPE "UserRole" AS ENUM ('student', 'teacher', 'admin');
CREATE TYPE "SchoolTrack" AS ENUM ('business', 'tech', 'factory');
CREATE TYPE "ScopeType" AS ENUM ('global', 'classroom');
CREATE TYPE "member_role" AS ENUM ('student', 'teacher');

CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'student',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "classrooms" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "school_track" "SchoolTrack" NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "classrooms_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "classroom_members" (
    "user_id" UUID NOT NULL,
    "classroom_id" UUID NOT NULL,
    "role_in_class" "member_role" NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "classroom_members_pkey" PRIMARY KEY ("user_id", "classroom_id")
);

CREATE TABLE "bulletin_items" (
    "id" UUID NOT NULL,
    "author_id" UUID NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "body" TEXT NOT NULL,
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "scope_type" "ScopeType" NOT NULL,
    "classroom_id" UUID,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "bulletin_items_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "bulletin_scope_classroom_check" CHECK (
      ("scope_type" = 'global' AND "classroom_id" IS NULL)
      OR ("scope_type" = 'classroom' AND "classroom_id" IS NOT NULL)
    )
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "classrooms_slug_key" ON "classrooms"("slug");
CREATE INDEX "classroom_members_classroom_id_role_in_class_idx"
    ON "classroom_members"("classroom_id", "role_in_class");
CREATE INDEX "bulletin_items_scope_type_classroom_id_is_pinned_created_at_idx"
    ON "bulletin_items"("scope_type", "classroom_id", "is_pinned", "created_at");
CREATE INDEX "bulletin_items_expires_at_idx" ON "bulletin_items"("expires_at");

ALTER TABLE "classroom_members" ADD CONSTRAINT "classroom_members_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "classroom_members" ADD CONSTRAINT "classroom_members_classroom_id_fkey"
    FOREIGN KEY ("classroom_id") REFERENCES "classrooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "bulletin_items" ADD CONSTRAINT "bulletin_items_author_id_fkey"
    FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "bulletin_items" ADD CONSTRAINT "bulletin_items_classroom_id_fkey"
    FOREIGN KEY ("classroom_id") REFERENCES "classrooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
