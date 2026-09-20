import { EnrollmentStatus } from "@prisma/client";
interface GetMyCoursesParams {
    userId: string;
    status?: EnrollmentStatus;
    q?: string;
}
export declare const getStudentDashboardService: (userId: string) => Promise<{
    user: {
        email: string;
        id: string;
        name: string | null;
        role: import(".prisma/client").$Enums.Role;
        weeklyTargetHours: number;
    };
    stats: {
        enrolled: number;
        completed: number;
        certificates: number;
        hoursLearned: number;
        weeklyTargetHours: number;
    };
    inProgressEnrollments: {
        course: {
            durationMinutes: number;
            id: string;
            instructorName: string;
            lessonsCount: number;
            slug: string;
            title: string;
        };
        enrolledAt: Date;
        id: string;
        progress: number;
        status: import(".prisma/client").$Enums.EnrollmentStatus;
    }[];
    recommendedCourses: {
        id: string;
        title: string;
        slug: string;
        description: string | null;
        instructorName: string;
        level: import(".prisma/client").$Enums.CourseLevel;
        lessonsCount: number;
        rating: number;
        durationMinutes: number;
        studentCount: number;
    }[];
}>;
export declare const getMyCoursesService: ({ userId, status, q, }: GetMyCoursesParams) => Promise<{
    id: string;
    progress: number;
    status: import(".prisma/client").$Enums.EnrollmentStatus;
    enrolledAt: Date;
    completedAt: Date | null;
    course: {
        id: string;
        title: string;
        slug: string;
        instructorName: string;
        level: import(".prisma/client").$Enums.CourseLevel;
        rating: number;
        lessonsCount: number;
        durationMinutes: number;
        studentCount: number;
    };
}[]>;
export declare const getCertificatesService: (userId: string) => Promise<{
    course: {
        id: string;
        instructorName: string;
        rating: number;
        title: string;
    };
    credentialId: string;
    grade: string | null;
    id: string;
    issuedAt: Date;
}[]>;
export declare const getSavedCoursesService: (userId: string) => Promise<{
    id: string;
    createdAt: Date;
    course: {
        id: string;
        title: string;
        slug: string;
        instructorName: string;
        level: import(".prisma/client").$Enums.CourseLevel;
        rating: number;
        lessonsCount: number;
        durationMinutes: number;
        studentCount: number;
    };
}[]>;
export declare const saveCourseService: (userId: string, courseId: string) => Promise<{
    courseId: string;
    createdAt: Date;
    id: string;
    userId: string;
}>;
export declare const unsaveCourseService: (userId: string, courseId: string) => Promise<null>;
export {};
//# sourceMappingURL=studentService.d.ts.map