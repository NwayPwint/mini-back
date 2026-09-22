import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";
import {
  CreateLessonInput,
  UpdateLessonInput,
} from "../../validators/admin/lessonValidator";
import { recalcCourseStatsService } from "./courseService";

export const createLessonService = async (
  courseId: string,
  moduleId: string,
  data: CreateLessonInput,
) => {
  const course = await prisma.course.findFirst({
    where: { id: courseId, deletedAt: null },
  });

  if (!course) throw new AppError("Course not found", 404);

  const module = await prisma.courseModule.findFirst({
    where: { id: moduleId, courseId, deletedAt: null },
  });

  if (!module) throw new AppError("Module not found", 404);

  let targetOrder = data.order;

  if (!targetOrder) {
    const lastLesson = await prisma.lesson.findFirst({
      where: { moduleId, deletedAt: null },
      orderBy: { order: "desc" },
    });
    targetOrder = lastLesson ? lastLesson.order + 1 : 1;
  } else {
    await prisma.lesson.updateMany({
      where: {
        moduleId,
        deletedAt: null,
        order: { gte: targetOrder },
      },
      data: {
        order: { increment: 1 },
      },
    });
  }

  const newLesson = await prisma.lesson.create({
    data: { ...data, order: targetOrder, moduleId },
  });
  await recalcCourseStatsService(courseId);
  return newLesson;
};

export const updateLessonService = async (
  courseId: string,
  moduleId: string,
  lessonId: string,
  data: UpdateLessonInput,
) => {
  const course = await prisma.course.findFirst({
    where: { id: courseId, deletedAt: null },
  });

  if (!course) throw new AppError("Course not found", 404);

  const module = await prisma.courseModule.findFirst({
    where: { id: moduleId, courseId, deletedAt: null },
  });

  if (!module) throw new AppError("Module not found", 404);

  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId, moduleId, deletedAt: null },
  });

  if (!lesson) throw new AppError("Lesson not found", 404);

  if (data.order && data.order !== lesson.order) {
    const targetOrder = data.order;
    const oldOrder = lesson.order;

    if (targetOrder > oldOrder) {
      await prisma.lesson.updateMany({
        where: {
          moduleId,
          deletedAt: null,
          order: { gt: oldOrder, lte: targetOrder },
        },
        data: { order: { decrement: 1 } },
      });
    } else {
      await prisma.lesson.updateMany({
        where: {
          moduleId,
          deletedAt: null,
          order: { gte: targetOrder, lt: oldOrder + 1 },
        },
        data: { order: { increment: 1 } },
      });
    }
  }

  const updatedLesson = await prisma.lesson.update({
    where: {
      id: lessonId,
    },
    data,
  });

  await recalcCourseStatsService(courseId);
  return updatedLesson;
};

export const deleteLessonService = async (
  courseId: string,
  moduleId: string,
  lessonId: string,
) => {
  const course = await prisma.course.findFirst({
    where: { id: courseId, deletedAt: null },
  });

  if (!course) throw new AppError("Course not found", 404);

  const module = await prisma.courseModule.findFirst({
    where: { id: moduleId, courseId, deletedAt: null },
  });

  if (!module) throw new AppError("Module not found", 404);

  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId, moduleId, deletedAt: null },
  });

  if (!lesson) throw new AppError("Lesson not found", 404);

  const deletedLesson = await prisma.lesson.update({
    where: { id: lessonId },
    data: {
      deletedAt: new Date(),
    },
  });

  await recalcCourseStatsService(courseId);
  return deletedLesson;
};
