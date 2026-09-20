import prisma from "../lib/prisma";
import { EnrollmentStatus } from "@prisma/client";
import { AppError } from "../utils/appError";

export const getStudentDashboardData = async (userId: string) => {
  // Performance ကောင်းမွန်စေရန် Database Queries များကို Parallel (Promise.all) ဖြင့် ခေါ်ယူခြင်း
  const [
    user,
    enrolledCount,
    completedCount,
    certificatesCount,
    inProgressEnrollments,
    completedEnrollmentsWithDuration,
    recommendedCourses,
  ] = await Promise.all([
    // 1. User Profile Data
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true },
    }),

    // 2. Stats: Total Enrolled Courses
    prisma.enrollment.count({
      where: { userId },
    }),

    // 3. Stats: Completed Courses Count
    prisma.enrollment.count({
      where: { userId, status: EnrollmentStatus.COMPLETED },
    }),

    // 4. Stats: Total Certificates Earned
    prisma.certificate.count({
      where: { userId },
    }),

    // 5. Active / In-Progress Enrollments w/ Course Details
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

    // 6. Stats: Total Hours Learned အတွက် Completed Course သီးသန့်ယူခြင်း
    prisma.enrollment.findMany({
      where: { userId, status: EnrollmentStatus.COMPLETED },
      select: {
        course: {
          select: { durationMinutes: true },
        },
      },
    }),

    // 7. Recommended Published Courses (Student Count ပါဝင်ပြီး၊ Enroll မလုပ်ရသေးသော သင်တန်းများ)
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

  // Total Hours Learned တွက်ချက်ခြင်း (Minutes to Hours)
  const totalMinutes = completedEnrollmentsWithDuration.reduce(
    (sum, item) => sum + item.course.durationMinutes,
    0
  );
  const hoursLearned = Number((totalMinutes / 60).toFixed(1));

  // Response Structuring
  return {
    user,
    stats: {
      enrolled: enrolledCount,
      completed: completedCount,
      certificates: certificatesCount,
      hoursLearned,
    },
    inProgressEnrollments,
    recommendedCourses: recommendedCourses.map((course) => ({
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      instructorName: course.instructorName,
      rating: course.rating,
      durationMinutes: course.durationMinutes,
      studentCount: course._count.enrollments,
    })),
  };
};