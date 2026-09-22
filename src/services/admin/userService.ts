import { PAGINATION } from "../../config/constant";
import { Role } from "@prisma/client";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";
import { UpdatedUserRoleInput } from "../../validators/admin/userValidator";
export const getUsersService = async (
  page: number,
  limit: number,
  filters: { role?: Role; q?: string },
) => {
  const safePage = Math.max(1, page || PAGINATION.DEFAULT_PAGE);
  const safeLimit = Math.max(1, limit || PAGINATION.DEFAULT_LIMIT);
  const { role, q } = filters;

  const where = {
    ...(role && { role }),
    ...(q && {
      OR: [
        { name: { contains: q, mode: "insensitive" as const } },
        { email: { contains: q, mode: "insensitive" as const } },
      ],
    }),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (safePage - 1) * safeLimit,
      take: safeLimit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);
  return {
    users,
    pagination: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit) || 1,
    },
  };
};

export const updateUserRoleService = async (
  userId: string,
  data: UpdatedUserRoleInput,
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError("User not found", 404);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return updatedUser;
};
