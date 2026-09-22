import { CourseLevel } from "@prisma/client";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";
import {
  CreateCourseInput,
  UpdateCourseInput,
} from "../../validators/admin/courseValidator";

export const getCoursesService = async (page: number, limit: number) => {
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

export const getCourseBySlugService = async (slug: string) => {
  const course = await prisma.course.findFirst({
    where: { slug, deletedAt: null },
    include: {
      modules: {
        where: { deletedAt: null },
        orderBy: {
          order: "asc",
        },
        include: {
          lessons: {
            where: { deletedAt: null },
            orderBy: { order: "asc" },
          },
        },
      },
      _count: {
        select: {
          enrollments: true,
          certificates: true,
        },
      },
    },
  });
  if (!course) {
    throw new AppError("Course not found", 404);
  }
  return course;
};

export const togglePublishService = async (slug: string) => {
  const course = await prisma.course.findFirst({
    where: { slug, deletedAt: null },
  });
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  const togglePublishCourse = await prisma.course.update({
    where: {
      id: course.id,
    },
    data: {
      published: !course.published,
    },
  });
  return togglePublishCourse;
};

export const updateCourseService = async (
  slug: string,
  data: UpdateCourseInput,
) => {
  const course = await prisma.course.findFirst({
    where: {
      slug,
      deletedAt: null,
    },
  });

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  if (data.slug && data.slug !== course.slug) {
    const existingSlug = await prisma.course.findFirst({
      where: {
        slug: data.slug,
        deletedAt: null,
        id: { not: course.id },
      },
    });
    if (existingSlug) {
      throw new AppError("A course with this slug already exists", 400);
    }
  }
  const updatedCourse = await prisma.course.update({
    where: { id: course.id },
    data,
  });

  return updatedCourse;
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

export const deleteCourseService = async (slug: string) => {
  const course = await prisma.course.findFirst({
    where: { slug, deletedAt: null },
  });
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  const deletedCourse = await prisma.course.update({
    where: {
      id: course.id,
      deletedAt: null,
    },
    data: {
      deletedAt: new Date(),
    },
  });

  return deletedCourse;
};

export const recalcCourseStatsService = async (courseId: string) => {
  const lessons = await prisma.lesson.findMany({
    where: {
      deletedAt: null,
      module: {
        courseId,
        deletedAt: null,
      },
    },
    select: { durationMinutes: true },
  });

  const lessonsCount = lessons.length;
  const durationMinutes = lessons.reduce(
    (sum, lesson) => sum + lesson.durationMinutes,
    0,
  );

  await prisma.course.update({
    where: { id: courseId },
    data: { lessonsCount, durationMinutes },
  });
};
