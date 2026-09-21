import { CourseLevel, PrismaClient } from "@prisma/client";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";
import { CreateCourseInput } from "../../validators/admin/courseValidator";
import { PAGINATION } from "../../config/constant";

export const getCourseService = async (page: number, limit: number) => {
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, limit);

  const skip = (safePage - 1) * safeLimit;

  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where: { deletedAt: null },
      skip,
      take: safeLimit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.course.count({
      where: { deletedAt: null },
    }),
  ]);

  return {
    courses,
    pagination: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit) || 1,
    },
  };
};
export const createCourseService = async (
  data: CreateCourseInput,
  createdById: string,
) => {
  const existingCourse = await prisma.course.findFirst({
    where: { slug: data.slug, deletedAt: null },
  });

  if (existingCourse) {
    throw new AppError("Courses with this slug already exists", 400);
  }

  const newCourse = await prisma.course.create({
    data: {
      ...data,
      level: data.level || CourseLevel.BEGINNER,
      createdById,
    },
  });
  return newCourse;
};
