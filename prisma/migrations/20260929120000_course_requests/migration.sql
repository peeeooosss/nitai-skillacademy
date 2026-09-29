-- Phase 6: Course requests (gated enrollment) + open-enrollment flag
CREATE TYPE "CourseRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'WAITLISTED');

ALTER TABLE "Course" ADD COLUMN "isOpenEnrollment" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE "CourseRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT,
    "status" "CourseRequestStatus" NOT NULL DEFAULT 'PENDING',
    "adminNotes" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseRequest_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CourseRequest_userId_courseId_key" ON "CourseRequest"("userId", "courseId");
CREATE INDEX "CourseRequest_status_idx" ON "CourseRequest"("status");
CREATE INDEX "CourseRequest_courseId_idx" ON "CourseRequest"("courseId");
CREATE INDEX "CourseRequest_userId_idx" ON "CourseRequest"("userId");

ALTER TABLE "CourseRequest" ADD CONSTRAINT "CourseRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseRequest" ADD CONSTRAINT "CourseRequest_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;