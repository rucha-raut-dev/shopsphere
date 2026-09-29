ALTER TABLE "User" ADD COLUMN "passwordHash" TEXT;

UPDATE "User"
SET "name" = COALESCE(NULLIF(BTRIM("name"), ''), "email")
WHERE "name" IS NULL OR BTRIM("name") = '';

ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;