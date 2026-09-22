"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsaveCourseService = exports.saveCourseService = exports.getSavedCoursesService = exports.getCertificatesService = exports.getMyCoursesService = exports.getStudentDashboardService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../config/prisma"));
const appError_1 = require("../utils/appError");
const getStudentDashboardService = async (userId) => {
    const [user, enrolledCount, completedCount, certificatesCount, inProgressEnrollments, completedEnrollmentsWithDuration, recommendedCourses,] = await Promise.all([
        prisma_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                weeklyTargetHours: true,
            },
        }),
        prisma_1.default.enrollment.count({
            where: { userId },
        }),
        prisma_1.default.enrollment.count({
            where: { userId, status: client_1.EnrollmentStatus.COMPLETED },
        }),
        prisma_1.default.certificate.count({
            where: { userId },
        }),
        prisma_1.default.enrollment.findMany({
            where: { userId, status: client_1.EnrollmentStatus.ACTIVE },
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
        prisma_1.default.enrollment.findMany({
            where: { userId, status: client_1.EnrollmentStatus.COMPLETED },
            select: {
                course: {
                    select: { durationMinutes: true },
                },
            },
        }),
        prisma_1.default.course.findMany({
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
        throw new appError_1.AppError("Student profile not found", 404);
    }
    const totalMinutes = completedEnrollmentsWithDuration.reduce((sum, item) => sum + item.course.durationMinutes, 0);
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
exports.getStudentDashboardService = getStudentDashboardService;
const getMyCoursesService = async ({ userId, status, q, }) => {
    const enrollments = await prisma_1.default.enrollment.findMany({
        where: {
            userId,
            ...(status && { status }),
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
exports.getMyCoursesService = getMyCoursesService;
const getCertificatesService = async (userId) => {
    const certificates = await prisma_1.default.certificate.findMany({
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
exports.getCertificatesService = getCertificatesService;
const getSavedCoursesService = async (userId) => {
    const savedCourses = await prisma_1.default.savedCourse.findMany({
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
exports.getSavedCoursesService = getSavedCoursesService;
const saveCourseService = async (userId, courseId) => {
    const course = await prisma_1.default.course.findFirst({ where: { id: courseId } });
    if (!course || !course.published) {
        throw new appError_1.AppError("Course not found", 404);
    }
    const savedCourse = await prisma_1.default.savedCourse.upsert({
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
exports.saveCourseService = saveCourseService;
const unsaveCourseService = async (userId, courseId) => {
    await prisma_1.default.savedCourse.deleteMany({
        where: {
            userId,
            courseId,
        },
    });
    return null;
};
exports.unsaveCourseService = unsaveCourseService;
//# sourceMappingURL=studentService.js.map