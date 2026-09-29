ALTER TABLE "posts"
ADD CONSTRAINT "posts_scope_rule"
CHECK (
  ("scope_type" = 'global' AND "classroom_id" IS NULL) OR
  ("scope_type" = 'classroom' AND "classroom_id" IS NOT NULL)
);

ALTER TABLE "bulletin_items"
ADD CONSTRAINT "bulletin_items_scope_rule"
CHECK (
  ("scope_type" = 'global' AND "classroom_id" IS NULL) OR
  ("scope_type" = 'classroom' AND "classroom_id" IS NOT NULL)
);

ALTER TABLE "albums"
ADD CONSTRAINT "albums_scope_rule"
CHECK (
  ("scope_type" = 'global' AND "classroom_id" IS NULL) OR
  ("scope_type" = 'classroom' AND "classroom_id" IS NOT NULL)
);
