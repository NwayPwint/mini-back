import { EnrollmentStatus, Role } from "@prisma/client";
import prisma from "../../config/prisma";

export const getAdminDashboardStatsService = async () => {
  const [
    totalStudents,
    activeCourses,
    activeEnrollments,
    completedEnrollments,
    certificatesIssued,
    topCourses,
    recentEnrollments,
  ] = await Promise.all([
    prisma.user.count({
      where: { role: Role.STUDENT },
    }),

    prisma.course.count({
      where: { published: true, deletedAt: null },
    }),

    prisma.enrollment.count({
      where: { status: EnrollmentStatus.ACTIVE },
    }),

    prisma.enrollment.count({
      where: { status: EnrollmentStatus.COMPLETED },
    }),

    prisma.certificate.count(),

    prisma.course.findMany({
      where: { published: true, deletedAt: null },
      take: 5,
      orderBy: {
        enrollments: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        title: true,
        _count: {
          select: { enrollments: true },
        },
      },
    }),

    prisma.enrollment.findMany({
      take: 5,
      orderBy: { enrolledAt: "desc" },
      select: {
        id: true,
        status: true,
        enrolledAt: true,
        user: { select: { name: true, email: true } },
        course: { select: { title: true, slug: true } },
      },
    }),
  ]);

  return {
    totalStudents,
    activeCourses,
    activeEnrollments,
    completedEnrollments,
    certificatesIssued,
    topCourses,
    recentEnrollments,
  };
};

export const getRecentActivitesService = async ()=>{
  
}
