import { EnrollmentStatus } from "@prisma/client";
import prisma from "../config/prisma";
import { AppError } from "../utils/appError";

interface GetMyCoursesParams {
  userId: string;
  status?: EnrollmentStatus;
  q?: string;
}

export const getStudentDashboardService = async (userId: string) => {
  const [
    user,
    enrolledCount,
    completedCount,
    certificatesCount,
    inProgressEnrollments,
    completedEnrollmentsWithDuration,
    recommendedCourses,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        weeklyTargetHours: true,
      },
    }),

    prisma.enrollment.count({
      where: { userId },
    }),

    prisma.enrollment.count({
      where: { userId, status: EnrollmentStatus.COMPLETED },
    }),

    prisma.certificate.count({
      where: { userId },
    }),

    prisma.enrollment.findMany({
      where: { userId, status: EnrollmentStatus.ACTIVE },
      select: {
        id: true,
        progress: true,
        status: true,
        enrolledAt: true,
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            instructorName: true,
            durationMinutes: true,
            lessonsCount: true,
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
    }),
    prisma.enrollment.findMany({
      where: { userId, status: EnrollmentStatus.COMPLETED },
      select: {
        course: {
          select: { durationMinutes: true },
        },
      },
    }),
    prisma.course.findMany({
      where: {
        published: true,
        enrollments: {
          none: { userId },
        },
      },
      take: 5,
      orderBy: { rating: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        instructorName: true,
        level: true,
        lessonsCount: true,
        rating: true,
        durationMinutes: true,
        _count: {
          select: { enrollments: true },
        },
      },
    }),
  ]);

  if (!user) {
    throw new AppError("Student profile not found", 404);
  }

  const totalMinutes = completedEnrollmentsWithDuration.reduce(
    (sum, item) => sum + item.course.durationMinutes,
    0,
  );
  const hoursLearned = Number((totalMinutes / 60).toFixed(1));

  return {
    user,
    stats: {
      enrolled: enrolledCount,
      completed: completedCount,
      certificates: certificatesCount,
      hoursLearned,
      weeklyTargetHours: user.weeklyTargetHours ?? 5,
    },
    inProgressEnrollments,
    recommendedCourses: recommendedCourses.map((course) => ({
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      instructorName: course.instructorName,
      level: course.level,
      lessonsCount: course.lessonsCount,
      rating: course.rating,
      durationMinutes: course.durationMinutes,
      studentCount: course._count.enrollments,
    })),
  };
};

export const getMyCoursesService = async ({
  userId,
  status,
  q,
}: GetMyCoursesParams) => {
  const enrollments = await prisma.enrollment.findMany({
    where: {
      userId,
      status: status ? status : { not: EnrollmentStatus.CANCELLED },
      ...(q && {
        course: {
          title: { contains: q, mode: "insensitive" },
        },
      }),
    },
    select: {
      id: true,
      progress: true,
      status: true,
      enrolledAt: true,
      completedAt: true,
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          instructorName: true,
          level: true,
          rating: true,
          lessonsCount: true,
          durationMinutes: true,
          _count: {
            select: { enrollments: true },
          },
        },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });
  return enrollments.map((item) => ({
    id: item.id,
    progress: item.progress,
    status: item.status,
    enrolledAt: item.enrolledAt,
    completedAt: item.completedAt,
    course: {
      id: item.course.id,
      title: item.course.title,
      slug: item.course.slug,
      instructorName: item.course.instructorName,
      level: item.course.level,
      rating: item.course.rating,
      lessonsCount: item.course.lessonsCount,
      durationMinutes: item.course.durationMinutes,
      studentCount: item.course._count.enrollments,
    },
  }));
};

export const getCertificatesService = async (userId: string) => {
  const certificates = await prisma.certificate.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      credentialId: true,
      grade: true,
      issuedAt: true,
      course: {
        select: { id: true, title: true, instructorName: true, rating: true },
      },
    },
    orderBy: { issuedAt: "desc" },
  });
  return certificates;
};

export const getSavedCoursesService = async (userId: string) => {
  const savedCourses = await prisma.savedCourse.findMany({
    where: { userId },
    select: {
      id: true,
      createdAt: true,
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          instructorName: true,
          level: true,
          rating: true,
          lessonsCount: true,
          durationMinutes: true,
          _count: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return savedCourses.map((item) => ({
    id: item.id,
    createdAt: item.createdAt,
    course: {
      id: item.course.id,
      title: item.course.title,
      slug: item.course.slug,
      instructorName: item.course.instructorName,
      level: item.course.level,
      rating: item.course.rating,
      lessonsCount: item.course.lessonsCount,
      durationMinutes: item.course.durationMinutes,
      studentCount: item.course._count.enrollments,
    },
  }));
};

export const saveCourseService = async (userId: string, courseId: string) => {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course || !course.published) {
    throw new AppError("Course not found", 404);
  }

  const savedCourse = await prisma.savedCourse.upsert({
    where: {
      userId_courseId: { userId, courseId },
    },
    update: {},
    create: {
      userId,
      courseId,
    },
    select: {
      id: true,
      userId: true,
      courseId: true,
      createdAt: true,
    },
  });

  return savedCourse;
};

export const unsaveCourseService = async (userId: string, courseId: string) => {
  await prisma.savedCourse.deleteMany({
    where: {
      userId,
      courseId,
    },
  });
  return null;
};

export const getCourseClassroomService = async (slug: string) => {
  const course = await prisma.course.findFirst({ where: { slug } });
  if (!course) {
    throw new AppError("Course not found", 404);
  }
};
