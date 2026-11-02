-- Allow a live session to target all courses (courseId NULL).
ALTER TABLE "LiveSession" ALTER COLUMN "courseId" DROP NOT NULL;

-- Track real study time per mission.
ALTER TABLE "UserProgress" ADD COLUMN IF NOT EXISTS "timeSpentSeconds" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "UserProgress" ADD COLUMN IF NOT EXISTS "lastActiveAt" TIMESTAMP(3);

-- Preserve the previous estimate for missions completed before tracking existed.
UPDATE "UserProgress"
SET "timeSpentSeconds" = 1800
WHERE "completed" = true AND "timeSpentSeconds" = 0;
