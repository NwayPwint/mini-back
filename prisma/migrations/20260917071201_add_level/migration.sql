-- CreateEnum
CREATE TYPE "CourseLevel" AS ENUM ('BEGINNER', 'INTERMIDIATE', 'ADVANCE');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "level" "CourseLevel" NOT NULL DEFAULT 'BEGINNER';
