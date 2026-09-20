/*
  Warnings:

  - The values [INTERMIDIATE,ADVANCE] on the enum `CourseLevel` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('COURSE_REMINDER', 'CERTIFICATE', 'ANNOUNCEMENT', 'WEEKLY_DIGEST');

-- AlterEnum
BEGIN;
CREATE TYPE "CourseLevel_new" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
ALTER TABLE "public"."Course" ALTER COLUMN "level" DROP DEFAULT;
ALTER TABLE "Course" ALTER COLUMN "level" TYPE "CourseLevel_new" USING ("level"::text::"CourseLevel_new");
ALTER TYPE "CourseLevel" RENAME TO "CourseLevel_old";
ALTER TYPE "CourseLevel_new" RENAME TO "CourseLevel";
DROP TYPE "public"."CourseLevel_old";
ALTER TABLE "Course" ALTER COLUMN "level" SET DEFAULT 'BEGINNER';
COMMIT;

-- CreateTable
CREATE TABLE "NotificationPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weeklyDigest" BOOLEAN NOT NULL DEFAULT true,
    "courseReminders" BOOLEAN NOT NULL DEFAULT true,
    "announcements" BOOLEAN NOT NULL DEFAULT false,
    "certificateAlerts" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT,
    "link" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NotificationPreference_userId_key" ON "NotificationPreference"("userId");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");

-- CreateIndex
CREATE INDEX "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "NotificationPreference" ADD CONSTRAINT "NotificationPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
