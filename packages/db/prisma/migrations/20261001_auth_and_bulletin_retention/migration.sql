ALTER TABLE "users" ADD COLUMN "password_hash" TEXT;
ALTER TABLE "bulletin_items" ADD COLUMN "deleted_at" TIMESTAMPTZ(3);

ALTER TABLE "users"
  ALTER COLUMN "created_at" TYPE TIMESTAMPTZ(3) USING "created_at" AT TIME ZONE 'UTC',
  ALTER COLUMN "updated_at" TYPE TIMESTAMPTZ(3) USING "updated_at" AT TIME ZONE 'UTC';

ALTER TABLE "classrooms"
  ALTER COLUMN "created_at" TYPE TIMESTAMPTZ(3) USING "created_at" AT TIME ZONE 'UTC';

ALTER TABLE "classroom_members"
  ALTER COLUMN "joined_at" TYPE TIMESTAMPTZ(3) USING "joined_at" AT TIME ZONE 'UTC';

ALTER TABLE "bulletin_items"
  ALTER COLUMN "expires_at" TYPE TIMESTAMPTZ(3) USING "expires_at" AT TIME ZONE 'UTC',
  ALTER COLUMN "created_at" TYPE TIMESTAMPTZ(3) USING "created_at" AT TIME ZONE 'UTC',
  ALTER COLUMN "updated_at" TYPE TIMESTAMPTZ(3) USING "updated_at" AT TIME ZONE 'UTC';
