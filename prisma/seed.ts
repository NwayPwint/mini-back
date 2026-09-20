import {
  Role,
  EnrollmentStatus,
  NotificationType,
  CourseLevel,
} from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../src/config/prisma";

async function main() {
  console.log("Database ထဲသို့ Data များ စတင်ထည့်သွင်းနေပါသည်...");

  // 1. Clean existing data (Delete order is important due to foreign keys)
  await prisma.notification.deleteMany();
  await prisma.notificationPreference.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.savedCourse.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.courseModule.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // 2. Hash default password
  const hashedPassword = await bcrypt.hash("Test11111", 10);

  // 3. Create Users
  const admin = await prisma.user.create({
    data: {
      email: "admin@lms.com",
      password: hashedPassword,
      name: "Main Admin",
      role: Role.ADMIN,
    },
  });

  const student1 = await prisma.user.create({
    data: {
      email: "kyawkyaw@gmail.com",
      password: hashedPassword,
      name: "Kyaw Kyaw",
      role: Role.STUDENT,
    },
  });

  const student2 = await prisma.user.create({
    data: {
      email: "su@gmail.com",
      password: hashedPassword,
      name: "Su Su",
      role: Role.STUDENT,
    },
  });

  // 4. Create Courses with Learning Outcomes, Modules & Lessons
  const course1 = await prisma.course.create({
    data: {
      title: "React & Node.js Masterclass",
      slug: "react-node",
      description: "Learn full-stack web development with React and Node.js.",
      instructorName: "Admin Instructor",
      level: CourseLevel.BEGINNER,
      rating: 4.8,
      lessonsCount: 4,
      durationMinutes: 480,
      published: true,
      createdById: admin.id,
      learningOutcomes: [
        "Build full-stack web applications using React and Node.js",
        "Design scalable RESTful APIs with Express",
        "Implement secure user authentication and authorization",
        "Deploy modern web apps using best industry practices",
      ],
      modules: {
        create: [
          {
            title: "Module 1: React Fundamentals",
            order: 1,
            lessons: {
              create: [
                { title: "Introduction & Component Architecture", durationMinutes: 30, isFreePreview: true, order: 1 },
                { title: "State Management & Hooks", durationMinutes: 45, isFreePreview: false, order: 2 },
              ],
            },
          },
          {
            title: "Module 2: Node.js & Backend Systems",
            order: 2,
            lessons: {
              create: [
                { title: "Express Server Setup & Middleware", durationMinutes: 40, isFreePreview: false, order: 1 },
                { title: "Database Integration with Prisma", durationMinutes: 60, isFreePreview: false, order: 2 },
              ],
            },
          },
        ],
      },
    },
  });

  const course2 = await prisma.course.create({
    data: {
      title: "Python for Data Analysis",
      slug: "python-for-data-analysis",
      description: "Master data manipulation and visual analysis using Python.",
      instructorName: "Admin Instructor",
      level: CourseLevel.INTERMEDIATE,
      rating: 4.9,
      lessonsCount: 4,
      durationMinutes: 360,
      published: true,
      createdById: admin.id,
      learningOutcomes: [
        "Perform complex data analysis using Pandas and NumPy",
        "Create rich interactive visualizations with Matplotlib and Seaborn",
        "Clean, transform, and prepare raw data for machine learning",
        "Automate analytical workflows using Python scripts",
      ],
      modules: {
        create: [
          {
            title: "Module 1: Foundations of Data Analysis",
            order: 1,
            lessons: {
              create: [
                { title: "Python Basics for Data Science", durationMinutes: 25, isFreePreview: true, order: 1 },
                { title: "Data Structures in Pandas", durationMinutes: 35, isFreePreview: false, order: 2 },
              ],
            },
          },
          {
            title: "Module 2: Data Visualization",
            order: 2,
            lessons: {
              create: [
                { title: "Plotting Trends with Matplotlib", durationMinutes: 30, isFreePreview: false, order: 1 },
                { title: "Advanced Dashboard Analysis", durationMinutes: 50, isFreePreview: false, order: 2 },
              ],
            },
          },
        ],
      },
    },
  });

  const course3 = await prisma.course.create({
    data: {
      title: "Financial Risk Management",
      slug: "financial-risk-management",
      description: "Comprehensive guide to financial metrics, risk modeling, and frameworks.",
      instructorName: "Admin Instructor",
      level: CourseLevel.ADVANCED,
      rating: 4.7,
      lessonsCount: 2,
      durationMinutes: 600,
      published: true,
      createdById: admin.id,
      learningOutcomes: [
        "Evaluate credit, market, and operational financial risks",
        "Apply quantitative modeling techniques for risk analysis",
        "Comply with global financial regulatory compliance standards",
      ],
      modules: {
        create: [
          {
            title: "Module 1: Introduction to Financial Risk",
            order: 1,
            lessons: {
              create: [
                { title: "Risk Frameworks & Governance", durationMinutes: 40, isFreePreview: true, order: 1 },
                { title: "Value at Risk (VaR) Calculations", durationMinutes: 60, isFreePreview: false, order: 2 },
              ],
            },
          },
        ],
      },
    },
  });

  const course4 = await prisma.course.create({
    data: {
      title: "Web Development Fundamentals",
      slug: "web-development-fundamentals",
      description: "Build strong HTML, CSS, and core JavaScript foundations.",
      instructorName: "Admin Instructor",
      level: CourseLevel.BEGINNER,
      rating: 4.8,
      lessonsCount: 2,
      durationMinutes: 720,
      published: true,
      createdById: admin.id,
      learningOutcomes: [
        "Structure web pages using semantic HTML5",
        "Style user interfaces cleanly with CSS3 Flexbox and Grid",
        "Write interactive client-side JavaScript code",
      ],
      modules: {
        create: [
          {
            title: "Module 1: HTML & CSS Core",
            order: 1,
            lessons: {
              create: [
                { title: "Semantic Tags & Layout Design", durationMinutes: 30, isFreePreview: true, order: 1 },
                { title: "Responsive Web Design Techniques", durationMinutes: 45, isFreePreview: false, order: 2 },
              ],
            },
          },
        ],
      },
    },
  });

  const course5 = await prisma.course.create({
    data: {
      title: "Business Communication Skills",
      slug: "business-communication-skills",
      description: "Enhance corporate presentation, emailing, and negotiation skills.",
      instructorName: "Admin Instructor",
      level: CourseLevel.BEGINNER,
      rating: 4.6,
      lessonsCount: 2,
      durationMinutes: 240,
      published: true,
      createdById: admin.id,
      learningOutcomes: [
        "Structure clear and professional corporate emails",
        "Deliver impactful business presentations to stakeholders",
      ],
      modules: {
        create: [
          {
            title: "Module 1: Professional Writing & Presentations",
            order: 1,
            lessons: {
              create: [
                { title: "Corporate Email Etiquette", durationMinutes: 20, isFreePreview: true, order: 1 },
                { title: "Effective Presentation Techniques", durationMinutes: 30, isFreePreview: false, order: 2 },
              ],
            },
          },
        ],
      },
    },
  });

  const course6 = await prisma.course.create({
    data: {
      title: "English for Professional Settings",
      slug: "english-for-professional-settings",
      description: "Practical professional English usage for international business environments.",
      instructorName: "Admin Instructor",
      level: CourseLevel.INTERMEDIATE,
      rating: 4.7,
      lessonsCount: 2,
      durationMinutes: 480,
      published: true,
      createdById: admin.id,
      learningOutcomes: [
        "Master business vocabulary for workplace interactions",
        "Participate effectively in international business meetings",
      ],
      modules: {
        create: [
          {
            title: "Module 1: Workplace English Essentials",
            order: 1,
            lessons: {
              create: [
                { title: "Meeting Vocabulary & Phrases", durationMinutes: 25, isFreePreview: true, order: 1 },
                { title: "Negotiation Dynamics", durationMinutes: 35, isFreePreview: false, order: 2 },
              ],
            },
          },
        ],
      },
    },
  });

  const course7 = await prisma.course.create({
    data: {
      title: "Compliance & Regulatory Frameworks",
      slug: "compliance-regulatory-frameworks",
      description: "Understand legal risk, corporate governance, and regulatory standards.",
      instructorName: "Admin Instructor",
      level: CourseLevel.ADVANCED,
      rating: 4.8,
      lessonsCount: 2,
      durationMinutes: 360,
      published: true,
      createdById: admin.id,
      learningOutcomes: [
        "Identify key legal risks in corporate environments",
        "Implement governance and anti-money laundering (AML) controls",
      ],
      modules: {
        create: [
          {
            title: "Module 1: Corporate Compliance",
            order: 1,
            lessons: {
              create: [
                { title: "Corporate Legal Responsibilities", durationMinutes: 30, isFreePreview: true, order: 1 },
                { title: "Audit & Internal Reporting", durationMinutes: 40, isFreePreview: false, order: 2 },
              ],
            },
          },
        ],
      },
    },
  });

  const course8 = await prisma.course.create({
    data: {
      title: "Electrical Systems Maintenance",
      slug: "electrical-systems-maintenance",
      description: "Hands-on guide to maintaining safety standards and core electrical gear.",
      instructorName: "Admin Instructor",
      level: CourseLevel.BEGINNER,
      rating: 4.5,
      lessonsCount: 2,
      durationMinutes: 600,
      published: true,
      createdById: admin.id,
      learningOutcomes: [
        "Understand electrical safety rules and standards",
        "Perform routine preventive maintenance on machinery",
        "Troubleshoot electrical circuitry problems efficiently",
      ],
      modules: {
        create: [
          {
            title: "Module 1: Safety & Maintenance Basics",
            order: 1,
            lessons: {
              create: [
                { title: "Electrical Gear Safety Protocols", durationMinutes: 20, isFreePreview: true, order: 1 },
                { title: "Circuit Testing & Diagnostics", durationMinutes: 40, isFreePreview: false, order: 2 },
              ],
            },
          },
        ],
      },
    },
  });

  // 5. Create Enrollments
  await prisma.enrollment.create({
    data: {
      userId: student1.id,
      courseId: course1.id,
      progress: 45.0,
      status: EnrollmentStatus.ACTIVE,
    },
  });

  await prisma.enrollment.create({
    data: {
      userId: student2.id,
      courseId: course2.id,
      progress: 100.0,
      status: EnrollmentStatus.COMPLETED,
    },
  });

  // 6. Create Saved Course & Certificate
  await prisma.savedCourse.create({
    data: {
      userId: student1.id,
      courseId: course2.id,
    },
  });

  await prisma.certificate.create({
    data: {
      userId: student2.id,
      courseId: course2.id,
      grade: "A+",
    },
  });

  // 7. Seed Notification Preferences
  await prisma.notificationPreference.createMany({
    data: [
      {
        userId: student1.id,
        weeklyDigest: true,
        courseReminders: true,
        announcements: true,
        certificateAlerts: true,
      },
      {
        userId: student2.id,
        weeklyDigest: false,
        courseReminders: true,
        announcements: false,
        certificateAlerts: true,
      },
    ],
  });

  // 8. Seed Sample Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: student1.id,
        type: NotificationType.COURSE_REMINDER,
        title: "Continue learning React & Node.js Masterclass",
        message: "You are 45% through your course. Keep up the good work!",
        link: `/courses/${course1.id}`,
        isRead: false,
      },
      {
        userId: student1.id,
        type: NotificationType.ANNOUNCEMENT,
        title: "Welcome to Mahar Pyinnyar Bank LMS!",
        message: "Explore our wide range of courses and boost your skills.",
        link: "/courses",
        isRead: true,
      },
      {
        userId: student2.id,
        type: NotificationType.CERTIFICATE,
        title: "Congratulations! Certificate Issued",
        message: "You completed Python for Data Analysis with Grade A+.",
        link: `/certificates/${course2.id}`,
        isRead: false,
      },
      {
        userId: student2.id,
        type: NotificationType.WEEKLY_DIGEST,
        title: "Your Weekly Learning Summary",
        message: "You spent 4 hours learning this week. Great achievement!",
        link: "/dashboard",
        isRead: true,
      },
    ],
  });

  console.log("Data များ အောင်မြင်စွာ ထည့်သွင်းပြီးပါပြီ။");
}

main()
  .catch((e) => {
    console.error("Error တက်သွားပါသည် - ", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });