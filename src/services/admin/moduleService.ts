import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";
import {
  CreateModuleInput,
  UpdateModuleInput,
} from "../../validators/admin/moduleValidator";
import { recalcCourseStatsService } from "./courseService";

export const createModuleService = async (
  courseId: string,
  data: CreateModuleInput,
) => {
  const course = await prisma.course.findFirst({
    where: { id: courseId, deletedAt: null },
  });
  if (!course) throw new AppError("Course not found", 404);
  let targetOrder = data.order;

  if (!targetOrder) {
    const lastModule = await prisma.courseModule.findFirst({
      where: { courseId, deletedAt: null },
      orderBy: { order: "desc" },
    });
    targetOrder = lastModule ? lastModule.order + 1 : 1;
  } else {
    await prisma.courseModule.updateMany({
      where: {
        courseId,
        deletedAt: null,
        order: { gte: targetOrder },
      },
      data: {
        order: { increment: 1 },
      },
    });
  }
  const newModule = await prisma.courseModule.create({
    data: {
      ...data,
      order: targetOrder,
      courseId,
    },
  });
  await recalcCourseStatsService(courseId);
  return newModule;
};

export const updateModuleService = async (
  courseId: string,
  moduleId: string,
  data: UpdateModuleInput,
) => {
  const course = await prisma.course.findFirst({
    where: { id: courseId, deletedAt: null },
  });
  if (!course) throw new AppError("Course not found", 404);

  const module = await prisma.courseModule.findFirst({
    where: { id: moduleId, courseId, deletedAt: null },
  });
  if (!module) throw new AppError("Module not found", 404);

  if (data.order && data.order !== module.order) {
    const targetOrder = data.order;
    const oldOrder = module.order;

    if (targetOrder > oldOrder) {
      await prisma.courseModule.updateMany({
        where: {
          courseId,
          deletedAt: null,
          order: { gt: oldOrder, lte: targetOrder },
        },
        data: { order: { decrement: 1 } },
      });
    } else {
      await prisma.courseModule.updateMany({
        where: {
          courseId,
          deletedAt: null,
          order: { gte: targetOrder, lt: oldOrder + 1 },
        },
        data: { order: { increment: 1 } },
      });
    }
  }
  const updatedModule = await prisma.courseModule.update({
    where: { id: moduleId },
    data,
  });
  await recalcCourseStatsService(courseId);
  return updatedModule;
};

export const deleteModuleService = async (
  courseId: string,
  moduleId: string,
) => {
  const course = await prisma.course.findFirst({
    where: { id: courseId, deletedAt: null },
  });
  if (!course) throw new AppError("Course not found", 404);

  const module = await prisma.courseModule.findFirst({
    where: { id: moduleId, courseId, deletedAt: null },
  });
  if (!module) throw new AppError("Module not found", 404);

  const deletedModule = await prisma.courseModule.update({
    where: { id: moduleId },
    data: {
      deletedAt: new Date(),
    },
  });
  await recalcCourseStatsService(courseId);
  return deletedModule;
};
