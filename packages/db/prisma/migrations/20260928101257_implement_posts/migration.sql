-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('student', 'teacher', 'admin');

-- CreateEnum
CREATE TYPE "public"."SchoolTrack" AS ENUM ('business', 'tech', 'factory');

-- CreateEnum
CREATE TYPE "public"."ScopeType" AS ENUM ('global', 'classroom');

-- CreateEnum
CREATE TYPE "public"."MemberRole" AS ENUM ('student', 'teacher');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL DEFAULT 'student',
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."classrooms" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "school_track" "public"."SchoolTrack" NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "classrooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."classroom_members" (
    "user_id" UUID NOT NULL,
    "classroom_id" UUID NOT NULL,
    "role_in_class" "public"."MemberRole" NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "classroom_members_pkey" PRIMARY KEY ("user_id","classroom_id")
);

-- CreateTable
CREATE TABLE "public"."posts" (
    "id" UUID NOT NULL,
    "author_id" UUID NOT NULL,
    "content" VARCHAR(280) NOT NULL,
    "scope_type" "public"."ScopeType" NOT NULL,
    "classroom_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "classrooms_slug_key" ON "public"."classrooms"("slug");

-- CreateIndex
CREATE INDEX "classroom_members_classroom_id_role_in_class_idx" ON "public"."classroom_members"("classroom_id", "role_in_class");

-- CreateIndex
CREATE INDEX "posts_scope_type_created_at_id_idx" ON "public"."posts"("scope_type", "created_at" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "posts_classroom_id_created_at_id_idx" ON "public"."posts"("classroom_id", "created_at" DESC, "id" DESC);

-- AddForeignKey
ALTER TABLE "public"."classroom_members" ADD CONSTRAINT "classroom_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."classroom_members" ADD CONSTRAINT "classroom_members_classroom_id_fkey" FOREIGN KEY ("classroom_id") REFERENCES "public"."classrooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."posts" ADD CONSTRAINT "posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."posts" ADD CONSTRAINT "posts_classroom_id_fkey" FOREIGN KEY ("classroom_id") REFERENCES "public"."classrooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddConstraint
ALTER TABLE "public"."posts" ADD CONSTRAINT "posts_scope_classroom_check" CHECK (
    ("scope_type" = 'global' AND "classroom_id" IS NULL)
    OR ("scope_type" = 'classroom' AND "classroom_id" IS NOT NULL)
);
