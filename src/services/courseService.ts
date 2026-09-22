import { EnrollmentStatus } from "@prisma/client";
import prisma from "../config/prisma";
import { AppError } from "../utils/appError";

export const getCourseBySlugService = async (slug: string, userId?: string) => {
  const course = await prisma.course.findFirst({
    where: { slug },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            select: {
              id: true,
              title: true,
              durationMinutes: true,
              isFreePreview: true,
              order: true,
            },
          },
        },
      },
      _count: {
        select: {
          enrollments: {
            where: { status: { not: EnrollmentStatus.CANCELLED } },
          },
        },
      },
    },
  });
  if (!course) {
    throw new AppError("Course not found", 404);
  }
  let isEnrolled = false;
  let isSaved = false;
  let progress = 0;

  if (userId) {
    const [enrollment, savedCourse] = await Promise.all([
      prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: course.id,
          },
        },
      }),
      prisma.savedCourse.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: course.id,
          },
        },
      }),
    ]);

    if (enrollment && enrollment.status !== EnrollmentStatus.CANCELLED) {
      isEnrolled = true;
      progress = enrollment.progress;
    }

    if (savedCourse) {
      isSaved = true;
    }
  }

  return {
    ...course,
    isEnrolled,
    isSaved,
    progress,
  };
};

export const enrollInCourseService = async (slug: string, userId: string) => {
  const course = await prisma.course.findFirst({ where: { slug } });
  if (!course) {
    throw new AppError("Course not found", 404);
  }
  const enrollment = await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
    update: {
      status: EnrollmentStatus.ACTIVE,
    },
    create: {
      userId,
      courseId: course.id,
      status: EnrollmentStatus.ACTIVE,
      progress: 0,
    },
  });
  return enrollment;
};

export const unenrollInCourseService = async (slug: string, userId: string) => {
  const course = await prisma.course.findFirst({ where: { slug } });
  if (!course) {
    throw new AppError("Course not found", 404);
  }
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  });
  if (!enrollment || enrollment.status === EnrollmentStatus.CANCELLED) {
    throw new AppError("You are not actively enrolled in this course", 400);
  }

  const updatedEnrollment = await prisma.enrollment.update({
    where: {
      id: enrollment.id,
    },
    data: {
      status: EnrollmentStatus.CANCELLED,
    },
  });

  return updatedEnrollment;
};

export const updateProgressService = async (
  userId: string,
  enrollmentId: string,
  progress: number,
) => {
  const existingEnrollment = await prisma.enrollment.findFirst({
    where: {
      id: enrollmentId,
      userId,
    },
  });

  if (!existingEnrollment) {
    throw new AppError("Enrollment not found", 404);
  }

  const isCompleted = progress >= 100;

  const updatedEnrollment = await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: {
      progress,
      ...(isCompleted && {
        status: EnrollmentStatus.COMPLETED,
        completedAt: new Date(),
      }),
    },
  });

  return updatedEnrollment;
};
